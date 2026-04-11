"""
Project Blackbox — 영상 생성 엔진 v10
═══════════════════════════════════════
유튜브 수익화 정책 준수:
- 블록마다 다른 비주얼 (반복 콘텐츠 회피)
- Pexels 배경 이미지 + Pillow 인포그래픽 오버레이
- 8가지 레이아웃 랜덤 적용
- 블록별 TTS 싱크, 자막 FontSize=11
"""
import os
import uuid
import subprocess
import logging
import random
import hashlib
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


def _find_font():
    for p in ["/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
              "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
              "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"]:
        if os.path.exists(p):
            return p
    return None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Pexels 배경 이미지 다운로드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY_SEARCH_TERMS = {
    "economy": ["finance graph", "stock market", "business meeting", "money investment", "bank building", "office desk", "calculator budget", "gold coins"],
    "senior": ["elderly health", "retirement happy", "medical checkup", "walking park senior", "healthy food", "family generation", "pension savings", "morning exercise"],
    "selfdev": ["reading book", "morning routine", "productivity desk", "journal writing", "meditation calm", "running sunrise", "study focus", "goal planning"],
    "tech": ["artificial intelligence", "coding laptop", "robot technology", "smartphone app", "digital innovation", "cloud computing", "circuit board", "futuristic city"],
    "life": ["cooking kitchen", "home interior", "travel landscape", "camping nature", "coffee cafe", "yoga wellness", "garden plant", "minimalist room"],
}


