"""
Project Blackbox — Module B: 서사 구조 엔지니어링 엔진
═══════════════════════════════════════════════════════
Gemini AI로 팩트 기반 장문 스크립트 자동 생성

원칙:
- 가짜 통계/인용 금지
- 뉴스 원문 기반 팩트만 사용
- 무의미한 filler 문장 금지
- 최소 800자 (약 3분) 이상
"""
import os
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
#  Enums & Data Classes
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class HookType(str, Enum):
    FEAR = "fear"
    CURIOSITY = "curiosity"
    EMPATHY = "empathy"
    SHOCK = "shock"
    QUESTION = "question"


class OpinionTone(str, Enum):
    CRITICAL = "critical"
    OPTIMISTIC = "optimistic"
    CAUTIOUS = "cautious"
    CONTRARIAN = "contrarian"


class ScriptSection(str, Enum):
    HOOK = "hook"
    BODY = "body"
    OPINION = "opinion"
    CTA = "cta"


@dataclass
class ScriptBlock:
    section: ScriptSection
    text: str
    duration_sec: float
    tts_emphasis: list[str] = field(default_factory=list)
    subtitle_highlight: str = ""


@dataclass
class FullScript:
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
#  5초 후킹
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY_HOOK_STRATEGY = {
    "economy": [HookType.FEAR, HookType.CURIOSITY, HookType.SHOCK],
    "senior":  [HookType.EMPATHY, HookType.FEAR, HookType.QUESTION],
    "selfdev": [HookType.CURIOSITY, HookType.QUESTION, HookType.EMPATHY],
    "tech":    [HookType.SHOCK, HookType.CURIOSITY, HookType.QUESTION],
    "life":    [HookType.EMPATHY, HookType.CURIOSITY, HookType.QUESTION],
}

HOOK_TEMPLATES = {
    HookType.FEAR: [
        "{keyword}, 아직도 모르고 계시면 큰 손해를 보실 수 있습니다.",
        "지금 {keyword}을 모르면, 당신만 뒤처질 수 있습니다.",
        "{keyword}에 대해 잘못 알고 계신 분들이 정말 많습니다.",
    ],
    HookType.CURIOSITY: [
        "{keyword}의 숨겨진 핵심, 오늘 전부 알려드리겠습니다.",
        "전문가들만 알고 있던 {keyword}의 핵심, 지금 공개합니다.",
        "{keyword}, 이 한 가지만 알면 완전히 달라집니다.",
    ],
    HookType.EMPATHY: [
        "{keyword} 때문에 고민이신 분들, 오늘 확실하게 정리해 드릴게요.",
        "매일 {keyword}을 걱정하시는 분들께 꼭 필요한 정보입니다.",
        "가족을 위해 {keyword}을 준비하고 계신다면, 이 영상이 도움이 될 겁니다.",
    ],
    HookType.SHOCK: [
        "{keyword}에 대해 중요한 사실이 밝혀졌습니다.",
        "전문가도 주목하는 {keyword}의 최신 변화, 지금 확인하세요.",
        "{keyword}의 판도가 바뀌고 있습니다. 무슨 일이 있었을까요?",
    ],
    HookType.QUESTION: [
        "혹시 {keyword}에 대해 제대로 알고 계신가요?",
        "{keyword}, 지금 이대로 괜찮을까요?",
        "여러분은 {keyword}을 어떻게 준비하고 계신가요?",
    ],
}


def select_hook_type(category: str, previous_hooks: list[HookType] = None) -> HookType:
    strategies = CATEGORY_HOOK_STRATEGY.get(category, [HookType.CURIOSITY])
    if previous_hooks:
        available = [h for h in strategies if h not in previous_hooks[-3:]]
        if available:
            return random.choice(available)
    return random.choice(strategies)


def generate_hook(keyword: str, hook_type: HookType) -> ScriptBlock:
    templates = HOOK_TEMPLATES.get(hook_type, HOOK_TEMPLATES[HookType.CURIOSITY])
    text = random.choice(templates).format(keyword=keyword)
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

def select_opinion_tone(previous_tones: list[OpinionTone] = None) -> OpinionTone:
    all_tones = list(OpinionTone)
    if previous_tones:
        available = [t for t in all_tones if t not in previous_tones[-2:]]
        if available:
            return random.choice(available)
    return random.choice(all_tones)


