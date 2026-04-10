"""
Project Blackbox — Module A: 블루오션 지수 v2
═══════════════════════════════════════════════
v1 대비 개선사항:
  1. CPM 가중치를 BOI 공식 자체에 반영 (카테고리별 수익성 차등)
  2. 3단계 트렌드 → 연속 모멘텀 점수 (7일 데이터 기반 실수치)
  3. 다중 팩터 가중합 방식으로 상위권 변별력 확보
  4. 서브스코어 분해 투명성 확보 (UI에서 항목별 기여도 시각화 가능)
"""
import math
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  설정 테이블
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TrendDirection(str, Enum):
    UP = "up"
    STABLE = "stable"
    DOWN = "down"


# 카테고리별 CPM 기본 단가 및 수익 가중치
# cpm_weight: 전체 카테고리 평균 CPM 대비 비율 (평균=1.0)
CATEGORY_CONFIG = {
    "economy":  {"cpm_base": 15.0, "cpm_weight": 1.15},
    "senior":   {"cpm_base": 18.0, "cpm_weight": 1.38},   # 최고 수익 카테고리
    "selfdev":  {"cpm_base": 11.0, "cpm_weight": 0.85},
    "tech":     {"cpm_base": 13.0, "cpm_weight": 1.00},   # 기준선
    "life":     {"cpm_base":  9.0, "cpm_weight": 0.69},
}
_AVG_CPM = sum(c["cpm_base"] for c in CATEGORY_CONFIG.values()) / len(CATEGORY_CONFIG)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  팩터별 가중치 (합 = 1.0)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FACTOR_WEIGHTS = {
    "gap":       0.40,    # 검색량 vs 경쟁도 갭 (핵심)
    "momentum":  0.25,    # 7일 트렌드 모멘텀
    "cpm":       0.20,    # 카테고리 수익성
    "volume":    0.15,    # 절대 검색량 보너스
}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  데이터 클래스
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class SubScores:
    """BOI를 구성하는 4개 서브스코어 (각각 0~5 범위)"""
    gap_score: float       = 0.0   # 검색량÷경쟁도 갭
    momentum_score: float  = 0.0   # 트렌드 모멘텀
    cpm_score: float       = 0.0   # CPM 수익성
    volume_score: float    = 0.0   # 절대 검색량


@dataclass
class KeywordAnalysisV2:
    """v2 키워드 분석 결과"""
    keyword: str
    search_volume: int
    competition_count: int
    blue_ocean_index: float
    sub_scores: SubScores
    trend_direction: TrendDirection
    trend_momentum: float           # -1.0 ~ +1.0 (연속 수치)
    estimated_cpm: float
    opportunity_grade: str
    category_slug: str
    # v1 호환
    trend_weight: float = 1.0


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  서브스코어 계산 함수들
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _calc_gap_score(search_volume: int, competition_count: int) -> float:
    """
    팩터 1: 검색량 대비 경쟁도 갭 (0~5)

    v1과 동일한 log-ratio 기반이지만 정규화 구간을 넓혀
    상위권 변별력을 확보합니다.
    """
    if search_volume <= 0:
        return 0.0

    num = math.log10(max(search_volume, 1))
    den = math.log10(competition_count + 2)
    raw = num / den                           # 대략 2.0 ~ 6.0

    # S자 커브 정규화: 중앙값 3.5 기준, 완만한 시그모이드
    # 이렇게 하면 상위권(raw 5~6)이 4.5~5.0에 부드럽게 분포
    normalized = 5.0 / (1.0 + math.exp(-1.2 * (raw - 3.5)))
    return round(max(0.0, min(5.0, normalized)), 3)


def _calc_momentum_score(
    trend_momentum: float,
    trend_direction: TrendDirection,
) -> float:
    """
    팩터 2: 7일 트렌드 모멘텀 (0~5)

    trend_momentum: -1.0(급락) ~ 0.0(유지) ~ +1.0(급등)
    실시간 데이터가 없으면 trend_direction으로 대체합니다.

    공식: score = 2.5 + (momentum × 2.5)
    → momentum +1.0 = 5.0점, 0.0 = 2.5점, -1.0 = 0.0점
    """
    if trend_momentum is not None:
        score = 2.5 + (trend_momentum * 2.5)
    else:
        # fallback: 방향만 있을 때 (v1 호환)
        fallback = {TrendDirection.UP: 0.5, TrendDirection.STABLE: 0.0, TrendDirection.DOWN: -0.5}
        m = fallback.get(trend_direction, 0.0)
        score = 2.5 + (m * 2.5)

    return round(max(0.0, min(5.0, score)), 3)


