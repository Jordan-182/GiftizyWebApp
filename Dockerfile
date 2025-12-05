# Dockerfile (multi-stage) - optimized for Next.js w/ Prisma
# Build stage
FROM node:22-slim AS builder
WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install pnpm and build deps
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy sources
COPY . .

# Generate prisma client with correct engine for Alpine
RUN pnpm exec prisma generate
RUN pnpm run build

# Production image
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd --system --gid 1001 appgroup \
  && useradd --system --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

# Copy built artifacts + node_modules (only prod)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

# Copy entrypoint script
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER appuser
EXPOSE 3000
ENV PORT=3000
CMD ["/entrypoint.sh", "npm", "start"]
