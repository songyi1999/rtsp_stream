const express = require('express')
const http = require('http')
const url = require('url')
const Stream = require('node-rtsp-stream')
const path = require('path')

const app = express()

// 设置静态文件服务
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(express.json())

// 设置首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'))
})

let stream
let lastHeartbeat = Date.now()
let heartbeatTimer

function start(rtspUrl) {
    stop()
    
    stream = new Stream({
        name: 'stream',
        streamUrl: rtspUrl,
        wsPort: 9988,
        ffmpegOptions: {
            // '-r': 50,
            // '-s': '1024x768',
            
            '-rtsp_transport': 'tcp',        // 强制使用 TCP
            '-stimeout': '30000000',         // 设置超时时间
            '-analyzeduration': '15000000',  // 增加分析时间
            '-probesize': '15000000',        // 增加探测大小
            '-bufsize': '5000k',             // 增加缓冲区大小
            '-i': rtspUrl,
            '-r': 25,                        // 帧率
            '-q': 0,                         // 质量参数
            '-f': 'mpegts',                  // 输出格式
            '-codec:v': 'mpeg1video',        // 视频编码
            '-b:v': '1000k',                 // 视频比特率
            '-bf': 0,                        // 禁用 B 帧
            '-codec:a': 'mp2',               // 音频编码
            '-ar': 44100,                    // 音频采样率
            '-ac': 1,                        // 音频通道数
            '-b:a': '128k',                  // 音频比特率
            '-muxdelay': 0.1                 // 降低延迟
        }
    })

    startHeartbeatCheck()
}

function stop() {
    if (stream) {
        stream.stop()
        stream = null
    }
}

function startHeartbeatCheck() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer)
    }
    
    heartbeatTimer = setInterval(() => {
        if (Date.now() - lastHeartbeat > 10 * 60 * 1000) {
            stop()
            clearInterval(heartbeatTimer)
        }
    }, 30 * 1000)
}

// API路由
app.get('/heartbeat', (req, res) => {
    lastHeartbeat = Date.now()
    res.send('ok')
})

app.post('/start', (req, res) => {
    const { rtspUrl } = req.body
    if (!rtspUrl) {
        res.status(400).send('Missing rtspUrl parameter')
        return
    }
    start(rtspUrl)
    res.send('Stream started')
})

// 启动服务器
const server = app.listen(8866, () => {
    console.log('Server running on port 8866')
}) 