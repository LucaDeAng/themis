# Next Steps - Building the API and Frontend

## Current Status

✅ **COMPLETED:**
- Monorepo structure with pnpm workspaces
- PostgreSQL database with pgvector
- Complete Prisma schema
- **Strong Gen AI layer** with multi-provider support
- Scoring and ranking engine
- Initiative generation, brief generation, enrichment
- Rate limiting and budget controls
- Comprehensive documentation

🔄 **READY TO START:**
- NestJS API backend
- Next.js frontend
- Authentication
- Integration with core services

## Phase 1: Build the API (Recommended Next)

### 1. Setup NestJS Backend

```bash
cd apps
pnpm create nest-app api
cd api
pnpm add @nestjs/swagger @nestjs/config @nestjs/jwt @nestjs/passport
pnpm add @prisma/client
pnpm add @themis/core @themis/types
pnpm add class-validator class-transformer
```

### 2. Core API Structure

```
apps/api/src/
├── main.ts                 # Application bootstrap
├── app.module.ts           # Root module
├── config/
│   └── llm.config.ts       # LLM configuration
├── modules/
│   ├── projects/
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   ├── projects.module.ts
│   │   └── dto/
│   ├── criteria/
│   ├── initiatives/
│   ├── scoring/
│   ├── ranking/
│   ├── briefs/
│   └── generation/
│       ├── generation.controller.ts
│       └── generation.service.ts
└── prisma/
    └── prisma.service.ts
```

### 3. Key API Endpoints

**Projects**
```typescript
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

**Criteria**
```typescript
POST   /api/projects/:projectId/criteria
GET    /api/projects/:projectId/criteria
PATCH  /api/criteria/:id
DELETE /api/criteria/:id
```

**Initiatives**
```typescript
POST   /api/projects/:projectId/initiatives
POST   /api/projects/:projectId/initiatives/import    # CSV
POST   /api/projects/:projectId/initiatives/generate  # AI
GET    /api/projects/:projectId/initiatives
PATCH  /api/initiatives/:id
DELETE /api/initiatives/:id
```

**Scoring**
```typescript
POST   /api/initiatives/:initiativeId/scores
GET    /api/initiatives/:initiativeId/scores
POST   /api/projects/:projectId/scores/aggregate
```

**Ranking**
```typescript
POST   /api/projects/:projectId/rank
GET    /api/projects/:projectId/rankings
GET    /api/rankings/:id
POST   /api/rankings/:id/what-if
```

**Briefs**
```typescript
POST   /api/initiatives/:initiativeId/brief
GET    /api/initiatives/:initiativeId/brief
PATCH  /api/briefs/:id/regenerate/:section
```

**Generation**
```typescript
POST   /api/generation/initiatives
POST   /api/generation/enrich
POST   /api/generation/tags
```

### 4. Example Service Implementation

**generation.service.ts:**
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LLMService,
  InitiativeGenerator,
  BriefGenerator,
  createDefaultRegistry,
} from '@themis/core';

@Injectable()
export class GenerationService {
  private llmService: LLMService;
  private initiativeGenerator: InitiativeGenerator;
  private briefGenerator: BriefGenerator;

  constructor(private config: ConfigService) {
    this.llmService = new LLMService({
      provider: this.config.get('LLM_PROVIDER'),
      model: this.config.get('LLM_MODEL'),
      apiKey: this.config.get('OPENAI_API_KEY'),
    });

    const registry = createDefaultRegistry();
    this.initiativeGenerator = new InitiativeGenerator(
      this.llmService,
      registry,
    );
    this.briefGenerator = new BriefGenerator(
      this.llmService,
      registry,
    );
  }

  async generateInitiatives(dto: GenerateInitiativesDto) {
    return this.initiativeGenerator.generate({
      projectId: dto.projectId,
      intent: dto.intent,
      criteria: dto.criteria,
      count: dto.count,
    });
  }

  async generateBrief(dto: GenerateBriefDto) {
    return this.briefGenerator.generate({
      initiativeId: dto.initiativeId,
      title: dto.title,
      description: dto.description,
      scores: dto.scores,
      criteria: dto.criteria,
      sections: ['executive_summary', 'rationale', 'risks', 'metrics'],
    });
  }
}
```

## Phase 2: Build the Frontend

### 1. Setup Next.js

```bash
cd apps
pnpm create next-app web --typescript --tailwind --app
cd web
pnpm add @themis/types
pnpm add @tanstack/react-query
pnpm add zustand
pnpm add react-hook-form zod
pnpm add lucide-react
```

