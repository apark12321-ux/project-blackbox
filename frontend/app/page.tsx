'use client';
/**
 * AlgoMaker 메인 페이지 v14.0 - 싹 다 갈아엎음 (정보 사이트)
 *
 * 박 대표님 v14.0 결정:
 *   "이건 아닌거 같음. 메인 화면을 싹 다 갈아엎어줘"
 *
 * 박 대표님 거부 이력 정리:
 *   v11.x: 도구 중심 (5초 만에 자동 생성)
 *   v12.0: 카테고리 카드만 추가 (안 바뀜)
 *   v13.0: HERO 변경 + 보너스 표시 (이것도 아님)
 *
 * v14.0 = 처음부터 다시 설계:
 *   ✅ 정보 사이트 = 가이드/노하우 글 중심
 *   ✅ 도구 (자료 만들기) = 사이드 메뉴 (작은 영역)
 *   ✅ 분야 9개 → 주제 → 시나리오 STEP UX 제거 (메인에서)
 *   ✅ /publish 도구는 별도 페이지로 (직접 접근)
 *
 * 메인 페이지 구조 (완전 새로):
 *   1. HERO: "유튜브 채널 운영 가이드"
 *   2. 4개 시주제 카테고리 (큰 카드)
 *   3. 최신 가이드 6편
 *   4. 인기 가이드 TOP 5
 *   5. 자료 만들기 도구 안내 (작은 영역)
 *   6. FAQ
 *
 * 박 대표님 자산 100% 보존:
 *   - /publish 도구 그대로 (직접 접근 가능)
 *   - /blog 가이드 페이지 그대로
 *   - V11Shell, contentEngine, v650Adapter 모두 그대로
 *   - FEATURED_GUIDES, FAQ_LIST 데이터 그대로
 */

import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';

// ============================================================
// 박 대표님 4개 시주제 카테고리 (애드센스 주제 일관성)
// ============================================================
const CATEGORIES = [
  {
    id: 'algorithm',
    emoji: '📊',
    name: '유튜브 알고리즘 · 노하우',
    desc: '업로드 공식 11가지, SEO 최적화, 추천 알고리즘 분석',
    count: 10,
    color: '#c2410c',
    bgColor: '#fff7ed',
  },
  {
    id: 'senior',
    emoji: '👔',
    name: '시니어 사연 쇼츠',
    desc: '50~80대 타겟 채널, 사연 콘텐츠, 시니어 친화 영상',
    count: 0,
    color: '#92400e',
    bgColor: '#fef3c7',
    comingSoon: true,
  },
  {
    id: 'aitools',
    emoji: '🤖',
    name: 'AI 도구 활용',
    desc: 'Sora, VEO, ChatGPT, Midjourney 영상 제작 활용법',
    count: 8,
    color: '#7c3aed',
    bgColor: '#faf5ff',
  },
  {
    id: 'monetization',
    emoji: '💰',
    name: '영상 채널 수익화',
    desc: '채널 성장, 광고 수익, 구독자 확보, 떡상 전략',
    count: 3,
    color: '#16a34a',
    bgColor: '#f0fdf4',
  },
];

// ============================================================
// 최신 가이드 6편 (메인 노출)
// ============================================================
const FEATURED_GUIDES = [
  {
    slug: 'human-warmth',
    category: '채널 운영 · NEW',
    title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도',
    subtitle: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지',
    readTime: '7분',
    badge: 'NEW',
    emoji: '💝',
    color: '#be185d',
  },
  {
    slug: 'algorithm-seo',
    category: '알고리즘',
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략',
    subtitle: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 늘리기',
    readTime: '8분',
    badge: '필수',
    emoji: '🔍',
    color: '#c2410c',
  },
  {
    slug: 'algorithm-retention',
    category: '시청 지속',
    title: '시청자를 채널에 가두는 무한 루프 세팅',
    subtitle: '챕터 + 최종화면 + 재생목록으로 체류시간 2배',
    readTime: '7분',
    badge: '인기',
    emoji: '⏱',
    color: '#0284c7',
  },
  {
    slug: 'algorithm-mistakes',
    category: '실수 방어',
    title: '치명적 실수 7가지 - 알고 피하면 떡상',
    subtitle: '99% 채널이 모르는 알고리즘 위반 행동',
    readTime: '8분',
    badge: '필수',
    emoji: '⚠️',
    color: '#dc2626',
  },
  {
    slug: 'algorithm-mindset',
    category: '멘탈',
    title: '6개월간 떡상이 안 와도 버티는 멘탈 관리',
    subtitle: '실패해도 다시 도전하는 5가지 마인드셋',
    readTime: '7분',
    emoji: '💪',
    color: '#16a34a',
  },
  {
    slug: 'voice-seo',
    category: 'AI 도구',
    title: '음성 SEO 완전 정복 - 검색 노출 200%',
    subtitle: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식',
    readTime: '6분',
    emoji: '🎙',
    color: '#0d9488',
  },
];

