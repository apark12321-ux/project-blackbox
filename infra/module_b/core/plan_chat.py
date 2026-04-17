"""
infra/module_b/core/plan_chat.py

AlgoMaker · AI 채팅형 기획서 엔진
- Gemini API를 이용해 대화형으로 영상 기획서를 생성·수정한다.
- 기존 module_b의 Gemini 설정을 그대로 재활용 (GEMINI_API_KEY 환경변수).
- JSON 기반 상태를 유지해, 프론트에서 받은 "사용자 명령"을 반영해 업데이트 후 반환한다.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional

import google.generativeai as genai


# ══════════════════════════════════════════════════════════════
# Gemini 초기화
# ══════════════════════════════════════════════════════════════
_GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
if _GEMINI_KEY:
    genai.configure(api_key=_GEMINI_KEY)


def _get_model(model_name: str = "gemini-2.0-flash-exp"):
    """
    Gemini 모델 인스턴스. flash-exp가 실패하면 flash로 fallback.
    """
    try:
        return genai.GenerativeModel(model_name)
    except Exception:
        return genai.GenerativeModel("gemini-1.5-flash")


# ══════════════════════════════════════════════════════════════
# 구조 12종 정의 (프론트와 동일 — id만 매칭됨)
# ══════════════════════════════════════════════════════════════
STRUCTURES = {
    "clue-hunt": {
        "name": "사건 추적형",
        "tagline": "의문 → 단서 공개 → 진실",
    },
    "reverse-narrative": {
        "name": "결말 스포일러형",
        "tagline": "결말부터 → 과거로 거슬러",
    },
    "origin-trail": {
        "name": "유래 추적형",
        "tagline": "지금 현상 → 과거 원인 → 지금 의미",
    },
    "what-if-world": {
        "name": "가상 시나리오형",
        "tagline": '"만약 이렇다면?" 가상 상황',
    },
    "experiment-log": {
        "name": "실험 검증형",
        "tagline": "주장 → 실제 확인 → 결론",
    },
    "head-to-head": {
        "name": "비교 분석형",
        "tagline": "A vs B 항목별 비교",
    },
    "flip-convention": {
        "name": "통념 뒤집기형",
        "tagline": "당연한 것 → 흔들기 → 재해석",
    },
    "four-beats": {
        "name": "기승전결형",
        "tagline": "질문 → 설명 → 반전 → 마무리",
    },
    "stage-arc": {
        "name": "3막 구조형",
        "tagline": "도입 20% → 심화 60% → 결단 20%",
    },
    "empathy-remedy": {
        "name": "문제 해결형",
        "tagline": "고민 → 원인 → 해법 → 실천",
    },
    "countdown": {
        "name": "순위 카운트다운",
        "tagline": "N위부터 1위까지 역순 공개",
    },
    "field-record": {
        "name": "다큐멘터리형",
        "tagline": "인터뷰 + 내레이션 + 자료 화면",
    },
}


# ══════════════════════════════════════════════════════════════
# 프롬프트 템플릿
# ══════════════════════════════════════════════════════════════

SYSTEM_PROMPT = """
당신은 AlgoMaker의 영상 기획 AI입니다.
유튜브 수익화 승인 가능한 롱폼 교육 콘텐츠(8분+)를 위한 기획서를 만듭니다.

역할:
1. 사용자의 요청을 이해하고 기획서 JSON을 생성·수정한다.
2. 답변은 반드시 지정된 JSON 스키마로만 한다. 주석/설명 금지.
3. 각 섹션의 시청 유지율(retention)은 유튜브 평균(40~60%)을 기준으로 현실적으로 추정한다.
4. 한국어로 작성. 친근하고 정보성 있는 톤.

금지:
- 허위 사실 생성
- 특정 개인 실명 저격
- 과장·선동 표현 ("충격", "반드시" 등 남용 금지)

