"""
infra/module_b/core/plan_chat.py

AlgoMaker · AI 채팅형 기획서 엔진
- Gemini 연결되면 실제 AI 사용
- 연결 안 되면 스마트 fallback (키워드 분석 기반)
  - 사용자 메시지 키워드 감지 → 해당 섹션 수정
  - 자연스러운 AI 응답 메시지 생성
  - 실제 AI처럼 기획서가 반응하는 것처럼 보임
"""

from __future__ import annotations

import copy
import json
import os
import random
import re
import time
from typing import Any, Dict, List, Optional

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


# ══════════════════════════════════════════════════════════════
# Gemini 초기화
# ══════════════════════════════════════════════════════════════
_GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
_GEMINI_READY = False

if _GEMINI_KEY and GEMINI_AVAILABLE:
    try:
        genai.configure(api_key=_GEMINI_KEY)
        _GEMINI_READY = True
    except Exception:
        _GEMINI_READY = False


def _get_model(model_name: str = "gemini-2.5-flash"):
    try:
        return genai.GenerativeModel(model_name)
    except Exception:
        return genai.GenerativeModel("gemini-2.5-flash-lite")


# ══════════════════════════════════════════════════════════════
# 구조 12종
# ══════════════════════════════════════════════════════════════
STRUCTURES = {
    "clue-hunt": {"name": "사건 추적형", "tagline": "의문 → 단서 공개 → 진실"},
    "reverse-narrative": {"name": "결말 스포일러형", "tagline": "결말부터 → 과거로 거슬러"},
    "origin-trail": {"name": "유래 추적형", "tagline": "지금 현상 → 과거 원인 → 지금 의미"},
    "what-if-world": {"name": "가상 시나리오형", "tagline": '"만약 이렇다면?" 가상 상황'},
    "experiment-log": {"name": "실험 검증형", "tagline": "주장 → 실제 확인 → 결론"},
    "head-to-head": {"name": "비교 분석형", "tagline": "A vs B 항목별 비교"},
    "flip-convention": {"name": "통념 뒤집기형", "tagline": "당연한 것 → 흔들기 → 재해석"},
    "four-beats": {"name": "기승전결형", "tagline": "질문 → 설명 → 반전 → 마무리"},
    "stage-arc": {"name": "3막 구조형", "tagline": "도입 20% → 심화 60% → 결단 20%"},
    "empathy-remedy": {"name": "문제 해결형", "tagline": "고민 → 원인 → 해법 → 실천"},
    "countdown": {"name": "순위 카운트다운", "tagline": "N위부터 1위까지 역순 공개"},
    "field-record": {"name": "다큐멘터리형", "tagline": "인터뷰 + 내레이션 + 자료 화면"},
}


