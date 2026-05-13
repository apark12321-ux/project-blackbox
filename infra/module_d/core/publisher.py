"""
Project Blackbox — Module D: Algo-Sync 배포 시스템
═══════════════════════════════════════════════════
Gemini 기반 SEO 제목 생성
실제 키워드 분석 기반 해시태그
구체적 스케줄 추천
"""
import os
import random
import hashlib
import json
import logging
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

try:
    import httpx
except ImportError:
    httpx = None

logger = logging.getLogger(__name__)


ALGO_SYNC_THRESHOLD_HOURS = 24

class SyncStatus(str, Enum):
    SYNCED = "synced"
    SYNCING = "syncing"
    SAFEGUARD = "safeguard"


@dataclass
class AlgoSyncResult:
    status: SyncStatus
    channel_id: str
    sync_progress: float
    last_upload_at: Optional[datetime]
    hours_elapsed: float
    hours_remaining: float
    can_auto_upload: bool
    can_download: bool
    message: str


def check_algo_sync(channel_id: str, last_upload_at: Optional[datetime] = None) -> AlgoSyncResult:
    now = datetime.utcnow()

    if last_upload_at is None:
        return AlgoSyncResult(
            status=SyncStatus.SYNCED, channel_id=channel_id,
            sync_progress=100.0, last_upload_at=None,
            hours_elapsed=999, hours_remaining=0,
            can_auto_upload=True, can_download=True,
            message="알고리즘 동기화 완료. 최적의 타이밍에 배포 가능합니다.",
        )

    elapsed = (now - last_upload_at).total_seconds() / 3600
    remaining = max(0, ALGO_SYNC_THRESHOLD_HOURS - elapsed)
    progress = min(100, (elapsed / ALGO_SYNC_THRESHOLD_HOURS) * 100)

    if elapsed >= ALGO_SYNC_THRESHOLD_HOURS:
        return AlgoSyncResult(
            status=SyncStatus.SYNCED, channel_id=channel_id,
            sync_progress=100.0, last_upload_at=last_upload_at,
            hours_elapsed=round(elapsed, 1), hours_remaining=0,
            can_auto_upload=True, can_download=True,
            message="알고리즘 동기화 완료. 알고리즘 신뢰도가 최고 수치입니다.",
        )
    else:
        return AlgoSyncResult(
            status=SyncStatus.SAFEGUARD, channel_id=channel_id,
            sync_progress=round(progress, 1), last_upload_at=last_upload_at,
            hours_elapsed=round(elapsed, 1), hours_remaining=round(remaining, 1),
            can_auto_upload=False, can_download=True,
            message=f"채널 세이프가드 활성. 동기화 {progress:.0f}% ({remaining:.1f}시간 후 완료 예정)",
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SEO — Gemini 기반 제목 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class SEOMetadata:
    titles: list[str]
    description: str
    hashtags: list[str]
    tags: list[str]
    disclaimer: str


DISCLAIMER_TEMPLATES = [
    "이 영상은 AI 기술을 활용하여 제작되었으며, 정보 제공 목적입니다. 투자/의료 등 중요한 결정은 전문가와 상담하세요.",
    "AI 기반으로 제작된 정보 콘텐츠입니다. 정확성을 위해 노력하였으나, 최신 정보는 공식 기관을 통해 확인해 주세요.",
]


async def _gemini_seo_titles(keyword: str, category: str, news_title: str = "") -> list[str]:
    """Gemini로 CTR 최적화 제목 5개 생성"""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or not httpx:
        return []

    cat_map = {"economy": "경제/재테크", "senior": "시니어/건강", "selfdev": "자기계발", "tech": "IT/테크", "life": "라이프스타일"}
    cat_label = cat_map.get(category, category)

    prompt = f"""유튜브 영상 제목 5개를 만들어주세요.

키워드: {keyword}
카테고리: {cat_label}
{f'관련 뉴스: {news_title}' if news_title else ''}

규칙:
- 클릭률(CTR)을 최대화하는 제목
- 각 제목은 서로 다른 스타일 (숫자형, 질문형, 긴급형, 해결형, 비교형)
- 한국어, 30자 이내
- 과장/낚시성 금지 — 유튜브 정책 위반하면 안 됨
- 제목만 JSON 배열로 반환 (마크다운 없이):
["제목1", "제목2", "제목3", "제목4", "제목5"]"""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
                params={"key": api_key},
                json={"contents": [{"parts": [{"text": prompt}]}],
                      "generationConfig": {"temperature": 0.8, "maxOutputTokens": 512}},
            )
            resp.raise_for_status()
            raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            clean = raw.strip()
            if clean.startswith("```"):
                clean = clean.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            titles = json.loads(clean)
            if isinstance(titles, list) and len(titles) >= 3:
                logger.info(f"[SEO] Gemini generated {len(titles)} titles")
                return titles[:5]
    except Exception as e:
        logger.warning(f"[SEO] Gemini title generation failed: {e}")
    return []


