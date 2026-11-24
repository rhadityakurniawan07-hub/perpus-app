# Dockerfile for PERPUS API (NestJS)

# =============================================================================
# Base image
# =============================================================================
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package-lock.json* ./apps/api/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN npm ci --workspaces --include-workspace-root

# =============================================================================
# Build the application
# =============================================================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN cd packages/prisma-client && npx prisma generate

# Build API application
RUN npm run build --workspace=@perpus-app/api

# =============================================================================
# Production image
# =============================================================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/package.json ./package.json
COPY --from=builder --chown=nestjs:nestjs /app/packages/prisma-client/prisma ./prisma

USER nestjs

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/main.js"]