# ------------------------------------------------------
# 🧱 Base Image
# ------------------------------------------------------
FROM node:18-slim AS base

WORKDIR /app

# Install essential dependencies
RUN apt-get update -y && \
    apt-get install -y openssl libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files first (for caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# ------------------------------------------------------
# 🧩 Prisma and Build Layer
# ------------------------------------------------------
FROM base AS build

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# ------------------------------------------------------
# 🚀 Final Runtime Image
# ------------------------------------------------------
FROM base AS runtime

WORKDIR /app

# Copy scripts and make entrypoint executable
COPY scripts ./scripts/
RUN chmod +x ./scripts/docker-entrypoint.sh

# Copy application source code
COPY . .

# Copy generated Prisma client from build stage
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/prisma /app/prisma

# Expose backend port
EXPOSE 8000

# Default environment variable for production
ENV NODE_ENV=production

# Start the app using entrypoint script
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
