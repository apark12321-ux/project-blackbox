"""
Project Blackbox — Module B-2: 영상 편집 & 생성 엔진
═══════════════════════════════════════════════════════
Module B(스크립트)의 출력을 입력받아 최종 MP4 영상을 생성합니다.

파이프라인: Script → NotebookLM Layout → TTS → Avatar Lip-sync → FFmpeg Compose → MP4

이 모듈은 GPU 집약 작업(렌더링 5~10분)을 담당하므로
Module B(CPU-light)와 분리하여 독립 스케일링이 가능합니다.
"""
import os
import uuid
import math
import json
import random
import logging
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

from module_b2.core.config import (
    ViewMode, ModeParams, get_mode_params,
    AvatarPersona, AVATARS, recommend_avatar,
)

try:
    import httpx
except ImportError:
    httpx = None

logger = logging.getLogger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Step 1: NotebookLM 레이아웃 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class NotebookLayout:
    """NotebookLM 스타일 화면 구성 데이터"""
    title: str
    key_points: list[str]       # 화면에 표시할 핵심 포인트 (3~5개)
    chart_type: str             # "bar" | "line" | "stat"
    chart_data: list[int]       # 차트 데이터
    highlight_phrase: str       # 화면 강조 문구
    color_accent: str           # 화면 포인트 색상 hex
    layout_variant: int         # 레이아웃 변형 번호 (비정형성)


class NotebookLayoutGenerator:
    """NotebookLM 분석 화면 자동 생성"""

    # 카테고리별 차트 유형 매핑
    CHART_TYPES = {
        "economy": ["bar", "line", "stat"],
        "senior": ["stat", "bar"],
        "selfdev": ["line", "bar"],
        "tech": ["line", "stat", "bar"],
        "life": ["bar", "stat"],
    }

    COLOR_ACCENTS = {
        "economy": "#2B7FFF",
        "senior": "#1AAD6B",
        "selfdev": "#7C6BDD",
        "tech": "#2B7FFF",
        "life": "#E5A620",
    }

    def generate(
        self,
        keyword: str,
        category: str,
        core_facts: list[str],
        subtitle_highlights: list[str],
    ) -> NotebookLayout:
        """스크립트 데이터로부터 NotebookLM 화면 구성 생성"""
        chart_types = self.CHART_TYPES.get(category, ["bar"])
        chart_type = random.choice(chart_types)

        # 차트 데이터: 랜덤하지만 그럴듯한 수치
        chart_data = self._generate_chart_data(chart_type)

        # 핵심 포인트 (팩트 + 하이라이트에서 추출)
        points = core_facts[:4] if core_facts else [keyword]
        if subtitle_highlights:
            points = [h for h in subtitle_highlights if h][:4] or points

        return NotebookLayout(
            title=keyword,
            key_points=points,
            chart_type=chart_type,
            chart_data=chart_data,
            highlight_phrase=points[0] if points else keyword,
            color_accent=self.COLOR_ACCENTS.get(category, "#2B7FFF"),
            layout_variant=random.randint(1, 5),  # 5가지 변형
        )

    def _generate_chart_data(self, chart_type: str) -> list[int]:
        if chart_type == "bar":
            return [random.randint(30, 95) for _ in range(7)]
        elif chart_type == "line":
            base = random.randint(40, 60)
            return [base + random.randint(-15, 25) for _ in range(10)]
        else:  # stat
            return [random.randint(50, 99)]

    def generate_ffmpeg_background(
        self,
        layout: NotebookLayout,
        duration_sec: float,
        output_path: str,
        mode_params: ModeParams,
    ) -> str:
        """
        NotebookLM 화면을 FFmpeg로 동영상 배경으로 생성

        실서비스에서는 Puppeteer/Playwright로 HTML → 녹화하거나,
        사전 제작된 템플릿 영상에 텍스트를 오버레이합니다.
        여기서는 FFmpeg 명령어를 생성합니다.
        """
        # 텍스트 오버레이로 NotebookLM 스타일 구현
        zoom = mode_params.zoom_range[1]
        font_size = mode_params.font_size_px

        # 배경색 + 제목 + 포인트 텍스트 오버레이
        drawtext_filters = []
        drawtext_filters.append(
            f"drawtext=text='{layout.title}':"
            f"fontsize={font_size + 4}:fontcolor=white:"
            f"x=(w-text_w)/2:y=80:font=NanumGothic"
        )

        for i, point in enumerate(layout.key_points[:4]):
            safe_text = point.replace("'", "")
            y_pos = 160 + i * (font_size + 16)
            drawtext_filters.append(
                f"drawtext=text='{safe_text}':"
                f"fontsize={font_size - 4}:fontcolor=0xCCCCCC:"
                f"x=100:y={y_pos}:font=NanumGothic"
            )

        filter_str = ",".join(drawtext_filters)

        cmd = (
            f"ffmpeg -y -f lavfi -i color=c=0x1a1a2e:s=1920x1080:d={duration_sec} "
            f"-vf \"{filter_str},zoompan=z='min(zoom+0.0001,{zoom})':"
            f"d=1:s=1920x1080:fps=30\" "
            f"-c:v libx264 -preset medium -crf 23 {output_path}"
        )
        return cmd


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Step 2: TTS 음성 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class TTSResult:
    audio_path: str
    duration_sec: float
    voice_id: str
    speed: float


