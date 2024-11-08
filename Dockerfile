FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# 安装基础工具和依赖
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    yasm \
    cmake \
    libtool \
    libc6 \
    libc6-dev \
    unzip \
    wget \
    python3 \
    nodejs \
    npm

# 安装 FFmpeg 依赖
RUN apt-get install -y \
    libass-dev \
    libfreetype6-dev \
    libsdl2-dev \
    libtool \
    libva-dev \
    libvdpau-dev \
    libvorbis-dev \
    libxcb1-dev \
    libxcb-shm0-dev \
    libxcb-xfixes0-dev \
    texinfo \
    zlib1g-dev \
    nasm \
    libx264-dev \
    libx265-dev \
    libnuma-dev \
    libvpx-dev \
    libfdk-aac-dev \
    libmp3lame-dev \
    libopus-dev

# 安装 FFmpeg
RUN apt-get install -y ffmpeg

# 清理缓存
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装 Node.js 依赖
RUN npm install

# 暴露端口
EXPOSE 8866 9988

# 启动命令
CMD ["node", "server-with-static.js"]