def _calc_cpm_score(category_slug: str) -> float:
    """
    팩터 3: 카테고리 CPM 수익성 (0~5)

    카테고리 CPM이 전체 평균 대비 얼마나 높은지를 점수화합니다.
    시니어($18) → 높은 점수, 라이프($9) → 낮은 점수

    공식: score = (cpm_weight / max_weight) × 5.0
    """
    config = CATEGORY_CONFIG.get(category_slug, {"cpm_weight": 1.0})
    weight = config["cpm_weight"]

    max_weight = max(c["cpm_weight"] for c in CATEGORY_CONFIG.values())
    score = (weight / max_weight) * 5.0
    return round(max(0.0, min(5.0, score)), 3)


def _calc_volume_score(search_volume: int) -> float:
    """
    팩터 4: 절대 검색량 보너스 (0~5)

    검색량이 높을수록 잠재 시청자 풀이 크므로 보너스.
    로그 스케일로 10K=1.0, 50K=2.5, 100K=3.3, 500K=4.5

    공식: score = log10(volume) / log10(500000) × 5.0
    """
    if search_volume <= 0:
        return 0.0

    raw = math.log10(max(search_volume, 1)) / math.log10(500000)
    return round(max(0.0, min(5.0, raw * 5.0)), 3)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 BOI v2 계산
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def calculate_blue_ocean_v2(
    search_volume: int,
    competition_count: int,
    category_slug: str,
    trend_momentum: Optional[float] = None,
    trend_direction: TrendDirection = TrendDirection.STABLE,
) -> tuple[float, SubScores]:
    """
    블루오션 지수 v2 산출

    공식: BOI = Σ(factor_score × factor_weight)

    4개 팩터의 가중합으로 최종 점수를 산출합니다.
    각 팩터는 독립적으로 0~5 범위의 서브스코어를 가지며,
    가중치 합이 1.0이므로 최종 BOI도 0~5 범위입니다.
    """
    gap   = _calc_gap_score(search_volume, competition_count)
    mom   = _calc_momentum_score(trend_momentum, trend_direction)
    cpm   = _calc_cpm_score(category_slug)
    vol   = _calc_volume_score(search_volume)

    sub = SubScores(
        gap_score=gap,
        momentum_score=mom,
        cpm_score=cpm,
        volume_score=vol,
    )

    boi = (
        gap * FACTOR_WEIGHTS["gap"]
        + mom * FACTOR_WEIGHTS["momentum"]
        + cpm * FACTOR_WEIGHTS["cpm"]
        + vol * FACTOR_WEIGHTS["volume"]
    )

    return round(max(0.0, min(5.0, boi)), 2), sub


def classify_opportunity_v2(boi: float) -> str:
    """v2 등급 분류 — v1과 동일 기준 유지"""
    if boi >= 4.5:   return "A+"
    elif boi >= 4.0: return "A"
    elif boi >= 3.5: return "B"
    elif boi >= 3.0: return "C"
    elif boi >= 2.0: return "D"
    else:            return "F"


def estimate_cpm_v2(
    category_slug: str,
    boi: float,
    trend_momentum: Optional[float] = None,
    trend_direction: TrendDirection = TrendDirection.STABLE,
) -> float:
    """v2 CPM 추정 — 모멘텀 기반"""
    config = CATEGORY_CONFIG.get(category_slug, {"cpm_base": 10.0})
    base = config["cpm_base"]

    boi_mult = 0.8 + (boi / 5.0) * 0.4       # 0.8x ~ 1.2x

    if trend_momentum is not None:
        trend_mult = 1.0 + (trend_momentum * 0.3)   # 0.7x ~ 1.3x
    else:
        fallback = {TrendDirection.UP: 1.3, TrendDirection.STABLE: 1.0, TrendDirection.DOWN: 0.7}
        trend_mult = fallback.get(trend_direction, 1.0)

    return round(base * boi_mult * trend_mult, 2)


def momentum_from_daily_data(daily_values: list[int]) -> float:
    """
    7일 검색량 데이터로 모멘텀 산출

    입력: [day1, day2, day3, day4, day5, day6, day7] (최근→과거)
    출력: -1.0 ~ +1.0

    계산:
      recent_avg = (day1 + day2 + day3) / 3
      prev_avg   = (day5 + day6 + day7) / 3
      momentum   = (recent_avg - prev_avg) / max(prev_avg, 1)
      clamped    = clamp(momentum, -1.0, 1.0)
    """
    if len(daily_values) < 7:
        return 0.0

    recent = sum(daily_values[:3]) / 3
    prev   = sum(daily_values[4:7]) / 3

    if prev <= 0:
        return 1.0 if recent > 0 else 0.0

    raw = (recent - prev) / prev
    return round(max(-1.0, min(1.0, raw)), 3)