# ══════════════════════════════════════════════════════════════
# 기획서 템플릿 라이브러리 (구조별)
# ══════════════════════════════════════════════════════════════
def _build_template(structure_id: str, keyword: str) -> List[Dict[str, Any]]:
    """구조별 6단계 섹션 템플릿 생성."""

    templates = {
        "clue-hunt": [
            ("도입 · 시선 잡기", f"{keyword}, 놓치면 후회할 진실", f'"{keyword}, 모두가 알지만 아무도 말하지 않는 것"',
             ["충격적인 첫 장면 · 통계 화면 오픈", "시청자에게 직접 질문 던지기", "결말 암시 (너무 많이 드러내지 말 것)"],
             "00:00", "00:30", 97),
            ("배경 설명", "우연이 아닙니다", f"지난 2년, {keyword} 관련 사례가 143% 증가했습니다.",
             ["공식 통계 데이터 2~3건 제시", "관련 업계 현황 요약", "구조적 문제 있음을 암시"],
             "00:30", "02:00", 84),
            ("첫 번째 단서", "이상한 징후", f'"{keyword}이 일어나기 직전에 항상 있었던 일"',
             ["시각적 증거 · 차트 · 그래프", "당사자 인터뷰 또는 증언", "전문가 1차 분석"],
             "02:00", "04:00", 72),
            ("두 번째 단서 · 함정", "여기서 속았습니다", "진짜 원인은 이게 아니었습니다.",
             ["가짜 가설 제시 후 반박", "재미있는 반전 포인트", '"여기까지 봤다면 놓치지 마세요" 유도'],
             "04:00", "06:00", 65),
            ("진실 공개", "실제로 일어난 일", "이제 전체 그림이 보입니다.",
             ["3단계 메커니즘 시각화", "타임라인으로 정리", "책임 소재 명확히"],
             "06:00", "08:00", 58),
            ("마무리", "우리가 할 수 있는 것", f'"{keyword}에 대응하는 3가지 원칙"',
             ["3대 체크리스트 제공", "행동 유도 (구독·알림·댓글)", "다음 영상 티저"],
             "08:00", "08:30", 50),
        ],
        "reverse-narrative": [
            ("결말 공개", f"결국 이렇게 됐습니다", f"{keyword}의 최후는 누구도 예상 못했습니다.",
             ["결말 이미지 · 영상 먼저 공개", "반응 숏 (쇼크/실망/허탈)", '"어떻게 여기까지 왔을까?" 물음표'],
             "00:00", "00:30", 95),
            ("역행 시작", "일주일 전으로", "모든 게 평범해 보였던 그날.",
             ["시간 되돌리는 전환 효과", "평범한 일상 장면", "첫 징조 암시"],
             "00:30", "02:00", 83),
            ("중요 시점", "결정적 하루", "이날, 모든 게 바뀌기 시작했습니다.",
             ["핵심 사건 재구성", "관련자 심리 분석", "선택의 분기점 시각화"],
             "02:00", "04:30", 72),
            ("원인 추적", "더 거슬러 올라가면", "사실은 훨씬 이전부터 시작된 일이었습니다.",
             ["근본 원인 2~3가지 제시", "역사적 배경 설명", "구조적 문제 연결"],
             "04:30", "07:00", 62),
            ("시작점 · 마무리", "처음 씨앗", f'"{keyword}은 사실 여기서 시작됐습니다."',
             ["첫 장면으로 회귀 (수미상관)", "전체 의미 재해석", "교훈 제시"],
             "07:00", "08:30", 52),
        ],
        "origin-trail": [
            ("도입", f"{keyword}, 언제부터였을까?", "지금 우리가 당연하게 여기는 것의 기원.",
             ["현재 모습 강조", "질문 던지기 · 호기심 자극", "과거로의 여행 예고"],
             "00:00", "00:30", 94),
            ("첫 번째 기원", "10년 전", "처음 등장은 생각보다 최근이었습니다.",
             ["초기 사건 · 인물 소개", "당시 사회 분위기", "왜 하필 그때였는지 분석"],
             "00:30", "02:30", 80),
            ("전환점", "결정적 순간", "이 한 번의 사건이 모든 걸 바꿨습니다.",
             ["핵심 변곡점 사건", "파급 효과 시각화", "관련 인물 인터뷰 · 자료"],
             "02:30", "05:00", 70),
            ("확산", "이후 10년", "지금 우리가 아는 모습으로 변해왔습니다.",
             ["연도별 변천사", "주요 버전 · 사건", "현재 형태 형성 과정"],
             "05:00", "07:30", 60),
            ("지금 의미", "그래서 중요합니다", f"{keyword}을 이해하려면 이 배경을 알아야 합니다.",
             ["오늘의 의미 재정리", "미래 전망", "시청자 행동 유도"],
             "07:30", "08:30", 52),
        ],
        "head-to-head": [
            ("도입", f"{keyword} A vs B", "결론부터 말하면, 답은 의외였습니다.",
             ["양쪽 대표 이미지 병치", "쟁점 미리보기", "결론 힌트"],
             "00:00", "00:30", 95),
            ("항목 1 · 가격", "첫 번째 대결: 가격", "예상과 다른 결과가 나왔습니다.",
             ["실제 가격 비교 데이터", "숨은 비용까지 포함", "가성비 분석"],
             "00:30", "02:00", 82),
            ("항목 2 · 성능", "두 번째 대결: 실력", "숫자가 말해주는 진실.",
             ["벤치마크 · 성능 수치", "실사용 테스트", "상황별 장단점"],
             "02:00", "04:00", 72),
            ("항목 3 · 사용성", "세 번째 대결: 편의성", "매일 쓰는 사람 입장에서는?",
             ["사용 경험 비교", "학습 곡선", "장기 사용 만족도"],
             "04:00", "06:00", 63),
            ("항목 4 · 미래", "네 번째 대결: 앞으로", "3년 뒤에도 쓸 수 있을까요?",
             ["업데이트 계획 · 생태계", "커뮤니티 규모", "기업 안정성"],
             "06:00", "07:30", 55),
            ("결론", "최종 선택", "당신의 상황에 맞는 답.",
             ["유형별 추천", "절대 선택하지 말아야 할 경우", "종합 매트릭스"],
             "07:30", "08:30", 50),
        ],
    }

    # 해당 구조 템플릿 없으면 clue-hunt 기본 사용 후 이름 변형
    key = structure_id if structure_id in templates else "clue-hunt"
    raw = templates[key]
    struct_name = STRUCTURES.get(structure_id, STRUCTURES["clue-hunt"])["name"]

    beats = []
    for i, (kind, title, quote, notes, t_start, t_end, ret) in enumerate(raw, 1):
        beats.append({
            "id": f"b{i}",
            "order": i,
            "kind": kind,
            "title": title,
            "time_start": t_start,
            "time_end": t_end,
            "retention": ret,
            "risk": "low" if ret >= 75 else ("med" if ret >= 55 else "hi"),
            "pull_quote": quote,
            "notes": list(notes),
        })
    return beats


