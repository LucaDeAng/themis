# themis — personal product requirements document (prd)

> Nota: progetto personale. Rimosso ogni riferimento a consulenze o terze parti.  
> Vedi anche: [copilot kickoff](./copilot-kickoff.md)

## summary
Themis è uno strumento GenAI che aiuta team di prodotto/innovazione a **identificare, valutare e prioritizzare** iniziative. Dall’**intent** ai **criteri**, dai **requisiti** allo **scoring** 1–5, fino alla **shortlist ordinata** e a **concept brief** auto‑generati con ispirazioni visual.

## goals
- Funnel guidato: intent → criteri → iniziative → scoring → ranking → concept brief.
- Supporto sia alla **valutazione** di iniziative esistenti sia alla **generazione** di nuove idee.
- Scoring **trasparente ed esplicabile**, con pesi e tie‑break riproducibili.
- Export condivisibili (CSV/PDF/Slides) e collaborazione in **workspace**.

## non‑goals
- Market sizing/financial modeling avanzati (oltre template leggeri).
- Selezione fornitori o procurement.
- Sostituire la governance umana (Themis **supporta**, non rimpiazza).

## target users & personas
- **Product manager**: necessita ranking del backlog e allineamento stakeholder.
- **Innovation lead**: vuole far emergere velocemente concept ad alto potenziale.
- **R&D/tech lead**: valuta fattibilità e aderenza tecnologica.
- **Marketing strategist**: valuta impatto cliente/mercato e differenziazione.

## problem statement
Difficoltà a trasformare intent vaghi in liste prioritarie basate su evidenze. Criteri incoerenti tra team; fogli manuali soggetti a errori; creatività e scoring rigoroso raramente convivono nello stesso flusso.

## scope & primary use cases
1. **Allineare il ranking** alle priorità strategiche e agli obiettivi.  
2. **Identificare nuove iniziative** ad alto potenziale tramite ideazione guidata e arricchimento.  
3. **Ottimizzare il portafoglio** filtrando idee che non superano i requisiti minimi e valorizzando i top performer.

## user journey (happy path)
1. **Start** con due domande (intent capture): “Cosa vuoi fare?” e “Cosa vuoi lanciare?”  
2. **Definisci obiettivi strategici**, **criteri** e **requisiti** (gate hard vs. scoring soft).  
3. **Inserisci iniziative**: import CSV, inserimento manuale, o generazione da prompt. Il sistema **filtra** le candidate che falliscono i gate.  
4. **Score** su scala 1–5 per ogni criterio (con confidenza). Supporto team/individuale con calibrazione.  
5. **Rank** via pesi e tie‑break; vista di **explainability**.  
6. **Genera concept brief** (executive summary, rationale, rischi, metriche, image prompt) ed **export**.

## features
- **Intent capture & template** per settore/obiettivo.  
- **Criteria builder** con pesi, soglie minime e dipendenze opzionali.  
- **Idea generation & enrichment** (LLM), dedup, clustering.  
- **Requirements gating** (binary) prima dello scoring.  
- **Scoring workspace** 1–5, commenti, confidenza, keyboard‑first e bulk paste.  
- **Aggregation & reconciliation** (mediana/trimmed‑mean), pesi revisori, mappa disaccordo.  
- **Ranking** con somma pesata e **sensitivity analysis** (what‑if).  
- **Explainability**: contribution waterfall, radar per iniziativa, snippet motivazionali.  
- **Concept brief** con sezioni rigenerabili e image prompt.  
- **Portfolio view**: matrici (impatto × fattibilità), bubble chart, filtri/tag.  
- **Collaboration**: ruoli (owner/reviewer/viewer), versioning, commenti, activity log.  
- **Export**: CSV, PDF, PPTX one‑pager top idea; API JSON.

## functional requirements
- **FR1 — intent capture**: trasforma testo libero in obiettivi strutturati.  
- **FR2 — criteria builder**: crea/modifica criteri con pesi (0–100), soglie minime, tipo (hard/soft).  
- **FR3 — initiative intake**: import CSV; manuale; generazione via prompt.  
- **FR4 — requirements gate**: escludi automaticamente chi fallisce gate, con motivazioni.  
- **FR5 — scoring**: scala 1–5, confidenza opzionale; bulk edit; API.  
- **FR6 — aggregation**: multi‑revisore; metodo a scelta (mediana default).  
- **FR7 — ranking**: calcolo score complessivo; tie‑break (impatto, rischio, TTV).  
- **FR8 — explainability**: contributo per criterio e sensibilità ai pesi.  
- **FR9 — brief generation**: concept brief concisi editabili.  
- **FR10 — export & share**: CSV/PDF/PPTX, link condivisibili, permessi.  
- **FR11 — audit**: log immutabile di cambi criteri, punteggi, export.

