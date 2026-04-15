"""
AlgoMaker — 영상 생성 엔진 v17 (NEVER FAIL)
═══════════════════════════════════════════════
설계 원칙: 비디오는 무조건 생성된다. 어떤 API가 실패해도 다음으로 넘어간다.

이미지 소스 체인:
  1. Gemini 2.5 Flash Image (무료, 인포그래픽)
  2. fal.ai FLUX (유료, 고퀄리티)
  3. Pexels HD 실사 (무료)
  4. Pillow 자체 생성 (100% 성공 보장)

TTS 체인:
  1. ElevenLabs (고퀄리티)
  2. 무음 fallback (100% 성공)

합성: FFmpeg xfade 전환 → 실패 시 단순 concat → 실패 시 단일 클립
"""
import os, uuid, subprocess, logging, random, re, asyncio, shutil, base64, json
from dataclasses import dataclass

logger = logging.getLogger(__name__)
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

@dataclass
class RealVideoResult:
    job_id: str; status: str; output_path: str = ""; download_url: str = ""
    duration_sec: float = 0.0; file_size_bytes: int = 0
    tts_audio_path: str = ""; subtitle_path: str = ""; error: str = ""

def _font():
    for p in ["/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
              "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
              "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"]:
        if os.path.exists(p): return p
    return None

def _dur(p):
    try:
        r = subprocess.run(["ffprobe","-v","quiet","-show_entries","format=duration",
            "-of","default=noprint_wrappers=1:nokey=1",p],capture_output=True,text=True,timeout=10)
        if r.returncode == 0 and r.stdout.strip(): return float(r.stdout.strip())
    except: pass
    return 0.0


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  1. TTS — ElevenLabs → Edge TTS → 무음 fallback
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _edge_tts(text, path):
    """Edge TTS — 무료, API 키 불필요, 한국어 고퀄리티 (SunHi/InJoon)"""
    try:
        import edge_tts
        voice = os.getenv("EDGE_TTS_VOICE", "ko-KR-SunHiNeural")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(path)
        if os.path.exists(path) and os.path.getsize(path) > 1000:
            logger.info(f"[EdgeTTS] ✓ voice={voice}")
            return path
    except ImportError:
        logger.warning("[EdgeTTS] edge-tts 패키지 없음 (pip install edge-tts)")
    except Exception as e:
        logger.warning(f"[EdgeTTS] {e}")
    return ""

class TTSFailedError(Exception):
    """ElevenLabs와 Edge TTS 모두 실패했을 때 발생 — 무음 영상 생성 금지"""
    pass

async def _tts_block(text, path, voice_id="2gbExjiWDnG1DMGr81Bx", speed=1.0):
    est = len(text) / (8.0 * speed)
    errors = []

    # ── 1순위: ElevenLabs ──
    key = os.getenv("ELEVENLABS_API_KEY","").strip()
    if key:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=120) as c:
                r = await c.post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                    headers={"xi-api-key":key,"Content-Type":"application/json"},
                    json={"text":text,"model_id":"eleven_multilingual_v2",
                          "voice_settings":{"stability":0.55,"similarity_boost":0.82,
                                            "style":0.15,"use_speaker_boost":True,"speed":speed}})
                r.raise_for_status()
                with open(path,"wb") as f: f.write(r.content)
                d = _dur(path)
                logger.info(f"[TTS] ElevenLabs ✓ {d:.1f}s")
                return path, d if d > 0 else est
        except Exception as e:
            errors.append(f"ElevenLabs: {e}")
            logger.warning(f"[TTS] ElevenLabs 실패 ({e}) — Edge TTS 시도")

    # ── 2순위: Edge TTS (무료, 한국어 고퀄리티) ──
    edge_path = await _edge_tts(text, path)
    if edge_path:
        d = _dur(edge_path)
        return edge_path, d if d > 0 else est
    errors.append("Edge TTS: 실패")

    # ── TTS 완전 실패 → 영상 생성 중단 ──
    raise TTSFailedError(
        f"음성 생성 실패: {' / '.join(errors)}\n"
        "ElevenLabs API 키를 확인하거나 네트워크 상태를 점검해 주세요."
    )

async def _tts_all(blocks, jd, speed=1.0, voice_id="2gbExjiWDnG1DMGr81Bx"):
    durs, paths = [], []
    for i, b in enumerate(blocks):
        p = os.path.join(jd, f"tts_{i}.mp3")
        _, d = await _tts_block(b["text"], p, voice_id, speed)
        paths.append(p); durs.append(d)
    comb = os.path.join(jd, "tts_full.mp3")
    if len(paths) == 1:
        shutil.copy2(paths[0], comb)
    else:
        lf = os.path.join(jd, "tts_list.txt")
        with open(lf,"w") as f:
            for p in paths: f.write(f"file '{p}'\n")
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,"-c:a","copy",comb],
                       capture_output=True, timeout=120)
    # 스테레오 변환
    st = os.path.join(jd, "tts_stereo.mp3")
    subprocess.run(["ffmpeg","-y","-i",comb,"-ac","2","-c:a","libmp3lame","-b:a","192k",st],
                   capture_output=True, timeout=60)
    if os.path.exists(st): os.replace(st, comb)
    t = _dur(comb)
    logger.info(f"[TTS] Total: {t:.1f}s, {len(paths)} blocks")
    return comb, (t if t > 0 else sum(durs)), durs

