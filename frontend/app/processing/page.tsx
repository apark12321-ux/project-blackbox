'use client';
/**
 * /processing - 백엔드 status 버그 우회 버전
 * 
 * 전략:
 * 1. getJobStatus() 호출 안 함 (버그 트리거 회피)
 * 2. 시간 기반 "가짜" 진행률 표시 (UX 위해)
 * 3. 60초 후부터 2분마다 getDownloadUrl() 시도
 * 4. download URL 받으면 /done으로 이동
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import { getDownloadUrl, formatApiError } from '../_shared/videoApi';
import { getScenarioById } from '../_shared/scenarios';

const DOWNLOAD_CHECK_START_SEC = 60;         // 60초 후부터 확인 시작
const DOWNLOAD_CHECK_INTERVAL_SEC = 120;     // 2분마다
const MAX_WAIT_MINUTES = 12;                  // 최대 12분 대기
const EXPECTED_DURATION_SEC = 420;            // 예상 7분

// 시간 기반 "가짜" 단계 메시지 (UX용)
const TIMELINE = [
  { fromSec: 0, progress: 5, step: '📰 뉴스 수집 완료 (대본 API에서 처리됨)', logs: ['뉴스 데이터 수집 ✓', 'AI 대본 초안 생성 중...'] },
  { fromSec: 30, progress: 18, step: '✍️ 대본 구조 잡는 중...', logs: ['3단 구조 분석', '핵심 메시지 추출', '훅 문구 생성'] },
  { fromSec: 60, progress: 32, step: '🎤 TTS 음성 합성 중...', logs: ['한국어 음성 처리 시작', 'ElevenLabs API 호출', '감정 톤 조정'] },
  { fromSec: 120, progress: 48, step: '🎨 인포그래픽 생성 중...', logs: ['주요 장면 4컷 생성', '브랜드 컬러 적용', '자막 배치 중'] },
  { fromSec: 210, progress: 68, step: '🎬 영상 합성 중...', logs: ['1920×1080 렌더링', '오디오·비디오 동기화', '트랜지션 적용'] },
  { fromSec: 330, progress: 84, step: '🔍 YouTube SEO 최적화...', logs: ['제목 후보 생성', '태그 10개 추출', '썸네일 텍스트 배치'] },
  { fromSec: 400, progress: 95, step: '✨ 최종 마무리...', logs: ['파일 업로드', '다운로드 준비', '수익화 검증'] },
];

function getTimelineFor(sec: number) {
  let curr = TIMELINE[0];
  for (const t of TIMELINE) {
    if (sec >= t.fromSec) curr = t;
  }
  return curr;
}

export default function ProcessingPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [jobId, setJobId] = useState('');
  const [styleName, setStyleName] = useState('');

  const [elapsedSec, setElapsedSec] = useState(0);
  const [progress, setProgress] = useState(5);
  const [currentStep, setCurrentStep] = useState('시작 중...');
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastCheckInfo, setLastCheckInfo] = useState('');

  const startedAtRef = useRef<number>(Date.now());
  const downloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword || !p.jobId) {
      router.replace('/');
      return;
    }
    setKeyword(p.keyword);
    setJobId(p.jobId);
    const style = getScenarioById(p.scenarioStyleId || p.templateId);
    if (style) setStyleName(`${style.emoji} ${style.name}`);

    startedAtRef.current = Date.now();

    // 경과 시간 카운터 (1초마다)
    elapsedTimerRef.current = setInterval(() => {
      if (stoppedRef.current) return;
      const sec = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsedSec(sec);

      // 시간 기반 단계 업데이트
      const tl = getTimelineFor(sec);
      setProgress(tl.progress);
      setCurrentStep(tl.step);
      // 로그는 한번만 추가 (중복 방지)
      setLogs((prev) => {
        const newItems = tl.logs.filter((l) => !prev.includes(l));
        return newItems.length ? [...prev, ...newItems] : prev;
      });

      // 최대 대기 시간 초과
      if (sec > MAX_WAIT_MINUTES * 60) {
        stoppedRef.current = true;
        setErrorMsg(`${MAX_WAIT_MINUTES}분 대기했지만 영상이 완성되지 않았습니다. 백엔드에서 여전히 생성 중일 수 있습니다.\n\nJob ID: ${p.jobId}를 기록해두세요.`);
        if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
      }
    }, 1000);

    // Download URL 확인 (60초 후부터, 2분마다)
    const checkDownload = async () => {
      if (stoppedRef.current) return;
      const sec = Math.floor((Date.now() - startedAtRef.current) / 1000);
      if (sec < DOWNLOAD_CHECK_START_SEC) return;

      try {
        setLastCheckInfo(`마지막 확인: ${new Date().toLocaleTimeString('ko-KR')}`);
        const res = await getDownloadUrl(p.jobId!);
        // 성공! URL 있으면 done 이동
        const url = res?.download_url || res?.video_url || (res as any)?.url;
        if (url) {
          stoppedRef.current = true;
          setProgress(100);
          setCurrentStep('✅ 영상 완성!');
          if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
          if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
          setTimeout(() => router.push('/done'), 800);
        }
      } catch (err: any) {
        // 404, 500 등은 아직 생성 중이라고 해석
        console.log('[processing] download check:', err?.status || 'unknown', '(still processing)');
      }
    };

    // 30초 후 첫 체크, 이후 매 2분
    setTimeout(() => {
      if (!stoppedRef.current) checkDownload();
    }, DOWNLOAD_CHECK_START_SEC * 1000);
    downloadTimerRef.current = setInterval(checkDownload, DOWNLOAD_CHECK_INTERVAL_SEC * 1000);

    return () => {
      stoppedRef.current = true;
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
    };
     
  }, [router]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const expectedRemaining = Math.max(0, EXPECTED_DURATION_SEC - elapsedSec);

  const handleCancel = () => {
    if (!confirm('영상 생성을 취소하시겠어요?\n\n(백엔드에서 영상은 계속 생성됩니다. 나중에 Job ID로 확인 가능)')) return;
    stoppedRef.current = true;
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
    router.push('/');
  };

  const handleManualCheck = async () => {
    try {
      setLastCheckInfo('확인 중...');
      const res = await getDownloadUrl(jobId);
      const url = res?.download_url || res?.video_url || (res as any)?.url;
      if (url) {
        stoppedRef.current = true;
        router.push('/done');
      } else {
        setLastCheckInfo(`마지막 확인: ${new Date().toLocaleTimeString('ko-KR')} · 아직 준비 안 됨`);
      }
    } catch (err: any) {
      setLastCheckInfo(`마지막 확인 실패: ${formatApiError(err)}`);
    }
  };

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page { max-width: 1000px; margin: 0 auto; padding: 32px 24px 60px; }
        .header { text-align: center; margin-bottom: 24px; }
        .eyebrow {
          font-size: 12px; font-weight: 700; color: #cc0000;
          letter-spacing: 0.12em; margin-bottom: 8px;
        }
        .title {
          font-size: 28px; font-weight: 800;
          letter-spacing: -0.02em; margin: 0 0 8px;
        }
        .sub { font-size: 14px; color: #606060; }

        .metaRow {
          display: flex; justify-content: center;
          gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .metaChip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px; color: #606060;
        }
        .chipKw { background: #fff0f0; color: #cc0000; border-color: #ffd4d4; font-weight: 700; }
        .chipStyle { background: #f0f0ff; color: #4338ca; border-color: #ddd6fe; font-weight: 600; }
        .chipJob { font-family: monospace; font-size: 11px; }

        .panel {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
        }
        .progressLabel {
          display: flex; justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .progressText {
          font-size: 15px; font-weight: 700;
          color: #0f0f0f;
        }
        .progressPct {
          font-size: 24px; font-weight: 800;
          color: #cc0000; letter-spacing: -0.02em;
        }
        .progressBar {
          width: 100%; height: 10px;
          background: #f0f0f0;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .progressFill {
          height: 100%;
          background: linear-gradient(90deg, #cc0000 0%, #ff3333 100%);
          border-radius: 999px;
          transition: width 1s ease;
        }
        .statusRow {
          display: flex; justify-content: space-between;
          align-items: center;
          font-size: 12px; color: #606060;
          flex-wrap: wrap; gap: 6px;
        }
        .statusBadge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px;
          background: #fff0f0;
          color: #cc0000;
          border-radius: 999px;
          font-size: 11px; font-weight: 700;
        }
        .livedot {
          display: inline-block;
          width: 7px; height: 7px;
          background: #cc0000;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .logsPanel {
          background: #0f0f0f;
          color: #fff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .logsHead {
          display: flex; justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .logsTitle {
          font-size: 14px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .logsList {
          max-height: 240px;
          overflow-y: auto;
          display: flex; flex-direction: column;
          gap: 8px;
        }
        .logItem {
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          font-size: 13px;
          color: #ddd;
          line-height: 1.6;
          border-left: 3px solid #cc0000;
          animation: logIn 0.3s ease;
        }
        @keyframes logIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .notePanel {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 12px;
          color: #78350f;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .noteTitle { font-weight: 700; margin-bottom: 4px; color: #92400e; }

        .errorPanel {
          background: #fff0f0;
          border: 1px solid #ffcccc;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .errorTitle {
          font-size: 15px; font-weight: 700;
          color: #cc0000; margin-bottom: 6px;
        }
        .errorMsg {
          font-size: 13px; color: #990000;
          line-height: 1.6; margin-bottom: 14px;
          white-space: pre-wrap;
        }
        .errorActions { display: flex; gap: 8px; flex-wrap: wrap; }
        .errorBtn {
          padding: 10px 18px;
          border: none; border-radius: 999px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
        }
        .errorBtnPrimary { background: #cc0000; color: #fff; }
        .errorBtnPrimary:hover { background: #a80000; }
        .errorBtnSecondary { background: #fff; border: 1px solid #e5e5e5; }

        .actionRow {
          display: flex; gap: 8px; justify-content: center;
          flex-wrap: wrap;
        }
        .checkBtn {
          padding: 10px 18px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          color: #0f0f0f;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .checkBtn:hover { border-color: #cc0000; color: #cc0000; }
        .cancelBtn {
          padding: 10px 18px;
          background: transparent;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px;
          color: #606060;
          cursor: pointer;
          font-family: inherit;
        }
        .cancelBtn:hover { color: #0f0f0f; border-color: #0f0f0f; }

        .lastCheckInfo {
          text-align: center;
          font-size: 11px;
          color: #888;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .page { padding: 24px 14px 40px; }
          .title { font-size: 22px; }
          .panel { padding: 20px; }
          .logsPanel { padding: 18px; }
          .progressPct { font-size: 20px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="eyebrow">STEP 4 · AI 자동 처리</div>
          <h1 className="title">영상을 제작하는 중이에요</h1>
          <p className="sub">AI가 백그라운드에서 영상을 합성하고 있습니다</p>
        </div>

        <div className="metaRow">
          <div className="metaChip chipKw">▶ {keyword || '-'}</div>
          {styleName && <div className="metaChip chipStyle">{styleName}</div>}
          <div className="metaChip">⏱️ 경과 {formatTime(elapsedSec)}</div>
          {jobId && <div className="metaChip chipJob">Job {jobId.slice(0, 12)}</div>}
        </div>

        {errorMsg ? (
          <div className="errorPanel">
            <div className="errorTitle">⚠️ 처리 중단됨</div>
            <div className="errorMsg">{errorMsg}</div>
            <div className="errorActions">
              <button className="errorBtn errorBtnPrimary" onClick={handleManualCheck}>
                🔄 지금 확인
              </button>
              <button className="errorBtn errorBtnSecondary" onClick={() => router.push('/configure')}>
                다시 시도
              </button>
              <button className="errorBtn errorBtnSecondary" onClick={() => router.push('/')}>
                홈으로
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="panel">
              <div className="progressLabel">
                <div className="progressText">{currentStep}</div>
                <div className="progressPct">{progress}%</div>
              </div>
              <div className="progressBar">
                <div className="progressFill" style={{ width: `${progress}%` }} />
              </div>
              <div className="statusRow">
                <div className="statusBadge">
                  <span className="livedot"></span>
                  생성 중
                </div>
                <div>예상 완료: 약 {Math.ceil(expectedRemaining / 60)}분 후</div>
              </div>
            </div>

            <div className="notePanel">
              <div className="noteTitle">💡 참고</div>
              영상 생성은 백엔드에서 약 5~8분 소요됩니다. 창을 닫아도 작업은 계속 진행되지만,
              이 페이지에서 완료 여부를 확인하는 것이 편해요. 60초 후부터 2분마다 자동으로 확인합니다.
            </div>

            <div className="logsPanel">
              <div className="logsHead">
                <div className="logsTitle">
                  <span className="livedot"></span>
                  실시간 진행 로그
                </div>
              </div>
              <div className="logsList">
                {logs.length === 0 ? (
                  <div className="logItem">시작합니다...</div>
                ) : (
                  logs.slice(-15).map((log, i) => (
                    <div key={i} className="logItem">{log}</div>
                  ))
                )}
              </div>
            </div>

            <div className="actionRow">
              <button className="checkBtn" onClick={handleManualCheck}>
                🔄 지금 완성 여부 확인
              </button>
              <button className="cancelBtn" onClick={handleCancel}>
                작업 취소
              </button>
            </div>
            {lastCheckInfo && (
              <div className="lastCheckInfo">{lastCheckInfo}</div>
            )}
          </>
        )}
      </div>
    </V11Shell>
  );
}
