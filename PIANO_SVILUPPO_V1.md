# 🎯 Piano di Sviluppo Themis V1.0

**Status**: Database ✅ | API Base ✅ | Frontend Base ✅ | Railway Deploy ✅

**Obiettivo**: Completare Themis V1.0 secondo PRD - Full workflow funzionante end-to-end

---

## 📊 Stato Attuale (What's Working)

### ✅ Infrastruttura Completa
- **Database**: Supabase PostgreSQL + schema Prisma completo
- **Backend**: NestJS su Railway (themis-production.up.railway.app/api)
- **Frontend**: Next.js 16 su Railway (themis-production-9c1d.up.railway.app)
- **CORS**: Configurato e funzionante
- **Deploy**: Pipeline automatico Git → Railway

### ✅ Moduli Backend Implementati
```
✅ Projects Module     - CRUD progetti completo
✅ Initiatives Module  - CRUD iniziative completo
✅ Scoring Module      - Add/Get scores base
✅ Ranking Module      - Get rankings base
✅ Generation Module   - AI generation setup (da completare)
✅ Briefs Module       - Get briefs base
✅ Prisma Service      - DB connection working
```

### ✅ Packages Core Esistenti
```
✅ @themis/core
   ✅ InitiativeGenerator   - AI generation initiatives
   ✅ BriefGenerator        - AI concept brief generation
   ✅ EnrichmentService     - AI auto-tagging
   ✅ Scorer               - Multi-criteria scoring engine
   ✅ Ranker               - Ranking with tie-breaks
   ✅ PromptRegistry       - Template prompts LLM
   ✅ LLMService           - OpenAI integration

✅ @themis/types
   ✅ Tutti i tipi TypeScript condivisi
```

### ✅ Frontend Esistente
```
✅ Dashboard layout
✅ Projects list/create/detail
✅ React Query hooks per API
✅ UI Components (shadcn/ui)
✅ Onboarding tutorial
```

---

## 🎯 Gap Analysis vs PRD V1.0

### 🔴 MUST HAVE - Da Implementare

#### 1. Onboarding Guidato (PRD 4.1) ❌
**Stato**: Tutorial generico esiste, mancano 2 domande iniziali
**Gap**:
- Form onboarding con 2 domande:
  - "What do you want to do?"
  - "What do you want to launch?"
- Salvataggio in Project metadata
- Skip option per quick start

**Priorità**: P1 (Nice-to-have, non blocca workflow)

---

#### 2. Criteria Module - UI Completa (PRD 4.2) ⚠️
**Stato**: Backend OK, frontend manca UI dedicata
**Gap**:
- ✅ Backend: POST/GET/PATCH/DELETE /api/projects/:id/criteria
- ❌ Frontend: Pagina `/dashboard/projects/[id]/criteria`
- ❌ Form add/edit criterion
- ❌ List criteri con weights
- ❌ Validazione: max 6 parole per criterio
- ❌ Range 3-8 criteri enforced

**Priorità**: P0 (Blocker - serve per scoring)

---

#### 3. Initiative Input Module - UI (PRD 4.3) ⚠️
**Stato**: Backend OK, frontend base esiste
**Gap**:
- ✅ Backend: CRUD initiatives completo
- ⚠️ Frontend: Esiste lista base, manca:
  - ❌ Bulk input (add multiple initiatives)
  - ❌ CSV import
  - ❌ Validazione 1-20 iniziative
  - ❌ Quick add form ottimizzato

**Priorità**: P1 (Backend ready, UI da migliorare)

---

#### 4. Feasibility Check AI (PRD 4.4) ❌
**Stato**: Logica core esiste, manca integrazione API
**Gap**:
- ⚠️ Core: EnrichmentService ha evaluate()
- ❌ API endpoint: POST /api/generation/feasibility
- ❌ Frontend: UI per mostrare approved/rejected
- ❌ Prompt: feasibility_check in PromptRegistry

**Priorità**: P0 (Feature chiave PRD)

**Implementazione**:
```typescript
// Backend: generation.controller.ts
@Post('feasibility')
async checkFeasibility(@Body() dto: {
  criteria: Criterion[];
  initiatives: Initiative[];
}) {
  return this.generationService.checkFeasibility(dto);
}

// Frontend: useCheckFeasibility() hook
// UI: Badge approved/rejected su initiative card
```

