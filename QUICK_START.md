# ⚡ Quick Start - Get Themis Running in 5 Minutes

## Option 1: Automated Setup (Recommended)

Run the automated setup script:

```powershell
.\setup-supabase.ps1
```

The script will:
1. Guide you through creating a Supabase project
2. Update your .env with the connection string
3. Enable pgvector extension
4. Run database migrations
5. Test the Gen AI layer

## Option 2: Manual Setup

### Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Click **"New Project"**
   - Name: `themis`
   - Password: Choose strong password (save it!)
   - Region: Choose closest to you
4. Wait 2-3 minutes for provisioning

### Step 2: Enable pgvector (1 min)

In Supabase → **SQL Editor** → **New query**, run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 3: Get Connection String (30 sec)

1. Supabase → **Settings** → **Database**
2. Copy **Connection string (URI)**
3. Replace `[YOUR-PASSWORD]` with your actual password

### Step 4: Update .env (30 sec)

Open `.env` and replace the `DATABASE_URL` line:

```env
DATABASE_URL="postgresql://postgres:YourPassword@db.xxxxx.supabase.co:5432/postgres"
```

### Step 5: Run Migrations (1 min)

```powershell
# Generate Prisma Client
pnpm run prisma:generate

# Create all tables
pnpm run prisma:migrate
```

### Step 6: Test Everything (30 sec)

```powershell
# Test AI generation
npx tsx test-gen-ai.ts

# View database
pnpm run prisma:studio
```

## ✅ You're Done!

Your Gen AI engine is now running with:
- ✅ OpenAI GPT-4 configured
- ✅ PostgreSQL + pgvector on Supabase
- ✅ All 14 database tables created
- ✅ LLM services ready (scoring, generation, ranking)

## What You Have Now

```
📦 Themis Gen AI Engine
├── 🤖 AI Services
│   ├── OpenAI GPT-4 Turbo
│   ├── Initiative Generator
│   ├── Brief Generator
│   └── Scoring Engine
├── 🗄️ Database (Supabase)
│   ├── 14 tables created
│   ├── pgvector for semantic search
│   └── Automatic backups
└── 📊 Core Features
    ├── Weighted scoring
    ├── Sensitivity analysis
    ├── Gate evaluation
    └── Rank optimization
```

## Next Steps

### 1. Explore Your Database

```powershell
pnpm run prisma:studio
```

Opens at `http://localhost:5555` - browse all tables!

### 2. Generate Some Initiatives

Create a file `test-generation.ts`:

```typescript
import { InitiativeGenerator } from '@themis/core/src/generation/initiative-generator';
import { LLMService } from '@themis/core/src/llm/llm-service';

const llmService = new LLMService({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!,
});

const generator = new InitiativeGenerator(llmService);

const initiatives = await generator.generateInitiatives({
  workspaceId: '123',
  projectId: '456',
  businessContext: 'E-commerce company looking to improve customer retention',
  strategicGoals: ['Increase repeat purchases', 'Reduce churn'],
  count: 5,
});

console.log(initiatives);
```

Run: `npx tsx test-generation.ts`

### 3. Build the API (Next Phase)

See `NEXT_STEPS.md` for building the NestJS REST API

## Troubleshooting

### "Connection failed"
- Check your connection string in `.env`
- Make sure password is correct (no spaces)
- Verify Supabase project is running

### "Extension 'vector' not found"
- Go to Supabase SQL Editor
- Run: `CREATE EXTENSION vector;`
- Wait 1 minute, try again

### "Prisma migrate failed"
- Run `pnpm run prisma:generate` first
- Check DATABASE_URL format
- Ensure Supabase project is active

## Common Commands

```powershell
# Database
pnpm run prisma:studio       # View database in browser
pnpm run prisma:generate     # Generate Prisma Client
pnpm run prisma:migrate      # Run migrations

# Testing
npx tsx test-gen-ai.ts       # Test AI layer
pnpm test                    # Run all tests

# Development
pnpm install                 # Install dependencies
pnpm build                   # Build all packages
```

## Support

- 📖 Full docs: `SUPABASE_SETUP.md`
- 🏗️ Architecture: `ARCHITECTURE.md`
- 🚀 Next steps: `NEXT_STEPS.md`
- 💡 Gen AI details: `GEN_AI_IMPLEMENTATION.md`

---

**Status**: ✅ Core Gen AI engine ready | 🚧 API and Frontend (next phase)
