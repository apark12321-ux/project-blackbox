'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

interface Article {
  slug: string;
  category: string;
  categoryEmoji: string;
  title: string;
  subtitle: string;
  readTime: string;
  publishDate: string;
  featured?: boolean;
  group?: 'viral' | 'phone' | 'ai' | 'senior' | 'general';
}

const ARTICLES: Article[] = [
  {
    slug: 'youtube-algorithm',
    group: 'general',
    category: '알고리즘',
    categoryEmoji: '🤖',
    title: '유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준',
    subtitle: '구독자 수보다 더 중요한, AI가 영상을 평가하는 핵심 지표',
    readTime: '8분',
    publishDate: '2026.04.20',
    featured: true,
  },
  {
    slug: 'ctr-title-secrets',
    group: 'general',
    category: '제목 노하우',
    categoryEmoji: '✏️',
    title: '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지',
    subtitle: '유튜브 알고리즘이 좋아하는 제목 패턴과 실제 사례',
    readTime: '10분',
    publishDate: '2026.04.21',
    featured: true,
  },
  {
    slug: 'thumbnail-design',
    group: 'general',
    category: '썸네일',
    categoryEmoji: '🖼️',
    title: '조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙',
    subtitle: '한글 텍스트 잘 들어간 썸네일 만드는 비결',
    readTime: '9분',
    publishDate: '2026.04.22',
  },
  {
    slug: 'viewer-retention',
    group: 'general',
    category: '시청 유지율',
    categoryEmoji: '📊',
    title: '시청 유지율 50% 넘기는 영상 구조 7단계',
    subtitle: '시청자가 끝까지 보게 만드는 검증된 영상 구성법',
    readTime: '11분',
    publishDate: '2026.04.23',
    featured: true,
  },
  {
    slug: 'first-30-seconds-hook',
    group: 'general',
    category: '시청 유지율',
    categoryEmoji: '⏱️',
    title: '첫 30초가 90%를 결정한다 - 후크(Hook) 작성법',
    subtitle: '시청자 이탈률 50%에서 10%로 만드는 영상 시작 비결',
    readTime: '8분',
    publishDate: '2026.04.18',
  },
  {
    slug: 'seo-tags',
    group: 'general',
    category: 'SEO',
    categoryEmoji: '🏷️',
    title: '유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법',
    subtitle: '키워드 분석부터 태그 배치까지 검색 상위 노출 가이드',
    readTime: '9분',
    publishDate: '2026.04.24',
  },
  {
    slug: 'shorts-vs-longform',
    group: 'general',
    category: '쇼츠/롱폼',
    categoryEmoji: '📱',
    title: '쇼츠 vs 긴 영상, 어디에 집중해야 할까?',
    subtitle: '신규 채널 vs 기존 채널의 최적 영상 형식 선택 가이드',
    readTime: '8분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'middle-aged-channel-tips',
    group: 'senior',
    category: '시니어층',
    categoryEmoji: '👔',
    title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
    subtitle: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적 가이드',
    readTime: '10분',
    publishDate: '2026.04.25',
    featured: true,
  },
  {
    slug: 'family-story-shorts',
    group: 'senior',
    category: '사연/감동',
    categoryEmoji: '💝',
    title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
    subtitle: '시니어층이 가장 빠르게 수익화에 성공한 영상 카테고리 분석',
    readTime: '9분',
    publishDate: '2026.04.28',
    featured: true,
  },
  {
    slug: 'content-value-paths',
    group: 'general',
    category: '콘텐츠 가치',
    categoryEmoji: '💡',
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    subtitle: '내가 잘하는 것을 영상으로 풀어낼 때 만들어지는 다양한 가치',
    readTime: '8분',
    publishDate: '2026.04.28',
    featured: true,
  },
  {
    slug: 'monetization-tips',
    group: 'general',
    category: '수익화',
    categoryEmoji: '💰',
    title: '구독자 1,000명 안 되어도 가능한 수익화 5가지',
    subtitle: '유튜브 광고 외에도 수익을 만드는 다양한 방법 정리',
    readTime: '9분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'trending-keywords-research',
    group: 'viral',
    category: '키워드',
    categoryEmoji: '🔍',
    title: '트렌드 키워드 발굴하는 무료 도구 7가지',
    subtitle: '유료 도구 없이 검색량 높은 키워드를 찾는 실전 방법',
    readTime: '8분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'storytelling-structure',
    group: 'general',
    category: '스토리텔링',
    categoryEmoji: '📖',
    title: '10만 조회수 영상의 스토리텔링 구조 분석',
    subtitle: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
    readTime: '11분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'bgm-copyright-free',
    group: 'general',
    category: 'BGM',
    categoryEmoji: '🎵',
    title: '저작권 걱정 없는 무료 BGM 사이트 10개 정리',
    subtitle: '유튜브 수익화 가능한 무료 음악 다운로드 가이드',
    readTime: '7분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'upload-time-optimization',
    group: 'general',
    category: '업로드',
    categoryEmoji: '⏰',
    title: '유튜브 업로드 최적 시간 - 데이터로 검증된 황금 시간',
    subtitle: '채널 시청자가 가장 많이 접속하는 시간대 찾기',
    readTime: '7분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'channel-branding',
    group: 'general',
    category: '브랜딩',
    categoryEmoji: '🎨',
    title: '기억에 남는 채널 브랜딩 만드는 7가지 요소',
    subtitle: '구독자가 다른 영상에서도 한눈에 알아보는 채널 만들기',
    readTime: '10분',
    publishDate: '2026.04.25',
  },
  {
    slug: 'community-engagement',
    group: 'general',
    category: '커뮤니티',
    categoryEmoji: '💬',
    title: '댓글, 좋아요, 구독 자연스럽게 늘리는 6가지 방법',
    subtitle: '강요하지 않고도 시청자가 자발적으로 행동하게 만드는 비결',
    readTime: '9분',
    publishDate: '2026.04.25',
  },
  // ============= Phase 3 - 떡상 분석 (3편) =============
  {
    slug: 'viral-patterns-9-domains',
    group: 'viral',
    category: '떡상 분석',
    categoryEmoji: '🔥',
    title: '9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식',
    subtitle: '부동산부터 가족 사연까지, 실제로 잘된 영상의 공통 패턴 정리',
    readTime: '15분',
    publishDate: '2026.04.28',
    featured: true,
  },
  {
    slug: 'viral-patterns-senior',
    group: 'viral',
    category: '떡상 분석',
    categoryEmoji: '🌳',
    title: '시니어층이 사랑하는 떡상 영상 패턴 5가지',
    subtitle: '50대~70대 시청자가 끝까지 보는 영상의 공통점',
    readTime: '10분',
    publishDate: '2026.04.28',
    featured: true,
  },
  {
    slug: 'viral-patterns-family-story',
    group: 'viral',
    category: '떡상 분석',
    categoryEmoji: '💝',
    title: '가족 사연 채널의 떡상 패턴 - 8가지 검증된 공식',
    subtitle: '진심 담은 사연이 떡상하는 이유와 만드는 법',
    readTime: '12분',
    publishDate: '2026.04.28',
  },
  // ============= Phase 3 - 핸드폰 가이드 (3편) =============
  {
    slug: 'phone-video-basics',
    group: 'phone',
    category: '핸드폰 가이드',
    categoryEmoji: '📱',
    title: '핸드폰만으로 영상 만들기 입문 - 시니어층용 step-by-step',
    subtitle: '카메라 없이도 OK, 무료 앱만으로 영상 완성하는 법',
    readTime: '12분',
    publishDate: '2026.04.28',
    featured: true,
  },
  {
    slug: 'phone-app-capcut-vlo',
    group: 'phone',
    category: '핸드폰 가이드',
    categoryEmoji: '✂️',
    title: '캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교',
    subtitle: '두 앱의 장단점과 본인에게 맞는 앱 고르는 기준',
    readTime: '10분',
    publishDate: '2026.04.28',
  },
  {
    slug: 'phone-free-editing-apps',
    group: 'phone',
    category: '핸드폰 가이드',
    categoryEmoji: '🆓',
    title: '시니어층 무료 영상 편집 앱 5가지 비교',
    subtitle: '돈 안 내고 충분히 만드는 영상, 본인에게 맞는 앱 고르기',
    readTime: '11분',
    publishDate: '2026.04.28',
  },
  // ============= Phase 3 - AI 도구 (2편) =============
  {
    slug: 'ai-tools-for-seniors',
    group: 'ai',
    category: 'AI 도구',
    categoryEmoji: '🤖',
    title: '시니어층이 영상 만들 때 쓸 만한 무료 AI 도구 5가지',
    subtitle: 'ChatGPT부터 미드저니까지, 진짜 도움되는 도구만 정리',
    readTime: '13분',
    publishDate: '2026.04.28',
    featured: true,
  },
  {
    slug: 'chatgpt-for-seniors',
    group: 'ai',
    category: 'AI 도구',
    categoryEmoji: '💬',
    title: 'ChatGPT 시니어층 활용법 - 영상 대본 만들기',
    subtitle: '복잡한 명령 없이 간단하게 대본 받는 5가지 질문 패턴',
    readTime: '9분',
    publishDate: '2026.04.28',
  },
];

