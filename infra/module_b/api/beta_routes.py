"""
AlgoMaker Beta Backend API
FastAPI · Gemini + 네이버 뉴스 + ElevenLabs TTS 실제 연동
"""

import os
import json
import hashlib
from typing import Optional
from datetime import datetime

import httpx
from fastapi import APIRouter, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# ═══════════════════════════════════════════════
# 환경변수 로드
# ═══════════════════════════════════════════════

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID", "")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

router = APIRouter(prefix="/api", tags=["beta"])

# ═══════════════════════════════════════════════
# 요청/응답 스키마
# ═══════════════════════════════════════════════

class KeywordRequest(BaseModel):
    category: str  # '경제' | '건강' | '자기계발' | 'IT' | '라이프'
    senior_mode: bool = False

class NewsRequest(BaseModel):
    keyword: str
    limit: int = 6

class ScriptRequest(BaseModel):
    keyword: str
    category: str
    news_summaries: Optional[list] = None  # 뉴스 기반 대본
    senior_mode: bool = False

class SeoRequest(BaseModel):
    keyword: str
    category: str
    senior_mode: bool = False

class TtsRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None  # 한국어 음성 ID
    senior_mode: bool = False

# ═══════════════════════════════════════════════
# Auth (Supabase JWT 간단 검증)
# ═══════════════════════════════════════════════

async def get_user_id(authorization: Optional[str] = Header(None)) -> str:
    """
    Supabase JWT 토큰에서 user_id 추출
    Beta는 간단하게 구현 — 정식 서비스에선 pyjwt로 검증 필수
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="인증이 필요합니다")

    token = authorization.replace("Bearer ", "")
    # JWT payload 추출 (검증은 Supabase가 이미 한 상태라 가정)
    try:
        import base64
        parts = token.split(".")
        if len(parts) < 2:
            raise ValueError("invalid token")
        payload_b64 = parts[1] + "=" * (-len(parts[1]) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("no sub")
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"토큰 해석 실패: {e}")

# ═══════════════════════════════════════════════
# 1. 키워드 발굴 — Gemini
# ═══════════════════════════════════════════════

@router.post("/keyword-analyze")
async def keyword_analyze(req: KeywordRequest):
    """
    카테고리 기반 블루오션 키워드 추천
    Gemini API로 최신 트렌드 키워드 8개 생성
    """
    if not GEMINI_API_KEY:
        return JSONResponse(
            status_code=503,
            content={"error": "Gemini API 키 미설정", "fallback": True}
        )

    prompt = f"""한국 YouTube 시청자를 위한 "{req.category}" 카테고리의 블루오션 키워드 8개를 추천해줘.

조건:
- 월 검색량 5,000~30,000회 수준
- 경쟁 영상이 적으면서 CPM이 높은 키워드
{'- 50~70대 시니어 시청자에 특화된 키워드' if req.senior_mode else ''}

