"""
Creato — 영상 생성 + 다운로드 + 슬라이드 미리보기 API
/api/v1/video/*
"""
import os
import uuid
import base64
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dataclasses import dataclass, field

router = APIRouter(prefix="/api/v1/video", tags=["Video"])

_jobs: dict = {}


@dataclass
class _JobState:
    job_id: str
    status: str = "processing"
    download_url: str = ""
    duration_sec: float = 0.0
    file_size_bytes: int = 0
    error: str = ""
    output_path: str = ""


@router.get("/check-keys")
async def check_keys():
    """API 키 상태 확인 (디버그용)"""
    el = os.getenv("ELEVENLABS_API_KEY", "")
    gm = os.getenv("GEMINI_API_KEY", "")
    hg = os.getenv("HEYGEN_API_KEY", "")
    px = os.getenv("PEXELS_API_KEY", "")
    fl = os.getenv("FAL_API_KEY", "")
    return {
        "elevenlabs": f"{el[:8]}...{el[-4:]}" if len(el) > 12 else ("SET" if el else "MISSING"),
        "gemini": f"{gm[:8]}...{gm[-4:]}" if len(gm) > 12 else ("SET" if gm else "MISSING"),
        "heygen": f"{hg[:8]}...{hg[-4:]}" if len(hg) > 12 else ("SET" if hg else "MISSING"),
        "pexels": f"{px[:8]}...{px[-4:]}" if len(px) > 12 else ("SET" if px else "MISSING"),
        "fal": f"{fl[:8]}...{fl[-4:]}" if len(fl) > 12 else ("SET" if fl else "MISSING"),
    }


class RealVideoRequest(BaseModel):
    keyword: str
    category: str
    mode: str = "normal"
    script_blocks: list[dict]
    channel_name: str = ""
    watermark_text: str = ""
    tts_voice_id: str = ""


class RealVideoResponse(BaseModel):
    job_id: str
    status: str
    download_url: str = ""
    duration_sec: float = 0.0
    file_size_bytes: int = 0
    error: str = ""


class SlidePreviewRequest(BaseModel):
    keyword: str
    category: str
    script_blocks: list[dict]


@router.post("/generate-real", response_model=RealVideoResponse)
async def generate_real_video_endpoint(req: RealVideoRequest):
    """실제 영상 생성 — 즉시 job_id 반환 후 백그라운드에서 생성"""
    from real_video_engine import generate_real_video

    job_id = str(uuid.uuid4())[:8]
    _jobs[job_id] = _JobState(job_id=job_id, status="processing")

    async def _run():
        try:
            result = await generate_real_video(
                keyword=req.keyword,
                category=req.category,
                script_blocks=req.script_blocks,
                mode=req.mode,
                channel_name=req.channel_name,
                watermark_text=req.watermark_text,
                tts_voice_id=req.tts_voice_id,
                _job_id=job_id,
            )
            # Merge result into pre-registered job slot
            _jobs[job_id].status = result.status
            _jobs[job_id].download_url = result.download_url
            _jobs[job_id].duration_sec = result.duration_sec
            _jobs[job_id].file_size_bytes = result.file_size_bytes
            _jobs[job_id].error = result.error
            _jobs[job_id].output_path = getattr(result, "output_path", "")
        except Exception as e:
            _jobs[job_id].status = "error"
            _jobs[job_id].error = str(e)

    asyncio.create_task(_run())

    return RealVideoResponse(job_id=job_id, status="processing")


@router.post("/preview-slides")
async def preview_slides(req: SlidePreviewRequest):
    """슬라이드 미리보기 — 그라디언트 배경으로 간단히 생성"""
    from real_video_engine import _gradient_slide

    preview_id = str(uuid.uuid4())[:8]
    output_dir = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
    preview_dir = os.path.join(output_dir, f"preview_{preview_id}")
    os.makedirs(preview_dir, exist_ok=True)

    slides = []
    total = len(req.script_blocks)

    for i, block in enumerate(req.script_blocks):
        slide_path = os.path.join(preview_dir, f"slide_{i}.png")
        try:
            _gradient_slide(slide_path, req.keyword, i, total)
            if os.path.exists(slide_path):
                with open(slide_path, "rb") as f:
                    img_b64 = base64.b64encode(f.read()).decode("utf-8")
                slides.append({
                    "index": i,
                    "section": block.get("section", "body"),
                    "image": f"data:image/png;base64,{img_b64}",
                    "text_preview": block.get("text", "")[:60],
                })
            else:
                slides.append({"index": i, "image": None, "error": "생성 실패"})
        except Exception as e:
            slides.append({"index": i, "image": None, "error": str(e)})

    return {"preview_id": preview_id, "total_slides": len(slides), "slides": slides}


@router.get("/download/{job_id}")
async def download_video(job_id: str):
    """생성된 영상/음성 파일 다운로드"""
    output_dir = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
    job_dir = os.path.join(output_dir, job_id)
    file_path = ""

    # 1. 메모리 캐시에서 찾기
    if job_id in _jobs:
        result = _jobs[job_id]
        op = getattr(result, "output_path", "")
        if op and os.path.exists(op):
            file_path = op

    # 2. 디스크에서 찾기 (creato_ 또는 blackbox_ prefix)
    if not file_path and os.path.exists(job_dir):
        for prefix in ["creato_", "blackbox_"]:
            for ext in ["_final.mp4", ".mp4"]:
                candidate = os.path.join(job_dir, f"{prefix}{job_id}{ext}")
                if os.path.exists(candidate):
                    file_path = candidate
                    break
            if file_path:
                break

        # 3. 아무 mp4/mp3 파일
        if not file_path:
            files = [f for f in os.listdir(job_dir) if f.endswith((".mp4", ".mp3"))]
            if files:
                file_path = os.path.join(job_dir, files[0])

    if not file_path or not os.path.exists(file_path):
        raise HTTPException(404, "파일을 찾을 수 없습니다")

    filename = os.path.basename(file_path)
    media_type = "video/mp4" if filename.endswith(".mp4") else "audio/mpeg"
    return FileResponse(path=file_path, filename=filename, media_type=media_type)


@router.get("/status/{job_id}")
async def video_status(job_id: str):
    """영상 생성 상태 확인"""
    if job_id in _jobs:
        r = _jobs[job_id]
        return {
            "job_id": r.job_id,
            "status": r.status,
            "download_url": r.download_url,
            "duration_sec": r.duration_sec,
            "file_size_bytes": r.file_size_bytes,
            "error": getattr(r, "error", ""),
        }
    return {"job_id": job_id, "status": "not_found"}