def _fallback_titles(keyword: str, category: str) -> list[str]:
    """Gemini 실패 시 템플릿 기반 제목"""
    patterns = [
        f"{keyword}, 이것만 알면 됩니다 (2026 최신)",
        f"[긴급] {keyword} 완벽 정리 — 모르면 손해!",
        f"{keyword}의 모든 것 | 전문가가 쉽게 설명합니다",
        f"아직도 {keyword} 모르세요? 지금 바로 확인하세요",
        f"2026년 {keyword} 총정리 — 핵심만 콕콕 짚었습니다",
        f"{keyword} 때문에 고민이세요? 이 영상이 답입니다",
        f"3분 만에 끝내는 {keyword} 핵심 가이드",
    ]
    random.shuffle(patterns)
    return patterns[:5]


HASHTAG_POOL = {
    "economy": ["경제", "재테크", "투자", "금리", "주식", "부동산", "연금", "절세", "ETF", "자산관리", "금융", "노후준비"],
    "senior": ["시니어", "노후", "연금", "건강", "복지", "기초연금", "국민연금", "건강검진", "60대", "실버세대", "노후준비"],
    "selfdev": ["자기계발", "습관", "독서", "생산성", "루틴", "마인드셋", "성장", "동기부여", "시간관리", "집중력"],
    "tech": ["AI", "인공지능", "테크", "IT", "앱추천", "자동화", "프로그래밍", "노코드", "가젯", "GPT"],
    "life": ["라이프", "요리", "인테리어", "여행", "취미", "살림", "정리정돈", "홈카페", "일상", "꿀팁"],
}


def _generate_hashtags(keyword: str, category: str) -> list[str]:
    words = keyword.replace(" ", "")
    main_tags = [f"#{words}"]
    for w in keyword.split():
        if len(w) >= 2:
            main_tags.append(f"#{w}")
    main_tags = main_tags[:4]

    pool = HASHTAG_POOL.get(category, HASHTAG_POOL["economy"])
    cat_tags = [f"#{t}" for t in random.sample(pool, min(3, len(pool)))]
    trend_tags = random.sample(["#2026", "#최신정보", "#핵심정리", "#필수시청", "#꼭보세요"], 3)

    return (main_tags + cat_tags + trend_tags)[:10]


def _generate_description(keyword: str, news_title: str, total_duration_sec: float = 180) -> str:
    """실제 영상 길이 기반 타임스탬프 포함"""
    intros = [
        f"오늘은 {keyword}에 대해 핵심만 정리해 드립니다.",
        f"{keyword}, 꼭 알아야 할 내용을 모았습니다.",
    ]

    # 실제 영상 길이 기반 타임스탬프
    dur = int(total_duration_sec)
    hook_end = min(7, dur)
    body_end = int(dur * 0.75)
    opinion_start = body_end
    outro_start = dur - 10

    timestamps = f"""00:00 인트로 — 오늘의 주제
00:{hook_end:02d} 핵심 내용 시작
{body_end // 60:02d}:{body_end % 60:02d} 전문가 분석
{opinion_start // 60:02d}:{opinion_start % 60:02d} 블랙박스의 견해
{outro_start // 60:02d}:{outro_start % 60:02d} 마무리"""

    return f"""{random.choice(intros)}

{f'📰 참고: {news_title}' if news_title else ''}

⏱ 타임스탬프
{timestamps}

📌 이 영상이 도움이 되셨다면 구독과 좋아요 부탁드립니다!
💬 궁금한 점은 댓글로 남겨주세요."""


async def generate_seo_metadata(
    keyword: str, category: str,
    news_title: str = "", opinion_tone: str = "",
    total_duration_sec: float = 180,
) -> SEOMetadata:
    """SEO 메타데이터 생성 (Gemini 제목 + 키워드 해시태그)"""

    # Gemini로 제목 생성 시도
    titles = await _gemini_seo_titles(keyword, category, news_title)
    if not titles:
        titles = _fallback_titles(keyword, category)

    description = _generate_description(keyword, news_title, total_duration_sec)
    hashtags = _generate_hashtags(keyword, category)
    tags = keyword.split() + HASHTAG_POOL.get(category, [])[:5]
    disclaimer = random.choice(DISCLAIMER_TEMPLATES)

    return SEOMetadata(titles=titles, description=description,
                       hashtags=hashtags, tags=list(set(tags))[:15], disclaimer=disclaimer)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  프라임 타임 스케줄러
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIME_TIMES = {
    "economy": {"weekday": "07:30", "weekend": "09:00", "best_days": ["월", "화", "수"],
                "reason": "직장인 출근 전 경제 뉴스 탐색 시간대"},
    "senior": {"weekday": "09:00", "weekend": "10:00", "best_days": ["화", "목", "토"],
               "reason": "시니어층 오전 활동 시간 — 건강/복지 관심 피크"},
    "selfdev": {"weekday": "06:00", "weekend": "08:00", "best_days": ["월", "수", "금"],
                "reason": "자기계발 관심층 이른 아침 루틴 시간대"},
    "tech": {"weekday": "12:00", "weekend": "11:00", "best_days": ["화", "목"],
             "reason": "IT 종사자 점심시간 콘텐츠 소비 피크"},
    "life": {"weekday": "18:00", "weekend": "14:00", "best_days": ["금", "토", "일"],
             "reason": "퇴근 후 & 주말 여유 시간 — 라이프스타일 관심 피크"},
}


