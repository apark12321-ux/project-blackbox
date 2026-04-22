'use client';
/**
 * AlgoMaker v15 - 홈 (우리 고유 12개 시나리오)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';
import { SCENARIOS, pickRecommendedScenarios, getScenarioById, type ScenarioStyle } from './_shared/scenarios';

// "이번 주 사용 횟수" 소셜 프루프
const USAGE_STATS: Record<string, number> = {
  mystery: 1247, spoiler: 892, origin: 634, whatif: 521,
  verify: 1089, match: 456, flip: 782, classic: 1523,
  threeact: 387, solution: 945, ranking: 623, docu: 298,
};

const TREND_KEYWORDS = [
  { kw: '2026 금리 전망', heat: 97, cpm: '$18~24' },
  { kw: 'AI 도구 TOP 5', heat: 89, cpm: '$15~22' },
  { kw: '시니어 건강 관리', heat: 82, cpm: '$16~22' },
  { kw: '부동산 2026 전망', heat: 76, cpm: '$14~20' },
];

interface RecommendedScenario extends ScenarioStyle {
  confidence: number;
  grade: string;
  retentionPredicted: number;
  estimatedViews: number;
  sections: number;
}

function enrichScenarios(keyword: string, seed: string): RecommendedScenario[] {
  const picked = pickRecommendedScenarios(seed);
  return picked.map((s, i) => {
    // seed 기반 안정된 "랜덤" 수치
    const seedNum = (keyword + seed + s.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rnd = (mod: number) => ((seedNum * (i + 1) * 31) % mod);

    return {
      ...s,
      confidence: Math.max(82, Math.min(98, s.retention - 5 + rnd(15))),
      grade: i === 0 ? 'A+' : i === 1 ? 'A' : 'A-',
      retentionPredicted: Math.max(40, Math.min(98, s.retention + rnd(10) - 5)),
      estimatedViews: 50000 + rnd(180000),
      sections: s.sectionPattern.length,
    };
  });
}

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [scenarios, setScenarios] = useState<RecommendedScenario[]>([]);
  const [rerollCount, setRerollCount] = useState(0);

  const handleAnalyze = () => {
    if (!keyword.trim()) return;
    setActiveKeyword(keyword);
    setScenarios(enrichScenarios(keyword, keyword + Date.now()));
    setRerollCount(0);
    // 섹션 부드럽게 스크롤
    setTimeout(() => {
      document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTrendClick = (kw: string) => {
    setKeyword(kw);
    setActiveKeyword(kw);
    setScenarios(enrichScenarios(kw, kw + Date.now()));
    setRerollCount(0);
  };

  const handleReroll = () => {
    if (!activeKeyword) return;
    const seed = activeKeyword + '_' + (rerollCount + 1) + '_' + Date.now();
    setScenarios(enrichScenarios(activeKeyword, seed));
    setRerollCount((r) => r + 1);
  };

  const handleStart = (styleId: string) => {
    const style = getScenarioById(styleId);
    if (!style) return;
    if (style.tier === 'pro') {
      alert(`🔒 "${style.name}"은(는) Pro 전용 시나리오입니다\n\nPro 업그레이드:\n✓ 12개 전체 시나리오 사용\n✓ 무제한 영상 제작\n✓ 경쟁 채널 분석\n✓ 썸네일 A/B 테스트\n\n결제 기능은 곧 출시됩니다!`);
      return;
    }
    if (!activeKeyword.trim()) {
      alert('먼저 키워드를 입력하고 AI 분석을 시작해주세요');
      return;
    }
    setProject({
      keyword: activeKeyword,
      category: 'economy',   // TODO: 카테고리 선택 연결
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
          padding: 24px 32px 48px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* HERO */
        .hero {
          background: linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%);
          border-radius: 16px;
          padding: 28px 32px;
          color: #fff;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          border: 1px solid #1f1f1f;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(circle at 80% 10%, rgba(204, 0, 0, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 20% 90%, rgba(100, 50, 200, 0.1) 0%, transparent 40%);
          pointer-events: none;
        }
        .heroInner { position: relative; z-index: 1; }
        .heroTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .heroLabel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(204, 0, 0, 0.15);
          border: 1px solid rgba(204, 0, 0, 0.3);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          color: #ff6b6b;
          letter-spacing: 0.1em;
        }
        .livedot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .liveBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #888;
        }
        .heroTitle {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .heroSub { font-size: 13px; color: #999; margin-bottom: 20px; }

        .kwForm {
          display: flex;
          gap: 8px;
          max-width: 700px;
          margin-bottom: 14px;
        }
        .kwInput {
          flex: 1;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          font-size: 15px;
          color: #fff;
          font-family: inherit;
          transition: all 0.15s;
        }
        .kwInput:focus {
          outline: none;
          border-color: #cc0000;
          background: rgba(255, 255, 255, 0.12);
        }
        .kwInput::placeholder { color: #666; }
        .kwBtn {
          padding: 0 28px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
        }
        .kwBtn:hover:not(:disabled) { background: #a80000; }
        .kwBtn:disabled { background: #333; color: #666; cursor: not-allowed; }

        .trends {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .trendLabel { font-size: 11px; color: #666; font-weight: 600; letter-spacing: 0.05em; }
        .trendChip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          font-size: 11px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.15s;
        }
        .trendChip:hover {
          background: rgba(204, 0, 0, 0.15);
          border-color: rgba(204, 0, 0, 0.4);
          color: #fff;
        }
        .heatBar {
          display: inline-block;
          width: 18px; height: 3px;
          background: #333;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
        .heatFill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          background: linear-gradient(90deg, #ffa500 0%, #ff0000 100%);
        }

        /* STATS BAR */
        .statsBar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .statCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 14px 16px;
        }
        .statCardHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .statCardLabel {
          font-size: 10px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .statCardDelta {
          font-size: 10px;
          padding: 2px 6px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 4px;
          font-weight: 700;
        }
        .statCardValue {
          font-size: 22px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .statCardSub { font-size: 10px; color: #888; }

        /* ANALYSIS */
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
          gap: 8px;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .sectionNum {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px; height: 24px;
          background: #0f0f0f;
          color: #fff;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
        }
        .rerollBtn {
          padding: 7px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #606060;
          font-family: inherit;
        }
        .rerollBtn:hover { border-color: #0f0f0f; color: #0f0f0f; }
        .rerollHint { font-size: 11px; color: #888; }

        .emptyState {
          background: #fff;
          border: 2px dashed #e5e5e5;
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
          margin-bottom: 28px;
        }
        .emptyIcon { font-size: 32px; margin-bottom: 10px; opacity: 0.6; }
        .emptyTitle { font-size: 15px; font-weight: 700; color: #0f0f0f; margin-bottom: 6px; }
        .emptySub { font-size: 12px; color: #888; line-height: 1.6; }

        .scenarios {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .scenario {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 18px;
          position: relative;
          transition: all 0.2s;
          cursor: pointer;
        }
        .scenario:hover {
          border-color: #0f0f0f;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
        }
        .scenarioBest {
          border: 2px solid #cc0000;
          background: linear-gradient(180deg, #fffafa 0%, #fff 30%);
        }
        .bestBadge {
          position: absolute;
          top: -10px; left: 14px;
          padding: 4px 10px;
          background: #cc0000;
          color: #fff;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .scenarioHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }
        .scenarioTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 800;
          color: #0f0f0f;
        }
        .scenarioEmoji { font-size: 22px; }
        .scenarioGrade {
          padding: 3px 8px;
          background: #0f0f0f;
          color: #fff;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
        }
        .scenarioGradeA { background: #16a34a; }
        .scenarioFlow {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 12px;
          padding: 8px 10px;
          background: #fafafa;
          border-radius: 8px;
        }
        .scenarioDesc {
          font-size: 11px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 14px;
          padding: 0 2px;
        }
        .scenarioMetrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .metric {
          text-align: center;
          padding: 8px;
          background: #fafafa;
          border-radius: 8px;
        }
        .metricLabel {
          font-size: 9px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .metricValue {
          font-size: 16px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .metricValueAccent { color: #cc0000; }
        .gauge { margin-bottom: 14px; }
        .gaugeHead {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #888;
          margin-bottom: 4px;
        }
        .gaugeBar {
          width: 100%;
          height: 5px;
          background: #f0f0f0;
          border-radius: 999px;
          overflow: hidden;
        }
        .gaugeFill {
          height: 100%;
          background: linear-gradient(90deg, #16a34a 0%, #84cc16 50%, #eab308 100%);
          border-radius: 999px;
          transition: width 0.6s ease;
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
        }
        .scenarioBtn:hover { background: #333; }
        .scenarioBtnBest { background: #cc0000; }
        .scenarioBtnBest:hover { background: #a80000; }

        /* LIBRARY */
        .libSection {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .libHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .libTitle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .libStats { font-size: 11px; color: #888; }

        .libGroup { margin-bottom: 18px; }
        .libGroup:last-child { margin-bottom: 0; }
        .libGroupLabel {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid #f0f0f0;
        }
        .libGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .libItem {
          padding: 14px;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }
        .libItem:hover { background: #fff; border-color: #cc0000; }
        .libItemPro { opacity: 0.7; }
        .libItemPro::after {
          content: '🔒 PRO';
          position: absolute;
          top: 10px; right: 10px;
          padding: 2px 8px;
          background: #0f0f0f;
          color: #fff;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .libItemTop { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .libItemEmoji { font-size: 20px; }
        .libItemName {
          font-size: 13px;
          font-weight: 700;
          color: #0f0f0f;
          flex: 1;
        }
        .libItemFlow {
          font-size: 11px;
          color: #666;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .libItemFoot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
        }
        .libItemRetention {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
        }
        .libRetBar {
          width: 40px;
          height: 4px;
          background: #e5e5e5;
          border-radius: 999px;
          overflow: hidden;
        }
        .libRetFill {
          height: 100%;
          background: linear-gradient(90deg, #16a34a 0%, #eab308 100%);
        }
        .libItemUsage { color: #666; font-weight: 500; }

        /* PROMO */
        .promo {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          border-radius: 14px;
          padding: 24px 28px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }
        .promo::after {
          content: '';
          position: absolute;
          right: -60px; top: -60px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(204,0,0,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .promoLeft { position: relative; z-index: 1; }
        .promoBadge {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(204,0,0,0.2);
          color: #ff6b6b;
          border: 1px solid rgba(204,0,0,0.3);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .promoTitle {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .promoSub { font-size: 12px; color: #aaa; line-height: 1.6; }
        .promoPrice { text-align: right; position: relative; z-index: 1; }
        .promoOriginal { font-size: 12px; color: #666; text-decoration: line-through; }
        .promoCurrent {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 2px 0 10px;
        }
        .promoCurrent span { font-size: 12px; color: #888; font-weight: 500; }
        .promoBtn {
          padding: 10px 22px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
        .promoBtn:hover { background: #a80000; }

        @media (max-width: 1024px) {
          .scenarios { grid-template-columns: 1fr; }
          .statsBar { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .page { padding: 18px 16px 36px; }
          .hero { padding: 22px; }
          .heroTitle { font-size: 22px; }
          .kwForm { flex-direction: column; }
          .kwBtn { width: 100%; padding: 14px; }
          .statsBar { grid-template-columns: 1fr 1fr; gap: 8px; }
          .libGrid { grid-template-columns: 1fr; }
          .promo { flex-direction: column; text-align: center; }
          .promoPrice { text-align: center; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="heroInner">
            <div className="heroTop">
              <span className="heroLabel">
                <span className="livedot" />
                AI ANALYSIS · LIVE
              </span>
              <span className="liveBadge">
                <span className="livedot" />
                현재 <strong style={{ color: '#fff' }}>1,284명</strong>이 분석 중
              </span>
            </div>
            <h1 className="heroTitle">어떤 영상을 만들까요?</h1>
            <p className="heroSub">
              키워드 하나로 AI가 블루오션 시나리오 3개를 즉시 분석합니다
            </p>

            <div className="kwForm">
              <input
                className="kwInput"
                placeholder="예: 2026 금리 전망, AI 도구 추천, 시니어 건강 관리..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                maxLength={50}
              />
              <button className="kwBtn" onClick={handleAnalyze} disabled={!keyword.trim()}>
                ▶ AI 분석 시작
              </button>
            </div>

            <div className="trends">
              <span className="trendLabel">🔥 급상승</span>
              {TREND_KEYWORDS.map((t, i) => (
                <span key={i} className="trendChip" onClick={() => handleTrendClick(t.kw)}>
                  <span className="heatBar"><span className="heatFill" style={{ width: `${t.heat}%` }} /></span>
                  <span>{t.kw}</span>
                  <span style={{ color: '#888' }}>{t.cpm}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="statsBar">
          <div className="statCard">
            <div className="statCardHead">
              <span className="statCardLabel">누적 영상</span>
              <span className="statCardDelta">+23%</span>
            </div>
            <div className="statCardValue">47,892</div>
            <div className="statCardSub">지난 30일 제작</div>
          </div>
          <div className="statCard">
            <div className="statCardHead">
              <span className="statCardLabel">평균 CPM</span>
              <span className="statCardDelta">+8%</span>
            </div>
            <div className="statCardValue">$14.2</div>
            <div className="statCardSub">경쟁 평균 대비 +34%</div>
          </div>
          <div className="statCard">
            <div className="statCardHead">
              <span className="statCardLabel">승인률</span>
              <span className="statCardDelta">+12%</span>
            </div>
            <div className="statCardValue">94.7%</div>
            <div className="statCardSub">YPP 수익화 통과</div>
          </div>
          <div className="statCard">
            <div className="statCardHead">
              <span className="statCardLabel">평균 제작</span>
              <span className="statCardDelta" style={{ background: '#dbeafe', color: '#2563eb' }}>−18%</span>
            </div>
            <div className="statCardValue">6분 42초</div>
            <div className="statCardSub">영상 1편 소요</div>
          </div>
        </section>

        {/* AI 추천 3개 */}
        <section id="ai-section" style={{ marginBottom: 28 }}>
          <div className="sectionHead">
            <div className="sectionTitle">
              <span className="sectionNum">1</span>
              AI 추천 시나리오
              {activeKeyword && (
                <span style={{ fontSize: 13, fontWeight: 500, color: '#888', marginLeft: 6 }}>
                  · "{activeKeyword}"
                </span>
              )}
            </div>
            {activeKeyword && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="rerollHint">매번 다른 시나리오 조합</span>
                <button className="rerollBtn" onClick={handleReroll}>
                  🎲 다른 시나리오 받기{rerollCount > 0 ? ` (${rerollCount})` : ''}
                </button>
              </div>
            )}
          </div>

          {!activeKeyword ? (
            <div className="emptyState">
              <div className="emptyIcon">🎯</div>
              <div className="emptyTitle">키워드를 입력해 AI 분석을 시작하세요</div>
              <div className="emptySub">
                AI가 12가지 시나리오 스타일 중<br />
                키워드에 최적화된 3가지를 추천합니다
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
                  {i === 0 && <div className="bestBadge">⭐ BEST MATCH</div>}
                  <div className="scenarioHead">
                    <div className="scenarioTitle">
                      <span className="scenarioEmoji">{s.emoji}</span>
                      <span>{s.name}</span>
                    </div>
                    <span className={`scenarioGrade ${s.grade === 'A+' ? 'scenarioGradeA' : ''}`}>
                      {s.grade}
                    </span>
                  </div>
                  <div className="scenarioFlow">{s.flow}</div>
                  <div className="scenarioDesc">{s.desc}</div>

                  <div className="scenarioMetrics">
                    <div className="metric">
                      <div className="metricLabel">확신도</div>
                      <div className="metricValue metricValueAccent">{s.confidence}%</div>
                    </div>
                    <div className="metric">
                      <div className="metricLabel">섹션</div>
                      <div className="metricValue">{s.sections}개</div>
                    </div>
                  </div>

                  <div className="gauge">
                    <div className="gaugeHead">
                      <span>예상 시청 유지율</span>
                      <span style={{ fontWeight: 700, color: '#0f0f0f' }}>{s.retentionPredicted}%</span>
                    </div>
                    <div className="gaugeBar">
                      <div className="gaugeFill" style={{ width: `${s.retentionPredicted}%` }} />
                    </div>
                  </div>

                  <div className="gauge">
                    <div className="gaugeHead">
                      <span>예상 조회수</span>
                      <span style={{ fontWeight: 700, color: '#0f0f0f' }}>{s.estimatedViews.toLocaleString()}</span>
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

        {/* STYLE LIBRARY */}
        <section className="libSection">
          <div className="libHead">
            <div className="libTitle">
              <span className="sectionNum">2</span>
              전체 시나리오 라이브러리
            </div>
            <div className="libStats">12가지 스타일 · 6개 무료 · 6개 Pro</div>
          </div>

          {['경제·사회', '정보·분석', '범용'].map((group) => {
            const items = SCENARIOS.filter((s) => s.group === group);
            return (
              <div key={group} className="libGroup">
                <div className="libGroupLabel">{group}</div>
                <div className="libGrid">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className={`libItem ${s.tier === 'pro' ? 'libItemPro' : ''}`}
                      onClick={() => handleStart(s.id)}
                    >
                      <div className="libItemTop">
                        <span className="libItemEmoji">{s.emoji}</span>
                        <span className="libItemName">{s.name}</span>
                      </div>
                      <div className="libItemFlow">{s.flow}</div>
                      <div className="libItemFoot">
                        <div className="libItemRetention">
                          <div className="libRetBar">
                            <div className="libRetFill" style={{ width: `${s.retention}%` }} />
                          </div>
                          <span>{s.retention}%</span>
                        </div>
                        <span className="libItemUsage">
                          {USAGE_STATS[s.id]?.toLocaleString() || 0}회
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* PRO PROMO */}
        <section className="promo">
          <div className="promoLeft">
            <div className="promoBadge">🔥 LIMITED · 출시 특가</div>
            <div className="promoTitle">Pro로 업그레이드하면</div>
            <div className="promoSub">
              ✓ 12가지 전체 시나리오 · ✓ 무제한 영상 제작 · ✓ 경쟁 채널 분석 · ✓ 썸네일 A/B 테스트
            </div>
          </div>
          <div className="promoPrice">
            <div className="promoOriginal">정가 29,000원</div>
            <div className="promoCurrent">9,900<span> 원/월</span></div>
            <button className="promoBtn" onClick={() => alert('업그레이드 기능이 곧 출시됩니다!')}>
              Pro 시작하기 →
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
