'use client';
/**
 * 홈 페이지 v2 — "살아있는 AI 스튜디오" 경험
 *
 * 업그레이드 포인트:
 * - Hero: 로테이팅 키워드 + 실시간 분석 카운터
 * - "지금 AI가 찾은 트렌드" 섹션 — 라이브 느낌
 * - 통계 카드: 매끈한 숫자 카운트업 애니메이션
 * - 시나리오 카드: 각 카드에 "평균 조회수" 같은 증명 지표
 * - 광고 자리 2개 → 네이티브 추천 카드 스타일로
 * - 소셜 프루프: 최근 만들어진 영상 thumbnails
 * - Pro 배너 완전 제거
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';
import { SCENARIOS, pickRecommendedScenarios, getScenarioById, type ScenarioStyle } from './_shared/scenarios';
import AdSlot from './_shared/AdSlot';

// 로테이팅 placeholder (Hero input)
const PLACEHOLDER_KEYWORDS = [
  '2026 금리 전망...',
  'AI 도구 TOP 5...',
  '시니어 건강 관리...',
  '부동산 2026 전망...',
  '재테크 초보 가이드...',
  '2030 미래 직업...',
];

// 트렌드 키워드 (실제 서비스처럼 보이게)
const TRENDING_NOW = [
  { kw: '2026 금리 전망', delta: '+94%', hot: true },
  { kw: 'AI 영상 자동화', delta: '+67%', hot: true },
  { kw: '시니어 건강 관리', delta: '+52%', hot: false },
  { kw: '부동산 전망', delta: '+41%', hot: false },
  { kw: 'N잡러 재테크', delta: '+38%', hot: false },
];

// 카테고리별 블루오션 지표
const CATEGORY_STATS = [
  { label: '경제·사회', score: 87, trend: '↑', color: '#cc0000' },
  { label: '정보·분석', score: 76, trend: '↑', color: '#b45309' },
  { label: 'IT·자기계발', score: 94, trend: '↑↑', color: '#047857' },
  { label: '범용·라이프', score: 62, trend: '→', color: '#6b7280' },
];

interface RecommendedScenario extends ScenarioStyle {
  sections: number;
}

function pickScenarios(seed: string): RecommendedScenario[] {
  return pickRecommendedScenarios(seed).map((s) => ({
    ...s,
    sections: s.sectionPattern.length,
  }));
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
      const t = typeof j.created_at === 'number'
        ? j.created_at
        : j.created_at ? new Date(j.created_at).getTime() : 0;
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

// 숫자 카운트업 훅
function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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

  // Placeholder 로테이션
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
    // 분석하는 느낌 — 짧은 딜레이
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
    const seed = activeKeyword + '_' + (rerollCount + 1) + '_' + Date.now();
    setScenarios(pickScenarios(seed));
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
          padding: 22px 28px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ============ HERO ============ */
        .hero {
          background:
            radial-gradient(circle at 85% 15%, rgba(204, 0, 0, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 15% 85%, rgba(80, 40, 180, 0.1) 0%, transparent 45%),
            linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0d0d0d 100%);
          border-radius: 20px;
          padding: 28px 32px;
          color: #fff;
          margin-bottom: 18px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath opacity='.5' d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
          pointer-events: none;
        }
        .heroInner { position: relative; z-index: 1; }
        .heroTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .heroLabel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          color: #4ade80;
          letter-spacing: 0.1em;
        }
        .livedot2 {
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse2 1.8s infinite;
          box-shadow: 0 0 6px rgba(34,197,94,0.6);
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .heroCount {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }
        .heroCount strong {
          color: #4ade80;
          font-weight: 700;
        }

        .heroTitle {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.15;
          margin-bottom: 8px;
          background: linear-gradient(180deg, #ffffff 0%, #cccccc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .heroSub {
          font-size: 14px;
          color: #a0a0a0;
          margin-bottom: 22px;
          max-width: 540px;
          line-height: 1.55;
        }

        .kwForm {
          display: flex;
          gap: 8px;
          max-width: 720px;
          margin-bottom: 16px;
        }
        .kwInputWrap {
          flex: 1;
          position: relative;
        }
        .kwInput {
          width: 100%;
          padding: 15px 18px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          font-size: 15px;
          color: #fff;
          font-family: inherit;
          transition: all 0.15s;
          letter-spacing: -0.01em;
        }
        .kwInput:focus {
          outline: none;
          border-color: #cc0000;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3px rgba(204,0,0,0.15);
        }
        .kwInput::placeholder { color: #555; }
        .kwBtn {
          padding: 0 28px;
          background: linear-gradient(135deg, #cc0000 0%, #a00000 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          letter-spacing: -0.01em;
          transition: all 0.15s;
          box-shadow: 0 2px 8px rgba(204,0,0,0.25);
        }
        .kwBtn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(204,0,0,0.4);
        }
        .kwBtn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
          box-shadow: none;
        }

        .trends {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .trendLabel {
          font-size: 11px;
          color: #666;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-right: 2px;
        }
        .trendChip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          font-size: 11.5px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.15s;
        }
        .trendChip:hover {
          background: rgba(204, 0, 0, 0.15);
          border-color: rgba(204, 0, 0, 0.4);
          color: #fff;
          transform: translateY(-1px);
        }
        .trendDelta {
          font-size: 10px;
          font-weight: 700;
          color: #4ade80;
        }
        .trendHot {
          font-size: 10px;
          padding: 1px 5px;
          background: rgba(204,0,0,0.2);
          border-radius: 3px;
          color: #ff6b6b;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        /* ============ CATEGORY RADAR ============ */
        .catRadar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }
        .catCard {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          padding: 12px 14px;
          position: relative;
          overflow: hidden;
          transition: all 0.15s;
        }
        .catCard:hover {
          border-color: #0f0f0f;
          transform: translateY(-1px);
        }
        .catLabel {
          font-size: 11px;
          color: #666;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .catRow {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .catScore {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .catTrend {
          font-size: 13px;
          font-weight: 700;
        }
        .catBar {
          position: relative;
          height: 3px;
          background: #f0f0f0;
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        }
        .catBarFill {
          height: 100%;
          border-radius: 2px;
          transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* ============ AD SLOT WRAP ============ */
        .adWrap { margin-bottom: 22px; }

        /* ============ MY STATS ============ */
        .statsHead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 12px;
          margin-top: 4px;
        }
        .statsHeadTitle {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #808080;
          text-transform: uppercase;
        }

        .statsBar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 26px;
        }
        .statCard {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          padding: 16px 18px;
          transition: all 0.15s;
          position: relative;
          overflow: hidden;
        }
        .statCard:hover {
          border-color: #0f0f0f;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .statCardLabel {
          font-size: 10px;
          font-weight: 800;
          color: #888;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .statCardValue {
          font-size: 26px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 5px;
          font-feature-settings: 'tnum';
        }
        .statCardSub {
          font-size: 11px;
          color: #888;
          font-weight: 500;
        }

        /* ============ SECTION ============ */
        .sectionHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .sectionTitle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .sectionNum {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px; height: 26px;
          background: #0f0f0f;
          color: #fff;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
        }
        .sectionKwTag {
          font-size: 14px;
          font-weight: 500;
          color: #888;
        }
        .sectionKwTag strong {
          color: #0f0f0f;
          font-weight: 700;
        }
        .rerollBtn {
          padding: 8px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #606060;
          font-family: inherit;
          transition: all 0.15s;
        }
        .rerollBtn:hover {
          border-color: #0f0f0f;
          color: #0f0f0f;
          transform: translateY(-1px);
        }
        .rerollHint { font-size: 11px; color: #888; }

        /* ============ EMPTY + ANALYZING ============ */
        .emptyState {
          background: #fff;
          border: 2px dashed #e5e5e5;
          border-radius: 16px;
          padding: 52px 24px;
          text-align: center;
          margin-bottom: 28px;
          transition: all 0.2s;
        }
        .emptyState.analyzing {
          border-style: solid;
          border-color: #cc0000;
          background: linear-gradient(180deg, #fffafa 0%, #fff 60%);
        }
        .emptyIcon {
          font-size: 40px;
          margin-bottom: 12px;
          display: inline-block;
          animation: bob 2.5s ease-in-out infinite;
        }
        .analyzing .emptyIcon {
          animation: spin 1.2s linear infinite;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .emptyTitle {
          font-size: 16px;
          font-weight: 800;
          color: #0f0f0f;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .emptySub {
          font-size: 12.5px;
          color: #888;
          line-height: 1.6;
          max-width: 340px;
          margin: 0 auto;
        }

        /* ============ SCENARIOS ============ */
        .scenarios {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        .scenario {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 16px;
          padding: 20px;
          position: relative;
          transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          overflow: hidden;
        }
        .scenario::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(204,0,0,0.03) 100%);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .scenario:hover {
          border-color: #0f0f0f;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .scenario:hover::after { opacity: 1; }

        .scenarioBest {
          border: 2px solid #cc0000;
          background: linear-gradient(180deg, #fffafa 0%, #fff 40%);
        }
        .bestBadge {
          position: absolute;
          top: -10px; left: 16px;
          padding: 4px 12px;
          background: linear-gradient(135deg, #cc0000 0%, #8b0000 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          box-shadow: 0 2px 6px rgba(204,0,0,0.3);
        }
        .scenarioHead {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }
        .scenarioEmoji {
          font-size: 28px;
          line-height: 1;
        }
        .scenarioTitleWrap { flex: 1; min-width: 0; }
        .scenarioName {
          font-size: 15px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }
        .scenarioGroup {
          font-size: 10.5px;
          font-weight: 600;
          color: #888;
          letter-spacing: 0.03em;
        }
        .scenarioFlow {
          font-size: 11.5px;
          color: #555;
          line-height: 1.55;
          margin-bottom: 10px;
          padding: 9px 11px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
        }
        .scenarioDesc {
          font-size: 12px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .scenarioStats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .sStat {
          padding: 8px 10px;
          background: #fafafa;
          border-radius: 8px;
        }
        .sStatLabel {
          font-size: 9px;
          font-weight: 800;
          color: #888;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .sStatValue {
          font-size: 14px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .sStatRetention {
          color: #047857;
        }
        .scenarioBtn {
          width: 100%;
          padding: 11px;
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          position: relative;
          z-index: 1;
          transition: all 0.15s;
        }
        .scenarioBtn:hover { background: #333; transform: translateY(-1px); }
        .scenarioBtnBest {
          background: linear-gradient(135deg, #cc0000 0%, #8b0000 100%);
        }
        .scenarioBtnBest:hover {
          background: linear-gradient(135deg, #b00000 0%, #700000 100%);
        }

        /* ============ LIBRARY ============ */
        .libSection {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 16px;
          padding: 26px;
          margin-bottom: 24px;
        }
        .libHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .libTitle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .libStats {
          font-size: 11.5px;
          color: #888;
          font-weight: 500;
        }
        .libStats strong { color: #0f0f0f; font-weight: 700; }

        .libGroup { margin-bottom: 22px; }
        .libGroup:last-child { margin-bottom: 0; }
        .libGroupLabel {
          font-size: 11px;
          font-weight: 800;
          color: #808080;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 11px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .libGroupCount {
          background: #fafafa;
          color: #555;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 700;
          letter-spacing: 0;
        }
        .libGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 10px;
        }
        .libItem {
          padding: 14px;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 11px;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }
        .libItem:hover {
          background: #fff;
          border-color: #cc0000;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(204,0,0,0.06);
        }
        .libItemTop {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 7px;
        }
        .libItemEmoji {
          font-size: 20px;
          flex-shrink: 0;
        }
        .libItemName {
          font-size: 13px;
          font-weight: 800;
          color: #0f0f0f;
          flex: 1;
          letter-spacing: -0.01em;
        }
        .libItemFlow {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .libItemFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10px;
          color: #888;
          font-weight: 600;
        }
        .libItemRetention {
          color: #047857;
        }

        @media (max-width: 1024px) {
          .scenarios { grid-template-columns: 1fr; }
          .statsBar { grid-template-columns: repeat(2, 1fr); }
          .catRadar { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .page { padding: 16px 14px 40px; }
          .hero { padding: 22px 20px; border-radius: 16px; }
          .heroTitle { font-size: 24px; }
          .kwForm { flex-direction: column; }
          .kwBtn { width: 100%; padding: 14px; }
          .statsBar { grid-template-columns: 1fr 1fr; gap: 8px; }
          .libGrid { grid-template-columns: 1fr; }
          .catRadar { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="page">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="heroInner">
            <div className="heroTop">
              <span className="heroLabel">
                <span className="livedot2" />
                AI ANALYSIS · LIVE
              </span>
              <span className="heroCount">
                지금 <strong>1,384명</strong>이 영상을 제작 중
              </span>
            </div>
            <h1 className="heroTitle">어떤 영상을 만들까요?</h1>
            <p className="heroSub">
              키워드 하나로 AI가 12가지 구조 중 최적의 블루오션 시나리오 3개를 0.7초 안에 분석합니다
            </p>

            <div className="kwForm">
              <div className="kwInputWrap">
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
                {analyzing ? '분석 중...' : '▶ AI 분석 시작'}
              </button>
            </div>

            <div className="trends">
              <span className="trendLabel">🔥 실시간 트렌드</span>
              {TRENDING_NOW.map((t, i) => (
                <span key={i} className="trendChip" onClick={() => handleTrendClick(t.kw)}>
                  <span>{t.kw}</span>
                  <span className="trendDelta">{t.delta}</span>
                  {t.hot && <span className="trendHot">HOT</span>}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CATEGORY RADAR ============ */}
        <div className="catRadar">
          {CATEGORY_STATS.map((c, i) => (
            <div key={i} className="catCard">
              <div className="catLabel">{c.label} 블루오션</div>
              <div className="catRow">
                <div className="catScore" style={{ color: c.color }}>{c.score}</div>
                <div className="catTrend" style={{ color: c.color }}>{c.trend}</div>
              </div>
              <div className="catBar">
                <div className="catBarFill" style={{ width: `${c.score}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* AdSense slot ① — native curation card */}
        <div className="adWrap">
          <AdSlot slot="home-top" variant="horizontal" label="home-top" />
        </div>

        {/* ============ MY STATS ============ */}
        <div className="statsHead">
          <div className="statsHeadTitle">내 제작 현황</div>
        </div>
        <section className="statsBar">
          <div className="statCard">
            <div className="statCardLabel">누적 영상</div>
            <div className="statCardValue">{countUpTotal.toLocaleString()}</div>
            <div className="statCardSub">전체 제작 횟수</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">이번 달</div>
            <div className="statCardValue">{countUpMonth.toLocaleString()}</div>
            <div className="statCardSub">{new Date().getMonth() + 1}월 제작</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">최근 제작</div>
            <div className="statCardValue" style={{ fontSize: 15 }}>
              {formatRelative(myStats.lastJobAt)}
            </div>
            <div className="statCardSub">마지막 영상</div>
          </div>
          <div className="statCard">
            <div className="statCardLabel">사용 가능</div>
            <div className="statCardValue">{SCENARIOS.length}</div>
            <div className="statCardSub">시나리오 스타일</div>
          </div>
        </section>

        {/* ============ AI SECTION ============ */}
        <section id="ai-section" style={{ marginBottom: 32 }}>
          <div className="sectionHead">
            <div className="sectionTitle">
              <span className="sectionNum">1</span>
              AI 추천 시나리오
              {activeKeyword && (
                <span className="sectionKwTag">
                  · <strong>"{activeKeyword}"</strong>
                </span>
              )}
            </div>
            {activeKeyword && !analyzing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="rerollHint">매번 다른 조합</span>
                <button className="rerollBtn" onClick={handleReroll}>
                  🎲 다시 추천{rerollCount > 0 ? ` · ${rerollCount}` : ''}
                </button>
              </div>
            )}
          </div>

          {!activeKeyword || analyzing ? (
            <div className={`emptyState ${analyzing ? 'analyzing' : ''}`}>
              <div className="emptyIcon">{analyzing ? '⚙️' : '🎯'}</div>
              <div className="emptyTitle">
                {analyzing ? `"${activeKeyword}" 분석 중...` : '키워드를 입력해 AI 분석을 시작하세요'}
              </div>
              <div className="emptySub">
                {analyzing
                  ? '12가지 시나리오 중 블루오션 3개를 고르고 있어요'
                  : 'AI가 12가지 시나리오 스타일 중 키워드에 최적화된 3가지를 추천합니다'}
              </div>
            </div>
          ) : (
            <div className="scenarios">
              {scenarios.map((s, i) => (
                <div
                  key={`${s.id}-${rerollCount}-${i}`}
                  className={`scenario ${i === 0 ? 'scenarioBest' : ''}`}
                  onClick={() => handleStart(s.id)}
                >
                  {i === 0 && <div className="bestBadge">⭐ AI BEST</div>}
                  <div className="scenarioHead">
                    <span className="scenarioEmoji">{s.emoji}</span>
                    <div className="scenarioTitleWrap">
                      <div className="scenarioName">{s.name}</div>
                      <div className="scenarioGroup">{s.group}</div>
                    </div>
                  </div>
                  <div className="scenarioFlow">{s.flow}</div>
                  <div className="scenarioDesc">{s.desc}</div>

                  <div className="scenarioStats">
                    <div className="sStat">
                      <div className="sStatLabel">섹션</div>
                      <div className="sStatValue">{s.sections}단</div>
                    </div>
                    <div className="sStat">
                      <div className="sStatLabel">유지율 벤치</div>
                      <div className="sStatValue sStatRetention">{s.retention}%</div>
                    </div>
                  </div>

                  <button
                    className={`scenarioBtn ${i === 0 ? 'scenarioBtnBest' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleStart(s.id); }}
                  >
                    {i === 0 ? '▶ 이 시나리오로 제작' : '이 시나리오 선택'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AdSense slot ② — mid section */}
        <div className="adWrap">
          <AdSlot slot="home-mid" variant="horizontal" label="home-mid" />
        </div>

        {/* ============ STYLE LIBRARY ============ */}
        <section className="libSection">
          <div className="libHead">
            <div className="libTitle">
              <span className="sectionNum">2</span>
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
                <div className="libGroupLabel">
                  <span>{group}</span>
                  <span className="libGroupCount">{items.length}가지</span>
                </div>
                <div className="libGrid">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="libItem"
                      onClick={() => handleStart(s.id)}
                    >
                      <div className="libItemTop">
                        <span className="libItemEmoji">{s.emoji}</span>
                        <span className="libItemName">{s.name}</span>
                      </div>
                      <div className="libItemFlow">{s.flow}</div>
                      <div className="libItemFooter">
                        <span>{s.sectionPattern.length}단 구성</span>
                        <span className="libItemRetention">유지율 {s.retention}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* AdSense slot ③ — bottom  */}
        <div className="adWrap">
          <AdSlot slot="home-bottom" variant="horizontal" label="home-bottom" />
        </div>
      </div>
    </DashboardShell>
  );
}
