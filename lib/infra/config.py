"""
Project Blackbox — 통합 설정 관리자
══════════════════════════════════════
모든 외부 API 키를 중앙 관리하고, YouTube OAuth 2.0 인증 흐름을 처리합니다.

환경변수 → Pydantic Settings → 각 모듈에서 import
"""
import os
import json
import logging
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 설정
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class BlackboxConfig:
    """환경변수 기반 전체 설정"""

    # Database
    database_url: str = ""

    # Redis
    redis_url: str = ""

    # Module A: Curation
    gemini_api_key: str = ""
    news_api_key: str = ""
    youtube_api_key: str = ""          # YouTube Data API v3 (검색/분석용)

    # Module B-2: Video
    elevenlabs_api_key: str = ""
    heygen_api_key: str = ""

    # Module D: YouTube Upload
    youtube_client_id: str = ""
    youtube_client_secret: str = ""
    youtube_redirect_uri: str = "http://localhost:8000/api/v1/auth/youtube/callback"

    # App
    app_env: str = "development"
    log_level: str = "INFO"
    output_dir: str = "/app/output"
    assets_dir: str = "/app/assets"
    bgm_path: str = "/app/assets/bgm/default.mp3"

    # YouTube quota
    youtube_daily_quota: int = 10000   # 기본 일일 할당량
    youtube_upload_cost: int = 1600    # 업로드 1회 비용
    max_uploads_per_day: int = 6       # 안전 마진 포함

    @classmethod
    def from_env(cls) -> "BlackboxConfig":
        return cls(
            database_url=os.getenv("DATABASE_URL", "postgresql+asyncpg://blackbox:blackbox@localhost:5432/blackbox"),
            redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
            news_api_key=os.getenv("NEWS_API_KEY", ""),
            youtube_api_key=os.getenv("YOUTUBE_API_KEY", ""),
            elevenlabs_api_key=os.getenv("ELEVENLABS_API_KEY", ""),
            heygen_api_key=os.getenv("HEYGEN_API_KEY", ""),
            youtube_client_id=os.getenv("YOUTUBE_CLIENT_ID", ""),
            youtube_client_secret=os.getenv("YOUTUBE_CLIENT_SECRET", ""),
            youtube_redirect_uri=os.getenv("YOUTUBE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/youtube/callback"),
            app_env=os.getenv("APP_ENV", "development"),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
            output_dir=os.getenv("OUTPUT_DIR", "/app/output"),
            assets_dir=os.getenv("ASSETS_DIR", "/app/assets"),
            bgm_path=os.getenv("BGM_PATH", "/app/assets/bgm/default.mp3"),
        )

    def validate(self) -> dict:
        """모든 API 키 설정 상태 검증"""
        checks = {
            "database": bool(self.database_url),
            "redis": bool(self.redis_url),
            "gemini": bool(self.gemini_api_key),
            "news_api": bool(self.news_api_key),
            "youtube_data": bool(self.youtube_api_key),
            "elevenlabs": bool(self.elevenlabs_api_key),
            "heygen": bool(self.heygen_api_key),
            "youtube_oauth": bool(self.youtube_client_id and self.youtube_client_secret),
        }
        missing = [k for k, v in checks.items() if not v]
        return {
            "all_configured": len(missing) == 0,
            "configured": {k: v for k, v in checks.items() if v},
            "missing": missing,
            "module_status": {
                "A_curation": checks["gemini"] and checks["news_api"] and checks["youtube_data"],
                "B_script": checks["gemini"],
                "B2_video": checks["elevenlabs"] and checks["heygen"],
                "C_shield": True,  # 외부 API 불필요
                "D_publish": checks["youtube_oauth"],
            },
        }


# 글로벌 싱글톤
_config: Optional[BlackboxConfig] = None

def get_config() -> BlackboxConfig:
    global _config
    if _config is None:
        _config = BlackboxConfig.from_env()
    return _config


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  YouTube OAuth 2.0
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUTUBE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token"
YOUTUBE_SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]


class YouTubeOAuth:
    """YouTube OAuth 2.0 인증 흐름 관리"""

    def __init__(self, config: BlackboxConfig = None):
        self.config = config or get_config()

    def get_auth_url(self, state: str = "") -> str:
        """1단계: 사용자를 Google 인증 페이지로 리다이렉트할 URL 생성"""
        params = {
            "client_id": self.config.youtube_client_id,
            "redirect_uri": self.config.youtube_redirect_uri,
            "response_type": "code",
            "scope": " ".join(YOUTUBE_SCOPES),
            "access_type": "offline",
            "prompt": "consent",
            "state": state,
        }
        query = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{YOUTUBE_AUTH_URL}?{query}"

    async def exchange_code(self, code: str) -> dict:
        """2단계: authorization code → access_token + refresh_token"""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.post(YOUTUBE_TOKEN_URL, data={
                    "client_id": self.config.youtube_client_id,
                    "client_secret": self.config.youtube_client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": self.config.youtube_redirect_uri,
                })
                resp.raise_for_status()
                tokens = resp.json()
                return {
                    "access_token": tokens["access_token"],
                    "refresh_token": tokens.get("refresh_token", ""),
                    "expires_in": tokens.get("expires_in", 3600),
                    "token_type": tokens.get("token_type", "Bearer"),
                    "obtained_at": datetime.now(timezone.utc).isoformat(),
                }
        except Exception as e:
            logger.error(f"YouTube OAuth exchange failed: {e}")
            return {"error": str(e)}

    async def refresh_token(self, refresh_token: str) -> dict:
        """3단계: refresh_token → 새 access_token"""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.post(YOUTUBE_TOKEN_URL, data={
                    "client_id": self.config.youtube_client_id,
                    "client_secret": self.config.youtube_client_secret,
                    "refresh_token": refresh_token,
                    "grant_type": "refresh_token",
                })
                resp.raise_for_status()
                tokens = resp.json()
                return {
                    "access_token": tokens["access_token"],
                    "expires_in": tokens.get("expires_in", 3600),
                    "refreshed_at": datetime.now(timezone.utc).isoformat(),
                }
        except Exception as e:
            logger.error(f"YouTube token refresh failed: {e}")
            return {"error": str(e)}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  YouTube Upload Client
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUTUBE_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"
YOUTUBE_THUMBNAILS_URL = "https://www.googleapis.com/youtube/v3/thumbnails/set"


