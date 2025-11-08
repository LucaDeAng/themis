# themis — personal initiative prioritization engine

# 🎯 Themis - AI Initiative Prioritization Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/themis)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)

> **Themis** è una piattaforma enterprise di **decision-making intelligente** che utilizza l'**Intelligenza Artificiale Generativa** per aiutare le organizzazioni a **prioritizzare le iniziative strategiche** in modo oggettivo, trasparente e data-driven.

![Themis Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Themis+AI+Platform)

## ✨ Features

- 🤖 **AI Generativa** per ideazione iniziative automatica
- 🎯 **Scoring Multi-Criterio** pesato con confidence intervals
- 📊 **Ranking Dinamico** real-time con insights e raccomandazioni
- 📄 **Brief Automatici** con executive summary e business case
- 🔄 **Import/Export** Excel, CSV, JSON per integrazione facile
- 🎓 **Tutorial Interattivo** con onboarding guidato
- 🔐 **Enterprise-Ready** con GDPR compliance e audit trail
- 📱 **Responsive Design** moderno stile Silicon Valley

---

> Personal project. No references to third-party consultancies.
>
> **📖 Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)  
> **🏗️ Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)  
> **📋 Requirements**: See [prd.md](./prd.md)

---

## overview
- Capture intent and define **criteria** (weights, thresholds, hard gates).
- Intake initiatives (CSV/manual/LLM), **filter** with requirements, **score** 1–5, **rank** with explainability.
- Generate concise **concept briefs** and export CSV/PDF.

## features
- Criteria builder with weights & minimum thresholds (hard/soft).
- Requirements gating (binary checks before scoring).
- Scoring workspace (Likert 1–5, reviewer confidence, bulk paste).
- Aggregation (median/trimmed mean) and disagreement heatmap.
- Ranking with **tie-break rules** and sensitivity analysis.
- Concept brief generator (sections + image prompt).
- Exports: CSV, PDF (top-N), and basic API.
- Auth (GitHub or email magic link), RBAC (owner/reviewer/viewer).

## architecture
- **Monorepo (pnpm workspaces)**
  - `apps/web` — Next.js, TypeScript, Tailwind, shadcn/ui
  - `apps/api` — NestJS (TypeScript). *(Option: FastAPI branch later)*
  - `packages/core` — scoring, gating, prompt utils
  - `packages/ui` — shared UI components
  - `packages/types` — shared TypeScript types
  - `infra/` — Docker, db, migrations
  - `docs/` — PRD and Copilot kickoff prompt
- **Database**: PostgreSQL + **pgvector**
- **ORM**: Prisma
- **LLM layer**: provider-agnostic (OpenAI/Anthropic/local via env)
- **CI**: GitHub Actions (lint/typecheck/test/build)

## monorepo structure
```
themis/
  apps/
    web/
    api/
  packages/
    core/
    ui/
    types/
  infra/
    docker-compose.yml
    prisma/
      schema.prisma
      migrations/
  docs/
    prd.md
    copilot-kickoff.md
```

## quickstart

**Full guide**: [QUICKSTART.md](./QUICKSTART.md)

### One-command setup

```bash
make setup
```

This will:
- Install all dependencies
- Start PostgreSQL (via Docker)
- Generate Prisma client
- Run migrations
- Seed sample data

### Start development

```bash
make dev
```

App URLs (default):
- **Web**: http://localhost:3000
- **API**: http://localhost:4000
- **Prisma Studio**: `make studio` → http://localhost:5555

## environment variables
Create `.env` at repo root:

```
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/themis?schema=public"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-secret"
GITHUB_ID="..."
GITHUB_SECRET="..."

# LLM provider
LLM_PROVIDER="openai"        # openai|anthropic|ollama
OPENAI_API_KEY="sk-..."

# Feature flags / limits
THEMIS_MAX_INITIATIVES=500
THEMIS_BRIEF_TOKENS=1200
```

## dev scripts
Common npm/pnpm scripts (workspace root):
- `pnpm -w run dev` — start web and api (concurrently)
- `pnpm -w run build` — build all packages
- `pnpm -w run test` — unit tests (`vitest` for web, `jest` for api)
- `pnpm -w prisma migrate dev` — run DB migrations
- `pnpm -w run seed` — load sample criteria and 20 initiatives

Optional `Makefile` targets (if present): `make dev`, `make seed`, `make db`, `make migrate`.

## scoring model
- Normalize each criterion score: `s = (value - 1) / 4`  (maps 1–5 → 0–1)
- Weighted sum: `S = Σ (w_i * s_i)` with `Σ w_i = 1`
- **Hard gates**: initiatives failing any requirement are excluded **before** scoring
- **Risk-adjusted (optional)**: `S' = S × (1 − risk_index)`, `risk_index ∈ [0, 0.5]`
- **Tie-breakers** (in order): higher **impact** contribution → lower **time-to-value** → higher **reviewer confidence**

## api (selected)
```
POST   /api/projects                      # create project
POST   /api/criteria                      # add/edit criteria & weights
POST   /api/requirements                  # add hard/soft gates
POST   /api/initiatives/import            # CSV intake
POST   /api/score                         # submit scores (1–5 + confidence)
POST   /api/rank                          # compute ranking
POST   /api/brief/:initiativeId           # generate concept brief
GET    /api/exports/top?format=csv&n=10   # export top-N
```

**example** — rank request
```http
POST /api/rank
{
  "projectId": "prj_123",
  "aggregation": "median",
  "riskAdjusted": true
}
```

**example** — rank response
```json
{
  "projectId": "prj_123",
  "generatedAt": "2025-11-08T10:00:00Z",
  "items": [
    {
      "initiativeId": "ini_A1",
      "score": 0.82,
      "rank": 1,
      "explain": { "impact": 0.31, "feasibility": 0.27, "strategicFit": 0.24 },
      "gates": []
    }
  ]
}
```

## using github copilot (kickoff)
You can bootstrap the repository structure and MVP flows with **Copilot Chat**:

1. Open `docs/copilot-kickoff.md` and **copy** its content into Copilot Chat.  
2. Run through the guided steps Copilot proposes, then `pnpm i && pnpm -w run dev`.

> The kickoff prompt is the same one referenced in the PRD. If `docs/copilot-kickoff.md` is missing, create it and paste the prompt you saved from your notes/canvas.

## docs
- `docs/prd.md` — Product Requirements Document (personal scope)
- `docs/copilot-kickoff.md` — Copilot prompt to scaffold the monorepo and MVP

## code quality & security
- ESLint, Prettier, TypeScript strict
- commitlint + Conventional Commits
- Basic secret scanning; `.env.example` provided
- Prompt library with eval harness and guardrails

## roadmap (high level)
- **M0–2 (MVP)**: criteria builder, intake, scoring, ranking, exports
- **M3–4 (Alpha)**: LLM ideation, explainability, basic briefs
- **M5–6 (Beta)**: multi-reviewer, sensitivity, image prompt, API polish
- **M7–9 (GA)**: collaboration, audit, SSO, usage dashboard

## license
MIT — see `LICENSE`.

---
*Made with curiosity. This is a personal project; feedback and PRs are welcome.*
