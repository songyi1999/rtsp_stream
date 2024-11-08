from fastapi import FastAPI, WebSocket, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn
from rtsp_stream import RTSPStream

app = FastAPI()

# 添加静态文件支持
app.mount("/static", StaticFiles(directory="static"), name="static")

# 添加模板支持
templates = Jinja2Templates(directory="templates")

# 存储多个视频流实例
stream_manager = {}  

# 添加请求模型
class StreamRequest(BaseModel):
    rtsp_url: str
    ws_port: int = 9999

# 添加根路由，返回index.html
@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 修改接口，使用请求体接收参数
@app.post("/stream/start")
async def start_stream(request: StreamRequest):
    if request.ws_port in stream_manager:
        return {"error": "Port already in use"}
    
    stream = RTSPStream(request.rtsp_url, request.ws_port)
    stream.start()
    stream_manager[request.ws_port] = stream
    return {
        "status": "success",
        "ws_url": f"ws://localhost:{request.ws_port}"
    }

# 修改停止接口
class StopRequest(BaseModel):
    ws_port: int = 9999

@app.post("/stream/stop")
async def stop_stream(request: StopRequest):
    if request.ws_port in stream_manager:
        stream_manager[request.ws_port].stop()
        del stream_manager[request.ws_port]
        return {"status": "success"}
    return {"error": "Stream not found"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 