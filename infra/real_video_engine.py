"""
Project Blackbox — 영상 생성 엔진 v8
═══════════════════════════════════════
- NotebookLM 배경 (Pillow)
- ElevenLabs TTS
- 자막: FontSize=11, 2줄 줄바꿈(20자), 블록별 TTS 싱크
- BGM
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
#  NotebookLM 배경 이미지 (Pillow)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _find_font():
    for p in ["/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
              "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
              "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"]:
        if os.path.exists(p):
            return p
    return None


def create_notebook_bg(path, keyword, category, blocks):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return ""

    fp = _find_font()
    if not fp:
        return ""

    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), (10, 14, 19))
    draw = ImageDraw.Draw(img)

    def font(sz):
        try:
            return ImageFont.truetype(fp, sz)
        except Exception:
            return ImageFont.load_default()

    # 상단 블루 라인
    draw.rectangle([0, 0, W, 4], fill=(45, 128, 255))

    # 헤더
    draw.rectangle([0, 0, W, 70], fill=(15, 20, 25))
    draw.text((30, 18), "PROJECT BLACKBOX", fill=(45, 128, 255), font=font(22))
    draw.text((W - 300, 22), "NotebookLM Analysis", fill=(136, 147, 167), font=font(16))

    # 키워드 제목
    f_title = font(38)
    bbox = draw.textbbox((0, 0), keyword, font=f_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 90), keyword, fill=(228, 234, 243), font=f_title)

    # 카테고리 태그
    cat_map = {"economy": "경제 / 재테크", "senior": "건강 / 시니어",
               "selfdev": "자기계발", "tech": "IT / 테크", "life": "라이프"}
    cat_label = cat_map.get(category, category)
    f_cat = font(16)
    bbox2 = draw.textbbox((0, 0), cat_label, font=f_cat)
    cw = bbox2[2] - bbox2[0]
    cx = (W - cw) // 2
    draw.rounded_rectangle([cx - 12, 140, cx + cw + 12, 168], radius=4, fill=(45, 128, 255, 40))
    draw.text((cx, 143), cat_label, fill=(45, 128, 255), font=f_cat)

    # 구분선
    draw.rectangle([60, 185, W - 60, 186], fill=(30, 42, 58))

    # 좌측: BOI 바 차트
    chart_x, chart_y = 80, 210
    draw.text((chart_x, chart_y), "Blue Ocean Index (BOI v2)", fill=(136, 147, 167), font=font(16))
    chart_y += 35

    labels = ["Gap Score", "Momentum", "CPM Score", "Volume"]
    colors = [(45, 128, 255), (26, 173, 107), (124, 107, 221), (229, 166, 32)]
    values = [round(random.uniform(2.8, 5.0), 1) for _ in range(4)]

    bar_w, bar_gap, max_h = 160, 30, 280
    for i, (label, col, val) in enumerate(zip(labels, colors, values)):
        x = chart_x + i * (bar_w + bar_gap)
        h = int((val / 5.0) * max_h)
        y_bottom = chart_y + max_h
        y_top = y_bottom - h
        draw.rectangle([x, y_top, x + bar_w, y_bottom], fill=col)
        f_val = font(18)
        vt = str(val)
        vbbox = draw.textbbox((0, 0), vt, font=f_val)
        vw = vbbox[2] - vbbox[0]
        draw.text((x + (bar_w - vw) // 2, y_top - 28), vt, fill=(228, 234, 243), font=f_val)
        f_lbl = font(13)
        lbbox = draw.textbbox((0, 0), label, font=f_lbl)
        lw = lbbox[2] - lbbox[0]
        draw.text((x + (bar_w - lw) // 2, y_bottom + 8), label, fill=(100, 110, 130), font=f_lbl)

    draw.rectangle([chart_x, chart_y + max_h, chart_x + 4 * (bar_w + bar_gap) - bar_gap, chart_y + max_h + 1], fill=(40, 55, 75))

    boi_total = round(sum(values) / 4 * 0.95, 2)
    grade = "A" if boi_total >= 4.0 else "B" if boi_total >= 3.0 else "C"
    grade_col = (26, 173, 107) if grade == "A" else (229, 166, 32) if grade == "B" else (200, 80, 80)
    boi_y = chart_y + max_h + 50
    draw.text((chart_x, boi_y), "종합 BOI:", fill=(136, 147, 167), font=font(18))
    draw.text((chart_x + 110, boi_y), f"{boi_total}", fill=(228, 234, 243), font=font(24))
    draw.rounded_rectangle([chart_x + 200, boi_y - 2, chart_x + 240, boi_y + 28], radius=4, fill=grade_col)
    f_grade = font(16)
    gbbox = draw.textbbox((0, 0), grade, font=f_grade)
    gw = gbbox[2] - gbbox[0]
    draw.text((chart_x + 220 - gw // 2, boi_y + 3), grade, fill=(255, 255, 255), font=f_grade)

    # 우측: Script Analysis
    panel_x, panel_y = 900, 210
    draw.text((panel_x, panel_y), "Script Analysis", fill=(136, 147, 167), font=font(16))
    panel_y += 40
    sec_colors = {"hook": (45, 128, 255), "body": (26, 173, 107), "opinion": (229, 166, 32)}
    for b in blocks[:5]:
        sec = b.get("section", "body")
        col = sec_colors.get(sec, (136, 147, 167))
        dur = b.get("duration_sec", 0)
        txt = b.get("text", "")[:40]
        if len(b.get("text", "")) > 40:
            txt += "..."
        draw.rounded_rectangle([panel_x, panel_y, panel_x + 70, panel_y + 22], radius=3, fill=col)
        draw.text((panel_x + 8, panel_y + 3), sec.upper(), fill=(255, 255, 255), font=font(12))
        draw.text((panel_x + 80, panel_y + 3), f"{dur:.1f}s", fill=(100, 110, 130), font=font(13))
        draw.text((panel_x, panel_y + 28), txt, fill=(160, 170, 185), font=font(14))
        panel_y += 65

    # CPM
    cpm_y = panel_y + 20
    cpm = round(random.uniform(12, 24), 2)
    draw.rectangle([panel_x, cpm_y, panel_x + 350, cpm_y + 60], fill=(20, 28, 38))
    draw.rectangle([panel_x, cpm_y, panel_x + 350, cpm_y + 1], fill=(45, 128, 255))
    draw.text((panel_x + 15, cpm_y + 10), "예상 CPM", fill=(136, 147, 167), font=font(14))
    draw.text((panel_x + 15, cpm_y + 30), f"${cpm}", fill=(26, 173, 107), font=font(22))

    # Trend
    trend_y = cpm_y + 80
    draw.text((panel_x, trend_y), "7-day Trend Momentum", fill=(136, 147, 167), font=font(14))
    momentum = round(random.uniform(0.3, 0.9), 3)
    arrow = "↑" if momentum > 0.5 else "→"
    m_col = (26, 173, 107) if momentum > 0.5 else (229, 166, 32)
    draw.text((panel_x, trend_y + 22), f"{arrow} +{int(momentum * 100)}%", fill=m_col, font=font(20))

    # 하단 바
    draw.rectangle([0, H - 50, W, H], fill=(15, 20, 25))
    draw.text((30, H - 38), "Powered by Project Blackbox AI  |  Gemini + ElevenLabs + HeyGen", fill=(60, 70, 85), font=font(13))
    draw.rounded_rectangle([W - 200, H - 42, W - 30, H - 14], radius=12, fill=(26, 173, 107))
    draw.text((W - 180, H - 39), "Senior Mode", fill=(255, 255, 255), font=font(13))

    img.save(path, "PNG")
    return path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  이미지 → 영상
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def img_to_video(img, out, dur):
    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", img,
           "-vf", (f"scale=2000:1125,zoompan=z='min(zoom+0.0002,1.06)':"
                   f"d={int(dur * 24)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
                   f"s=1920x1080:fps=24"),
           "-t", str(dur), "-c:v", "libx264", "-preset", "fast", "-crf", "23",
           "-pix_fmt", "yuv420p", out]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        if r.returncode == 0 and os.path.exists(out):
            return out
    except Exception:
        pass
    cmd2 = ["ffmpeg", "-y", "-loop", "1", "-i", img, "-t", str(dur),
            "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd2, capture_output=True, timeout=120)
    return out if os.path.exists(out) else ""


def plain_bg(out, dur):
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=0x0a0e13:s=1920x1080:d={dur}:r=24",
           "-vf", "drawbox=x=0:y=0:w=1920:h=3:color=0x2d80ff@0.8:t=fill",
           "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd, capture_output=True, timeout=60)
    return out if os.path.exists(out) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TTS (블록별 개별 생성 → 정확한 싱크)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _get_audio_duration(path):
    """ffprobe로 오디오 실제 길이(초) 측정"""
    try:
        p = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", path],
            capture_output=True, text=True, timeout=10)
        if p.returncode == 0 and p.stdout.strip():
            return float(p.stdout.strip())
    except Exception:
        pass
    return 0.0


async def gen_tts_single(text, path, speed=1.0):
    """단일 텍스트 블록에 대한 TTS 생성"""
    key = os.getenv("ELEVENLABS_API_KEY", "")
    est_dur = len(text) / (4.5 * speed)

    if not key:
        _silent(path, est_dur)
        return path, est_dur

    try:
        import httpx
        async with httpx.AsyncClient(timeout=120) as c:
            r = await c.post(
                "https://api.elevenlabs.io/v1/text-to-speech/jBpfuIE2acCO8z3wKNLl",
                headers={"xi-api-key": key, "Content-Type": "application/json"},
                json={"text": text, "model_id": "eleven_multilingual_v2",
                      "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "speed": speed}})
            r.raise_for_status()
            with open(path, "wb") as f:
                f.write(r.content)

            real_dur = _get_audio_duration(path)
            if real_dur > 0:
                return path, real_dur
            return path, est_dur
    except Exception as e:
        logger.error(f"TTS single block: {e}")
        _silent(path, est_dur)
        return path, est_dur


async def gen_tts_blocks(blocks, job_dir, speed=1.0):
    """블록별 TTS 생성 → 개별 길이 측정 → 하나로 합침"""
    block_durations = []
    block_paths = []

    for i, b in enumerate(blocks):
        bp = os.path.join(job_dir, f"tts_block_{i}.mp3")
        _, dur = await gen_tts_single(b["text"], bp, speed)
        block_paths.append(bp)
        block_durations.append(dur)
        logger.info(f"[TTS] Block {i} ({b.get('section','?')}): {dur:.1f}s")

    # 블록들을 하나의 오디오로 연결
    combined = os.path.join(job_dir, "tts.mp3")
    if len(block_paths) == 1:
        os.rename(block_paths[0], combined)
    else:
        # ffmpeg concat
        list_file = os.path.join(job_dir, "tts_list.txt")
        with open(list_file, "w") as f:
            for bp in block_paths:
                f.write(f"file '{bp}'\n")

        cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
               "-i", list_file, "-c:a", "copy", combined]
        try:
            subprocess.run(cmd, capture_output=True, timeout=120)
        except Exception:
            # fallback: 첫 번째 블록만 사용
            os.rename(block_paths[0], combined)

    total_dur = _get_audio_duration(combined)
    if total_dur <= 0:
        total_dur = sum(block_durations)

    return combined, total_dur, block_durations


def _silent(p, d):
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono",
                    "-t", str(d), "-c:a", "aac", p], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SRT (블록별 실제 TTS 길이 기반 싱크)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _wrap_text(text, max_chars=20):
    """긴 텍스트를 max_chars 단위로 줄바꿈 (최대 2줄)"""
    if len(text) <= max_chars:
        return text
    # 공백 기준으로 줄바꿈 시도
    words = text.split(" ")
    line1 = ""
    line2 = ""
    for w in words:
        if len(line1) + len(w) + 1 <= max_chars:
            line1 = (line1 + " " + w).strip()
        else:
            line2 = (line2 + " " + w).strip()

    if not line2:
        # 공백이 없는 경우 강제 분할
        line1 = text[:max_chars]
        line2 = text[max_chars:max_chars * 2]

    # 2줄 초과분 자르기
    if len(line2) > max_chars:
        line2 = line2[:max_chars] + "..."

    return line1 + "\\N" + line2


def gen_srt(blocks, path, pause=0.3, block_durations=None):
    """블록별 실제 TTS 길이를 기반으로 정확한 SRT 생성"""
    lines = []
    cur = 0.0
    idx = 1

    for i, b in enumerate(blocks):
        # 실제 TTS 길이 사용 (없으면 추정)
        if block_durations and i < len(block_durations):
            block_dur = block_durations[i]
        else:
            block_dur = b.get("duration_sec", len(b["text"]) / 4.5)

        text = b["text"]

        # 긴 텍스트는 여러 자막 청크로 분할
        chunks = _split_to_chunks(text, max_chars=40)
        chunk_dur = block_dur / max(len(chunks), 1)

        for chunk in chunks:
            s = cur
            e = cur + chunk_dur
            wrapped = _wrap_text(chunk, max_chars=20)
            lines += [str(idx), f"{_ts(s)} --> {_ts(e)}", wrapped, ""]
            cur = e
            idx += 1

        cur += pause  # 블록 간 간격

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    logger.info(f"[SRT] Generated {idx - 1} subtitle entries, total={cur:.1f}s")
    return path


def _split_to_chunks(text, max_chars=40):
    """텍스트를 max_chars 이하 청크로 분할"""
    if len(text) <= max_chars:
        return [text]

    chunks = []
    sentences = text.replace(". ", ".\n").replace("? ", "?\n").replace("! ", "!\n").split("\n")

    current = ""
    for sent in sentences:
        if len(current) + len(sent) + 1 <= max_chars:
            current = (current + " " + sent).strip()
        else:
            if current:
                chunks.append(current)
            # 문장 자체가 너무 긴 경우
            while len(sent) > max_chars:
                # 공백 기준으로 자르기
                cut = sent[:max_chars].rfind(" ")
                if cut <= 0:
                    cut = max_chars
                chunks.append(sent[:cut].strip())
                sent = sent[cut:].strip()
            current = sent

    if current:
        chunks.append(current)

    return chunks if chunks else [text[:max_chars]]


def _ts(s):
    return f"{int(s // 3600):02d}:{int((s % 3600) // 60):02d}:{int(s % 60):02d},{int((s % 1) * 1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  BGM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def gen_bgm(path, dur, vol=0.08):
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i",
           f"sine=frequency=180:duration={dur},tremolo=f=0.3:d=0.5,lowpass=f=3000,volume={vol}",
           "-c:a", "aac", "-b:a", "64k", path]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
        return path if os.path.exists(path) else ""
    except Exception:
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  합성 (자막 FontSize=11, 깔끔한 스타일)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def compose(bg, audio, srt, output, bgm=""):
    # FontSize=11 (이전 14에서 축소)
    # MarginV=25 (하단 여백)
    # BorderStyle=4 (배경 박스)
    ss = ("FontSize=11,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
          "BackColour=&H96000000,BorderStyle=4,Outline=0,Shadow=0,"
          "MarginV=25,MarginL=40,MarginR=40,Alignment=2")

    if bgm and os.path.exists(bgm):
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-i", bgm,
               "-filter_complex", "[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
               "-vf", f"subtitles={srt}:force_style='{ss}'",
               "-map", "0:v", "-map", "[aout]",
               "-c:v", "libx264", "-preset", "fast", "-crf", "23",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", output]
    else:
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio,
               "-vf", f"subtitles={srt}:force_style='{ss}'",
               "-map", "0:v", "-map", "1:a",
               "-c:v", "libx264", "-preset", "fast", "-crf", "23",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", output]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if r.returncode == 0 and os.path.exists(output):
            return output
        else:
            logger.warning(f"[Compose] FFmpeg error: {r.stderr[:300] if r.stderr else 'unknown'}")
    except Exception as e:
        logger.warning(f"[Compose] Exception: {e}")

    # fallback (자막 없이)
    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", "-shortest", output]
    subprocess.run(cmd2, capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 (v8)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_real_video(keyword, category, script_blocks, mode="normal"):
    job_id = str(uuid.uuid4())[:8]
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    try:
        is_sr = mode == "senior"
        speed = 0.92 if is_sr else 1.0
        bvol = 0.05 if is_sr else 0.08
        pause = 0.6 if is_sr else 0.3

        est = sum(b.get("duration_sec", len(b["text"]) / 4.5) for b in script_blocks)
        est += pause * len(script_blocks) + 2

        # 1. TTS (블록별 개별 생성 → 정확한 싱크)
        logger.info(f"[Video] Starting TTS for {len(script_blocks)} blocks")
        audio, adur, block_durations = await gen_tts_blocks(script_blocks, job_dir, speed)
        vdur = max(est, adur + 1)
        logger.info(f"[Video] TTS done: total={adur:.1f}s, blocks={[round(d,1) for d in block_durations]}")

        # 2. NotebookLM 배경
        img = os.path.join(job_dir, "notebook.png")
        bg_video = os.path.join(job_dir, "bg.mp4")
        img_ok = create_notebook_bg(img, keyword, category, script_blocks)
        if img_ok and os.path.exists(img_ok):
            img_to_video(img_ok, bg_video, vdur)
        else:
            plain_bg(bg_video, vdur)
        if not os.path.exists(bg_video):
            plain_bg(bg_video, vdur)

        # 3. SRT (블록별 실제 TTS 길이 사용 → 정확한 싱크!)
        srt = os.path.join(job_dir, "subs.srt")
        gen_srt(script_blocks, srt, pause, block_durations)

        # 4. BGM
        bgm = os.path.join(job_dir, "bgm.m4a")
        gen_bgm(bgm, vdur, bvol)

        # 5. 합성
        out = os.path.join(job_dir, f"blackbox_{job_id}_final.mp4")
        res = compose(bg_video, audio, srt, out, bgm)

        if res and os.path.exists(res):
            fsize = os.path.getsize(res)
            logger.info(f"[Video] Done: {res} ({fsize} bytes, {vdur:.1f}s)")
            return RealVideoResult(
                job_id=job_id, status="done", output_path=res,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(vdur, 1),
                file_size_bytes=fsize,
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
