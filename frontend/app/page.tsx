'use client';
/**
 * AlgoMaker 메인 페이지 v9.1 - Guide Channel
 *
 * 박예준 대표 비전 (인수인계 v6.4.1 명시):
 * "50대~70대 시니어층을 위한 영상 제작 도움말 채널"
 * "가이드 글이 메인 콘텐츠"
 * "AlgoMaker 자체 = 완전 무료"
 *
 * v9.1 결정 (2026.04.30):
 *  - ❌ 메인에서 키워드 입력 박스 완전 제거 (AdSense 정책 + 체류시간 ↑)
 *  - ✅ 17편 가이드 + 9개 카테고리 + FAQ가 메인 콘텐츠
 *  - ✅ 키워드 도구는 각 가이드 본문의 "직접 만들어보기" 버튼으로만 접근
 *  - ✅ 헤더 사이드바의 "AI 도구" 메뉴 유지
 *  - ✅ Studio Treatment 톤 유지 (블랙·화이트·앰버)
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 6편
 *  - CATEGORY_NAV 9개
 *  - FAQ_LIST 6개
 *  - AEO/GEO JSON-LD
 */

import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import AdSlot from './_shared/AdSlot';

// ============================================================
// 추천 가이드 6편
// ============================================================
const FEATURED_GUIDES = [
  {
    slug: 'middle-aged-channel-tips',
    category: '시니어 입문',
    title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
    subtitle: '퇴직 후 영상 시작하시는 분들을 위한 현실적 가이드',
    readTime: '10분',
    badge: '입문자 추천',
  },
  {
    slug: 'family-story-shorts',
    category: '가족 사연',
    title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
    subtitle: '시니어층이 가장 빠르게 시작한 영상 카테고리 분석',
    readTime: '12분',
    badge: '인기',
  },
  {
    slug: 'first-30-seconds-hook',
    category: '영상 제작',
    title: '첫 30초가 90%를 결정합니다 - 후크(Hook) 작성법',
    subtitle: '시청자가 끝까지 보게 만드는 영상 시작 비결',
    readTime: '9분',
    badge: '필독',
  },
  {
    slug: 'thumbnail-design',
    category: '디자인',
    title: '조회수 차이 만드는 썸네일 디자인 7가지 법칙',
    subtitle: '한글 텍스트가 잘 들어간 썸네일 만드는 비결',
    readTime: '8분',
  },
  {
    slug: 'storytelling-structure',
    category: '스토리텔링',
    title: '오래 보는 영상의 스토리텔링 구조 분석',
    subtitle: '시청자가 끝까지 보는 영상의 4단계 이야기 공식',
    readTime: '11분',
  },
  {
    slug: 'content-value-paths',
    category: '콘텐츠 가치',
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    subtitle: '내가 잘하는 것을 영상으로 풀어낼 때 다양한 길',
    readTime: '8분',
  },
];

const CATEGORY_NAV = [
  { id: 'senior', name: '시니어 라이프', desc: '50대~70대 인생 이야기' },
  { id: 'family', name: '가족 사연', desc: '진심 담은 일상 이야기' },
  { id: 'economy', name: '재테크 / 노후', desc: '돈 관리, 연금, 자산' },
  { id: 'realestate', name: '부동산', desc: '청약, 투자, 동네 변화' },
  { id: 'health', name: '건강 / 운동', desc: '집에서 하는 운동, 식단' },
  { id: 'food', name: '요리 / 맛집', desc: '집밥 레시피, 동네 맛집' },
  { id: 'travel', name: '여행 / 취미', desc: '국내외 여행, 즐거움' },
  { id: 'aitech', name: 'AI / 디지털', desc: '핸드폰, AI 도구 입문' },
  { id: 'language', name: '외국어', desc: '영어, 일본어 학습 후기' },
];

