'use client';
/**
 * AlgoMaker 메인 페이지 v10.4 - v9.6 베이스 + 알고리즘 엔진 임팩트
 *
 * 박예준 대표 비전:
 * "50대~70대 시니어층을 위한 영상 제작 도움말 채널"
 * "가이드 글이 메인 콘텐츠"
 * "AlgoMaker 자체 = 완전 무료"
 *
 * 박 대표님 v10.4 요청 (D안 - 제대로):
 *  "정돈" + "알고리즘 느낌" + "콘텐츠 있는 메인"
 *
 * v10.4 핵심: v9.6의 모든 콘텐츠 그대로 + 상단 알고리즘 엔진만 새로 추가
 *
 * v10.4 변경 (2026.05.01):
 *  - ✅ Hero 영역을 "ALGORITHM ENGINE" 임팩트 영역으로 교체
 *    - ▍ ALGORITHM ENGINE ● LIVE 펄스
 *    - 큰 타이틀 "유튜브 알고리즘을 읽어드립니다"
 *    - 서브 타이틀 (5초, 떡상 패턴, 4개 SNS)
 *    - 검정 박스 5단계 가로 파이프라인 (01→02→03→04→05)
 *    - 시작 + 가이드 버튼
 *  - ✅ 추천 가이드 6편 (v9.6 그대로 유지 - emoji + 색상)
 *  - ✅ 분야별 9개 (v9.6 그대로 유지 - 클릭 시 /blog 이동 작동)
 *  - ✅ FAQ 6개 (v9.6 그대로 유지 - 아코디언, 첫 1개 펼침)
 *  - ✅ 광고 1개 (v9.6 위치 유지)
 *
 * 제거된 것 (v9.6 → v10.4):
 *  ❌ Hero "50대도 시작하는 영상 만들기..." 큰 타이틀
 *  ❌ Hero 4열 메타 (가이드 17편/9분야/매주/무료)
 *  ❌ 추천 시작 큰 카드 (startSection - 입문자용 가이드)
 *  ❌ 보조 도구 안내 (toolBlock)
 *  → 알고리즘 엔진 영역이 이 자리 대체
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 6편
 *  - CATEGORY_NAV 9개
 *  - FAQ_LIST 6개
 *  - AEO/GEO JSON-LD
 *  - 광고 위치
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
    emoji: '🌱',
    color: '#16a34a',
  },
  {
    slug: 'family-story-shorts',
    category: '가족 사연',
    title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
    subtitle: '시니어층이 가장 빠르게 시작한 영상 카테고리 분석',
    readTime: '12분',
    badge: '인기',
    emoji: '👨‍👩‍👧',
    color: '#dc2626',
  },
  {
    slug: 'first-30-seconds-hook',
    category: '영상 제작',
    title: '첫 30초가 90%를 결정합니다 - 후크(Hook) 작성법',
    subtitle: '시청자가 끝까지 보게 만드는 영상 시작 비결',
    readTime: '9분',
    badge: '필독',
    emoji: '🎬',
    color: '#c2410c',
  },
  {
    slug: 'thumbnail-design',
    category: '디자인',
    title: '조회수 차이 만드는 썸네일 디자인 7가지 법칙',
    subtitle: '한글 텍스트가 잘 들어간 썸네일 만드는 비결',
    readTime: '8분',
    emoji: '🎨',
    color: '#9333ea',
  },
  {
    slug: 'storytelling-structure',
    category: '스토리텔링',
    title: '오래 보는 영상의 스토리텔링 구조 분석',
    subtitle: '시청자가 끝까지 보는 영상의 4단계 이야기 공식',
    readTime: '11분',
    emoji: '📖',
    color: '#2563eb',
  },
  {
    slug: 'content-value-paths',
    category: '콘텐츠 가치',
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    subtitle: '내가 잘하는 것을 영상으로 풀어낼 때 다양한 길',
    readTime: '8분',
    emoji: '💎',
    color: '#0891b2',
  },
];

const CATEGORY_NAV = [
  { id: 'senior', name: '시니어 라이프', desc: '50대~70대 인생 이야기', emoji: '👴', color: '#7c3aed' },
  { id: 'family', name: '가족 사연', desc: '진심 담은 일상 이야기', emoji: '👨‍👩‍👧‍👦', color: '#dc2626' },
  { id: 'economy', name: '재테크 / 노후', desc: '돈 관리, 연금, 자산', emoji: '💰', color: '#ca8a04' },
  { id: 'realestate', name: '부동산', desc: '청약, 투자, 동네 변화', emoji: '🏘️', color: '#0891b2' },
  { id: 'health', name: '건강 / 운동', desc: '집에서 하는 운동, 식단', emoji: '💪', color: '#16a34a' },
  { id: 'food', name: '요리 / 맛집', desc: '집밥 레시피, 동네 맛집', emoji: '🍳', color: '#ea580c' },
  { id: 'travel', name: '여행 / 취미', desc: '국내외 여행, 즐거움', emoji: '✈️', color: '#0284c7' },
  { id: 'aitech', name: 'AI / 디지털', desc: '핸드폰, AI 도구 입문', emoji: '🤖', color: '#4f46e5' },
  { id: 'language', name: '외국어', desc: '영어, 일본어 학습 후기', emoji: '🌍', color: '#059669' },
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
          padding: 32px 24px 22px;
          background: #ffffff;
          border-bottom: 2px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .hero { padding: 22px 18px 18px; }
        }

        .heroKicker {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .heroKicker { font-size: 10px; margin-bottom: 8px; } }

        .heroTitle {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.03em;
          line-height: 1.25;
          margin: 0 0 14px;
          max-width: 780px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .heroTitle { font-size: 22px; margin-bottom: 12px; } }

        .heroTitleAccent {
          background: linear-gradient(180deg, transparent 60%, #fbbf24 60%);
          padding: 0 4px;
        }

        .heroSub {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 15px;
          color: #525252;
          line-height: 1.55;
          font-weight: 500;
          max-width: 720px;
          margin: 0 0 20px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .heroSub { font-size: 13.5px; margin-bottom: 16px; } }

        /* 헤더 핵심 정보 (메타 라인) - v9.6 그리드 컴팩트 */
        .heroMeta {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .heroMeta { 
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            padding-top: 12px;
          }
        }
        .heroMetaItem {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px 10px;
          background: #fafafa;
          border-radius: 6px;
          align-items: center;
          text-align: center;
        }
        @media (max-width: 600px) {
          .heroMetaItem { padding: 6px 4px; }
        }
        .heroMetaLabel {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #737373;
          text-transform: uppercase;
        }
        .heroMetaValue {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .heroMetaValue { font-size: 12px; }
          .heroMetaLabel { font-size: 8.5px; letter-spacing: 0.08em; }
        }

        /* ============================================ */
        /* v10.4: ALGORITHM ENGINE 임팩트 영역 */
        /* ============================================ */
        .algoHero {
          padding: 36px 24px 32px;
          background: #ffffff;
          border-bottom: 2px solid #0a0a0a;
          text-align: center;
        }
        @media (max-width: 600px) {
          .algoHero { padding: 26px 18px 24px; }
        }

        /* 상단 라벨 */
        .algoHeroLabel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 22px;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .algoHeroLabel { margin-bottom: 18px; gap: 8px; }
        }

        .algoHeroLabelText {
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .algoHeroLabelText { font-size: 10px; letter-spacing: 0.18em; }
        }

        .algoHeroLive {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: 0.2em;
          padding: 2px 8px;
          background: rgba(22, 163, 74, 0.08);
          border: 1px solid rgba(22, 163, 74, 0.3);
        }
        @media (max-width: 600px) { .algoHeroLive { font-size: 9px; padding: 2px 7px; } }

        .algoHeroLiveDot {
          width: 6px;
          height: 6px;
          background: #16a34a;
          border-radius: 50%;
          animation: algoPulse 1.6s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(22, 163, 74, 0.6);
        }
        @keyframes algoPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        /* 메인 타이틀 */
        .algoHeroTitle {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.035em;
          line-height: 1.18;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .algoHeroTitle { font-size: 26px; margin-bottom: 12px; }
        }

        .algoHeroTitleAccent {
          color: #c2410c;
        }

        .algoHeroSub {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 15px;
          color: #525252;
          line-height: 1.65;
          font-weight: 500;
          margin: 0 auto 28px;
          max-width: 540px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .algoHeroSub { font-size: 13px; margin-bottom: 22px; }
        }

        /* 5단계 가로 파이프라인 */
        .algoPipeline {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin: 0 0 28px;
          padding: 14px 18px;
          background: #0a0a0a;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .algoPipeline {
            padding: 12px 12px;
            margin-bottom: 22px;
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }

        .algoPipelineStep {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0 14px;
        }
        @media (max-width: 600px) {
          .algoPipelineStep { padding: 0 6px; gap: 2px; }
        }

        .algoPipelineNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .algoPipelineNum { font-size: 9.5px; } }

        .algoPipelineLabel {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .algoPipelineLabel { font-size: 11px; } }

        .algoPipelineArrow {
          color: #c2410c;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .algoPipelineArrow { font-size: 11px; } }

        /* 버튼 */
        .algoHeroButtons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) {
          .algoHeroButtons { gap: 8px; flex-wrap: nowrap; }
        }

        .algoHeroBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 13px 26px;
          font-family: 'Pretendard', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: all 0.15s;
          min-height: 46px;
          border: 1.5px solid;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .algoHeroBtn {
            padding: 11px 16px;
            font-size: 13px;
            min-height: 42px;
            flex: 1;
          }
        }

        .algoHeroBtnPrimary {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }
        .algoHeroBtnPrimary:hover {
          background: #c2410c;
          border-color: #c2410c;
        }

        .algoHeroBtnSecondary {
          background: transparent;
          color: #0a0a0a;
          border-color: #0a0a0a;
        }
        .algoHeroBtnSecondary:hover {
          background: #0a0a0a;
          color: #ffffff;
        }

        .algoHeroNote {
          font-family: 'Pretendard', sans-serif;
          font-size: 11px;
          color: #a3a3a3;
          letter-spacing: 0.04em;
          margin-top: 8px;
        }
        @media (max-width: 600px) {
          .algoHeroNote { font-size: 10px; }
        }

        /* ============================================ */
        /* 추천 시작 — 입문자용 가이드 (강조) */
        /* ============================================ */
        .startSection {
          padding: 32px 24px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .startSection { padding: 24px 20px; }
        }
        .startKicker {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .startTitle {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .startTitle { font-size: 19px; } }
        .startSub {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 14px;
          color: #525252;
          line-height: 1.55;
          margin: 0 0 24px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .startSub { font-size: 13px; } }

        .startCard {
          display: block;
          background: #ffffff;
          border: 2px solid #0a0a0a;
          padding: 18px 22px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }
        .startCard:hover {
          background: #0a0a0a;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .startCard { padding: 14px 18px; }
        }
        .startCardKicker {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
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
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .startCardTitle { font-size: 16px; } }
        .startCardDesc {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 13.5px;
          color: #525252;
          line-height: 1.55;
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
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10.5px;
          color: #737373;
          letter-spacing: 0.06em;
        }
        .startCard:hover .startCardTime {
          color: rgba(255, 255, 255, 0.7);
        }
        .startCardArrow {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
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
          padding: 28px 24px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) { .section { padding: 22px 20px; } }

        .sectionHead {
          margin-bottom: 16px;
        }
        .sectionKicker {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .sectionTitle {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 18px; } }
        .sectionDesc {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 13.5px;
          color: #525252;
          line-height: 1.55;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .sectionDesc { font-size: 12.5px; } }

        /* 가이드 카드 */
        .guideGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .guideGrid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 6px;
            padding-top: 12px;
          }
        }
        .guideCard {
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .guideCard:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-2px);
        }
        .guideCardAccent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        @media (max-width: 600px) {
          .guideCard { padding: 12px 12px; }
        }
        .guideCardHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .guideCardEmoji {
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .guideCardEmoji { font-size: 20px; } }
        .guideCardKicker {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #c2410c;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .guideCardKicker { font-size: 9px; } }
        .guideCardTitle {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin: 0 0 6px;
          word-break: keep-all;
          flex: 1;
        }
        @media (max-width: 600px) { .guideCardTitle { font-size: 13px; } }
        .guideCardSub {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 11.5px;
          color: #737373;
          line-height: 1.5;
          margin: 0 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { 
          .guideCardSub { 
            font-size: 11px; 
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          } 
        }
        .guideCardMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px dashed #d4d4d4;
          margin-top: auto;
        }
        .guideCardTime {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10px;
          color: #737373;
          letter-spacing: 0.04em;
        }
        .guideCardArrow {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* 카테고리 그리드 - v9.6 시각적 강화 */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          border-top: 1px solid #0a0a0a;
          padding-top: 14px;
        }
        @media (max-width: 600px) {
          .catGrid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 6px;
            padding-top: 12px;
          }
        }
        .catCard {
          padding: 14px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .catCard:hover { 
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-2px);
        }
        .catCardEmoji {
          font-size: 28px;
          line-height: 1;
          margin-bottom: 2px;
        }
        @media (max-width: 600px) { .catCardEmoji { font-size: 24px; } }
        .catCardAccent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        .catName {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          margin-bottom: 2px;
        }
        @media (max-width: 600px) { .catName { font-size: 12.5px; } }
        .catDesc {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 11px;
          color: #737373;
          line-height: 1.45;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .catDesc { font-size: 10.5px; } }

        /* FAQ */
        /* FAQ 아코디언 - v9.6 컴팩트 */
        .faqList {
          border-top: 1px solid #0a0a0a;
        }
        .faqItem {
          border-bottom: 1px solid #e5e5e5;
          padding: 0;
        }
        .faqItem summary {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          padding: 14px 36px 14px 0;
          cursor: pointer;
          position: relative;
          list-style: none;
          word-break: keep-all;
        }
        .faqItem summary::-webkit-details-marker {
          display: none;
        }
        .faqItem summary::after {
          content: '+';
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          font-weight: 400;
          color: #737373;
          transition: transform 0.2s;
          line-height: 1;
        }
        .faqItem[open] summary::after {
          content: '−';
          color: #c2410c;
        }
        .faqItem summary:hover {
          color: #c2410c;
        }
        @media (max-width: 600px) { 
          .faqItem summary { font-size: 13px; padding: 12px 32px 12px 0; }
          .faqItem summary::after { right: 4px; font-size: 20px; }
        }
        .faqA {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 13px;
          color: #525252;
          line-height: 1.6;
          margin: 0;
          padding: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .faqA { font-size: 12.5px; padding-bottom: 12px; } }

        /* 보조 도구 안내 (작게) */
        .toolBlock {
          padding: 32px 24px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) { .toolBlock { padding: 28px 20px; } }
        .toolKicker {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #737373;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .toolTitle {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .toolTitle { font-size: 14.5px; } }
        .toolDesc {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 13px;
          color: #525252;
          line-height: 1.55;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .toolDesc { font-size: 12px; } }
        .toolNote {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 12px;
          color: #737373;
          line-height: 1.55;
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
        {/* ============================================ */}
        {/* v10.4: ALGORITHM ENGINE 임팩트 영역 (Hero + 시작 섹션 대체) */}
        {/* ============================================ */}
        <section className="algoHero">
          <div className="algoHeroLabel">
            <span className="algoHeroLabelText">▍ ALGORITHM ENGINE</span>
            <span className="algoHeroLive">
              <span className="algoHeroLiveDot" />
              LIVE
            </span>
          </div>

          <h1 className="algoHeroTitle">
            유튜브 <span className="algoHeroTitleAccent">알고리즘</span>을<br />
            읽어드립니다
          </h1>

          <p className="algoHeroSub">
            키워드 1개로 떡상 패턴 분석 · 제목 후보 ·<br />
            시나리오 · 4개 SNS 자료까지 5초 안에
          </p>

          <div className="algoPipeline">
            <div className="algoPipelineStep">
              <div className="algoPipelineNum">01</div>
              <div className="algoPipelineLabel">분석</div>
            </div>
            <div className="algoPipelineArrow">→</div>
            <div className="algoPipelineStep">
              <div className="algoPipelineNum">02</div>
              <div className="algoPipelineLabel">생성</div>
            </div>
            <div className="algoPipelineArrow">→</div>
            <div className="algoPipelineStep">
              <div className="algoPipelineNum">03</div>
              <div className="algoPipelineLabel">구조</div>
            </div>
            <div className="algoPipelineArrow">→</div>
            <div className="algoPipelineStep">
              <div className="algoPipelineNum">04</div>
              <div className="algoPipelineLabel">제작</div>
            </div>
            <div className="algoPipelineArrow">→</div>
            <div className="algoPipelineStep">
              <div className="algoPipelineNum">05</div>
              <div className="algoPipelineLabel">배포</div>
            </div>
          </div>

          <div className="algoHeroButtons">
            <Link href="/publish?keyword=50대 재취업&category=economy" className="algoHeroBtn algoHeroBtnPrimary">
              ▶ 무료로 시작
            </Link>
            <Link href="/blog" className="algoHeroBtn algoHeroBtnSecondary">
              📚 가이드 17편 보기
            </Link>
          </div>

          <div className="algoHeroNote">
            회원가입 없음 · 완전 무료 · 시니어 친화 디자인
          </div>
        </section>

        {/* 광고 영역 */}
        <div className="adArea">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* FEATURED GUIDES */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">📚 추천 가이드</div>
            <h2 className="sectionTitle">시니어 분들께 추천하는 가이드</h2>
            <p className="sectionDesc">
              영상 만들기에서 가장 자주 묻는 주제를 정리한 가이드 6편.
            </p>
          </div>
          <div className="guideGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link key={g.slug} href={`/knowhow/${g.slug}`} className="guideCard">
                <div className="guideCardAccent" style={{ background: g.color || '#c2410c' }} />
                <div className="guideCardHead">
                  <span className="guideCardEmoji">{g.emoji || '📘'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="guideCardKicker">{g.category}{g.badge ? ` · ${g.badge}` : ''}</div>
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

        {/* CATEGORIES */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">🗂 분야별 가이드</div>
            <h2 className="sectionTitle">분야별 가이드 탐색</h2>
            <p className="sectionDesc">
              관심 있는 분야의 가이드를 모아서 보실 수 있어요.
              시니어 분들이 많이 찾는 분야부터 정리했습니다.
            </p>
          </div>
          <div className="catGrid">
            {CATEGORY_NAV.map((c) => (
              <Link key={c.id} href={`/blog?category=${c.id}`} className="catCard">
                <div className="catCardAccent" style={{ background: c.color || '#c2410c' }} />
                <div className="catCardEmoji">{c.emoji || '📂'}</div>
                <div className="catName">{c.name}</div>
                <div className="catDesc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">💬 자주 묻는 질문</div>
            <h2 className="sectionTitle">자주 묻는 질문</h2>
          </div>
          <div className="faqList">
            {FAQ_LIST.map((f, i) => (
              <details key={i} className="faqItem" open={i === 0}>
                <summary>Q. {f.q}</summary>
                <p className="faqA">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 보조 도구 안내 (하단에 작게) */}
        <section className="toolBlock">
          <div className="toolKicker">🛠 보조 도구</div>
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
