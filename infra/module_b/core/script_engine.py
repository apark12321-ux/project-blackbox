"""
Project Blackbox — Module B: 서사 구조 엔지니어링 엔진 v3
═══════════════════════════════════════════════════════
v3 개선:
- Gemini API 키 자동 감지 (env GEMINI_API_KEY)
- 상세 디버깅 로그 (실패 원인 추적)
- 스토리텔링 구조 프롬프트
- fallback: 뉴스 내용을 직접 본문에 통합
- 키워드 스터핑 제거
"""
import os
import random
import json
import logging
import re
from dataclasses import dataclass, field
from enum import Enum

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
#  HOOK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY_HOOK = {
    "economy": [HookType.FEAR, HookType.CURIOSITY, HookType.SHOCK],
    "senior":  [HookType.EMPATHY, HookType.FEAR, HookType.QUESTION],
    "selfdev": [HookType.CURIOSITY, HookType.QUESTION, HookType.EMPATHY],
    "tech":    [HookType.SHOCK, HookType.CURIOSITY, HookType.QUESTION],
    "life":    [HookType.EMPATHY, HookType.CURIOSITY, HookType.QUESTION],
}

HOOKS = {
    HookType.FEAR: [
        "지금 이 사실을 모르면, 여러분의 {keyword} 전략은 완전히 빗나갈 수 있습니다.",
        "대부분의 사람들이 {keyword}에서 같은 실수를 반복하고 있습니다.",
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
        "{keyword}의 판도를 바꿀 변화가 시작됐습니다.",
        "이번 주 발표된 내용이 {keyword}의 기존 상식을 완전히 뒤집었습니다.",
    ],
    HookType.QUESTION: [
        "여러분은 {keyword}을 어디서부터 시작해야 하는지 알고 계신가요?",
        "만약 {keyword}에 대해 딱 한 가지만 알 수 있다면, 무엇을 알고 싶으신가요?",
    ],
}

def select_hook_type(category, prev=None):
    strats = CATEGORY_HOOK.get(category, [HookType.CURIOSITY])
    if prev:
        avail = [h for h in strats if h not in prev[-3:]]
        if avail: return random.choice(avail)
    return random.choice(strats)

def generate_hook(keyword, ht):
    t = random.choice(HOOKS.get(ht, HOOKS[HookType.CURIOSITY])).format(keyword=keyword)
    return ScriptBlock(section=ScriptSection.HOOK, text=t,
        duration_sec=round(max(4,min(8,len(t)/4.5)),1),
        tts_emphasis=[keyword], subtitle_highlight=keyword)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  CTA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def select_opinion_tone(prev=None):
    all_t = list(OpinionTone)
    if prev:
        avail = [t for t in all_t if t not in prev[-2:]]
        if avail: return random.choice(avail)
    return random.choice(all_t)

def generate_cta(keyword):
    texts = [
        f"이런 {keyword} 관련 분석을 매주 올리고 있으니, 놓치지 않으시려면 구독과 알림 설정 부탁드립니다.",
        f"오늘 내용이 도움이 되셨다면 좋아요 한 번 눌러주시고, 다음 영상에서 더 깊은 분석으로 찾아뵙겠습니다.",
    ]
    t = random.choice(texts)
    return ScriptBlock(section=ScriptSection.CTA, text=t,
        duration_sec=round(len(t)/4.5,1), subtitle_highlight="구독")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  벤치마킹
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def _fetch_benchmarks(category):
    try:
        port = os.getenv("PORT", "8080")
        async with httpx.AsyncClient(timeout=5) as c:
            r = await c.get(f"http://localhost:{port}/api/v1/curation/benchmarks/{category}")
            if r.status_code == 200:
                return r.json().get("benchmarks", [])
    except Exception as e:
        logger.warning(f"[Bench] {e}")
    return []

def _fmt_bench(bm):
    if not bm: return "(없음)"
    return "\n".join(f"{i}. [{b.get('channel','')}] {b.get('title','')}" for i,b in enumerate(bm[:10],1) if b.get("title"))


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  뉴스 파싱
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _parse_news(summary: str) -> list[dict]:
    items = []
    if not summary: return items
    for part in summary.split("\n\n"):
        part = part.strip()
        if not part: continue
        if ": " in part:
            title, body = part.split(": ", 1)
            items.append({"title": title.strip(), "body": body.strip()})
        else:
            items.append({"title": "", "body": part})
    return items

