# Base image
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm ci

# Copy app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app (Avoid Windows xcopy in Linux Alpine)
RUN npx @nestjs/cli build && cp -r src/generated dist/src/generated || true

# --- Production Image ---
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 3001

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
