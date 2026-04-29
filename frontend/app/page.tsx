'use client';
/**
 * AlgoMaker 메인 페이지 v7.0 (A안 - 박 대표님 결정)
 *
 * 사이트 정체성:
 * "50대~70대를 위한 영상 제작 도움말 채널"
 *
 * 박 대표님 비전:
 * - "광고 보고서라도 꼭 해야 할 가치"
 * - 시니어층 친화 디자인
 * - 가이드 콘텐츠가 메인
 * - 자료 생성 도구는 보조
 */

import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import AdSlot from './_shared/AdSlot';

// ============================================================
// 추천 가이드 (메인에 노출할 핵심 글)
// ============================================================
const FEATURED_GUIDES = [
  {
    slug: 'middle-aged-channel-tips',
    emoji: '👴',
    category: '시니어 입문',
    title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
    subtitle: '퇴직 후 영상 시작하시는 분들을 위한 현실적 가이드',
    readTime: '10분',
    badge: '입문자 추천',
  },
  {
    slug: 'family-story-shorts',
    emoji: '💝',
    category: '가족 사연',
    title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
    subtitle: '시니어층이 가장 빠르게 시작한 영상 카테고리 분석',
    readTime: '12분',
    badge: '인기',
  },
  {
    slug: 'first-30-seconds-hook',
    emoji: '🎬',
    category: '영상 제작',
    title: '첫 30초가 90%를 결정합니다 - 후크(Hook) 작성법',
    subtitle: '시청자가 끝까지 보게 만드는 영상 시작 비결',
    readTime: '9분',
    badge: '필독',
  },
  {
    slug: 'thumbnail-design',
    emoji: '🖼️',
    category: '디자인',
    title: '조회수 차이 만드는 썸네일 디자인 7가지 법칙',
    subtitle: '한글 텍스트가 잘 들어간 썸네일 만드는 비결',
    readTime: '8분',
  },
  {
    slug: 'storytelling-structure',
    emoji: '📖',
    category: '스토리텔링',
    title: '오래 보는 영상의 스토리텔링 구조 분석',
    subtitle: '시청자가 끝까지 보는 영상의 4단계 이야기 공식',
    readTime: '11분',
  },
  {
    slug: 'content-value-paths',
    emoji: '💡',
    category: '콘텐츠 가치',
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    subtitle: '내가 잘하는 것을 영상으로 풀어낼 때 다양한 길',
    readTime: '8분',
  },
];

// ============================================================
// 분야별 탐색 (시니어 친화 우선 정렬)
// ============================================================
const CATEGORY_NAV = [
  { id: 'senior', emoji: '🌳', name: '시니어 라이프', desc: '50대~70대 인생 이야기' },
  { id: 'family', emoji: '💝', name: '가족 사연', desc: '진심 담은 일상 이야기' },
  { id: 'economy', emoji: '📈', name: '재테크 / 노후', desc: '돈 관리, 연금, 자산' },
  { id: 'realestate', emoji: '🏘️', name: '부동산', desc: '청약, 투자, 동네 변화' },
  { id: 'health', emoji: '💪', name: '건강 / 운동', desc: '집에서 하는 운동, 식단' },
  { id: 'food', emoji: '🍳', name: '요리 / 맛집', desc: '집밥 레시피, 동네 맛집' },
  { id: 'travel', emoji: '🗺️', name: '여행 / 취미', desc: '국내외 여행, 즐거움' },
  { id: 'aitech', emoji: '🤖', name: 'AI / 디지털', desc: '핸드폰, AI 도구 입문' },
  { id: 'language', emoji: '🌏', name: '외국어', desc: '영어, 일본어 학습 후기' },
];

