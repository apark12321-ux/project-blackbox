"""
Project Blackbox — Module B: 서사 구조 엔지니어링 엔진
═══════════════════════════════════════════════════════
Module A의 큐레이션 데이터를 받아 3단 비즈니스 스크립트를 자동 생성합니다.

구조: [5초 후킹] → [팩트 기반 본문 5~6단락] → [Opinion Injector 결론]
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
#  후킹 전략 타입
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


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  데이터 클래스
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
#  5초 후킹 로직
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

OPINION_TEMPLATES = {
    OpinionTone.CRITICAL: [
        "하지만 여기서 한 가지 짚고 넘어가야 할 점이 있습니다. {point}라는 시각도 분명히 존재합니다. 모든 정보를 그대로 받아들이기보다는 여러 관점에서 비교해 보시길 권합니다.",
        "물론 이것이 전부는 아닙니다. 비판적으로 보면 {point}라는 한계가 분명 있습니다. 중요한 건 자신의 상황에 맞게 판단하는 것이죠.",
    ],
    OpinionTone.OPTIMISTIC: [
        "개인적으로 이 변화는 긍정적이라고 봅니다. {point}라는 점에서 앞으로가 더 기대됩니다. 물론 리스크도 있지만, 큰 방향은 분명 좋아지고 있습니다.",
        "저는 이 흐름이 결국 좋은 방향으로 갈 거라 생각합니다. 왜냐하면 {point}이기 때문이죠. 지금이 준비할 가장 좋은 시점입니다.",
    ],
    OpinionTone.CAUTIOUS: [
        "다만 신중하게 접근할 필요가 있습니다. {point}라는 변수를 반드시 고려하셔야 합니다. 서두르기보다는 충분한 정보를 확인한 뒤 결정하시길 바랍니다.",
        "아직 확정된 것은 없으므로 서두르지 마시고, {point}를 꼼꼼히 확인해 보시길 권합니다. 특히 개인 상황에 따라 결과가 크게 달라질 수 있습니다.",
    ],
    OpinionTone.CONTRARIAN: [
        "하지만 저는 다수의 의견과 조금 다르게 생각합니다. 오히려 {point}가 핵심이 아닐까요? 남들이 안 보는 곳에 기회가 있을 수 있습니다.",
        "남들과 같은 시각으로만 보면 놓치는 것이 있습니다. {point}라는 관점도 고려해 보세요. 결국 차별화된 시각이 더 나은 결과를 만들어줍니다.",
    ],
}


def select_opinion_tone(previous_tones: list[OpinionTone] = None) -> OpinionTone:
    all_tones = list(OpinionTone)
    if previous_tones:
        available = [t for t in all_tones if t not in previous_tones[-2:]]
        if available:
            return random.choice(available)
    return random.choice(all_tones)


def generate_opinion(keyword: str, opinion_tone: OpinionTone, opinion_seed: str = "") -> ScriptBlock:
    templates = OPINION_TEMPLATES.get(opinion_tone, OPINION_TEMPLATES[OpinionTone.CAUTIOUS])
    point = opinion_seed if opinion_seed else f"{keyword}의 장기적 영향"
    text = random.choice(templates).format(point=point)

    cta_variants = [
        f"이런 유익한 정보를 놓치지 않으시려면, 알림 설정까지 부탁드릴게요.",
        f"오늘 이 정보가 도움이 되셨다면, 구독과 좋아요로 응원해 주세요.",
        f"다음 영상에서는 더 깊이 있는 분석을 준비하겠습니다. 구독 부탁드립니다.",
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
#  카테고리별 풍부한 본문 템플릿 (Fallback용)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BODY_TEMPLATES = {
    "economy": {
        "context": [
            "최근 {keyword} 전망에 대해 중요한 변화가 있었습니다. {news}에서 보도한 내용에 따르면, 시장 전문가들은 이번 변화가 단기적 현상이 아닌 구조적 전환의 시작이라고 분석하고 있습니다.",
            "{keyword}에 대한 관심이 최근 급격히 높아지고 있습니다. {news}의 보도에 의하면, 이번 변화는 투자자와 일반 국민 모두에게 직접적인 영향을 미칠 것으로 예상됩니다.",
        ],
        "history": [
            "역사적으로 보면, 비슷한 상황은 과거에도 있었습니다. 2008년 금융위기 당시에도 유사한 패턴이 나타났고, 그때 대비했던 사람들은 오히려 자산을 키울 수 있었습니다. 핵심은 타이밍보다 준비입니다.",
            "과거 사례를 살펴보면, 이런 변화는 보통 6개월에서 1년 사이에 실질적인 영향을 미치기 시작합니다. 지금부터 준비하면 충분히 유리한 위치를 선점할 수 있습니다.",
        ],
        "detail": [
            "구체적으로 살펴보면, {keyword}의 핵심 포인트는 세 가지입니다. 첫째, 정책 변화에 따른 직접적인 혜택. 둘째, 시장 구조 변화로 인한 새로운 기회. 셋째, 기존 방식에서 벗어나야 할 리스크입니다.",
            "전문가들은 {keyword}를 이해하기 위해 세 가지 핵심 지표를 주목해야 한다고 말합니다. 바로 수익률, 리스크 수준, 그리고 유동성입니다. 이 세 가지를 균형 있게 보는 것이 중요합니다.",
        ],
        "practical": [
            "그렇다면 우리는 어떻게 대응해야 할까요? 가장 현실적인 방법은 분산 투자와 정보 업데이트입니다. 한 곳에 올인하기보다는 여러 옵션을 검토하고, 최신 정책 변화를 꾸준히 확인하는 것이 핵심입니다.",
            "실질적으로 활용할 수 있는 전략을 정리해 보겠습니다. 첫 번째는 관련 제도를 최대한 활용하는 것이고, 두 번째는 전문가 상담을 받아보는 것, 세 번째는 자신만의 기준을 세우고 꾸준히 실행하는 것입니다.",
        ],
        "data": [
            "최근 통계를 보면, 관련 수치가 전년 대비 약 15에서 20퍼센트 변동했습니다. 이는 단순한 등락이 아니라 시장의 구조적 변화를 반영하는 것이며, 앞으로 이 추세는 더욱 뚜렷해질 것으로 전망됩니다.",
            "데이터로 살펴보면, 지난 3년간 이 분야의 성장률은 연평균 12퍼센트를 넘었습니다. 특히 올해 들어 가속화되는 양상을 보이고 있어, 지금이 중요한 전환점이라는 분석이 나옵니다.",
        ],
    },
    "senior": {
        "context": [
            "최근 {keyword}에 관한 정책이 크게 바뀌었습니다. {news}에 따르면, 이번 변경사항은 50대 이상 분들에게 특히 중요한 영향을 미칠 것으로 보입니다. 핵심만 정리해 드리겠습니다.",
            "{keyword}는 많은 시니어 분들이 관심을 갖고 계신 주제입니다. {news}의 최신 보도에 의하면, 올해부터 적용되는 새로운 기준이 있으니 반드시 확인해 보셔야 합니다.",
        ],
        "history": [
            "기존에는 {keyword} 관련 제도가 복잡하고 접근이 어려웠습니다. 하지만 최근 정부에서 절차를 간소화하고 대상을 확대하면서, 더 많은 분들이 혜택을 받을 수 있게 되었습니다.",
            "과거에 비해 {keyword} 관련 환경이 많이 달라졌습니다. 10년 전에는 선택지가 제한적이었지만, 지금은 다양한 옵션이 생겼고, 이를 잘 활용하면 생활의 질을 크게 높일 수 있습니다.",
        ],
        "detail": [
            "가장 중요한 부분을 정리하면, 첫째 자격 요건을 정확히 확인하시고, 둘째 신청 시기를 놓치지 마시고, 셋째 필요한 서류를 미리 준비해 두시는 것입니다. 이 세 가지만 챙기셔도 절반은 성공입니다.",
            "구체적으로 어떻게 해야 하는지 단계별로 알려드리겠습니다. 먼저 자신의 현재 상태를 정확히 파악하시고, 다음으로 해당 기관에 직접 문의하시고, 마지막으로 전문 상담사의 도움을 받아보시는 것을 추천합니다.",
        ],
        "practical": [
            "가장 흔한 실수는 '나는 해당 안 될 거야'라고 미리 포기하는 것입니다. 실제로 확인해 보면 예상보다 많은 분들이 대상에 포함됩니다. 가까운 주민센터나 국민건강보험공단에 문의해 보시길 강력히 권합니다.",
            "주변에서 이미 혜택을 받고 계신 분들의 공통점은, 정보를 빠르게 접하고 바로 실행에 옮겼다는 것입니다. 오늘 이 영상을 보신 것만으로도 한 발 앞서신 겁니다.",
        ],
        "data": [
            "통계에 따르면, {keyword} 관련 수혜 대상자 중 실제 신청률은 약 60퍼센트에 불과합니다. 나머지 40퍼센트는 정보 부족으로 혜택을 놓치고 계신 겁니다. 여러분은 그 40퍼센트에 속하지 않으셨으면 합니다.",
            "최근 조사 결과, {keyword}를 미리 준비한 분들과 그렇지 않은 분들의 만족도 차이가 약 3배에 달했습니다. 작은 준비가 큰 차이를 만든다는 것을 수치가 증명하고 있습니다.",
        ],
    },
    "selfdev": {
        "context": [
            "최근 {keyword}에 대한 관심이 폭발적으로 늘고 있습니다. {news}에 따르면, 특히 2030세대를 중심으로 실질적인 변화를 원하는 사람들이 크게 증가하고 있다고 합니다.",
            "{keyword}는 단순한 트렌드가 아닙니다. {news}의 분석에 의하면, 실제로 삶의 질을 향상시키는 데 큰 효과가 있다는 연구 결과가 계속 나오고 있습니다.",
        ],
        "history": [
            "사실 {keyword}의 원리는 새로운 것이 아닙니다. 성공한 사람들의 공통점을 연구한 수많은 논문에서 이미 검증된 방법입니다. 문제는 '아는 것'과 '실행하는 것' 사이의 간극이죠.",
            "역사적으로 보면, 위대한 성취를 이룬 사람들은 모두 비슷한 패턴을 가지고 있었습니다. {keyword}도 그 패턴의 핵심 중 하나이며, 누구나 시작할 수 있다는 것이 가장 큰 장점입니다.",
        ],
        "detail": [
            "효과적인 실천을 위해 세 가지 원칙을 기억하세요. 첫째, 작게 시작할 것. 둘째, 매일 같은 시간에 할 것. 셋째, 완벽하지 않아도 꾸준히 할 것. 이 세 가지만 지키면 3주 안에 변화를 체감하실 수 있습니다.",
            "구체적인 실행 방법을 말씀드리겠습니다. 하루에 딱 10분만 투자하세요. 아침에 일어나서, 또는 잠들기 전에. 중요한 것은 시간의 양이 아니라 일관성입니다.",
        ],
        "practical": [
            "가장 추천드리는 방법은 '2분 규칙'입니다. 하기 싫을 때도 딱 2분만 해보세요. 대부분의 경우 2분이 지나면 자연스럽게 계속하게 됩니다. 시작이 반이라는 말이 과학적으로도 맞는 셈이죠.",
            "저도 처음에는 작심삼일이었습니다. 하지만 한 가지를 바꾼 후 180일 넘게 유지하고 있습니다. 그 비결은 '트리거 설정'입니다. 기존 습관에 새 습관을 연결하는 겁니다.",
        ],
        "data": [
            "런던대학교의 연구에 따르면, 새로운 습관이 자동화되기까지 평균 66일이 걸린다고 합니다. 21일이 아니라 66일입니다. 하지만 첫 2주를 넘기면 포기율이 급격히 줄어들기 때문에, 초반이 가장 중요합니다.",
            "실제 데이터를 보면, {keyword}를 실천하는 사람들의 생산성은 평균 23퍼센트 높았고, 스트레스 수치는 30퍼센트 이상 낮았습니다. 숫자가 말해주는 명확한 효과입니다.",
        ],
    },
    "tech": {
        "context": [
            "최근 {keyword}가 기술 업계에서 가장 뜨거운 화제입니다. {news}에 따르면, 글로벌 테크 기업들이 앞다투어 투자를 늘리고 있으며, 일반 사용자들의 접근성도 크게 향상되고 있습니다.",
            "{keyword}에 대한 관심이 폭발적으로 증가하고 있습니다. {news}의 보도에 의하면, 이 기술은 더 이상 전문가만의 영역이 아니라 누구나 활용할 수 있는 수준에 도달했습니다.",
        ],
        "history": [
            "불과 2년 전만 해도 {keyword}는 초기 단계에 불과했습니다. 하지만 지금은 상황이 완전히 달라졌습니다. 기술의 발전 속도가 예상보다 훨씬 빨라서, 전문가들도 놀라고 있는 상황입니다.",
            "기술의 진화 과정을 보면, 스마트폰이 처음 나왔을 때와 비슷한 패턴입니다. 처음에는 '이걸 누가 쓰냐'는 반응이었지만, 지금은 없으면 불편한 필수품이 됐죠. {keyword}도 같은 궤적을 따르고 있습니다.",
        ],
        "detail": [
            "핵심 기능을 세 가지로 정리하면 이렇습니다. 첫째, 반복적인 작업을 자동화해서 시간을 절약할 수 있습니다. 둘째, 데이터 기반 의사결정이 가능해집니다. 셋째, 비용 대비 효율이 기존 방법보다 월등히 높습니다.",
            "실제로 {keyword}를 활용하면 어떤 것이 가능한지 구체적으로 보여드리겠습니다. 문서 작성, 데이터 분석, 콘텐츠 제작은 물론이고, 최근에는 코딩 없이도 앱을 만들 수 있는 수준까지 발전했습니다.",
        ],
        "practical": [
            "처음 시작하시는 분들께 가장 추천드리는 방법은 무료 도구부터 사용해 보시는 것입니다. 대부분의 서비스가 무료 체험을 제공하고 있으니, 부담 없이 직접 경험해 보시는 게 가장 빠른 학습법입니다.",
            "가장 효과적인 활용법은 자신의 일상 업무에 바로 적용해 보는 것입니다. 이메일 작성, 자료 요약, 아이디어 정리 등 작은 것부터 시작하면 금방 감을 잡으실 수 있습니다.",
        ],
        "data": [
            "맥킨지 보고서에 따르면, {keyword} 관련 시장 규모는 향후 3년 내 약 4배 이상 성장할 것으로 전망됩니다. 특히 개인 생산성 도구 분야의 성장이 가장 가파릅니다.",
            "실제 사용자 조사 결과, {keyword}를 도입한 기업의 업무 효율은 평균 35퍼센트 향상됐고, 개인 사용자의 만족도는 10점 만점에 8.2점으로 매우 높은 수준을 기록했습니다.",
        ],
    },
    "life": {
        "context": [
            "최근 {keyword}에 대한 관심이 크게 높아지고 있습니다. {news}에 따르면, 특히 바쁜 현대인들 사이에서 실용적인 라이프스타일 개선에 대한 니즈가 급증하고 있다고 합니다.",
            "{keyword}가 요즘 많은 분들의 일상을 바꾸고 있습니다. {news}의 보도에 의하면, 작은 변화로 큰 만족감을 얻을 수 있다는 후기가 쏟아지고 있습니다.",
        ],
        "history": [
            "사실 {keyword}는 오래전부터 있었지만, 최근 들어 접근 방식이 완전히 달라졌습니다. 복잡하고 비용이 많이 들던 것이 간편하고 합리적으로 바뀌면서, 더 많은 사람들이 즐길 수 있게 되었습니다.",
            "예전에는 {keyword}를 시작하려면 전문 지식이나 큰 비용이 필요했습니다. 하지만 지금은 유튜브 하나로 배울 수 있고, 소소하게 시작해서 점차 넓혀갈 수 있는 환경이 됐습니다.",
        ],
        "detail": [
            "초보자가 {keyword}를 시작할 때 알아두면 좋은 세 가지가 있습니다. 첫째, 너무 완벽을 추구하지 마세요. 둘째, 다른 사람과 비교하지 마세요. 셋째, 과정 자체를 즐기세요. 이 세 가지만 기억하시면 됩니다.",
            "많은 분들이 {keyword}를 시작할 때 실수하는 것이 한 번에 너무 많은 것을 하려는 것입니다. 가장 좋은 접근법은 하나에 집중하고, 그것이 익숙해지면 하나씩 추가하는 것입니다.",
        ],
        "practical": [
            "당장 오늘부터 시작할 수 있는 방법을 알려드릴게요. 특별한 장비나 비용 없이 집에서 바로 해볼 수 있습니다. 중요한 건 거창한 계획보다 지금 바로 첫 걸음을 떼는 것입니다.",
            "제가 직접 해보고 효과를 느낀 방법을 공유합니다. 매주 한 가지씩만 새로 시도해 보세요. 한 달이면 네 가지, 일 년이면 무려 52가지를 경험해 볼 수 있습니다.",
        ],
        "data": [
            "한국갤럽 조사에 따르면, {keyword}를 실천하는 사람들의 행복도 지수가 그렇지 않은 사람들보다 약 25퍼센트 높았습니다. 삶의 질에 직접적인 영향을 미친다는 것이 데이터로 증명된 셈입니다.",
            "최근 설문조사 결과, {keyword}를 시작한 지 3개월 이상 된 분들 중 87퍼센트가 '삶이 더 풍요로워졌다'고 응답했습니다. 시작만 하면 절대 후회하지 않으실 겁니다.",
        ],
    },
}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 스크립트 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ScriptEngine:
    def __init__(self, gemini_api_key: str = ""):
        self.gemini_key = gemini_api_key.strip() if gemini_api_key else ""
        self.client = None
        if self.gemini_key and httpx:
            self.client = httpx.AsyncClient(timeout=60.0)
            logger.info("[ScriptEngine] Gemini API key SET — will use AI generation")
        else:
            logger.warning("[ScriptEngine] Gemini API key MISSING — will use template fallback")

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

        # 2. 본문 (Gemini API or 풍부한 fallback)
        body_blocks = await self._generate_body(
            keyword, category, news_summary,
            core_facts or [],
            target_duration_sec - hook_block.duration_sec - 25,
        )

        # 3. Opinion Injector
        opinion_tone = select_opinion_tone(previous_tones)
        seed = random.choice(opinion_seeds) if opinion_seeds else ""
        opinion_block = generate_opinion(keyword, opinion_tone, seed)

        # 전체 조립
        all_blocks = [hook_block] + body_blocks + [opinion_block]
        total = sum(b.duration_sec for b in all_blocks)

        logger.info(f"[Script] Generated: {len(all_blocks)} blocks, {total:.0f}s, hook={hook_type.value}, tone={opinion_tone.value}")

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
                "generation_method": "gemini" if self.client else "template",
            },
        )

    async def _generate_body(self, keyword, category, news_summary, core_facts, target_sec) -> list[ScriptBlock]:
        if self.client and self.gemini_key:
            try:
                result = await self._gemini_body(keyword, category, news_summary, core_facts, target_sec)
                if result and len(result) >= 3:
                    return result
                logger.warning("[Script] Gemini returned too few blocks, using template")
            except Exception as e:
                logger.error(f"[Script] Gemini failed: {e}")

        return self._rich_fallback_body(keyword, category, news_summary, core_facts, target_sec)

    async def _gemini_body(self, keyword, category, news_summary, core_facts, target_sec) -> list[ScriptBlock]:
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
- 5~6개 문단으로 구성
- 각 문단은 80~150자 사이
- 각 문단은 하나의 핵심 포인트를 전달
- 시청자가 이해하기 쉬운 구어체 사용
- 숫자나 데이터를 포함하여 신뢰성 확보
- 전환어를 사용하여 자연스러운 흐름 유지
- 도입부(후킹)와 결론(의견)은 제외하고 본문만 작성

JSON 배열로만 반환하세요 (마크다운 없이):
[
  {{"paragraph": "문단 내용", "key_phrase": "핵심 문구"}},
  ...
]"""

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
            if t:
                blocks.append(ScriptBlock(
                    section=ScriptSection.BODY,
                    text=t,
                    duration_sec=round(len(t) / 4.5, 1),
                    subtitle_highlight=p.get("key_phrase", ""),
                ))

        logger.info(f"[Script] Gemini generated {len(blocks)} body blocks")
        return blocks

    def _rich_fallback_body(self, keyword, category, news_summary, core_facts, target_sec) -> list[ScriptBlock]:
        """카테고리별 풍부한 템플릿 기반 본문 (5~6단락)"""
        templates = BODY_TEMPLATES.get(category, BODY_TEMPLATES["economy"])
        news = news_summary or f"{keyword} 관련 최신 뉴스"
        if len(news) > 60:
            news = news[:60]

        blocks = []

        # 단락 순서: context → history → detail → data → practical
        sections = ["context", "history", "detail", "data", "practical"]
        for sec_key in sections:
            options = templates.get(sec_key, [])
            if options:
                text = random.choice(options).format(keyword=keyword, news=news)
                blocks.append(ScriptBlock(
                    section=ScriptSection.BODY,
                    text=text,
                    duration_sec=round(len(text) / 4.5, 1),
                    subtitle_highlight=keyword,
                ))

        # core_facts가 있으면 추가 단락
        if core_facts:
            for fact in core_facts[:2]:
                if len(fact) > 10:
                    text = f"또한 주목할 점은, {fact}입니다. 이 부분은 앞으로의 변화를 이해하는 데 중요한 단서가 됩니다."
                    blocks.append(ScriptBlock(
                        section=ScriptSection.BODY,
                        text=text,
                        duration_sec=round(len(text) / 4.5, 1),
                    ))

        logger.info(f"[Script] Template fallback generated {len(blocks)} body blocks")
        return blocks


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  변수형 공통 문구
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
