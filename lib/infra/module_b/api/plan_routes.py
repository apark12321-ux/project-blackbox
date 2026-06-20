"""
infra/module_b/api/plan_routes.py

AlgoMaker · 채팅형 기획서 API

엔드포인트:
  POST /api/v1/plan/init    — 새 기획서 초안 생성
  POST /api/v1/plan/refine  — 기존 기획서에 사용자 요청 반영
  POST /api/v1/plan/switch  — 구조 변경
"""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from module_b.core.plan_chat import (
    init_plan,
    refine_plan,
    switch_structure,
    STRUCTURES,
)


router = APIRouter(prefix="/api/v1/plan", tags=["Module B: Plan Chat"])


# ══════════════════════════════════════════════════════════════
# 요청/응답 모델
# ══════════════════════════════════════════════════════════════

class InitRequest(BaseModel):
    category: str = Field(..., description="영상 카테고리 (예: 경제, IT)")
    keyword: str = Field(..., description="주제 키워드")
    structure_id: str = Field(
        default="clue-hunt", description="영상 스타일 id"
    )
    target_duration_min: int = Field(default=8, ge=5, le=20)


class RefineRequest(BaseModel):
    user_message: str = Field(..., description="사용자의 수정 요청")
    current_plan: Dict[str, Any] = Field(..., description="현재 기획서 JSON")
    structure_id: str = Field(default="clue-hunt")


class SwitchRequest(BaseModel):
    category: str
    keyword: str
    new_structure_id: str
    current_plan: Optional[Dict[str, Any]] = None


# ══════════════════════════════════════════════════════════════
# 엔드포인트
# ══════════════════════════════════════════════════════════════

@router.get("/structures")
async def list_structures():
    """영상 스타일 12종 목록."""
    return {
        "structures": [
            {"id": sid, **info} for sid, info in STRUCTURES.items()
        ]
    }


@router.post("/init")
async def api_init_plan(req: InitRequest):
    """
    새 기획서 초안 생성.
    """
    try:
        plan = init_plan(
            category=req.category,
            keyword=req.keyword,
            structure_id=req.structure_id,
            target_duration_min=req.target_duration_min,
        )
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"기획서 생성 실패: {type(e).__name__}: {str(e)[:200]}",
        )


@router.post("/refine")
async def api_refine_plan(req: RefineRequest):
    """
    기존 기획서에 사용자 명령 반영.
    """
    try:
        plan = refine_plan(
            user_message=req.user_message,
            current_plan=req.current_plan,
            structure_id=req.structure_id,
        )
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"기획서 수정 실패: {type(e).__name__}: {str(e)[:200]}",
        )


@router.post("/switch")
async def api_switch_structure(req: SwitchRequest):
    """
    구조 변경 (현재 기획서 내용 가능한 한 보존).
    """
    try:
        plan = switch_structure(
            category=req.category,
            keyword=req.keyword,
            new_structure_id=req.new_structure_id,
            current_plan=req.current_plan,
        )
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"구조 변경 실패: {type(e).__name__}: {str(e)[:200]}",
        )