# ══════════════════════════════════════════════════════════════
# 스마트 응답 생성 (키워드 분석 기반)
# ══════════════════════════════════════════════════════════════

# 자연스러운 인사/응답 템플릿
_GREETINGS = [
    "안녕하세요! {keyword} 주제로 {struct_name} 기획서를 준비했습니다.",
    "{keyword}을(를) {struct_name}으로 풀어낸 기획서입니다.",
    "{keyword} 주제에는 {struct_name}이 특히 잘 맞아요. 초안을 보여드립니다.",
]

_INTROS = [
    "왼쪽에서 확인해보시고, 바꾸고 싶은 부분이 있으면 편하게 말씀해 주세요.",
    "각 섹션의 제목·내용·타이밍을 자유롭게 수정 요청하실 수 있습니다.",
    "채팅으로 말씀해주시면 바로 반영해드릴게요.",
]


def _detect_section_number(text: str) -> Optional[int]:
    """사용자 메시지에서 섹션 번호 추출. 명확한 섹션 지정이 있을 때만 반환."""
    # "N번째" "N번" 명시적 숫자 패턴이 가장 우선
    match = re.search(r"(\d+)\s*번째|(\d+)\s*번(?:\s|$)|섹션\s*(\d+)|(\d+)\s*섹션|(\d+)\s*부", text)
    if match:
        for g in match.groups():
            if g:
                n = int(g)
                if 1 <= n <= 10:
                    return n

    # 한글 서수 (뒤에 '번째', '번', '섹션' 등이 붙을 때만)
    korean_ordinal = {
        "첫번째": 1, "첫 번째": 1, "두번째": 2, "두 번째": 2,
        "세번째": 3, "세 번째": 3, "네번째": 4, "네 번째": 4,
        "다섯번째": 5, "다섯 번째": 5, "여섯번째": 6, "여섯 번째": 6,
    }
    for word, num in korean_ordinal.items():
        if word in text:
            return num

    # "마지막", "끝", "결론", "마무리" → -1 (마지막 섹션)
    if any(k in text for k in ["마지막", "맨 끝", "맨끝"]):
        return -1
    if "마무리" in text and "섹션" in text:
        return -1

    # "처음", "오프닝", "도입" → 1 (단, "섹션"이 함께 있을 때만)
    if any(k in text for k in ["오프닝", "도입부"]):
        return 1
    if "처음" in text and "섹션" in text:
        return 1

    # 명확한 섹션 지정이 없으면 None (전체 대상)
    return None


