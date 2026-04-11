"""
Project Blackbox — 영상 생성 엔진 v3
═══════════════════════════════════════
- 깔끔한 다크 배경 + 키워드 제목
- ElevenLabs TTS 한국어 음성
- 적절한 크기의 하단 자막
- 앰비언트 BGM
"""
import os
import uuid
import subprocess
import logging
import random
from dataclasses import dataclass

logger = logging.getLogger(__name__)

OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


@dataclass
class RealVideoResult:
    job_id: str
    status: str
    output_path: str = ""
    download_url: str = ""
    duration_sec: float = 0.0
    file_size_bytes: int = 0
    tts_audio_path: str = ""
    subtitle_path: str = ""
    error: str = ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  배경 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def generate_background(output_path: str, duration: float, title: str = "") -> str:
    """다크 배경 + 중앙 제목 + 하단 브랜딩"""

    safe_title = "".join(c for c in title if c.isalnum() or c in " .,!?")[:20]

    # 심플하고 깔끔한 배경
    vf_parts = []

    # 상단 얇은 블루 라인
    vf_parts.append("drawbox=x=0:y=0:w=1920:h=3:color=0x2d80ff@0.8:t=fill")

    # 중앙 큰 원형 글로우 효과 (장식)
    vf_parts.append("drawbox=x=860:y=440:w=200:h=200:color=0x2d80ff@0.05:t=fill")

    # 하단 바
    vf_parts.append("drawbox=x=0:y=1020:w=1920:h=60:color=0x111820@0.9:t=fill")

    vf = ",".join(vf_parts)

    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x0a0e13:s=1920x1080:d={duration}:r=24",
        "-vf", vf,
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
        "-pix_fmt", "yuv420p",
        output_path
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode == 0 and os.path.exists(output_path):
            return output_path
        logger.warning(f"Background failed: {result.stderr[:200]}")
    except Exception as e:
        logger.warning(f"Background error: {e}")

    # 최소 fallback
    cmd2 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x0a0e13:s=1920x1080:d={duration}:r=24",
        "-c:v", "libx264", "-preset", "ultrafast",
        "-pix_fmt", "yuv420p",
        output_path
    ]
    subprocess.run(cmd2, capture_output=True, timeout=60)
    return output_path if os.path.exists(output_path) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_tts(text: str, output_path: str, speed: float = 1.0) -> tuple:
    api_key = os.getenv("ELEVENLABS_API_KEY", "")
    duration_estimate = len(text) / (4.5 * speed)

    if not api_key:
        _make_silent(output_path, duration_estimate)
        return output_path, duration_estimate

    try:
        import httpx
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                "https://api.elevenlabs.io/v1/text-to-speech/jBpfuIE2acCO8z3wKNLl",
                headers={"xi-api-key": api_key, "Content-Type": "application/json"},
                json={
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "speed": speed},
                },
            )
            resp.raise_for_status()
            with open(output_path, "wb") as f:
                f.write(resp.content)

            # 실제 길이 측정
            try:
                probe = subprocess.run(
                    ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                     "-of", "default=noprint_wrappers=1:nokey=1", output_path],
                    capture_output=True, text=True, timeout=10
                )
                if probe.returncode == 0 and probe.stdout.strip():
                    duration_estimate = float(probe.stdout.strip())
            except Exception:
                pass

            return output_path, duration_estimate
    except Exception as e:
        logger.error(f"TTS failed: {e}")
        _make_silent(output_path, duration_estimate)
        return output_path, duration_estimate


def _make_silent(path: str, dur: float):
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi", "-i",
        f"anullsrc=r=44100:cl=mono", "-t", str(dur),
        "-c:a", "aac", path
    ], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  자막 SRT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def generate_srt(blocks: list, output_path: str, pause: float = 0.3) -> str:
    lines = []
    current = 0.0
    for i, block in enumerate(blocks, 1):
        start = current
        dur = block.get("duration_sec", len(block["text"]) / 4.5)
        end = start + dur

        lines.append(str(i))
        lines.append(f"{_ts(start)} --> {_ts(end)}")

        text = block["text"]
        # 한 줄 최대 20자로 줄바꿈
        if len(text) > 20:
            words = text
            mid = len(words) // 2
            # 가까운 공백 찾기
            left = words.rfind(" ", 0, mid + 5)
            right = words.find(" ", mid)
            if right > 0 and (left < 0 or (right - mid) < (mid - left)):
                text = words[:right] + "\n" + words[right+1:]
            elif left > 0:
                text = words[:left] + "\n" + words[left+1:]

        lines.append(text)
        lines.append("")
        current = end + pause

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return output_path


