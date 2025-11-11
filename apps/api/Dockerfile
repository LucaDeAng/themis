FROM node:20-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./

# Installa dipendenze (incluse dev per il build)
RUN npm install --production=false && \
    npm install -g tsx

# Copia il codice sorgente (include schema.prisma aggiornato)
COPY . .

# Genera Prisma client DOPO aver copiato lo schema aggiornato
RUN npx prisma generate

# Build dell'applicazione
RUN npm run build

# Rimuovi devDependencies per ridurre dimensione
RUN npm prune --production

# Espone la porta
EXPOSE 4000

# Avvia il server forzando DATABASE_URL a usare Supabase
CMD sh -c "export DATABASE_URL=\"${SUPABASE_DATABASE_URL}\" && node dist/main.js"
