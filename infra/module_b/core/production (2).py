"""
Project Blackbox — Module B: 영상 제작 파이프라인
═══════════════════════════════════════════════════
NotebookLM 레이아웃 + 아바타 립싱크 + 시니어 모드 + FFmpeg 합성
"""
import os
import uuid
import subprocess
import json
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

try:
    import httpx
except ImportError:
    httpx = None

logger = logging.getLogger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  시니어 모드 파라미터
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ViewMode(str, Enum):
    NORMAL = "normal"
    SENIOR = "senior"


@dataclass
class ModeParams:
    """모드별 영상 제작 파라미터"""
    mode: ViewMode
    subtitle_scale: float       # 자막 크기 배율
    tts_speed: float            # 낭독 속도 (1.0 = 기본)
    bgm_volume: float           # 배경음악 볼륨 (0.0 ~ 1.0)
    bgm_freq_hz: int            # 배경음악 최적 주파수 상한
    font_size_px: int           # 자막 폰트 크기
    avatar_scale: float         # 아바타 크기 배율
    transition_speed: float     # 화면 전환 속도 (초)
    zoom_range: tuple           # 줌인/아웃 범위 (min, max)
    pause_between_sec: float    # 문장 간 간격 (초)


PRESET_PARAMS = {
    ViewMode.NORMAL: ModeParams(
        mode=ViewMode.NORMAL,
        subtitle_scale=1.0,
        tts_speed=1.0,
        bgm_volume=0.15,
        bgm_freq_hz=8000,
        font_size_px=28,
        avatar_scale=1.0,
        transition_speed=0.5,
        zoom_range=(1.0, 1.05),
        pause_between_sec=0.3,
    ),
    ViewMode.SENIOR: ModeParams(
        mode=ViewMode.SENIOR,
        subtitle_scale=1.5,        # 150% 확대
        tts_speed=0.92,            # 8% 감속
        bgm_volume=0.08,           # 배경음 축소 (선명한 음성)
        bgm_freq_hz=4000,          # 고주파 제거 (귀 피로 감소)
        font_size_px=42,           # 큰 자막
        avatar_scale=1.15,         # 아바타 약간 확대
        transition_speed=0.8,      # 느린 전환
        zoom_range=(1.0, 1.02),    # 줌 범위 축소 (어지럼 방지)
        pause_between_sec=0.6,     # 문장 간 충분한 쉼
    ),
}


def get_mode_params(mode: ViewMode) -> ModeParams:
    return PRESET_PARAMS.get(mode, PRESET_PARAMS[ViewMode.NORMAL])


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  페르소나 아바타 설정
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class AvatarPersona:
    """AI 페르소나 아바타"""
    id: str
    name: str
    description: str
    voice_id: str               # ElevenLabs voice ID
    style: str                  # "professional" | "friendly" | "warm"
    best_categories: list[str]  # 이 아바타에 적합한 카테고리


AVATARS = [
    AvatarPersona(
        id="minseo", name="인서서",
        description="차분하고 시크한 톤, 전문가적 권위",
        voice_id="elevenlabs_voice_minseo",
        style="professional",
        best_categories=["economy", "tech"],
    ),
    AvatarPersona(
        id="youngsu", name="영영수",
        description="경쾌하고 따뜻한 톤, 시니어 친화적",
        voice_id="elevenlabs_voice_youngsu",
        style="warm",
        best_categories=["senior", "life"],
    ),
    AvatarPersona(
        id="jayeon", name="자연",
        description="활기차고 친근한 톤, 동기부여",
        voice_id="elevenlabs_voice_jayeon",
        style="friendly",
        best_categories=["selfdev", "life"],
    ),
]


