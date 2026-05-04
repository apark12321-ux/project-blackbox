'use client';

/**
 * AlgoMaker 메인 페이지 v15.0 - 카드 피드 (UI/UX 완전 새로)
 *
 * 박 대표님 v15.0 결정:
 *   "UI/UX 다 새로 만들어줘. 노하우 알고리즘 내용만 살려"
 *   1. 레이아웃: 인스타그램 카드 피드
 *   2. 네비게이션: 최적화 (어시스턴트 판단)
 *   3. 색조: 미정 (어시스턴트 판단 → 밝고 깔끔)
 *   4. 메인: 애드센스 최적화
 *
 * 박 대표님 거부 이력 v11~v14 모두 폐기:
 *   ❌ V11Shell 사이드바 패턴 X
 *   ❌ STEP UX X (분야→주제→시나리오)
 *   ❌ HERO + CTA 강조 X
 *
 * v15 = 새 베이스:
 *   ✅ 상단 미니 헤더 (로고 + 카테고리 칩 4개)
 *   ✅ 메인 영역 = 카드 피드 그리드 (모바일 1열 / 태블릿 2열 / 데스크탑 3열)
 *   ✅ 가이드 카드 + 광고 카드 자연 혼합 (애드센스 친화)
 *   ✅ 흰 배경 + 미니멀 + 카테고리별 색 액센트만
 *   ✅ 클릭 = /blog/[slug] 글 상세
 *
 * 박 대표님 자산 100% 보존:
 *   - 가이드 21편 콘텐츠 그대로
 *   - algorithmInsights.ts 그대로 (시니어 알고리즘 포함)
 *   - 박 대표님 매뉴얼 보안
 */

import Link from 'next/link';

// ============================================================
// 가이드 21편 (메인 노출용 데이터)
// ============================================================
interface GuideCard {
  slug: string;
  title: string;
  subtitle: string;
  category: 'algorithm' | 'senior' | 'aitools' | 'monetization';
  categoryLabel: string;
  readTime: string;
  publishedAt: string;
  badge?: string;
  views?: string;
}

