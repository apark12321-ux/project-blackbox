'use client';
/**
 * Step 2: 키워드 입력 (+ 카테고리별 추천)
 *
 * 카테고리 선택 후 → 키워드 입력 → 시나리오 선택 (Step 3)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, getProject, setProject } from '../_shared/V11Shell';
import { getCategoryById, CATEGORIES } from '../_shared/platforms';
import { SCENARIOS, pickRecommendedScenarios, getScenarioById, type ScenarioStyle } from '../_shared/scenarios';
import AdSlot from '../_shared/AdSlot';

const TRENDING_BY_CATEGORY: { [key: string]: Array<{ kw: string; level: string }> } = {
  economy: [
    { kw: '2026 금리 전망', level: '경쟁 낮음' },
    { kw: 'N잡 재테크', level: '블루오션' },
    { kw: 'AI 주식 투자', level: '트렌드' },
    { kw: '부동산 전망', level: '인기' },
  ],
  health: [
    { kw: '시니어 건강 관리', level: '블루오션' },
    { kw: '2026 건강보험', level: '경쟁 낮음' },
    { kw: '다이어트 식단', level: '인기' },
    { kw: '면역력 강화법', level: '트렌드' },
  ],
  it: [
    { kw: '2026 AI 도구', level: '트렌드' },
    { kw: 'ChatGPT 활용법', level: '인기' },
    { kw: '개발자 학습 로드맵', level: '블루오션' },
    { kw: '스마트폰 꿀팁', level: '경쟁 낮음' },
  ],
  education: [
    { kw: '독서법', level: '경쟁 낮음' },
    { kw: '집중력 높이는 법', level: '블루오션' },
    { kw: '아침 루틴', level: '인기' },
    { kw: '시간관리', level: '트렌드' },
  ],
  food: [
    { kw: '10분 레시피', level: '인기' },
    { kw: '다이어트 도시락', level: '트렌드' },
    { kw: '홈파티 요리', level: '블루오션' },
    { kw: '1인 가구 간편식', level: '경쟁 낮음' },
  ],
  social: [
    { kw: '2026 최저임금', level: '트렌드' },
    { kw: '청년 복지 정책', level: '블루오션' },
    { kw: '시사 이슈 정리', level: '인기' },
    { kw: '정책 변경사항', level: '경쟁 낮음' },
  ],
  realestate: [
    { kw: '2026 부동산 전망', level: '인기' },
    { kw: '청약 당첨 전략', level: '트렌드' },
    { kw: '자취방 꾸미기', level: '블루오션' },
    { kw: '인테리어 아이디어', level: '경쟁 낮음' },
  ],
  game: [
    { kw: '2026 무료 게임', level: '인기' },
    { kw: '게임 추천 TOP', level: '트렌드' },
    { kw: '인디 게임 리뷰', level: '블루오션' },
    { kw: 'e스포츠 소식', level: '경쟁 낮음' },
  ],
};

interface RecommendedScenario extends ScenarioStyle {
  sections: number;
}

function pickScenarios(seed: string): RecommendedScenario[] {
  return pickRecommendedScenarios(seed).map((s) => ({ ...s, sections: s.sectionPattern.length }));
}

export default function KeywordPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [scenarios, setScenarios] = useState<RecommendedScenario[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [rerollCount, setRerollCount] = useState(0);
  const [showAllScenarios, setShowAllScenarios] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const project = getProject();
    if (!project.category) {
      router.push('/');
      return;
    }
    setCategory(project.category);
  }, [router]);

  const currentCategory = getCategoryById(category);
  const trending = TRENDING_BY_CATEGORY[category] || [];

  const handleAnalyze = () => {
    if (!keyword.trim()) return;
    setActiveKeyword(keyword);
    setAnalyzing(true);
    setTimeout(() => {
      setScenarios(pickScenarios(keyword + Date.now()));
      setRerollCount(0);
      setAnalyzing(false);
      document.getElementById('scenarios-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      document.getElementById('scenarios-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  };

  const handleReroll = () => {
    if (!activeKeyword) return;
    setScenarios(pickScenarios(activeKeyword + '_' + (rerollCount + 1) + '_' + Date.now()));
    setRerollCount((r) => r + 1);
  };

  const handleStartScenario = (scenarioId: string) => {
    setProject({
      category,
      keyword: activeKeyword,
      scenarioStyleId: scenarioId,
      templateId: scenarioId,
      step: 3,
    });
    router.push('/platform');
  };

  const levelColor = (level: string) => {
    if (level === '블루오션') return { bg: '#eaf2ea', color: '#5e7e5d' };
    if (level === '경쟁 낮음') return { bg: '#eaf0f5', color: '#5a7a99' };
    if (level === '트렌드') return { bg: '#fbf3df', color: '#a67e1e' };
    return { bg: '#fdf1e7', color: '#c65f3b' };
  };

  if (!currentCategory) return null;

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 24px 48px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .breadcrumb a { color: #8a7d6a; transition: color 0.15s; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #b8ad9b; }

        .hero {
          text-align: center;
          margin-bottom: 36px;
        }
        .stepBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          color: #a64a2a;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .catChip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          color: #2a2419;
          margin-bottom: 20px;
        }
        .catChip .change {
          margin-left: 4px;
          color: #8a7d6a;
          font-weight: 500;
          font-size: 11px;
          cursor: pointer;
        }
        .catChip .change:hover { color: #c65f3b; }

        .heroTitle {
          font-size: 38px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 15px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
        }

        /* 추천 키워드 */
        .trendingSection {
          margin-bottom: 32px;
        }
        .trendingLabel {
          font-size: 13px;
          color: #8a7d6a;
          font-weight: 700;
          margin-bottom: 12px;
          text-align: center;
        }
        .trendingLabel strong {
          color: #c65f3b;
        }
        .trendingGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .trendChip {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
        }
        .trendChip:hover {
          background: #fdf1e7;
          border-color: rgba(198, 95, 59, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(198, 95, 59, 0.1);
        }
        .trendLevel {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .trendKw {
          font-size: 13.5px;
          font-weight: 700;
          color: #2a2419;
          letter-spacing: -0.015em;
          line-height: 1.3;
        }

        /* 직접 입력 */
        .inputSection {
          margin-bottom: 24px;
        }
        .inputLabel {
          font-size: 13px;
          color: #8a7d6a;
          font-weight: 700;
          margin-bottom: 10px;
          text-align: center;
        }
        .kwForm {
          display: flex;
          gap: 10px;
        }
        .kwInputWrap { flex: 1; position: relative; }
        .kwIcon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          pointer-events: none;
          opacity: 0.55;
        }
        .kwInput {
          width: 100%;
          padding: 18px 20px 18px 52px;
          background: #fff;
          border: 2px solid rgba(90, 74, 58, 0.1);
          border-radius: 14px;
          font-size: 16px;
          color: #2a2419;
          font-family: inherit;
          transition: all 0.18s;
          font-weight: 500;
          letter-spacing: -0.01em;
          box-shadow: 0 2px 8px rgba(90, 74, 58, 0.04);
        }
        .kwInput:focus {
          outline: none;
          border-color: #c65f3b;
          box-shadow: 0 0 0 4px rgba(198, 95, 59, 0.1), 0 2px 12px rgba(198, 95, 59, 0.1);
        }
        .kwBtn {
          padding: 0 28px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 4px 14px rgba(198, 95, 59, 0.3);
        }
        .kwBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(198, 95, 59, 0.4);
        }
        .kwBtn:disabled {
          background: #ece6db;
          color: #b8ad9b;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* 시나리오 섹션 */
        .scenariosSection {
          margin-top: 36px;
          padding: 28px;
          background: #faf8f4;
          border-radius: 18px;
        }
        .scenHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .scenTitle {
          font-size: 19px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
        }
        .scenSub {
          font-size: 12.5px;
          color: #8a7d6a;
          font-weight: 500;
          margin-top: 2px;
        }
        .scenSub strong { color: #c65f3b; font-weight: 700; }

        .rerollBtn {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          color: #564a3a;
          font-family: inherit;
          letter-spacing: -0.01em;
        }
        .rerollBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }

        .analyzingBox {
          padding: 40px 24px;
          text-align: center;
          background: linear-gradient(180deg, #fdf1e7 0%, #faf8f4 100%);
          border-radius: 14px;
        }
        .analyzingIcon {
          display: inline-block;
          font-size: 34px;
          animation: spin 1.2s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .analyzingText {
          font-size: 14px;
          font-weight: 700;
          color: #2a2419;
        }

        .scenGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .scenCard {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.18s;
          position: relative;
        }
        .scenCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(90, 74, 58, 0.08);
        }
        .scenCardBest {
          border: 2px solid #c65f3b;
          background: linear-gradient(180deg, #fdf1e7 0%, #fff 40%);
        }
        .bestBadge {
          position: absolute;
          top: -10px; left: 14px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(198, 95, 59, 0.3);
          letter-spacing: -0.01em;
        }
        .scenEmoji { font-size: 26px; margin-bottom: 10px; }
        .scenName {
          font-size: 15px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .scenFlow {
          font-size: 11.5px;
          color: #564a3a;
          line-height: 1.6;
          padding: 8px 10px;
          background: #faf8f4;
          border-radius: 7px;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .scenStats {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .scenRet { color: #5e7e5d; font-weight: 700; }
        .scenBtn {
          width: 100%;
          padding: 10px;
          background: #faf8f4;
          color: #2a2419;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: -0.01em;
        }
        .scenBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }
        .scenBtnBest {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }
        .scenBtnBest:hover {
          background: #a64a2a;
          color: #fff;
        }

        .adWrap { margin: 32px 0; }

        @media (max-width: 768px) {
          .page { padding: 24px 16px 40px; }
          .heroTitle { font-size: 28px; }
          .trendingGrid { grid-template-columns: repeat(2, 1fr); }
          .kwForm { flex-direction: column; }
          .kwBtn { padding: 14px; width: 100%; }
          .scenGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>키워드 입력</span>
        </nav>

        <section className="hero">
          <div className="stepBadge">⚠️ STEP 2 · 키워드 해독</div>
          <Link href="/" className="catChip" style={{textDecoration: 'none'}}>
            <span>{currentCategory.emoji}</span>
            <span>{currentCategory.name}</span>
            <span className="change">변경 →</span>
          </Link>
          <h1 className="heroTitle">
            한 단어가<br />
            <span className="accent">운명을 가릅니다.</span>
          </h1>
          <p className="heroSub">
            잘못된 키워드 = 영상 묻힘.<br />
            <strong>알고리즘이 그 안의 신호를 해독합니다.</strong>
          </p>
        </section>

        {/* 추천 키워드 */}
        <section className="trendingSection">
          <div className="trendingLabel">
            🔮 <strong>{currentCategory.name}</strong> · 알고리즘이 감지한 신호
          </div>
          <div className="trendingGrid">
            {trending.map((t, i) => {
              const colors = levelColor(t.level);
              return (
                <button
                  key={i}
                  className="trendChip"
                  onClick={() => handleTrendClick(t.kw)}
                >
                  <span
                    className="trendLevel"
                    style={{ background: colors.bg, color: colors.color }}
                  >
                    {t.level}
                  </span>
                  <div className="trendKw">{t.kw}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 직접 입력 */}
        <section className="inputSection">
          <div className="inputLabel">또는 직접 입력하세요</div>
          <div className="kwForm">
            <div className="kwInputWrap">
              <span className="kwIcon">🔍</span>
              <input
                ref={inputRef}
                className="kwInput"
                placeholder="예: 2026 신년 재테크 꿀팁"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                maxLength={50}
              />
            </div>
            <button
              className="kwBtn"
              onClick={handleAnalyze}
              disabled={!keyword.trim() || analyzing}
            >
              {analyzing ? '분석 중...' : '분석 시작 →'}
            </button>
          </div>
        </section>

        {/* 시나리오 섹션 */}
        {(activeKeyword || analyzing) && (
          <section id="scenarios-section" className="scenariosSection">
            <div className="scenHead">
              <div>
                <div className="scenTitle">"{activeKeyword}" AI 추천</div>
                <div className="scenSub">
                  AI가 고른 <strong>최적의 3가지 스타일</strong>을 보여드려요
                </div>
              </div>
              {!analyzing && (
                <button className="rerollBtn" onClick={handleReroll}>
                  🎲 다시 추천{rerollCount > 0 ? ` · ${rerollCount}` : ''}
                </button>
              )}
            </div>

            {analyzing ? (
              <div className="analyzingBox">
                <div className="analyzingIcon">⚙️</div>
                <div className="analyzingText">"{activeKeyword}" 분석 중...</div>
              </div>
            ) : (
              <div className="scenGrid">
                {scenarios.map((s, i) => (
                  <div
                    key={`${s.id}-${rerollCount}-${i}`}
                    className={`scenCard ${i === 0 ? 'scenCardBest' : ''}`}
                    onClick={() => handleStartScenario(s.id)}
                  >
                    {i === 0 && <div className="bestBadge">⭐ 최고 추천</div>}
                    <div className="scenEmoji">{s.emoji}</div>
                    <div className="scenName">{s.name}</div>
                    <div className="scenFlow">{s.flow}</div>
                    <div className="scenStats">
                      <span>섹션 {s.sections}단</span>
                      <span className="scenRet">유지율 {s.retention}%</span>
                    </div>
                    <button
                      className={`scenBtn ${i === 0 ? 'scenBtnBest' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleStartScenario(s.id); }}
                    >
                      {i === 0 ? '이 스타일로 →' : '이 스타일로'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="adWrap">
          <AdSlot slot="keyword-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
