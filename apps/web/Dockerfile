FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm - Updated Nov 17 2025
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/core/package.json ./packages/core/

# Install dependencies  
RUN pnpm install

# Copy source files
COPY . .

# Build the app
WORKDIR /app/apps/web
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build

# Expose port and start
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
