"""
AlgoMaker Beta · 백엔드 main.py에 추가할 코드 스니펫

infra/main.py 파일(또는 FastAPI 앱 엔트리 포인트)에 
아래 3줄을 추가해주세요:

─────────────────────────────────────────────
from module_b.api.beta_routes import router as beta_router
app.include_router(beta_router)
─────────────────────────────────────────────

즉, 기존 app = FastAPI(...) 아래에 이 두 줄만 넣으시면
모든 /api/* 엔드포인트가 자동 등록됩니다.

예시:

# infra/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from module_b.api.beta_routes import router as beta_router

app = FastAPI(title="AlgoMaker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 CORS_ORIGINS env 사용
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(beta_router)  # ← 이 줄 추가
"""
