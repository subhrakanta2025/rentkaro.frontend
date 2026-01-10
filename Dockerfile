# Multi-stage build for Vite React app targeting Cloud Run
FROM node:20-alpine AS build

WORKDIR /app

# Build-time API base URL (Vite reads VITE_* at build time). Override at build if needed.
ARG VITE_API_URL="http://127.0.0.1:8085/api"
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies
COPY package*.json bun.lockb* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime image ---
FROM nginx:1.27-alpine AS runtime

# Copy compiled assets
COPY --from=build /app/dist /usr/share/nginx/html

# SPA-friendly nginx config (serves index.html for client routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