const FAQ_LIST = [
  {
    q: 'AlgoMaker가 어떤 사이트인가요?',
    a: '50대~70대 시니어층을 위한 영상 제작 도움말 채널입니다. 영상 만들기 처음 시작하시는 분들을 위한 가이드 글이 메인 콘텐츠이고, 키워드만 입력하면 AI가 영상 자료(제목, 대본 흐름, 태그 등)를 만들어주는 보조 도구도 함께 제공합니다. 모든 기능은 완전 무료입니다.',
  },
  {
    q: '시니어층(40대~70대)도 사용할 수 있나요?',
    a: '네, 그게 주 타겟입니다. 회원가입도 결제도 필요 없고, 디지털 도구가 익숙하지 않으셔도 가이드 글을 따라가시면 영상 만드실 수 있습니다.',
  },
  {
    q: '얼마나 다양한 가이드가 있나요?',
    a: '현재 17편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다. 영상 시작 가이드, 제목 작성법, 썸네일 디자인, 스토리텔링, 시청 유지율, 수익화, BGM, 채널 브랜딩 등 영상 만들기에 필요한 모든 주제를 다룹니다.',
  },
  {
    q: '어떤 분야 콘텐츠가 인기인가요?',
    a: '시니어 라이프, 재테크/노후, 가족 사연, 건강/운동, 요리, 여행, AI 디지털, 외국어 등 9개 분야를 다룹니다. 시니어 분들이 가장 많이 시작하시는 분야부터 정리했습니다.',
  },
  {
    q: '완전 무료인가요?',
    a: '네, 회원가입도 결제도 없이 모든 기능을 무료로 사용하실 수 있습니다. 사이트는 광고 수익(Google AdSense)으로 운영되며, 광고를 보시는 것만으로도 사이트를 응원해주시는 셈입니다.',
  },
  {
    q: '광고는 얼마나 보여지나요?',
    a: '가이드 글 본문 사이에 자연스럽게 광고가 들어갑니다. 모두 합리적 수준으로 운영됩니다.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_LIST.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '시니어가 영상 시작하는 방법',
  description: '50대~70대 시니어층이 영상 만들기를 처음 시작하실 때 필요한 단계별 가이드',
  step: [
    { '@type': 'HowToStep', position: 1, name: '입문 가이드 읽기', text: '시니어 영상 시작 7가지 가이드를 먼저 읽어보세요.' },
    { '@type': 'HowToStep', position: 2, name: '관심 분야 선택', text: '시니어 라이프, 가족 사연, 재테크 등 9개 분야 중 본인이 잘 알고 즐겁게 다룰 수 있는 분야를 선택합니다.' },
    { '@type': 'HowToStep', position: 3, name: '영상 자료 만들기', text: '관심 키워드를 입력하면 AI가 영상 제목, 대본, 태그 등을 자동으로 만들어드립니다.' },
    { '@type': 'HowToStep', position: 4, name: '영상 제작 후 업로드', text: '4가지 SNS(YouTube/Shorts/TikTok/Instagram)에 자료를 그대로 사용해 업로드합니다.' },
  ],
};

export default function HomePage() {
  return (
    <V11Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* AEO/GEO 숨김 영역 */}
      <div style={{ position: 'absolute', left: '-9999px', overflow: 'hidden' }} aria-hidden="false">
        <h1>AlgoMaker - 시니어 영상 제작 도움말 채널</h1>
        <p>
          AlgoMaker는 50대~70대 시니어층을 위한 영상 제작 도움말 채널입니다.
          영상 시작 가이드, 제목 작성법, 썸네일 디자인, 스토리텔링, 수익화 등
          17편 이상의 무료 가이드를 제공합니다.
        </p>
      </div>

      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 0 60px;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        /* ============================================ */
        /* HERO — 가이드 채널 정체성 */
        /* ============================================ */
        .hero {
          padding: 56px 24px 40px;
          background: #ffffff;
          border-bottom: 2px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .hero { padding: 40px 20px 32px; }
        }

        .heroKicker {
          font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .heroKicker { font-size: 10px; } }

        .heroTitle {
          font-family: 'Noto Serif KR', 'Pretendard', serif;
          font-size: 36px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.03em;
          line-height: 1.25;
          margin: 0 0 16px;
          max-width: 780px;
        }
        @media (max-width: 600px) { .heroTitle { font-size: 26px; } }

        .heroTitleAccent {
          background: linear-gradient(180deg, transparent 60%, #fbbf24 60%);
          padding: 0 4px;
        }

        .heroSub {
          font-family: 'Noto Serif KR', 'Pretendard', serif;
          font-size: 16px;
          color: #525252;
          line-height: 1.75;
          font-weight: 500;
          max-width: 720px;
          margin: 0 0 24px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .heroSub { font-size: 14px; } }

        /* 헤더 핵심 정보 (메타 라인) */
        .heroMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .heroMeta { gap: 16px; padding-top: 16px; }
        }
        .heroMetaItem {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .heroMetaLabel {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #737373;
          text-transform: uppercase;
        }
        .heroMetaValue {
          font-family: 'Noto Serif KR', serif;
          font-size: 15px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .heroMetaValue { font-size: 13.5px; }
          .heroMetaLabel { font-size: 9px; }
        }

        /* ============================================ */
        /* 추천 시작 — 입문자용 가이드 (강조) */
        /* ============================================ */
        .startSection {
          padding: 48px 24px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .startSection { padding: 36px 20px; }
        }
        .startKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .startTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .startTitle { font-size: 19px; } }
        .startSub {
          font-family: 'Noto Serif KR', serif;
          font-size: 14px;
          color: #525252;
          line-height: 1.7;
          margin: 0 0 24px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .startSub { font-size: 13px; } }

        .startCard {
          display: block;
          background: #ffffff;
          border: 2px solid #0a0a0a;
          padding: 24px 28px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }
        .startCard:hover {
          background: #0a0a0a;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .startCard { padding: 20px 22px; }
        }
        .startCardKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .startCard:hover .startCardKicker {
          color: #fbbf24;
        }
        .startCardTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .startCardTitle { font-size: 16px; } }
        .startCardDesc {
          font-family: 'Noto Serif KR', serif;
          font-size: 13.5px;
          color: #525252;
          line-height: 1.7;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        .startCard:hover .startCardDesc {
          color: rgba(255, 255, 255, 0.8);
        }
        @media (max-width: 600px) { .startCardDesc { font-size: 12.5px; } }
        .startCardFoot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px dashed #d4d4d4;
        }
        .startCard:hover .startCardFoot {
          border-top-color: rgba(255, 255, 255, 0.3);
        }
        .startCardTime {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: #737373;
          letter-spacing: 0.06em;
        }
        .startCard:hover .startCardTime {
          color: rgba(255, 255, 255, 0.7);
        }
        .startCardArrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .startCard:hover .startCardArrow {
          color: #fbbf24;
        }

        /* ============================================ */
        /* 공통 섹션 */
        /* ============================================ */
        .section {
          padding: 40px 24px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) { .section { padding: 32px 20px; } }

        .sectionHead {
          margin-bottom: 24px;
        }
        .sectionKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .sectionTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 22px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 18px; } }
        .sectionDesc {
          font-family: 'Noto Serif KR', serif;
          font-size: 13.5px;
          color: #525252;
          line-height: 1.65;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .sectionDesc { font-size: 12.5px; } }

        /* 가이드 카드 */
        .guideGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 0;
          border-top: 1px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .guideGrid { grid-template-columns: 1fr; }
        }
        .guideCard {
          padding: 18px 20px;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          background: #ffffff;
          transition: background 0.15s;
        }
        .guideCard:hover {
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .guideCard { border-right: none; }
        }
        .guideCardKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #c2410c;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .guideCardTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.45;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .guideCardTitle { font-size: 13.5px; } }
        .guideCardSub {
          font-family: 'Noto Serif KR', serif;
          font-size: 12px;
          color: #737373;
          line-height: 1.55;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        .guideCardMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px dashed #d4d4d4;
        }
        .guideCardTime {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #737373;
          letter-spacing: 0.06em;
        }
        .guideCardArrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* 카테고리 그리드 */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .catGrid { grid-template-columns: repeat(2, 1fr); }
        }
        .catCard {
          padding: 18px 16px;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: background 0.15s;
        }
        .catCard:hover { background: #fafafa; }
        .catName {
          font-family: 'Noto Serif KR', serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) { .catName { font-size: 13px; } }
        .catDesc {
          font-family: 'Noto Serif KR', serif;
          font-size: 11.5px;
          color: #737373;
          line-height: 1.5;
          word-break: keep-all;
        }

        /* FAQ */
        .faqList {
          border-top: 1px solid #0a0a0a;
        }
        .faqItem {
          padding: 18px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .faqQ {
          font-family: 'Noto Serif KR', serif;
          font-size: 14.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) { .faqQ { font-size: 13.5px; } }
        .faqA {
          font-family: 'Noto Serif KR', serif;
          font-size: 13px;
          color: #525252;
          line-height: 1.7;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .faqA { font-size: 12.5px; } }

        /* 보조 도구 안내 (작게) */
        .toolBlock {
          padding: 32px 24px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) { .toolBlock { padding: 28px 20px; } }
        .toolKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #737373;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .toolTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .toolTitle { font-size: 14.5px; } }
        .toolDesc {
          font-family: 'Noto Serif KR', serif;
          font-size: 13px;
          color: #525252;
          line-height: 1.65;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .toolDesc { font-size: 12px; } }
        .toolNote {
          font-family: 'Noto Serif KR', serif;
          font-size: 12px;
          color: #737373;
          line-height: 1.65;
          font-style: italic;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .toolNote { font-size: 11.5px; } }

        /* 광고 영역 */
        .adArea { padding: 24px; }
        @media (max-width: 600px) { .adArea { padding: 20px; } }
      `}</style>

      <div className="page">
        {/* HERO — 가이드 채널 정체성 */}
        <section className="hero">
          <div className="heroKicker">▍ AlgoMaker · Senior Video Guide Channel</div>
          <h1 className="heroTitle">
            50대도 시작하는 영상 만들기,<br />
            <span className="heroTitleAccent">처음부터 끝까지</span> 도와드립니다
          </h1>
          <p className="heroSub">
            디지털 도구가 익숙하지 않으셔도 괜찮습니다.
            영상 시작 가이드 · 제목 작성법 · 썸네일 디자인 · 스토리텔링 ·
            수익화까지, 시니어 분들이 보기 쉽게 정리한 17편 이상의 가이드를
            완전 무료로 보실 수 있습니다.
          </p>

          <div className="heroMeta">
            <div className="heroMetaItem">
              <div className="heroMetaLabel">Guides</div>
              <div className="heroMetaValue">17편</div>
            </div>
            <div className="heroMetaItem">
              <div className="heroMetaLabel">Categories</div>
              <div className="heroMetaValue">9개 분야</div>
            </div>
            <div className="heroMetaItem">
              <div className="heroMetaLabel">Updates</div>
              <div className="heroMetaValue">매주 새 가이드</div>
            </div>
            <div className="heroMetaItem">
              <div className="heroMetaLabel">Pricing</div>
              <div className="heroMetaValue">완전 무료</div>
            </div>
          </div>
        </section>

        {/* 추천 시작 — 입문자용 큰 카드 */}
        <section className="startSection">
          <div className="startKicker">▍ Recommended Start</div>
          <h2 className="startTitle">처음 시작하시는 분께 추천</h2>
          <p className="startSub">
            영상 만들기가 처음이신 분들이 가장 먼저 읽어보시면 좋은 가이드입니다.
            10분이면 어떻게 시작해야 할지 명확해집니다.
          </p>

          <Link href="/knowhow/middle-aged-channel-tips" className="startCard">
            <div className="startCardKicker">시니어 입문 · 입문자 추천</div>
            <h3 className="startCardTitle">
              시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지
            </h3>
            <p className="startCardDesc">
              퇴직 후 영상 시작하시는 분들을 위한 현실적 가이드.
              주제 선택부터 카메라 · 편집 도구 · 채널 운영까지
              시니어 시각으로 풀어낸 종합 안내서.
            </p>
            <div className="startCardFoot">
              <span className="startCardTime">⏱ 10분 · Reading Time</span>
              <span className="startCardArrow">READ NOW →</span>
            </div>
          </Link>
        </section>

        {/* 광고 영역 */}
        <div className="adArea">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* FEATURED GUIDES */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">▍ Featured Guides</div>
            <h2 className="sectionTitle">시니어 분들께 추천하는 가이드</h2>
            <p className="sectionDesc">
              영상 만들기에서 가장 자주 묻는 주제를 정리한 가이드 6편.
            </p>
          </div>
          <div className="guideGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link key={g.slug} href={`/knowhow/${g.slug}`} className="guideCard">
                <div className="guideCardKicker">{g.category}{g.badge ? ` · ${g.badge}` : ''}</div>
                <h3 className="guideCardTitle">{g.title}</h3>
                <p className="guideCardSub">{g.subtitle}</p>
                <div className="guideCardMeta">
                  <span className="guideCardTime">⏱ {g.readTime}</span>
                  <span className="guideCardArrow">READ →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">▍ Browse by Category</div>
            <h2 className="sectionTitle">분야별 가이드 탐색</h2>
            <p className="sectionDesc">
              관심 있는 분야의 가이드를 모아서 보실 수 있어요.
              시니어 분들이 많이 찾는 분야부터 정리했습니다.
            </p>
          </div>
          <div className="catGrid">
            {CATEGORY_NAV.map((c) => (
              <Link key={c.id} href={`/blog?category=${c.id}`} className="catCard">
                <div className="catName">{c.name}</div>
                <div className="catDesc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">▍ Frequently Asked Questions</div>
            <h2 className="sectionTitle">자주 묻는 질문</h2>
          </div>
          <div className="faqList">
            {FAQ_LIST.map((f, i) => (
              <div key={i} className="faqItem">
                <div className="faqQ">Q. {f.q}</div>
                <p className="faqA">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 보조 도구 안내 (하단에 작게) */}
        <section className="toolBlock">
          <div className="toolKicker">▍ Additional Tool</div>
          <h2 className="toolTitle">키워드 입력으로 영상 자료 자동 만들기</h2>
          <p className="toolDesc">
            가이드를 다 읽으신 후, 직접 영상을 만들어보고 싶으실 때
            각 가이드 본문 안에 있는 <strong>"직접 만들어보기"</strong> 버튼을 눌러보세요.
            관심 키워드 한 단어로 영상 제목 · 대본 · 썸네일 · SNS 메타데이터까지
            자동으로 만들어드립니다.
          </p>
          <p className="toolNote">
            보조 도구이므로 가이드를 먼저 읽어보시는 것을 추천드립니다.
            가이드를 통해 어떤 영상을 만들지 방향이 잡힌 후 도구를 사용하시면
            훨씬 더 만족스러운 결과를 얻으실 수 있습니다.
          </p>
        </section>
      </div>
    </V11Shell>
  );
}
