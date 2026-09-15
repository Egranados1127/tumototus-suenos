# ─── BUILD STAGE ───────────────────────────────────────────────
FROM node:20-slim AS builder

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS app
RUN npx @nestjs/cli build && cp -r src/generated dist/src/generated || true

# ─── PRODUCTION STAGE ──────────────────────────────────────────
FROM node:20-slim AS production

# Install openssl for Prisma runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