async def _fetch_pexels_image(query: str, save_path: str) -> str:
    """Pexels API로 고품질 배경 이미지 다운로드"""
    api_key = os.getenv("PEXELS_API_KEY", "").strip()
    if not api_key:
        return ""

    try:
        import httpx
        async with httpx.AsyncClient(timeout=15) as client:
            # 검색
            resp = await client.get(
                "https://api.pexels.com/v1/search",
                headers={"Authorization": api_key},
                params={"query": query, "per_page": 5, "orientation": "landscape", "size": "large"}
            )
            if resp.status_code != 200:
                logger.warning(f"[Pexels] Search {resp.status_code}: {resp.text[:100]}")
                return ""

            photos = resp.json().get("photos", [])
            if not photos:
                logger.warning(f"[Pexels] No photos for '{query}'")
                return ""

            # 랜덤 선택 (매번 다른 이미지)
            photo = random.choice(photos)
            img_url = photo.get("src", {}).get("landscape", "") or photo.get("src", {}).get("large", "")
            if not img_url:
                return ""

            # 다운로드
            img_resp = await client.get(img_url)
            if img_resp.status_code == 200:
                with open(save_path, "wb") as f:
                    f.write(img_resp.content)
                logger.info(f"[Pexels] Downloaded: '{query}' → {save_path}")
                return save_path

    except Exception as e:
        logger.warning(f"[Pexels] Error: {e}")
    return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  8가지 인포그래픽 레이아웃
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _overlay_infographic(img, draw, font_func, layout_type, keyword, block_text, block_index, total_blocks, category):
    """배경 위에 반투명 인포그래픽 오버레이"""
    W, H = 1920, 1080

    cat_map = {"economy": "경제 / 재테크", "senior": "건강 / 시니어",
               "selfdev": "자기계발", "tech": "IT / 테크", "life": "라이프스타일"}
    cat_label = cat_map.get(category, category)

    # 공통: 어두운 오버레이 (배경 이미지 위에 가독성 확보)
    from PIL import Image
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    from PIL import ImageDraw as ID2
    od = ID2.Draw(overlay)

    if layout_type == 0:
        # ═══ 레이아웃 0: 좌측 패널 + 우측 배경 ═══
        od.rectangle([0, 0, 700, H], fill=(10, 14, 20, 220))
        od.rectangle([700, 0, 703, H], fill=(212, 175, 55, 150))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((40, 40), "PROJECT BLACKBOX", fill=(212, 175, 55), font=font_func(20))
        draw.text((40, 75), keyword, fill=(240, 235, 220), font=font_func(36))
        draw.text((40, 125), cat_label, fill=(180, 160, 100), font=font_func(16))
        draw.text((40, 170), f"SECTION {block_index+1} OF {total_blocks}", fill=(120, 110, 90), font=font_func(12))
        # 텍스트 프리뷰
        y = 220
        for j in range(0, min(len(block_text), 180), 22):
            draw.text((40, y), block_text[j:j+22], fill=(190, 185, 175), font=font_func(16))
            y += 30

    elif layout_type == 1:
        # ═══ 레이아웃 1: 하단 와이드 패널 ═══
        od.rectangle([0, H-320, W, H], fill=(10, 14, 20, 230))
        od.rectangle([0, H-320, W, H-317], fill=(45, 128, 255, 180))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((60, H-300), keyword, fill=(240, 235, 220), font=font_func(34))
        draw.text((60, H-255), f"{cat_label}  ·  Section {block_index+1}/{total_blocks}", fill=(120, 140, 170), font=font_func(14))
        y = H - 220
        for j in range(0, min(len(block_text), 150), 45):
            draw.text((60, y), block_text[j:j+45], fill=(180, 190, 200), font=font_func(15))
            y += 26
        draw.text((60, H-50), "PROJECT BLACKBOX", fill=(45, 128, 255), font=font_func(13))

    elif layout_type == 2:
        # ═══ 레이아웃 2: 중앙 카드 ═══
        cx, cy, cw, ch = 360, 200, 1200, 680
        od.rounded_rectangle([cx, cy, cx+cw, cy+ch], radius=20, fill=(12, 16, 24, 230))
        od.rectangle([cx, cy, cx+cw, cy+3], fill=(212, 175, 55, 200))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((cx+40, cy+30), "PROJECT BLACKBOX", fill=(212, 175, 55), font=font_func(16))
        draw.text((cx+40, cy+65), keyword, fill=(235, 230, 215), font=font_func(38))
        draw.text((cx+40, cy+120), f"{cat_label}  |  분석 {block_index+1}/{total_blocks}", fill=(130, 120, 100), font=font_func(14))
        draw.rectangle([cx+40, cy+150, cx+cw-40, cy+151], fill=(50, 55, 70))
        y = cy + 175
        for j in range(0, min(len(block_text), 250), 35):
            draw.text((cx+40, y), block_text[j:j+35], fill=(185, 190, 200), font=font_func(17))
            y += 32
            if y > cy + ch - 60:
                break

    elif layout_type == 3:
        # ═══ 레이아웃 3: 우측 패널 + BOI 차트 ═══
        od.rectangle([W-650, 0, W, H], fill=(10, 14, 20, 225))
        od.rectangle([W-653, 0, W-650, H], fill=(26, 173, 107, 150))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        px = W - 620
        draw.text((px, 40), "BLACKBOX ANALYSIS", fill=(26, 173, 107), font=font_func(16))
        draw.text((px, 75), keyword, fill=(235, 235, 225), font=font_func(30))
        # Mini BOI 바
        labels = ["Gap", "Mom", "CPM", "Vol"]
        colors = [(45,128,255), (26,173,107), (124,107,221), (229,166,32)]
        vals = [random.uniform(2.5, 5.0) for _ in range(4)]
        by = 140
        for lb, col, v in zip(labels, colors, vals):
            bw = int((v / 5.0) * 400)
            draw.rectangle([px, by, px+400, by+18], fill=(30, 35, 45))
            draw.rectangle([px, by, px+bw, by+18], fill=col)
            draw.text((px+410, by), f"{v:.1f}", fill=(200, 200, 200), font=font_func(12))
            draw.text((px-50, by+1), lb, fill=(120, 130, 150), font=font_func(11))
            by += 32
        # 텍스트
        y = by + 30
        for j in range(0, min(len(block_text), 200), 25):
            draw.text((px, y), block_text[j:j+25], fill=(180, 185, 195), font=font_func(15))
            y += 28

    elif layout_type == 4:
        # ═══ 레이아웃 4: 전체 어두운 오버레이 + 큰 타이포 ═══
        od.rectangle([0, 0, W, H], fill=(8, 10, 16, 190))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((80, 80), keyword, fill=(212, 175, 55), font=font_func(50))
        draw.rectangle([80, 150, 400, 153], fill=(212, 175, 55))
        draw.text((80, 175), f"{cat_label}  ·  Part {block_index+1}", fill=(150, 140, 110), font=font_func(18))
        y = 240
        for j in range(0, min(len(block_text), 300), 40):
            draw.text((80, y), block_text[j:j+40], fill=(200, 200, 210), font=font_func(18))
            y += 34
        draw.text((80, H-60), "PROJECT BLACKBOX  |  AI-Powered Analysis", fill=(80, 90, 110), font=font_func(13))

    elif layout_type == 5:
        # ═══ 레이아웃 5: 2컬럼 분할 ═══
        od.rectangle([0, 0, W//2, H], fill=(10, 14, 20, 210))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((50, 50), "PROJECT BLACKBOX", fill=(45, 128, 255), font=font_func(18))
        draw.text((50, 90), keyword, fill=(230, 230, 235), font=font_func(32))
        draw.text((50, 140), f"Section {block_index+1} / {total_blocks}", fill=(100, 120, 150), font=font_func(14))
        draw.rectangle([50, 170, W//2-50, 171], fill=(45, 128, 255, 80))
        y = 195
        for j in range(0, min(len(block_text), 250), 22):
            draw.text((50, y), block_text[j:j+22], fill=(185, 195, 210), font=font_func(16))
            y += 28

    elif layout_type == 6:
        # ═══ 레이아웃 6: 상단 배너 + 하단 데이터 ═══
        od.rectangle([0, 0, W, 180], fill=(10, 14, 20, 230))
        od.rectangle([0, H-250, W, H], fill=(10, 14, 20, 220))
        od.rectangle([0, 180, W, 183], fill=(229, 166, 32, 150))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((60, 30), "PROJECT BLACKBOX", fill=(229, 166, 32), font=font_func(22))
        draw.text((60, 70), keyword, fill=(240, 235, 220), font=font_func(40))
        draw.text((60, 130), f"{cat_label}  |  Analysis {block_index+1}/{total_blocks}", fill=(140, 130, 100), font=font_func(14))
        # 하단 텍스트
        y = H - 230
        for j in range(0, min(len(block_text), 200), 50):
            draw.text((60, y), block_text[j:j+50], fill=(190, 195, 205), font=font_func(16))
            y += 28

    elif layout_type == 7:
        # ═══ 레이아웃 7: 대각선 분할 ═══
        # 왼쪽 삼각형 어둡게
        for row in range(H):
            end_x = int((1 - row / H) * W * 0.6)
            if end_x > 0:
                od.rectangle([0, row, end_x, row+1], fill=(10, 14, 20, 200))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0,0,0,0)), overlay), (0, 0), overlay)
        draw.text((60, 60), "BLACKBOX", fill=(212, 175, 55), font=font_func(24))
        draw.text((60, 100), keyword, fill=(235, 230, 215), font=font_func(36))
        draw.text((60, 155), f"Part {block_index+1}  ·  {cat_label}", fill=(150, 140, 110), font=font_func(14))
        y = 210
        for j in range(0, min(len(block_text), 160), 20):
            draw.text((60, y), block_text[j:j+20], fill=(190, 190, 200), font=font_func(16))
            y += 28


