"""
Project Blackbox — Module B: API 스키마 (Pydantic v2)
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ─── 스크립트 요청/응답 ───
class ScriptBlockResponse(BaseModel):
    section: str                      # "hook" | "body" | "opinion" | "cta"
    text: str
    duration_sec: float
    subtitle_highlight: str = ""


class ScriptGenerateRequest(BaseModel):
    keyword: str
    category: str
    news_summary: str
    core_facts: list[str] = []
    opinion_seeds: list[str] = []
    hook_triggers: list[str] = []
    target_duration_sec: float = Field(default=180.0, ge=30, le=600)


class ScriptResponse(BaseModel):
    keyword: str
    category: str
    hook_type: str
    opinion_tone: str
    blocks: list[ScriptBlockResponse]
    total_duration_sec: float
    dynamic_intro: str
    dynamic_outro: str


# ─── 모드 설정 ───
class ModeParamsResponse(BaseModel):
    mode: str                         # "normal" | "senior"
    subtitle_scale: float
    tts_speed: float
    bgm_volume: float
    bgm_freq_hz: int
    font_size_px: int
    avatar_scale: float
    transition_speed: float
    pause_between_sec: float


# ─── 아바타 ───
class AvatarResponse(BaseModel):
    id: str
    name: str
    description: str
    style: str
    best_categories: list[str]


class AvatarListResponse(BaseModel):
    avatars: list[AvatarResponse]
    recommended_id: str


# ─── 영상 제작 ───
class ProductionRequest(BaseModel):
    keyword: str
    category: str
    mode: str = Field(default="normal")   # "normal" | "senior"
    avatar_id: str = Field(default="minseo")
    news_summary: str
    core_facts: list[str] = []
    opinion_seeds: list[str] = []
    target_duration_sec: float = Field(default=180.0, ge=30, le=600)


class ProductionStatusResponse(BaseModel):
    job_id: str
    status: str
    keyword: str
    category: str
    mode: str
    avatar_id: str
    script: Optional[ScriptResponse] = None
    mode_params: Optional[ModeParamsResponse] = None
    ffmpeg_cmd: str = ""
    output_path: str = ""
    error: str = ""
    created_at: datetime
