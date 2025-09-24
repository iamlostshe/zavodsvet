# Insall Bun
FROM oven/bun:latest AS builder

# Copy all app
COPY . .

# Install dependencies
RUN bun i

# Build the app
RUN bun run build-only

# Insall Nginx
FROM nginx:latest

# Copy the built files from the builder stage
COPY dist/ /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
