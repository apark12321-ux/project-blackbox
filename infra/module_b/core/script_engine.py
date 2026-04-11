"""
Project Blackbox — Module B: 서사 구조 엔지니어링 엔진 + 벤치마킹
═══════════════════════════════════════════════════════
- 인기 영상 벤치마킹 → 성공 패턴 분석 → 대본에 반영
- Gemini AI 팩트 기반 장문 스크립트
- 최소 2,500자 (8~10분 분량)
- 가짜 통계/인용 금지, 무의미 filler 금지
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
    def full_text(self) -> str:
        return " ".join(b.text for b in self.blocks)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  후킹
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
    ],
    HookType.CURIOSITY: [
        "{keyword}의 숨겨진 핵심, 오늘 전부 알려드리겠습니다.",
        "전문가들만 알고 있던 {keyword}의 핵심, 지금 공개합니다.",
    ],
    HookType.EMPATHY: [
        "{keyword} 때문에 고민이신 분들, 오늘 확실하게 정리해 드릴게요.",
        "가족을 위해 {keyword}을 준비하고 계신다면, 이 영상이 도움이 될 겁니다.",
    ],
    HookType.SHOCK: [
        "{keyword}에 대해 중요한 사실이 밝혀졌습니다.",
        "전문가도 주목하는 {keyword}의 최신 변화, 지금 확인하세요.",
    ],
    HookType.QUESTION: [
        "혹시 {keyword}에 대해 제대로 알고 계신가요?",
        "여러분은 {keyword}을 어떻게 준비하고 계신가요?",
    ],
}

def select_hook_type(category, previous_hooks=None):
    strategies = CATEGORY_HOOK_STRATEGY.get(category, [HookType.CURIOSITY])
    if previous_hooks:
        available = [h for h in strategies if h not in previous_hooks[-3:]]
        if available: return random.choice(available)
    return random.choice(strategies)

def generate_hook(keyword, hook_type):
    templates = HOOK_TEMPLATES.get(hook_type, HOOK_TEMPLATES[HookType.CURIOSITY])
    text = random.choice(templates).format(keyword=keyword)
    return ScriptBlock(section=ScriptSection.HOOK, text=text,
        duration_sec=round(max(4.0, min(7.0, len(text)/4.5)), 1),
        tts_emphasis=[keyword], subtitle_highlight=keyword)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  CTA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def select_opinion_tone(previous_tones=None):
    all_tones = list(OpinionTone)
    if previous_tones:
        available = [t for t in all_tones if t not in previous_tones[-2:]]
        if available: return random.choice(available)
    return random.choice(all_tones)

def generate_cta():
    texts = [
        "이런 유익한 정보를 놓치지 않으시려면, 알림 설정까지 부탁드릴게요.",
        "오늘 이 정보가 도움이 되셨다면, 구독과 좋아요로 응원해 주세요.",
        "다음 영상에서는 더 깊이 있는 분석을 준비하겠습니다. 구독 부탁드립니다.",
    ]
    text = random.choice(texts)
    return ScriptBlock(section=ScriptSection.CTA, text=text,
        duration_sec=round(len(text)/4.5, 1), subtitle_highlight="구독")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  벤치마킹
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _fetch_benchmarks(category):
    try:
        import httpx
        port = os.getenv("PORT", "8080")
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(f"http://localhost:{port}/api/v1/curation/benchmarks/{category}")
            if resp.status_code == 200:
                return resp.json().get("benchmarks", [])
    except Exception as e:
        logger.warning(f"[Benchmark] {e}")
    return []

def _format_benchmarks(benchmarks):
    if not benchmarks: return "(벤치마킹 데이터 없음)"
    lines = []
    for i, bm in enumerate(benchmarks[:10], 1):
        title = bm.get("title", "")
        channel = bm.get("channel", "")
        if title:
            lines.append(f"{i}. [{channel}] {title}")
    return "\n".join(lines)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  스크립트 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ScriptEngine:
    def __init__(self, gemini_api_key=""):
        self.gemini_key = gemini_api_key.strip() if gemini_api_key else ""
        self.client = None
        if self.gemini_key and httpx:
            self.client = httpx.AsyncClient(timeout=120.0)
            logger.info("[ScriptEngine] Gemini connected")

    async def generate_full_script(
        self, keyword, category, news_summary,
        core_facts=None, opinion_seeds=None, hook_triggers=None,
        previous_hooks=None, previous_tones=None,
        target_duration_sec=480.0,  # ★ 기본 8분
    ):
        benchmarks = await _fetch_benchmarks(category)
        hook_type = select_hook_type(category, previous_hooks)
        hook_block = generate_hook(keyword, hook_type)
        opinion_tone = select_opinion_tone(previous_tones)

        body_blocks, opinion_block = await self._generate_body_and_opinion(
            keyword, category, news_summary,
            core_facts or [], opinion_tone, benchmarks,
            target_duration_sec - hook_block.duration_sec - 10,
        )

        cta_block = generate_cta()
        all_blocks = [hook_block] + body_blocks + [opinion_block, cta_block]
        total = sum(b.duration_sec for b in all_blocks)
        total_chars = sum(len(b.text) for b in all_blocks)

        logger.info(f"[Script] {len(all_blocks)} blocks, {total:.0f}s, {total_chars} chars")

        return FullScript(
            keyword=keyword, category=category,
            hook_type=hook_type, opinion_tone=opinion_tone,
            blocks=all_blocks, total_duration_sec=round(total, 1),
            metadata={
                "hook_type": hook_type.value, "opinion_tone": opinion_tone.value,
                "body_paragraphs": len(body_blocks),
                "total_chars": total_chars,
                "method": "gemini+benchmark" if self.client and benchmarks else "gemini" if self.client else "fallback",
            },
        )

    async def _generate_body_and_opinion(self, keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec):
        if self.client and self.gemini_key:
            try:
                result = await self._gemini_generate(keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec)
                if result:
                    body_blocks, opinion_block = result
                    total_chars = sum(len(b.text) for b in body_blocks)
                    if total_chars >= 1500 and len(body_blocks) >= 6:
                        return body_blocks, opinion_block
                    logger.warning(f"[Script] Gemini too short ({total_chars} chars, {len(body_blocks)} blocks), using fallback")
            except Exception as e:
                logger.error(f"[Script] Gemini failed: {e}")
        return self._fallback_body(keyword, category, news_summary, core_facts, opinion_tone, target_sec)

    async def _gemini_generate(self, keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec):
        target_chars = max(2500, int(target_sec * 4.5))
        facts_text = "\n".join(f"- {f}" for f in core_facts) if core_facts else "(없음)"

        cat_map = {"economy": "경제/재테크", "senior": "시니어/건강", "selfdev": "자기계발", "tech": "IT/테크", "life": "라이프스타일"}
        cat_label = cat_map.get(category, category)

        tone_desc = {
            OpinionTone.CRITICAL: "비판적이고 날카로운 시각으로 문제점을 지적하되 대안도 제시",
            OpinionTone.OPTIMISTIC: "긍정적이고 희망적인 전망을 근거와 함께 제시",
            OpinionTone.CAUTIOUS: "신중하고 조심스러운 분석으로 리스크와 주의사항을 강조",
            OpinionTone.CONTRARIAN: "대중과 다른 역발상 관점을 논리적 근거와 함께 제시",
        }
        tone_text = tone_desc.get(opinion_tone, "균형 잡힌 시각")
        benchmark_text = _format_benchmarks(benchmarks)

        prompt = f"""당신은 한국 유튜브 정보 채널의 전문 스크립트 작가입니다.

