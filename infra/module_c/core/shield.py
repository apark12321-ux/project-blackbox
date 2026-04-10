"""
Project Blackbox — Module C: 알고리즘 실드 (Anti-Detection)
═══════════════════════════════════════════════════════════
Module B에서 생성된 영상에 유니크성을 부여하여
유튜브 '재사용 콘텐츠' 판독을 회피합니다.

3중 변주 레이어:
  Layer 1 — 비주얼 변주 (픽셀 메타데이터)
  Layer 2 — 오디오 변주 (피치/속도 미세 조정)
  Layer 3 — 메타데이터 변주 (UUID/파일 해시)
"""
import uuid
import random
import math
import json
import logging
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  변주 범위 설정 (육안/육청 식별 불가 수준)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class VariationRange:
    """변주 파라미터 허용 범위"""
    # 비주얼 (1~2% 이내)
    brightness_range: tuple = (-0.02, 0.02)      # ±2%
    contrast_range: tuple = (-0.02, 0.02)         # ±2%
    saturation_range: tuple = (-0.03, 0.03)       # ±3%
    hue_shift_range: tuple = (-2.0, 2.0)          # ±2도
    noise_strength_range: tuple = (0.5, 2.0)      # 노이즈 강도
    sharpen_range: tuple = (0.0, 0.3)             # 샤프닝

    # 오디오 (식별 불가 수준)
    pitch_semitone_range: tuple = (-0.08, 0.08)   # ±0.08 반음
    tempo_range: tuple = (0.99, 1.01)             # ±1% 속도
    bass_boost_range: tuple = (0, 3)              # 0~3dB
    treble_range: tuple = (-1, 1)                 # ±1dB

    # 프레임 (구조적)
    intro_pad_range: tuple = (0.1, 0.5)           # 인트로 무음 패딩 (초)
    outro_pad_range: tuple = (0.2, 0.8)           # 아웃트로 패딩 (초)


DEFAULT_RANGE = VariationRange()


@dataclass
class VariationParams:
    """단일 영상에 적용될 변주 파라미터 (매번 랜덤 생성)"""
    # 비주얼
    brightness: float = 0.0
    contrast: float = 0.0
    saturation: float = 0.0
    hue_shift: float = 0.0
    noise_strength: float = 1.0
    sharpen: float = 0.0

    # 오디오
    pitch_semitone: float = 0.0
    tempo: float = 1.0
    bass_boost_db: float = 0.0
    treble_db: float = 0.0

    # 프레임
    intro_pad_sec: float = 0.0
    outro_pad_sec: float = 0.0

    # 메타
    unique_id: str = ""
    file_hash_salt: str = ""


