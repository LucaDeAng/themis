# 🚀 Guida Deploy Completa - GitHub + Vercel

## ✅ Step 1: Push su GitHub

### Opzione A: Crea Repository via GitHub.com (Consigliato)

1. **Vai su GitHub.com**
   - Login al tuo account
   - Click su "+" in alto a destra → "New repository"

2. **Configura Repository**
   ```
   Repository name: themis
   Description: AI-powered initiative prioritization platform
   Visibility: Public (o Private se preferisci)
   
   ❌ NON selezionare:
   - Add a README
   - Add .gitignore
   - Choose a license
   (Abbiamo già questi file!)
   ```

3. **Crea il Repository**
   - Click "Create repository"
   - GitHub ti mostra le istruzioni per il push

4. **Push del Codice Locale**
   ```bash
   # Copia questi comandi nel terminale:
   cd "c:\Users\l.de.angelis\OneDrive - Accenture\Desktop\Themis"
   
   git remote add origin https://github.com/TUO_USERNAME/themis.git
   git branch -M main
   git push -u origin main
   ```

### Opzione B: GitHub CLI (Automatico)

```bash
# Installa GitHub CLI se non lo hai: https://cli.github.com/

# Login
gh auth login

# Crea repository e push automatico
cd "c:\Users\l.de.angelis\OneDrive - Accenture\Desktop\Themis"
gh repo create themis --public --source=. --remote=origin --push
```

---

## ✅ Step 2: Deploy Frontend su Vercel

### Metodo 1: Deploy con GitHub Integration (CONSIGLIATO)

