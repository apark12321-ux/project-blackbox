"""
Project Blackbox — Module B: 서사 구조 엔지니어링 엔진 v2
═══════════════════════════════════════════════════════
v1 → v2 개선:
- 스토리텔링 구조 (기승전결)
- 키워드 스터핑 제거
- 뉴스 내용을 본문에 자연스럽게 통합
- 블록 간 연결 문장으로 하나의 흐름
- Gemini 프롬프트 전면 개편
- Fallback도 뉴스 기반으로 개선
"""
import os
import random
import json
import logging
import re
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
        "지금 이 사실을 모르면, 여러분의 {keyword} 전략은 완전히 빗나갈 수 있습니다.",
        "대부분의 사람들이 {keyword}에서 같은 실수를 반복하고 있습니다. 오늘 그 실수를 바로잡아 드리겠습니다.",
    ],
    HookType.CURIOSITY: [
        "전문가들 사이에서 조용히 퍼지고 있는 {keyword}의 새로운 흐름, 오늘 처음 공개합니다.",
        "{keyword}에 대해 우리가 그동안 잘못 알고 있었던 것이 하나 있습니다.",
    ],
    HookType.EMPATHY: [
        "{keyword} 때문에 막막하신 분들, 오늘 영상 하나로 머릿속이 정리될 겁니다.",
        "처음 {keyword}을 시작할 때 저도 똑같이 헤맸습니다. 그래서 오늘 가장 효율적인 방법만 모았습니다.",
    ],
    HookType.SHOCK: [
        "{keyword}의 판도를 바꿀 변화가 시작됐습니다. 아직 모르신다면 지금 바로 확인하세요.",
        "이번 주 발표된 내용이 {keyword}의 기존 상식을 완전히 뒤집었습니다.",
    ],
    HookType.QUESTION: [
        "여러분은 {keyword}을 어디서부터 시작해야 하는지 알고 계신가요?",
        "만약 {keyword}에 대해 딱 한 가지만 알 수 있다면, 무엇을 알고 싶으신가요?",
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
        duration_sec=round(max(4.0, min(8.0, len(text)/4.5)), 1),
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

def generate_cta(keyword):
    texts = [
        f"이런 {keyword} 관련 분석을 매주 올리고 있으니, 놓치지 않으시려면 구독과 알림 설정 부탁드립니다.",
        f"오늘 내용이 도움이 되셨다면 좋아요 한 번 눌러주시고, 다음 영상에서 더 깊은 분석으로 찾아뵙겠습니다.",
        f"구독하시면 {keyword}뿐 아니라, 여러분의 선택에 도움이 될 다양한 분석을 가장 먼저 받아보실 수 있습니다.",
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
#  뉴스 요약 파싱
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _parse_news_items(news_summary: str) -> list[dict]:
    """뉴스 요약 텍스트에서 개별 뉴스 항목 추출"""
    items = []
    if not news_summary:
        return items
    parts = news_summary.split("\n\n")
    for part in parts:
        part = part.strip()
        if not part:
            continue
        # "제목: 요약" 형태 파싱
        if ": " in part:
            title, summary = part.split(": ", 1)
            items.append({"title": title.strip(), "summary": summary.strip()})
        else:
            items.append({"title": "", "summary": part})
    return items


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  스크립트 엔진 v2
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
        target_duration_sec=480.0,
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

        cta_block = generate_cta(keyword)
        all_blocks = [hook_block] + body_blocks + [opinion_block, cta_block]
        total = sum(b.duration_sec for b in all_blocks)
        total_chars = sum(len(b.text) for b in all_blocks)

        logger.info(f"[Script v2] {len(all_blocks)} blocks, {total:.0f}s, {total_chars} chars")

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
                    logger.warning(f"[Script] Gemini too short ({total_chars} chars), retry or fallback")
            except Exception as e:
                logger.error(f"[Script] Gemini failed: {e}")
        return self._fallback_body(keyword, category, news_summary, core_facts, opinion_tone, target_sec)

    async def _gemini_generate(self, keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec):
        target_chars = max(2500, int(target_sec * 4.5))
        facts_text = "\n".join(f"- {f}" for f in core_facts) if core_facts else "(제공된 팩트 없음 — 뉴스 요약에서 팩트를 추출하여 사용할 것)"

        cat_map = {"economy": "경제/재테크", "senior": "시니어/건강", "selfdev": "자기계발", "tech": "IT/테크", "life": "라이프스타일"}
        cat_label = cat_map.get(category, category)

        tone_desc = {
            OpinionTone.CRITICAL: "비판적 시각 — 현재 분위기의 문제점을 지적하고, 사람들이 간과하는 리스크를 짚어주되 대안도 함께 제시",
            OpinionTone.OPTIMISTIC: "긍정적 전망 — 이 변화가 왜 결국 좋은 방향인지를 구체적 근거와 함께 설명",
            OpinionTone.CAUTIOUS: "신중한 분석 — 아직 불확실한 부분을 솔직히 인정하고, 성급한 판단보다 관찰이 필요한 이유를 설명",
            OpinionTone.CONTRARIAN: "역발상 — 다수의 의견과 반대되는 관점을 논리적으로 제시하여 시청자에게 새로운 사고 프레임 제공",
        }
        tone_text = tone_desc.get(opinion_tone, "균형 잡힌 시각")
        benchmark_text = _format_benchmarks(benchmarks)

        # 뉴스 항목 파싱
        news_items = _parse_news_items(news_summary)
        news_detail = ""
        for i, item in enumerate(news_items, 1):
            if item["title"]:
                news_detail += f"\n뉴스 {i}: {item['title']}\n내용: {item['summary']}\n"
            else:
                news_detail += f"\n뉴스 {i}: {item['summary']}\n"

        prompt = f"""당신은 한국 유튜브 정보 채널 "블랙박스"의 메인 작가입니다.
시청자 유지율 80% 이상을 기록하는 대본을 씁니다.

═══ 주제 ═══
키워드: {keyword}
카테고리: {cat_label}

═══ 뉴스 소스 (반드시 본문에 녹여야 함) ═══
{news_detail if news_detail.strip() else news_summary}

═══ 추가 팩트 ═══
{facts_text}

═══ 인기 영상 벤치마킹 ═══
{benchmark_text}
→ 위 영상들의 전개 패턴과 시청자를 끌어당기는 구조를 참고하되, 내용은 절대 베끼지 마세요.

═══ 핵심 규칙 ═══

【스토리텔링 구조 — 하나의 이야기처럼 써야 합니다】

전체 대본은 마치 하나의 다큐멘터리 나레이션처럼 자연스럽게 흘러가야 합니다.
각 문단은 독립된 정보 덩어리가 아니라, 앞 문단의 끝에서 자연스럽게 이어져야 합니다.

전개 흐름:
1. [도입] 왜 이 주제가 지금 중요한지 — 뉴스 소스의 핵심 사건/변화를 언급하며 시작
2. [배경] 이 사건의 맥락 — 어떤 흐름에서 이런 일이 벌어진 건지
3. [심층 분석 ①] 뉴스 소스 1의 내용을 구체적으로 풀어서 설명
4. [심층 분석 ②] 뉴스 소스 2의 내용을 풀어서 설명 (있다면)
5. [연결] 이 두 사건이 합쳐지면 어떤 의미인지 종합
6. [실전] 시청자가 당장 할 수 있는 구체적 행동 3가지 (각각 왜 해야 하는지 이유 포함)
7. [주의] 흔한 실수나 잘못된 정보 바로잡기
8. [정리] 핵심 3줄 요약 (새로운 내용 추가 금지)
9. [의견] 채널 운영자의 개인 견해 — {tone_text}

【문장 품질 규칙】
- 키워드를 문단마다 반복하지 마세요. 대명사("이것", "이 부분", "해당 정책")로 대체.
- "중요합니다", "주목해야 합니다", "살펴보겠습니다" 같은 빈 문장 금지. 모든 문장이 새로운 정보를 전달해야 합니다.
- 가짜 통계, 존재하지 않는 연구, 만들어낸 인용구 절대 금지.
- "[속보]", "[긴급]", "[단독]" 같은 뉴스 태그 사용 금지.
- 구어체: "~인데요", "~거든요", "~하시면 됩니다" 등 자연스러운 말투.
- 각 문단 시작을 다양하게: "먼저", "여기서", "그런데", "한 가지 더", "결론적으로" 등을 문단마다 바꿔 사용.

【문단 연결 — 가장 중요】
- 모든 문단의 마지막 문장이 다음 문단으로 자연스럽게 이어지는 다리 역할을 해야 합니다.
- 예시: "...이런 변화가 생긴 배경에는 흥미로운 이유가 있습니다." → 다음 문단에서 그 이유 설명
- 예시: "...그런데 여기서 한 가지 짚고 넘어가야 할 점이 있어요." → 다음 문단에서 그 점 설명

【분량】
- 총 {target_chars}자 이상, 10~15개 문단
- 각 문단 150~300자
- 마지막 문단만 "opinion", 나머지 "body"

═══ 출력 ═══
JSON 배열만 (마크다운/백틱 없이):
[
  {{"section": "body", "text": "문단 내용", "key_phrase": "자막에 강조할 핵심 2~4단어"}},
  ...
  {{"section": "opinion", "text": "의견 문단", "key_phrase": "핵심 문구"}}
]"""

        resp = await self.client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
            params={"key": self.gemini_key},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192},
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
            if not text:
                continue
            block = ScriptBlock(
                section=ScriptSection.OPINION if p.get("section") == "opinion" else ScriptSection.BODY,
                text=text, duration_sec=round(len(text) / 4.5, 1),
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
                text=f"개인적으로 이번 변화는 단기적 이슈가 아니라 장기적 흐름의 시작이라고 봅니다. 지금 준비하는 것과 나중에 뒤쫓아가는 것의 차이는 생각보다 큽니다.",
                duration_sec=12.0, subtitle_highlight="장기적 흐름")

        total_chars = sum(len(b.text) for b in body_blocks)
        logger.info(f"[Gemini v2] {len(body_blocks)} body + 1 opinion, {total_chars} chars")
        return body_blocks, opinion_block

    def _fallback_body(self, keyword, category, news_summary, core_facts, opinion_tone, target_sec):
        """Gemini 실패 시 — 뉴스 기반 스토리텔링 fallback"""
        blocks = []
        news_items = _parse_news_items(news_summary)

        # 뉴스에서 핵심 정보 추출
        main_topic = news_items[0]["summary"] if news_items else f"{keyword} 관련 최신 동향에 변화가 감지되고 있습니다"
        second_topic = news_items[1]["summary"] if len(news_items) > 1 else ""
        news_title_1 = news_items[0]["title"] if news_items else ""
        news_title_2 = news_items[1]["title"] if len(news_items) > 1 else ""

        cat_map = {"economy": "경제", "senior": "건강", "selfdev": "자기계발", "tech": "기술", "life": "일상"}
        cat_label = cat_map.get(category, "")

        # 1. 도입 — 뉴스로 시작
        blocks.append(self._block(
            f"오늘은 {cat_label} 분야에서 꼭 알아두셔야 할 이야기를 가져왔습니다. "
            f"{main_topic[:100]} "
            f"이 내용이 왜 중요한지, 그리고 여러분에게 어떤 영향을 미치는지 하나씩 풀어보겠습니다.",
            keyword))

        # 2. 배경 설명
        blocks.append(self._block(
            f"먼저 전체 그림부터 보겠습니다. "
            f"최근 몇 달간 이 분야에서는 눈에 띄는 변화들이 연이어 나타나고 있는데요, "
            f"전문가들은 이것이 일시적인 현상이 아니라 패러다임의 전환이 시작된 것이라고 분석하고 있습니다. "
            f"그 배경에는 정책 변화와 시장 환경의 구조적 변동이 자리 잡고 있습니다. "
            f"그렇다면 구체적으로 어떤 일이 벌어지고 있는 걸까요?",
            "패러다임 전환"))

        # 3. 뉴스 1 심층
        if news_title_1:
            blocks.append(self._block(
                f"첫 번째로 주목할 소식입니다. "
                f"{main_topic} "
                f"이 내용의 핵심은, 기존에 우리가 알고 있던 방식이 더 이상 통하지 않을 수 있다는 점입니다. "
                f"특히 실생활에 직접적인 영향을 미칠 수 있는 부분이라 그냥 지나치기 어렵습니다.",
                news_title_1[:20] if news_title_1 else keyword))
        else:
            blocks.append(self._block(
                f"가장 핵심적인 변화부터 말씀드리겠습니다. "
                f"{keyword} 분야에서 기존의 접근법이 한계를 보이기 시작했습니다. "
                f"과거에는 기본적인 정보만 알아도 충분했지만, 지금은 좀 더 세밀한 전략이 필요한 시점이 됐습니다. "
                f"왜 이런 변화가 생겼는지, 그 원인을 짚어보겠습니다.",
                keyword))

        # 4. 뉴스 2 심층 (있으면)
        if second_topic:
            blocks.append(self._block(
                f"여기에 더해 또 하나의 중요한 움직임이 포착됐습니다. "
                f"{second_topic} "
                f"앞서 말씀드린 변화와 맞물리면서, 전체적인 방향성이 더욱 뚜렷해지고 있는 상황입니다.",
                news_title_2[:20] if news_title_2 else "연쇄 변화"))
        else:
            blocks.append(self._block(
                f"그런데 여기서 한 가지 더 짚어야 할 점이 있습니다. "
                f"이 변화는 {keyword}만의 문제가 아니라, 관련된 여러 분야에 동시에 영향을 주고 있다는 겁니다. "
                f"하나의 변화가 다른 영역으로 파급되면서, 예상보다 빠른 속도로 전체 구조가 재편되고 있습니다.",
                "파급 효과"))

        # 5. 종합 연결
        blocks.append(self._block(
            f"이 두 가지 흐름을 종합하면, 결론은 명확합니다. "
            f"지금 이 시점에서 아무런 준비 없이 기존 방식만 고수하는 것은 리스크가 큽니다. "
            f"반대로, 변화의 방향을 정확히 읽고 미리 대응하시는 분들에게는 오히려 좋은 기회가 될 수 있습니다. "
            f"그렇다면 구체적으로 무엇을 해야 할까요?",
            "준비와 기회"))

        # 6. 실전 행동
        blocks.append(self._block(
            f"첫 번째, 현재 자신의 상황을 점검하세요. 같은 정보라도 사람마다 처한 환경이 다르기 때문에, "
            f"남의 사례를 그대로 따라하는 것보다 내 상황에 맞는 판단을 하는 게 훨씬 중요합니다. "
            f"두 번째, 공식 채널을 통해 정보를 꾸준히 업데이트하세요. 한 번 확인하고 끝내는 게 아니라, "
            f"변화가 어떻게 진행되는지 흐름을 계속 지켜보셔야 합니다.",
            "상황 점검"))

        blocks.append(self._block(
            f"세 번째, 혼자 판단이 어렵다면 전문가의 도움을 받는 것도 좋은 선택입니다. "
            f"요즘은 무료 상담 서비스도 많아서 부담 없이 시작할 수 있습니다. "
            f"중요한 건 '나중에'가 아니라 '오늘'부터 시작하는 겁니다. "
            f"작은 행동 하나가 6개월 뒤의 결과를 크게 바꿀 수 있습니다.",
            "지금 시작"))

        # 7. 주의사항
        blocks.append(self._block(
            f"다만 한 가지 주의하실 점이 있습니다. 온라인에 떠도는 정보 중에는 검증되지 않은 내용이 정말 많습니다. "
            f"'이것만 하면 된다', '100% 확실하다' 같은 표현을 보시면 한 번 더 의심해 보세요. "
            f"공식 기관이나 신뢰할 수 있는 전문가의 분석을 기준으로 삼으시고, "
            f"주변의 경험담 하나만 갖고 큰 결정을 내리시면 안 됩니다.",
            "검증된 정보"))

        # 8. 정리
        blocks.append(self._block(
            f"오늘 핵심을 세 줄로 정리하겠습니다. "
            f"하나, 지금 이 분야에서 의미 있는 구조적 변화가 진행 중입니다. "
            f"둘, 이 변화에 대응하는 구체적 방법 세 가지를 말씀드렸습니다. "
            f"셋, 검증되지 않은 정보에 휘둘리지 말고 자신의 기준으로 판단하시는 게 가장 현명합니다.",
            "핵심 세 줄"))

        # Opinion
        tone_texts = {
            OpinionTone.CRITICAL: (
                f"솔직히 지금 분위기에는 좀 더 냉정해질 필요가 있다고 생각합니다. "
                f"좋은 면만 부각되고 있지만, 이면에는 무시할 수 없는 리스크들이 존재합니다. "
                f"낙관론에 편승하기보다는 최악의 시나리오까지 감안한 뒤에 움직이시길 권합니다. "
                f"준비된 비관주의자가 결국 가장 안전한 선택을 하게 됩니다."),
            OpinionTone.OPTIMISTIC: (
                f"저는 이번 변화가 결국 좋은 방향으로 수렴할 것이라 봅니다. "
                f"단기적으로는 혼란스러울 수 있지만, 큰 흐름을 보면 분명히 더 나은 쪽으로 가고 있습니다. "
                f"지금 이 시점에 미리 준비하시는 분들이 1~2년 뒤에 가장 큰 혜택을 누리게 될 거라 확신합니다."),
            OpinionTone.CAUTIOUS: (
                f"아직은 단정짓기 이른 시점입니다. 확정된 것보다 불확실한 것이 더 많은 상황이에요. "
                f"이럴 때일수록 서두르지 말고 차분하게 정보를 모으면서 지켜보는 게 현명합니다. "
                f"기회는 한 번에 오지 않으니까요. 충분히 파악한 뒤에 움직여도 늦지 않습니다."),
            OpinionTone.CONTRARIAN: (
                f"많은 분들이 같은 방향을 바라보고 있는데, 저는 좀 다른 각도에서 보고 있습니다. "
                f"다수가 한쪽으로 쏠릴 때 반대편에 의외의 기회가 숨어 있는 경우가 많거든요. "
                f"물론 소수 의견이 항상 맞는 건 아니지만, 최소한 다른 시각으로 한 번 더 생각해 보시는 건 도움이 될 겁니다."),
        }
        opinion_text = tone_texts.get(opinion_tone, tone_texts[OpinionTone.CAUTIOUS])
        opinion_block = ScriptBlock(section=ScriptSection.OPINION, text=opinion_text,
            duration_sec=round(len(opinion_text) / 4.5, 1), subtitle_highlight="개인 의견")

        total_chars = sum(len(b.text) for b in blocks)
        logger.info(f"[Fallback v2] {len(blocks)} body, {total_chars} chars")
        return blocks, opinion_block

    def _block(self, text, highlight=""):
        return ScriptBlock(section=ScriptSection.BODY, text=text,
            duration_sec=round(len(text) / 4.5, 1), subtitle_highlight=highlight)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DYNAMIC_INTROS = [
    "안녕하세요, 블랙박스 채널입니다.",
    "오늘도 핵심만 짚어드리는 블랙박스입니다.",
    "여러분의 든든한 정보 파트너, 블랙박스입니다.",
]
DYNAMIC_OUTROS = [
    "오늘 영상이 도움이 되셨다면 구독과 좋아요 부탁드립니다.",
    "다음 영상에서 더 유익한 정보로 찾아뵙겠습니다.",
]

def get_dynamic_intro():
    return random.choice(DYNAMIC_INTROS)

def get_dynamic_outro():
    return random.choice(DYNAMIC_OUTROS)
