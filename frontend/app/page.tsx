'use client';
/**
 * 홈 v3 — "Neural Lab" Mission Control
 *
 * NASA 미션 컨트롤 + Cursor + Midjourney 느낌
 * 거대한 타이틀 + 네온 액센트 + 모노스페이스 데이터
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';
import { SCENARIOS, pickRecommendedScenarios, getScenarioById, type ScenarioStyle } from './_shared/scenarios';
import AdSlot from './_shared/AdSlot';

const PLACEHOLDER_KEYWORDS = [
  '2026 interest_rate forecast',
  'AI tools TOP 5',
  'senior health management',
  'real_estate 2026',
  'side_hustle investment',
];

const TRENDING = [
  { kw: '2026 금리 전망', delta: '+94%', priority: 'critical' as const },
  { kw: 'AI 영상 자동화', delta: '+67%', priority: 'high' as const },
  { kw: '시니어 건강 관리', delta: '+52%', priority: 'medium' as const },
  { kw: '부동산 전망', delta: '+41%', priority: 'medium' as const },
  { kw: 'N잡러 재테크', delta: '+38%', priority: 'low' as const },
];

const CATEGORIES = [
  { code: 'CAT-01', label: '경제·사회', score: 87, delta: '+12', accent: '#00e5ff' },
  { code: 'CAT-02', label: '정보·분석', score: 76, delta: '+6', accent: '#a855f7' },
  { code: 'CAT-03', label: 'IT·자기계발', score: 94, delta: '+24', accent: '#4ade80' },
  { code: 'CAT-04', label: '범용·라이프', score: 62, delta: '-3', accent: '#fbbf24' },
];

interface RecommendedScenario extends ScenarioStyle {
  sections: number;
}

function pickScenarios(seed: string): RecommendedScenario[] {
  return pickRecommendedScenarios(seed).map((s) => ({ ...s, sections: s.sectionPattern.length }));
}

interface MyStats {
  total: number;
  thisMonth: number;
  lastJobAt: number | null;
}

function readMyStats(): MyStats {
  if (typeof window === 'undefined') return { total: 0, thisMonth: 0, lastJobAt: null };
  try {
    const raw = localStorage.getItem('algomaker_jobs');
    if (!raw) return { total: 0, thisMonth: 0, lastJobAt: null };
    const arr = JSON.parse(raw) as Array<{ created_at?: number | string }>;
    if (!Array.isArray(arr)) return { total: 0, thisMonth: 0, lastJobAt: null };
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    let thisMonth = 0;
    let lastJobAt: number | null = null;
    for (const j of arr) {
      const t = typeof j.created_at === 'number' ? j.created_at : j.created_at ? new Date(j.created_at).getTime() : 0;
      if (t && t >= monthStart) thisMonth += 1;
      if (t && (lastJobAt === null || t > lastJobAt)) lastJobAt = t;
    }
    return { total: arr.length, thisMonth, lastJobAt };
  } catch {
    return { total: 0, thisMonth: 0, lastJobAt: null };
  }
}

function formatRelative(ts: number | null): string {
  if (!ts) return '— IDLE';
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'T-00:00:01';
  if (min < 60) return `T-00:${min.toString().padStart(2, '0')}:00`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `T-${hr.toString().padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}:00`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCurrent(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return current;
}

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [scenarios, setScenarios] = useState<RecommendedScenario[]>([]);
  const [rerollCount, setRerollCount] = useState(0);
  const [myStats, setMyStats] = useState<MyStats>({ total: 0, thisMonth: 0, lastJobAt: null });
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1384);
  const inputRef = useRef<HTMLInputElement>(null);

  const countUpTotal = useCountUp(myStats.total);
  const countUpMonth = useCountUp(myStats.thisMonth);

  useEffect(() => {
    setMyStats(readMyStats());
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'algomaker_jobs') setMyStats(readMyStats());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Active user counter — live feel
  useEffect(() => {
    const t = setInterval(() => {
      setActiveUsers((u) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(1200, Math.min(1800, u + delta));
      });
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_KEYWORDS.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const handleAnalyze = () => {
    if (!keyword.trim()) return;
    setActiveKeyword(keyword);
    setAnalyzing(true);
    setTimeout(() => {
      setScenarios(pickScenarios(keyword + Date.now()));
      setRerollCount(0);
      setAnalyzing(false);
      document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  };

  const handleTrendClick = (kw: string) => {
    setKeyword(kw);
    setActiveKeyword(kw);
    setAnalyzing(true);
    setTimeout(() => {
      setScenarios(pickScenarios(kw + Date.now()));
      setRerollCount(0);
      setAnalyzing(false);
    }, 700);
  };

  const handleReroll = () => {
    if (!activeKeyword) return;
    setScenarios(pickScenarios(activeKeyword + '_' + (rerollCount + 1) + '_' + Date.now()));
    setRerollCount((r) => r + 1);
  };

  const handleStart = (styleId: string) => {
    const style = getScenarioById(styleId);
    if (!style) return;
    if (!activeKeyword.trim()) {
      inputRef.current?.focus();
      alert('먼저 키워드를 입력하고 분석을 시작해주세요');
      return;
    }
    setProject({
      keyword: activeKeyword,
      category: 'economy',
      templateId: styleId,
      scenarioStyleId: styleId,
      step: 1,
    });
    router.push('/keyword');
  };

  const getTrendColor = (priority: string) => {
    return priority === 'critical' ? '#ec4899' :
           priority === 'high' ? '#00e5ff' :
           priority === 'medium' ? '#a855f7' : '#606070';
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 22px 28px 48px;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
        }

        /* ============ HERO ============ */
        .hero {
          position: relative;
          padding: 40px 36px 34px;
          margin-bottom: 24px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background:
            radial-gradient(ellipse at 85% 20%, rgba(0,229,255,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 15% 80%, rgba(168,85,247,0.1) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0f 0%, #050507 100%);
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #00e5ff 50%, transparent 100%);
          opacity: 0.6;
        }
        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
          pointer-events: none;
        }

        .heroTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
          position: relative;
          z-index: 1;
        }
        .heroStatusGroup {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .statusChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          color: #4ade80;
          letter-spacing: 0.1em;
        }
        .statusDot2 {
          width: 5px; height: 5px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 8px #4ade80;
          animation: statusPulse 1.8s infinite;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .liveMetric {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-3);
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .liveNum {
          color: #00e5ff;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .heroTitle {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
          color: var(--text-0);
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .heroTitle .gradient {
          background: linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .heroSub {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--text-3);
          margin-bottom: 26px;
          max-width: 560px;
          line-height: 1.6;
          letter-spacing: 0.02em;
          position: relative;
          z-index: 1;
        }

        .kwForm {
          display: flex;
          gap: 10px;
          max-width: 720px;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .kwInputWrap {
          flex: 1;
          position: relative;
        }
        .kwPrefix {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-mono);
          font-size: 12px;
          color: #00e5ff;
          font-weight: 600;
          pointer-events: none;
          letter-spacing: 0.06em;
        }
        .kwInput {
          width: 100%;
          padding: 15px 16px 15px 58px;
          background: rgba(5, 5, 7, 0.8);
          border: 1px solid var(--line);
          border-radius: 8px;
          font-size: 15px;
          color: var(--text-0);
          font-family: var(--font-sans);
          transition: all 0.15s;
          letter-spacing: -0.01em;
        }
        .kwInput:focus {
          outline: none;
          border-color: #00e5ff;
          background: rgba(5, 5, 7, 0.95);
          box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.15), 0 0 20px rgba(0, 229, 255, 0.2);
        }
        .kwInput::placeholder {
          color: #404050;
          font-family: var(--font-mono);
          font-size: 13.5px;
        }
        .kwBtn {
          padding: 0 26px;
          background: linear-gradient(135deg, #00e5ff 0%, #a855f7 100%);
          color: #050507;
          border: none;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.1em;
          transition: all 0.15s;
          box-shadow: 0 0 0 1px transparent, 0 4px 20px rgba(0, 229, 255, 0.2);
        }
        .kwBtn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 0 1px #00e5ff, 0 6px 28px rgba(0, 229, 255, 0.4);
        }
        .kwBtn:disabled {
          background: #15151f;
          color: #404050;
          cursor: not-allowed;
          box-shadow: none;
        }

        .trendRow {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .trendLabel {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-4);
          letter-spacing: 0.12em;
          margin-right: 4px;
        }
        .trendChip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 11px;
          background: rgba(15, 15, 24, 0.8);
          border: 1px solid var(--line);
          border-radius: 4px;
          font-size: 11.5px;
          color: var(--text-2);
          cursor: pointer;
          transition: all 0.15s;
          font-family: var(--font-sans);
        }
        .trendChip:hover {
          background: rgba(21, 21, 31, 1);
          color: var(--text-0);
          transform: translateY(-1px);
        }
        .trendDelta {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
        }

        /* ============ CATEGORY GRID ============ */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .catCard {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
        }
        .catCard:hover {
          transform: translateY(-2px);
          border-color: currentColor;
        }
        .catHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .catCode {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--text-4);
          letter-spacing: 0.1em;
        }
        .catDelta {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.03);
        }
        .catLabel {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-2);
          margin-bottom: 4px;
        }
        .catScoreRow {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 10px;
        }
        .catScore {
          font-family: var(--font-mono);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .catScoreMax {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-4);
        }
        .catBarBg {
          height: 3px;
          background: rgba(255,255,255,0.05);
          border-radius: 1.5px;
          overflow: hidden;
          position: relative;
        }
        .catBarFill {
          height: 100%;
          border-radius: 1.5px;
          transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 0 8px currentColor;
        }

        /* ============ AD WRAP ============ */
        .adWrap { margin-bottom: 24px; }

        /* ============ STATS ============ */
        .blockHeading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .blockLabel {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          color: var(--text-3);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .blockLabel::before {
          content: '';
          width: 14px;
          height: 1px;
          background: var(--line-strong);
        }

        .statGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 32px;
        }
        .statCard {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px 18px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .statCard:hover {
          border-color: rgba(0, 229, 255, 0.3);
          transform: translateY(-1px);
        }
        .statCardLabel {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          color: var(--text-4);
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .statCardValue {
          font-family: var(--font-mono);
          font-size: 26px;
          font-weight: 600;
          color: var(--text-0);
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 4px;
          font-variant-numeric: tabular-nums;
        }
        .statCardSub {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-3);
          letter-spacing: 0.02em;
        }

        /* ============ AI SECTION ============ */
        .aiHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .aiTitle {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text-0);
        }
        .aiTitleTag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 700;
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }
        .kwActive {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-3);
          letter-spacing: 0.02em;
        }
        .kwActive strong {
          color: #00e5ff;
          font-weight: 600;
        }

        .rerollBtn {
          padding: 7px 14px;
          background: transparent;
          border: 1px solid var(--line);
          border-radius: 5px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-2);
          letter-spacing: 0.08em;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .rerollBtn:hover {
          border-color: #00e5ff;
          color: #00e5ff;
        }

        /* ============ EMPTY / ANALYZING ============ */
        .emptyPanel {
          background: var(--bg-1);
          border: 1px dashed var(--line);
          border-radius: 12px;
          padding: 56px 28px;
          text-align: center;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .emptyPanel.analyzing {
          border-style: solid;
          border-color: #00e5ff;
          background:
            radial-gradient(circle at center, rgba(0, 229, 255, 0.05) 0%, transparent 70%),
            var(--bg-1);
        }
        .emptyPanel.analyzing::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00e5ff, transparent);
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          to { left: 100%; }
        }
        .emptyStatus {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--text-3);
          margin-bottom: 16px;
        }
        .emptyStatus.live {
          color: #00e5ff;
        }
        .emptyTitle {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-0);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .emptySub {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-3);
          line-height: 1.65;
          max-width: 380px;
          margin: 0 auto;
          letter-spacing: 0.02em;
        }
        .scanDots {
          display: inline-flex;
          gap: 4px;
          margin-left: 6px;
        }
        .scanDot {
          width: 4px; height: 4px;
          background: #00e5ff;
          border-radius: 50%;
          animation: scanDot 1.2s infinite;
        }
        .scanDot:nth-child(2) { animation-delay: 0.15s; }
        .scanDot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes scanDot {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; box-shadow: 0 0 6px #00e5ff; }
        }

        /* ============ SCENARIOS ============ */
        .scenGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }
        .scen {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.22s;
          overflow: hidden;
        }
        .scen::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .scen:hover {
          border-color: rgba(0, 229, 255, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(0, 229, 255, 0.08);
        }
        .scen:hover::before { opacity: 1; }

        .scenBest {
          border-color: #00e5ff;
          background: linear-gradient(180deg, rgba(0, 229, 255, 0.04) 0%, var(--bg-1) 40%);
          box-shadow: 0 0 40px rgba(0, 229, 255, 0.08);
        }
        .scenBest::before {
          opacity: 1;
          background: linear-gradient(90deg, transparent, #00e5ff, transparent);
        }
        .bestBadge {
          position: absolute;
          top: -10px; left: 16px;
          padding: 3px 10px;
          background: #00e5ff;
          color: #050507;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          box-shadow: 0 0 16px rgba(0, 229, 255, 0.6);
        }

        .scenHead {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 14px;
        }
        .scenEmoji {
          font-size: 26px;
          line-height: 1;
          filter: grayscale(0.2);
        }
        .scenTitleBlock { flex: 1; min-width: 0; }
        .scenName {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-0);
          letter-spacing: -0.02em;
          margin-bottom: 3px;
        }
        .scenMeta {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-4);
          letter-spacing: 0.06em;
        }
        .scenFlow {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-2);
          line-height: 1.6;
          margin-bottom: 10px;
          padding: 9px 11px;
          background: var(--bg-0);
          border: 1px solid var(--line-dim);
          border-radius: 6px;
          letter-spacing: 0.01em;
        }
        .scenDesc {
          font-size: 12px;
          color: var(--text-3);
          line-height: 1.65;
          margin-bottom: 14px;
        }
        .scenStats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 14px;
        }
        .sStat {
          padding: 8px 10px;
          background: var(--bg-0);
          border: 1px solid var(--line-dim);
          border-radius: 5px;
        }
        .sStatLabel {
          font-family: var(--font-mono);
          font-size: 8.5px;
          color: var(--text-4);
          letter-spacing: 0.1em;
          margin-bottom: 3px;
        }
        .sStatValue {
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 600;
          color: var(--text-0);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .sStatRet {
          color: #4ade80;
        }

        .scenBtn {
          width: 100%;
          padding: 11px;
          background: transparent;
          color: var(--text-2);
          border: 1px solid var(--line);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.1em;
          transition: all 0.15s;
        }
        .scenBtn:hover {
          border-color: #00e5ff;
          color: #00e5ff;
        }
        .scenBtnBest {
          background: #00e5ff;
          color: #050507;
          border-color: #00e5ff;
        }
        .scenBtnBest:hover {
          background: transparent;
          color: #00e5ff;
          box-shadow: 0 0 16px rgba(0, 229, 255, 0.4);
        }

        /* ============ LIBRARY ============ */
        .libBlock {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .libHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .libTitle {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-0);
          letter-spacing: -0.025em;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .libStats {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-3);
          letter-spacing: 0.04em;
        }
        .libStats strong {
          color: #00e5ff;
          font-weight: 600;
        }

        .libGroup {
          margin-bottom: 22px;
        }
        .libGroup:last-child { margin-bottom: 0; }
        .libGroupHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--line-dim);
        }
        .libGroupLabel {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          color: var(--text-2);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .libGroupCount {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--text-4);
          letter-spacing: 0.1em;
        }
        .libGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .libItem {
          padding: 14px;
          background: var(--bg-2);
          border: 1px solid var(--line-dim);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .libItem:hover {
          background: var(--bg-3);
          border-color: rgba(0, 229, 255, 0.3);
          transform: translateY(-1px);
        }
        .libItemTop {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .libItemEmoji {
          font-size: 18px;
          flex-shrink: 0;
          filter: grayscale(0.2);
        }
        .libItemName {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-0);
          flex: 1;
          letter-spacing: -0.01em;
        }
        .libItemFlow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-3);
          line-height: 1.5;
          margin-bottom: 10px;
          letter-spacing: 0.01em;
        }
        .libItemFoot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--text-4);
          letter-spacing: 0.04em;
        }
        .libItemRet {
          color: #4ade80;
        }

        @media (max-width: 1024px) {
          .scenGrid { grid-template-columns: 1fr; }
          .statGrid { grid-template-columns: repeat(2, 1fr); }
          .catGrid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .page { padding: 18px 16px 40px; }
          .hero { padding: 28px 22px; }
          .heroTitle { font-size: 32px; }
          .kwForm { flex-direction: column; }
          .kwBtn { width: 100%; padding: 14px; }
          .statGrid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .libGrid { grid-template-columns: 1fr; }
          .catGrid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="page">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="heroTop">
            <div className="heroStatusGroup">
              <span className="statusChip">
                <span className="statusDot2" />
                AI · SYSTEM ONLINE
              </span>
              <span className="liveMetric">
                <span>▸</span>
                <span className="liveNum">{activeUsers.toLocaleString()}</span>
                <span>active sessions</span>
              </span>
            </div>
          </div>

          <h1 className="heroTitle">
            <span className="gradient">Neural</span><br />
            Video Studio.
          </h1>
          <p className="heroSub">
            {'>'} Input keyword · AI generates 3 optimal scenarios from 12 neural patterns<br />
            {'>'} Blue-ocean analysis · auto-scripted · voice-synthesized · full pipeline
          </p>

          <div className="kwForm">
            <div className="kwInputWrap">
              <span className="kwPrefix">{'>'}</span>
              <input
                ref={inputRef}
                className="kwInput"
                placeholder={PLACEHOLDER_KEYWORDS[placeholderIdx]}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                maxLength={50}
              />
            </div>
            <button className="kwBtn" onClick={handleAnalyze} disabled={!keyword.trim() || analyzing}>
              {analyzing ? 'ANALYZING...' : 'EXECUTE ▸'}
            </button>
          </div>

          <div className="trendRow">
            <span className="trendLabel">▸ LIVE TRENDS</span>
            {TRENDING.map((t, i) => (
              <span
                key={i}
                className="trendChip"
                onClick={() => handleTrendClick(t.kw)}
                style={{ borderColor: `${getTrendColor(t.priority)}33` }}
              >
                <span>{t.kw}</span>
                <span className="trendDelta" style={{ color: getTrendColor(t.priority) }}>
                  {t.delta}
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* ============ CATEGORY RADAR ============ */}
        <div className="blockHeading">
          <span className="blockLabel">CATEGORY RADAR · BLUE OCEAN INDEX</span>
        </div>
        <div className="catGrid">
          {CATEGORIES.map((c) => (
            <div key={c.code} className="catCard" style={{ color: c.accent }}>
              <div className="catHeader">
                <span className="catCode">{c.code}</span>
                <span className="catDelta" style={{ color: c.delta.startsWith('+') ? '#4ade80' : '#ef4444' }}>
                  {c.delta}
                </span>
              </div>
              <div className="catLabel">{c.label}</div>
              <div className="catScoreRow">
                <span className="catScore">{c.score}</span>
                <span className="catScoreMax">/100</span>
              </div>
              <div className="catBarBg">
                <div className="catBarFill" style={{ width: `${c.score}%`, background: c.accent }} />
              </div>
            </div>
          ))}
        </div>

        <div className="adWrap">
          <AdSlot slot="home-top" variant="horizontal" />
        </div>

        {/* ============ MY STATS ============ */}
        <div className="blockHeading">
          <span className="blockLabel">YOUR MISSION LOG</span>
        </div>
        <div className="statGrid">
          <div className="statCard">
            <div className="statCardLabel">TOTAL · GENERATED</div>
            <div className="statCardValue">{countUpTotal.toLocaleString()}</div>
            <div className="statCardSub">all videos · lifetime</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">THIS_MONTH</div>
            <div className="statCardValue">{countUpMonth.toLocaleString()}</div>
            <div className="statCardSub">{new Date().getMonth() + 1}월 {new Date().getFullYear()}</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">LAST_RUN</div>
            <div className="statCardValue" style={{ fontSize: 15 }}>
              {formatRelative(myStats.lastJobAt)}
            </div>
            <div className="statCardSub">most recent</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">AVAILABLE_NODES</div>
            <div className="statCardValue">{SCENARIOS.length}</div>
            <div className="statCardSub">scenario patterns</div>
          </div>
        </div>

        {/* ============ AI RECOMMEND ============ */}
        <section id="ai-section" style={{ marginBottom: 32 }}>
          <div className="aiHead">
            <div className="aiTitle">
              AI Recommendation
              <span className="aiTitleTag">NEURAL.PICK</span>
              {activeKeyword && (
                <span className="kwActive">
                  ▸ target: <strong>"{activeKeyword}"</strong>
                </span>
              )}
            </div>
            {activeKeyword && !analyzing && (
              <button className="rerollBtn" onClick={handleReroll}>
                ↻ RESHUFFLE{rerollCount > 0 ? ` · ${rerollCount}` : ''}
              </button>
            )}
          </div>

          {!activeKeyword || analyzing ? (
            <div className={`emptyPanel ${analyzing ? 'analyzing' : ''}`}>
              <div className={`emptyStatus ${analyzing ? 'live' : ''}`}>
                {analyzing ? `▸ SCANNING NEURAL_NET` : '▸ AWAITING INPUT'}
                {analyzing && (
                  <span className="scanDots">
                    <span className="scanDot" />
                    <span className="scanDot" />
                    <span className="scanDot" />
                  </span>
                )}
              </div>
              <div className="emptyTitle">
                {analyzing ? `Analyzing "${activeKeyword}"` : 'Input keyword to begin'}
              </div>
              <div className="emptySub">
                {analyzing
                  ? 'Neural engine is evaluating 12 scenario patterns and selecting top 3 matches by retention score'
                  : 'AI evaluates 12 scenario patterns · selects 3 optimal matches · average analysis time 0.7s'}
              </div>
            </div>
          ) : (
            <div className="scenGrid">
              {scenarios.map((s, i) => (
                <div
                  key={`${s.id}-${rerollCount}-${i}`}
                  className={`scen ${i === 0 ? 'scenBest' : ''}`}
                  onClick={() => handleStart(s.id)}
                >
                  {i === 0 && <div className="bestBadge">▸ NEURAL.BEST</div>}
                  <div className="scenHead">
                    <span className="scenEmoji">{s.emoji}</span>
                    <div className="scenTitleBlock">
                      <div className="scenName">{s.name}</div>
                      <div className="scenMeta">NODE · {s.group}</div>
                    </div>
                  </div>
                  <div className="scenFlow">{s.flow}</div>
                  <div className="scenDesc">{s.desc}</div>

                  <div className="scenStats">
                    <div className="sStat">
                      <div className="sStatLabel">SECTIONS</div>
                      <div className="sStatValue">{s.sections}</div>
                    </div>
                    <div className="sStat">
                      <div className="sStatLabel">RETENTION</div>
                      <div className="sStatValue sStatRet">{s.retention}%</div>
                    </div>
                  </div>

                  <button
                    className={`scenBtn ${i === 0 ? 'scenBtnBest' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleStart(s.id); }}
                  >
                    {i === 0 ? '▸ DEPLOY THIS' : 'SELECT'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="adWrap">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* ============ FULL LIBRARY ============ */}
        <section className="libBlock">
          <div className="libHead">
            <div className="libTitle">
              Full Scenario Library
              <span className="aiTitleTag">12 NODES</span>
            </div>
            <div className="libStats">
              <strong>{SCENARIOS.length}</strong> patterns · unlimited use
            </div>
          </div>

          {['경제·사회', '정보·분석', '범용'].map((group) => {
            const items = SCENARIOS.filter((s) => s.group === group);
            return (
              <div key={group} className="libGroup">
                <div className="libGroupHead">
                  <span className="libGroupLabel">▸ {group}</span>
                  <span className="libGroupCount">{items.length} NODES</span>
                </div>
                <div className="libGrid">
                  {items.map((s) => (
                    <div key={s.id} className="libItem" onClick={() => handleStart(s.id)}>
                      <div className="libItemTop">
                        <span className="libItemEmoji">{s.emoji}</span>
                        <span className="libItemName">{s.name}</span>
                      </div>
                      <div className="libItemFlow">{s.flow}</div>
                      <div className="libItemFoot">
                        <span>{s.sectionPattern.length}_SECTIONS</span>
                        <span className="libItemRet">RET {s.retention}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <div className="adWrap">
          <AdSlot slot="home-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
