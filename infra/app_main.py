import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting...")
    yield
app = FastAPI(title="Project Blackbox", version="2.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
errors = []
try:
    from module_a.api.routes import router as a_router
    app.include_router(a_router)
    print("Module A loaded")
except Exception as e:
    errors.append(f"A: {e}")
    print(f"Module A failed: {e}")
try:
    from module_b.api.routes_v2 import router as b_router
    app.include_router(b_router)
    print("Module B loaded")
except Exception as e:
    errors.append(f"B: {e}")
    print(f"Module B failed: {e}")
try:
    from module_b.api.plan_routes import router as plan_router
    app.include_router(plan_router)
    print("Module B Plan Chat loaded")
except Exception as e:
    errors.append(f"BPlan: {e}")
    print(f"Module B Plan Chat failed: {e}")
try:
    from module_b2.api.routes import router as b2_router
    app.include_router(b2_router)
    print("Module B-2 loaded")
except Exception as e:
    errors.append(f"B2: {e}")
    print(f"Module B-2 failed: {e}")
try:
    from video_routes import router as video_real_router
    app.include_router(video_real_router)
    print("Video Real API loaded")
except Exception as e:
    errors.append(f"VideoReal: {e}")
    print(f"Video Real API failed: {e}")
try:
    from module_c.api.routes import router as c_router
    app.include_router(c_router)
    print("Module C loaded")
except Exception as e:
    errors.append(f"C: {e}")
    print(f"Module C failed: {e}")
try:
    from module_d.api.routes import router as d_router
    app.include_router(d_router)
    print("Module D loaded")
except Exception as e:
    errors.append(f"D: {e}")
    print(f"Module D failed: {e}")
@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.1.0", "errors": errors}
@app.get("/debug")
async def debug():
    return {
        "cwd": os.getcwd(),
        "files": os.listdir("."),
        "sys_path": sys.path[:5],
        "errors": errors,
    }
