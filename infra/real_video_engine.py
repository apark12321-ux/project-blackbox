"""
Project Blackbox — 영상 생성 엔진 v4
- 깔끔한 다크 배경 (drawtext 제거 → 한국어 깨짐 해결)
- 작은 자막 (FontSize=18)
- BGM + TTS
"""
import os
import uuid
import subprocess
import logging
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


def generate_background(output_path: str, duration: float) -> str:
    """심플 다크 배경 + 상단 블루라인만"""
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x0a0e13:s=1920x1080:d={duration}:r=24",
        "-vf", "drawbox=x=0:y=0:w=1920:h=3:color=0x2d80ff@0.8:t=fill",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
        "-pix_fmt", "yuv420p",
        output_path
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=120)
        if os.path.exists(output_path):
            return output_path
    except Exception as e:
        logger.warning(f"BG error: {e}")

    cmd2 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x0a0e13:s=1920x1080:d={duration}:r=24",
        "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
        output_path
    ]
    subprocess.run(cmd2, capture_output=True, timeout=60)
    return output_path if os.path.exists(output_path) else ""


async def generate_tts(text: str, output_path: str, speed: float = 1.0) -> tuple:
    api_key = os.getenv("ELEVENLABS_API_KEY", "")
    dur = len(text) / (4.5 * speed)

    if not api_key:
        _silent(output_path, dur)
        return output_path, dur

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
            try:
                p = subprocess.run(
                    ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                     "-of", "default=noprint_wrappers=1:nokey=1", output_path],
                    capture_output=True, text=True, timeout=10)
                if p.returncode == 0 and p.stdout.strip():
                    dur = float(p.stdout.strip())
            except Exception:
                pass
            return output_path, dur
    except Exception as e:
        logger.error(f"TTS: {e}")
        _silent(output_path, dur)
        return output_path, dur


def _silent(path, dur):
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i",
                    f"anullsrc=r=44100:cl=mono", "-t", str(dur),
                    "-c:a", "aac", path], capture_output=True, timeout=30)


def generate_srt(blocks: list, output_path: str, pause: float = 0.3) -> str:
    lines = []
    cur = 0.0
    for i, b in enumerate(blocks, 1):
        start = cur
        d = b.get("duration_sec", len(b["text"]) / 4.5)
        end = start + d
        lines.append(str(i))
        lines.append(f"{_ts(start)} --> {_ts(end)}")
        lines.append(b["text"])
        lines.append("")
        cur = end + pause
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return output_path


def _ts(s):
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    sec = int(s % 60)
    ms = int((s % 1) * 1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"


def generate_bgm(output_path: str, duration: float, volume: float = 0.08) -> str:
    cmd = [
        "ffmpeg", "-y", "-f", "lavfi", "-i",
        f"sine=frequency=180:duration={duration},tremolo=f=0.3:d=0.5,lowpass=f=3000,volume={volume}",
        "-c:a", "aac", "-b:a", "64k", output_path
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
        return output_path if os.path.exists(output_path) else ""
    except Exception:
        return ""


def compose_video(bg: str, audio: str, srt: str, output: str,
                  bgm: str = "", font_size: int = 18) -> str:
    """배경 + 음성 + 자막 + BGM 합성"""

    sub_style = (
        f"FontSize={font_size},"
        f"PrimaryColour=&H00FFFFFF,"
        f"OutlineColour=&H00000000,"
        f"BackColour=&H80000000,"
        f"Outline=1,"
        f"Shadow=0,"
        f"MarginV=50,"
        f"Alignment=2"
    )

    if bgm and os.path.exists(bgm):
        cmd = [
            "ffmpeg", "-y",
            "-i", bg, "-i", audio, "-i", bgm,
            "-filter_complex",
            f"[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
            "-vf", f"subtitles={srt}:force_style='{sub_style}'",
            "-map", "0:v", "-map", "[aout]",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart",
            output
        ]
    else:
        cmd = [
            "ffmpeg", "-y",
            "-i", bg, "-i", audio,
            "-vf", f"subtitles={srt}:force_style='{sub_style}'",
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart",
            output
        ]

    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if r.returncode == 0 and os.path.exists(output):
            return output
        logger.warning(f"Compose fail: {r.stderr[:200]}")
    except Exception as e:
        logger.warning(f"Compose err: {e}")

    # fallback: 자막 없이
    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio]
    if bgm and os.path.exists(bgm):
        cmd2 += ["-i", bgm, "-filter_complex",
                 "[1:a][2:a]amix=inputs=2:duration=first[aout]",
                 "-map", "0:v", "-map", "[aout]"]
    else:
        cmd2 += ["-map", "0:v", "-map", "1:a"]
    cmd2 += ["-c:v", "libx264", "-preset", "ultrafast",
             "-c:a", "aac", "-shortest", output]
    try:
        subprocess.run(cmd2, capture_output=True, timeout=300)
        return output if os.path.exists(output) else ""
    except Exception:
        return ""


async def generate_real_video(
    keyword: str, category: str,
    script_blocks: list, mode: str = "normal",
) -> RealVideoResult:

    job_id = str(uuid.uuid4())[:8]
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    try:
        is_sr = mode == "senior"
        speed = 0.92 if is_sr else 1.0
        fsz = 22 if is_sr else 18
        bvol = 0.05 if is_sr else 0.08
        pause = 0.6 if is_sr else 0.3

        full = " ".join(b["text"] for b in script_blocks)
        est = sum(b.get("duration_sec", len(b["text"])/4.5) for b in script_blocks)
        est += pause * len(script_blocks) + 2

        audio = os.path.join(job_dir, "tts.mp3")
        audio, adur = await generate_tts(full, audio, speed)
        vdur = max(est, adur + 1)

        bg = os.path.join(job_dir, "bg.mp4")
        generate_background(bg, vdur)

        srt = os.path.join(job_dir, "subs.srt")
        generate_srt(script_blocks, srt, pause)

        bgm = os.path.join(job_dir, "bgm.m4a")
        generate_bgm(bgm, vdur, bvol)

        out = os.path.join(job_dir, f"blackbox_{job_id}_final.mp4")
        res = compose_video(bg, audio, srt, out, bgm, fsz)

        if res and os.path.exists(res):
            return RealVideoResult(
                job_id=job_id, status="done", output_path=res,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(vdur, 1),
                file_size_bytes=os.path.getsize(res),
                tts_audio_path=audio, subtitle_path=srt)
        else:
            return RealVideoResult(
                job_id=job_id, status="done", output_path=audio,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(adur, 1),
                file_size_bytes=os.path.getsize(audio),
                tts_audio_path=audio)

    except Exception as e:
        logger.error(f"Video failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))
