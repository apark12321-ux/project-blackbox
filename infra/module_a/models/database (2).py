"""
Project Blackbox — Module A: Database Models
PostgreSQL 스키마 정의 (SQLAlchemy ORM)
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text,
    ForeignKey, Boolean, JSON, Enum as SAEnum
)
from sqlalchemy.orm import relationship, DeclarativeBase
import enum


class Base(DeclarativeBase):
    pass


class CategoryType(str, enum.Enum):
    ECONOMY = "economy"
    SENIOR = "senior"
    SELFDEV = "selfdev"
    TECH = "tech"
    LIFE = "life"


class TrendDirection(str, enum.Enum):
    UP = "up"
    STABLE = "stable"
    DOWN = "down"


# ─── 카테고리 설정 테이블 ───
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    label_ko = Column(String(100), nullable=False)         # "경제 / 재테크"
    label_en = Column(String(100))                          # "Economy / Finance"
    icon = Column(String(10))                               # emoji
    cpm_range_min = Column(Float, default=0.0)              # CPM 최소 ($)
    cpm_range_max = Column(Float, default=0.0)              # CPM 최대 ($)
    description = Column(String(200))
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    keywords = relationship("Keyword", back_populates="category")


# ─── 키워드 분석 결과 테이블 ───
class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    keyword = Column(String(300), nullable=False, index=True)
    search_volume = Column(Integer, default=0)              # 월간 검색량
    competition_count = Column(Integer, default=0)          # 경쟁 영상 수
    blue_ocean_index = Column(Float, default=0.0)           # 블루오션 지수 (0~5)
    trend_direction = Column(SAEnum(TrendDirection), default=TrendDirection.STABLE)
    trend_score = Column(Float, default=1.0)                # 트렌드 가중치
    estimated_cpm = Column(Float, default=0.0)              # 예상 CPM
    raw_trends_data = Column(JSON)                          # Google Trends 원본 JSON
    raw_youtube_data = Column(JSON)                         # YouTube API 원본 JSON
    fetched_at = Column(DateTime, default=datetime.utcnow)
    is_selected = Column(Boolean, default=False)            # 사용자 선택 여부

    category = relationship("Category", back_populates="keywords")
    news_articles = relationship("NewsArticle", back_populates="keyword")


# ─── 뉴스 기사 소스 테이블 ───
class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    keyword_id = Column(Integer, ForeignKey("keywords.id"), nullable=False)
    title = Column(String(500), nullable=False)
    source_name = Column(String(100))                       # "한국경제", "KBS뉴스"
    source_url = Column(Text)
    published_at = Column(DateTime)
    summary = Column(Text)                                  # 3줄 요약
    full_text = Column(Text)                                # 본문 전체 (정제 후)
    cpm_level = Column(String(20))                          # "매우 높음", "높음", "보통"
    relevance_score = Column(Float, default=0.0)            # 키워드 관련성 점수
    is_selected = Column(Boolean, default=False)            # 사용자 선택 여부
    fetched_at = Column(DateTime, default=datetime.utcnow)

    keyword = relationship("Keyword", back_populates="news_articles")


# ─── Module B 전달용 큐레이션 결과 ───
class CurationResult(Base):
    __tablename__ = "curation_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), nullable=False, index=True)
    category_slug = Column(String(50), nullable=False)
    keyword_id = Column(Integer, ForeignKey("keywords.id"))
    news_article_id = Column(Integer, ForeignKey("news_articles.id"))
    keyword_text = Column(String(300))
    blue_ocean_index = Column(Float)
    search_volume = Column(Integer)
    news_title = Column(String(500))
    news_source = Column(String(100))
    news_summary = Column(Text)
    news_full_text = Column(Text)
    cpm_level = Column(String(20))
    status = Column(String(20), default="pending")          # pending → processing → completed
    created_at = Column(DateTime, default=datetime.utcnow)
