"""
Creato — 영상 생성 엔진 v13
═══════════════════════════════════════
파이프라인:
1. ElevenLabs TTS → 블록별 음성 (타이밍 확보)
2. Gemini → 블록별 인포그래픽 자료화면 생성
3. HeyGen → 아바타 립싱크 영상 생성
4. FFmpeg → 자료화면 배경 + 아바타 PIP 합성
"""
import os, uuid, subprocess, logging, random, json, base64, re, asyncio
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
    for p in ["/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf","/usr/share/fonts/truetype/nanum/NanumGothic.ttf"]:
        if os.path.exists(p): return p
    return None

def _dur(p):
    try:
        r=subprocess.run(["ffprobe","-v","quiet","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",p],capture_output=True,text=True,timeout=10)
        if r.returncode==0 and r.stdout.strip(): return float(r.stdout.strip())
    except: pass
    return 0.0


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  1. TTS (ElevenLabs)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _tts_block(text, path, voice_id="jBpfuIE2acCO8z3wKNLl", speed=1.0):
    key=os.getenv("ELEVENLABS_API_KEY",""); est=len(text)/(4.5*speed)
    if not key: _silent(path,est); return path,est
    try:
        import httpx
        async with httpx.AsyncClient(timeout=120) as c:
            r=await c.post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={"xi-api-key":key,"Content-Type":"application/json"},
                json={"text":text,"model_id":"eleven_multilingual_v2",
                      "voice_settings":{"stability":0.55,"similarity_boost":0.82,"style":0.15,"use_speaker_boost":True,"speed":speed}})
            r.raise_for_status()
            with open(path,"wb") as f: f.write(r.content)
            d=_dur(path); return path,d if d>0 else est
    except Exception as e:
        logger.error(f"[TTS] {e}"); _silent(path,est); return path,est

async def _tts_all(blocks, jd, speed=1.0, voice_id="jBpfuIE2acCO8z3wKNLl"):
    durs,paths=[],[]
    for i,b in enumerate(blocks):
        p=os.path.join(jd,f"tts_{i}.mp3")
        _,d=await _tts_block(b["text"],p,voice_id,speed)
        paths.append(p); durs.append(d)
    comb=os.path.join(jd,"tts_full.mp3")
    if len(paths)==1: 
        import shutil; shutil.copy2(paths[0],comb)
    else:
        lf=os.path.join(jd,"tts_list.txt")
        with open(lf,"w") as f:
            for p in paths: f.write(f"file '{p}'\n")
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,"-c:a","copy",comb],capture_output=True,timeout=120)
    # stereo
    st=os.path.join(jd,"tts_stereo.mp3")
    subprocess.run(["ffmpeg","-y","-i",comb,"-ac","2","-c:a","libmp3lame","-b:a","192k",st],capture_output=True,timeout=60)
    if os.path.exists(st): os.replace(st,comb)
    t=_dur(comb); return comb,(t if t>0 else sum(durs)),durs

