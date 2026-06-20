"""
Project Blackbox — Module A: FastAPI 엔드포인트
/api/v1/curation/* 라우터
"""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from module_a.schemas.api_schemas import (
    CategoryListResponse, CategoryResponse,
    KeywordListResponse, KeywordAnalysisResponse, KeywordSearchRequest,
    SubScoresResponse, FactorWeightsResponse,
    NewsListResponse, NewsArticleResponse, NewsSearchRequest,
    CurationResultRequest, CurationResultResponse, RefinedContent,
)
from module_a.core.blue_ocean import (
    analyze_keyword_v2, rank_keywords_v2, TrendDirection,
    calculate_blue_ocean_v2, classify_opportunity_v2,
    momentum_from_daily_data, FACTOR_WEIGHTS,
)

router = APIRouter(prefix="/api/v1/curation", tags=["Module A: Curation"])


# ─── 카테고리 설정 (초기 버전: 하드코딩, 추후 DB 전환) ───
CATEGORIES_DATA = [
    CategoryResponse(slug="economy", label_ko="경제 / 재테크", icon="📊", cpm_range="$12~18", description="주식, 부동산, 연금, 절세"),
    CategoryResponse(slug="senior", label_ko="건강 / 시니어", icon="🏥", cpm_range="$15~22", description="건강관리, 연금수령, 복지정책"),
    CategoryResponse(slug="selfdev", label_ko="자기계발", icon="🧠", cpm_range="$8~14", description="습관, 독서, 생산성, 마인드셋"),
    CategoryResponse(slug="tech", label_ko="IT / 테크", icon="💻", cpm_range="$10~16", description="AI, 앱, 가젯, 디지털 트렌드"),
    CategoryResponse(slug="life", label_ko="라이프스타일", icon="🌿", cpm_range="$6~12", description="요리, 인테리어, 여행, 취미"),
]


@router.get("/categories", response_model=CategoryListResponse)
async def list_categories():
    """
    Step 1: 카테고리 목록 조회
    사용 가능한 콘텐츠 카테고리와 예상 CPM 범위를 반환합니다.
    """
    return CategoryListResponse(categories=CATEGORIES_DATA)


@router.post("/keywords/search", response_model=KeywordListResponse)
async def search_keywords(request: KeywordSearchRequest):
    """
    Step 2: 카테고리별 키워드 자동 서치 (v2 — 4팩터 가중합)

    - Google Trends API로 급상승 키워드 + 7일 모멘텀 수집
    - YouTube Data API로 경쟁 영상 수 조회
    - 블루오션 지수 v2 산출: 갭×40% + 모멘텀×25% + CPM×20% + 볼륨×15%
    - 서브스코어 분해 포함
    """
    mock_data = _get_mock_keywords(request.category_slug)

    analyses = []
    for kw_data in mock_data:
        analysis = analyze_keyword_v2(
            keyword=kw_data["keyword"],
            search_volume=kw_data["search_volume"],
            competition_count=kw_data["competition"],
            category_slug=request.category_slug,
            trend_momentum=kw_data.get("momentum"),
            trend_direction=TrendDirection(kw_data["trend"]),
            daily_trend_data=kw_data.get("daily"),
        )
        analyses.append(analysis)

    # 정렬
    if request.sort_by == "volume":
        analyses.sort(key=lambda a: a.search_volume, reverse=True)
    elif request.sort_by == "competition":
        analyses.sort(key=lambda a: a.competition_count)
    elif request.sort_by == "momentum":
        analyses.sort(key=lambda a: a.trend_momentum, reverse=True)
    elif request.sort_by == "cpm_score":
        analyses.sort(key=lambda a: a.sub_scores.cpm_score, reverse=True)
    else:
        analyses = rank_keywords_v2(analyses)

    analyses = analyses[:request.max_results]

    return KeywordListResponse(
        category=request.category_slug,
        total_count=len(analyses),
        factor_weights=FactorWeightsResponse(
            gap=FACTOR_WEIGHTS["gap"],
            momentum=FACTOR_WEIGHTS["momentum"],
            cpm=FACTOR_WEIGHTS["cpm"],
            volume=FACTOR_WEIGHTS["volume"],
        ),
        keywords=[
            KeywordAnalysisResponse(
                keyword=a.keyword,
                search_volume=a.search_volume,
                competition_count=a.competition_count,
                blue_ocean_index=a.blue_ocean_index,
                sub_scores=SubScoresResponse(
                    gap_score=a.sub_scores.gap_score,
                    momentum_score=a.sub_scores.momentum_score,
                    cpm_score=a.sub_scores.cpm_score,
                    volume_score=a.sub_scores.volume_score,
                ),
                trend_direction=a.trend_direction.value,
                trend_momentum=a.trend_momentum,
                estimated_cpm=a.estimated_cpm,
                opportunity_grade=a.opportunity_grade,
                category_slug=a.category_slug,
            )
            for a in analyses
        ],
        fetched_at=datetime.utcnow(),
    )


