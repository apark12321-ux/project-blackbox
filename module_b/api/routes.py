"""
Project Blackbox — Module B: FastAPI 엔드포인트
/api/v1/production/* 라우터
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException

from module_b.schemas.api_schemas import (
    ScriptGenerateRequest, ScriptResponse, ScriptBlockResponse,
    ModeParamsResponse,
    AvatarResponse, AvatarListResponse,
    ProductionRequest, ProductionStatusResponse,
)
from module_b.core.script_engine import (
    ScriptEngine, HookType, OpinionTone,
    get_dynamic_intro, get_dynamic_outro,
)
from module_b.core.production import (
    ViewMode, get_mode_params,
    AVATARS, recommend_avatar,
    ProductionPipeline,
)

router = APIRouter(prefix="/api/v1/production", tags=["Module B: Production"])

_engine = ScriptEngine()
_pipeline = ProductionPipeline()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  스크립트 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/script/generate", response_model=ScriptResponse)
async def generate_script(req: ScriptGenerateRequest):
    """
    3단 스크립트 자동 생성

    Module A에서 넘어온 데이터를 기반으로:
    1. 카테고리 최적 5초 후킹 문구 생성
    2. Gemini 기반 팩트 본문 작성
    3. Opinion Injector로 주관적 결론 추가
    4. 매번 다른 인트로/아웃트로 문구 배정
    """
    script = await _engine.generate_full_script(
        keyword=req.keyword,
        category=req.category,
        news_summary=req.news_summary,
        core_facts=req.core_facts,
        opinion_seeds=req.opinion_seeds,
        hook_triggers=req.hook_triggers,
        target_duration_sec=req.target_duration_sec,
    )

    return ScriptResponse(
        keyword=script.keyword,
        category=script.category,
        hook_type=script.hook_type.value,
        opinion_tone=script.opinion_tone.value,
        blocks=[
            ScriptBlockResponse(
                section=b.section.value,
                text=b.text,
                duration_sec=b.duration_sec,
                subtitle_highlight=b.subtitle_highlight,
            )
            for b in script.blocks
        ],
        total_duration_sec=script.total_duration_sec,
        dynamic_intro=get_dynamic_intro(),
        dynamic_outro=get_dynamic_outro(),
    )


@router.post("/script/regenerate-hook")
async def regenerate_hook(keyword: str, category: str, exclude_type: str = ""):
    """후킹 문구만 재생성 (사용자가 마음에 안 들 때)"""
    from module_b.core.script_engine import select_hook_type, generate_hook
    excluded = [HookType(exclude_type)] if exclude_type else []
    hook_type = select_hook_type(category, excluded)
    block = generate_hook(keyword, hook_type)
    return {
        "hook_type": hook_type.value,
        "text": block.text,
        "duration_sec": block.duration_sec,
    }


@router.post("/script/regenerate-opinion")
async def regenerate_opinion(keyword: str, exclude_tone: str = "", seed: str = ""):
    """Opinion만 재생성"""
    from module_b.core.script_engine import select_opinion_tone, generate_opinion
    excluded = [OpinionTone(exclude_tone)] if exclude_tone else []
    tone = select_opinion_tone(excluded)
    block = generate_opinion(keyword, tone, seed)
    return {
        "opinion_tone": tone.value,
        "text": block.text,
        "duration_sec": block.duration_sec,
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  모드 & 아바타
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/mode/{mode_name}", response_model=ModeParamsResponse)
async def get_mode(mode_name: str):
    """일반 모드 / 시니어 모드 파라미터 조회"""
    try:
        mode = ViewMode(mode_name)
    except ValueError:
        raise HTTPException(400, f"Invalid mode: {mode_name}. Use 'normal' or 'senior'")

    p = get_mode_params(mode)
    return ModeParamsResponse(
        mode=p.mode.value,
        subtitle_scale=p.subtitle_scale,
        tts_speed=p.tts_speed,
        bgm_volume=p.bgm_volume,
        bgm_freq_hz=p.bgm_freq_hz,
        font_size_px=p.font_size_px,
        avatar_scale=p.avatar_scale,
        transition_speed=p.transition_speed,
        pause_between_sec=p.pause_between_sec,
    )


@router.get("/avatars", response_model=AvatarListResponse)
async def list_avatars(category: str = "economy"):
    """아바타 목록 + 카테고리별 추천"""
    rec = recommend_avatar(category)
    return AvatarListResponse(
        avatars=[
            AvatarResponse(
                id=a.id, name=a.name,
                description=a.description,
                style=a.style,
                best_categories=a.best_categories,
            )
            for a in AVATARS
        ],
        recommended_id=rec.id,
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  영상 제작 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/video/create", response_model=ProductionStatusResponse)
async def create_video(req: ProductionRequest):
    """
    전체 영상 제작 파이프라인 실행

    Script → TTS → Avatar → FFmpeg Compose → Output MP4
    """
    mode = ViewMode(req.mode) if req.mode in ["normal", "senior"] else ViewMode.NORMAL

    job = await _pipeline.execute(
        keyword=req.keyword,
        category=req.category,
        mode=mode,
        avatar_id=req.avatar_id,
        news_summary=req.news_summary,
        core_facts=req.core_facts,
        opinion_seeds=req.opinion_seeds,
    )

    params = get_mode_params(mode)

    script_resp = None
    if job.script:
        script_resp = ScriptResponse(
            keyword=job.script.keyword,
            category=job.script.category,
            hook_type=job.script.hook_type.value,
            opinion_tone=job.script.opinion_tone.value,
            blocks=[
                ScriptBlockResponse(
                    section=b.section.value,
                    text=b.text,
                    duration_sec=b.duration_sec,
                    subtitle_highlight=b.subtitle_highlight,
                )
                for b in job.script.blocks
            ],
            total_duration_sec=job.script.total_duration_sec,
            dynamic_intro=get_dynamic_intro(),
            dynamic_outro=get_dynamic_outro(),
        )

    return ProductionStatusResponse(
        job_id=job.job_id,
        status=job.status,
        keyword=job.keyword,
        category=job.category,
        mode=mode.value,
        avatar_id=job.avatar_id,
        script=script_resp,
        mode_params=ModeParamsResponse(
            mode=params.mode.value,
            subtitle_scale=params.subtitle_scale,
            tts_speed=params.tts_speed,
            bgm_volume=params.bgm_volume,
            bgm_freq_hz=params.bgm_freq_hz,
            font_size_px=params.font_size_px,
            avatar_scale=params.avatar_scale,
            transition_speed=params.transition_speed,
            pause_between_sec=params.pause_between_sec,
        ),
        ffmpeg_cmd=job.ffmpeg_cmd,
        output_path=job.output_path,
        error=job.error,
        created_at=datetime.utcnow(),
    )


@router.get("/video/status/{job_id}")
async def get_video_status(job_id: str):
    """영상 제작 진행 상태 조회 (폴링용)"""
    # TODO: Redis/DB에서 job 상태 조회
    raise HTTPException(404, "Job not found")
