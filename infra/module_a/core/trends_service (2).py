"""
Project Blackbox — Module A: 트렌드 & 키워드 수집 서비스
Google Trends API + YouTube Data API v3 연동
"""
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional

import httpx

from module_a.core.blue_ocean import (
    TrendDirection, analyze_keyword_v2 as analyze_keyword,
    rank_keywords_v2 as rank_keywords, KeywordAnalysisV2 as KeywordAnalysis
)

logger = logging.getLogger(__name__)

# ─── 설정 ───
YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
GOOGLE_TRENDS_BASE = "https://trends.google.co.kr/trends/api"

# 카테고리별 시드 키워드 (초기 검색 확장용)
CATEGORY_SEEDS = {
    "economy": ["금리", "주식", "부동산", "연금", "ETF", "절세", "재테크", "투자"],
    "senior": ["시니어", "노후", "연금", "건강검진", "기초연금", "관절", "치매예방"],
    "selfdev": ["습관", "독서", "생산성", "자기계발", "루틴", "마인드셋", "메모"],
    "tech": ["AI", "ChatGPT", "앱추천", "노코드", "자동화", "가젯", "프로그래밍"],
    "life": ["요리", "인테리어", "여행", "살림", "정리정돈", "취미", "원룸"],
}


class TrendsFetcher:
    """Google Trends 데이터 수집기"""

    def __init__(self, http_client: Optional[httpx.AsyncClient] = None):
        self.client = http_client or httpx.AsyncClient(timeout=30.0)

    async def fetch_rising_queries(
        self,
        category_slug: str,
        geo: str = "KR",
        timeframe: str = "today 1-m",
    ) -> list[dict]:
        """
        카테고리 시드 키워드 기반으로 급상승 연관 검색어 수집

        Returns:
            [{"keyword": "...", "search_volume_estimate": ..., "trend": "up|stable|down"}, ...]
        """
        seeds = CATEGORY_SEEDS.get(category_slug, [])
        all_queries = []

        for seed in seeds[:5]:  # API 호출 제한을 위해 상위 5개만
            try:
                # pytrends 라이브러리 대신 직접 HTTP 호출
                # 실제 배포 시: pytrends.TrendReq() 사용 권장
                params = {
                    "hl": "ko",
                    "tz": "-540",
                    "req": f'{{"comparisonItem":[{{"keyword":"{seed}","geo":"{geo}","time":"{timeframe}"}}],"category":0}}',
                }

                # 시뮬레이션 데이터 반환 (실서비스에서는 실제 API 호출)
                simulated = self._simulate_trends(seed, category_slug)
                all_queries.extend(simulated)

            except Exception as e:
                logger.warning(f"Trends fetch failed for '{seed}': {e}")
                continue

        # 중복 제거 (keyword 기준)
        seen = set()
        unique = []
        for q in all_queries:
            if q["keyword"] not in seen:
                seen.add(q["keyword"])
                unique.append(q)

        return unique

    def _simulate_trends(self, seed: str, category: str) -> list[dict]:
        """개발 단계 시뮬레이션 — 실서비스에서는 제거"""
        # 실제로는 Google Trends API 응답을 파싱
        return []

    async def get_trend_direction(self, keyword: str, geo: str = "KR") -> TrendDirection:
        """
        최근 7일 vs 이전 7일 검색량 비교하여 트렌드 방향 판단

        - 20% 이상 증가 → UP
        - 20% 이상 감소 → DOWN
        - 그 외 → STABLE
        """
        try:
            # 실제 구현: pytrends interest_over_time() 호출
            # recent_avg / previous_avg 비율로 판단
            return TrendDirection.STABLE
        except Exception:
            return TrendDirection.STABLE


