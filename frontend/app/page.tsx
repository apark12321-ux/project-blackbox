'use client';
/**
 * AlgoMaker 메인 페이지 v13.0 - 정보 사이트 정체성 (HERO 변경)
 *
 * 박 대표님 v13.0 진단:
 *   "하나도 안 바뀌었는데?" (적용은 됐는데 첫 화면이 여전히 도구 중심)
 *
 *   원인: HERO + selectSection (분야→주제→시나리오) 가 메인 영역
 *         카테고리 카드는 페이지 중간이라 안 보임
 *
 * v13.0 변경 (정체성 진짜 변경):
 *  ✅ HERO 변경:
 *     이전: "유튜브 영상 자료 5초 만에 자동 생성"
 *     이후: "유튜브 채널 운영 정보 사이트 / 알고리즘·시니어·AI 채널 수익화"
 *  ✅ HERO CTA 변경:
 *     이전: "지금 바로 만들기" (도구 행동)
 *     이후: "📚 가이드 둘러보기" (정보 사이트 행동)
 *     보조: "또는 자료 만들기 도구 사용" (작은 보조 버튼)
 *  ✅ HERO 배지 변경:
 *     이전: 11공식 6개 (제목 8:2, 음성SEO, 챕터, ...)
 *     이후: 4개 시주제 (📊 알고리즘 / 👔 시니어 / 🤖 AI / 💰 수익화)
 *  ✅ 섹션 순서 변경:
 *     이전: HERO → 분야→주제→시나리오 → 카테고리 → 가이드 → FAQ
 *     이후: HERO → 카테고리 → 가이드 → 자료 만들기 (보너스) → FAQ
 *  ✅ selectSection 라벨 변경:
 *     "✨ 보너스 도구" 배지 추가
 *     "가이드를 다 보셨다면, 자료 만들기 도구도 사용해 보세요"
 *
 * 박 대표님 자산 100% 보존:
 *  - publish/page.tsx 그대로 (URL ?scenario= 받음)
 *  - contentEngine, v650Adapter 그대로
 *  - Cinematic 두 파일 그대로
 *  - 분야 9개 + 주제 6개 + 시나리오 8개 (selectSection) 그대로
 *
 * 애드센스 승인 효과:
 *  - 정보 사이트 정체성 명확 (HERO + 첫 영역 = 카테고리/가이드)
 *  - 자동 생성 도구는 보너스 위치 (애드센스 친화)
 *  - 4개 카테고리 = 주제 일관성 명시
 *
 * v11.0 변경 (v10.9 v3 → v11.0):
 *  ✅ kicker: "ALGORITHM ENGINE" → "완전 무료 · 회원가입 X"
 *    (기술 용어 → 사용자 혜택 즉시 노출)
 *  ✅ 타이틀: "클릭만으로 영상 자료 5초 만에 만들기"
 *           → "유튜브 영상 자료 5초 만에 자동 생성"
 *    (행위 중심 → 결과 중심 + "유튜브" 명시로 의도 명확)
 *  ✅ 부제: 사용자 공감 ("자료 준비가 가장 시간 많이 드는") + 가치 제안
 *  ✅ 큰 CTA 버튼 (heroCta) 추가:
 *    "지금 바로 만들기 ↓" 클릭 → 키워드 선택 영역 스크롤
 *    화살표 통통 애니메이션 (시선 유도)
 *  ✅ 메트릭 3카드 (5/5/4) 그대로 (검증 가능 수치)
 *
 * v10.9 보존:
 *  - HOW IT WORKS 자동 슬라이드 5단계
 *  - JSON-LD 5종 (SEO/AEO/GEO)
 *  - 키워드 선택 UX (분야 9 + 주제 6)
 *  - 추천 가이드 6편
 *  - FAQ 6개
 *  - C 수준 폰트 (시니어 친화)
 *
 * 박 대표님 자산 100% 보존:
 *    02 주제 클릭 (추천 6개 중 클릭)
 *    03 AI 자동 분석 (5초)
 *    04 4종 자료 받기 (제목/시나리오/썸네일/SNS)
 *    05 바로 사용 (회원가입 X)
 *  ✅ 자동 슬라이드 (4초마다 다음 단계)
 *  ✅ 점 인디케이터 (수동 클릭 가능)
 *  ✅ 슬라이드 카드 (큰 번호 + 아이콘 + 타이틀 + 설명 + 디테일)
 *  ✅ JSON-LD 추가 (AEO/GEO 친화):
 *    - WebSite (Google 사이트 인식)
 *    - SoftwareApplication (ChatGPT/Perplexity가 도구로 인식)
 *    - Organization (사이트 신뢰도)
 *    - FAQPage (기존 보존)
 *    - HowTo (기존 보존)
 *
 * 박 대표님 자산 100% 보존:
 *  - V11Shell, FAQ, 가이드 모든 자산
 *  - 키워드 선택 UX (분야 9 + 주제 6)
 *  - 메트릭 (AI 엔진 5 / 파이프라인 5 / SNS 4)
 */

