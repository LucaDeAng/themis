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

# Build dell'applicazione
RUN npm run build

# Rimuovi devDependencies per ridurre dimensione
RUN npm prune --production

# Espone la porta
EXPOSE 4000

# Script di avvio: crea schema, seed e avvia l'app
CMD sh -c "npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts && node dist/main.js"
