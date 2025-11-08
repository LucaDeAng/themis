# Themis - AI Initiative Prioritization Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fthemis)

> **Themis** è una piattaforma enterprise di decision-making intelligente che utilizza l'AI Generativa per prioritizzare iniziative strategiche in modo oggettivo, trasparente e data-driven.

## 🚀 Quick Deploy

### Deploy Frontend su Vercel (Consigliato)

1. **Click sul bottone "Deploy with Vercel" sopra**, oppure:

2. **Manuale:**
   ```bash
   # Push codice su GitHub
   git remote add origin https://github.com/YOUR_USERNAME/themis.git
   git push -u origin main
   
   # Vai su vercel.com
   # - Importa repository GitHub
   # - Framework preset: Next.js
   # - Root Directory: apps/web
   # - Build Command: npm run build
   # - Output Directory: .next
   ```

3. **Configura Variabili Ambiente su Vercel:**
   - `NEXT_PUBLIC_API_URL` → URL del tuo backend API
   - (Esempio: `https://themis-api.railway.app` o `http://localhost:4000` per dev)

### Deploy Backend API (Opzionale)

#### Opzione A: Railway.app

1. Vai su [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Seleziona `apps/api`
4. Aggiungi Database PostgreSQL
5. Configura variabili:
   ```
   DATABASE_URL → (auto-generato da Railway)
   OPENAI_API_KEY → tua chiave OpenAI
   ANTHROPIC_API_KEY → tua chiave Anthropic
   PORT → 4000
   ```

#### Opzione B: Render.com

1. Vai su [render.com](https://render.com)
2. "New Web Service" → Connetti GitHub
3. Root Directory: `apps/api`
4. Build Command: `pnpm install && pnpm run build`
5. Start Command: `node dist/main.js`
6. Aggiungi PostgreSQL database
7. Configura variabili ambiente (come Railway)

#### Opzione C: Heroku

```bash
# Installa Heroku CLI
cd apps/api
heroku create themis-api
heroku addons:create heroku-postgresql:mini
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
git subtree push --prefix apps/api heroku main
```

---

## 📦 Setup Locale

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org))
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (locale o [Supabase](https://supabase.com) gratuito)

### Installazione

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/themis.git
cd themis

# 2. Installa dipendenze
pnpm install

# 3. Setup database
cp .env.example .env
# Modifica .env con le tue credenziali

# 4. Prisma setup
cd apps/api
pnpm prisma generate
pnpm prisma migrate deploy

# 5. Avvia tutto
cd ../..
pnpm run dev
```

**Porte:**
- Frontend: http://localhost:3000
- API: http://localhost:4000
- Prisma Studio: `pnpm run studio` → http://localhost:5555

---

## 🔧 Variabili Ambiente

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (`apps/api/.env`)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/themis
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PORT=4000
```

---

## 📚 Documentazione

- **[Presentazione Business](./PRESENTAZIONE_BUSINESS.md)** - Value proposition e business model
- **[Frontend Migliorato](./FRONTEND_MIGLIORATO.md)** - Tutorial e features UI
- **[Quick Start Guide](./QUICKSTART.md)** - Guida completa setup
- **[Architecture](./ARCHITECTURE.md)** - Design tecnico

---

## 🎯 Features

- ✨ **AI Generativa** per ideazione iniziative
- 🎯 **Scoring Multi-Criterio** pesato e automatico
- 📊 **Ranking Dinamico** real-time con insights AI
- 📄 **Brief Automatici** con executive summary
- 🔄 **Import/Export** Excel, CSV, JSON
- 🔐 **Enterprise-Grade** security (GDPR compliant)

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- React Query

**Backend:**
- NestJS 10
- Prisma ORM
- PostgreSQL
- OpenAI / Anthropic / Ollama

**Infra:**
- Vercel (Frontend)
- Railway/Render (Backend)
- Supabase (Database)

---

## 📈 Roadmap

- [x] MVP Core Features
- [x] AI Integration (GPT-4, Claude, Ollama)
- [x] Tutorial & Onboarding
- [x] Settings Page
- [ ] Autenticazione (NextAuth.js)
- [ ] Collaboration Multi-User
- [ ] Analytics Dashboard
- [ ] Mobile App (React Native)

---

## 🤝 Contributing

Contributi benvenuti! Per favore leggi [CONTRIBUTING.md](./CONTRIBUTING.md) prima di fare PR.

---

## 📄 License

MIT License - vedi [LICENSE](./LICENSE) per dettagli.

---

## 💬 Support

- 📧 Email: support@themis.app
- 💬 Discord: [Join our community](https://discord.gg/themis)
- 📖 Docs: [docs.themis.app](https://docs.themis.app)

---

**Made with ❤️ by the Themis Team**

*Powered by Gen AI 🚀*
