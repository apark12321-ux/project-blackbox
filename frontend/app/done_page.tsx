'use client';
/**
 * 결과 페이지 (/done) — v4 완전 재작성
 *
 * 변경사항:
 * ✅ 영상 미리보기/다운로드 완전 제거
 * ✅ SNS 플랫폼별 업로드 화면 목업
 * ✅ 시나리오 기반 이미지 프롬프트 자동 생성
 * ✅ Algo-Magic Booster 유지
 */

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DashboardShell, getProject } from '../_shared/V11Shell';
import { getPlatformById, getCategoryById, PLATFORMS } from '../_shared/platforms';
import { generateImagePrompts, type ImagePromptSet } from '../_shared/imagePrompts';
import AlgoBooster, { BoosterData } from '../_shared/AlgoBooster';
import AdSlot from '../_shared/AdSlot';

type TabKey = 'upload' | 'images' | 'script';

export default function DonePage() {
  const [keyword, setKeyword] = useState('영상');
  const [category, setCategory] = useState('');
  const [scenarioId, setScenarioId] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('upload');
  const [activePlatform, setActivePlatform] = useState<string>('');
  const [activeStyleIdx, setActiveStyleIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string>('');

  useEffect(() => {
    const project = getProject();
    if (project.keyword) setKeyword(project.keyword);
    if (project.category) setCategory(project.category);
    if (project.scenarioStyleId) setScenarioId(project.scenarioStyleId);

    if (typeof window !== 'undefined') {
      try {
        const platforms = localStorage.getItem('v11_platforms');
        if (platforms) {
          const arr = JSON.parse(platforms);
          setSelectedPlatforms(arr);
          if (arr[0]) setActivePlatform(arr[0]);
        }
      } catch {}
    }
  }, []);

  const currentCategory = getCategoryById(category);
  const platforms = selectedPlatforms.map((id) => getPlatformById(id)).filter(Boolean);
  const currentPlatform = platforms.find((p) => p?.id === activePlatform) || platforms[0];

  // Algo-Magic Booster 데이터
  const initialData: BoosterData = {
    title: `${keyword} 2026년 달라지는 점`,
    grade: 'B+',
    retention: 42,
    ctr: 4.2,
  };

  const optimizedData: BoosterData = {
    title: `⚠️ 2026 ${keyword}, 이 3가지 모르면 매달 30만원 손해봅니다`,
    grade: 'A++',
    retention: 78,
    ctr: 8.7,
  };

  const [displayTitle, setDisplayTitle] = useState(initialData.title);

  useEffect(() => {
    setDisplayTitle(applied ? optimizedData.title : initialData.title);
  }, [applied]);

  // 이미지 프롬프트 세트 생성
  const promptSets: ImagePromptSet[] = generateImagePrompts(
    keyword,
    category || 'economy',
    scenarioId || 'default',
    selectedPlatforms.length ? selectedPlatforms : ['youtube-long']
  );

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1500);
    }
  };

  const getPlatformHashtags = (platformId: string) => {
    const baseTags = [`#${keyword.replace(/\s+/g, '')}`, '#2026', `#${currentCategory?.name.split('·')[0] || '경제'}`];
    const platformSpecific: { [key: string]: string[] } = {
      'youtube-long': [...baseTags, '#꿀팁', '#정보'],
      'youtube-shorts': ['#Shorts', ...baseTags, '#꿀팁'],
      'tiktok': ['#fyp', ...baseTags, '#추천'],
      'instagram-reels': [...baseTags, '#인스타그램', '#릴스', '#저장필수'],
    };
    return platformSpecific[platformId] || baseTags;
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        .pageHead {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(90, 74, 58, 0.08);
        }
        .stepBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: #eaf2ea;
          color: #5e7e5d;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .stepDot {
          width: 6px; height: 6px;
          background: #5e7e5d;
          border-radius: 50%;
        }
        .pageTitle {
          font-size: 32px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 10px;
        }
        .pageTitle .accent { color: #c65f3b; }
        .pageSub {
          font-size: 14px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
          max-width: 580px;
          margin: 0 auto;
        }

        /* 프로젝트 요약 */
        .summary {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 14px;
        }
        .summaryItem {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .summaryLabel {
          font-size: 10px;
          color: #8a7d6a;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .summaryValue {
          font-size: 13px;
          color: #2a2419;
          font-weight: 700;
          letter-spacing: -0.015em;
        }

        /* 안내 배너 */
        .guideBanner {
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border: 1px dashed rgba(198, 95, 59, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .guideIcon { font-size: 24px; flex-shrink: 0; }
        .guideText {
          flex: 1;
          font-size: 12.5px;
          color: #564a3a;
          line-height: 1.55;
          font-weight: 500;
        }
        .guideText strong { color: #a64a2a; font-weight: 800; }

        /* Algo-Magic Booster Wrap */
        .boosterWrap {
          margin-bottom: 28px;
        }

        /* 탭 네비게이션 */
        .tabBar {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          padding: 6px;
          background: #faf8f4;
          border-radius: 12px;
          border: 1px solid rgba(90, 74, 58, 0.06);
        }
        .tabBtn {
          flex: 1;
          padding: 12px 14px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #8a7d6a;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .tabBtn:hover {
          color: #2a2419;
          background: #fff;
        }
        .tabBtn.active {
          background: #fff;
          color: #c65f3b;
          box-shadow: 0 2px 8px rgba(90, 74, 58, 0.08);
        }

        /* 플랫폼 스위처 */
        .platformSwitcher {
          display: flex;
          gap: 8px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .platformTab {
          padding: 10px 16px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #564a3a;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .platformTab:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }
        .platformTab.active {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        /* SNS 업로드 목업 */
        .uploadMockup {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 14px;
          overflow: hidden;
        }
        .mockupHeader {
          padding: 14px 20px;
          background: linear-gradient(180deg, #f5f1ea 0%, #faf8f4 100%);
          border-bottom: 1px solid rgba(90, 74, 58, 0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mockupEmoji { font-size: 22px; }
        .mockupPlatformName {
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
        }
        .mockupLabel {
          margin-left: auto;
          padding: 3px 10px;
          background: rgba(198, 95, 59, 0.1);
          color: #a64a2a;
          border-radius: 5px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .mockupBody {
          padding: 22px 24px;
        }
        .mockupField {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px dashed rgba(90, 74, 58, 0.1);
        }
        .mockupField:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .mockupFieldHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
        }
        .mockupFieldLabel {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mockupFieldIcon { font-size: 14px; }
        .mockupFieldName {
          font-size: 11px;
          font-weight: 800;
          color: #8a7d6a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .copyBtn {
          padding: 4px 10px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.12);
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 700;
          color: #564a3a;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copyBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }
        .copyBtn.copied {
          background: #eaf2ea;
          border-color: #7d9b7c;
          color: #5e7e5d;
        }

        .mockupFieldValue {
          font-size: 14px;
          color: #2a2419;
          line-height: 1.6;
          font-weight: 500;
          word-break: break-word;
          padding: 8px 12px;
          background: #faf8f4;
          border-radius: 8px;
        }
        .mockupFieldValue.title {
          font-size: 16px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.02em;
        }
        .mockupFieldValue.hashtags {
          color: #5a7a99;
          font-weight: 600;
        }
        .mockupFieldValue.description {
          white-space: pre-wrap;
          max-height: 140px;
          overflow-y: auto;
        }

        .mockupThumbnail {
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #3a332a 0%, #2a2419 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245, 241, 234, 0.5);
          font-size: 13px;
          font-weight: 700;
          position: relative;
          overflow: hidden;
          margin-top: 4px;
        }
        .mockupThumbnail.vertical {
          aspect-ratio: 9 / 16;
          max-width: 280px;
          margin: 4px auto 0;
        }
        .mockupThumbnail::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 30% 30%, rgba(198, 95, 59, 0.15) 0%, transparent 60%);
        }
        .mockupThumbnailText {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 20px;
        }
        .mockupThumbnailText strong {
          display: block;
          color: #f5a26b;
          font-size: 18px;
          margin-top: 4px;
          letter-spacing: -0.02em;
        }

        /* 이미지 프롬프트 */
        .promptStyleTabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 18px;
        }
        .promptStyleTab {
          padding: 14px 12px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 10px;
          cursor: pointer;
          text-align: center;
          transition: all 0.18s;
        }
        .promptStyleTab:hover {
          transform: translateY(-2px);
          border-color: #c65f3b;
        }
        .promptStyleTab.active {
          background: #fdf1e7;
          border: 2px solid #c65f3b;
        }
        .promptStyleEmoji {
          font-size: 22px;
          margin-bottom: 4px;
        }
        .promptStyleName {
          font-size: 12px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
          margin-bottom: 2px;
        }
        .promptStyleDesc {
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 500;
          line-height: 1.35;
        }

        .promptToolInfo {
          padding: 12px 16px;
          background: #eaf0f5;
          border-radius: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .promptToolIcon { font-size: 18px; }
        .promptToolText {
          flex: 1;
          font-size: 12.5px;
          color: #3a5a7a;
          font-weight: 600;
          line-height: 1.5;
        }
        .promptToolText strong {
          color: #2a2419;
          font-weight: 800;
        }

        .promptList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .promptCard {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 12px;
          padding: 16px 18px;
        }
        .promptCardHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .promptPurpose {
          font-size: 12.5px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
        }
        .promptAspect {
          padding: 2px 8px;
          background: #fdf1e7;
          color: #a64a2a;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
        }
        .promptText {
          padding: 10px 12px;
          background: #faf8f4;
          border-radius: 8px;
          font-size: 12px;
          color: #2a2419;
          line-height: 1.65;
          font-family: 'Consolas', 'Monaco', monospace;
          word-break: break-word;
          font-weight: 500;
        }
        .promptNegative {
          margin-top: 8px;
          padding: 8px 12px;
          background: #fce8e8;
          border-radius: 8px;
          font-size: 11px;
          color: #a32d2d;
          font-family: 'Consolas', 'Monaco', monospace;
          font-weight: 500;
        }
        .promptNegative strong {
          color: #791f1f;
          font-weight: 700;
        }
        .promptActions {
          display: flex;
          gap: 6px;
          margin-top: 10px;
        }

        /* 이미지 툴 추천 */
        .toolLinks {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 18px;
        }
        .toolLink {
          padding: 14px 18px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .toolLink:hover {
          background: #fdf1e7;
          border-color: #c65f3b;
          transform: translateY(-1px);
        }
        .toolEmoji { font-size: 24px; }
        .toolName {
          font-size: 13px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
        }
        .toolUrl {
          font-size: 11px;
          color: #8a7d6a;
          font-weight: 500;
        }

        /* 대본 */
        .scriptCard {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 14px;
          padding: 24px 28px;
        }
        .scriptNotice {
          padding: 12px 16px;
          background: #fbf3df;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 12.5px;
          color: #8a6a1a;
          font-weight: 600;
          line-height: 1.55;
        }
        .scriptSection {
          margin-bottom: 18px;
          padding-bottom: 18px;
          border-bottom: 1px dashed rgba(90, 74, 58, 0.1);
        }
        .scriptSection:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .scriptSectionTitle {
          font-size: 13px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.015em;
          margin-bottom: 8px;
        }
        .scriptSectionBody {
          font-size: 14px;
          color: #2a2419;
          line-height: 1.75;
          font-weight: 500;
        }

        .nextSteps {
          margin-top: 36px;
          padding: 24px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 14px;
        }
        .nextStepsTitle {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .nextStepsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .nextStepCard {
          padding: 16px 18px;
          background: #faf8f4;
          border-radius: 10px;
          border: 1px solid rgba(90, 74, 58, 0.06);
          transition: all 0.18s;
          text-decoration: none;
        }
        .nextStepCard:hover {
          transform: translateY(-2px);
          border-color: rgba(198, 95, 59, 0.25);
        }
        .nextStepIcon { font-size: 20px; margin-bottom: 6px; }
        .nextStepTitle {
          font-size: 13px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
          margin-bottom: 3px;
        }
        .nextStepDesc {
          font-size: 11.5px;
          color: #8a7d6a;
          line-height: 1.5;
          font-weight: 500;
        }

        .adWrap { margin: 28px 0; }

        @media (max-width: 900px) {
          .summary { grid-template-columns: 1fr 1fr; }
          .promptStyleTabs { grid-template-columns: 1fr 1fr; }
          .toolLinks { grid-template-columns: 1fr; }
          .nextStepsGrid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .page { padding: 20px 14px 40px; }
          .pageTitle { font-size: 24px; }
          .summary { grid-template-columns: 1fr; gap: 10px; }
          .tabBar { flex-direction: column; }
          .tabBtn { padding: 10px; }
        }
      `}</style>

      <div className="page">
        <header className="pageHead">
          <div className="stepBadge">
            <span className="stepDot" />
            STEP 6 / 6 · 업로드 자료 완성
          </div>
          <h1 className="pageTitle">
            업로드 자료가 <span className="accent">준비됐어요!</span>
          </h1>
          <p className="pageSub">
            선택한 SNS 플랫폼별로 <strong style={{color: '#c65f3b'}}>업로드 화면 그대로</strong> 보여드려요.
            제목·설명·태그·이미지 프롬프트까지 전부 복사해서 바로 사용하세요.
          </p>
        </header>

        {/* 요약 */}
        <section className="summary">
          <div className="summaryItem">
            <span className="summaryLabel">📂 분야</span>
            <span className="summaryValue">
              {currentCategory?.emoji} {currentCategory?.name}
            </span>
          </div>
          <div className="summaryItem">
            <span className="summaryLabel">🔍 키워드</span>
            <span className="summaryValue">{keyword}</span>
          </div>
          <div className="summaryItem">
            <span className="summaryLabel">📱 플랫폼</span>
            <span className="summaryValue">{platforms.length}개 선택</span>
          </div>
          <div className="summaryItem">
            <span className="summaryLabel">⚡ 최적화</span>
            <span className="summaryValue" style={{color: applied ? '#5e7e5d' : '#a67e1e'}}>
              {applied ? '완료 ✓' : '대기 중'}
            </span>
          </div>
        </section>

        {/* Algo-Magic Booster */}
        {!applied && (
          <div className="guideBanner">
            <span className="guideIcon">💡</span>
            <div className="guideText">
              <strong>먼저 알고리즘을 적용하세요!</strong><br />
              아래 레버를 올리면 제목·태그·썸네일 프롬프트가 모두 최적화됩니다.
            </div>
          </div>
        )}

        <div className="boosterWrap">
          <AlgoBooster
            initialData={initialData}
            optimizedData={optimizedData}
            onApply={() => setApplied(true)}
            variant="full"
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="tabBar">
          <button
            className={`tabBtn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 <span>SNS 업로드 자료</span>
          </button>
          <button
            className={`tabBtn ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            🎨 <span>이미지 프롬프트</span>
          </button>
          <button
            className={`tabBtn ${activeTab === 'script' ? 'active' : ''}`}
            onClick={() => setActiveTab('script')}
          >
            📝 <span>영상 대본</span>
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'upload' && (
          <>
            {/* 플랫폼 스위처 */}
            <div className="platformSwitcher">
              {platforms.map((p) => p && (
                <button
                  key={p.id}
                  className={`platformTab ${activePlatform === p.id ? 'active' : ''}`}
                  onClick={() => setActivePlatform(p.id)}
                >
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* SNS 업로드 목업 */}
            {currentPlatform && (
              <div className="uploadMockup">
                <div className="mockupHeader">
                  <span className="mockupEmoji">{currentPlatform.emoji}</span>
                  <div>
                    <div className="mockupPlatformName">{currentPlatform.name} 업로드 화면</div>
                  </div>
                  <span className="mockupLabel">
                    {currentPlatform.orientation}
                  </span>
                </div>

                <div className="mockupBody">
                  {/* 썸네일/커버 */}
                  <div className="mockupField">
                    <div className="mockupFieldHead">
                      <div className="mockupFieldLabel">
                        <span className="mockupFieldIcon">🖼️</span>
                        <span className="mockupFieldName">
                          {currentPlatform.id === 'youtube-long' ? 'Thumbnail' : 'Cover Image'}
                        </span>
                      </div>
                    </div>
                    <div className={`mockupThumbnail ${
                      ['youtube-shorts', 'tiktok', 'instagram-reels'].includes(currentPlatform.id) ? 'vertical' : ''
                    }`}>
                      <div className="mockupThumbnailText">
                        <span style={{fontSize: 11, opacity: 0.7}}>썸네일 위치</span>
                        <strong>{displayTitle.slice(0, 20)}...</strong>
                      </div>
                    </div>
                  </div>

                  {/* 제목 */}
                  <div className="mockupField">
                    <div className="mockupFieldHead">
                      <div className="mockupFieldLabel">
                        <span className="mockupFieldIcon">📝</span>
                        <span className="mockupFieldName">Title / 제목</span>
                      </div>
                      <button
                        className={`copyBtn ${copiedKey === 'title' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(displayTitle, 'title')}
                      >
                        {copiedKey === 'title' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="mockupFieldValue title">
                      {displayTitle}
                    </div>
                  </div>

                  {/* 설명 */}
                  <div className="mockupField">
                    <div className="mockupFieldHead">
                      <div className="mockupFieldLabel">
                        <span className="mockupFieldIcon">📄</span>
                        <span className="mockupFieldName">Description / 설명</span>
                      </div>
                      <button
                        className={`copyBtn ${copiedKey === 'desc' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(
                          `${displayTitle}\n\n이번 영상에서는 ${keyword}에 대해 깊이 있게 다룹니다.\n\n📌 주요 내용:\n- 2026년 최신 트렌드\n- 꼭 알아야 할 핵심 정보\n- 실전 활용법\n\n${getPlatformHashtags(currentPlatform.id).join(' ')}`,
                          'desc'
                        )}
                      >
                        {copiedKey === 'desc' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="mockupFieldValue description">
{`${displayTitle}

이번 영상에서는 ${keyword}에 대해 깊이 있게 다룹니다.

📌 주요 내용:
- 2026년 최신 트렌드
- 꼭 알아야 할 핵심 정보
- 실전 활용법

${getPlatformHashtags(currentPlatform.id).join(' ')}`}
                    </div>
                  </div>

                  {/* 해시태그 */}
                  <div className="mockupField">
                    <div className="mockupFieldHead">
                      <div className="mockupFieldLabel">
                        <span className="mockupFieldIcon">#️⃣</span>
                        <span className="mockupFieldName">Hashtags / 해시태그</span>
                      </div>
                      <button
                        className={`copyBtn ${copiedKey === 'tags' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(getPlatformHashtags(currentPlatform.id).join(' '), 'tags')}
                      >
                        {copiedKey === 'tags' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="mockupFieldValue hashtags">
                      {getPlatformHashtags(currentPlatform.id).join(' ')}
                    </div>
                  </div>

                  {/* 플랫폼별 추가 정보 */}
                  {currentPlatform.id === 'youtube-long' && (
                    <div className="mockupField">
                      <div className="mockupFieldHead">
                        <div className="mockupFieldLabel">
                          <span className="mockupFieldIcon">⏱️</span>
                          <span className="mockupFieldName">Chapters / 챕터</span>
                        </div>
                        <button
                          className={`copyBtn ${copiedKey === 'chapters' ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(
                            `0:00 인트로\n0:30 문제 제기\n2:30 핵심 내용 1\n5:00 핵심 내용 2\n7:30 결론 및 요약`,
                            'chapters'
                          )}
                        >
                          {copiedKey === 'chapters' ? '✓ 복사됨' : '📋 복사'}
                        </button>
                      </div>
                      <div className="mockupFieldValue description">
{`0:00 인트로
0:30 문제 제기
2:30 핵심 내용 1
5:00 핵심 내용 2
7:30 결론 및 요약`}
                      </div>
                    </div>
                  )}

                  {['tiktok', 'youtube-shorts'].includes(currentPlatform.id) && (
                    <div className="mockupField">
                      <div className="mockupFieldHead">
                        <div className="mockupFieldLabel">
                          <span className="mockupFieldIcon">🎵</span>
                          <span className="mockupFieldName">BGM 추천</span>
                        </div>
                      </div>
                      <div className="mockupFieldValue">
                        "긴박한 뉴스 느낌의 BGM" · 트렌드 음악 권장
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'images' && (
          <>
            <div className="guideBanner">
              <span className="guideIcon">🎨</span>
              <div className="guideText">
                <strong>영상 대본에 맞는 이미지 프롬프트</strong>를 스타일별로 준비했어요.<br />
                원하는 스타일을 선택하고 프롬프트를 AI 이미지 생성 툴에 복사하세요.
              </div>
            </div>

            {/* 스타일 선택 */}
            <div className="promptStyleTabs">
              {promptSets.map((set, idx) => (
                <div
                  key={set.style}
                  className={`promptStyleTab ${activeStyleIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveStyleIdx(idx)}
                >
                  <div className="promptStyleEmoji">{set.styleEmoji}</div>
                  <div className="promptStyleName">{set.styleLabel.replace(/^[^\s]+\s/, '')}</div>
                  <div className="promptStyleDesc">{set.description}</div>
                </div>
              ))}
            </div>

            {/* 추천 툴 */}
            {promptSets[activeStyleIdx] && (
              <>
                <div className="promptToolInfo">
                  <span className="promptToolIcon">🛠️</span>
                  <div className="promptToolText">
                    <strong>추천 AI 이미지 생성 툴:</strong> {promptSets[activeStyleIdx].recommendedTool}
                  </div>
                </div>

                {/* 프롬프트 리스트 */}
                <div className="promptList">
                  {promptSets[activeStyleIdx].prompts.map((p, i) => (
                    <div key={i} className="promptCard">
                      <div className="promptCardHead">
                        <span className="promptPurpose">{p.purpose}</span>
                        <span className="promptAspect">{p.aspectRatio}</span>
                      </div>
                      <div className="promptText">{p.prompt}</div>
                      {p.negativePrompt && (
                        <div className="promptNegative">
                          <strong>Negative:</strong> {p.negativePrompt}
                        </div>
                      )}
                      <div className="promptActions">
                        <button
                          className={`copyBtn ${copiedKey === `prompt-${activeStyleIdx}-${i}` ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(p.prompt, `prompt-${activeStyleIdx}-${i}`)}
                        >
                          {copiedKey === `prompt-${activeStyleIdx}-${i}` ? '✓ 복사됨' : '📋 프롬프트 복사'}
                        </button>
                        {p.negativePrompt && (
                          <button
                            className={`copyBtn ${copiedKey === `neg-${activeStyleIdx}-${i}` ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(p.negativePrompt || '', `neg-${activeStyleIdx}-${i}`)}
                          >
                            {copiedKey === `neg-${activeStyleIdx}-${i}` ? '✓' : '📋 Negative 복사'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 추천 툴 바로가기 */}
                <div className="toolLinks">
                  <a
                    href="https://www.midjourney.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="toolLink"
                  >
                    <span className="toolEmoji">🎨</span>
                    <div>
                      <div className="toolName">Midjourney</div>
                      <div className="toolUrl">midjourney.com</div>
                    </div>
                  </a>
                  <a
                    href="https://openai.com/dall-e-3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="toolLink"
                  >
                    <span className="toolEmoji">🤖</span>
                    <div>
                      <div className="toolName">DALL-E 3 (ChatGPT)</div>
                      <div className="toolUrl">chat.openai.com</div>
                    </div>
                  </a>
                  <a
                    href="https://www.canva.com/ai-image-generator/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="toolLink"
                  >
                    <span className="toolEmoji">✨</span>
                    <div>
                      <div className="toolName">Canva AI</div>
                      <div className="toolUrl">canva.com/ai-image-generator</div>
                    </div>
                  </a>
                  <a
                    href="https://leonardo.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="toolLink"
                  >
                    <span className="toolEmoji">💎</span>
                    <div>
                      <div className="toolName">Leonardo AI</div>
                      <div className="toolUrl">leonardo.ai</div>
                    </div>
                  </a>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'script' && (
          <>
            <div className="scriptCard">
              <div className="scriptNotice">
                ⚠️ <strong>대본은 참고용 초안입니다.</strong> 본인 스타일에 맞게 자유롭게 수정하세요.
                실제 녹음할 땐 자연스러운 말투로 읽어주세요.
              </div>

              <div className="scriptSection">
                <div className="scriptSectionTitle">🎬 Section 1: 오프닝 (첫 5초 훅)</div>
                <div className="scriptSectionBody">
                  {applied
                    ? `"⚠️ 2026년, ${keyword} 모르면 진짜 큰일 납니다. 이 영상 3분만 투자해보세요. 매달 30만원씩 남는 돈이 달라집니다."`
                    : `"안녕하세요. 오늘은 ${keyword}에 대해 알아보겠습니다."`
                  }
                </div>
              </div>

              <div className="scriptSection">
                <div className="scriptSectionTitle">💡 Section 2: 문제 제기</div>
                <div className="scriptSectionBody">
                  {`많은 분들이 ${keyword}에 대해 잘못 알고 계세요.
특히 2026년에는 몇 가지 중요한 변화가 있는데요...`}
                </div>
              </div>

              <div className="scriptSection">
                <div className="scriptSectionTitle">📊 Section 3: 핵심 내용 1</div>
                <div className="scriptSectionBody">
                  {`첫 번째로 알아야 할 것은, ${keyword}의 기본 원리입니다.
이걸 이해해야 다음 내용이 쉽게 이해됩니다.

[여기에 구체적인 설명 및 예시]`}
                </div>
              </div>

              <div className="scriptSection">
                <div className="scriptSectionTitle">🎯 Section 4: 핵심 내용 2</div>
                <div className="scriptSectionBody">
                  {`두 번째는, 실전에서 어떻게 활용할지입니다.

[구체적인 실전 예시 3가지]
1. [예시 1]
2. [예시 2]
3. [예시 3]`}
                </div>
              </div>

              <div className="scriptSection">
                <div className="scriptSectionTitle">✨ Section 5: 결론 및 요약</div>
                <div className="scriptSectionBody">
                  {`정리하면 ${keyword}에서 가장 중요한 건 세 가지입니다.
첫째, [핵심1]
둘째, [핵심2]
셋째, [핵심3]

이 세 가지만 기억하셔도 훨씬 도움이 될 거예요.`}
                </div>
              </div>

              <div className="scriptSection">
                <div className="scriptSectionTitle">🔔 Section 6: CTA (구독·좋아요)</div>
                <div className="scriptSectionBody">
                  {`오늘 내용이 도움되셨다면 구독과 좋아요 꼭 눌러주세요!
다음 영상에서는 더 유익한 정보로 찾아뵙겠습니다. 감사합니다!`}
                </div>
              </div>

              <button
                className="copyBtn"
                style={{marginTop: 12, padding: '10px 16px', fontSize: 13}}
                onClick={() => copyToClipboard(
                  `[대본 전체]\n\n키워드: ${keyword}\n\n(전체 대본 내용이 여기 복사됨)`,
                  'script-all'
                )}
              >
                {copiedKey === 'script-all' ? '✓ 전체 대본 복사됨' : '📋 대본 전체 복사'}
              </button>
            </div>
          </>
        )}

        <div className="adWrap">
          <AdSlot slot="done-mid" variant="horizontal" />
        </div>

        {/* 다음 단계 */}
        <section className="nextSteps">
          <h3 className="nextStepsTitle">🚀 다음 단계</h3>
          <div className="nextStepsGrid">
            <Link href="/" className="nextStepCard">
              <div className="nextStepIcon">🎬</div>
              <div className="nextStepTitle">새 영상 만들기</div>
              <div className="nextStepDesc">다른 키워드로 다시 시작</div>
            </Link>
            <Link href="/blog" className="nextStepCard">
              <div className="nextStepIcon">📚</div>
              <div className="nextStepTitle">노하우 읽기</div>
              <div className="nextStepDesc">조회수 올리는 비법</div>
            </Link>
            <Link href="/about" className="nextStepCard">
              <div className="nextStepIcon">ℹ️</div>
              <div className="nextStepTitle">AlgoMaker 소개</div>
              <div className="nextStepDesc">더 자세히 알아보기</div>
            </Link>
          </div>
        </section>

        <div className="adWrap">
          <AdSlot slot="done-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