@dataclass
class ScheduleRecommendation:
    recommended_time: str
    reason: str
    prime_time_weekday: str
    prime_time_weekend: str
    best_days: list[str]


def recommend_upload_time(category: str) -> ScheduleRecommendation:
    pt = PRIME_TIMES.get(category, PRIME_TIMES["economy"])
    now = datetime.utcnow() + timedelta(hours=9)  # KST
    is_weekend = now.weekday() >= 5
    time_str = pt["weekend"] if is_weekend else pt["weekday"]

    target = now.replace(
        hour=int(time_str.split(":")[0]),
        minute=int(time_str.split(":")[1]),
        second=0, microsecond=0,
    )
    if target <= now:
        target += timedelta(days=1)

    day_names = ["월", "화", "수", "목", "금", "토", "일"]
    target_day = day_names[target.weekday()]

    return ScheduleRecommendation(
        recommended_time=target.strftime(f"%Y-%m-%d %H:%M KST ({target_day})"),
        reason=pt.get("reason", f"{category} 시청자 활동 피크"),
        prime_time_weekday=pt["weekday"],
        prime_time_weekend=pt["weekend"],
        best_days=pt["best_days"],
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  썸네일
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class ThumbnailVariant:
    id: str
    style: str
    headline: str
    color_scheme: str
    is_active: bool = False
    ctr: float = 0.0


def generate_thumbnail_variants(keyword: str) -> list[ThumbnailVariant]:
    styles = [
        ("bold_text", f"{keyword} 핵심 정리", "blue_accent"),
        ("question", f"{keyword} 알고 계세요?", "red_accent"),
        ("data_visual", f"{keyword} 수치 분석", "green_accent"),
    ]
    selected = random.sample(styles, 2)
    return [
        ThumbnailVariant(
            id=hashlib.md5(f"{keyword}_{s[0]}".encode()).hexdigest()[:8],
            style=s[0], headline=s[1], color_scheme=s[2],
        ) for s in selected
    ]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 배포 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class PublishResult:
    channel_id: str
    algo_sync: AlgoSyncResult
    seo: SEOMetadata
    schedule: ScheduleRecommendation
    thumbnails: list[ThumbnailVariant]
    publish_mode: str
    video_path: str


class AlgoSyncPublisher:
    async def prepare_publish_async(
        self, channel_id, video_path, keyword, category,
        last_upload_at=None, news_title="", opinion_tone="",
        total_duration_sec=180,
    ) -> PublishResult:
        sync = check_algo_sync(channel_id, last_upload_at)
        seo = await generate_seo_metadata(keyword, category, news_title, opinion_tone, total_duration_sec)
        schedule = recommend_upload_time(category)
        thumbnails = generate_thumbnail_variants(keyword)
        mode = "auto_upload" if sync.can_auto_upload else "download_only"
        return PublishResult(
            channel_id=channel_id, algo_sync=sync, seo=seo,
            schedule=schedule, thumbnails=thumbnails,
            publish_mode=mode, video_path=video_path,
        )

    def prepare_publish(
        self, channel_id, video_path, keyword, category,
        last_upload_at=None, news_title="", opinion_tone="",
    ) -> PublishResult:
        """동기 호환 — Gemini SEO는 fallback 사용"""
        sync = check_algo_sync(channel_id, last_upload_at)
        titles = _fallback_titles(keyword, category)
        description = _generate_description(keyword, news_title)
        hashtags = _generate_hashtags(keyword, category)
        tags = keyword.split() + HASHTAG_POOL.get(category, [])[:5]

        seo = SEOMetadata(titles=titles, description=description,
                          hashtags=hashtags, tags=list(set(tags))[:15],
                          disclaimer=random.choice(DISCLAIMER_TEMPLATES))
        schedule = recommend_upload_time(category)
        thumbnails = generate_thumbnail_variants(keyword)
        mode = "auto_upload" if sync.can_auto_upload else "download_only"

        return PublishResult(
            channel_id=channel_id, algo_sync=sync, seo=seo,
            schedule=schedule, thumbnails=thumbnails,
            publish_mode=mode, video_path=video_path,
        )
