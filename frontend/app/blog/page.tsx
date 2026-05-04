'use client';
/**
 * /blog 페이지 v4 - 박 대표님 4개 시주제 카테고리 필터
 *
 * 박 대표님 v4 결정:
 *   "애드센스 주제 일관성 = 4개 시주제로 통합"
 *   1. 알고리즘·노하우 (algorithm + channel)
 *   2. 시니어 사연 쇼츠 (신규 senior 시리즈)
 *   3. AI 도구 (creation + tools)
 *   4. 수익화 (monetization + mindset)
 *
 * v4 변경 (v3 → v4):
 *  ✅ CATEGORIES 6개 → 박 대표님 4개로 통합
 *  ✅ CATEGORY_MAP 매핑 (UI 4개 → 내부 6개)
 *  ✅ URL ?cat= 파라미터 받기 (메인 카테고리 카드 호환)
 *  ✅ 필터 변경 시 URL 자동 업데이트
 *
 * 박 대표님 자산 100% 보존:
 *  - GUIDES 데이터 그대로
 *  - 기존 카테고리 (algorithm/channel/creation/tools/monetization/mindset) 유지
 *  - 가이드 글 모두 그대로
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';

// ============================================================
// 가이드 목록 (17편)
// 박 대표님 자산 + 알고리즘 가이드 5편
// ============================================================
interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  category: 'algorithm' | 'creation' | 'tools' | 'mindset' | 'channel' | 'monetization';
  categoryLabel: string;
  emoji: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  blogPath?: boolean;
  badge?: string;
}

const GUIDES: Guide[] = [
  // ============================================================
  // 알고리즘 가이드 5편 (박 대표님 자료 기반)
  // ============================================================
  {
    slug: 'algorithm-seo',
    blogPath: true,
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략',
    subtitle: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 늘리기',
    category: 'algorithm',
    categoryLabel: '알고리즘',
    emoji: '🔍',
    readTime: '8분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '필수',
  },
  {
    slug: 'algorithm-retention',
    blogPath: true,
    title: '시청자를 채널에 가두는 무한 루프 세팅',
    subtitle: '챕터 + 최종화면 + 재생목록으로 체류시간 2배',
    category: 'algorithm',
    categoryLabel: '알고리즘',
    emoji: '⏱',
    readTime: '7분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '인기',
  },
  {
    slug: 'algorithm-branding',
    blogPath: true,
    title: '클릭을 부르는 브랜딩과 디테일의 힘',
    subtitle: '60-30-10 컬러 법칙과 채널 아트 3요소 공식',
    category: 'algorithm',
    categoryLabel: '알고리즘',
    emoji: '🎨',
    readTime: '7분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
  },
  {
    slug: 'algorithm-mistakes',
    blogPath: true,
    title: '떡상을 가로막는 치명적 실수 방어하기',
    subtitle: '아동용 함정과 1시간 대기 공개의 비밀',
    category: 'algorithm',
    categoryLabel: '알고리즘',
    emoji: '⚠️',
    readTime: '6분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '주의',
  },
  {
    slug: 'algorithm-mindset',
    blogPath: true,
    title: '유튜버 멘탈 서바이벌과 복리 성장',
    subtitle: '슬럼프 견디기와 VIP 댓글로 찐팬 만들기',
    category: 'mindset',
    categoryLabel: '멘탈',
    emoji: '💪',
    readTime: '6분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
  },

  // ============================================================
  // 신규 10편 (2026-05-02)
  // ============================================================
  {
    slug: 'first-100-subs',
    blogPath: true,
    title: '첫 100명 구독자 모으는 실전 전략',
    subtitle: '30일 안에 첫 100명 모으는 5단계 + 흔한 실수 5가지',
    category: 'channel',
    categoryLabel: '채널 운영',
    emoji: '🎯',
    readTime: '9분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'viral-patterns',
    blogPath: true,
    title: '떡상 채널 5가지 공통 패턴',
    subtitle: '구독자 1만명 채널들의 공통점 분석',
    category: 'channel',
    categoryLabel: '채널 운영',
    emoji: '🔥',
    readTime: '8분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'side-job-50',
    blogPath: true,
    title: '50대 이후 부업 유튜브 시작하는 법',
    subtitle: '퇴직 전후 인생 경험을 자산으로 만드는 5단계',
    category: 'channel',
    categoryLabel: '채널 운영',
    emoji: '👔',
    readTime: '9분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'channel-concept',
    blogPath: true,
    title: '영상 컨셉 정하기 5단계 워크시트',
    subtitle: '본인만의 채널 정체성 찾는 워크시트',
    category: 'channel',
    categoryLabel: '채널 운영',
    emoji: '🎯',
    readTime: '8분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'phone-shooting',
    blogPath: true,
    title: '핸드폰만으로 영상 찍는 5가지 꿀팁',
    subtitle: '비싼 카메라 X. 핸드폰 1대로 충분합니다',
    category: 'creation',
    categoryLabel: '영상 제작',
    emoji: '📱',
    readTime: '7분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'free-editing-apps',
    blogPath: true,
    title: '영상 편집 무료 앱 4개 비교',
    subtitle: 'CapCut, VLLO, KineMaster, InShot 솔직 비교',
    category: 'creation',
    categoryLabel: '영상 제작',
    emoji: '✂️',
    readTime: '8분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'camera-anxiety',
    blogPath: true,
    title: '카메라 울렁증 극복 5가지 방법',
    subtitle: '1주일 안에 자연스럽게 말하는 실전 5가지',
    category: 'creation',
    categoryLabel: '영상 제작',
    emoji: '🎤',
    readTime: '7분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'chatgpt-script',
    blogPath: true,
    title: 'ChatGPT로 영상 대본 쓰는 법',
    subtitle: '시니어 친화 프롬프트 7가지 템플릿',
    category: 'tools',
    categoryLabel: 'AI 도구',
    emoji: '🤖',
    readTime: '9분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'ai-thumbnail',
    blogPath: true,
    title: 'AI 썸네일 만드는 도구 5개 비교',
    subtitle: 'Canva, 미리캔버스, Midjourney, DALL-E 비교',
    category: 'tools',
    categoryLabel: 'AI 도구',
    emoji: '🎨',
    readTime: '8분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },
  {
    slug: 'revenue-calc',
    blogPath: true,
    title: '유튜브 광고 수익 실수령액 계산법',
    subtitle: '세금·환율·수수료 모두 반영한 실전 계산',
    category: 'monetization',
    categoryLabel: '수익화',
    emoji: '💰',
    readTime: '9분',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-02',
    badge: '신규',
  },

  // ============================================================
  // 박 대표님 기존 가이드 5편
  // ============================================================
  {
    slug: 'youtube-start',
    blogPath: true,
    title: '유튜브 영상 만들기 처음 시작하는 분들께',
    subtitle: '핸드폰 1대만 있으면 됩니다. 첫 영상 업로드 가이드.',
    category: 'creation',
    categoryLabel: '영상 제작',
    emoji: '🎬',
    readTime: '10분',
    publishedAt: '2026-04-15',
    updatedAt: '2026-05-01',
  },
  {
    slug: 'youtube-algorithm',
    blogPath: true,
    title: '유튜브 알고리즘 이해하기 (입문)',
    subtitle: '알고리즘이 어떻게 영상을 노출시키는지 처음부터 알기 쉽게',
    category: 'algorithm',
    categoryLabel: '알고리즘',
    emoji: '🤖',
    readTime: '9분',
    publishedAt: '2026-04-20',
    updatedAt: '2026-04-28',
  },
  {
    slug: 'thumbnail-tips',
    blogPath: true,
    title: '클릭 부르는 썸네일 만드는 비법',
    subtitle: '시선을 사로잡는 썸네일 디자인 5가지 원칙',
    category: 'creation',
    categoryLabel: '영상 제작',
    emoji: '🖼️',
    readTime: '7분',
    publishedAt: '2026-04-22',
    updatedAt: '2026-04-25',
  },
  {
    slug: 'youtube-monetization',
    blogPath: true,
    title: '유튜브 수익화 조건과 방법 정리',
    subtitle: '구독자 1,000명, 시청 시간 4,000시간 달성 전략',
    category: 'monetization',
    categoryLabel: '수익화',
    emoji: '💰',
    readTime: '11분',
    publishedAt: '2026-04-25',
    updatedAt: '2026-04-30',
  },
  {
    slug: 'ai-tools',
    blogPath: true,
    title: 'AI 영상 만들기 도구 모음',
    subtitle: '초보도 쓸 수 있는 AI 도구 추천 가이드',
    category: 'tools',
    categoryLabel: 'AI 도구',
    emoji: '🤖',
    readTime: '8분',
    publishedAt: '2026-04-28',
    updatedAt: '2026-05-01',
  },
];

// 카테고리 필터 옵션 (박 대표님 4개 시주제)
// 기존 6개 카테고리는 내부 유지, UI 노출은 4개로 통합 + 시니어 추가
const CATEGORIES = [
  { id: 'all', label: '전체', icon: '📚' },
  { id: 'algorithm', label: '알고리즘·노하우', icon: '📊' },  // algorithm + channel
  { id: 'senior', label: '시니어 사연 쇼츠', icon: '👔' },     // 신규 (시니어 시리즈)
  { id: 'aitools', label: 'AI 도구', icon: '🤖' },             // creation + tools
  { id: 'monetization', label: '수익화', icon: '💰' },         // monetization + mindset
];

// 박 대표님 4개 시주제 → 기존 카테고리 매핑
const CATEGORY_MAP: Record<string, string[]> = {
  all: ['algorithm', 'channel', 'creation', 'tools', 'mindset', 'monetization', 'senior'],
  algorithm: ['algorithm', 'channel'],          // 알고리즘 + 채널 운영
  senior: ['senior'],                            // 시니어 시리즈 (앞으로 추가)
  aitools: ['creation', 'tools'],                // 영상 제작 + AI 도구
  monetization: ['monetization', 'mindset'],     // 수익화 + 멘탈
};

// ============================================================
// JSON-LD: CollectionPage + ItemList (SEO 친화)
// ============================================================
const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AlgoMaker 가이드 모음',
  description: '영상 만들기 노하우 20편 - 알고리즘, 채널 운영, 영상 제작, AI 도구, 수익화, 멘탈까지',
  url: 'https://nutube.kr/blog',
  inLanguage: 'ko',
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AlgoMaker 영상 만들기 가이드',
  itemListElement: GUIDES.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Article',
      name: g.title,
      headline: g.title,
      description: g.subtitle,
      url: `https://nutube.kr/blog/${g.slug}`,
      datePublished: g.publishedAt,
      dateModified: g.updatedAt,
      inLanguage: 'ko',
    },
  })),
};

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function BlogListPage() {
  // URL ?cat=알고리즘|senior|aitools|monetization 받기
  const [filter, setFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('cat') || 'all';
      // 유효한 카테고리만 적용
      return CATEGORY_MAP[cat] ? cat : 'all';
    }
    return 'all';
  });

  const filteredGuides = useMemo(() => {
    if (filter === 'all') return GUIDES;
    const allowedCategories = CATEGORY_MAP[filter] || [filter];
    return GUIDES.filter(g => allowedCategories.includes(g.category));
  }, [filter]);

  // 필터 변경 시 URL 업데이트
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newFilter === 'all') {
        url.searchParams.delete('cat');
      } else {
        url.searchParams.set('cat', newFilter);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <V11Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <style jsx>{`
        .blog {
          max-width: 880px;
          margin: 0 auto;
          padding: 28px 24px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .blog { padding: 22px 16px 50px; }
        }

        /* HEADER */
        .blogHeader {
          padding-bottom: 18px;
          border-bottom: 2px solid #0a0a0a;
          margin-bottom: 22px;
        }

        .blogKicker {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .blogKicker { font-size: 11.5px; } }

        .blogTitle {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          margin: 0 0 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .blogTitle { font-size: 28px; } }

        .blogSub {
          font-size: 17px;
          color: #525252;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .blogSub { font-size: 15.5px; } }

        .blogMeta {
          display: flex;
          gap: 12px;
          margin-top: 10px;
          font-size: 14px;
          color: #737373;
          font-family: 'SF Mono', 'Consolas', monospace;
          flex-wrap: wrap;
        }

        /* FILTER */
        .filterRow {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
        }
        @media (max-width: 600px) {
          .filterRow { gap: 5px; margin-bottom: 16px; }
        }

        .filterBtn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          color: #525252;
          letter-spacing: -0.005em;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .filterBtn { padding: 9px 13px; font-size: 14px; }
        }
        .filterBtn:hover {
          background: #fafafa;
          border-color: #0a0a0a;
        }
        .filterBtn.active {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }
        .filterCount {
          font-size: 10.5px;
          font-weight: 700;
          color: #a3a3a3;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        .filterBtn.active .filterCount { color: #fbbf24; }

        /* LIST */
        .guideList {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .guideItem {
          display: grid;
          grid-template-columns: 60px 1fr 90px;
          gap: 16px;
          padding: 22px 8px;
          border-bottom: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: background 0.15s;
          align-items: center;
        }
        .guideItem:hover {
          background: #fafafa;
        }
        .guideItem:last-child {
          border-bottom: none;
        }
        @media (max-width: 600px) {
          .guideItem {
            grid-template-columns: 44px 1fr;
            gap: 12px;
            padding: 14px 4px;
          }
        }

        .guideEmoji {
          width: 60px;
          height: 60px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .guideEmoji { width: 44px; height: 44px; font-size: 22px; }
        }

        .guideMain { min-width: 0; }

        .guideMeta {
          display: flex;
          gap: 6px;
          margin-bottom: 4px;
          align-items: center;
        }

        .guideCat {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12.5px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .guideCat { font-size: 9px; } }

        .guideBadge {
          padding: 1px 6px;
          background: #fef2f2;
          color: #dc2626;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) { .guideBadge { font-size: 9px; } }

        .guideTitle {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.018em;
          line-height: 1.4;
          margin: 0 0 4px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guideTitle { font-size: 17px; }
        }

        .guideSub {
          font-size: 15px;
          color: #737373;
          line-height: 1.55;
          margin: 0 0 6px;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .guideSub { font-size: 14px; }
        }

        .guideStats {
          display: flex;
          gap: 10px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 13px;
          color: #a3a3a3;
          letter-spacing: 0.02em;
        }
        @media (max-width: 600px) {
          .guideStats { font-size: 12px; gap: 8px; }
        }

        .guideStatsItem {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        /* 우측: 발행일 + 화살표 (데스크탑만) */
        .guideRight {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          color: #737373;
          letter-spacing: 0.02em;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .guideRight { display: none; }
        }

        .guideDate {
          font-weight: 700;
          color: #525252;
        }

        .guideUpdated {
          color: #16a34a;
          font-weight: 600;
        }

        .guideArrow {
          font-size: 14px;
          font-weight: 700;
          color: #c2410c;
          margin-top: 4px;
        }

        /* EMPTY */
        .emptyState {
          padding: 50px 20px;
          text-align: center;
          color: #737373;
          font-size: 14px;
        }
      `}</style>

      <div className="blog">
        <div className="blogHeader">
          <div className="blogKicker">▍ KNOWLEDGE BASE</div>
          <h1 className="blogTitle">영상 만들기 가이드 모음</h1>
          <p className="blogSub">
            영상 처음 시작하시는 분부터 알고리즘 마스터까지.
            검색엔진 최적화, 채널 운영, 영상 제작, AI 도구, 수익화 등 실전 노하우 {GUIDES.length}편.
          </p>
          <div className="blogMeta">
            <span>📚 {GUIDES.length}편</span>
            <span>·</span>
            <span>📅 최종 업데이트 {formatDate('2026-05-02')}</span>
            <span>·</span>
            <span>🆓 모두 무료</span>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="filterRow">
          {CATEGORIES.map((c) => {
            const count = c.id === 'all'
              ? GUIDES.length
              : GUIDES.filter(g => g.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                className={`filterBtn ${filter === c.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(c.id)}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
                <span className="filterCount">{count}</span>
              </button>
            );
          })}
        </div>

        {/* 가이드 목록 */}
        <div className="guideList">
          {filteredGuides.length === 0 ? (
            <div className="emptyState">선택한 카테고리에 해당하는 가이드가 없습니다.</div>
          ) : (
            filteredGuides.map((g) => (
              <Link
                key={g.slug}
                href={g.blogPath ? `/blog/${g.slug}` : `/knowhow/${g.slug}`}
                className="guideItem"
              >
                <div className="guideEmoji">{g.emoji}</div>
                <div className="guideMain">
                  <div className="guideMeta">
                    <span className="guideCat">{g.categoryLabel}</span>
                    {g.badge && <span className="guideBadge">{g.badge}</span>}
                  </div>
                  <h2 className="guideTitle">{g.title}</h2>
                  <p className="guideSub">{g.subtitle}</p>
                  <div className="guideStats">
                    <span className="guideStatsItem">⏱ {g.readTime}</span>
                    <span className="guideStatsItem">📅 {formatDate(g.updatedAt)}</span>
                  </div>
                </div>
                <div className="guideRight">
                  <span className="guideDate">발행 {formatDate(g.publishedAt)}</span>
                  {g.updatedAt !== g.publishedAt && (
                    <span className="guideUpdated">✓ 업데이트 {formatDate(g.updatedAt)}</span>
                  )}
                  <span className="guideArrow">→</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </V11Shell>
  );
}
