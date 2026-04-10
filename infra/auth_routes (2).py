"""
Project Blackbox — Auth & Config API
/api/v1/auth/* + /api/v1/config/*
"""
from fastapi import APIRouter, Query
from infra.config import get_config, YouTubeOAuth, QuotaManager

router = APIRouter(tags=["Auth & Config"])
_quota = QuotaManager()


# ── Config Status ──

@router.get("/api/v1/config/status")
async def config_status():
    """API 키 설정 상태 확인 — 어떤 모듈이 작동 가능한지 표시"""
    cfg = get_config()
    return cfg.validate()


@router.get("/api/v1/config/quota")
async def quota_status():
    """YouTube API 일일 할당량 현황"""
    return _quota.get_status()


# ── YouTube OAuth ──

@router.get("/api/v1/auth/youtube")
async def youtube_auth_start(channel_id: str = "default"):
    """YouTube OAuth 시작 — 사용자를 Google 인증 페이지로 리다이렉트"""
    oauth = YouTubeOAuth()
    url = oauth.get_auth_url(state=channel_id)
    return {"auth_url": url, "channel_id": channel_id}


@router.get("/api/v1/auth/youtube/callback")
async def youtube_auth_callback(code: str = "", state: str = "", error: str = ""):
    """Google에서 돌아온 callback — code를 token으로 교환"""
    if error:
        return {"error": error, "channel_id": state}

    oauth = YouTubeOAuth()
    tokens = await oauth.exchange_code(code)

    if "error" in tokens:
        return {"error": tokens["error"], "channel_id": state}

    # TODO: DB에 tokens 저장 (channel.oauth_token, channel.oauth_refresh_token)
    return {
        "success": True,
        "channel_id": state,
        "access_token_preview": tokens["access_token"][:20] + "...",
        "has_refresh_token": bool(tokens.get("refresh_token")),
        "expires_in": tokens.get("expires_in"),
    }


@router.post("/api/v1/auth/youtube/refresh")
async def youtube_refresh(refresh_token: str):
    """access_token 만료 시 갱신"""
    oauth = YouTubeOAuth()
    result = await oauth.refresh_token(refresh_token)
    return result
