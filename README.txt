RTSP to WebSocket 流媒体转换服务
================================

功能说明：
- 支持将RTSP视频流转换为WebSocket流
- 支持通过Web界面或API动态更换RTSP源
- 支持心跳检测，10分钟无心跳自动停止转码
- 提供Web界面进行测试和演示
- 支持Docker一键部署

端口说明：
- 8866: HTTP服务端口（Web界面和API）
- 9988: WebSocket视频流端口

API接口：
1. 启动/切换视频流
   POST http://localhost:8866/start
   Content-Type: application/json
   Body: {"rtspUrl": "rtsp://your-rtsp-url"}

2. 心跳维持（每10分钟至少一次）
   GET http://localhost:8866/heartbeat

使用要求：
- Node.js 14+
- FFmpeg
- Express
- WebSocket

快速开始：

1. Docker部署（推荐）：
   ```bash
   # 构建镜像
   docker build -t rtsp-stream .

   # 运行容器
   docker run -d -p 8866:8866 -p 9988:9988 rtsp-stream
   ```

2. 本地部署：
   ```bash
   # 安装依赖
   npm install

   # 启动服务
   node server-with-static.js
   ```

使用方法：

1. Web界面使用（推荐）：
   - 访问 http://localhost:8866
   - 在输入框中填入RTSP地址
   - 点击"开始播放"按钮开始播放
   - 点击"发送心跳"维持播放（也可以自动发送）
   - 点击"停止播放"按钮停止播放

2. API调用：
   ```bash
   # 启动流
   curl -X POST "http://localhost:8866/start" \
   -H "Content-Type: application/json" \
   -d '{"rtspUrl": "rtsp://username:password@ip:port/stream"}'

   # 发送心跳
   curl "http://localhost:8866/heartbeat"
   ```

注意事项：
1. RTSP地址格式：rtsp://username:password@ip:port/stream
2. 需要每10分钟发送一次心跳，否则服务器将自动停止转码
3. 开始新的流会自动关闭之前的流
4. 确保Docker环境或本地环境已安装FFmpeg

项目结构：
├── server.js            # 主服务器文件
├── package.json         # 项目依赖配置
├── Dockerfile          # Docker配置文件
├── static/             # 静态文件目录
│   └── jsmpeg.min.js   # 视频播放器库
├── templates/          # 模板文件目录
│   └── index.html      # Web界面
└── README.txt         # 说明文档

常见问题：
1. 如果播放失败，请检查：
   - RTSP地址是否正确
   - 网络连接是否正常
   - FFmpeg是否正确安装
   - 防火墙是否允许相关端口

2. 如果视频延迟较大：
   - 可以尝试调整FFmpeg参数
   - 检查网络带宽是否足够

3. 如果无法访问Web界面：
   - 确认8866端口是否正确映射
   - 检查防火墙设置

技术支持：
- 项目地址：https://github.com/songyi1999/rtsp_stream
- 问题反馈：https://github.com/songyi1999/rtsp_stream/issues