def generate_variation_params(vr: VariationRange = None) -> VariationParams:
    """매번 다른 랜덤 변주 파라미터 생성"""
    r = vr or DEFAULT_RANGE

    def rf(rng): return round(random.uniform(rng[0], rng[1]), 4)

    return VariationParams(
        brightness=rf(r.brightness_range),
        contrast=rf(r.contrast_range),
        saturation=rf(r.saturation_range),
        hue_shift=rf(r.hue_shift_range),
        noise_strength=rf(r.noise_strength_range),
        sharpen=rf(r.sharpen_range),
        pitch_semitone=rf(r.pitch_semitone_range),
        tempo=rf(r.tempo_range),
        bass_boost_db=rf(r.bass_boost_range),
        treble_db=rf(r.treble_range),
        intro_pad_sec=rf(r.intro_pad_range),
        outro_pad_sec=rf(r.outro_pad_range),
        unique_id=str(uuid.uuid4()),
        file_hash_salt=uuid.uuid4().hex[:16],
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  FFmpeg 변주 필터 생성기
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class AntiDetectionFilter:
    """FFmpeg filter_complex 문자열 생성기"""

    @staticmethod
    def build_video_filters(p: VariationParams) -> str:
        """비주얼 변주 필터 체인"""
        filters = []

        # 1. 밝기/대비/채도 조정 (eq 필터)
        brightness = p.brightness
        contrast = 1.0 + p.contrast
        saturation = 1.0 + p.saturation
        filters.append(
            f"eq=brightness={brightness}:contrast={contrast}:saturation={saturation}"
        )

        # 2. 색조 미세 변경 (hue 필터)
        if abs(p.hue_shift) > 0.1:
            filters.append(f"hue=h={p.hue_shift}")

        # 3. 미세 노이즈 추가 (재사용 판별 핑거프린트 교란)
        noise_seed = random.randint(1, 999999)
        filters.append(
            f"noise=alls={int(p.noise_strength)}:allf=t:seed={noise_seed}"
        )

        # 4. 샤프닝 (엣지 미세 변경)
        if p.sharpen > 0.05:
            filters.append(f"unsharp=5:5:{p.sharpen:.2f}")

        # 5. 인트로/아웃트로 프레임 패딩 (영상 길이 미세 변경)
        if p.intro_pad_sec > 0.05:
            # 검은 프레임 대신 첫 프레임 복제로 자연스러운 시작
            filters.append(f"tpad=start_duration={p.intro_pad_sec}:start_mode=clone")
        if p.outro_pad_sec > 0.05:
            filters.append(f"tpad=stop_duration={p.outro_pad_sec}:stop_mode=clone")

        return ",".join(filters)

    @staticmethod
    def build_audio_filters(p: VariationParams) -> str:
        """오디오 변주 필터 체인"""
        filters = []

        # 1. 피치 미세 조정 (rubberband 필터)
        # semitone → frequency ratio: 2^(semitone/12)
        if abs(p.pitch_semitone) > 0.01:
            pitch_factor = math.pow(2, p.pitch_semitone / 12)
            filters.append(f"asetrate=44100*{pitch_factor:.6f},aresample=44100")

        # 2. 템포 미세 조정
        if abs(p.tempo - 1.0) > 0.002:
            filters.append(f"atempo={p.tempo:.4f}")

        # 3. 저음 부스트 (오디오 핑거프린트 변경)
        if p.bass_boost_db > 0.5:
            filters.append(f"bass=g={p.bass_boost_db:.1f}:f=100")

        # 4. 고음 미세 조정
        if abs(p.treble_db) > 0.3:
            filters.append(f"treble=g={p.treble_db:.1f}:f=3000")

        return ",".join(filters) if filters else "anull"

    @staticmethod
    def build_metadata_flags(p: VariationParams) -> list[str]:
        """FFmpeg 메타데이터 주입 플래그"""
        return [
            "-metadata", f"comment=blackbox_{p.unique_id}",
            "-metadata", f"encoded_by=ProjectBlackbox/{p.file_hash_salt}",
            "-metadata", f"creation_time={_random_creation_time()}",
            "-metadata:s:v", f"handler_name=Blackbox Video {p.unique_id[:8]}",
            "-metadata:s:a", f"handler_name=Blackbox Audio {p.file_hash_salt[:8]}",
        ]

    @classmethod
    def build_full_command(
        cls,
        input_path: str,
        output_path: str,
        params: VariationParams,
    ) -> str:
        """완성된 FFmpeg 변주 명령어"""
        vf = cls.build_video_filters(params)
        af = cls.build_audio_filters(params)
        meta = cls.build_metadata_flags(params)

        cmd_parts = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-vf", f'"{vf}"',
            "-af", f'"{af}"',
        ] + meta + [
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            output_path,
        ]

        return " ".join(cmd_parts)


def _random_creation_time() -> str:
    """랜덤 생성 시각 (메타데이터 유니크성)"""
    import datetime
    base = datetime.datetime.utcnow()
    offset = random.randint(-3600, 3600)
    t = base + datetime.timedelta(seconds=offset)
    return t.strftime("%Y-%m-%dT%H:%M:%S.000000Z")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Safety Score 산출 엔진
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class SafetyFactor:
    """개별 안전 팩터"""
    name: str
    score: float            # 0~100
    weight: float           # 가중치
    description: str
    suggestion: str = ""    # 개선 제안


@dataclass
class SafetyReport:
    """수익화 안전성 종합 리포트"""
    total_score: float      # 0~100
    grade: str              # A+, A, B, C, D, F
    factors: list[SafetyFactor]
    passed: bool            # 안전 기준 통과 여부 (70점 이상)
    risk_items: list[str]   # 위험 요소 목록


