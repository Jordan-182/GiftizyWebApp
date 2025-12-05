# Dockerfile (multi-stage) - optimized for Next.js w/ Prisma
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# Copy sources
COPY . .

# Generate prisma client & build
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built artifacts + node_modules (only prod)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy entrypoint script
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER appuser
EXPOSE 3000
ENV PORT=3000
CMD ["/entrypoint.sh"]