정확히 다음 JSON 형식으로만 응답해 (설명 없이):
{{
  "keywords": [
    {{
      "keyword": "키워드",
      "boi": 4.5,
      "boiGrade": "A+",
      "searchVol": 12000,
      "competition": 3200,
      "difficulty": "낮음",
      "cpm": 18,
      "momentum": 0.28,
      "trend": "급상승",
      "estRev": 6500
    }}
  ]
}}
"""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.8,
                        "maxOutputTokens": 2048,
                        "responseMimeType": "application/json",
                    }
                }
            )
            if resp.status_code != 200:
                return JSONResponse(
                    status_code=resp.status_code,
                    content={"error": f"Gemini 호출 실패: {resp.text[:200]}", "fallback": True}
                )
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            return {"ok": True, "data": parsed, "source": "gemini"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"키워드 생성 오류: {str(e)}", "fallback": True}
        )

# ═══════════════════════════════════════════════
# 2. 뉴스 수집 — 네이버 검색 API
# ═══════════════════════════════════════════════

@router.post("/news")
async def news_search(req: NewsRequest):
    """
    키워드 기반 네이버 뉴스 검색
    """
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        return JSONResponse(
            status_code=503,
            content={"error": "네이버 API 키 미설정", "fallback": True}
        )

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://openapi.naver.com/v1/search/news.json",
                headers={
                    "X-Naver-Client-Id": NAVER_CLIENT_ID,
                    "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
                },
                params={
                    "query": req.keyword,
                    "display": req.limit,
                    "sort": "sim",  # 정확도순
                }
            )
            if resp.status_code != 200:
                return JSONResponse(
                    status_code=resp.status_code,
                    content={"error": f"네이버 뉴스 오류: {resp.text[:200]}", "fallback": True}
                )
            data = resp.json()

            # 뉴스 정리
            items = []
            for i, item in enumerate(data.get("items", [])):
                # HTML 태그 제거
                import re
                title = re.sub(r"<[^>]+>", "", item.get("title", "")).replace("&quot;", '"').replace("&amp;", "&")
                desc = re.sub(r"<[^>]+>", "", item.get("description", "")).replace("&quot;", '"').replace("&amp;", "&")

                items.append({
                    "id": f"n{i+1}",
                    "title": title,
                    "summary": desc,
                    "source": extract_domain(item.get("originallink", "")),
                    "credibility": "높음",
                    "relevance": max(0.5, 0.95 - i * 0.05),
                    "cpmTier": "High" if i < 2 else "Mid",
                    "publishedAt": format_pub_date(item.get("pubDate", "")),
                    "url": item.get("link", ""),
                    "keyFacts": [],
                })

            return {"ok": True, "data": {"news": items}, "source": "naver"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"뉴스 검색 오류: {str(e)}", "fallback": True}
        )


def extract_domain(url: str) -> str:
    """URL에서 언론사 도메인 추출"""
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).netloc
        # news.xxx.co.kr -> xxx
        parts = domain.replace("www.", "").split(".")
        return parts[0].upper() if parts else "뉴스"
    except:
        return "뉴스"


def format_pub_date(pub_date: str) -> str:
    """Wed, 15 Nov 2023 14:30:00 +0900 → '어제' / 'N일 전' """
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(pub_date)
        now = datetime.now(dt.tzinfo)
        delta = (now - dt).days
        if delta == 0:
            return "오늘"
        elif delta == 1:
            return "어제"
        else:
            return f"{delta}일 전"
    except:
        return "최근"

# ═══════════════════════════════════════════════
# 3. 대본 생성 — Gemini (뉴스 기반)
# ═══════════════════════════════════════════════

@router.post("/script")
async def generate_script(req: ScriptRequest):
    """
    키워드 + 뉴스 기반으로 6블록 대본 생성
    """
    if not GEMINI_API_KEY:
        return JSONResponse(
            status_code=503,
            content={"error": "Gemini API 키 미설정", "fallback": True}
        )

    news_context = ""
    if req.news_summaries:
        news_context = "\n\n참고할 뉴스:\n"
        for i, n in enumerate(req.news_summaries[:4]):
            news_context += f"- {n.get('title', '')}: {n.get('summary', '')[:150]}\n"

    senior_note = ""
    if req.senior_mode:
        senior_note = """
시니어(50~70대) 시청자용:
- 어려운 용어엔 괄호로 해설 추가 (예: "급등(갑자기 오름)")
- 문장은 짧고 명확하게
- 천천히 읽는 호흡 반영"""

    prompt = f"""당신은 한국 유튜브 롱폼(10분) 대본 작가입니다.
키워드: "{req.keyword}"
카테고리: {req.category}
{senior_note}
{news_context}

위 내용을 바탕으로 정확히 6개 블록의 대본을 JSON으로 생성하세요.
각 블록은 한국어, 구어체, 유튜버 톤.

