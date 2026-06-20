"""
Project Blackbox — Module B: FastAPI Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from module_b.api.routes import router as production_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🎬 Project Blackbox — Module B: Production Engine Starting...")
    yield
    print("🎬 Module B Shutdown")


app = FastAPI(
    title="Project Blackbox — Module B",
    description="하이브리드 서사 & 제작 엔진: 스크립트 → TTS → 아바타 → 영상 합성",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(production_router)


@app.get("/health")
async def health():
    return {"status": "ok", "module": "B", "service": "Production Engine"}
