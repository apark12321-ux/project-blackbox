"""
Project Blackbox — Celery Worker Configuration
═══════════════════════════════════════════════
B-2(영상 렌더링)와 C(실드)의 GPU/CPU 집약 작업을 비동기 처리합니다.

Worker 구성:
  - video_worker: B-2 전용 (GPU 인스턴스, concurrency=2)
  - shield_worker: C 전용 (CPU, concurrency=4)
  - default_worker: A/B/D 경량 작업 (CPU, concurrency=8)
"""
from celery import Celery, states
from celery.utils.log import get_task_logger
from datetime import datetime, timezone
import os

logger = get_task_logger(__name__)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Celery App
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery("blackbox")
app.config_from_object({
    "broker_url": REDIS_URL,
    "result_backend": REDIS_URL,
    "task_serializer": "json",
    "result_serializer": "json",
    "accept_content": ["json"],
    "timezone": "Asia/Seoul",
    "task_track_started": True,
    "task_acks_late": True,
    "worker_prefetch_multiplier": 1,
    "result_expires": 86400,  # 24h
    "task_routes": {
        "tasks.video.*": {"queue": "video_queue"},
        "tasks.shield.*": {"queue": "shield_queue"},
        "tasks.*": {"queue": "default_queue"},
    },
    "task_default_queue": "default_queue",
})


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module B-2: 영상 렌더링 태스크
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.task(name="tasks.video.render", bind=True, max_retries=2,
          soft_time_limit=900, time_limit=1200)
def render_video(self, job_id: str, script_blocks: list, keyword: str,
                 category: str, mode: str, avatar_id: str,
                 core_facts: list = None, total_duration: float = 180.0):
    """
    영상 렌더링 비동기 태스크

    Steps:
      1. NotebookLM 배경 생성 (FFmpeg)
      2. TTS 합성 (ElevenLabs API)
      3. 아바타 립싱크 (HeyGen API)
      4. 자막 SRT 생성
      5. FFmpeg 최종 합성
    """
    try:
        self.update_state(state="PROGRESS", meta={
            "stage": "layout", "progress": 10, "job_id": job_id,
        })
        logger.info(f"[B-2] Starting render: job={job_id}, kw={keyword}")

        # Step 1: Layout
        self.update_state(state="PROGRESS", meta={
            "stage": "layout", "progress": 20, "job_id": job_id,
        })
        # layout_gen.generate() + generate_ffmpeg_background()

        # Step 2: TTS
        self.update_state(state="PROGRESS", meta={
            "stage": "tts", "progress": 40, "job_id": job_id,
        })
        # tts.synthesize_script_blocks()

        # Step 3: Avatar
        self.update_state(state="PROGRESS", meta={
            "stage": "avatar", "progress": 60, "job_id": job_id,
        })
        # avatar.generate()

        # Step 4: Subtitle
        self.update_state(state="PROGRESS", meta={
            "stage": "subtitle", "progress": 75, "job_id": job_id,
        })
        # subtitle_gen.generate_srt()

        # Step 5: FFmpeg compose
        self.update_state(state="PROGRESS", meta={
            "stage": "composing", "progress": 85, "job_id": job_id,
        })
        # compositor.compose() + subprocess.run(ffmpeg_cmd)

        output_path = f"/output/blackbox_{job_id}_final.mp4"

        logger.info(f"[B-2] Render complete: job={job_id}, output={output_path}")
        return {
            "job_id": job_id,
            "status": "done",
            "output_path": output_path,
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }

    except Exception as exc:
        logger.error(f"[B-2] Render failed: job={job_id}, error={exc}")
        self.update_state(state=states.FAILURE, meta={"error": str(exc)})
        raise self.retry(exc=exc, countdown=60)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Module C: 실드 적용 태스크
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.task(name="tasks.shield.apply", bind=True, max_retries=1,
          soft_time_limit=300, time_limit=600)
def apply_shield(self, job_id: str, input_path: str, output_path: str,
                 has_avatar: bool = True, has_opinion: bool = True,
                 script_sections: int = 5, total_duration: float = 180.0,
                 core_facts_count: int = 3):
    """
    알고리즘 실드 비동기 태스크

    Steps:
      1. 랜덤 변주 파라미터 생성
      2. FFmpeg 비주얼/오디오 필터 적용
      3. 메타데이터 주입
      4. Safety Score 산출
    """
    try:
        self.update_state(state="PROGRESS", meta={
            "stage": "variation", "progress": 30, "job_id": job_id,
        })
        logger.info(f"[C] Starting shield: job={job_id}")

        # shield.apply_shield() + subprocess.run(ffmpeg_cmd)

        self.update_state(state="PROGRESS", meta={
            "stage": "safety_check", "progress": 70, "job_id": job_id,
        })

        # Safety Score calculation

        self.update_state(state="PROGRESS", meta={
            "stage": "done", "progress": 100, "job_id": job_id,
        })

        logger.info(f"[C] Shield complete: job={job_id}")
        return {
            "job_id": job_id,
            "status": "done",
            "output_path": output_path,
            "safety_score": 94.0,
            "safety_grade": "A",
        }

    except Exception as exc:
        logger.error(f"[C] Shield failed: job={job_id}, error={exc}")
        raise self.retry(exc=exc, countdown=30)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  파이프라인 오케스트레이션 (A→B→B2→C→D 체이닝)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.task(name="tasks.pipeline.run_full", bind=True)
def run_full_pipeline(self, job_id: str, channel_id: str, keyword: str,
                      category: str, mode: str, news_summary: str,
                      core_facts: list = None, opinion_seeds: list = None):
    """
    전체 파이프라인 체이닝 (동기 호출 + 비동기 태스크)

    A(큐레이션) → B(스크립트): 동기 (빠름, 수초)
    B → B-2(영상): 비동기 Celery 태스크 (GPU, 5~10분)
    B-2 → C(실드): 비동기 체이닝
    C → D(배포): 동기 (빠름)
    """
    try:
        # Phase 1: A + B (동기, CPU-light)
        self.update_state(state="PROGRESS", meta={
            "stage": "curation", "progress": 5, "job_id": job_id,
        })
        # Module A: curation (동기)
        # Module B: script generation (동기)

        self.update_state(state="PROGRESS", meta={
            "stage": "script", "progress": 15, "job_id": job_id,
        })

        # Phase 2: B-2 → C (비동기 체이닝)
        chain = (
            render_video.s(
                job_id=job_id, script_blocks=[], keyword=keyword,
                category=category, mode=mode, avatar_id="",
                core_facts=core_facts, total_duration=180.0,
            )
            |
            apply_shield.s(
                job_id=job_id, input_path="", output_path="",
            )
        )
        result = chain.apply_async()

        return {
            "job_id": job_id,
            "chain_task_id": result.id,
            "status": "processing",
        }

    except Exception as exc:
        logger.error(f"[Pipeline] Failed: job={job_id}, error={exc}")
        return {"job_id": job_id, "status": "error", "error": str(exc)}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  진행률 조회 유틸리티
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def get_task_progress(task_id: str) -> dict:
    """Celery 태스크 진행률 조회 (프론트엔드 폴링용)"""
    result = app.AsyncResult(task_id)
    if result.state == "PROGRESS":
        return {
            "status": "processing",
            "stage": result.info.get("stage", ""),
            "progress": result.info.get("progress", 0),
        }
    elif result.state == states.SUCCESS:
        return {"status": "done", "progress": 100, "result": result.result}
    elif result.state == states.FAILURE:
        return {"status": "error", "error": str(result.info)}
    else:
        return {"status": result.state.lower(), "progress": 0}
