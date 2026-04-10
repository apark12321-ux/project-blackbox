"""
Project Blackbox — Module A: FastAPI Application
메인 서버 진입점
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from module_a.api.routes import router as curation_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """서버 시작/종료 시 리소스 관리"""
    # 시작: DB 연결, API 클라이언트 초기화
    print("🔲 Project Blackbox — Module A: Curation Engine Starting...")
    yield
    # 종료: 리소스 정리
    print("🔲 Module A Shutdown")


app = FastAPI(
    title="Project Blackbox — Module A",
    description="지능형 큐레이션 엔진: 카테고리 → 키워드 → 뉴스 소스 → Module B 전달",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS (Next.js 프론트엔드 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(curation_router)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "module": "A",
        "service": "Curation Engine",
    }
