const http = require('http')
const url = require('url')
const Stream = require('node-rtsp-stream')
let stream, tm
function start(ip) {
  stream = new Stream({
    name: 'name',
    streamUrl: 'rtsp://admin:a1234567@' + ip + ':554/h265/ch1/main/av_stream',
    wsPort: 9988,
    ffmpegOptions: { // options ffmpeg flags
      // '-nostats': '', // an option with no neccessary value uses a blank string
      '-r': 50, // options with required values specify the value after the key
      // '-s':'850x566',
      '-s': '1024x768',
      // '-an': '',
      '-rtsp_transport': 'tcp'
    }
  })

  watch()
}
// 客户关闭后退出
function watch() {
  // clearInterval(tm)
  // tm = setInterval(() => {
  //   stop()
  // }, 1000 * 30)
}
function stop() {
  if (stream) { stream.stop() }
}
var server = http.createServer(function (req, res) {
  const query = url.parse(req.url, true).query
  if (query.stop) {
    stop()
  } else if (query.ip) {
    stop()
    start(query.ip)
  } else if (query.watch) {
    watch()
  }
  res.end('ok')
})
server.listen(8866)
