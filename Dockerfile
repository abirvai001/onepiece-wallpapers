# Base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma files so they are available
COPY prisma ./prisma
COPY prisma.config.ts* ./

# Use production schema for this build
RUN cp prisma/schema.production.prisma prisma/schema.prisma || true

# Install with --ignore-scripts to prevent postinstall (prisma generate) from running yet.
# We will generate explicitly in the builder stage after full source is available.
RUN npm ci --ignore-scripts

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure production schema is active for this build
RUN cp prisma/schema.production.prisma prisma/schema.prisma || true

# Generate Prisma client (needed for build/runtime)
RUN npx prisma generate

# Railway injects service variables at build time — required if any build step touches the DB
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

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

# Copy public static assets (categories, icons) — NOT uploads
COPY --from=builder /app/public ./public

# Remove public/uploads — wallpapers are stored outside public/ and served via /api/media
# Do NOT mount a Railway volume on public/uploads (causes lost+found EACCES errors)
RUN rm -rf ./public/uploads

# Copy the standalone server output (this places server.js at /app/server.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Standalone may re-copy public/uploads — remove again so Next.js never scans a volume mount here
RUN rm -rf ./public/uploads

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Persistent wallpaper storage — mount Railway volume at this path only
RUN mkdir -p /var/lib/postgresql/data && chown -R nextjs:nodejs /var/lib/postgresql/data

RUN apk add --no-cache su-exec

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV UPLOADS_DIR=/var/lib/postgresql/data

# Start as root to fix volume permissions, then run as nextjs
USER root
CMD ["sh", "-c", "chown -R nextjs:nodejs /var/lib/postgresql/data 2>/dev/null || true; exec su-exec nextjs node server.js"]
