# Themis - Quickstart Guide

Welcome to Themis! This guide will get you up and running in 10 minutes.

## 🎯 What is Themis?

Themis is a **GenAI-powered initiative prioritization engine** that helps teams:
- **Capture intent** and convert it to structured objectives
- **Generate** initiative ideas using AI
- **Score** initiatives against custom criteria
- **Rank** with transparent, explainable scoring
- **Generate** comprehensive concept briefs automatically

## 🚀 Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **Docker Desktop** (for PostgreSQL)
- **OpenAI API key** (or Anthropic/Ollama)

## 📦 Quick Setup

### 1. Clone and Install

```bash
cd Themis
pnpm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required: Choose your LLM provider
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here

# Database (default is fine)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/themis?schema=public"

# Auth secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Start Database

```bash
make db-up
```

Or manually:

```powershell
docker compose -f infra/docker-compose.yml up -d db
```

### 4. Setup Database

```bash
make generate
make migrate
make seed
```

This will:
- Generate Prisma client
- Run database migrations
- Load sample data (criteria, initiatives)

### 5. Start Development

```bash
make dev
```

Or:

```bash
pnpm run dev
```

This starts:
- **API** at http://localhost:4000
- **Web** at http://localhost:3000

## 🎓 First Steps

### Test the Gen AI Layer

Open a new PowerShell terminal and test the core services:

```powershell
# Navigate to core package
cd packages/core

# Run tests
pnpm test
```

### Example: Generate Initiatives

Create a test script `test-generation.ts`:

```typescript
import {
  LLMService,
  InitiativeGenerator,
  createDefaultRegistry,
} from '@themis/core';

async function main() {
  // Initialize LLM service
  const llmService = new LLMService({
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    apiKey: process.env.OPENAI_API_KEY!,
    temperature: 0.7,
  });

  // Create generator
  const registry = createDefaultRegistry();
  const generator = new InitiativeGenerator(llmService, registry);

  // Generate initiatives
  const initiatives = await generator.generate({
    projectId: 'test',
    intent: 'Launch a mobile app for fitness tracking',
    criteria: [
      { name: 'User Impact', description: 'Value delivered to users' },
      { name: 'Feasibility', description: 'Technical implementation ease' },
    ],
    count: 5,
  });

  console.log(JSON.stringify(initiatives, null, 2));
}

main();
```

Run it:

```bash
npx tsx test-generation.ts
```

## 📖 Key Concepts

### 1. Intent Capture

Convert free-form goals into structured objectives:

```typescript
import { PromptRegistry } from '@themis/core';

const registry = createDefaultRegistry();
const prompt = registry.render('intent_capture', {
  userInput: 'We want to improve customer retention'
});
```

### 2. Criteria & Scoring

Define evaluation criteria with weights:

```typescript
const criteria = [
  { name: 'Impact', weight: 0.35 },
  { name: 'Feasibility', weight: 0.25 },
  { name: 'Strategic Fit', weight: 0.25 },
  { name: 'Risk', weight: 0.15 }
];
```

Score on 1-5 scale:
- **5** = Exceptional
- **4** = Strong
- **3** = Adequate
- **2** = Weak
- **1** = Poor

### 3. Hard Gates vs Soft Criteria

**Hard Gates**: Binary requirements (must pass)
```typescript
{
  name: 'Budget Available',
  expression: '{"<=": [{"var": "cost"}, 100000]}',
  isHardGate: true
}
```

**Soft Criteria**: Scored 1-5 with weights
```typescript
{
  name: 'User Impact',
  weight: 0.35,
  type: 'soft'
}
```

### 4. Ranking & Tie-Breaks

Initiatives are ranked by:
1. **Overall Score** (weighted sum)
2. **Tie-break #1**: Impact contribution
3. **Tie-break #2**: Time-to-value
4. **Tie-break #3**: Confidence

### 5. Concept Briefs

AI-generated briefs include:
- **Executive Summary** (2-3 sentences)
- **Rationale** (strategic fit)
- **Risks** (with mitigation)
- **Success Metrics** (KPIs)
- **Image Prompt** (for visualization)

## 🔧 Common Tasks

### Add a New Prompt Template

Edit `packages/core/src/llm/prompt-registry.ts`:

```typescript
{
  id: 'my_new_prompt',
  name: 'My New Prompt',
  version: '1.0.0',
  template: `Your prompt with {{variables}}`,
  variables: ['variables'],
  systemPrompt: 'Your system instructions'
}
```

### Change LLM Provider

Update `.env`:

```env
# Switch to Anthropic
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key
LLM_MODEL=claude-3-opus-20240229

# Or use local Ollama
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=llama3:latest
```

### Adjust Rate Limits

Update `.env`:

```env
LLM_RATE_LIMIT_PER_MINUTE=100
LLM_DAILY_TOKEN_BUDGET=200000
```

### View Database

```bash
make studio
```

Opens Prisma Studio at http://localhost:5555

## 🧪 Testing

### Run All Tests

```bash
make test
```

### Test Specific Package

```bash
pnpm --filter @themis/core test
```

### Type Checking

```bash
make typecheck
```

### Linting

```bash
make lint
```

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check if database is running
docker compose -f infra/docker-compose.yml ps

# View logs
make db-logs

# Restart
make db-down
make db-up
```

### Prisma Client Not Found

```bash
make generate
```

### LLM API Errors

Check your `.env`:
- Verify API key is correct
- Check provider name spelling
- Ensure sufficient API credits

### Port Already in Use

Change ports in `.env`:

```env
API_PORT=4001
WEB_PORT=3001
```

## 📚 Next Steps

1. **Read the PRD**: See `prd.md` for full requirements
2. **Architecture**: Check `ARCHITECTURE.md` for Gen AI details
3. **API Docs**: (Coming soon) OpenAPI documentation
4. **Deploy**: (Coming soon) Production deployment guide

## 🆘 Getting Help

- **Issues**: GitHub Issues (when repo is created)
- **Docs**: See `/docs` folder
- **Examples**: See `/examples` folder (coming soon)

## 🎉 You're Ready!

Start building! Try:

```bash
# Generate initiatives
# Score and rank them
# Create concept briefs
# Export top-N to CSV/PDF
```

Happy prioritizing! 🚀