반드시 아래 JSON 형식으로만 응답 (설명·마크다운 없이 순수 JSON):
{{
  "scriptBlocks": [
    {{"id": "b1", "section": "hook", "sectionLabel": "오프닝", "text": "...", "duration": 28}},
    {{"id": "b2", "section": "body", "sectionLabel": "본문·배경", "text": "...", "duration": 95}},
    {{"id": "b3", "section": "body", "sectionLabel": "본문·단서", "text": "...", "duration": 120}},
    {{"id": "b4", "section": "body", "sectionLabel": "본문·함정", "text": "...", "duration": 110}},
    {{"id": "b5", "section": "opinion", "sectionLabel": "의견", "text": "...", "duration": 90}},
    {{"id": "b6", "section": "cta", "sectionLabel": "마무리", "text": "...", "duration": 35}}
  ],
  "headline": "제목 (YouTube SEO 2026: 키워드 전진배치 + 숫자 + 괄호 패턴)",
  "dek": "부제목 (한 문장)",
  "hook": "후킹 문장 (첫 5초용)"
}}

대본은 각 블록 80~200자 정도, 전체 500~1000자. 실제 뉴스 내용을 자연스럽게 녹여내세요."""

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.85,
                        "maxOutputTokens": 4096,
                        "responseMimeType": "application/json",
                    }
                }
            )
            if resp.status_code != 200:
                return JSONResponse(
                    status_code=resp.status_code,
                    content={"error": f"Gemini 호출 실패: {resp.text[:200]}", "fallback": True}
                )
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            return {"ok": True, "data": parsed, "source": "gemini"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"대본 생성 오류: {str(e)}", "fallback": True}
        )

# ═══════════════════════════════════════════════
# 4. SEO 메타데이터 생성 — Gemini
# ═══════════════════════════════════════════════

@router.post("/seo")
async def generate_seo(req: SeoRequest):
    """
    YouTube SEO 2026 최적화 메타데이터 생성
    """
    if not GEMINI_API_KEY:
        return JSONResponse(
            status_code=503,
            content={"error": "Gemini API 키 미설정", "fallback": True}
        )

    senior_note = " (50-70대 시니어 타겟)" if req.senior_mode else ""

    prompt = f"""당신은 YouTube SEO 2026 전문가입니다. 다음 영상의 SEO를 최적화하세요.

키워드: "{req.keyword}"
카테고리: {req.category}{senior_note}

YouTube SEO 2026 규칙:
- 제목 60자 이하
- 주 키워드를 앞 40자에 배치
- 숫자 포함 (3, 5, 7이 효과적)
- 괄호 패턴 `(...)` 또는 `[...]`  (CTR 상승)
- 설명란 200자+, 첫 줄에 키워드
- 태그 10~12개 (주키워드 + 연관 + 고CPM)
- 썸네일 텍스트는 4단어 이내