// ============================================================
// 인기 가이드 TOP 5
// ============================================================
const POPULAR_GUIDES = [
  { slug: 'algorithm-seo', title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', emoji: '🔍', views: '12.3K' },
  { slug: 'algorithm-mistakes', title: '치명적 실수 7가지 - 알고 피하면 떡상', emoji: '⚠️', views: '8.7K' },
  { slug: 'algorithm-retention', title: '시청자를 채널에 가두는 무한 루프 세팅', emoji: '⏱', views: '7.2K' },
  { slug: 'voice-seo', title: '음성 SEO 완전 정복 - 검색 노출 200%', emoji: '🎙', views: '5.4K' },
  { slug: 'algorithm-branding', title: '클릭을 부르는 브랜딩과 디테일의 힘', emoji: '🎨', views: '4.1K' },
];

// ============================================================
// FAQ
// ============================================================
const FAQ_LIST = [
  {
    q: 'AlgoMaker는 어떤 사이트인가요?',
    a: 'AlgoMaker는 유튜브 채널 운영에 필요한 노하우를 정리해드리는 정보 사이트입니다. 알고리즘, 시니어 사연 쇼츠, AI 도구 활용, 채널 수익화 4개 분야의 가이드 글을 무료로 제공합니다. 추가로 영상 자료를 자동으로 만들어주는 도구도 사용하실 수 있습니다.',
  },
  {
    q: '디지털 도구가 익숙하지 않아도 사용할 수 있나요?',
    a: '네. 가이드 글은 누구나 읽을 수 있도록 쉬운 표현으로 작성되어 있습니다. 자료 만들기 도구도 클릭만으로 사용하실 수 있습니다.',
  },
  {
    q: '얼마나 다양한 가이드가 있나요?',
    a: '현재 20편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다. 알고리즘 SEO, 시청 지속률, 브랜딩, 실수 방어, AI 도구 활용 등 영상 채널 운영에 필요한 모든 주제를 다룹니다.',
  },
  {
    q: '시니어 사연 쇼츠는 어떤 콘텐츠인가요?',
    a: '50~80대 시청자를 타겟으로 한 인생 사연, 추억 회상, 가족 이야기 형식의 짧은 영상 콘텐츠입니다. 시니어 친화 영상 제작 노하우와 채널 운영 전략을 가이드로 정리해드립니다.',
  },
  {
    q: '완전 무료인가요?',
    a: '네, 회원가입도 결제도 없이 모든 기능을 무료로 사용하실 수 있습니다. 사이트는 광고 수익(Google AdSense)으로 운영됩니다.',
  },
  {
    q: '자료 만들기 도구는 어떻게 사용하나요?',
    a: '메인 페이지 하단의 "자료 만들기" 또는 상단 메뉴에서 도구를 사용하실 수 있습니다. 키워드를 입력하시면 영상 제목, 시나리오, AI 영상 프롬프트, 해시태그를 자동으로 만들어드립니다.',
  },
];

// ============================================================
// 메인 페이지 컴포넌트
// ============================================================
export default function HomePage() {
  return (
    <V11Shell>
      <main className="home">
        {/* ============================================ */}
        {/* 1. HERO - 정보 사이트 정체성 */}
        {/* ============================================ */}
        <section className="hero">
          <div className="heroInner">
            <div className="heroKicker">
              <span className="heroKickerArrow">▍</span>
              유튜브 채널 운영 정보 사이트
            </div>

            <h1 className="heroTitle">
              유튜브 채널 운영<br />
              <span className="heroTitleAccent">노하우 가이드</span>
            </h1>

            <p className="heroSub">
              알고리즘, 시니어 사연 쇼츠, AI 도구 활용, 채널 수익화까지 —<br />
              <strong>유튜브 채널 운영에 필요한 모든 노하우</strong>를 무료로 정리해드립니다.
            </p>

            <div className="heroActions">
              <Link href="#categories" className="heroBtn heroBtnPrimary">
                <span>📚 가이드 둘러보기</span>
                <span className="heroBtnArrow">→</span>
              </Link>
            </div>

            <div className="heroStats">
              <div className="heroStat">
                <div className="heroStatNum">21+</div>
                <div className="heroStatLabel">가이드</div>
              </div>
              <div className="heroStat">
                <div className="heroStatNum">4</div>
                <div className="heroStatLabel">시주제</div>
              </div>
              <div className="heroStat">
                <div className="heroStatNum">무료</div>
                <div className="heroStatLabel">전체 콘텐츠</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 2. 4개 카테고리 (메인 영역) */}
        {/* ============================================ */}
        <section id="categories" className="categories">
          <div className="sectionHead">
            <h2 className="sectionTitle">🎯 무엇을 배우시나요?</h2>
            <p className="sectionSub">관심 분야를 클릭하시면 관련 가이드만 모아보실 수 있습니다</p>
          </div>

          <div className="categoryGrid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?cat=${cat.id}`}
                className="categoryCard"
                style={{
                  '--cat-color': cat.color,
                  '--cat-bg': cat.bgColor,
                } as any}
              >
                <div className="categoryEmoji">{cat.emoji}</div>
                <div className="categoryName">{cat.name}</div>
                <div className="categoryDesc">{cat.desc}</div>
                <div className="categoryFooter">
                  {cat.comingSoon ? (
                    <span className="categoryComingSoon">🚧 가이드 작성 중</span>
                  ) : (
                    <span className="categoryCount">📖 가이드 {cat.count}편</span>
                  )}
                  <span className="categoryArrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 3. 최신 가이드 6편 */}
        {/* ============================================ */}
        <section className="latestGuides">
          <div className="sectionHead">
            <h2 className="sectionTitle">📚 최신 가이드</h2>
            <Link href="/blog" className="sectionMore">전체 21편 보기 →</Link>
          </div>

          <div className="guideGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/blog/${g.slug}`}
                className="guideCard"
              >
                <div className="guideCardAccent" style={{ background: g.color }} />
                <div className="guideCardHead">
                  <span className="guideCardEmoji">{g.emoji}</span>
                  <div className="guideCardKicker">
                    {g.category}{g.badge ? ` · ${g.badge}` : ''}
                  </div>
                </div>
                <h3 className="guideCardTitle">{g.title}</h3>
                <p className="guideCardSub">{g.subtitle}</p>
                <div className="guideCardMeta">
                  <span className="guideCardTime">⏱ {g.readTime}</span>
                  <span className="guideCardArrow">읽어보기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 4. 인기 가이드 TOP 5 */}
        {/* ============================================ */}
        <section className="popular">
          <div className="sectionHead">
            <h2 className="sectionTitle">🔥 인기 가이드 TOP 5</h2>
          </div>

          <div className="popularList">
            {POPULAR_GUIDES.map((g, i) => (
              <Link key={g.slug} href={`/blog/${g.slug}`} className="popularItem">
                <div className="popularRank">{i + 1}</div>
                <div className="popularEmoji">{g.emoji}</div>
                <div className="popularContent">
                  <div className="popularTitle">{g.title}</div>
                  <div className="popularViews">조회 {g.views}</div>
                </div>
                <div className="popularArrow">→</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 5. 자료 만들기 도구 (작은 영역) */}
        {/* ============================================ */}
        <section className="toolPromo">
          <div className="toolInner">
            <div className="toolEmoji">🛠</div>
            <div className="toolText">
              <div className="toolTitle">영상 자료 자동 만들기</div>
              <div className="toolSub">
                키워드 입력만으로 영상 제목, 시나리오, AI 영상 프롬프트, 해시태그를 자동 생성합니다.
                알고리즘 11공식이 자동 적용된 결과를 받아보세요.
              </div>
              <Link href="/publish?keyword=음식&category=food&scenario=tutorial" className="toolBtn">
                <span>도구 사용해보기</span>
                <span className="toolBtnArrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 6. FAQ */}
        {/* ============================================ */}
        <section className="faq">
          <div className="sectionHead">
            <h2 className="sectionTitle">💬 자주 묻는 질문</h2>
          </div>
          <div className="faqList">
            {FAQ_LIST.map((f, i) => (
              <details key={i} className="faqItem">
                <summary>Q. {f.q}</summary>
                <p className="faqA">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <style jsx global>{`
        /* ============================================ */
        /* v14.0 - 메인 페이지 (정보 사이트) */
        /* ============================================ */
        .home {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0;
        }

        /* ============================================ */
        /* HERO */
        /* ============================================ */
        .hero {
          padding: 60px 24px 50px;
          background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
          border-bottom: 1px solid #f5f5f5;
        }
        @media (max-width: 600px) {
          .hero { padding: 40px 16px 36px; }
        }

        .heroInner {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .heroKicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(194, 65, 12, 0.08);
          color: #c2410c;
          font-family: 'SF Mono', monospace;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          margin-bottom: 22px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .heroKicker { font-size: 11px; padding: 6px 12px; margin-bottom: 18px; }
        }
        .heroKickerArrow { color: #c2410c; font-weight: 800; }

        .heroTitle {
          font-size: 52px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.035em;
          line-height: 1.1;
          margin: 0 0 22px;
          word-break: keep-all;
        }
        @media (max-width: 800px) {
          .heroTitle { font-size: 38px; margin-bottom: 18px; }
        }
        @media (max-width: 600px) {
          .heroTitle { font-size: 30px; margin-bottom: 14px; }
        }

        .heroTitleAccent {
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .heroSub {
          font-size: 17px;
          color: #525252;
          line-height: 1.7;
          margin: 0 0 32px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .heroSub { font-size: 14px; line-height: 1.65; margin-bottom: 24px; }
        }
        .heroSub strong {
          color: #0a0a0a;
          font-weight: 700;
        }

        .heroActions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .heroActions { margin-bottom: 28px; }
        }

        .heroBtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px;
          font-family: inherit;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.018em;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
        }
        @media (max-width: 600px) {
          .heroBtn { padding: 13px 22px; font-size: 14px; }
        }

        .heroBtnPrimary {
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 
            0 4px 12px rgba(194, 65, 12, 0.25),
            0 2px 4px rgba(194, 65, 12, 0.12);
        }
        .heroBtnPrimary:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 16px rgba(194, 65, 12, 0.32),
            0 3px 6px rgba(194, 65, 12, 0.16);
        }

        .heroBtnArrow {
          font-size: 18px;
          font-weight: 800;
        }

        .heroStats {
          display: flex;
          justify-content: center;
          gap: 36px;
          flex-wrap: wrap;
          padding-top: 28px;
          border-top: 1px solid #f5f5f5;
        }
        @media (max-width: 600px) {
          .heroStats { gap: 22px; padding-top: 20px; }
        }

        .heroStat {
          text-align: center;
        }
        .heroStatNum {
          font-size: 32px;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: -0.025em;
          line-height: 1;
          margin-bottom: 5px;
        }
        @media (max-width: 600px) {
          .heroStatNum { font-size: 24px; }
        }
        .heroStatLabel {
          font-size: 12px;
          color: #737373;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .heroStatLabel { font-size: 11px; }
        }

        /* ============================================ */
        /* 섹션 공통 */
        /* ============================================ */
        .sectionHead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .sectionHead { margin-bottom: 18px; }
        }

        .sectionTitle {
          font-size: 24px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          margin: 0;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .sectionTitle { font-size: 19px; }
        }

        .sectionSub {
          font-size: 14px;
          color: #737373;
          font-weight: 600;
          margin: 4px 0 0;
          letter-spacing: -0.01em;
          word-break: keep-all;
          flex-basis: 100%;
        }
        @media (max-width: 600px) {
          .sectionSub { font-size: 12.5px; }
        }

        .sectionMore {
          font-size: 13px;
          color: #c2410c;
          font-weight: 700;
          letter-spacing: -0.012em;
          text-decoration: none;
          padding: 6px 12px;
          border: 1px solid #c2410c;
          transition: all 0.15s;
        }
        @media (max-width: 600px) {
          .sectionMore { font-size: 12px; padding: 5px 10px; }
        }
        .sectionMore:hover {
          background: #c2410c;
          color: #ffffff;
        }

        /* ============================================ */
        /* 카테고리 4개 */
        /* ============================================ */
        .categories {
          padding: 60px 24px 50px;
        }
        @media (max-width: 600px) {
          .categories { padding: 40px 16px 32px; }
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (max-width: 600px) {
          .categoryGrid { grid-template-columns: 1fr; gap: 10px; }
        }

        .categoryCard {
          padding: 28px 24px 22px;
          background: var(--cat-bg);
          border: 2px solid var(--cat-color);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 600px) {
          .categoryCard { padding: 22px 18px 18px; gap: 8px; }
        }
        .categoryCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .categoryEmoji {
          font-size: 48px;
          line-height: 1;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) {
          .categoryEmoji { font-size: 40px; }
        }

        .categoryName {
          font-size: 22px;
          font-weight: 800;
          color: var(--cat-color);
          letter-spacing: -0.025em;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .categoryName { font-size: 18px; }
        }

        .categoryDesc {
          font-size: 14px;
          color: #404040;
          line-height: 1.6;
          font-weight: 500;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .categoryDesc { font-size: 12.5px; line-height: 1.55; }
        }

        .categoryFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-top: 14px;
          border-top: 1px dashed var(--cat-color);
        }

        .categoryCount {
          font-size: 13px;
          font-weight: 800;
          color: var(--cat-color);
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .categoryCount { font-size: 12px; }
        }

        .categoryComingSoon {
          font-size: 13px;
          font-weight: 800;
          color: var(--cat-color);
          opacity: 0.7;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .categoryComingSoon { font-size: 11.5px; }
        }

        .categoryArrow {
          font-size: 20px;
          font-weight: 800;
          color: var(--cat-color);
        }

        /* ============================================ */
        /* 최신 가이드 */
        /* ============================================ */
        .latestGuides {
          padding: 50px 24px;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .latestGuides { padding: 32px 16px; }
        }

        .guideGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }
        @media (max-width: 600px) {
          .guideGrid { grid-template-columns: 1fr; gap: 10px; }
        }

        .guideCard {
          position: relative;
          padding: 22px 22px 18px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .guideCard { padding: 18px 18px 14px; gap: 6px; }
        }
        .guideCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
        }

        .guideCardAccent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .guideCardHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .guideCardEmoji {
          font-size: 26px;
          line-height: 1;
        }
        @media (max-width: 600px) {
          .guideCardEmoji { font-size: 22px; }
        }

        .guideCardKicker {
          font-size: 11px;
          font-weight: 800;
          color: #737373;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex: 1;
        }

        .guideCardTitle {
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.018em;
          line-height: 1.4;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guideCardTitle { font-size: 14.5px; }
        }

        .guideCardSub {
          font-size: 13px;
          color: #525252;
          line-height: 1.55;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guideCardSub { font-size: 12px; }
        }

        .guideCardMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-top: 10px;
          border-top: 1px solid #f5f5f5;
        }

        .guideCardTime {
          font-size: 11.5px;
          color: #737373;
          font-weight: 700;
        }

        .guideCardArrow {
          font-size: 12px;
          font-weight: 800;
          color: #c2410c;
        }

        /* ============================================ */
        /* 인기 가이드 TOP 5 */
        /* ============================================ */
        .popular {
          padding: 50px 24px;
        }
        @media (max-width: 600px) {
          .popular { padding: 32px 16px; }
        }

        .popularList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .popularItem {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
        }
        @media (max-width: 600px) {
          .popularItem { padding: 12px 14px; gap: 10px; }
        }
        .popularItem:hover {
          border-color: #c2410c;
          background: #fff7ed;
          transform: translateX(3px);
        }

        .popularRank {
          font-size: 24px;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: -0.025em;
          line-height: 1;
          width: 30px;
          text-align: center;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .popularRank { font-size: 20px; width: 24px; }
        }

        .popularEmoji {
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .popularEmoji { font-size: 20px; }
        }

        .popularContent {
          flex: 1;
          min-width: 0;
        }

        .popularTitle {
          font-size: 14.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 2px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .popularTitle { font-size: 13px; }
        }

        .popularViews {
          font-size: 11.5px;
          color: #737373;
          font-weight: 700;
        }

        .popularArrow {
          font-size: 18px;
          font-weight: 800;
          color: #a3a3a3;
          flex-shrink: 0;
        }
        .popularItem:hover .popularArrow {
          color: #c2410c;
        }

        /* ============================================ */
        /* 자료 만들기 도구 (작은 영역) */
        /* ============================================ */
        .toolPromo {
          padding: 0 24px 50px;
        }
        @media (max-width: 600px) {
          .toolPromo { padding: 0 16px 32px; }
        }

        .toolInner {
          display: flex;
          gap: 22px;
          align-items: center;
          padding: 28px 28px;
          background: linear-gradient(135deg, #fef3c7 0%, #fef9e1 100%);
          border-left: 4px solid #f59e0b;
        }
        @media (max-width: 600px) {
          .toolInner { padding: 22px 20px; gap: 16px; flex-direction: column; align-items: flex-start; }
        }

        .toolEmoji {
          font-size: 56px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .toolEmoji { font-size: 44px; }
        }

        .toolText {
          flex: 1;
          min-width: 0;
        }

        .toolTitle {
          font-size: 20px;
          font-weight: 800;
          color: #92400e;
          letter-spacing: -0.022em;
          line-height: 1.2;
          margin-bottom: 6px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .toolTitle { font-size: 17px; }
        }

        .toolSub {
          font-size: 13.5px;
          color: #78350f;
          line-height: 1.6;
          margin-bottom: 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .toolSub { font-size: 12.5px; line-height: 1.55; margin-bottom: 12px; }
        }

        .toolBtn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 22px;
          background: #f59e0b;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.015em;
          text-decoration: none;
          transition: all 0.15s;
        }
        @media (max-width: 600px) {
          .toolBtn { font-size: 13px; padding: 10px 18px; }
        }
        .toolBtn:hover {
          background: #d97706;
        }
        .toolBtnArrow {
          font-size: 16px;
          font-weight: 800;
        }

        /* ============================================ */
        /* FAQ */
        /* ============================================ */
        .faq {
          padding: 50px 24px 60px;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .faq { padding: 32px 16px 40px; }
        }

        .faqList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .faqItem {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          padding: 0;
        }

        .faqItem summary {
          padding: 16px 20px;
          font-size: 14.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          cursor: pointer;
          line-height: 1.5;
          word-break: keep-all;
          list-style: none;
          position: relative;
          padding-right: 44px;
        }
        @media (max-width: 600px) {
          .faqItem summary { font-size: 13.5px; padding: 14px 16px; padding-right: 38px; }
        }
        .faqItem summary::-webkit-details-marker { display: none; }
        .faqItem summary::after {
          content: '+';
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          font-weight: 400;
          color: #c2410c;
          transition: transform 0.2s;
        }
        .faqItem[open] summary::after {
          content: '−';
        }

        .faqA {
          padding: 0 20px 18px;
          font-size: 13.5px;
          color: #525252;
          line-height: 1.7;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .faqA { font-size: 12.5px; padding: 0 16px 14px; }
        }
      `}</style>
    </V11Shell>
  );
}