═══ 기본 정보 ═══
키워드: {keyword}
카테고리: {cat_label}
뉴스 요약: {news_summary}
관련 팩트:
{facts_text}

═══ 벤치마킹: 조회수 높은 인기 영상 ═══
{benchmark_text}
→ 위 영상들의 제목 구조, 전개 방식, 말투 패턴을 분석해서 대본에 반영하세요. 내용을 베끼지는 마세요.

═══ 작성 규칙 ═══

1. 분량: 본문 총 {target_chars}자 이상. 10~15개 문단으로 구성. 절대 이보다 짧게 쓰지 마세요.
2. 각 문단은 120~250자. 하나의 핵심 포인트를 구체적으로 전달.
3. 팩트 기반: 뉴스 요약과 팩트에서 도출된 내용만 사용. 없는 정보를 지어내지 마세요.
4. 가짜 금지: 존재하지 않는 통계, 연구, 인용구 절대 금지. "%", "연구에 따르면" 등은 위 팩트에 있는 것만 사용.
5. filler 금지: "중요합니다", "주목해야 합니다", "살펴보겠습니다" 같은 빈 문장 반복 금지. 모든 문장은 구체적 정보를 전달.
6. 구어체: 시청자에게 직접 말하듯 자연스러운 한국어. "~인데요", "~거든요", "~하시면 됩니다" 등.
7. 전개 구조 (이 순서대로):
   - 도입 (1문단): 이 주제가 왜 지금 중요한지
   - 배경 (2문단): 현재 상황과 맥락 설명
   - 핵심 분석 (3~4문단): 구체적 내용 깊이 있게 풀어서 설명
   - 실전 적용 (2~3문단): 시청자가 실제로 어떻게 활용할 수 있는지
   - 주의사항 (1~2문단): 흔한 실수나 주의할 점
   - 정리 (1문단): 핵심 내용 3줄 요약
   - Opinion (1문단): {tone_text}
