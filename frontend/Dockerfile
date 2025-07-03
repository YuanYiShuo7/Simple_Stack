# 构建阶段
FROM node:latest as build-stage
WORKDIR /app

RUN npm install pnpm -g

COPY . .

RUN pnpm install

RUN pnpm run build

# 生产阶段
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]