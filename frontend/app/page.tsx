'use client';
/**
 * 홈 v4 — "크리에이터의 서재"
 *
 * 따뜻한 베이지 배경 + 테라코타/세이지/머스타드 포인트
 * 전부 한국어 · Pretendard만 사용 · 눈 편안한 밝기
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';
import { SCENARIOS, pickRecommendedScenarios, getScenarioById, type ScenarioStyle } from './_shared/scenarios';
import AdSlot from './_shared/AdSlot';

const PLACEHOLDER_KEYWORDS = [
  '2026 금리 전망',
  'AI 도구 TOP 5',
  '시니어 건강 관리',
  '부동산 2026 전망',
  'N잡러 재테크',
];

const TRENDING = [
  { kw: '2026 금리 전망', delta: '94%', hot: true },
  { kw: 'AI 영상 자동화', delta: '67%', hot: true },
  { kw: '시니어 건강', delta: '52%', hot: false },
  { kw: '부동산 전망', delta: '41%', hot: false },
  { kw: 'N잡 재테크', delta: '38%', hot: false },
];

const CATEGORIES = [
  { label: '경제·사회', score: 87, delta: '+12', accent: 'terra' as const },
  { label: '정보·분석', score: 76, delta: '+6', accent: 'dusk' as const },
  { label: 'IT·자기계발', score: 94, delta: '+24', accent: 'sage' as const },
  { label: '범용·라이프', score: 62, delta: '-3', accent: 'mustard' as const },
];

const ACCENT_MAP = {
  terra: { color: '#c65f3b', soft: '#fdf1e7', deep: '#a64a2a' },
  sage: { color: '#7d9b7c', soft: '#eaf2ea', deep: '#5e7e5d' },
  mustard: { color: '#d4a545', soft: '#fbf3df', deep: '#a67e1e' },
  dusk: { color: '#6b8cae', soft: '#eaf0f5', deep: '#5a7a99' },
};

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
  if (!ts) return '아직 없음';
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}일 전`;
  return new Date(ts).toLocaleDateString('ko-KR');
}

function useCountUp(target: number, duration = 1000) {
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
      alert('먼저 키워드를 입력하고 AI 분석을 시작해주세요');
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

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 28px 32px 48px;
          max-width: 1440px;
          margin: 0 auto;
        }

        /* ============ HERO ============ */
        .hero {
          position: relative;
          padding: 36px 36px 30px;
          margin-bottom: 28px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 85% 15%, #fdf1e7 0%, transparent 55%),
            radial-gradient(circle at 15% 80%, #eaf2ea 0%, transparent 55%),
            #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(90, 74, 58, 0.04);
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 30L0 0M30 30L60 0M30 30L0 60M30 30L60 60' stroke='%23c65f3b' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .heroTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 14px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .heroStatus {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          background: #eaf2ea;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          color: #5e7e5d;
          letter-spacing: -0.01em;
        }
        .heroStatusDot {
          width: 6px; height: 6px;
          background: #7d9b7c;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(125, 155, 124, 0.6);
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .heroMeta {
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .heroMeta strong {
          color: #c65f3b;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .heroTitle {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.15;
          color: #2a2419;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .heroTitle .accent {
          color: #c65f3b;
        }
        .heroSub {
          font-size: 15px;
          color: #564a3a;
          margin-bottom: 24px;
          max-width: 600px;
          line-height: 1.6;
          font-weight: 500;
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
        .kwIcon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          pointer-events: none;
          opacity: 0.5;
        }
        .kwInput {
          width: 100%;
          padding: 16px 18px 16px 46px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 14px;
          font-size: 15px;
          color: #2a2419;
          font-family: inherit;
          transition: all 0.18s;
          letter-spacing: -0.01em;
          font-weight: 500;
        }
        .kwInput:focus {
          outline: none;
          border-color: #c65f3b;
          box-shadow: 0 0 0 3px rgba(198, 95, 59, 0.1);
        }
        .kwInput::placeholder {
          color: #b8ad9b;
        }
        .kwBtn {
          padding: 0 26px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 2px 8px rgba(198, 95, 59, 0.25);
        }
        .kwBtn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(198, 95, 59, 0.4);
        }
        .kwBtn:disabled {
          background: #ece6db;
          color: #b8ad9b;
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
          font-size: 11px;
          color: #8a7d6a;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .trendChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          color: #564a3a;
          cursor: pointer;
          transition: all 0.15s;
        }
        .trendChip:hover {
          background: #fdf1e7;
          border-color: rgba(198, 95, 59, 0.25);
          color: #a64a2a;
          transform: translateY(-1px);
        }
        .trendDelta {
          font-size: 11px;
          font-weight: 700;
          color: #5e7e5d;
          font-variant-numeric: tabular-nums;
        }
        .trendHotMark {
          font-size: 10px;
          padding: 1px 6px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 999px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        /* ============ CATEGORY ============ */
        .blockHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .blockTitle {
          font-size: 13px;
          font-weight: 800;
          color: #564a3a;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .blockTitle::before {
          content: '';
          width: 3px;
          height: 14px;
          background: #c65f3b;
          border-radius: 2px;
        }

        .catGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .catCard {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
          padding: 16px 18px;
          transition: all 0.18s;
          box-shadow: 0 1px 2px rgba(90, 74, 58, 0.03);
        }
        .catCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(90, 74, 58, 0.06);
        }
        .catTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .catLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: #2a2419;
          letter-spacing: -0.01em;
        }
        .catDelta {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 5px;
          font-variant-numeric: tabular-nums;
        }
        .catScoreRow {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 10px;
        }
        .catScore {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .catMax {
          font-size: 13px;
          color: #b8ad9b;
          font-weight: 600;
        }
        .catBar {
          height: 4px;
          background: #ece6db;
          border-radius: 2px;
          overflow: hidden;
        }
        .catBarFill {
          height: 100%;
          border-radius: 2px;
          transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* ============ AD WRAP ============ */
        .adWrap { margin-bottom: 28px; }

        /* ============ MY STATS ============ */
        .statGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 36px;
        }
        .statCard {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
          padding: 18px 20px;
          transition: all 0.18s;
          box-shadow: 0 1px 2px rgba(90, 74, 58, 0.03);
        }
        .statCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(90, 74, 58, 0.06);
        }
        .statCardLabel {
          font-size: 11px;
          font-weight: 700;
          color: #8a7d6a;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
        }
        .statCardValue {
          font-size: 30px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1;
          margin-bottom: 5px;
          font-variant-numeric: tabular-nums;
        }
        .statCardSub {
          font-size: 11.5px;
          color: #8a7d6a;
          font-weight: 500;
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
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #2a2419;
        }
        .aiNumber {
          width: 30px; height: 30px;
          background: #c65f3b;
          color: #fff;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
        }
        .aiKwTag {
          font-size: 14px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .aiKwTag strong {
          color: #c65f3b;
          font-weight: 700;
        }
        .rerollBtn {
          padding: 8px 14px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          color: #564a3a;
          font-family: inherit;
          transition: all 0.15s;
          letter-spacing: -0.01em;
        }
        .rerollBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
          transform: translateY(-1px);
        }

        /* ============ EMPTY / ANALYZING ============ */
        .emptyPanel {
          background: #faf8f4;
          border: 2px dashed rgba(90, 74, 58, 0.12);
          border-radius: 16px;
          padding: 56px 28px;
          text-align: center;
          margin-bottom: 32px;
          transition: all 0.2s;
        }
        .emptyPanel.analyzing {
          border-style: solid;
          border-color: #c65f3b;
          background: linear-gradient(180deg, #fdf1e7 0%, #faf8f4 60%);
        }
        .emptyIcon {
          font-size: 40px;
          margin-bottom: 14px;
          display: inline-block;
        }
        .emptyIcon.bobbing {
          animation: bob 2.5s infinite;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .emptyIcon.spinning {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .emptyTitle {
          font-size: 17px;
          font-weight: 800;
          color: #2a2419;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }
        .emptySub {
          font-size: 13px;
          color: #8a7d6a;
          line-height: 1.7;
          max-width: 380px;
          margin: 0 auto;
        }

        /* ============ SCENARIOS ============ */
        .scenGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }
        .scen {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 16px;
          padding: 22px;
          position: relative;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 1px 2px rgba(90, 74, 58, 0.03);
        }
        .scen:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(90, 74, 58, 0.08);
        }
        .scenBest {
          border: 2px solid #c65f3b;
          background: linear-gradient(180deg, #fdf1e7 0%, #faf8f4 30%);
        }
        .bestBadge {
          position: absolute;
          top: -11px; left: 18px;
          padding: 4px 11px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.01em;
          box-shadow: 0 2px 6px rgba(198, 95, 59, 0.3);
        }
        .scenHead {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        .scenEmoji {
          font-size: 28px;
          line-height: 1;
        }
        .scenTitleBlock {
          flex: 1;
          min-width: 0;
        }
        .scenName {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          margin-bottom: 3px;
        }
        .scenGroup {
          font-size: 11.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .scenFlow {
          font-size: 12px;
          color: #564a3a;
          line-height: 1.6;
          margin-bottom: 12px;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 10px;
          font-weight: 500;
        }
        .scenDesc {
          font-size: 12.5px;
          color: #8a7d6a;
          line-height: 1.65;
          margin-bottom: 14px;
        }
        .scenStats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .sStat {
          padding: 9px 11px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 9px;
        }
        .sStatLabel {
          font-size: 10px;
          font-weight: 700;
          color: #8a7d6a;
          letter-spacing: -0.01em;
          margin-bottom: 3px;
        }
        .sStatValue {
          font-size: 15px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .sStatRet { color: #5e7e5d; }

        .scenBtn {
          width: 100%;
          padding: 12px;
          background: #faf8f4;
          color: #2a2419;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 11px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: all 0.15s;
        }
        .scenBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
          background: #fff;
        }
        .scenBtnBest {
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-color: transparent;
        }
        .scenBtnBest:hover {
          background: linear-gradient(135deg, #a64a2a 0%, #8a3a1c 100%);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.3);
        }

        /* ============ LIBRARY ============ */
        .libBlock {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 1px 2px rgba(90, 74, 58, 0.03);
        }
        .libHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .libTitle {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 19px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
        }
        .libStats {
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .libStats strong {
          color: #c65f3b;
          font-weight: 700;
        }
        .libGroup { margin-bottom: 26px; }
        .libGroup:last-child { margin-bottom: 0; }
        .libGroupHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(90, 74, 58, 0.08);
        }
        .libGroupLabel {
          font-size: 13px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
        }
        .libGroupCount {
          font-size: 11px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .libGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 10px;
        }
        .libItem {
          padding: 14px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .libItem:hover {
          background: #fdf1e7;
          border-color: rgba(198, 95, 59, 0.2);
          transform: translateY(-1px);
        }
        .libItemTop {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 8px;
        }
        .libItemEmoji {
          font-size: 20px;
          flex-shrink: 0;
        }
        .libItemName {
          font-size: 13.5px;
          font-weight: 800;
          color: #2a2419;
          flex: 1;
          letter-spacing: -0.015em;
        }
        .libItemFlow {
          font-size: 11.5px;
          color: #564a3a;
          line-height: 1.55;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .libItemFoot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .libItemRet { color: #5e7e5d; }

        @media (max-width: 1024px) {
          .scenGrid { grid-template-columns: 1fr; }
          .statGrid { grid-template-columns: repeat(2, 1fr); }
          .catGrid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .page { padding: 18px 16px 40px; }
          .hero { padding: 26px 20px; border-radius: 16px; }
          .heroTitle { font-size: 28px; }
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
            <span className="heroStatus">
              <span className="heroStatusDot" />
              AI 분석 · 실시간 가동중
            </span>
            <span className="heroMeta">
              지금 <strong>{activeUsers.toLocaleString()}</strong>명이 영상을 제작 중
            </span>
          </div>

          <h1 className="heroTitle">
            오늘은 어떤 영상을<br />
            만들어볼까요<span className="accent">?</span>
          </h1>
          <p className="heroSub">
            키워드 하나만 입력하면 AI가 12가지 구조 중 최적의 시나리오 3가지를 0.7초 안에 골라드려요.
          </p>

          <div className="kwForm">
            <div className="kwInputWrap">
              <span className="kwIcon">🔍</span>
              <input
                ref={inputRef}
                className="kwInput"
                placeholder={`예: ${PLACEHOLDER_KEYWORDS[placeholderIdx]}`}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                maxLength={50}
              />
            </div>
            <button className="kwBtn" onClick={handleAnalyze} disabled={!keyword.trim() || analyzing}>
              {analyzing ? '분석 중...' : 'AI 분석 시작'}
            </button>
          </div>

          <div className="trendRow">
            <span className="trendLabel">🔥 실시간 인기 키워드</span>
            {TRENDING.map((t, i) => (
              <span key={i} className="trendChip" onClick={() => handleTrendClick(t.kw)}>
                <span>{t.kw}</span>
                <span className="trendDelta">+{t.delta}</span>
                {t.hot && <span className="trendHotMark">인기</span>}
              </span>
            ))}
          </div>
        </section>

        {/* ============ CATEGORY ============ */}
        <div className="blockHead">
          <span className="blockTitle">카테고리별 블루오션 지수</span>
        </div>
        <div className="catGrid">
          {CATEGORIES.map((c, i) => {
            const accent = ACCENT_MAP[c.accent];
            return (
              <div key={i} className="catCard">
                <div className="catTop">
                  <span className="catLabel">{c.label}</span>
                  <span
                    className="catDelta"
                    style={{
                      background: c.delta.startsWith('+') ? '#eaf2ea' : '#fce8e8',
                      color: c.delta.startsWith('+') ? '#5e7e5d' : '#b94a4a',
                    }}
                  >
                    {c.delta}
                  </span>
                </div>
                <div className="catScoreRow">
                  <span className="catScore" style={{ color: accent.color }}>{c.score}</span>
                  <span className="catMax">/ 100</span>
                </div>
                <div className="catBar">
                  <div
                    className="catBarFill"
                    style={{ width: `${c.score}%`, background: accent.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="adWrap">
          <AdSlot slot="home-top" variant="horizontal" />
        </div>

        {/* ============ MY STATS ============ */}
        <div className="blockHead">
          <span className="blockTitle">나의 제작 현황</span>
        </div>
        <div className="statGrid">
          <div className="statCard">
            <div className="statCardLabel">누적 영상</div>
            <div className="statCardValue">{countUpTotal.toLocaleString()}</div>
            <div className="statCardSub">지금까지 만든 영상</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">이번 달</div>
            <div className="statCardValue">{countUpMonth.toLocaleString()}</div>
            <div className="statCardSub">{new Date().getMonth() + 1}월 제작 횟수</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">최근 제작</div>
            <div className="statCardValue" style={{ fontSize: 17 }}>
              {formatRelative(myStats.lastJobAt)}
            </div>
            <div className="statCardSub">마지막 영상</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">사용 가능 스타일</div>
            <div className="statCardValue">{SCENARIOS.length}</div>
            <div className="statCardSub">시나리오 종류</div>
          </div>
        </div>

        {/* ============ AI RECOMMEND ============ */}
        <section id="ai-section" style={{ marginBottom: 32 }}>
          <div className="aiHead">
            <div className="aiTitle">
              <span className="aiNumber">1</span>
              AI 추천 시나리오
              {activeKeyword && (
                <span className="aiKwTag">
                  · <strong>"{activeKeyword}"</strong>
                </span>
              )}
            </div>
            {activeKeyword && !analyzing && (
              <button className="rerollBtn" onClick={handleReroll}>
                🎲 다시 추천{rerollCount > 0 ? ` · ${rerollCount}` : ''}
              </button>
            )}
          </div>

          {!activeKeyword || analyzing ? (
            <div className={`emptyPanel ${analyzing ? 'analyzing' : ''}`}>
              <div className={`emptyIcon ${analyzing ? 'spinning' : 'bobbing'}`}>
                {analyzing ? '⚙️' : '🎯'}
              </div>
              <div className="emptyTitle">
                {analyzing ? `"${activeKeyword}" 분석 중이에요` : '키워드를 입력하면 AI가 추천해드려요'}
              </div>
              <div className="emptySub">
                {analyzing
                  ? '12가지 시나리오 스타일 중 최적의 3가지를 고르고 있어요'
                  : '12가지 스타일 중 키워드에 가장 잘 맞는 3가지를 골라드려요'}
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
                  {i === 0 && <div className="bestBadge">⭐ AI 추천 1위</div>}
                  <div className="scenHead">
                    <span className="scenEmoji">{s.emoji}</span>
                    <div className="scenTitleBlock">
                      <div className="scenName">{s.name}</div>
                      <div className="scenGroup">{s.group}</div>
                    </div>
                  </div>
                  <div className="scenFlow">{s.flow}</div>
                  <div className="scenDesc">{s.desc}</div>

                  <div className="scenStats">
                    <div className="sStat">
                      <div className="sStatLabel">섹션 수</div>
                      <div className="sStatValue">{s.sections}단</div>
                    </div>
                    <div className="sStat">
                      <div className="sStatLabel">유지율</div>
                      <div className="sStatValue sStatRet">{s.retention}%</div>
                    </div>
                  </div>

                  <button
                    className={`scenBtn ${i === 0 ? 'scenBtnBest' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleStart(s.id); }}
                  >
                    {i === 0 ? '이 스타일로 만들기 →' : '이 스타일 선택'}
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
              <span className="aiNumber">2</span>
              전체 시나리오 라이브러리
            </div>
            <div className="libStats">
              <strong>{SCENARIOS.length}가지</strong> 스타일 · 모두 무제한 사용
            </div>
          </div>

          {['경제·사회', '정보·분석', '범용'].map((group) => {
            const items = SCENARIOS.filter((s) => s.group === group);
            return (
              <div key={group} className="libGroup">
                <div className="libGroupHead">
                  <span className="libGroupLabel">{group}</span>
                  <span className="libGroupCount">{items.length}가지</span>
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
                        <span>{s.sectionPattern.length}단 구성</span>
                        <span className="libItemRet">유지율 {s.retention}%</span>
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
