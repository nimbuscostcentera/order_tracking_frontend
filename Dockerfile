FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Install env-cmd to load correct envs
# RUN npm install -g env-cmd

# Build React app using `prod` environment
# RUN env-cmd -e prod npm run build:prod
RUN npm run build:prod

# Serve build with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]