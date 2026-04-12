"""
Project Blackbox — 영상 생성 엔진 v12
═══════════════════════════════════════
- Gemini AI 일러스트 생성 (밝은 파스텔)
- 챕터 카드 (01, 02 번호 인포그래픽)
- 큰 타이포그래피, 밝은 색감
- CRF 18, 스테레오, 고비트레이트
- 채널 로고 워터마크
"""
import os, uuid, subprocess, logging, random, json, base64, re
from dataclasses import dataclass

logger = logging.getLogger(__name__)
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

@dataclass
class RealVideoResult:
    job_id: str; status: str; output_path: str = ""; download_url: str = ""
    duration_sec: float = 0.0; file_size_bytes: int = 0
    tts_audio_path: str = ""; subtitle_path: str = ""; error: str = ""

def _find_font():
    for p in ["/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf","/usr/share/fonts/truetype/nanum/NanumGothic.ttf","/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"]:
        if os.path.exists(p): return p
    return None

# ━━━ Gemini 일러스트 ━━━
async def _gemini_illust(keyword, text, idx, cat, path):
    key = os.getenv("GEMINI_API_KEY","").strip()
    if not key: return ""
    cat_style={"economy":"finance charts money professional","senior":"healthcare elderly warm nature","selfdev":"books growth productivity sunrise","tech":"technology AI circuits futuristic","life":"cooking travel home cozy nature"}
    style=cat_style.get(cat,"modern professional")
    first=text.split('.')[0][:80] if text else keyword
    prompt=(f"Create a bright clean infographic illustration for YouTube educational video. "
            f"Topic:'{keyword}' about:'{first}'. Style:bright pastel colors(mint,light blue,cream,soft yellow), "
            f"flat illustration with watercolor texture, Korean educational style. "
            f"Include icons related to {style}. 16:9 ratio, clean white space, professional. NO text. Light airy modern.")
    try:
        import httpx
        async with httpx.AsyncClient(timeout=60) as c:
            r=await c.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
                params={"key":key},json={"contents":[{"parts":[{"text":prompt}]}],"generationConfig":{"responseModalities":["TEXT","IMAGE"]}})
            if r.status_code!=200: logger.warning(f"[GeminiImg] {r.status_code}"); return ""
            for part in r.json().get("candidates",[{}])[0].get("content",{}).get("parts",[]):
                if "inlineData" in part:
                    d=part["inlineData"].get("data","")
                    if d:
                        with open(path,"wb") as f: f.write(base64.b64decode(d))
                        logger.info(f"[GeminiImg] Block {idx} OK"); return path
    except Exception as e: logger.warning(f"[GeminiImg] {e}")
    return ""

# ━━━ Pexels 폴백 ━━━
CAT_SEARCH={"economy":["finance chart clean","business modern","money investment"],"senior":["elderly happy","healthy food bright","family warm"],"selfdev":["reading book morning","productivity desk","sunrise mountain"],"tech":["technology modern","AI futuristic","coding laptop"],"life":["cooking bright","travel landscape","home interior"]}
_used=set()
async def _pexels(query,path):
    key=os.getenv("PEXELS_API_KEY","").strip()
    if not key: return ""
    try:
        import httpx
        async with httpx.AsyncClient(timeout=15) as c:
            r=await c.get("https://api.pexels.com/v1/search",headers={"Authorization":key},params={"query":query,"per_page":10,"orientation":"landscape"})
            if r.status_code!=200: return ""
            photos=r.json().get("photos",[])
            avail=[p for p in photos if p.get("id") not in _used]
            if not avail: avail=photos
            if not avail: return ""
            photo=random.choice(avail); _used.add(photo.get("id"))
            url=photo.get("src",{}).get("landscape","") or photo.get("src",{}).get("large","")
            if not url: return ""
            img=await c.get(url)
            if img.status_code==200:
                with open(path,"wb") as f: f.write(img.content)
                return path
    except Exception as e: logger.warning(f"[Pexels] {e}")
    return ""

