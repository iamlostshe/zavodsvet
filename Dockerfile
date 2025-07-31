# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy source code
COPY . .

# Install dependencies
RUN bun i

# Build the application
RUN bun run build-only

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /var/www/html/

# Set proper permissions
RUN chown -R nginx:nginx /var/www/html /var/cache/nginx /var/run /var/log/nginx

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
