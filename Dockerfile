# ===== Stage 1: Vue アプリをビルド =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build

# ===== Stage 2: Nginx で配信 + リバースプロキシ =====
FROM nginx:alpine

# ビルド済みの静的ファイルをコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 設定をコピー
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# デフォルトの nginx.conf を上書きしてサーバー数を調整
RUN printf 'worker_processes auto;\n\
events { worker_connections 512; }\n\
http {\n\
    include       /etc/nginx/mime.types;\n\
    default_type  application/octet-stream;\n\
    sendfile      on;\n\
    keepalive_timeout 65;\n\
    client_max_body_size 20M;\n\
    include /etc/nginx/conf.d/*.conf;\n\
}\n' > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