def _silent(p,d):
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"anullsrc=r=44100:cl=stereo","-t",str(d),"-c:a","aac","-b:a","128k",p],capture_output=True,timeout=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2. Gemini 인포그래픽 자료화면
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _gemini_infographic(keyword, text, idx, total, category, section, path):
    """블록 내용에 맞는 인포그래픽/차트/비교표 자료화면 생성"""
    key=os.getenv("GEMINI_API_KEY","").strip()
    if not key: return ""

    layout_types = {
        "hook": "타이틀 카드 — 큰 제목 텍스트 중앙, 주제 관련 아이콘 배치, 임팩트 있는 구도",
        "body": [
            "비교표 레이아웃 — 좌우 대비 구조, 핵심 포인트를 아이콘과 함께 정리",
            "인포그래픽 — 숫자/통계를 시각화, 막대그래프나 원형차트 포함",
            "타임라인 — 시간순 흐름을 보여주는 가로 타임라인 구조",
            "체크리스트 — 핵심 포인트 3~5개를 체크 아이콘과 함께 정리",
            "프로세스 다이어그램 — 단계별 흐름을 화살표로 연결",
        ],
        "opinion": "인용 카드 — 큰 따옴표 아이콘, 핵심 메시지를 강조 박스에",
        "cta": "구독 유도 카드 — 구독/좋아요 아이콘, 밝고 긍정적인 분위기",
    }

    if section == "body":
        layout = layout_types["body"][idx % len(layout_types["body"])]
    else:
        layout = layout_types.get(section, layout_types["body"][0])

    # 텍스트에서 핵심 내용 추출
    core = text[:150] if text else keyword

    prompt = (
        f"Create a Korean YouTube educational infographic slide. "
        f"Content: '{core}'. "
        f"Layout: {layout}. "
        f"Style: bright pastel colors (mint #E0F5F0, cream #FFF8E8, light blue #E8F0FF), "
        f"flat design with subtle watercolor texture, rounded corners on all elements, "
        f"professional Korean infographic style like popular Korean YouTube channels. "
        f"Include relevant Korean text labels for key points from the content. "
        f"16:9 aspect ratio. Clean white background with colored accent cards. "
        f"Modern, professional, easy to read. "
        f"IMPORTANT: Leave the right 25% of the image relatively empty (for avatar overlay)."
    )

    try:
        import httpx
        async with httpx.AsyncClient(timeout=60) as c:
            r=await c.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
                params={"key":key},json={"contents":[{"parts":[{"text":prompt}]}],
                "generationConfig":{"responseModalities":["TEXT","IMAGE"]}})
            if r.status_code!=200:
                logger.warning(f"[GeminiImg] HTTP {r.status_code}")
                return ""
            for part in r.json().get("candidates",[{}])[0].get("content",{}).get("parts",[]):
                if "inlineData" in part:
                    d=part["inlineData"].get("data","")
                    if d:
                        with open(path,"wb") as f: f.write(base64.b64decode(d))
                        logger.info(f"[GeminiImg] Block {idx} OK ({section})")
                        return path
    except Exception as e:
        logger.warning(f"[GeminiImg] {e}")
    return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  2b. Pillow 폴백 자료화면
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _pillow_slide(path, keyword, text, idx, total, section):
    """Gemini 실패 시 Pillow로 기본 자료화면"""
    try:
        from PIL import Image,ImageDraw,ImageFont
    except: return ""
    fp=_font(); W,H=1920,1080
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp,sz)
        except: return ImageFont.load_default()

    # 밝은 배경
    palette=[(230,245,242),(240,245,255),(255,248,240),(242,240,252),(240,255,245)]
    bg_c=palette[idx%len(palette)]
    img=Image.new("RGB",(W,H),(250,252,254))
    d=ImageDraw.Draw(img)
    for y in range(H):
        r=int(bg_c[0]+(252-bg_c[0])*y/H)
        g=int(bg_c[1]+(254-bg_c[1])*y/H)
        b=int(bg_c[2]+(255-bg_c[2])*y/H)
        d.line([(0,y),(W,y)],fill=(r,g,b))

    # 상단 악센트 바
    d.rectangle([0,0,W,5],fill=(60,180,160))

    # 블록 번호 배지
    d.rounded_rectangle([60,40,140,95],radius=12,fill=(60,180,160))
    d.text((72,45),f"{idx+1:02d}",fill=(255,255,255),font=font(32))

    # 핵심 텍스트 (좌측 75% 영역에 배치)
    content_w = int(W * 0.70)
    lines = []
    cur = ""
    for ch in (text[:120] if text else keyword):
        cur += ch
        if len(cur) >= 28:
            lines.append(cur); cur = ""
    if cur: lines.append(cur)

    y_start = H//2 - len(lines)*35
    for i,line in enumerate(lines[:6]):
        d.text((80, y_start + i*70), line, fill=(40,50,60), font=font(36))

    # 워터마크
    d.text((W-200,H-40),"Creato",fill=(200,205,210),font=font(14))

    img.save(path,"PNG",quality=95)
    return path


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  3. HeyGen 아바타 영상 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _heygen_avatar(full_text, job_dir):
    """HeyGen API로 아바타 립싱크 영상 생성 (green screen)"""
    key=os.getenv("HEYGEN_API_KEY","").strip()
    if not key:
        logger.warning("[HeyGen] No API key")
        return ""

    try:
        import httpx

        # 1. 사용 가능한 아바타 목록 조회
        async with httpx.AsyncClient(timeout=30) as c:
            r=await c.get("https://api.heygen.com/v2/avatars",headers={"X-Api-Key":key})
            if r.status_code!=200:
                logger.error(f"[HeyGen] List avatars failed: {r.status_code} {r.text[:200]}")
                return ""
            avatars=r.json().get("data",{}).get("avatars",[])
            if not avatars:
                logger.error("[HeyGen] No avatars available")
                return ""
            # 첫 번째 아바타 사용
            avatar_id=avatars[0].get("avatar_id","")
            logger.info(f"[HeyGen] Using avatar: {avatar_id} ({avatars[0].get('avatar_name','')})")

        # 2. 영상 생성 요청 (transparent background)
        # 텍스트를 5000자 이내로 제한
        script_text = full_text[:4900]

        async with httpx.AsyncClient(timeout=30) as c:
            payload = {
                "video_inputs": [{
                    "character": {
                        "type": "avatar",
                        "avatar_id": avatar_id,
                        "avatar_style": "normal"
                    },
                    "voice": {
                        "type": "text",
                        "input_text": script_text,
                        "voice_id": "a]Korean_Female_1"  # HeyGen 기본 한국어 여성
                    },
                    "background": {
                        "type": "color",
                        "value": "#00FF00"  # green screen
                    }
                }],
                "dimension": {"width": 540, "height": 960},  # 세로 (PIP용)
            }
            r=await c.post("https://api.heygen.com/v2/video/generate",
                headers={"X-Api-Key":key,"Content-Type":"application/json"},
                json=payload)
            if r.status_code!=200:
                logger.error(f"[HeyGen] Generate failed: {r.status_code} {r.text[:300]}")
                return ""
            video_id=r.json().get("data",{}).get("video_id","")
            if not video_id:
                logger.error(f"[HeyGen] No video_id: {r.text[:300]}")
                return ""
            logger.info(f"[HeyGen] Video requested: {video_id}")

        # 3. 상태 폴링 (최대 10분)
        avatar_path=os.path.join(job_dir,"avatar.mp4")
        async with httpx.AsyncClient(timeout=30) as c:
            for _ in range(60):  # 60 * 10초 = 10분
                await asyncio.sleep(10)
                r=await c.get(f"https://api.heygen.com/v1/video_status.get?video_id={video_id}",
                    headers={"X-Api-Key":key})
                if r.status_code!=200: continue
                data=r.json().get("data",{})
                status=data.get("status","")
                if status=="completed":
                    video_url=data.get("video_url","")
                    if video_url:
                        dl=await c.get(video_url)
                        if dl.status_code==200:
                            with open(avatar_path,"wb") as f: f.write(dl.content)
                            logger.info(f"[HeyGen] Avatar video downloaded: {os.path.getsize(avatar_path)/1024:.0f}KB")
                            return avatar_path
                elif status=="failed":
                    logger.error(f"[HeyGen] Failed: {data.get('error','')}")
                    return ""
                else:
                    logger.info(f"[HeyGen] Status: {status}")

        logger.error("[HeyGen] Timeout")
        return ""

    except Exception as e:
        logger.error(f"[HeyGen] Error: {e}")
        return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  4. FFmpeg 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _img_to_clip(img, out, dur, idx=0):
    """이미지 → 줌/패닝 클립"""
    frames=int(dur*24)
    zooms=[
        f"z='min(zoom+0.0003,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
        f"z='1.06':x='(iw-iw/zoom)*on/{frames}':y='ih/2-(ih/zoom/2)'",
        f"z='1.06':x='(iw-iw/zoom)*(1-on/{frames})':y='ih/2-(ih/zoom/2)'",
        f"z='1.08-on/{frames}*0.04':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    ]
    vf=f"scale=2100:1181,zoompan={zooms[idx%4]}:d={frames}:s=1920x1080:fps=24,fade=in:0:12,fade=out:st={max(0,dur-0.5)}:d=12"
    cmd=["ffmpeg","-y","-loop","1","-i",img,"-vf",vf,"-t",str(dur),
         "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",out]
    try:
        subprocess.run(cmd,capture_output=True,timeout=240)
        if os.path.exists(out): return out
    except: pass
    # fallback
    subprocess.run(["ffmpeg","-y","-loop","1","-i",img,"-t",str(dur),
        "-vf",f"scale=1920:1080,fade=in:0:8,fade=out:st={max(0,dur-0.4)}:d=8",
        "-c:v","libx264","-preset","fast","-crf","20","-pix_fmt","yuv420p",out],
        capture_output=True,timeout=120)
    return out if os.path.exists(out) else ""

def _overlay_avatar(bg_video, avatar_video, output):
    """배경 영상 위에 아바타 PIP 합성 (우하단)"""
    # avatar를 우하단에 작게 오버레이 (green screen 크로마키)
    vf = (
        "[1:v]scale=320:-1,chromakey=0x00FF00:0.3:0.1[avatar];"
        "[0:v][avatar]overlay=W-w-40:H-h-40:shortest=1[out]"
    )
    cmd=["ffmpeg","-y","-i",bg_video,"-i",avatar_video,
         "-filter_complex",vf,"-map","[out]","-map","0:a?",
         "-c:v","libx264","-preset","medium","-crf","18",
         "-c:a","aac","-b:a","192k","-ac","2",
         "-shortest","-movflags","+faststart",output]
    try:
        r=subprocess.run(cmd,capture_output=True,text=True,timeout=600)
        if r.returncode==0 and os.path.exists(output):
            logger.info(f"[Overlay] Avatar PIP applied")
            return output
        logger.warning(f"[Overlay] Failed: {r.stderr[-200:]}")
    except Exception as e:
        logger.warning(f"[Overlay] {e}")
    return ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SRT 자막
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _split_srt(t,mc=30):
    if len(t)<=mc: return[t]
    ch,cur=[],""
    for s in re.split(r'(?<=[.!?]) ',t):
        if len(cur)+len(s)+1<=mc: cur=(cur+" "+s).strip()
        else:
            if cur: ch.append(cur)
            while len(s)>mc: ch.append(s[:mc].strip());s=s[mc:].strip()
            cur=s
    if cur: ch.append(cur)
    return ch or[t[:mc]]

def _wrap(t,mc=28):
    if len(t)<=mc: return t
    mid=len(t)//2; best=mid
    for o in range(min(12,mid)):
        for p in[mid+o,mid-o]:
            if 0<p<len(t) and t[p] in ' ,는을를이가에서도로의': best=p+1;break
        else: continue
        break
    return t[:best].strip()+"\\N"+t[best:].strip()

def _gen_srt(blocks,path,pause=0.3,durs=None):
    lines,cur,idx=[],0.0,1
    for i,b in enumerate(blocks):
        bd=durs[i] if durs and i<len(durs) else len(b["text"])/4.5
        chs=_split_srt(b["text"]); cd=bd/max(len(chs),1)
        for ch in chs:
            lines+=[str(idx),f"{_ts(cur)} --> {_ts(cur+cd)}",_wrap(ch),""]
            cur+=cd;idx+=1
        cur+=pause
    with open(path,"w",encoding="utf-8") as f: f.write("\n".join(lines))
    return path

def _ts(s): return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  BGM + 최종 합성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _bgm(path,dur,vol=0.05):
    cmd=["ffmpeg","-y","-f","lavfi","-i",
         f"sine=frequency=160:duration={dur},tremolo=f=0.12:d=0.25,lowpass=f=1800,volume={vol*0.6}[a1];"
         f"sine=frequency=240:duration={dur},tremolo=f=0.08:d=0.2,lowpass=f=1600,volume={vol*0.4}[a2];"
         f"[a1][a2]amix=inputs=2:duration=first",
         "-ac","2","-c:a","aac","-b:a","128k",path]
    try:
        subprocess.run(cmd,capture_output=True,timeout=60)
        if os.path.exists(path): return path
    except: pass
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"sine=frequency=180:duration={dur},volume={vol}",
                    "-ac","2","-c:a","aac",path],capture_output=True,timeout=60)
    return path if os.path.exists(path) else ""

