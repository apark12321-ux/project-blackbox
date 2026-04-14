"""
AlgoMaker — 영상 생성 엔진 v16
═══════════════════════════════════════
v15 → v16 고도화:
1. Recursive Source: 이전 블록 결과를 다음 블록 생성 시 참조 → 일관된 화풍
2. Style Sheet: 영상 전체 스타일을 첫 프롬프트에서 정의 → 모든 블록에 강제 적용
3. Batch Processing: 블록을 5개씩 배치 처리 → AI 과부하 방지
4. 자막: 1줄 22자, FontSize=18, 외곽선, 하단 고정
5. TTS: CPS 8.0 기준
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
#  1. TTS (ElevenLabs)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _tts_block(text, path, voice_id="jBpfuIE2acCO8z3wKNLl", speed=1.0):
    key = os.getenv("ELEVENLABS_API_KEY",""); est = len(text)/(8.0*speed)
    if not key: _silent(path, est); return path, est
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
            d = _dur(path); return path, d if d > 0 else est
    except Exception as e:
        logger.error(f"[TTS] {e}"); _silent(path, est); return path, est

async def _tts_all(blocks, jd, speed=1.0, voice_id="jBpfuIE2acCO8z3wKNLl"):
    durs, paths = [], []
    for i, b in enumerate(blocks):
        p = os.path.join(jd, f"tts_{i}.mp3")
        _, d = await _tts_block(b["text"], p, voice_id, speed)
        paths.append(p); durs.append(d)
        logger.info(f"[TTS] Block {i}: {d:.1f}s")
    comb = os.path.join(jd, "tts_full.mp3")
    if len(paths) == 1:
        shutil.copy2(paths[0], comb)
    else:
        lf = os.path.join(jd, "tts_list.txt")
        with open(lf,"w") as f:
            for p in paths: f.write(f"file '{p}'\n")
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,"-c:a","copy",comb],
                       capture_output=True, timeout=120)
    st = os.path.join(jd, "tts_stereo.mp3")
    subprocess.run(["ffmpeg","-y","-i",comb,"-ac","2","-c:a","libmp3lame","-b:a","192k",st],
                   capture_output=True, timeout=60)
    if os.path.exists(st): os.replace(st, comb)
    t = _dur(comb); return comb, (t if t > 0 else sum(durs)), durs

def _silent(p, d):
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"anullsrc=r=44100:cl=stereo",
                    "-t",str(d),"-c:a","libmp3lame","-b:a","128k",p], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2. Style Sheet (영상 전체 스타일 정의)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _build_style_sheet(keyword, category, blocks):
    """영상 전체에 적용할 Global Style Sheet 생성"""
    cat_styles = {
        "economy": "금융/비즈니스 테마. 네이비+골드 색조. 차트와 그래프 중심. 정장을 입은 전문가 분위기.",
        "senior": "따뜻한 파스텔 톤. 민트+크림 색조. 부드러운 곡선. 건강/복지 아이콘. 큰 글씨.",
        "selfdev": "밝고 에너지 넘치는. 오렌지+화이트. 체크리스트와 목표 달성 아이콘. 깔끔한 미니멀.",
        "tech": "다크 테마 + 네온 악센트. 사이버펑크 느낌. 회로/코드 패턴. 블루+퍼플 그라디언트.",
        "life": "자연스러운 어스톤. 그린+베이지. 손그림 스타일 아이콘. 따뜻하고 친근한 분위기.",
    }
    # 전체 대본 핵심 키워드 추출
    all_text = " ".join(b.get("text","")[:50] for b in blocks[:5])
    return {
        "theme": cat_styles.get(category, cat_styles["tech"]),
        "keyword": keyword,
        "palette": _get_palette(category),
        "summary": all_text[:200],
        "total_blocks": len(blocks),
    }

def _get_palette(category):
    palettes = {
        "economy": {"bg":"#FAFBFE","accent1":"#2D5F8A","accent2":"#D4A537","accent3":"#1B3A5C","text":"#1E293B"},
        "senior": {"bg":"#F8FCFA","accent1":"#3ECDA5","accent2":"#FFB74D","accent3":"#5BA88C","text":"#2D3748"},
        "selfdev": {"bg":"#FFFAF5","accent1":"#E8735A","accent2":"#4A90D9","accent3":"#F5A623","text":"#1A202C"},
        "tech": {"bg":"#0F1729","accent1":"#6C5CE7","accent2":"#00D2FF","accent3":"#A29BFE","text":"#E2E8F0"},
        "life": {"bg":"#F9FAF5","accent1":"#6B8E5B","accent2":"#D4A574","accent3":"#8FB573","text":"#2D3B2E"},
    }
    return palettes.get(category, palettes["tech"])


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  3. Gemini 인포그래픽 (Recursive Source)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_VIS_TYPE = {
    "hook": "타이틀 카드 — 큰 제목과 핵심 수치를 강렬하게. 주제 아이콘 3개 배치.",
    "body": [
        "좌우 비교표 — 두 가지를 나란히 비교. 아이콘+수치. 컬러로 장단점 구분.",
        "막대/도넛 차트 — 핵심 데이터를 시각화. 수치 라벨 포함.",
        "타임라인 — 3~5단계 시간순 흐름. 각 단계에 아이콘+한줄 설명.",
        "체크리스트 카드 — 핵심 포인트 4~5개. 체크 아이콘. 중요도 색상 구분.",
        "프로세스 플로우 — 단계별 흐름을 화살표로 연결.",
        "피라미드 구조 — 상위→하위 계층. 각 층에 키워드+아이콘.",
        "2×2 매트릭스 — 4가지 관점 정리. 각 칸에 색상+아이콘.",
    ],
    "opinion": "인용 카드 — 핵심 메시지를 큰 따옴표와 함께 강조.",
    "cta": "요약 카드 — 영상 핵심 3줄 요약 + 구독 유도 아이콘.",
}

async def _gemini_visual(keyword, text, idx, total, category, section, path,
                          style_sheet=None, prev_descriptions=None):
    """Gemini로 인포그래픽 생성 — Style Sheet + Recursive Source 적용"""
    key = os.getenv("GEMINI_API_KEY","").strip()
    if not key: return ""

    vis = _VIS_TYPE["body"][idx % len(_VIS_TYPE["body"])] if section == "body" else _VIS_TYPE.get(section, _VIS_TYPE["body"][0])
    core = text[:200] if text else keyword
    pal = style_sheet.get("palette", {}) if style_sheet else _get_palette(category)

    # ★ Recursive Source: 이전 블록들의 시각적 설명을 참조
    prev_context = ""
    if prev_descriptions:
        prev_context = (
            "\n\nPREVIOUS SLIDES (maintain visual consistency with these):\n"
            + "\n".join(f"- Slide {i+1}: {desc}" for i, desc in enumerate(prev_descriptions[-3:]))
            + "\nIMPORTANT: Use the SAME color palette, icon style, and layout language as previous slides.\n"
        )

    # ★ Global Style Sheet
    style_context = ""
    if style_sheet:
        style_context = f"\nGLOBAL STYLE: {style_sheet.get('theme','')}\n"

    prompt = (
        f"Create a professional Korean YouTube infographic visual (Slide {idx+1}/{total}).\n\n"
        f"TOPIC: {keyword}\n"
        f"CONTENT:\n{core}\n\n"
        f"VISUAL TYPE: {vis}\n\n"
        f"COLOR PALETTE (MUST USE EXACTLY):\n"
        f"- Background: {pal.get('bg','#FAFBFE')}\n"
        f"- Primary accent: {pal.get('accent1','#4A90D9')}\n"
        f"- Secondary accent: {pal.get('accent2','#D4A537')}\n"
        f"- Tertiary: {pal.get('accent3','#6B8E5B')}\n"
        f"- Text color: {pal.get('text','#1E293B')}\n"
        f"{style_context}"
        f"{prev_context}"
        f"\nDESIGN RULES:\n"
        f"- Data visualization: charts, graphs, tables, diagrams\n"
        f"- Include numbers/statistics from the content\n"
        f"- Flat design, clean layout, modern infographic\n"
        f"- Korean text for labels\n"
        f"- 16:9 (1920x1080)\n"
        f"- NO photos — only vector graphics, icons, charts\n"
        f"- Bottom 15% empty (subtitle area)\n"
        f"- MUST maintain visual consistency across all slides\n"
    )

    try:
        import httpx
        MAX_RETRIES = 3
        for attempt in range(MAX_RETRIES):
            async with httpx.AsyncClient(timeout=90) as c:
                r = await c.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
                    params={"key": key},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseModalities": ["TEXT","IMAGE"]}
                    })
                if r.status_code == 429:
                    wait = 4 + attempt * 3  # 4초, 7초, 10초
                    logger.info(f"[Gemini] 429 rate limit, waiting {wait}s (attempt {attempt+1}/{MAX_RETRIES})")
                    await asyncio.sleep(wait)
                    continue
                if r.status_code != 200:
                    logger.warning(f"[Gemini] HTTP {r.status_code}: {r.text[:200]}")
                    return ""
                data = r.json()
                description = ""
                for part in data.get("candidates",[{}])[0].get("content",{}).get("parts",[]):
                    if "text" in part:
                        description = part["text"][:150]
                    if "inlineData" in part:
                        img_data = part["inlineData"].get("data","")
                        if img_data:
                            with open(path, "wb") as f:
                                f.write(base64.b64decode(img_data))
                            logger.info(f"[Gemini] ✓ Block {idx} ({section})")
                            return path, description
                logger.warning(f"[Gemini] No image for block {idx}")
                return ""
        logger.warning(f"[Gemini] Failed after {MAX_RETRIES} retries for block {idx}")
    except Exception as e:
        logger.warning(f"[Gemini] {e}")
    return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  3b. Pexels 폴백 + 그라디언트 폴백
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_KR_EN = {
    "주식":"stock market trading","부동산":"real estate aerial","투자":"investment growth",
    "연금":"retirement pension","절세":"tax calculator","재테크":"financial planning",
    "건강":"healthy wellness","운동":"exercise fitness","식단":"healthy food",
    "AI":"artificial intelligence","인공지능":"AI technology","코딩":"coding laptop",
    "자기계발":"personal growth","독서":"reading library","경제":"economy analytics",
    "금융":"finance banking","반도체":"semiconductor chip","전기차":"electric vehicle",
    "금리":"interest rate bank","창업":"startup business","여행":"travel landscape",
}

_CAT_TERMS = {
    "economy":["finance analytics","stock market","business meeting","corporate skyline",
               "digital payment","real estate city","trading monitors","economy chart"],
    "senior": ["elderly happy garden","retirement peaceful","medical doctor","healthy meal",
               "family generations","wellness yoga","community active","sunrise nature"],
    "selfdev":["reading sunrise","running fitness","workspace clean","meditation calm",
               "mountain summit","study library","planning goals","morning routine"],
    "tech":   ["AI neural network","coding developer","server datacenter","smartphone future",
               "robot automation","virtual reality","circuit board","drone technology"],
    "life":   ["cooking gourmet","interior minimalist","travel tropical","coffee cafe",
               "yoga outdoor","garden botanical","photography creative","music cozy"],
}

_used_ids = set()

async def _pexels(query, save_path):
    key = os.getenv("PEXELS_API_KEY","").strip()
    if not key: return ""
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
            img = await c.get(url)
            if img.status_code == 200:
                with open(save_path,"wb") as f: f.write(img.content)
                return save_path
    except: pass
    return ""

def _pexels_query(text, category, idx):
    for kr, en in _KR_EN.items():
        if kr in text: return en
    terms = _CAT_TERMS.get(category, _CAT_TERMS["tech"])
    return terms[idx % len(terms)]

def _add_bar(img_path, keyword, idx, total, out_path):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except: return img_path
    fp = _font()
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp, sz)
        except: return ImageFont.load_default()
    img = Image.open(img_path).convert("RGBA")
    img = img.resize((1920,1080), Image.LANCZOS)
    ov = Image.new("RGBA",(1920,1080),(0,0,0,0))
    d = ImageDraw.Draw(ov)
    d.rectangle([0,0,1920,60], fill=(0,0,0,140))
    d.text((24,12), f"STEP {idx+1}/{total}", fill=(196,154,26), font=font(14))
    d.text((140,8), keyword, fill=(255,255,255,220), font=font(24))
    d.text((1780,14), "AlgoMaker", fill=(255,255,255,60), font=font(12))
    for y in range(960,1080):
        a = int((y-960)/120 * 190)
        d.rectangle([0,y,1920,y+1], fill=(0,0,0,a))
    img = Image.alpha_composite(img, ov)
    img.convert("RGB").save(out_path, "PNG", quality=95)
    return out_path

def _gradient_slide(path, keyword, idx, total):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except: return ""
    fp = _font()
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp, sz)
        except: return ImageFont.load_default()
    pals = [((20,60,90),(8,25,45)),((40,65,55),(12,30,22)),((55,35,65),(22,12,30)),
            ((65,45,25),(28,18,10)),((25,45,65),(8,18,30)),((45,30,55),(18,10,25))]
    c1,c2 = pals[idx%len(pals)]
    img = Image.new("RGB",(1920,1080))
    d = ImageDraw.Draw(img)
    for y in range(1080):
        d.line([(0,y),(1920,y)], fill=(
            int(c1[0]+(c2[0]-c1[0])*y/1080),
            int(c1[1]+(c2[1]-c1[1])*y/1080),
            int(c1[2]+(c2[2]-c1[2])*y/1080)))
    try:
        f=font(48); bbox=d.textbbox((0,0),keyword,font=f); tw=bbox[2]-bbox[0]
        d.text(((1920-tw)//2,480),keyword,fill=(196,154,26),font=f)
        d.text(((1920-180)//2,548),f"STEP {idx+1}/{total}",fill=(180,180,190),font=font(18))
    except: pass
    img.save(path,"PNG",quality=95)
    return path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  3c. fal.ai 이미지 생성 (FLUX — 쿼터 제한 없음)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _fal_visual(keyword, text, idx, total, category, section, path,
                       style_sheet=None):
    """fal.ai FLUX로 인포그래픽 슬라이드 생성 — 쿼터 제한 없음"""
    fal_key = os.getenv("FAL_API_KEY","").strip()
    if not fal_key: return ""

    pal = style_sheet.get("palette", {}) if style_sheet else _get_palette(category)
    core = text[:200] if text else keyword

    # 섹션별 시각화 유형
    vis = _VIS_TYPE["body"][idx % len(_VIS_TYPE["body"])] if section == "body" else _VIS_TYPE.get(section, _VIS_TYPE["body"][0])

    prompt = (
        f"Professional Korean YouTube infographic slide. Clean, modern, flat design.\n"
        f"Topic: {keyword}\n"
        f"Content: {core}\n"
        f"Visual type: {vis}\n"
        f"Style: {style_sheet.get('theme','') if style_sheet else ''}\n"
        f"Colors: background {pal.get('bg','#FAFBFE')}, accent {pal.get('accent1','#4A90D9')}, "
        f"secondary {pal.get('accent2','#D4A537')}\n"
        f"Rules: data visualization with charts/graphs/diagrams, Korean text labels, "
        f"16:9 aspect ratio, NO photos, vector-style graphics only, "
        f"bottom 15% empty for subtitles, clean white/light background, "
        f"Slide {idx+1} of {total}"
    )

    try:
        import httpx
        async with httpx.AsyncClient(timeout=90) as c:
            # FLUX.1 [schnell] — 가장 빠르고 저렴
            r = await c.post(
                "https://queue.fal.run/fal-ai/flux/schnell",
                headers={
                    "Authorization": f"Key {fal_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "prompt": prompt,
                    "image_size": {"width": 1280, "height": 720},
                    "num_images": 1,
                    "enable_safety_checker": False,
                })
            if r.status_code != 200:
                logger.warning(f"[fal.ai] HTTP {r.status_code}: {r.text[:200]}")
                return ""

            data = r.json()
            images = data.get("images", [])
            if not images:
                # 큐 방식 — request_id로 폴링
                req_id = data.get("request_id","")
                if req_id:
                    for _ in range(30):
                        await asyncio.sleep(2)
                        sr = await c.get(
                            f"https://queue.fal.run/fal-ai/flux/schnell/requests/{req_id}/status",
                            headers={"Authorization": f"Key {fal_key}"})
                        if sr.status_code == 200:
                            sd = sr.json()
                            if sd.get("status") == "COMPLETED":
                                rr = await c.get(
                                    f"https://queue.fal.run/fal-ai/flux/schnell/requests/{req_id}",
                                    headers={"Authorization": f"Key {fal_key}"})
                                if rr.status_code == 200:
                                    images = rr.json().get("images",[])
                                break
                            elif sd.get("status") == "FAILED":
                                logger.warning(f"[fal.ai] Queue failed")
                                return ""

            if images:
                img_url = images[0].get("url","")
                if img_url:
                    dl = await c.get(img_url)
                    if dl.status_code == 200:
                        with open(path, "wb") as f:
                            f.write(dl.content)
                        logger.info(f"[fal.ai] ✓ Block {idx} ({section})")
                        return path
            logger.warning(f"[fal.ai] No image for block {idx}")
    except Exception as e:
        logger.warning(f"[fal.ai] {e}")
    return ""
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _heygen(full_text, jd):
    key = os.getenv("HEYGEN_API_KEY","").strip()
    if not key: return ""
    try:
        import httpx
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.get("https://api.heygen.com/v2/avatars",headers={"X-Api-Key":key})
            if r.status_code != 200:
                logger.error(f"[HeyGen] Avatars: {r.status_code} {r.text[:200]}")
                return ""
            avatars = r.json().get("data",{}).get("avatars",[])
            if not avatars: return ""
            aid = avatars[0].get("avatar_id","")
            logger.info(f"[HeyGen] Avatar: {aid}")

        async with httpx.AsyncClient(timeout=60) as c:
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

            r = await c.post("https://api.heygen.com/v2/video/generate",
                headers={"X-Api-Key":key,"Content-Type":"application/json"},
                json={"video_inputs":[{
                    "character":{"type":"avatar","avatar_id":aid,"avatar_style":"normal"},
                    "voice":{"type":"text","input_text":full_text[:4800],"voice_id":voice_id},
                    "background":{"type":"color","value":"#00FF00"}
                }],"dimension":{"width":540,"height":960}})
            if r.status_code != 200:
                logger.error(f"[HeyGen] Generate: {r.status_code} {r.text[:300]}")
                return ""
            vid = r.json().get("data",{}).get("video_id","")
            if not vid: return ""

        ap = os.path.join(jd,"avatar.mp4")
        async with httpx.AsyncClient(timeout=60) as c:
            for attempt in range(60):
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
        logger.error(f"[HeyGen] {e}"); return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  5. FFmpeg
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _img_to_clip(img, out, dur, idx=0):
    """이미지를 영상 클립으로 변환 — 미세한 줌인 + 페이드"""
    # 아주 미세한 줌 (0.02% per frame) — 흔들리지 않지만 살아있는 느낌
    frames = int(dur * 24)
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
        "-c:v","libx264","-preset","fast","-crf","20","-pix_fmt","yuv420p",out],
        capture_output=True, timeout=120)
    return out if os.path.exists(out) else ""

def _avatar_pip(bg, avatar, out):
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
#  6. SRT 자막 (1줄 22자, 조사 기준 분할)
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
                for sep in [', ','는 ','을 ','를 ','에 ','고 ','며 ','다. ','로 ','의 ','이 ','가 ']:
                    idx = s[:mc].rfind(sep)
                    if idx > 4: cut = idx + len(sep) - 1; break
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

def _ts(s): return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  7. 최종 합성
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
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if r.returncode == 0 and os.path.exists(output):
            logger.info("[Compose] ✓ with subtitles")
            return output
        logger.error(f"[Compose] SRT fail: {r.stderr[-300:]}")
    except Exception as e:
        logger.error(f"[Compose] {e}")

    # fallback
    subprocess.run(["ffmpeg","-y","-i",bg,"-i",audio,"-map","0:v","-map","1:a",
        "-c:v","libx264","-preset","fast","-crf","20",
        "-c:a","aac","-b:a","192k","-ac","2","-shortest",
        "-movflags","+faststart",output], capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v16
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BATCH_SIZE = 3  # 배치 처리 단위 (무료 tier: 분당 20회 → 3개씩 + 3초 간격)

async def generate_real_video(keyword, category, script_blocks, mode="normal",
                               channel_name="", watermark_text="", tts_voice_id=""):
    global _used_ids
    _used_ids = set()

    job_id = str(uuid.uuid4())[:8]
    jd = os.path.join(OUTPUT_DIR, job_id); os.makedirs(jd, exist_ok=True)

    try:
        is_sr = mode == "senior"
        speed = 0.92 if is_sr else 1.0
        pause = 0.5 if is_sr else 0.3
        voice = tts_voice_id or "jBpfuIE2acCO8z3wKNLl"

        logger.info(f"[V16] Start: '{keyword}', {len(script_blocks)} blocks, mode={mode}")

        # ── Step 1: TTS ──
        audio, adur, bdurs = await _tts_all(script_blocks, jd, speed, voice)
        logger.info(f"[V16] TTS: {adur:.1f}s")

        # ── Step 2: Style Sheet 생성 ──
        style = _build_style_sheet(keyword, category, script_blocks)
        logger.info(f"[V16] Style: {style['theme'][:50]}")

        # ── Step 3: 블록별 자료화면 (Recursive Source + Batch) ──
        clips = []
        total = len(script_blocks)
        prev_descs = []  # ★ 이전 블록들의 시각적 설명 누적

        for batch_start in range(0, total, BATCH_SIZE):
            batch_end = min(batch_start + BATCH_SIZE, total)
            logger.info(f"[V16] Batch {batch_start+1}~{batch_end}/{total}")

            for i in range(batch_start, batch_end):
                b, bd = script_blocks[i], bdurs[i]
                clip_dur = bd + pause
                text = b.get("text","")
                sec = b.get("section","body")
                slide = os.path.join(jd, f"slide_{i}.png")
                src = "none"

                # 1순위: Gemini (무료 — with Recursive Source)
                gem_path = os.path.join(jd, f"gem_{i}.png")
                result = await _gemini_visual(
                    keyword, text, i, total, category, sec, gem_path,
                    style_sheet=style, prev_descriptions=prev_descs)

                if result and isinstance(result, tuple):
                    got, desc = result
                    if got and os.path.exists(got):
                        _add_bar(got, keyword, i, total, slide)
                        prev_descs.append(desc or f"Block {i+1}: {sec} style infographic")
                        src = "gemini"
                elif result and os.path.exists(str(result)):
                    _add_bar(str(result), keyword, i, total, slide)
                    prev_descs.append(f"Block {i+1}: {sec} infographic")
                    src = "gemini"

                # 2순위: fal.ai FLUX (유료 — Gemini 실패 시)
                if src == "none":
                    fal_path = os.path.join(jd, f"fal_{i}.png")
                    fal_got = await _fal_visual(
                        keyword, text, i, total, category, sec, fal_path,
                        style_sheet=style)
                    if fal_got and os.path.exists(fal_got):
                        _add_bar(fal_got, keyword, i, total, slide)
                        prev_descs.append(f"Block {i+1}: {sec} infographic slide")
                        src = "fal.ai"

                if src == "none":
                    # 2순위: Pexels
                    pex_path = os.path.join(jd, f"pex_{i}.jpg")
                    query = _pexels_query(text, category, i)
                    got2 = await _pexels(query, pex_path)
                    if got2 and os.path.exists(got2):
                        _add_bar(got2, keyword, i, total, slide)
                        prev_descs.append(f"Block {i+1}: photo of {query}")
                        src = f"pexels"
                    else:
                        # 3순위: 그라디언트
                        _gradient_slide(slide, keyword, i, total)
                        prev_descs.append(f"Block {i+1}: gradient background")
                        src = "gradient"

                logger.info(f"[V16] Block {i+1}/{total}: {src}")

                # 블록 간 3초 대기 (Gemini 무료 분당 20회 제한)
                if i < batch_end - 1:
                    await asyncio.sleep(3)

                # 이미지 → 클립
                clip = os.path.join(jd, f"clip_{i}.mp4")
                _img_to_clip(slide, clip, clip_dur, idx=i)
                if os.path.exists(clip): clips.append(clip)

            # ★ 배치 간 짧은 대기 (AI 과부하 방지)
            if batch_end < total:
                await asyncio.sleep(4)  # 배치 간 4초 대기 (Gemini 쿼터 리셋)

        # 클립 연결 — xfade 전환 효과 (프로 편집 느낌)
        bg = os.path.join(jd, "bg.mp4")
        if clips:
            if len(clips) == 1:
                shutil.copy2(clips[0], bg)
            else:
                # xfade 전환 — 슬라이드별 다른 효과
                transitions = [
                    "fadeblack",    # 검정 페이드
                    "slideleft",    # 왼쪽 슬라이드
                    "slideright",   # 오른쪽 슬라이드
                    "slideup",      # 위로 슬라이드
                    "circlecrop",   # 원형 전환
                    "fade",         # 크로스 페이드
                    "wipeleft",     # 왼쪽 와이프
                    "wiperight",    # 오른쪽 와이프
                    "smoothleft",   # 부드러운 왼쪽
                    "smoothright",  # 부드러운 오른쪽
                ]
                XFADE_DUR = 0.6  # 전환 0.6초

                try:
                    # FFmpeg xfade 체인 구성
                    inputs = []
                    for c in clips:
                        inputs.extend(["-i", c])

                    # xfade 필터 체인 — 2개씩 순차 연결
                    filter_parts = []
                    cur_label = "[0:v]"

                    # 각 클립 duration 가져오기
                    clip_durs = []
                    for c in clips:
                        d = _dur(c)
                        clip_durs.append(d if d > 0 else 5.0)

                    offset = clip_durs[0] - XFADE_DUR
                    for j in range(1, len(clips)):
                        trans = transitions[j % len(transitions)]
                        next_label = f"[v{j}]" if j < len(clips)-1 else "[vout]"
                        in_label = f"[{j}:v]"
                        filter_parts.append(
                            f"{cur_label}{in_label}xfade=transition={trans}:duration={XFADE_DUR}:offset={max(0,offset)}{next_label}")
                        offset += clip_durs[j] - XFADE_DUR
                        cur_label = next_label

                    filter_str = ";".join(filter_parts)
                    cmd = ["ffmpeg","-y"] + inputs + [
                        "-filter_complex", filter_str,
                        "-map", "[vout]",
                        "-c:v","libx264","-preset","medium","-crf","18",
                        "-pix_fmt","yuv420p","-movflags","+faststart",bg]
                    r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
                    if r.returncode == 0 and os.path.exists(bg):
                        logger.info(f"[V16] ✓ xfade transitions applied ({len(clips)-1} transitions)")
                    else:
                        raise Exception(f"xfade failed: {r.stderr[-200:]}")
                except Exception as e:
                    logger.warning(f"[V16] xfade failed, using simple concat: {e}")
                    # Fallback: 단순 concat
                    lf = os.path.join(jd, "clips.txt")
                    with open(lf,"w") as f:
                        for c in clips: f.write(f"file '{c}'\n")
                    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,
                        "-c:v","libx264","-preset","medium","-crf","18",
                        "-pix_fmt","yuv420p","-movflags","+faststart",bg],
                        capture_output=True, timeout=600)
        logger.info(f"[V16] Clips: {len(clips)}")

        # ── Step 4: HeyGen ──
        full = " ".join(b.get("text","") for b in script_blocks)
        avp = await _heygen(full, jd)
        has_av = bool(avp and os.path.exists(avp))
        if has_av:
            pip = os.path.join(jd, "bg_pip.mp4")
            if _avatar_pip(bg, avp, pip): bg = pip

        # ── Step 5: SRT ──
        srt = os.path.join(jd, "subs.srt")
        _srt(script_blocks, srt, pause, bdurs)

        # ── Step 6: BGM + 합성 ──
        vdur = adur + pause*total + 2
        bgm = os.path.join(jd, "bgm.m4a")
        _bgm(bgm, vdur, 0.04 if is_sr else 0.05)

        out = os.path.join(jd, f"creato_{job_id}_final.mp4")
        res = _compose(bg, audio, srt, out, bgm)

        if res and os.path.exists(res):
            fs = os.path.getsize(res); rd = _dur(res) or vdur
            logger.info(f"[V16] ✓ {fs/1024/1024:.1f}MB, {rd:.1f}s, {len(clips)} slides")
            return RealVideoResult(
                job_id=job_id, status="done", output_path=res,
                download_url=f"/api/v1/video/download/{job_id}",
                duration_sec=round(rd,1), file_size_bytes=fs,
                tts_audio_path=audio, subtitle_path=srt)

        return RealVideoResult(job_id=job_id, status="done", output_path=audio,
            download_url=f"/api/v1/video/download/{job_id}",
            duration_sec=round(adur,1), file_size_bytes=os.path.getsize(audio),
            tts_audio_path=audio)

    except Exception as e:
        logger.error(f"[V16] Failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))


def create_notebook_bg(path, keyword, category, blocks):
    _gradient_slide(path, keyword, 0, 1)
    return path

