FROM node:20-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./
COPY prisma ./prisma/

# Installa dipendenze (incluse dev per il build)
RUN npm install --production=false && \
    npm install -g tsx && \
    npx prisma generate

# Copia il codice sorgente
COPY . .

# Copia il file SQL per il seed nel dist
RUN mkdir -p dist/seed
COPY src/seed/schema.sql dist/seed/

# Build dell'applicazione
RUN npm run build

# Rimuovi devDependencies per ridurre dimensione
RUN npm prune --production

# Espone la porta
EXPOSE 4000

# Script di avvio: esegue migrazioni, seed e avvia l'app
CMD sh -c "echo '🔨 Running database migrations...' && \
    npx prisma migrate deploy && \
    echo '🌱 Seeding database...' && \
    npx tsx prisma/seed.ts && \
    echo '🚀 Starting server...' && \
    node dist/main.js"
