'use client';
/**
 * /processing - AI 처리 시연 (STEP 4)
 * 시연 버전 (실제 API는 다음 세션에 연결)
 * 모바일 최적화
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject } from '../_shared/V11Shell';

const STEPS = [
  { key: 'news', icon: '📰', label: '뉴스 수집', duration: 2500 },
  { key: 'script', icon: '✍️', label: 'AI 대본 작성', duration: 3500 },
  { key: 'tts', icon: '🎤', label: 'TTS 음성 생성', duration: 3000 },
  { key: 'graphic', icon: '🎨', label: '인포그래픽 생성', duration: 2500 },
  { key: 'video', icon: '🎬', label: '영상 합성', duration: 4000 },
  { key: 'seo', icon: '🔍', label: 'YouTube SEO 최적화', duration: 2000 },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) {
      router.replace('/create');
      return;
    }
    setKeyword(p.keyword);
    startProcessing(p.keyword);
     
  }, [router]);

  const startProcessing = async (kw: string) => {
    const logMessages: Record<string, string[]> = {
      news: [
        `📰 "${kw}" 관련 최근 7일 기사 6건을 수집했습니다.`,
        `고신뢰도 언론사(연합뉴스·KBS·MBC·한국경제) 위주로 필터링했습니다.`,
      ],
      script: [
        `✍️ 6개 블록 대본 작성 완료 (약 10분 분량)`,
        `[오프닝 28초] "안녕하세요! 오늘은 ${kw}에 대해 꼭 알아야 할 진실을 알려드리겠습니다..."`,
      ],
      tts: [
        `🎤 한국어 여성 음성(ElevenLabs)으로 10분 분량 음성 생성 완료.`,
      ],
      graphic: [
        `🎨 핵심 장면 4컷 인포그래픽 생성 완료.`,
      ],
      video: [
        `🎬 영상 합성 완료 (1920×1080, 30fps). 길이 10분 12초.`,
      ],
      seo: [
        `🔍 YouTube SEO 2026 규칙 적용 완료`,
        `제목/태그/설명/썸네일 자동 최적화.`,
        `수익화 안전도: 92/100 (A+)`,
      ],
    };

    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i);
      const step = STEPS[i];
      await new Promise((resolve) => setTimeout(resolve, step.duration));
      setCompletedSteps((prev) => new Set([...prev, step.key]));
      setLogs((prev) => [...prev, ...logMessages[step.key]]);
    }

    setCurrentStep(-1);
    setTimeout(() => router.push('/done'), 1200);
  };

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }
        .header {
          text-align: center;
          margin-bottom: 28px;
        }
        .eyebrow {
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .sub {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }
        .kwBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #eff6ff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 28px;
        }
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 22px;
        }
        .panelDark {
          background: #0f172a;
          color: #fff;
        }
        .panelTitle {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .panelDark .panelTitle { color: #fff; }
        .livedot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .stepList {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .stepRow {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #f8fafc;
          border-radius: 10px;
          transition: all 0.3s;
        }
        .stepActive {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }
        .stepCompleted {
          background: #f0fdf4;
        }
        .stepCheck {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #94a3b8;
          font-weight: 700;
        }
        .stepActive .stepCheck {
          background: #2563eb;
          color: #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .stepCompleted .stepCheck {
          background: #22c55e;
          color: #fff;
        }
        .stepRowText {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stepRowIcon { font-size: 18px; }
        .stepRowLabel {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        .stepBadge {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          background: #dcfce7;
          color: #16a34a;
          font-weight: 700;
          flex-shrink: 0;
        }
        .stepBadgeRun {
          background: #dbeafe;
          color: #2563eb;
        }
        .totalTime {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .nextBtn {
          width: 100%;
          padding: 14px;
          background: #22c55e;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          min-height: 52px;
          opacity: 0.5;
          cursor: not-allowed;
        }
        .nextBtnActive {
          opacity: 1;
          cursor: pointer;
        }
        .nextBtnActive:hover { background: #16a34a; }
        .logs {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 520px;
          overflow-y: auto;
        }
        .logItem {
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .page { padding: 24px 14px 40px; }
          .title { font-size: 22px; }
          .layout { grid-template-columns: 1fr; gap: 14px; }
          .panel { padding: 18px; }
          .stepRow { padding: 10px 12px; gap: 10px; }
          .stepRowLabel { font-size: 13px; }
          .logs { max-height: 280px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="eyebrow">STEP 4 · AI 자동 처리</div>
          <h1 className="title">영상을 제작하는 중이에요</h1>
          <p className="sub">AI가 뉴스 수집부터 영상 합성까지 자동으로 처리합니다</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="kwBadge">🎯 {keyword || '-'}</div>
        </div>

        <div className="layout">
          <div className="panel">
            <div className="panelTitle">처리 단계</div>
            <div className="stepList">
              {STEPS.map((step, i) => {
                const isCompleted = completedSteps.has(step.key);
                const isActive = currentStep === i;
                return (
                  <div
                    key={step.key}
                    className={`stepRow ${isActive ? 'stepActive' : ''} ${isCompleted ? 'stepCompleted' : ''}`}
                  >
                    <div className="stepCheck">
                      {isCompleted ? '✓' : isActive ? '⟳' : i + 1}
                    </div>
                    <div className="stepRowText">
                      <span className="stepRowIcon">{step.icon}</span>
                      <span className="stepRowLabel">{step.label}</span>
                    </div>
                    {isCompleted && <span className="stepBadge">완료</span>}
                    {isActive && <span className="stepBadge stepBadgeRun">진행중</span>}
                  </div>
                );
              })}
            </div>
            <div className="totalTime">총 소요 시간: 시연 약 20초 · 실서비스 5~8분</div>
            <button
              className={`nextBtn ${completedSteps.size === STEPS.length ? 'nextBtnActive' : ''}`}
              disabled={completedSteps.size !== STEPS.length}
              onClick={() => router.push('/done')}
            >
              {completedSteps.size === STEPS.length ? '완성된 영상 확인하기 →' : '처리 중...'}
            </button>
          </div>

          <div className="panel panelDark">
            <div className="panelTitle">
              <span className="livedot"></span>
              실시간 미리보기
            </div>
            <div className="logs">
              {logs.length === 0 ? (
                <div className="logItem">처리를 시작합니다...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="logItem">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </V11Shell>
  );
}
