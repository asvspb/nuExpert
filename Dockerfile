FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# We disable telemetry to avoid interactive prompts
ENV NUXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built assets
COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_TELEMETRY_DISABLED=1

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Start Nitro server
CMD ["node", ".output/server/index.mjs"]
