"""
Creato — NotebookLM 영상 생성 모듈
══════════════════════════════════════
Creato 스크립트 대본 → NotebookLM 노트북에 소스로 추가 → Video Overview 생성 → MP4 다운로드

사전 준비:
1. 로컬에서 `pip install "notebooklm-py[browser]" && playwright install chromium`
2. `notebooklm login` 실행 (브라우저 인증)
3. 생성된 토큰 파일 (~/.notebooklm/auth.json) 내용을 Railway 환경변수 NOTEBOOKLM_AUTH에 저장
   또는 auth.json 파일을 서버에 복사

사용법:
    from notebooklm_video import generate_notebooklm_video
    result = await generate_notebooklm_video(
        keyword="금리 인하",
        script_text="전체 대본 텍스트...",
        video_style="classic",   # classic|whiteboard|watercolor|retro|anime
        video_format="explainer", # explainer|brief|cinematic
        language="ko",
    )
"""
import os, json, logging, asyncio
from pathlib import Path
from dataclasses import dataclass

logger = logging.getLogger(__name__)

OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/blackbox_output")

@dataclass
class NotebookVideoResult:
    success: bool
    video_path: str = ""
    notebook_id: str = ""
    error: str = ""
    duration_sec: float = 0.0


async def _get_client():
    """인증된 NotebookLM 클라이언트 생성"""
    try:
        from notebooklm import NotebookLMClient
        from notebooklm.auth import AuthTokens
    except ImportError:
        logger.error("[NBLM] notebooklm-py 미설치. pip install notebooklm-py")
        return None

    # 방법 1: 환경변수 NOTEBOOKLM_AUTH → 임시 파일로 저장 → from_storage
    auth_json = os.getenv("NOTEBOOKLM_AUTH", "")
    if auth_json:
        try:
            # storage_state.json 형식을 임시 파일로 저장
            tmp_dir = Path("/tmp/.notebooklm")
            tmp_dir.mkdir(parents=True, exist_ok=True)
            tmp_file = tmp_dir / "storage_state.json"
            tmp_file.write_text(auth_json, encoding="utf-8")
            auth = await AuthTokens.from_storage(tmp_file)
            client = NotebookLMClient(auth=auth)
            logger.info("[NBLM] ✓ Auth from env var (storage_state)")
            return client
        except Exception as e:
            logger.warning(f"[NBLM] Env auth failed: {e}")

    # 방법 2: 기본 경로 (~/.notebooklm/storage_state.json)
    default_path = Path.home() / ".notebooklm" / "storage_state.json"
    if default_path.exists():
        try:
            auth = await AuthTokens.from_storage(default_path)
            client = NotebookLMClient(auth=auth)
            logger.info("[NBLM] ✓ Auth from default path")
            return client
        except Exception as e:
            logger.warning(f"[NBLM] Default path auth failed: {e}")

    # 방법 3: from_storage() 기본값
    try:
        client = await NotebookLMClient.from_storage()
        logger.info("[NBLM] ✓ Auth from NotebookLMClient default")
        return client
    except Exception as e:
        logger.error(f"[NBLM] All auth methods failed: {e}")
        return None


