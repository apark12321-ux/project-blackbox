"""Project Blackbox — Module B-2: FastAPI Application"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from module_b2.api.routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🎬 Project Blackbox — Module B-2: Video Editor Starting...")
    yield
    print("🎬 Module B-2 Shutdown")

app = FastAPI(
    title="Project Blackbox — Module B-2",
    description="영상 편집 & 생성: NotebookLM Layout → TTS → Avatar → FFmpeg Compose",
    version="0.1.0", lifespan=lifespan,
)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router)

@app.get("/health")
async def health():
    return {"status": "ok", "module": "B-2", "service": "Video Editor"}
