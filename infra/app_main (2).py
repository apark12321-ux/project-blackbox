"""
Project Blackbox — Unified API Server
═════════════════════════════════════
Module A, B, C, D의 라우터를 하나의 FastAPI 앱에 마운트합니다.
Module B-2는 별도 서버(video_api:8001)에서 실행됩니다.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Project Blackbox API Server Starting...")
    # DB 테이블 생성 (개발 환경)
    if os.getenv("APP_ENV") != "production":
        try:
            from infra.db.models import create_all_tables
            create_all_tables()
            print("DB tables created")
        except Exception as e:
            print(f"DB init skipped: {e}")
    yield
    print("Shutdown")


app = FastAPI(
    title="Project Blackbox",
    description="수익형 유튜브 자동화 솔루션 — Unified API",
    version="2.1.0",
    lifespan=lifespan,
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount module routers ──
try:
    from module_a.api.routes import router as a_router
    app.include_router(a_router)
except ImportError:
    pass

try:
    from module_b.api.routes_v2 import router as b_router
    app.include_router(b_router)
except ImportError:
    pass

try:
    from module_c.api.routes import router as c_router
    app.include_router(c_router)
except ImportError:
    pass

try:
    from module_d.api.routes import router as d_router
    app.include_router(d_router)
except ImportError:
    pass


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "blackbox-api",
        "modules": ["A", "B", "C", "D"],
        "version": "2.1.0",
    }

# Auth & Config routes
try:
    from infra.auth_routes import router as auth_router
    app.include_router(auth_router)
except ImportError:
    pass