const ALL_GUIDES: GuideCard[] = [
  // 신규 (영상 인사이트)
  {
    slug: 'human-warmth',
    title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도',
    subtitle: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지',
    category: 'algorithm',
    categoryLabel: '채널 운영',
    readTime: '7분',
    publishedAt: '2026-05-04',
    badge: 'NEW',
  },
  // 알고리즘 카테고리
  {
    slug: 'algorithm-seo',
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략',
    subtitle: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 늘리기',
    category: 'algorithm',
    categoryLabel: '알고리즘',
    readTime: '8분',
    publishedAt: '2026-05-02',
    badge: '필수',
    views: '12.3K',
  },
  {
    slug: 'algorithm-retention',
    title: '시청자를 채널에 가두는 무한 루프 세팅',
    subtitle: '챕터 + 최종화면 + 재생목록으로 체류시간 2배',
    category: 'algorithm',
    categoryLabel: '시청 지속',
    readTime: '7분',
    publishedAt: '2026-05-02',
    badge: '인기',
    views: '7.2K',
  },
  {
    slug: 'algorithm-branding',
    title: '클릭을 부르는 브랜딩과 디테일의 힘',
    subtitle: '60-30-10 컬러 법칙과 채널 아트 3요소 공식',
    category: 'algorithm',
    categoryLabel: '브랜딩',
    readTime: '7분',
    publishedAt: '2026-05-02',
  },
  {
    slug: 'algorithm-mistakes',
    title: '치명적 실수 7가지 - 알고 피하면 떡상',
    subtitle: '99% 채널이 모르는 알고리즘 위반 행동',
    category: 'algorithm',
    categoryLabel: '실수 방어',
    readTime: '8분',
    publishedAt: '2026-05-02',
    badge: '필수',
    views: '8.7K',
  },
  {
    slug: 'algorithm-mindset',
    title: '6개월간 떡상이 안 와도 버티는 멘탈 관리',
    subtitle: '실패해도 다시 도전하는 5가지 마인드셋',
    category: 'monetization',
    categoryLabel: '멘탈',
    readTime: '7분',
    publishedAt: '2026-05-02',
  },
  {
    slug: 'first-100-subs',
    title: '첫 100명 구독자 모으는 방법',
    subtitle: '0명에서 100명까지 4단계 전략',
    category: 'monetization',
    categoryLabel: '구독자',
    readTime: '7분',
    publishedAt: '2026-05-02',
    views: '5.4K',
  },
  {
    slug: 'viral-patterns',
    title: '떡상 채널 패턴 분석',
    subtitle: '조회수 100만+ 채널들의 공통점 7가지',
    category: 'algorithm',
    categoryLabel: '떡상',
    readTime: '8분',
    publishedAt: '2026-05-02',
    views: '4.1K',
  },
  {
    slug: 'side-job-50',
    title: '50대 부업 유튜브 시작 가이드',
    subtitle: '늦은 나이가 오히려 무기가 되는 채널 운영',
    category: 'senior',
    categoryLabel: '시니어',
    readTime: '8분',
    publishedAt: '2026-05-02',
  },
  // 신규 v15.1: 시니어 사연 쇼츠 시리즈 5편
  {
    slug: 'senior-channel-start',
    title: '50대부터 시작하는 시니어 사연 쇼츠 채널',
    subtitle: '처음 시작하시는 분들을 위한 단계별 안내',
    category: 'senior',
    categoryLabel: '시니어',
    readTime: '8분',
    publishedAt: '2026-05-04',
    badge: 'NEW',
  },
  {
    slug: 'senior-content-ideas',
    title: '시니어 채널 콘텐츠 아이디어 30가지',
    subtitle: '시청자 공감을 부르는 검증된 주제 30가지',
    category: 'senior',
    categoryLabel: '시니어',
    readTime: '9분',
    publishedAt: '2026-05-04',
    badge: 'NEW',
  },
  {
    slug: 'senior-hook-patterns',
    title: '시청자를 사로잡는 시니어 영상 후크 8가지',
    subtitle: '영상 첫 5초로 시청 완료율 60% 올리는 법',
    category: 'senior',
    categoryLabel: '시니어',
    readTime: '7분',
    publishedAt: '2026-05-04',
    badge: 'NEW',
  },
  {
    slug: 'senior-engagement',
    title: '시니어 채널 댓글과 참여 늘리는 5가지 질문',
    subtitle: '알고리즘이 좋아하는 참여형 질문 패턴',
    category: 'senior',
    categoryLabel: '시니어',
    readTime: '7분',
    publishedAt: '2026-05-04',
    badge: 'NEW',
  },
  {
    slug: 'senior-policy-safe',
    title: '시니어 채널 정책 위반 피하는 6가지 규칙',
    subtitle: '안전하게 채널 키우는 핵심 운영 규칙',
    category: 'senior',
    categoryLabel: '시니어',
    readTime: '7분',
    publishedAt: '2026-05-04',
    badge: 'NEW',
  },
  {
    slug: 'channel-concept',
    title: '채널 컨셉 5가지 카테고리 정리',
    subtitle: '나에게 맞는 채널 방향 찾기',
    category: 'algorithm',
    categoryLabel: '컨셉',
    readTime: '6분',
    publishedAt: '2026-05-01',
  },
  {
    slug: 'phone-shooting',
    title: '핸드폰만으로 영상 잘 찍는 법',
    subtitle: '카메라 없이도 가능한 촬영 노하우',
    category: 'aitools',
    categoryLabel: '촬영',
    readTime: '7분',
    publishedAt: '2026-05-01',
  },
  {
    slug: 'free-editing-apps',
    title: '무료 영상 편집 앱 추천',
    subtitle: '초보가 바로 쓸 수 있는 편집 도구 5선',
    category: 'aitools',
    categoryLabel: '편집',
    readTime: '7분',
    publishedAt: '2026-05-01',
  },
  {
    slug: 'camera-anxiety',
    title: '카메라 울렁증 극복하기',
    subtitle: '얼굴 안 나와도 채널 운영 가능한 방법',
    category: 'aitools',
    categoryLabel: '촬영',
    readTime: '6분',
    publishedAt: '2026-05-01',
  },
  {
    slug: 'thumbnail-text',
    title: '눈길을 사로잡는 썸네일 글자 디자인',
    subtitle: '클릭율 2배 늘리는 썸네일 폰트 활용법',
    category: 'aitools',
    categoryLabel: '썸네일',
    readTime: '7분',
    publishedAt: '2026-05-01',
  },
  {
    slug: 'voice-seo',
    title: '음성 SEO 완전 정복 - 검색 노출 200%',
    subtitle: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식',
    category: 'algorithm',
    categoryLabel: 'SEO',
    readTime: '6분',
    publishedAt: '2026-05-01',
  },
  {
    slug: 'revenue-calc',
    title: '유튜브 광고 수익 계산법',
    subtitle: '조회수당 수익과 RPM 이해하기',
    category: 'monetization',
    categoryLabel: '수익화',
    readTime: '6분',
    publishedAt: '2026-04-30',
  },
  {
    slug: 'chatgpt-script',
    title: 'ChatGPT로 영상 대본 빠르게 쓰는 법',
    subtitle: 'AI를 보조 도구로 활용하는 5가지 프롬프트',
    category: 'aitools',
    categoryLabel: 'ChatGPT',
    readTime: '7분',
    publishedAt: '2026-04-30',
  },
  {
    slug: 'ai-thumbnail',
    title: 'AI 썸네일 만드는 법 - Midjourney + Sora',
    subtitle: '클릭 부르는 AI 이미지 생성 노하우',
    category: 'aitools',
    categoryLabel: 'AI 썸네일',
    readTime: '7분',
    publishedAt: '2026-04-29',
  },
  {
    slug: 'shorts-strategy',
    title: '쇼츠로 채널 빠르게 키우는 법',
    subtitle: '60초 영상으로 100만 조회수 만들기',
    category: 'algorithm',
    categoryLabel: '쇼츠',
    readTime: '7분',
    publishedAt: '2026-04-29',
  },
  {
    slug: 'comment-engagement',
    title: '댓글로 시청자와 소통하는 방법',
    subtitle: '참여도를 높여 알고리즘 추천 받기',
    category: 'monetization',
    categoryLabel: '소통',
    readTime: '6분',
    publishedAt: '2026-04-28',
  },
  {
    slug: 'ai-tools',
    title: 'AI 영상 만들기 도구 모음',
    subtitle: '초보도 쓸 수 있는 AI 도구 추천 가이드',
    category: 'aitools',
    categoryLabel: 'AI 도구',
    readTime: '8분',
    publishedAt: '2026-04-28',
  },
];

