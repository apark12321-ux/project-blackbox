"""
Project Blackbox — Module A: API 스키마 (Pydantic v2)
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CategoryResponse(BaseModel):
    slug: str
    label_ko: str
    icon: str
    cpm_range: str
    description: str


class CategoryListResponse(BaseModel):
    categories: list[CategoryResponse]


class SubScoresResponse(BaseModel):
    gap_score: float = Field(ge=0, le=5)
    momentum_score: float = Field(ge=0, le=5)
    cpm_score: float = Field(ge=0, le=5)
    volume_score: float = Field(ge=0, le=5)


class FactorWeightsResponse(BaseModel):
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
    trend_direction: str
    trend_momentum: float = Field(ge=-1, le=1)
    estimated_cpm: float
    opportunity_grade: str
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
    sort_by: str = Field(default="blue_ocean")


class NewsArticleResponse(BaseModel):
    id: int
    title: str
    source_name: str
    source_url: Optional[str] = None
    published_at: Optional[datetime] = None
    time_ago: str = ""
    summary: str
    cpm_level: str
    relevance_score: float = Field(ge=0, le=1)


class NewsListResponse(BaseModel):
    keyword: str
    total_count: int
    articles: list[NewsArticleResponse]


class NewsSearchRequest(BaseModel):
    keyword: str
    days_back: int = Field(default=7, ge=1, le=30)
    max_results: int = Field(default=10, ge=1, le=20)


class RefinedContent(BaseModel):
    core_facts: list[str]
    key_insights: list[str]
    hook_triggers: list[str]
    opinion_seeds: list[str]
    refined_summary: str


class CurationResultRequest(BaseModel):
    category_slug: str
    keyword: str
    blue_ocean_index: float
    search_volume: int = 0
    news_article_id: int = 0
    news_title: str = ""
    news_source: str = ""
    news_summary: str = ""
    cpm_level: str = ""


class CurationResultResponse(BaseModel):
    id: int
    status: str
    category: str
    keyword: str
    blue_ocean_index: float
    news_title: str = ""
    news_source: str = ""
    cpm_level: str = ""
    refined_content: Optional[RefinedContent] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BOICalculateResponse(BaseModel):
    keyword: str
    blue_ocean_index: float
    opportunity_grade: str
    sub_scores: SubScoresResponse