import { useState, useEffect } from 'react';
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

// ============================================================
// JSON-LD Schema (SEO/AEO/GEO 친화)
// 박 대표님 v10.9 요청: SEO/AEO/GEO 잘되는 방향
// ============================================================

// 1. WebSite Schema (Google 사이트 인식)
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AlgoMaker',
  alternateName: '알고메이커',
  url: 'https://nutube.kr',
  description: '클릭만으로 영상 자료를 5초 안에 만들어드리는 AI 도구. 분야와 주제 선택 후 떡상 사례 분석부터 4개 SNS 자료까지 자동 생성.',
  inLanguage: 'ko',
  publisher: {
    '@type': 'Organization',
    name: 'AlgoMaker',
    url: 'https://nutube.kr',
  },
};

// 2. SoftwareApplication Schema (AEO 친화 - ChatGPT/Perplexity가 도구로 인식)
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AlgoMaker',
  description: '유튜브 영상 만들기 자료를 5초 안에 자동 생성하는 무료 도구. 분야·주제 선택만으로 제목, 시나리오, 썸네일 컨셉, SNS 자료 4종 자동 생성.',
  applicationCategory: 'MultimediaApplication',
  applicationSubCategory: 'Content Creation Tool',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
  featureList: [
    '5초 자동 자료 생성',
    '9개 분야 × 6개 주제 추천',
    '제목 후보 자동 생성',
    'SEO 친화 시나리오 작성',
    '썸네일 컨셉 추천',
    '4개 SNS 자료 동시 생성 (YouTube/Shorts/Instagram/TikTok)',
    '5개 AI 엔진 연동 (Midjourney/Sora/VEO/Flow/NotebookLM)',
    '회원가입 불필요',
    '완전 무료',
  ],
  inLanguage: 'ko',
};

// 3. Organization Schema (사이트 신뢰도 ↑)
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AlgoMaker',
  url: 'https://nutube.kr',
  description: '영상 만들기를 처음 시작하시는 분들을 위한 AI 자료 생성 도구. 회원가입과 결제 없이 누구나 무료로 사용 가능.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'apark12321@gmail.com',
    availableLanguage: 'ko',
  },
};

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

