# RTSP to WebSocket Streaming Service

基于 FastAPI 的 RTSP 转 WebSocket 流媒体服务。

## 功能特性

- RTSP 视频流转换为 WebSocket 流
- 支持多路视频流同时转发
- 提供 REST API 接口控制流的开启和关闭
- 支持 Docker 部署

## 安装要求

- Python 3.8+
- FFmpeg
- 其他依赖见 requirements.txt

## 快速开始

### Docker 部署（推荐）

1. 构建 Docker 镜像:

```
docker build -t rtsp-stream .
```

2. 运行 Docker 容器:

```
docker run -d \
--name rtsp-stream \
-p 8000:8000 \
-p 9999:9999 \
rtsp-stream
```
(3.拉取镜像 可选)
```
docker pull songyi1999/rtsp-stream:latest

docker run -d \
--name rtsp-stream \
-p 8000:8000 \
-p 9999:9999 \
songyi1999/rtsp-stream:latest
```


### 本地部署

1. 安装依赖:

```
pip install -r requirements.txt
```
2. 启动服务:

```
uvicorn main:app --host 0.0.0.0 --port 8000
```
## 使用方法

### 方式一：Web界面操作（推荐）

1. 在浏览器访问: `http://localhost:8000`
2. 在输入框中输入RTSP地址，例如: 
   ```
   rtsp://admin:password@192.168.1.100:554/stream
   ```
3. 点击"开始播放"按钮开始播放
4. 需要停止时点击"停止播放"按钮

### 方式二：API 接口调用

#### 开启视频流
```
curl -X POST "http://localhost:8000/stream/start" \
-H "Content-Type: application/json" \
-d '{
"rtsp_url": "rtsp://admin:password@192.168.1.100:554/stream",
"ws_port": 9999
}'
```

#### 停止视频流

```
curl -X POST "http://localhost:8000/stream/stop" \
-H "Content-Type: application/json" \
-d '{
"ws_port": 9999
}'
```

## 注意事项

1. RTSP URL 格式：
   ```
   rtsp://username:password@ip:port/stream
   ```

2. 端口说明：
   - 8000: Web界面和API接口
   - 9999: WebSocket视频流传输

3. 确保：
   - Docker容器有足够权限访问RTSP源
   - 如果RTSP源在内网，需要确保Docker容器能够访问到对应的网络
   - 如需修改端口，需要同时修改Docker运行参数和代码中的相应配置

## 项目结构
── main.py # FastAPI 主程序
├── rtsp_stream.py # RTSP流处理类
├── requirements.txt # Python依赖
├── Dockerfile # Docker配置文件
├── templates/ # HTML模板
│ └── index.html # Web界面
└── static/ # 静态文件
└── jsmpeg.min.js # JSMpeg播放器