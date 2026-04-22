'use client';
/**
 * AlgoMaker v13.2 - 대시보드 홈 (카테고리 최적화)
 * - 2단 필터: 길이(상단 작게) + 카테고리(하단 메인)
 * - 18개 카테고리 (수익·라이프·특수 밸런스)
 * - 각 카테고리에 최소 1개 이상의 템플릿 매핑
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';

type Length = 'all' | 'shorts' | 'longform';
type CatKey =
  | 'all' | 'finance' | 'health' | 'tech' | 'stocks' | 'realestate'
  | 'news' | 'selfdev' | 'cooking' | 'travel' | 'lifestyle'
  | 'pet' | 'hobby' | 'parenting' | 'education'
  | 'religion' | 'music' | 'game' | 'science';

interface Template {
  id: string;
  title: string;
  desc: string;
  cat: Exclude<CatKey, 'all'>;
  length: Exclude<Length, 'all'>;
  duration: string;
  cpm: string;
  thumb: string;
  icon: string;
  badge?: 'NEW' | 'HOT' | 'BETA';
  categorySlug: string; // /keyword가 기대하는 슬러그
  defaultTone: 'formal' | 'friendly' | 'casual' | 'slang';
}

// ============ CATEGORIES (18개, 그룹 분리) ============
const CAT_GROUPS = [
  {
    label: '수익 Top',
    items: [
      { key: 'finance', label: '재테크', icon: '💰' },
      { key: 'health', label: '건강', icon: '🏥' },
      { key: 'tech', label: 'IT/AI', icon: '💻' },
      { key: 'stocks', label: '주식', icon: '📈' },
      { key: 'realestate', label: '부동산', icon: '🏠' },
      { key: 'news', label: '뉴스/시사', icon: '📰' },
      { key: 'selfdev', label: '자기계발', icon: '📚' },
    ],
  },
  {
    label: '라이프 · 관심사',
    items: [
      { key: 'cooking', label: '요리', icon: '🍳' },
      { key: 'travel', label: '여행', icon: '✈️' },
      { key: 'lifestyle', label: '라이프', icon: '🌿' },
      { key: 'pet', label: '반려동물', icon: '🐾' },
      { key: 'hobby', label: '취미', icon: '🎨' },
      { key: 'parenting', label: '육아', icon: '👶' },
      { key: 'education', label: '교육', icon: '🎓' },
    ],
  },
  {
    label: '특수 · 트렌드',
    items: [
      { key: 'religion', label: '종교/명언', icon: '🙏' },
      { key: 'music', label: '음악', icon: '🎵' },
      { key: 'game', label: '게임', icon: '🎮' },
      { key: 'science', label: '과학/상식', icon: '🔬' },
    ],
  },
] as const;

// ============ TEMPLATES ============
const TEMPLATES: Template[] = [
  // 수익 Top
  { id: 't1', title: '오늘의 경제 브리핑', desc: '실시간 뉴스 기반 5~10분 요약', cat: 'news', length: 'longform', duration: '5~10분', cpm: '$15~22', thumb: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', icon: '📰', badge: 'HOT', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't2', title: '1분 재테크 팁', desc: '짧고 강렬한 쇼츠용 재테크 상식', cat: 'finance', length: 'shorts', duration: '1분', cpm: '$12~18', thumb: 'linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%)', icon: '⚡', badge: 'NEW', categorySlug: 'economy', defaultTone: 'friendly' },
  { id: 't3', title: '블루오션 재테크 가이드', desc: '경쟁 낮고 수익 높은 주제 자동 발굴', cat: 'finance', length: 'longform', duration: '10~15분', cpm: '$12~18', thumb: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)', icon: '💰', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't4', title: '시니어 건강 상식', desc: '50~70대 타겟, 큰 글씨 + 느린 TTS', cat: 'health', length: 'longform', duration: '10~15분', cpm: '$15~22', thumb: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '🏥', categorySlug: 'health', defaultTone: 'formal' },
  { id: 't5', title: 'AI 트렌드 위클리', desc: '최신 AI 도구 & 뉴스 큐레이션', cat: 'tech', length: 'longform', duration: '10~15분', cpm: '$10~16', thumb: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', icon: '💻', badge: 'NEW', categorySlug: 'tech', defaultTone: 'friendly' },
  { id: 't6', title: '주식 종목 분석', desc: '차트·재무제표 기반 종목 리서치', cat: 'stocks', length: 'longform', duration: '10~15분', cpm: '$16~24', thumb: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)', icon: '📈', badge: 'HOT', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't7', title: '부동산 지역 리포트', desc: '지역별 시세·호재 분석', cat: 'realestate', length: 'longform', duration: '10~15분', cpm: '$14~20', thumb: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', icon: '🏠', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't8', title: '자기계발 심층 분석', desc: '15~20분 롱폼, 깊이 있는 콘텐츠', cat: 'selfdev', length: 'longform', duration: '15~20분', cpm: '$8~14', thumb: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', icon: '📚', categorySlug: 'selfdev', defaultTone: 'formal' },
  { id: 't9', title: '주간 헤드라인', desc: '일주일간 주요 뉴스 큐레이션', cat: 'news', length: 'longform', duration: '10분', cpm: '$12~18', thumb: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)', icon: '📡', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't10', title: '1분 건강 꿀팁', desc: '일상 건강 상식 쇼츠', cat: 'health', length: 'shorts', duration: '1분', cpm: '$10~16', thumb: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', icon: '💊', categorySlug: 'health', defaultTone: 'friendly' },

  // 라이프 · 관심사
  { id: 't11', title: '5분 집밥 레시피', desc: '간단한 집밥·자취 요리 가이드', cat: 'cooking', length: 'longform', duration: '5~8분', cpm: '$6~10', thumb: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', icon: '🍳', categorySlug: 'life', defaultTone: 'friendly' },
  { id: 't12', title: '국내 여행 브이로그', desc: '주말 당일치기 여행지 추천', cat: 'travel', length: 'longform', duration: '10분', cpm: '$8~12', thumb: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', icon: '✈️', badge: 'NEW', categorySlug: 'life', defaultTone: 'friendly' },
  { id: 't13', title: '인테리어 꿀팁', desc: '소확행 인테리어 아이디어', cat: 'lifestyle', length: 'longform', duration: '5~10분', cpm: '$7~11', thumb: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', icon: '🌿', categorySlug: 'life', defaultTone: 'friendly' },
  { id: 't14', title: '반려견 훈련 가이드', desc: '초보 집사를 위한 강아지 훈련', cat: 'pet', length: 'longform', duration: '5~10분', cpm: '$6~10', thumb: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🐾', categorySlug: 'life', defaultTone: 'friendly' },
  { id: 't15', title: 'DIY 꿀팁 모음', desc: '일상에서 쓰는 DIY 아이디어', cat: 'hobby', length: 'longform', duration: '5~10분', cpm: '$5~9', thumb: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '🎨', categorySlug: 'life', defaultTone: 'friendly' },
  { id: 't16', title: '육아 필수 상식', desc: '신생아~유아기 부모 가이드', cat: 'parenting', length: 'longform', duration: '10분', cpm: '$8~12', thumb: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', icon: '👶', categorySlug: 'health', defaultTone: 'friendly' },
  { id: 't17', title: '수능/시험 핵심 정리', desc: '과목별 암기 포인트 요약', cat: 'education', length: 'longform', duration: '10~15분', cpm: '$7~11', thumb: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)', icon: '🎓', categorySlug: 'selfdev', defaultTone: 'formal' },

  // 특수 · 트렌드
  { id: 't18', title: '오늘의 말씀', desc: '성경 구절 기반 묵상 영상', cat: 'religion', length: 'longform', duration: '5~10분', cpm: '$8~14', thumb: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)', icon: '🙏', badge: 'BETA', categorySlug: 'selfdev', defaultTone: 'formal' },
  { id: 't19', title: '명곡 배경 스토리', desc: '유명곡의 탄생 비화 영상', cat: 'music', length: 'longform', duration: '5~10분', cpm: '$5~9', thumb: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)', icon: '🎵', categorySlug: 'life', defaultTone: 'friendly' },
  { id: 't20', title: '게임 공략/리뷰', desc: '신작 게임 리뷰·꿀팁 공략', cat: 'game', length: 'longform', duration: '10~15분', cpm: '$6~10', thumb: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🎮', categorySlug: 'life', defaultTone: 'casual' },
  { id: 't21', title: '신기한 과학 상식', desc: '일상 속 과학 원리 쉬운 설명', cat: 'science', length: 'longform', duration: '5~10분', cpm: '$7~11', thumb: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', icon: '🔬', badge: 'NEW', categorySlug: 'tech', defaultTone: 'friendly' },
];

const LENGTH_TABS: { key: Length; label: string }[] = [
  { key: 'all', label: '전체 길이' },
  { key: 'shorts', label: '⚡ 쇼츠 (1분)' },
  { key: 'longform', label: '📺 롱폼 (5분+)' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeLength, setActiveLength] = useState<Length>('all');
  const [activeCat, setActiveCat] = useState<CatKey>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [topic, setTopic] = useState('');

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchLen = activeLength === 'all' || t.length === activeLength;
      const matchCat = activeCat === 'all' || t.cat === activeCat;
      return matchLen && matchCat;
    });
  }, [activeLength, activeCat]);

  const handleStart = () => {
    if (!selectedTemplate) return;
    setProject({
      category: selectedTemplate.categorySlug,
      categoryLabel: CAT_GROUPS.flatMap(g => g.items).find(c => c.key === selectedTemplate.cat)?.label || '',
      templateId: selectedTemplate.id,
      customTopic: topic,
      tone: selectedTemplate.defaultTone,
      step: 1,
    });
    router.push('/keyword');
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page { padding: 32px; max-width: 1400px; margin: 0 auto; }

        /* HERO */
        .hero {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          border-radius: 16px;
          padding: 36px;
          color: #fff;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .hero::after {
          content: '';
          position: absolute;
          right: -50px;
          top: -50px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(204,0,0,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .heroInner { position: relative; z-index: 1; max-width: 640px; }
        .heroBadge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(204,0,0,0.2); color: #ff6b6b;
          border: 1px solid rgba(204,0,0,0.4);
          border-radius: 999px; font-size: 11px; font-weight: 700;
          margin-bottom: 12px;
        }
        .heroTitle {
          font-size: 28px; font-weight: 800;
          letter-spacing: -0.02em; line-height: 1.3;
          margin-bottom: 8px;
        }
        .heroSub { font-size: 14px; color: #aaa; margin-bottom: 18px; line-height: 1.6; }
        .heroCta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 20px; background: #cc0000; color: #fff;
          border-radius: 999px; font-size: 13px; font-weight: 700;
          cursor: pointer; border: none;
        }
        .heroCta:hover { background: #a80000; }

        .pageTitle {
          font-size: 22px; font-weight: 800;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .pageSub { font-size: 13px; color: #606060; margin-bottom: 20px; }

        /* LENGTH FILTER (작게, 세그먼트 토글) */
        .lenFilter {
          display: inline-flex;
          background: #f0f0f0;
          border-radius: 999px;
          padding: 3px;
          margin-bottom: 18px;
          gap: 2px;
        }
        .lenTab {
          padding: 6px 14px;
          background: transparent;
          border: none;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .lenTab:hover { color: #0f0f0f; }
        .lenTabActive {
          background: #fff;
          color: #0f0f0f;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* CATEGORY FILTER (메인) */
        .catBox {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 24px;
        }
        .catGroup { margin-bottom: 12px; }
        .catGroup:last-child { margin-bottom: 0; }
        .catGroupLabel {
          font-size: 10px;
          font-weight: 700;
          color: #999;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .catRow {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .catChip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #0f0f0f;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .catChip:hover { background: #f0f0f0; border-color: #0f0f0f; }
        .catChipActive {
          background: #0f0f0f;
          color: #fff;
          border-color: #0f0f0f;
        }
        .catChipAll {
          background: #fff0f0;
          color: #cc0000;
          border-color: #ffd4d4;
        }
        .catChipAll.catChipActive {
          background: #cc0000;
          color: #fff;
          border-color: #cc0000;
        }
        .catChipIcon { font-size: 14px; }

        /* RESULT BAR */
        .resultBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-size: 13px;
          color: #606060;
        }
        .resultCount { font-weight: 700; color: #0f0f0f; }
        .clearBtn {
          padding: 4px 10px;
          background: transparent;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 11px;
          color: #606060;
          cursor: pointer;
        }
        .clearBtn:hover { border-color: #0f0f0f; color: #0f0f0f; }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        .empty {
          padding: 60px 20px;
          text-align: center;
          background: #fff;
          border: 1px dashed #e5e5e5;
          border-radius: 14px;
          color: #888;
        }
        .emptyTitle { font-size: 15px; font-weight: 700; color: #0f0f0f; margin-bottom: 4px; }
        .emptySub { font-size: 13px; }

        .card {
          cursor: pointer;
          transition: transform 0.2s;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
        }
        .card:hover { transform: translateY(-4px); }
        .thumb {
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          color: #fff;
          overflow: hidden;
        }
        .duration {
          position: absolute;
          bottom: 8px; right: 8px;
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 3px 7px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge {
          position: absolute;
          top: 10px; left: 10px;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .badgeNEW { background: #22c55e; color: #fff; }
        .badgeHOT { background: #cc0000; color: #fff; }
        .badgeBETA { background: #fff; color: #0f0f0f; border: 1px solid #e5e5e5; }

        .meta { padding: 12px 12px 14px; }
        .metaTop {
          display: flex; justify-content: space-between;
          align-items: center; gap: 8px; margin-bottom: 6px;
        }
        .cat {
          font-size: 11px; font-weight: 700;
          color: #cc0000; text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cpm { font-size: 11px; color: #888; font-weight: 600; }
        .title {
          font-size: 14px; font-weight: 700;
          color: #0f0f0f; margin-bottom: 3px;
          letter-spacing: -0.01em; line-height: 1.35;
        }
        .desc { font-size: 12px; color: #606060; line-height: 1.5; }

        /* MODAL */
        .modalBack {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 200; padding: 16px;
        }
        .modal {
          background: #fff; border-radius: 16px;
          width: 100%; max-width: 520px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modalHead { display: flex; gap: 14px; margin-bottom: 20px; align-items: center; }
        .modalThumb {
          width: 72px; height: 40px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: #fff; flex-shrink: 0;
        }
        .modalTitle { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 2px; }
        .modalSub { font-size: 12px; color: #888; }
        .modalLabel { font-size: 13px; font-weight: 700; margin-bottom: 6px; }
        .modalHelp { font-size: 12px; color: #888; margin-bottom: 10px; }
        .modalInput {
          width: 100%; padding: 12px 14px;
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 10px; font-size: 14px; font-family: inherit;
          margin-bottom: 16px; transition: border-color 0.15s;
        }
        .modalInput:focus { outline: none; border-color: #cc0000; background: #fff; }
        .modalDetail { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .modalDetailItem { padding: 10px; background: #fafafa; border-radius: 8px; text-align: center; }
        .modalDetailLabel { font-size: 10px; color: #888; margin-bottom: 2px; letter-spacing: 0.05em; }
        .modalDetailValue { font-size: 13px; font-weight: 700; color: #0f0f0f; }
        .modalActions { display: flex; gap: 8px; }
        .modalCancel {
          padding: 12px 18px; background: #f5f5f5;
          border: none; border-radius: 999px;
          font-size: 13px; font-weight: 600; color: #606060;
          cursor: pointer; flex-shrink: 0;
        }
        .modalCancel:hover { background: #e5e5e5; }
        .modalStart {
          flex: 1; padding: 12px;
          background: #cc0000; color: #fff;
          border: none; border-radius: 999px;
          font-size: 14px; font-weight: 700; cursor: pointer;
        }
        .modalStart:hover { background: #a80000; }

        @media (max-width: 768px) {
          .page { padding: 18px 16px; }
          .hero { padding: 24px; border-radius: 14px; }
          .heroTitle { font-size: 22px; }
          .catBox { padding: 12px; }
          .catRow { gap: 5px; }
          .catChip { padding: 6px 10px; font-size: 11px; }
          .grid { grid-template-columns: 1fr; gap: 14px; }
          .modal { padding: 20px; }
          .modalDetail { grid-template-columns: 1fr; gap: 6px; }
        }
      `}</style>

      <div className="page">
        {/* Hero */}
        <div className="hero">
          <div className="heroInner">
            <div className="heroBadge">🔥 NEW · 블루오션 AI 분석</div>
            <h1 className="heroTitle">
              AI가 수익 잘 나는 키워드부터<br />
              찾아드립니다
            </h1>
            <p className="heroSub">
              카테고리 고르고 템플릿 선택하면 끝. 5분 안에 YouTube 업로드 가능한 MP4 완성.
            </p>
            <button className="heroCta" onClick={() => router.push('/create')}>
              ▶ 지금 시작하기
            </button>
          </div>
        </div>

        <h2 className="pageTitle">템플릿 라이브러리</h2>
        <p className="pageSub">원하는 영상 스타일을 선택하세요. AI가 자동으로 제작합니다.</p>

        {/* 1차: 길이 */}
        <div className="lenFilter">
          {LENGTH_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`lenTab ${activeLength === tab.key ? 'lenTabActive' : ''}`}
              onClick={() => setActiveLength(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2차: 카테고리 */}
        <div className="catBox">
          <div className="catGroup">
            <div className="catRow">
              <button
                className={`catChip catChipAll ${activeCat === 'all' ? 'catChipActive' : ''}`}
                onClick={() => setActiveCat('all')}
              >
                <span className="catChipIcon">🔥</span>
                <span>전체</span>
              </button>
            </div>
          </div>

          {CAT_GROUPS.map((group) => (
            <div key={group.label} className="catGroup">
              <div className="catGroupLabel">{group.label}</div>
              <div className="catRow">
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    className={`catChip ${activeCat === item.key ? 'catChipActive' : ''}`}
                    onClick={() => setActiveCat(item.key as CatKey)}
                  >
                    <span className="catChipIcon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 결과 바 */}
        <div className="resultBar">
          <div>
            <span className="resultCount">{filtered.length}개</span>의 템플릿
            {(activeLength !== 'all' || activeCat !== 'all') && ' (필터 적용됨)'}
          </div>
          {(activeLength !== 'all' || activeCat !== 'all') && (
            <button
              className="clearBtn"
              onClick={() => { setActiveLength('all'); setActiveCat('all'); }}
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 그리드 */}
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="emptyTitle">해당 조건의 템플릿이 아직 없어요</div>
            <div className="emptySub">다른 카테고리를 선택하거나 필터를 초기화해보세요</div>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((t) => {
              const catInfo = CAT_GROUPS.flatMap(g => g.items).find(c => c.key === t.cat);
              return (
                <div key={t.id} className="card" onClick={() => setSelectedTemplate(t)}>
                  <div className="thumb" style={{ background: t.thumb }}>
                    {t.badge && <span className={`badge badge${t.badge}`}>{t.badge}</span>}
                    <span>{t.icon}</span>
                    <div className="duration">{t.duration}</div>
                  </div>
                  <div className="meta">
                    <div className="metaTop">
                      <span className="cat">{catInfo?.label}</span>
                      <span className="cpm">CPM {t.cpm}</span>
                    </div>
                    <h3 className="title">{t.title}</h3>
                    <p className="desc">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {selectedTemplate && (
          <div className="modalBack" onClick={() => setSelectedTemplate(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHead">
                <div className="modalThumb" style={{ background: selectedTemplate.thumb }}>
                  {selectedTemplate.icon}
                </div>
                <div>
                  <div className="modalTitle">{selectedTemplate.title}</div>
                  <div className="modalSub">
                    {CAT_GROUPS.flatMap(g => g.items).find(c => c.key === selectedTemplate.cat)?.label}
                    {' · '}
                    {selectedTemplate.duration}
                  </div>
                </div>
              </div>

              <div className="modalLabel">주제 (선택)</div>
              <div className="modalHelp">비워두면 AI가 블루오션 키워드를 자동 추천합니다</div>
              <input
                type="text"
                className="modalInput"
                placeholder="예: 2026년 금리 전망"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={80}
                autoFocus
              />

              <div className="modalDetail">
                <div className="modalDetailItem">
                  <div className="modalDetailLabel">길이</div>
                  <div className="modalDetailValue">{selectedTemplate.duration}</div>
                </div>
                <div className="modalDetailItem">
                  <div className="modalDetailLabel">예상 CPM</div>
                  <div className="modalDetailValue">{selectedTemplate.cpm}</div>
                </div>
                <div className="modalDetailItem">
                  <div className="modalDetailLabel">소요</div>
                  <div className="modalDetailValue">5~8분</div>
                </div>
              </div>

              <div className="modalActions">
                <button className="modalCancel" onClick={() => setSelectedTemplate(null)}>취소</button>
                <button className="modalStart" onClick={handleStart}>
                  ▶ 다음 (키워드 선택)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