function BlogPageInner() {
  const searchParams = useSearchParams();
  const [activeGroup, setActiveGroup] = useState<string>('all');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && ['viral', 'phone', 'ai', 'senior'].includes(cat)) {
      setActiveGroup(cat);
    } else {
      setActiveGroup('all');
    }
  }, [searchParams]);

  const filteredArticles = activeGroup === 'all'
    ? ARTICLES
    : ARTICLES.filter((a) => a.group === activeGroup);

  const featuredArticles = filteredArticles.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  const groupLabels: Record<string, { label: string; emoji: string; desc: string }> = {
    all: { label: '전체 가이드', emoji: '📚', desc: '시니어층 영상 만들기에 필요한 모든 가이드' },
    viral: { label: '떡상 분석', emoji: '🔥', desc: '실제 떡상한 영상의 패턴 분석 — 다른 곳에 없는 데이터' },
    phone: { label: '핸드폰 가이드', emoji: '📱', desc: '시니어층도 핸드폰 하나로 영상 만드는 step-by-step 가이드' },
    ai: { label: 'AI 도구', emoji: '🤖', desc: '시니어층이 쓸 만한 무료 AI 도구 활용법' },
    senior: { label: '시니어 사례', emoji: '🌳', desc: '시니어층 영상 시작 사례와 노하우' },
  };

  const currentGroup = groupLabels[activeGroup] || groupLabels.all;

  return (
    <V11Shell>
      <style jsx>{`
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 60px;
        }
        @media (max-width: 600px) {
          .page { padding: 24px 16px 40px; }
        }

        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 20px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }

        /* 헤더 */
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        @media (max-width: 600px) { .header { margin-bottom: 28px; } }
        
        .pageBadge {
          display: inline-block;
          padding: 6px 14px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
        }
        .title {
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        @media (max-width: 600px) { .title { font-size: 24px; } }
        .sub {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }
        @media (max-width: 600px) { .sub { font-size: 13.5px; } }

        /* 추천 콘텐츠 (Featured) */
        /* 카테고리 탭 (Phase 2) */
        .categoryTabs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin: 0 0 28px;
          padding: 16px;
          background: #fafafa;
          border-radius: 14px;
        }
        @media (max-width: 720px) {
          .categoryTabs {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 12px;
          }
        }
        @media (max-width: 480px) {
          .categoryTabs {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .categoryTab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 8px 12px;
          background: #fff;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          text-decoration: none;
          color: #444;
          transition: all 0.2s;
          text-align: center;
        }
        .categoryTab:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.1);
        }
        .categoryTab.active {
          border-color: #c65f3b;
          background: #fff8f3;
          color: #c65f3b;
        }
        .categoryTabEmoji {
          font-size: 22px;
        }
        .categoryTabLabel {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .categoryTabCount {
          font-size: 11px;
          color: #888;
          font-weight: 600;
          padding: 1px 7px;
          background: #f5f5f5;
          border-radius: 100px;
        }
        .categoryTab.active .categoryTabCount {
          background: #c65f3b;
          color: #fff;
        }

        .featuredSection {
          margin-bottom: 40px;
        }
        .sectionTitle {
          font-size: 18px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 16px;
          letter-spacing: -0.025em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 16px; } }

        .featuredGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .featuredCard {
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f3 100%);
          border: 1.5px solid #fde0c5;
          border-radius: 14px;
          padding: 22px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          display: block;
        }
        .featuredCard:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(198, 95, 59, 0.12);
        }
        .featuredBadge {
          display: inline-block;
          padding: 3px 10px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }
        .featuredCardTitle {
          font-size: 17px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.4;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .featuredCardTitle { font-size: 15.5px; } }
        .featuredCardSub {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 12px;
        }
        .featuredCardMeta {
          display: flex;
          gap: 12px;
          font-size: 11.5px;
          color: #888;
        }

        .adArea { margin: 32px 0; }

        /* 일반 카드 그리드 */
        .articlesGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }
        .articleCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 18px 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          display: block;
        }
        .articleCard:hover {
          border-color: #c65f3b;
          background: #fff8f3;
          transform: translateY(-1px);
        }
        .categoryChip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #c65f3b;
          padding: 3px 10px;
          background: #fdf1e7;
          border-radius: 100px;
          margin-bottom: 10px;
        }
        .articleTitle {
          font-size: 15px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.45;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
          /* 2줄 말줄임 */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .articleSub {
          font-size: 12.5px;
          color: #666;
          line-height: 1.55;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .articleMeta {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: #888;
        }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
          color: #fff;
          border-radius: 16px;
          padding: 32px 28px;
          text-align: center;
          margin-top: 40px;
        }
        @media (max-width: 600px) {
          .cta { padding: 24px 18px; }
        }
        .ctaTitle {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 10px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) { .ctaTitle { font-size: 17px; } }
        .ctaSub {
          font-size: 13.5px;
          margin: 0 0 18px;
          opacity: 0.85;
          line-height: 1.6;
        }
        .ctaBtn {
          display: inline-block;
          padding: 12px 28px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
        }
        .ctaBtn:hover {
          background: #d97155;
          transform: translateY(-2px);
        }

        /* ============================================ */
        /* 🎯 시니어 모바일 최적화 (v6.3.0) */
        /* ============================================ */
        @media (max-width: 600px) {
          /* 헤더 폰트 키우기 */
          .title { font-size: 22px !important; line-height: 1.4 !important; }
          .sub { font-size: 14.5px !important; line-height: 1.7 !important; }
          .pageBadge { font-size: 12px !important; padding: 6px 14px !important; }

          /* 카테고리 탭 - 모바일 가로 스크롤 */
          .categoryTabs {
            grid-template-columns: repeat(5, minmax(85px, 1fr)) !important;
            overflow-x: auto;
            padding: 12px 8px !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .categoryTab {
            scroll-snap-align: start;
            padding: 12px 6px 10px !important;
            min-width: 85px;
          }
          .categoryTabEmoji { font-size: 24px !important; }
          .categoryTabLabel { font-size: 12px !important; }
          .categoryTabCount { font-size: 10.5px !important; padding: 1px 6px !important; }

          /* 추천 카드 시니어 친화 */
          .featuredCard {
            padding: 18px 18px !important;
            min-height: 130px;
          }
          .featuredCardTitle { 
            font-size: 17px !important; 
            line-height: 1.4 !important;
            margin-bottom: 10px !important;
          }
          .featuredCardSub { 
            font-size: 14.5px !important; 
            line-height: 1.65 !important;
          }
          .featuredCardMeta { font-size: 12px !important; }

          /* 일반 글 카드 */
          .articleCard {
            padding: 16px 16px !important;
            min-height: 110px;
          }
          .articleCardTitle { 
            font-size: 16px !important; 
            line-height: 1.45 !important;
          }
          .articleCardSub { 
            font-size: 13.5px !important; 
            line-height: 1.65 !important;
          }

          /* 섹션 제목 */
          .sectionTitle { font-size: 18px !important; }

          /* CTA 버튼 시니어 친화 */
          .ctaBtn {
            font-size: 16px !important;
            padding: 16px 28px !important;
            min-height: 52px;
            min-width: 220px;
          }

          /* 페이지 여백 */
          .page { padding: 22px 14px 50px !important; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>노하우</span>
        </nav>

        <header className="header">
          <span className="pageBadge">{currentGroup.emoji} {currentGroup.label}</span>
          <h1 className="title">시니어층을 위한<br />{currentGroup.label}</h1>
          <p className="sub">
            {currentGroup.desc}<br />
            현재 {filteredArticles.length}편 · 매주 새 가이드 추가
          </p>
        </header>

        {/* 카테고리 탭 */}
        <div className="categoryTabs">
          {Object.entries(groupLabels).map(([key, info]) => (
            <Link
              key={key}
              href={key === 'all' ? '/blog' : `/blog?cat=${key}`}
              className={`categoryTab ${activeGroup === key ? 'active' : ''}`}
            >
              <span className="categoryTabEmoji">{info.emoji}</span>
              <span className="categoryTabLabel">{info.label}</span>
              <span className="categoryTabCount">
                {key === 'all' ? ARTICLES.length : ARTICLES.filter(a => a.group === key).length}
              </span>
            </Link>
          ))}
        </div>

        {/* 추천 콘텐츠 */}
        <section className="featuredSection">
          <h2 className="sectionTitle">⭐ 추천 노하우</h2>
          <div className="featuredGrid">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/knowhow/${article.slug}`}
                className="featuredCard"
              >
                <span className="featuredBadge">{article.categoryEmoji} {article.category}</span>
                <h3 className="featuredCardTitle">{article.title}</h3>
                <p className="featuredCardSub">{article.subtitle}</p>
                <div className="featuredCardMeta">
                  <span>📅 {article.publishDate}</span>
                  <span>⏱️ {article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="adArea">
          <AdSlot slot="blog-mid" variant="horizontal" />
        </div>

        {/* 전체 노하우 */}
        <section>
          <h2 className="sectionTitle">📖 전체 노하우</h2>
          <div className="articlesGrid">
            {regularArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/knowhow/${article.slug}`}
                className="articleCard"
              >
                <span className="categoryChip">
                  {article.categoryEmoji} {article.category}
                </span>
                <h3 className="articleTitle">{article.title}</h3>
                <p className="articleSub">{article.subtitle}</p>
                <div className="articleMeta">
                  <span>📅 {article.publishDate}</span>
                  <span>⏱️ {article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta">
          <h3 className="ctaTitle">🚀 노하우만 읽지 말고 직접 만들어보세요</h3>
          <p className="ctaSub">
            키워드만 입력하면 AI가 영상 자료를 자동으로 만들어드립니다.<br />
            완전 무료, 회원가입 불필요.
          </p>
          <Link href="/create" className="ctaBtn">
            ✨ 영상 만들기 시작 →
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>가이드 불러오는 중...</div>}>
      <BlogPageInner />
    </Suspense>
  );
}
