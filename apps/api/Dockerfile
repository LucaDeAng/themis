FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@9.1.0

WORKDIR /app

# Copy root package files for workspace context
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./

# Copy API package files
COPY package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . ./apps/api/

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN pnpm prisma generate && pnpm build

# Expose port
EXPOSE 10000

# Start server
CMD ["node", "dist/main.js"]
