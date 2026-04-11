"""
Project Blackbox — 실제 영상 생성 + 다운로드 + 슬라이드 미리보기 API
/api/v1/video/*
"""
import os
import uuid
import base64
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/video", tags=["Video (Real)"])

_jobs: dict = {}


class RealVideoRequest(BaseModel):
    keyword: str
    category: str
    mode: str = "normal"
    script_blocks: list[dict]


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
    """실제 영상 생성 (TTS + FFmpeg)"""
    from real_video_engine import generate_real_video

    result = await generate_real_video(
        keyword=req.keyword,
        category=req.category,
        script_blocks=req.script_blocks,
        mode=req.mode,
    )

    _jobs[result.job_id] = result

    return RealVideoResponse(
        job_id=result.job_id,
        status=result.status,
        download_url=result.download_url,
        duration_sec=result.duration_sec,
        file_size_bytes=result.file_size_bytes,
        error=result.error,
    )


@router.post("/preview-slides")
async def preview_slides(req: SlidePreviewRequest):
    """
    슬라이드 미리보기 — 각 블록별 배경 이미지를 생성하여 base64로 반환
    프론트엔드에서 바로 표시 가능
    """
    from real_video_engine import create_block_slide

    preview_id = str(uuid.uuid4())[:8]
    output_dir = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
    preview_dir = os.path.join(output_dir, f"preview_{preview_id}")
    os.makedirs(preview_dir, exist_ok=True)

    slides = []
    total_blocks = len(req.script_blocks)

    for i, block in enumerate(req.script_blocks):
        slide_path = os.path.join(preview_dir, f"slide_{i}.png")

        try:
            await create_block_slide(
                save_path=slide_path,
                keyword=req.keyword,
                category=req.category,
                block=block,
                block_index=i,
                total_blocks=total_blocks,
            )

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
                slides.append({
                    "index": i,
                    "section": block.get("section", "body"),
                    "image": None,
                    "text_preview": block.get("text", "")[:60],
                    "error": "slide generation failed",
                })
        except Exception as e:
            slides.append({
                "index": i,
                "section": block.get("section", "body"),
                "image": None,
                "text_preview": block.get("text", "")[:60],
                "error": str(e),
            })

    return {
        "preview_id": preview_id,
        "total_slides": len(slides),
        "slides": slides,
    }


@router.get("/download/{job_id}")
async def download_video(job_id: str):
    """생성된 영상/음성 파일 다운로드"""

    if job_id in _jobs:
        result = _jobs[job_id]
        file_path = result.output_path
    else:
        output_dir = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
        job_dir = os.path.join(output_dir, job_id)

        for ext in ["_final.mp4", ".mp4", ".mp3"]:
            candidate = os.path.join(job_dir, f"blackbox_{job_id}{ext}")
            if os.path.exists(candidate):
                file_path = candidate
                break
        else:
            if os.path.exists(job_dir):
                files = [f for f in os.listdir(job_dir) if f.endswith((".mp4", ".mp3"))]
                if files:
                    file_path = os.path.join(job_dir, files[0])
                else:
                    raise HTTPException(404, "파일을 찾을 수 없습니다")
            else:
                raise HTTPException(404, "작업을 찾을 수 없습니다")

    if not os.path.exists(file_path):
        raise HTTPException(404, "파일이 존재하지 않습니다")

    filename = os.path.basename(file_path)
    media_type = "video/mp4" if filename.endswith(".mp4") else "audio/mpeg"

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type,
    )


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
        }
    return {"job_id": job_id, "status": "not_found"}
