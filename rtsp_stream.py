import subprocess
import websockets
import asyncio

class RTSPStream:
    def __init__(self, rtsp_url: str, ws_port: int):
        self.rtsp_url = rtsp_url
        self.ws_port = ws_port
        self.process = None
        
    def start(self):
        command = [
            'ffmpeg',
            '-i', self.rtsp_url,
            '-f', 'mpegts',
            '-codec:v', 'mpeg1video',
            '-s', '1024x768',
            '-r', '25',
            '-rtsp_transport', 'tcp',
            f'http://localhost:{self.ws_port}'
        ]
        self.process = subprocess.Popen(command)
        
    def stop(self):
        if self.process:
            self.process.terminate()
            self.process = None 