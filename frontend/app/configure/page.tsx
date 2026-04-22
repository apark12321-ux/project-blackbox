'use client';
/**
 * /configure - 스타일 설정 + 실제 영상 생성 API
 * scenarioStyleId를 videoApi에 전달하여 백엔드 프롬프트에 반영
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import { startVideoGeneration, formatApiError } from '../_shared/videoApi';
import { getScenarioById } from '../_shared/scenarios';

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
  const [scenarioStyleId, setScenarioStyleId] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [tone, setTone] = useState<Tone>('formal');
  const [duration, setDuration] = useState<number>(10);
  const [mode, setMode] = useState<Mode>('normal');

  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorDetail, setErrorDetail] = useState<string>('');

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) {
      router.replace('/');
      return;
    }
    setKeyword(p.keyword);
    setCategory(p.category || '');
    setScenarioStyleId(p.scenarioStyleId || p.templateId || '');
    if (p.tone) setTone(p.tone);
    if (p.duration) setDuration(p.duration);
    if (p.mode) setMode(p.mode);
    if (p.customTopic) setCustomTopic(p.customTopic);
  }, [router]);

  const style = getScenarioById(scenarioStyleId);

  const handleStart = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitStep('시작 중...');
    setErrorMsg('');
    setErrorDetail('');

    setProject({ customTopic, tone, duration, mode, step: 3 });

    try {
      const res = await startVideoGeneration(
        {
          keyword,
          tone,
          duration,
          mode,
          custom_topic: customTopic || undefined,
          category: category || undefined,
          scenarioStyleId: scenarioStyleId || undefined,
        },
        (step) => setSubmitStep(step)
      );

      setProject({ jobId: res.job_id });
      router.push('/processing');
    } catch (err: any) {
      console.error('[configure] failed:', err);
      setErrorMsg(formatApiError(err));
      try { setErrorDetail(JSON.stringify(err?.body || err, null, 2)); } catch { setErrorDetail(String(err)); }
      setSubmitting(false);
      setSubmitStep('');
    }
  };

  return (
    <V11Shell currentStep={3}>
      <style jsx>{`
        .page { max-width: 760px; margin: 0 auto; padding: 40px 24px; }
        .header { text-align: center; margin-bottom: 24px; }
        .eyebrow { font-size: 12px; font-weight: 700; color: #cc0000; letter-spacing: 0.12em; margin-bottom: 8px; }
        .title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
        .sub { font-size: 14px; color: #606060; line-height: 1.6; }

        .summary {
          background: linear-gradient(135deg, #fff0f0 0%, #fff 100%);
          border: 1px solid #ffcccc;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .summaryIcon {
          font-size: 28px;
          flex-shrink: 0;
        }
        .summaryContent { flex: 1; min-width: 0; }
        .summaryLabel {
          font-size: 10px;
          font-weight: 700;
          color: #cc0000;
          letter-spacing: 0.1em;
          margin-bottom: 3px;
        }
        .summaryTitle {
          font-size: 15px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.01em;
          margin-bottom: 2px;
        }
        .summaryDesc {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }
        .kwTag {
          padding: 6px 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #0f0f0f;
        }

        .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 14px; }
        .label { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        .labelOpt { font-size: 11px; font-weight: 500; color: #888; padding: 2px 7px; background: #f2f2f2; border-radius: 4px; }
        .labelHelp { font-size: 12px; color: #606060; margin-bottom: 12px; }
        .input { width: 100%; padding: 12px 14px; background: #fff; color: #0f0f0f; border: 1px solid #e5e5e5; border-radius: 10px; font-size: 14px; font-family: inherit; }
        .input:focus { outline: none; border-color: #0f0f0f; }
        .toneGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .toneBtn { padding: 14px 12px; background: #f9f9f9; border: 2px solid transparent; border-radius: 12px; cursor: pointer; font-family: inherit; text-align: left; transition: all 0.15s; }
        .toneBtn:hover { background: #f2f2f2; }
        .toneBtnActive { border-color: #cc0000; background: #fff; }
        .toneEmoji { font-size: 22px; margin-bottom: 6px; }
        .toneLabel { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
        .toneExample { font-size: 12px; color: #606060; line-height: 1.5; }
        .slider { width: 100%; height: 6px; background: #e5e5e5; border-radius: 999px; -webkit-appearance: none; appearance: none; margin: 14px 0 10px; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; background: #cc0000; border-radius: 50%; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .slider::-moz-range-thumb { width: 22px; height: 22px; background: #cc0000; border-radius: 50%; cursor: pointer; border: 3px solid #fff; }
        .ticks { display: flex; justify-content: space-between; font-size: 11px; color: #888; }
        .duration { font-size: 24px; font-weight: 800; color: #cc0000; text-align: right; margin-top: -30px; margin-bottom: 8px; }
        .modeGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .modeBtn { padding: 18px 14px; background: #f9f9f9; border: 2px solid transparent; border-radius: 12px; cursor: pointer; font-family: inherit; text-align: center; transition: all 0.15s; }
        .modeBtn:hover { background: #f2f2f2; }
        .modeBtnActive { border-color: #cc0000; background: #fff; }
        .modeIcon { font-size: 28px; margin-bottom: 6px; }
        .modeLabel { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .modeDesc { font-size: 11px; color: #606060; line-height: 1.5; }
        .errorBox { margin-bottom: 14px; padding: 14px 16px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 10px; font-size: 13px; line-height: 1.6; }
        .errorTitle { font-weight: 700; color: #cc0000; margin-bottom: 6px; }
        .errorText { color: #660000; word-break: break-word; white-space: pre-wrap; }
        .errorDetail { margin-top: 10px; padding: 10px; background: #fff; border-radius: 8px; font-size: 11px; color: #888; font-family: monospace; max-height: 200px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
        .progressBox { margin-bottom: 14px; padding: 14px 16px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 10px; display: flex; align-items: center; gap: 12px; }
        .progressIcon { width: 32px; height: 32px; border: 3px solid #ffcccc; border-top-color: #cc0000; border-radius: 50%; animation: spin 1s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progressText { font-size: 14px; color: #cc0000; font-weight: 600; }
        .progressSub { font-size: 11px; color: #888; margin-top: 2px; }
        .footerBar { display: flex; gap: 8px; margin-top: 20px; }
        .backBtn { padding: 14px 18px; background: #f2f2f2; color: #0f0f0f; border: none; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .backBtn:hover { background: #e5e5e5; }
        .startBtn { flex: 1; padding: 14px; background: #cc0000; color: #fff; border: none; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; min-height: 52px; }
        .startBtn:hover:not(:disabled) { background: #a80000; }
        .startBtn:disabled { background: #888; cursor: not-allowed; opacity: 0.7; }
        .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 6px; vertical-align: middle; }

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
          <div className="eyebrow">STEP 3 · 세부 설정</div>
          <h1 className="title">마지막 설정만 남았어요</h1>
          <p className="sub">말투, 길이, 타겟 모드를 확인하고 제작을 시작하세요</p>
        </div>

        {/* 선택 요약 */}
        <div className="summary">
          <span className="summaryIcon">{style?.emoji || '🎬'}</span>
          <div className="summaryContent">
            <div className="summaryLabel">선택된 시나리오</div>
            <div className="summaryTitle">{style?.name || '기본 구성'}</div>
            <div className="summaryDesc">{style?.flow || '표준 영상 구성'}</div>
          </div>
          <span className="kwTag">▶ {String(keyword || '-')}</span>
        </div>

        <div className="card">
          <div className="label">
            추가 주제 <span className="labelOpt">선택사항</span>
          </div>
          <div className="labelHelp">비워두면 AI가 키워드와 시나리오 스타일에 맞춰 자동 구성합니다</div>
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
          <input type="range" className="slider" min="5" max="20" step="1"
            value={duration} onChange={(e) => setDuration(Number(e.target.value))}
            disabled={submitting} />
          <div className="ticks">
            <span>5분</span><span>10분</span><span>15분</span><span>20분</span>
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
              <div className="modeDesc">전연령 · 표준 톤</div>
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

        {submitting && submitStep && (
          <div className="progressBox">
            <div className="progressIcon"></div>
            <div>
              <div className="progressText">{String(submitStep)}</div>
              <div className="progressSub">AI 처리 중입니다. 1~2분 소요될 수 있어요.</div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="errorBox">
            <div className="errorTitle">⚠️ 영상 생성 요청 실패</div>
            <div className="errorText">{String(errorMsg)}</div>
            {errorDetail && (
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, color: '#888' }}>기술 상세 보기</summary>
                <div className="errorDetail">{String(errorDetail)}</div>
              </details>
            )}
          </div>
        )}

        <div className="footerBar">
          <button className="backBtn" onClick={() => router.push('/keyword')} disabled={submitting}>
            ← 키워드
          </button>
          <button className="startBtn" onClick={handleStart} disabled={submitting}>
            {submitting ? (
              <><span className="spinner"></span>{String(submitStep || '처리 중...')}</>
            ) : (
              '▶ 영상 생성 시작'
            )}
          </button>
        </div>
      </div>
    </V11Shell>
  );
}
