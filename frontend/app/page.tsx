'use client';
/**
 * AlgoMaker 메인 페이지 v10.6 - 키워드 선택 UX
 *
 * 박예준 대표 v10.6 요청:
 * "키워드 입력이 아니라 선택으로"
 * "타겟은 알아서 (시니어 워딩 제거, 일반 친화)"
 *
 * D안 (어시스턴트 판단):
 *  - 검색창/입력창 완전 제거
 *  - 클릭만으로 영상 자료 만들기 (2단계)
 *  - 시니어 전용 워딩 제거
 *  - "디지털이 어색한 모든 분" + "영상 처음 만드는 분"
 *  - 메인 장황함 제거 (체크리스트, 분야 9개 등 별도 페이지로)
 *
 * 메인 흐름:
 *  1. ALGORITHM ENGINE 임팩트 (보존)
 *  2. ★ NEW: "어떤 영상 만드시겠어요?" 분야 클릭
 *     → 분야 클릭 시 추천 주제 6개 노출 (모달 X, 동적 노출)
 *     → 주제 클릭 시 publish 페이지 자동 이동
 *  3. 추천 가이드 11편 (간소화, 6편만 노출 + "더보기")
 *  4. FAQ
 *
 * 제거된 것 (v10.5 → v10.6):
 *  ❌ 분야 9개 큰 그리드 섹션 (1단계에 통합)
 *  ❌ 체크리스트 15개 섹션 (별도 /checklist 페이지로)
 *  ❌ 광고 (메인 장황함 제거)
 *  ❌ 보조 도구 안내 (메인 장황함 제거)
 *  ❌ "5060 시니어층" 워딩 모두 제거
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 11편 (메인엔 6편만, 나머지 가이드 페이지에)
 *  - CATEGORY_NAV 9개 (1단계 카드로 활용)
 *  - FAQ_LIST 6개 (워딩만 일반화)
 *  - AEO/GEO JSON-LD
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';

// ============================================================
// 카테고리 9개 + 추천 주제 (NEW: 키워드 선택 UX)
// ============================================================
const CATEGORIES_WITH_TOPICS = [
  {
    id: 'economy',
    name: '재테크',
    desc: '돈 관리, 투자, 노후',
    emoji: '💰',
    color: '#ca8a04',
    topics: [
      '50대 재취업',
      '월 100만원 부업',
      'ETF 입문',
      '연금 활용법',
      '노후 자금 마련',
      '주식 기초',
    ],
  },
  {
    id: 'realestate',
    name: '부동산',
    desc: '청약, 투자, 시세',
    emoji: '🏘️',
    color: '#0891b2',
    topics: [
      '청약 가점 계산',
      '아파트 시세 분석',
      '부동산 절세',
      '동네 변화 분석',
      '전세 vs 매매',
      '재개발 정보',
    ],
  },
  {
    id: 'health',
    name: '건강',
    desc: '운동, 식단, 관리',
    emoji: '💪',
    color: '#16a34a',
    topics: [
      '집에서 하는 운동',
      '5분 스트레칭',
      '간헐적 단식',
      '혈압 관리법',
      '관절 건강',
      '면역력 식단',
    ],
  },
  {
    id: 'food',
    name: '요리',
    desc: '레시피, 맛집, 비법',
    emoji: '🍳',
    color: '#ea580c',
    topics: [
      '집밥 레시피',
      '한식 비법',
      '5분 요리',
      '동네 맛집',
      '자취생 요리',
      '디저트 만들기',
    ],
  },
  {
    id: 'travel',
    name: '여행',
    desc: '국내외 여행지, 후기',
    emoji: '✈️',
    color: '#0284c7',
    topics: [
      '국내 당일치기',
      '제주도 코스',
      '동남아 여행',
      '여행 짐 싸기',
      '저예산 여행',
      '온천 여행',
    ],
  },
  {
    id: 'aitech',
    name: 'AI / 디지털',
    desc: '핸드폰, AI 도구',
    emoji: '🤖',
    color: '#4f46e5',
    topics: [
      'ChatGPT 활용법',
      '핸드폰 카메라 비법',
      '스마트폰 정리',
      '카카오톡 꿀팁',
      '키오스크 사용',
      '인터넷 뱅킹',
    ],
  },
  {
    id: 'family',
    name: '가족 / 일상',
    desc: '사연, 추억, 일상',
    emoji: '👨‍👩‍👧‍👦',
    color: '#dc2626',
    topics: [
      '부모님과의 추억',
      '일상 브이로그',
      '결혼 이야기',
      '육아 경험담',
      '가족 여행',
      '명절 이야기',
    ],
  },
  {
    id: 'language',
    name: '외국어',
    desc: '영어, 일본어 학습',
    emoji: '🌍',
    color: '#059669',
    topics: [
      '하루 5분 영어',
      '여행 영어',
      '일본어 기초',
      '영어 듣기',
      '회화 패턴',
      '단어 외우기',
    ],
  },
  {
    id: 'lifestyle',
    name: '라이프 / 인생',
    desc: '경험담, 성장 이야기',
    emoji: '✨',
    color: '#7c3aed',
    topics: [
      '인생 2막 도전',
      '취미 시작',
      '독서 추천',
      '미니멀 라이프',
      '아침 루틴',
      '나만의 즐거움',
    ],
  },
];

// ============================================================
// 추천 가이드 6편 (메인 노출용 - 알고리즘 가이드 우선)
// ============================================================
const FEATURED_GUIDES = [
  {
    slug: 'algorithm-seo',
    blogPath: true,
    category: '알고리즘',
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략',
    subtitle: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 늘리기',
    readTime: '8분',
    badge: '필수',
    emoji: '🔍',
    color: '#0a0a0a',
  },
  {
    slug: 'algorithm-retention',
    blogPath: true,
    category: '시청 지속',
    title: '시청자를 채널에 가두는 무한 루프 세팅',
    subtitle: '챕터 + 최종화면 + 재생목록으로 체류시간 2배',
    readTime: '7분',
    badge: '인기',
    emoji: '⏱',
    color: '#1e40af',
  },
  {
    slug: 'algorithm-branding',
    blogPath: true,
    category: '브랜딩',
    title: '클릭을 부르는 브랜딩과 디테일의 힘',
    subtitle: '60-30-10 컬러 법칙과 채널 아트 3요소 공식',
    readTime: '7분',
    emoji: '🎨',
    color: '#9333ea',
  },
  {
    slug: 'algorithm-mistakes',
    blogPath: true,
    category: '실수 방어',
    title: '떡상을 가로막는 치명적 실수 방어하기',
    subtitle: '아동용 함정과 1시간 대기 공개의 비밀',
    readTime: '6분',
    badge: '주의',
    emoji: '⚠️',
    color: '#dc2626',
  },
  {
    slug: 'algorithm-mindset',
    blogPath: true,
    category: '멘탈',
    title: '유튜버 멘탈 서바이벌과 복리 성장',
    subtitle: '슬럼프 견디기와 VIP 댓글로 찐팬 만들기',
    readTime: '6분',
    emoji: '💪',
    color: '#16a34a',
  },
  {
    slug: 'first-30-seconds-hook',
    category: '영상 제작',
    title: '첫 30초가 90%를 결정합니다',
    subtitle: '시청자가 끝까지 보게 만드는 후크 작성법',
    readTime: '9분',
    emoji: '🎬',
    color: '#c2410c',
  },
];

// ============================================================
// FAQ (시니어 워딩 제거, 일반화)
// ============================================================
const FAQ_LIST = [
  {
    q: 'AlgoMaker가 어떤 사이트인가요?',
    a: 'AlgoMaker는 영상 만들기를 시작할 때 필요한 자료를 자동으로 만들어드리는 도구입니다. 분야와 주제를 선택하시면 알고리즘이 떡상 사례 분석, 제목 후보, 썸네일 컨셉, 시나리오, 4개 SNS 자료까지 5초 안에 만들어드립니다. 함께 영상 제작 가이드 글도 무료로 제공합니다.',
  },
  {
    q: '디지털 도구가 익숙하지 않아도 사용할 수 있나요?',
    a: '네. 키워드를 직접 입력하실 필요 없이, 분야와 주제를 클릭하기만 하시면 됩니다. 큰 글씨, 쉬운 표현, 단계별 안내로 누구나 직관적으로 사용하실 수 있도록 설계되었습니다.',
  },
  {
    q: '얼마나 다양한 가이드가 있나요?',
    a: '현재 17편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다. 알고리즘 SEO, 시청 지속률, 브랜딩, 실수 방어, 멘탈 등 영상 만들기에 필요한 모든 주제를 다룹니다.',
  },
  {
    q: '어떤 분야 콘텐츠가 인기인가요?',
    a: '재테크, 부동산, 건강, 요리, 여행, AI 디지털, 가족 일상, 외국어, 라이프 등 9개 분야를 다룹니다. 각 분야마다 추천 주제 6개씩 준비되어 있어 클릭만 하시면 바로 자료 생성됩니다.',
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
  name: '영상 자료 자동으로 만드는 방법',
  description: '클릭 2번으로 영상 제목, 시나리오, 썸네일 컨셉, SNS 자료를 만들어드립니다.',
  step: [
    { '@type': 'HowToStep', position: 1, name: '분야 선택', text: '9개 분야 중 만드실 영상의 분야를 클릭하세요.' },
    { '@type': 'HowToStep', position: 2, name: '주제 선택', text: '추천 주제 6개 중 하나를 클릭하세요.' },
    { '@type': 'HowToStep', position: 3, name: '결과 확인', text: '5초 안에 영상 자료가 만들어집니다.' },
    { '@type': 'HowToStep', position: 4, name: '4개 SNS 자료', text: 'YouTube, Shorts, Instagram, TikTok 자료를 그대로 사용하시면 됩니다.' },
  ],
};

const PIPELINE_STEPS = [
  { num: '01', label: '분석' },
  { num: '02', label: '생성' },
  { num: '03', label: '구조' },
  { num: '04', label: '제작' },
  { num: '05', label: '배포' },
];

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function HomePage() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const handleTopicClick = (categoryId: string, topic: string) => {
    const url = `/publish?keyword=${encodeURIComponent(topic)}&category=${encodeURIComponent(categoryId)}`;
    router.push(url);
  };

  const selectedCategory = CATEGORIES_WITH_TOPICS.find(c => c.id === selectedCat);

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
        .home {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0;
        }

        /* ============================================ */
        /* 1. ALGORITHM ENGINE 임팩트 */
        /* ============================================ */
        .algoHero {
          padding: 36px 24px 28px;
          background: #ffffff;
          border-bottom: 2px solid #0a0a0a;
          text-align: center;
        }
        @media (max-width: 600px) {
          .algoHero { padding: 26px 18px 22px; }
        }

        .algoHeroLabel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 18px;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .algoHeroLabel { margin-bottom: 14px; gap: 8px; }
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

        .algoHeroTitle {
          font-size: 36px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.035em;
          line-height: 1.18;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .algoHeroTitle { font-size: 24px; margin-bottom: 10px; }
        }

        .algoHeroTitleAccent {
          color: #c2410c;
        }

        .algoHeroSub {
          font-size: 14.5px;
          color: #525252;
          line-height: 1.65;
          font-weight: 500;
          margin: 0 auto 20px;
          max-width: 540px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .algoHeroSub { font-size: 13px; margin-bottom: 16px; }
        }

        .algoPipeline {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 12px 16px;
          background: #0a0a0a;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .algoPipeline {
            padding: 10px 10px;
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }

        .algoPipelineStep {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 0 12px;
        }
        @media (max-width: 600px) {
          .algoPipelineStep { padding: 0 5px; gap: 1px; }
        }

        .algoPipelineNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .algoPipelineNum { font-size: 9px; } }

        .algoPipelineLabel {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .algoPipelineLabel { font-size: 10.5px; } }

        .algoPipelineArrow {
          color: #c2410c;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .algoPipelineArrow { font-size: 10px; } }

        /* ============================================ */
        /* 2. NEW: 키워드 선택 UX */
        /* ============================================ */
        .selectSection {
          padding: 32px 24px;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .selectSection { padding: 24px 16px; }
        }

        .selectStep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .selectStepNum {
          width: 28px;
          height: 28px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'SF Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .selectStepNum { width: 24px; height: 24px; font-size: 11px; } }

        .selectStepTitle {
          font-size: 17px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.3;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .selectStepTitle { font-size: 15px; } }

        .selectStepSub {
          font-size: 12.5px;
          color: #737373;
          margin-left: 38px;
          margin-bottom: 16px;
          margin-top: -10px;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) {
          .selectStepSub { font-size: 11.5px; margin-left: 32px; margin-bottom: 12px; }
        }

        /* 분야 그리드 */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 8px;
          margin-bottom: 24px;
        }
        @media (max-width: 600px) {
          .catGrid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-bottom: 18px;
          }
        }

        .catCard {
          padding: 14px 12px;
          background: #ffffff;
          border: 1.5px solid #e5e5e5;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
          font-family: inherit;
          color: inherit;
          min-height: 90px;
          justify-content: center;
        }
        .catCard:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-2px);
        }
        .catCard.active {
          background: #fff;
          border-width: 2px;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        @media (max-width: 600px) {
          .catCard { padding: 11px 6px; min-height: 78px; }
        }

        .catEmoji {
          font-size: 26px;
          line-height: 1;
        }
        @media (max-width: 600px) { .catEmoji { font-size: 22px; } }

        .catName {
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .catName { font-size: 11.5px; } }

        .catDesc {
          font-size: 10.5px;
          color: #737373;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .catDesc { display: none; } }

        /* 주제 칩 영역 (선택된 분야) */
        .topicSection {
          padding: 18px 18px;
          background: #ffffff;
          border: 2px solid #0a0a0a;
          margin-top: -8px;
          animation: slideDown 0.25s ease-out;
        }
        @media (max-width: 600px) {
          .topicSection { padding: 14px 14px; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .topicHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .topicHeadEmoji { font-size: 22px; line-height: 1; }
        @media (max-width: 600px) { .topicHeadEmoji { font-size: 18px; } }

        .topicHeadInfo { flex: 1; min-width: 0; }

        .topicHeadLabel {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          text-transform: uppercase;
          font-family: 'SF Mono', monospace;
        }

        .topicHeadName {
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .topicHeadName { font-size: 12.5px; } }

        .topicGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 6px;
        }
        @media (max-width: 600px) {
          .topicGrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
          }
        }

        .topicChip {
          padding: 11px 12px;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          min-height: 42px;
        }
        .topicChip:hover {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }
        .topicChip:hover .topicChipArrow {
          color: #fbbf24;
          transform: translateX(2px);
        }
        @media (max-width: 600px) {
          .topicChip { padding: 9px 10px; font-size: 12px; min-height: 38px; }
        }

        .topicChipArrow {
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          transition: all 0.15s;
        }

        .topicHint {
          font-size: 11px;
          color: #737373;
          margin-top: 10px;
          text-align: center;
          letter-spacing: 0.02em;
        }
        @media (max-width: 600px) { .topicHint { font-size: 10px; margin-top: 8px; } }

        /* ============================================ */
        /* 3. 추천 가이드 */
        /* ============================================ */
        .guidesSection {
          padding: 32px 24px;
          background: #ffffff;
        }
        @media (max-width: 600px) {
          .guidesSection { padding: 24px 16px; }
        }

        .sectionHead {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 18px;
          padding-bottom: 10px;
          border-bottom: 2px solid #0a0a0a;
        }

        .sectionTitle {
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 14px; } }

        .sectionMore {
          font-size: 11.5px;
          color: #737373;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.005em;
        }
        .sectionMore:hover { color: #c2410c; }

        .guideGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
        }
        @media (max-width: 600px) {
          .guideGrid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
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
          font-size: 20px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .guideCardEmoji { font-size: 18px; } }

        .guideCardKicker {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #c2410c;
          text-transform: uppercase;
        }

        .guideCardTitle {
          font-size: 13.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin: 0 0 6px;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 600px) { .guideCardTitle { font-size: 12px; } }

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
        @media (max-width: 600px) { .guideCardSub { font-size: 10.5px; } }

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
          font-family: 'SF Mono', monospace;
        }

        .guideCardArrow {
          font-size: 10px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ============================================ */
        /* 4. FAQ */
        /* ============================================ */
        .faqSection {
          padding: 28px 24px 40px;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .faqSection { padding: 22px 16px 32px; }
        }

        .faqList {
          background: #ffffff;
        }

        .faqItem {
          border-bottom: 1px solid #e5e5e5;
        }
        .faqItem:first-child { border-top: 1px solid #e5e5e5; }

        .faqItem summary {
          font-size: 13.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          padding: 12px 32px 12px 14px;
          cursor: pointer;
          position: relative;
          list-style: none;
          word-break: keep-all;
        }
        .faqItem summary::-webkit-details-marker { display: none; }
        .faqItem summary::after {
          content: '+';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          font-weight: 400;
          color: #737373;
          line-height: 1;
        }
        .faqItem[open] summary::after {
          content: '−';
          color: #c2410c;
        }
        .faqItem summary:hover { color: #c2410c; }
        @media (max-width: 600px) {
          .faqItem summary { font-size: 12.5px; padding: 11px 30px 11px 12px; }
        }

        .faqA {
          font-size: 12.5px;
          color: #525252;
          line-height: 1.65;
          margin: 0;
          padding: 0 14px 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .faqA { font-size: 12px; padding: 0 12px 12px; }
        }
      `}</style>

      <div className="home">
        {/* ============================================ */}
        {/* 1. ALGORITHM ENGINE 임팩트 */}
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
            클릭만으로 <span className="algoHeroTitleAccent">영상 자료</span><br />
            5초 만에 만들기
          </h1>

          <p className="algoHeroSub">
            분야와 주제를 클릭하시면 떡상 사례 분석 · 제목 후보 ·<br />
            시나리오 · 4개 SNS 자료까지 자동으로 만들어드립니다.
          </p>

          <div className="algoPipeline">
            {PIPELINE_STEPS.map((s, i) => (
              <div key={s.num} style={{ display: 'contents' }}>
                <div className="algoPipelineStep">
                  <div className="algoPipelineNum">{s.num}</div>
                  <div className="algoPipelineLabel">{s.label}</div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="algoPipelineArrow">→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 2. 키워드 선택 UX (NEW) */}
        {/* ============================================ */}
        <section className="selectSection">
          {/* Step 1: 분야 선택 */}
          <div className="selectStep">
            <div className="selectStepNum">01</div>
            <div className="selectStepTitle">어떤 분야 영상을 만드시겠어요?</div>
          </div>
          <div className="selectStepSub">아래 분야 중 하나를 선택해 주세요.</div>

          <div className="catGrid">
            {CATEGORIES_WITH_TOPICS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`catCard ${selectedCat === c.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(c.id === selectedCat ? null : c.id)}
                style={selectedCat === c.id ? { borderColor: c.color } : {}}
              >
                <span className="catEmoji">{c.emoji}</span>
                <span className="catName">{c.name}</span>
                <span className="catDesc">{c.desc}</span>
              </button>
            ))}
          </div>

          {/* Step 2: 주제 선택 (분야 선택 시 동적 노출) */}
          {selectedCategory && (
            <>
              <div className="selectStep">
                <div className="selectStepNum">02</div>
                <div className="selectStepTitle">어떤 주제를 다루시겠어요?</div>
              </div>
              <div className="selectStepSub">주제를 클릭하시면 5초 안에 자료가 만들어집니다.</div>

              <div className="topicSection" style={{ borderColor: selectedCategory.color }}>
                <div className="topicHead">
                  <span className="topicHeadEmoji">{selectedCategory.emoji}</span>
                  <div className="topicHeadInfo">
                    <div className="topicHeadLabel">선택한 분야</div>
                    <div className="topicHeadName">{selectedCategory.name}</div>
                  </div>
                </div>

                <div className="topicGrid">
                  {selectedCategory.topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className="topicChip"
                      onClick={() => handleTopicClick(selectedCategory.id, topic)}
                    >
                      <span>{topic}</span>
                      <span className="topicChipArrow">→</span>
                    </button>
                  ))}
                </div>

                <div className="topicHint">
                  💡 원하는 주제가 없으시면 비슷한 것을 선택하셔도 좋습니다.
                </div>
              </div>
            </>
          )}
        </section>

        {/* ============================================ */}
        {/* 3. 추천 가이드 6편 */}
        {/* ============================================ */}
        <section className="guidesSection">
          <div className="sectionHead">
            <div className="sectionTitle">📚 추천 가이드</div>
            <Link href="/blog" className="sectionMore">전체 17편 보기 →</Link>
          </div>

          <div className="guideGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={(g as any).blogPath ? `/blog/${g.slug}` : `/knowhow/${g.slug}`}
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
        {/* 4. FAQ */}
        {/* ============================================ */}
        <section className="faqSection">
          <div className="sectionHead">
            <div className="sectionTitle">💬 자주 묻는 질문</div>
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
      </div>
    </V11Shell>
  );
}
