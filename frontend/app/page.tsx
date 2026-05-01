'use client';
/**
 * AlgoMaker 메인 페이지 v10.5 - v10.4 + 알고리즘 가이드 5편 + 체크리스트 15
 *
 * 박예준 대표 비전:
 * "50대~70대 시니어층을 위한 영상 제작 도움말 채널"
 * "가이드 글이 메인 콘텐츠"
 *
 * v10.5 변경 (D안 - 전부 다):
 *  ✅ FEATURED_GUIDES에 알고리즘 가이드 5편 추가 (총 11편)
 *    - algorithm-seo (NEW)
 *    - algorithm-retention (NEW)
 *    - algorithm-branding (NEW)
 *    - algorithm-mistakes (NEW)
 *    - algorithm-mindset (NEW)
 *  ✅ blogPath 분기 (algorithm-* 은 /blog/, 기존은 /knowhow/)
 *  ✅ "📋 업로드 전 체크리스트 15가지" 섹션 추가 (FAQ 직전)
 *    - 5개 그룹: 기초 브랜딩 / 검색 최적화 / 노출 / 체류 시간 / 운영
 *    - 각 그룹별 카드 + 체크박스 + 상세
 *  ✅ 체류시간 ↑ (체크리스트 읽으면서 자연스러운 스크롤)
 *  ✅ AdSense 점수 ↑ (콘텐츠 풍부)
 *
 * v10.4 베이스 (보존):
 *  - 상단 ALGORITHM ENGINE 임팩트 영역 + LIVE 펄스
 *  - 검정 5단계 파이프라인
 *  - 추천 가이드 + 분야 9개 + 광고 + FAQ
 *  - 분야 클릭 → /blog?category=xxx 이동 작동
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
  // ============================================
  // v10.5 NEW: 알고리즘 가이드 5편 추가
  // ============================================
  {
    slug: 'algorithm-seo',
    blogPath: true,
    category: '알고리즘 · SEO',
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략',
    subtitle: '제목 8:2 법칙 · 설명란 데이터 센터 · 음성 SEO · 해시태그',
    readTime: '8분',
    badge: 'NEW',
    emoji: '🔍',
    color: '#0a0a0a',
  },
  {
    slug: 'algorithm-retention',
    blogPath: true,
    category: '알고리즘 · 시청 지속',
    title: '시청자를 채널에 가두는 무한 루프 세팅',
    subtitle: '챕터 · 최종화면 · 재생목록 · 자동 연속 재생 4가지 기술',
    readTime: '7분',
    badge: 'NEW',
    emoji: '⏱',
    color: '#1e40af',
  },
  {
    slug: 'algorithm-branding',
    blogPath: true,
    category: '알고리즘 · 브랜딩',
    title: '클릭을 부르는 브랜딩과 디테일의 힘',
    subtitle: '채널 아트 3요소 · 60-30-10 컬러 · 워터마크 마법',
    readTime: '7분',
    badge: 'NEW',
    emoji: '🎨',
    color: '#9333ea',
  },
  {
    slug: 'algorithm-mistakes',
    blogPath: true,
    category: '알고리즘 · 실수 방어',
    title: '떡상을 가로막는 치명적 실수 방어하기',
    subtitle: '아동용 함정 · 1시간 대기 공개 · 고정 댓글 = 제2의 제목',
    readTime: '6분',
    badge: 'NEW',
    emoji: '⚠️',
    color: '#dc2626',
  },
  {
    slug: 'algorithm-mindset',
    blogPath: true,
    category: '알고리즘 · 멘탈',
    title: '유튜버 멘탈 서바이벌과 복리 성장의 비밀',
    subtitle: '슬럼프 견디기 · VIP 댓글 · 벤치마킹 · 복리 성장',
    readTime: '6분',
    badge: 'NEW',
    emoji: '💪',
    color: '#16a34a',
  },
];

// ============================================
// v10.5 NEW: 업로드 전 체크리스트 15가지
// ============================================
const UPLOAD_CHECKLIST = [
  { cat: '기초 브랜딩', item: '채널 설명(SEO)', detail: '메인 키워드 포함, 채널 정체성 명시' },
  { cat: '기초 브랜딩', item: '비즈니스 이메일', detail: '협업용 연락처 등록' },
  { cat: '기초 브랜딩', item: '채널 트레일러', detail: '비구독자 30초 소개 영상' },
  { cat: '기초 브랜딩', item: '구독 워터마크', detail: '영상 우측 하단 "구독" 아이콘' },
  { cat: '검색 최적화', item: '제목 키워드 배치', detail: '검색 키워드(앞 80%) + 후킹(뒤 20%)' },
  { cat: '검색 최적화', item: '설명란 첫 3줄', detail: '핵심 키워드 자연스러운 문장으로' },
  { cat: '검색 최적화', item: '해시태그 전략', detail: '메인 + 세부 + 채널명 (3~5개)' },
  { cat: '검색 최적화', item: '업로드 기본 설정', detail: '설명란 하단 고정 템플릿' },
  { cat: '노출 및 유입', item: '썸네일 A/B 테스트', detail: '"테스트 및 비교" 기능 활용' },
  { cat: '노출 및 유입', item: '카테고리 설정', detail: '영상 내용에 정확히 맞게' },
  { cat: '노출 및 유입', item: '거주 국가 설정', detail: '대한민국 등 타겟 국가' },
  { cat: '체류 시간', item: '영상 챕터(00:00)', detail: '반드시 00:00부터 시작' },
  { cat: '체류 시간', item: '재생목록 큐레이션', detail: '주제별 + 키워드 포함 네이밍' },
  { cat: '체류 시간', item: '최종 화면 설정', detail: '영상 종료 5~20초 전 관련 영상' },
  { cat: '운영 및 수익', item: '고정 댓글 마케팅', detail: '질문 또는 링크로 소통 활성화' },
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

        /* ============================================ */
        /* v10.5 NEW: 업로드 체크리스트 */
        /* ============================================ */
        .checklist {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-top: 4px;
        }
        @media (max-width: 600px) {
          .checklist { grid-template-columns: 1fr; gap: 10px; }
        }

        .checklistGroup {
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-top: 3px solid #c2410c;
        }
        @media (max-width: 600px) {
          .checklistGroup { padding: 12px 14px; }
        }

        .checklistGroupTitle {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #c2410c;
          text-transform: uppercase;
          padding-bottom: 8px;
          margin-bottom: 10px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .checklistGroupTitle { font-size: 11px; }
        }

        .checklistItem {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 8px;
          padding: 6px 0;
          align-items: start;
        }

        .checklistBox {
          font-size: 14px;
          color: #525252;
          font-weight: 700;
          line-height: 1.4;
          font-family: 'SF Mono', 'Consolas', monospace;
        }

        .checklistContent { min-width: 0; }

        .checklistItemTitle {
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 2px;
        }
        @media (max-width: 600px) {
          .checklistItemTitle { font-size: 12.5px; }
        }

        .checklistItemDetail {
          font-size: 11.5px;
          color: #737373;
          line-height: 1.5;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .checklistItemDetail { font-size: 11px; }
        }

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
              <Link key={g.slug} href={(g as any).blogPath ? `/blog/${g.slug}` : `/knowhow/${g.slug}`} className="guideCard">
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

        {/* ============================================ */}
        {/* v10.5 NEW: 업로드 전 체크리스트 15가지 */}
        {/* ============================================ */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionKicker">📋 업로드 전 필수</div>
            <h2 className="sectionTitle">업로드 전 체크리스트 15가지</h2>
            <p className="sectionDesc">
              영상 올리기 전 이 15가지만 체크하시면 알고리즘 점수가 크게 올라갑니다.
              매번 영상 업로드 전 한 번씩 확인하세요.
            </p>
          </div>
          <div className="checklist">
            {['기초 브랜딩', '검색 최적화', '노출 및 유입', '체류 시간', '운영 및 수익'].map((cat) => (
              <div key={cat} className="checklistGroup">
                <div className="checklistGroupTitle">{cat}</div>
                {UPLOAD_CHECKLIST.filter(c => c.cat === cat).map((c, i) => (
                  <div key={i} className="checklistItem">
                    <div className="checklistBox">□</div>
                    <div className="checklistContent">
                      <div className="checklistItemTitle">{c.item}</div>
                      <div className="checklistItemDetail">{c.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
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
