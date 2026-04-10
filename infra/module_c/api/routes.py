"""
Project Blackbox — Module C: FastAPI 엔드포인트
/api/v1/shield/* 라우터
"""
from datetime import datetime
from fastapi import APIRouter

from module_c.schemas.api_schemas import (
    ShieldRequest, ShieldResponse,
    VariationParamsResponse, SafetyReportResponse, SafetyFactorResponse,
    SafetyCheckRequest,
)
from module_c.core.shield import (
    AlgorithmShield, calculate_safety_score, generate_variation_params,
)

router = APIRouter(prefix="/api/v1/shield", tags=["Module C: Algorithm Shield"])

_shield = AlgorithmShield()


@router.post("/apply", response_model=ShieldResponse)
async def apply_shield(req: ShieldRequest):
    """
    알고리즘 실드 적용 — 3중 변주 + Safety Score

    Module B 출력 영상에 비주얼/오디오/메타데이터 변주를 적용하고
    수익화 안전 점수를 산출합니다.
    """
    out = req.output_path or req.input_path.replace(".mp4", "_shielded.mp4")
    result = _shield.apply_shield(
        input_path=req.input_path,
        output_path=out,
        has_avatar=req.has_avatar,
        has_opinion=req.has_opinion,
        has_custom_voice=req.has_custom_voice,
        script_sections=req.script_sections,
        total_duration_sec=req.total_duration_sec,
        core_facts_count=req.core_facts_count,
    )

    vp = result.variation_params
    sr = result.safety_report

    return ShieldResponse(
        job_id=result.job_id,
        input_path=result.input_path,
        output_path=result.output_path,
        variation_params=VariationParamsResponse(
            brightness=vp.brightness, contrast=vp.contrast,
            saturation=vp.saturation, hue_shift=vp.hue_shift,
            noise_strength=vp.noise_strength, sharpen=vp.sharpen,
            pitch_semitone=vp.pitch_semitone, tempo=vp.tempo,
            bass_boost_db=vp.bass_boost_db, treble_db=vp.treble_db,
            intro_pad_sec=vp.intro_pad_sec, outro_pad_sec=vp.outro_pad_sec,
            unique_id=vp.unique_id, file_hash_salt=vp.file_hash_salt,
        ),
        safety_report=SafetyReportResponse(
            total_score=sr.total_score,
            grade=sr.grade,
            factors=[SafetyFactorResponse(
                name=f.name, score=f.score, weight=f.weight,
                description=f.description, suggestion=f.suggestion,
            ) for f in sr.factors],
            passed=sr.passed,
            risk_items=sr.risk_items,
        ),
        ffmpeg_cmd=result.ffmpeg_cmd,
        video_filters=result.video_filters,
        audio_filters=result.audio_filters,
        created_at=datetime.utcnow(),
    )


@router.post("/safety-check", response_model=SafetyReportResponse)
async def safety_check(req: SafetyCheckRequest):
    """
    Safety Score 사전 검사 (영상 렌더링 전)

    현재 설정으로 수익화 안전 점수가 얼마인지 미리 확인합니다.
    70점 미만이면 개선 제안을 반환합니다.
    """
    vp = generate_variation_params() if req.variation_applied else None
    report = calculate_safety_score(
        has_avatar=req.has_avatar,
        has_opinion=req.has_opinion,
        has_custom_voice=req.has_custom_voice,
        script_sections=req.script_sections,
        total_duration_sec=req.total_duration_sec,
        core_facts_count=req.core_facts_count,
        variation_applied=req.variation_applied,
        variation_params=vp,
    )

    return SafetyReportResponse(
        total_score=report.total_score,
        grade=report.grade,
        factors=[SafetyFactorResponse(
            name=f.name, score=f.score, weight=f.weight,
            description=f.description, suggestion=f.suggestion,
        ) for f in report.factors],
        passed=report.passed,
        risk_items=report.risk_items,
    )


@router.get("/variation/preview")
async def preview_variation():
    """변주 파라미터 미리보기 (적용 전 확인용)"""
    p = generate_variation_params()
    return {
        "visual": {
            "brightness": f"{p.brightness:+.4f}", "contrast": f"{p.contrast:+.4f}",
            "saturation": f"{p.saturation:+.4f}", "hue_shift": f"{p.hue_shift:+.1f}deg",
            "noise": f"{p.noise_strength:.1f}", "sharpen": f"{p.sharpen:.2f}",
        },
        "audio": {
            "pitch": f"{p.pitch_semitone:+.4f} semitones",
            "tempo": f"{p.tempo:.4f}x",
            "bass_boost": f"+{p.bass_boost_db:.1f}dB",
            "treble": f"{p.treble_db:+.1f}dB",
        },
        "frame": {
            "intro_pad": f"{p.intro_pad_sec:.2f}s",
            "outro_pad": f"{p.outro_pad_sec:.2f}s",
        },
        "meta": {
            "unique_id": p.unique_id,
            "hash_salt": p.file_hash_salt,
        },
    }