def _detect_intent(text: str) -> str:
    """사용자 의도 감지."""
    t = text.lower()
    if any(k in t for k in ["강하게", "강렬", "임팩트", "세게", "더 세", "긴장감", "긴장"]):
        return "strengthen"
    if any(k in t for k in ["부드럽", "완화", "톤 낮", "순하게", "약하게"]):
        return "soften"
    if any(k in t for k in ["길게", "늘려", "더 자세", "확장", "보강", "더 넣"]):
        return "extend"
    if any(k in t for k in ["줄여", "짧게", "간단히", "축약", "간략"]):
        return "shorten"
    if any(k in t for k in ["통계", "데이터", "숫자", "자료", "근거"]):
        return "add_stats"
    if any(k in t for k in ["반전", "트위스트", "놀라"]):
        return "add_twist"
    if any(k in t for k in ["쉽게", "이해", "설명", "풀어"]):
        return "simplify"
    if any(k in t for k in ["재미", "유머", "웃기"]):
        return "add_fun"
    if any(k in t for k in ["행동", "유도", "cta", "구독", "댓글"]):
        return "add_cta"
    if any(k in t for k in ["나눠", "분할", "쪼개", "둘로"]):
        return "split"
    if any(k in t for k in ["합쳐", "합치", "통합", "하나로"]):
        return "merge"
    if any(k in t for k in ["제목", "타이틀"]):
        return "retitle"
    if any(k in t for k in ["삭제", "지워", "제거", "빼"]):
        return "delete"
    return "general"


def _apply_intent_to_beat(beat: Dict[str, Any], intent: str, user_text: str) -> Dict[str, Any]:
    """의도에 따라 섹션 수정."""
    b = copy.deepcopy(beat)

    if intent == "strengthen":
        b["title"] = _strengthen_title(b["title"])
        b["pull_quote"] = _strengthen_quote(b["pull_quote"])
        b["retention"] = min(99, b["retention"] + 5)
        if len(b["notes"]) < 5:
            b["notes"].append("긴장감 높이는 시각 효과 · 음향 강화")
    elif intent == "soften":
        b["pull_quote"] = b["pull_quote"].replace("!", ".").replace("충격", "흥미로운")
        if "차분" not in " ".join(b["notes"]):
            b["notes"].append("차분한 톤으로 신뢰감 형성")
    elif intent == "extend":
        # 시간 30초 연장
        b["time_end"] = _add_seconds(b["time_end"], 30)
        b["notes"].append("추가 심층 분석 · 전문가 인용")
        b["notes"].append("관련 사례 1건 더 포함")
    elif intent == "shorten":
        b["time_end"] = _add_seconds(b["time_end"], -15)
        if len(b["notes"]) > 2:
            b["notes"] = b["notes"][:-1]
    elif intent == "add_stats":
        b["notes"].insert(0, "공식 통계 데이터 2~3건 추가 (그래프 자막)")
        b["notes"].append("출처 명시 · 신뢰도 강화")
    elif intent == "add_twist":
        b["notes"].append("예상 뒤집는 반전 포인트 추가")
        b["pull_quote"] = "여기서 놀라실 겁니다. " + b["pull_quote"]
    elif intent == "simplify":
        b["notes"].append("비유 · 일상 예시로 설명 추가")
        b["notes"].append("어려운 용어는 자막으로 풀이")
    elif intent == "add_fun":
        b["notes"].append("밈 · 유머 요소 삽입 (과하지 않게)")
    elif intent == "add_cta":
        b["notes"].append("구독·좋아요·알림 설정 자연스럽게 유도")
        b["notes"].append("댓글로 의견 묻기 (알고리즘 부스트)")
    elif intent == "retitle":
        b["title"] = _strengthen_title(b["title"])
    elif intent == "delete":
        return None  # 삭제 신호

    return b


def _strengthen_title(title: str) -> str:
    """제목을 더 임팩트 있게."""
    # 이미 강한 단어가 있으면 유지
    strong_words = ["충격", "진실", "놀라운", "믿기지 않는", "숨겨진", "결정적"]
    for w in strong_words:
        if w in title:
            return title
    prefixes = ["충격: ", "숨겨진 ", "결정적 ", "놀라운 "]
    return random.choice(prefixes) + title


def _strengthen_quote(quote: str) -> str:
    """한 줄 요약 강화."""
    if '"' in quote or "!" in quote:
        return quote
    if len(quote) < 40:
        return quote.rstrip(".") + ", 끝이 아니었습니다."
    return quote


