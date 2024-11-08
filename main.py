from fastapi import FastAPI, WebSocket
from typing import Optional
import uvicorn
from rtsp_stream import RTSPStream

app = FastAPI()
stream_manager = {}  # 存储多个视频流实例

@app.post("/stream/start")
async def start_stream(rtsp_url: str, ws_port: int = 9999):
    if ws_port in stream_manager:
        return {"error": "Port already in use"}
    
    stream = RTSPStream(rtsp_url, ws_port)
    stream.start()
    stream_manager[ws_port] = stream
    return {
        "status": "success",
        "ws_url": f"ws://localhost:{ws_port}"
    }

@app.post("/stream/stop")
async def stop_stream(ws_port: int = 9999):
    if ws_port in stream_manager:
        stream_manager[ws_port].stop()
        del stream_manager[ws_port]
        return {"status": "success"}
    return {"error": "Stream not found"} 