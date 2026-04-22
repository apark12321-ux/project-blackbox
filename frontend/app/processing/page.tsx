'use client';
/**
 * /processing - 실제 job_id 기반 polling
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import { getJobStatus, formatApiError, type JobStatusResponse } from '../_shared/videoApi';

const POLL_INTERVAL_MS = 3000;   // 3초마다
const MAX_POLL_MINUTES = 15;     // 최대 15분 대기
const MAX_CONSECUTIVE_ERRORS = 5;

// 표시용 기본 단계 (백엔드가 current_step을 보내지 않을 때 진행률 기반으로 추정)
const FALLBACK_STEPS = [
  { min: 0,  label: '📰 뉴스 수집' },
  { min: 15, label: '✍️ AI 대본 작성' },
  { min: 35, label: '🎤 TTS 음성 생성' },
  { min: 55, label: '🎨 인포그래픽 생성' },
  { min: 75, label: '🎬 영상 합성' },
  { min: 92, label: '🔍 YouTube SEO 최적화' },
];

function inferStep(progress: number) {
  let label = FALLBACK_STEPS[0].label;
  for (const s of FALLBACK_STEPS) {
    if (progress >= s.min) label = s.label;
  }
  return label;
}

export default function ProcessingPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [jobId, setJobId] = useState('');

  const [status, setStatus] = useState<string>('queued');
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [elapsedSec, setElapsedSec] = useState(0);

  const pollTimer = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimer = useRef<NodeJS.Timeout | null>(null);
  const startedAt = useRef<number>(Date.now());
  const consecutiveErrors = useRef(0);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword || !p.jobId) {
      router.replace('/create');
      return;
    }
    setKeyword(p.keyword);
    setJobId(p.jobId);
    startedAt.current = Date.now();

    // Polling 시작
    startPolling(p.jobId);

    // Elapsed time 카운터
    elapsedTimer.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);

    return () => {
      stoppedRef.current = true;
      if (pollTimer.current) clearTimeout(pollTimer.current);
      if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    };
     
  }, [router]);

  const startPolling = (id: string) => {
    const poll = async () => {
      if (stoppedRef.current) return;

      // 타임아웃 체크
      const elapsedMin = (Date.now() - startedAt.current) / 60000;
      if (elapsedMin > MAX_POLL_MINUTES) {
        setErrorMsg(`타임아웃: ${MAX_POLL_MINUTES}분 초과. 백엔드에서 영상이 아직 생성 중일 수 있습니다.`);
        return;
      }

      try {
        const res: JobStatusResponse = await getJobStatus(id);
        consecutiveErrors.current = 0;

        // status
        const st = String(res.status || '').toLowerCase();
        setStatus(st);

        // progress (다양한 포맷 지원)
        let prog = res.progress;
        if (typeof prog !== 'number') {
          prog = (res as any).percent ?? (res as any).progress_percent ?? undefined;
        }
        if (typeof prog === 'number') {
          if (prog <= 1) prog = prog * 100; // 0~1 스케일 지원
          setProgress(Math.max(0, Math.min(100, Math.round(prog))));
        }

        // current step
        const step = res.current_step || (res as any).step || (res as any).stage;
        if (step) setCurrentStep(step);
        else if (typeof prog === 'number') setCurrentStep(inferStep(prog));

        // logs (배열 또는 단일 메시지)
        if (Array.isArray(res.logs) && res.logs.length > 0) {
          setLogs(res.logs);
        } else if (res.message && typeof res.message === 'string') {
          setLogs((prev) => {
            if (prev[prev.length - 1] === res.message) return prev;
            return [...prev, res.message as string];
          });
        }

        // 완료/실패
        if (st === 'completed' || st === 'done' || st === 'success') {
          setProgress(100);
          stoppedRef.current = true;
          // 잠깐 보여주고 이동
          setTimeout(() => router.push('/done'), 800);
          return;
        }
        if (st === 'failed' || st === 'error') {
          setErrorMsg(res.error || res.message || '영상 생성에 실패했습니다.');
          stoppedRef.current = true;
          return;
        }
      } catch (err: any) {
        consecutiveErrors.current += 1;
        console.error('[processing] poll failed:', err);
        if (consecutiveErrors.current >= MAX_CONSECUTIVE_ERRORS) {
          setErrorMsg(`상태 조회 ${MAX_CONSECUTIVE_ERRORS}회 연속 실패: ${formatApiError(err)}`);
          return;
        }
        // 일시적 오류는 다음 주기에 재시도
      }

      if (!stoppedRef.current) {
        pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    // 첫 호출 즉시
    poll();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (!confirm('영상 생성을 취소하시겠어요? (백엔드에선 계속 진행될 수 있습니다)')) return;
    stoppedRef.current = true;
    if (pollTimer.current) clearTimeout(pollTimer.current);
    router.push('/');
  };

  const handleRetry = () => {
    router.push('/configure');
  };

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 24px 60px;
        }
        .header { text-align: center; margin-bottom: 24px; }
        .eyebrow {
          font-size: 12px; font-weight: 700; color: #cc0000;
          letter-spacing: 0.12em; margin-bottom: 8px;
        }
        .title {
          font-size: 28px; font-weight: 800;
          color: #0f0f0f; letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .sub { font-size: 14px; color: #606060; line-height: 1.6; }

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
        .chipKw { background: #fff0f0; color: #cc0000; border-color: #ffd4d4; }
        .chipJob { font-family: monospace; }

        /* 프로그레스 패널 */
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
          transition: width 0.5s ease;
        }
        .statusRow {
          display: flex; justify-content: space-between;
          align-items: center;
          font-size: 13px; color: #606060;
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

        /* 로그 패널 */
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
          max-height: 260px;
          overflow-y: auto;
          display: flex; flex-direction: column;
          gap: 8px;
        }
        .logsList::-webkit-scrollbar { width: 6px; }
        .logsList::-webkit-scrollbar-track { background: transparent; }
        .logsList::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
        .logItem {
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          font-size: 13px;
          color: #ddd;
          line-height: 1.6;
          border-left: 3px solid #cc0000;
        }
        .logsEmpty {
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 13px;
        }

        /* 에러 박스 */
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
        }
        .errorActions { display: flex; gap: 8px; }
        .errorBtn {
          padding: 10px 18px;
          border: none; border-radius: 999px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
        }
        .errorBtnPrimary { background: #cc0000; color: #fff; }
        .errorBtnPrimary:hover { background: #a80000; }
        .errorBtnSecondary { background: #fff; border: 1px solid #e5e5e5; }

        /* 하단 안내 */
        .footerNote {
          text-align: center;
          font-size: 12px;
          color: #888;
          line-height: 1.6;
        }
        .cancelBtn {
          margin-top: 10px;
          padding: 8px 18px;
          background: transparent;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px; color: #606060;
          cursor: pointer; font-family: inherit;
        }
        .cancelBtn:hover { color: #0f0f0f; border-color: #0f0f0f; }

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
          <p className="sub">AI가 뉴스 수집부터 영상 합성까지 자동으로 처리합니다</p>
        </div>

        <div className="metaRow">
          <div className="metaChip chipKw">▶ {keyword || '-'}</div>
          <div className="metaChip">⏱️ 경과 {formatTime(elapsedSec)}</div>
          {jobId && <div className="metaChip chipJob">Job {jobId.slice(0, 8)}</div>}
        </div>

        {errorMsg ? (
          <div className="errorPanel">
            <div className="errorTitle">⚠️ 처리 중단됨</div>
            <div className="errorMsg">{errorMsg}</div>
            <div className="errorActions">
              <button className="errorBtn errorBtnPrimary" onClick={handleRetry}>
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
                <div className="progressText">
                  {currentStep || (progress === 0 ? '대기 중...' : '처리 중...')}
                </div>
                <div className="progressPct">{progress}%</div>
              </div>
              <div className="progressBar">
                <div className="progressFill" style={{ width: `${progress}%` }} />
              </div>
              <div className="statusRow">
                <div className="statusBadge">
                  <span className="livedot"></span>
                  {status === 'queued' ? '대기열' :
                   status === 'processing' ? '진행 중' :
                   status === 'completed' ? '완료' :
                   status || '상태 확인 중'}
                </div>
                <div>실서비스 기준 5~8분 소요</div>
              </div>
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
                  <div className="logsEmpty">
                    상태를 조회하는 중입니다... (3초마다 업데이트)
                  </div>
                ) : (
                  logs.slice(-20).map((log, i) => (
                    <div key={i} className="logItem">{log}</div>
                  ))
                )}
              </div>
            </div>

            <div className="footerNote">
              이 창을 닫아도 백엔드에서 영상은 계속 생성됩니다.<br />
              Job ID: <code style={{ fontSize: 11 }}>{jobId}</code>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="cancelBtn" onClick={handleCancel}>작업 취소</button>
            </div>
          </>
        )}
      </div>
    </V11Shell>
  );
}