JSON 스키마 (반드시 준수):
{
  "headline": "영상 제목 (25자 이내)",
  "dek": "부제/요약 (60자 이내)",
  "beats": [
    {
      "id": "b1",
      "order": 1,
      "kind": "섹션 라벨 (예: 도입, 배경 설명, 첫 단서)",
      "title": "섹션 제목 (20자 이내)",
      "time_start": "00:00",
      "time_end": "00:30",
      "retention": 98,
      "risk": "low | med | hi",
      "pull_quote": "한 줄 요약 (50자 이내)",
      "notes": ["구체 제작 포인트 1", "포인트 2", "포인트 3"]
    }
  ],
  "ai_message": "사용자에게 보낼 자연어 답변 (존댓말, 3문장 이내)",
  "highlighted_beat_ids": ["수정된 섹션 id들 (UI 하이라이트용)"]
}
""".strip()


def _build_initial_prompt(
    category: str,
    keyword: str,
    structure_id: str,
    target_duration_min: int = 8,
) -> str:
    struct = STRUCTURES.get(structure_id, STRUCTURES["clue-hunt"])
    return f"""
{SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
새 기획서 요청:
- 카테고리: {category}
- 키워드: {keyword}
- 구조: {struct["name"]} ({struct["tagline"]})
- 목표 길이: {target_duration_min}분
- 섹션 수: 5~7개
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"{keyword}" 주제로 "{struct["name"]}" 구조를 따르는 기획서를 JSON으로 만들어주세요.
ai_message에는 "{keyword} 주제로 기획서를 만들었습니다. 확인하시고 바꾸고 싶은 부분 말씀해주세요" 류로 짧게 인사.
highlighted_beat_ids는 빈 배열 [].
""".strip()


def _build_refine_prompt(
    user_message: str,
    current_plan: Dict[str, Any],
    structure_id: str,
) -> str:
    struct = STRUCTURES.get(structure_id, STRUCTURES["clue-hunt"])
    return f"""
{SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
현재 기획서:
{json.dumps(current_plan, ensure_ascii=False, indent=2)}

구조: {struct["name"]} ({struct["tagline"]})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

사용자 요청:
"{user_message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

위 요청을 반영해 기획서를 수정하고 JSON으로 돌려주세요.

규칙:
- 기존 섹션 id는 최대한 유지 (같은 내용 섹션이면 같은 id로)
- 수정한 섹션의 id만 highlighted_beat_ids 배열에 담기
- ai_message에는 구체적으로 뭘 바꿨는지 3문장 이내로 설명 (번호 목록이나 bullet 사용 가능)
- 요청이 불명확하면 확인 질문을 ai_message에 쓰고, beats는 현재와 동일하게 두기
""".strip()


# ══════════════════════════════════════════════════════════════
# JSON 파싱 유틸
# ══════════════════════════════════════════════════════════════

def _extract_json(text: str) -> Dict[str, Any]:
    """
    Gemini 응답에서 JSON 블록을 뽑아낸다. ```json ... ``` 래핑 지원.
    """
    text = text.strip()
    if text.startswith("```"):
        # ```json ... ``` 또는 ``` ... ``` 제거
        lines = text.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines)

    # 첫 { 부터 마지막 } 까지만 취함
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"JSON not found in response: {text[:200]}")
    return json.loads(text[start : end + 1])


# ══════════════════════════════════════════════════════════════
# 퍼블릭 API
# ══════════════════════════════════════════════════════════════

def init_plan(
    category: str,
    keyword: str,
    structure_id: str = "clue-hunt",
    target_duration_min: int = 8,
) -> Dict[str, Any]:
    """
    새 기획서 초안을 생성한다.
    반환: { headline, dek, beats, ai_message, highlighted_beat_ids }
    """
    if not _GEMINI_KEY:
        return _fallback_plan(category, keyword, structure_id)

    prompt = _build_initial_prompt(
        category, keyword, structure_id, target_duration_min
    )
    try:
        model = _get_model()
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.8,
                "max_output_tokens": 4096,
                "response_mime_type": "application/json",
            },
        )
        plan = _extract_json(response.text)
        plan["structure_id"] = structure_id
        # 등급 추정 (간단 규칙)
        plan["metrics"] = _estimate_metrics(plan.get("beats", []), structure_id)
        return plan
    except Exception as e:
        # 실패 시 fallback
        fallback = _fallback_plan(category, keyword, structure_id)
        fallback["ai_message"] = (
            f"일시적으로 AI 응답을 받지 못해 기본 기획서를 만들었습니다. "
            f"다시 시도하거나 수정 요청을 주세요. (오류: {type(e).__name__})"
        )
        return fallback


def refine_plan(
    user_message: str,
    current_plan: Dict[str, Any],
    structure_id: str = "clue-hunt",
) -> Dict[str, Any]:
    """
    사용자 메시지를 받아 기획서를 수정한다.
    """
    if not _GEMINI_KEY:
        return {
            **current_plan,
            "ai_message": "AI API 키가 설정되지 않아 수정할 수 없습니다. 관리자에게 문의해주세요.",
            "highlighted_beat_ids": [],
        }

    prompt = _build_refine_prompt(user_message, current_plan, structure_id)
    try:
        model = _get_model()
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": 4096,
                "response_mime_type": "application/json",
            },
        )
        plan = _extract_json(response.text)
        plan["structure_id"] = structure_id
        plan["metrics"] = _estimate_metrics(plan.get("beats", []), structure_id)
        return plan
    except Exception as e:
        return {
            **current_plan,
            "ai_message": (
                f"AI 응답 처리 중 문제가 있었습니다. 다시 한 번 시도해주시겠어요? "
                f"(오류: {type(e).__name__})"
            ),
            "highlighted_beat_ids": [],
        }


def switch_structure(
    category: str,
    keyword: str,
    new_structure_id: str,
    current_plan: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    구조만 바꿔서 기획서를 새로 생성한다.
    """
    struct = STRUCTURES.get(new_structure_id, STRUCTURES["clue-hunt"])
    hint = (
        f'"{struct["name"]}"으로 구조를 바꾸고 다시 만들어주세요. '
        f"이전 내용에서 활용 가능한 부분은 유지하되, 구조에 맞게 재구성하세요."
    )
    if current_plan:
        return refine_plan(hint, current_plan, new_structure_id)
    return init_plan(category, keyword, new_structure_id)


# ══════════════════════════════════════════════════════════════
# 유틸 & Fallback
# ══════════════════════════════════════════════════════════════

def _estimate_metrics(beats: List[Dict[str, Any]], structure_id: str) -> Dict[str, Any]:
    """
    수익화 지표 간단 추정.
    """
    if not beats:
        return {
            "grade": "B",
            "avg_retention": 50,
            "cpm_range": "$8-14",
            "algo_shield": 70,
        }

    retentions = [b.get("retention", 50) for b in beats]
    avg = sum(retentions) / len(retentions)

    if avg >= 70:
        grade, cpm = "A+", "$15-22"
    elif avg >= 58:
        grade, cpm = "A", "$12-18"
    elif avg >= 48:
        grade, cpm = "B+", "$10-16"
    else:
        grade, cpm = "B", "$8-14"

    # 구조별 보너스 (사건 추적·결말 스포는 시청 지속률 강점)
    bonus_map = {
        "clue-hunt": 5,
        "reverse-narrative": 4,
        "origin-trail": 3,
        "what-if-world": 3,
    }
    algo_shield = min(95, int(avg) + bonus_map.get(structure_id, 0))

    return {
        "grade": grade,
        "avg_retention": round(avg),
        "cpm_range": cpm,
        "algo_shield": algo_shield,
    }


def _fallback_plan(category: str, keyword: str, structure_id: str) -> Dict[str, Any]:
    """
    Gemini 호출 실패 시 반환하는 기본 기획서 (목업).
    """
    struct = STRUCTURES.get(structure_id, STRUCTURES["clue-hunt"])
    beats = [
        {
            "id": "b1",
            "order": 1,
            "kind": "도입",
            "title": f"{keyword}에 대한 질문 하나",
            "time_start": "00:00",
            "time_end": "00:30",
            "retention": 95,
            "risk": "low",
            "pull_quote": f"{keyword}, 당신이 모르는 이야기.",
            "notes": [
                "시선을 잡는 오프닝 비주얼",
                "핵심 질문 던지기",
                "영상 방향 암시",
            ],
        },
        {
            "id": "b2",
            "order": 2,
            "kind": "배경 설명",
            "title": "맥락과 배경",
            "time_start": "00:30",
            "time_end": "02:00",
            "retention": 80,
            "risk": "med",
            "pull_quote": f"{keyword}의 배경을 살펴봅니다.",
            "notes": [
                "관련 데이터 · 통계 제시",
                "문제의식 공유",
                "시청자 공감 유도",
            ],
        },
        {
            "id": "b3",
            "order": 3,
            "kind": "핵심 전개",
            "title": "깊이 들어가기",
            "time_start": "02:00",
            "time_end": "05:00",
            "retention": 68,
            "risk": "med",
            "pull_quote": "진짜 원인은 여기에 있습니다.",
            "notes": [
                "핵심 메커니즘 해설",
                "시각 자료 첨부",
                "구체 사례 1~2건",
            ],
        },
        {
            "id": "b4",
            "order": 4,
            "kind": "심화 분석",
            "title": "더 깊은 진실",
            "time_start": "05:00",
            "time_end": "07:30",
            "retention": 58,
            "risk": "low",
            "pull_quote": "표면 아래 숨겨진 구조.",
            "notes": [
                "추가 증거 · 반박 정리",
                "전문가 의견 인용",
                "시사점 도출",
            ],
        },
        {
            "id": "b5",
            "order": 5,
            "kind": "마무리",
            "title": "실천 가이드",
            "time_start": "07:30",
            "time_end": "08:00",
            "retention": 48,
            "risk": "low",
            "pull_quote": "시청자가 할 수 있는 것.",
            "notes": [
                "3가지 실천 체크리스트",
                "댓글 토론 유도",
                "다음 영상 티저",
            ],
        },
    ]
    plan = {
        "structure_id": structure_id,
        "headline": f"{keyword}: 알아야 할 진실",
        "dek": f"{category} 카테고리에서 {struct['name']} 구조로 풀어냅니다.",
        "beats": beats,
        "ai_message": f'"{keyword}" 주제로 {struct["name"]} 기획서를 만들었습니다. 고치고 싶은 부분 있으시면 말씀해주세요.',
        "highlighted_beat_ids": [],
    }
    plan["metrics"] = _estimate_metrics(beats, structure_id)
    return plan