# ━━━ 챕터 카드 ━━━
def _chapter_card(path,num,title,keyword):
    try:
        from PIL import Image,ImageDraw,ImageFont
    except: return ""
    fp=_find_font(); W,H=1920,1080
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp,sz)
        except: return ImageFont.load_default()
    img=Image.new("RGB",(W,H),(245,248,250)); d=ImageDraw.Draw(img)
    colors=[(230,245,240),(240,248,255),(255,250,240),(245,240,250),(240,255,245)]
    bg=colors[num%len(colors)]
    for y in range(H):
        r=int(bg[0]+(248-bg[0])*y/H); g=int(bg[1]+(250-bg[1])*y/H); b=int(bg[2]+(252-bg[2])*y/H)
        d.line([(0,y),(W,y)],fill=(r,g,b))
    nt=f"{num:02d}"
    bbox=d.textbbox((0,0),nt,font=font(200)); tw=bbox[2]-bbox[0]
    d.text(((W-tw)//2,H//2-180),nt,fill=(60,180,160),font=font(200))
    d.rectangle([W//2-200,H//2+40,W//2+200,H//2+44],fill=(60,180,160))
    bbox2=d.textbbox((0,0),title,font=font(44)); tw2=bbox2[2]-bbox2[0]
    d.text(((W-tw2)//2,H//2+70),title,fill=(40,50,60),font=font(44))
    d.text((W-280,H-40),"Creato",fill=(180,190,200),font=font(16))
    img.save(path,"PNG"); return path

# ━━━ 밝은 슬라이드 ━━━
def _bright_slide(path,bg_path,keyword,text,idx,total,cat,section):
    try:
        from PIL import Image,ImageDraw,ImageFont
    except: return ""
    fp=_find_font(); W,H=1920,1080
    def font(sz):
        if not fp: return ImageFont.load_default()
        try: return ImageFont.truetype(fp,sz)
        except: return ImageFont.load_default()
    if bg_path and os.path.exists(bg_path):
        bg=Image.open(bg_path).convert("RGB").resize((W,H),Image.LANCZOS)
    else:
        bg=Image.new("RGB",(W,H),(245,248,250)); dd=ImageDraw.Draw(bg)
        palette=[(230,245,242),(240,245,255),(255,248,240),(242,240,252)]
        c=palette[idx%len(palette)]
        for y in range(H):
            r=int(c[0]+(250-c[0])*y/H); g=int(c[1]+(252-c[1])*y/H); b=int(c[2]+(254-c[2])*y/H)
            dd.line([(0,y),(W,y)],fill=(r,g,b))
    d=ImageDraw.Draw(bg)
    # 상단 악센트
    d.rectangle([0,0,W,5],fill=(60,180,160))
    # 좌상단 블록 번호
    d.rounded_rectangle([40,25,120,80],radius=10,fill=(60,180,160))
    d.text((52,28),f"{idx+1:02d}",fill=(255,255,255),font=font(34))
    # 워터마크
    d.text((W-280,H-40),"Creato",fill=(180,190,200),font=font(16))
    bg.save(path,"PNG"); return path

# ━━━ 이미지→영상 ━━━
def _i2v(img,out,dur,idx=0):
    frames=int(dur*24)
    zooms=[f"z='min(zoom+0.0004,1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
           f"z='1.08':x='(iw-iw/zoom)*on/{frames}':y='ih/2-(ih/zoom/2)'",
           f"z='1.08':x='(iw-iw/zoom)*(1-on/{frames})':y='ih/2-(ih/zoom/2)'",
           f"z='1.10-on/{frames}*0.06':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"]
    vf=f"scale=2100:1181,zoompan={zooms[idx%4]}:d={frames}:s=1920x1080:fps=24,fade=in:0:18,fade=out:st={max(0,dur-0.7)}:d=16"
    cmd=["ffmpeg","-y","-loop","1","-i",img,"-vf",vf,"-t",str(dur),"-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart",out]
    try:
        r=subprocess.run(cmd,capture_output=True,timeout=240)
        if r.returncode==0 and os.path.exists(out): return out
    except: pass
    subprocess.run(["ffmpeg","-y","-loop","1","-i",img,"-t",str(dur),"-c:v","libx264","-preset","fast","-crf","20","-pix_fmt","yuv420p",out],capture_output=True,timeout=120)
    return out if os.path.exists(out) else ""

# ━━━ TTS ━━━
def _gdur(p):
    try:
        r=subprocess.run(["ffprobe","-v","quiet","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",p],capture_output=True,text=True,timeout=10)
        if r.returncode==0 and r.stdout.strip(): return float(r.stdout.strip())
    except: pass
    return 0.0

async def _tts1(text,path,speed=1.0):
    key=os.getenv("ELEVENLABS_API_KEY",""); est=len(text)/(4.5*speed)
    if not key: _sil(path,est); return path,est
    try:
        import httpx
        async with httpx.AsyncClient(timeout=120) as c:
            r=await c.post("https://api.elevenlabs.io/v1/text-to-speech/jBpfuIE2acCO8z3wKNLl",
                headers={"xi-api-key":key,"Content-Type":"application/json"},
                json={"text":text,"model_id":"eleven_multilingual_v2","voice_settings":{"stability":0.55,"similarity_boost":0.82,"style":0.15,"use_speaker_boost":True,"speed":speed}})
            r.raise_for_status()
            with open(path,"wb") as f: f.write(r.content)
            d=_gdur(path); return path,d if d>0 else est
    except Exception as e: logger.error(f"TTS:{e}"); _sil(path,est); return path,est

async def _tts_all(blocks,jd,speed=1.0):
    durs,paths=[],[]
    for i,b in enumerate(blocks):
        p=os.path.join(jd,f"tts_{i}.mp3"); _,d=await _tts1(b["text"],p,speed); paths.append(p); durs.append(d)
    comb=os.path.join(jd,"tts.mp3")
    if len(paths)==1: os.rename(paths[0],comb)
    else:
        lf=os.path.join(jd,"tts_list.txt")
        with open(lf,"w") as f:
            for p in paths: f.write(f"file '{p}'\n")
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,"-c:a","copy",comb],capture_output=True,timeout=120)
    st=os.path.join(jd,"tts_st.mp3")
    subprocess.run(["ffmpeg","-y","-i",comb,"-ac","2","-c:a","libmp3lame","-b:a","192k",st],capture_output=True,timeout=60)
    if os.path.exists(st): os.replace(st,comb)
    t=_gdur(comb); return comb,(t if t>0 else sum(durs)),durs

def _sil(p,d):
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"anullsrc=r=44100:cl=stereo","-t",str(d),"-c:a","aac","-b:a","128k",p],capture_output=True,timeout=30)

# ━━━ SRT ━━━
def _split_srt(t,mc=30):
    if len(t)<=mc: return[t]
    ch,cur=[],""
    for s in re.split(r'(?<=[.!?]) ',t):
        if len(cur)+len(s)+1<=mc: cur=(cur+" "+s).strip()
        else:
            if cur: ch.append(cur)
            while len(s)>mc: c=mc;ch.append(s[:c].strip());s=s[c:].strip()
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

def _srt(blocks,path,pause=0.3,durs=None):
    lines,cur,idx=[],0.0,1
    for i,b in enumerate(blocks):
        bd=durs[i] if durs and i<len(durs) else b.get("duration_sec",len(b["text"])/4.5)
        chs=_split_srt(b["text"]); cd=bd/max(len(chs),1)
        for ch in chs:
            lines+=[str(idx),f"{_ts(cur)} --> {_ts(cur+cd)}",_wrap(ch),""]
            cur+=cd;idx+=1
        cur+=pause
    with open(path,"w",encoding="utf-8") as f: f.write("\n".join(lines))
    return path

def _ts(s): return f"{int(s//3600):02d}:{int((s%3600)//60):02d}:{int(s%60):02d},{int((s%1)*1000):03d}"

# ━━━ BGM + 합성 ━━━
def _bgm(path,dur,vol=0.06):
    cmd=["ffmpeg","-y","-f","lavfi","-i",f"sine=frequency=160:duration={dur},tremolo=f=0.15:d=0.3,lowpass=f=2000,volume={vol*0.6}[a1];sine=frequency=240:duration={dur},tremolo=f=0.1:d=0.2,lowpass=f=1800,volume={vol*0.4}[a2];[a1][a2]amix=inputs=2:duration=first","-ac","2","-c:a","aac","-b:a","128k",path]
    try:
        r=subprocess.run(cmd,capture_output=True,timeout=60)
        if r.returncode==0 and os.path.exists(path): return path
    except: pass
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"sine=frequency=180:duration={dur},volume={vol}","-ac","2","-c:a","aac",path],capture_output=True,timeout=60)
    return path if os.path.exists(path) else ""

