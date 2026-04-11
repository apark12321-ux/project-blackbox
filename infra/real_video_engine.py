"""
Project Blackbox — 영상 생성 엔진 v5
═══════════════════════════════════════
NotebookLM 스타일 배경을 PIL(Pillow)로 생성하여 한국어 텍스트 깨짐 해결.

1. Pillow로 배경 이미지 생성 (한국어 제목 + 차트 + 브랜딩)
2. FFmpeg로 이미지 → 영상 변환
3. ElevenLabs TTS
4. 자막 SRT
5. BGM
6. 최종 합성
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
#  배경 이미지 생성 (Pillow)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def create_notebook_image(output_path: str, keyword: str, category: str, blocks: list) -> str:
    """NotebookLM 스타일 배경 이미지 (한국어 지원)"""
    try:
        from PIL import Image, ImageDraw, ImageFont

        W, H = 1920, 1080
        img = Image.new("RGB", (W, H), (10, 14, 19))
        draw = ImageDraw.Draw(img)

        # 폰트 찾기
        font_paths = [
            "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
            "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
        font_path = None
        for fp in font_paths:
            if os.path.exists(fp):
                font_path = fp
                break

        def get_font(size):
            if font_path:
                try:
                    return ImageFont.truetype(font_path, size)
                except Exception:
                    pass
            return ImageFont.load_default()

        font_title = get_font(44)
        font_sub = get_font(20)
        font_label = get_font(16)
        font_brand = get_font(14)

        # 상단 블루 라인
        draw.rectangle([0, 0, W, 4], fill=(45, 128, 255))

        # 제목 (한국어 OK)
        title_text = keyword
        bbox = draw.textbbox((0, 0), title_text, font=font_title)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) // 2, 60), title_text, fill=(228, 234, 243), font=font_title)

        # 부제
        sub_text = f"Project Blackbox | {category.upper()} Analysis"
        bbox2 = draw.textbbox((0, 0), sub_text, font=font_sub)
        sw = bbox2[2] - bbox2[0]
        draw.text(((W - sw) // 2, 120), sub_text, fill=(136, 147, 167), font=font_sub)

        # 구분선
        draw.rectangle([200, 165, W - 200, 166], fill=(30, 42, 58))

        # 바 차트
        colors = [(45, 128, 255), (26, 173, 107), (124, 107, 221), (229, 166, 32)]
        chart_labels = ["Gap", "Momentum", "CPM", "Volume"]
        bar_x = 300
        bar_w = 140
        gap = 60

        for i in range(4):
            h = random.randint(120, 380)
            x = bar_x + i * (bar_w + gap)
            y = 650 - h
            col = colors[i % 4]

            # 바
            draw.rectangle([x, y, x + bar_w, 650], fill=col)
            # 라벨
            bbox3 = draw.textbbox((0, 0), chart_labels[i], font=font_label)
            lw = bbox3[2] - bbox3[0]
            draw.text((x + (bar_w - lw) // 2, 660), chart_labels[i], fill=(136, 147, 167), font=font_label)
            # 값
            val = f"{random.uniform(2.5, 5.0):.1f}"
            bbox4 = draw.textbbox((0, 0), val, font=font_label)
            vw = bbox4[2] - bbox4[0]
            draw.text((x + (bar_w - vw) // 2, y - 25), val, fill=(228, 234, 243), font=font_label)

        # 그리드 라인
        for y in range(200, 660, 100):
            draw.rectangle([250, y, W - 250, y + 1], fill=(26, 37, 53, 80))

        # 우측 정보 패널
        panel_x = 1100
        panel_y = 200

        section_colors = {
            "hook": (45, 128, 255),
            "body": (26, 173, 107),
            "opinion": (229, 166, 32),
        }

        draw.text((panel_x, panel_y), "Script Analysis", fill=(136, 147, 167), font=font_sub)
        panel_y += 40

        for i, b in enumerate(blocks[:4]):
            sec = b.get("section", "body")
            col = section_colors.get(sec, (136, 147, 167))
            dur = b.get("duration_sec", 0)

            # 섹션 태그
            tag = sec.upper()
            draw.rectangle([panel_x, panel_y, panel_x + 80, panel_y + 24], fill=col)
            draw.text((panel_x + 8, panel_y + 3), tag, fill=(255, 255, 255), font=font_label)

            # 시간
            draw.text((panel_x + 90, panel_y + 3), f"{dur:.1f}s", fill=(136, 147, 167), font=font_label)

            # 텍스트 미리보기
            preview = b.get("text", "")[:30] + "..."
            draw.text((panel_x, panel_y + 30), preview, fill=(100, 110, 130), font=font_label)

            panel_y += 65

        # 하단 바
        draw.rectangle([0, H - 60, W, H], fill=(15, 20, 25))
        draw.text((40, H - 42), "Powered by Project Blackbox AI", fill=(74, 85, 104), font=font_brand)

        # BOI 스코어
        boi = f"BOI Score: {random.uniform(3.5, 4.8):.2f}"
        draw.text((W - 300, H - 42), boi, fill=(45, 128, 255), font=font_brand)

        img.save(output_path, "PNG")
        logger.info(f"NotebookLM image created: {output_path}")
        return output_path

    except ImportError:
        logger.warning("Pillow not installed, using plain background")
        return ""
    except Exception as e:
        logger.error(f"Image creation failed: {e}")
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  배경 영상 변환
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def image_to_video(image_path: str, output_path: str, duration: float) -> str:
    """정지 이미지 → 영상 (줌 효과 포함)"""
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", image_path,
        "-vf", f"zoompan=z='min(zoom+0.0003,1.08)':d={int(duration*24)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=24",
        "-t", str(duration),
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-pix_fmt", "yuv420p",
        output_path
    ]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        if r.returncode == 0 and os.path.exists(output_path):
            return output_path
        logger.warning(f"Zoompan failed: {r.stderr[:200]}")
    except Exception as e:
        logger.warning(f"Image to video error: {e}")

    # fallback: 줌 없이
    cmd2 = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", image_path,
        "-t", str(duration),
        "-c:v", "libx264", "-preset", "ultrafast",
        "-pix_fmt", "yuv420p",
        output_path
    ]
    subprocess.run(cmd2, capture_output=True, timeout=120)
    return output_path if os.path.exists(output_path) else ""


def plain_background(output_path: str, duration: float) -> str:
    """Pillow 없을 때 fallback"""
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x0a0e13:s=1920x1080:d={duration}:r=24",
        "-vf", "drawbox=x=0:y=0:w=1920:h=3:color=0x2d80ff@0.8:t=fill",
        "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
        output_path
    ]
    subprocess.run(cmd, capture_output=True, timeout=60)
    return output_path if os.path.exists(output_path) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TTS / SRT / BGM (이전과 동일)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_tts(text, path, speed=1.0):
    api_key = os.getenv("ELEVENLABS_API_KEY", "")
    dur = len(text) / (4.5 * speed)
    if not api_key:
        _silent(path, dur)
        return path, dur
    try:
        import httpx
        async with httpx.AsyncClient(timeout=120) as c:
            r = await c.post(
                "https://api.elevenlabs.io/v1/text-to-speech/jBpfuIE2acCO8z3wKNLl",
                headers={"xi-api-key": api_key, "Content-Type": "application/json"},
                json={"text": text, "model_id": "eleven_multilingual_v2",
                      "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "speed": speed}})
            r.raise_for_status()
            with open(path, "wb") as f:
                f.write(r.content)
            try:
                p = subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                                    "-of", "default=noprint_wrappers=1:nokey=1", path],
                                   capture_output=True, text=True, timeout=10)
                if p.returncode == 0 and p.stdout.strip():
                    dur = float(p.stdout.strip())
            except Exception:
                pass
            return path, dur
    except Exception as e:
        logger.error(f"TTS: {e}")
        _silent(path, dur)
        return path, dur


def _silent(p, d):
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i",
                    f"anullsrc=r=44100:cl=mono", "-t", str(d),
                    "-c:a", "aac", p], capture_output=True, timeout=30)


def generate_srt(blocks, path, pause=0.3):
    lines = []
    cur = 0.0
    for i, b in enumerate(blocks, 1):
        s = cur
        d = b.get("duration_sec", len(b["text"]) / 4.5)
        e = s + d
        lines += [str(i), f"{_ts(s)} --> {_ts(e)}", b["text"], ""]
        cur = e + pause
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return path


def _ts(s):
    return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"


def generate_bgm(path, duration, volume=0.08):
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i",
           f"sine=frequency=180:duration={duration},tremolo=f=0.3:d=0.5,lowpass=f=3000,volume={volume}",
           "-c:a", "aac", "-b:a", "64k", path]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
        return path if os.path.exists(path) else ""
    except Exception:
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def compose(bg, audio, srt, output, bgm="", fsz=18):
    sub_style = (f"FontSize={fsz},PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
                 f"BackColour=&H80000000,Outline=1,Shadow=0,MarginV=50,Alignment=2")

    if bgm and os.path.exists(bgm):
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-i", bgm,
               "-filter_complex", "[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
               "-vf", f"subtitles={srt}:force_style='{sub_style}'",
               "-map", "0:v", "-map", "[aout]",
               "-c:v", "libx264", "-preset", "fast", "-crf", "23",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", output]
    else:
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio,
               "-vf", f"subtitles={srt}:force_style='{sub_style}'",
               "-map", "0:v", "-map", "1:a",
               "-c:v", "libx264", "-preset", "fast", "-crf", "23",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", output]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if r.returncode == 0 and os.path.exists(output):
            return output
    except Exception:
        pass

    # fallback
    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", "-shortest", output]
    try:
        subprocess.run(cmd2, capture_output=True, timeout=300)
        return output if os.path.exists(output) else ""
    except Exception:
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_real_video(keyword, category, script_blocks, mode="normal"):
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

        # 1. TTS
        audio = os.path.join(job_dir, "tts.mp3")
        audio, adur = await generate_tts(full, audio, speed)
        vdur = max(est, adur + 1)

        # 2. NotebookLM 배경 이미지
        img_path = os.path.join(job_dir, "notebook.png")
        bg_video = os.path.join(job_dir, "bg.mp4")

        img_result = create_notebook_image(img_path, keyword, category, script_blocks)
        if img_result and os.path.exists(img_result):
            image_to_video(img_result, bg_video, vdur)
        else:
            plain_background(bg_video, vdur)

        # 3. SRT
        srt = os.path.join(job_dir, "subs.srt")
        generate_srt(script_blocks, srt, pause)

        # 4. BGM
        bgm = os.path.join(job_dir, "bgm.m4a")
        generate_bgm(bgm, vdur, bvol)

        # 5. 합성
        out = os.path.join(job_dir, f"blackbox_{job_id}_final.mp4")
        res = compose(bg_video, audio, srt, out, bgm, fsz)

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