8. 청자 유지율을 높이기 위해 중간중간 질문형 문장 사용 ("그런데 여기서 의문이 생기죠?", "그렇다면 어떻게 해야 할까요?")
9. 마지막 문단만 section을 "opinion"으로, 나머지는 "body"로 설정.

═══ 출력 형식 ═══
JSON 배열만 반환 (마크다운/백틱 없이):
[
  {{"section": "body", "text": "문단 내용 120~250자", "key_phrase": "핵심 문구"}},
  ...
  {{"section": "opinion", "text": "의견 문단", "key_phrase": "핵심 문구"}}
]"""

        resp = await self.client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
            params={"key": self.gemini_key},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.65, "maxOutputTokens": 8192},
            },
        )
        resp.raise_for_status()
        raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        paragraphs = json.loads(clean)
        body_blocks, opinion_block = [], None

        for p in paragraphs:
            text = p.get("text", "").strip()
            if not text: continue
            block = ScriptBlock(
                section=ScriptSection.OPINION if p.get("section") == "opinion" else ScriptSection.BODY,
                text=text, duration_sec=round(len(text)/4.5, 1),
                subtitle_highlight=p.get("key_phrase", ""),
            )
            if p.get("section") == "opinion":
                opinion_block = block
            else:
                body_blocks.append(block)

        if not opinion_block and body_blocks:
            opinion_block = body_blocks.pop()
            opinion_block.section = ScriptSection.OPINION
        if not opinion_block:
            opinion_block = ScriptBlock(section=ScriptSection.OPINION,
                text=f"{keyword}에 대해 앞으로의 변화를 주의 깊게 지켜봐야 할 것 같습니다. 오늘 말씀드린 내용을 잘 기억하시고, 자신의 상황에 맞게 판단하시길 바랍니다.",
                duration_sec=10.0, subtitle_highlight=keyword)

        total_chars = sum(len(b.text) for b in body_blocks)
        logger.info(f"[Gemini] {len(body_blocks)} body + 1 opinion, {total_chars} chars")
        return body_blocks, opinion_block

    def _fallback_body(self, keyword, category, news_summary, core_facts, opinion_tone, target_sec):
        """Gemini 실패 시 — 구조화된 장문 fallback"""
        blocks = []
        news = news_summary or f"{keyword} 관련 최신 동향"

        # 1. 도입
        blocks.append(self._block(
            f"최근 {keyword}에 대해 주목할 만한 변화가 있었습니다. {news} "
            f"많은 분들이 이 주제에 관심을 갖고 계신데요, 오늘 영상에서는 핵심만 뽑아서 누구나 이해할 수 있도록 정리해 드리겠습니다. "
            f"끝까지 보시면 실제로 도움이 될 내용을 얻어가실 수 있을 겁니다.", keyword))

        # 2. 배경
        blocks.append(self._block(
            f"먼저 {keyword}가 왜 지금 이렇게 주목받고 있는지 배경부터 살펴볼게요. "
            f"최근 관련 정책과 시장 환경이 빠르게 변하고 있는데요, 이 변화는 단순한 일시적 현상이 아니라 구조적인 전환의 시작이라는 분석이 나오고 있습니다. "
            f"특히 올해 들어 관련 검색량이 크게 증가했다는 점에서, 많은 사람들이 이미 이 변화를 감지하고 있다는 것을 알 수 있습니다.", keyword))

        blocks.append(self._block(
            f"과거에도 비슷한 변화가 있었는데요, 그때와 지금의 차이점을 이해하는 것이 중요합니다. "
            f"예전에는 정보 접근성이 낮아서 전문가만 대응할 수 있었지만, 지금은 누구나 관련 정보를 빠르게 확인하고 행동할 수 있는 환경이 됐습니다. "
            f"이것이 바로 {keyword}를 지금 알아둬야 하는 가장 큰 이유입니다.", keyword))

        # 3. 팩트 전개
        if core_facts:
            for i, fact in enumerate(core_facts[:3]):
                if len(fact) < 10: continue
                conn = ["가장 핵심적인 내용부터 말씀드리면", "다음으로 알아두셔야 할 점은", "그리고 한 가지 더 중요한 사실은"]
                blocks.append(self._block(
                    f"{conn[min(i,2)]}, {fact}. "
                    f"이 내용이 중요한 이유는, {keyword} 전체를 이해하는 데 있어서 빠뜨릴 수 없는 핵심 포인트이기 때문입니다. "
                    f"단순히 알고만 있는 것이 아니라, 이걸 바탕으로 자신의 상황에 어떻게 적용할지를 생각해 보셔야 합니다.", keyword))

        # 4. 실전 적용
        blocks.append(self._block(
            f"그렇다면 실제로 어떻게 대응하면 좋을까요? "
            f"가장 현실적인 방법을 세 단계로 정리해 드리겠습니다. "
            f"첫 번째, 현재 자신의 상황을 정확히 파악하세요. 남의 사례가 아니라 내 상황에 맞는지가 핵심입니다. "
            f"두 번째, 관련 정보를 공식 채널을 통해 꾸준히 확인하세요. 정책이나 시장은 계속 변하기 때문에 한 번 확인하고 끝내면 안 됩니다. "
            f"세 번째, 필요하다면 전문가 상담을 받아보세요. 무료 상담 서비스도 많이 있으니 부담 없이 활용하시면 됩니다.", keyword))

        blocks.append(self._block(
            f"여기서 많은 분들이 하는 실수가 있는데요, 바로 '나중에 해야지' 하고 미루는 겁니다. "
            f"{keyword}는 시기가 중요한 경우가 많아서, 지금 바로 첫 걸음을 떼는 것이 가장 효과적입니다. "
            f"거창하게 시작할 필요 없이, 오늘 이 영상을 본 후에 관련 사이트 하나만 방문해 보시는 것부터 시작하세요.", keyword))

        # 5. 주의사항
        blocks.append(self._block(
            f"다만 주의하실 점이 있습니다. 인터넷에서 떠도는 {keyword} 관련 정보 중에는 검증되지 않은 내용이 정말 많습니다. "
            f"특히 '이것만 하면 된다', '100% 보장' 같은 표현이 있다면 의심해 보셔야 합니다. "
            f"반드시 공식 기관이나 신뢰할 수 있는 출처를 통해 확인하시고, 주변 경험담만으로 중요한 결정을 내리지 않으시길 바랍니다.", keyword))

        blocks.append(self._block(
            f"그리고 한 가지 더 말씀드리고 싶은 건, {keyword}에 정답은 없다는 점입니다. "
            f"사람마다 상황이 다르고 목표가 다르기 때문에, 남들이 좋다고 하는 방법이 나에게도 맞는 건 아닙니다. "
            f"오늘 영상에서 드린 정보를 바탕으로, 여러분 각자의 기준에서 판단하시는 것이 가장 현명한 접근입니다.", keyword))

        # 6. 정리
        blocks.append(self._block(
            f"오늘 내용을 정리하면 이렇습니다. "
            f"첫째, {keyword}의 현재 상황과 배경을 이해했습니다. "
            f"둘째, 실전에서 어떻게 활용할 수 있는지 구체적 방법을 살펴봤습니다. "
            f"셋째, 주의해야 할 점과 흔한 실수도 짚어드렸습니다. "
            f"이 세 가지만 기억하시면 {keyword}에 대해 남들보다 한 발 앞서실 수 있습니다.", keyword))

        # Opinion
        tone_texts = {
            OpinionTone.CRITICAL: (
                f"솔직히 말씀드리면, {keyword}에 대한 현재의 분위기에는 좀 더 신중해야 한다고 생각합니다. "
                f"좋은 점만 부각되고 있지만, 실제로는 상당한 리스크가 존재합니다. "
                f"낙관적인 전망에 편승하기보다는, 최악의 시나리오까지 고려한 후에 결정을 내리시길 권합니다."),
            OpinionTone.OPTIMISTIC: (
                f"저는 {keyword}의 변화가 결국 긍정적인 방향으로 갈 것이라 봅니다. "
                f"물론 단기적으로 불확실성이 있지만, 큰 흐름을 보면 분명히 기회가 있습니다. "
                f"지금이 준비하기에 가장 좋은 시기이고, 미리 움직이는 사람이 결국 더 많은 기회를 잡게 될 것입니다."),
            OpinionTone.CAUTIOUS: (
                f"{keyword}에 대해서는 아직 지켜봐야 할 부분이 많다고 생각합니다. "
                f"확정된 것은 없으며, 상황이 어떻게 전개될지 정확히 예측하기 어렵습니다. "
                f"성급하게 판단하기보다는, 충분한 정보를 모으면서 자신에게 맞는 시점을 찾는 것이 현명합니다."),
            OpinionTone.CONTRARIAN: (
                f"많은 사람들이 {keyword}에 대해 비슷한 생각을 갖고 있지만, 저는 조금 다르게 봅니다. "
                f"대다수가 같은 방향으로 움직일 때 오히려 반대편에 기회가 있을 수 있거든요. "
                f"남들과 다른 시각으로 접근해 보시면, 예상치 못한 가능성을 발견하실 수도 있습니다."),
        }
        opinion_text = tone_texts.get(opinion_tone, tone_texts[OpinionTone.CAUTIOUS])
        opinion_block = ScriptBlock(section=ScriptSection.OPINION, text=opinion_text,
            duration_sec=round(len(opinion_text)/4.5, 1), subtitle_highlight=keyword)

        total_chars = sum(len(b.text) for b in blocks)
        logger.info(f"[Fallback] {len(blocks)} body, {total_chars} chars")
        return blocks, opinion_block

    def _block(self, text, keyword=""):
        return ScriptBlock(section=ScriptSection.BODY, text=text,
            duration_sec=round(len(text)/4.5, 1), subtitle_highlight=keyword)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DYNAMIC_INTROS = ["안녕하세요, 블랙박스 채널입니다.", "오늘도 핵심만 짚어드리는 블랙박스입니다.",
    "여러분의 든든한 정보 파트너, 블랙박스입니다."]
DYNAMIC_OUTROS = ["오늘 영상이 도움이 되셨다면 구독과 좋아요 부탁드립니다.",
    "다음 영상에서 더 유익한 정보로 찾아뵙겠습니다."]

def get_dynamic_intro(): return random.choice(DYNAMIC_INTROS)
def get_dynamic_outro(): return random.choice(DYNAMIC_OUTROS)
