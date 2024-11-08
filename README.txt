RTSP to WebSocket 流媒体转换服务
================================

功能说明：
- 支持将RTSP视频流转换为WebSocket流
- 支持通过POST请求动态更换RTSP源
- 支持心跳检测，10分钟无心跳自动停止转码
- WebSocket端口：9988
- HTTP服务端口：8866

API接口：
1. 启动/切换视频流
   POST http://localhost:8866/start
   Content-Type: application/json
   Body: {"rtspUrl": "rtsp://your-rtsp-url"}

2. 心跳维持
   GET http://localhost:8866/heartbeat

使用要求：
- Node.js 14+
- FFmpeg

安装步骤：
1. 安装依赖：npm install
2. 启动服务：node server.js

Docker部署：
1. 构建镜像：docker build -t rtsp-stream .
2. 运行容器：docker run -d -p 8866:8866 -p 9988:9988 rtsp-stream 