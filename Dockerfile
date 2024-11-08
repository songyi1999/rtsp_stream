
FROM python:3.9-slim

RUN apt-get update && \
apt-get install -y ffmpeg && \
apt-get clean && \
rm -rf /var/lib/apt/lists/
WORKDIR /app

COPY requirements.txt .
COPY main.py .
COPY rtsp_stream.py .
COPY templates/ templates/
COPY static/ static/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000 9999

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]