@dataclass
class UploadResult:
    success: bool
    video_id: str = ""
    error: str = ""
    upload_url: str = ""


class YouTubeUploader:
    """YouTube 영상 업로드 + 메타데이터 설정 + 썸네일"""

    def __init__(self, access_token: str):
        self.token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"}

    async def upload_video(
        self,
        file_path: str,
        title: str,
        description: str,
        tags: list[str],
        category_id: str = "22",       # "People & Blogs"
        privacy: str = "private",       # 초기 업로드는 비공개
        scheduled_at: str = "",
    ) -> UploadResult:
        """
        영상 업로드 (resumable upload)

        1. 메타데이터로 업로드 세션 시작
        2. 파일 바이너리 전송
        3. 완료 후 video_id 반환
        """
        try:
            import httpx

            metadata = {
                "snippet": {
                    "title": title,
                    "description": description,
                    "tags": tags,
                    "categoryId": category_id,
                },
                "status": {
                    "privacyStatus": privacy,
                    "selfDeclaredMadeForKids": False,
                },
            }

            if scheduled_at and privacy == "private":
                metadata["status"]["privacyStatus"] = "private"
                metadata["status"]["publishAt"] = scheduled_at

            async with httpx.AsyncClient(timeout=600) as client:
                # Step 1: 업로드 세션 초기화
                init_resp = await client.post(
                    f"{YOUTUBE_UPLOAD_URL}?uploadType=resumable&part=snippet,status",
                    headers={
                        **self.headers,
                        "Content-Type": "application/json",
                    },
                    json=metadata,
                )
                init_resp.raise_for_status()
                upload_url = init_resp.headers.get("location", "")

                if not upload_url:
                    return UploadResult(success=False, error="No upload URL returned")

                # Step 2: 파일 전송
                file_size = os.path.getsize(file_path)
                with open(file_path, "rb") as f:
                    upload_resp = await client.put(
                        upload_url,
                        content=f.read(),
                        headers={
                            "Content-Type": "video/mp4",
                            "Content-Length": str(file_size),
                        },
                    )
                    upload_resp.raise_for_status()
                    result = upload_resp.json()

                video_id = result.get("id", "")
                logger.info(f"YouTube upload success: video_id={video_id}")

                return UploadResult(
                    success=True,
                    video_id=video_id,
                    upload_url=f"https://youtu.be/{video_id}",
                )

        except Exception as e:
            logger.error(f"YouTube upload failed: {e}")
            return UploadResult(success=False, error=str(e))

    async def set_thumbnail(self, video_id: str, image_path: str) -> bool:
        """썸네일 설정"""
        try:
            import httpx
            async with httpx.AsyncClient(timeout=60) as client:
                with open(image_path, "rb") as f:
                    resp = await client.post(
                        f"{YOUTUBE_THUMBNAILS_URL}?videoId={video_id}",
                        headers={
                            **self.headers,
                            "Content-Type": "image/png",
                        },
                        content=f.read(),
                    )
                    resp.raise_for_status()
                    return True
        except Exception as e:
            logger.error(f"Thumbnail set failed: {e}")
            return False

    async def update_privacy(self, video_id: str, privacy: str = "public") -> bool:
        """공개 상태 변경 (비공개 → 공개 전환)"""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.put(
                    f"{YOUTUBE_VIDEOS_URL}?part=status",
                    headers={**self.headers, "Content-Type": "application/json"},
                    json={
                        "id": video_id,
                        "status": {"privacyStatus": privacy},
                    },
                )
                resp.raise_for_status()
                return True
        except Exception as e:
            logger.error(f"Privacy update failed: {e}")
            return False


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  YouTube 일일 할당량 관리
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class QuotaManager:
    """
    YouTube Data API v3 일일 할당량 관리

    기본 10,000 units/일:
      - 업로드 1회 = 1,600 units
      - 검색 1회 = 100 units
      - 썸네일 = 50 units
      - 메타데이터 업데이트 = 50 units
    """

    def __init__(self, daily_limit: int = 10000):
        self.daily_limit = daily_limit
        self.used_today = 0
        self.last_reset = datetime.now(timezone.utc).date()

    def _check_reset(self):
        today = datetime.now(timezone.utc).date()
        if today > self.last_reset:
            self.used_today = 0
            self.last_reset = today

    def can_upload(self) -> bool:
        self._check_reset()
        return (self.used_today + 1600) <= self.daily_limit

    def can_search(self) -> bool:
        self._check_reset()
        return (self.used_today + 100) <= self.daily_limit

    def record_usage(self, units: int):
        self._check_reset()
        self.used_today += units
        logger.info(f"Quota used: {units}, total today: {self.used_today}/{self.daily_limit}")

    def get_status(self) -> dict:
        self._check_reset()
        remaining = self.daily_limit - self.used_today
        return {
            "daily_limit": self.daily_limit,
            "used_today": self.used_today,
            "remaining": remaining,
            "can_upload": self.can_upload(),
            "uploads_remaining": max(0, remaining // 1600),
            "searches_remaining": max(0, remaining // 100),
        }