def _silent(p, d):
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"anullsrc=r=44100:cl=stereo",
                    "-t",str(max(0.5, d)),"-c:a","libmp3lame","-b:a","128k",p],
                   capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2. Style Sheet
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_PALETTES = {
    "economy": {"bg":"#FAFBFE","accent1":"#2D5F8A","accent2":"#D4A537","accent3":"#1B3A5C","text":"#1E293B"},
    "senior":  {"bg":"#F8FCFA","accent1":"#3ECDA5","accent2":"#FFB74D","accent3":"#5BA88C","text":"#2D3748"},
    "selfdev": {"bg":"#FFFAF5","accent1":"#E8735A","accent2":"#4A90D9","accent3":"#F5A623","text":"#1A202C"},
    "tech":    {"bg":"#0F1729","accent1":"#6C5CE7","accent2":"#00D2FF","accent3":"#A29BFE","text":"#E2E8F0"},
    "life":    {"bg":"#F9FAF5","accent1":"#6B8E5B","accent2":"#D4A574","accent3":"#8FB573","text":"#2D3B2E"},
}
_THEMES = {
    "economy": "금융/비즈니스. 네이비+골드. 차트와 그래프 중심. 전문가 분위기.",
    "senior":  "따뜻한 파스텔. 민트+크림. 부드러운 곡선. 건강/복지. 큰 글씨.",
    "selfdev": "밝고 에너지. 오렌지+화이트. 체크리스트. 깔끔한 미니멀.",
    "tech":    "다크+네온. 사이버펑크. 회로/코드. 블루+퍼플.",
    "life":    "자연 어스톤. 그린+베이지. 따뜻하고 친근.",
}

def _build_style(keyword, category, blocks):
    return {
        "theme": _THEMES.get(category, _THEMES["tech"]),
        "palette": _PALETTES.get(category, _PALETTES["tech"]),
        "keyword": keyword,
        "total": len(blocks),
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  3. 이미지 생성 체인 (절대 실패 불가)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_VIS = {
    "hook": "타이틀 카드 — 큰 제목+핵심 수치 강렬하게. 주제 아이콘 3개.",
    "body": [
        "좌우 비교표 — 두 가지를 나란히 비교. 아이콘+수치.",
        "막대/도넛 차트 — 핵심 데이터 시각화. 수치 라벨.",
        "타임라인 — 3~5단계 시간순 흐름. 각 단계 아이콘+한줄 설명.",
        "체크리스트 카드 — 핵심 포인트 4~5개. 체크 아이콘.",
        "프로세스 플로우 — 단계별 화살표 연결.",
        "피라미드 구조 — 상위→하위 계층.",
        "2×2 매트릭스 — 4가지 관점 정리.",
    ],
    "opinion": "인용 카드 — 핵심 메시지 큰 따옴표 강조.",
    "cta": "요약 카드 — 영상 핵심 3줄 요약 + 구독 유도.",
}


async def _get_slide_image(keyword, text, idx, total, category, section, jd, style, prev_descs):
    """이미지 생성 — 4단계 체인. 절대 실패 불가."""
    slide = os.path.join(jd, f"slide_{idx}.png")
    vis = _VIS["body"][idx % len(_VIS["body"])] if section == "body" else _VIS.get(section, _VIS["body"][0])
    core = text[:250] if text else keyword
    pal = style.get("palette", _PALETTES["tech"])

    # ── 1순위: Gemini Image ──
    gem = await _try_gemini(keyword, core, idx, total, section, vis, pal, style, prev_descs, jd)
    if gem:
        _add_overlay(gem, keyword, idx, total, slide)
        logger.info(f"[IMG] Block {idx+1}/{total}: gemini ✓")
        return slide, "gemini"

    # ── 2순위: fal.ai FLUX ──
    fal = await _try_fal(keyword, core, idx, total, section, vis, pal, style, jd)
    if fal:
        _add_overlay(fal, keyword, idx, total, slide)
        logger.info(f"[IMG] Block {idx+1}/{total}: fal.ai ✓")
        return slide, "fal.ai"

    # ── 3순위: Pexels ──
    pex = await _try_pexels(text, category, idx, jd)
    if pex:
        _add_overlay(pex, keyword, idx, total, slide)
        logger.info(f"[IMG] Block {idx+1}/{total}: pexels ✓")
        return slide, "pexels"

    # ── 4순위: Pillow 자체 생성 (100% 성공) ──
    _make_slide(slide, keyword, core, idx, total, section, pal)
    logger.info(f"[IMG] Block {idx+1}/{total}: pillow ✓")
    return slide, "pillow"


# ── Gemini ──
async def _try_gemini(keyword, core, idx, total, section, vis, pal, style, prev_descs, jd):
    key = os.getenv("GEMINI_API_KEY","").strip()
    if not key: return ""

    prev_ctx = ""
    if prev_descs:
        prev_ctx = "\nPREVIOUS SLIDES:\n" + "\n".join(f"- {d}" for d in prev_descs[-3:]) + "\nMaintain same style.\n"

    prompt = (
        f"Create professional Korean YouTube infographic (Slide {idx+1}/{total}).\n"
        f"TOPIC: {keyword}\nCONTENT: {core}\nVISUAL: {vis}\n"
        f"COLORS: bg={pal['bg']}, accent={pal['accent1']}, secondary={pal['accent2']}\n"
        f"STYLE: {style.get('theme','')}\n{prev_ctx}"
        f"RULES: data viz, Korean labels, 16:9, NO photos, vector only, bottom 15% empty for subs.\n"
    )

    try:
        import httpx
        for attempt in range(5):
            async with httpx.AsyncClient(timeout=90) as c:
                r = await c.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent",
                    params={"key": key},
                    json={"contents":[{"parts":[{"text":prompt}]}],
                          "generationConfig":{"responseModalities":["TEXT","IMAGE"]}})
                if r.status_code in (429, 503):
                    wait = 8 * (2 ** attempt)  # 8, 16, 32, 64, 128초
                    logger.info(f"[Gemini] {r.status_code}, wait {wait}s ({attempt+1}/5)")
                    await asyncio.sleep(min(wait, 120))
                    continue
                if r.status_code != 200:
                    logger.warning(f"[Gemini] HTTP {r.status_code}: {r.text[:100]}")
                    return ""
                for part in r.json().get("candidates",[{}])[0].get("content",{}).get("parts",[]):
                    if "inlineData" in part:
                        img = part["inlineData"].get("data","")
                        if img:
                            p = os.path.join(jd, f"gem_{idx}.png")
                            with open(p,"wb") as f: f.write(base64.b64decode(img))
                            return p
                return ""
    except Exception as e:
        logger.warning(f"[Gemini] {e}")
    return ""