---

#### 5. Scoring Module - UI Completa (PRD 4.5) ❌
**Stato**: Backend base OK, manca UI workflow
**Gap**:
- ✅ Backend: POST /api/scoring (add score)
- ✅ Backend: GET /api/scoring/:initiativeId
- ❌ Frontend: Pagina scoring dedicata
- ❌ UI: Grid iniziative × criteri
- ❌ Input: 1-5 per ogni cella
- ❌ Validazione input
- ❌ Calcolo totale real-time (media aritmetica)
- ❌ Save bulk scores

**Priorità**: P0 (Core workflow blocker)

**Design UI**:
```
┌─────────────────────────────────────────────┐
│ Scoring: Project Alpha                      │
├─────────────────┬───────┬───────┬───────────┤
│ Initiative      │ Crit1 │ Crit2 │ Total     │
├─────────────────┼───────┼───────┼───────────┤
│ Initiative A    │ [3]   │ [4]   │ 3.5 ⭐    │
│ Initiative B    │ [5]   │ [2]   │ 3.5 ⭐    │
│ Initiative C    │ [4]   │ [5]   │ 4.5 ⭐⭐  │
└─────────────────┴───────┴───────┴───────────┘
```

---

#### 6. Ranking - UI + Auto Update (PRD 4.6) ⚠️
**Stato**: Backend base OK, frontend da completare
**Gap**:
- ✅ Backend: GET /api/ranking?projectId=X
- ⚠️ Core: Ranker.rank() esiste ma non integrato
- ❌ Frontend: Pagina ranking dedicata
- ❌ Ordinamento automatico real-time
- ❌ Evidenziazione top 3
- ❌ Visual: podio/badges

**Priorità**: P0 (Feature core PRD)

**Implementazione**:
```typescript
// Backend: ranking.service.ts integra @themis/core Ranker
async getRanking(projectId: string) {
  const initiatives = await this.getInitiativesWithScores(projectId);
  const scores = this.calculateScores(initiatives);
  return this.ranker.rank(scores); // Usa Ranker core
}
```

---

#### 7. Concept Generation - API + UI (PRD 4.7) ⚠️
**Stato**: Core pronto, manca integrazione completa
**Gap**:
- ✅ Core: BriefGenerator.generate() implementato
- ⚠️ Backend: POST /api/generation/brief esiste ma da testare
- ❌ Frontend: UI concept page per top 3
- ❌ Trigger: Generate brief per iniziative ranked top 3
- ❌ Display: 10-12 righe formattate
- ❌ Sections: problema/soluzione/value/target/diff/risks

**Priorità**: P1 (Feature differenziante)

---

#### 8. Visual Inspiration (PRD 4.8) ❌
**Stato**: Non implementato
**Gap**:
- ❌ Prompt generation per immagine
- ❌ Integrazione API immagini (DALL-E/Stable Diffusion)
- ❌ Salvataggio URL immagine
- ❌ Display immagine in concept page

**Priorità**: P2 (Optional V1, can be V1.1)

---

#### 9. Final Report Export (PRD 4.9) ❌
**Stato**: Non implementato
**Gap**:
- ❌ Endpoint: GET /api/export/report?projectId=X
- ❌ Generazione markdown:
  - Ranking completo
  - Concept top 3
  - Visual prompts
- ❌ Download file: THEMIS_output.md
- ❌ Frontend: Export button

**Priorità**: P1 (Deliverable importante)

---

## 🎯 Template Criteri (VAS Value Tree Inspired)

### Template 1: Digital Transformation
```
Strategic Alignment (25%)
├─ Business Model Impact (SOFT, min: 3)
├─ Customer Experience Value (SOFT, min: 3)
└─ Competitive Advantage (SOFT, min: 3)

Financial Impact (30%)
├─ Revenue Potential (SOFT, min: 3)
├─ Cost Efficiency (SOFT, min: 2)
└─ ROI Timeline (SOFT, min: 3)

Operational Feasibility (25%)
├─ Technical Complexity (SOFT, min: 2)
├─ Resource Availability (HARD gate)
└─ Time to Market (SOFT, min: 3)

Risk & Compliance (20%)
├─ Regulatory Risk (HARD gate)
├─ Data Privacy (HARD gate)
└─ Change Management (SOFT, min: 2)
```