@router.post("/news/search", response_model=NewsListResponse)
async def search_news(request: NewsSearchRequest):
    """
    Step 3: 선택된 키워드 관련 뉴스 기사 수집

    - News API로 최신 기사 수집
    - 언론사별 CPM 등급 자동 분류
    - 관련성 점수로 정렬
    """
    # TODO: 실서비스에서는 NewsFetcher.fetch_articles() 호출
    mock_news = _get_mock_news(request.keyword)

    return NewsListResponse(
        keyword=request.keyword,
        total_count=len(mock_news),
        articles=mock_news,
    )


@router.post("/submit", response_model=CurationResultResponse)
async def submit_curation(request: CurationResultRequest):
    """
    Step 4: 큐레이션 결과 확정 → Module B 전달

    선택된 카테고리 + 키워드 + 뉴스 소스를 확정하고,
    Gemini API로 콘텐츠를 정제한 뒤 Module B(서사 엔진)로 전달합니다.
    """
    # TODO: DB 저장 + ContentRefiner 호출 + Module B 큐에 전달

    # 임시 응답 (실서비스에서는 비동기 처리 후 status 업데이트)
    return CurationResultResponse(
        id=1,
        status="processing",
        category=request.category_slug,
        keyword=request.keyword,
        blue_ocean_index=request.blue_ocean_index,
        news_title=request.news_title,
        news_source=request.news_source,
        cpm_level=request.cpm_level,
        refined_content=None,  # 비동기 처리 후 채워짐
        created_at=datetime.utcnow(),
    )


@router.get("/result/{curation_id}", response_model=CurationResultResponse)
async def get_curation_result(curation_id: int):
    """
    큐레이션 결과 조회 (폴링용)
    status가 "completed"가 되면 refined_content에 정제 데이터 포함
    """
    # TODO: DB에서 결과 조회
    raise HTTPException(status_code=404, detail="Result not found")


@router.get("/blue-ocean/calculate")
async def calculate_boi(
    search_volume: int = Query(ge=0),
    competition_count: int = Query(ge=0),
    category: str = Query(default="economy"),
    trend: str = Query(default="stable"),
    momentum: Optional[float] = Query(default=None, ge=-1, le=1),
):
    """
    블루오션 지수 v2 단독 계산 (디버깅/테스트용)
    서브스코어 분해 포함
    """
    trend_dir = TrendDirection(trend) if trend in ["up", "stable", "down"] else TrendDirection.STABLE
    boi, sub = calculate_blue_ocean_v2(search_volume, competition_count, category, momentum, trend_dir)
    grade = classify_opportunity_v2(boi)

    return {
        "search_volume": search_volume,
        "competition_count": competition_count,
        "category": category,
        "trend": trend,
        "momentum": momentum,
        "blue_ocean_index": boi,
        "grade": grade,
        "sub_scores": {
            "gap_score": sub.gap_score,
            "momentum_score": sub.momentum_score,
            "cpm_score": sub.cpm_score,
            "volume_score": sub.volume_score,
        },
        "factor_weights": FACTOR_WEIGHTS,
    }