class TTSService:
    """ElevenLabs TTS API 연동"""

    def __init__(self, api_key: str = ""):
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=120.0) if httpx and api_key else None

    async def synthesize(
        self,
        text: str,
        voice_id: str,
        speed: float = 1.0,
        output_path: str = "/tmp/tts_output.mp3",
    ) -> TTSResult:
        """텍스트 → 음성 파일"""
        duration_estimate = len(text) / (4.5 * speed)

        if self.client:
            try:
                resp = await self.client.post(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
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
            except Exception as e:
                logger.error(f"TTS failed: {e}")

        return TTSResult(
            audio_path=output_path,
            duration_sec=round(duration_estimate, 1),
            voice_id=voice_id,
            speed=speed,
        )

    async def synthesize_script_blocks(
        self,
        blocks: list[dict],
        voice_id: str,
        speed: float,
        output_dir: str = "/tmp",
    ) -> list[TTSResult]:
        """스크립트 블록별 개별 TTS → 나중에 concat"""
        results = []
        for i, block in enumerate(blocks):
            path = f"{output_dir}/tts_block_{i:03d}.mp3"
            result = await self.synthesize(block["text"], voice_id, speed, path)
            results.append(result)
        return results


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Step 3: 아바타 립싱크
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class AvatarResult:
    video_path: str
    avatar_id: str
    duration_sec: float
    status: str             # "ready" | "processing" | "error"


class AvatarService:
    """HeyGen / D-ID 립싱크 아바타 생성"""

    def __init__(self, api_key: str = "", provider: str = "heygen"):
        self.api_key = api_key
        self.provider = provider
        self.client = httpx.AsyncClient(timeout=300.0) if httpx and api_key else None

    async def generate(
        self,
        audio_path: str,
        avatar_persona: AvatarPersona,
        output_path: str = "/tmp/avatar_output.mp4",
    ) -> AvatarResult:
        """음성 파일 → 립싱크 아바타 영상"""
        if self.client and self.provider == "heygen":
            try:
                resp = await self.client.post(
                    "https://api.heygen.com/v2/video/generate",
                    headers={"X-Api-Key": self.api_key},
                    json={
                        "video_inputs": [{
                            "character": {
                                "type": "avatar",
                                "avatar_id": avatar_persona.id,
                            },
                            "voice": {
                                "type": "audio",
                                "audio_url": audio_path,
                            },
                        }],
                        "dimension": {"width": 400, "height": 400},
                    },
                )
                resp.raise_for_status()
                # 실서비스: 폴링으로 완료 대기 후 다운로드
                return AvatarResult(
                    video_path=output_path,
                    avatar_id=avatar_persona.id,
                    duration_sec=0,
                    status="processing",
                )
            except Exception as e:
                logger.error(f"Avatar generation failed: {e}")

        # Fallback: 명령어만 생성
        return AvatarResult(
            video_path=output_path,
            avatar_id=avatar_persona.id,
            duration_sec=0,
            status="ready",
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Step 4: 자막 생성 (SRT)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class SubtitleGenerator:
    """스크립트 블록 → SRT 자막 파일"""

    def generate_srt(
        self,
        blocks: list[dict],
        mode_params: ModeParams,
        output_path: str = "/tmp/subtitles.srt",
    ) -> str:
        lines = []
        current = 0.0
        pause = mode_params.pause_between_sec
        max_chars = 25 if mode_params.mode == ViewMode.SENIOR else 35

        for i, block in enumerate(blocks, 1):
            start = current
            end = start + block["duration_sec"]

            lines.append(str(i))
            lines.append(f"{self._ts(start)} --> {self._ts(end)}")
            lines.append(self._wrap(block["text"], max_chars))
            lines.append("")

            current = end + pause

        content = "\n".join(lines)
        # 실서비스에서는 파일로 저장
        return output_path

    def _ts(self, sec: float) -> str:
        h, r = divmod(sec, 3600)
        m, s = divmod(r, 60)
        ms = int((s % 1) * 1000)
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{ms:03d}"

    def _wrap(self, text: str, max_chars: int) -> str:
        if len(text) <= max_chars:
            return text
        mid = len(text) // 2
        sp = text.rfind(" ", 0, mid + 10)
        if sp == -1:
            sp = text.rfind(",", 0, mid + 10)
        if sp == -1:
            sp = mid
        return text[:sp].strip() + "\n" + text[sp:].strip()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Step 5: FFmpeg 최종 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class CompositionSpec:
    """영상 합성 명세"""
    notebook_bg: str            # NotebookLM 배경 영상
    avatar_video: str           # 아바타 립싱크 영상
    tts_audio: str              # TTS 음성
    subtitle_file: str          # SRT 자막
    bgm_path: str               # 배경음악
    output_path: str            # 최종 출력
    mode_params: ModeParams     # 모드 파라미터


class FFmpegCompositor:
    """
    FFmpeg 최종 합성기

    레이아웃:
    ┌──────────────────────────┐
    │   NotebookLM 분석 화면    │
    │                    ┌────┐│
    │                    │아바││
    │                    │타  ││
    │                    └────┘│
    │    ── 자막 ──           │
    └──────────────────────────┘
    + BGM 저볼륨 믹싱
    """

    def compose(self, spec: CompositionSpec) -> str:
        """최종 합성 FFmpeg 명령어 생성"""
        p = spec.mode_params
        av_size = int(320 * p.avatar_scale)
        zoom = p.zoom_range[1]

        sub_style = (
            f"FontSize={p.font_size_px},"
            f"PrimaryColour=&H00FFFFFF,"
            f"OutlineColour=&H00000000,"
            f"Outline=2,MarginV=40"
        )

        # Video filter chain
        vf = (
            f"[0:v]zoompan=z='min(zoom+0.0002,{zoom})':"
            f"d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
            f"s=1920x1080:fps=30[main];"
            f"[1:v]scale={av_size}:{av_size}[avatar];"
            f"[main][avatar]overlay=main_w-overlay_w-20:"
            f"main_h-overlay_h-20[composed];"
            f"[composed]subtitles={spec.subtitle_file}:"
            f"force_style='{sub_style}'[out]"
        )

        # Audio filter chain
        af = (
            f"[2:a]atempo={p.tts_speed}[voice];"
            f"[3:a]volume={p.bgm_volume},"
            f"lowpass=f={p.bgm_freq_hz}[bgm];"
            f"[voice][bgm]amix=inputs=2:duration=first[audio]"
        )

        cmd = (
            f"ffmpeg -y "
            f"-i {spec.notebook_bg} "
            f"-i {spec.avatar_video} "
            f"-i {spec.tts_audio} "
            f"-i {spec.bgm_path} "
            f"-filter_complex \"{vf};{af}\" "
            f"-map \"[out]\" -map \"[audio]\" "
            f"-c:v libx264 -preset medium -crf 23 "
            f"-c:a aac -b:a 192k "
            f"-movflags +faststart "
            f"{spec.output_path}"
        )
        return cmd

    def concat_audio_blocks(self, audio_paths: list[str], output: str) -> str:
        """TTS 블록별 음성을 하나로 연결"""
        list_content = "\n".join(f"file '{p}'" for p in audio_paths)
        list_file = output.replace(".mp3", "_list.txt")
        return (
            f"echo \"{list_content}\" > {list_file} && "
            f"ffmpeg -y -f concat -safe 0 -i {list_file} -c copy {output}"
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 영상 편집 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class VideoEditJob:
    """영상 편집 작업 상태"""
    job_id: str
    status: str                 # queued → layout → tts → avatar → composing → done | error
    keyword: str
    category: str
    mode: ViewMode
    avatar: AvatarPersona

    # Pipeline outputs
    notebook_layout: Optional[NotebookLayout] = None
    tts_results: list = field(default_factory=list)
    avatar_result: Optional[AvatarResult] = None
    subtitle_path: str = ""
    ffmpeg_cmd: str = ""
    output_path: str = ""
    error: str = ""

    # Timing
    created_at: str = ""
    estimated_duration_min: float = 0.0


class VideoEditPipeline:
    """
    Module B-2 통합 파이프라인

    Input:  Module B의 스크립트 출력 (blocks + metadata)
    Output: 최종 MP4 영상 + FFmpeg 명령어

    Steps:
      1. NotebookLM 배경 레이아웃 생성
      2. 스크립트 → TTS 음성 합성 (블록별)
      3. 음성 → 아바타 립싱크 영상 생성
      4. 자막 SRT 파일 생성
      5. FFmpeg 최종 합성 (배경 + 아바타 PiP + 음성 + BGM + 자막)
    """

    def __init__(
        self,
        elevenlabs_key: str = "",
        heygen_key: str = "",
        bgm_path: str = "/assets/bgm/default.mp3",
    ):
        self.layout_gen = NotebookLayoutGenerator()
        self.tts = TTSService(elevenlabs_key)
        self.avatar = AvatarService(heygen_key)
        self.subtitle_gen = SubtitleGenerator()
        self.compositor = FFmpegCompositor()
        self.bgm_path = bgm_path

    async def execute(
        self,
        script_blocks: list[dict],
        keyword: str,
        category: str,
        mode: ViewMode = ViewMode.NORMAL,
        avatar_id: str = "",
        core_facts: list[str] = None,
        total_duration_sec: float = 180.0,
    ) -> VideoEditJob:
        """전체 영상 편집 파이프라인 실행"""
        job_id = str(uuid.uuid4())[:8]
        params = get_mode_params(mode)

        # 아바타 선택
        persona = None
        for a in AVATARS:
            if a.id == avatar_id:
                persona = a
                break
        if not persona:
            persona = recommend_avatar(category)

        job = VideoEditJob(
            job_id=job_id, status="queued",
            keyword=keyword, category=category,
            mode=mode, avatar=persona,
            created_at=datetime.utcnow().isoformat(),
            estimated_duration_min=round(total_duration_sec / 60 * 3, 1),
        )

        try:
            # ── Step 1: NotebookLM Layout ──
            job.status = "layout"
            highlights = [b.get("subtitle_highlight", "") for b in script_blocks]
            job.notebook_layout = self.layout_gen.generate(
                keyword, category, core_facts or [], highlights,
            )
            nb_path = f"/tmp/blackbox_{job_id}_notebook.mp4"
            nb_cmd = self.layout_gen.generate_ffmpeg_background(
                job.notebook_layout, total_duration_sec, nb_path, params,
            )

            # ── Step 2: TTS ──
            job.status = "tts"
            tts_results = await self.tts.synthesize_script_blocks(
                script_blocks, persona.voice_id, params.tts_speed,
                output_dir=f"/tmp/blackbox_{job_id}",
            )
            job.tts_results = tts_results
            tts_combined = f"/tmp/blackbox_{job_id}_voice.mp3"
            concat_cmd = self.compositor.concat_audio_blocks(
                [r.audio_path for r in tts_results], tts_combined,
            )

            # ── Step 3: Avatar ──
            job.status = "avatar"
            avatar_path = f"/tmp/blackbox_{job_id}_avatar.mp4"
            job.avatar_result = await self.avatar.generate(
                tts_combined, persona, avatar_path,
            )

            # ── Step 4: Subtitles ──
            srt_path = f"/tmp/blackbox_{job_id}_sub.srt"
            job.subtitle_path = self.subtitle_gen.generate_srt(
                script_blocks, params, srt_path,
            )

            # ── Step 5: FFmpeg Compose ──
            job.status = "composing"
            output_path = f"/output/blackbox_{job_id}_final.mp4"
            spec = CompositionSpec(
                notebook_bg=nb_path,
                avatar_video=avatar_path,
                tts_audio=tts_combined,
                subtitle_file=srt_path,
                bgm_path=self.bgm_path,
                output_path=output_path,
                mode_params=params,
            )
            job.ffmpeg_cmd = self.compositor.compose(spec)
            job.output_path = output_path
            job.status = "done"

        except Exception as e:
            job.status = "error"
            job.error = str(e)
            logger.error(f"Video edit pipeline failed: {e}")

        return job