### Template 2: Product Innovation
```
Market Opportunity (30%)
├─ Market Size (SOFT, min: 3)
├─ Customer Pain Point (SOFT, min: 4)
└─ Differentiation (SOFT, min: 3)

Strategic Fit (25%)
├─ Brand Alignment (SOFT, min: 3)
├─ Portfolio Strategy (SOFT, min: 3)
└─ Long-term Vision (SOFT, min: 2)

Execution Capability (25%)
├─ Team Capability (HARD gate)
├─ Technology Readiness (SOFT, min: 3)
└─ Budget Availability (HARD gate)

Sustainability (20%)
├─ Scalability (SOFT, min: 3)
├─ Environmental Impact (SOFT, min: 2)
└─ Social Value (SOFT, min: 2)
```

### Template 3: VAS Insurance (Generali-style)
```
Customer Value (35%)
├─ Policyholder Benefits (SOFT, min: 4)
├─ Service Quality Impact (SOFT, min: 3)
└─ Digital Experience (SOFT, min: 3)

Business Impact (30%)
├─ Premium Growth Potential (SOFT, min: 3)
├─ Cross-sell Opportunity (SOFT, min: 2)
└─ Brand Enhancement (SOFT, min: 3)

Operational Viability (20%)
├─ Implementation Complexity (SOFT, min: 2)
├─ Partner Ecosystem (SOFT, min: 3)
└─ Regulatory Compliance (HARD gate)

Strategic Alignment (15%)
├─ Company Strategy Fit (SOFT, min: 4)
├─ Market Positioning (SOFT, min: 3)
└─ Innovation Leadership (SOFT, min: 2)
```

### Categorie Standard per Criteri
```
📊 Categories:
- Strategic      (Long-term vision, market position)
- Financial      (Revenue, costs, ROI)
- Operational    (Execution, resources, timeline)
- Risk           (Compliance, security, change management)
- Customer       (Experience, satisfaction, value)
- Innovation     (Differentiation, technology, IP)

🎯 Criterion Types:
- HARD gate     → Binary pass/fail (must score ≥ threshold)
- SOFT scoring  → Weighted in total score calculation

📏 Weight Distribution Best Practices:
- No single criterion > 40%
- No category > 50%
- Balance strategic vs operational
- Higher weights for differentiating factors
```

---

## 📋 Piano di Implementazione

### **FASE 1: Core Workflow (P0)** - ~3-4 giorni
Obiettivo: Workflow end-to-end funzionante senza AI avanzata

#### Task 1.1: Criteria Management UI (ispirato a VAS Value Tree)
```
✅ Backend ready
□ Create: apps/web/src/app/dashboard/projects/[id]/criteria/page.tsx
□ Components:
  - CriteriaList (table con weight, category, type)
    - Visual: progress bar per weight distribution
    - Color coding per category
    - Badge HARD/SOFT type
  - AddCriterionDialog (form con validazione)
    - Name input (max 6 parole)
    - Description textarea
    - Weight slider (0-100%, auto-normalize)
    - Category select (Strategic, Financial, Operational, Risk)
    - Type toggle (HARD gate / SOFT scoring)
    - Min threshold input (per SOFT criteri)
  - EditCriterionDialog (same as Add)
  - WeightDistributionChart (visual pesi per categoria)
□ Hooks:
  - useCriteria(projectId)
  - useAddCriterion()
  - useUpdateCriterion()
  - useDeleteCriterion()
  - useNormalizeCriteriaWeights() // Auto-balance weights
□ Validations:
  - Max 6 parole per nome
  - Min 3, max 8 criteri
  - Weight 0-100% (sum = 100%)
  - Auto-normalize on weight change
  - Category required
  - Min threshold only for SOFT type
□ UX Features (VAS-inspired):
  - Drag & drop per riordinare criteri
  - Preset templates (Innovation, Product, Digital Transformation)
  - Weight suggestions AI (optional)
  - Duplicate criterion feature
```

**Files da creare**:
- `apps/web/src/app/dashboard/projects/[id]/criteria/page.tsx`
- `apps/web/src/components/add-criterion-dialog.tsx`
- `apps/web/src/components/criteria-list.tsx`
- `apps/web/src/hooks/use-criteria.ts`

---

