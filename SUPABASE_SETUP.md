# 🚀 Supabase Setup Guide for Themis

## Quick Setup (Automated)

We've created a setup script to automate the database configuration. Follow these steps:

### Step 1: Create Supabase Account & Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up** or **Log in** with your GitHub account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: `themis`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `East US`, `Europe West`)
   - **Pricing Plan**: Free (up to 500MB database)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be ready

### Step 2: Run Setup Script

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the contents of `supabase-setup.sql` from the repository
4. Paste into the SQL Editor and click **"Run"**
5. The script will:
   - ✅ Enable required extensions (pgvector, uuid-ossp)
   - ✅ Verify extension setup
   - ✅ Show connection information
   - ✅ Provide monitoring queries

**Or manually enable extensions:**

```sql
-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions
SELECT * FROM pg_extension WHERE extname IN ('vector', 'uuid-ossp');
```

### Step 3: Get Your Connection String

**IMPORTANT: Different connection strings for different deployments!**

#### For Railway / Traditional Servers:
1. In Supabase, go to **Settings** (gear icon) → **Database**
2. Scroll to **"Connection string"** section
3. Select **"URI"** tab (Direct Connection)
4. Copy the connection string (port **5432**):
   ```
   postgresql://postgres.[project-id]:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

#### For Vercel / Serverless:
1. In Supabase, go to **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Select **"Connection pooling"** tab
4. Choose **"Session mode"** (recommended)
5. Copy the **pooled** connection string (port **6543**):
   ```
   postgresql://postgres.[project-id]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

**Why pooled connection for serverless?**
- Serverless functions (Vercel) create many short-lived connections
- Direct connections (port 5432) will hit Supabase's connection limit quickly
- Pooled connections (port 6543) use PgBouncer to manage connections efficiently

### Step 4: Update Your .env File

Your `.env` file has been created with your OpenAI API key already configured.

Now update the `DATABASE_URL` line with your Supabase connection string:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
```

**Complete example**:
```env
DATABASE_URL="postgresql://postgres:MyStr0ngP@ssw0rd@db.abcdefghijklmno.supabase.co:5432/postgres"
```

## Step 5: Run Database Migrations

Once you've updated the `.env` file, run these commands:

```powershell
# Generate Prisma Client
pnpm run prisma:generate

# Run migrations to create all tables
pnpm run prisma:migrate

# Optional: Seed with sample data
pnpm run seed
```

## Step 6: Test the Connection

```powershell
# Open Prisma Studio to view your database
pnpm run prisma:studio
```

This will open a browser at http://localhost:5555 where you can see all your tables!

## Step 7: Test Gen AI Layer

Now test the AI features:

```powershell
# Your OpenAI key is already set in .env
# Just run the test script
npx tsx test-gen-ai.ts
```

You should see:
- ✅ LLM connection successful
- ✅ 3 AI-generated initiative ideas
- ✅ Token usage stats

## Troubleshooting

### Connection Error: "password authentication failed"
- Double-check you replaced `[YOUR-PASSWORD]` with your actual password
- Make sure there are no spaces in the connection string
- Try resetting your database password in Supabase Settings → Database

### Error: "extension 'vector' does not exist"
- Go back to SQL Editor in Supabase
- Run: `CREATE EXTENSION vector;`
- Wait a minute and try again

### Prisma Migration Error
- Make sure your connection string is correct in `.env`
- Try: `pnpm run prisma:generate` first
- Then: `pnpm run prisma:migrate`

## What You Get with Supabase Free Tier

✅ **500 MB Database** - Plenty for development
✅ **Unlimited API requests**
✅ **pgvector support** - For semantic search
✅ **Automatic backups**
✅ **Real-time subscriptions** - For future features
✅ **Authentication** - Built-in auth system
✅ **Storage** - 1 GB file storage

## Next Steps After Setup

1. ✅ Test Gen AI: `npx tsx test-gen-ai.ts`
2. ✅ View database: `pnpm run prisma:studio`
3. 📖 Read docs: Check out `NEXT_STEPS.md` for building the API
4. 🚀 Build API: Follow `NEXT_STEPS.md` to create NestJS backend

## Quick Reference

```powershell
# View database in browser
pnpm run prisma:studio

# Generate Prisma client
pnpm run prisma:generate

# Create new migration
pnpm run prisma:migrate

# Test AI features
npx tsx test-gen-ai.ts

# View all commands
make help
```

## Support Links

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **pgvector Guide**: https://supabase.com/docs/guides/database/extensions/pgvector
- **Prisma + Supabase**: https://www.prisma.io/docs/guides/database/supabase

---

**Status**: Once you complete these steps, your database will be fully configured and ready! 🎉

Continue with `NEXT_STEPS.md` to build the API and frontend.