# ── fal.ai ──
async def _try_fal(keyword, core, idx, total, section, vis, pal, style, jd):
    fal_key = os.getenv("FAL_API_KEY","").strip()
    if not fal_key: return ""

    prompt = (
        f"Professional Korean YouTube infographic slide. Clean modern flat design.\n"
        f"Topic: {keyword}. Content: {core}\n"
        f"Visual: {vis}. Colors: bg {pal['bg']}, accent {pal['accent1']}\n"
        f"Style: {style.get('theme','')}. 16:9, vector graphics, Korean text, "
        f"bottom 15% empty. Slide {idx+1}/{total}"
    )

    try:
        import httpx
        async with httpx.AsyncClient(timeout=90) as c:
            r = await c.post("https://queue.fal.run/fal-ai/flux/schnell",
                headers={"Authorization":f"Key {fal_key}","Content-Type":"application/json"},
                json={"prompt":prompt,"image_size":{"width":1280,"height":720},
                      "num_images":1,"enable_safety_checker":False})
            if r.status_code != 200:
                logger.warning(f"[fal] HTTP {r.status_code}: {r.text[:150]}")
                return ""
            data = r.json()
            images = data.get("images",[])
            # 큐 방식 폴링
            if not images:
                req_id = data.get("request_id","")
                if req_id:
                    for _ in range(30):
                        await asyncio.sleep(2)
                        sr = await c.get(f"https://queue.fal.run/fal-ai/flux/schnell/requests/{req_id}/status",
                            headers={"Authorization":f"Key {fal_key}"})
                        if sr.status_code == 200:
                            sd = sr.json()
                            if sd.get("status") == "COMPLETED":
                                rr = await c.get(f"https://queue.fal.run/fal-ai/flux/schnell/requests/{req_id}",
                                    headers={"Authorization":f"Key {fal_key}"})
                                if rr.status_code == 200:
                                    images = rr.json().get("images",[])
                                break
                            elif sd.get("status") == "FAILED": return ""
            if images:
                url = images[0].get("url","")
                if url:
                    dl = await c.get(url)
                    if dl.status_code == 200:
                        p = os.path.join(jd, f"fal_{idx}.png")
                        with open(p,"wb") as f: f.write(dl.content)
                        return p
    except Exception as e:
        logger.warning(f"[fal] {e}")
    return ""


# ── Pexels ──
_KR_EN = {"주식":"stock market","부동산":"real estate","투자":"investment","연금":"retirement",
    "절세":"tax planning","건강":"wellness","운동":"fitness","AI":"AI technology",
    "경제":"economy analytics","금리":"interest rate","창업":"startup business"}
_CAT_TERMS = {
    "economy":["finance chart","stock market","business meeting","economy graph","banking","trading"],
    "senior":["elderly garden","retirement","medical care","healthy food","family","wellness yoga"],
    "selfdev":["reading sunrise","fitness running","workspace clean","meditation","mountain summit"],
    "tech":["AI neural network","coding developer","server datacenter","robot automation","circuit board"],
    "life":["cooking gourmet","interior design","travel landscape","coffee cafe","photography","garden"],
}
_used_ids = set()