SAFETY_WEIGHTS = {
    "human_touch": 0.30,        # 휴먼터치 (아바타, 주관적 견해)
    "uniqueness": 0.25,         # 유니크성 (변주 적용 여부)
    "content_depth": 0.20,      # 콘텐츠 깊이 (팩트 수, 분량)
    "visual_variety": 0.15,     # 시각적 다양성 (레이아웃 랜덤)
    "metadata_clean": 0.10,     # 메타데이터 정합성
}


def calculate_safety_score(
    has_avatar: bool = True,
    has_opinion: bool = True,
    has_custom_voice: bool = False,
    script_sections: int = 0,
    total_duration_sec: float = 0,
    core_facts_count: int = 0,
    variation_applied: bool = False,
    variation_params: VariationParams = None,
    unique_subtitle: bool = True,
    unique_hashtags: bool = True,
) -> SafetyReport:
    """
    수익화 안전 점수(Safety Score) 산출

    유튜브 '재사용 콘텐츠' 판독 기준을 역분석하여
    각 팩터별 점수를 산출하고 종합 등급을 부여합니다.
    """
    factors = []
    risks = []

    # ── Factor 1: 휴먼터치 (30%) ──
    ht_score = 0.0
    if has_avatar:
        ht_score += 35          # 아바타 존재
    if has_opinion:
        ht_score += 30          # 주관적 견해 포함
    if has_custom_voice:
        ht_score += 20          # 커스텀 보이스 사용
    else:
        ht_score += 10          # 기본 TTS
    if total_duration_sec >= 120:
        ht_score += 5           # 충분한 분량
    ht_score = min(100, ht_score)

    suggestion = ""
    if not has_opinion:
        suggestion = "Opinion Injector를 활성화하세요"
        risks.append("주관적 견해 미포함")
    if not has_avatar:
        suggestion = "AI 아바타를 추가하세요"
        risks.append("아바타 미적용")

    factors.append(SafetyFactor(
        name="휴먼터치", score=ht_score,
        weight=SAFETY_WEIGHTS["human_touch"],
        description="아바타, 주관적 견해, 커스텀 보이스",
        suggestion=suggestion,
    ))

    # ── Factor 2: 유니크성 (25%) ──
    uq_score = 0.0
    if variation_applied and variation_params:
        uq_score += 40          # 변주 적용됨
        # 변주 강도에 따른 가산
        v = variation_params
        strength = (
            abs(v.brightness) * 500
            + abs(v.contrast) * 500
            + abs(v.saturation) * 333
            + abs(v.hue_shift) * 5
            + abs(v.pitch_semitone) * 625
            + abs(v.noise_strength - 1.0) * 20
        )
        uq_score += min(40, strength)
    if unique_subtitle:
        uq_score += 10
    if unique_hashtags:
        uq_score += 10
    uq_score = min(100, uq_score)

    if not variation_applied:
        risks.append("비주얼/오디오 변주 미적용")

    factors.append(SafetyFactor(
        name="유니크성", score=uq_score,
        weight=SAFETY_WEIGHTS["uniqueness"],
        description="픽셀/오디오 변주, 자막/해시태그 고유성",
        suggestion="" if variation_applied else "알고리즘 실드를 활성화하세요",
    ))

    # ── Factor 3: 콘텐츠 깊이 (20%) ──
    cd_score = 0.0
    if script_sections >= 5:
        cd_score += 40
    elif script_sections >= 3:
        cd_score += 25
    else:
        cd_score += 10

    if core_facts_count >= 3:
        cd_score += 30
    elif core_facts_count >= 1:
        cd_score += 15

    if total_duration_sec >= 180:
        cd_score += 30
    elif total_duration_sec >= 90:
        cd_score += 20
    elif total_duration_sec >= 30:
        cd_score += 10
    cd_score = min(100, cd_score)

    if total_duration_sec < 60:
        risks.append("영상 길이 1분 미만 — 콘텐츠 부족")

    factors.append(SafetyFactor(
        name="콘텐츠 깊이", score=cd_score,
        weight=SAFETY_WEIGHTS["content_depth"],
        description="팩트 수, 스크립트 분량, 영상 길이",
        suggestion="" if cd_score >= 60 else "팩트를 3개 이상 포함하세요",
    ))

    # ── Factor 4: 시각적 다양성 (15%) ──
    vv_score = 0.0
    if has_avatar:
        vv_score += 30          # PiP 레이아웃
    if variation_applied:
        vv_score += 25          # 시각 변주
    vv_score += 20              # NotebookLM 레이아웃 (기본)
    if unique_subtitle:
        vv_score += 15
    # 줌/전환 효과 (기본 적용)
    vv_score += 10
    vv_score = min(100, vv_score)

    factors.append(SafetyFactor(
        name="시각적 다양성", score=vv_score,
        weight=SAFETY_WEIGHTS["visual_variety"],
        description="레이아웃, 줌 효과, PiP, 자막 스타일",
    ))

    # ── Factor 5: 메타데이터 정합성 (10%) ──
    mc_score = 50               # 기본 점수
    if variation_params and variation_params.unique_id:
        mc_score += 30          # 고유 UUID
    if variation_params and variation_params.file_hash_salt:
        mc_score += 20          # 고유 해시 솔트
    mc_score = min(100, mc_score)

    factors.append(SafetyFactor(
        name="메타데이터 정합성", score=mc_score,
        weight=SAFETY_WEIGHTS["metadata_clean"],
        description="고유 UUID, 파일 해시, 생성 시각",
    ))

    # ── 종합 점수 ──
    total = sum(f.score * f.weight for f in factors)
    total = round(min(100, max(0, total)), 1)

    grade = _score_to_grade(total)
    passed = total >= 70

    return SafetyReport(
        total_score=total,
        grade=grade,
        factors=factors,
        passed=passed,
        risk_items=risks,
    )


