"""
Project Blackbox — Module A: API 스키마 (Pydantic v2)
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ─── 카테고리 ───
class CategoryResponse(BaseModel):
    slug: str
    label_ko: str
    icon: str
    cpm_range: str                    # "$12~18" 형식
    description: str


class CategoryListResponse(BaseModel):
    categories: list[CategoryResponse]


# ─── 키워드 분석 (v2) ───
class SubScoresResponse(BaseModel):
    """BOI를 구성하는 4개 서브스코어 (각 0~5)"""
    gap_score: float = Field(ge=0, le=5, description="검색량÷경쟁도 갭")
    momentum_score: float = Field(ge=0, le=5, description="7일 트렌드 모멘텀")
    cpm_score: float = Field(ge=0, le=5, description="카테고리 CPM 수익성")
    volume_score: float = Field(ge=0, le=5, description="절대 검색량 보너스")


class FactorWeightsResponse(BaseModel):
    """현재 적용 중인 팩터 가중치"""
    gap: float = 0.40
    momentum: float = 0.25
    cpm: float = 0.20
    volume: float = 0.15


class KeywordAnalysisResponse(BaseModel):
    keyword: str
    search_volume: int
    competition_count: int
    blue_ocean_index: float = Field(ge=0, le=5)
    sub_scores: SubScoresResponse
    trend_direction: str              # "up" | "stable" | "down"
    trend_momentum: float = Field(ge=-1, le=1, description="-1.0(급락) ~ +1.0(급등)")
    estimated_cpm: float
    opportunity_grade: str            # "A+" ~ "F"
    category_slug: str


class KeywordListResponse(BaseModel):
    category: str
    total_count: int
    factor_weights: FactorWeightsResponse
    keywords: list[KeywordAnalysisResponse]
    fetched_at: datetime


class KeywordSearchRequest(BaseModel):
    category_slug: str
    max_results: int = Field(default=10, ge=1, le=30)
    sort_by: str = Field(default="blue_ocean")  # "blue_ocean" | "volume" | "competition" | "momentum" | "cpm_score"


# ─── 뉴스 기사 ───
class NewsArticleResponse(BaseModel):
    id: int
    title: str
    source_name: str
    source_url: Optional[str] = None
    published_at: Optional[datetime] = None
    time_ago: str                     # "2시간 전"
    summary: str
    cpm_level: str                    # "매우 높음" | "높음" | "보통"
    relevance_score: float = Field(ge=0, le=1)


class NewsListResponse(BaseModel):
    keyword: str
    total_count: int
    articles: list[NewsArticleResponse]


class NewsSearchRequest(BaseModel):
    keyword: str
    days_back: int = Field(default=7, ge=1, le=30)
    max_results: int = Field(default=10, ge=1, le=20)


# ─── 큐레이션 결과 (Module B 전달용) ───
class RefinedContent(BaseModel):
    core_facts: list[str]             # 핵심 팩트 리스트
    key_insights: list[str]           # 시청자 인사이트
    hook_triggers: list[str]          # 5초 후킹 포인트
    opinion_seeds: list[str]          # Opinion Injector용 시드
    refined_summary: str              # 3문장 정제 요약


class CurationResultRequest(BaseModel):
    category_slug: str
    keyword: str
    blue_ocean_index: float
    search_volume: int
    news_article_id: int
    news_title: str
    news_source: str
    news_summary: str
    cpm_level: str


class CurationResultResponse(BaseModel):
    id: int
    status: str                       # "pending" → "processing" → "completed"
    category: str
    keyword: str
    blue_ocean_index: float
    news_title: str
    news_source: str
    cpm_level: str
    refined_content: Optional[RefinedContent] = None
    created_at: datetime

    class Config:
        from_attributes = True
