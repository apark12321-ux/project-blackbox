"""
Project Blackbox — Module A: 블루오션 지수 산출 엔진
핵심 알고리즘: 검색량, 경쟁도, 트렌드를 종합하여 틈새시장 기회를 수치화
"""
import math
from dataclasses import dataclass
from enum import Enum


class TrendDirection(str, Enum):
    UP = "up"
    STABLE = "stable"
    DOWN = "down"


# ─── 트렌드 방향별 가중치 ───
TREND_WEIGHTS = {
    TrendDirection.UP: 1.3,        # 급상승 키워드에 30% 보너스
    TrendDirection.STABLE: 1.0,    # 유지 키워드는 기본값
    TrendDirection.DOWN: 0.7,      # 하락 키워드에 30% 페널티
}

# ─── CPM 카테고리별 기본 단가 ($) ───
CATEGORY_CPM_BASE = {
    "economy": 15.0,
    "senior": 18.0,
    "selfdev": 11.0,
    "tech": 13.0,
    "life": 9.0,
}


@dataclass
class KeywordAnalysis:
    """키워드 분석 결과 데이터 클래스"""
    keyword: str
    search_volume: int
    competition_count: int
    blue_ocean_index: float
    trend_direction: TrendDirection
    trend_weight: float
    estimated_cpm: float
    opportunity_grade: str          # A+, A, B, C, D, F


def calculate_blue_ocean_index(
    search_volume: int,
    competition_count: int,
    trend_direction: TrendDirection = TrendDirection.STABLE,
) -> float:
    """
    블루오션 지수 산출 공식

    공식: BOI = (log10(search_volume) / log10(competition_count + 2)) × trend_weight

    - search_volume: 월간 검색량 (Google Trends 기반 추정)
    - competition_count: 해당 키워드로 제작된 유튜브 영상 수
    - trend_direction: 키워드 트렌드 방향 (up/stable/down)

    반환: 0.0 ~ 5.0 범위의 블루오션 지수
    """
    if search_volume <= 0:
        return 0.0

    trend_weight = TREND_WEIGHTS.get(trend_direction, 1.0)

    # 로그 스케일로 검색량 대비 경쟁도 비율 계산
    # +2 를 하는 이유: competition_count=0 일 때 log(2)≈0.30 으로 나누기 에러 방지
    numerator = math.log10(max(search_volume, 1))
    denominator = math.log10(competition_count + 2)

    raw_score = (numerator / denominator) * trend_weight

    # 0~5 범위로 정규화 (실무 데이터 기준 raw_score는 대략 1.5~6.0)
    normalized = max(0.0, min(5.0, (raw_score - 1.5) * (5.0 / 4.5)))

    return round(normalized, 2)


def classify_opportunity(blue_ocean_index: float) -> str:
    """블루오션 지수 기반 기회 등급 분류"""
    if blue_ocean_index >= 4.5:
        return "A+"     # 즉시 제작 권장 — 황금 틈새
    elif blue_ocean_index >= 4.0:
        return "A"      # 높은 기회 — 우선 제작 대상
    elif blue_ocean_index >= 3.5:
        return "B"      # 보통 기회 — 차별화 전략 필요
    elif blue_ocean_index >= 3.0:
        return "C"      # 경쟁 보통 — 추가 분석 필요
    elif blue_ocean_index >= 2.0:
        return "D"      # 과열 시장 — 비추천
    else:
        return "F"      # 레드오션 — 진입 금지


def estimate_cpm(
    category_slug: str,
    blue_ocean_index: float,
    trend_direction: TrendDirection,
) -> float:
    """
    예상 CPM 추정
    높은 블루오션 + 상승 트렌드 = 더 높은 광고 단가
    """
    base_cpm = CATEGORY_CPM_BASE.get(category_slug, 10.0)
    boi_multiplier = 0.8 + (blue_ocean_index / 5.0) * 0.4   # 0.8x ~ 1.2x
    trend_mult = TREND_WEIGHTS.get(trend_direction, 1.0)
    return round(base_cpm * boi_multiplier * trend_mult, 2)


def analyze_keyword(
    keyword: str,
    search_volume: int,
    competition_count: int,
    trend_direction: TrendDirection,
    category_slug: str = "economy",
) -> KeywordAnalysis:
    """
    단일 키워드 종합 분석

    Returns:
        KeywordAnalysis 데이터 클래스
    """
    boi = calculate_blue_ocean_index(search_volume, competition_count, trend_direction)
    grade = classify_opportunity(boi)
    cpm = estimate_cpm(category_slug, boi, trend_direction)
    trend_weight = TREND_WEIGHTS.get(trend_direction, 1.0)

    return KeywordAnalysis(
        keyword=keyword,
        search_volume=search_volume,
        competition_count=competition_count,
        blue_ocean_index=boi,
        trend_direction=trend_direction,
        trend_weight=trend_weight,
        estimated_cpm=cpm,
        opportunity_grade=grade,
    )


def rank_keywords(analyses: list[KeywordAnalysis]) -> list[KeywordAnalysis]:
    """블루오션 지수 기준 내림차순 정렬"""
    return sorted(analyses, key=lambda a: a.blue_ocean_index, reverse=True)


# ─── 테스트 실행 ───
if __name__ == "__main__":
    test_cases = [
        ("시니어 연금 수령액 계산법", 68000, 6, TrendDirection.UP, "senior"),
        ("비트코인 반감기 이후 전망", 120000, 87, TrendDirection.DOWN, "economy"),
        ("2026 하반기 금리 전망", 74000, 12, TrendDirection.UP, "economy"),
        ("AI 에이전트 활용법 2026", 83000, 15, TrendDirection.UP, "tech"),
        ("아침 루틴 5가지 습관", 38000, 22, TrendDirection.STABLE, "selfdev"),
    ]

    results = []
    for kw, vol, comp, trend, cat in test_cases:
        analysis = analyze_keyword(kw, vol, comp, trend, cat)
        results.append(analysis)

    ranked = rank_keywords(results)

    print("=" * 80)
    print("PROJECT BLACKBOX — Blue Ocean Index Analysis")
    print("=" * 80)
    for i, r in enumerate(ranked, 1):
        print(f"\n#{i} [{r.opportunity_grade}] {r.keyword}")
        print(f"   검색량: {r.search_volume:,} | 경쟁: {r.competition_count}편")
        print(f"   블루오션 지수: {r.blue_ocean_index}/5.0 | 트렌드: {r.trend_direction.value}")
        print(f"   예상 CPM: ${r.estimated_cpm}")