class YouTubeDataFetcher:
    """YouTube Data API v3 연동 — 경쟁 영상 수 및 메타데이터 수집"""

    def __init__(self, api_key: str, http_client: Optional[httpx.AsyncClient] = None):
        self.api_key = api_key
        self.client = http_client or httpx.AsyncClient(timeout=30.0)

    async def count_competition(self, keyword: str) -> int:
        """
        특정 키워드로 검색했을 때 나오는 영상 수 (totalResults)
        YouTube Search API 사용 — 일일 할당량 주의
        """
        try:
            response = await self.client.get(
                f"{YOUTUBE_API_BASE}/search",
                params={
                    "part": "snippet",
                    "q": keyword,
                    "type": "video",
                    "order": "relevance",
                    "maxResults": 1,       # 총 수만 필요하므로 1개만 요청
                    "regionCode": "KR",
                    "relevanceLanguage": "ko",
                    "key": self.api_key,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data.get("pageInfo", {}).get("totalResults", 0)
        except Exception as e:
            logger.error(f"YouTube competition count failed for '{keyword}': {e}")
            return 0

    async def get_top_videos_metadata(
        self,
        keyword: str,
        max_results: int = 10,
    ) -> list[dict]:
        """
        상위 영상의 조회수, 좋아요, 댓글 수 등 메타데이터 수집
        경쟁 강도 심층 분석용
        """
        try:
            # 1단계: 검색으로 videoId 수집
            search_resp = await self.client.get(
                f"{YOUTUBE_API_BASE}/search",
                params={
                    "part": "snippet",
                    "q": keyword,
                    "type": "video",
                    "order": "viewCount",
                    "maxResults": max_results,
                    "regionCode": "KR",
                    "key": self.api_key,
                },
            )
            search_resp.raise_for_status()
            items = search_resp.json().get("items", [])
            video_ids = [item["id"]["videoId"] for item in items]

            if not video_ids:
                return []

            # 2단계: 통계 데이터 수집
            stats_resp = await self.client.get(
                f"{YOUTUBE_API_BASE}/videos",
                params={
                    "part": "statistics,snippet,contentDetails",
                    "id": ",".join(video_ids),
                    "key": self.api_key,
                },
            )
            stats_resp.raise_for_status()
            videos = stats_resp.json().get("items", [])

            return [
                {
                    "video_id": v["id"],
                    "title": v["snippet"]["title"],
                    "channel": v["snippet"]["channelTitle"],
                    "published_at": v["snippet"]["publishedAt"],
                    "view_count": int(v["statistics"].get("viewCount", 0)),
                    "like_count": int(v["statistics"].get("likeCount", 0)),
                    "comment_count": int(v["statistics"].get("commentCount", 0)),
                    "duration": v["contentDetails"]["duration"],
                }
                for v in videos
            ]
        except Exception as e:
            logger.error(f"YouTube metadata fetch failed: {e}")
            return []

    async def estimate_search_volume(self, keyword: str) -> int:
        """
        YouTube 자체 검색량 추정
        상위 10개 영상의 평균 조회수 × 보정계수로 월간 검색량 추정
        """
        try:
            videos = await self.get_top_videos_metadata(keyword, max_results=10)
            if not videos:
                return 0

            avg_views = sum(v["view_count"] for v in videos) / len(videos)

            # 보정계수: 상위 영상 조회수의 ~15%를 월간 검색 트래픽으로 추정
            estimated = int(avg_views * 0.15)
            return max(estimated, 1000)  # 최소 1000
        except Exception:
            return 0


class CurationService:
    """
    Module A 통합 큐레이션 서비스
    트렌드 수집 → 경쟁 분석 → 블루오션 지수 산출 → 랭킹
    """

    def __init__(
        self,
        youtube_api_key: str,
        http_client: Optional[httpx.AsyncClient] = None,
    ):
        client = http_client or httpx.AsyncClient(timeout=30.0)
        self.trends = TrendsFetcher(client)
        self.youtube = YouTubeDataFetcher(youtube_api_key, client)

    async def analyze_category(
        self,
        category_slug: str,
        max_keywords: int = 10,
    ) -> list[KeywordAnalysis]:
        """
        카테고리별 블루오션 키워드 분석 파이프라인

        1. Google Trends에서 급상승 키워드 수집
        2. 각 키워드의 YouTube 경쟁 영상 수 조회
        3. 블루오션 지수 산출 및 랭킹
        """
        # 1. 트렌드 키워드 수집
        rising = await self.trends.fetch_rising_queries(category_slug)

        # 시드 키워드도 포함
        seeds = CATEGORY_SEEDS.get(category_slug, [])
        for seed in seeds:
            if not any(q["keyword"] == seed for q in rising):
                rising.append({
                    "keyword": seed,
                    "search_volume_estimate": 0,
                    "trend": "stable",
                })

        # 2. 병렬로 YouTube 경쟁 데이터 수집
        analyses = []
        tasks = []
        for q in rising[:max_keywords]:
            tasks.append(self._analyze_single(q, category_slug))

        results = await asyncio.gather(*tasks, return_exceptions=True)
        for r in results:
            if isinstance(r, KeywordAnalysis):
                analyses.append(r)

        # 3. 랭킹
        return rank_keywords(analyses)

    async def _analyze_single(
        self,
        query_data: dict,
        category_slug: str,
    ) -> KeywordAnalysis:
        """단일 키워드 분석"""
        keyword = query_data["keyword"]

        # YouTube 경쟁 영상 수
        competition = await self.youtube.count_competition(keyword)

        # 검색량 추정 (Trends 데이터가 없으면 YouTube 기반 추정)
        search_vol = query_data.get("search_volume_estimate", 0)
        if search_vol <= 0:
            search_vol = await self.youtube.estimate_search_volume(keyword)

        # 트렌드 방향
        trend_str = query_data.get("trend", "stable")
        trend = TrendDirection(trend_str) if trend_str in TrendDirection.__members__.values() else TrendDirection.STABLE

        return analyze_keyword(
            keyword=keyword,
            search_volume=search_vol,
            competition_count=competition,
            trend_direction=trend,
            category_slug=category_slug,
        )