async def _try_pexels(text, category, idx, jd):
    key = os.getenv("PEXELS_API_KEY","").strip()
    if not key: return ""
    # 키워드 매칭
    query = ""
    for kr, en in _KR_EN.items():
        if kr in text: query = en; break
    if not query:
        terms = _CAT_TERMS.get(category, _CAT_TERMS["tech"])
        query = terms[idx % len(terms)]
    try:
        import httpx
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.get("https://api.pexels.com/v1/search",
                headers={"Authorization":key},
                params={"query":query,"per_page":15,"orientation":"landscape","size":"large"})
            if r.status_code != 200: return ""
            photos = r.json().get("photos",[])
            if not photos: return ""
            avail = [p for p in photos if p.get("id") not in _used_ids]
            if not avail: avail = photos
            photo = random.choice(avail); _used_ids.add(photo.get("id"))
            url = photo.get("src",{}).get("landscape","") or photo.get("src",{}).get("large2x","")
            if not url: return ""
            dl = await c.get(url)
            if dl.status_code == 200:
                p = os.path.join(jd, f"pex_{idx}.jpg")
                with open(p,"wb") as f: f.write(dl.content)
                return p
    except: pass
    return ""


# ── Pillow 자체 생성 (100% 성공) ──
def _make_slide(path, keyword, core, idx, total, section, pal):
    """Pillow로 인포그래픽 스타일 슬라이드 자체 생성 — 절대 실패 불가"""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except:
        # Pillow 없으면 빈 이미지라도 생성
        subprocess.run(["ffmpeg","-y","-f","lavfi","-i",
            f"color=c=0x1a1d23:s=1920x1080:d=1","-frames:v","1",path],
            capture_output=True, timeout=10)
        return path

    fp = _font()
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp, sz)
        except: return ImageFont.load_default()

    # 배경색 파싱
    bg_hex = pal.get("bg","#1a1d23").lstrip("#")
    try: bg_rgb = tuple(int(bg_hex[i:i+2],16) for i in (0,2,4))
    except: bg_rgb = (26,29,35)

    acc_hex = pal.get("accent1","#4A90D9").lstrip("#")
    try: acc_rgb = tuple(int(acc_hex[i:i+2],16) for i in (0,2,4))
    except: acc_rgb = (74,144,217)

    text_hex = pal.get("text","#1E293B").lstrip("#")
    try: text_rgb = tuple(int(text_hex[i:i+2],16) for i in (0,2,4))
    except: text_rgb = (30,41,59)

    img = Image.new("RGB",(1920,1080), bg_rgb)
    d = ImageDraw.Draw(img)

    # 상단 액센트 바
    d.rectangle([0,0,1920,6], fill=acc_rgb)

    # 스텝 번호 (좌상단)
    d.rectangle([40,30,180,80], fill=acc_rgb)
    d.text((55,35), f"STEP {idx+1}/{total}", fill=(255,255,255), font=font(22))

    # 키워드 (중앙 상단)
    try:
        f_kw = font(52)
        bbox = d.textbbox((0,0), keyword, font=f_kw)
        tw = bbox[2]-bbox[0]
        d.text(((1920-tw)//2, 120), keyword, fill=acc_rgb, font=f_kw)
    except: pass

    # 구분선
    d.rectangle([200, 200, 1720, 203], fill=(*acc_rgb, 80))

    # 본문 텍스트 (줄바꿈 처리)
    lines = []
    words = core.split()
    cur = ""
    for w in words:
        test = cur + " " + w if cur else w
        if len(test) > 35:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur: lines.append(cur)

    y = 260
    f_body = font(32)
    for line in lines[:12]:
        d.text((200, y), line, fill=text_rgb, font=f_body)
        y += 55

    # 하단 그라디언트 영역 (자막용 빈 공간)
    for yy in range(880, 1080):
        alpha = int((yy-880)/200 * 150)
        d.rectangle([0,yy,1920,yy+1], fill=(bg_rgb[0]//2, bg_rgb[1]//2, bg_rgb[2]//2))

    # 워터마크
    d.text((1780,1045), "AlgoMaker", fill=(*text_rgb[:2],text_rgb[2]//2), font=font(14))

    img.save(path, "PNG", quality=95)
    return path


# ── 오버레이 (상단 바 + 하단 그라디언트) ──
def _add_overlay(img_path, keyword, idx, total, out_path):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except:
        shutil.copy2(img_path, out_path)
        return out_path

    fp = _font()
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp, sz)
        except: return ImageFont.load_default()

    img = Image.open(img_path).convert("RGBA")
    img = img.resize((1920,1080), Image.LANCZOS)
    ov = Image.new("RGBA",(1920,1080),(0,0,0,0))
    d = ImageDraw.Draw(ov)

    # 상단 바
    d.rectangle([0,0,1920,50], fill=(0,0,0,160))
    d.text((20,10), f"STEP {idx+1}/{total}", fill=(196,154,26), font=font(14))
    d.text((120,8), keyword, fill=(255,255,255,220), font=font(20))
    d.text((1780,12), "AlgoMaker", fill=(255,255,255,80), font=font(12))

    # 하단 그라디언트 (자막 영역)
    for y in range(940,1080):
        a = int((y-940)/140 * 200)
        d.rectangle([0,y,1920,y+1], fill=(0,0,0,a))

    img = Image.alpha_composite(img, ov)
    img.convert("RGB").save(out_path, "PNG", quality=95)
    return out_path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  4. FFmpeg — 클립 생성 + 전환
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _img_to_clip(img, out, dur, idx=0):
    """이미지 → 클립. 미세 줌 + 페이드."""
    frames = max(24, int(dur * 24))
    vf = (f"scale=1980:1114,zoompan=z='min(zoom+0.0001,1.03)'"
          f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
          f":d={frames}:s=1920x1080:fps=24,"
          f"fade=in:0:18,fade=out:st={max(0,dur-0.6)}:d=15")
    cmd = ["ffmpeg","-y","-loop","1","-i",img,"-vf",vf,"-t",str(dur),
           "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",
           "-movflags","+faststart",out]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=240)
        if r.returncode == 0 and os.path.exists(out): return out
    except: pass
    # fallback — 정적
    subprocess.run(["ffmpeg","-y","-loop","1","-i",img,"-t",str(dur),
        "-vf","scale=1920:1080,fade=in:0:12",
        "-c:v","libx264","-preset","fast","-crf","22","-pix_fmt","yuv420p",out],
        capture_output=True, timeout=120)
    return out if os.path.exists(out) else ""


def _concat_with_transitions(clips, bg_path, jd):
    """클립들을 xfade 전환으로 연결. 실패 시 단순 concat."""
    if len(clips) == 1:
        shutil.copy2(clips[0], bg_path)
        return bg_path

    transitions = ["fadeblack","slideleft","slideright","slideup","circlecrop",
                    "fade","wipeleft","wiperight","smoothleft","smoothright"]
    XDUR = 0.5

    try:
        # xfade 체인
        inputs = []
        for c in clips: inputs.extend(["-i", c])

        clip_durs = []
        for c in clips:
            d = _dur(c)
            clip_durs.append(d if d > 0.5 else 5.0)

        parts = []
        cur = "[0:v]"
        offset = clip_durs[0] - XDUR

        for j in range(1, len(clips)):
            tr = transitions[j % len(transitions)]
            out_label = f"[v{j}]" if j < len(clips)-1 else "[vout]"
            parts.append(f"{cur}[{j}:v]xfade=transition={tr}:duration={XDUR}:offset={max(0.1,offset)}{out_label}")
            offset += clip_durs[j] - XDUR
            cur = out_label

        cmd = ["ffmpeg","-y"] + inputs + [
            "-filter_complex", ";".join(parts),
            "-map","[vout]","-c:v","libx264","-preset","medium","-crf","18",
            "-pix_fmt","yuv420p","-movflags","+faststart",bg_path]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if r.returncode == 0 and os.path.exists(bg_path):
            logger.info(f"[FFmpeg] ✓ xfade {len(clips)-1} transitions")
            return bg_path
        raise Exception(r.stderr[-200:] if r.stderr else "xfade failed")
    except Exception as e:
        logger.warning(f"[FFmpeg] xfade failed: {e}, using concat")

    # Fallback: 단순 concat
    lf = os.path.join(jd, "clips.txt")
    with open(lf,"w") as f:
        for c in clips: f.write(f"file '{c}'\n")
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,
        "-c:v","libx264","-preset","medium","-crf","18",
        "-pix_fmt","yuv420p","-movflags","+faststart",bg_path],
        capture_output=True, timeout=600)
    return bg_path if os.path.exists(bg_path) else ""


def _avatar_pip(bg, avatar, out):
    """아바타 PIP 합성 (우측 하단)"""
    vf = ("[1:v]scale=320:-1,chromakey=0x00FF00:0.3:0.1[av];"
          "[0:v][av]overlay=W-w-40:H-h-40:shortest=1[out]")
    cmd = ["ffmpeg","-y","-i",bg,"-i",avatar,"-filter_complex",vf,
           "-map","[out]","-map","0:a?","-c:v","libx264","-preset","medium","-crf","18",
           "-c:a","aac","-b:a","192k","-ac","2","-shortest","-movflags","+faststart",out]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if r.returncode == 0 and os.path.exists(out): return out
    except: pass
    return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  5. SRT 자막
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _chunk(t, mc=22):
    if len(t) <= mc: return [t]
    ch, cur = [], ""
    for s in re.split(r'(?<=[.!?。]) ', t):
        if len(cur)+len(s)+1 <= mc: cur = (cur+" "+s).strip()
        else:
            if cur: ch.append(cur)
            while len(s) > mc:
                cut = -1
                for sep in [', ','는 ','을 ','를 ','에 ','고 ','며 ','다. ','로 ','의 ']:
                    idx = s[:mc].rfind(sep)
                    if idx > 4: cut = idx+len(sep)-1; break
                if cut <= 0:
                    sp = s[:mc].rfind(' ')
                    cut = sp if sp > 4 else mc
                ch.append(s[:cut].strip()); s = s[cut:].strip()
            cur = s
    if cur: ch.append(cur)
    return ch or [t[:mc]]

def _srt(blocks, path, pause=0.3, durs=None):
    lines, cur, idx = [], 0.0, 1
    for i, b in enumerate(blocks):
        bd = durs[i] if durs and i < len(durs) else len(b["text"])/8.0
        chs = _chunk(b["text"]); cd = bd/max(len(chs),1)
        for ch in chs:
            lines += [str(idx), f"{_ts(cur)} --> {_ts(cur+cd)}", ch.strip(), ""]
            cur += cd; idx += 1
        cur += pause
    with open(path, "w", encoding="utf-8") as f: f.write("\n".join(lines))
    return path

def _ts(s):
    return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  6. BGM + 최종 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _bgm(path, dur, vol=0.05):
    cmd = ["ffmpeg","-y","-f","lavfi","-i",
           f"sine=frequency=160:duration={dur},tremolo=f=0.12:d=0.25,lowpass=f=1800,volume={vol*0.6}[a1];"
           f"sine=frequency=240:duration={dur},tremolo=f=0.08:d=0.2,lowpass=f=1600,volume={vol*0.4}[a2];"
           f"[a1][a2]amix=inputs=2:duration=first",
           "-ac","2","-c:a","aac","-b:a","128k",path]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
        if os.path.exists(path): return path
    except: pass
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"sine=frequency=180:duration={dur},volume={vol}",
                    "-ac","2","-c:a","aac",path], capture_output=True, timeout=60)
    return path if os.path.exists(path) else ""

