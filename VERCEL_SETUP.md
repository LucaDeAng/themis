# Environment variables per Vercel Deploy

## Variabili Richieste

Configura queste variabili su Vercel Dashboard (Settings → Environment Variables):

### Frontend (Next.js)

```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### Backend (Se deployed separatamente)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# AI Provider (almeno uno)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Config
PORT=4000
NODE_ENV=production
LLM_PROVIDER=openai
```

## Setup Vercel

1. **Connetti GitHub**
   - Vai su vercel.com/new
   - Importa il repository GitHub
   
2. **Configura Build Settings**
   - Framework Preset: **Next.js**
   - Root Directory: **apps/web**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Aggiungi Environment Variables**
   ```
   NEXT_PUBLIC_API_URL → https://your-backend-url.com
   ```

4. **Deploy!**
   - Click "Deploy"
   - Il deploy automatico parte ad ogni push su main

## Note Importanti

⚠️ **Database**: Usa Supabase/Neon gratuito per PostgreSQL managed
⚠️ **API Keys**: Non committare mai le chiavi nel codice!
⚠️ **CORS**: Configura CORS nel backend per accettare richieste da Vercel domain