async def create_block_slide(save_path, keyword, category, block, block_index, total_blocks):
    """블록별 고유 슬라이드 생성 (Pexels 배경 + 인포그래픽 오버레이)"""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return ""

    fp = _find_font()
    W, H = 1920, 1080

    def font_func(sz):
        if not fp:
            return ImageFont.load_default()
        try:
            return ImageFont.truetype(fp, sz)
        except Exception:
            return ImageFont.load_default()

    section = block.get("section", "body")
    block_text = block.get("text", "")

    # 카테고리별 검색어 선택 (블록마다 다른 검색어)
    terms = CATEGORY_SEARCH_TERMS.get(category, CATEGORY_SEARCH_TERMS["tech"])
    search_term = terms[block_index % len(terms)]

    # Pexels 배경 다운로드 시도
    bg_path = save_path.replace(".png", "_bg.jpg")
    bg_downloaded = await _fetch_pexels_image(search_term, bg_path)

    if bg_downloaded and os.path.exists(bg_downloaded):
        # Pexels 이미지를 배경으로 사용
        bg_img = Image.open(bg_downloaded).convert("RGBA")
        bg_img = bg_img.resize((W, H), Image.LANCZOS)
    else:
        # Pexels 실패 시 그라데이션 배경 생성
        bg_img = Image.new("RGBA", (W, H))
        d = ImageDraw.Draw(bg_img)
        # 섹션별 다른 색상 그라데이션
        color_sets = [
            ((8, 12, 25), (15, 25, 45)),      # 딥블루
            ((10, 18, 12), (20, 35, 25)),      # 딥그린
            ((18, 12, 8), (35, 22, 15)),       # 딥브라운
            ((12, 8, 18), (25, 15, 35)),       # 딥퍼플
            ((8, 15, 18), (15, 30, 38)),       # 딥틸
        ]
        c1, c2 = color_sets[block_index % len(color_sets)]
        for y in range(H):
            r = int(c1[0] + (c2[0] - c1[0]) * y / H)
            g = int(c1[1] + (c2[1] - c1[1]) * y / H)
            b = int(c1[2] + (c2[2] - c1[2]) * y / H)
            d.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # 인포그래픽 오버레이 (8가지 레이아웃 중 랜덤)
    layout_type = block_index % 8
    draw = ImageDraw.Draw(bg_img)
    _overlay_infographic(bg_img, draw, font_func, layout_type, keyword, block_text, block_index, total_blocks, category)

    # RGB로 변환 후 저장
    final = bg_img.convert("RGB")
    final.save(save_path, "PNG", quality=95)
    logger.info(f"[Slide] Block {block_index}: layout={layout_type}, bg={'pexels' if bg_downloaded else 'gradient'}")
    return save_path


