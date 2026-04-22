'use client';
/**
 * /configure - 스타일 설정 + 실제 영상 생성 API 호출
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import { startVideoGeneration, formatApiError } from '../_shared/videoApi';

type Tone = 'formal' | 'friendly' | 'casual' | 'slang';
type Mode = 'normal' | 'senior';

const TONE_OPTIONS: { key: Tone; label: string; example: string; emoji: string }[] = [
  { key: 'formal', label: '격식형', example: '오늘은 ~에 대해 알아보겠습니다.', emoji: '🎩' },
  { key: 'friendly', label: '친근형', example: '안녕하세요! 오늘은 ~을 알아봐요!', emoji: '😊' },
  { key: 'casual', label: '반말', example: '오늘 ~ 얘기해볼게, 끝까지 봐!', emoji: '👋' },
  { key: 'slang', label: '음슴체', example: '오늘 주제는 ~임. 핵심만 정리함.', emoji: '⚡' },
];

export default function ConfigurePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [tone, setTone] = useState<Tone>('formal');
  const [duration, setDuration] = useState<number>(10);
  const [mode, setMode] = useState<Mode>('normal');

  // 실 API 호출 상태
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) {
      router.replace('/create');
      return;
    }
    setKeyword(p.keyword);
    setCategory(p.category || '');
    if (p.tone) setTone(p.tone);
    if (p.duration) setDuration(p.duration);
    if (p.mode) setMode(p.mode);
    if (p.customTopic) setCustomTopic(p.customTopic);
  }, [router]);

  const handleStart = async () => {
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg('');

    // 1. 프로젝트 상태 저장
    setProject({ customTopic, tone, duration, mode, step: 3 });

    try {
      // 2. 실제 API 호출
      const res = await startVideoGeneration({
        keyword,
        tone,
        duration,
        mode,
        custom_topic: customTopic || undefined,
        category: category || undefined,
      });

      // 3. job_id 저장
      if (!res.job_id) {
        throw { status: 500, message: '백엔드가 job_id를 반환하지 않음', body: res };
      }
      setProject({ jobId: res.job_id });

      // 4. 처리 페이지로 이동
      router.push('/processing');
    } catch (err: any) {
      console.error('[configure] startVideoGeneration failed:', err);
      setErrorMsg(formatApiError(err));
      setSubmitting(false);
    }
  };

  return (
    <V11Shell currentStep={3}>
      <style jsx>{`
        .page {
          max-width: 760px;
          margin: 0 auto;
          padding: 40px 24px 40px;
        }
        .header { text-align: center; margin-bottom: 28px; }
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

        .kwBadge {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px;
          background: #fff0f0;
          border-radius: 12px;
          margin-bottom: 18px;
        }
        .kwLabel {
          font-size: 12px; font-weight: 700;
          color: #cc0000;
          padding: 4px 10px;
          background: #fff;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .kwValue { font-size: 15px; font-weight: 700; color: #0f0f0f; }

        .card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 14px;
        }
        .label {
          font-size: 14px; font-weight: 700;
          color: #0f0f0f; margin-bottom: 4px;
          display: flex; align-items: center; gap: 6px;
        }
        .labelOpt {
          font-size: 11px; font-weight: 500; color: #888;
          padding: 2px 7px;
          background: #f2f2f2;
          border-radius: 4px;
        }
        .labelHelp {
          font-size: 12px; color: #606060;
          margin-bottom: 12px;
        }
        .input {
          width: 100%;
          padding: 12px 14px;
          background: #fff; color: #0f0f0f;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          font-size: 14px; font-family: inherit;
          transition: border-color 0.15s;
        }
        .input:focus { outline: none; border-color: #0f0f0f; }

        .toneGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .toneBtn {
          padding: 14px 12px;
          background: #f9f9f9;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: all 0.15s;
        }
        .toneBtn:hover { background: #f2f2f2; }
        .toneBtnActive { border-color: #cc0000; background: #fff; }
        .toneEmoji { font-size: 22px; margin-bottom: 6px; }
        .toneLabel { font-size: 14px; font-weight: 700; color: #0f0f0f; margin-bottom: 3px; }
        .toneExample { font-size: 12px; color: #606060; line-height: 1.5; }

        .slider {
          width: 100%; height: 6px;
          background: #e5e5e5;
          border-radius: 999px;
          -webkit-appearance: none;
          appearance: none;
          margin: 14px 0 10px;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px; height: 22px;
          background: #cc0000;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 22px; height: 22px;
          background: #cc0000;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #fff;
        }
        .ticks {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #888;
        }
        .duration {
          font-size: 24px; font-weight: 800;
          color: #cc0000;
          text-align: right;
          margin-top: -30px;
          margin-bottom: 8px;
        }

        .modeGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .modeBtn {
          padding: 18px 14px;
          background: #f9f9f9;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          transition: all 0.15s;
        }
        .modeBtn:hover { background: #f2f2f2; }
        .modeBtnActive { border-color: #cc0000; background: #fff; }
        .modeIcon { font-size: 28px; margin-bottom: 6px; }
        .modeLabel { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .modeDesc { font-size: 11px; color: #606060; line-height: 1.5; }

        .errorBox {
          margin-bottom: 14px;
          padding: 12px 14px;
          background: #fff0f0;
          border: 1px solid #ffcccc;
          border-radius: 10px;
          font-size: 13px;
          color: #cc0000;
          line-height: 1.6;
        }
        .errorTitle { font-weight: 700; margin-bottom: 4px; }

        .footerBar {
          display: flex; gap: 8px;
          margin-top: 20px;
        }
        .backBtn {
          padding: 14px 18px;
          background: #f2f2f2; color: #0f0f0f;
          border: none; border-radius: 999px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          white-space: nowrap;
        }
        .backBtn:hover { background: #e5e5e5; }
        .startBtn {
          flex: 1; padding: 14px;
          background: #cc0000; color: #fff;
          border: none; border-radius: 999px;
          font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          min-height: 52px;
          transition: background 0.15s;
        }
        .startBtn:hover:not(:disabled) { background: #a80000; }
        .startBtn:disabled {
          background: #888;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 6px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .page { padding: 24px 14px 32px; }
          .title { font-size: 22px; }
          .card { padding: 16px; }
          .toneGrid, .modeGrid { grid-template-columns: 1fr 1fr; gap: 6px; }
          .toneBtn { padding: 12px 10px; }
          .toneLabel { font-size: 13px; }
          .toneExample { font-size: 11px; }
          .modeBtn { padding: 14px 10px; }
          .modeIcon { font-size: 24px; }
          .startBtn { font-size: 14px; padding: 13px; }
          .backBtn { padding: 13px 14px; font-size: 13px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="eyebrow">STEP 3 · 스타일 설정</div>
          <h1 className="title">영상 스타일을 선택하세요</h1>
          <p className="sub">말투, 길이, 타겟 모드를 설정합니다</p>
        </div>

        <div className="kwBadge">
          <span className="kwLabel">▶ 키워드</span>
          <span className="kwValue">{keyword || '-'}</span>
        </div>

        <div className="card">
          <div className="label">
            추가 주제 <span className="labelOpt">선택사항</span>
          </div>
          <div className="labelHelp">비워두면 AI가 키워드 기반으로 자동 구성합니다</div>
          <input
            type="text"
            className="input"
            placeholder={`예: ${keyword} 관련 최신 이슈`}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            maxLength={60}
            disabled={submitting}
          />
        </div>

        <div className="card">
          <div className="label">🎙️ 말투</div>
          <div className="toneGrid">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.key}
                className={`toneBtn ${tone === t.key ? 'toneBtnActive' : ''}`}
                onClick={() => setTone(t.key)}
                disabled={submitting}
              >
                <div className="toneEmoji">{t.emoji}</div>
                <div className="toneLabel">{t.label}</div>
                <div className="toneExample">{t.example}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="label">⏱️ 영상 길이</div>
          <div className="duration">{duration}분</div>
          <input
            type="range"
            className="slider"
            min="5"
            max="20"
            step="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={submitting}
          />
          <div className="ticks">
            <span>5분</span>
            <span>10분</span>
            <span>15분</span>
            <span>20분</span>
          </div>
        </div>

        <div className="card">
          <div className="label">🎯 타겟 모드</div>
          <div className="modeGrid">
            <button
              className={`modeBtn ${mode === 'normal' ? 'modeBtnActive' : ''}`}
              onClick={() => setMode('normal')}
              disabled={submitting}
            >
              <div className="modeIcon">👤</div>
              <div className="modeLabel">일반</div>
              <div className="modeDesc">전연령 대상 · 표준 톤</div>
            </button>
            <button
              className={`modeBtn ${mode === 'senior' ? 'modeBtnActive' : ''}`}
              onClick={() => setMode('senior')}
              disabled={submitting}
            >
              <div className="modeIcon">👴</div>
              <div className="modeLabel">시니어</div>
              <div className="modeDesc">50~70대 · 큰 글씨 · 느린 TTS</div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="errorBox">
            <div className="errorTitle">⚠️ 영상 생성 요청 실패</div>
            <div>{errorMsg}</div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#888' }}>
              잠시 후 다시 시도하거나, 브라우저 F12 → Console에서 상세 로그 확인
            </div>
          </div>
        )}

        <div className="footerBar">
          <button
            className="backBtn"
            onClick={() => router.push('/keyword')}
            disabled={submitting}
          >
            ← 키워드
          </button>
          <button className="startBtn" onClick={handleStart} disabled={submitting}>
            {submitting ? (
              <><span className="spinner"></span>생성 요청 중...</>
            ) : (
              '▶ 영상 생성 시작'
            )}
          </button>
        </div>
      </div>
    </V11Shell>
  );
}
