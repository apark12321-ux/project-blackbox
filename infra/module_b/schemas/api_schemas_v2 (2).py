"""
Project Blackbox — Module B: API 스키마 (스크립트 전용)
"""
from typing import Optional
from pydantic import BaseModel, Field


class ScriptBlockResponse(BaseModel):
    section: str
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