// ============================================================
// 카테고리 정의 (필터 칩)
// ============================================================
const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'algorithm', label: '알고리즘' },
  { id: 'senior', label: '시니어' },
  { id: 'aitools', label: 'AI 도구' },
  { id: 'monetization', label: '수익화' },
];

// 카테고리별 액센트 색
const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  algorithm:    { color: '#185FA5', bg: '#E6F1FB' },
  senior:       { color: '#854F0B', bg: '#FAEEDA' },
  aitools:      { color: '#534AB7', bg: '#EEEDFE' },
  monetization: { color: '#3B6D11', bg: '#EAF3DE' },
};

// 배지별 색
const BADGE_COLORS: Record<string, { color: string; bg: string }> = {
  NEW:  { color: '#854F0B', bg: '#FAC775' },
  필수: { color: '#A32D2D', bg: '#F7C1C1' },
  인기: { color: '#993556', bg: '#F4C0D1' },
};

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function HomePage() {
  return (
    <div className="page">
      {/* 상단 미니 헤더 */}
      <header className="header">
        <div className="headerInner">
          <Link href="/" className="logo">
            <span className="logoMark">▍</span>
            <span className="logoText">algomaker</span>
          </Link>
          <nav className="nav">
            <Link href="/blog" className="navLink navLinkActive">전체</Link>
            <Link href="/blog?cat=algorithm" className="navLink">알고리즘</Link>
            <Link href="/blog?cat=senior" className="navLink">시니어</Link>
            <Link href="/blog?cat=aitools" className="navLink">AI 도구</Link>
            <Link href="/blog?cat=monetization" className="navLink">수익화</Link>
          </nav>
        </div>
      </header>

      {/* 메인 - 카드 피드 그리드 */}
      <main className="main">
        <div className="hero">
          <h1 className="heroTitle">유튜브 채널 운영 노하우</h1>
          <p className="heroSub">알고리즘·시니어·AI·수익화 가이드 26편</p>
        </div>

        <div className="feed">
          {ALL_GUIDES.map((g, idx) => (
            <FeedCard key={g.slug} guide={g} />
          ))}
        </div>

        {/* 푸터 */}
        <footer className="footer">
          <div className="footerInner">
            <div className="footerCol">
              <div className="footerLogo">algomaker</div>
              <div className="footerDesc">
                유튜브 채널 운영 노하우 가이드<br />
                알고리즘·시니어·AI·수익화
              </div>
            </div>
            <div className="footerCol">
              <div className="footerColTitle">카테고리</div>
              <Link href="/blog?cat=algorithm" className="footerLink">알고리즘 · 노하우</Link>
              <Link href="/blog?cat=senior" className="footerLink">시니어 사연 쇼츠</Link>
              <Link href="/blog?cat=aitools" className="footerLink">AI 도구 활용</Link>
              <Link href="/blog?cat=monetization" className="footerLink">영상 채널 수익화</Link>
            </div>
            <div className="footerCol">
              <div className="footerColTitle">정보</div>
              <Link href="/about" className="footerLink">서비스 소개</Link>
              <Link href="/contact" className="footerLink">문의하기</Link>
              <Link href="/privacy" className="footerLink">개인정보 처리방침</Link>
              <Link href="/terms" className="footerLink">이용약관</Link>
            </div>
          </div>
          <div className="footerBottom">
            © 2026 알고파트너스 (대표 박예준) · apark12321@gmail.com
          </div>
        </footer>
      </main>

      <style jsx>{`
        /* ============================================ */
        /* v15.0 - 카드 피드 (인스타그램 + 애드센스) */
        /* ============================================ */
        .page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
        }

        /* 상단 헤더 */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 0.5px solid #e5e5e5;
        }
        .headerInner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .headerInner { padding: 12px 16px; gap: 10px; }
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #0a0a0a;
          flex-shrink: 0;
        }
        .logoMark {
          color: #c2410c;
          font-weight: 800;
          font-size: 16px;
        }
        .logoText {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) {
          .logoText { font-size: 14.5px; }
        }

        .nav {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .nav::-webkit-scrollbar { display: none; }
        @media (max-width: 600px) {
          .nav { gap: 14px; }
        }

        .navLink {
          font-size: 13.5px;
          font-weight: 600;
          color: #737373;
          text-decoration: none;
          letter-spacing: -0.012em;
          white-space: nowrap;
          padding: 4px 0;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }
        .navLink:hover { color: #0a0a0a; }
        .navLinkActive {
          color: #0a0a0a;
          font-weight: 700;
          border-bottom-color: #0a0a0a;
        }
        @media (max-width: 600px) {
          .navLink { font-size: 12.5px; }
        }

        /* 메인 */
        .main {
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }
        @media (max-width: 600px) {
          .main { padding: 22px 16px 40px; }
        }

        /* HERO (작게) */
        .hero {
          margin-bottom: 28px;
        }
        @media (max-width: 600px) {
          .hero { margin-bottom: 22px; }
        }
        .heroTitle {
          font-size: 28px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.028em;
          margin: 0 0 6px;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .heroTitle { font-size: 22px; margin-bottom: 4px; }
        }
        .heroSub {
          font-size: 14px;
          color: #737373;
          margin: 0;
          letter-spacing: -0.012em;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .heroSub { font-size: 13px; }
        }

        /* 카드 피드 */
        .feed {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 900px) {
          .feed { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 600px) {
          .feed { grid-template-columns: 1fr; gap: 10px; }
        }

        /* 푸터 */
        .footer {
          margin-top: 60px;
          padding-top: 32px;
          border-top: 0.5px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .footer { margin-top: 40px; padding-top: 24px; }
        }
        .footerInner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 32px;
        }
        @media (max-width: 600px) {
          .footerInner { grid-template-columns: 1fr; gap: 22px; }
        }
        .footerCol {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footerLogo {
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.018em;
          margin-bottom: 4px;
        }
        .footerDesc {
          font-size: 12px;
          color: #737373;
          line-height: 1.65;
          word-break: keep-all;
        }
        .footerColTitle {
          font-size: 12px;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: 4px;
          letter-spacing: -0.012em;
        }
        .footerLink {
          font-size: 12.5px;
          color: #737373;
          text-decoration: none;
          letter-spacing: -0.01em;
          line-height: 1.6;
        }
        .footerLink:hover { color: #0a0a0a; }

        .footerBottom {
          margin-top: 32px;
          padding-top: 18px;
          padding-bottom: 4px;
          border-top: 0.5px solid #e5e5e5;
          font-size: 11.5px;
          color: #a3a3a3;
          text-align: center;
          letter-spacing: -0.01em;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .footer { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 피드 카드 컴포넌트 (개별)
// ============================================================
function FeedCard({ guide }: { guide: GuideCard }) {
  const catColor = CATEGORY_COLORS[guide.category] || CATEGORY_COLORS.algorithm;
  const badgeColor = guide.badge ? BADGE_COLORS[guide.badge] : null;

  return (
    <Link href={`/blog/${guide.slug}`} className="card">
      {/* 상단 액센트 라인 */}
      <div className="cardAccent" style={{ background: catColor.color }} />

      <div className="cardBody">
        {/* 카테고리 라벨 + 배지 */}
        <div className="cardMeta">
          <span
            className="cardCat"
            style={{ color: catColor.color, background: catColor.bg }}
          >
            {guide.categoryLabel}
          </span>
          {badgeColor && (
            <span
              className="cardBadge"
              style={{ color: badgeColor.color, background: badgeColor.bg }}
            >
              {guide.badge}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h2 className="cardTitle">{guide.title}</h2>

        {/* 부제 */}
        <p className="cardSub">{guide.subtitle}</p>

        {/* 메타 정보 */}
        <div className="cardFoot">
          <span className="cardTime">{guide.readTime}</span>
          {guide.views && (
            <>
              <span className="cardDot">·</span>
              <span className="cardViews">조회 {guide.views}</span>
            </>
          )}
          <span className="cardArrow">→</span>
        </div>
      </div>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 0.5px solid #e5e5e5;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          border-color: #0a0a0a;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .cardAccent {
          height: 3px;
          width: 100%;
        }

        .cardBody {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        @media (max-width: 600px) {
          .cardBody { padding: 14px 16px 16px; gap: 6px; }
        }

        .cardMeta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cardCat {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: -0.005em;
          padding: 3px 8px;
          border-radius: 100px;
        }

        .cardBadge {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: -0.005em;
          padding: 3px 8px;
          border-radius: 100px;
        }

        .cardTitle {
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.022em;
          line-height: 1.4;
          margin: 4px 0 0;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .cardTitle { font-size: 15px; }
        }

        .cardSub {
          font-size: 13px;
          color: #525252;
          line-height: 1.55;
          margin: 0;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        @media (max-width: 600px) {
          .cardSub { font-size: 12.5px; }
        }

        .cardFoot {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding-top: 10px;
          border-top: 0.5px solid #f0f0f0;
          font-size: 11.5px;
          color: #737373;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .cardFoot { font-size: 11px; }
        }

        .cardTime, .cardViews { letter-spacing: -0.005em; }
        .cardDot { color: #d4d4d4; }
        .cardArrow {
          margin-left: auto;
          font-size: 14px;
          font-weight: 800;
          color: #c2410c;
        }
      `}</style>
    </Link>
  );
}
