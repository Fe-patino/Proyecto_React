# ---- Etapa 1: construir la app con Vite ----
FROM node:22-alpine AS build
WORKDIR /app

# Primero solo los package*.json: se reutiliza la capa si no cambian las dependencias
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---- Etapa 2: servir los archivos estáticos con nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