#### Task 1.2: Scoring UI (VAS Value Tree Matrix Style)
```
✅ Backend ready
□ Create: apps/web/src/app/dashboard/projects/[id]/scoring/page.tsx
□ Components:
  - ScoringMatrix (inspired by VAS Value Tree evaluation grid)
    - Rows: Initiatives
    - Columns: Criteria (grouped by category)
    - Cells: 1-5 score input with color gradient
    - Fixed header/column for large datasets
    - Auto-save on input blur
  - ScoreInput (inline editable cell)
    - 1-5 select dropdown OR
    - Star rating visual (1-5 stars)
    - Hover tooltip con criterion description
    - Color coding: 1=red, 3=yellow, 5=green
  - CategoryColumn (visual grouping criteri per categoria)
  - TotalScoreColumn (auto-calculated weighted score)
    - Visual: Progress bar + number
    - Breakdown: Click per vedere contribution per criterion
  - InitiativeRow (collapsible per dettagli)
  - BulkActionsToolbar
    - Score multiple initiatives at once
    - Copy scores from another initiative
    - Import scores from CSV
□ Logic:
  - Matrix state management (2D array)
  - Debounced auto-save (500ms)
  - Real-time weighted total calculation
  - Undo/Redo support
  - Keyboard navigation (arrow keys)
□ API integration:
  - POST /api/scoring (batch save)
  - GET /api/scoring/:initiativeId
  - GET /api/projects/:id/scoring-matrix (all data)
□ UX Features (VAS-inspired):
  - Heat map view (color intensity per score)
  - Comparison mode (compare 2 initiatives side-by-side)
  - Progress indicator (% initiatives scored)
  - Validation: Alert if not all criteria scored
  - Export current matrix to Excel
```

**Files da creare**:
- `apps/web/src/app/dashboard/projects/[id]/scoring/page.tsx`
- `apps/web/src/components/scoring-grid.tsx`
- `apps/web/src/hooks/use-scoring.ts`

---

#### Task 1.3: Ranking Integration
```
⚠️ Backend da completare (integra Ranker core)
□ Backend: ranking.service.ts
  - Integrate @themis/core Ranker
  - Calculate scores from DB
  - Return ranked list
□ Frontend: apps/web/src/app/dashboard/projects/[id]/ranking/page.tsx
□ Components:
  - RankingTable (ordinata per score)
  - Top3Podium (visual top 3)
  - ScoreBreakdown (dettaglio criteri)
□ Real-time: Auto-update on new scores
```

**Files da modificare/creare**:
- `apps/api/src/ranking/ranking.service.ts` (integrate Ranker)
- `apps/web/src/app/dashboard/projects/[id]/ranking/page.tsx`
- `apps/web/src/components/ranking-table.tsx`

---

### **FASE 2: AI Features (P1)** - ~2-3 giorni
Obiettivo: Integrare AI per feasibility, generation, briefs

#### Task 2.1: Feasibility Check
```
□ Backend: generation.controller.ts
  @Post('feasibility')
  - Input: criteria + initiatives
  - Use: EnrichmentService.evaluate()
  - Output: { approved: [], rejected: [{id, reason}] }
□ Frontend: Auto-check dopo initiative creation
  - Show badge approved/rejected
  - Modal with rejection reason
□ Prompt: Add feasibility_check template
```

---

#### Task 2.2: AI Initiative Generation UI
```
✅ Backend: POST /api/generation/initiatives exists
□ Frontend: apps/web/src/app/dashboard/projects/[id]/generate/page.tsx
□ Components:
  - GenerateInitiativesForm
    - Input: business context (textarea)
    - Input: count (slider 1-20)
    - Button: Generate
  - GeneratedInitiativesList
    - Review/Edit/Accept/Reject
    - Save selected to project
□ Flow:
  1. User inputs context
  2. AI generates N initiatives
  3. User reviews and selects
  4. Save to DB
```

---

#### Task 2.3: Concept Brief Generation
```
✅ Backend: POST /api/generation/brief exists
□ Backend: Auto-trigger for top 3 after ranking
□ Frontend: apps/web/src/app/dashboard/projects/[id]/briefs/page.tsx
□ Components:
  - BriefCard (concept display)
    - Executive summary
    - Rationale
    - Risks
    - Differentiators
  - GenerateBriefButton
□ Display: 10-12 lines formatted
```

---

### **FASE 3: Export & Polish (P2)** - ~1-2 giorni

