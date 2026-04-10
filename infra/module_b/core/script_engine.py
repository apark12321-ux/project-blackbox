"""
Project Blackbox — Module B: 서사 구조 엔지니어링 엔진
═══════════════════════════════════════════════════════
Module A의 큐레이션 데이터를 받아 3단 비즈니스 스크립트를 자동 생성합니다.

구조: [5초 후킹] → [팩트 기반 본문] → [Opinion Injector 결론]
"""
import random
import json
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

try:
    import httpx
except ImportError:
    httpx = None

logger = logging.getLogger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  후킹 전략 타입
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class HookType(str, Enum):
    FEAR = "fear"           # 공포/손실 자극: "아직도 모르면 손해봅니다"
    CURIOSITY = "curiosity" # 호기심 자극: "이것을 알면 인생이 바뀝니다"
    EMPATHY = "empathy"     # 공감 자극: "40대 가장이라면 꼭 보세요"
    SHOCK = "shock"         # 충격 자극: "전문가들도 놀란 사실"
    QUESTION = "question"   # 질문형: "혹시 이것도 해당되시나요?"


class OpinionTone(str, Enum):
    CRITICAL = "critical"       # 비판적 시각
    OPTIMISTIC = "optimistic"   # 긍정적 전망
    CAUTIOUS = "cautious"       # 신중한 분석
    CONTRARIAN = "contrarian"   # 역발상 관점


class ScriptSection(str, Enum):
    HOOK = "hook"           # 도입 5초 후킹
    BODY = "body"           # 팩트 기반 본문
    OPINION = "opinion"     # 주관적 견해 (Opinion Injector)
    CTA = "cta"             # 구독/좋아요 유도


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  데이터 클래스
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class ScriptBlock:
    """스크립트 단위 블록"""
    section: ScriptSection
    text: str
    duration_sec: float             # 예상 낭독 시간 (초)
    tts_emphasis: list[str] = field(default_factory=list)  # 강조할 단어 리스트
    subtitle_highlight: str = ""    # 화면에 강조 표시할 핵심 문구


@dataclass
class FullScript:
    """완성된 3단 스크립트"""
    keyword: str
    category: str
    hook_type: HookType
    opinion_tone: OpinionTone
    blocks: list[ScriptBlock]
    total_duration_sec: float
    metadata: dict = field(default_factory=dict)

    @property
    def hook_text(self) -> str:
        return next((b.text for b in self.blocks if b.section == ScriptSection.HOOK), "")

    @property
    def body_text(self) -> str:
        return " ".join(b.text for b in self.blocks if b.section == ScriptSection.BODY)

    @property
    def opinion_text(self) -> str:
        return next((b.text for b in self.blocks if b.section == ScriptSection.OPINION), "")

    @property
    def full_text(self) -> str:
        return " ".join(b.text for b in self.blocks)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  5초 후킹 로직
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 카테고리별 최적 후킹 전략 매핑
CATEGORY_HOOK_STRATEGY = {
    "economy": [HookType.FEAR, HookType.CURIOSITY, HookType.SHOCK],
    "senior":  [HookType.EMPATHY, HookType.FEAR, HookType.QUESTION],
    "selfdev": [HookType.CURIOSITY, HookType.QUESTION, HookType.EMPATHY],
    "tech":    [HookType.SHOCK, HookType.CURIOSITY, HookType.QUESTION],
    "life":    [HookType.EMPATHY, HookType.CURIOSITY, HookType.QUESTION],
}

