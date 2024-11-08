const http = require('http')
const url = require('url')
const Stream = require('node-rtsp-stream')

let stream
let lastHeartbeat = Date.now()
let heartbeatTimer

function start(rtspUrl) {
  // 关闭现有流
  stop()
  
  // 启动新流
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

  // 启动心跳检测
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
    // 检查是否超过10分钟没有心跳
    if (Date.now() - lastHeartbeat > 10 * 60 * 1000) {
      stop()
      clearInterval(heartbeatTimer)
    }
  }, 30 * 1000) // 每30秒检查一次
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  
  // 处理心跳请求
  if (req.method === 'GET' && req.url === '/heartbeat') {
    lastHeartbeat = Date.now()
    res.end('ok')
    return
  }
  
  // 处理流启动请求
  if (req.method === 'POST' && req.url === '/start') {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        const { rtspUrl } = JSON.parse(body)
        if (!rtspUrl) {
          res.statusCode = 400
          res.end('Missing rtspUrl parameter')
          return
        }
        start(rtspUrl)
        res.end('Stream started')
      } catch (e) {
        res.statusCode = 400
        res.end('Invalid JSON')
      }
    })
    return
  }

  res.statusCode = 404
  res.end('Not found')
})

server.listen(8866, () => {
  console.log('Server running on port 8866')
})
