"""
Project Blackbox — Module D: Algo-Sync 배포 시스템
═══════════════════════════════════════════════════
24시간 동기화 검증 → 자동 업로드 or 강제 다운로드 분기
SEO 메타데이터 + 프라임 타임 예약 + 썸네일 A/B 테스트

핵심: "24시간 대기"를 "알고리즘 동기화(Algo-Sync)"로 브랜딩하여
운영 노하우를 은닉합니다.
"""
import random
import hashlib
import logging
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

logger = logging.getLogger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Algo-Sync 검증 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALGO_SYNC_THRESHOLD_HOURS = 24  # 동기화 기준 시간


class SyncStatus(str, Enum):
    SYNCED = "synced"           # 동기화 완료 → 자동 업로드 가능
    SYNCING = "syncing"         # 동기화 진행 중 → 대기 필요
    SAFEGUARD = "safeguard"     # 세이프가드 활성 → 다운로드만 가능


@dataclass
class AlgoSyncResult:
    """Algo-Sync 검증 결과"""
    status: SyncStatus
    channel_id: str
    sync_progress: float            # 0~100%
    last_upload_at: Optional[datetime]
    hours_elapsed: float
    hours_remaining: float
    can_auto_upload: bool
    can_download: bool              # 항상 True
    message: str                    # 사용자에게 표시할 메시지 (노하우 은닉)