async def generate_notebooklm_video(
    keyword: str,
    script_text: str,
    video_style: str = "classic",
    video_format: str = "explainer",
    language: str = "ko",
    job_dir: str = "",
) -> NotebookVideoResult:
    """
    Creato 대본 → NotebookLM Video Overview 생성

    Args:
        keyword: 영상 주제 키워드
        script_text: 전체 스크립트 대본 텍스트
        video_style: classic|whiteboard|watercolor|retro|heritage|papercraft|kawaii|anime
        video_format: explainer|brief|cinematic
        language: ko|en|ja 등
        job_dir: 출력 디렉토리 (없으면 자동 생성)

    Returns:
        NotebookVideoResult
    """
    if not job_dir:
        import uuid
        job_dir = os.path.join(OUTPUT_DIR, f"nblm_{uuid.uuid4().hex[:8]}")
    os.makedirs(job_dir, exist_ok=True)

    try:
        client = await _get_client()
        if not client:
            return NotebookVideoResult(success=False, error="NotebookLM 인증 실패. NOTEBOOKLM_AUTH 환경변수를 설정하세요.")

        # ── 1. 노트북 생성 ──
        nb_title = f"Creato — {keyword}"
        logger.info(f"[NBLM] Creating notebook: '{nb_title}'")
        nb = await client.notebooks.create(nb_title)
        nb_id = nb.id
        logger.info(f"[NBLM] Notebook created: {nb_id}")

        # ── 2. 대본을 소스로 추가 ──
        source_title = f"{keyword} 스크립트 대본"
        logger.info(f"[NBLM] Adding source: {len(script_text)} chars")
        await client.sources.add_text(nb_id, source_title, script_text)
        logger.info("[NBLM] Source added")

        # ── 3. 영상 생성 요청 ──
        # VideoFormat/VideoStyle enum 매핑
        try:
            from notebooklm.rpc.types import VideoFormat, VideoStyle
            fmt_map = {
                "explainer": VideoFormat.EXPLAINER,
                "brief": VideoFormat.BRIEF,
                "cinematic": None,  # cinematic은 별도 메서드
            }
            style_map = {
                "classic": VideoStyle.CLASSIC,
                "whiteboard": VideoStyle.WHITEBOARD,
                "watercolor": VideoStyle.WATERCOLOR,
                "retro": VideoStyle.RETRO_PRINT,
                "heritage": VideoStyle.HERITAGE,
                "papercraft": VideoStyle.PAPER_CRAFT,
                "kawaii": VideoStyle.KAWAII,
                "anime": VideoStyle.ANIME,
            }
            v_fmt = fmt_map.get(video_format)
            v_style = style_map.get(video_style, VideoStyle.CLASSIC)
        except ImportError:
            v_fmt = None
            v_style = None

        instructions = f"이 영상은 '{keyword}'에 대한 한국어 유튜브 정보 채널 영상입니다. 대본의 내용을 시각적으로 설명해주세요."

        if video_format == "cinematic":
            logger.info("[NBLM] Generating cinematic video...")
            status = await client.artifacts.generate_cinematic_video(
                nb_id, language=language, instructions=instructions)
        else:
            logger.info(f"[NBLM] Generating video: format={video_format}, style={video_style}")
            kwargs = {"notebook_id": nb_id, "language": language, "instructions": instructions}
            if v_fmt: kwargs["video_format"] = v_fmt
            if v_style: kwargs["video_style"] = v_style
            status = await client.artifacts.generate_video(**kwargs)

        task_id = status.task_id
        logger.info(f"[NBLM] Video generation started: task={task_id}")

        # ── 4. 완료 대기 (최대 30분) ──
        logger.info("[NBLM] Waiting for completion (up to 30 min)...")
        final = await client.artifacts.wait_for_completion(
            nb_id, task_id, timeout=1800, initial_interval=10, max_interval=30)
        logger.info(f"[NBLM] Generation complete: {final.status}")

        # ── 5. 영상 다운로드 ──
        output_path = os.path.join(job_dir, f"notebooklm_{keyword[:20]}.mp4")
        dl_path = await client.artifacts.download_video(nb_id, output_path)
        if dl_path and os.path.exists(dl_path):
            sz = os.path.getsize(dl_path)
            logger.info(f"[NBLM] ✓ Video downloaded: {sz/1024/1024:.1f}MB → {dl_path}")
            return NotebookVideoResult(
                success=True, video_path=dl_path, notebook_id=nb_id,
                duration_sec=0)  # duration은 ffprobe로 확인 가능
        else:
            return NotebookVideoResult(success=False, error="영상 다운로드 실패", notebook_id=nb_id)

    except Exception as e:
        logger.error(f"[NBLM] Error: {e}")
        return NotebookVideoResult(success=False, error=str(e))


async def cleanup_notebook(notebook_id: str):
    """사용 후 노트북 삭제"""
    try:
        client = await _get_client()
        if client:
            await client.notebooks.delete(notebook_id)
            logger.info(f"[NBLM] Notebook {notebook_id} deleted")
    except Exception as e:
        logger.warning(f"[NBLM] Cleanup failed: {e}")