def direction_from_momentum(momentum: float) -> TrendDirection:
    """모멘텀 값에서 방향 라벨 추출"""
    if momentum >= 0.15:
        return TrendDirection.UP
    elif momentum <= -0.15:
        return TrendDirection.DOWN
    else:
        return TrendDirection.STABLE


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 분석 함수
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def analyze_keyword_v2(
    keyword: str,
    search_volume: int,
    competition_count: int,
    category_slug: str = "economy",
    trend_momentum: Optional[float] = None,
    trend_direction: TrendDirection = TrendDirection.STABLE,
    daily_trend_data: Optional[list[int]] = None,
) -> KeywordAnalysisV2:
    """
    v2 단일 키워드 종합 분석

    daily_trend_data가 제공되면 자동으로 momentum 산출
    없으면 trend_momentum 또는 trend_direction으로 fallback
    """
    # 7일 데이터가 있으면 모멘텀 자동 산출
    if daily_trend_data and len(daily_trend_data) >= 7:
        trend_momentum = momentum_from_daily_data(daily_trend_data)
        trend_direction = direction_from_momentum(trend_momentum)

    boi, sub = calculate_blue_ocean_v2(
        search_volume, competition_count,
        category_slug, trend_momentum, trend_direction,
    )
    grade = classify_opportunity_v2(boi)
    cpm = estimate_cpm_v2(category_slug, boi, trend_momentum, trend_direction)

    return KeywordAnalysisV2(
        keyword=keyword,
        search_volume=search_volume,
        competition_count=competition_count,
        blue_ocean_index=boi,
        sub_scores=sub,
        trend_direction=trend_direction,
        trend_momentum=trend_momentum if trend_momentum is not None else 0.0,
        estimated_cpm=cpm,
        opportunity_grade=grade,
        category_slug=category_slug,
    )


def rank_keywords_v2(analyses: list[KeywordAnalysisV2]) -> list[KeywordAnalysisV2]:
    """BOI 내림차순 정렬"""
    return sorted(analyses, key=lambda a: a.blue_ocean_index, reverse=True)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  v1 vs v2 비교 테스트
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    from module_a.core.blue_ocean import (
        analyze_keyword as v1_analyze,
        rank_keywords as v1_rank,
        TrendDirection as V1Trend,
    )

    test_cases = [
        # (keyword, volume, competition, momentum, daily_data, direction, category)
        ("시니어 연금 수령액 계산법", 68000,  6,   0.65, [850,820,780,700,520,490,510], "up",     "senior"),
        ("ISA 계좌 세금 혜택",      51000,  8,   0.42, [640,610,590,560,450,440,430], "up",     "economy"),
        ("2026 하반기 금리 전망",    74000,  12,  0.78, [980,950,900,800,550,520,500], "up",     "economy"),
        ("기초연금 40만원 수급 조건", 92000,  14,  0.35, [920,900,880,850,680,670,660], "up",     "senior"),
        ("AI 에이전트 활용법 2026",  83000,  15,  0.55, [880,840,800,750,570,550,530], "up",     "tech"),
        ("아침 루틴 5가지 습관",     38000,  22,  0.02, [380,375,372,370,373,375,370], "stable", "selfdev"),
        ("비트코인 반감기 이후 전망", 120000, 87, -0.40, [600,650,700,800,1000,1050,1100], "down", "economy"),
    ]

    print("=" * 90)
    print("  PROJECT BLACKBOX — Blue Ocean Index v1 vs v2 비교")
    print("=" * 90)

    for kw, vol, comp, mom, daily, trend_str, cat in test_cases:
        # v1
        v1_dir = V1Trend(trend_str)
        v1 = v1_analyze(kw, vol, comp, v1_dir, cat)

        # v2
        v2_dir = TrendDirection(trend_str)
        v2 = analyze_keyword_v2(kw, vol, comp, cat, mom, v2_dir, daily)

        delta = v2.blue_ocean_index - v1.blue_ocean_index
        arrow = "▲" if delta > 0 else "▼" if delta < 0 else "─"

        print(f"\n  {kw}")
        print(f"  {'─' * 60}")
        print(f"  검색량: {vol:>8,}  경쟁: {comp:>3}편  카테고리: {cat}")
        print(f"  모멘텀: {mom:>+.2f}  (7일 데이터: {daily[:3]}...{daily[-3:]})")
        print(f"")
        print(f"  v1 BOI: {v1.blue_ocean_index:>5.2f} [{v1.opportunity_grade:>2}]  CPM: ${v1.estimated_cpm:>6.2f}")
        print(f"  v2 BOI: {v2.blue_ocean_index:>5.2f} [{v2.opportunity_grade:>2}]  CPM: ${v2.estimated_cpm:>6.2f}  {arrow} {abs(delta):+.2f}")
        print(f"     ├─ 갭 점수:     {v2.sub_scores.gap_score:>5.3f} × {FACTOR_WEIGHTS['gap']}")
        print(f"     ├─ 모멘텀 점수: {v2.sub_scores.momentum_score:>5.3f} × {FACTOR_WEIGHTS['momentum']}")
        print(f"     ├─ CPM 점수:    {v2.sub_scores.cpm_score:>5.3f} × {FACTOR_WEIGHTS['cpm']}")
        print(f"     └─ 볼륨 점수:   {v2.sub_scores.volume_score:>5.3f} × {FACTOR_WEIGHTS['volume']}")