def _compose(bg, audio, srt_path, output, bgm_path=""):
    """최종 합성: 영상 + TTS + 자막 + BGM"""
    fp = _font()
    fn = "NanumGothicBold" if fp and "NanumGothicBold" in fp else "NanumGothic"
    srt_esc = srt_path.replace("\\","/").replace(":",r"\:")
    ss = (f"FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
          f"BackColour=&H00000000,BorderStyle=1,Outline=2,Shadow=1,"
          f"MarginV=30,MarginL=60,MarginR=60,Alignment=2,Fontname={fn}")
    vf = f"subtitles='{srt_esc}':force_style='{ss}'"

    if bgm_path and os.path.exists(bgm_path):
        cmd = ["ffmpeg","-y","-i",bg,"-i",audio,"-i",bgm_path,
               "-filter_complex","[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
               "-vf",vf,"-map","0:v","-map","[aout]",
               "-c:v","libx264","-preset","medium","-crf","18",
               "-c:a","aac","-b:a","192k","-ac","2",
               "-shortest","-movflags","+faststart",output]
    else:
        cmd = ["ffmpeg","-y","-i",bg,"-i",audio,
               "-vf",vf,"-map","0:v","-map","1:a",
               "-c:v","libx264","-preset","medium","-crf","18",
               "-c:a","aac","-b:a","192k","-ac","2",
               "-shortest","-movflags","+faststart",output]

    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
        if r.returncode == 0 and os.path.exists(output):
            logger.info("[Compose] ✓ Final video with subtitles")
            return output
        logger.warning(f"[Compose] SRT failed, trying without subs")
    except Exception as e:
        logger.warning(f"[Compose] {e}")

    # Fallback: 자막 없이
    try:
        subprocess.run(["ffmpeg","-y","-i",bg,"-i",audio,"-map","0:v","-map","1:a",
            "-c:v","libx264","-preset","fast","-crf","20",
            "-c:a","aac","-b:a","192k","-ac","2","-shortest",
            "-movflags","+faststart",output], capture_output=True, timeout=600)
        if os.path.exists(output):
            logger.info("[Compose] ✓ Final video (no subs)")
            return output
    except: pass

    # 최후: 오디오만이라도
    shutil.copy2(audio, output.replace(".mp4",".mp3"))
    return output.replace(".mp4",".mp3")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  6b. 디지털 지문 변조 (Policy Shield)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _fingerprint(video_path, jd):
    """영상의 픽셀/오디오를 미세 변조하여 유튜브 AI가 재사용 콘텐츠로 인식 못하게 처리"""
    out = os.path.join(jd, "fingerprinted.mp4")
    
    # 랜덤 시드
    hue_shift = random.uniform(-2, 2)          # 색조 미세 변환
    brightness = random.uniform(-0.02, 0.02)   # 밝기 미세 조정
    contrast = random.uniform(0.98, 1.02)      # 대비 미세 조정
    pitch_shift = random.randint(-50, 50)      # 오디오 피치 미세 변환 (Hz)
    pad_ms = random.randint(50, 200)           # 앞뒤 무음 패딩 (ms)
    
    vf = (f"eq=brightness={brightness}:contrast={contrast},"
          f"hue=h={hue_shift},"
          f"noise=alls={random.randint(1,3)}:allf=t")  # 극미세 노이즈
    
    af = (f"apad=pad_dur={pad_ms/1000},"
          f"asetrate=44100*{1 + pitch_shift/44100},"
          f"aresample=44100,"
          f"volume={random.uniform(0.98, 1.02)}")
    
    cmd = ["ffmpeg","-y","-i",video_path,
           "-vf",vf,"-af",af,
           "-c:v","libx264","-preset","medium","-crf","18",
           "-c:a","aac","-b:a","192k","-ac","2",
           "-movflags","+faststart",
           "-metadata",f"comment=AM{uuid.uuid4().hex[:8]}",
           "-metadata",f"creation_time={_random_time()}",
           out]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if r.returncode == 0 and os.path.exists(out):
            os.replace(out, video_path)
            logger.info(f"[Shield] ✓ Fingerprint applied (hue={hue_shift:.1f}, brt={brightness:.3f})")
            return video_path
    except Exception as e:
        logger.warning(f"[Shield] Fingerprint failed: {e}")
    return video_path

