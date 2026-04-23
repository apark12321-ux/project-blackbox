'use client';
/**
 * 홈 v6 — 최종 버전
 *
 * Hero에 AlgoMaker 로고 큰 사이즈 노출
 * 한글 기본, 필요한 영문만 유지
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject, AlgoMakerLogo } from './_shared/V11Shell';
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
  { kw: '2026 금리 전망', hot: true },
  { kw: 'AI 영상 자동화', hot: true },
  { kw: '시니어 건강', hot: false },
  { kw: '부동산 전망', hot: false },
  { kw: 'N잡 재테크', hot: false },
];

const AUTO_STEPS = [
  { num: '01', title: '키워드 입력', desc: '주제 한 단어만 알려주세요', time: '10초', color: '#c65f3b' },
  { num: '02', title: 'AI 대본 작성', desc: 'Gemini가 시나리오 구조에 맞춰 대본 생성', time: '1~2분', color: '#d4a545' },
  { num: '03', title: '음성 합성', desc: '한국어 TTS로 자연스러운 내레이션', time: '1분', color: '#7d9b7c' },
  { num: '04', title: '이미지 매칭', desc: '대본에 맞는 고화질 이미지 자동 수집', time: '30초', color: '#6b8cae' },
  { num: '05', title: '영상 완성', desc: 'FFmpeg로 자동 편집 · MP4 다운로드', time: '1~2분', color: '#c65f3b' },
];

const SAMPLE_VIDEOS = [
  { title: '2026 금리 전망, 한눈에 정리', style: '해법 찾기', duration: '8:42', views: '12,847', thumbnail: 'linear-gradient(135deg, #c65f3b 0%, #8a3a1c 100%)', emoji: '📊' },
  { title: 'AI 도구 TOP 5 — 2026 필수 무료 툴', style: '랭킹 역순', duration: '10:15', views: '28,390', thumbnail: 'linear-gradient(135deg, #7d9b7c 0%, #4a6b4a 100%)', emoji: '🤖' },
  { title: '시니어가 꼭 알아야 할 건강 상식', style: '상식 깨기', duration: '7:28', views: '8,152', thumbnail: 'linear-gradient(135deg, #6b8cae 0%, #3a5a7a 100%)', emoji: '💪' },
];

interface RecommendedScenario extends ScenarioStyle {
  sections: number;
}

function pickScenarios(seed: string): RecommendedScenario[] {
  return pickRecommendedScenarios(seed).map((s) => ({ ...s, sections: s.sectionPattern.length }));
}

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [scenarios, setScenarios] = useState<RecommendedScenario[]>([]);
  const [rerollCount, setRerollCount] = useState(0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1384);
  const [showAllLibrary, setShowAllLibrary] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveUsers((u) => Math.max(1200, Math.min(1800, u + Math.floor(Math.random() * 7) - 3)));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_KEYWORDS.length), 2800);
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
      document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
          padding: 0 0 48px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ============ HERO ============ */
        .hero {
          padding: 60px 32px 52px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -100px; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(ellipse at center, rgba(198, 95, 59, 0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .heroLogoWrap {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .heroTagline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #564a3a;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .heroTaglineDot {
          width: 6px; height: 6px;
          background: #7d9b7c;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(125, 155, 124, 0.6);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .heroTitle {
          font-size: 52px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.12;
          color: #2a2419;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .heroTitle .accent {
          color: #c65f3b;
          position: relative;
          display: inline-block;
        }
        .heroTitle .accent::after {
          content: '';
          position: absolute;
          bottom: 6px; left: 0; right: 0;
          height: 12px;
          background: rgba(198, 95, 59, 0.18);
          z-index: -1;
          border-radius: 6px;
        }
        .heroSub {
          font-size: 17px;
          color: #564a3a;
          margin-bottom: 36px;
          font-weight: 500;
          line-height: 1.6;
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .kwForm {
          display: flex;
          gap: 10px;
          max-width: 680px;
          margin: 0 auto 14px;
          position: relative;
          z-index: 1;
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
        .kwInput::placeholder {
          color: #b8ad9b;
          font-weight: 500;
        }
        .kwBtn {
          padding: 0 30px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
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

        .heroMeta {
          font-size: 13px;
          color: #8a7d6a;
          margin-bottom: 22px;
          position: relative;
          z-index: 1;
        }
        .heroMeta strong {
          color: #c65f3b;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .trendRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .trendLabel {
          font-size: 11.5px;
          color: #8a7d6a;
          font-weight: 700;
        }
        .trendChip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 12.5px;
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
        .trendHotMark {
          font-size: 10px;
          padding: 1px 6px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 999px;
          font-weight: 800;
        }

        /* 섹션 공통 */
        .sectionWrap {
          padding: 0 32px;
          margin-bottom: 48px;
        }
        .sectionHead {
          text-align: center;
          margin-bottom: 32px;
        }
        .sectionTag {
          display: inline-block;
          padding: 4px 12px;
          background: #fdf1e7;
          color: #a64a2a;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .sectionTitle {
          font-size: 30px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 10px;
        }
        .sectionSub {
          font-size: 15px;
          color: #8a7d6a;
          font-weight: 500;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* 자동화 5단계 */
        .autoSteps {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          position: relative;
        }
        .autoSteps::before {
          content: '';
          position: absolute;
          top: 40px; left: 10%; right: 10%;
          height: 2px;
          background: linear-gradient(90deg, #fdf1e7, #eaf2ea, #eaf0f5, #fdf1e7);
          z-index: 0;
        }
        .autoStep {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
          padding: 18px 14px;
          text-align: center;
          position: relative;
          z-index: 1;
          transition: all 0.2s;
        }
        .autoStep:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(90, 74, 58, 0.08);
        }
        .stepNum {
          width: 36px; height: 36px;
          margin: 0 auto 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: -0.01em;
          box-shadow: 0 3px 8px rgba(90, 74, 58, 0.15);
        }
        .stepTitle {
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
          margin-bottom: 6px;
        }
        .stepDesc {
          font-size: 11.5px;
          color: #8a7d6a;
          line-height: 1.55;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .stepTime {
          display: inline-block;
          padding: 3px 9px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 700;
          color: #564a3a;
        }
        .totalTime {
          text-align: center;
          margin-top: 24px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border-radius: 12px;
          font-size: 14px;
          color: #564a3a;
          font-weight: 500;
        }
        .totalTime strong {
          color: #a64a2a;
          font-weight: 800;
          font-size: 15px;
        }

        /* 예시 영상 */
        .sampleGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .sampleCard {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s;
          cursor: pointer;
        }
        .sampleCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(90, 74, 58, 0.08);
        }
        .sampleThumb {
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .sampleThumbEmoji {
          font-size: 60px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .sampleDuration {
          position: absolute;
          bottom: 10px; right: 10px;
          padding: 3px 8px;
          background: rgba(42, 36, 25, 0.85);
          color: #fff;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          backdrop-filter: blur(4px);
        }
        .sampleMadeBy {
          position: absolute;
          top: 10px; left: 10px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.95);
          color: #c65f3b;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .sampleBody {
          padding: 16px 18px 18px;
        }
        .sampleTitle {
          font-size: 14.5px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sampleMeta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .sampleStyle {
          padding: 2px 8px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 5px;
          font-size: 10.5px;
          font-weight: 700;
          color: #564a3a;
        }
        .sampleViews strong {
          color: #2a2419;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        /* AD WRAP */
        .adWrap {
          padding: 0 32px;
          margin-bottom: 48px;
        }

        /* LIBRARY */
        .libPanel {
          margin: 0 32px 40px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 20px;
          padding: 32px;
        }
        .libHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .libTitleBlock {
          flex: 1;
          min-width: 240px;
        }
        .libTitle {
          font-size: 22px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 4px;
        }
        .libSub {
          font-size: 13px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .libSub strong {
          color: #c65f3b;
          font-weight: 700;
        }
        .rerollBtn {
          padding: 10px 18px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 999px;
          font-size: 12.5px;
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

        .analyzingBox {
          padding: 48px 24px;
          text-align: center;
          background: linear-gradient(180deg, #fdf1e7 0%, #faf8f4 100%);
          border-radius: 14px;
          margin-bottom: 24px;
        }
        .analyzingIcon {
          display: inline-block;
          font-size: 38px;
          animation: spin 1.2s linear infinite;
          margin-bottom: 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .analyzingTitle {
          font-size: 17px;
          font-weight: 800;
          color: #2a2419;
          margin-bottom: 6px;
        }
        .analyzingSub {
          font-size: 13px;
          color: #8a7d6a;
        }

        .aiSection {
          padding: 20px;
          background: linear-gradient(180deg, #fdf1e7 0%, #faf8f4 100%);
          border: 2px solid rgba(198, 95, 59, 0.15);
          border-radius: 14px;
          margin-bottom: 24px;
        }
        .aiHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
        }
        .aiHeadBadge {
          padding: 3px 9px;
          background: #c65f3b;
          color: #fff;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .aiHead strong {
          color: #c65f3b;
          font-weight: 800;
        }

        .aiScenGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .aiScen {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.18s;
          position: relative;
        }
        .aiScen:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(90, 74, 58, 0.08);
        }
        .aiScenBest {
          border: 2px solid #c65f3b;
          background: linear-gradient(180deg, #fdf1e7 0%, #fff 40%);
        }
        .aiScenBestBadge {
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
        .aiScenHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .aiScenEmoji { font-size: 22px; }
        .aiScenName {
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
        }
        .aiScenFlow {
          font-size: 11.5px;
          color: #564a3a;
          line-height: 1.55;
          padding: 8px 10px;
          background: #fafafa;
          border-radius: 7px;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .aiScenStats {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .aiScenRet {
          color: #5e7e5d;
          font-weight: 700;
        }
        .aiScenBtn {
          width: 100%;
          padding: 10px;
          background: #faf8f4;
          color: #2a2419;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 9px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: -0.01em;
        }
        .aiScenBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }
        .aiScenBtnBest {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }
        .aiScenBtnBest:hover {
          background: #a64a2a;
          color: #fff;
        }

        .libGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .libItem {
          padding: 14px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 11px;
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
          margin-bottom: 7px;
        }
        .libItemEmoji { font-size: 19px; flex-shrink: 0; }
        .libItemName {
          font-size: 13px;
          font-weight: 800;
          color: #2a2419;
          flex: 1;
          letter-spacing: -0.015em;
        }
        .libItemFlow {
          font-size: 11px;
          color: #564a3a;
          line-height: 1.55;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .libItemFoot {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .libItemRet { color: #5e7e5d; font-weight: 700; }

        @media (max-width: 1024px) {
          .autoSteps::before { display: none; }
          .sampleGrid { grid-template-columns: repeat(2, 1fr); }
          .aiScenGrid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .hero { padding: 40px 20px 36px; }
          .heroTitle { font-size: 32px; }
          .heroSub { font-size: 15px; }
          .kwForm { flex-direction: column; }
          .kwBtn { width: 100%; padding: 14px; }
          .sectionTitle { font-size: 24px; }
          .sectionWrap, .adWrap { padding: 0 16px; }
          .libPanel { margin: 0 16px 32px; padding: 24px 20px; }
          .autoSteps { grid-template-columns: 1fr; gap: 8px; }
          .sampleGrid { grid-template-columns: 1fr; }
          .libGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          {/* 큰 로고 */}
          <div className="heroLogoWrap">
            <AlgoMakerLogo size="lg" showSubtitle={false} />
          </div>

          <div className="heroTagline">
            <span className="heroTaglineDot" />
            <span>AI 유튜브 영상 자동화 스튜디오</span>
          </div>

          <h1 className="heroTitle">
            키워드 하나면,<br />
            유튜브 영상이 <span className="accent">완성</span>돼요
          </h1>
          <p className="heroSub">
            주제만 알려주세요. AI가 대본·음성·이미지·편집까지 알아서 만들어 5분 안에 MP4로 드려요.
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
              {analyzing ? '분석 중...' : '영상 만들기 →'}
            </button>
          </div>

          <div className="heroMeta">
            지금 <strong>{activeUsers.toLocaleString()}</strong>명이 AlgoMaker로 영상을 만들고 있어요
          </div>

          <div className="trendRow">
            <span className="trendLabel">🔥 인기 키워드:</span>
            {TRENDING.map((t, i) => (
              <span key={i} className="trendChip" onClick={() => handleTrendClick(t.kw)}>
                <span>{t.kw}</span>
                {t.hot && <span className="trendHotMark">인기</span>}
              </span>
            ))}
          </div>
        </section>

        {/* 자동화 5단계 */}
        <section className="sectionWrap">
          <div className="sectionHead">
            <span className="sectionTag">자동화 프로세스</span>
            <h2 className="sectionTitle">
              AI가 이 5단계를 <span style={{ color: '#c65f3b' }}>자동으로</span> 처리해요
            </h2>
            <p className="sectionSub">
              여러분은 키워드만 입력하면 끝. 나머지는 AlgoMaker가 다 알아서 해요.
            </p>
          </div>

          <div className="autoSteps">
            {AUTO_STEPS.map((step, i) => (
              <div key={i} className="autoStep">
                <div className="stepNum" style={{ background: step.color }}>
                  {step.num}
                </div>
                <div className="stepTitle">{step.title}</div>
                <div className="stepDesc">{step.desc}</div>
                <div className="stepTime">⏱ {step.time}</div>
              </div>
            ))}
          </div>

          <div className="totalTime">
            전체 소요 시간 약 <strong>5분</strong> · 여러분이 할 일은 <strong>10초 키워드 입력</strong>뿐이에요
          </div>
        </section>

        {/* 예시 영상 */}
        <section className="sectionWrap">
          <div className="sectionHead">
            <span className="sectionTag">실제 결과물</span>
            <h2 className="sectionTitle">
              이런 영상들을 <span style={{ color: '#c65f3b' }}>만들어드렸어요</span>
            </h2>
            <p className="sectionSub">
              AlgoMaker로 자동 생성한 실제 샘플 영상이에요.
            </p>
          </div>

          <div className="sampleGrid">
            {SAMPLE_VIDEOS.map((v, i) => (
              <div key={i} className="sampleCard">
                <div className="sampleThumb" style={{ background: v.thumbnail }}>
                  <span className="sampleMadeBy">⚡ Made by AlgoMaker</span>
                  <span className="sampleThumbEmoji">{v.emoji}</span>
                  <span className="sampleDuration">{v.duration}</span>
                </div>
                <div className="sampleBody">
                  <div className="sampleTitle">{v.title}</div>
                  <div className="sampleMeta">
                    <span className="sampleStyle">{v.style}</span>
                    <span className="sampleViews">조회수 <strong>{v.views}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 광고 #1 */}
        <div className="adWrap">
          <AdSlot slot="home-top" variant="horizontal" />
        </div>

        {/* 시나리오 라이브러리 */}
        <section id="ai-section" className="libPanel">
          <div className="libHead">
            <div className="libTitleBlock">
              <div className="libTitle">
                {activeKeyword ? `"${activeKeyword}" AI 추천` : '시나리오 스타일 고르기'}
              </div>
              <div className="libSub">
                {activeKeyword
                  ? <>AI가 고른 최적의 <strong>3가지 스타일</strong>을 보여드려요</>
                  : <>전체 <strong>{SCENARIOS.length}가지</strong> 스타일 중 원하는 걸 선택하세요</>
                }
              </div>
            </div>
            {activeKeyword && !analyzing && (
              <button className="rerollBtn" onClick={handleReroll}>
                🎲 다시 추천{rerollCount > 0 ? ` · ${rerollCount}` : ''}
              </button>
            )}
          </div>

          {analyzing ? (
            <div className="analyzingBox">
              <div className="analyzingIcon">⚙️</div>
              <div className="analyzingTitle">"{activeKeyword}" 분석 중이에요</div>
              <div className="analyzingSub">12가지 스타일 중 가장 잘 맞는 3가지를 고르고 있어요</div>
            </div>
          ) : activeKeyword && scenarios.length > 0 ? (
            <div className="aiSection">
              <div className="aiHead">
                <span className="aiHeadBadge">AI 추천</span>
                <span>키워드 <strong>"{activeKeyword}"</strong>에 가장 잘 맞는 3가지 스타일</span>
              </div>
              <div className="aiScenGrid">
                {scenarios.map((s, i) => (
                  <div
                    key={`${s.id}-${rerollCount}-${i}`}
                    className={`aiScen ${i === 0 ? 'aiScenBest' : ''}`}
                    onClick={() => handleStart(s.id)}
                  >
                    {i === 0 && <div className="aiScenBestBadge">⭐ 최고 추천</div>}
                    <div className="aiScenHead">
                      <span className="aiScenEmoji">{s.emoji}</span>
                      <span className="aiScenName">{s.name}</span>
                    </div>
                    <div className="aiScenFlow">{s.flow}</div>
                    <div className="aiScenStats">
                      <span>섹션 {s.sections}단</span>
                      <span className="aiScenRet">유지율 {s.retention}%</span>
                    </div>
                    <button
                      className={`aiScenBtn ${i === 0 ? 'aiScenBtnBest' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleStart(s.id); }}
                    >
                      {i === 0 ? '이 스타일로 만들기 →' : '이 스타일로 만들기'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {(!activeKeyword || showAllLibrary) && (
            <>
              {['경제·사회', '정보·분석', '범용'].map((group) => {
                const items = SCENARIOS.filter((s) => s.group === group);
                return (
                  <div key={group} style={{ marginBottom: 22 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      paddingBottom: 10,
                      marginBottom: 12,
                      borderBottom: '1px solid rgba(90, 74, 58, 0.08)',
                    }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#2a2419',
                        letterSpacing: '-0.015em',
                      }}>{group}</span>
                      <span style={{
                        fontSize: 11,
                        color: '#8a7d6a',
                        fontWeight: 600,
                      }}>{items.length}가지</span>
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
            </>
          )}

          {activeKeyword && !analyzing && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={() => setShowAllLibrary(!showAllLibrary)}
                style={{
                  padding: '10px 22px',
                  background: 'transparent',
                  border: '1px solid rgba(90, 74, 58, 0.15)',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#564a3a',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {showAllLibrary ? '전체 라이브러리 접기 ↑' : '전체 12가지 스타일 모두 보기 ↓'}
              </button>
            </div>
          )}
        </section>

        {/* 광고 #2 */}
        <div className="adWrap">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
