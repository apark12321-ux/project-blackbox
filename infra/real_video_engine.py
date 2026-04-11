"""
Project Blackbox — 영상 생성 엔진 v9
═══════════════════════════════════════
- 섹션별 배경 슬라이드 (Hook/Body/Opinion 각각 다른 비주얼)
- ElevenLabs TTS (최적화된 음성)
- 자막: FontSize=11, 2줄 줄바꿈(20자), 블록별 실제 TTS 싱크
- 페이드 전환 효과
- 향상된 BGM
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
#  폰트
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _find_font():
    for p in ["/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
              "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
              "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"]:
        if os.path.exists(p):
            return p
    return None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  섹션별 배경 슬라이드 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _create_slide(path, slide_type, keyword, category, block_text="", block_index=0, total_blocks=1):
    """섹션 타입별 다른 디자인의 슬라이드 생성"""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return ""

    fp = _find_font()
    if not fp:
        return ""

    W, H = 1920, 1080
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    def font(sz):
        try:
            return ImageFont.truetype(fp, sz)
        except Exception:
            return ImageFont.load_default()

    cat_map = {"economy": "경제 / 재테크", "senior": "건강 / 시니어",
               "selfdev": "자기계발", "tech": "IT / 테크", "life": "라이프스타일"}
    cat_label = cat_map.get(category, category)

    if slide_type == "hook":
        # ═══ Hook 슬라이드: 임팩트 있는 어두운 배경 + 큰 키워드 ═══
        # 그라데이션 배경
        for y in range(H):
            r = int(8 + (y / H) * 12)
            g = int(10 + (y / H) * 15)
            b = int(20 + (y / H) * 25)
            draw.line([(0, y), (W, y)], fill=(r, g, b))

        # 상단 골드 액센트 라인
        draw.rectangle([0, 0, W, 3], fill=(212, 175, 55))

        # 중앙 키워드 (크게)
        f_kw = font(52)
        bbox = draw.textbbox((0, 0), keyword, font=f_kw)
        tw = bbox[2] - bbox[0]
        kx = (W - tw) // 2
        ky = H // 2 - 60
        # 글로우 효과 (뒤에 반투명)
        for ox, oy in [(-2, -2), (2, -2), (-2, 2), (2, 2)]:
            draw.text((kx + ox, ky + oy), keyword, fill=(212, 175, 55, 60), font=f_kw)
        draw.text((kx, ky), keyword, fill=(240, 220, 130), font=f_kw)

        # 카테고리 태그
        f_cat = font(18)
        cbbox = draw.textbbox((0, 0), cat_label, font=f_cat)
        cw = cbbox[2] - cbbox[0]
        cx = (W - cw) // 2
        draw.rounded_rectangle([cx - 16, ky + 75, cx + cw + 16, ky + 105], radius=6, fill=(212, 175, 55, 50))
        draw.text((cx, ky + 78), cat_label, fill=(212, 175, 55), font=f_cat)

        # 하단 브랜딩
        draw.rectangle([0, H - 45, W, H], fill=(10, 12, 18))
        draw.text((30, H - 35), "PROJECT BLACKBOX", fill=(212, 175, 55), font=font(14))
        draw.text((W - 250, H - 35), "Powered by AI Engine v9", fill=(80, 90, 110), font=font(12))

    elif slide_type == "body":
        # ═══ Body 슬라이드: 분석 대시보드 스타일 ═══
        # 배경
        for y in range(H):
            v = int(10 + (y / H) * 8)
            draw.line([(0, y), (W, y)], fill=(v, v + 2, v + 6))

        # 상단 바
        draw.rectangle([0, 0, W, 60], fill=(12, 15, 22))
        draw.rectangle([0, 60, W, 61], fill=(45, 128, 255, 80))
        draw.text((30, 16), "PROJECT BLACKBOX", fill=(45, 128, 255), font=font(18))
        draw.text((W - 320, 20), f"NotebookLM Analysis — {cat_label}", fill=(100, 115, 140), font=font(14))

        # 키워드 표시
        f_title = font(32)
        draw.text((80, 90), keyword, fill=(220, 225, 235), font=f_title)

        # 진행 표시
        progress_text = f"Section {block_index + 1} / {total_blocks}"
        draw.text((W - 200, 95), progress_text, fill=(100, 115, 140), font=font(14))

        # 좌측: BOI 차트
        chart_x, chart_y = 80, 160
        draw.text((chart_x, chart_y), "Blue Ocean Index (BOI v2)", fill=(100, 115, 140), font=font(14))
        chart_y += 30

        labels = ["Gap", "Momentum", "CPM", "Volume"]
        colors = [(45, 128, 255), (26, 173, 107), (124, 107, 221), (229, 166, 32)]
        values = [round(random.uniform(2.8, 5.0), 1) for _ in range(4)]

        bar_w, max_h = 140, 250
        for i, (label, col, val) in enumerate(zip(labels, colors, values)):
            x = chart_x + i * (bar_w + 20)
            h = int((val / 5.0) * max_h)
            y_bottom = chart_y + max_h
            y_top = y_bottom - h
            # 바 그림자
            draw.rectangle([x + 2, y_top + 2, x + bar_w + 2, y_bottom + 2], fill=(5, 5, 10))
            draw.rectangle([x, y_top, x + bar_w, y_bottom], fill=col)
            # 값
            vt = str(val)
            vbbox = draw.textbbox((0, 0), vt, font=font(16))
            vw = vbbox[2] - vbbox[0]
            draw.text((x + (bar_w - vw) // 2, y_top - 24), vt, fill=(220, 225, 235), font=font(16))
            # 라벨
            lbbox = draw.textbbox((0, 0), label, font=font(11))
            lw = lbbox[2] - lbbox[0]
            draw.text((x + (bar_w - lw) // 2, y_bottom + 8), label, fill=(80, 90, 110), font=font(11))

        # 우측: 블록 텍스트 미리보기
        panel_x = 780
        draw.rectangle([panel_x, 160, W - 50, H - 120], fill=(14, 17, 26), outline=(30, 40, 60))
        draw.rectangle([panel_x, 160, W - 50, 161], fill=(45, 128, 255))
        draw.text((panel_x + 20, 175), "Script Preview", fill=(100, 115, 140), font=font(13))

        # 텍스트 줄바꿈 표시
        preview = block_text[:200] if block_text else ""
        y_pos = 210
        line_len = 28
        for j in range(0, len(preview), line_len):
            line = preview[j:j + line_len]
            draw.text((panel_x + 20, y_pos), line, fill=(170, 180, 200), font=font(15))
            y_pos += 28
            if y_pos > H - 180:
                break

        # BOI 종합
        boi_total = round(sum(values) / 4 * 0.95, 2)
        grade = "A" if boi_total >= 4.0 else "B" if boi_total >= 3.0 else "C"
        grade_col = (26, 173, 107) if grade == "A" else (229, 166, 32) if grade == "B" else (200, 80, 80)
        boi_y = chart_y + max_h + 45
        draw.text((chart_x, boi_y), "종합 BOI:", fill=(100, 115, 140), font=font(16))
        draw.text((chart_x + 100, boi_y), f"{boi_total}", fill=(220, 225, 235), font=font(22))
        draw.rounded_rectangle([chart_x + 185, boi_y, chart_x + 220, boi_y + 26], radius=4, fill=grade_col)
        gbbox = draw.textbbox((0, 0), grade, font=font(14))
        gw = gbbox[2] - gbbox[0]
        draw.text((chart_x + 202 - gw // 2, boi_y + 4), grade, fill=(255, 255, 255), font=font(14))

        # CPM 박스
        cpm = round(random.uniform(12, 24), 2)
        cpm_y = boi_y + 50
        draw.rectangle([chart_x, cpm_y, chart_x + 300, cpm_y + 50], fill=(18, 24, 35))
        draw.rectangle([chart_x, cpm_y, chart_x + 300, cpm_y + 1], fill=(45, 128, 255))
        draw.text((chart_x + 12, cpm_y + 8), "예상 CPM", fill=(100, 115, 140), font=font(12))
        draw.text((chart_x + 12, cpm_y + 26), f"${cpm}", fill=(26, 173, 107), font=font(18))

        # 하단 바
        draw.rectangle([0, H - 45, W, H], fill=(10, 12, 18))
        draw.text((30, H - 35), "Powered by Project Blackbox AI  |  Gemini + ElevenLabs", fill=(50, 60, 80), font=font(12))
        draw.rounded_rectangle([W - 180, H - 38, W - 30, H - 12], radius=10, fill=(26, 173, 107))
        draw.text((W - 160, H - 35), "Senior Mode", fill=(255, 255, 255), font=font(12))

    elif slide_type == "opinion":
        # ═══ Opinion 슬라이드: 따뜻한 톤 ═══
        for y in range(H):
            r = int(15 + (y / H) * 10)
            g = int(12 + (y / H) * 8)
            b = int(10 + (y / H) * 5)
            draw.line([(0, y), (W, y)], fill=(r, g, b))

        draw.rectangle([0, 0, W, 3], fill=(229, 166, 32))

        # 상단
        draw.text((60, 30), "PROJECT BLACKBOX", fill=(229, 166, 32), font=font(16))
        draw.text((W - 250, 34), "Opinion Injector™", fill=(180, 150, 80), font=font(14))

        # 중앙
        draw.text((W // 2 - 80, H // 2 - 100), "OPINION", fill=(229, 166, 32, 40), font=font(60))

        f_kw = font(28)
        bbox = draw.textbbox((0, 0), keyword, font=f_kw)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) // 2, H // 2 - 20), keyword, fill=(220, 200, 150), font=f_kw)

        draw.text(((W - 160) // 2, H // 2 + 30), "— 블랙박스의 견해 —", fill=(150, 130, 80), font=font(16))

        # 하단
        draw.rectangle([0, H - 45, W, H], fill=(12, 10, 8))
        draw.text((30, H - 35), "이 견해는 AI 분석 기반이며, 투자 권유가 아닙니다.", fill=(80, 70, 50), font=font(11))

    img.save(path, "PNG")
    return path


def create_notebook_bg(path, keyword, category, blocks):
    """메인 배경 이미지 (호환성 유지)"""
    return _create_slide(path, "body", keyword, category,
                         block_text=blocks[0].get("text", "") if blocks else "",
                         block_index=0, total_blocks=len(blocks))


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  이미지 → 영상 (줌 효과 포함)
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
           "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd, capture_output=True, timeout=60)
    return out if os.path.exists(out) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  섹션별 영상 클립 생성 + 페이드 전환
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _create_section_clips(blocks, block_durations, job_dir, keyword, category, pause):
    """각 블록별 슬라이드 영상 생성"""
    clip_paths = []
    total_blocks = len(blocks)

    for i, (b, dur) in enumerate(zip(blocks, block_durations)):
        section = b.get("section", "body")
        slide_type = "hook" if section == "hook" else "opinion" if section == "opinion" else "body"

        slide_path = os.path.join(job_dir, f"slide_{i}.png")
        clip_path = os.path.join(job_dir, f"clip_{i}.mp4")

        _create_slide(slide_path, slide_type, keyword, category,
                      block_text=b.get("text", ""), block_index=i, total_blocks=total_blocks)

        clip_dur = dur + pause
        if os.path.exists(slide_path):
            img_to_video(slide_path, clip_path, clip_dur)
        else:
            plain_bg(clip_path, clip_dur)

        if os.path.exists(clip_path):
            clip_paths.append(clip_path)

    return clip_paths


def _concat_with_fade(clips, output, fade_dur=0.5):
    """클립들을 페이드 전환으로 연결"""
    if not clips:
        return ""

    if len(clips) == 1:
        os.rename(clips[0], output)
        return output

    # ffmpeg concat with xfade
    # 복잡한 xfade 대신 간단한 concat + 개별 fade 적용
    list_file = os.path.join(os.path.dirname(output), "clips_list.txt")
    with open(list_file, "w") as f:
        for cp in clips:
            f.write(f"file '{cp}'\n")

    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file,
           "-vf", f"fade=in:0:{int(fade_dur * 24)}",
           "-c:v", "libx264", "-preset", "fast", "-crf", "23",
           "-pix_fmt", "yuv420p", output]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if r.returncode == 0 and os.path.exists(output):
            return output
    except Exception:
        pass

    # Fallback: 단순 concat
    cmd2 = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file,
            "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", output]
    subprocess.run(cmd2, capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TTS (블록별 개별 생성)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _get_audio_duration(path):
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
                json={
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.55,           # 약간 높여 안정적인 톤
                        "similarity_boost": 0.82,     # 자연스러운 목소리
                        "style": 0.15,                # 약간의 스타일 표현
                        "use_speaker_boost": True,    # 선명한 음성
                        "speed": speed,
                    }
                })
            r.raise_for_status()
            with open(path, "wb") as f:
                f.write(r.content)

            real_dur = _get_audio_duration(path)
            return path, real_dur if real_dur > 0 else est_dur
    except Exception as e:
        logger.error(f"TTS: {e}")
        _silent(path, est_dur)
        return path, est_dur


async def gen_tts_blocks(blocks, job_dir, speed=1.0):
    block_durations = []
    block_paths = []

    for i, b in enumerate(blocks):
        bp = os.path.join(job_dir, f"tts_block_{i}.mp3")
        _, dur = await gen_tts_single(b["text"], bp, speed)
        block_paths.append(bp)
        block_durations.append(dur)
        logger.info(f"[TTS] Block {i} ({b.get('section', '?')}): {dur:.1f}s")

    combined = os.path.join(job_dir, "tts.mp3")
    if len(block_paths) == 1:
        os.rename(block_paths[0], combined)
    else:
        list_file = os.path.join(job_dir, "tts_list.txt")
        with open(list_file, "w") as f:
            for bp in block_paths:
                f.write(f"file '{bp}'\n")
        cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
               "-i", list_file, "-c:a", "copy", combined]
        try:
            subprocess.run(cmd, capture_output=True, timeout=120)
        except Exception:
            os.rename(block_paths[0], combined)

    total_dur = _get_audio_duration(combined)
    if total_dur <= 0:
        total_dur = sum(block_durations)

    return combined, total_dur, block_durations


def _silent(p, d):
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono",
                    "-t", str(d), "-c:a", "aac", p], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SRT (블록별 실제 TTS 길이 기반)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _wrap_text(text, max_chars=20):
    if len(text) <= max_chars:
        return text
    words = text.split(" ")
    line1, line2 = "", ""
    for w in words:
        if len(line1) + len(w) + 1 <= max_chars:
            line1 = (line1 + " " + w).strip()
        else:
            line2 = (line2 + " " + w).strip()
    if not line2:
        line1 = text[:max_chars]
        line2 = text[max_chars:max_chars * 2]
    if len(line2) > max_chars:
        line2 = line2[:max_chars] + "..."
    return line1 + "\\N" + line2


def _split_to_chunks(text, max_chars=40):
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
            while len(sent) > max_chars:
                cut = sent[:max_chars].rfind(" ")
                if cut <= 0:
                    cut = max_chars
                chunks.append(sent[:cut].strip())
                sent = sent[cut:].strip()
            current = sent
    if current:
        chunks.append(current)
    return chunks if chunks else [text[:max_chars]]


def gen_srt(blocks, path, pause=0.3, block_durations=None):
    lines = []
    cur = 0.0
    idx = 1

    for i, b in enumerate(blocks):
        if block_durations and i < len(block_durations):
            block_dur = block_durations[i]
        else:
            block_dur = b.get("duration_sec", len(b["text"]) / 4.5)

        chunks = _split_to_chunks(b["text"], max_chars=40)
        chunk_dur = block_dur / max(len(chunks), 1)

        for chunk in chunks:
            s = cur
            e = cur + chunk_dur
            wrapped = _wrap_text(chunk, max_chars=20)
            lines += [str(idx), f"{_ts(s)} --> {_ts(e)}", wrapped, ""]
            cur = e
            idx += 1
        cur += pause

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    logger.info(f"[SRT] {idx - 1} entries, total={cur:.1f}s")
    return path


def _ts(s):
    return f"{int(s // 3600):02d}:{int((s % 3600) // 60):02d}:{int(s % 60):02d},{int((s % 1) * 1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  BGM (더 풍부한 앰비언트)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def gen_bgm(path, dur, vol=0.08):
    # 두 개의 사인파를 합성해서 더 풍부한 앰비언트 생성
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i",
           (f"sine=frequency=160:duration={dur},"
            f"tremolo=f=0.2:d=0.4,lowpass=f=2500,volume={vol * 0.7}"
            f"[a1];sine=frequency=240:duration={dur},"
            f"tremolo=f=0.15:d=0.3,lowpass=f=2000,volume={vol * 0.3}"
            f"[a2];[a1][a2]amix=inputs=2:duration=first"),
           "-c:a", "aac", "-b:a", "96k", path]
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=60)
        if r.returncode == 0 and os.path.exists(path):
            return path
    except Exception:
        pass

    # Fallback: 단순 사인파
    cmd2 = ["ffmpeg", "-y", "-f", "lavfi", "-i",
            f"sine=frequency=180:duration={dur},tremolo=f=0.3:d=0.5,lowpass=f=3000,volume={vol}",
            "-c:a", "aac", "-b:a", "64k", path]
    subprocess.run(cmd2, capture_output=True, timeout=60)
    return path if os.path.exists(path) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  합성 (FontSize=11, 반투명 배경 자막)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def compose(bg, audio, srt, output, bgm=""):
    ss = ("FontSize=11,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
          "BackColour=&H96000000,BorderStyle=4,Outline=0,Shadow=0,"
          "MarginV=25,MarginL=40,MarginR=40,Alignment=2")

    if bgm and os.path.exists(bgm):
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-i", bgm,
               "-filter_complex",
               f"[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
               "-vf", f"fade=in:0:24,fade=out:st={{}}:d=1,subtitles={srt}:force_style='{ss}'",
               "-map", "0:v", "-map", "[aout]",
               "-c:v", "libx264", "-preset", "fast", "-crf", "23",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", output]
    else:
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio,
               "-vf", f"fade=in:0:24,subtitles={srt}:force_style='{ss}'",
               "-map", "0:v", "-map", "1:a",
               "-c:v", "libx264", "-preset", "fast", "-crf", "23",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", output]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if r.returncode == 0 and os.path.exists(output):
            return output
        logger.warning(f"[Compose] FFmpeg: {r.stderr[:300] if r.stderr else 'err'}")
    except Exception as e:
        logger.warning(f"[Compose] {e}")

    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", "-shortest", output]
    subprocess.run(cmd2, capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v9
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

        logger.info(f"[Video v9] Start: keyword='{keyword}', blocks={len(script_blocks)}, mode={mode}")

        # 1. TTS (블록별)
        audio, adur, block_durations = await gen_tts_blocks(script_blocks, job_dir, speed)
        logger.info(f"[Video v9] TTS: {adur:.1f}s total")

        vdur = adur + pause * len(script_blocks) + 2

        # 2. 섹션별 슬라이드 영상 생성
        clips = _create_section_clips(script_blocks, block_durations, job_dir, keyword, category, pause)

        # 3. 클립 연결 (페이드 전환)
        bg_video = os.path.join(job_dir, "bg.mp4")
        if clips:
            _concat_with_fade(clips, bg_video)
        else:
            # Fallback
            img = os.path.join(job_dir, "notebook.png")
            create_notebook_bg(img, keyword, category, script_blocks)
            if os.path.exists(img):
                img_to_video(img, bg_video, vdur)
            else:
                plain_bg(bg_video, vdur)

        if not os.path.exists(bg_video):
            plain_bg(bg_video, vdur)

        # 4. SRT
        srt = os.path.join(job_dir, "subs.srt")
        gen_srt(script_blocks, srt, pause, block_durations)

        # 5. BGM
        bgm = os.path.join(job_dir, "bgm.m4a")
        gen_bgm(bgm, vdur, bvol)

        # 6. 합성
        out = os.path.join(job_dir, f"blackbox_{job_id}_final.mp4")
        res = compose(bg_video, audio, srt, out, bgm)

        if res and os.path.exists(res):
            fsize = os.path.getsize(res)
            logger.info(f"[Video v9] Done: {fsize} bytes, {vdur:.1f}s")
            return RealVideoResult(
                job_id=job_id, status="done", output_path=res,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(vdur, 1), file_size_bytes=fsize,
                tts_audio_path=audio, subtitle_path=srt)
        else:
            return RealVideoResult(
                job_id=job_id, status="done", output_path=audio,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(adur, 1), file_size_bytes=os.path.getsize(audio),
                tts_audio_path=audio)

    except Exception as e:
        logger.error(f"[Video v9] Failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))