#### Task 3.1: Markdown Export
```
□ Backend: export.controller.ts
  @Get('report')
  - Fetch project + criteria + initiatives + scores + ranking + briefs
  - Generate markdown template
  - Return file download
□ Frontend: Export button on ranking page
□ Template: /export/THEMIS_output.md format
```

---

#### Task 3.2: Visual Inspiration (Optional V1.1)
```
□ Prompt generation: imagePrompt field in brief
□ API integration: DALL-E or Replicate
□ Storage: Save image URL in brief table
□ Display: Show image in brief card
```

---

#### Task 3.3: Onboarding Flow (Optional)
```
□ Create: apps/web/src/components/onboarding-wizard.tsx
□ Steps:
  1. Welcome
  2. What do you want to do? (textarea)
  3. What do you want to launch? (textarea)
  4. Save to project metadata
□ Show on first project creation
□ Skip option
```

---

## 🎯 Acceptance Criteria (PRD Compliance)

### Must Have V1.0
- [ ] Workflow completo in < 15 min
- [ ] Definizione criteri (3-8) con validazione
- [ ] Input iniziative (1-20) con bulk option
- [ ] Feasibility check AI funzionante
- [ ] Scoring 1-5 per criterio con UI grid
- [ ] Ranking automatico ordinato
- [ ] Top 3 evidenziati
- [ ] Concept generation AI per top 3
- [ ] Export markdown funzionante
- [ ] Tutti i campi obbligatori validati
- [ ] No crash con 20 iniziative
- [ ] AI response ≤ 8s

### Should Have V1.1 (Future)
- Template criteri salvabili
- Export CSV ranking
- Workspace multiutente
- AI effort/risk estimation

---

## 🚀 Quick Start Development

### Ordine Consigliato
1. **Start with Criteria UI** (blocca scoring)
2. **Scoring UI** (core workflow)
3. **Ranking Integration** (usa scoring)
4. **Feasibility Check** (AI feature)
5. **Brief Generation** (AI feature)
6. **Export Report** (deliverable)
7. **Polish & Testing**

### Test Strategy
- **Manual Test**: Full workflow end-to-end
- **API Test**: Postman collection per ogni endpoint
- **UI Test**: Playwright per happy path
- **Load Test**: 20 iniziative × 8 criteri

---

## 📦 Deliverables Finali

- [ ] Web app full-stack deployed su Railway
- [ ] Database Supabase production-ready
- [ ] Documentazione API completa (Swagger)
- [ ] README.md con setup instructions
- [ ] PRD.md (questo file)
- [ ] API.md con tutti gli endpoint
- [ ] User flow diagram
- [ ] Demo video 5 min

---

## 🎉 Success Metrics

**V1.0 Complete quando**:
✅ User può creare progetto
✅ User può definire 3-8 criteri
✅ User può aggiungere 5+ iniziative
✅ AI valida feasibility iniziative
✅ User può scorare tutte le iniziative
✅ Sistema genera ranking automatico
✅ Top 3 hanno concept brief AI
✅ User può esportare report markdown
✅ Tutto funziona in < 15 min

---

## 📝 Note Tecniche

### Tech Stack Confermato
```
Frontend:  Next.js 16 + React Query + Tailwind + shadcn/ui
Backend:   NestJS 10 + Prisma
Database:  Supabase PostgreSQL
AI:        OpenAI API (GPT-4)
Deploy:    Railway (frontend + backend)
Auth:      TBD (basic per V1, può essere hardcoded user)
```

### Environment Variables Required
```bash
# Backend (.env)
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
CORS_ORIGIN=https://themis-production-9c1d.up.railway.app
NODE_ENV=production

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://themis-production.up.railway.app/api
```

---

## 🏁 Next Immediate Action

**START HERE**: 
1. Implementa Criteria Management UI (Task 1.1)
2. Test CRUD criteri end-to-end
3. Procedi con Scoring UI (Task 1.2)

**Comando per iniziare**:
```bash
cd apps/web
mkdir -p src/app/dashboard/projects/[id]/criteria
touch src/app/dashboard/projects/[id]/criteria/page.tsx
```

---

**Status**: 📋 Piano pronto
**Owner**: Luca
**Timeline**: ~1 settimana per V1.0 complete
**Priority**: P0 tasks first, then P1, P2 optional

🚀 Let's ship Themis V1.0!
