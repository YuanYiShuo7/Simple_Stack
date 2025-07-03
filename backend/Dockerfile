# 使用 Node.js 官方镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p /usr/src/app/uploads/avatars

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["node", "src/server.js"]