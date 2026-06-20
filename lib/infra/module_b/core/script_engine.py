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
        "10명 중 8명이 {keyword}에 대해 치명적인 오해를 하고 있습니다.",
        "{keyword}을 잘못 이해하면 돌이킬 수 없는 손해를 볼 수 있습니다.",
        "어제까지 맞았던 {keyword} 상식이, 오늘부터는 틀립니다.",
        "전문가들이 경고합니다. {keyword}의 게임의 룰이 바뀌었습니다.",
    ],
    HookType.CURIOSITY: [
        "전문가들 사이에서 조용히 퍼지고 있는 {keyword}의 새로운 흐름, 오늘 처음 공개합니다.",
        "{keyword}에 대해 우리가 그동안 잘못 알고 있었던 것이 하나 있습니다.",
        "왜 갑자기 {keyword}이 화제가 되고 있을까요? 그 이유가 놀랍습니다.",
        "아직 대부분이 모르는 {keyword}의 숨겨진 비밀이 있습니다.",
        "{keyword}의 진짜 핵심은 뉴스에 나오지 않습니다.",
        "이걸 알면 {keyword}을 보는 시각이 완전히 달라집니다.",
    ],
    HookType.EMPATHY: [
        "{keyword} 때문에 막막하신 분들, 오늘 영상 하나로 머릿속이 정리될 겁니다.",
        "처음 {keyword}을 시작할 때 저도 똑같이 헤맸습니다. 그래서 오늘 가장 효율적인 방법만 모았습니다.",
        "{keyword}이 어렵다고 느끼셨나요? 사실 핵심만 알면 생각보다 간단합니다.",
        "매일 {keyword} 때문에 고민이신 분들, 이 영상이 시원하게 해결해 드리겠습니다.",
        "주변에 물어봐도 시원한 답을 못 받으셨죠? {keyword}의 정답, 오늘 알려드립니다.",
        "복잡한 {keyword}, 5분 안에 완벽 정리해 드리겠습니다.",
    ],
    HookType.SHOCK: [
        "{keyword}의 판도를 바꿀 변화가 시작됐습니다.",
        "이번 주 발표된 내용이 {keyword}의 기존 상식을 완전히 뒤집었습니다.",
        "속보입니다. {keyword}에 전례 없는 변화가 감지됐습니다.",
        "{keyword}에 대한 충격적인 분석 결과가 나왔습니다.",
        "이건 진짜 큰 변화입니다. {keyword}의 새 시대가 열리고 있습니다.",
        "전문가들도 놀란 {keyword}의 반전, 지금 바로 공개합니다.",
    ],
    HookType.QUESTION: [
        "여러분은 {keyword}을 어디서부터 시작해야 하는지 알고 계신가요?",
        "만약 {keyword}에 대해 딱 한 가지만 알 수 있다면, 무엇을 알고 싶으신가요?",
        "{keyword}에서 가장 중요한 건 뭘까요? 대부분 틀리게 답합니다.",
        "혹시 {keyword}을 완전히 잘못된 방향으로 하고 계신 건 아닌가요?",
        "{keyword}, 지금 시작해도 늦지 않았을까요? 솔직하게 말씀드리겠습니다.",
        "같은 {keyword}인데 왜 누구는 성공하고 누구는 실패할까요?",
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
        f"댓글로 여러분의 생각도 들려주세요. {keyword}에 대한 다른 궁금증이 있으시면 댓글로 남겨주시면 다음 영상에서 다뤄보겠습니다.",
        f"지금까지 {keyword}에 대해 알아보았습니다. 이 영상이 도움이 되셨다면 주변에 공유해 주세요. 더 유익한 정보로 다시 찾아뵙겠습니다.",
        f"오늘 영상 핵심만 기억하세요. 그리고 구독 버튼 눌러두시면, 다음에도 이런 알짜 정보를 바로 받아보실 수 있습니다.",
        f"여기까지 잘 따라오셨다면 이미 대부분의 사람보다 한 발 앞서 계신 겁니다. 구독과 좋아요로 응원해 주세요.",
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
                    if chars >= 5000 and len(body) >= 12:
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

        # ═══ 다양성 시스템: 매번 다른 포맷/구조/톤/접근법 ═══
        
        # 1. 영상 구조 템플릿 (Videoto 기승전결/3막/랭킹/스토리텔링 참고)
        STRUCTURES = [
            {
                "name": "기승전결",
                "flow": "기(도입: 궁금증 유발 질문) → 승(전개: 핵심 정보 체계적 전달) → 전(전환: 반전 또는 깊은 분석) → 결(결말: 요약 + CTA)",
                "instruction": "기승전결 4단계로 전개. 도입에서 시청자의 궁금증을 유발하고, 전개에서 팩트를 정리하고, 전환에서 의외의 포인트를 제시하고, 결말에서 실용적 요약."
            },
            {
                "name": "TOP N 리스트",
                "flow": "인트로 → N위부터 역순 카운트다운 → 각 항목 심층 해설 → 1위 발표 + 종합 분석",
                "instruction": "TOP 5 또는 TOP 7 형식으로 구성. 하위 순위부터 시작해서 1위까지 카운트다운. 각 순위마다 구체적 근거와 실제 사례를 포함. 순위 사이에 자연스러운 연결."
            },
            {
                "name": "문제-해결",
                "flow": "문제 제기(시청자의 고민 공감) → 원인 분석 → 해결책 3~5가지 → 실전 적용 사례 → 주의사항",
                "instruction": "시청자가 직면한 문제를 공감하며 시작. 원인을 파헤치고, 실행 가능한 해결책을 구체적으로 제시. 실제 적용 사례로 신뢰도 확보."
            },
            {
                "name": "비교 분석",
                "flow": "A vs B 구도 설정 → A의 장단점 → B의 장단점 → 직접 비교 → 상황별 추천 → 최종 결론",
                "instruction": "두 가지 선택지 또는 관점을 비교. 각각의 장단점을 균형있게 다루고, 시청자의 상황에 따른 맞춤 추천으로 마무리."
            },
            {
                "name": "타임라인/연대기",
                "flow": "과거(어떻게 시작됐나) → 현재(지금 무슨 일이) → 미래(앞으로 어떻게 될 것인가) → 대비 방법",
                "instruction": "시간 순서대로 스토리를 전개. 과거의 맥락이 현재를 이해하는 열쇠가 되고, 미래 전망으로 이어지는 자연스러운 흐름."
            },
            {
                "name": "미스터리/반전",
                "flow": "충격적 사실 제시 → 배경 탐구 → 숨겨진 진실 → 반전 포인트 → 최종 교훈",
                "instruction": "도입에서 '대부분 모르는 사실'로 시작. 점점 진실에 다가가며 중반에 반전을 넣고, 시청자가 '아하!' 하는 깨달음으로 마무리."
            },
            {
                "name": "실전 가이드",
                "flow": "왜 필요한가 → Step 1~5 단계별 실행 → 각 단계 주의사항 → 예상 결과 → FAQ",
                "instruction": "실용적 가이드 형식. 단계별로 따라하면 되는 구조. 각 단계마다 '이렇게 하세요' + '이것만은 피하세요'를 포함."
            },
        ]
        
        # 2. 도입 스타일 (매번 다른 시작)
        OPENING_STYLES = [
            "충격적인 통계나 수치로 시작 (예: '최근 조사에 따르면 10명 중 7명이...')",
            "시청자에게 직접 질문으로 시작 (예: '혹시 여러분도 이런 경험 있으신가요?')",
            "개인적인 경험담이나 일화로 시작",
            "최근 뉴스 헤드라인을 인용하며 시작",
            "미래 시나리오를 상상하게 하며 시작 (예: '지금으로부터 1년 후...')",
            "일반적인 상식을 부정하며 시작 (예: '사실 우리가 알고 있던 것은 틀렸습니다')",
            "비유나 은유로 시작 (예: '이것은 마치 ...과 같습니다')",
            "역사적 사건과 연결하며 시작",
        ]
        
        # 3. 말투 변형
        TONE_STYLES = [
            "친근한 선배처럼 (형/누나가 동생에게 알려주듯)",
            "전문가 인터뷰 느낌 (신뢰감 있고 차분하게)",
            "다큐멘터리 나레이션 (관찰자 시점, 객관적)",
            "열정적인 강사처럼 (에너지 넘치게, 동기부여)",
            "조용한 팟캐스트 호스트 (깊이 있게, 사색적으로)",
        ]
        
        # 4. 마무리 스타일
        ENDING_STYLES = [
            "핵심 3줄 요약 + 실전 행동 1가지",
            "시청자에게 질문 던지기 + 댓글 유도",
            "미래 전망 + 다음 영상 예고",
            "비유로 마무리 + 응원 메시지",
            "체크리스트 형태로 정리",
        ]
        
        # 랜덤 조합 선택 (UUID 기반으로 완전 유니크)
        import uuid
        seed = int(uuid.uuid4().hex[:8], 16)
        random.seed(seed)
        
        structure = random.choice(STRUCTURES)
        opening = random.choice(OPENING_STYLES)
        tone = random.choice(TONE_STYLES)
        ending = random.choice(ENDING_STYLES)
        temp = round(random.uniform(0.75, 0.95), 2)  # 온도도 매번 다르게
        
        # 시드 리셋 (이후 다른 random 호출에 영향 없도록)
        random.seed()
        
        logger.info(f"[Script v4] Structure={structure['name']}, Tone={tone[:10]}, Temp={temp}")

        prompt = f"""당신은 유튜브에서 수백만 조회수를 기록하는 대한민국 TOP 정보 채널의 전문 스크립트 작가입니다.
수천 명의 크리에이터가 사용하는 플랫폼이므로, 절대로 다른 영상과 겹치지 않는 완전히 독창적인 대본을 만들어야 합니다.

【고유 시드】 {uuid.uuid4().hex}
(이 시드를 기반으로 이전에 생성한 어떤 대본과도 다른 내용, 구성, 표현을 사용하세요)

【주제】 {keyword} ({cat_label})

【뉴스 소스 — 반드시 본문에 자연스럽게 녹여야 함】
{news_block if news_block.strip() else news_summary}

【추가 팩트】
{facts_text}

【벤치마킹 인기 영상】
{_fmt_bench(benchmarks)}

━━━ 이번 영상의 고유 설정 ━━━

📐 영상 구조: {structure['name']}
{structure['instruction']}
전개 흐름: {structure['flow']}

🎤 도입 스타일: {opening}

🗣 말투: {tone}

🔚 마무리: {ending}

🎯 의견 톤: {tone_map.get(opinion_tone,"균형")}

━━━ 작성 규칙 ━━━

1. 위에 지정된 영상 구조를 정확히 따를 것. 다른 구조로 바꾸지 말 것.
2. 도입 스타일에 맞게 첫 문단을 독창적으로 시작할 것.
3. 지정된 말투를 전체적으로 유지할 것.
4. 뉴스 소스의 팩트를 본문에 자연스럽게 녹여서 설명 (출처 태그 금지)
5. 키워드를 문단마다 반복하지 말 것. 대명사/지시어 사용.
6. [속보], [긴급] 등 뉴스 태그 금지. 가짜 통계 금지.
7. "중요합니다", "살펴보겠습니다" 같은 빈 문장 금지.
8. 구어체: ~인데요, ~거든요, ~하시면 됩니다
9. 총 {target_chars}자 이상, 20~30문단, 각 300~500자. 반드시 {target_chars}자를 넘길 것!
10. 시니어 시청자 대상: 쉬운 용어, 친절한 설명, 구체적 수치와 예시 풍부
11. 마지막 문단만 "opinion", 나머지 "body"
12. opinion에서 채널명 절대 언급 금지. "저는", "제 생각에는"으로 표현.
13. 교육적 가치: 이 영상 하나로 주제를 완전히 이해할 수 있도록.
14. ★ 매번 새로운 비유, 새로운 예시, 새로운 전개를 사용하세요. 템플릿 문장 금지.
15. ★ 같은 주제라도 이전에 생성한 대본과 완전히 다른 접근법으로 작성하세요.

━━━ 출력 ━━━
JSON 배열만 (마크다운 없이):
[{{"section":"body","text":"...","key_phrase":"자막강조 2~4단어"}},...]"""

        logger.info(f"[Gemini v4] Sending request: {len(prompt)} chars prompt, structure={structure['name']}")

        resp = await self.client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            params={"key": self.gemini_key},
            json={"contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"temperature": temp, "maxOutputTokens": 16384}},
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
                duration_sec=round(len(text)/8.0, 1), subtitle_highlight=hl)

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
            duration_sec=round(len(op_text)/8.0, 1), subtitle_highlight="개인 의견")

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