def recommend_avatar(category: str) -> AvatarPersona:
    """카테고리에 최적화된 아바타 자동 추천"""
    for avatar in AVATARS:
        if category in avatar.best_categories:
            return avatar
    return AVATARS[0]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TTS 서비스 (ElevenLabs)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TTSService:
    """ElevenLabs TTS API 연동"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=120.0)
        self.base_url = "https://api.elevenlabs.io/v1"

    async def synthesize(
        self,
        text: str,
        voice_id: str,
        speed: float = 1.0,
        output_path: str = "/tmp/tts_output.mp3",
    ) -> str:
        """텍스트를 음성 파일로 변환"""
        try:
            resp = await self.client.post(
                f"{self.base_url}/text-to-speech/{voice_id}",
                headers={"xi-api-key": self.api_key},
                json={
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.8,
                        "speed": speed,
                    },
                },
            )
            resp.raise_for_status()
            with open(output_path, "wb") as f:
                f.write(resp.content)
            return output_path
        except Exception as e:
            logger.error(f"TTS synthesis failed: {e}")
            return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  아바타 립싱크 (HeyGen / D-ID)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class AvatarService:
    """아바타 립싱크 영상 생성"""

    def __init__(self, api_key: str, provider: str = "heygen"):
        self.api_key = api_key
        self.provider = provider
        self.client = httpx.AsyncClient(timeout=300.0)

    async def generate_avatar_video(
        self,
        audio_path: str,
        avatar_id: str,
        output_path: str = "/tmp/avatar_output.mp4",
    ) -> str:
        """음성 파일을 입력받아 립싱크 아바타 영상 생성"""
        if self.provider == "heygen":
            return await self._heygen_generate(audio_path, avatar_id, output_path)
        else:
            return await self._did_generate(audio_path, avatar_id, output_path)

    async def _heygen_generate(self, audio_path, avatar_id, output_path) -> str:
        """HeyGen API 호출"""
        try:
            with open(audio_path, "rb") as f:
                audio_data = f.read()

            resp = await self.client.post(
                "https://api.heygen.com/v2/video/generate",
                headers={"X-Api-Key": self.api_key},
                json={
                    "video_inputs": [{
                        "character": {"type": "avatar", "avatar_id": avatar_id},
                        "voice": {"type": "audio", "audio_data": audio_data.hex()},
                    }],
                    "dimension": {"width": 400, "height": 400},
                },
            )
            resp.raise_for_status()
            video_id = resp.json().get("data", {}).get("video_id")
            # TODO: 폴링으로 렌더링 완료 대기 후 다운로드
            return output_path
        except Exception as e:
            logger.error(f"HeyGen avatar generation failed: {e}")
            return ""

    async def _did_generate(self, audio_path, avatar_id, output_path) -> str:
        """D-ID API 호출"""
        # D-ID 구현 (HeyGen과 유사 패턴)
        return output_path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  FFmpeg 영상 합성 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class VideoComposition:
    """영상 합성 구성"""
    main_bg: str                    # NotebookLM 분석 화면 (MP4/이미지)
    avatar_video: str               # 아바타 립싱크 영상 (MP4)
    tts_audio: str                  # TTS 음성 (MP3)
    subtitle_file: str              # 자막 파일 (SRT)
    bgm_path: str                   # 배경음악 (MP3)
    output_path: str                # 최종 출력 경로
    mode_params: ModeParams         # 모드별 파라미터


class FFmpegCompositor:
    """
    FFmpeg 기반 영상 합성기

    레이아웃:
    ┌──────────────────────────┐
    │                          │
    │   NotebookLM 분석 화면    │
    │                          │
    │                    ┌────┐│
    │                    │아바││
    │                    │타  ││
    │                    └────┘│
    └──────────────────────────┘
    + 자막 (하단 중앙)
    + BGM (저볼륨 믹싱)
    """

    def __init__(self, ffmpeg_path: str = "ffmpeg"):
        self.ffmpeg = ffmpeg_path

    def compose(self, comp: VideoComposition) -> str:
        """
        최종 영상 합성

        1. NotebookLM 배경 위에 아바타 PiP(Picture-in-Picture) 오버레이
        2. TTS 음성 + BGM 믹싱
        3. 자막 번인
        4. 시니어 모드 파라미터 적용
        """
        p = comp.mode_params
        avatar_w = int(320 * p.avatar_scale)
        avatar_h = int(320 * p.avatar_scale)

        # 아바타 위치: 우측 하단 (마진 20px)
        overlay_x = f"main_w-overlay_w-20"
        overlay_y = f"main_h-overlay_h-20"

        # 필터 체인 구성
        filters = []

        # 1. 메인 화면 줌 효과 (시니어 모드에서는 약하게)
        zoom_max = p.zoom_range[1]
        filters.append(
            f"[0:v]zoompan=z='min(zoom+0.0002,{zoom_max})':"
            f"d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
            f"s=1920x1080:fps=30[main]"
        )

        # 2. 아바타 리사이즈
        filters.append(f"[1:v]scale={avatar_w}:{avatar_h}[avatar]")

        # 3. PiP 오버레이
        filters.append(f"[main][avatar]overlay={overlay_x}:{overlay_y}[composed]")

        # 4. 자막 번인 (시니어 모드 폰트 크기 적용)
        sub_style = (
            f"FontSize={p.font_size_px},"
            f"PrimaryColour=&H00FFFFFF,"
            f"OutlineColour=&H00000000,"
            f"Outline=2,"
            f"MarginV=40"
        )
        filters.append(
            f"[composed]subtitles={comp.subtitle_file}:"
            f"force_style='{sub_style}'[subtitled]"
        )

        filter_complex = ";".join(filters)

        # 오디오 믹싱: TTS + BGM
        audio_filter = (
            f"[2:a]atempo={p.tts_speed}[voice];"
            f"[3:a]volume={p.bgm_volume},"
            f"lowpass=f={p.bgm_freq_hz}[bgm];"
            f"[voice][bgm]amix=inputs=2:duration=first[audio]"
        )

        full_filter = f"{filter_complex};{audio_filter}"

        cmd = [
            self.ffmpeg, "-y",
            "-i", comp.main_bg,         # input 0: NotebookLM 화면
            "-i", comp.avatar_video,    # input 1: 아바타
            "-i", comp.tts_audio,       # input 2: TTS 음성
            "-i", comp.bgm_path,        # input 3: BGM
            "-filter_complex", full_filter,
            "-map", "[subtitled]",
            "-map", "[audio]",
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            comp.output_path,
        ]

        logger.info(f"FFmpeg command: {' '.join(cmd)}")
        return " ".join(cmd)  # 실행 대신 명령어 반환 (개발 단계)

    def generate_subtitle_srt(
        self,
        blocks: list,
        mode_params: ModeParams,
        output_path: str = "/tmp/subtitles.srt",
    ) -> str:
        """스크립트 블록에서 SRT 자막 파일 생성"""
        srt_content = []
        current_time = 0.0
        pause = mode_params.pause_between_sec

        for i, block in enumerate(blocks, 1):
            start = current_time
            end = start + block.duration_sec

            start_ts = self._sec_to_srt_time(start)
            end_ts = self._sec_to_srt_time(end)

            # 긴 텍스트 분할 (자막 1줄 최대 25자)
            lines = self._split_subtitle(block.text, 25 if mode_params.mode == ViewMode.SENIOR else 35)

            srt_content.append(f"{i}")
            srt_content.append(f"{start_ts} --> {end_ts}")
            srt_content.append(lines)
            srt_content.append("")

            current_time = end + pause

        content = "\n".join(srt_content)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path

    def _sec_to_srt_time(self, seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds % 1) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    def _split_subtitle(self, text: str, max_chars: int) -> str:
        if len(text) <= max_chars:
            return text
        mid = len(text) // 2
        # 가장 가까운 공백/쉼표에서 분할
        split_at = text.rfind(" ", 0, mid + 10)
        if split_at == -1:
            split_at = text.rfind(",", 0, mid + 10)
        if split_at == -1:
            split_at = mid
        return text[:split_at].strip() + "\n" + text[split_at:].strip()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 프로덕션 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class ProductionJob:
    """영상 제작 작업"""
    job_id: str
    keyword: str
    category: str
    mode: ViewMode
    avatar_id: str
    script: Optional[object] = None     # FullScript
    status: str = "pending"             # pending → scripting → tts → avatar → composing → done
    output_path: str = ""
    ffmpeg_cmd: str = ""
    error: str = ""


class ProductionPipeline:
    """
    Module B 통합 파이프라인

    Script → TTS → Avatar → Compose → Output
    """

    def __init__(
        self,
        gemini_key: str = "",
        elevenlabs_key: str = "",
        heygen_key: str = "",
    ):
        from module_b.core.script_engine import ScriptEngine
        self.script_engine = ScriptEngine(gemini_key)
        self.tts = TTSService(elevenlabs_key) if elevenlabs_key else None
        self.avatar = AvatarService(heygen_key) if heygen_key else None
        self.compositor = FFmpegCompositor()

    async def execute(
        self,
        keyword: str,
        category: str,
        mode: ViewMode,
        avatar_id: str,
        news_summary: str,
        core_facts: list[str] = None,
        opinion_seeds: list[str] = None,
    ) -> ProductionJob:
        """전체 제작 파이프라인 실행"""
        job = ProductionJob(
            job_id=str(uuid.uuid4())[:8],
            keyword=keyword,
            category=category,
            mode=mode,
            avatar_id=avatar_id,
        )

        try:
            # 1. 스크립트 생성
            job.status = "scripting"
            script = await self.script_engine.generate_full_script(
                keyword=keyword,
                category=category,
                news_summary=news_summary,
                core_facts=core_facts,
                opinion_seeds=opinion_seeds,
            )
            job.script = script

            # 2. 모드 파라미터 로드
            params = get_mode_params(mode)

            # 3. 자막 생성
            srt_path = f"/tmp/blackbox_{job.job_id}_sub.srt"
            self.compositor.generate_subtitle_srt(script.blocks, params, srt_path)

            # 4. FFmpeg 명령 생성 (실제 실행은 Celery 워커에서)
            comp = VideoComposition(
                main_bg=f"/tmp/blackbox_{job.job_id}_notebook.mp4",
                avatar_video=f"/tmp/blackbox_{job.job_id}_avatar.mp4",
                tts_audio=f"/tmp/blackbox_{job.job_id}_voice.mp3",
                subtitle_file=srt_path,
                bgm_path="/assets/bgm/default.mp3",
                output_path=f"/output/blackbox_{job.job_id}_final.mp4",
                mode_params=params,
            )
            job.ffmpeg_cmd = self.compositor.compose(comp)
            job.output_path = comp.output_path
            job.status = "ready"

        except Exception as e:
            job.status = "error"
            job.error = str(e)
            logger.error(f"Production pipeline failed: {e}")

        return job
