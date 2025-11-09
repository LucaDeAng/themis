FROM node:20-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./
COPY prisma ./prisma/

# Installa dipendenze (incluse dev per il build)
RUN npm install --production=false && \
    npm install -g tsx

# Copia il codice sorgente (include schema.prisma aggiornato)
COPY . .

# Genera Prisma client con il nuovo schema
RUN npx prisma generate

# Build dell'applicazione
RUN npm run build

# Rimuovi devDependencies per ridurre dimensione
RUN npm prune --production

# Espone la porta
EXPOSE 4000

# Script di avvio: db push (crea/aggiorna schema), seed e avvia
CMD sh -c "echo '🔨 Pushing database schema...' && \
    npx prisma db push --accept-data-loss --skip-generate && \
    echo '🌱 Seeding database...' && \
    npx tsx prisma/seed.ts && \
    echo '🚀 Starting server...' && \
    node dist/main.js"
