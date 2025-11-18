# 🔧 Vercel API Deployment Guide

## Important: Vercel Serverless Limitations

When deploying the Themis API to Vercel, you need to understand that Vercel uses **serverless functions**, which have different characteristics than traditional server deployments:

1. **Cold Starts**: Functions sleep when not in use and wake up on request (adds latency)
2. **Execution Time Limits**: 10 seconds (Hobby), 60 seconds (Pro)
3. **Memory Limits**: Limited memory compared to dedicated servers
4. **Database Connections**: Connection pooling is critical for serverless

## Recommended: Use Railway for API, Vercel for Frontend

**For the best experience**, we recommend:
- ✅ **Deploy API to Railway** (always-on server, better for NestJS)
- ✅ **Deploy Frontend to Vercel** (optimized for Next.js)

However, if you must deploy the API to Vercel, follow these steps:

## Prerequisites

1. Vercel account (https://vercel.com)
2. Supabase account with database created (https://supabase.com)
3. GitHub repository with Themis code

## Step 1: Configure Supabase for Connection Pooling

Vercel serverless functions require connection pooling:

1. Go to Supabase Dashboard → Settings → Database
2. Find the **Connection Pooling** section
3. Enable **Session Mode** or **Transaction Mode**
4. Copy the **pooled connection string** (port 6543)
5. It should look like: `postgres://postgres.[project-id]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

## Step 2: Deploy API to Vercel

### Option A: Via Vercel CLI

```bash
cd apps/api
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your repository
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
   - **Output Directory**: `dist`

## Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables:

### Required Variables:

```bash
# Database (USE POOLED CONNECTION from Supabase)
DATABASE_URL=postgres://postgres.[project]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Alternative: Use SUPABASE_DATABASE_URL
SUPABASE_DATABASE_URL=postgres://postgres.[project]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Node Environment
NODE_ENV=production

# CORS (Optional - defaults to allowing all Vercel domains)
CORS_ORIGIN=https://your-frontend.vercel.app,https://*.vercel.app
```

### Optional Variables:

```bash
# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=openai
```

**Important Notes:**
- ⚠️ **Always use the POOLED connection string** (port 6543) for Vercel deployments
- ⚠️ The non-pooled connection (port 5432) will cause "too many connections" errors in serverless
- ✅ Make sure to set variables for all environments (Production, Preview, Development)

## Step 4: Configure Frontend

In your Vercel frontend deployment, set:

```bash
NEXT_PUBLIC_API_URL=https://your-api.vercel.app/api
```

Note: The URL must end with `/api`

## Step 5: Deploy and Verify

1. Push changes to trigger deployment
2. Check deployment logs for errors
3. Visit `https://your-api.vercel.app/api/health`
4. Should return: `{"status":"ok", ...}`
5. Visit frontend diagnostics: `https://your-frontend.vercel.app/diagnostics`

## Troubleshooting

### Issue: CORS Errors

**Symptom:**
```
Access to XMLHttpRequest at 'https://api.vercel.app/api/...' has been blocked by CORS policy
```

**Solutions:**

1. **Check if API is returning 500 errors:**
   - Open browser DevTools → Network tab
   - If you see 500 error, the API is crashing before CORS can be applied
   - Check Vercel function logs for the actual error

2. **Verify CORS configuration:**
   - The `vercel.json` now includes CORS headers at the CDN level
   - This ensures CORS headers are present even on errors
   - No additional configuration should be needed

3. **If still blocked:**
   - Set `CORS_ORIGIN` environment variable explicitly:
     ```
     CORS_ORIGIN=https://your-frontend.vercel.app,https://*.vercel.app
     ```

### Issue: Database Connection Errors

**Symptom:**
```
Error: P1001: Can't reach database server
or
Too many connections
```

**Solutions:**

1. **Use connection pooling** (most common fix):
   - Switch to Supabase pooled connection string (port 6543)
   - Example: `postgres://...@...pooler.supabase.com:6543/postgres`

2. **Check Supabase connection limit:**
   - Free tier: 60 connections
   - If exceeded, upgrade or use connection pooling

3. **Optimize Prisma client:**
   - In `prisma.service.ts`, connection pooling is already configured
   - Vercel serverless reuses connections between invocations

### Issue: 500 Internal Server Error

**Symptom:**
```
GET /api/projects 500 (Internal Server Error)
```

**Solutions:**

1. **Check Vercel function logs:**
   - Go to Vercel Dashboard → Deployments → Click deployment → View Function Logs
   - Look for actual error message

2. **Common causes:**
   - Missing environment variables (DATABASE_URL)
   - Database connection failure
   - Missing Prisma client generation
   - Module not found errors

3. **Verify build:**
   - Check deployment logs for build errors
   - Make sure `npx prisma generate` ran successfully
   - Verify all dependencies installed correctly

### Issue: Cold Start Delays

**Symptom:**
First request after idle period is very slow (5-10 seconds)

**Solutions:**

1. **Accept it as normal** for serverless (can't fully eliminate)
2. **Upgrade to Vercel Pro** (faster cold starts)
3. **Consider Railway** for API deployment (no cold starts)
4. **Use Edge Functions** if supported by your database

### Issue: Timeout Errors

**Symptom:**
```
FUNCTION_INVOCATION_TIMEOUT
```

**Solutions:**

1. **Optimize database queries** (add indexes)
2. **Reduce AI generation token limits**
3. **Upgrade Vercel plan** (60s timeout on Pro vs 10s on Hobby)
4. **Use Railway** for API (no timeout limits)

## Performance Comparison

| Feature | Railway (Recommended) | Vercel Serverless |
|---------|----------------------|-------------------|
| Cold Starts | ❌ None | ⚠️ 1-5 seconds |
| Execution Time | ✅ Unlimited | ⚠️ 10-60 seconds |
| Memory | ✅ Configurable | ⚠️ Limited |
| Database Connections | ✅ Direct | ⚠️ Requires pooling |
| Cost | $5-10/month | Free-$20/month |
| Best For | APIs, long-running tasks | Static sites, edge functions |

## Recommended Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       v                 v
┌─────────────┐   ┌──────────────┐
│  Frontend   │   │     API      │
│  (Vercel)   │   │  (Railway)   │
│  Next.js    │   │   NestJS     │
└─────────────┘   └──────┬───────┘
                         │
                         v
                  ┌─────────────┐
                  │  Database   │
                  │ (Supabase)  │
                  │ PostgreSQL  │
                  └─────────────┘
```

## Migration from Vercel to Railway (API)

If you deployed the API to Vercel and want to move to Railway:

1. **Create Railway project:**
   ```bash
   railway login
   railway init
   railway add
   ```

2. **Link repository:**
   - Connect GitHub repository
   - Set root directory to `apps/api`

3. **Set environment variables:**
   - Use direct Supabase connection (port 5432)
   - Copy all other environment variables from Vercel

4. **Deploy:**
   - Railway will auto-deploy on git push
   - Get Railway URL: `https://yourapp.up.railway.app`

5. **Update frontend:**
   - Change `NEXT_PUBLIC_API_URL` in Vercel to Railway URL
   - Redeploy frontend

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Pooling**: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- **Troubleshooting Guide**: [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)

---

**Recommendation**: For production deployments, we strongly recommend using Railway for the API and Vercel for the frontend. This provides the best performance and reliability.
