# 使用 Node.js 官方镜像
FROM node:latest

# 设置工作目录
WORKDIR /usr/src/app

RUN npm install pnpm -g

# 复制源代码
COPY . .

RUN pnpm install

# 创建上传目录
RUN mkdir -p /usr/src/app/uploads/avatars

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["node", "src/server.js"]