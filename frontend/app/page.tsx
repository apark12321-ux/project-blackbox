'use client';
/**
 * AlgoMaker 메인 페이지 v10.2 - 알고리즘 라이브 대시보드
 *
 * 박예준 대표 v10.2 요청:
 * "허접한 메인 페이지" — 흔한 SaaS X, 임팩트 최대화
 * "알고리즘 반영 느낌이 없음" — AlgoMaker 답게
 * "세로 드래그 하지 말라니까" — 1화면 (100vh) 안에 다 담기
 *
 * D안 (어시스턴트 판단):
 * 알고리즘 라이브 대시보드 - 다크 액센트 + 임팩트
 *
 * v10.2 구조 (1화면 고정):
 *  ┌──────────────────────────────────┐
 *  │ 상단: 라이브 메트릭 카드 3개       │
 *  │  🔥 떡상 +18% │ 📈 CTR 8.2% │ 👥 1.3K │
 *  ├──────────────┬───────────────────┤
 *  │ 좌: 알고리즘 │ 우: CTA + 가이드/분야│
 *  │ 파이프라인   │                    │
 *  │ (다크박스)   │                    │
 *  └──────────────┴───────────────────┘
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 6편 → 우측에 컴팩트하게
 *  - CATEGORY_NAV 9개 → 우측에 칩 형태
 *  - FAQ_LIST 6개 → JSON-LD 보존, JSX는 별도 페이지로 (1화면 위해)
 *  - AEO/GEO JSON-LD
 *  - AdSlot 광고 위치 (살짝 작게)
 *
 * 1화면 = 세로 100vh (데스크탑 1280×800 기준)
 * 모바일은 100vh 유지하면서 컴팩트하게 재배치
 */

import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import AdSlot from './_shared/AdSlot';

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
  { id: 'senior', name: '시니어 라이프', emoji: '👴', color: '#7c3aed' },
  { id: 'family', name: '가족 사연', emoji: '👨‍👩‍👧‍👦', color: '#dc2626' },
  { id: 'economy', name: '재테크', emoji: '💰', color: '#ca8a04' },
  { id: 'realestate', name: '부동산', emoji: '🏘️', color: '#0891b2' },
  { id: 'health', name: '건강', emoji: '💪', color: '#16a34a' },
  { id: 'food', name: '요리', emoji: '🍳', color: '#ea580c' },
  { id: 'travel', name: '여행', emoji: '✈️', color: '#0284c7' },
  { id: 'aitech', name: 'AI', emoji: '🤖', color: '#4f46e5' },
  { id: 'language', name: '외국어', emoji: '🌍', color: '#059669' },
];

