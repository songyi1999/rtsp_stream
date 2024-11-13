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
   POST http://<your-domain>:8866/start
   Content-Type: application/json
   Body: {"rtspUrl": "rtsp://your-rtsp-url"}

2. 心跳维持（每10分钟至少一次）
   GET http://<your-domain>:8866/heartbeat

3. 停止视频流
   POST http://<your-domain>:8866/stop

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
   docker run -d \
     -p 8866:8866 \
     -p 9988:9988 \
     rtsp-stream
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
   - 访问 http://<your-domain>:8866
   - 在输入框中填入RTSP地址
   - 点击"开始播放"按钮开始播放
   - 点击"发送心跳"维持播放（也可以自动发送）
   - 点击"停止播放"按钮停止播放

2. API调用：
   ```bash
   # 启动流
   curl -X POST "http://<your-domain>:8866/start" \
   -H "Content-Type: application/json" \
   -d '{"rtspUrl": "rtsp://username:password@ip:port/stream"}'

   # 发送心跳
   curl "http://<your-domain>:8866/heartbeat"

   # 停止流
   curl -X POST "http://<your-domain>:8866/stop"
   ```

注意事项：
1. RTSP地址格式：rtsp://username:password@ip:port/stream
2. 需要每10分钟发送一次心跳，否则服务器将自动停止转码
3. 开始新的流会自动关闭之前的流
4. 确保Docker环境或本地环境已安装FFmpeg
5. 确保防火墙开放8866和9988端口

# Nginx 配置说明

## 1. Windows 安装 Nginx：
1. 下载 Nginx
   - 访问 http://nginx.org/en/download.html
   - 下载最新稳定版本（如：nginx-1.24.0.zip）
   - 解压到指定目录（如：C:\nginx）

2. 启动和管理 Nginx
   ```bash
   # 启动 Nginx
   start nginx

   # 停止 Nginx
   nginx -s stop

   # 重新加载配置
   nginx -s reload

   # 测试配置文件语法
   nginx -t
   ```

## 2. SSL 证书配置：
1. 在 Nginx 目录下创建 ssl 文件夹：
   ```bash
   mkdir C:\nginx\ssl
   ```

2. 将 SSL 证书文件放入 ssl 文件夹：
   - rtsp.xinpanmen.com_bundle.pem
   - rtsp.xinpanmen.com.key

## 3. Nginx 配置文件（C:\nginx\conf\nginx.conf）：
```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    # HTTPS 服务器配置
    server {
        listen       443 ssl;
        server_name  rtsp.xinpanmen.com;

        # SSL证书配置
        ssl_certificate      C:/nginx/ssl/rtsp.xinpanmen.com_bundle.pem;
        ssl_certificate_key  C:/nginx/ssl/rtsp.xinpanmen.com.key;

        # SSL配置
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        # 反向代理 HTTP 请求
        location / {
            proxy_pass http://localhost:8866;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # 反向代理 WebSocket
        location /ws {
            proxy_pass http://localhost:9988;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }

    # HTTP 重定向到 HTTPS
    server {
        listen       80;
        server_name  rtsp.xinpanmen.com;
        return 301 https://$server_name$request_uri;
    }
}
```

## 4. 系统配置：
1. 修改 hosts 文件（C:\Windows\System32\drivers\etc\hosts）：
   ```
   127.0.0.1 rtsp.xinpanmen.com
   ```

2. 开放防火墙端口：
   - 80 (HTTP)
   - 443 (HTTPS)
   - 8866 (Node.js 服务)
   - 9988 (WebSocket)

## 5. 完整部署流程：
1. 安装并配置 Nginx
   ```bash
   # 下载并解压 Nginx
   # 配置 SSL 证书
   # 修改 nginx.conf
   # 启动 Nginx
   start nginx
   ```

2. 启动 Node.js 服务
   ```bash
   # 安装依赖
   npm install

   # 启动服务
   node server-with-static.js
   ```

3. 验证服务
   - 访问 https://rtsp.xinpanmen.com
   - 测试 RTSP 流播放
   - 确认 WebSocket 连接正常

## 6. 维护和故障排查：
1. 查看 Nginx 日志：
   - 访问日志：C:\nginx\logs\access.log
   - 错误日志：C:\nginx\logs\error.log

2. 常见问题处理：
   - 502 Bad Gateway：检查 Node.js 服务是否正常运行
   - SSL 证书错误：检查证书文件路径和权限
   - WebSocket 连接失败：检查 Nginx 配置和防火墙设置

3. 证书更新：
   - 替换 ssl 目录下的证书文件
   - 重新加载 Nginx 配置：nginx -s reload

4. 服务重启流程：
   ```bash
   # 停止 Nginx
   nginx -s stop
   
   # 停止 Node.js 服务
   # 使用任务管理器或命令行关闭 node 进程
   
   # 启动 Node.js 服务
   node server-with-static.js
   
   # 启动 Nginx
   start nginx
   ```

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
   - 考虑降低视频帧率

3. 如果无法访问Web界面：
   - 确认8866端口是否正确映射
   - 检查防火墙设置
   - 确认域名解析是否正确

技术支持：
- 项目地址：https://github.com/songyi1999/rtsp_stream
- 问题反馈：https://github.com/songyi1999/rtsp_stream/issues