# 호환성 유지
def create_notebook_bg(path, keyword, category, blocks):
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # 이미 실행 중인 루프에서는 동기 fallback
            return _create_gradient_bg(path, keyword, category, blocks)
    except Exception:
        pass
    return _create_gradient_bg(path, keyword, category, blocks)


def _create_gradient_bg(path, keyword, category, blocks):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return ""
    fp = _find_font()
    if not fp:
        return ""
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), (10, 14, 19))
    d = ImageDraw.Draw(img)
    for y in range(H):
        d.line([(0,y),(W,y)], fill=(int(8+y/H*12), int(10+y/H*15), int(20+y/H*25)))
    try:
        f = ImageFont.truetype(fp, 36)
        bbox = d.textbbox((0,0), keyword, font=f)
        tw = bbox[2]-bbox[0]
        d.text(((W-tw)//2, H//2-30), keyword, fill=(212,175,55), font=f)
    except Exception:
        pass
    img.save(path, "PNG")
    return path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  이미지 → 영상
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def img_to_video(img, out, dur):
    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", img,
           "-vf", (f"scale=2000:1125,zoompan=z='min(zoom+0.0002,1.06)':"
                   f"d={int(dur*24)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
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
#  TTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _get_audio_duration(path):
    try:
        p = subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
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
                json={"text": text, "model_id": "eleven_multilingual_v2",
                      "voice_settings": {"stability": 0.55, "similarity_boost": 0.82,
                                         "style": 0.15, "use_speaker_boost": True, "speed": speed}})
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
        logger.info(f"[TTS] Block {i}: {dur:.1f}s")

    combined = os.path.join(job_dir, "tts.mp3")
    if len(block_paths) == 1:
        os.rename(block_paths[0], combined)
    else:
        lf = os.path.join(job_dir, "tts_list.txt")
        with open(lf, "w") as f:
            for bp in block_paths:
                f.write(f"file '{bp}'\n")
        subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lf, "-c:a", "copy", combined],
                       capture_output=True, timeout=120)

    total_dur = _get_audio_duration(combined)
    if total_dur <= 0:
        total_dur = sum(block_durations)
    return combined, total_dur, block_durations


def _silent(p, d):
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono",
                    "-t", str(d), "-c:a", "aac", p], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SRT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _wrap_text(text, mc=20):
    if len(text) <= mc: return text
    words = text.split(" ")
    l1, l2 = "", ""
    for w in words:
        if len(l1)+len(w)+1 <= mc: l1 = (l1+" "+w).strip()
        else: l2 = (l2+" "+w).strip()
    if not l2: l1, l2 = text[:mc], text[mc:mc*2]
    if len(l2) > mc: l2 = l2[:mc]+"..."
    return l1+"\\N"+l2

