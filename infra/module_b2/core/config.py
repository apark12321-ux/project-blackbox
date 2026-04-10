"""
Project Blackbox — Module B-2: 모드 & 아바타 설정
════════════════════════════════════════════════
Module B(스크립트)와 B-2(영상 편집) 양쪽에서 참조하는 공유 설정입니다.
시니어 모드 파라미터, 페르소나 아바타 정의를 담당합니다.
"""
from dataclasses import dataclass
from enum import Enum


class ViewMode(str, Enum):
    NORMAL = "normal"
    SENIOR = "senior"


@dataclass
class ModeParams:
    """모드별 영상 제작 파라미터"""
    mode: ViewMode
    subtitle_scale: float       # 자막 크기 배율
    tts_speed: float            # 낭독 속도
    bgm_volume: float           # BGM 볼륨 (0~1)
    bgm_freq_hz: int            # BGM LP 필터 주파수
    font_size_px: int           # 자막 폰트
    avatar_scale: float         # 아바타 크기 배율
    transition_speed: float     # 화면 전환 속도 (초)
    zoom_range: tuple           # 줌 범위 (min, max)
    pause_between_sec: float    # 문장 간 간격 (초)


PRESET_PARAMS = {
    ViewMode.NORMAL: ModeParams(
        mode=ViewMode.NORMAL, subtitle_scale=1.0, tts_speed=1.0,
        bgm_volume=0.15, bgm_freq_hz=8000, font_size_px=28,
        avatar_scale=1.0, transition_speed=0.5,
        zoom_range=(1.0, 1.05), pause_between_sec=0.3,
    ),
    ViewMode.SENIOR: ModeParams(
        mode=ViewMode.SENIOR, subtitle_scale=1.5, tts_speed=0.92,
        bgm_volume=0.08, bgm_freq_hz=4000, font_size_px=42,
        avatar_scale=1.15, transition_speed=0.8,
        zoom_range=(1.0, 1.02), pause_between_sec=0.6,
    ),
}


def get_mode_params(mode: ViewMode) -> ModeParams:
    return PRESET_PARAMS.get(mode, PRESET_PARAMS[ViewMode.NORMAL])


@dataclass
class AvatarPersona:
    id: str
    name: str
    description: str
    voice_id: str
    style: str
    best_categories: list


AVATARS = [
    AvatarPersona("minseo", "인서서", "차분하고 시크한 톤",
                  "elevenlabs_voice_minseo", "professional", ["economy", "tech"]),
    AvatarPersona("youngsu", "영영수", "경쾌하고 따뜻한 톤",
                  "elevenlabs_voice_youngsu", "warm", ["senior", "life"]),
    AvatarPersona("jayeon", "자연", "활기차고 친근한 톤",
                  "elevenlabs_voice_jayeon", "friendly", ["selfdev", "life"]),
]


def recommend_avatar(category: str) -> AvatarPersona:
    for a in AVATARS:
        if category in a.best_categories:
            return a
    return AVATARS[0]
