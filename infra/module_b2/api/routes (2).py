"""
Project Blackbox — Module B-2: FastAPI 엔드포인트
/api/v1/video-edit/* 라우터
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from module_b2.core.config import (
    ViewMode, get_mode_params, AVATARS, recommend_avatar,
)
from module_b2.core.video_editor import VideoEditPipeline

router = APIRouter(prefix="/api/v1/video-edit", tags=["Module B-2: Video Editor"])
_pipeline = VideoEditPipeline()


# ─── Schemas ───

class ScriptBlockInput(BaseModel):
    section: str                # "hook" | "body" | "opinion"
    text: str
    duration_sec: float
    subtitle_highlight: str = ""


class VideoEditRequest(BaseModel):
    """Module B 스크립트 출력을 입력으로 받음"""
    keyword: str
    category: str
    mode: str = Field(default="normal")
    avatar_id: str = Field(default="")
    script_blocks: list[ScriptBlockInput]
    core_facts: list[str] = []
    total_duration_sec: float = Field(default=180.0, ge=10)


class ModeParamsResponse(BaseModel):
    mode: str
    subtitle_scale: float
    tts_speed: float
    bgm_volume: float
    bgm_freq_hz: int
    font_size_px: int
    avatar_scale: float
    pause_between_sec: float


class AvatarResponse(BaseModel):
    id: str
    name: str
    description: str
    style: str
    best_categories: list[str]


class NotebookLayoutResponse(BaseModel):
    title: str
    key_points: list[str]
    chart_type: str
    highlight_phrase: str
    layout_variant: int


class VideoEditStatusResponse(BaseModel):
    job_id: str
    status: str
    keyword: str
    category: str
    mode: str
    avatar_name: str
    notebook_layout: Optional[NotebookLayoutResponse] = None
    mode_params: ModeParamsResponse
    tts_block_count: int = 0
    subtitle_path: str = ""
    ffmpeg_cmd: str = ""
    output_path: str = ""
    estimated_duration_min: float = 0
    error: str = ""
    created_at: str = ""


# ─── Endpoints ───

@router.post("/render", response_model=VideoEditStatusResponse)
async def render_video(req: VideoEditRequest):
    """
    영상 편집 & 생성 파이프라인 실행

    Module B의 스크립트 출력(blocks)을 입력받아:
    1. NotebookLM 배경 레이아웃 생성
    2. 블록별 TTS 음성 합성
    3. 아바타 립싱크 영상 생성
    4. SRT 자막 생성
    5. FFmpeg 최종 합성
    """
    mode = ViewMode(req.mode) if req.mode in ["normal", "senior"] else ViewMode.NORMAL
    blocks = [b.model_dump() for b in req.script_blocks]

    job = await _pipeline.execute(
        script_blocks=blocks,
        keyword=req.keyword,
        category=req.category,
        mode=mode,
        avatar_id=req.avatar_id,
        core_facts=req.core_facts,
        total_duration_sec=req.total_duration_sec,
    )

    params = get_mode_params(mode)
    nb = None
    if job.notebook_layout:
        nb = NotebookLayoutResponse(
            title=job.notebook_layout.title,
            key_points=job.notebook_layout.key_points,
            chart_type=job.notebook_layout.chart_type,
            highlight_phrase=job.notebook_layout.highlight_phrase,
            layout_variant=job.notebook_layout.layout_variant,
        )

    return VideoEditStatusResponse(
        job_id=job.job_id,
        status=job.status,
        keyword=job.keyword,
        category=job.category,
        mode=mode.value,
        avatar_name=job.avatar.name,
        notebook_layout=nb,
        mode_params=ModeParamsResponse(
            mode=params.mode.value,
            subtitle_scale=params.subtitle_scale,
            tts_speed=params.tts_speed,
            bgm_volume=params.bgm_volume,
            bgm_freq_hz=params.bgm_freq_hz,
            font_size_px=params.font_size_px,
            avatar_scale=params.avatar_scale,
            pause_between_sec=params.pause_between_sec,
        ),
        tts_block_count=len(job.tts_results),
        subtitle_path=job.subtitle_path,
        ffmpeg_cmd=job.ffmpeg_cmd,
        output_path=job.output_path,
        estimated_duration_min=job.estimated_duration_min,
        error=job.error,
        created_at=job.created_at,
    )


@router.get("/mode/{mode_name}", response_model=ModeParamsResponse)
async def get_mode(mode_name: str):
    """일반 / 시니어 모드 파라미터 조회"""
    mode = ViewMode(mode_name) if mode_name in ["normal", "senior"] else ViewMode.NORMAL
    p = get_mode_params(mode)
    return ModeParamsResponse(
        mode=p.mode.value, subtitle_scale=p.subtitle_scale,
        tts_speed=p.tts_speed, bgm_volume=p.bgm_volume,
        bgm_freq_hz=p.bgm_freq_hz, font_size_px=p.font_size_px,
        avatar_scale=p.avatar_scale, pause_between_sec=p.pause_between_sec,
    )


@router.get("/avatars")
async def list_avatars(category: str = "economy"):
    """아바타 목록 + 카테고리별 추천"""
    rec = recommend_avatar(category)
    return {
        "avatars": [
            AvatarResponse(id=a.id, name=a.name, description=a.description,
                           style=a.style, best_categories=a.best_categories).model_dump()
            for a in AVATARS
        ],
        "recommended_id": rec.id,
    }


@router.get("/status/{job_id}")
async def get_job_status(job_id: str):
    """영상 편집 진행 상태 조회 (폴링용)"""
    # TODO: Redis/DB에서 job 상태 조회
    return {"job_id": job_id, "status": "not_found"}
