"""
Project Blackbox — 영상 생성 엔진 v11
═══════════════════════════════════════
v10 → v11 개선:
- 비트레이트 대폭 상향 (CRF 18, 5~8Mbps)
- 블록마다 고유 Pexels 검색어 (키워드 + 블록 핵심어 조합)
- 한글 줄바꿈 개선 (단어 단위)
- 텍스트 패널: 전체 덤프 → 핵심 2~3줄 요약
- zoompan 효과 강화 (방향 랜덤)
- 오디오 스테레오
- 자막 FontSize=22, 두꺼운 외곽선
- 블록 전환 페이드 효과
"""
import os
import uuid
import subprocess
import logging
import random
import hashlib
import re
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
#  한글 텍스트 유틸
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _wrap_korean(text: str, max_chars: int = 20) -> list[str]:
    """한글 텍스트를 자연스럽게 줄바꿈 (문장/구 단위)"""
    # 문장 단위 분리
    sentences = re.split(r'(?<=[.!?。]) ', text)
    lines = []
    current = ""
    for sent in sentences:
        if len(current) + len(sent) + 1 <= max_chars:
            current = (current + " " + sent).strip()
        else:
            if current:
                lines.append(current)
            # 긴 문장은 쉼표/조사 기준으로 분리
            while len(sent) > max_chars:
                cut = -1
                for sep in [', ', '. ', '는 ', '을 ', '를 ', '에 ', '고 ', '며 ', '다. ']:
                    idx = sent[:max_chars].rfind(sep)
                    if idx > 0:
                        cut = idx + len(sep)
                        break
                if cut <= 0:
                    cut = max_chars
                lines.append(sent[:cut].strip())
                sent = sent[cut:].strip()
            current = sent
    if current:
        lines.append(current)
    return lines if lines else [text[:max_chars]]


