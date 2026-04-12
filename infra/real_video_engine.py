"""
Creato — 영상 생성 엔진 v15
═══════════════════════════════════════
배경 전략:
  1순위: Gemini 2.0 Flash → 인포그래픽/차트/비교표/다이어그램 자료화면
  2순위: Pexels 실사 사진 (Gemini 실패 시)
  3순위: Pillow 그라디언트 (전부 실패 시)

자막: FFmpeg SRT 렌더링 (하단 표시, 배경과 분리)
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
    key = os.getenv("ELEVENLABS_API_KEY",""); est = len(text)/(4.5*speed)
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
                    "-t",str(d),"-c:a","aac","-b:a","128k",p], capture_output=True, timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2. Gemini 인포그래픽 자료화면 (1순위)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 블록 섹션별 시각화 유형
_VIS_TYPE = {
    "hook": "핵심 수치/통계를 큰 숫자로 강조한 타이틀 카드. 주제와 관련된 아이콘 3개 배치. 시선을 사로잡는 대비 구도.",
    "body": [
        "좌우 비교표 — 두 가지 옵션/시나리오를 나란히 비교. 각 항목에 아이콘+수치 포함. 컬러로 장단점 구분.",
        "막대/원형 차트 인포그래픽 — 핵심 데이터를 막대그래프나 도넛차트로 시각화. 수치 라벨 표시.",
        "타임라인 다이어그램 — 시간순 3~5단계 흐름. 연도/기간 표시. 각 단계에 아이콘과 한줄 설명.",
        "체크리스트 카드 — 핵심 포인트 4~5개를 체크 아이콘과 함께 카드형으로 정리. 중요도 색상 구분.",
        "프로세스 플로우 — 단계별 흐름을 화살표로 연결. 각 단계를 원형/사각형 노드로 표현. 순서 번호 포함.",
        "피라미드/계층 구조 — 상위에서 하위로 계층 표현. 각 층에 핵심 키워드와 아이콘.",
        "SWOT/매트릭스 — 2×2 격자로 4가지 관점 정리. 각 칸에 색상+아이콘+핵심 내용.",
    ],
    "opinion": "인용/강조 카드 — 핵심 메시지를 큰 따옴표와 함께 중앙 배치. 관련 통계 수치 1~2개 보조 표시.",
    "cta": "요약 카드 — 영상 핵심 내용 3줄 요약 + 관련 아이콘. 깔끔한 마무리 구도.",
}

async def _gemini_visual(keyword, text, idx, total, category, section, path):
    """Gemini로 인포그래픽 자료화면 이미지 생성"""
    key = os.getenv("GEMINI_API_KEY","").strip()
    if not key:
        logger.info("[Gemini] No API key")
        return ""

    # 시각화 유형 결정
    if section == "body":
        vis = _VIS_TYPE["body"][idx % len(_VIS_TYPE["body"])]
    else:
        vis = _VIS_TYPE.get(section, _VIS_TYPE["body"][0])

    # 블록 텍스트에서 핵심 데이터 추출 (Gemini에 전달)
    core = text[:200] if text else keyword

    prompt = (
        f"Create a professional Korean YouTube infographic visual.\n\n"
        f"TOPIC: {keyword}\n"
        f"CONTENT TO VISUALIZE:\n{core}\n\n"
        f"VISUAL TYPE: {vis}\n\n"
        f"DESIGN RULES:\n"
        f"- Use data visualization: charts, graphs, comparison tables, diagrams, flowcharts\n"
        f"- Include actual numbers/statistics extracted from the content\n"
        f"- Color scheme: white background with accent colors (mint #3ECDA5, blue #4A90D9, coral #E8735A, gold #D4A537)\n"
        f"- Flat design, clean layout, modern infographic style\n"
        f"- Korean text for labels and key points\n"
        f"- 16:9 aspect ratio (1920x1080)\n"
        f"- NO photos, NO realistic images — only vector-style graphics, icons, charts\n"
        f"- Professional quality like top Korean YouTube education channels\n"
        f"- Bottom 15% should be relatively empty (subtitle area)\n"
    )

    try:
        import httpx
        # gemini-2.0-flash-exp 이미지 생성
        async with httpx.AsyncClient(timeout=60) as c:
            r = await c.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
                params={"key": key},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"responseModalities": ["TEXT","IMAGE"]}
                })
            if r.status_code != 200:
                logger.warning(f"[Gemini] HTTP {r.status_code}: {r.text[:200]}")
                return ""
            data = r.json()
            for part in data.get("candidates",[{}])[0].get("content",{}).get("parts",[]):
                if "inlineData" in part:
                    img_data = part["inlineData"].get("data","")
                    if img_data:
                        with open(path, "wb") as f:
                            f.write(base64.b64decode(img_data))
                        sz = os.path.getsize(path)
                        logger.info(f"[Gemini] ✓ Block {idx} ({section}): {sz/1024:.0f}KB")
                        return path
            logger.warning(f"[Gemini] No image in response for block {idx}")
    except Exception as e:
        logger.warning(f"[Gemini] {e}")
    return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2b. Pexels 폴백 (2순위)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_KR_EN = {
    "주식":"stock market trading screen","부동산":"real estate city aerial",
    "투자":"investment growth chart","연금":"retirement pension elderly",
    "절세":"tax savings calculator","재테크":"financial planning wealth",
    "건강":"healthy lifestyle wellness","운동":"exercise fitness gym",
    "식단":"healthy food nutrition","수면":"sleeping bedroom peaceful",
    "AI":"artificial intelligence technology","인공지능":"AI robot futuristic",
    "코딩":"coding programming laptop","자기계발":"personal growth motivation",
    "독서":"reading books library","경제":"economy business analytics",
    "금융":"finance banking modern","반도체":"semiconductor chip factory",
    "전기차":"electric car charging","금리":"interest rate bank",
    "창업":"startup entrepreneur office","여행":"travel landscape beautiful",
}

_CAT_TERMS = {
    "economy":["finance analytics dashboard","stock market trading","business meeting boardroom",
               "bank modern architecture","economy growth graph","corporate office skyline",
               "digital payment technology","real estate aerial city"],
    "senior": ["elderly couple garden happy","retirement nature peaceful","medical checkup doctor",
               "healthy meal preparation","family generations together","wellness yoga exercise"],
    "selfdev":["reading book sunrise coffee","running fitness outdoor","productivity workspace clean",
               "meditation nature calm","mountain summit achievement","study library focused"],
    "tech":   ["artificial intelligence lab","coding developer screen","server datacenter modern",
               "smartphone technology future","robot automation factory","virtual reality innovation"],
    "life":   ["cooking gourmet kitchen","interior design modern","travel beach sunset tropical",
               "coffee cafe atmosphere","yoga wellness outdoor","garden botanical peaceful"],
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
            photo = random.choice(avail)
            _used_ids.add(photo.get("id"))
            url = (photo.get("src",{}).get("landscape","") or
                   photo.get("src",{}).get("large2x","") or
                   photo.get("src",{}).get("large",""))
            if not url: return ""
            img = await c.get(url)
            if img.status_code == 200:
                with open(save_path,"wb") as f: f.write(img.content)
                logger.info(f"[Pexels] ✓ '{query}'")
                return save_path
    except Exception as e:
        logger.warning(f"[Pexels] {e}")
    return ""

def _pexels_query(text, category, idx):
    for kr, en in _KR_EN.items():
        if kr in text: return en
    terms = _CAT_TERMS.get(category, _CAT_TERMS["tech"])
    return terms[idx % len(terms)]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2c. 슬라이드 후처리
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _add_bar(img_path, keyword, idx, total, out_path):
    """이미지 위 상단 키워드 바 + 하단 자막 그라디언트"""
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

    # 상단 바
    d.rectangle([0,0,1920,60], fill=(0,0,0,140))
    d.text((24,12), f"STEP {idx+1}/{total}", fill=(196,154,26), font=font(14))
    d.text((140,8), keyword, fill=(255,255,255,220), font=font(24))
    d.text((1780,14), "Creato", fill=(255,255,255,60), font=font(12))

    # 하단 그라디언트
    for y in range(960,1080):
        a = int((y-960)/120 * 190)
        d.rectangle([0,y,1920,y+1], fill=(0,0,0,a))

    img = Image.alpha_composite(img, ov)
    img.convert("RGB").save(out_path, "PNG", quality=95)
    return out_path

def _gradient_slide(path, keyword, idx, total):
    """최후 폴백: 그라디언트"""
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
        r=int(c1[0]+(c2[0]-c1[0])*y/1080)
        g=int(c1[1]+(c2[1]-c1[1])*y/1080)
        b=int(c1[2]+(c2[2]-c1[2])*y/1080)
        d.line([(0,y),(1920,y)], fill=(r,g,b))
    try:
        f=font(48); bbox=d.textbbox((0,0),keyword,font=f); tw=bbox[2]-bbox[0]
        d.text(((1920-tw)//2,480),keyword,fill=(196,154,26),font=f)
        d.text(((1920-180)//2,548),f"STEP {idx+1} / {total}",fill=(180,180,190),font=font(18))
    except: pass
    d.text((1750,1040),"Creato",fill=(100,100,110),font=font(14))
    img.save(path,"PNG",quality=95)
    return path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  3. HeyGen 아바타
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _heygen(full_text, jd):
    key = os.getenv("HEYGEN_API_KEY","").strip()
    if not key: return ""
    try:
        import httpx
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.get("https://api.heygen.com/v2/avatars",headers={"X-Api-Key":key})
            if r.status_code != 200: return ""
            avatars = r.json().get("data",{}).get("avatars",[])
            if not avatars: return ""
            aid = avatars[0].get("avatar_id","")

        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.post("https://api.heygen.com/v2/video/generate",
                headers={"X-Api-Key":key,"Content-Type":"application/json"},
                json={"video_inputs":[{
                    "character":{"type":"avatar","avatar_id":aid,"avatar_style":"normal"},
                    "voice":{"type":"text","input_text":full_text[:4900],"voice_id":"Korean_Female_1"},
                    "background":{"type":"color","value":"#00FF00"}
                }],"dimension":{"width":540,"height":960}})
            if r.status_code != 200: return ""
            vid = r.json().get("data",{}).get("video_id","")
            if not vid: return ""

        ap = os.path.join(jd,"avatar.mp4")
        async with httpx.AsyncClient(timeout=30) as c:
            for _ in range(60):
                await asyncio.sleep(10)
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
                elif d.get("status") == "failed": return ""
        return ""
    except Exception as e:
        logger.error(f"[HeyGen] {e}"); return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  4. FFmpeg 유틸
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _img_to_clip(img, out, dur, idx=0):
    frames = int(dur*24)
    zooms = [
        f"z='min(zoom+0.0003,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
        f"z='1.06':x='(iw-iw/zoom)*on/{frames}':y='ih/2-(ih/zoom/2)'",
        f"z='1.06':x='(iw-iw/zoom)*(1-on/{frames})':y='ih/2-(ih/zoom/2)'",
        f"z='1.08-on/{frames}*0.04':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    ]
    vf = (f"scale=2100:1181,zoompan={zooms[idx%4]}:d={frames}:s=1920x1080:fps=24,"
          f"fade=in:0:12,fade=out:st={max(0,dur-0.5)}:d=12")
    cmd = ["ffmpeg","-y","-loop","1","-i",img,"-vf",vf,"-t",str(dur),
           "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",
           "-movflags","+faststart",out]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=240)
        if r.returncode == 0 and os.path.exists(out): return out
    except: pass
    subprocess.run(["ffmpeg","-y","-loop","1","-i",img,"-t",str(dur),
        "-vf",f"scale=1920:1080,fade=in:0:8,fade=out:st={max(0,dur-0.4)}:d=8",
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
#  5. SRT 자막
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _chunk(t, mc=22):
    """자막 청크 분할 — 1줄 22자 이내, 자연스러운 끊김"""
    if len(t) <= mc: return [t]
    ch, cur = [], ""
    # 문장 단위 분리
    sentences = re.split(r'(?<=[.!?。]) ', t)
    for s in sentences:
        if len(cur)+len(s)+1 <= mc:
            cur = (cur+" "+s).strip()
        else:
            if cur: ch.append(cur)
            # 긴 문장은 조사/쉼표 기준 분할
            while len(s) > mc:
                cut = -1
                for sep in [', ','는 ','을 ','를 ','에 ','고 ','며 ','다. ','로 ','의 ','이 ','가 ']:
                    idx = s[:mc].rfind(sep)
                    if idx > 4:
                        cut = idx + len(sep) - 1
                        break
                if cut <= 0:
                    # 공백 기준
                    sp = s[:mc].rfind(' ')
                    cut = sp if sp > 4 else mc
                ch.append(s[:cut].strip())
                s = s[cut:].strip()
            cur = s
    if cur: ch.append(cur)
    return ch or [t[:mc]]

def _srt(blocks, path, pause=0.3, durs=None):
    lines, cur, idx = [], 0.0, 1
    for i, b in enumerate(blocks):
        bd = durs[i] if durs and i < len(durs) else len(b["text"])/4.5
        chs = _chunk(b["text"]); cd = bd/max(len(chs),1)
        for ch in chs:
            # 1줄만 (줄바꿈 없음)
            lines += [str(idx), f"{_ts(cur)} --> {_ts(cur+cd)}", ch.strip(), ""]
            cur += cd; idx += 1
        cur += pause
    with open(path, "w", encoding="utf-8") as f: f.write("\n".join(lines))
    return path

def _ts(s): return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  6. 최종 합성
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
    """최종: 배경 + TTS + SRT + BGM"""
    fp = _font()
    fn = "NanumGothicBold" if fp and "NanumGothicBold" in fp else "NanumGothic"

    # SRT 경로 이스케이프
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
    logger.warning("[Compose] fallback: no subtitles")
    subprocess.run(["ffmpeg","-y","-i",bg,"-i",audio,"-map","0:v","-map","1:a",
        "-c:v","libx264","-preset","fast","-crf","20",
        "-c:a","aac","-b:a","192k","-ac","2","-shortest",
        "-movflags","+faststart",output], capture_output=True, timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v15
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

        logger.info(f"[V15] Start: '{keyword}', {len(script_blocks)} blocks, mode={mode}")

        # ── Step 1: TTS ──
        audio, adur, bdurs = await _tts_all(script_blocks, jd, speed, voice)
        logger.info(f"[V15] TTS: {adur:.1f}s")

        # ── Step 2: 블록별 자료화면 생성 ──
        clips = []
        total = len(script_blocks)
        for i, (b, bd) in enumerate(zip(script_blocks, bdurs)):
            clip_dur = bd + pause
            text = b.get("text","")
            sec = b.get("section","body")
            slide = os.path.join(jd, f"slide_{i}.png")
            src = "none"

            # 1순위: Gemini 인포그래픽
            gem_path = os.path.join(jd, f"gem_{i}.png")
            got = await _gemini_visual(keyword, text, i, total, category, sec, gem_path)
            if got and os.path.exists(got):
                _add_bar(got, keyword, i, total, slide)
                src = "gemini"
            else:
                # 2순위: Pexels
                pex_path = os.path.join(jd, f"pex_{i}.jpg")
                query = _pexels_query(text, category, i)
                got2 = await _pexels(query, pex_path)
                if got2 and os.path.exists(got2):
                    _add_bar(got2, keyword, i, total, slide)
                    src = f"pexels({query})"
                else:
                    # 3순위: 그라디언트
                    _gradient_slide(slide, keyword, i, total)
                    src = "gradient"

            logger.info(f"[V15] Block {i}/{total}: {src}")

            # 이미지 → 클립
            clip = os.path.join(jd, f"clip_{i}.mp4")
            _img_to_clip(slide, clip, clip_dur, idx=i)
            if os.path.exists(clip):
                clips.append(clip)

        # 클립 연결
        bg = os.path.join(jd, "bg.mp4")
        if clips:
            lf = os.path.join(jd, "clips.txt")
            with open(lf,"w") as f:
                for c in clips: f.write(f"file '{c}'\n")
            subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,
                "-c:v","libx264","-preset","medium","-crf","18",
                "-pix_fmt","yuv420p","-movflags","+faststart",bg],
                capture_output=True, timeout=600)
        logger.info(f"[V15] Clips: {len(clips)}")

        # ── Step 3: HeyGen ──
        full = " ".join(b.get("text","") for b in script_blocks)
        avp = await _heygen(full, jd)
        has_av = bool(avp and os.path.exists(avp))
        logger.info(f"[V15] Avatar: {'OK' if has_av else 'Skip'}")

        if has_av:
            pip = os.path.join(jd, "bg_pip.mp4")
            if _avatar_pip(bg, avp, pip): bg = pip

        # ── Step 4: SRT ──
        srt = os.path.join(jd, "subs.srt")
        _srt(script_blocks, srt, pause, bdurs)

        # ── Step 5: BGM ──
        vdur = adur + pause*total + 2
        bgm = os.path.join(jd, "bgm.m4a")
        _bgm(bgm, vdur, 0.04 if is_sr else 0.05)

        # ── Step 6: 합성 ──
        out = os.path.join(jd, f"creato_{job_id}_final.mp4")
        res = _compose(bg, audio, srt, out, bgm)

        if res and os.path.exists(res):
            fs = os.path.getsize(res); rd = _dur(res) or vdur
            logger.info(f"[V15] ✓ {fs/1024/1024:.1f}MB, {rd:.1f}s")
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
        logger.error(f"[V15] Failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))


def create_notebook_bg(path, keyword, category, blocks):
    _gradient_slide(path, keyword, 0, 1)
    return path