def _comp(bg,audio,srt,out,bgm=""):
    ss=("FontSize=24,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,BackColour=&HBBFFFFFF,BorderStyle=4,Outline=2,Shadow=1,MarginV=50,MarginL=100,MarginR=100,Alignment=2,Fontname=NanumGothicBold")
    vf=f"subtitles={srt}:force_style='{ss}'"
    if bgm and os.path.exists(bgm):
        cmd=["ffmpeg","-y","-i",bg,"-i",audio,"-i",bgm,"-filter_complex","[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3[aout]","-vf",vf,"-map","0:v","-map","[aout]","-c:v","libx264","-preset","medium","-crf","18","-c:a","aac","-b:a","192k","-ac","2","-shortest","-movflags","+faststart",out]
    else:
        cmd=["ffmpeg","-y","-i",bg,"-i",audio,"-vf",vf,"-map","0:v","-map","1:a","-c:v","libx264","-preset","medium","-crf","18","-c:a","aac","-b:a","192k","-ac","2","-shortest","-movflags","+faststart",out]
    try:
        r=subprocess.run(cmd,capture_output=True,text=True,timeout=600)
        if r.returncode==0 and os.path.exists(out): return out
    except: pass
    subprocess.run(["ffmpeg","-y","-i",bg,"-i",audio,"-map","0:v","-map","1:a","-c:v","libx264","-preset","fast","-crf","20","-c:a","aac","-b:a","192k","-ac","2","-shortest",out],capture_output=True,timeout=300)
    return out if os.path.exists(out) else ""

