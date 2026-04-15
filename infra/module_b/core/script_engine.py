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
        "{keyword}에 대해 잘못 알고 계신 분들이 생각보다 훨씬 많습니다. 오늘 꼭 알아야 할 핵심만 깔끔하게 정리해 드릴게요.",
        "많은 분들이 {keyword}에서 같은 실수를 반복하고 있는데요. 오늘 이 영상 하나로 완전히 정리해 드리겠습니다.",
        "{keyword}, 잘못 이해하면 큰 손해를 볼 수 있습니다. 오늘 핵심 포인트만 빠르게 짚어드리겠습니다.",
    ],
    HookType.CURIOSITY: [
        "{keyword}에 대해 궁금하신 분들 많으시죠? 오늘 핵심 내용을 번호별로 명확하게 정리해 드립니다.",
        "{keyword}, 알 것 같으면서도 막상 설명하려면 막막한 주제인데요. 오늘 이 영상 하나로 완전히 이해하실 수 있습니다.",
        "생각보다 많은 분들이 {keyword}에 대해 헷갈려 하시더라고요. 오늘 쉽고 명확하게 정리해 드리겠습니다.",
    ],
    HookType.EMPATHY: [
        "{keyword} 때문에 막막하신 분들, 오늘 영상 하나로 머릿속이 완전히 정리되실 겁니다.",
        "{keyword}가 복잡하게 느껴지셨던 분들 많으시죠? 오늘은 핵심만 쏙쏙 뽑아서 쉽게 설명해 드릴게요.",
        "처음 {keyword}을 접하셨을 때 어디서부터 시작해야 할지 몰라서 막막하셨던 경험, 다들 한 번쯤 있으시죠? 오늘 깔끔하게 정리해 드립니다.",
    ],
    HookType.SHOCK: [
        "{keyword}에 대해 알고 나면 생각이 완전히 바뀌실 겁니다. 오늘 놓쳐서는 안 될 핵심을 정리해 드릴게요.",
        "지금 {keyword} 관련해서 꼭 알고 계셔야 하는 내용이 있습니다. 오늘 빠짐없이 정리해 드리겠습니다.",
        "{keyword}의 실제 핵심은 대부분의 사람들이 모르고 있습니다. 오늘 그 내용을 낱낱이 공개합니다.",
    ],
    HookType.QUESTION: [
        "{keyword}, 정확히 알고 계신가요? 오늘 꼭 알아야 할 포인트를 번호별로 정리해 드립니다.",
        "{keyword}에 대해 제대로 이해하고 계신 분들이 생각보다 많지 않으신데요. 오늘 핵심 내용만 빠르게 살펴보겠습니다.",
        "여러분은 {keyword}에 대해 얼마나 알고 계신가요? 오늘 꼭 알아야 할 내용을 하나하나 짚어드리겠습니다.",
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
        duration_sec=round(max(4,min(8,len(t)/8.0)),1),
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
        duration_sec=round(len(t)/8.0,1), subtitle_highlight="구독")


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
        target_duration_sec=600.0,
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
                    if chars >= 1200 and len(body) >= 4:
                        logger.info(f"[Script v3] ✓ Gemini success: {chars} chars, {len(body)} blocks")
                        return body, opinion
                    logger.warning(f"[Script v3] Gemini too short: {chars} chars, {len(body)} blocks — using fallback")
            except Exception as e:
                logger.error(f"[Script v3] ✗ Gemini failed: {type(e).__name__}: {e}")
        else:
            logger.info(f"[Script v3] Gemini unavailable (client={bool(self.client)}, key={bool(self.gemini_key)}) — using fallback")

        return self._fallback(keyword, category, news_summary, core_facts, opinion_tone, target_sec)

    async def _gemini(self, keyword, category, news_summary, core_facts, opinion_tone, benchmarks, target_sec):
        target_chars = max(10000, int(target_sec * 12.0))
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

        ORDINALS = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째", "여섯 번째", "일곱 번째", "여덟 번째"]

        prompt = f"""당신은 한국 유튜브 정보 채널의 전문 스크립트 작가입니다.
영상 포맷: ★ "N가지 핵심 정리" 번호형 영상 ★ (예: "교회 vs 성당 6가지 차이", "ETF 고르는 5가지 기준")

【주제】 {keyword} ({cat_label})

【참고 뉴스 & 정보】
{news_block if news_block.strip() else news_summary}

【추가 팩트】
{facts_text}

━━━ 작성 규칙 ━━━

■ 전체 구조
- body 블록 6~7개 (각각 하나의 번호 포인트)
- 마지막 블록 1개만 "opinion" (전체 정리 + 핵심 요약)
- 총 블록 수: 7~8개 (body 6~7 + opinion 1)

■ body 블록 형식 (★ 이 형식을 정확히 따를 것)
"{ORDINALS[0]}, [소제목 5~10자]. [핵심 내용 3~4문장. 구체적 수치·예시·비교 포함. 시청자가 즉시 이해 가능하도록.]"
"{ORDINALS[1]}, [소제목 5~10자]. [핵심 내용 3~4문장.]"
... 6~7번까지 계속

■ opinion 블록 형식
"지금까지 [keyword]의 핵심 N가지를 살펴봤는데요. [전체를 1~2문장으로 요약]. [시청자에게 실용적 조언 1~2문장]. 저는 [개인 의견/관점 1문장]."

■ 작성 원칙
1. 각 번호 포인트는 독립적으로 이해 가능해야 함 — 앞 포인트 안 봐도 이해되는 구조
2. 소제목은 핵심을 압축한 명사형 (예: "수수료 차이", "운용 방식", "세금 처리")
3. 구어체 필수: ~인데요, ~거든요, ~하시면 됩니다, ~라고 볼 수 있어요
4. 수치/통계/예시 적극 활용 (예: "연 0.5% vs 2.3%", "약 30% 더 저렴")
5. [속보], [긴급] 등 뉴스 태그 금지. 과장·허위 통계 금지.
6. 채널명 언급 금지. opinion에서 1인칭 "저는"으로만 표현.
7. 각 body 블록: 200~320자 (TTS 약 25~40초 분량)
8. 시청자 친화적: 어려운 용어는 바로 풀어서 설명
9. 뉴스 정보를 자연스럽게 녹여서 신뢰도 높일 것

━━━ 출력 ━━━
JSON 배열만 출력 (마크다운·코드블록 없이):
[{{"section":"body","text":"첫 번째, [소제목]. [내용]...","key_phrase":"자막강조 2~4단어"}},
 {{"section":"body","text":"두 번째, [소제목]. [내용]...","key_phrase":"자막강조 2~4단어"}},
 ...
 {{"section":"opinion","text":"지금까지...","key_phrase":"핵심 정리"}}]"""

        logger.info(f"[Gemini v3] Sending request: {len(prompt)} chars prompt")

        resp = await self.client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            params={"key": self.gemini_key},
            json={"contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 16384}},
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
                text=text, duration_sec=round(len(text)/8.0, 1),
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
        """번호형 포맷 fallback — 'N가지 핵심 정리' 구조"""
        blocks = []
        news = _parse_news(news_summary)
        n1_body = _clean_news_text(news[0]["body"]) if news else ""
        n2_body = _clean_news_text(news[1]["body"]) if len(news) > 1 else ""
        n3_body = _clean_news_text(news[2]["body"]) if len(news) > 2 else ""

        # 카테고리별 번호 포인트 템플릿
        templates = {
            "economy": [
                (f"첫 번째, 핵심 개념 이해. {keyword}을 이해하려면 먼저 기본 원리부터 잡아야 합니다. "
                 f"많은 분들이 용어만 들어보셨고 실제 작동 방식은 잘 모르시는 경우가 많은데요. "
                 f"간단히 말씀드리면, 이 구조는 크게 두 가지 축으로 돌아갑니다. "
                 f"하나는 수익 측면이고, 다른 하나는 리스크 관리 측면이에요.", "핵심 개념"),
                (f"두 번째, 현재 시장 동향. {n1_body[:120] if n1_body else f'{keyword} 관련 시장은 최근 빠르게 변화하고 있습니다.'}  "
                 f"이런 변화는 단순한 일시적 현상이 아니라, 구조적 흐름의 일부로 봐야 합니다. "
                 f"전문가들도 이 흐름에 주목하고 있는데요, 단기보다는 중장기 시각으로 접근하는 게 유리합니다.", "시장 동향"),
                (f"세 번째, 일반인의 흔한 오해. 많은 분들이 {keyword}에 대해 잘못 알고 계신 게 있습니다. "
                 f"'수익이 보장된다'거나 '무조건 안전하다'는 인식인데요, 이는 사실과 다릅니다. "
                 f"올바른 이해 없이 접근하면 오히려 손해를 볼 수 있어요. "
                 f"정확한 정보를 갖고 시작하는 게 가장 중요합니다.", "흔한 오해"),
                (f"네 번째, 실제 사례와 수익 구조. {n2_body[:120] if n2_body else f'{keyword}의 실제 수익 구조를 살펴보면 이렇습니다.'} "
                 f"실제로 경험해 보신 분들의 사례를 보면, 처음에는 작게 시작해서 원리를 파악한 뒤 단계적으로 늘려가는 방식이 안전합니다. "
                 f"한 번에 큰 금액을 넣는 것보다 분산 접근이 훨씬 현명하고요.", "실제 사례"),
                (f"다섯 번째, 주의해야 할 리스크. 어떤 투자나 전략이든 리스크는 반드시 존재합니다. "
                 f"{keyword}도 마찬가지인데요, 특히 정보 비대칭 문제와 타이밍 리스크를 조심하셔야 합니다. "
                 f"'남들이 다 한다'는 분위기에 휩쓸리지 말고, 본인의 상황과 기준에 맞춰 판단하시는 게 중요해요.", "리스크 주의"),
                (f"여섯 번째, 시작하는 방법. 이제 막 시작하려는 분들을 위해 첫 단계를 정리해 드릴게요. "
                 f"첫째, 공식 자료와 신뢰할 수 있는 채널을 통해 기본 개념부터 익히세요. "
                 f"둘째, 소액으로 먼저 경험해보시고, 본인에게 맞는지 확인하세요. "
                 f"셋째, 꾸준히 공부하면서 전략을 다듬어 나가는 것이 가장 확실한 방법입니다.", "시작하는 방법"),
            ],
            "senior": [
                (f"첫 번째, 왜 지금 중요한가. {keyword}은 특히 시니어 세대에게 더욱 중요한 주제인데요. "
                 f"노후 준비와 건강 관리가 동시에 이루어져야 하는 시점에, 정확한 정보가 큰 차이를 만들어냅니다. "
                 f"지금 알고 계신 내용이 최신인지, 한 번 점검해보실 필요가 있어요.", "왜 중요한가"),
                (f"두 번째, 최신 제도 변화. {n1_body[:130] if n1_body else f'{keyword} 관련 제도가 최근 변경되었습니다.'} "
                 f"이 변화를 모르고 계시면 받을 수 있는 혜택을 놓칠 수 있어요. "
                 f"특히 65세 이상 분들께 해당되는 내용이 많으니 꼭 확인해보세요.", "최신 제도"),
                (f"세 번째, 신청 방법과 절차. 많은 분들이 어떻게 신청하는지 몰라서 혜택을 못 받으시는 경우가 많습니다. "
                 f"가장 쉬운 방법은 가까운 주민센터나 복지관을 방문하는 것이고요, "
                 f"요즘은 온라인이나 전화로도 간편하게 신청하실 수 있습니다. "
                 f"자녀분께 도움을 받으시면 더 편하게 처리하실 수 있어요.", "신청 방법"),
                (f"네 번째, 금액과 지원 범위. 실제로 얼마나 받으실 수 있는지 궁금하신 분들이 많으시죠. "
                 f"기본적으로 소득과 재산 기준에 따라 달라지는데요, "
                 f"구체적인 금액은 개인 상황마다 다르지만 신청만 하시면 전문가가 계산해서 알려드립니다. "
                 f"꼭 신청해보세요.", "금액과 범위"),
                (f"다섯 번째, 주의사항과 유의점. {n2_body[:120] if n2_body else '몇 가지 주의할 점이 있습니다.'} "
                 f"특히 허위 정보나 사기 피해에 주의하세요. "
                 f"공식 기관이 아닌 곳에서 개인 정보를 요구한다면 반드시 의심하시고, "
                 f"모르면 일단 자녀나 주민센터에 먼저 문의하시는 게 안전합니다.", "주의사항"),
                (f"여섯 번째, 지금 당장 할 일. 오늘 영상 보신 뒤 바로 실천하실 수 있는 한 가지를 말씀드릴게요. "
                 f"지금 바로 건강보험공단이나 주민센터에 전화해서 본인이 받을 수 있는 혜택이 있는지 확인해보세요. "
                 f"전화 한 통으로 의외로 많은 혜택을 발견하시는 분들이 많습니다.", "지금 할 일"),
            ],
        }

        # 해당 카테고리 템플릿 사용, 없으면 economy 기반으로 생성
        cat_templates = templates.get(category, templates.get("economy", []))

        # 범용 포인트 생성 (카테고리 템플릿이 없거나 부족할 때)
        universal_points = [
            (f"첫 번째, 기본 개념부터 잡자. {keyword}을 제대로 이해하려면 핵심 원리를 먼저 파악해야 합니다. "
             f"흔히 겉으로만 알고 있다가 나중에 낭패를 보는 경우가 많거든요. "
             f"기본기가 탄탄해야 응용이 가능하고, 위기 상황에서도 올바른 판단을 내릴 수 있습니다.", "기본 개념"),
            (f"두 번째, 현재 상황 파악. {n1_body[:120] if n1_body else f'최근 {keyword} 관련 상황이 빠르게 변화하고 있습니다.'} "
             f"이 맥락을 이해하지 않고서는 올바른 결정을 내리기 어렵습니다. "
             f"항상 최신 정보를 유지하는 것이 매우 중요한 이유가 여기에 있어요.", "현재 상황"),
            (f"세 번째, 가장 많이 하는 실수. 처음 접하시는 분들이 공통적으로 빠지는 함정이 있습니다. "
             f"정보 없이 남들 따라 하거나, 반대로 너무 소극적으로 아무것도 안 하는 건데요. "
             f"둘 다 좋지 않습니다. 적당한 공부와 작은 실천이 균형 잡힌 접근법입니다.", "흔한 실수"),
            (f"네 번째, 핵심 포인트 정리. {n2_body[:120] if n2_body else f'{keyword}에서 반드시 기억해야 할 내용이 있습니다.'} "
             f"이 내용은 반드시 본인 상황에 맞게 적용해야 합니다. "
             f"모든 경우에 100% 맞는 정답은 없으니, 유연하게 접근하시는 게 좋아요.", "핵심 포인트"),
            (f"다섯 번째, 올바른 정보 찾는 법. 인터넷에는 잘못된 정보가 넘쳐납니다. "
             f"공식 기관 발표, 검증된 전문가의 분석, 그리고 직접적인 경험담을 구분해서 보시는 게 중요해요. "
             f"출처가 불분명한 정보는 일단 의심하고, 두 군데 이상에서 확인하는 습관을 들이세요.", "올바른 정보"),
            (f"여섯 번째, 실전 적용 단계. 지금 당장 실천할 수 있는 첫 번째 단계는 아주 간단합니다. "
             f"오늘 이 영상에서 배운 내용 중 하나라도 본인 상황에 적용해보세요. "
             f"완벽하지 않아도 괜찮습니다. 시작하는 것 자체가 이미 절반은 성공입니다.", "실전 적용"),
        ]

        point_list = cat_templates if cat_templates else universal_points
        for text, hl in point_list:
            blocks.append(ScriptBlock(section=ScriptSection.BODY, text=text,
                duration_sec=round(len(text)/8.0, 1), subtitle_highlight=hl))

        # ── Opinion ──
        n = len(blocks)
        tones = {
            OpinionTone.CRITICAL:
                f"지금까지 {keyword}의 핵심 {n}가지를 살펴봤는데요. "
                f"솔직히 말씀드리면 지금 분위기에는 좀 더 신중할 필요가 있습니다. "
                f"긍정적인 면만 보지 마시고, 리스크도 반드시 함께 점검하세요. "
                f"저는 충분히 검토한 뒤 신중하게 접근하는 게 현명하다고 생각합니다.",
            OpinionTone.OPTIMISTIC:
                f"지금까지 {keyword}의 핵심 {n}가지를 함께 살펴봤습니다. "
                f"이 흐름은 분명히 좋은 방향으로 가고 있다고 생각해요. "
                f"지금 미리 준비하시는 분들이 나중에 더 큰 혜택을 누리실 겁니다. "
                f"저는 적극적으로 배우고 실천하는 분들에게 기회가 온다고 믿습니다.",
            OpinionTone.CAUTIOUS:
                f"지금까지 {keyword}의 핵심 {n}가지를 정리해봤습니다. "
                f"아직 불확실한 부분이 있으니 서두르지 말고 차분하게 준비하세요. "
                f"한 번에 큰 결정 내리기보다는, 작은 것부터 하나씩 확인해가는 게 좋습니다. "
                f"저는 조금 느리더라도 안전하게 가는 게 결국 가장 빠른 길이라고 생각합니다.",
            OpinionTone.CONTRARIAN:
                f"지금까지 {keyword}에 대한 핵심 내용 {n}가지를 살펴봤는데요. "
                f"많은 분들이 같은 방향을 보고 있지만, 저는 조금 다른 각도로 보고 있습니다. "
                f"다수가 쏠릴 때 반대쪽에 기회가 있는 경우가 많거든요. "
                f"오늘 내용을 바탕으로 나만의 기준을 만들어보시길 권합니다.",
        }
        op_text = tones.get(opinion_tone, tones[OpinionTone.CAUTIOUS])
        opinion = ScriptBlock(section=ScriptSection.OPINION, text=op_text,
            duration_sec=round(len(op_text)/8.0, 1), subtitle_highlight="핵심 정리")

        chars = sum(len(b.text) for b in blocks)
        logger.info(f"[Fallback-List] {len(blocks)} body blocks, {chars} chars")
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