# 후킹 템플릿 (키워드 자리에 {keyword} 사용)
HOOK_TEMPLATES = {
    HookType.FEAR: [
        "{keyword}, 아직도 모르고 계시면 큰 손해를 보실 수 있습니다.",
        "지금 {keyword}을 모르면, 당신만 뒤처질 수 있습니다.",
        "{keyword}에 대해 잘못 알고 계신 분들이 정말 많습니다.",
    ],
    HookType.CURIOSITY: [
        "{keyword}의 숨겨진 비밀, 오늘 전부 알려드리겠습니다.",
        "전문가들만 알고 있던 {keyword}의 핵심, 지금 공개합니다.",
        "{keyword}, 이 한 가지만 알면 완전히 달라집니다.",
    ],
    HookType.EMPATHY: [
        "{keyword} 때문에 고민이신 분들, 오늘 확실하게 정리해 드릴게요.",
        "매일 {keyword}을 걱정하시는 분들께 꼭 필요한 정보입니다.",
        "가족을 위해 {keyword}을 준비하고 계신다면, 이 영상이 도움이 될 겁니다.",
    ],
    HookType.SHOCK: [
        "{keyword}에 대해 충격적인 사실이 밝혀졌습니다.",
        "전문가도 놀란 {keyword}의 최신 변화, 지금 확인하세요.",
        "{keyword}의 판도가 완전히 바뀌었습니다. 무슨 일이 있었을까요?",
    ],
    HookType.QUESTION: [
        "혹시 {keyword}에 대해 제대로 알고 계신가요?",
        "{keyword}, 지금 이대로 괜찮을까요?",
        "여러분은 {keyword}을 어떻게 준비하고 계신가요?",
    ],
}


def select_hook_type(category: str, previous_hooks: list[HookType] = None) -> HookType:
    """
    카테고리별 최적 후킹 전략 선택
    이전에 사용한 후킹 타입을 피해 매번 다른 도입부를 생성
    """
    strategies = CATEGORY_HOOK_STRATEGY.get(category, [HookType.CURIOSITY])
    if previous_hooks:
        available = [h for h in strategies if h not in previous_hooks[-3:]]
        if available:
            return random.choice(available)
    return random.choice(strategies)


