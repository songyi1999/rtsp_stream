const express = require('express')
const http = require('http')
const url = require('url')
const Stream = require('node-rtsp-stream')

const app = express()

// CORS中间件
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(express.json())

// API路由
app.post('/start', (req, res) => {
    const { rtspUrl } = req.body
    if (!rtspUrl) {
        res.status(400).send('Missing rtspUrl parameter')
        return
    }
    start(rtspUrl)
    res.send('Stream started')
})

app.get('/heartbeat', (req, res) => {
    lastHeartbeat = Date.now()
    res.send('ok')
})

app.post('/stop', (req, res) => {
    stop()
    res.send('Stream stopped')
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
            '-s': '850x566',
            '-an': '',
            '-analyzeduration': '20M',
            '-probesize': '20M',
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

// 启动 HTTP 服务器
app.listen(8866, () => {
    console.log('HTTP Server running on port 8866')
}) 