
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build with cache busting
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add cache-busting headers
RUN echo 'add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";' >> /etc/nginx/conf.d/default.conf

EXPOSE 8090

CMD ["nginx", "-g", "daemon off;"]