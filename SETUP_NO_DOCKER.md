# Setup Guide - Without Docker

Since Docker Desktop is not currently installed, here are alternative ways to run the database and continue development:

## Option 1: Install Docker Desktop (Recommended)

1. **Download Docker Desktop for Windows**:
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download and install Docker Desktop
   - Restart your computer if prompted

2. **After installation, run**:
   ```bash
   docker compose -f infra/docker-compose.yml up -d db
   ```

## Option 2: Use Local PostgreSQL Installation

### Install PostgreSQL with pgvector

1. **Download PostgreSQL 16**:
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer
   - During installation, remember your postgres password

2. **Install pgvector extension**:
   ```powershell
   # After PostgreSQL is installed
   # Download pgvector from: https://github.com/pgvector/pgvector/releases
   # Follow Windows installation instructions
   ```

3. **Update your .env file**:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/themis?schema=public"
   ```

4. **Create the database**:
   ```powershell
   psql -U postgres
   CREATE DATABASE themis;
   \c themis
   CREATE EXTENSION vector;
   \q
   ```

## Option 3: Use Cloud Database (Quick Testing)

### Neon.tech (Free PostgreSQL with pgvector)

1. Visit: https://neon.tech
2. Sign up for free account
3. Create a new project named "themis"
4. Enable pgvector extension
5. Copy the connection string to your .env:
   ```env
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/themis?sslmode=require"
   ```

### Supabase (Free PostgreSQL with pgvector)

1. Visit: https://supabase.com
2. Create free account
3. Create new project "themis"
4. Go to SQL Editor and run:
   ```sql
   CREATE EXTENSION vector;
   ```
5. Copy connection string to .env

## Current Status

✅ Dependencies installed
❌ Database not running (Docker not available)

## Next Steps Once Database is Ready

```bash
# 1. Generate Prisma client
pnpm run prisma:generate

# 2. Run migrations
pnpm run prisma:migrate

# 3. Seed data (optional)
pnpm run seed

# 4. Start development (when API is built)
pnpm run dev
```

## Testing Core Services Without Database

You can test the Gen AI services without a database:

```powershell
# Test LLM services
cd packages/core
pnpm test

# Or create a test script
node --loader tsx test-llm.ts
```

Example test script (`test-llm.ts`):

```typescript
import { LLMService, createDefaultRegistry } from './src/index';

async function test() {
  const llm = new LLMService({
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const result = await llm.complete({
    messages: [
      { role: 'user', content: 'Say hello!' }
    ],
  });

  console.log('LLM Response:', result.content);
  console.log('Tokens used:', result.usage.totalTokens);
}

test().catch(console.error);
```

## Recommended: Install Docker Desktop

For the best development experience, I recommend installing Docker Desktop. It's the easiest way to run PostgreSQL with pgvector locally.

**Download**: https://www.docker.com/products/docker-desktop/

After installation:
1. Run `make db-up`
2. Run `make migrate`
3. Run `make seed`
4. You're ready to go!
