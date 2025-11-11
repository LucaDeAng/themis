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

# Avvia direttamente il server (database già configurato)
CMD ["node", "dist/main.js"]