def generate_hook(keyword: str, hook_type: HookType) -> ScriptBlock:
    """5초 후킹 문구 생성"""
    templates = HOOK_TEMPLATES.get(hook_type, HOOK_TEMPLATES[HookType.CURIOSITY])
    text = random.choice(templates).format(keyword=keyword)

    # 낭독 시간 추정: 한국어 기준 초당 약 4.5글자
    duration = len(text) / 4.5

    return ScriptBlock(
        section=ScriptSection.HOOK,
        text=text,
        duration_sec=round(max(4.0, min(7.0, duration)), 1),
        tts_emphasis=[keyword],
        subtitle_highlight=keyword,
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Opinion Injector
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPINION_TEMPLATES = {
    OpinionTone.CRITICAL: [
        "하지만 여기서 한 가지 짚고 넘어가야 할 점이 있습니다. {point}라는 시각도 분명히 존재합니다.",
        "물론 이것이 전부는 아닙니다. 비판적으로 보면 {point}라는 한계가 있어요.",
    ],
    OpinionTone.OPTIMISTIC: [
        "개인적으로 이 변화는 긍정적이라고 봅니다. {point}라는 점에서 앞으로가 더 기대됩니다.",
        "저는 이 흐름이 결국 좋은 방향으로 갈 거라 생각합니다. 왜냐하면 {point}이기 때문이죠.",
    ],
    OpinionTone.CAUTIOUS: [
        "다만 신중하게 접근할 필요가 있습니다. {point}라는 변수를 반드시 고려하셔야 합니다.",
        "아직 확정된 것은 없으므로 서두르지 마시고, {point}를 꼼꼼히 확인해 보시길 권합니다.",
    ],
    OpinionTone.CONTRARIAN: [
        "하지만 저는 다수의 의견과 조금 다르게 생각합니다. 오히려 {point}가 핵심이 아닐까요?",
        "남들과 같은 시각으로만 보면 놓치는 것이 있습니다. {point}라는 관점도 고려해 보세요.",
    ],
}


def select_opinion_tone(previous_tones: list[OpinionTone] = None) -> OpinionTone:
    """매번 다른 Opinion 톤 선택 (비정형성 확보)"""
    all_tones = list(OpinionTone)
    if previous_tones:
        available = [t for t in all_tones if t not in previous_tones[-2:]]
        if available:
            return random.choice(available)
    return random.choice(all_tones)


def generate_opinion(
    keyword: str,
    opinion_tone: OpinionTone,
    opinion_seed: str = "",
) -> ScriptBlock:
    """Opinion Injector: 주관적 견해 자동 생성"""
    templates = OPINION_TEMPLATES.get(opinion_tone, OPINION_TEMPLATES[OpinionTone.CAUTIOUS])
    point = opinion_seed if opinion_seed else f"{keyword}의 장기적 영향"
    text = random.choice(templates).format(point=point)

    # CTA 멘트 추가
    cta_variants = [
        f"오늘 이 정보가 도움이 되셨다면, 구독과 좋아요로 응원해 주세요.",
        f"다음 영상에서는 더 깊이 있는 분석을 준비하겠습니다. 구독 부탁드립니다.",
        f"이런 유익한 정보를 놓치지 않으시려면, 알림 설정까지 부탁드릴게요.",
    ]
    text += " " + random.choice(cta_variants)

    duration = len(text) / 4.5
    return ScriptBlock(
        section=ScriptSection.OPINION,
        text=text,
        duration_sec=round(duration, 1),
        tts_emphasis=["개인적으로", "저는", "하지만"],
        subtitle_highlight="오늘의 블랙박스 결론",
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 스크립트 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ScriptEngine:
    """
    Module B 핵심: 3단 스크립트 자동 생성 엔진

    Input: Module A의 큐레이션 결과 (keyword, category, news_summary, opinion_seeds)
    Output: FullScript (hook + body + opinion)
    """

    def __init__(self, gemini_api_key: str = ""):
        self.gemini_key = gemini_api_key
        self.client = httpx.AsyncClient(timeout=60.0) if (gemini_api_key and httpx) else None

    async def generate_full_script(
        self,
        keyword: str,
        category: str,
        news_summary: str,
        core_facts: list[str] = None,
        opinion_seeds: list[str] = None,
        hook_triggers: list[str] = None,
        previous_hooks: list[HookType] = None,
        previous_tones: list[OpinionTone] = None,
        target_duration_sec: float = 180.0,
    ) -> FullScript:
        """
        3단 스크립트 생성 파이프라인

        1. 5초 후킹 문구 생성
        2. Gemini API로 팩트 기반 본문 작성
        3. Opinion Injector로 주관적 결론 추가
        """
        # 1. 후킹
        hook_type = select_hook_type(category, previous_hooks)
        hook_block = generate_hook(keyword, hook_type)

        # 2. 본문 (Gemini API or fallback)
        body_blocks = await self._generate_body(
            keyword, category, news_summary,
            core_facts or [],
            target_duration_sec - hook_block.duration_sec - 20,
        )

        # 3. Opinion Injector
        opinion_tone = select_opinion_tone(previous_tones)
        seed = random.choice(opinion_seeds) if opinion_seeds else ""
        opinion_block = generate_opinion(keyword, opinion_tone, seed)

        # 전체 조립
        all_blocks = [hook_block] + body_blocks + [opinion_block]
        total = sum(b.duration_sec for b in all_blocks)

        return FullScript(
            keyword=keyword,
            category=category,
            hook_type=hook_type,
            opinion_tone=opinion_tone,
            blocks=all_blocks,
            total_duration_sec=round(total, 1),
            metadata={
                "hook_type": hook_type.value,
                "opinion_tone": opinion_tone.value,
                "target_duration": target_duration_sec,
                "body_paragraphs": len(body_blocks),
            },
        )

    async def _generate_body(
        self,
        keyword: str,
        category: str,
        news_summary: str,
        core_facts: list[str],
        target_sec: float,
    ) -> list[ScriptBlock]:
        """본문 생성 — Gemini API 호출 or 팩트 기반 폴백"""

        if self.gemini_key and self.client:
            return await self._gemini_body(keyword, category, news_summary, core_facts, target_sec)

        # Fallback: 뉴스 요약 기반 직접 구성
        return self._fallback_body(keyword, news_summary, core_facts, target_sec)

    async def _gemini_body(
        self, keyword, category, news_summary, core_facts, target_sec
    ) -> list[ScriptBlock]:
        """Gemini API를 활용한 고품질 본문 생성"""
        target_chars = int(target_sec * 4.5)
        facts_text = "\n".join(f"- {f}" for f in core_facts) if core_facts else "없음"

        prompt = f"""당신은 유튜브 정보 채널의 전문 스크립트 작가입니다.
다음 정보를 바탕으로 유튜브 영상 본문 스크립트를 작성하세요.

키워드: {keyword}
카테고리: {category}
뉴스 요약: {news_summary}
핵심 팩트:
{facts_text}

요구사항:
- 총 {target_chars}자 내외 (약 {int(target_sec)}초 분량)
- 3~4개 문단으로 구성
- 각 문단은 하나의 핵심 포인트를 전달
- 시청자가 이해하기 쉬운 구어체 사용
- 숫자나 데이터를 포함하여 신뢰성 확보
- 도입부(후킹)와 결론(의견)은 제외하고 본문만 작성

JSON 배열로만 반환하세요:
[
  {{"paragraph": "문단 내용", "key_phrase": "핵심 문구"}},
  ...
]"""

        try:
            resp = await self.client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
                params={"key": self.gemini_key},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048},
                },
            )
            resp.raise_for_status()
            text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            clean = text.strip()
            if clean.startswith("```"):
                clean = clean.split("\n", 1)[1].rsplit("```", 1)[0]

            paragraphs = json.loads(clean)
            blocks = []
            for p in paragraphs:
                t = p.get("paragraph", "")
                blocks.append(ScriptBlock(
                    section=ScriptSection.BODY,
                    text=t,
                    duration_sec=round(len(t) / 4.5, 1),
                    subtitle_highlight=p.get("key_phrase", ""),
                ))
            return blocks
        except Exception as e:
            logger.error(f"Gemini body generation failed: {e}")
            return self._fallback_body(keyword, news_summary, core_facts, target_sec)

    def _fallback_body(self, keyword, news_summary, core_facts, target_sec) -> list[ScriptBlock]:
        """API 없이 팩트 기반 본문 구성"""
        blocks = []

        # 뉴스 요약 기반 도입
        intro = f"최근 {keyword}에 대해 중요한 변화가 있었습니다. {news_summary}"
        blocks.append(ScriptBlock(
            section=ScriptSection.BODY,
            text=intro,
            duration_sec=round(len(intro) / 4.5, 1),
            subtitle_highlight=keyword,
        ))

        # 팩트 전개
        for i, fact in enumerate(core_facts[:3]):
            connector = ["먼저", "또한", "마지막으로"][min(i, 2)]
            text = f"{connector}, {fact}"
            blocks.append(ScriptBlock(
                section=ScriptSection.BODY,
                text=text,
                duration_sec=round(len(text) / 4.5, 1),
            ))

        return blocks


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  변수형 공통 문구 생성 (매번 다른 인트로/아웃트로)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DYNAMIC_INTROS = [
    "안녕하세요, 블랙박스 채널입니다.",
    "여러분의 든든한 정보 파트너, 블랙박스입니다.",
    "오늘도 핵심만 짚어드리는 블랙박스입니다.",
    "안녕하세요, 매일 새로운 인사이트를 전하는 블랙박스입니다.",
    "실생활에 바로 쓸 수 있는 정보, 블랙박스가 준비했습니다.",
]

DYNAMIC_OUTROS = [
    "오늘 영상이 도움이 되셨다면 구독과 좋아요 부탁드립니다.",
    "다음 영상에서 더 유익한 정보로 찾아뵙겠습니다.",
    "궁금한 점은 댓글로 남겨주세요, 다음 영상에서 다뤄보겠습니다.",
    "여러분의 소중한 시간에 보답하는 블랙박스가 되겠습니다.",
]


def get_dynamic_intro() -> str:
    return random.choice(DYNAMIC_INTROS)

def get_dynamic_outro() -> str:
    return random.choice(DYNAMIC_OUTROS)
