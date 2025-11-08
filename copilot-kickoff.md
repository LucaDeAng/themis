# copilot kickoff — themis

> Incolla questo prompt in **GitHub Copilot Chat** per scaffolding del monorepo e dei flussi MVP.  
> Vedi anche: [PRD](./prd.md)

---

```
You are my senior engineer. Scaffold a production‑ready personal project named "themis" that helps teams prioritize initiatives via criteria‑based scoring and LLM‑assisted briefs.

Architecture:
- Monorepo with pnpm workspaces: `apps/web` (Next.js/TypeScript), `apps/api` (FastAPI or NestJS — propose and proceed), `packages/ui` (shared components), `packages/core` (scoring, gating, prompt utils), `packages/types`.
- Database: PostgreSQL + Prisma/SQLModel; include migrations and seed script.
- Vector search: pgvector with basic similarity search for idea dedupe.
- Auth: NextAuth (GitHub/Email magic link) or Passport equivalent.
- API: REST; OpenAPI docs; `/rank`, `/brief`, `/projects`, `/criteria`, `/initiatives`.
- LLM provider abstraction with env‑driven selection; rate‑limit and budget guard.

Repo setup:
- GitHub Actions: CI (lint/typecheck/test/build); CD placeholders.
- Code quality: ESLint, Prettier, TypeScript strict; Ruff (if Python), commitlint + Conventional Commits.
- Security: basic secret scanning, `dotenv.example`, runtime checks for missing envs.
- Testing: Vitest/Playwright (web), pytest/Jest (api), unit tests for scoring + tie‑breaks.
- Templates: README with quickstart, CONTRIBUTING, SECURITY, CODEOWNERS (me), issue/PR templates.

Implement:
1) Core scoring module with weights, hard gates, tie‑breaks and sensitivity helpers.
2) Criteria Builder UI (weights, thresholds), Initiative Intake (CSV/manual), Scoring Table (1–5 with confidence).
3) Ranking endpoint; Explainability view (per‑criterion contributions).
4) Brief generator service with pluggable prompts; simple image‑prompt field.
5) Export endpoints: CSV and PDF of top‑N.

Developer experience:
- Seed project with sample criteria and 20 initiatives.
- Add `make dev` and `make seed` targets; Dockerfile + docker‑compose for Postgres.

Deliver an initial commit with the structure above and working MVP flows: create project → define criteria → import initiatives → score → rank → export. Keep code commented and modular.
```