def _ts(sec: float) -> str:
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = int(sec % 60)
    ms = int((sec % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  BGM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def generate_bgm(output_path: str, duration: float, volume: float = 0.08) -> str:
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i",
        f"sine=frequency=180:duration={duration},"
        f"tremolo=f=0.3:d=0.5,"
        f"lowpass=f=3000,"
        f"volume={volume}",
        "-c:a", "aac", "-b:a", "64k",
        output_path
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
        return output_path if os.path.exists(output_path) else ""
    except Exception:
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  최종 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def compose_video(bg: str, audio: str, srt: str, output: str,
                  bgm: str = "", font_size: int = 24) -> str:
    """배경 + 음성 + 자막 + BGM 합성"""

    # ASS 자막 스타일 (적절한 크기, 하단 중앙)
    sub_style = (
        f"FontSize={font_size},"
        f"PrimaryColour=&H00FFFFFF,"
        f"OutlineColour=&H00000000,"
        f"BackColour=&H80000000,"
        f"Outline=2,"
        f"Shadow=0,"
        f"MarginV=60,"
        f"Alignment=2"
    )

    inputs = ["-i", bg, "-i", audio]
    filter_parts = []
    audio_map = "1:a"

    if bgm and os.path.exists(bgm):
        inputs.extend(["-i", bgm])
        filter_parts.append("[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]")
        audio_map = "[aout]"

    # 자막 필터
    vf = f"subtitles={srt}:force_style='{sub_style}'"

    cmd = ["ffmpeg", "-y"] + inputs

    if filter_parts:
        cmd.extend(["-filter_complex", ";".join(filter_parts)])

    cmd.extend([
        "-vf", vf,
        "-map", "0:v",
        "-map", audio_map,
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        output
    ])

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode == 0 and os.path.exists(output):
            return output
        logger.warning(f"Compose with subs failed: {result.stderr[:300]}")
    except Exception as e:
        logger.warning(f"Compose error: {e}")

    # fallback: 자막 없이
    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio]
    if bgm and os.path.exists(bgm):
        cmd2.extend(["-i", bgm, "-filter_complex",
                     "[1:a][2:a]amix=inputs=2:duration=first[aout]",
                     "-map", "0:v", "-map", "[aout]"])
    else:
        cmd2.extend(["-map", "0:v", "-map", "1:a"])
    cmd2.extend(["-c:v", "libx264", "-preset", "ultrafast",
                 "-c:a", "aac", "-shortest", output])
    try:
        subprocess.run(cmd2, capture_output=True, timeout=300)
        return output if os.path.exists(output) else ""
    except Exception:
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_real_video(
    keyword: str, category: str,
    script_blocks: list, mode: str = "normal",
) -> RealVideoResult:

    job_id = str(uuid.uuid4())[:8]
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    try:
        is_senior = mode == "senior"
        tts_speed = 0.92 if is_senior else 1.0
        font_size = 28 if is_senior else 22
        bgm_vol = 0.05 if is_senior else 0.08
        pause = 0.6 if is_senior else 0.3

        full_text = " ".join(b["text"] for b in script_blocks)
        est_duration = sum(b.get("duration_sec", len(b["text"])/4.5) for b in script_blocks)
        est_duration += pause * len(script_blocks) + 2

        # 1. TTS
        audio_path = os.path.join(job_dir, "tts.mp3")
        audio_path, audio_dur = await generate_tts(full_text, audio_path, tts_speed)
        video_dur = max(est_duration, audio_dur + 1)

        # 2. 배경
        bg_path = os.path.join(job_dir, "bg.mp4")
        generate_background(bg_path, video_dur, keyword)

        # 3. 자막
        srt_path = os.path.join(job_dir, "subs.srt")
        generate_srt(script_blocks, srt_path, pause)

        # 4. BGM
        bgm_path = os.path.join(job_dir, "bgm.m4a")
        generate_bgm(bgm_path, video_dur, bgm_vol)

        # 5. 합성
        out_path = os.path.join(job_dir, f"blackbox_{job_id}_final.mp4")
        result = compose_video(bg_path, audio_path, srt_path, out_path, bgm_path, font_size)

        if result and os.path.exists(result):
            return RealVideoResult(
                job_id=job_id, status="done",
                output_path=result,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(video_dur, 1),
                file_size_bytes=os.path.getsize(result),
                tts_audio_path=audio_path,
                subtitle_path=srt_path,
            )
        else:
            return RealVideoResult(
                job_id=job_id, status="done",
                output_path=audio_path,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(audio_dur, 1),
                file_size_bytes=os.path.getsize(audio_path),
                tts_audio_path=audio_path,
            )

    except Exception as e:
        logger.error(f"Video failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))