def check_algo_sync(
    channel_id: str,
    last_upload_at: Optional[datetime] = None,
) -> AlgoSyncResult:
    """
    Algo-Sync (알고리즘 동기화) 검증

    내부 로직: 마지막 업로드로부터 24시간 경과 여부 체크
    외부 표현: "알고리즘 동기화 진행률"로 표시
    """
    now = datetime.utcnow()

    if last_upload_at is None:
        # 첫 업로드 → 즉시 가능
        return AlgoSyncResult(
            status=SyncStatus.SYNCED,
            channel_id=channel_id,
            sync_progress=100.0,
            last_upload_at=None,
            hours_elapsed=999,
            hours_remaining=0,
            can_auto_upload=True,
            can_download=True,
            message="알고리즘 동기화 완료. 최적의 타이밍에 자동 배포 가능합니다.",
        )

    elapsed = (now - last_upload_at).total_seconds() / 3600
    remaining = max(0, ALGO_SYNC_THRESHOLD_HOURS - elapsed)
    progress = min(100, (elapsed / ALGO_SYNC_THRESHOLD_HOURS) * 100)

    if elapsed >= ALGO_SYNC_THRESHOLD_HOURS:
        return AlgoSyncResult(
            status=SyncStatus.SYNCED,
            channel_id=channel_id,
            sync_progress=100.0,
            last_upload_at=last_upload_at,
            hours_elapsed=round(elapsed, 1),
            hours_remaining=0,
            can_auto_upload=True,
            can_download=True,
            message="알고리즘 동기화 완료. 알고리즘 신뢰도가 최고 수치입니다.",
        )
    else:
        return AlgoSyncResult(
            status=SyncStatus.SAFEGUARD,
            channel_id=channel_id,
            sync_progress=round(progress, 1),
            last_upload_at=last_upload_at,
            hours_elapsed=round(elapsed, 1),
            hours_remaining=round(remaining, 1),
            can_auto_upload=False,
            can_download=True,
            message=f"채널 세이프가드 활성화. 알고리즘 동기화 {progress:.0f}% 진행 중.",
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SEO 메타데이터 자동 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class SEOMetadata:
    """유튜브 업로드용 SEO 메타데이터"""
    titles: list[str]               # CTR 최적화 제목 후보 5개
    description: str                # 영상 설명란
    hashtags: list[str]             # 해시태그 10개
    tags: list[str]                 # 영상 태그
    disclaimer: str                 # AI 면책 문구


DISCLAIMER_TEMPLATES = [
    "이 영상은 AI 기술을 활용하여 제작되었으며, 정보 제공 목적입니다. 투자/의료 등 중요한 결정은 전문가와 상담하세요.",
    "본 콘텐츠에는 AI 합성 기술이 사용되었습니다. 제공되는 정보는 참고용이며, 전문적인 조언을 대체하지 않습니다.",
    "AI 기반으로 제작된 정보 콘텐츠입니다. 정확성을 위해 노력하였으나, 최신 정보는 공식 기관을 통해 확인해 주세요.",
]

# 카테고리별 트렌드 해시태그 풀
HASHTAG_POOL = {
    "economy": ["경제", "재테크", "투자", "금리", "주식", "부동산", "연금", "절세", "ETF", "자산관리", "금융", "펀드", "노후준비", "재무설계"],
    "senior": ["시니어", "노후", "연금", "건강", "복지", "기초연금", "국민연금", "건강검진", "60대", "실버세대", "노인복지", "노후준비"],
    "selfdev": ["자기계발", "습관", "독서", "생산성", "루틴", "마인드셋", "성장", "동기부여", "목표설정", "시간관리", "집중력"],
    "tech": ["AI", "인공지능", "테크", "IT", "앱추천", "자동화", "프로그래밍", "노코드", "가젯", "디지털", "GPT", "클라우드"],
    "life": ["라이프", "요리", "인테리어", "여행", "취미", "살림", "정리정돈", "홈카페", "일상", "꿀팁", "생활"],
}


def generate_seo_metadata(
    keyword: str,
    category: str,
    news_title: str = "",
    opinion_tone: str = "",
) -> SEOMetadata:
    """SEO 최적화 메타데이터 자동 생성"""

    # 제목 5개 (CTR 최적화 — 매번 다른 패턴)
    titles = _generate_titles(keyword, category)

    # 설명란
    description = _generate_description(keyword, news_title)

    # 해시태그 10개 (4 메인 + 3 카테고리 + 3 트렌드, 매번 다른 조합)
    hashtags = _generate_hashtags(keyword, category)

    # 태그 (검색 노출용)
    tags = _generate_tags(keyword, category)

    # 면책 문구
    disclaimer = random.choice(DISCLAIMER_TEMPLATES)

    return SEOMetadata(
        titles=titles,
        description=description,
        hashtags=hashtags,
        tags=tags,
        disclaimer=disclaimer,
    )


def _generate_titles(keyword: str, category: str) -> list[str]:
    """CTR 최적화 제목 5개 — 매번 다른 패턴"""
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


def _generate_description(keyword: str, news_title: str) -> str:
    intros = [
        f"오늘은 {keyword}에 대해 핵심만 정리해 드립니다.",
        f"{keyword}, 꼭 알아야 할 내용을 모았습니다.",
        f"최신 정보를 바탕으로 {keyword}을 분석합니다.",
    ]
    return f"""{random.choice(intros)}

{f'참고 기사: {news_title}' if news_title else ''}

00:00 인트로
00:05 핵심 내용
02:00 전문가 분석
03:00 오늘의 결론

#shorts가 아닌 정보 영상입니다.
궁금한 점은 댓글로 남겨주세요!"""


def _generate_hashtags(keyword: str, category: str) -> list[str]:
    """해시태그 10개 — 4 메인 + 3 카테고리 + 3 트렌드"""
    # 메인 키워드 분해
    words = keyword.split()
    main_tags = [f"#{keyword.replace(' ', '')}"]
    for w in words[:3]:
        if len(w) >= 2:
            main_tags.append(f"#{w}")
    main_tags = main_tags[:4]

    # 카테고리 풀에서 랜덤 선택
    pool = HASHTAG_POOL.get(category, HASHTAG_POOL["economy"])
    cat_tags = [f"#{t}" for t in random.sample(pool, min(3, len(pool)))]

    # 시의성 트렌드 태그
    trend_tags = random.sample([
        "#2026", "#최신정보", "#알아두면좋은", "#꼭보세요",
        "#핵심정리", "#오늘의정보", "#필수시청",
    ], 3)

    all_tags = main_tags + cat_tags + trend_tags
    return all_tags[:10]


def _generate_tags(keyword: str, category: str) -> list[str]:
    pool = HASHTAG_POOL.get(category, [])
    base = keyword.split() + pool[:5]
    return list(set(base))[:15]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  프라임 타임 스케줄러
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 카테고리별 최적 업로드 시간 (KST)
PRIME_TIMES = {
    "economy":  {"weekday": "07:30", "weekend": "09:00", "best_days": ["월", "화", "수"]},
    "senior":   {"weekday": "09:00", "weekend": "10:00", "best_days": ["화", "목", "토"]},
    "selfdev":  {"weekday": "06:00", "weekend": "08:00", "best_days": ["월", "수", "금"]},
    "tech":     {"weekday": "12:00", "weekend": "11:00", "best_days": ["화", "목"]},
    "life":     {"weekday": "18:00", "weekend": "14:00", "best_days": ["금", "토", "일"]},
}


@dataclass
class ScheduleRecommendation:
    recommended_time: str           # "2026-04-10 09:00 KST"
    reason: str
    prime_time_weekday: str
    prime_time_weekend: str
    best_days: list[str]


def recommend_upload_time(category: str) -> ScheduleRecommendation:
    pt = PRIME_TIMES.get(category, PRIME_TIMES["economy"])
    now = datetime.utcnow() + timedelta(hours=9)  # KST
    is_weekend = now.weekday() >= 5
    time_str = pt["weekend"] if is_weekend else pt["weekday"]

    # 다음 가능한 프라임 타임 계산
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
        reason=f"{category} 카테고리 시청자 활동 피크 시간대",
        prime_time_weekday=pt["weekday"],
        prime_time_weekend=pt["weekend"],
        best_days=pt["best_days"],
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  썸네일 A/B 테스트 시스템
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class ThumbnailVariant:
    id: str
    style: str                      # "bold_text" | "question" | "data_visual"
    headline: str
    color_scheme: str
    is_active: bool = False
    ctr: float = 0.0                # 클릭률 (A/B 테스트 후)


def generate_thumbnail_variants(keyword: str) -> list[ThumbnailVariant]:
    """썸네일 2개 변형 생성 (A/B 테스트용)"""
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
        )
        for s in selected
    ]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 배포 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class PublishResult:
    """배포 결과"""
    channel_id: str
    algo_sync: AlgoSyncResult
    seo: SEOMetadata
    schedule: ScheduleRecommendation
    thumbnails: list[ThumbnailVariant]
    publish_mode: str               # "auto_upload" | "download_only"
    video_path: str


class AlgoSyncPublisher:
    """Module D 통합 배포 시스템"""

    def prepare_publish(
        self,
        channel_id: str,
        video_path: str,
        keyword: str,
        category: str,
        last_upload_at: Optional[datetime] = None,
        news_title: str = "",
        opinion_tone: str = "",
    ) -> PublishResult:
        """배포 준비 — Algo-Sync 검증 + SEO + 스케줄 + 썸네일"""

        # 1. Algo-Sync 검증
        sync = check_algo_sync(channel_id, last_upload_at)

        # 2. SEO 메타데이터
        seo = generate_seo_metadata(keyword, category, news_title, opinion_tone)

        # 3. 프라임 타임 추천
        schedule = recommend_upload_time(category)

        # 4. 썸네일 A/B
        thumbnails = generate_thumbnail_variants(keyword)

        # 5. 배포 모드 결정
        mode = "auto_upload" if sync.can_auto_upload else "download_only"

        return PublishResult(
            channel_id=channel_id,
            algo_sync=sync,
            seo=seo,
            schedule=schedule,
            thumbnails=thumbnails,
            publish_mode=mode,
            video_path=video_path,
        )