def _split_chunks(text, mc=40):
    if len(text) <= mc: return [text]
    chunks, cur = [], ""
    for s in text.replace(". ",".\n").replace("? ","?\n").replace("! ","!\n").split("\n"):
        if len(cur)+len(s)+1 <= mc: cur = (cur+" "+s).strip()
        else:
            if cur: chunks.append(cur)
            while len(s) > mc:
                c = s[:mc].rfind(" ")
                if c <= 0: c = mc
                chunks.append(s[:c].strip()); s = s[c:].strip()
            cur = s
    if cur: chunks.append(cur)
    return chunks or [text[:mc]]

def gen_srt(blocks, path, pause=0.3, block_durations=None):
    lines, cur, idx = [], 0.0, 1
    for i, b in enumerate(blocks):
        bd = block_durations[i] if block_durations and i < len(block_durations) else b.get("duration_sec", len(b["text"])/4.5)
        chunks = _split_chunks(b["text"])
        cd = bd / max(len(chunks), 1)
        for chunk in chunks:
            lines += [str(idx), f"{_ts(cur)} --> {_ts(cur+cd)}", _wrap_text(chunk), ""]
            cur += cd; idx += 1
        cur += pause
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return path

def _ts(s):
    return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  BGM + 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def gen_bgm(path, dur, vol=0.08):
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i",
           f"sine=frequency=160:duration={dur},tremolo=f=0.2:d=0.4,lowpass=f=2500,volume={vol*0.7}[a1];"
           f"sine=frequency=240:duration={dur},tremolo=f=0.15:d=0.3,lowpass=f=2000,volume={vol*0.3}[a2];"
           f"[a1][a2]amix=inputs=2:duration=first",
           "-c:a", "aac", "-b:a", "96k", path]
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=60)
        if r.returncode == 0 and os.path.exists(path): return path
    except Exception: pass
    cmd2 = ["ffmpeg", "-y", "-f", "lavfi", "-i",
            f"sine=frequency=180:duration={dur},volume={vol}", "-c:a", "aac", path]
    subprocess.run(cmd2, capture_output=True, timeout=60)
    return path if os.path.exists(path) else ""


def compose(bg, audio, srt, output, bgm=""):
    ss = ("FontSize=11,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
          "BackColour=&H96000000,BorderStyle=4,Outline=0,Shadow=0,"
          "MarginV=25,MarginL=40,MarginR=40,Alignment=2")
    if bgm and os.path.exists(bgm):
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-i", bgm,
               "-filter_complex", "[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
               "-vf", f"fade=in:0:24,subtitles={srt}:force_style='{ss}'",
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
        if r.returncode == 0 and os.path.exists(output): return output
    except Exception: pass
    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", "-shortest", output]
    subprocess.run(cmd2, capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v10
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

        logger.info(f"[Video v10] Start: '{keyword}', {len(script_blocks)} blocks, mode={mode}")

        # 1. TTS (블록별)
        audio, adur, block_durations = await gen_tts_blocks(script_blocks, job_dir, speed)
        vdur = adur + pause * len(script_blocks) + 2
        logger.info(f"[Video v10] TTS done: {adur:.1f}s")

        # 2. 블록별 고유 슬라이드 생성 (Pexels + 인포그래픽)
        clip_paths = []
        total_blocks = len(script_blocks)
        for i, (b, bd) in enumerate(zip(script_blocks, block_durations)):
            slide = os.path.join(job_dir, f"slide_{i}.png")
            clip = os.path.join(job_dir, f"clip_{i}.mp4")

            await create_block_slide(slide, keyword, category, b, i, total_blocks)

            clip_dur = bd + pause
            if os.path.exists(slide):
                img_to_video(slide, clip, clip_dur)
            else:
                plain_bg(clip, clip_dur)

            if os.path.exists(clip):
                clip_paths.append(clip)

        # 3. 클립 연결
        bg_video = os.path.join(job_dir, "bg.mp4")
        if clip_paths:
            lf = os.path.join(job_dir, "clips.txt")
            with open(lf, "w") as f:
                for cp in clip_paths:
                    f.write(f"file '{cp}'\n")
            cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lf,
                   "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-pix_fmt", "yuv420p", bg_video]
            subprocess.run(cmd, capture_output=True, timeout=300)

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
            logger.info(f"[Video v10] Done: {fsize} bytes, {vdur:.1f}s, {len(clip_paths)} slides")
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
        logger.error(f"[Video v10] Failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))
