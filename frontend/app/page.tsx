'use client';
/**
 * AlgoMaker 메인 페이지 v10.1 - 스토리텔링 (D안)
 *
 * 박예준 대표 비전:
 * "50대~70대 시니어층을 위한 영상 제작 도움말 채널"
 * "가이드 글이 메인 콘텐츠"
 * "AlgoMaker 자체 = 완전 무료"
 *
 * 박 대표님 v10.1 요청:
 * "검색창은 필요없잖아"        → 키워드 박스 제거
 * "분야선택은 클릭하면 넘어가지도 않음" → 분야 클릭 시 /blog?category=xxx 이동 작동
 * "한편의 이야기와 같은 화면"   → 스토리텔링
 * "오래 머무르게 만드는 뭔가"   → 체류시간 ↑ (AdSense 점수 ↑)
 *
 * D안 (어시스턴트 판단):
 * 시니어 공감 + 도구 필요성 복합 스토리텔링
 *
 * v10.1 구조 (8섹션):
 *  1. HOOK - 시니어 공감 ("퇴직 후 영상 만들어볼까 하셨나요?")
 *  2. 막히는 5가지 (체크리스트 ❌)
 *  3. AlgoMaker 해결 (✅)
 *  4. 실제 작동 예시 ("50대 재취업" 미리보기)
 *  5. 추천 가이드 6편 (박 대표님 자산)
 *  6. 분야별 9개 - 클릭 시 /blog 이동 (박 대표님 자산)
 *  7. CTA (가이드 보기 / 자료 만들기)
 *  8. FAQ (모두 접힘, 박 대표님 자산)
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 6편
 *  - CATEGORY_NAV 9개
 *  - FAQ_LIST 6개
 *  - AEO/GEO JSON-LD
 *  - AdSlot 광고 위치
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
    a: 'AlgoMaker는 50대~70대 시니어 분들이 영상 만들기를 시작할 때 꼭 알아야 할 정보들을 정리한 가이드 채널입니다. 영상 시작부터 썸네일 디자인, 수익화까지 전 과정의 가이드 글을 무료로 제공하며, 키워드 입력만으로 영상 제목과 시나리오, 썸네일 컨셉을 자동으로 만들어주는 도구도 함께 제공합니다.',
  },
  {
    q: '시니어층(40대~70대)도 사용할 수 있나요?',
    a: '네, 시니어층을 가장 많이 고려해서 만들어졌습니다. 한국어 인터페이스, 큰 글씨체, 단계별 안내, 시각적 가이드 등 시니어 분들이 처음 보시는 도구처럼 직관적으로 사용하실 수 있도록 설계되어 있습니다.',
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

// ============================================================
// 시니어가 막히는 5가지 + AlgoMaker 해결
// ============================================================
const PAIN_POINTS = [
  {
    pain: '어떤 영상을 만들지 모르겠어요',
    desc: '내가 잘 아는 게 영상 거리가 될까... 막막하셨죠.',
    solution: '키워드 1개만 알려주세요',
    detail: '실제로 떡상한 사례 3개를 분석해서 보여드립니다. 어떤 패턴인지, 왜 인기인지까지.',
    emoji: '💭',
    color: '#dc2626',
  },
  {
    pain: '제목은 어떻게 짓지요?',
    desc: '같은 영상도 제목 따라 조회수가 10배씩 차이 납니다.',
    solution: '제목 후보 3가지를 한 번에',
    detail: '클릭률 높은 패턴별 제목 3개. 예상 CTR과 어떤 시청자에게 끌리는지까지 알려드립니다.',
    emoji: '✏️',
    color: '#c2410c',
  },
  {
    pain: '썸네일은 어떻게 만들죠?',
    desc: '디자인 모르셔도 됩니다. 어떻게 만들지만 알면 됩니다.',
    solution: '썸네일 컨셉 3가지',
    detail: '배경, 메인 텍스트, 표정, 색상까지. AI 이미지 생성 도구(Midjourney, DALL-E)에 그대로 넣을 수 있는 한글/영문 프롬프트.',
    emoji: '🎨',
    color: '#9333ea',
  },
  {
    pain: '시나리오 어떻게 짜야 하나요?',
    desc: '시청자가 끝까지 보는 영상은 구조가 있습니다.',
    solution: '6단계 시나리오 자동 생성',
    detail: '후킹 → 본격 시작 → 갈등/시점 변화 → 핵심 비밀 → 결론 → CTA. 시간대까지 정확히.',
    emoji: '📖',
    color: '#2563eb',
  },
  {
    pain: '어디에 어떻게 올리죠?',
    desc: '플랫폼마다 형식이 달라서 헷갈리셨죠.',
    solution: '4개 플랫폼 자료 한 번에',
    detail: 'YouTube (긴 영상), YouTube Shorts (60초), Instagram Reels, TikTok. 각 플랫폼 실제 업로드 화면처럼 보여드립니다.',
    emoji: '📱',
    color: '#16a34a',
  },
];

// ============================================================
// 실제 작동 예시 (50대 재취업 키워드)
// ============================================================
const DEMO_EXAMPLES = [
  {
    label: '사례 분석',
    icon: '🔍',
    content: '"○년 전 이 동네는..." (시간 압축형) · "이거 모르고 계약하면 후회합니다" (실수 회피형) · "실거래가 데이터로 본 진실" (데이터형)',
  },
  {
    label: '제목 후보',
    icon: '✏️',
    content: '"50대 재취업, 가격표 말고 이걸 봐야 한다" — 후회하지 않는 선택의 기술',
  },
  {
    label: '썸네일 컨셉',
    icon: '🎨',
    content: '정면 클로즈업 + 큰 자막 1줄 ("50대") + 시선 사로잡는 색상 (빨강/노랑) + 표정 변화 명확하게',
  },
  {
    label: '시나리오',
    icon: '📖',
    content: '0:00 후킹 → 0:10 본격 시작 → 0:35 갈등/시점 변화 → 1:30 핵심 비밀 → 3:00 결론 + CTA',
  },
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
        .story {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          max-width: 880px;
          margin: 0 auto;
        }

        /* ============================================ */
        /* 공통 섹션 */
        /* ============================================ */
        .sect {
          padding: 32px 24px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .sect { padding: 24px 16px; }
        }
        .sect:last-of-type {
          border-bottom: none;
        }

        .sectKicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .sectKicker { font-size: 10px; margin-bottom: 6px; }
        }

        .sectTitle {
          font-size: 22px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin: 0 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .sectTitle { font-size: 18px; line-height: 1.4; }
        }

        .sectDesc {
          font-size: 14.5px;
          color: #525252;
          line-height: 1.65;
          margin: 0;
          word-break: keep-all;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .sectDesc { font-size: 13.5px; }
        }

        /* ============================================ */
        /* 1. HOOK (시니어 공감) */
        /* ============================================ */
        .hookSect {
          padding: 48px 24px 40px;
          background: linear-gradient(180deg, #fffbf7 0%, #ffffff 100%);
          text-align: center;
        }
        @media (max-width: 600px) {
          .hookSect { padding: 32px 18px 28px; }
        }

        .hookEmoji {
          font-size: 56px;
          line-height: 1;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) {
          .hookEmoji { font-size: 44px; margin-bottom: 12px; }
        }

        .hookTitle {
          font-size: 28px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.03em;
          line-height: 1.35;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .hookTitle { font-size: 22px; line-height: 1.4; }
        }

        .hookSub {
          font-size: 16px;
          color: #525252;
          line-height: 1.7;
          margin: 0 auto;
          max-width: 580px;
          word-break: keep-all;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .hookSub { font-size: 14px; }
        }

        .hookHighlight {
          color: #c2410c;
          font-weight: 700;
        }

        /* ============================================ */
        /* 2. 막히는 5가지 (페인 포인트) */
        /* ============================================ */
        .painList {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 18px;
        }

        .painCard {
          padding: 16px 18px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-left: 4px solid;
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 14px;
          align-items: start;
        }
        @media (max-width: 600px) {
          .painCard { padding: 14px 14px; gap: 10px; grid-template-columns: 40px 1fr; }
        }

        .painEmoji {
          font-size: 32px;
          line-height: 1;
        }
        @media (max-width: 600px) { .painEmoji { font-size: 28px; } }

        .painContent { min-width: 0; }

        .painLabel {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #dc2626;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) { .painLabel { font-size: 10px; } }

        .painQ {
          font-size: 17px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 0 0 6px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .painQ { font-size: 15px; } }

        .painDesc {
          font-size: 13px;
          color: #737373;
          line-height: 1.6;
          margin: 0 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .painDesc { font-size: 12.5px; } }

        .painArrow {
          margin: 8px 0;
          padding: 8px 12px;
          background: #f5f5f5;
          border-left: 3px solid #c2410c;
        }

        .painSolutionLabel {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #c2410c;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .painSolution {
          font-size: 14.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.45;
          margin: 0 0 4px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .painSolution { font-size: 13.5px; } }

        .painDetail {
          font-size: 12.5px;
          color: #525252;
          line-height: 1.55;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .painDetail { font-size: 12px; } }

        /* ============================================ */
        /* 3. 실제 작동 예시 */
        /* ============================================ */
        .demoBox {
          margin-top: 18px;
          padding: 18px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .demoBox { padding: 14px; }
        }

        .demoLabel {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #fbbf24;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-family: 'Pretendard', sans-serif;
        }

        .demoInput {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          padding: 10px 14px;
          background: #1a1a1a;
          border: 1px solid #404040;
          margin-bottom: 14px;
          font-family: 'Pretendard', sans-serif;
        }
        @media (max-width: 600px) { .demoInput { font-size: 15px; padding: 8px 12px; } }

        .demoArrow {
          color: #fbbf24;
          font-size: 16px;
          font-weight: 700;
          margin: 8px 0;
          text-align: center;
          font-family: 'Pretendard', sans-serif;
        }

        .demoResult {
          padding: 12px 14px;
          background: #1a1a1a;
          border-left: 3px solid #fbbf24;
          margin-bottom: 8px;
          font-family: 'Pretendard', sans-serif;
        }
        @media (max-width: 600px) {
          .demoResult { padding: 10px 12px; }
        }

        .demoResultLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .demoResultText {
          font-size: 13px;
          color: #e5e5e5;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .demoResultText { font-size: 12px; } }

        /* ============================================ */
        /* 추천 가이드 6편 */
        /* ============================================ */
        .guideGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
          margin-top: 18px;
        }
        @media (max-width: 600px) {
          .guideGrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }

        .guideCard {
          padding: 14px 14px;
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
        @media (max-width: 600px) {
          .guideCard { padding: 11px 11px; }
        }

        .guideCardAccent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
        }

        .guideCardHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .guideCardEmoji {
          font-size: 22px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .guideCardEmoji { font-size: 19px; } }

        .guideCardKicker {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #c2410c;
          text-transform: uppercase;
        }

        .guideCardTitle {
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin: 0 0 6px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .guideCardTitle { font-size: 12.5px; } }

        .guideCardSub {
          font-size: 11.5px;
          color: #737373;
          line-height: 1.5;
          margin: 0 0 auto;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 600px) { .guideCardSub { font-size: 11px; } }

        .guideCardMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          margin-top: 10px;
          border-top: 1px dashed #d4d4d4;
        }

        .guideCardTime {
          font-size: 10px;
          color: #737373;
          letter-spacing: 0.04em;
        }

        .guideCardArrow {
          font-size: 10px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ============================================ */
        /* 분야별 9개 (클릭 시 /blog?category=xxx 이동) */
        /* ============================================ */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 18px;
        }
        @media (max-width: 600px) {
          .catGrid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
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
          cursor: pointer;
        }
        .catCard:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-2px);
        }
        @media (max-width: 600px) {
          .catCard { padding: 12px 8px; gap: 5px; }
        }

        .catCardAccent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
        }

        .catCardEmoji {
          font-size: 28px;
          line-height: 1;
        }
        @media (max-width: 600px) { .catCardEmoji { font-size: 24px; } }

        .catName {
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .catName { font-size: 12px; } }

        .catDesc {
          font-size: 10.5px;
          color: #737373;
          line-height: 1.4;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .catDesc { font-size: 10px; } }

        /* ============================================ */
        /* 7. CTA */
        /* ============================================ */
        .ctaSect {
          padding: 36px 24px;
          background: #0a0a0a;
          color: #ffffff;
          text-align: center;
        }
        @media (max-width: 600px) {
          .ctaSect { padding: 28px 18px; }
        }

        .ctaTitle {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin: 0 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .ctaTitle { font-size: 18px; } }

        .ctaDesc {
          font-size: 14px;
          color: #d4d4d4;
          line-height: 1.65;
          margin: 0 0 22px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .ctaDesc { font-size: 13px; margin-bottom: 18px; } }

        .ctaButtons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ctaBtn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 13px 22px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: all 0.15s;
          min-height: 46px;
        }
        @media (max-width: 600px) {
          .ctaBtn { padding: 11px 18px; font-size: 13px; min-height: 42px; }
        }

        .ctaBtnPrimary {
          background: #c2410c;
          color: #ffffff;
          border: 1.5px solid #c2410c;
        }
        .ctaBtnPrimary:hover {
          background: #a3340a;
        }

        .ctaBtnSecondary {
          background: transparent;
          color: #ffffff;
          border: 1.5px solid #525252;
        }
        .ctaBtnSecondary:hover {
          border-color: #ffffff;
          background: rgba(255,255,255,0.05);
        }

        /* ============================================ */
        /* 8. FAQ (모두 접힘) */
        /* ============================================ */
        .faqList {
          margin-top: 16px;
          background: #ffffff;
        }

        .faqItem {
          border-bottom: 1px solid #e5e5e5;
        }
        .faqItem:first-child {
          border-top: 1px solid #e5e5e5;
        }

        .faqItem summary {
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          padding: 13px 36px 13px 4px;
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
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          font-weight: 400;
          color: #737373;
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
          .faqItem summary { font-size: 13px; padding: 11px 30px 11px 4px; }
          .faqItem summary::after { font-size: 20px; right: 2px; }
        }

        .faqA {
          font-size: 13px;
          color: #525252;
          line-height: 1.65;
          margin: 0;
          padding: 0 4px 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .faqA { font-size: 12px; padding-bottom: 12px; }
        }

        /* 광고 */
        .adWrap {
          padding: 24px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .adWrap { padding: 18px 16px; }
        }
      `}</style>

      <div className="story">
        {/* ============================================ */}
        {/* 1. HOOK - 시니어 공감 */}
        {/* ============================================ */}
        <section className="hookSect">
          <div className="hookEmoji">💭</div>
          <h1 className="hookTitle">
            퇴직 후, 영상 한 번 만들어볼까<br />
            하셨나요?
          </h1>
          <p className="hookSub">
            "조카는 유튜브로 큰돈 번다는데 나도 한 번..."<br />
            막상 시작하려니 <span className="hookHighlight">모르는 게 너무 많죠</span>.<br />
            제목, 썸네일, 시나리오, 알고리즘...
          </p>
        </section>

        {/* ============================================ */}
        {/* 2. 막히는 5가지 (페인 포인트) */}
        {/* ============================================ */}
        <section className="sect">
          <div className="sectKicker">▍ 시니어가 막히는 5가지</div>
          <h2 className="sectTitle">
            영상 시작이 어려운<br />이유, 다 비슷합니다
          </h2>
          <p className="sectDesc">
            저희가 가이드 채널 운영하면서 가장 많이 받은 질문입니다.
            막막한 부분을 솔직히 말씀드리고, AlgoMaker가 어떻게 도와드리는지
            한 번에 보여드립니다.
          </p>

          <div className="painList">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="painCard" style={{ borderLeftColor: p.color }}>
                <div className="painEmoji">{p.emoji}</div>
                <div className="painContent">
                  <div className="painLabel">막막함 {i + 1}</div>
                  <h3 className="painQ">"{p.pain}"</h3>
                  <p className="painDesc">{p.desc}</p>
                  <div className="painArrow">
                    <div className="painSolutionLabel">→ AlgoMaker가 해결</div>
                    <div className="painSolution">{p.solution}</div>
                    <p className="painDetail">{p.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 3. 실제 작동 예시 */}
        {/* ============================================ */}
        <section className="sect">
          <div className="sectKicker">▍ 실제로 이렇게 작동합니다</div>
          <h2 className="sectTitle">
            "50대 재취업" 키워드를 입력하면
          </h2>
          <p className="sectDesc">
            방금 말씀드린 5가지가 5초 안에 한 번에 만들어집니다.
            아래는 실제 결과 예시입니다.
          </p>

          <div className="demoBox">
            <div className="demoLabel">▍ INPUT (사용자 입력)</div>
            <div className="demoInput">50대 재취업</div>

            <div className="demoArrow">↓ 5초 후 ↓</div>

            {DEMO_EXAMPLES.map((ex, i) => (
              <div key={i} className="demoResult">
                <div className="demoResultLabel">{ex.icon} {ex.label}</div>
                <p className="demoResultText">{ex.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 광고 */}
        <div className="adWrap">
          <AdSlot slot="home-middle" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* 5. 추천 가이드 6편 */}
        {/* ============================================ */}
        <section className="sect">
          <div className="sectKicker">▍ 시작 전 꼭 읽으세요</div>
          <h2 className="sectTitle">📚 추천 가이드</h2>
          <p className="sectDesc">
            영상 만들기에 필요한 핵심 가이드 6편.
            매주 새로운 가이드가 추가됩니다.
          </p>

          <div className="guideGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link key={g.slug} href={`/knowhow/${g.slug}`} className="guideCard">
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
        {/* 6. 분야별 9개 (클릭 시 /blog?category=xxx 이동) */}
        {/* ============================================ */}
        <section className="sect">
          <div className="sectKicker">▍ 관심 분야로 둘러보기</div>
          <h2 className="sectTitle">🗂 분야별 가이드</h2>
          <p className="sectDesc">
            분야 카드를 클릭하시면 해당 카테고리의 모든 가이드를 보실 수 있습니다.
          </p>

          <div className="catGrid">
            {CATEGORY_NAV.map((c) => (
              <Link key={c.id} href={`/blog?category=${c.id}`} className="catCard">
                <div className="catCardAccent" style={{ background: c.color }} />
                <div className="catCardEmoji">{c.emoji}</div>
                <div className="catName">{c.name}</div>
                <div className="catDesc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 7. CTA (행동 유도) */}
        {/* ============================================ */}
        <section className="ctaSect">
          <h2 className="ctaTitle">
            준비 다 되셨다면, 시작해 볼까요?
          </h2>
          <p className="ctaDesc">
            가이드부터 차근차근 보시거나,<br />
            바로 영상 자료를 만들어 보세요.
          </p>
          <div className="ctaButtons">
            <Link href="/blog" className="ctaBtn ctaBtnSecondary">
              📚 가이드 모두 보기
            </Link>
            <Link href="/publish?keyword=50대 재취업&category=economy" className="ctaBtn ctaBtnPrimary">
              ✏️ 직접 만들어보기 →
            </Link>
          </div>
        </section>

        {/* ============================================ */}
        {/* 8. FAQ (모두 접힘) */}
        {/* ============================================ */}
        <section className="sect">
          <div className="sectKicker">▍ 자주 묻는 질문</div>
          <h2 className="sectTitle">❓ FAQ</h2>
          <div className="faqList">
            {FAQ_LIST.map((f, i) => (
              <details key={i} className="faqItem">
                <summary>Q. {f.q}</summary>
                <p className="faqA">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </V11Shell>
  );
}
