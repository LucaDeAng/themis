# 🚂 Railway Deployment Configuration

This document explains how to properly configure the Themis API on Railway to work with a Vercel-hosted frontend.

## Prerequisites

1. Railway account (https://railway.app)
2. Supabase account with database created (https://supabase.com)
3. GitHub repository with Themis code

## Step-by-Step Deployment

### 1. Create New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your Themis repository
5. Railway will detect the `railway.toml` configuration

### 2. Configure Service Settings

1. **Root Directory:** `apps/api`
2. **Build Command:** (auto-detected from `railway.toml`)
3. **Start Command:** (auto-detected from `railway.toml`)

### 3. Set Environment Variables

Click on "Variables" tab and add the following:

#### Required Variables:

```bash
# Database Connection (IMPORTANT: Use Supabase, not Railway's PostgreSQL)
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Node Environment
NODE_ENV=production

# Port (Railway will inject this automatically, but you can override)
PORT=4000
```

#### Optional but Recommended:

```bash
# CORS Configuration
# Add your actual Vercel domain here
CORS_ORIGIN=https://yourapp.vercel.app,https://*.vercel.app,http://localhost:3000

# AI Providers (if using AI features)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=openai

# Feature flags
THEMIS_MAX_INITIATIVES=500
THEMIS_BRIEF_MAX_TOKENS=1200
```

### 4. Get Your Supabase Connection String

1. Go to https://app.supabase.com
2. Select your project
3. Click Settings (gear icon) → Database
4. Scroll to "Connection string" section
5. Select "URI" tab
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password

Example:
```
postgresql://postgres:MySecurePass123@db.abcdefgh.supabase.co:5432/postgres
```

### 5. Enable PostgreSQL Extensions in Supabase

Before running migrations, enable required extensions:

1. In Supabase, go to SQL Editor
2. Create a new query
3. Run this SQL:

```sql
-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('vector', 'uuid-ossp');
```

### 6. Deploy the API

1. Railway will automatically deploy after you set up the variables
2. Wait for the build to complete (2-3 minutes)
3. Check the logs for:
   ```
   🔍 Using database URL: Supabase ✅ (SUPABASE_DATABASE_URL)
   ✅ Database connected
   🚀 Themis API is running on: http://0.0.0.0:4000
   ```

### 7. Get Your API URL

1. In Railway, click on your service
2. Go to "Settings" tab
3. Scroll to "Domains" section
4. Copy the generated domain (e.g., `themis-production.up.railway.app`)
5. Your API URL will be: `https://themis-production.up.railway.app/api`

**Note:** The `/api` suffix is important!

### 8. Configure Frontend to Use API

In your Vercel deployment (frontend):

1. Go to Project Settings → Environment Variables
2. Add or update:
   ```
   NEXT_PUBLIC_API_URL=https://themis-production.up.railway.app/api
   ```
3. Redeploy the frontend

## Troubleshooting

### CORS Errors

**Problem:** Frontend shows CORS error in browser console

**Solutions:**

1. **Check API Logs for CORS Messages:**
   - Look for: `⚠️ CORS blocked origin: https://yourapp.vercel.app`
   - This tells you which origin was blocked

2. **Option A - Use Wildcards (Recommended):**
   The API defaults to allowing all Vercel apps. This should work automatically.

3. **Option B - Specify Exact Origins:**
   Set the `CORS_ORIGIN` variable in Railway:
   ```
   CORS_ORIGIN=https://yourapp.vercel.app,https://yourapp-git-main.vercel.app,http://localhost:3000
   ```

4. **Verify and Redeploy:**
   - After changing variables, Railway will automatically redeploy
   - Wait for deployment to complete
   - Test again

### Database Connection Issues

**Problem:** API logs show database connection errors

**Check these:**

1. **Is SUPABASE_DATABASE_URL set correctly?**
   - Go to Railway → Variables
   - Verify the connection string
   - Make sure password is correct

2. **Are Supabase extensions enabled?**
   - Run the SQL commands from step 5 above

3. **Can Railway reach Supabase?**
   - Supabase allows connections from anywhere by default
   - No firewall configuration needed

4. **Are migrations applied?**
   - Check Railway logs for migration output
   - Look for: "Migration ... applied successfully"

### Migrations Not Running

**Problem:** Tables don't exist in database

**Solution:**

The `railway.toml` should run migrations automatically:
```toml
startCommand = "sh -c 'DATABASE_URL=$SUPABASE_DATABASE_URL npx prisma migrate deploy && node dist/main.js'"
```

If migrations aren't running:

1. Check Railway build logs for errors
2. Manually run migrations:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link to your project
   railway link
   
   # Run migrations
   railway run npx prisma migrate deploy
   ```

### API Not Starting

**Problem:** Service crashes or won't start

**Check:**

1. **Build logs:** Look for compilation errors
2. **Runtime logs:** Check for startup errors
3. **Environment variables:** Ensure all required vars are set
4. **Package.json:** Verify start script is correct

## Environment Variables Reference

### Required
- `SUPABASE_DATABASE_URL` - Supabase PostgreSQL connection string

### Optional
- `CORS_ORIGIN` - Comma-separated allowed origins (defaults to wildcards)
- `NODE_ENV` - Set to "production"
- `PORT` - API port (default: 4000, Railway auto-injects)
- `OPENAI_API_KEY` - For AI features
- `ANTHROPIC_API_KEY` - For AI features
- `LLM_PROVIDER` - AI provider (openai/anthropic/ollama)

### Feature Flags
- `THEMIS_MAX_INITIATIVES` - Max initiatives per project
- `THEMIS_MAX_CRITERIA` - Max criteria per project
- `THEMIS_BRIEF_MAX_TOKENS` - Max tokens for brief generation

## Testing the Deployment

### 1. Test API Health Endpoint

```bash
curl https://your-api.up.railway.app/api/health
```

Expected response:
```json
{"status":"ok"}
```

### 2. Test API Documentation

Open in browser:
```
https://your-api.up.railway.app/api/docs
```

You should see Swagger API documentation.

### 3. Test from Frontend

1. Deploy frontend to Vercel with correct `NEXT_PUBLIC_API_URL`
2. Open frontend in browser
3. Open browser DevTools → Network tab
4. Try creating a project or workspace
5. Verify API requests succeed (status 200 or 201)

## Cost Estimates

Railway Pricing:
- **Hobby Plan:** $5/month credit (enough for small projects)
- **Pro Plan:** $20/month usage-based
- **Estimate:** API with moderate traffic ≈ $5-10/month

Supabase Pricing:
- **Free Tier:** Up to 500MB database, unlimited API requests
- **Pro Plan:** $25/month for larger databases
- **Estimate:** Free tier sufficient for development/small production

## Monitoring and Logs

### View Logs in Railway:

1. Click on your service
2. Click "Deployments"
3. Click on the active deployment
4. View real-time logs

### What to Look For:

**Successful startup:**
```
🔍 Using database URL: Supabase ✅
✅ Database connected
🚀 Themis API is running on: http://0.0.0.0:4000
📚 API Documentation: http://0.0.0.0:4000/api/docs
✨ Gen AI Engine Ready!
```

**CORS issues:**
```
⚠️ CORS blocked origin: https://yourapp.vercel.app
   Allowed patterns: http://localhost:3000, https://*.vercel.app
```

**Database issues:**
```
❌ No database URL configured
```
or
```
Error: P1001: Can't reach database server
```

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)

## Need Help?

Check the main troubleshooting guide: `DEPLOYMENT_TROUBLESHOOTING.md`