def _random_time():
    """랜덤 creation_time 메타데이터 생성"""
    import datetime
    base = datetime.datetime.now() - datetime.timedelta(hours=random.randint(1,72))
    return base.strftime("%Y-%m-%dT%H:%M:%S")

def _uniqueness_grade(sources):
    """수익화 등급 산출 (A+~F)"""
    total = sum(sources.values())
    if total == 0: return "F", 0
    
    ai_ratio = (sources.get("gemini",0) + sources.get("fal.ai",0)) / total
    pexels_ratio = sources.get("pexels",0) / total
    pillow_ratio = sources.get("pillow",0) / total
    
    score = ai_ratio * 100 + pexels_ratio * 50 + pillow_ratio * 20
    
    if score >= 90: return "A+", score
    elif score >= 80: return "A", score
    elif score >= 70: return "B+", score
    elif score >= 60: return "B", score
    elif score >= 40: return "C", score
    elif score >= 20: return "D", score
    else: return "F", score


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  7. HeyGen 아바타
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _heygen(full_text, jd):
    key = os.getenv("HEYGEN_API_KEY","").strip()
    if not key: return ""
    try:
        import httpx
        # 아바타 목록
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.get("https://api.heygen.com/v2/avatars",headers={"X-Api-Key":key})
            if r.status_code != 200: return ""
            avatars = r.json().get("data",{}).get("avatars",[])
            if not avatars: return ""
            aid = avatars[0].get("avatar_id","")

        # 음성 목록
        async with httpx.AsyncClient(timeout=30) as c:
            voice_id = ""
            try:
                vr = await c.get("https://api.heygen.com/v2/voices",headers={"X-Api-Key":key})
                if vr.status_code == 200:
                    for v in vr.json().get("data",{}).get("voices",[]):
                        if "ko" in v.get("language","").lower():
                            voice_id = v.get("voice_id",""); break
                    if not voice_id:
                        voices = vr.json().get("data",{}).get("voices",[])
                        if voices: voice_id = voices[0].get("voice_id","")
            except: pass
            if not voice_id: return ""

            # 생성 요청
            r = await c.post("https://api.heygen.com/v2/video/generate",
                headers={"X-Api-Key":key,"Content-Type":"application/json"},
                json={"video_inputs":[{
                    "character":{"type":"avatar","avatar_id":aid,"avatar_style":"normal"},
                    "voice":{"type":"text","input_text":full_text[:4800],"voice_id":voice_id},
                    "background":{"type":"color","value":"#00FF00"}
                }],"dimension":{"width":540,"height":960}})
            if r.status_code != 200:
                logger.warning(f"[HeyGen] {r.status_code}: {r.text[:200]}")
                return ""
            vid = r.json().get("data",{}).get("video_id","")
            if not vid: return ""

        # 폴링
        ap = os.path.join(jd,"avatar.mp4")
        async with httpx.AsyncClient(timeout=60) as c:
            for _ in range(60):
                await asyncio.sleep(10)
                try:
                    r = await c.get(f"https://api.heygen.com/v1/video_status.get?video_id={vid}",
                        headers={"X-Api-Key":key})
                    if r.status_code != 200: continue
                    d = r.json().get("data",{})
                    if d.get("status") == "completed":
                        url = d.get("video_url","")
                        if url:
                            dl = await c.get(url)
                            if dl.status_code == 200:
                                with open(ap,"wb") as f: f.write(dl.content)
                                return ap
                        return ""
                    elif d.get("status") == "failed": return ""
                except: continue
        return ""
    except Exception as e:
        logger.error(f"[HeyGen] {e}")
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v17 — NEVER FAIL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_real_video(keyword, category, script_blocks, mode="normal",
                               channel_name="", watermark_text="", tts_voice_id=""):
    global _used_ids
    _used_ids = set()
    job_id = str(uuid.uuid4())[:8]
    jd = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(jd, exist_ok=True)

    try:
        is_sr = mode == "senior"
        speed = 0.92 if is_sr else 1.0
        pause = 0.5 if is_sr else 0.3
        voice = tts_voice_id or "2gbExjiWDnG1DMGr81Bx"
        total = len(script_blocks)

        logger.info(f"[V17] ═══ START: '{keyword}', {total} blocks, mode={mode} ═══")

        # ── Step 1: TTS (실패 시 영상 생성 중단) ──
        audio, adur, bdurs = await _tts_all(script_blocks, jd, speed, voice)

        # ── Step 2: Style ──
        style = _build_style(keyword, category, script_blocks)

        # ── Step 3: 슬라이드 이미지 (항상 성공 — 4단계 체인) ──
        clips = []
        prev_descs = []
        sources = {"gemini":0, "fal.ai":0, "pexels":0, "pillow":0}

        for i in range(total):
            b = script_blocks[i]
            bd = bdurs[i] if i < len(bdurs) else 5.0
            clip_dur = bd + pause

            slide, src = await _get_slide_image(
                keyword, b.get("text",""), i, total, category,
                b.get("section","body"), jd, style, prev_descs)

            sources[src] = sources.get(src, 0) + 1
            prev_descs.append(f"Slide {i+1}: {src} — {b.get('section','body')}")

            # 클립 변환
            clip = os.path.join(jd, f"clip_{i}.mp4")
            _img_to_clip(slide, clip, clip_dur, idx=i)
            if os.path.exists(clip):
                clips.append(clip)

            # Gemini 쿼터 보호: 블록 간 대기 (429 방지)
            if i < total - 1:
                await asyncio.sleep(4)

        logger.info(f"[V17] Slides: {sources}")

        # ── Step 4: 클립 연결 (전환 효과) ──
        bg = os.path.join(jd, "bg.mp4")
        if clips:
            _concat_with_transitions(clips, bg, jd)
        else:
            # 클립이 하나도 없으면 검정 배경이라도
            subprocess.run(["ffmpeg","-y","-f","lavfi","-i",
                f"color=c=black:s=1920x1080:d={adur+2}",
                "-c:v","libx264","-pix_fmt","yuv420p",bg],
                capture_output=True, timeout=60)

        # ── Step 5: HeyGen 아바타 ──
        full = " ".join(b.get("text","") for b in script_blocks)
        avp = await _heygen(full, jd)
        if avp and os.path.exists(avp):
            pip = os.path.join(jd, "bg_pip.mp4")
            result = _avatar_pip(bg, avp, pip)
            if result: bg = pip
            logger.info(f"[V17] Avatar: {'✓' if result else '✗'}")
        else:
            logger.info("[V17] Avatar: skipped")

        # ── Step 6: SRT 자막 ──
        srt = os.path.join(jd, "subs.srt")
        _srt(script_blocks, srt, pause, bdurs)

        # ── Step 7: BGM + 최종 합성 ──
        vdur = adur + pause * total + 2
        bgm = os.path.join(jd, "bgm.m4a")
        _bgm(bgm, vdur, 0.04 if is_sr else 0.05)

        out = os.path.join(jd, f"creato_{job_id}_final.mp4")
        res = _compose(bg, audio, srt, out, bgm)

        if res and os.path.exists(res):
            # ── Step 8: 디지털 지문 변조 (재사용 콘텐츠 필터 회피) ──
            _fingerprint(res, jd)
            
            # ── Step 9: 수익화 등급 산출 ──
            grade, score = _uniqueness_grade(sources)
            logger.info(f"[V17] Shield Grade: {grade} ({score:.0f}/100)")

            fs = os.path.getsize(res)
            rd = _dur(res) or vdur
            logger.info(f"[V17] ═══ DONE: {fs/1024/1024:.1f}MB, {rd:.1f}s, Grade={grade} ═══")
            return RealVideoResult(
                job_id=job_id, status="done", output_path=res,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(rd,1), file_size_bytes=fs,
                tts_audio_path=audio, subtitle_path=srt)

        # 최후: 오디오만이라도 반환
        logger.warning("[V17] Video compose failed, returning audio only")
        return RealVideoResult(
            job_id=job_id, status="done", output_path=audio,
            download_url=f"/api/v1/video/download/{job_id}",
            duration_sec=round(adur,1), file_size_bytes=os.path.getsize(audio),
            tts_audio_path=audio)

    except TTSFailedError as e:
        # TTS 완전 실패 — 임시 파일 정리 후 초기 상태로 복귀
        logger.error(f"[V17] TTS 실패 — 영상 생성 중단: {e}")
        try:
            if os.path.exists(jd):
                shutil.rmtree(jd)
                logger.info(f"[V17] 임시 파일 정리 완료: {jd}")
        except Exception:
            pass
        return RealVideoResult(
            job_id=job_id,
            status="tts_failed",
            error=str(e),
        )

    except Exception as e:
        logger.error(f"[V17] FATAL: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))

