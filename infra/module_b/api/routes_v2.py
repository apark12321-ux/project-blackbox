"""
Project Blackbox — Module B: FastAPI 엔드포인트 (스크립트 전용)
/api/v1/script/* 라우터

※ 영상 제작 관련 엔드포인트는 Module B-2 (/api/v1/video-edit/*)로 이전되었습니다.
"""
from datetime import datetime
from fastapi import APIRouter

from module_b.schemas.api_schemas import (
    ScriptGenerateRequest, ScriptResponse, ScriptBlockResponse,
)
from module_b.core.script_engine import (
    ScriptEngine, HookType, OpinionTone,
    get_dynamic_intro, get_dynamic_outro,
)

router = APIRouter(prefix="/api/v1/script", tags=["Module B: Script Engine"])
_engine = ScriptEngine()


@router.post("/generate", response_model=ScriptResponse)
async def generate_script(req: ScriptGenerateRequest):
    """
    3단 스크립트 자동 생성

    Output을 Module B-2의 /api/v1/video-edit/render 에 전달하면
    영상이 생성됩니다.
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


@router.post("/regenerate-hook")
async def regenerate_hook(keyword: str, category: str, exclude_type: str = ""):
    """후킹 문구만 재생성"""
    from module_b.core.script_engine import select_hook_type, generate_hook
    excluded = [HookType(exclude_type)] if exclude_type else []
    hook_type = select_hook_type(category, excluded)
    block = generate_hook(keyword, hook_type)
    return {"hook_type": hook_type.value, "text": block.text, "duration_sec": block.duration_sec}


@router.post("/regenerate-opinion")
async def regenerate_opinion(keyword: str, exclude_tone: str = "", seed: str = ""):
    """Opinion만 재생성"""
    from module_b.core.script_engine import select_opinion_tone, generate_opinion
    excluded = [OpinionTone(exclude_tone)] if exclude_tone else []
    tone = select_opinion_tone(excluded)
    block = generate_opinion(keyword, tone, seed)
    return {"opinion_tone": tone.value, "text": block.text, "duration_sec": block.duration_sec}