반드시 아래 JSON 형식만 (설명·마크다운 없이):
{{
  "seoTitle": "메인 제목",
  "seoTitleAlt": "대안 제목 (A/B 테스트용)",
  "thumbnail": "썸네일 텍스트 (줄바꿈은 \\n)",
  "thumbnailAlt": "대안 썸네일 텍스트",
  "description": "설명란 (200자+, 여러 줄)",
  "tags": ["태그1", "태그2", ..., "태그12"]
}}"""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.75,
                        "maxOutputTokens": 2048,
                        "responseMimeType": "application/json",
                    }
                }
            )
            if resp.status_code != 200:
                return JSONResponse(
                    status_code=resp.status_code,
                    content={"error": f"Gemini SEO 오류: {resp.text[:200]}", "fallback": True}
                )
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            return {"ok": True, "data": parsed, "source": "gemini"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"SEO 생성 오류: {str(e)}", "fallback": True}
        )

# ═══════════════════════════════════════════════
# 5. TTS — ElevenLabs (실패 시 Edge TTS fallback)
# ═══════════════════════════════════════════════

ELEVENLABS_VOICE_KR_M = "onwK4e9ZLuTAKqWW03F9"  # Daniel (영어이지만 다국어 지원)
ELEVENLABS_VOICE_KR_F = "EXAVITQu4vr4xnSDxMaL"  # Sarah

@router.post("/tts")
async def generate_tts(req: TtsRequest):
    """
    텍스트를 음성으로 변환
    1순위: ElevenLabs (유료 플랜)
    2순위: Edge TTS (무료 무제한)
    """
    # ElevenLabs 먼저 시도
    if ELEVENLABS_API_KEY:
        voice_id = req.voice_id or ELEVENLABS_VOICE_KR_F
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                    headers={
                        "xi-api-key": ELEVENLABS_API_KEY,
                        "Content-Type": "application/json",
                    },
                    json={
                        "text": req.text[:500],  # 글자수 제한
                        "model_id": "eleven_multilingual_v2",
                        "voice_settings": {
                            "stability": 0.5,
                            "similarity_boost": 0.75,
                            "speed": 0.85 if req.senior_mode else 1.0,
                        }
                    }
                )
                if resp.status_code == 200:
                    import base64
                    audio_b64 = base64.b64encode(resp.content).decode()
                    return {
                        "ok": True,
                        "audio_base64": audio_b64,
                        "format": "mp3",
                        "source": "elevenlabs",
                    }
                else:
                    # 실패 시 Edge TTS로
                    print(f"ElevenLabs 실패: {resp.status_code}, Edge TTS fallback")
        except Exception as e:
            print(f"ElevenLabs 오류: {e}")

    # Edge TTS fallback
    try:
        import edge_tts
        voice = "ko-KR-SunHiNeural" if not req.senior_mode else "ko-KR-BongJinNeural"
        rate = "-15%" if req.senior_mode else "+0%"

        communicate = edge_tts.Communicate(req.text[:1000], voice, rate=rate)
        audio_bytes = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_bytes += chunk["data"]

        import base64
        audio_b64 = base64.b64encode(audio_bytes).decode()
        return {
            "ok": True,
            "audio_base64": audio_b64,
            "format": "mp3",
            "source": "edge-tts",
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"TTS 전체 실패: {str(e)}", "fallback": True}
        )

# ═══════════════════════════════════════════════
# 6. 프로젝트 저장 (인증 필요)
# ═══════════════════════════════════════════════

class ProjectSaveRequest(BaseModel):
    keyword: str
    category: str
    title: Optional[str] = None
    headline: Optional[str] = None
    dek: Optional[str] = None
    script_blocks: Optional[list] = None
    news_items: Optional[list] = None
    seo_data: Optional[dict] = None
    senior_mode: bool = False

@router.post("/project/save")
async def save_project(
    req: ProjectSaveRequest,
    user_id: str = Depends(get_user_id)
):
    """
    사용자 프로젝트를 Supabase에 저장
    """
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return {"ok": False, "error": "Supabase 미설정"}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                f"{SUPABASE_URL}/rest/v1/projects",
                headers={
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                },
                json={
                    "user_id": user_id,
                    "keyword": req.keyword,
                    "category": req.category,
                    "title": req.title,
                    "headline": req.headline,
                    "dek": req.dek,
                    "script_blocks": req.script_blocks,
                    "news_items": req.news_items,
                    "seo_data": req.seo_data,
                    "senior_mode": req.senior_mode,
                }
            )
            if resp.status_code in (200, 201):
                return {"ok": True, "data": resp.json()}
            return {"ok": False, "error": resp.text[:200]}
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ═══════════════════════════════════════════════
# Health Check
# ═══════════════════════════════════════════════

@router.get("/health")
async def health():
    return {
        "ok": True,
        "keys_configured": {
            "gemini": bool(GEMINI_API_KEY),
            "naver": bool(NAVER_CLIENT_ID and NAVER_CLIENT_SECRET),
            "elevenlabs": bool(ELEVENLABS_API_KEY),
            "supabase": bool(SUPABASE_URL and SUPABASE_ANON_KEY),
        }
    }
