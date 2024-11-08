FROM node:16-slim

# 安装FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 创建工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 创建目录结构
RUN mkdir -p static templates

# 复制源代码和静态文件
COPY server-with-static.js ./server.js
COPY templates/index.html templates/
COPY static/jsmpeg.min.js static/

# 暴露端口
EXPOSE 8866 9988

# 启动服务
CMD ["node", "server.js"]