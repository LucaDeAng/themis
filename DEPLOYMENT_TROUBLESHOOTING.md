# 🔧 Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. CORS Policy Errors

**Error Message:**
```
Access to XMLHttpRequest at 'https://your-api.railway.app/api/...' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Cause:** 
The API is not configured to accept requests from your frontend domain.

**Solution:**

#### Option A: Use the default wildcard patterns (Recommended)
The API supports wildcards by default:
- `https://*.vercel.app` - All Vercel deployments
- `https://*.railway.app` - All Railway deployments
- `https://*.up.railway.app` - Railway production domains
- `http://localhost:3000` - Local development

These should work automatically without configuration.

#### Option B: Configure specific origins
If you need specific origins or the wildcards aren't working, set the `CORS_ORIGIN` environment variable in your API deployment:

**On Railway:**
```bash
railway variables set CORS_ORIGIN="https://yourapp.vercel.app,https://yourapp-preview.vercel.app,http://localhost:3000"
```

**On Vercel (for API):**
Go to Project Settings → Environment Variables → Add:
```
CORS_ORIGIN=https://yourapp.vercel.app,https://yourapp-preview.vercel.app,http://localhost:3000
```

**Important:** 
- Use comma-separated values (no spaces around commas)
- Include `http://localhost:3000` for local development
- Wildcards are supported: `https://*.vercel.app`

#### Verifying CORS is working:

Check your API logs for these messages:
- `✅` means CORS allowed the request
- `⚠️ CORS blocked origin: https://...` means the origin was rejected

If you see blocked origins, check:
1. The origin URL in the error message
2. Your CORS_ORIGIN configuration
3. Make sure there are no typos in the URL

---

### 2. Database Connection Issues

**Error Message:**
```
❌ No database URL configured
```
or
```
Error: P1001: Can't reach database server
```

**Cause:**
The API cannot connect to the database, or the wrong database URL is being used.

**Solutions:**

#### For Railway Deployment:

Railway automatically injects a `DATABASE_URL` variable. If you want to use Supabase instead:

1. In Railway, go to your API service → Variables
2. Add a new variable:
   ```
   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. The API will prioritize `SUPABASE_DATABASE_URL` over Railway's `DATABASE_URL`

**Get your Supabase connection string:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your actual database password

#### For Vercel Deployment:

Vercel doesn't inject database URLs automatically. You must set them:

1. Go to Project Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
   OR
   ```
   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

#### Verifying Database Connection:

Check your API logs on startup. You should see:
```
🔍 Using database URL: Supabase ✅ (SUPABASE_DATABASE_URL)
✅ Database connected
```

If you see errors:
- Check the connection string format
- Verify your database password is correct
- Ensure your database allows connections from your deployment platform's IP ranges
- For Supabase: Check Settings → Database → Connection pooler

---

### 3. Environment Variables Not Loading

**Symptom:**
API behaves like environment variables are not set, even though you configured them.

**Solution:**

1. **Redeploy after setting variables:**
   - Railway: Redeploy is automatic after setting variables
   - Vercel: Go to Deployments → Click "..." → Redeploy

2. **Check variable names:**
   - Variable names are case-sensitive
   - `NEXT_PUBLIC_` prefix is required for frontend variables in Next.js
   - Backend variables don't need any prefix

3. **Scope (Vercel):**
   - Make sure variables are set for the correct environment:
     - Production
     - Preview
     - Development

---

### 4. Frontend Can't Connect to API

**Error in browser console:**
```
Failed to fetch
Network request failed
```

**Solution:**

1. **Check API URL configuration:**
   
   In your Vercel frontend deployment:
   - Go to Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Example: `https://themis-production.up.railway.app/api`
   
   **Important:** The URL must end with `/api` (the API prefix)

2. **Verify API is running:**
   - Visit `https://your-api-url.railway.app/api/docs`
   - You should see Swagger API documentation
   - If not, check Railway/Vercel logs for startup errors

3. **Check for mixed content errors:**
   - If frontend is HTTPS, API must also be HTTPS
   - Railway provides HTTPS automatically
   - Don't use `http://` URLs in production

---

### 5. Database Migrations Not Applied

**Error:**
```
Invalid `prisma.project.findMany()` invocation:
Table 'public.projects' does not exist
```

**Cause:**
Database schema not created or migrations not run.

**Solution:**

#### For Railway:

Railway runs migrations automatically on deployment via the `railway.toml`:
```toml
[deploy]
startCommand = "sh -c 'DATABASE_URL=$SUPABASE_DATABASE_URL npx prisma migrate deploy && node dist/main.js'"
```

If this fails:
1. Check Railway logs for migration errors
2. Manually run migrations via Railway CLI:
   ```bash
   railway run npx prisma migrate deploy
   ```

#### For Vercel:

Vercel doesn't automatically run migrations. You need to:

1. Run migrations from your local machine:
   ```bash
   DATABASE_URL="your-production-db-url" npx prisma migrate deploy
   ```

2. Or use a separate deployment step/CI pipeline

#### For Supabase:

1. Enable required extensions in Supabase SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. Then run migrations

---

## Quick Checklist

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` set correctly (must end with `/api`)
- [ ] Deployed after setting environment variables
- [ ] Can access the API URL from browser

### Backend (Railway)
- [ ] `SUPABASE_DATABASE_URL` or `DATABASE_URL` set
- [ ] `CORS_ORIGIN` set (optional if using wildcards)
- [ ] OpenAI/Anthropic API keys set (if using AI features)
- [ ] Migrations ran successfully (check logs)
- [ ] Can access `/api/docs` endpoint

### Database (Supabase)
- [ ] Project created and running
- [ ] `vector` extension enabled
- [ ] `uuid-ossp` extension enabled
- [ ] Connection string has correct password
- [ ] IP restrictions allow your deployment platform

---

## Getting Help

If you're still having issues:

1. **Check the logs:**
   - Railway: Click on deployment → View logs
   - Vercel: Go to Deployments → Click deployment → Function logs
   - Supabase: Go to Logs & Monitoring

2. **Test API directly:**
   ```bash
   curl https://your-api-url.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

3. **Test database connection:**
   Check Railway/Vercel logs on startup for:
   ```
   🔍 Using database URL: ...
   ✅ Database connected
   ```

4. **Common log messages:**
   - `⚠️ CORS blocked origin: ...` - Add origin to CORS_ORIGIN
   - `❌ No database URL configured` - Set DATABASE_URL or SUPABASE_DATABASE_URL
   - `P1001: Can't reach database` - Check database URL and credentials
   - `Table does not exist` - Run migrations

---

## Contact & Resources

- **Documentation:** See README.md and other .md files in repository
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