def _final_compose(bg, audio, srt, output, bgm_path=""):
    """최종 합성: 배경 + TTS + 자막 + BGM"""
    ss="FontSize=24,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,BackColour=&HBBFFFFFF,BorderStyle=4,Outline=2,Shadow=1,MarginV=50,MarginL=100,MarginR=700,Alignment=2,Fontname=NanumGothicBold"
    vf=f"subtitles={srt}:force_style='{ss}'"
    if bgm_path and os.path.exists(bgm_path):
        cmd=["ffmpeg","-y","-i",bg,"-i",audio,"-i",bgm_path,
             "-filter_complex","[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
             "-vf",vf,"-map","0:v","-map","[aout]",
             "-c:v","libx264","-preset","medium","-crf","18",
             "-c:a","aac","-b:a","192k","-ac","2",
             "-shortest","-movflags","+faststart",output]
    else:
        cmd=["ffmpeg","-y","-i",bg,"-i",audio,
             "-vf",vf,"-map","0:v","-map","1:a",
             "-c:v","libx264","-preset","medium","-crf","18",
             "-c:a","aac","-b:a","192k","-ac","2",
             "-shortest","-movflags","+faststart",output]
    try:
        r=subprocess.run(cmd,capture_output=True,text=True,timeout=600)
        if r.returncode==0 and os.path.exists(output): return output
    except: pass
    # fallback without srt
    subprocess.run(["ffmpeg","-y","-i",bg,"-i",audio,"-map","0:v","-map","1:a",
        "-c:v","libx264","-preset","fast","-crf","20",
        "-c:a","aac","-b:a","192k","-ac","2","-shortest",output],
        capture_output=True,timeout=300)
    return output if os.path.exists(output) else ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  메인 파이프라인 v13
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def generate_real_video(keyword, category, script_blocks, mode="normal",
                               channel_name="", watermark_text="", tts_voice_id=""):
    job_id=str(uuid.uuid4())[:8]
    jd=os.path.join(OUTPUT_DIR,job_id); os.makedirs(jd,exist_ok=True)

    try:
        is_sr=mode=="senior"
        speed=0.92 if is_sr else 1.0
        pause=0.5 if is_sr else 0.3
        voice=tts_voice_id or "jBpfuIE2acCO8z3wKNLl"

        logger.info(f"[V13] Start: '{keyword}', {len(script_blocks)} blocks, mode={mode}")

        # ── Step 1: TTS (타이밍 확보) ──
        audio, adur, bdurs = await _tts_all(script_blocks, jd, speed, voice)
        logger.info(f"[V13] TTS done: {adur:.1f}s")

        # ── Step 2: Gemini 인포그래픽 + 클립 생성 (병렬) ──
        clips = []
        total = len(script_blocks)
        for i,(b,bd) in enumerate(zip(script_blocks,bdurs)):
            sec = b.get("section","body")
            clip_dur = bd + pause

            # 인포그래픽 이미지 생성
            img_path = os.path.join(jd, f"info_{i}.png")
            ok = await _gemini_infographic(keyword, b.get("text",""), i, total, category, sec, img_path)
            if not ok:
                _pillow_slide(img_path, keyword, b.get("text",""), i, total, sec)

            # 이미지 → 클립
            if os.path.exists(img_path):
                clip = os.path.join(jd, f"clip_{i}.mp4")
                _img_to_clip(img_path, clip, clip_dur, idx=i)
                if os.path.exists(clip):
                    clips.append(clip)
            else:
                # 빈 색상 클립
                clip = os.path.join(jd, f"clip_{i}.mp4")
                subprocess.run(["ffmpeg","-y","-f","lavfi","-i",
                    f"color=c=0xF5F8FA:s=1920x1080:d={clip_dur}:r=24",
                    "-c:v","libx264","-preset","fast","-crf","18","-pix_fmt","yuv420p",clip],
                    capture_output=True,timeout=60)
                if os.path.exists(clip): clips.append(clip)

        # 클립 연결
        bg_video = os.path.join(jd, "bg.mp4")
        if clips:
            lf = os.path.join(jd, "clips.txt")
            with open(lf,"w") as f:
                for c in clips: f.write(f"file '{c}'\n")
            subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,
                "-c:v","libx264","-preset","medium","-crf","18",
                "-pix_fmt","yuv420p","-movflags","+faststart",bg_video],
                capture_output=True,timeout=600)
        logger.info(f"[V13] Background: {len(clips)} clips")

        # ── Step 3: HeyGen 아바타 (병렬로 요청했어야 하지만 순차 실행) ──
        full_text = " ".join(b.get("text","") for b in script_blocks)
        avatar_path = await _heygen_avatar(full_text, jd)
        has_avatar = bool(avatar_path and os.path.exists(avatar_path))
        logger.info(f"[V13] Avatar: {'OK' if has_avatar else 'Skip'}")

        # ── Step 4: 아바타 PIP 오버레이 ──
        if has_avatar:
            pip_video = os.path.join(jd, "bg_pip.mp4")
            result = _overlay_avatar(bg_video, avatar_path, pip_video)
            if result:
                bg_video = pip_video

        # ── Step 5: SRT 자막 ──
        srt = os.path.join(jd, "subs.srt")
        _gen_srt(script_blocks, srt, pause, bdurs)

        # ── Step 6: BGM ──
        vdur = adur + pause * len(script_blocks) + 2
        bgm = os.path.join(jd, "bgm.m4a")
        _bgm(bgm, vdur, 0.04 if is_sr else 0.05)

        # ── Step 7: 최종 합성 ──
        out = os.path.join(jd, f"creato_{job_id}_final.mp4")
        res = _final_compose(bg_video, audio, srt, out, bgm)

        if res and os.path.exists(res):
            fs = os.path.getsize(res); rd = _dur(res) or vdur
            logger.info(f"[V13] ✓ Done: {fs/1024/1024:.1f}MB, {rd:.1f}s, avatar={'yes' if has_avatar else 'no'}")
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
        logger.error(f"[V13] Failed: {e}")
        return RealVideoResult(job_id=job_id, status="error", error=str(e))


# 호환성
def create_notebook_bg(path, keyword, category, blocks):
    try:
        from PIL import Image,ImageDraw,ImageFont
    except: return ""
    fp=_font()
    if not fp: return ""
    img=Image.new("RGB",(1920,1080),(245,248,250)); d=ImageDraw.Draw(img)
    try:
        f=ImageFont.truetype(fp,40); bbox=d.textbbox((0,0),keyword,font=f); tw=bbox[2]-bbox[0]
        d.text(((1920-tw)//2,515),keyword,fill=(60,180,160),font=f)
    except: pass
    img.save(path,"PNG"); return path
