"""
Project Blackbox — Module D: FastAPI 엔드포인트
/api/v1/publish/* 라우터
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from module_d.core.publisher import (
    AlgoSyncPublisher, check_algo_sync, generate_seo_metadata,
    recommend_upload_time, generate_thumbnail_variants,
    SyncStatus,
)

router = APIRouter(prefix="/api/v1/publish", tags=["Module D: Algo-Sync Publisher"])

_publisher = AlgoSyncPublisher()


class PublishRequest(BaseModel):
    channel_id: str
    video_path: str
    keyword: str
    category: str
    hours_since_last_upload: Optional[float] = None
    news_title: str = ""
    opinion_tone: str = ""


@router.post("/prepare")
async def prepare_publish(req: PublishRequest):
    """배포 준비 — Algo-Sync + SEO + 스케줄 + 썸네일"""
    last = None
    if req.hours_since_last_upload is not None:
        last = datetime.utcnow() - timedelta(hours=req.hours_since_last_upload)

    result = _publisher.prepare_publish(
        channel_id=req.channel_id, video_path=req.video_path,
        keyword=req.keyword, category=req.category,
        last_upload_at=last, news_title=req.news_title,
    )

    return {
        "publish_mode": result.publish_mode,
        "algo_sync": {
            "status": result.algo_sync.status.value,
            "sync_progress": result.algo_sync.sync_progress,
            "hours_elapsed": result.algo_sync.hours_elapsed,
            "hours_remaining": result.algo_sync.hours_remaining,
            "can_auto_upload": result.algo_sync.can_auto_upload,
            "can_download": result.algo_sync.can_download,
            "message": result.algo_sync.message,
        },
        "seo": {
            "titles": result.seo.titles,
            "description": result.seo.description,
            "hashtags": result.seo.hashtags,
            "disclaimer": result.seo.disclaimer,
        },
        "schedule": {
            "recommended_time": result.schedule.recommended_time,
            "reason": result.schedule.reason,
            "best_days": result.schedule.best_days,
        },
        "thumbnails": [
            {"id": t.id, "style": t.style, "headline": t.headline, "color_scheme": t.color_scheme}
            for t in result.thumbnails
        ],
    }


@router.get("/algo-sync/check")
async def algo_sync_check(
    channel_id: str,
    hours_since_last: Optional[float] = Query(default=None),
):
    """Algo-Sync 상태 단독 조회"""
    last = None
    if hours_since_last is not None:
        last = datetime.utcnow() - timedelta(hours=hours_since_last)
    r = check_algo_sync(channel_id, last)
    return {
        "status": r.status.value, "sync_progress": r.sync_progress,
        "can_auto_upload": r.can_auto_upload, "can_download": r.can_download,
        "hours_remaining": r.hours_remaining, "message": r.message,
    }


@router.get("/seo/generate")
async def seo_generate(keyword: str, category: str = "economy"):
    """SEO 메타데이터 단독 생성"""
    seo = generate_seo_metadata(keyword, category)
    return {"titles": seo.titles, "hashtags": seo.hashtags, "description": seo.description, "disclaimer": seo.disclaimer}


@router.get("/schedule/recommend")
async def schedule_recommend(category: str = "economy"):
    """프라임 타임 추천"""
    s = recommend_upload_time(category)
    return {"recommended_time": s.recommended_time, "reason": s.reason, "best_days": s.best_days}