### acceptance criteria (estratti)
- **AC‑FR4‑01**: un’iniziativa che fallisce un gate hard è esclusa e appare con i check falliti.  
- **AC‑FR7‑02**: a parità di score overall, ranking deciso da contributo **impatto**; poi **rischio**; poi **time‑to‑value**.  
- **AC‑FR9‑03**: il concept brief è rigenerabile per sezione ed editabile prima dell’export.

## non‑functional requirements
- **Performance**: 200 iniziative × 12 criteri × 5 revisori → ranking < 2s p95; brief < 10s p95.  
- **Affidabilità**: 99.9% uptime target; export idempotenti.  
- **Sicurezza**: OAuth2/OIDC, cifratura at‑rest/in‑transit, RBAC, audit log, minimizzazione PII.  
- **Privacy**: retention configurabile; isolamento dati per progetto.  
- **Cost control**: budget token per workspace + dashboard.  
- **i18n**: interfaccia e formati locale‑aware.

## architecture (proposta)
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui; stato con TanStack Query.  
- **Backend**: NestJS (TS) **o** FastAPI (Python). REST + WebSocket.  
- **Database**: PostgreSQL (**pgvector** per embedding/dedup).  
- **LLM layer**: interfaccia provider‑agnostic; registry prompt + eval harness.  
- **Analytics**: ClickHouse (eventi) + OpenTelemetry; DBT opzionale.  
- **Files/exports**: object storage (S3 compatibile).  
- **Auth**: OAuth2/OIDC (GitHub, Email magic link).  
- **CI/CD**: GitHub Actions; lint/typecheck/test/build; migrazioni.

## data model (alto livello)
- **User**(id, name, email, role)  
- **Workspace**(id, name, settings)  
- **Project**(id, workspace_id, title, status)  
- **Criterion**(id, project_id, name, weight, type, min_threshold)  
- **Requirement**(id, project_id, name, expression, is_hard_gate)  
- **Initiative**(id, project_id, title, description, source, tags)  
- **Score**(id, initiative_id, criterion_id, reviewer_id, value1_5, confidence)  
- **AggregateScore**(initiative_id, overall, by_criterion)  
- **RankList**(id, project_id, parameters, created_at)  
- **Brief**(id, initiative_id, sections, image_prompt, image_ref)  
- **ActivityLog**(id, actor, action, payload, ts)

## scoring & ranking
- Normalizzazione: `s = (value − 1) / 4` (1–5 → 0–1).  
- Somma pesata: `S = Σ (w_i * s_i)` con `Σ w_i = 1`.  
- **Gate hard**: esclusione prima dello scoring.  
- **Rischio (opz.)**: `S' = S × (1 − risk_index)` con `risk_index ∈ [0, 0.5]`.  
- **Tie‑break**: contributo **impatto** → TTV → confidenza revisori.  
- **Sensitivity**: `∂S/∂w_i = s_i` con slider dei pesi.

## ux & ui
- Tabella scoring minimale, keyboard‑friendly; paste da fogli.  
- Editor criteri con badge (hard/soft), pesi drag, soglie a chip.  
- Explainability: bar stack contributi, radar per iniziativa, heatmap disaccordo.  
- Editor brief con rigenerazione inline e anteprima image prompt.

## integrazioni (opzionali)
- Import CSV/Sheets.  
- Issue tracker (Jira/GitHub) per importare epiche.  
- Image generation provider per moodboard.

## analytics & metriche chiave
- **North Star**: tempo da brief a shortlist (p50).  
- **Activation**: % progetti con ≥5 criteri e ≥10 iniziative valutate.  
- **Quality**: disaccordo revisori ↓ su iterazioni; % adozione top‑3.  
- **Efficiency**: ore manuali risparmiate vs fogli.

## quality & testing
- Unit su scoring/gate/tie‑break.  
- Snapshot su brief (similarità semantica).  
- E2E: intent → rank → export.  
- Red‑team prompt e test injection.

## roadmap (suggerita)
- **M0–2 (MVP)**: criteria builder, intake (CSV/manuale), scoring, ranking, export.  
- **M3–4 (Alpha)**: LLM ideation, explainability, brief base.  
- **M5–6 (Beta)**: multi‑revisore, sensitivity, image prompt, API.  
- **M7–9 (GA)**: collaborazione, audit, SSO, usage dashboard.

## rischi & mitigazioni
- **Variabilità prompt** → libreria + eval harness; guardrail; temperature discipline.  
- **Gaming dei punteggi** → pesi revisori, audit log, outlier detection.  
- **Sensibilità dati** → cifratura, retention policy, modalità local‑only.

---
*Ultimo aggiornamento: 2025-11-08*