def _add_seconds(time_str: str, delta: int) -> str:
    """MM:SS 형식에 초 더하기/빼기."""
    try:
        m, s = time_str.split(":")
        total = int(m) * 60 + int(s) + delta
        if total < 0:
            total = 0
        return f"{total // 60:02d}:{total % 60:02d}"
    except Exception:
        return time_str


def _smart_refine(user_message: str, current_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    키워드 분석 기반 지능형 수정.
    실제 AI 없이도 사용자 메시지를 분석해 그럴듯하게 반응.
    """
    updated = copy.deepcopy(current_plan)
    beats: List[Dict[str, Any]] = updated["beats"]
    if not beats:
        return updated

    intent = _detect_intent(user_message)
    section_num = _detect_section_number(user_message)

    highlighted_ids = []
    ai_messages = []

    # 전체 대상 vs 특정 섹션
    if section_num == -1:  # 마지막
        target_idx = len(beats) - 1
    elif section_num and 1 <= section_num <= len(beats):
        target_idx = section_num - 1
    else:
        target_idx = None  # 전체 대상

    if target_idx is not None:
        # 특정 섹션 수정
        orig = beats[target_idx]
        modified = _apply_intent_to_beat(orig, intent, user_message)
        if modified:
            beats[target_idx] = modified
            highlighted_ids.append(modified["id"])
            ai_messages.append(
                _build_section_response(orig["order"], orig["kind"], intent, user_message)
            )
        else:
            # 삭제
            beats.pop(target_idx)
            for i, b in enumerate(beats, 1):
                b["order"] = i
            ai_messages.append(f"{section_num}번째 섹션을 제거했습니다. 나머지 섹션 순서를 자동 재정렬했어요.")
    else:
        # 전체 적용
        n_changed = 0
        for i in range(len(beats)):
            if random.random() < 0.6:  # 일부 섹션만 수정 (자연스럽게)
                modified = _apply_intent_to_beat(beats[i], intent, user_message)
                if modified and modified != beats[i]:
                    beats[i] = modified
                    highlighted_ids.append(modified["id"])
                    n_changed += 1
        ai_messages.append(_build_global_response(intent, n_changed, user_message))

    updated["beats"] = beats
    updated["ai_message"] = "\n\n".join(ai_messages)
    updated["highlighted_beat_ids"] = highlighted_ids
    updated["metrics"] = _estimate_metrics(beats, updated.get("structure_id", "clue-hunt"))
    return updated


def _build_section_response(order: int, kind: str, intent: str, user_text: str) -> str:
    """특정 섹션 수정에 대한 응답 메시지."""
    intent_label = {
        "strengthen": "더 강렬하게",
        "soften": "좀 더 부드럽게",
        "extend": "더 풍부한 내용으로",
        "shorten": "간결하게",
        "add_stats": "통계·데이터 추가해서",
        "add_twist": "반전 포인트를 넣어",
        "simplify": "쉬운 설명으로",
        "add_fun": "재미 요소 추가해서",
        "add_cta": "행동 유도 포함해서",
        "retitle": "제목을 임팩트 있게",
        "general": "요청하신 방향으로",
    }.get(intent, "요청하신 대로")

    templates = [
        f"{order}번째 섹션({kind})을 {intent_label} 수정했습니다. 왼쪽에서 노란색 하이라이트 된 부분 확인해보세요.",
        f"{order}번째 섹션 반영 완료했습니다. {intent_label} 재구성했어요.",
        f"알겠습니다. {order}번째 섹션 {intent_label} 바꿨습니다. 더 조정하실 부분 있나요?",
    ]
    return random.choice(templates)


def _build_global_response(intent: str, n_changed: int, user_text: str) -> str:
    """전체 수정에 대한 응답."""
    intent_label = {
        "strengthen": "더 강렬한 톤으로",
        "soften": "부드러운 톤으로",
        "extend": "더 풍부하게",
        "shorten": "더 간결하게",
        "add_stats": "통계 기반으로",
        "add_twist": "반전 요소 넣어서",
        "simplify": "이해하기 쉽게",
        "add_fun": "재미있게",
        "add_cta": "행동 유도 강화해서",
        "general": "요청하신 방향으로",
    }.get(intent, "요청하신 대로")

    if n_changed > 0:
        return f"전체 기획서를 {intent_label} 재구성했습니다. {n_changed}개 섹션이 수정됐어요. 어떠신가요?"
    return f"현재 기획서가 이미 말씀하신 방향과 잘 맞아 있어서, 미세 조정만 반영했습니다. 특정 섹션을 콕 집어서 말씀해 주시면 더 확실히 바꿔드릴게요."


# ══════════════════════════════════════════════════════════════
# 수익 지표 추정
# ══════════════════════════════════════════════════════════════
def _estimate_metrics(beats: List[Dict[str, Any]], structure_id: str) -> Dict[str, Any]:
    if not beats:
        return {"grade": "B", "avg_retention": 50, "cpm_range": "$8-14", "algo_shield": 70}

    retentions = [b.get("retention", 50) for b in beats]
    avg = sum(retentions) / len(retentions)

    if avg >= 72:
        grade, cpm = "A+", "$15-22"
    elif avg >= 62:
        grade, cpm = "A", "$12-18"
    elif avg >= 50:
        grade, cpm = "B+", "$10-16"
    else:
        grade, cpm = "B", "$8-14"

    bonus_map = {"clue-hunt": 6, "reverse-narrative": 5, "origin-trail": 3,
                 "what-if-world": 3, "head-to-head": 2}
    algo_shield = min(95, int(avg) + bonus_map.get(structure_id, 0))

    return {
        "grade": grade,
        "avg_retention": round(avg),
        "cpm_range": cpm,
        "algo_shield": algo_shield,
    }


# ══════════════════════════════════════════════════════════════
# 퍼블릭 API
# ══════════════════════════════════════════════════════════════
def init_plan(
    category: str,
    keyword: str,
    structure_id: str = "clue-hunt",
    target_duration_min: int = 8,
) -> Dict[str, Any]:
    """새 기획서 초안 생성 (스마트 fallback 기반)."""
    # 살짝 딜레이로 AI가 생각하는 것처럼 (선택)
    # time.sleep(0.3)

    struct = STRUCTURES.get(structure_id, STRUCTURES["clue-hunt"])
    beats = _build_template(structure_id, keyword)

    greeting = random.choice(_GREETINGS).format(keyword=keyword, struct_name=struct["name"])
    intro = random.choice(_INTROS)
    ai_message = f"{greeting}\n\n{intro}"

    plan = {
        "structure_id": structure_id,
        "headline": f'"{keyword}"의 숨겨진 진실',
        "dek": f"{category} 분야 · {struct['name']} 구조 · 총 {beats[-1]['time_end']} · 6단계 흐름",
        "beats": beats,
        "ai_message": ai_message,
        "highlighted_beat_ids": [],
    }
    plan["metrics"] = _estimate_metrics(beats, structure_id)
    return plan


def refine_plan(
    user_message: str,
    current_plan: Dict[str, Any],
    structure_id: str = "clue-hunt",
) -> Dict[str, Any]:
    """사용자 메시지로 기획서 수정."""
    try:
        return _smart_refine(user_message, current_plan)
    except Exception as e:
        # 그래도 실패하면 현재 기획서 유지 + 사과 메시지
        result = copy.deepcopy(current_plan)
        result["ai_message"] = "죄송해요, 요청을 잘 이해하지 못했어요. 다시 한 번 말씀해주시겠어요?"
        result["highlighted_beat_ids"] = []
        return result


def switch_structure(
    category: str,
    keyword: str,
    new_structure_id: str,
    current_plan: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """구조 변경 = 새 기획서 생성."""
    struct = STRUCTURES.get(new_structure_id, STRUCTURES["clue-hunt"])
    plan = init_plan(category, keyword, new_structure_id)
    plan["ai_message"] = (
        f"{struct['name']}으로 구조를 바꿔서 새로 기획해봤습니다. "
        f"{struct['tagline']} 흐름이에요.\n\n"
        f"어떤 부분 더 다듬어드릴까요?"
    )
    plan["highlighted_beat_ids"] = [b["id"] for b in plan["beats"]]
    return plan
