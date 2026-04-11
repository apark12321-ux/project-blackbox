"""
Project Blackbox — 실제 영상 생성 + 다운로드 API
/api/v1/video/*
"""
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/video", tags=["Video (Real)"])

# 생성된 영상 저장소
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


@router.get("/download/{job_id}")
async def download_video(job_id: str):
    """생성된 영상/음성 파일 다운로드"""
    
    if job_id in _jobs:
        result = _jobs[job_id]
        file_path = result.output_path
    else:
        # job_id로 파일 찾기
        output_dir = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
        job_dir = os.path.join(output_dir, job_id)
        
        # MP4 먼저, 없으면 MP3
        for ext in ["_final.mp4", ".mp4", ".mp3"]:
            candidate = os.path.join(job_dir, f"blackbox_{job_id}{ext}")
            if os.path.exists(candidate):
                file_path = candidate
                break
        else:
            # 폴더 안의 아무 파일이나
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