# ─── 시뮬레이션 데이터 (개발용) ───
def _get_mock_keywords(category: str) -> list[dict]:
    data = {
        "economy": [
            {"keyword": "2026 하반기 금리 전망", "search_volume": 74000, "competition": 12, "trend": "up", "momentum": 0.78, "daily": [980,950,900,800,550,520,500]},
            {"keyword": "ISA 계좌 세금 혜택", "search_volume": 51000, "competition": 8, "trend": "up", "momentum": 0.42, "daily": [640,610,590,560,450,440,430]},
            {"keyword": "부동산 전세 사기 예방법", "search_volume": 89000, "competition": 34, "trend": "stable", "momentum": 0.05, "daily": [890,880,885,870,860,865,855]},
            {"keyword": "ETF 분산투자 전략", "search_volume": 42000, "competition": 18, "trend": "up", "momentum": 0.30, "daily": [520,500,490,470,400,390,385]},
            {"keyword": "퇴직연금 IRP 수령 방법", "search_volume": 63000, "competition": 9, "trend": "up", "momentum": 0.55, "daily": [780,750,730,680,510,490,480]},
            {"keyword": "비트코인 반감기 이후 전망", "search_volume": 120000, "competition": 87, "trend": "down", "momentum": -0.40, "daily": [600,650,700,800,1000,1050,1100]},
        ],
        "senior": [
            {"keyword": "시니어 연금 수령액 계산법", "search_volume": 68000, "competition": 6, "trend": "up", "momentum": 0.65, "daily": [850,820,780,700,520,490,510]},
            {"keyword": "60대 무릎 관절 운동법", "search_volume": 45000, "competition": 11, "trend": "stable", "momentum": 0.08, "daily": [455,450,448,445,420,418,415]},
            {"keyword": "기초연금 40만원 수급 조건", "search_volume": 92000, "competition": 14, "trend": "up", "momentum": 0.35, "daily": [920,900,880,850,680,670,660]},
            {"keyword": "시니어 스마트폰 활용 가이드", "search_volume": 33000, "competition": 5, "trend": "up", "momentum": 0.48, "daily": [420,400,390,370,280,270,265]},
            {"keyword": "노후 건강검진 필수 항목", "search_volume": 57000, "competition": 19, "trend": "stable", "momentum": 0.10, "daily": [580,575,570,565,530,525,520]},
        ],
        "selfdev": [
            {"keyword": "아침 루틴 5가지 습관", "search_volume": 38000, "competition": 22, "trend": "stable", "momentum": 0.02, "daily": [380,375,372,370,373,375,370]},
            {"keyword": "생산성 올리는 메모 앱 추천", "search_volume": 29000, "competition": 7, "trend": "up", "momentum": 0.60, "daily": [380,360,340,310,240,230,220]},
            {"keyword": "독서 노트 정리법 2026", "search_volume": 21000, "competition": 4, "trend": "up", "momentum": 0.70, "daily": [310,290,270,240,180,170,165]},
            {"keyword": "FIRE족 조기 은퇴 플랜", "search_volume": 55000, "competition": 31, "trend": "down", "momentum": -0.25, "daily": [400,420,440,470,530,540,550]},
        ],
        "tech": [
            {"keyword": "AI 에이전트 활용법 2026", "search_volume": 83000, "competition": 15, "trend": "up", "momentum": 0.55, "daily": [880,840,800,750,570,550,530]},
            {"keyword": "ChatGPT vs Claude 비교", "search_volume": 110000, "competition": 62, "trend": "stable", "momentum": 0.03, "daily": [1100,1095,1090,1085,1070,1065,1060]},
            {"keyword": "노코드 앱 만들기 입문", "search_volume": 41000, "competition": 9, "trend": "up", "momentum": 0.45, "daily": [520,500,480,450,360,350,340]},
            {"keyword": "애플 비전프로 실사용 후기", "search_volume": 67000, "competition": 38, "trend": "down", "momentum": -0.30, "daily": [480,510,540,580,690,700,710]},
        ],
        "life": [
            {"keyword": "1인 가구 간단 요리 레시피", "search_volume": 72000, "competition": 28, "trend": "stable", "momentum": 0.06, "daily": [725,720,718,715,685,680,678]},
            {"keyword": "소형 아파트 인테리어 꿀팁", "search_volume": 48000, "competition": 16, "trend": "up", "momentum": 0.38, "daily": [600,580,560,530,435,425,420]},
            {"keyword": "국내 숨은 여행지 추천 2026", "search_volume": 59000, "competition": 21, "trend": "up", "momentum": 0.50, "daily": [740,710,680,640,500,480,470]},
        ],
    }
    return data.get(category, [])


def _get_mock_news(keyword: str) -> list[NewsArticleResponse]:
    return [
        NewsArticleResponse(
            id=1,
            title=f"[속보] {keyword} — 전문가가 분석한 핵심 포인트",
            source_name="한국경제",
            source_url="https://example.com/1",
            published_at=datetime.utcnow(),
            time_ago="2시간 전",
            summary=f"{keyword}에 대한 전문가의 심층 분석 리포트가 발표되었다. 기존 예측과 달리 새로운 변수가 등장하면서 시장의 관심이 집중되고 있다.",
            cpm_level="매우 높음",
            relevance_score=0.95,
        ),
        NewsArticleResponse(
            id=2,
            title=f"{keyword}, 이것만 알면 손해 안 봅니다",
            source_name="매일경제",
            source_url="https://example.com/2",
            published_at=datetime.utcnow(),
            time_ago="5시간 전",
            summary=f"{keyword} 관련 핵심 정보를 일반인도 이해하기 쉽게 정리한 기사. 특히 실생활에서 바로 활용할 수 있는 팁이 포함되어 있다.",
            cpm_level="높음",
            relevance_score=0.82,
        ),
        NewsArticleResponse(
            id=3,
            title=f"[긴급] {keyword} 최신 변경사항 총정리",
            source_name="조선비즈",
            source_url="https://example.com/3",
            published_at=datetime.utcnow(),
            time_ago="1일 전",
            summary=f"최근 법률 및 정책 변경으로 인해 {keyword}의 패러다임이 바뀌고 있다. 3가지 시나리오를 통해 향후 전개 방향을 예측한다.",
            cpm_level="매우 높음",
            relevance_score=0.78,
        ),
    ]