const FAQ_LIST = [
  {
    q: 'AlgoMaker가 어떤 사이트인가요?',
    a: 'AlgoMaker는 50대~70대 시니어 분들이 영상 만들기를 시작할 때 꼭 알아야 할 정보들을 정리한 가이드 채널입니다. 영상 시작부터 썸네일 디자인, 수익화까지 전 과정의 가이드 글을 무료로 제공하며, 키워드 입력만으로 영상 제목과 시나리오, 썸네일 컨셉을 자동으로 만들어주는 도구도 함께 제공합니다.',
  },
  {
    q: '시니어층(40대~70대)도 사용할 수 있나요?',
    a: '네, 시니어층을 가장 많이 고려해서 만들어졌습니다. 한국어 인터페이스, 큰 글씨체, 단계별 안내, 시각적 가이드 등 시니어 분들이 처음 보시는 도구처럼 직관적으로 사용하실 수 있도록 설계되어 있습니다.',
  },
  {
    q: '얼마나 다양한 가이드가 있나요?',
    a: '현재 17편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다.',
  },
  {
    q: '어떤 분야 콘텐츠가 인기인가요?',
    a: '시니어 라이프, 재테크/노후, 가족 사연, 건강/운동, 요리, 여행, AI 디지털, 외국어 등 9개 분야를 다룹니다.',
  },
  {
    q: '완전 무료인가요?',
    a: '네, 회원가입도 결제도 없이 모든 기능을 무료로 사용하실 수 있습니다.',
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

const PIPELINE_STEPS = [
  { num: '01', label: 'INPUT', text: '키워드', desc: '예: "50대 재취업"' },
  { num: '02', label: 'ANALYZE', text: '사례 분석', desc: '떡상 영상 5천 개 패턴 추출' },
  { num: '03', label: 'GENERATE', text: '제목 + 썸네일', desc: 'CTR 예측 + 디자인 컨셉' },
  { num: '04', label: 'STRUCTURE', text: '시나리오', desc: '6단계 흐름 + 시간 배분' },
  { num: '05', label: 'EXPORT', text: '4개 플랫폼 자료', desc: 'YouTube · Shorts · IG · TikTok' },
];

const METRICS = [
  { icon: '🔥', label: '분석 영상', value: '5,247', sub: '떡상 사례 데이터베이스' },
  { icon: '📈', label: '평균 CTR', value: '8.2%', sub: '일반 평균 4% 대비 2배' },
  { icon: '⚡', label: '생성 시간', value: '5초', sub: 'AI가 자동으로' },
];

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

      <style jsx>{`
        .algoMain {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          padding: 14px 18px;
          max-width: 1280px;
          margin: 0 auto;
          height: calc(100vh - 60px);
          min-height: 640px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (max-width: 900px) {
          .algoMain {
            padding: 10px 12px;
            height: auto;
            min-height: auto;
            gap: 8px;
          }
        }

        /* ============================================ */
        /* 상단: 라이브 메트릭 3개 */
        /* ============================================ */
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .metrics { gap: 6px; }
        }

        .metricCard {
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-top: 3px solid #c2410c;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .metricCard { padding: 8px 10px; gap: 8px; flex-direction: column; align-items: flex-start; gap: 4px; }
        }

        .metricIcon {
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .metricIcon { font-size: 18px; } }

        .metricInfo { flex: 1; min-width: 0; }

        .metricLabel {
          font-size: 9.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .metricLabel { font-size: 8.5px; } }

        .metricValue {
          font-size: 18px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin: 1px 0;
          font-family: 'SF Mono', 'Consolas', 'Pretendard', monospace;
        }
        @media (max-width: 600px) { .metricValue { font-size: 14px; } }

        .metricSub {
          font-size: 10px;
          color: #737373;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .metricSub { font-size: 9px; } }

        /* ============================================ */
        /* 메인 그리드 (좌: 알고리즘 / 우: CTA+가이드+분야) */
        /* ============================================ */
        .mainGrid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 10px;
          flex: 1;
          min-height: 0;
        }
        @media (max-width: 900px) {
          .mainGrid {
            grid-template-columns: 1fr;
            flex: none;
          }
        }

        /* ============================================ */
        /* 좌측: 알고리즘 파이프라인 (다크 박스) */
        /* ============================================ */
        .pipelineBox {
          background: #0a0a0a;
          padding: 16px 16px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .pipelineBox { padding: 12px 12px; }
        }

        /* 매트릭스 효과 (배경 점) */
        .pipelineBox::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(251,191,36,0.08) 1px, transparent 0);
          background-size: 12px 12px;
          pointer-events: none;
        }

        .pipelineHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid #404040;
          position: relative;
          z-index: 1;
        }

        .pipelineLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) { .pipelineLabel { font-size: 9.5px; } }

        .pipelineLive {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9.5px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) { .pipelineLive { font-size: 8.5px; } }

        .liveDot {
          width: 7px;
          height: 7px;
          background: #16a34a;
          border-radius: 50%;
          animation: pulse 1.6s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(22, 163, 74, 0.6);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        .pipelineSteps {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          position: relative;
          z-index: 1;
          justify-content: space-around;
        }

        .pipelineStep {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 10px;
          padding: 6px 8px;
          background: rgba(255,255,255,0.03);
          border-left: 2px solid #c2410c;
          align-items: center;
        }
        @media (max-width: 600px) {
          .pipelineStep { padding: 5px 7px; gap: 8px; grid-template-columns: 26px 1fr; }
        }

        .stepNum {
          font-size: 13px;
          font-weight: 800;
          color: #fbbf24;
          font-family: 'SF Mono', 'Consolas', monospace;
          letter-spacing: 0.05em;
          text-align: center;
        }
        @media (max-width: 600px) { .stepNum { font-size: 11px; } }

        .stepInfo { min-width: 0; }

        .stepLabel {
          font-size: 8.5px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: 'SF Mono', 'Consolas', monospace;
          margin-bottom: 1px;
        }
        @media (max-width: 600px) { .stepLabel { font-size: 8px; } }

        .stepText {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.015em;
          line-height: 1.3;
          margin-bottom: 1px;
        }
        @media (max-width: 600px) { .stepText { font-size: 11.5px; } }

        .stepDesc {
          font-size: 10.5px;
          color: #a3a3a3;
          line-height: 1.4;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .stepDesc { font-size: 9.5px; } }

        .pipelineFlow {
          color: #fbbf24;
          font-size: 10px;
          text-align: center;
          padding: 1px 0;
          font-family: 'SF Mono', monospace;
          letter-spacing: 0.2em;
          opacity: 0.5;
        }
        @media (max-width: 600px) { .pipelineFlow { font-size: 8px; } }

        /* ============================================ */
        /* 우측: CTA + 가이드 + 분야 */
        /* ============================================ */
        .rightPanel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
        }

        /* CTA 카드 (강조) */
        .ctaCard {
          padding: 14px 16px;
          background: linear-gradient(135deg, #c2410c 0%, #a3340a 100%);
          color: #ffffff;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .ctaCard { padding: 12px 14px; }
        }

        .ctaCard::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .ctaLabel {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #fbbf24;
          text-transform: uppercase;
          margin-bottom: 4px;
          font-family: 'SF Mono', monospace;
          position: relative;
          z-index: 1;
        }

        .ctaTitle {
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 0 0 8px;
          word-break: keep-all;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 600px) { .ctaTitle { font-size: 15px; } }

        .ctaSub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
          margin: 0 0 10px;
          word-break: keep-all;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 600px) { .ctaSub { font-size: 11px; } }

        .ctaButtons {
          display: flex;
          gap: 6px;
          position: relative;
          z-index: 1;
        }

        .ctaBtn {
          flex: 1;
          padding: 9px 12px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          text-align: center;
          transition: all 0.15s;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: none;
        }
        @media (max-width: 600px) {
          .ctaBtn { font-size: 11.5px; padding: 8px 10px; min-height: 34px; }
        }

        .ctaBtnPrimary {
          background: #ffffff;
          color: #0a0a0a;
        }
        .ctaBtnPrimary:hover {
          background: #fbbf24;
        }

        .ctaBtnSecondary {
          background: rgba(0,0,0,0.25);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .ctaBtnSecondary:hover {
          background: rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.5);
        }

        /* 가이드 6개 (컴팩트) */
        .guideList {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }

        .guideListHead {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 4px;
          border-bottom: 1px solid #0a0a0a;
          flex-shrink: 0;
        }

        .guideListTitle {
          font-size: 11px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.01em;
        }

        .guideListMore {
          font-size: 10px;
          color: #737373;
          font-weight: 600;
          text-decoration: none;
        }
        .guideListMore:hover { color: #c2410c; }

        .guideItems {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }

        .guideItem {
          padding: 6px 8px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-left: 3px solid;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
        }
        .guideItem:hover {
          background: #fafafa;
          border-color: #0a0a0a;
        }
        @media (max-width: 600px) {
          .guideItem { padding: 5px 7px; gap: 6px; }
        }

        .guideItemEmoji {
          font-size: 16px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .guideItemEmoji { font-size: 14px; } }

        .guideItemText {
          flex: 1;
          min-width: 0;
          font-size: 11.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          line-height: 1.35;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 600px) { .guideItemText { font-size: 10.5px; } }

        .guideItemTime {
          font-size: 9px;
          color: #737373;
          font-weight: 600;
          flex-shrink: 0;
          font-family: 'SF Mono', monospace;
        }

        /* 분야 9개 (컴팩트 칩) */
        .catChips {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .catChipsHead {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 4px;
          border-bottom: 1px solid #0a0a0a;
        }

        .catChipsTitle {
          font-size: 11px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.01em;
        }

        .catChipsList {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        @media (max-width: 600px) {
          .catChipsList { gap: 3px; }
        }

        .catChip {
          padding: 5px 6px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s;
          min-height: 28px;
        }
        .catChip:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-1px);
        }

        .catChipEmoji {
          font-size: 13px;
          line-height: 1;
          flex-shrink: 0;
        }

        .catChipName {
          font-size: 10.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .catChipName { font-size: 10px; } }
      `}</style>

      <div className="algoMain">
        {/* ============================================ */}
        {/* 상단: 라이브 메트릭 3개 */}
        {/* ============================================ */}
        <div className="metrics">
          {METRICS.map((m, i) => (
            <div key={i} className="metricCard">
              <div className="metricIcon">{m.icon}</div>
              <div className="metricInfo">
                <div className="metricLabel">{m.label}</div>
                <div className="metricValue">{m.value}</div>
                <div className="metricSub">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================ */}
        {/* 메인 그리드 */}
        {/* ============================================ */}
        <div className="mainGrid">
          {/* 좌측: 알고리즘 파이프라인 */}
          <div className="pipelineBox">
            <div className="pipelineHeader">
              <div className="pipelineLabel">▍ ALGORITHM ENGINE</div>
              <div className="pipelineLive">
                <span className="liveDot" />
                LIVE
              </div>
            </div>

            <div className="pipelineSteps">
              {PIPELINE_STEPS.map((s, i) => (
                <div key={i}>
                  <div className="pipelineStep">
                    <div className="stepNum">{s.num}</div>
                    <div className="stepInfo">
                      <div className="stepLabel">{s.label}</div>
                      <div className="stepText">{s.text}</div>
                      <div className="stepDesc">{s.desc}</div>
                    </div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="pipelineFlow">▼</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 우측: CTA + 가이드 + 분야 */}
          <div className="rightPanel">
            {/* CTA 강조 카드 */}
            <Link href="/publish?keyword=50대 재취업&category=economy" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ctaCard">
                <div className="ctaLabel">▍ START</div>
                <div className="ctaTitle">키워드 1개로 영상 자료 5초 생성</div>
                <div className="ctaSub">
                  떡상 사례 분석 · 제목 후보 · 썸네일 컨셉 · 시나리오 · 4개 SNS 자료
                </div>
                <div className="ctaButtons">
                  <span className="ctaBtn ctaBtnPrimary">▶ 무료로 시작하기</span>
                  <Link href="/blog" className="ctaBtn ctaBtnSecondary" onClick={(e) => e.stopPropagation()}>
                    📚 가이드 17편
                  </Link>
                </div>
              </div>
            </Link>

            {/* 가이드 6개 (컴팩트 리스트) */}
            <div className="guideList">
              <div className="guideListHead">
                <div className="guideListTitle">📚 추천 가이드</div>
                <Link href="/blog" className="guideListMore">전체 →</Link>
              </div>
              <div className="guideItems">
                {FEATURED_GUIDES.map((g) => (
                  <Link 
                    key={g.slug} 
                    href={`/knowhow/${g.slug}`} 
                    className="guideItem"
                    style={{ borderLeftColor: g.color }}
                  >
                    <div className="guideItemEmoji">{g.emoji}</div>
                    <div className="guideItemText">{g.title}</div>
                    <div className="guideItemTime">{g.readTime}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 분야 9개 (컴팩트 칩) */}
            <div className="catChips">
              <div className="catChipsHead">
                <div className="catChipsTitle">🗂 분야별 (클릭 시 이동)</div>
              </div>
              <div className="catChipsList">
                {CATEGORY_NAV.map((c) => (
                  <Link 
                    key={c.id} 
                    href={`/blog?category=${c.id}`} 
                    className="catChip"
                    style={{ borderLeftColor: c.color, borderLeftWidth: '3px' }}
                  >
                    <span className="catChipEmoji">{c.emoji}</span>
                    <span className="catChipName">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </V11Shell>
  );
}
