"""Project Blackbox — Module C: FastAPI Application"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from module_c.api.routes import router as shield_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🛡️ Project Blackbox — Module C: Algorithm Shield Starting...")
    yield
    print("🛡️ Module C Shutdown")

app = FastAPI(
    title="Project Blackbox — Module C",
    description="알고리즘 실드: 픽셀 변주 + 오디오 변주 + 메타데이터 주입 + Safety Score",
    version="0.1.0", lifespan=lifespan,
)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(shield_router)

@app.get("/health")
async def health():
    return {"status": "ok", "module": "C", "service": "Algorithm Shield"}
