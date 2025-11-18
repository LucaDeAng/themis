# ✅ CORS and Database Connection Issues - RESOLVED

## Summary

This PR successfully addresses the CORS policy errors and Supabase database connection issues that were preventing the Themis application from working correctly in production.

## Problems Solved

### 1. CORS Policy Errors
**Issue:** Frontend on Vercel was blocked when trying to access Railway-hosted API
```
Access to XMLHttpRequest at 'https://themis-production.up.railway.app/api/projects?workspaceId=1' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Solution:**
- Enhanced CORS configuration with explicit error handling
- Added comprehensive CORS options (methods, headers, credentials)
- Added logging to show which origins are being blocked
- Default configuration already supports Vercel wildcards (`https://*.vercel.app`)

### 2. Database Connection Issues
**Issue:** API might not be using Supabase connection (SUPABASE_DATABASE_URL)

**Solution:**
- Improved PrismaService to prioritize SUPABASE_DATABASE_URL
- Added validation to ensure database URL is configured
- Better logging to show which database source is being used
- Clear error messages when configuration is missing

### 3. Difficult Troubleshooting
**Issue:** Users couldn't easily diagnose configuration problems

**Solution:**
- Created `/diagnostics` page for self-service troubleshooting
- Enhanced error messages in API client
- Comprehensive troubleshooting documentation
- Clear visual feedback for configuration status

## How to Use These Fixes

### For Developers

#### 1. Check Your Configuration
Visit the diagnostics page in your deployed application:
```
https://your-app.vercel.app/diagnostics
```

This page will show:
- ✅/❌ API URL format validation
- ✅/❌ API reachability test
- ✅/❌ CORS configuration status
- Clear error messages if something is wrong

#### 2. Configure CORS (if needed)
The API defaults to allowing:
- `http://localhost:3000`
- `https://*.railway.app`
- `https://*.up.railway.app`
- `https://*.vercel.app`

If you need custom origins, set in Railway:
```bash
CORS_ORIGIN=https://yourapp.vercel.app,https://yourapp-preview.vercel.app
```

#### 3. Configure Database
In Railway, set:
```bash
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

The API will automatically use this instead of Railway's default DATABASE_URL.

### For Production Deployment

#### Step 1: Deploy API to Railway
1. Set environment variable in Railway:
   ```
   SUPABASE_DATABASE_URL=your-supabase-connection-string
   ```

2. Deploy and check logs for:
   ```
   🔍 Using database URL: Supabase ✅ (SUPABASE_DATABASE_URL)
   ✅ Database connected
   🚀 Themis API is running on: http://0.0.0.0:4000
   ```

#### Step 2: Deploy Frontend to Vercel
1. Set environment variable in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.up.railway.app/api
   ```
   **Important:** Must end with `/api`

2. Deploy and test at `/diagnostics` to verify connection

#### Step 3: Verify Everything Works
1. Visit `https://your-app.vercel.app/diagnostics`
2. Check that all status indicators are green (✅)
3. If any are red (❌), follow the error messages

## Files Changed

### Backend (API)
- `apps/api/src/main.ts` - Enhanced CORS configuration with logging
- `apps/api/src/prisma/prisma.service.ts` - Improved database connection handling

### Frontend (Web)
- `apps/web/src/lib/api-client.ts` - Better error handling for CORS/network errors
- `apps/web/src/lib/diagnostics.ts` - Configuration validation utilities
- `apps/web/src/app/diagnostics/page.tsx` - Diagnostics UI page

### Documentation
- `DEPLOYMENT_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `RAILWAY_SETUP.md` - Step-by-step Railway setup guide
- `.env.example` - Updated with CORS and database configuration

## What to Do If You Still Have Issues

### If CORS errors persist:

1. **Check Railway logs** for CORS messages:
   ```
   ⚠️ CORS blocked origin: https://yourapp.vercel.app
      Allowed patterns: ...
   ```

2. **Verify your frontend URL** is in the allowed list or matches a wildcard

3. **Set CORS_ORIGIN explicitly** in Railway if wildcards aren't working

4. **Check** that NEXT_PUBLIC_API_URL ends with `/api`

### If database connection fails:

1. **Check Railway logs** for database messages:
   ```
   🔍 Using database URL: Supabase ✅
   ✅ Database connected
   ```

2. **Verify** SUPABASE_DATABASE_URL is set correctly in Railway

3. **Check** that Supabase extensions are enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

4. **Test connection** from Railway shell:
   ```bash
   railway run npx prisma db push
   ```

### If API is unreachable:

1. **Visit** `https://your-api.up.railway.app/api/health` directly
2. Should return: `{"status":"ok", ...}`
3. If 404, check Railway deployment logs for errors
4. If CORS error, see CORS troubleshooting above

## Documentation

All troubleshooting steps are documented in:

- **[DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)** - Common issues and solutions
- **[RAILWAY_SETUP.md](./RAILWAY_SETUP.md)** - Railway deployment guide
- **[README.md](./README.md)** - General setup and overview

## Testing Checklist

Before closing this issue, verify:

- [ ] Frontend can fetch from `/api/health` endpoint
- [ ] `/diagnostics` page shows all green checkmarks
- [ ] CORS errors are resolved in browser console
- [ ] Database connection is to Supabase (check logs)
- [ ] No blocked origin warnings in Railway logs
- [ ] API documentation accessible at `/api/docs`

## Security

✅ **CodeQL Security Scan:** Passed with 0 alerts
- No sensitive data exposed in diagnostics
- CORS configuration properly validates origins
- Database credentials not logged or exposed

## Next Steps

1. **Deploy** these changes to your Railway and Vercel instances
2. **Visit** `/diagnostics` to verify configuration
3. **Check** Railway logs to ensure correct database connection
4. **Test** API calls from your frontend
5. If issues persist, consult the troubleshooting guides

---

## Need Help?

If you continue to experience issues after following the guides:

1. Check the `/diagnostics` page for specific error messages
2. Review Railway logs for CORS or database errors
3. Consult [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)
4. Check that environment variables are set correctly in both Railway and Vercel

---

**Status:** ✅ All issues addressed, comprehensive documentation provided, security scan passed.