// ============================================================
// 사이트 이용법 5단계 (자동 슬라이드)
// 박 대표님 v10.9 요청:
//   "의미없는 파이프라인 X, 자료 만드는 과정 슬라이드"
// ============================================================
const HOW_IT_WORKS = [
  {
    num: '01',
    title: '분야 선택',
    desc: '재테크, 부동산, 건강 등 9개 분야 중 만드실 영상 카테고리를 클릭하세요.',
    detail: '시니어 친화 키워드 사전 탑재',
    icon: '📁',
  },
  {
    num: '02',
    title: '주제 클릭',
    desc: '분야별 추천 주제 6개가 나타납니다. 원하시는 주제를 한 번 클릭하시면 됩니다.',
    detail: '키워드 입력 부담 없이 클릭만',
    icon: '🎯',
  },
  {
    num: '03',
    title: 'AI 자동 분석',
    desc: '5초 안에 알고리즘이 떡상 사례 분석부터 SEO 친화적 자료까지 자동 생성합니다.',
    detail: '평균 5초 처리',
    icon: '⚡',
  },
  {
    num: '04',
    title: '4종 자료 받기',
    desc: '제목 후보, 시나리오, 썸네일 컨셉, 4개 SNS(YT/Shorts/IG/TikTok) 자료를 한 번에 받습니다.',
    detail: '복사·다운로드 가능',
    icon: '📦',
  },
  {
    num: '05',
    title: '바로 사용',
    desc: '받은 자료를 그대로 영상 업로드에 사용하세요. 회원가입·결제 모두 불필요.',
    detail: '완전 무료',
    icon: '🚀',
  },
];

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function HomePage() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  // v10.9: 사이트 이용법 자동 슬라이드
  const [slideIdx, setSlideIdx] = useState(0);

  // 자동 슬라이드 (4초마다)
  useEffect(() => {
    const t = setInterval(() => {
      setSlideIdx((i) => (i + 1) % HOW_IT_WORKS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // v11.2: 시나리오 패턴 8가지 (박 대표님 자산 platforms.ts SCENARIOS와 호환)
  // 박 대표님 의도: "더 많은 패턴 (이전 버전 복원)"
  const SCENARIO_PATTERNS = [
    {
      id: 'curiosity',
      emoji: '🤔',
      name: '호기심 자극형',
      desc: '시청자의 궁금증을 유발하는 구조',
      flow: '문제 제기 → 단서 제공 → 핵심 공개',
      hint: '“이거 모르고 ○○하면 후회합니다” 식 후크',
    },
    {
      id: 'tutorial',
      emoji: '📋',
      name: '단계별 가이드',
      desc: '따라하기 쉬운 단계별 설명',
      flow: '도입 → 1단계 → 2단계 → 마무리',
      hint: '“5단계만 따라하면 됩니다” 식 구조',
    },
    {
      id: 'review',
      emoji: '⚖️',
      name: '리뷰·비교',
      desc: '제품·서비스 비교 분석',
      flow: '소개 → 장점 → 단점 → 결론',
      hint: '“○○ vs ○○ 솔직 비교” 식 구조',
    },
    {
      id: 'storytelling',
      emoji: '📖',
      name: '스토리텔링',
      desc: '경험담 기반 자연스러운 흐름',
      flow: '시작 → 갈등 → 해결 → 교훈',
      hint: '“평범한 직장인이 ○○ 한 진짜 이야기”',
    },
    {
      id: 'list',
      emoji: '🔢',
      name: '리스트형',
      desc: 'BEST/TOP 형식 모음',
      flow: '인트로 → 1위 → 2위 → 3위 → 정리',
      hint: '“○○ TOP 5” 저장률 가장 높은 형식',
    },
    {
      id: 'qna',
      emoji: '💬',
      name: 'Q&A형',
      desc: '질문-답변 형식',
      flow: '질문 → 답변 → 부연 설명',
      hint: '시청자 댓글에서 자주 묻는 질문 답변',
    },
    {
      id: 'mistake',
      emoji: '⚠️',
      name: '실수·후회형',
      desc: '경험자의 후회담은 가장 강력한 신호',
      flow: '실수 공개 → 원인 → 해결책 → 교훈',
      hint: '“○○ 시작하기 전 알았으면 좋았을 5가지”',
    },
    {
      id: 'data',
      emoji: '📊',
      name: '데이터·분석형',
      desc: '데이터 기반 신뢰감 + 검색 강함',
      flow: '주제 → 데이터 제시 → 인사이트 → 결론',
      hint: '“실거래가/통계로 본 ○○의 진실”',
    },
  ];

  // v11.2: 선택된 주제 (시나리오 STEP 노출 트리거)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicClick = (categoryId: string, topic: string) => {
    // v11.2: 주제 선택 시 시나리오 STEP 노출 (즉시 이동 X)
    setSelectedTopic(topic);
    // 시나리오 영역으로 자동 스크롤
    setTimeout(() => {
      document.querySelector('.scenarioSection')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  // v11.2: 시나리오 패턴 선택 시 → publish 페이지 이동
  const handleScenarioClick = (scenarioId: string) => {
    if (!selectedCat || !selectedTopic) return;
    const url = `/publish?keyword=${encodeURIComponent(selectedTopic)}&category=${encodeURIComponent(selectedCat)}&scenario=${encodeURIComponent(scenarioId)}`;
    router.push(url);
  };

  const selectedCategory = CATEGORIES_WITH_TOPICS.find(c => c.id === selectedCat);

  return (
    <V11Shell>
      {/* JSON-LD: SEO/AEO/GEO 친화 5종 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
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
        /* 1. ENGINE PANEL (프로페셔널 SaaS 대시보드) */
        /* ============================================ */
        .enginePanel {
          margin: 20px 20px 0;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        @media (max-width: 600px) {
          .enginePanel { margin: 12px 12px 0; }
        }

        /* 패널 상단 바 */
        .engineBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: #f5f5f5;
          border-bottom: 1px solid #d4d4d4;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .engineBar { padding: 7px 12px; }
        }

        .engineBarLeft {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .engineDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .engineDot--red { background: #ef4444; }
        .engineDot--yellow { background: #f59e0b; }
        .engineDot--green { background: #22c55e; }

        .engineBarTitle {
          margin-left: 8px;
          font-size: 11px;
          color: #525252;
          font-weight: 500;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) {
          .engineBarTitle { font-size: 10px; margin-left: 6px; }
        }

        .engineBarRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .engineBadge {
          padding: 2px 7px;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          font-size: 9.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .engineBadge { font-size: 9px; padding: 2px 6px; } }

        .engineLive {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 7px;
          background: #ffffff;
          border: 1px solid #16a34a;
          font-size: 9.5px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: 0.12em;
        }
        @media (max-width: 600px) { .engineLive { font-size: 9px; padding: 2px 6px; } }

        .engineLiveDot {
          width: 6px;
          height: 6px;
          background: #16a34a;
          border-radius: 50%;
          animation: enginePulse 1.6s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(22, 163, 74, 0.6);
        }
        @keyframes enginePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        /* 패널 본문 (좌우 분할) */
        .engineBody {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 0;
        }
        @media (max-width: 900px) {
          .engineBody { grid-template-columns: 1fr; }
        }

        /* 좌측: 엔진 정보 */
        .engineLeft {
          padding: 28px 28px;
          border-right: 1px solid #e5e5e5;
        }
        @media (max-width: 900px) {
          .engineLeft { border-right: none; border-bottom: 1px solid #e5e5e5; padding: 24px 22px 20px; }
        }
        @media (max-width: 600px) {
          .engineLeft { padding: 20px 18px 18px; }
        }

        .engineKicker {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12.5px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: 'SF Mono', 'Consolas', monospace;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) {
          .engineKicker { font-size: 11.5px; letter-spacing: 0.18em; margin-bottom: 12px; }
        }

        .engineKickerArrow {
          color: #c2410c;
        }

        .engineTitle {
          font-size: 40px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .engineTitle { font-size: 28px; margin-bottom: 10px; }
        }

        .engineTitleAccent {
          color: #c2410c;
        }

        .engineSub {
          font-size: 17px;
          color: #525252;
          line-height: 1.65;
          font-weight: 500;
          margin: 0 0 22px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .engineSub { font-size: 15.5px; margin-bottom: 18px; }
        }

        /* v11.1 NEW: 노하우 11공식 배지 (팩트 = 홍보) */
        .formulaBadges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin: 0 0 18px;
        }
        @media (max-width: 600px) {
          .formulaBadges { grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 14px; }
        }

        .formulaBadge {
          padding: 8px 11px;
          background: rgba(194, 65, 12, 0.06);
          border-left: 2px solid #c2410c;
          font-size: 12.5px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: -0.012em;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .formulaBadge { font-size: 11.5px; padding: 6px 9px; }
        }

        /* v11.0 NEW: Hero CTA 버튼 (사용자 행동 명확화) */
        /* v13.0: a 태그로 변경 (가이드 둘러보기) */
        .heroCta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 0 8px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: 'Pretendard', system-ui, sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.018em;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 4px 6px -1px rgba(194, 65, 12, 0.2),
            0 2px 4px -1px rgba(194, 65, 12, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          width: 100%;
          max-width: 320px;
          text-decoration: none;
        }
        @media (max-width: 600px) {
          .heroCta {
            padding: 14px 20px;
            font-size: 15px;
            max-width: 100%;
            margin-bottom: 18px;
          }
        }
        .heroCta:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 12px -2px rgba(194, 65, 12, 0.3),
            0 4px 6px -2px rgba(194, 65, 12, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          background: linear-gradient(135deg, #b13a0a 0%, #d44a08 100%);
        }
        .heroCta:active {
          transform: translateY(0);
        }

        /* v13.0 NEW: 보조 CTA (자료 만들기) */
        .heroCtaSecondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 11px 18px;
          background: transparent;
          border: 1.5px solid #d4d4d4;
          color: #525252;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: -0.012em;
          cursor: pointer;
          margin-top: 8px;
          margin-bottom: 16px;
          transition: all 0.15s;
        }
        .heroCtaSecondary:hover {
          border-color: #0a0a0a;
          color: #0a0a0a;
        }
        @media (max-width: 600px) {
          .heroCtaSecondary { font-size: 12.5px; padding: 10px 14px; }
        }

        .heroCtaArrow {
          font-size: 20px;
          color: #fbbf24;
          font-weight: 800;
          animation: heroCtaArrowBounce 1.5s ease-in-out infinite;
        }
        @keyframes heroCtaArrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* 메트릭 3카드 */
        .engineMetrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 600px) {
          .engineMetrics { gap: 6px; }
        }

        .engineMetric {
          padding: 12px 12px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-top: 2px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .engineMetric { padding: 10px 10px; }
        }

        .engineMetricLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'SF Mono', 'Consolas', monospace;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) {
          .engineMetricLabel { font-size: 11.5px; letter-spacing: 0.08em; }
        }

        .engineMetricValue {
          font-size: 30px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.1;
          font-family: 'SF Mono', 'Consolas', 'Pretendard', monospace;
        }
        @media (max-width: 600px) {
          .engineMetricValue { font-size: 24px; }
        }

        .engineMetricUnit {
          font-size: 14px;
          font-weight: 600;
          color: #737373;
          letter-spacing: -0.005em;
          margin-top: 2px;
        }
        @media (max-width: 600px) {
          .engineMetricUnit { font-size: 12.5px; }
        }

        /* 우측: 파이프라인 */
        .engineRight {
          padding: 28px 28px;
          background: #0a0a0a;
          color: #ffffff;
          position: relative;
        }
        @media (max-width: 900px) {
          .engineRight { padding: 24px 22px; }
        }
        @media (max-width: 600px) {
          .engineRight { padding: 20px 18px; }
        }

        .enginePipelineHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: 14px;
          border-bottom: 1px solid #404040;
          font-family: 'SF Mono', 'Consolas', monospace;
        }

        .enginePipelineLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.22em;
        }
        @media (max-width: 600px) { .enginePipelineLabel { font-size: 9.5px; } }

        .enginePipelineStatus {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 9.5px;
          font-weight: 700;
          color: #22c55e;
          letter-spacing: 0.15em;
        }
        @media (max-width: 600px) { .enginePipelineStatus { font-size: 9px; } }

        .enginePipelineStatusDot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: enginePulse 1.6s ease-in-out infinite;
        }

        .enginePipelineList {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) {
          .enginePipelineList { gap: 6px; margin-bottom: 12px; }
        }

        /* ============================================ */
        /* HOW IT WORKS 슬라이드 (v10.9 NEW) */
        /* ============================================ */
        .slideCard {
          padding: 22px 22px 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 14px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          animation: slideFadeIn 0.5s ease-out;
        }
        @media (max-width: 600px) {
          .slideCard { padding: 18px 18px 16px; min-height: 180px; }
        }

        @keyframes slideFadeIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .slideHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .slideNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 28px;
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        @media (max-width: 600px) {
          .slideNum { font-size: 24px; }
        }

        .slideIcon {
          font-size: 32px;
          line-height: 1;
        }
        @media (max-width: 600px) {
          .slideIcon { font-size: 28px; }
        }

        .slideTitle {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .slideTitle { font-size: 21px; }
        }

        .slideDesc {
          font-size: 17px;
          color: #d4d4d4;
          line-height: 1.65;
          font-weight: 500;
          margin: 0 0 14px;
          word-break: keep-all;
          flex: 1;
        }
        @media (max-width: 600px) {
          .slideDesc { font-size: 15.5px; }
        }

        .slideDetail {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(251, 191, 36, 0.08);
          border-left: 2px solid #fbbf24;
          font-size: 14px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: -0.005em;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .slideDetail { font-size: 13px; padding: 7px 10px; }
        }

        .slideDetailIcon {
          color: #fbbf24;
          font-weight: 700;
        }

        /* 슬라이드 인디케이터 (점) */
        .slideDots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 14px;
        }

        .slideDot {
          width: 26px;
          height: 4px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.25s;
        }
        .slideDot:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .slideDot.active {
          background: #fbbf24;
          width: 36px;
        }
        @media (max-width: 600px) {
          .slideDot { width: 22px; height: 3px; }
          .slideDot.active { width: 30px; }
        }


        .enginePipelineFoot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px dashed #404040;
          font-family: 'SF Mono', 'Consolas', monospace;
        }

        .enginePipelineFootKey {
          font-size: 9.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.18em;
        }
        @media (max-width: 600px) { .enginePipelineFootKey { font-size: 8.5px; } }

        .enginePipelineFootVal {
          font-size: 10.5px;
          color: #d4d4d4;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) { .enginePipelineFootVal { font-size: 10px; } }

        /* ============================================ */
        /* 2. 키워드 선택 UX (v11.0 컴팩트) */
        /* 박 대표님 v11.0 지적: */
        /*   "분야가 화면 너무 많이 차지" */
        /*   "상하 간격 줄여줘" */
        /*   "선택 시 자동 다음 화면" */
        /* ============================================ */
        .selectSection {
          padding: 20px 24px;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .selectSection { padding: 16px 16px; }
        }

        /* v13.0 NEW: 보너스 도구 배지 (자료 만들기는 보조) */
        .toolBonusBadge {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 18px;
          background: #ffffff;
          border-left: 4px solid #fbbf24;
          margin-bottom: 18px;
          letter-spacing: -0.012em;
        }
        @media (max-width: 600px) {
          .toolBonusBadge { padding: 12px 14px; margin-bottom: 14px; }
        }
        .toolBonusBadge > span:first-child {
          font-size: 14px;
          font-weight: 800;
          color: #92400e;
        }
        @media (max-width: 600px) {
          .toolBonusBadge > span:first-child { font-size: 13px; }
        }
        .toolBonusBadgeSub {
          font-size: 12.5px;
          color: #525252;
          font-weight: 600;
          line-height: 1.5;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .toolBonusBadgeSub { font-size: 11.5px; }
        }

        .selectStep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .selectStepNum {
          width: 26px;
          height: 26px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'SF Mono', monospace;
          font-size: 11.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .selectStepNum { width: 22px; height: 22px; font-size: 10.5px; } }

        .selectStepTitle {
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.3;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .selectStepTitle { font-size: 14px; } }

        .selectStepSub {
          font-size: 12px;
          color: #737373;
          margin-left: 36px;
          margin-bottom: 10px;
          margin-top: -8px;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) {
          .selectStepSub { font-size: 11px; margin-left: 30px; margin-bottom: 8px; }
        }

        /* 분야 그리드 - 컴팩트 */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 6px;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) {
          .catGrid {
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-bottom: 12px;
          }
        }

        .catCard {
          padding: 9px 8px;
          background: #ffffff;
          border: 1.5px solid #e5e5e5;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          text-align: center;
          font-family: inherit;
          color: inherit;
          min-height: 64px;
          justify-content: center;
        }
        .catCard:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-1px);
        }
        .catCard.active {
          background: #fff;
          border-width: 2px;
          border-color: #c2410c;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(194, 65, 12, 0.12);
        }
        @media (max-width: 600px) {
          .catCard { padding: 7px 4px; min-height: 58px; }
        }

        .catEmoji {
          font-size: 20px;
          line-height: 1;
        }
        @media (max-width: 600px) { .catEmoji { font-size: 18px; } }

        .catName {
          font-size: 12px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }
        @media (max-width: 600px) { .catName { font-size: 10.5px; } }

        .catDesc {
          font-size: 10px;
          color: #737373;
          line-height: 1.3;
          display: none;  /* v11.0: 화면 차지 줄이기 위해 숨김 */
        }

        /* 주제 칩 영역 (선택된 분야) - 컴팩트 */
        .topicSection {
          padding: 14px 16px;
          background: #ffffff;
          border: 2px solid #0a0a0a;
          margin-top: -6px;
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

        /* topicChip 활성 (선택됨) */
        .topicChip.active {
          background: #c2410c;
          border-color: #c2410c;
          color: #ffffff;
          transform: translateY(-1px);
        }
        .topicChip.active .topicChipArrow {
          color: #fbbf24;
        }

        /* ============================================ */
        /* v11.2 NEW: 시나리오 패턴 선택 */
        /* 박 대표님 v11.2: "이전 버전 시나리오 패턴 복원 + 더 많이" */
        /* ============================================ */
        .scenarioSection {
          padding: 14px 16px;
          background: #ffffff;
          border: 2px solid #0a0a0a;
          margin-top: -6px;
          animation: slideDown 0.25s ease-out;
        }
        @media (max-width: 600px) {
          .scenarioSection { padding: 12px 12px; }
        }

        .scenarioGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 8px;
        }
        @media (max-width: 600px) {
          .scenarioGrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }
        }

        .scenarioCard {
          padding: 14px 12px;
          background: #ffffff;
          border: 1.5px solid #e5e5e5;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
          font-family: inherit;
          color: inherit;
        }
        .scenarioCard:hover {
          background: #fafafa;
          border-color: #c2410c;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(194, 65, 12, 0.08);
        }
        @media (max-width: 600px) {
          .scenarioCard { padding: 11px 10px; }
        }

        .scenarioEmoji {
          font-size: 24px;
          line-height: 1;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) { .scenarioEmoji { font-size: 22px; } }

        .scenarioName {
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.018em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .scenarioName { font-size: 12.5px; } }

        .scenarioDesc {
          font-size: 11.5px;
          color: #737373;
          line-height: 1.45;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .scenarioDesc { font-size: 11px; } }

        .scenarioFlow {
          font-size: 11px;
          color: #c2410c;
          font-weight: 700;
          line-height: 1.45;
          margin-top: 4px;
          padding-top: 6px;
          border-top: 1px dashed #e5e5e5;
          font-family: 'SF Mono', monospace;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .scenarioFlow { font-size: 10px; } }

        .scenarioHint {
          font-size: 11.5px;
          color: #525252;
          margin-top: 12px;
          text-align: center;
          letter-spacing: 0.02em;
          padding: 8px 12px;
          background: #fff7ed;
          border-left: 3px solid #fbbf24;
        }
        @media (max-width: 600px) { .scenarioHint { font-size: 10.5px; padding: 6px 10px; } }

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
        /* v12 NEW: 박 대표님 4개 시주제 카테고리 */
        /* 애드센스 주제 일관성 명시 (유튜브/영상 채널) */
        /* ============================================ */
        .categorySection {
          padding: 32px 24px 24px;
          background: #ffffff;
        }
        @media (max-width: 600px) {
          .categorySection { padding: 24px 16px 18px; }
        }

        .sectionSub {
          font-size: 13px;
          color: #737373;
          font-weight: 600;
          margin-top: 4px;
          letter-spacing: -0.01em;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .sectionSub { font-size: 12px; } }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
        @media (max-width: 600px) {
          .categoryGrid { grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
        }

        .categoryCard {
          padding: 18px 18px 16px;
          background: #ffffff;
          border: 2px solid;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 600px) {
          .categoryCard { padding: 14px 12px 12px; gap: 4px; }
        }
        .categoryCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
        }

        .categoryCard-algo { border-color: #c2410c; }
        .categoryCard-algo:hover { background: #fff7ed; }
        .categoryCard-algo .categoryName { color: #c2410c; }
        .categoryCard-algo .categoryArrow { color: #c2410c; }

        .categoryCard-senior { border-color: #f59e0b; }
        .categoryCard-senior:hover { background: #fef3c7; }
        .categoryCard-senior .categoryName { color: #92400e; }
        .categoryCard-senior .categoryArrow { color: #92400e; }

        .categoryCard-ai { border-color: #7c3aed; }
        .categoryCard-ai:hover { background: #faf5ff; }
        .categoryCard-ai .categoryName { color: #7c3aed; }
        .categoryCard-ai .categoryArrow { color: #7c3aed; }

        .categoryCard-money { border-color: #16a34a; }
        .categoryCard-money:hover { background: #f0fdf4; }
        .categoryCard-money .categoryName { color: #16a34a; }
        .categoryCard-money .categoryArrow { color: #16a34a; }

        .categoryEmoji {
          font-size: 36px;
          line-height: 1;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) { .categoryEmoji { font-size: 28px; } }

        .categoryName {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.022em;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .categoryName { font-size: 14px; } }

        .categoryDesc {
          font-size: 12.5px;
          color: #525252;
          line-height: 1.55;
          word-break: keep-all;
          font-weight: 500;
        }
        @media (max-width: 600px) { .categoryDesc { font-size: 11.5px; } }

        .categoryArrow {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.012em;
          margin-top: 6px;
          padding-top: 10px;
          border-top: 1px dashed currentColor;
        }
        @media (max-width: 600px) { .categoryArrow { font-size: 11px; } }

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
        <section className="enginePanel">
          {/* 패널 상단 바 (브라우저 윈도우/터미널 느낌) */}
          <div className="engineBar">
            <div className="engineBarLeft">
              <span className="engineDot engineDot--red" />
              <span className="engineDot engineDot--yellow" />
              <span className="engineDot engineDot--green" />
              <span className="engineBarTitle">algorithm-engine.live</span>
            </div>
            <div className="engineBarRight">
              <span className="engineBadge">v6.5</span>
              <span className="engineLive">
                <span className="engineLiveDot" />
                LIVE
              </span>
            </div>
          </div>

          {/* 패널 본문 */}
          <div className="engineBody">
            {/* v13.0: 정보 사이트 정체성 명시 */}
            <div className="engineLeft">
              <div className="engineKicker">
                <span className="engineKickerArrow">▍</span>
                유튜브 채널 운영 정보 사이트
              </div>

              <h1 className="engineTitle">
                <span className="engineTitleAccent">알고리즘·시니어·AI</span><br />
                채널 수익화 가이드
              </h1>

              <p className="engineSub">
                <strong>실제 검증된 11가지 업로드 공식</strong>과 시니어 사연 쇼츠,
                AI 도구 활용까지 — 유튜브 채널 운영에 필요한 모든 노하우를
                무료로 정리해드립니다.
              </p>

              {/* v13.0: 4개 시주제 배지 */}
              <div className="formulaBadges">
                <div className="formulaBadge">📊 알고리즘 11공식</div>
                <div className="formulaBadge">👔 시니어 사연 쇼츠</div>
                <div className="formulaBadge">🤖 AI 도구 활용</div>
                <div className="formulaBadge">💰 채널 수익화</div>
              </div>

              {/* 큰 CTA 버튼 - 가이드 둘러보기 (정보 사이트) */}
              <a
                className="heroCta"
                href="/blog"
              >
                <span className="heroCtaLabel">📚 가이드 둘러보기</span>
                <span className="heroCtaArrow">→</span>
              </a>

              {/* 보조 CTA - 자료 만들기 (보너스) */}
              <button
                className="heroCtaSecondary"
                onClick={() => {
                  document.querySelector('.selectSection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                type="button"
              >
                <span>또는 자료 만들기 도구 사용</span>
                <span className="heroCtaArrow">↓</span>
              </button>

              <div className="engineMetrics">
                <div className="engineMetric">
                  <div className="engineMetricLabel">가이드</div>
                  <div className="engineMetricValue">20</div>
                  <div className="engineMetricUnit">편 작성됨</div>
                </div>
                <div className="engineMetric">
                  <div className="engineMetricLabel">시주제</div>
                  <div className="engineMetricValue">4</div>
                  <div className="engineMetricUnit">분야</div>
                </div>
                <div className="engineMetric">
                  <div className="engineMetricLabel">자료 도구</div>
                  <div className="engineMetricValue">5</div>
                  <div className="engineMetricUnit">AI 통합</div>
                </div>
              </div>
            </div>

            {/* 우측: 사이트 이용법 자동 슬라이드 */}
            <div className="engineRight">
              <div className="enginePipelineHead">
                <span className="enginePipelineLabel">HOW IT WORKS</span>
                <span className="enginePipelineStatus">
                  <span className="enginePipelineStatusDot" />
                  STEP {slideIdx + 1} / {HOW_IT_WORKS.length}
                </span>
              </div>

              {/* 슬라이드 카드 */}
              <div className="slideCard">
                <div className="slideHead">
                  <div className="slideNum">{HOW_IT_WORKS[slideIdx].num}</div>
                  <div className="slideIcon">{HOW_IT_WORKS[slideIdx].icon}</div>
                </div>
                <h3 className="slideTitle">{HOW_IT_WORKS[slideIdx].title}</h3>
                <p className="slideDesc">{HOW_IT_WORKS[slideIdx].desc}</p>
                <div className="slideDetail">
                  <span className="slideDetailIcon">▸</span>
                  {HOW_IT_WORKS[slideIdx].detail}
                </div>
              </div>

              {/* 슬라이드 인디케이터 (점) */}
              <div className="slideDots">
                {HOW_IT_WORKS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`slideDot ${i === slideIdx ? 'active' : ''}`}
                    onClick={() => setSlideIdx(i)}
                    aria-label={`Step ${i + 1}`}
                  />
                ))}
              </div>

              <div className="enginePipelineFoot">
                <span className="enginePipelineFootKey">완전 무료</span>
                <span className="enginePipelineFootVal">회원가입 X · 결제 X</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 2. 박 대표님 4개 시주제 카테고리 (메인 - 정보 사이트 정체성) */}
        {/* ============================================ */}
        <section className="categorySection">
          <div className="sectionHead">
            <div className="sectionTitle">🎯 무엇을 배우시나요?</div>
            <div className="sectionSub">관심 분야를 클릭하시면 관련 가이드만 모아보실 수 있습니다</div>
          </div>

          <div className="categoryGrid">
            <Link href="/blog?cat=algorithm" className="categoryCard categoryCard-algo">
              <div className="categoryEmoji">📊</div>
              <div className="categoryName">유튜브 알고리즘 · 노하우</div>
              <div className="categoryDesc">
                업로드 공식 11가지 / SEO 최적화 / 추천 알고리즘
              </div>
              <div className="categoryArrow">관련 가이드 보기 →</div>
            </Link>

            <Link href="/blog?cat=senior" className="categoryCard categoryCard-senior">
              <div className="categoryEmoji">👔</div>
              <div className="categoryName">시니어 사연 쇼츠</div>
              <div className="categoryDesc">
                50~80대 타겟 채널 / 사연 콘텐츠 / 시니어 친화 영상
              </div>
              <div className="categoryArrow">관련 가이드 보기 →</div>
            </Link>

            <Link href="/blog?cat=aitools" className="categoryCard categoryCard-ai">
              <div className="categoryEmoji">🤖</div>
              <div className="categoryName">AI 도구 활용</div>
              <div className="categoryDesc">
                Sora / VEO / ChatGPT / Midjourney 영상 제작 활용
              </div>
              <div className="categoryArrow">관련 가이드 보기 →</div>
            </Link>

            <Link href="/blog?cat=monetization" className="categoryCard categoryCard-money">
              <div className="categoryEmoji">💰</div>
              <div className="categoryName">영상 채널 수익화</div>
              <div className="categoryDesc">
                채널 성장 / 광고 수익 / 구독자 확보 / 떡상 전략
              </div>
              <div className="categoryArrow">관련 가이드 보기 →</div>
            </Link>
          </div>
        </section>

        {/* ============================================ */}
        {/* 3. 추천 가이드 6편 (메인 콘텐츠) */}
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
        {/* 4. 자료 만들기 도구 (보너스) - v13.0 정보 사이트 정체성 */}
        {/* ============================================ */}
        <section className="selectSection" id="tool">
          <div className="toolBonusBadge">
            <span>✨ 보너스 도구</span>
            <span className="toolBonusBadgeSub">가이드를 다 보셨다면, 자료 만들기 도구도 사용해 보세요</span>
          </div>
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
                onClick={() => {
                  const isNew = c.id !== selectedCat;
                  setSelectedCat(isNew ? c.id : null);
                  // v11.2: 분야 변경 시 주제·시나리오 초기화
                  setSelectedTopic(null);
                  // v11.0: 분야 선택 시 자동 스크롤 (주제 영역으로)
                  if (isNew) {
                    setTimeout(() => {
                      document.querySelector('.topicSection')?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }, 100);
                  }
                }}
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
                      className={`topicChip ${selectedTopic === topic ? 'active' : ''}`}
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

          {/* v11.2 NEW: STEP 3 시나리오 패턴 선택 */}
          {/* 박 대표님 v11.2: "이전 버전 시나리오 패턴이 더 좋다 + 더 많은 패턴" */}
          {selectedCat && selectedTopic && (
            <>
              <div className="selectStep" style={{ marginTop: 18 }}>
                <div className="selectStepNum">03</div>
                <div className="selectStepTitle">어떤 시나리오 형식으로 만들까요?</div>
              </div>
              <div className="selectStepSub">
                선택한 주제: <strong>{selectedTopic}</strong> · 8가지 검증된 시나리오 패턴
              </div>

              <div className="scenarioSection">
                <div className="scenarioGrid">
                  {SCENARIO_PATTERNS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="scenarioCard"
                      onClick={() => handleScenarioClick(s.id)}
                    >
                      <div className="scenarioEmoji">{s.emoji}</div>
                      <div className="scenarioName">{s.name}</div>
                      <div className="scenarioDesc">{s.desc}</div>
                      <div className="scenarioFlow">{s.flow}</div>
                    </button>
                  ))}
                </div>

                <div className="scenarioHint">
                  💡 시나리오를 선택하시면 즉시 AI 분석이 시작됩니다.
                </div>
              </div>
            </>
          )}
        </section>

        {/* ============================================ */}
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
