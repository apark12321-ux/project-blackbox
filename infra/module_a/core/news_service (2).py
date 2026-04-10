"""
Project Blackbox — Module A: 뉴스 수집 & CPM 분류 서비스
선정된 키워드에 맞는 고CPM 뉴스 소스를 자동 큐레이션
"""
import logging
from datetime import datetime, timedelta
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

# ─── 신뢰도 높은 국내 언론사 (광고 단가 영향) ───
HIGH_CPM_SOURCES = {
    "한국경제", "매일경제", "조선비즈", "서울경제", "머니투데이",
    "KBS뉴스", "SBS뉴스", "MBC뉴스", "연합뉴스",
    "시니어조선", "헬스조선", "메디게이트",
}

MEDIUM_CPM_SOURCES = {
    "중앙일보", "동아일보", "한겨레", "경향신문",
    "이데일리", "뉴시스", "아시아경제", "파이낸셜뉴스",
}


class NewsFetcher:
    """뉴스 기사 수집 및 CPM 등급 분류"""

    def __init__(
        self,
        news_api_key: str,
        http_client: Optional[httpx.AsyncClient] = None,
    ):
        self.api_key = news_api_key
        self.client = http_client or httpx.AsyncClient(timeout=30.0)
        self.base_url = "https://newsapi.org/v2"

    async def fetch_articles(
        self,
        keyword: str,
        language: str = "ko",
        max_results: int = 10,
        days_back: int = 7,
    ) -> list[dict]:
        """
        키워드 관련 최신 뉴스 기사 수집

        Returns:
            [{
                "title": str,
                "source_name": str,
                "source_url": str,
                "published_at": datetime,
                "summary": str,
                "cpm_level": "매우 높음" | "높음" | "보통",
                "relevance_score": float,
            }, ...]
        """
        try:
            from_date = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%d")

            response = await self.client.get(
                f"{self.base_url}/everything",
                params={
                    "q": keyword,
                    "language": language,
                    "from": from_date,
                    "sortBy": "relevancy",
                    "pageSize": max_results,
                    "apiKey": self.api_key,
                },
            )
            response.raise_for_status()
            data = response.json()

            articles = []
            for item in data.get("articles", []):
                source_name = item.get("source", {}).get("name", "알 수 없음")

                articles.append({
                    "title": item.get("title", ""),
                    "source_name": source_name,
                    "source_url": item.get("url", ""),
                    "published_at": self._parse_date(item.get("publishedAt")),
                    "summary": item.get("description", ""),
                    "full_text": item.get("content", ""),
                    "cpm_level": self._classify_cpm(source_name),
                    "relevance_score": self._score_relevance(
                        keyword, item.get("title", ""), item.get("description", "")
                    ),
                })

            # 관련성 + CPM 등급으로 정렬
            articles.sort(key=lambda a: (
                self._cpm_sort_key(a["cpm_level"]),
                a["relevance_score"],
            ), reverse=True)

            return articles

        except Exception as e:
            logger.error(f"News fetch failed for '{keyword}': {e}")
            return []

    def _classify_cpm(self, source_name: str) -> str:
        """언론사별 CPM 등급 분류"""
        if source_name in HIGH_CPM_SOURCES:
            return "매우 높음"
        elif source_name in MEDIUM_CPM_SOURCES:
            return "높음"
        else:
            return "보통"

    def _cpm_sort_key(self, level: str) -> int:
        return {"매우 높음": 3, "높음": 2, "보통": 1}.get(level, 0)

    def _score_relevance(self, keyword: str, title: str, description: str) -> float:
        """
        키워드-기사 관련성 점수 (0.0~1.0)
        단순 키워드 매칭 + 위치 가중치
        """
        text = f"{title} {description}".lower()
        kw_lower = keyword.lower()

        score = 0.0
        # 제목에 키워드 포함 시 가산
        if kw_lower in title.lower():
            score += 0.5

        # 키워드의 각 단어 매칭
        words = kw_lower.split()
        matched = sum(1 for w in words if w in text)
        if words:
            score += (matched / len(words)) * 0.5

        return round(min(score, 1.0), 2)

    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime]:
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except (ValueError, TypeError):
            return None

    def format_time_ago(self, published_at: Optional[datetime]) -> str:
        """발행 시간을 '~시간 전' 형식으로 변환"""
        if not published_at:
            return "시간 미상"

        now = datetime.utcnow()
        if published_at.tzinfo:
            published_at = published_at.replace(tzinfo=None)

        delta = now - published_at
        hours = int(delta.total_seconds() / 3600)

        if hours < 1:
            return "방금 전"
        elif hours < 24:
            return f"{hours}시간 전"
        elif hours < 168:
            return f"{hours // 24}일 전"
        else:
            return f"{hours // 168}주 전"


class ContentRefiner:
    """
    수집된 뉴스 본문을 Module B용 데이터로 정제
    Gemini API를 활용한 팩트 추출 및 인사이트 분류
    """

    def __init__(self, gemini_api_key: str):
        self.api_key = gemini_api_key
        self.client = httpx.AsyncClient(timeout=60.0)

    async def refine_article(self, article: dict, keyword: str) -> dict:
        """
        뉴스 기사를 Module B 스크립트 소스로 정제

        Returns:
            {
                "core_facts": [str],           # 핵심 팩트 리스트
                "key_insights": [str],          # 시청자가 얻을 인사이트
                "hook_triggers": [str],          # 후킹 포인트 (결핍/공포/호기심)
                "opinion_seeds": [str],          # Opinion Injector용 시드
                "refined_summary": str,          # 정제된 요약 (3문장)
            }
        """
        prompt = f"""
다음 뉴스 기사를 유튜브 영상 스크립트 소스로 분석하시오.
키워드: {keyword}

기사 제목: {article.get('title', '')}
기사 본문: {article.get('full_text', article.get('summary', ''))}

다음 형식으로 JSON만 반환하시오:
{{
    "core_facts": ["팩트1", "팩트2", "팩트3"],
    "key_insights": ["인사이트1", "인사이트2"],
    "hook_triggers": ["시청자의 결핍/공포/호기심을 자극할 문구1", "문구2"],
    "opinion_seeds": ["이 주제에 대해 가질 수 있는 비판적/긍정적 견해1"],
    "refined_summary": "3문장 요약"
}}
"""
        try:
            response = await self.client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
                params={"key": self.api_key},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.3,
                        "topP": 0.8,
                        "maxOutputTokens": 1024,
                    },
                },
            )
            response.raise_for_status()
            result = response.json()

            # Gemini 응답 파싱
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            # JSON 추출 (```json ... ``` 래퍼 제거)
            import json
            clean = text.strip()
            if clean.startswith("```"):
                clean = clean.split("\n", 1)[1].rsplit("```", 1)[0]
            return json.loads(clean)

        except Exception as e:
            logger.error(f"Content refinement failed: {e}")
            return {
                "core_facts": [article.get("summary", "")],
                "key_insights": [],
                "hook_triggers": [],
                "opinion_seeds": [],
                "refined_summary": article.get("summary", ""),
            }