def _score_to_grade(score: float) -> str:
    if score >= 95: return "A+"
    if score >= 85: return "A"
    if score >= 75: return "B"
    if score >= 65: return "C"
    if score >= 50: return "D"
    return "F"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  통합 실드 파이프라인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@dataclass
class ShieldResult:
    """알고리즘 실드 적용 결과"""
    job_id: str
    input_path: str
    output_path: str
    variation_params: VariationParams
    safety_report: SafetyReport
    ffmpeg_cmd: str
    video_filters: str
    audio_filters: str
    metadata_flags: list[str]


class AlgorithmShield:
    """
    Module C 통합 파이프라인

    1. 랜덤 변주 파라미터 생성
    2. FFmpeg 비주얼/오디오 필터 빌드
    3. 메타데이터 주입 플래그 생성
    4. Safety Score 산출
    5. 최종 명령어 출력
    """

    def __init__(self, variation_range: VariationRange = None):
        self.range = variation_range or DEFAULT_RANGE
        self.filter_builder = AntiDetectionFilter()

    def apply_shield(
        self,
        input_path: str,
        output_path: str,
        has_avatar: bool = True,
        has_opinion: bool = True,
        has_custom_voice: bool = False,
        script_sections: int = 5,
        total_duration_sec: float = 180.0,
        core_facts_count: int = 3,
    ) -> ShieldResult:
        """알고리즘 실드 전체 적용"""
        job_id = str(uuid.uuid4())[:8]

        # 1. 랜덤 변주 파라미터
        params = generate_variation_params(self.range)

        # 2. 필터 빌드
        vf = self.filter_builder.build_video_filters(params)
        af = self.filter_builder.build_audio_filters(params)
        meta = self.filter_builder.build_metadata_flags(params)

        # 3. FFmpeg 명령어
        cmd = self.filter_builder.build_full_command(input_path, output_path, params)

        # 4. Safety Score
        report = calculate_safety_score(
            has_avatar=has_avatar,
            has_opinion=has_opinion,
            has_custom_voice=has_custom_voice,
            script_sections=script_sections,
            total_duration_sec=total_duration_sec,
            core_facts_count=core_facts_count,
            variation_applied=True,
            variation_params=params,
            unique_subtitle=True,
            unique_hashtags=True,
        )

        return ShieldResult(
            job_id=job_id,
            input_path=input_path,
            output_path=output_path,
            variation_params=params,
            safety_report=report,
            ffmpeg_cmd=cmd,
            video_filters=vf,
            audio_filters=af,
            metadata_flags=meta,
        )
