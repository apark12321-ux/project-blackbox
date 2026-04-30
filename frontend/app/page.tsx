'use client';
/**
 * AlgoMaker 메인 페이지 v9.0 (B안 - Synergy Timeline)
 *
 * 박예준 대표 비전:
 * "유입 키워드 (SNS 최적화·알고리즘·수익화) 로 들어온 사람이
 *  메인을 보자마자 정체성을 알 수 있도록"
 * "텍스트는 적게, 시각화는 강하게"
 *
 * v9.0 컨셉:
 *  - 키워드 → 분석 → 시나리오 → SNS → 완성 5단계 타임라인
 *  - 각 단계가 시각적으로 연결되는 흐름 애니메이션
 *  - Studio Treatment 톤 유지 (블랙·화이트·앰버)
 *  - 가짜 데이터 0
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 6편
 *  - CATEGORY_NAV 9개 카테고리
 *  - FAQ_LIST 6개
 *  - AEO/GEO JSON-LD SEO
 */

import { useState } from 'react';
import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import AdSlot from './_shared/AdSlot';

// ============================================================
// 추천 가이드 6편 (박 대표님 자산 보존)
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

// ============================================================
// 분야별 탐색 (박 대표님 자산 보존)
// ============================================================
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

// ============================================================
// FAQ - AEO/GEO 최적화 (박 대표님 자산 보존)
// ============================================================
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
    a: '현재 17편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다.',
  },
  {
    q: '키워드 입력 도구는 어떻게 사용하나요?',
    a: '관심 있는 키워드 한 단어를 입력하시면, AI가 분야를 자동 감지해 영상 제목, 대본 흐름, 태그, SNS 메타데이터 등을 자동으로 만들어드립니다.',
  },
  {
    q: '완전 무료인가요?',
    a: '네, 회원가입도 결제도 없이 모든 기능을 무료로 사용하실 수 있습니다. 사이트는 광고 수익(Google AdSense)으로 운영됩니다.',
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

// ============================================================
// 시너지 타임라인 5단계 데이터
// ============================================================
const TIMELINE_STEPS = [
  {
    num: '01',
    title: '키워드 입력',
    sub: 'KEYWORD',
    desc: '관심 있는 단어 하나만 입력합니다',
    detail: '"부동산", "건강", "여행" — 한 단어면 충분합니다.',
  },
  {
    num: '02',
    title: '알고리즘 분석',
    sub: 'ALGORITHM',
    desc: '도메인 자동 감지 · 떡상 패턴 매칭',
    detail: '12개 카테고리에서 시청자가 반응하는 후킹 구조를 자동 탐색합니다.',
  },
  {
    num: '03',
    title: '시나리오 생성',
    sub: 'SCENARIO',
    desc: '100가지 다른 시나리오 · 6단계 비트',
    detail: '같은 키워드도 매번 다른 결과. 작가급 스토리텔링 + 떡상 패턴 융합.',
  },
  {
    num: '04',
    title: 'SNS 4종 변환',
    sub: 'DISTRIBUTION',
    desc: 'YouTube · Shorts · Instagram · TikTok',
    detail: '플랫폼별 메타데이터·태그·썸네일까지 모두 자동 생성.',
  },
  {
    num: '05',
    title: '업로드 완성',
    sub: 'PUBLISH',
    desc: '복사 붙여넣기로 즉시 게시',
    detail: '각 SNS 실제 업로드 화면 그대로. 회원가입 X · 결제 X.',
  },
];

export default function HomePage() {
  const [keyword, setKeyword] = useState('');

  const handleStart = (initialKeyword?: string) => {
    const k = initialKeyword || keyword;
    if (!k.trim()) return;
    window.location.href = `/create?keyword=${encodeURIComponent(k.trim())}`;
  };

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

      {/* AEO/GEO 숨김 영역 (박 대표님 자산 보존) */}
      <div style={{ position: 'absolute', left: '-9999px', overflow: 'hidden' }} aria-hidden="false">
        <h1>AlgoMaker - 시니어 영상 제작 도움말 + AI 떡상 시나리오 생성기</h1>
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
          padding: 0 0 60px;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        /* ============================================ */
        /* HERO — Studio Treatment 헤더 */
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
          margin: 0 0 14px;
          max-width: 760px;
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
          line-height: 1.7;
          font-weight: 500;
          max-width: 640px;
          margin: 0 0 24px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .heroSub { font-size: 14px; } }

        /* 핵심 키워드 라벨 */
        .heroChips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .heroChip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          padding: 5px 12px;
          background: transparent;
          border: 1px solid #0a0a0a;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .heroChip { font-size: 10px; padding: 4px 10px; letter-spacing: 0.08em; }
        }

        /* 키워드 입력 */
        .heroInput {
          display: flex;
          gap: 0;
          max-width: 580px;
          border: 2px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .heroInput { flex-direction: column; }
        }
        .keywordInput {
          flex: 1;
          border: none;
          outline: none;
          padding: 16px 20px;
          font-size: 15px;
          color: #0a0a0a;
          font-family: 'Noto Serif KR', 'Pretendard', serif;
          background: transparent;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .keywordInput {
            padding: 14px 16px;
            border-bottom: 1px solid #0a0a0a;
            text-align: center;
          }
        }
        .keywordInput::placeholder {
          color: #a3a3a3;
        }
        .keywordBtn {
          padding: 16px 24px;
          background: #0a0a0a;
          color: #ffffff;
          border: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
          text-transform: uppercase;
        }
        .keywordBtn:hover {
          background: #c2410c;
        }
        @media (max-width: 600px) {
          .keywordBtn { padding: 14px 20px; font-size: 11px; }
        }

        /* ============================================ */
        /* TIMELINE — 시너지 5단계 (B안 핵심) */
        /* ============================================ */
        .timelineSection {
          padding: 48px 24px 32px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .timelineSection { padding: 36px 20px 24px; }
        }

        .timelineHead {
          margin-bottom: 32px;
        }
        @media (max-width: 600px) {
          .timelineHead { margin-bottom: 24px; }
        }
        .timelineKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .timelineTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .timelineTitle { font-size: 19px; } }
        .timelineTitleSub {
          font-family: 'Noto Serif KR', serif;
          font-size: 14px;
          color: #525252;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .timelineTitleSub { font-size: 13px; } }

        /* PC 가로 타임라인 */
        .timelineFlow {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          position: relative;
          gap: 0;
        }
        @media (max-width: 800px) {
          .timelineFlow {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .timelineNode {
          position: relative;
          padding: 0 12px;
        }
        @media (max-width: 800px) {
          .timelineNode { 
            padding: 18px 0 18px 56px; 
          }
        }

        /* 연결선 (PC 가로) */
        .timelineNode::before {
          content: '';
          position: absolute;
          top: 12px;
          left: 0;
          right: 0;
          height: 1px;
          background: #d4d4d4;
        }
        .timelineNode:first-child::before {
          left: 50%;
        }
        .timelineNode:last-child::before {
          right: 50%;
        }
        @media (max-width: 800px) {
          .timelineNode::before {
            top: 24px;
            left: 11px;
            right: auto;
            width: 1px;
            height: calc(100% + 0px);
            bottom: -36px;
          }
          .timelineNode:first-child::before { left: 11px; top: 24px; }
          .timelineNode:last-child::before { display: none; }
        }

        /* 노드 점 */
        .timelineDot {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: #ffffff;
          border: 2px solid #0a0a0a;
          border-radius: 50%;
          z-index: 2;
        }
        @media (max-width: 800px) {
          .timelineDot {
            top: 18px;
            left: 5px;
            transform: none;
          }
        }
        .timelineNode.active .timelineDot {
          background: #c2410c;
          border-color: #c2410c;
        }

        .timelineCard {
          margin-top: 36px;
          padding: 18px 16px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          transition: all 0.2s;
        }
        @media (max-width: 800px) {
          .timelineCard {
            margin-top: 0;
            padding: 14px 16px;
          }
        }
        .timelineCard:hover {
          border-color: #0a0a0a;
        }

        .timelineNum {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 6px;
        }
        @media (max-width: 600px) { .timelineNum { font-size: 18px; } }

        .timelineSub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #737373;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .timelineCardTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 6px;
        }
        @media (max-width: 600px) { .timelineCardTitle { font-size: 13.5px; } }
        .timelineCardDesc {
          font-family: 'Noto Serif KR', serif;
          font-size: 12.5px;
          color: #525252;
          line-height: 1.55;
          margin-bottom: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .timelineCardDesc { font-size: 12px; } }
        .timelineCardDetail {
          font-family: 'Noto Serif KR', serif;
          font-size: 11.5px;
          color: #737373;
          line-height: 1.5;
          font-style: italic;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .timelineCardDetail { font-size: 11px; } }

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
          line-height: 1.6;
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

        /* 최종 CTA */
        .ctaBlock {
          padding: 48px 24px;
          background: #0a0a0a;
          color: #ffffff;
          text-align: center;
        }
        @media (max-width: 600px) { .ctaBlock { padding: 36px 20px; } }
        .ctaKicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #fbbf24;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .ctaTitle {
          font-family: 'Noto Serif KR', serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 8px;
        }
        @media (max-width: 600px) { .ctaTitle { font-size: 19px; } }
        .ctaSub {
          font-family: 'Noto Serif KR', serif;
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin: 0 0 24px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .ctaSub { font-size: 12.5px; } }
        .ctaBtn {
          display: inline-block;
          padding: 14px 32px;
          background: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .ctaBtn:hover {
          background: #ffffff;
          color: #0a0a0a;
        }
        @media (max-width: 600px) { .ctaBtn { padding: 12px 24px; font-size: 11.5px; } }

        /* 광고 영역 */
        .adArea { padding: 0 24px; margin: 24px 0; }
        @media (max-width: 600px) { .adArea { padding: 0 20px; margin: 20px 0; } }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="heroKicker">▍ AlgoMaker · Algorithm-Backed Video Tool</div>
          <h1 className="heroTitle">
            키워드 한 단어로<br />
            영상 한 편을 <span className="heroTitleAccent">완성</span>합니다
          </h1>
          <p className="heroSub">
            SNS 알고리즘이 좋아하는 시나리오 구조부터,
            YouTube · Shorts · Instagram · TikTok 4종 메타데이터까지.
            한 번의 입력으로 60초 안에 모두 받아보세요.
          </p>

          <div className="heroChips">
            <span className="heroChip">SNS 최적화</span>
            <span className="heroChip">알고리즘</span>
            <span className="heroChip">수익화</span>
            <span className="heroChip">완전 무료</span>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleStart(); }}
            className="heroInput"
          >
            <input
              type="text"
              className="keywordInput"
              placeholder="키워드 한 단어 — 부동산, 건강, 여행..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="keywordBtn">
              시작 →
            </button>
          </form>
        </section>

        {/* TIMELINE — 시너지 5단계 */}
        <section className="timelineSection">
          <div className="timelineHead">
            <div className="timelineKicker">▍ How It Works</div>
            <h2 className="timelineTitle">5단계 자동화 흐름</h2>
            <p className="timelineTitleSub">
              키워드 입력부터 SNS 업로드까지 — 박 대표님이 직접 영상 자료를 만들 필요 없습니다.
            </p>
          </div>

          <div className="timelineFlow">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={i} className={`timelineNode ${i === 0 ? 'active' : ''}`}>
                <div className="timelineDot" />
                <div className="timelineCard">
                  <div className="timelineNum">{step.num}</div>
                  <div className="timelineSub">{step.sub}</div>
                  <div className="timelineCardTitle">{step.title}</div>
                  <div className="timelineCardDesc">{step.desc}</div>
                  <div className="timelineCardDetail">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
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
              영상 시작이 처음이신 분들이 가장 먼저 읽어보시면 좋은 가이드 6편.
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
            <div className="sectionKicker">▍ FAQ</div>
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

        {/* FINAL CTA */}
        <section className="ctaBlock">
          <div className="ctaKicker">▍ Get Started</div>
          <h2 className="ctaTitle">키워드 한 단어로 시작해보세요</h2>
          <p className="ctaSub">
            완전 무료 · 회원가입 없음 · 무제한 사용<br />
            60초 안에 떡상 시나리오를 받아보실 수 있습니다.
          </p>
          <Link href="/create" className="ctaBtn">
            START NOW →
          </Link>
        </section>
      </div>
    </V11Shell>
  );
}
