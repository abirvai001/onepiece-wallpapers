# Base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma files BEFORE npm ci because "postinstall": "prisma generate" runs immediately
COPY prisma ./prisma
COPY prisma.config.ts* ./

# For production Docker builds, use the production schema (PostgreSQL)
RUN cp prisma/schema.production.prisma prisma/schema.prisma || true

RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure production schema is active for this build
RUN cp prisma/schema.production.prisma prisma/schema.prisma || true

# Generate Prisma client (needed for build/runtime)
RUN npx prisma generate

# Build the application (standalone output enabled in next.config)
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry if desired
# ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder (for static assets + uploads target)
COPY --from=builder /app/public ./public

# Copy the standalone server output (this places server.js at /app/server.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure uploads directory exists (volume will mount over it)
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the standalone server
CMD ["node", "server.js"]
