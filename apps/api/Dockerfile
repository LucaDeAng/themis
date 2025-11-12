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

# Rigenera Prisma client a runtime e avvia il server
CMD sh -c "npx prisma generate && node dist/main.js"