### 2. Install shadcn/ui

```bash
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button input form table card
pnpm dlx shadcn-ui@latest add select slider badge dialog
```

### 3. Core Frontend Structure

```
apps/web/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/
│       ├── projects/
│       ├── [projectId]/
│       │   ├── criteria/
│       │   ├── initiatives/
│       │   ├── scoring/
│       │   ├── ranking/
│       │   └── briefs/
│       └── settings/
├── components/
│   ├── ui/              # shadcn components
│   ├── criteria/
│   │   ├── CriteriaBuilder.tsx
│   │   ├── WeightSlider.tsx
│   │   └── CriteriaList.tsx
│   ├── initiatives/
│   │   ├── InitiativeForm.tsx
│   │   ├── GenerationDialog.tsx
│   │   └── InitiativeList.tsx
│   ├── scoring/
│   │   ├── ScoringTable.tsx
│   │   ├── ScoreInput.tsx
│   │   └── ConfidenceSlider.tsx
│   ├── ranking/
│   │   ├── RankingView.tsx
│   │   ├── ExplainabilityChart.tsx
│   │   └── SensitivitySlider.tsx
│   └── briefs/
│       ├── BriefEditor.tsx
│       ├── SectionRegenerate.tsx
│       └── ImagePromptPreview.tsx
├── lib/
│   ├── api.ts           # API client
│   └── hooks/
│       ├── useProjects.ts
│       ├── useInitiatives.ts
│       └── useGeneration.ts
└── store/
    └── projectStore.ts
```

### 4. Key Frontend Pages

1. **Intent Capture** (`/projects/new`)
   - Two-question form: "What do you want to do?" "What do you want to launch?"
   - AI-powered extraction of objectives

2. **Criteria Builder** (`/projects/:id/criteria`)
   - Drag-to-reorder criteria
   - Weight sliders with live total display
   - Hard/soft gate toggle
   - Template selection

3. **Initiative Intake** (`/projects/:id/initiatives`)
   - Manual entry form
   - CSV import
   - AI generation dialog
   - Deduplication alerts

4. **Scoring Workspace** (`/projects/:id/scoring`)
   - Keyboard-first data entry
   - Bulk paste from Excel
   - Confidence sliders
   - Progress indicators

5. **Ranking View** (`/projects/:id/ranking`)
   - Sortable table
   - Explainability charts
   - Sensitivity analysis sliders
   - Export buttons

6. **Brief Editor** (`/projects/:id/briefs/:id`)
   - Section-by-section regeneration
   - Markdown editor
   - Image prompt preview
   - Export to PDF

## Phase 3: Authentication & Authorization

### 1. NextAuth.js Setup

```bash
pnpm add next-auth @prisma/client
```

### 2. Auth Configuration

```typescript
// apps/web/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Phase 4: Testing

### 1. Core Package Tests

```bash
# Test LLM services
pnpm --filter @themis/core test llm

# Test scoring
pnpm --filter @themis/core test scoring

# Test generation
pnpm --filter @themis/core test generation
```

### 2. API Tests

```bash
# E2E tests
pnpm --filter api test:e2e

# Integration tests
pnpm --filter api test:integration
```

### 3. Frontend Tests

```bash
# Component tests
pnpm --filter web test

# E2E with Playwright
pnpm --filter web test:e2e
```

## Phase 5: Deployment

### 1. Docker Production Build

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

### 2. CI/CD with GitHub Actions

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
```

## Quick Commands

```bash
# Start everything
make setup && make dev

# Generate new migration
make migrate

# Run tests
make test

# View database
make studio

# Reset database (WARNING: destructive)
make reset
```

## Resources

- **NestJS**: https://docs.nestjs.com
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **NextAuth**: https://next-auth.js.org

## Timeline Estimate

- **Week 1**: NestJS API with core endpoints
- **Week 2**: Frontend setup + intent capture + criteria builder
- **Week 3**: Scoring workspace + ranking view
- **Week 4**: Brief editor + exports
- **Week 5**: Authentication + polish
- **Week 6**: Testing + deployment

## Questions?

Refer to:
- `QUICKSTART.md` - Getting started
- `ARCHITECTURE.md` - Gen AI deep dive
- `GEN_AI_IMPLEMENTATION.md` - Implementation summary
- `prd.md` - Full requirements

**Status**: Ready to build the API! 🚀
