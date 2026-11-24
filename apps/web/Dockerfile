# Dockerfile for PERPUS Web (Next.js)

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
COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/
COPY packages/*/package.json ./packages/

# Install dependencies (use bun if available, fallback to npm)
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

# Build web application
RUN npm run build --workspace=@perpus-app/web

# =============================================================================
# Production image
# =============================================================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]