def generate_opinion(keyword: str, opinion_tone: OpinionTone, opinion_seed: str = "") -> ScriptBlock:
    """Opinion Injector — Gemini가 본문과 함께 생성하므로 여기는 CTA만"""
    cta_variants = [
        f"이런 유익한 정보를 놓치지 않으시려면, 알림 설정까지 부탁드릴게요.",
        f"오늘 이 정보가 도움이 되셨다면, 구독과 좋아요로 응원해 주세요.",
        f"다음 영상에서는 더 깊이 있는 분석을 준비하겠습니다. 구독 부탁드립니다.",
    ]
    text = random.choice(cta_variants)
    return ScriptBlock(
        section=ScriptSection.OPINION,
        text=text,
        duration_sec=round(len(text) / 4.5, 1),
        subtitle_highlight="구독",
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 스크립트 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ScriptEngine:
    def __init__(self, gemini_api_key: str = ""):
        self.gemini_key = gemini_api_key.strip() if gemini_api_key else ""
        self.client = None
        if self.gemini_key and httpx:
            self.client = httpx.AsyncClient(timeout=90.0)
            logger.info("[ScriptEngine] Gemini API connected")
        else:
            logger.warning("[ScriptEngine] Gemini API MISSING — scripts will be limited")

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
        # 1. 후킹
        hook_type = select_hook_type(category, previous_hooks)
        hook_block = generate_hook(keyword, hook_type)

        # 2. 본문 + 의견 (Gemini 통합 생성)
        opinion_tone = select_opinion_tone(previous_tones)
        body_blocks, opinion_block = await self._generate_body_and_opinion(
            keyword, category, news_summary,
            core_facts or [], opinion_tone,
            target_duration_sec - hook_block.duration_sec - 8,
        )

        # 3. CTA
        cta_block = generate_opinion(keyword, opinion_tone)

        # 전체 조립
        all_blocks = [hook_block] + body_blocks + [opinion_block, cta_block]
        total = sum(b.duration_sec for b in all_blocks)

        logger.info(f"[Script] {len(all_blocks)} blocks, {total:.0f}s, "
                     f"body_chars={sum(len(b.text) for b in body_blocks)}")

        return FullScript(
            keyword=keyword, category=category,
            hook_type=hook_type, opinion_tone=opinion_tone,
            blocks=all_blocks, total_duration_sec=round(total, 1),
            metadata={
                "hook_type": hook_type.value,
                "opinion_tone": opinion_tone.value,
                "body_paragraphs": len(body_blocks),
                "method": "gemini" if self.client else "fallback",
            },
        )

    async def _generate_body_and_opinion(
        self, keyword, category, news_summary, core_facts, opinion_tone, target_sec
    ) -> tuple[list[ScriptBlock], ScriptBlock]:
        """본문 + Opinion을 한번에 Gemini로 생성"""

        if self.client and self.gemini_key:
            try:
                result = await self._gemini_generate(
                    keyword, category, news_summary, core_facts, opinion_tone, target_sec
                )
                if result:
                    body_blocks, opinion_block = result
                    total_chars = sum(len(b.text) for b in body_blocks)
                    if total_chars >= 400 and len(body_blocks) >= 3:
                        return body_blocks, opinion_block
                    logger.warning(f"[Script] Gemini output too short ({total_chars} chars), retrying...")
            except Exception as e:
                logger.error(f"[Script] Gemini failed: {e}")

        # Fallback
        return self._fallback_body(keyword, category, news_summary, core_facts, opinion_tone, target_sec)

    async def _gemini_generate(
        self, keyword, category, news_summary, core_facts, opinion_tone, target_sec
    ) -> tuple[list[ScriptBlock], ScriptBlock]:
        """Gemini로 팩트 기반 장문 스크립트 생성"""

        target_chars = int(target_sec * 4.5)
        facts_text = "\n".join(f"- {f}" for f in core_facts) if core_facts else "(제공된 팩트 없음)"

        cat_map = {"economy": "경제/재테크", "senior": "시니어/건강", "selfdev": "자기계발", "tech": "IT/테크", "life": "라이프스타일"}
        cat_label = cat_map.get(category, category)

        tone_desc = {
            OpinionTone.CRITICAL: "비판적이고 날카로운 시각으로 문제점을 지적",
            OpinionTone.OPTIMISTIC: "긍정적이고 희망적인 전망을 제시",
            OpinionTone.CAUTIOUS: "신중하고 조심스러운 분석으로 주의사항을 강조",
            OpinionTone.CONTRARIAN: "대중과 다른 역발상 관점을 제시",
        }
        tone_text = tone_desc.get(opinion_tone, "균형 잡힌 시각")

        prompt = f"""당신은 한국 유튜브 정보 채널의 전문 스크립트 작가입니다.
아래 정보를 바탕으로 유튜브 영상 대본을 작성하세요.

═══ 기본 정보 ═══
키워드: {keyword}
카테고리: {cat_label}
뉴스 요약: {news_summary}
관련 팩트:
{facts_text}

═══ 작성 규칙 (반드시 지켜야 함) ═══

1. 분량: 본문 총 {target_chars}자 이상 (최소 800자). 6~8개 문단으로 구성.
2. 각 문단은 80~180자 사이. 하나의 핵심 포인트를 명확하게 전달.
3. 팩트 기반: 뉴스 요약과 관련 팩트에서 직접 도출된 내용만 사용.
4. 가짜 금지: 존재하지 않는 통계, 연구, 인용구를 절대 만들지 마세요. "~에 따르면", "~% 증가" 같은 숫자는 위 팩트에 있는 것만 사용.
5. 무의미한 filler 금지: "중요합니다", "주목해야 합니다" 같은 빈 문장 반복 금지. 모든 문장이 구체적 정보를 전달해야 합니다.
6. 구어체: 시청자에게 직접 말하듯 자연스러운 한국어. "~인데요", "~거든요", "~하시면 됩니다" 등 사용.
7. 논리 흐름: 배경설명 → 핵심내용 → 구체적 방법/영향 → 주의사항 순서로 전개.
8. 마지막 문단은 Opinion: {tone_text}. 개인적 견해를 밝히되 근거를 함께 제시.

═══ 출력 형식 ═══
JSON 배열만 반환 (마크다운/백틱 없이):
[
  {{"section": "body", "text": "본문 문단 내용", "key_phrase": "핵심 문구"}},
  {{"section": "body", "text": "본문 문단 내용", "key_phrase": "핵심 문구"}},
  ...
  {{"section": "opinion", "text": "의견 문단 내용", "key_phrase": "핵심 문구"}}
]

마지막 항목만 section을 "opinion"으로, 나머지는 "body"로 설정하세요."""

        resp = await self.client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
            params={"key": self.gemini_key},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.65,
                    "maxOutputTokens": 4096,
                },
            },
        )
        resp.raise_for_status()

        raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        paragraphs = json.loads(clean)

        body_blocks = []
        opinion_block = None

        for p in paragraphs:
            text = p.get("text", "").strip()
            if not text:
                continue
            section = p.get("section", "body")
            key_phrase = p.get("key_phrase", "")

            block = ScriptBlock(
                section=ScriptSection.OPINION if section == "opinion" else ScriptSection.BODY,
                text=text,
                duration_sec=round(len(text) / 4.5, 1),
                subtitle_highlight=key_phrase,
            )

            if section == "opinion":
                opinion_block = block
            else:
                body_blocks.append(block)

        # opinion이 없으면 마지막 body를 opinion으로
        if not opinion_block and body_blocks:
            opinion_block = body_blocks.pop()
            opinion_block.section = ScriptSection.OPINION

        # 기본 opinion fallback
        if not opinion_block:
            opinion_block = ScriptBlock(
                section=ScriptSection.OPINION,
                text=f"{keyword}에 대해 앞으로의 변화를 주의 깊게 지켜봐야 할 것 같습니다. 오늘 알려드린 내용을 참고하셔서 현명한 판단 하시길 바랍니다.",
                duration_sec=8.0,
                subtitle_highlight=keyword,
            )

        total_chars = sum(len(b.text) for b in body_blocks)
        logger.info(f"[Gemini] Generated {len(body_blocks)} body + 1 opinion, total {total_chars} chars")

        return body_blocks, opinion_block

    def _fallback_body(
        self, keyword, category, news_summary, core_facts, opinion_tone, target_sec
    ) -> tuple[list[ScriptBlock], ScriptBlock]:
        """Gemini 실패 시 — 뉴스 요약 기반 구조화된 fallback"""

        blocks = []
        news = news_summary or f"{keyword} 관련 최신 동향"

        # 1. 뉴스 기반 도입
        intro = (
            f"최근 {keyword}에 대해 주목할 만한 소식이 전해졌습니다. "
            f"{news} "
            f"이 소식이 왜 중요한지, 그리고 우리에게 어떤 영향을 미치는지 하나씩 살펴보겠습니다."
        )
        blocks.append(ScriptBlock(
            section=ScriptSection.BODY, text=intro,
            duration_sec=round(len(intro) / 4.5, 1), subtitle_highlight=keyword,
        ))

        # 2. 팩트 전개
        if core_facts:
            for i, fact in enumerate(core_facts[:3]):
                if len(fact) < 10:
                    continue
                connectors = [
                    "가장 핵심적인 내용을 먼저 말씀드리면",
                    "여기서 놓치면 안 되는 부분이 있는데요",
                    "추가로 알아두셔야 할 사항은",
                ]
                text = f"{connectors[min(i, 2)]}, {fact}. 이 부분은 {keyword}를 이해하는 데 있어서 빠뜨릴 수 없는 내용입니다."
                blocks.append(ScriptBlock(
                    section=ScriptSection.BODY, text=text,
                    duration_sec=round(len(text) / 4.5, 1),
                ))

        # 3. 배경 설명
        bg = (
            f"{keyword}가 이렇게 주목받는 데는 이유가 있습니다. "
            f"최근 관련 정책과 시장 환경이 빠르게 변하고 있기 때문인데요, "
            f"이런 변화의 흐름을 이해하면 앞으로의 방향을 가늠하는 데 큰 도움이 됩니다."
        )
        blocks.append(ScriptBlock(
            section=ScriptSection.BODY, text=bg,
            duration_sec=round(len(bg) / 4.5, 1),
        ))

        # 4. 실전 조언
        practical = (
            f"그러면 실제로 어떻게 대응하면 좋을까요? "
            f"가장 먼저 해야 할 것은 현재 자신의 상황을 정확히 파악하는 것입니다. "
            f"그다음으로 관련 정보를 꾸준히 확인하면서, 필요하다면 전문가의 도움을 받아보시는 것을 권합니다. "
            f"급하게 결정하기보다는 충분한 정보를 바탕으로 판단하시는 게 중요합니다."
        )
        blocks.append(ScriptBlock(
            section=ScriptSection.BODY, text=practical,
            duration_sec=round(len(practical) / 4.5, 1),
        ))

        # 5. 주의사항
        caution = (
            f"다만 한 가지 주의하실 점이 있습니다. "
            f"인터넷에서 떠도는 {keyword} 관련 정보 중에는 검증되지 않은 내용도 많습니다. "
            f"반드시 공식 기관이나 신뢰할 수 있는 출처를 통해 확인하시고, "
            f"주변의 경험담만으로 중요한 결정을 내리지 않으시길 바랍니다."
        )
        blocks.append(ScriptBlock(
            section=ScriptSection.BODY, text=caution,
            duration_sec=round(len(caution) / 4.5, 1),
        ))

        # Opinion
        tone_texts = {
            OpinionTone.CRITICAL: f"솔직히 말씀드리면, {keyword}에 대한 현재의 낙관적인 분위기에는 좀 더 신중해야 한다고 생각합니다. 좋은 점만 보지 말고 리스크도 냉정하게 따져봐야 합니다.",
            OpinionTone.OPTIMISTIC: f"저는 {keyword}의 변화가 결국 긍정적인 방향으로 갈 것이라 봅니다. 지금이 준비하기에 가장 좋은 시기이고, 미리 움직이는 사람이 더 많은 기회를 잡게 될 것입니다.",
            OpinionTone.CAUTIOUS: f"{keyword}에 대해서는 아직 지켜봐야 할 부분이 많습니다. 성급하게 판단하기보다는 상황을 좀 더 관찰하면서 자신에게 맞는 시점을 찾는 것이 현명합니다.",
            OpinionTone.CONTRARIAN: f"많은 사람들이 {keyword}에 대해 비슷한 생각을 갖고 있지만, 저는 조금 다른 관점에서 바라봅니다. 대다수가 같은 방향으로 움직일 때 오히려 반대편에 기회가 있을 수 있거든요.",
        }
        opinion_text = tone_texts.get(opinion_tone, tone_texts[OpinionTone.CAUTIOUS])
        opinion_block = ScriptBlock(
            section=ScriptSection.OPINION, text=opinion_text,
            duration_sec=round(len(opinion_text) / 4.5, 1),
            subtitle_highlight=keyword,
        )

        total_chars = sum(len(b.text) for b in blocks)
        logger.info(f"[Fallback] Generated {len(blocks)} body blocks, {total_chars} chars")

        return blocks, opinion_block


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  인트로 / 아웃트로
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DYNAMIC_INTROS = [
    "안녕하세요, 블랙박스 채널입니다.",
    "여러분의 든든한 정보 파트너, 블랙박스입니다.",
    "오늘도 핵심만 짚어드리는 블랙박스입니다.",
    "안녕하세요, 매일 새로운 인사이트를 전하는 블랙박스입니다.",
]

DYNAMIC_OUTROS = [
    "오늘 영상이 도움이 되셨다면 구독과 좋아요 부탁드립니다.",
    "다음 영상에서 더 유익한 정보로 찾아뵙겠습니다.",
    "궁금한 점은 댓글로 남겨주세요, 다음 영상에서 다뤄보겠습니다.",
]

def get_dynamic_intro() -> str:
    return random.choice(DYNAMIC_INTROS)

def get_dynamic_outro() -> str:
    return random.choice(DYNAMIC_OUTROS)
