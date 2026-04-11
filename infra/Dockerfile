FROM python:3.13-slim

RUN apt-get update && apt-get install -y ffmpeg fonts-nanum && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 캐시 방지 - 이 숫자를 바꾸면 아래 모든 단계가 재실행됨
ARG CACHEBUST=3

COPY . .
RUN pip install Pillow
RUN pip install -r requirements.txt

EXPOSE 8080
CMD ["uvicorn", "app_main:app", "--host", "0.0.0.0", "--port", "8080"]
