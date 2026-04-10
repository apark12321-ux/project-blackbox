"""
Project Blackbox — Module C: API 스키마
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class VariationParamsResponse(BaseModel):
    brightness: float
    contrast: float
    saturation: float
    hue_shift: float
    noise_strength: float
    sharpen: float
    pitch_semitone: float
    tempo: float
    bass_boost_db: float
    treble_db: float
    intro_pad_sec: float
    outro_pad_sec: float
    unique_id: str
    file_hash_salt: str


class SafetyFactorResponse(BaseModel):
    name: str
    score: float = Field(ge=0, le=100)
    weight: float
    description: str
    suggestion: str = ""


class SafetyReportResponse(BaseModel):
    total_score: float = Field(ge=0, le=100)
    grade: str
    factors: list[SafetyFactorResponse]
    passed: bool
    risk_items: list[str]


class ShieldRequest(BaseModel):
    input_path: str
    output_path: str = ""
    has_avatar: bool = True
    has_opinion: bool = True
    has_custom_voice: bool = False
    script_sections: int = Field(default=5, ge=1)
    total_duration_sec: float = Field(default=180.0, ge=10)
    core_facts_count: int = Field(default=3, ge=0)


class ShieldResponse(BaseModel):
    job_id: str
    input_path: str
    output_path: str
    variation_params: VariationParamsResponse
    safety_report: SafetyReportResponse
    ffmpeg_cmd: str
    video_filters: str
    audio_filters: str
    created_at: datetime


class SafetyCheckRequest(BaseModel):
    has_avatar: bool = True
    has_opinion: bool = True
    has_custom_voice: bool = False
    script_sections: int = 5
    total_duration_sec: float = 180.0
    core_facts_count: int = 3
    variation_applied: bool = False
