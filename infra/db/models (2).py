"""
Project Blackbox — Shared Database Models (SQLAlchemy 2.0)
══════════════════════════════════════════════════════════
5개 모듈이 공유하는 PostgreSQL 스키마 정의.
모듈별 테이블을 논리적으로 그룹화합니다.

테이블 구조:
  [공통]   channels, pipeline_jobs
  [Mod A]  categories, keywords, news_articles, curation_results
  [Mod B]  scripts, script_blocks
  [Mod B2] video_jobs, video_assets
  [Mod C]  shield_results
  [Mod D]  publish_records, seo_metadata, thumbnails
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    create_engine, Column, String, Integer, Float, Boolean, Text,
    DateTime, ForeignKey, JSON, Enum as SAEnum, Index, UniqueConstraint,
)
from sqlalchemy.orm import (
    DeclarativeBase, relationship, Mapped, mapped_column, Session,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import enum


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Base
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Base(DeclarativeBase):
    pass


def utcnow():
    return datetime.now(timezone.utc)


def new_uuid():
    return str(uuid.uuid4())


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Enums
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class CategoryType(str, enum.Enum):
    ECONOMY = "economy"
    SENIOR = "senior"
    SELFDEV = "selfdev"
    TECH = "tech"
    LIFE = "life"


class ViewMode(str, enum.Enum):
    NORMAL = "normal"
    SENIOR = "senior"


class JobStatus(str, enum.Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    DONE = "done"
    ERROR = "error"


class PipelineStage(str, enum.Enum):
    CURATION = "curation"       # Module A
    SCRIPT = "script"           # Module B
    VIDEO_EDIT = "video_edit"   # Module B-2
    SHIELD = "shield"           # Module C
    PUBLISH = "publish"         # Module D


class HookType(str, enum.Enum):
    FEAR = "fear"
    CURIOSITY = "curiosity"
    EMPATHY = "empathy"
    SHOCK = "shock"
    QUESTION = "question"


class OpinionTone(str, enum.Enum):
    CRITICAL = "critical"
    OPTIMISTIC = "optimistic"
    CAUTIOUS = "cautious"
    CONTRARIAN = "contrarian"


class SyncStatus(str, enum.Enum):
    SYNCED = "synced"
    SYNCING = "syncing"
    SAFEGUARD = "safeguard"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  공통 테이블
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Channel(Base):
    """유튜브 채널 정보"""
    __tablename__ = "channels"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    youtube_channel_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    subscriber_count: Mapped[int] = mapped_column(Integer, default=0)
    last_upload_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    algo_sync_status: Mapped[str] = mapped_column(String(20), default="synced")
    oauth_token: Mapped[str] = mapped_column(Text, nullable=True)
    oauth_refresh_token: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    # Relations
    jobs = relationship("PipelineJob", back_populates="channel")
    publish_records = relationship("PublishRecord", back_populates="channel")


class PipelineJob(Base):
    """전체 파이프라인 작업 추적 (A→B→B2→C→D)"""
    __tablename__ = "pipeline_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    channel_id: Mapped[str] = mapped_column(String(36), ForeignKey("channels.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="queued")
    current_stage: Mapped[str] = mapped_column(String(20), default="curation")
    mode: Mapped[str] = mapped_column(String(10), default="normal")
    keyword: Mapped[str] = mapped_column(String(200), nullable=True)
    category: Mapped[str] = mapped_column(String(20), nullable=True)
    progress_pct: Mapped[float] = mapped_column(Float, default=0.0)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relations
    channel = relationship("Channel", back_populates="jobs")
    curation_result = relationship("CurationResult", back_populates="job", uselist=False)
    script = relationship("Script", back_populates="job", uselist=False)
    video_job = relationship("VideoJob", back_populates="job", uselist=False)
    shield_result = relationship("ShieldResult", back_populates="job", uselist=False)
    publish_record = relationship("PublishRecord", back_populates="job", uselist=False)

    __table_args__ = (
        Index("ix_pipeline_jobs_status", "status"),
        Index("ix_pipeline_jobs_channel", "channel_id"),
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module A: 큐레이션
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Category(Base):
    """카테고리 마스터"""
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    cpm_range: Mapped[str] = mapped_column(String(20), nullable=True)
    avg_cpm: Mapped[float] = mapped_column(Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    keywords = relationship("Keyword", back_populates="category")


class Keyword(Base):
    """키워드 분석 결과"""
    __tablename__ = "keywords"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    category_id: Mapped[str] = mapped_column(String(20), ForeignKey("categories.id"), nullable=False)
    keyword: Mapped[str] = mapped_column(String(300), nullable=False)
    search_volume: Mapped[int] = mapped_column(Integer, default=0)
    competition_count: Mapped[int] = mapped_column(Integer, default=0)
    boi_score: Mapped[float] = mapped_column(Float, default=0.0)
    gap_score: Mapped[float] = mapped_column(Float, default=0.0)
    momentum_score: Mapped[float] = mapped_column(Float, default=0.0)
    cpm_score: Mapped[float] = mapped_column(Float, default=0.0)
    volume_score: Mapped[float] = mapped_column(Float, default=0.0)
    estimated_cpm: Mapped[float] = mapped_column(Float, default=0.0)
    boi_grade: Mapped[str] = mapped_column(String(5), default="C")
    momentum_raw: Mapped[float] = mapped_column(Float, default=0.0)
    daily_trend_data: Mapped[dict] = mapped_column(JSONB, nullable=True)
    analyzed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    category = relationship("Category", back_populates="keywords")

    __table_args__ = (
        Index("ix_keywords_boi", "boi_score", postgresql_using="btree"),
        Index("ix_keywords_category", "category_id"),
    )


class NewsArticle(Base):
    """뉴스 기사"""
    __tablename__ = "news_articles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    keyword_id: Mapped[str] = mapped_column(String(36), ForeignKey("keywords.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=True)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(Text, nullable=True)
    cpm_grade: Mapped[str] = mapped_column(String(20), nullable=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class CurationResult(Base):
    """큐레이션 최종 결과 (Module A 출력)"""
    __tablename__ = "curation_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("pipeline_jobs.id"), nullable=False)
    keyword_id: Mapped[str] = mapped_column(String(36), ForeignKey("keywords.id"), nullable=False)
    news_article_id: Mapped[str] = mapped_column(String(36), ForeignKey("news_articles.id"), nullable=True)
    core_facts: Mapped[list] = mapped_column(JSONB, default=list)
    opinion_seeds: Mapped[list] = mapped_column(JSONB, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    job = relationship("PipelineJob", back_populates="curation_result")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module B: 스크립트
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Script(Base):
    """생성된 스크립트"""
    __tablename__ = "scripts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("pipeline_jobs.id"), nullable=False)
    keyword: Mapped[str] = mapped_column(String(300), nullable=False)
    category: Mapped[str] = mapped_column(String(20), nullable=False)
    hook_type: Mapped[str] = mapped_column(String(20), nullable=False)
    opinion_tone: Mapped[str] = mapped_column(String(20), nullable=False)
    total_duration_sec: Mapped[float] = mapped_column(Float, default=0.0)
    dynamic_intro: Mapped[str] = mapped_column(Text, nullable=True)
    dynamic_outro: Mapped[str] = mapped_column(Text, nullable=True)
    full_text: Mapped[str] = mapped_column(Text, nullable=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    job = relationship("PipelineJob", back_populates="script")
    blocks = relationship("ScriptBlock", back_populates="script", order_by="ScriptBlock.order_idx")


class ScriptBlock(Base):
    """스크립트 블록 (B→B-2 인터페이스 데이터)"""
    __tablename__ = "script_blocks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    script_id: Mapped[str] = mapped_column(String(36), ForeignKey("scripts.id"), nullable=False)
    order_idx: Mapped[int] = mapped_column(Integer, nullable=False)
    section: Mapped[str] = mapped_column(String(20), nullable=False)  # hook, body, opinion
    text: Mapped[str] = mapped_column(Text, nullable=False)
    duration_sec: Mapped[float] = mapped_column(Float, default=0.0)
    subtitle_highlight: Mapped[str] = mapped_column(String(200), nullable=True)

    script = relationship("Script", back_populates="blocks")

    __table_args__ = (
        Index("ix_script_blocks_script", "script_id"),
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module B-2: 영상 편집
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class VideoJob(Base):
    """영상 편집 작업"""
    __tablename__ = "video_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("pipeline_jobs.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="queued")
    mode: Mapped[str] = mapped_column(String(10), default="normal")
    avatar_id: Mapped[str] = mapped_column(String(50), nullable=True)
    avatar_name: Mapped[str] = mapped_column(String(50), nullable=True)

    # NotebookLM layout
    layout_variant: Mapped[int] = mapped_column(Integer, default=1)
    chart_type: Mapped[str] = mapped_column(String(20), nullable=True)

    # Mode params snapshot
    font_size_px: Mapped[int] = mapped_column(Integer, default=28)
    tts_speed: Mapped[float] = mapped_column(Float, default=1.0)
    bgm_volume: Mapped[float] = mapped_column(Float, default=0.15)
    bgm_freq_hz: Mapped[int] = mapped_column(Integer, default=8000)
    pause_between_sec: Mapped[float] = mapped_column(Float, default=0.3)

    # Output
    tts_audio_path: Mapped[str] = mapped_column(Text, nullable=True)
    avatar_video_path: Mapped[str] = mapped_column(Text, nullable=True)
    subtitle_path: Mapped[str] = mapped_column(Text, nullable=True)
    notebook_bg_path: Mapped[str] = mapped_column(Text, nullable=True)
    output_path: Mapped[str] = mapped_column(Text, nullable=True)
    ffmpeg_cmd: Mapped[str] = mapped_column(Text, nullable=True)
    duration_sec: Mapped[float] = mapped_column(Float, default=0.0)
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0)

    # Timing
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    job = relationship("PipelineJob", back_populates="video_job")

    __table_args__ = (
        Index("ix_video_jobs_status", "status"),
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module C: 알고리즘 실드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ShieldResult(Base):
    """실드 적용 결과"""
    __tablename__ = "shield_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("pipeline_jobs.id"), nullable=False)
    input_path: Mapped[str] = mapped_column(Text, nullable=False)
    output_path: Mapped[str] = mapped_column(Text, nullable=False)

    # Variation params
    brightness: Mapped[float] = mapped_column(Float, default=0.0)
    contrast: Mapped[float] = mapped_column(Float, default=0.0)
    saturation: Mapped[float] = mapped_column(Float, default=0.0)
    hue_shift: Mapped[float] = mapped_column(Float, default=0.0)
    pitch_semitone: Mapped[float] = mapped_column(Float, default=0.0)
    tempo: Mapped[float] = mapped_column(Float, default=1.0)
    unique_id: Mapped[str] = mapped_column(String(50), nullable=False)
    file_hash_salt: Mapped[str] = mapped_column(String(20), nullable=False)

    # Safety Score
    safety_score: Mapped[float] = mapped_column(Float, default=0.0)
    safety_grade: Mapped[str] = mapped_column(String(5), default="F")
    safety_passed: Mapped[bool] = mapped_column(Boolean, default=False)
    safety_factors: Mapped[dict] = mapped_column(JSONB, nullable=True)
    risk_items: Mapped[list] = mapped_column(JSONB, default=list)

    ffmpeg_cmd: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    job = relationship("PipelineJob", back_populates="shield_result")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module D: 배포
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class PublishRecord(Base):
    """배포 기록"""
    __tablename__ = "publish_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("pipeline_jobs.id"), nullable=False)
    channel_id: Mapped[str] = mapped_column(String(36), ForeignKey("channels.id"), nullable=False)

    # Algo-Sync
    algo_sync_status: Mapped[str] = mapped_column(String(20), default="syncing")
    algo_sync_progress: Mapped[float] = mapped_column(Float, default=0.0)
    hours_since_last_upload: Mapped[float] = mapped_column(Float, default=0.0)
    publish_mode: Mapped[str] = mapped_column(String(20), default="download_only")

    # SEO
    selected_title: Mapped[str] = mapped_column(Text, nullable=True)
    title_candidates: Mapped[list] = mapped_column(JSONB, default=list)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    hashtags: Mapped[list] = mapped_column(JSONB, default=list)
    tags: Mapped[list] = mapped_column(JSONB, default=list)
    disclaimer: Mapped[str] = mapped_column(Text, nullable=True)

    # Schedule
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    prime_time: Mapped[str] = mapped_column(String(20), nullable=True)

    # Thumbnail A/B
    thumbnail_a: Mapped[dict] = mapped_column(JSONB, nullable=True)
    thumbnail_b: Mapped[dict] = mapped_column(JSONB, nullable=True)
    winning_thumbnail: Mapped[str] = mapped_column(String(10), nullable=True)  # "a" or "b"

    # Upload result
    youtube_video_id: Mapped[str] = mapped_column(String(20), nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    video_path: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    job = relationship("PipelineJob", back_populates="publish_record")
    channel = relationship("Channel", back_populates="publish_records")

    __table_args__ = (
        Index("ix_publish_channel", "channel_id"),
        Index("ix_publish_sync_status", "algo_sync_status"),
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  DB Engine & Session
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE_URL = "postgresql+asyncpg://blackbox:blackbox@localhost:5432/blackbox"

def get_engine(url: str = None):
    return create_engine(url or DATABASE_URL.replace("+asyncpg", ""), echo=False)

def create_all_tables(engine=None):
    eng = engine or get_engine()
    Base.metadata.create_all(eng)
    return eng

def seed_categories(session: Session):
    """기본 카테고리 데이터 삽입"""
    defaults = [
        Category(id="economy", name="경제 / 재테크", cpm_range="$12~18", avg_cpm=15.0),
        Category(id="senior", name="건강 / 시니어", cpm_range="$15~22", avg_cpm=18.5),
        Category(id="selfdev", name="자기계발", cpm_range="$8~14", avg_cpm=11.0),
        Category(id="tech", name="IT / 테크", cpm_range="$10~16", avg_cpm=13.0),
        Category(id="life", name="라이프스타일", cpm_range="$6~12", avg_cpm=9.0),
    ]
    for cat in defaults:
        existing = session.query(Category).filter_by(id=cat.id).first()
        if not existing:
            session.add(cat)
    session.commit()