// ============================================================
// FAQ - AEO/GEO 최적화
// ============================================================
const FAQ_LIST = [
  {
    q: 'AlgoMaker가 어떤 사이트인가요?',
    a: '50대~70대 시니어층을 위한 영상 제작 도움말 채널입니다. 영상 만들기 처음 시작하시는 분들을 위한 가이드 글이 메인 콘텐츠이고, 키워드만 입력하면 AI가 영상 자료(제목, 대본 흐름, 태그 등)를 만들어주는 보조 도구도 함께 제공합니다. 모든 기능은 완전 무료입니다.',
  },
  {
    q: '시니어층(40대~70대)도 사용할 수 있나요?',
    a: '네, 그게 주 타겟입니다. 회원가입도 결제도 필요 없고, 디지털 도구가 익숙하지 않으셔도 가이드 글을 따라가시면 영상 만드실 수 있습니다. 시니어층이 인기 있는 분야 - 시니어 라이프, 재테크, 건강, 가족 관계, 사연 콘텐츠 - 위주로 가이드를 정리했습니다.',
  },
  {
    q: '얼마나 다양한 가이드가 있나요?',
    a: '현재 17편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다. 영상 시작 가이드, 제목 작성법, 썸네일 디자인, 스토리텔링, 시청 유지율 높이기, 수익화, BGM, 채널 브랜딩 등 영상 만들기에 필요한 모든 주제를 다룹니다.',
  },
  {
    q: '키워드 입력 도구는 어떻게 사용하나요?',
    a: '가이드 글 안에서 "직접 만들어보기" 버튼을 통해 사용하실 수 있습니다. 관심 있는 키워드 한 단어를 입력하시면, AI가 분야를 자동 감지해 영상 제목, 대본 흐름, 태그, SNS 메타데이터 등을 자동으로 만들어드립니다.',
  },
  {
    q: '완전 무료인가요?',
    a: '네, 회원가입과 결제 없이 모든 기능을 무료로 사용하실 수 있습니다. 사이트는 광고 수익(Google AdSense)으로 운영되며, 광고를 보시는 것만으로도 사이트를 응원해주시는 셈입니다.',
  },
  {
    q: '광고는 얼마나 보여지나요?',
    a: '가이드 글 본문 사이에 자연스럽게 광고가 들어갑니다. 영상 자료를 자주 만드시는 분은 사용 횟수가 늘어나면 보상형 광고(Rewarded Ad)를 잠시 보시고 계속 사용하실 수 있습니다. 모두 합리적 수준으로 운영합니다.',
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
  name: '시니어층이 영상 만들기 시작하는 방법',
  description: '50대~70대도 부담 없이 영상 만들기 시작할 수 있는 단계별 가이드',
  step: [
    { '@type': 'HowToStep', name: '관심 분야 정하기', text: '내가 1년 이상 해온 일, 익숙한 일, 좋아하는 일 중 하나를 선택합니다.' },
    { '@type': 'HowToStep', name: '추천 가이드 읽기', text: '시니어 입문 가이드 + 분야별 가이드를 천천히 읽어봅니다.' },
    { '@type': 'HowToStep', name: '키워드 정해서 자료 만들기', text: '키워드 하나로 영상 자료(제목, 대본, 태그) 자동 생성 도구로 시작합니다.' },
    { '@type': 'HowToStep', name: '영상 만들고 업로드', text: '핸드폰만으로 영상 만들고 SNS 업로드하면 됩니다.' },
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

      {/* AEO/GEO용 - 페이지 상단 hidden 정의 (AI 인용용) */}
      <div style={{ position: 'absolute', left: '-9999px', overflow: 'hidden' }} aria-hidden="false">
        <h1>AlgoMaker - 시니어 영상 제작 도움말 채널</h1>
        <p>
          AlgoMaker는 50대~70대 시니어층을 위한 영상 제작 도움말 채널입니다.
          영상 시작 가이드, 제목 작성법, 썸네일 디자인, 스토리텔링, 수익화 등
          17편 이상의 무료 가이드와 키워드 자동 자료 생성 도구를 제공합니다.
        </p>
      </div>

      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }
        @media (max-width: 600px) { .page { padding: 22px 16px 50px; } }

        /* ============================================ */
        /* HERO - 시니어 친화 + 큰 글씨 */
        /* ============================================ */
        .hero {
          text-align: center;
          padding: 36px 16px 28px;
          background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
          border-radius: 20px;
          margin-bottom: 32px;
        }
        @media (max-width: 600px) { .hero { padding: 28px 14px 22px; margin-bottom: 24px; } }
        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #fff;
          border: 2px solid #fdf1e7;
          border-radius: 100px;
          font-size: 13.5px;
          color: #c65f3b;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .heroTitle {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin: 0 0 14px;
        }
        @media (max-width: 600px) { .heroTitle { font-size: 24px; } }
        .heroAccent { color: #c65f3b; }
        .heroSub {
          font-size: 17px;
          color: #555;
          line-height: 1.7;
          margin: 0 auto 28px;
          max-width: 580px;
        }
        @media (max-width: 600px) { .heroSub { font-size: 15px; } }
        .heroCTA {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: #c65f3b;
          color: #fff;
          font-size: 17px;
          font-weight: 800;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(198, 95, 59, 0.25);
        }
        .heroCTA:hover {
          background: #d97155;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(198, 95, 59, 0.35);
        }
        @media (max-width: 600px) { .heroCTA { font-size: 15px; padding: 14px 24px; } }

        /* ============================================ */
        /* 섹션 공통 */
        /* ============================================ */
        .section { margin-bottom: 44px; }
        @media (max-width: 600px) { .section { margin-bottom: 32px; } }
        .sectionHead { margin-bottom: 22px; }
        .sectionTitle {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 18px; } }
        .sectionDesc {
          font-size: 14.5px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }
        @media (max-width: 600px) { .sectionDesc { font-size: 13.5px; } }

        /* ============================================ */
        /* 추천 가이드 카드 */
        /* ============================================ */
        .featuredGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 720px) { .featuredGrid { grid-template-columns: 1fr; } }
        .guideCard {
          background: #fff;
          border: 1.5px solid #e5e5e5;
          border-radius: 14px;
          padding: 22px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .guideCard:hover {
          border-color: #c65f3b;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(198, 95, 59, 0.12);
        }
        .guideCardHead {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .guideCardEmoji { font-size: 28px; }
        .guideCardCat {
          padding: 4px 10px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }
        .guideCardBadge {
          margin-left: auto;
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
        }
        .guideCardTitle {
          font-size: 16.5px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1.5;
          margin: 0;
        }
        @media (max-width: 600px) { .guideCardTitle { font-size: 15px; } }
        .guideCardSub {
          font-size: 13.5px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }
        .guideCardFoot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 8px;
        }
        .guideCardTime {
          font-size: 12px;
          color: #888;
        }
        .guideCardRead {
          font-size: 12.5px;
          color: #c65f3b;
          font-weight: 800;
        }

        /* ============================================ */
        /* 분야별 탐색 */
        /* ============================================ */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) { .catGrid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .catGrid { grid-template-columns: 1fr; } }
        .catCard {
          background: #fff;
          border: 1.5px solid #f0f0f0;
          border-radius: 12px;
          padding: 18px 16px;
          text-decoration: none;
          color: inherit;
          text-align: center;
          transition: all 0.2s;
        }
        .catCard:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
        }
        .catEmoji { font-size: 28px; margin-bottom: 8px; }
        .catName {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .catDesc {
          font-size: 12px;
          color: #777;
          line-height: 1.5;
        }

        /* ============================================ */
        /* 보조 도구 안내 (자료 생성) */
        /* ============================================ */
        .toolBox {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .toolBox { flex-direction: column; padding: 22px 18px; text-align: center; }
        }
        .toolIcon { font-size: 48px; }
        .toolText { flex: 1; }
        .toolTitle {
          font-size: 17px;
          font-weight: 800;
          color: #0c4a6e;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .toolTitle { font-size: 15.5px; } }
        .toolDesc {
          font-size: 13.5px;
          color: #075985;
          line-height: 1.65;
          margin: 0;
        }
        .toolBtn {
          padding: 12px 22px;
          background: #0284c7;
          color: #fff;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .toolBtn:hover {
          background: #0369a1;
          transform: translateY(-2px);
        }

        /* ============================================ */
        /* FAQ */
        /* ============================================ */
        .faqList {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faqItem {
          background: #fff;
          border: 1.5px solid #e5e5e5;
          border-radius: 12px;
          padding: 18px 22px;
        }
        .faqQ {
          font-size: 15.5px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .faqQ { font-size: 14.5px; } }
        .faqA {
          font-size: 13.5px;
          color: #555;
          line-height: 1.75;
          margin: 0;
        }

        /* ============================================ */
        /* CTA 박스 */
        /* ============================================ */
        .ctaBox {
          background: linear-gradient(135deg, #c65f3b 0%, #d97155 100%);
          border-radius: 20px;
          padding: 36px 24px;
          text-align: center;
          color: #fff;
        }
        .ctaTitle {
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .ctaTitle { font-size: 18px; } }
        .ctaSub {
          font-size: 14.5px;
          opacity: 0.95;
          margin: 0 0 22px;
          line-height: 1.7;
        }
        .ctaBtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #fff;
          color: #c65f3b;
          font-size: 15px;
          font-weight: 800;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
        }

        /* ============================================ */
        /* 데이터 신뢰도 (CENTS - E + N 강화) */
        /* ============================================ */
        .trustSection {
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f3 100%);
          border-radius: 16px;
          padding: 28px 24px 22px;
          margin: 28px 0 32px;
          text-align: center;
        }
        .trustGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 14px;
        }
        @media (max-width: 720px) {
          .trustGrid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        .trustCard {
          background: #fff;
          border-radius: 12px;
          padding: 18px 12px 14px;
          border: 1.5px solid #fdebd9;
        }
        .trustNum {
          font-size: 32px;
          font-weight: 800;
          color: #c65f3b;
          line-height: 1;
          margin-bottom: 6px;
          letter-spacing: -0.03em;
        }
        @media (max-width: 600px) {
          .trustNum { font-size: 28px !important; }
        }
        .trustUnit {
          font-size: 16px;
          font-weight: 700;
          margin-left: 2px;
        }
        .trustLabel {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .trustDesc {
          font-size: 11px;
          color: #888;
          line-height: 1.5;
        }
        .trustNote {
          font-size: 13px;
          color: #92400e;
          font-weight: 600;
          margin: 12px 0 0;
        }
        @media (max-width: 600px) {
          .trustSection { padding: 22px 16px 18px !important; margin: 22px 0 28px !important; }
          .trustLabel { font-size: 13.5px !important; }
          .trustDesc { font-size: 11.5px !important; }
          .trustNote { font-size: 13px !important; line-height: 1.65 !important; }
        }

        /* ============================================ */
        /* 오늘의 핵심 (CENTS - N 즉시 가치) */
        /* ============================================ */
        .todaySection {
          background: linear-gradient(180deg, #fffbf5 0%, #fff 100%);
          border: 1px solid #fdebd9;
          border-radius: 16px;
          padding: 32px 28px;
          margin: 28px 0 32px;
        }
        @media (max-width: 600px) {
          .todaySection { padding: 26px 20px !important; }
        }
        .todayHead {
          text-align: center;
          margin-bottom: 22px;
        }
        .todayBadge {
          display: inline-block;
          padding: 6px 14px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin-bottom: 10px;
        }
        .todayTitle {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0;
        }
        @media (max-width: 600px) {
          .todayTitle { font-size: 20px !important; }
        }
        .todayCard {
          background: #fff;
          border: 2px solid #fdebd9;
          border-radius: 14px;
          padding: 28px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .todayCard { padding: 22px 18px !important; }
        }
        .todayQuote {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.5;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) {
          .todayQuote { font-size: 19px !important; line-height: 1.45 !important; }
        }
        .todayQuoteAccent {
          color: #c65f3b;
        }
        .todayBody {
          font-size: 15px;
          color: #555;
          line-height: 1.75;
          margin: 0 0 22px;
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 22px;
        }
        @media (max-width: 600px) {
          .todayBody { font-size: 14.5px !important; line-height: 1.75 !important; }
        }
        .todayBody strong {
          color: #c65f3b;
          font-weight: 800;
        }
        .todayCTA {
          display: inline-block;
          padding: 14px 28px;
          background: #c65f3b;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
          min-height: 50px;
          line-height: 1.4;
        }
        .todayCTA:hover {
          background: #d97155;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.3);
        }
        @media (max-width: 600px) {
          .todayCTA { 
            font-size: 15px !important; 
            padding: 14px 26px !important;
            min-height: 50px !important;
          }
        }

        /* ============================================ */
        /* 🎯 시니어 모바일 최적화 (v6.3.0) */
        /* ============================================ */
        @media (max-width: 600px) {
          /* 폰트 키우기 - 시니어 시력 고려 */
          .heroTitle { font-size: 26px !important; line-height: 1.35 !important; }
          .heroSub { font-size: 16px !important; line-height: 1.7 !important; }
          .heroCTA { 
            font-size: 16px !important; 
            padding: 16px 28px !important; 
            min-height: 52px;
          }
          .sectionTitle { font-size: 19px !important; }
          .sectionDesc { font-size: 15px !important; line-height: 1.7 !important; }
          .guideCardTitle { font-size: 16px !important; line-height: 1.45 !important; }
          .guideCardSub { font-size: 14px !important; line-height: 1.6 !important; }
          .guideCardCat { font-size: 12px !important; }
          
          /* 터치 영역 확대 */
          .guideCard {
            padding: 18px 18px 16px !important;
            min-height: 140px;
          }
          .catCard {
            padding: 18px 14px !important;
            min-height: 100px;
          }
          .catEmoji { font-size: 32px !important; }
          .catName { font-size: 14.5px !important; }
          .catDesc { font-size: 12.5px !important; line-height: 1.55 !important; }
          
          /* CTA 버튼 시니어 친화 */
          .ctaBtn {
            font-size: 17px !important;
            padding: 18px 32px !important;
            min-height: 56px;
            min-width: 200px;
          }
          .ctaTitle { font-size: 22px !important; }
          .ctaSub { font-size: 15px !important; line-height: 1.7 !important; }
          
          /* FAQ 카드 가독성 */
          .faqQ { font-size: 15px !important; line-height: 1.6 !important; }
          .faqA { font-size: 14.5px !important; line-height: 1.75 !important; }
          
          /* 보조 도구 안내 */
          .toolBox {
            padding: 22px 18px !important;
            flex-direction: column;
            gap: 14px;
          }
          .toolTitle { font-size: 17px !important; }
          .toolDesc { font-size: 14.5px !important; line-height: 1.7 !important; }
          .toolBtn {
            font-size: 16px !important;
            padding: 14px 24px !important;
            min-height: 48px;
            width: 100%;
          }
          
          /* 페이지 여백 줄이기 (모바일 화면 활용) */
          .page { padding: 18px 14px 60px !important; }
          .hero { padding: 32px 18px 28px !important; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="heroBadge">
            <span>✓</span>
            <span>완전 무료 · 회원가입 불필요</span>
          </div>
          <h1 className="heroTitle">
            50대도 시작하는 영상 만들기,<br />
            <span className="heroAccent">처음부터 끝까지 도와드려요</span>
          </h1>
          <p className="heroSub">
            디지털 도구가 익숙하지 않으셔도 괜찮습니다.<br />
            영상 만들기에 필요한 모든 가이드를 시니어 분들이 보기 쉽게 정리했어요.
          </p>
          <Link href="/blog" className="heroCTA">
            📚 가이드 둘러보기 →
          </Link>
        </section>

        {/* ============================================ */}
        {/* [데이터 신뢰도 - CENTS의 E(진입) + N(욕구) 강화] */}
        {/* ============================================ */}
        <section className="trustSection">
          <div className="trustGrid">
            <div className="trustCard">
              <div className="trustNum">27<span className="trustUnit">개</span></div>
              <div className="trustLabel">떡상 영상 패턴</div>
              <div className="trustDesc">실제 분석한 사례 데이터</div>
            </div>
            <div className="trustCard">
              <div className="trustNum">26<span className="trustUnit">편</span></div>
              <div className="trustLabel">시니어 영상 가이드</div>
              <div className="trustDesc">매주 새 가이드 추가</div>
            </div>
            <div className="trustCard">
              <div className="trustNum">9<span className="trustUnit">개</span></div>
              <div className="trustLabel">분야별 자동 매칭</div>
              <div className="trustDesc">AI 기반 자동 분석</div>
            </div>
            <div className="trustCard">
              <div className="trustNum">100<span className="trustUnit">%</span></div>
              <div className="trustLabel">완전 무료</div>
              <div className="trustDesc">회원가입 없이 사용</div>
            </div>
          </div>
          <p className="trustNote">
            ✓ 다른 곳에서 볼 수 없는 시니어 영상 패턴 데이터를 무료로 공개합니다
          </p>
        </section>

        {/* 추천 가이드 */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">⭐ 시니어 분들께 추천하는 가이드</h2>
            <p className="sectionDesc">
              영상 시작이 처음이신 분들이 가장 먼저 읽어보시면 좋은 가이드 6편입니다.
            </p>
          </div>
          <div className="featuredGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link key={g.slug} href={`/knowhow/${g.slug}`} className="guideCard">
                <div className="guideCardHead">
                  <span className="guideCardEmoji">{g.emoji}</span>
                  <span className="guideCardCat">{g.category}</span>
                  {g.badge && <span className="guideCardBadge">{g.badge}</span>}
                </div>
                <h3 className="guideCardTitle">{g.title}</h3>
                <p className="guideCardSub">{g.subtitle}</p>
                <div className="guideCardFoot">
                  <span className="guideCardTime">⏱️ {g.readTime}</span>
                  <span className="guideCardRead">자세히 보기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AdSense */}
        <div style={{ margin: '24px 0' }}>
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* [오늘 배울 1가지] CENTS - N(욕구) 즉시 가치 */}
        {/* ============================================ */}
        <section className="todaySection">
          <div className="todayHead">
            <span className="todayBadge">📌 오늘의 핵심</span>
            <h2 className="todayTitle">처음 시작하는 분께 가장 중요한 1가지</h2>
          </div>
          <div className="todayCard">
            <div className="todayQuote">
              "영상 만들기에서 가장 중요한 건<br />
              <span className="todayQuoteAccent">"꾸준함"</span>입니다"
            </div>
            <p className="todayBody">
              일주일에 한 편이면 충분합니다. 1년에 50편이면 본인만의 색깔이 만들어집니다.
              빠른 떡상 욕심보다 <strong>매주 진심 담은 한 편</strong>이 더 강력합니다.
            </p>
            <Link href="/knowhow/middle-aged-channel-tips" className="todayCTA">
              👴 시니어 영상 시작 7가지 가이드 →
            </Link>
          </div>
        </section>

        {/* 분야별 탐색 */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">🗂️ 분야별 가이드 탐색</h2>
            <p className="sectionDesc">
              관심 있는 분야의 가이드를 모아서 보실 수 있어요. 시니어 분들이 많이 찾는 분야부터 정리했습니다.
            </p>
          </div>
          <div className="catGrid">
            {CATEGORY_NAV.map((c) => (
              <Link key={c.id} href={`/blog?category=${c.id}`} className="catCard">
                <div className="catEmoji">{c.emoji}</div>
                <div className="catName">{c.name}</div>
                <div className="catDesc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* 보조 도구 안내 */}
        <section className="section">
          <div className="toolBox">
            <div className="toolIcon">🛠️</div>
            <div className="toolText">
              <h3 className="toolTitle">키워드로 영상 자료 자동 만들기</h3>
              <p className="toolDesc">
                관심 있는 키워드 한 단어를 입력하시면, 영상 제목·대본 흐름·태그 등을
                AI가 자동으로 만들어드립니다. 가이드 읽고 직접 만들어보고 싶으실 때 사용하세요.
              </p>
            </div>
            <Link href="/create" className="toolBtn">
              직접 만들어보기 →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">❓ 자주 묻는 질문</h2>
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

        {/* 최종 CTA */}
        <section className="section">
          <div className="ctaBox">
            <h2 className="ctaTitle">시니어 분들의 영상 시작을 응원합니다</h2>
            <p className="ctaSub">
              완전 무료입니다. 회원가입도, 결제도 필요 없어요.<br />
              가이드 한 편씩 천천히 읽어보시면서 시작해보세요.
            </p>
            <Link href="/blog" className="ctaBtn">
              📚 모든 가이드 보기 →
            </Link>
          </div>
        </section>
      </div>
    </V11Shell>
  );
}