def _clean_news_text(text: str) -> str:
    """뉴스 원문에서 불필요한 태그/메타 제거"""
    text = re.sub(r'\[.*?\]', '', text)  # [종합], [단독] 등 제거
    text = re.sub(r'\(.*?기자\)', '', text)  # (홍길동 기자) 제거
    text = re.sub(r'[a-zA-Z]+@[a-zA-Z.]+', '', text)  # 이메일 제거
    text = text.replace('  ', ' ').strip()
    # 너무 길면 핵심 부분만
    if len(text) > 200:
        sentences = re.split(r'[.!?]\s', text)
        kept = []
        total = 0
        for s in sentences:
            if total + len(s) > 180: break
            kept.append(s)
            total += len(s)
        text = '. '.join(kept) + '.'
    return text


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  스크립트 엔진 v3
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ScriptEngine:
    def __init__(self, gemini_api_key=""):
        # ★ API 키: 인자 → 환경변수 순으로 탐색
        self.gemini_key = ""
        if gemini_api_key and gemini_api_key.strip():
            self.gemini_key = gemini_api_key.strip()
        else:
            env_key = os.getenv("GEMINI_API_KEY", "").strip()
            if env_key:
                self.gemini_key = env_key
                logger.info("[ScriptEngine v3] Gemini key loaded from GEMINI_API_KEY env")

        self.client = None
        if self.gemini_key and httpx:
            self.client = httpx.AsyncClient(timeout=120.0)
            logger.info(f"[ScriptEngine v3] Gemini connected (key={self.gemini_key[:8]}...)")
        else:
            if not self.gemini_key:
                logger.warning("[ScriptEngine v3] ⚠ NO Gemini API key — will use fallback")
            if not httpx:
                logger.warning("[ScriptEngine v3] ⚠ httpx not installed")

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

        body_blocks, opinion_block = await self._generate_body(
            keyword, category, news_summary,
            core_facts or [], opinion_tone, benchmarks,
            target_duration_sec - hook_block.duration_sec - 10,
        )

        cta_block = generate_cta(keyword)
        all_blocks = [hook_block] + body_blocks + [opinion_block, cta_block]
        total = sum(b.duration_sec for b in all_blocks)
        total_chars = sum(len(b.text) for b in all_blocks)
        method = "gemini" if self.client else "fallback"

        logger.info(f"[Script v3] ✓ {len(all_blocks)} blocks, {total:.0f}s, {total_chars} chars, method={method}")

        return FullScript(
            keyword=keyword, category=category,
            hook_type=hook_type, opinion_tone=opinion_tone,
            blocks=all_blocks, total_duration_sec=round(total, 1),
            metadata={"hook_type": hook_type.value, "opinion_tone": opinion_tone.value,
                      "body_paragraphs": len(body_blocks), "total_chars": total_chars, "method": method},
        )

    async def _generate_body(self, keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec):
        # Gemini 시도
        if self.client and self.gemini_key:
            logger.info(f"[Script v3] Attempting Gemini generation...")
            try:
                result = await self._gemini(keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec)
                if result:
                    body, opinion = result
                    chars = sum(len(b.text) for b in body)
                    if chars >= 1200 and len(body) >= 5:
                        logger.info(f"[Script v3] ✓ Gemini success: {chars} chars, {len(body)} blocks")
                        return body, opinion
                    logger.warning(f"[Script v3] Gemini too short: {chars} chars, {len(body)} blocks — using fallback")
            except Exception as e:
                logger.error(f"[Script v3] ✗ Gemini failed: {type(e).__name__}: {e}")
        else:
            logger.info(f"[Script v3] Gemini unavailable (client={bool(self.client)}, key={bool(self.gemini_key)}) — using fallback")

        return self._fallback(keyword, category, news_summary, core_facts, opinion_tone, target_sec)

    async def _gemini(self, keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec):
        target_chars = max(2500, int(target_sec * 4.5))
        facts_text = "\n".join(f"- {f}" for f in core_facts) if core_facts else "(뉴스 요약에서 추출할 것)"

        cat_map = {"economy":"경제/재테크","senior":"시니어/건강","selfdev":"자기계발","tech":"IT/테크","life":"라이프스타일"}
        cat_label = cat_map.get(category, category)

        tone_map = {
            OpinionTone.CRITICAL: "비판적 — 문제점 지적 + 대안 제시",
            OpinionTone.OPTIMISTIC: "긍정적 — 구체적 근거와 함께 전망",
            OpinionTone.CAUTIOUS: "신중 — 불확실성 인정, 관찰 권유",
            OpinionTone.CONTRARIAN: "역발상 — 다수와 반대 관점 논리적 제시",
        }

        news_items = _parse_news(news_summary)
        news_block = ""
        for i, item in enumerate(news_items, 1):
            clean = _clean_news_text(item["body"])
            if item["title"]:
                news_block += f"\n【뉴스 {i}】 {item['title']}\n{clean}\n"
            else:
                news_block += f"\n【뉴스 {i}】\n{clean}\n"

        prompt = f"""당신은 유튜브 정보 채널의 전문 스크립트 작가입니다.

【주제】 {keyword} ({cat_label})

【뉴스 소스 — 반드시 본문에 녹여서 설명해야 함】
{news_block if news_block.strip() else news_summary}

【추가 팩트】
{facts_text}

【벤치마킹 인기 영상】
{_fmt_bench(benchmarks)}

━━━ 작성 규칙 ━━━

1. 하나의 다큐멘터리처럼 자연스럽게 흘러가는 스토리텔링으로 작성
2. 전개: 도입(왜 중요한지) → 배경 → 뉴스1 심층분석 → 뉴스2 분석 → 종합 → 실전행동 3가지 → 주의사항 → 정리 → 의견({tone_map.get(opinion_tone,"균형")})
3. 각 문단의 마지막 문장이 다음 문단으로 자연스럽게 연결
4. 키워드를 문단마다 반복하지 말 것. 대명사 사용.
5. [속보], [긴급] 등 뉴스 태그 금지. 가짜 통계 금지.
6. "중요합니다", "살펴보겠습니다" 같은 빈 문장 금지.
7. 구어체: ~인데요, ~거든요, ~하시면 됩니다
8. 총 {target_chars}자 이상, 10~15문단, 각 150~300자
9. 마지막 문단만 "opinion", 나머지 "body"
10. opinion 문단에서 채널명을 절대 언급하지 말 것. 1인칭 "저는", "제 생각에는"으로 표현. 본문에서도 채널명 언급 금지.

━━━ 출력 ━━━
JSON 배열만 (마크다운 없이):
[{{"section":"body","text":"...","key_phrase":"자막강조 2~4단어"}},...]"""

        logger.info(f"[Gemini v3] Sending request: {len(prompt)} chars prompt")

        resp = await self.client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            params={"key": self.gemini_key},
            json={"contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192}},
        )

        if resp.status_code != 200:
            logger.error(f"[Gemini v3] HTTP {resp.status_code}: {resp.text[:500]}")
            raise Exception(f"Gemini HTTP {resp.status_code}")

        data = resp.json()
        candidates = data.get("candidates", [])
        if not candidates:
            logger.error(f"[Gemini v3] No candidates in response: {json.dumps(data)[:500]}")
            raise Exception("No candidates")

        raw = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        if not raw.strip():
            logger.error(f"[Gemini v3] Empty text in response")
            raise Exception("Empty response")

        logger.info(f"[Gemini v3] Got response: {len(raw)} chars")

        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        try:
            paragraphs = json.loads(clean)
        except json.JSONDecodeError as e:
            logger.error(f"[Gemini v3] JSON parse error: {e}, raw={clean[:200]}")
            raise

        body_blocks, opinion_block = [], None
        for p in paragraphs:
            text = p.get("text", "").strip()
            if not text: continue
            block = ScriptBlock(
                section=ScriptSection.OPINION if p.get("section") == "opinion" else ScriptSection.BODY,
                text=text, duration_sec=round(len(text)/4.5, 1),
                subtitle_highlight=p.get("key_phrase", ""))
            if p.get("section") == "opinion":
                opinion_block = block
            else:
                body_blocks.append(block)

        if not opinion_block and body_blocks:
            opinion_block = body_blocks.pop()
            opinion_block.section = ScriptSection.OPINION
        if not opinion_block:
            opinion_block = ScriptBlock(section=ScriptSection.OPINION,
                text="이번 변화는 단기적 이슈가 아니라 장기적 흐름의 시작이라고 봅니다. 지금 준비하는 것과 나중에 뒤쫓아가는 것의 차이는 생각보다 큽니다.",
                duration_sec=12.0, subtitle_highlight="장기적 흐름")

        return body_blocks, opinion_block

    def _fallback(self, keyword, category, news_summary, core_facts, opinion_tone, target_sec):
        """뉴스 기반 고품질 fallback — 스토리텔링 구조"""
        blocks = []
        news = _parse_news(news_summary)
        cat_map = {"economy":"경제","senior":"건강","selfdev":"자기계발","tech":"기술","life":"일상"}
        cat_label = cat_map.get(category, "")

        # 뉴스 요약 정제
        n1_title = news[0]["title"] if news else ""
        n1_body = _clean_news_text(news[0]["body"]) if news else ""
        n2_title = news[1]["title"] if len(news) > 1 else ""
        n2_body = _clean_news_text(news[1]["body"]) if len(news) > 1 else ""

        def blk(text, hl=""):
            return ScriptBlock(section=ScriptSection.BODY, text=text,
                duration_sec=round(len(text)/4.5, 1), subtitle_highlight=hl)

        # ── 1. 도입 ──
        if n1_body:
            blocks.append(blk(
                f"오늘 {cat_label} 분야에서 반드시 짚고 넘어가야 할 소식이 있습니다. "
                f"{n1_body[:120]} "
                f"이 소식이 우리에게 어떤 의미인지, 그리고 어떻게 대응해야 하는지 지금부터 하나씩 풀어보겠습니다.",
                "오늘의 핵심"))
        else:
            blocks.append(blk(
                f"오늘은 {keyword}에 대해 꼭 알아두셔야 할 이야기를 준비했습니다. "
                f"최근 이 분야에 의미 있는 움직임이 감지되고 있는데요, "
                f"그 배경과 대응 방법을 정리해 드리겠습니다.",
                keyword))

        # ── 2. 배경 ──
        blocks.append(blk(
            f"전체 그림부터 보겠습니다. 최근 몇 달간 이 분야에서는 눈에 띄는 변화들이 이어지고 있습니다. "
            f"전문가들은 단순한 일시적 현상이 아니라 구조적 전환의 시작이라고 분석하고 있는데요, "
            f"그 배경에는 정책 방향의 변화와 시장 참여자들의 인식 전환이 자리 잡고 있습니다. "
            f"구체적으로 어떤 일이 벌어지고 있는지 살펴보겠습니다.",
            "구조적 전환"))

        # ── 3. 뉴스 1 심층 ──
        if n1_body:
            blocks.append(blk(
                f"첫 번째 주목할 소식입니다. {n1_body} "
                f"핵심은, 기존에 통하던 방식이 더 이상 유효하지 않을 수 있다는 점입니다. "
                f"실생활에 직접적인 영향을 미칠 수 있는 부분이라 그냥 넘기기 어렵습니다.",
                n1_title[:15] if n1_title else "첫 번째 소식"))
        else:
            blocks.append(blk(
                f"가장 핵심적인 변화부터 말씀드리겠습니다. "
                f"이 분야에서 기존 접근법이 한계를 보이기 시작했습니다. "
                f"과거에는 기본 정보만으로 충분했지만, 지금은 더 세밀한 전략이 필요한 시점입니다. "
                f"왜 이런 변화가 생겼는지 원인을 짚어보겠습니다.",
                "핵심 변화"))

        # ── 4. 뉴스 2 심층 ──
        if n2_body:
            blocks.append(blk(
                f"여기에 또 하나의 중요한 움직임이 포착됐습니다. {n2_body} "
                f"앞서 말씀드린 변화와 맞물리면서, 전체 방향성이 더욱 뚜렷해지고 있습니다. "
                f"이 두 가지를 종합하면 어떤 결론이 나올까요?",
                n2_title[:15] if n2_title else "두 번째 소식"))
        else:
            blocks.append(blk(
                f"그런데 여기서 한 가지 더 짚어야 할 점이 있습니다. "
                f"이 변화는 한 분야에 국한되지 않고, 관련 영역 전체에 동시 영향을 주고 있다는 겁니다. "
                f"하나의 변화가 파급되면서, 예상보다 빠르게 전체 구조가 재편되고 있습니다.",
                "파급 효과"))

        # ── 5. 종합 ──
        blocks.append(blk(
            f"이런 흐름을 종합하면, 결론은 명확합니다. "
            f"아무런 준비 없이 기존 방식만 고수하는 건 리스크가 큽니다. "
            f"반대로 변화의 방향을 정확히 읽고 미리 대응하는 분들에게는 오히려 기회가 됩니다. "
            f"그렇다면 구체적으로 무엇을 해야 할까요?",
            "기회와 리스크"))

        # ── 6. 실전 행동 ──
        blocks.append(blk(
            f"첫 번째, 현재 자신의 상황을 점검하세요. 같은 정보라도 사람마다 처한 환경이 다르기 때문에, "
            f"남의 사례를 그대로 따라하는 것보다 내 상황에 맞는 판단이 훨씬 중요합니다. "
            f"두 번째, 공식 채널을 통해 정보를 꾸준히 업데이트하세요. "
            f"한 번 확인하고 끝내는 게 아니라, 변화의 흐름을 계속 지켜보셔야 합니다.",
            "상황 점검"))

        blocks.append(blk(
            f"세 번째, 혼자 판단이 어렵다면 전문가의 도움을 받는 것도 좋은 선택입니다. "
            f"요즘은 무료 상담 서비스도 많아서 부담 없이 시작할 수 있습니다. "
            f"중요한 건 '나중에'가 아니라 '오늘' 시작하는 겁니다. "
            f"작은 행동 하나가 6개월 뒤의 결과를 크게 바꿀 수 있습니다.",
            "오늘 시작"))

        # ── 7. 주의 ──
        blocks.append(blk(
            f"다만 주의할 점이 있습니다. 온라인에 떠도는 정보 중에는 검증되지 않은 내용이 정말 많습니다. "
            f"'이것만 하면 된다', '100% 확실하다' 같은 표현을 보면 한 번 더 의심하세요. "
            f"공식 기관이나 신뢰할 수 있는 전문가의 분석을 기준으로 삼으시고, "
            f"경험담 하나만 갖고 큰 결정을 내리지 않는 게 현명합니다.",
            "검증된 정보"))

        # ── 8. 정리 ──
        blocks.append(blk(
            f"핵심을 세 줄로 정리하겠습니다. "
            f"하나, 지금 이 분야에서 의미 있는 구조적 변화가 진행 중입니다. "
            f"둘, 대응 방법 세 가지를 말씀드렸습니다. "
            f"셋, 검증되지 않은 정보에 휘둘리지 말고 자신의 기준으로 판단하는 게 가장 현명합니다.",
            "세 줄 요약"))

        # ── Opinion ──
        tones = {
            OpinionTone.CRITICAL:
                "솔직히 지금 분위기에는 좀 더 냉정해질 필요가 있습니다. "
                "좋은 면만 부각되고 있지만, 이면에는 무시할 수 없는 리스크가 존재합니다. "
                "낙관론에 편승하기보다는 최악의 시나리오까지 감안한 뒤에 움직이시길 권합니다.",
            OpinionTone.OPTIMISTIC:
                "저는 이번 변화가 결국 좋은 방향으로 수렴할 것이라 봅니다. "
                "단기적으로는 혼란스럽지만, 큰 흐름을 보면 분명히 더 나은 쪽으로 가고 있습니다. "
                "지금 미리 준비하시는 분들이 1~2년 뒤에 가장 큰 혜택을 누리게 될 거라 생각합니다.",
            OpinionTone.CAUTIOUS:
                "아직은 단정짓기 이른 시점입니다. 확정된 것보다 불확실한 것이 더 많은 상황이에요. "
                "이럴 때일수록 서두르지 말고 차분하게 정보를 모으면서 지켜보는 게 현명합니다. "
                "기회는 한 번에 오지 않습니다. 충분히 파악한 뒤에 움직여도 늦지 않습니다.",
            OpinionTone.CONTRARIAN:
                "많은 분들이 같은 방향을 바라보고 있는데, 저는 좀 다른 각도에서 보고 있습니다. "
                "다수가 한쪽으로 쏠릴 때 반대편에 의외의 기회가 숨어 있는 경우가 많거든요. "
                "최소한 다른 시각으로 한 번 더 생각해 보시는 건 도움이 될 겁니다.",
        }
        op_text = tones.get(opinion_tone, tones[OpinionTone.CAUTIOUS])
        opinion = ScriptBlock(section=ScriptSection.OPINION, text=op_text,
            duration_sec=round(len(op_text)/4.5, 1), subtitle_highlight="개인 의견")

        chars = sum(len(b.text) for b in blocks)
        logger.info(f"[Fallback v3] {len(blocks)} body, {chars} chars")
        return blocks, opinion


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DYNAMIC_INTROS = [
    "안녕하세요, 오늘도 핵심만 짚어드리겠습니다.",
    "여러분의 든든한 정보 파트너가 돌아왔습니다.",
    "안녕하세요, 오늘도 유익한 정보 준비했습니다.",
]
DYNAMIC_OUTROS = [
    "오늘 영상이 도움이 되셨다면 구독과 좋아요 부탁드립니다.",
    "다음 영상에서 더 유익한 정보로 찾아뵙겠습니다.",
]

def get_dynamic_intro(): return random.choice(DYNAMIC_INTROS)
def get_dynamic_outro(): return random.choice(DYNAMIC_OUTROS)
