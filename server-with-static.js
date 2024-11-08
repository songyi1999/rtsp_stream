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
            '-r': 50,
            '-s': '1024x768',
            '-rtsp_transport': 'tcp'
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