# ━━━ 메인 v12 ━━━
async def generate_real_video(keyword,category,script_blocks,mode="normal"):
    global _used; _used=set()
    job_id=str(uuid.uuid4())[:8]; jd=os.path.join(OUTPUT_DIR,job_id); os.makedirs(jd,exist_ok=True)
    try:
        is_sr=mode=="senior"; speed=0.92 if is_sr else 1.0; bvol=0.04 if is_sr else 0.06; pause=0.5 if is_sr else 0.3
        logger.info(f"[V12] Start:'{keyword}',{len(script_blocks)} blocks,mode={mode}")
        audio,adur,bdurs=await _tts_all(script_blocks,jd,speed)
        vdur=adur+pause*len(script_blocks)+2
        logger.info(f"[V12] TTS:{adur:.1f}s")

        clips=[]; total=len(script_blocks); chnum=0
        for i,(b,bd) in enumerate(zip(script_blocks,bdurs)):
            sec=b.get("section","body"); cdur=bd+pause
            # 챕터 카드
            if sec=="body" and 0<chnum<=8:
                cp=os.path.join(jd,f"ch_{chnum}.png")
                hl=b.get("subtitle_highlight","") or f"핵심 {chnum}"
                _chapter_card(cp,chnum,hl,keyword)
                if os.path.exists(cp):
                    cc=os.path.join(jd,f"chclip_{chnum}.mp4")
                    _i2v(cp,cc,2.5,idx=chnum)
                    if os.path.exists(cc): clips.append(cc)

            sl=os.path.join(jd,f"sl_{i}.png"); cl=os.path.join(jd,f"cl_{i}.mp4")
            bgp=os.path.join(jd,f"bg_{i}.png")
            ok=await _gemini_illust(keyword,b.get("text",""),i,category,bgp)
            if not ok:
                bgj=os.path.join(jd,f"bg_{i}.jpg")
                terms=CAT_SEARCH.get(category,CAT_SEARCH["tech"])
                ok=await _pexels(terms[i%len(terms)],bgj)
                if ok: bgp=bgj
                else: bgp=""
            _bright_slide(sl,bgp,keyword,b.get("text",""),i,total,category,sec)
            if os.path.exists(sl): _i2v(sl,cl,cdur,idx=i)
            else:
                subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"color=c=0xF5F8FA:s=1920x1080:d={cdur}:r=24","-c:v","libx264","-preset","fast","-crf","18","-pix_fmt","yuv420p",cl],capture_output=True,timeout=60)
            if os.path.exists(cl): clips.append(cl)
            if sec=="body": chnum+=1

        bgv=os.path.join(jd,"bg.mp4")
        if clips:
            lf=os.path.join(jd,"clips.txt")
            with open(lf,"w") as f:
                for c in clips: f.write(f"file '{c}'\n")
            subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf,"-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart",bgv],capture_output=True,timeout=600)
        if not os.path.exists(bgv):
            subprocess.run(["ffmpeg","-y","-f","lavfi","-i",f"color=c=0xF5F8FA:s=1920x1080:d={vdur}:r=24","-c:v","libx264","-pix_fmt","yuv420p",bgv],capture_output=True,timeout=60)

        sr=os.path.join(jd,"subs.srt"); _srt(script_blocks,sr,pause,bdurs)
        bm=os.path.join(jd,"bgm.m4a"); _bgm(bm,vdur,bvol)
        out=os.path.join(jd,f"blackbox_{job_id}_final.mp4")
        res=_comp(bgv,audio,sr,out,bm)
        if res and os.path.exists(res):
            fs=os.path.getsize(res); rd=_gdur(res) or vdur
            logger.info(f"[V12] ✓ {fs/1024/1024:.1f}MB,{rd:.1f}s,{len(clips)} clips")
            return RealVideoResult(job_id=job_id,status="done",output_path=res,download_url=f"/api/v1/video/download/{job_id}",duration_sec=round(rd,1),file_size_bytes=fs,tts_audio_path=audio,subtitle_path=sr)
        return RealVideoResult(job_id=job_id,status="done",output_path=audio,download_url=f"/api/v1/video/download/{job_id}",duration_sec=round(adur,1),file_size_bytes=os.path.getsize(audio),tts_audio_path=audio)
    except Exception as e:
        logger.error(f"[V12] Failed:{e}"); return RealVideoResult(job_id=job_id,status="error",error=str(e))

def create_notebook_bg(path,keyword,category,blocks):
    try:
        from PIL import Image,ImageDraw,ImageFont
    except: return ""
    fp=_find_font()
    if not fp: return ""
    img=Image.new("RGB",(1920,1080),(245,248,250)); d=ImageDraw.Draw(img)
    try:
        f=ImageFont.truetype(fp,40); bbox=d.textbbox((0,0),keyword,font=f); tw=bbox[2]-bbox[0]
        d.text(((1920-tw)//2,515),keyword,fill=(60,180,160),font=f)
    except: pass
    img.save(path,"PNG"); return path