1. **Vai su Vercel**
   - Apri [vercel.com](https://vercel.com)
   - Click "Sign Up" o "Login"
   - Scegli "Continue with GitHub"

2. **Importa Repository**
   - Click "Add New..." → "Project"
   - Seleziona il repository `themis`
   - Click "Import"

3. **Configura Build Settings**
   
   Vercel dovrebbe auto-rilevare Next.js, ma verifica:
   
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**
   
   Click "Environment Variables" e aggiungi:
   
   ```env
   Name: NEXT_PUBLIC_API_URL
   Value: http://localhost:4000
   (Aggiorna dopo quando hai deployato il backend)
   ```

5. **Deploy!**
   - Click "Deploy"
   - Vercel inizia il build (ci vogliono 2-3 minuti)
   - URL sarà tipo: `https://themis-xxx.vercel.app`

### Metodo 2: Deploy via Vercel CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd "c:\Users\l.de.angelis\OneDrive - Accenture\Desktop\Themis\apps\web"
vercel

# Segui il wizard:
# - Set up and deploy? Y
# - Which scope? (il tuo account)
# - Link to existing project? N
# - Project name: themis
# - Directory: ./
# - Override settings? N

# Deploy in production
vercel --prod
```

---

## ✅ Step 3: Deploy Backend su Railway (CONSIGLIATO)

### Perché Railway?
- ✅ Free tier generoso ($5/mese di credito)
- ✅ PostgreSQL database incluso
- ✅ Deploy automatico da GitHub
- ✅ Zero config necessaria

### Setup Railway

1. **Vai su Railway.app**
   - [railway.app](https://railway.app)
   - "Login with GitHub"

2. **New Project**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Seleziona `themis`
   - Railway lo aggiunge automaticamente

3. **Aggiungi Database**
   - Click "New" nel progetto
   - Seleziona "Database" → "Add PostgreSQL"
   - Railway crea il database e genera `DATABASE_URL`

4. **Configura Backend Service**
   - Click sul service "themis"
   - Vai su "Settings"
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `node dist/main.js`
   - **Watch Paths**: `apps/api/**`

5. **Environment Variables**
   
   Click "Variables" e aggiungi:
   
   ```env
   # Database (auto-generated)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # AI Providers
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   
   # Config
   PORT=4000
   NODE_ENV=production
   LLM_PROVIDER=openai
   LLM_MODEL=gpt-4-turbo-preview
   ```

6. **Deploy**
   - Railway deploya automaticamente
   - Ottieni URL tipo: `https://themis-production.up.railway.app`

7. **Aggiorna Frontend**
   - Torna su Vercel
   - Settings → Environment Variables
   - Aggiorna `NEXT_PUBLIC_API_URL` con l'URL Railway
   - Redeploy: Deployments → ... → Redeploy

---

## ✅ Step 4: Setup Database

### Esegui Migrations su Railway

```bash
# Configura DATABASE_URL locale per puntare a Railway
# Copia DATABASE_URL da Railway Variables

cd apps/api

# Genera Prisma Client
pnpm prisma generate

# Esegui migrations
pnpm prisma migrate deploy

# (Opzionale) Seed dati demo
pnpm prisma db seed
```

### Apri Prisma Studio

```bash
# Per vedere il database Railway
DATABASE_URL="postgresql://..." pnpm prisma studio
```

---

## 🎯 Verifica Deploy

### Checklist

- [ ] **GitHub Repository**
  - Codice pushato su main
  - README visibile
  - No file .env committati

- [ ] **Vercel (Frontend)**
  - Build success (verde)
  - URL accessibile
  - Tutorial appare dopo 1 sec
  - Sidebar navigation funziona

- [ ] **Railway (Backend)**
  - Service running
  - Database connesso
  - Health check OK: `https://your-api.railway.app/health`

- [ ] **Integration**
  - Frontend chiama correttamente backend
  - No CORS errors nella console
  - Progetti creabili

### Test API

```bash
# Health check
curl https://your-api.railway.app/health

# Swagger docs
https://your-api.railway.app/api/docs

# Test endpoint
curl https://your-api.railway.app/api/projects
```

---

## 🔧 Troubleshooting

### Build Failed su Vercel

**Error: Cannot find module**
```bash
# Verifica che package.json sia corretto
# Prova build locale:
cd apps/web
npm install
npm run build
```

**Error: Environment variable not set**
```bash
# Vai su Vercel → Settings → Environment Variables
# Aggiungi NEXT_PUBLIC_API_URL
# Redeploy
```

### Backend 503 su Railway

**Database connection error**
```bash
# Verifica DATABASE_URL
# Format: postgresql://user:pass@host:5432/db?sslmode=require

# Test connessione:
psql $DATABASE_URL
```

**Build timeout**
```bash
# Railway ha timeout di 10 min
# Se build è troppo lento, usa cache:
# Build Command: pnpm install --frozen-lockfile && pnpm run build
```

### CORS Errors

**Frontend non può chiamare Backend**
```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://*.vercel.app'  // Per preview deploys
  ],
  credentials: true,
});
```

---

## 🚀 Deploy Automatico

### GitHub Actions (Opzionale)

Vercel e Railway deployan automaticamente ad ogni push su `main`.

Per configurare deploy su branch specifici:

**Vercel:**
- Settings → Git → Production Branch: `main`
- Settings → Git → Preview Branches: `All branches`

**Railway:**
- Settings → GitHub → Branch: `main`
- Settings → Watch Paths: `apps/api/**`

---

## 💰 Costi

### Vercel (Frontend)
- **Free Tier**: 
  - 100 GB bandwidth/mese
  - Unlimited deployments
  - Preview deployments
  - **GRATIS per progetti personali** ✅

### Railway (Backend + DB)
- **Free Tier**:
  - $5 credito/mese (gratis)
  - ~500 ore/mese
  - 1 GB RAM
  - PostgreSQL incluso
  - **Sufficiente per MVP** ✅

### Alternative Gratuite

**Backend:**
- **Render.com**: 750 ore/mese free
- **Fly.io**: 3 VM gratuite
- **Heroku**: $5/mese dopo free tier

**Database:**
- **Supabase**: 500 MB PostgreSQL free
- **Neon**: 3 GB PostgreSQL free
- **PlanetScale**: 5 GB MySQL free

---

## 📧 Prossimi Step

### Dopo il Deploy

1. **Custom Domain** (Opzionale)
   ```
   Vercel: Settings → Domains → Add themis.yourdomain.com
   Railway: Settings → Domains → Generate Domain
   ```

2. **Analytics**
   ```
   Vercel Analytics: Settings → Analytics → Enable
   ```

3. **Monitoring**
   ```
   Vercel: Deployment logs auto-disponibili
   Railway: Logs tab in real-time
   ```

4. **CI/CD**
   - Vercel: Deploy preview automatici per ogni PR
   - Railway: Deploy automatico su push a main

---

## ✅ Comando Rapido Recap

```bash
# 1. Push su GitHub
cd "c:\Users\l.de.angelis\OneDrive - Accenture\Desktop\Themis"
git remote add origin https://github.com/TUO_USERNAME/themis.git
git push -u origin main

# 2. Deploy Vercel
vercel --prod

# 3. Setup Railway
# Via web UI (più facile)
# https://railway.app → New Project → Deploy from GitHub

# Done! 🎉
```

---

**URL Finali:**
- Frontend: `https://themis.vercel.app`
- Backend: `https://themis-production.up.railway.app`
- Database: Railway managed PostgreSQL

**Tempo totale: ~15 minuti** ⚡
