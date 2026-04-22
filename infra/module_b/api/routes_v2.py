"""
Project Blackbox — Module B: FastAPI 엔드포인트 (스크립트 전용)
/api/v1/script/* 라우터
— gemini-2.5-flash 모델 사용 (1.5-pro는 2025년 4월 종료)
"""
import os
import json
import logging
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from module_b.schemas.api_schemas import (
    ScriptGenerateRequest, ScriptResponse, ScriptBlockResponse,
)
from module_b.core.script_engine import (
    ScriptEngine, HookType, OpinionTone, ScriptSection, ScriptBlock,
    get_dynamic_intro, get_dynamic_outro,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/script", tags=["Module B: Script Engine"])

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

_engine = ScriptEngine(gemini_api_key=os.getenv("GEMINI_API_KEY", ""))


# ━━━ Request Models ━━━

class BlockEditRequest(BaseModel):
    """개별 블록 수정"""
    block_index: int
    new_text: str
    blocks: list[dict]

class BlockRegenerateRequest(BaseModel):
    """개별 블록 AI 재생성"""
    block_index: int
    keyword: str
    category: str
    instruction: str = ""
    blocks: list[dict]

class ScriptExtendRequest(BaseModel):
    """스크립트 분량 추가"""
    keyword: str
    category: str
    current_blocks: list[dict]
    extend_paragraphs: int = 3
    instruction: str = ""

class FullRewriteRequest(BaseModel):
    """스크립트 전체 재작성 (스타일/톤 변경)"""
    keyword: str
    category: str
    news_summary: str
    core_facts: list[str] = []
    instruction: str = ""
    target_duration_sec: float = 480.0


# ━━━ 엔드포인트 ━━━

@router.post("/generate", response_model=ScriptResponse)
async def generate_script(req: ScriptGenerateRequest):
    """3단 구조 스크립트 자동 생성"""
    script = await _engine.generate_full_script(
        keyword=req.keyword, category=req.category,
        news_summary=req.news_summary, core_facts=req.core_facts,
        opinion_seeds=req.opinion_seeds, hook_triggers=req.hook_triggers,
        target_duration_sec=req.target_duration_sec,
    )
    return ScriptResponse(
        keyword=script.keyword, category=script.category,
        hook_type=script.hook_type.value, opinion_tone=script.opinion_tone.value,
        blocks=[ScriptBlockResponse(section=b.section.value, text=b.text,
            duration_sec=b.duration_sec, subtitle_highlight=b.subtitle_highlight)
            for b in script.blocks],
        total_duration_sec=script.total_duration_sec,
        dynamic_intro=get_dynamic_intro(), dynamic_outro=get_dynamic_outro(),
    )


@router.post("/edit-block")
async def edit_block(req: BlockEditRequest):
    """★ 개별 블록 직접 수정"""
    blocks = req.blocks.copy()
    if req.block_index < 0 or req.block_index >= len(blocks):
        return {"error": "잘못된 블록 인덱스입니다"}
    new_text = req.new_text.strip()
    if not new_text:
        return {"error": "텍스트가 비어있습니다"}
    blocks[req.block_index]["text"] = new_text
    blocks[req.block_index]["duration_sec"] = round(len(new_text) / 4.5, 1)
    total_duration = sum(b.get("duration_sec", 0) for b in blocks)
    logger.info(f"[Edit] Block {req.block_index} edited: {len(new_text)} chars")
    return {"status": "ok", "edited_index": req.block_index, "blocks": blocks, "total_duration_sec": round(total_duration, 1)}


@router.post("/regenerate-block")
async def regenerate_block(req: BlockRegenerateRequest):
    """★ 개별 블록 AI 재생성"""
    blocks = req.blocks.copy()
    if req.block_index < 0 or req.block_index >= len(blocks):
        return {"error": "잘못된 블록 인덱스입니다"}

    old_block = blocks[req.block_index]
    old_text = old_block.get("text", "")
    section = old_block.get("section", "body")
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if api_key:
        try:
            import httpx
            prev_text = blocks[req.block_index - 1]["text"] if req.block_index > 0 else ""
            next_text = blocks[req.block_index + 1]["text"] if req.block_index < len(blocks) - 1 else ""
            instruction = req.instruction or "같은 주제로 다른 관점이나 표현으로 다시 작성"

            prompt = f"""유튜브 스크립트의 한 문단을 다시 작성해주세요.

키워드: {req.keyword}
카테고리: {req.category}
섹션 타입: {section}

이전 문단: {prev_text[:150]}
[현재 문단 — 이것을 재작성]: {old_text}
다음 문단: {next_text[:150]}

사용자 요청: {instruction}

규칙:
- 120~250자 사이로 작성
- 자연스러운 한국어 구어체
- 앞뒤 문단과 자연스럽게 연결
- 가짜 통계/인용 금지

텍스트만 반환하세요 (JSON이나 마크다운 없이):"""

            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(GEMINI_URL, params={"key": api_key},
                    json={"contents": [{"parts": [{"text": prompt}]}],
                          "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024}})
                resp.raise_for_status()
                new_text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                if new_text.startswith('"') and new_text.endswith('"'):
                    new_text = new_text[1:-1]
                new_text = new_text.replace("```", "").strip()

                blocks[req.block_index]["text"] = new_text
                blocks[req.block_index]["duration_sec"] = round(len(new_text) / 4.5, 1)
                total_duration = sum(b.get("duration_sec", 0) for b in blocks)
                logger.info(f"[Regen] Block {req.block_index}: {len(old_text)} → {len(new_text)} chars")
                return {"status": "ok", "regenerated_index": req.block_index, "old_text": old_text, "new_text": new_text, "blocks": blocks, "total_duration_sec": round(total_duration, 1)}

        except Exception as e:
            logger.error(f"[Regen] Gemini failed: {e}")

    return {"error": "재생성 실패 — Gemini API를 확인하세요", "blocks": blocks}


@router.post("/extend")
async def extend_script(req: ScriptExtendRequest):
    """★ 스크립트 분량 추가"""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return {"error": "Gemini API 키가 필요합니다"}

    current_text = " ".join(b.get("text", "")[:50] for b in req.current_blocks)
    last_text = req.current_blocks[-1].get("text", "") if req.current_blocks else ""
    instruction = req.instruction or "기존 내용을 보충하고 심화하는 추가 문단"

    prompt = f"""유튜브 스크립트에 추가 문단 {req.extend_paragraphs}개를 작성해주세요.

키워드: {req.keyword}
카테고리: {req.category}
기존 대본 흐름: {current_text}
마지막 문단: {last_text}

사용자 요청: {instruction}

규칙:
- {req.extend_paragraphs}개 문단, 각 120~250자
- 기존 대본과 자연스럽게 이어지도록
- 가짜 통계/인용 금지
- 자연스러운 한국어 구어체

JSON 배열만 반환:
[{{"section": "body", "text": "문단 내용", "key_phrase": "핵심 문구"}}]"""

    try:
        import httpx
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(GEMINI_URL, params={"key": api_key},
                json={"contents": [{"parts": [{"text": prompt}]}],
                      "generationConfig": {"temperature": 0.65, "maxOutputTokens": 4096}})
            resp.raise_for_status()
            raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
            if raw.startswith("```"):
                raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

            new_paragraphs = json.loads(raw)
            new_blocks = []
            for p in new_paragraphs:
                text = p.get("text", "").strip()
                if text:
                    new_blocks.append({"section": "body", "text": text, "duration_sec": round(len(text) / 8.0, 1), "subtitle_highlight": p.get("key_phrase", "")})

            blocks = req.current_blocks.copy()
            insert_index = len(blocks)
            for i in range(len(blocks) - 1, -1, -1):
                if blocks[i].get("section") in ("opinion", "cta"):
                    insert_index = i
                else:
                    break

            for nb in new_blocks:
                blocks.insert(insert_index, nb)
                insert_index += 1

            total_duration = sum(b.get("duration_sec", 0) for b in blocks)
            total_chars = sum(len(b.get("text", "")) for b in blocks)
            logger.info(f"[Extend] Added {len(new_blocks)} blocks, total {total_chars} chars")
            return {"status": "ok", "added_count": len(new_blocks), "blocks": blocks, "total_duration_sec": round(total_duration, 1), "total_chars": total_chars}

    except Exception as e:
        logger.error(f"[Extend] Failed: {e}")
        return {"error": f"분량 추가 실패: {str(e)}"}


@router.post("/rewrite")
async def rewrite_script(req: FullRewriteRequest):
    """★ 스크립트 전체 재작성"""
    instruction = req.instruction or ""
    ns = req.news_summary + (f" [사용자 요청: {instruction}]" if instruction else "")

    script = await _engine.generate_full_script(
        keyword=req.keyword, category=req.category,
        news_summary=ns, core_facts=req.core_facts,
        target_duration_sec=req.target_duration_sec,
    )

    return {
        "status": "ok", "keyword": script.keyword,
        "hook_type": script.hook_type.value, "opinion_tone": script.opinion_tone.value,
        "blocks": [{"section": b.section.value, "text": b.text,
                     "duration_sec": b.duration_sec, "subtitle_highlight": b.subtitle_highlight}
                    for b in script.blocks],
        "total_duration_sec": script.total_duration_sec,
        "total_chars": sum(len(b.text) for b in script.blocks),
    }


@router.post("/regenerate-hook")
async def regenerate_hook(keyword: str, category: str, exclude_type: str = ""):
    from module_b.core.script_engine import select_hook_type, generate_hook
    excluded = [HookType(exclude_type)] if exclude_type else []
    hook_type = select_hook_type(category, excluded)
    block = generate_hook(keyword, hook_type)
    return {"hook_type": hook_type.value, "text": block.text, "duration_sec": block.duration_sec}


@router.post("/regenerate-opinion")
async def regenerate_opinion(keyword: str, exclude_tone: str = "", seed: str = ""):
    from module_b.core.script_engine import select_opinion_tone
    excluded = [OpinionTone(exclude_tone)] if exclude_tone else []
    tone = select_opinion_tone(excluded)

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if api_key:
        try:
            import httpx
            tone_desc = {"critical": "비판적", "optimistic": "긍정적", "cautious": "신중한", "contrarian": "역발상"}
            prompt = f"""{keyword}에 대한 {tone_desc.get(tone.value, '균형잡힌')} 관점의 의견을 150~250자로 작성하세요.
구어체, 자연스러운 한국어. 근거를 함께 제시. 텍스트만 반환."""

            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.post(GEMINI_URL, params={"key": api_key},
                    json={"contents": [{"parts": [{"text": prompt}]}],
                          "generationConfig": {"temperature": 0.7, "maxOutputTokens": 512}})
                if resp.status_code == 200:
                    text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                    return {"opinion_tone": tone.value, "text": text, "duration_sec": round(len(text)/4.5, 1)}
        except Exception:
            pass

    from module_b.core.script_engine import generate_cta
    block = generate_cta(keyword)
    return {"opinion_tone": tone.value, "text": block.text, "duration_sec": block.duration_sec}