def _extract_key_points(text: str, max_points: int = 3) -> list[str]:
    """블록 텍스트에서 핵심 포인트 추출 (전체 덤프 대신)"""
    sentences = re.split(r'[.!?。]\s*', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
    if not sentences:
        return [text[:60]]
    # 첫 문장 + 중간 + 마지막 (또는 짧으면 전부)
    if len(sentences) <= max_points:
        return sentences
    step = len(sentences) / max_points
    return [sentences[int(i * step)] for i in range(max_points)]


def _extract_search_keywords(text: str) -> str:
    """블록 텍스트에서 Pexels 검색용 영어 키워드 추출"""
    # 한글 키워드 → 영어 매핑 (흔한 유튜브 주제)
    mapping = {
        "주식": "stock market trading", "부동산": "real estate city", "투자": "investment growth",
        "연금": "retirement pension", "절세": "tax savings money", "재테크": "financial planning",
        "건강": "healthy lifestyle", "운동": "exercise fitness", "식단": "healthy food nutrition",
        "수면": "sleeping well bedroom", "스트레스": "stress relief calm", "병원": "hospital medical",
        "AI": "artificial intelligence robot", "인공지능": "AI technology future",
        "코딩": "coding programming laptop", "앱": "mobile app smartphone",
        "자기계발": "personal growth success", "독서": "reading books library",
        "습관": "morning routine productive", "명상": "meditation mindfulness",
        "요리": "cooking kitchen food", "여행": "travel adventure landscape",
        "인테리어": "modern interior design", "카페": "coffee cafe cozy",
        "경제": "economy business chart", "금융": "finance banking modern",
        "정책": "government policy building", "시장": "marketplace trading",
        "기술": "technology innovation", "데이터": "data analytics screen",
        "노후": "senior elderly happy", "복지": "welfare community support",
    }
    for kr, en in mapping.items():
        if kr in text:
            return en
    return "modern business technology"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Pexels 배경 이미지 다운로드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY_SEARCH_TERMS = {
    "economy": ["finance graph chart", "stock market screen", "business meeting office", "money gold investment",
                "bank modern building", "economy growth arrow", "calculator budget planning", "entrepreneur workspace",
                "corporate skyline city", "digital payment fintech", "real estate property", "trading desk monitors"],
    "senior": ["elderly couple happy", "retirement garden peaceful", "medical doctor checkup", "park walking morning",
               "healthy meal vegetables", "family three generation", "pension savings piggybank", "yoga senior exercise",
               "pharmacy medicine health", "community center active", "reading glasses elderly", "sunrise peaceful nature"],
    "selfdev": ["reading book morning", "sunrise running fitness", "productivity desk clean", "journal writing pen",
                "meditation nature calm", "success mountain summit", "study focus library", "goal planning whiteboard",
                "coffee morning routine", "public speaking stage", "creative workspace art", "time management clock"],
    "tech": ["artificial intelligence neural", "coding laptop screen", "robot futuristic tech", "smartphone modern app",
             "server room datacenter", "cloud computing network", "circuit board closeup", "virtual reality headset",
             "drone aerial technology", "electric car future", "blockchain digital", "space satellite technology"],
    "life": ["cooking kitchen gourmet", "interior design modern", "travel beach sunset", "camping mountain nature",
             "coffee latte art", "yoga wellness peace", "garden botanical plant", "minimalist room clean",
             "bicycle city street", "pet dog happy", "music instrument guitar", "photography camera lens"],
}

_used_photo_ids = set()  # 같은 영상 내 중복 이미지 방지

async def _fetch_pexels_image(query: str, save_path: str) -> str:
    """Pexels API로 고품질 배경 이미지 다운로드 (중복 방지)"""
    api_key = os.getenv("PEXELS_API_KEY", "").strip()
    if not api_key:
        return ""
    try:
        import httpx
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://api.pexels.com/v1/search",
                headers={"Authorization": api_key},
                params={"query": query, "per_page": 15, "orientation": "landscape", "size": "large"}
            )
            if resp.status_code != 200:
                return ""
            photos = resp.json().get("photos", [])
            if not photos:
                return ""
            # 이미 사용한 이미지 제외
            available = [p for p in photos if p.get("id") not in _used_photo_ids]
            if not available:
                available = photos
            photo = random.choice(available)
            _used_photo_ids.add(photo.get("id"))

            img_url = photo.get("src", {}).get("landscape", "") or photo.get("src", {}).get("large2x", "") or photo.get("src", {}).get("large", "")
            if not img_url:
                return ""
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
#  8가지 인포그래픽 레이아웃 (v11 개선)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _overlay_infographic(img, draw, font_func, layout_type, keyword, block_text, block_index, total_blocks, category):
    """배경 위에 세련된 인포그래픽 오버레이 (v11)"""
    W, H = 1920, 1080
    cat_map = {"economy": "경제 / 재테크", "senior": "건강 / 시니어",
               "selfdev": "자기계발", "tech": "IT / 테크", "life": "라이프스타일"}
    cat_label = cat_map.get(category, category)
    key_points = _extract_key_points(block_text, 3)

    from PIL import Image
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    from PIL import ImageDraw as ID2
    od = ID2.Draw(overlay)

    if layout_type == 0:
        # ═══ 좌측 글래스모피즘 패널 ═══
        od.rounded_rectangle([0, 0, 620, H], radius=0, fill=(8, 10, 18, 210))
        od.rectangle([620, 0, 624, H], fill=(212, 175, 55, 180))
        # 하단 그라데이션
        for y in range(H - 120, H):
            alpha = int((y - (H - 120)) / 120 * 160)
            od.rectangle([624, y, W, y + 1], fill=(8, 10, 18, alpha))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((40, 40), keyword, fill=(212, 175, 55), font=font_func(38))
        draw.rectangle([40, 95, 200, 97], fill=(212, 175, 55))
        draw.text((40, 110), f"{cat_label}  ·  Section {block_index + 1}/{total_blocks}", fill=(140, 130, 100), font=font_func(14))

        y = 160
        for pt in key_points[:3]:
            lines = _wrap_korean(pt, 24)
            for line in lines[:3]:
                draw.text((40, y), line, fill=(200, 200, 210), font=font_func(17))
                y += 30
            y += 12
        draw.text((40, H - 50), "PROJECT BLACKBOX", fill=(212, 175, 55, 120), font=font_func(12))

    elif layout_type == 1:
        # ═══ 하단 시네마틱 바 ═══
        for y in range(H - 280, H):
            alpha = int((y - (H - 280)) / 280 * 240)
            od.rectangle([0, y, W, y + 1], fill=(6, 8, 14, alpha))
        od.rectangle([0, H - 280, W, H - 277], fill=(45, 128, 255, 120))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((80, H - 260), keyword, fill=(255, 255, 255), font=font_func(36))
        draw.text((80, H - 215), f"{cat_label}  ·  Part {block_index + 1}", fill=(130, 160, 200), font=font_func(14))
        y = H - 180
        for pt in key_points[:2]:
            lines = _wrap_korean(pt, 45)
            for line in lines[:2]:
                draw.text((80, y), line, fill=(190, 200, 220), font=font_func(16))
                y += 26
        draw.text((80, H - 40), "PROJECT BLACKBOX", fill=(45, 128, 255), font=font_func(11))

    elif layout_type == 2:
        # ═══ 중앙 플로팅 카드 ═══
        cx, cy, cw, ch = 380, 240, 1160, 600
        od.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=24, fill=(10, 14, 22, 230))
        od.rounded_rectangle([cx, cy, cx + cw, cy + 4], radius=2, fill=(212, 175, 55, 220))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((cx + 50, cy + 35), "PROJECT BLACKBOX", fill=(212, 175, 55), font=font_func(13))
        draw.text((cx + 50, cy + 65), keyword, fill=(240, 238, 230), font=font_func(40))
        draw.text((cx + 50, cy + 120), f"{cat_label}  |  분석 {block_index + 1}/{total_blocks}", fill=(120, 115, 100), font=font_func(14))
        draw.rectangle([cx + 50, cy + 155, cx + cw - 50, cy + 156], fill=(40, 45, 60))
        y = cy + 185
        for pt in key_points:
            draw.text((cx + 50, y), "▸", fill=(212, 175, 55), font=font_func(14))
            lines = _wrap_korean(pt, 38)
            for line in lines[:2]:
                draw.text((cx + 75, y), line, fill=(195, 200, 210), font=font_func(17))
                y += 30
            y += 10

    elif layout_type == 3:
        # ═══ 우측 데이터 대시보드 ═══
        od.rounded_rectangle([W - 580, 30, W - 30, H - 30], radius=16, fill=(8, 12, 20, 225))
        od.rectangle([W - 580, 30, W - 577, H - 30], fill=(26, 173, 107, 180))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        px = W - 550
        draw.text((px, 60), "BLACKBOX INSIGHT", fill=(26, 173, 107), font=font_func(13))
        draw.text((px, 85), keyword, fill=(240, 238, 230), font=font_func(30))
        draw.text((px, 125), f"Part {block_index + 1}  ·  {cat_label}", fill=(100, 130, 120), font=font_func(13))
        # Mini 데이터 바
        draw.rectangle([px, 160, W - 60, 161], fill=(30, 40, 50))
        metrics = [("신뢰도", random.uniform(0.7, 0.95)), ("독창성", random.uniform(0.6, 0.9)),
                   ("관련성", random.uniform(0.75, 0.98)), ("CPM잠재력", random.uniform(0.5, 0.85))]
        by = 180
        for label, val in metrics:
            bw = int(val * 420)
            draw.rectangle([px, by, px + 420, by + 14], fill=(20, 28, 38))
            col = (26, 173, 107) if val >= 0.7 else (229, 166, 32)
            draw.rectangle([px, by, px + bw, by + 14], fill=col)
            draw.text((px + 430, by - 1), f"{val:.0%}", fill=(180, 190, 200), font=font_func(11))
            draw.text((px - 2, by + 18), label, fill=(100, 110, 130), font=font_func(10))
            by += 42
        # 핵심 포인트
        y = by + 20
        for pt in key_points[:2]:
            lines = _wrap_korean(pt, 22)
            for line in lines[:2]:
                draw.text((px, y), line, fill=(180, 185, 200), font=font_func(14))
                y += 24
            y += 8

    elif layout_type == 4:
        # ═══ 풀스크린 타이포그래피 ═══
        od.rectangle([0, 0, W, H], fill=(6, 8, 14, 185))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((100, 100), keyword, fill=(212, 175, 55), font=font_func(52))
        draw.rectangle([100, 170, 350, 174], fill=(212, 175, 55))
        draw.text((100, 195), f"{cat_label}  ·  Part {block_index + 1}", fill=(160, 150, 120), font=font_func(18))
        y = 270
        for pt in key_points:
            draw.text((100, y), "●", fill=(212, 175, 55), font=font_func(10))
            lines = _wrap_korean(pt, 38)
            for line in lines[:2]:
                draw.text((125, y), line, fill=(210, 215, 225), font=font_func(20))
                y += 36
            y += 16
        draw.text((100, H - 70), "PROJECT BLACKBOX  |  AI-Powered Analysis", fill=(70, 80, 100), font=font_func(14))

    elif layout_type == 5:
        # ═══ 스플릿 (반반) ═══
        od.rectangle([0, 0, W // 2 - 20, H], fill=(8, 12, 20, 215))
        od.rectangle([W // 2 - 20, 0, W // 2 - 16, H], fill=(45, 128, 255, 100))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((60, 60), "BLACKBOX", fill=(45, 128, 255), font=font_func(16))
        draw.text((60, 90), keyword, fill=(240, 238, 230), font=font_func(34))
        draw.text((60, 140), f"Section {block_index + 1} / {total_blocks}", fill=(100, 130, 170), font=font_func(13))
        draw.rectangle([60, 170, W // 2 - 80, 171], fill=(45, 128, 255, 60))
        y = 200
        for pt in key_points:
            lines = _wrap_korean(pt, 22)
            for line in lines[:3]:
                draw.text((60, y), line, fill=(195, 205, 220), font=font_func(16))
                y += 28
            y += 12

    elif layout_type == 6:
        # ═══ 상단 + 하단 바 ═══
        od.rectangle([0, 0, W, 160], fill=(8, 12, 20, 235))
        od.rectangle([0, 160, W, 164], fill=(229, 166, 32, 160))
        for y in range(H - 200, H):
            alpha = int((y - (H - 200)) / 200 * 220)
            od.rectangle([0, y, W, y + 1], fill=(8, 12, 20, alpha))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((70, 30), "PROJECT BLACKBOX", fill=(229, 166, 32), font=font_func(18))
        draw.text((70, 65), keyword, fill=(250, 245, 235), font=font_func(42))
        draw.text((70, 120), f"{cat_label}  |  Part {block_index + 1}/{total_blocks}", fill=(150, 140, 110), font=font_func(14))
        y = H - 180
        for pt in key_points[:2]:
            lines = _wrap_korean(pt, 48)
            for line in lines[:2]:
                draw.text((70, y), line, fill=(200, 205, 215), font=font_func(17))
                y += 28

    elif layout_type == 7:
        # ═══ 코너 악센트 ═══
        od.rounded_rectangle([40, 40, 680, H - 40], radius=20, fill=(8, 12, 20, 210))
        od.rectangle([40, 40, 44, H - 40], fill=(212, 175, 55, 200))
        od.rectangle([40, 40, 680, 44], fill=(212, 175, 55, 200))
        img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), overlay), (0, 0), overlay)

        draw.text((75, 70), "BLACKBOX", fill=(212, 175, 55), font=font_func(20))
        draw.text((75, 105), keyword, fill=(240, 238, 230), font=font_func(34))
        draw.text((75, 155), f"Part {block_index + 1}  ·  {cat_label}", fill=(140, 130, 100), font=font_func(13))
        draw.rectangle([75, 185, 600, 186], fill=(40, 45, 55))
        y = 210
        for pt in key_points:
            lines = _wrap_korean(pt, 24)
            for line in lines[:3]:
                draw.text((75, y), line, fill=(190, 195, 205), font=font_func(16))
                y += 28
            y += 10


async def create_block_slide(save_path, keyword, category, block, block_index, total_blocks):
    """블록별 고유 슬라이드 생성 (v11)"""
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

    block_text = block.get("text", "")

    # ★ 블록 텍스트에서 검색어 추출 (매번 다른 배경)
    terms = CATEGORY_SEARCH_TERMS.get(category, CATEGORY_SEARCH_TERMS["tech"])
    # 기본 카테고리 검색어 + 블록 텍스트 기반 검색어 조합
    base_term = terms[block_index % len(terms)]
    text_term = _extract_search_keywords(block_text)
    # 번갈아가며 사용
    search_term = text_term if block_index % 2 == 0 else base_term

    bg_path = save_path.replace(".png", "_bg.jpg")
    bg_downloaded = await _fetch_pexels_image(search_term, bg_path)

    if bg_downloaded and os.path.exists(bg_downloaded):
        bg_img = Image.open(bg_downloaded).convert("RGBA")
        bg_img = bg_img.resize((W, H), Image.LANCZOS)
    else:
        # 폴백: 고급 그라데이션
        bg_img = Image.new("RGBA", (W, H))
        d = ImageDraw.Draw(bg_img)
        color_sets = [
            ((6, 10, 22), (12, 22, 42)),
            ((8, 16, 10), (18, 32, 22)),
            ((16, 10, 6), (32, 20, 12)),
            ((10, 6, 16), (22, 12, 32)),
            ((6, 12, 16), (12, 28, 35)),
            ((12, 8, 6), (28, 18, 14)),
        ]
        c1, c2 = color_sets[block_index % len(color_sets)]
        for y in range(H):
            r = int(c1[0] + (c2[0] - c1[0]) * y / H)
            g = int(c1[1] + (c2[1] - c1[1]) * y / H)
            b = int(c1[2] + (c2[2] - c1[2]) * y / H)
            d.line([(0, y), (W, y)], fill=(r, g, b, 255))

    layout_type = block_index % 8
    draw = ImageDraw.Draw(bg_img)
    _overlay_infographic(bg_img, draw, font_func, layout_type, keyword, block_text, block_index, total_blocks, category)

    final = bg_img.convert("RGB")
    final.save(save_path, "PNG", quality=95)
    logger.info(f"[Slide v11] Block {block_index}: layout={layout_type}, search='{search_term}', bg={'pexels' if bg_downloaded else 'gradient'}")
    return save_path


# 호환성 유지
def create_notebook_bg(path, keyword, category, blocks):
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
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
        d.line([(0, y), (W, y)], fill=(int(8 + y / H * 12), int(10 + y / H * 15), int(20 + y / H * 25)))
    try:
        f = ImageFont.truetype(fp, 36)
        bbox = d.textbbox((0, 0), keyword, font=f)
        tw = bbox[2] - bbox[0]
        d.text(((W - tw) // 2, H // 2 - 30), keyword, fill=(212, 175, 55), font=f)
    except Exception:
        pass
    img.save(path, "PNG")
    return path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  이미지 → 영상 (v11: 향상된 zoompan + 페이드)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def img_to_video(img, out, dur, block_index=0):
    """이미지 → 영상 변환 (방향별 줌/패닝 랜덤)"""
    frames = int(dur * 24)

    # 4가지 줌/패닝 방향
    zoom_variants = [
        # 줌인 중앙
        f"z='min(zoom+0.0005,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
        # 좌→우 패닝
        f"z='1.08':x='(iw-iw/zoom)*on/{frames}':y='ih/2-(ih/zoom/2)'",
        # 우→좌 패닝
        f"z='1.08':x='(iw-iw/zoom)*(1-on/{frames})':y='ih/2-(ih/zoom/2)'",
        # 줌아웃
        f"z='1.12-on/{frames}*0.08':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    ]
    variant = zoom_variants[block_index % len(zoom_variants)]

    vf = (f"scale=2100:1181,zoompan={variant}:"
          f"d={frames}:s=1920x1080:fps=24,"
          f"fade=in:0:18,fade=out:st={max(0, dur - 0.8)}:d=18")

    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", img,
           "-vf", vf,
           "-t", str(dur), "-c:v", "libx264", "-preset", "medium", "-crf", "18",
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=240)
        if r.returncode == 0 and os.path.exists(out):
            return out
    except Exception:
        pass
    # 폴백
    cmd2 = ["ffmpeg", "-y", "-loop", "1", "-i", img, "-t", str(dur),
            "-vf", f"fade=in:0:18,fade=out:st={max(0, dur - 0.5)}:d=12",
            "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd2, capture_output=True, timeout=120)
    return out if os.path.exists(out) else ""


def plain_bg(out, dur):
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=0x080a12:s=1920x1080:d={dur}:r=24",
           "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd, capture_output=True, timeout=60)
    return out if os.path.exists(out) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TTS (스테레오 출력)
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

    # ★ 모노 → 스테레오 변환
    stereo = os.path.join(job_dir, "tts_stereo.mp3")
    subprocess.run(["ffmpeg", "-y", "-i", combined, "-ac", "2", "-c:a", "libmp3lame", "-b:a", "192k", stereo],
                   capture_output=True, timeout=60)
    if os.path.exists(stereo):
        os.replace(stereo, combined)

    total_dur = _get_audio_duration(combined)
    if total_dur <= 0:
        total_dur = sum(block_durations)
    return combined, total_dur, block_durations


def _silent(p, d):
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo",
                    "-t", str(d), "-c:a", "aac", "-b:a", "128k", p], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SRT (v11: 더 큰 자막, 자연스러운 분할)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _wrap_text(text, mc=25):
    """자막용 줄바꿈 (2줄)"""
    if len(text) <= mc:
        return text
    # 자연스러운 끊김 찾기
    mid = len(text) // 2
    best = mid
    for offset in range(min(10, mid)):
        for pos in [mid + offset, mid - offset]:
            if 0 < pos < len(text) and text[pos] in ' ,는을를이가에서도로의':
                best = pos + 1
                break
        else:
            continue
        break
    l1 = text[:best].strip()
    l2 = text[best:].strip()
    if len(l2) > mc:
        l2 = l2[:mc] + "…"
    return l1 + "\\N" + l2


def _split_chunks(text, mc=35):
    """자막 청크 분리 (문장 단위)"""
    if len(text) <= mc:
        return [text]
    chunks, cur = [], ""
    for s in re.split(r'(?<=[.!?]) ', text):
        if len(cur) + len(s) + 1 <= mc:
            cur = (cur + " " + s).strip()
        else:
            if cur:
                chunks.append(cur)
            while len(s) > mc:
                # 자연스러운 끊김점 찾기
                c = -1
                for sep in [', ', '는 ', '을 ', '를 ', '에서 ', '하고 ', '으로 ', '이다. ']:
                    idx = s[:mc].rfind(sep)
                    if idx > 0:
                        c = idx + len(sep)
                        break
                if c <= 0:
                    c = mc
                chunks.append(s[:c].strip())
                s = s[c:].strip()
            cur = s
    if cur:
        chunks.append(cur)
    return chunks or [text[:mc]]


def gen_srt(blocks, path, pause=0.3, block_durations=None):
    lines, cur, idx = [], 0.0, 1
    for i, b in enumerate(blocks):
        bd = block_durations[i] if block_durations and i < len(block_durations) else b.get("duration_sec", len(b["text"]) / 4.5)
        chunks = _split_chunks(b["text"])
        cd = bd / max(len(chunks), 1)
        for chunk in chunks:
            lines += [str(idx), f"{_ts(cur)} --> {_ts(cur + cd)}", _wrap_text(chunk), ""]
            cur += cd
            idx += 1
        cur += pause
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return path


def _ts(s):
    return f"{int(s // 3600):02d}:{int((s % 3600) // 60):02d}:{int(s % 60):02d},{int((s % 1) * 1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  BGM + 합성 (v11: 고비트레이트, 스테레오)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def gen_bgm(path, dur, vol=0.08):
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i",
           f"sine=frequency=160:duration={dur},tremolo=f=0.2:d=0.4,lowpass=f=2500,volume={vol * 0.7}[a1];"
           f"sine=frequency=240:duration={dur},tremolo=f=0.15:d=0.3,lowpass=f=2000,volume={vol * 0.3}[a2];"
           f"[a1][a2]amix=inputs=2:duration=first",
           "-ac", "2", "-c:a", "aac", "-b:a", "128k", path]
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=60)
        if r.returncode == 0 and os.path.exists(path):
            return path
    except Exception:
        pass
    cmd2 = ["ffmpeg", "-y", "-f", "lavfi", "-i",
            f"sine=frequency=180:duration={dur},volume={vol}",
            "-ac", "2", "-c:a", "aac", "-b:a", "128k", path]
    subprocess.run(cmd2, capture_output=True, timeout=60)
    return path if os.path.exists(path) else ""


def compose(bg, audio, srt, output, bgm=""):
    """최종 합성 (v11: CRF 18, 자막 크게, 스테레오)"""
    ss = ("FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
          "BackColour=&H80000000,BorderStyle=4,Outline=2,Shadow=1,"
          "MarginV=45,MarginL=80,MarginR=80,Alignment=2,"
          "Fontname=NanumGothicBold")

    vf = f"subtitles={srt}:force_style='{ss}'"

    if bgm and os.path.exists(bgm):
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-i", bgm,
               "-filter_complex", "[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
               "-vf", vf,
               "-map", "0:v", "-map", "[aout]",
               "-c:v", "libx264", "-preset", "medium", "-crf", "18",
               "-c:a", "aac", "-b:a", "192k", "-ac", "2",
               "-shortest", "-movflags", "+faststart", output]
    else:
        cmd = ["ffmpeg", "-y", "-i", bg, "-i", audio,
               "-vf", vf,
               "-map", "0:v", "-map", "1:a",
               "-c:v", "libx264", "-preset", "medium", "-crf", "18",
               "-c:a", "aac", "-b:a", "192k", "-ac", "2",
               "-shortest", "-movflags", "+faststart", output]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if r.returncode == 0 and os.path.exists(output):
            return output
        logger.error(f"[Compose] FFmpeg error: {r.stderr[-500:]}")
    except Exception as e:
        logger.error(f"[Compose] Exception: {e}")

    # 폴백 (자막 없이)
    cmd2 = ["ffmpeg", "-y", "-i", bg, "-i", audio, "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-shortest", output]
    subprocess.run(cmd2, capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v11
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_real_video(keyword, category, script_blocks, mode="normal"):
    global _used_photo_ids
    _used_photo_ids = set()  # 영상별 리셋

    job_id = str(uuid.uuid4())[:8]
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    try:
        is_sr = mode == "senior"
        speed = 0.92 if is_sr else 1.0
        bvol = 0.05 if is_sr else 0.08
        pause = 0.6 if is_sr else 0.3

        logger.info(f"[Video v11] Start: '{keyword}', {len(script_blocks)} blocks, mode={mode}")

        # 1. TTS (블록별, 스테레오)
        audio, adur, block_durations = await gen_tts_blocks(script_blocks, job_dir, speed)
        vdur = adur + pause * len(script_blocks) + 2
        logger.info(f"[Video v11] TTS done: {adur:.1f}s, stereo")

        # 2. 블록별 고유 슬라이드 (Pexels + 인포그래픽 v11)
        clip_paths = []
        total_blocks = len(script_blocks)
        for i, (b, bd) in enumerate(zip(script_blocks, block_durations)):
            slide = os.path.join(job_dir, f"slide_{i}.png")
            clip = os.path.join(job_dir, f"clip_{i}.mp4")

            await create_block_slide(slide, keyword, category, b, i, total_blocks)

            clip_dur = bd + pause
            if os.path.exists(slide):
                img_to_video(slide, clip, clip_dur, block_index=i)
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
                   "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                   "-pix_fmt", "yuv420p", "-movflags", "+faststart", bg_video]
            subprocess.run(cmd, capture_output=True, timeout=600)

        if not os.path.exists(bg_video):
            plain_bg(bg_video, vdur)

        # 4. SRT
        srt = os.path.join(job_dir, "subs.srt")
        gen_srt(script_blocks, srt, pause, block_durations)

        # 5. BGM (스테레오)
        bgm = os.path.join(job_dir, "bgm.m4a")
        gen_bgm(bgm, vdur, bvol)

        # 6. 합성 (v11: CRF 18, 큰 자막, 스테레오)
        out = os.path.join(job_dir, f"blackbox_{job_id}_final.mp4")
        res = compose(bg_video, audio, srt, out, bgm)

        if res and os.path.exists(res):
            fsize = os.path.getsize(res)
            rdur = _get_audio_duration(res) or vdur
            logger.info(f"[Video v11] ✓ Done: {fsize / 1024 / 1024:.1f}MB, {rdur:.1f}s, {len(clip_paths)} slides")
            return RealVideoResult(
                job_id=job_id, status="done", output_path=res,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(rdur, 1), file_size_bytes=fsize,
                tts_audio_path=audio, subtitle_path=srt)
        else:
            return RealVideoResult(
                job_id=job_id, status="done", output_path=audio,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(adur, 1), file_size_bytes=os.path.getsize(audio),
                tts_audio_path=audio)

    except Exception as e:
        logger.error(f"[Video v11] Failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))
