'use client';
/**
 * AlgoMaker 결과 페이지 v10.7 - 자동 이동 + 4개 플랫폼 진짜 디자인
 *
 * 박예준 대표 비전:
 * "SNS 초보자가 사이트에 딱 왔을 때 뭔가 필이 팍 꽂혀야 한다"
 * "100명이 같은 키워드 입력해도 100가지 결과"
 * "AlgoMaker 자체 = 완전 무료"
 *
 * v10.7 변경사항 (2026.04.30):
 * - 🔄 클릭 → 자동 이동 + 자동 스크롤
 *   STEP 1 (사례): 카드 클릭 → 자동으로 STEP 2 이동
 *   STEP 2 (제목): 제목 카드 클릭 → 자동으로 STEP 3 이동 (300ms 딜레이로 선택 효과 보임)
 *   STEP 3 (시나리오): "다음 단계로 →" 큰 검정 버튼
 *   STEP 4 (프롬프트): "다음 단계로 →" 큰 검정 버튼
 *   STEP 5 (메타): "SNS 업로드 자료 보기 →" 큰 주황 버튼
 *   STEP 6 (SNS): 마지막 (이동 X)
 *   각 STEP 진입 시 window.scrollTo({top: 0, behavior: 'smooth'})
 * - 💡 STEP 1, 2 상단에 안내 박스 추가 (클릭 시 자동 이동 알림)
 * - 🎨 4개 플랫폼 진짜 SNS 아이덴티티:
 *   YouTube: 빨강 그라디언트 배너 (#ff0000)
 *   Shorts: 핑크 그라디언트 배너 + 9:16 모바일 미리보기 박스
 *   Instagram: 옐로/핑크/보라 그라디언트 배너
 *   TikTok: 검정 배너 + 시안 라인
 * - ✅ 박 대표님 v650Adapter 데이터 그대로 활용
 * - ✅ AdSense 정책 안전 (가짜 데이터 0)
 *
 * v10.6 변경사항 유지:
 * - 컴팩트 모드 (39개 영역)
 *
 * v10.5 변경사항 유지:
 * - SNS 4개 플랫폼 자체 UI 구현 (Tailwind 미사용)
 *
 * v10.4 변경사항 유지:
 * - generateV650Data 시그니처 수정
 *
 * v10.3 변경사항 유지:
 * - diversifyTags 무한 로딩 해결
 *
 * v10.2 변경사항 유지:
 * - contentEngine 정확한 시그니처 적용
 */

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import { CATEGORIES, SCENARIOS } from '../_shared/platforms';
import {
  generateTitles,
  generateDescription,
  generateTags,
  generateVideoSequences,
  generateThumbnailConcepts,
  generateShortsScript,
  getViralCases,
  bumpSeed,
} from '../_shared/contentEngine';
import AdSlot from '../_shared/AdSlot';

// ============================================================
// v6.5.0 추가 모듈 (작가급 시나리오 + SNS 4종 + 전문가 프롬프트)
// ============================================================
import { generateV650Data, type V650DataPackage } from '../_shared/v650Adapter';
import { CinematicScenarioDisplay } from '../_shared/CinematicScenarioDisplay_v6_5_0';
import { CinematicPromptDisplay } from '../_shared/CinematicPromptDisplay_v6_5_0';

// v11.0: 알고리즘 노하우 인사이트 (박 대표님 docx 자산 기반)
import { getAlgorithmInsights } from '../_shared/algorithmInsights';

// Safe wrapper - getAlgorithmInsights 시그니처 변동 대응
function getAlgorithmInsightsSafe(keyword: string) {
  try {
    // 함수가 (keyword) 만 받든 (keyword, categoryId) 받든 모두 대응
    const result = (getAlgorithmInsights as any)(keyword, '');
    return result || null;
  } catch {
    return null;
  }
}
// v10.5: SNSUploadPanel 대신 자체 SNS UI 구현 (Tailwind 미사용 환경 호환)
// 박 대표님 SNSUploadPanel_v6_5_0.tsx 파일은 그대로 보존

// ============================================================
// v8.2: 태그 다양화 시스템
// 도메인별 연관 키워드 풀 → 시드 기반으로 다양하게 선택
// "2026년 부동산 전망 추천/방법/입문..." 식 중복 제거
// ============================================================

type TagDomain = 
  | 'realestate'     // 부동산/청약
  | 'economy'        // 경제/재테크
  | 'health'         // 건강/운동
  | 'food'           // 요리/맛집
  | 'travel'         // 여행/취미
  | 'aitech'         // AI/디지털
  | 'family'         // 가족/사연
  | 'language'       // 외국어
  | 'senior'         // 시니어 라이프
  | 'review'         // 리뷰/비교
  | 'tutorial'       // 가이드/방법
  | 'general';       // 일반

// 도메인별 연관 키워드 풀 (각 20-30개)
const DOMAIN_KEYWORD_POOL: Record<TagDomain, string[]> = {
  realestate: [
    '부동산 시장', '주택 시장', '청약 전략', '부동산 투자',
    '아파트 매매', '전세 시장', '내집 마련', '주거 트렌드',
    '재개발', '재건축', '신축 분양', '입지 분석',
    '매매가', '전세가', '시세 분석', '부동산 정보',
    '주택 정책', '분양가 상한제', '청약 가점', '주택 자금',
    '집값', '주택 시세', '부동산 흐름', '투자 정보',
  ],
  economy: [
    '재테크', '자산 관리', '노후 자금', '연금', 
    '경제 전망', '금리', '환율', '주식 투자',
    '펀드', 'ETF', '예금 적금', '재무 설계',
    '은퇴 준비', '경제 흐름', '시장 분석', '돈 관리',
    '월 100만원', '현금 흐름', '안전 자산', '분산 투자',
    '재무 점검', '소득 관리', '지출 관리', '노후 대비',
  ],
  health: [
    '건강 관리', '홈트레이닝', '시니어 건강', '식단 관리',
    '근력 운동', '유산소 운동', '스트레칭', '걷기 운동',
    '다이어트', '체중 감량', '건강 식단', '영양 관리',
    '관절 건강', '허리 건강', '면역력', '수면 관리',
    '5060 건강', '시니어 운동', '집에서 운동', '실내 운동',
    '건강 정보', '의료 정보', '병원 정보', '건강 검진',
  ],
  food: [
    '집밥', '한식 레시피', '간단 요리', '저녁 메뉴',
    '아침 메뉴', '도시락', '반찬', '국 요리',
    '한그릇 요리', '면 요리', '밥 요리', '디저트',
    '동네 맛집', '가성비 맛집', '맛집 후기', '맛집 추천',
    '요리 비법', '요리 팁', '주방 살림', '식재료',
    '제철 음식', '계절 메뉴', '집들이 요리', '명절 요리',
  ],
  travel: [
    '국내 여행', '해외 여행', '가성비 여행', '주말 여행',
    '당일치기', '1박 2일', '여행 코스', '여행 후기',
    '제주도', '강원도', '경상도', '전라도',
    '동남아', '유럽', '일본', '중국',
    '여행 팁', '여행 준비물', '여행 예산', '패키지 여행',
    '자유 여행', '시니어 여행', '효도 여행', '가족 여행',
  ],
  aitech: [
    'ChatGPT', 'AI 도구', '디지털 도구', '핸드폰 사용법',
    '스마트폰', '인공지능', '챗봇', '생성형 AI',
    'AI 활용법', '시니어 디지털', '디지털 입문', '컴퓨터 기초',
    '카카오톡', '유튜브', '네이버', '구글',
    '온라인 쇼핑', '인터넷 뱅킹', '디지털 시대', '4차 산업',
    'IT 트렌드', '기술 변화', '미래 기술', '신기술',
  ],
  family: [
    '가족 사연', '부부 이야기', '부모 자식', '가족 관계',
    '시댁 이야기', '친정 이야기', '며느리', '사위',
    '손주', '자녀 교육', '결혼 이야기', '이혼 사연',
    '가족 갈등', '화해', '용서', '진심',
    '일상 이야기', '평범한 하루', '소소한 행복', '가족 모임',
    '명절 이야기', '추억', '그리움', '사랑',
  ],
  language: [
    '영어 회화', '영어 공부', '시니어 영어', '기초 영어',
    '일본어', '중국어', '독일어', '프랑스어',
    '외국어 학습', '회화 연습', '문법', '단어 암기',
    '발음', '듣기', '읽기', '쓰기',
    '학습법', '공부 비법', '언어 교환', '독학',
    '온라인 강의', '학원 후기', '교재 추천', '앱 추천',
  ],
  senior: [
    '5060', '6070', '시니어', '50대 이야기',
    '60대 일상', '70대 활기', '은퇴 후', '인생 2막',
    '노후 생활', '시니어 라이프', '액티브 시니어', '실버 세대',
    '50대 부업', '시니어 직업', '평생 직업', '취미 활동',
    '시니어 모임', '동호회', '봉사 활동', '여가 생활',
    '인생 후반', '황혼기', '경험담', '인생 조언',
  ],
  review: [
    '리뷰', '솔직 후기', '비교 분석', '추천',
    '장단점', '실제 사용', '구매 후기', '체험기',
    '제품 비교', '서비스 비교', '브랜드 비교', '가성비',
    '꿀팁', '노하우', '주의사항', '경험 공유',
  ],
  tutorial: [
    '방법', '가이드', '입문', '기초',
    '시작하기', '단계별', '쉬운', '간단한',
    '꿀팁', '노하우', '비결', '비법',
    '실전', '실습', '예제', '예시',
  ],
  general: [
    '정보', '분석', '꿀팁', '노하우',
    '실전', '경험담', '추천', '인기',
    '트렌드', '이슈', '화제', '주목',
  ],
};

// 도메인 자동 감지 (키워드 + 카테고리 기반)
function detectTagDomain(keyword: string, categoryId: string): TagDomain {
  const k = keyword.toLowerCase();
  
  // 카테고리 ID 우선 매칭
  if (categoryId === 'realestate') return 'realestate';
  if (categoryId === 'economy') return 'economy';
  if (categoryId === 'health') return 'health';
  if (categoryId === 'food') return 'food';
  if (categoryId === 'travel') return 'travel';
  if (categoryId === 'aitech') return 'aitech';
  if (categoryId === 'family') return 'family';
  if (categoryId === 'language') return 'language';
  if (categoryId === 'senior') return 'senior';
  
  // 카테고리 매칭 안 되면 키워드 기반
  if (/부동산|청약|아파트|주택|전세/i.test(k)) return 'realestate';
  if (/투자|재테크|연금|돈|자산|경제/i.test(k)) return 'economy';
  if (/건강|운동|다이어트|식단|병원/i.test(k)) return 'health';
  if (/요리|레시피|음식|맛집|밥/i.test(k)) return 'food';
  if (/여행|관광|호텔|항공|리조트/i.test(k)) return 'travel';
  if (/AI|ChatGPT|핸드폰|스마트폰|디지털/i.test(k)) return 'aitech';
  if (/가족|부부|부모|자식|결혼|이혼/i.test(k)) return 'family';
  if (/영어|일본어|중국어|외국어|회화/i.test(k)) return 'language';
  if (/시니어|5060|6070|50대|60대|70대|은퇴|노후/i.test(k)) return 'senior';
  if (/리뷰|비교|후기|추천|솔직/i.test(k)) return 'review';
  if (/방법|how|가이드|배우|시작|입문/i.test(k)) return 'tutorial';
  
  return 'general';
}

// 시드 기반 셔플 (같은 키워드도 매번 다른 결과)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 메인 다양화 함수: 기존 generateTags 결과를 받아서 다양한 태그 13개 생성
// v10.3: 시그니처를 (keyword, rawTags, domain, seed) 순서로 정렬 — 호출부와 일치
function diversifyTags(
  keyword: string,
  originalTags: any[],
  domain: TagDomain,
  seed: number
): { tag: string }[] {
  const pool = DOMAIN_KEYWORD_POOL[domain] || DOMAIN_KEYWORD_POOL.general;
  const generalPool = DOMAIN_KEYWORD_POOL.general;
  
  // 메인 키워드는 항상 첫 번째
  const mainTag = (keyword || '').trim();
  
  // 도메인 풀에서 시드 기반으로 11개 선택
  const shuffledDomain = seededShuffle(pool, seed);
  const domainTags = shuffledDomain.slice(0, 11);
  
  // 일반 풀에서 1개 추가 (다양성 보장)
  const shuffledGeneral = seededShuffle(generalPool, seed + 1);
  const generalTag = shuffledGeneral[0];
  
  // 13개 조합: 메인 + 도메인 11 + 일반 1
  const allTags = [mainTag, ...domainTags, generalTag].filter(Boolean);
  
  // 중복 제거 (혹시 모를 케이스)
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 13);
  
  // 기존 generateTags 와 호환되는 형식으로 반환
  return uniqueTags.map(t => ({ tag: t }));
}

type StepId = 'cases' | 'title' | 'script' | 'video' | 'publish';


// ============================================================
// v11.0: 워크스루 STEP 재정의
// 박 대표님 v11.0 지적:
//   "SNS 업로드는 부수적, 영상 제작이 본질"
//   "영상 제작은 추후 공개"
//   → SNS 제거, "영상 제작 (추후 공개)" 페이지 추가
//   → meta 단계도 제거 (시나리오/프롬프트로 통합)
// ============================================================
type StepKey = 'cases' | 'title' | 'script' | 'video' | 'publish';

const STEPS_V10: { 
  key: StepKey; 
  num: string; 
  ko: string;       // 한글 메인 라벨
  en: string;       // 영문 보조
  desc: string;     // 한 줄 설명
}[] = [
  { key: 'cases',   num: '1', ko: '비슷한 사례',     en: 'Reference',   desc: '이 키워드로 잘 된 영상들 살펴보기' },
  { key: 'title',   num: '2', ko: '제목 후보',       en: 'Title',       desc: '클릭률 높은 제목 3가지' },
  { key: 'script',  num: '3', ko: '시나리오',        en: 'Scenario',    desc: '6단계 영상 구조와 흐름' },
  { key: 'video',   num: '4', ko: '영상 프롬프트',   en: 'Prompt',      desc: 'AI 도구별 프롬프트' },
  { key: 'publish', num: '5', ko: '영상 제작',       en: 'Production',  desc: '프롬프트로 실제 영상 만들기 (추후 공개)' },
];

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function PublishPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PublishWorkthrough />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <V11Shell>
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Pretendard', -apple-system, system-ui, sans-serif",
        fontSize: 15,
        color: '#525252',
      }}>
        영상 자료를 만들고 있습니다...
      </div>
    </V11Shell>
  );
}

// ============================================================
// 워크스루 본체
// ============================================================
function PublishWorkthrough() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'general';
  const seedParam = searchParams.get('seed');

  const [seed, setSeed] = useState<number>(() => {
    if (seedParam) return parseInt(seedParam, 10);
    return Math.floor(Math.random() * 1000000);
  });

  const [currentStep, setCurrentStep] = useState<number>(0); // 0~5

  // 작가급/전문가/SNS 모드
  const [cinematicMode, setCinematicMode] = useState(false);
  const [proPromptMode, setProPromptMode] = useState(false);
  const [proSnsMode, setProSnsMode] = useState(true);

  const [copied, setCopied] = useState<string | null>(null);
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);

  // 키워드가 없으면 메인으로
  useEffect(() => {
    if (!keyword.trim()) {
      router.replace('/');
    }
  }, [keyword, router]);

  // ============================================================
  // 콘텐츠 생성 (박 대표님 contentEngine 정확한 시그니처)
  // ============================================================
  // contentEngine 시그니처:
  //   generateTitles(keyword, scenarioId, categoryName)
  //   generateDescription(keyword, categoryName, scenarioId)
  //   generateTags(keyword, categoryName)
  //   generateVideoSequences(keyword, scenarioId)
  //   generateThumbnailConcepts(keyword, categoryName)
  //   generateShortsScript(keyword, scenarioId)
  //   getViralCases(categoryId, count?)
  // categoryId가 곧 scenarioId 역할을 하고, categoryName도 이를 사용
  const data = useMemo(() => {
    if (!keyword.trim()) return null;
    try {
      const titles = generateTitles(keyword, categoryId, categoryId);
      const description = generateDescription(keyword, categoryId, categoryId);
      
      // 박 대표님 contentEngine.generateTags(keyword, categoryName) - 2 args
      const rawTags = generateTags(keyword, categoryId);
      
      // v8.2 다양화 처리: 도메인 감지 + 시드 기반 다양화
      const domain = detectTagDomain(keyword, categoryId);
      const tags = diversifyTags(keyword, rawTags, domain, seed);
      
      const sequences = generateVideoSequences(keyword, categoryId);
      const thumbnails = generateThumbnailConcepts(keyword, categoryId);
      const shortsScript = generateShortsScript(keyword, categoryId);
      
      // getViralCases(categoryId, count) - 2 args
      const cases = getViralCases(categoryId, 3);

      return { titles, description, tags, sequences, thumbnails, shortsScript, cases };
    } catch (err) {
      console.error('[publish] contentEngine error:', err);
      return null;
    }
  }, [keyword, categoryId, seed]);

  // v6.5.0 작가급 시나리오 + 전문가 프롬프트 + SNS 4종
  // v10.4: 박 대표님 v650Adapter.ts 정확한 시그니처에 맞춤
  //        generateV650Data(keyword, selectedTitle, category) - 3 args
  const v650Data = useMemo<V650DataPackage | null>(() => {
    if (!data) return null;
    try {
      // 첫 번째 제목을 selectedTitle 로 사용 (사용자가 다른 제목 선택해도 시나리오는 첫 번째 기반)
      const firstTitle = Array.isArray(data.titles) && data.titles.length > 0
        ? (typeof data.titles[0] === 'string' ? data.titles[0] : (data.titles[0]?.title || keyword))
        : keyword;
      
      return generateV650Data(keyword, firstTitle, categoryId);
    } catch (err) {
      console.error('[v650] generateV650Data error:', err);
      return null;
    }
  }, [keyword, categoryId, seed, data]);

  if (!data) {
    return <LoadingScreen />;
  }

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1800);
      });
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // 페이지 상단으로 부드럽게
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goNext = () => {
    if (currentStep < STEPS_V10.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goStep = (idx: number) => {
    setCurrentStep(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const regenerate = () => {
    bumpSeed();  // void 반환 - 인자 없음
    setSeed(Math.floor(Math.random() * 1000000));  // 시드는 별도로 새로 생성
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepDef = STEPS_V10[currentStep];

  return (
    <V11Shell>
      <style jsx global>{`
        /* ============================================ */
        /* v10.0 - 워크스루 + 모바일 우선 + Pretendard 통일 */
        /* ============================================ */
        .wt {
          --c-fg: #0a0a0a;
          --c-fg-2: #404040;
          --c-fg-3: #737373;
          --c-bg: #ffffff;
          --c-bg-2: #fafafa;
          --c-bg-3: #f5f5f5;
          --c-line: #e5e5e5;
          --c-accent: #c2410c;
          --c-accent-2: #fbbf24;
          --c-success: #16a34a;

          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: var(--c-fg);
          line-height: 1.55;
          letter-spacing: -0.01em;
          background: var(--c-bg);
          min-height: 100vh;
        }

        .wt * {
          box-sizing: border-box;
        }

        .wt-container {
          max-width: 880px;
          margin: 0 auto;
          padding: 0;
        }

        /* ============================================ */
        /* 키워드 헤더 (고정) */
        /* ============================================ */
        .wt-header {
          padding: 18px 20px 14px;
          background: var(--c-bg);
          border-bottom: 1px solid var(--c-line);
        }
        @media (max-width: 600px) {
          .wt-header { padding: 18px 16px 14px; }
        }

        .wt-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--c-accent);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .wt-keyword {
          font-size: 22px;
          font-weight: 800;
          color: var(--c-fg);
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) {
          .wt-keyword { font-size: 18px; }
        }

        .wt-subtitle {
          font-size: 14px;
          color: var(--c-fg-3);
          line-height: 1.55;
          margin: 0;
        }
        @media (max-width: 600px) {
          .wt-subtitle { font-size: 13px; }
        }

        /* ============================================ */
        /* 진행 표시줄 (Progress Bar) */
        /* ============================================ */
        .wt-progress {
          padding: 16px 20px;
          background: var(--c-bg);
          border-bottom: 1px solid var(--c-line);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.95);
        }
        @media (max-width: 600px) {
          .wt-progress { padding: 12px 16px; }
        }

        .wt-progress-track {
          display: flex;
          align-items: center;
          gap: 0;
          position: relative;
        }

        .wt-progress-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          padding: 4px 2px;
          cursor: pointer;
          font-family: inherit;
          position: relative;
          min-height: 44px;
          justify-content: center;
        }

        /* 점 */
        .wt-progress-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--c-bg);
          border: 2px solid var(--c-line);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--c-fg-3);
          transition: all 0.2s;
        }
        @media (max-width: 600px) {
          .wt-progress-dot { width: 24px; height: 24px; font-size: 11px; }
        }

        .wt-progress-step.done .wt-progress-dot {
          background: var(--c-fg);
          border-color: var(--c-fg);
          color: var(--c-bg);
        }

        .wt-progress-step.current .wt-progress-dot {
          background: var(--c-accent);
          border-color: var(--c-accent);
          color: var(--c-bg);
          box-shadow: 0 0 0 4px rgba(194, 65, 12, 0.15);
        }

        /* 라벨 */
        .wt-progress-label {
          font-size: 10.5px;
          font-weight: 600;
          color: var(--c-fg-3);
          letter-spacing: -0.005em;
          text-align: center;
          line-height: 1.2;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .wt-progress-label { 
            font-size: 9.5px;
            display: none;
          }
        }

        .wt-progress-step.current .wt-progress-label {
          color: var(--c-accent);
          font-weight: 700;
        }

        .wt-progress-step.done .wt-progress-label {
          color: var(--c-fg);
        }

        /* 점들 사이 연결선 */
        .wt-progress-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 18px;
          left: calc(50% + 14px);
          right: calc(-50% + 14px);
          height: 2px;
          background: var(--c-line);
          z-index: -1;
        }
        @media (max-width: 600px) {
          .wt-progress-step:not(:last-child)::after {
            top: 16px;
            left: calc(50% + 12px);
            right: calc(-50% + 12px);
          }
        }

        .wt-progress-step.done:not(:last-child)::after {
          background: var(--c-fg);
        }

        /* ============================================ */
        /* STEP 본문 (한 번에 1개) */
        /* ============================================ */
        .wt-step {
          padding: 18px 20px 90px;
          min-height: 60vh;
        }
        @media (max-width: 600px) {
          .wt-step { padding: 14px 16px 90px; }
        }

        .wt-step-head {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--c-fg);
        }
        @media (max-width: 600px) {
          .wt-step-head { margin-bottom: 14px; padding-bottom: 10px; }
        }

        .wt-step-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--c-accent);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .wt-step-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--c-fg);
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) {
          .wt-step-title { font-size: 20px; }
        }

        .wt-step-en {
          font-size: 12px;
          color: var(--c-fg-3);
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-left: 4px;
        }

        .wt-step-desc {
          font-size: 14px;
          color: var(--c-fg-2);
          line-height: 1.55;
          margin: 6px 0 0;
        }
        @media (max-width: 600px) {
          .wt-step-desc { font-size: 13.5px; }
        }

        /* ============================================ */
        /* 콘텐츠 카드 - 통일된 박스 */
        /* ============================================ */
        .wt-card {
          background: var(--c-bg);
          border: 1px solid var(--c-line);
          padding: 14px 16px;
          margin-bottom: 10px;
          border-radius: 0;
        }
        @media (max-width: 600px) {
          .wt-card { padding: 12px 14px; margin-bottom: 8px; }
        }

        .wt-card.selected {
          border-color: var(--c-accent);
          background: #fffbf7;
          border-left-width: 4px;
          padding-left: 17px;
        }

        .wt-card-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--c-fg-3);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .wt-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--c-fg);
          letter-spacing: -0.02em;
          line-height: 1.5;
          margin: 0 0 4px;
        }
        @media (max-width: 600px) {
          .wt-card-title { font-size: 15px; }
        }

        .wt-card-body {
          font-size: 15px;
          color: var(--c-fg);
          line-height: 1.55;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-card-body { font-size: 14px; line-height: 1.55; }
        }

        .wt-card-meta {
          font-size: 12.5px;
          color: var(--c-fg-3);
          margin-top: 8px;
          line-height: 1.55;
        }

        /* ============================================ */
        /* 모드 토글 (작가급/전문가/SNS) */
        /* ============================================ */
        .wt-toggle {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 14px;
          background: var(--c-bg-2);
          border: 1px solid var(--c-line);
          margin-bottom: 14px;
          cursor: pointer;
          transition: background 0.15s;
        }
        @media (max-width: 600px) {
          .wt-toggle { padding: 10px 12px; gap: 10px; }
        }

        .wt-toggle.on {
          background: var(--c-fg);
          color: var(--c-bg);
          border-color: var(--c-fg);
        }

        .wt-toggle-switch {
          width: 36px;
          height: 22px;
          background: #d4d4d4;
          position: relative;
          flex-shrink: 0;
          border-radius: 22px;
          transition: background 0.2s;
        }

        .wt-toggle.on .wt-toggle-switch {
          background: var(--c-accent);
        }

        .wt-toggle-knob {
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: left 0.2s;
        }

        .wt-toggle.on .wt-toggle-knob {
          left: 17px;
        }

        .wt-toggle-text {
          flex: 1;
          min-width: 0;
        }

        .wt-toggle-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--c-fg);
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }
        .wt-toggle.on .wt-toggle-name {
          color: var(--c-accent-2);
        }

        .wt-toggle-desc {
          font-size: 12px;
          color: var(--c-fg-3);
          line-height: 1.5;
        }
        .wt-toggle.on .wt-toggle-desc {
          color: rgba(255, 255, 255, 0.75);
        }

        /* ============================================ */
        /* 버튼 통일 */
        /* ============================================ */
        .wt-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 44px;
          padding: 10px 18px;
          background: transparent;
          border: 1.5px solid var(--c-fg);
          color: var(--c-fg);
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .wt-btn { font-size: 12.5px; padding: 9px 14px; }
        }

        .wt-btn:hover {
          background: var(--c-fg);
          color: var(--c-bg);
        }

        .wt-btn-primary {
          background: var(--c-fg);
          color: var(--c-bg);
        }
        .wt-btn-primary:hover {
          background: var(--c-accent);
          border-color: var(--c-accent);
        }

        .wt-btn-sm {
          min-height: 36px;
          padding: 8px 14px;
          font-size: 12px;
        }
        @media (max-width: 600px) {
          .wt-btn-sm { font-size: 11.5px; padding: 7px 12px; }
        }

        .wt-btn.copied {
          background: var(--c-success);
          border-color: var(--c-success);
          color: #ffffff;
        }

        /* ============================================ */
        /* v11.0 NEW: 시나리오 헤더 + 다른 버전 버튼 */
        /* ============================================ */
        .wt-script-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .wt-script-head { padding: 10px 12px; }
        }
        .wt-script-head-label {
          flex: 1;
          min-width: 0;
        }
        .wt-script-head-num {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.018em;
        }
        .wt-script-head-tip {
          display: block;
          font-size: 11.5px;
          color: #737373;
          margin-top: 2px;
        }

        .wt-btn-regen {
          padding: 8px 14px;
          background: #ffffff;
          border: 1.5px solid #c2410c;
          color: #c2410c;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .wt-btn-regen:hover {
          background: #c2410c;
          color: #ffffff;
        }

        /* ============================================ */
        /* v11.0 NEW: 알고리즘 노하우 박스 (알맹이) */
        /* 박 대표님 v11.0: "시나리오 결과물에 알맹이 추가" */
        /* ============================================ */
        .wt-insights {
          margin-top: 16px;
          padding: 18px 18px 14px;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3e7 100%);
          border: 1px solid rgba(194, 65, 12, 0.12);
        }
        @media (max-width: 600px) {
          .wt-insights { padding: 14px 14px 12px; }
        }

        .wt-insights-head {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px dashed rgba(194, 65, 12, 0.2);
        }
        .wt-insights-icon {
          font-size: 18px;
        }
        .wt-insights-title {
          font-size: 14px;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: -0.018em;
        }
        @media (max-width: 600px) {
          .wt-insights-title { font-size: 13px; }
        }

        .wt-insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .wt-insights-grid { grid-template-columns: 1fr; gap: 8px; }
        }

        .wt-insight {
          padding: 12px 12px;
          background: #ffffff;
          border: 1px solid rgba(194, 65, 12, 0.08);
        }

        .wt-insight-label {
          font-size: 12px;
          font-weight: 800;
          color: #c2410c;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          font-family: 'Pretendard', sans-serif;
        }

        .wt-insight-body {
          font-size: 13px;
          color: #404040;
          line-height: 1.55;
          margin: 0 0 6px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-insight-body { font-size: 12.5px; }
        }
        .wt-insight-body strong {
          color: #c2410c;
          font-weight: 700;
        }

        .wt-insight-example {
          padding: 8px 10px;
          background: #fafafa;
          border-left: 2px solid #fbbf24;
          font-size: 12px;
          line-height: 1.55;
          color: #525252;
          word-break: keep-all;
          margin-top: 6px;
        }
        .wt-insight-example strong {
          color: #0a0a0a;
        }

        .wt-insight-list {
          margin: 0;
          padding-left: 18px;
        }
        .wt-insight-list li {
          font-size: 12.5px;
          color: #404040;
          line-height: 1.6;
          margin-bottom: 4px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-insight-list li { font-size: 12px; }
        }

        /* ============================================ */
        /* 하단 네비게이션 (고정) */
        /* ============================================ */
        .wt-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--c-bg);
          border-top: 1px solid var(--c-fg);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 100;
          padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
        }
        @media (max-width: 600px) {
          .wt-nav { padding: 10px 16px; gap: 8px; }
        }

        .wt-nav-counter {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--c-fg-3);
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) {
          .wt-nav-counter { font-size: 12px; }
        }

        .wt-nav-counter strong {
          color: var(--c-fg);
          font-weight: 800;
        }

        .wt-nav-btn {
          flex-shrink: 0;
          min-width: 90px;
        }
        @media (max-width: 600px) {
          .wt-nav-btn { min-width: 76px; }
        }

        .wt-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .wt-nav-btn:disabled:hover {
          background: transparent;
          color: var(--c-fg);
        }

        /* ============================================ */
        /* 사례 카드 그리드 */
        /* ============================================ */
        .wt-case-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ============================================ */
        /* 제목 카드 */
        /* ============================================ */
        .wt-title-card {
          padding: 12px 14px;
          background: var(--c-bg);
          border: 1.5px solid var(--c-line);
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .wt-title-card:hover {
          border-color: var(--c-fg);
          background: var(--c-bg-2);
        }
        .wt-title-card.selected {
          border-color: var(--c-accent);
          background: #fffbf7;
        }
        @media (max-width: 600px) {
          .wt-title-card { padding: 11px 13px; }
        }

        .wt-title-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--c-accent);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .wt-title-text {
          font-size: 16px;
          font-weight: 700;
          color: var(--c-fg);
          line-height: 1.5;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-title-text { font-size: 14.5px; }
        }

        .wt-title-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
          color: var(--c-fg-3);
        }

        .wt-title-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        /* ============================================ */
        /* 메타데이터 (STEP 5) - 평탄화 */
        /* ============================================ */
        .wt-meta-section {
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--c-line);
        }
        .wt-meta-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .wt-meta-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
          gap: 12px;
        }

        .wt-meta-label-block {
          flex: 1;
          min-width: 0;
        }

        .wt-meta-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--c-accent);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .wt-meta-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--c-fg);
          letter-spacing: -0.02em;
        }

        .wt-meta-desc-text {
          font-size: 14.5px;
          color: var(--c-fg);
          line-height: 1.55;
          margin: 0;
          padding: 14px 16px;
          background: var(--c-bg-2);
          word-break: keep-all;
          white-space: pre-wrap;
        }
        @media (max-width: 600px) {
          .wt-meta-desc-text { font-size: 13.5px; line-height: 1.55; }
        }

        /* 태그 칩 */
        .wt-tag-flow {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 12px 14px;
          background: var(--c-bg-2);
        }
        .wt-tag-chip {
          font-size: 12.5px;
          color: var(--c-fg);
          padding: 4px 10px;
          background: var(--c-bg);
          border: 1px solid var(--c-line);
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .wt-tag-chip { font-size: 12px; padding: 4px 8px; }
        }

        /* 썸네일 컨셉 */
        .wt-thumb-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wt-thumb-card {
          padding: 12px 14px;
          background: var(--c-bg-2);
          border: 1px solid var(--c-line);
        }
        .wt-thumb-card-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .wt-thumb-card-idx {
          width: 28px;
          height: 28px;
          background: var(--c-fg);
          color: var(--c-bg);
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wt-thumb-card-name {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--c-fg);
          letter-spacing: -0.015em;
          flex: 1;
          min-width: 0;
          line-height: 1.4;
        }
        @media (max-width: 600px) {
          .wt-thumb-card-name { font-size: 13.5px; }
        }
        .wt-thumb-card-rating {
          font-size: 11px;
          color: var(--c-accent);
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .wt-thumb-card-grid {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 6px 12px;
          margin-bottom: 12px;
          font-size: 13px;
          line-height: 1.55;
          color: var(--c-fg);
        }
        @media (max-width: 600px) {
          .wt-thumb-card-grid { font-size: 12.5px; grid-template-columns: 52px 1fr; }
        }
        .wt-thumb-card-key {
          font-size: 11px;
          font-weight: 700;
          color: var(--c-fg-3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .wt-thumb-card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* ============================================ */
        /* 시나리오 비트 */
        /* ============================================ */
        .wt-beats {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .wt-beat {
          padding: 12px 0;
          border-bottom: 1px solid var(--c-line);
        }
        .wt-beat:last-child {
          border-bottom: none;
        }
        .wt-beat-head {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }
        .wt-beat-num {
          font-size: 11px;
          font-weight: 700;
          color: var(--c-accent);
          letter-spacing: 0.1em;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .wt-beat-info {
          flex: 1;
          min-width: 0;
        }
        .wt-beat-name {
          font-size: 15.5px;
          font-weight: 800;
          color: var(--c-fg);
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }
        @media (max-width: 600px) {
          .wt-beat-name { font-size: 14.5px; }
        }
        .wt-beat-time {
          font-size: 11.5px;
          color: var(--c-fg-3);
          letter-spacing: 0.05em;
        }
        .wt-beat-text {
          font-size: 14.5px;
          color: var(--c-fg);
          line-height: 1.55;
          margin: 6px 0 0;
          padding: 10px 12px;
          background: var(--c-bg-2);
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-beat-text { font-size: 13.5px; line-height: 1.55; }
        }
      `}</style>

      <div className="wt">
        <div className="wt-container">
          {/* 키워드 헤더 */}
          <div className="wt-header">
            <div className="wt-kicker">▍ 영상 자료 준비 완료 · v10.7</div>
            <h1 className="wt-keyword">"{keyword}"</h1>
            <p className="wt-subtitle">
              영상 만들기에 필요한 자료가 준비됐습니다. 6단계로 차근차근 살펴보세요.
            </p>
          </div>

          {/* 진행 표시줄 (고정) */}
          <div className="wt-progress">
            <div className="wt-progress-track">
              {STEPS_V10.map((s, i) => (
                <button
                  key={s.key}
                  className={`wt-progress-step ${
                    i < currentStep ? 'done' : i === currentStep ? 'current' : ''
                  }`}
                  onClick={() => goStep(i)}
                  type="button"
                  aria-label={`${s.num}단계: ${s.ko}`}
                >
                  <div className="wt-progress-dot">{s.num}</div>
                  <div className="wt-progress-label">{s.ko}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 본문 */}
          <div className="wt-step">
            <div className="wt-step-head">
              <div className="wt-step-num">STEP {stepDef.num} OF 5 · {stepDef.en}</div>
              <h2 className="wt-step-title">
                {stepDef.ko}
              </h2>
              <p className="wt-step-desc">{stepDef.desc}</p>
            </div>

            {/* STEP 콘텐츠 */}
            {currentStep === 0 && (
              <CasesPanel cases={data.cases} goNext={goNext} />
            )}

            {currentStep === 1 && (
              <TitlePanel
                titles={data.titles}
                selectedIdx={selectedTitleIdx}
                onSelect={setSelectedTitleIdx}
                copy={copy}
                copied={copied}
                goNext={goNext}
              />
            )}

            {currentStep === 2 && (
              <ScriptPanel
                v650Data={v650Data}
                cinematicMode={cinematicMode}
                setCinematicMode={setCinematicMode}
                sequences={data.sequences}
                copy={copy}
                copied={copied}
                goNext={goNext}
                regenerate={regenerate}
                keyword={keyword}
              />
            )}

            {currentStep === 3 && (
              <PromptPanel
                v650Data={v650Data}
                proPromptMode={proPromptMode}
                setProPromptMode={setProPromptMode}
                goNext={goNext}
              />
            )}

            {/* v11.0: STEP 5 (publish) - 영상 제작 추후 공개 */}
            {currentStep === 4 && (
              <ProductionComingSoonPanel />
            )}

            {/* 다시 만들기 버튼 (모든 STEP에 표시) */}
            <div style={{ 
              marginTop: 12, 
              padding: '12px 14px', 
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              textAlign: 'center',
            }}>
              <p style={{ 
                fontSize: 13, 
                color: '#525252', 
                marginBottom: 10,
                lineHeight: 1.6,
              }}>
                같은 키워드로 다른 결과를 보고 싶으시면
              </p>
              <button
                type="button"
                onClick={regenerate}
                className="wt-btn wt-btn-sm"
              >
                ↻ 새로 만들기
              </button>
            </div>

            {/* 광고 (선택적) */}
            {(currentStep === 1 || currentStep === 3) && (
              <div style={{ marginTop: 18 }}>
                <AdSlot slot={`publish-step-${currentStep}`} variant="horizontal" />
              </div>
            )}
          </div>

          {/* 하단 네비게이션 (고정) */}
          <div className="wt-nav">
            <button
              type="button"
              onClick={goPrev}
              className="wt-btn wt-nav-btn"
              disabled={currentStep === 0}
            >
              ← 이전
            </button>
            <div className="wt-nav-counter">
              <strong>{currentStep + 1}</strong> / 5
            </div>
            <button
              type="button"
              onClick={goNext}
              className="wt-btn wt-btn-primary wt-nav-btn"
              disabled={currentStep === STEPS_V10.length - 1}
            >
              다음 →
            </button>
          </div>
        </div>
      </div>
    </V11Shell>
  );
}

// ============================================================
// STEP 1: 비슷한 사례 (ViralCase: pattern, hook, why, example, emoji)
// v10.7: 카드 클릭 시 자동으로 다음 STEP 이동
// ============================================================
function CasesPanel({ cases, goNext }: { cases: any[]; goNext?: () => void }) {
  if (!cases || !Array.isArray(cases) || cases.length === 0) {
    return (
      <div className="wt-card">
        <div className="wt-card-label">사례 데이터 준비중</div>
        <p className="wt-card-body">잠시만 기다려주세요.</p>
      </div>
    );
  }
  return (
    <>
      <div style={{ 
        padding: '8px 12px',
        background: '#fffbeb',
        borderLeft: '3px solid #fbbf24',
        marginBottom: 12,
        fontSize: 12.5,
        color: '#78350f',
        lineHeight: 1.5,
      }}>
        💡 마음에 드는 사례를 클릭하면 다음 단계로 자동 이동합니다
      </div>
      <div className="wt-case-list">
        {cases.map((c: any, i: number) => (
          <div 
            key={i} 
            className="wt-card" 
            style={{ cursor: goNext ? 'pointer' : 'default' }}
            onClick={() => { if (goNext) goNext(); }}
          >
            <div className="wt-card-label">
              {c?.emoji || '📌'} {c?.pattern || `사례 ${i + 1}`}
            </div>
            <h3 className="wt-card-title" style={{ marginTop: 8 }}>
              {c?.hook || ''}
            </h3>
            <div className="wt-card-meta">
              {c?.videoLength && <span>⏱ 영상 길이 {c.videoLength}</span>}
            </div>
            {c?.why && (
              <div style={{ 
                marginTop: 12, 
                padding: 12, 
                background: '#fafafa', 
                borderLeft: '2px solid #c2410c',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', marginBottom: 4, letterSpacing: '0.1em' }}>
                  떡상 이유
                </div>
                <p style={{ fontSize: 14, color: '#0a0a0a', lineHeight: 1.65, margin: 0, wordBreak: 'keep-all' }}>
                  {c.why}
                </p>
              </div>
            )}
            {c?.example && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#525252', lineHeight: 1.6 }}>
                💡 <strong>예시 키워드:</strong> {c.example}
              </div>
            )}
            {c?.keyElement && (
              <div style={{ marginTop: 6, fontSize: 13, color: '#525252', lineHeight: 1.6 }}>
                ✨ <strong>핵심 요소:</strong> {c.keyElement}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ============================================================
// STEP 2: 제목 후보
// v10.7: 제목 카드 클릭 시 선택 + 자동 이동 (복사 버튼은 이벤트 분리)
// ============================================================
function TitlePanel({ 
  titles, 
  selectedIdx, 
  onSelect, 
  copy, 
  copied,
  goNext,
}: any) {
  if (!titles || !Array.isArray(titles) || titles.length === 0) {
    return (
      <div className="wt-card">
        <div className="wt-card-label">제목 후보 준비중</div>
        <p className="wt-card-body">잠시만 기다려주세요.</p>
      </div>
    );
  }
  return (
    <>
      <div style={{ 
        padding: '8px 12px',
        background: '#fffbeb',
        borderLeft: '3px solid #fbbf24',
        marginBottom: 12,
        fontSize: 12.5,
        color: '#78350f',
        lineHeight: 1.5,
      }}>
        💡 마음에 드는 제목을 클릭하면 다음 단계로 자동 이동합니다
      </div>
      {titles.map((t: any, i: number) => {
        const titleText = typeof t === 'string' ? t : (t?.title || '');
        return (
          <div
            key={i}
            className={`wt-title-card ${selectedIdx === i ? 'selected' : ''}`}
            onClick={() => {
              onSelect(i);
              if (goNext) {
                // 카드 시각적 선택 효과 후 자동 이동 (300ms 딜레이)
                setTimeout(() => goNext(), 300);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="wt-title-num">
              제목 후보 {i + 1}{t?.pattern ? ` · ${t.pattern}` : ''}
            </div>
            <div className="wt-title-text">{titleText}</div>
            <div className="wt-title-meta">
              {t?.ctr_estimate && <span className="wt-title-meta-item">📈 예상 CTR {t.ctr_estimate}</span>}
            </div>
            {t?.reasoning && (
              <p style={{ fontSize: 12, color: '#737373', lineHeight: 1.55, margin: '8px 0 0', wordBreak: 'keep-all' }}>
                {t.reasoning}
              </p>
            )}
            <button
              type="button"
              className={`wt-btn wt-btn-sm ${copied === `title-${i}` ? 'copied' : ''}`}
              style={{ marginTop: 12 }}
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 막기 (복사만 실행)
                copy(titleText, `title-${i}`);
              }}
            >
              {copied === `title-${i}` ? '✓ 복사됨' : '📋 복사만'}
            </button>
          </div>
        );
      })}
    </>
  );
}

// ============================================================
// STEP 3: 시나리오
// v10.7: 마지막에 "다음 단계로" 큰 버튼 추가
// ============================================================
function ScriptPanel({ 
  v650Data, 
  cinematicMode, 
  setCinematicMode, 
  sequences,
  copy,
  copied,
  goNext,
  regenerate,  // v11.0: 새로 만들기
  keyword,     // v11.0: 노하우 박스용
}: any) {
  const insights = (v650Data && keyword) ? getAlgorithmInsightsSafe(keyword) : null;
  
  return (
    <>
      {/* v11.0: 작가급 시나리오 항상 ON (토글 제거) */}
      {/* 박 대표님 v11.0 지적: */}
      {/*   "작가급 시나리오 변환키 X, 한 번에 보여주기" */}
      {/*   "마음에 안 들면 새로운 전체 시나리오" */}
      
      <div className="wt-script-head">
        <div className="wt-script-head-label">
          <span className="wt-script-head-num">▍ 작가급 시나리오</span>
          <span className="wt-script-head-tip">알고리즘 후킹 6단계 비트 구조</span>
        </div>
        <button
          type="button"
          onClick={regenerate}
          className="wt-btn-regen"
          title="다른 시나리오 만들기"
        >
          ↻ 다른 버전
        </button>
      </div>

      {v650Data ? (
        <CinematicScenarioDisplay scenario={v650Data.scenario} />
      ) : (
        <div className="wt-card">
          <div className="wt-card-label">시나리오 준비중</div>
          <p className="wt-card-body">잠시만 기다려주세요.</p>
        </div>
      )}

      {/* v11.0 NEW: 박 대표님 노하우 박스 (알맹이) */}
      {insights && (
        <div className="wt-insights">
          <div className="wt-insights-head">
            <span className="wt-insights-icon">💡</span>
            <span className="wt-insights-title">이 시나리오에 적용된 알고리즘 노하우</span>
          </div>
          
          <div className="wt-insights-grid">
            {/* SEO 제목 8:2 법칙 */}
            <div className="wt-insight">
              <div className="wt-insight-label">📌 제목 8:2 법칙</div>
              <p className="wt-insight-body">
                제목 앞 80%에 검색 키워드, 뒤 20%에 호기심 유발 문구.
              </p>
              {insights.seoTitle?.examples?.[0] && (
                <div className="wt-insight-example">
                  ✗ {insights.seoTitle.examples[0].bad}<br />
                  ✓ <strong>{insights.seoTitle.examples[0].good}</strong>
                </div>
              )}
            </div>
            
            {/* 음성 SEO */}
            <div className="wt-insight">
              <div className="wt-insight-label">🎤 음성 SEO</div>
              <p className="wt-insight-body">
                영상 시작 30초 안에 "{keyword}" 키워드를 직접 발음하세요.
                유튜브가 음성을 텍스트로 변환해 검색 데이터로 사용합니다.
              </p>
            </div>

            {/* 첫 30초 후크 */}
            <div className="wt-insight">
              <div className="wt-insight-label">🎯 첫 30초 후크 (검증된 패턴)</div>
              <ul className="wt-insight-list">
                {insights.hooks?.slice(0, 3).map((h: string, i: number) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {/* 댓글 유도 */}
            <div className="wt-insight">
              <div className="wt-insight-label">💬 댓글 유도 질문 (참여 ↑)</div>
              <ul className="wt-insight-list">
                {insights.questions?.slice(0, 2).map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            {/* 챕터 규칙 */}
            <div className="wt-insight">
              <div className="wt-insight-label">⏱ 챕터 = 시청 시간 2배</div>
              <p className="wt-insight-body">
                첫 챕터 <strong>00:00에서 시작</strong> (필수). 5~7개 챕터,
                챕터명에 "{keyword}" 자연스럽게 포함.
              </p>
            </div>

            {/* 해시태그 */}
            <div className="wt-insight">
              <div className="wt-insight-label">🏷 해시태그 (3~5개만!)</div>
              <p className="wt-insight-body">
                딱 3~5개. <strong>15개 초과 시 모두 무효</strong>.<br />
                추천: #{keyword.replace(/\s/g, '')} + 연관 2~3개
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 다음 단계로 큰 버튼 */}
      {goNext && (
        <button
          type="button"
          onClick={goNext}
          style={{
            marginTop: 18,
            width: '100%',
            padding: '14px 18px',
            background: '#0a0a0a',
            color: '#ffffff',
            border: 'none',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
          }}
        >
          시나리오 확인 완료 · 다음 단계로 →
        </button>
      )}
    </>
  );
}

// ============================================================
// STEP 4: 영상 제작 프롬프트
// v10.7: "다음 단계로" 큰 버튼 추가
// ============================================================
function PromptPanel({ 
  v650Data, 
  proPromptMode, 
  setProPromptMode,
  goNext,
}: any) {
  return (
    <>
      <div
        className={`wt-toggle ${proPromptMode ? 'on' : ''}`}
        onClick={() => setProPromptMode((m: boolean) => !m)}
      >
        <div className="wt-toggle-switch">
          <div className="wt-toggle-knob" />
        </div>
        <div className="wt-toggle-text">
          <div className="wt-toggle-name">
            전문가급 프롬프트 모드 {proPromptMode ? '(켜짐)' : '(꺼짐)'}
          </div>
          <div className="wt-toggle-desc">
            {proPromptMode 
              ? 'Midjourney v7 + Sora 2 + VEO 3 카메라/조명/색감까지' 
              : '클릭하면 카메라·렌즈·조명·색감 전문가급으로 전환됩니다'}
          </div>
        </div>
      </div>

      {proPromptMode && v650Data && (
        <CinematicPromptDisplay prompts={v650Data.prompts} />
      )}

      {!proPromptMode && (
        <div className="wt-card">
          <div className="wt-card-label">기본 프롬프트</div>
          <p className="wt-card-body">
            전문가급 프롬프트 모드를 켜시면 Midjourney · Sora 2 · VEO 3 ·
            Flow · NotebookLM 5종의 AI 도구별 상세 프롬프트를 보실 수 있습니다.
          </p>
        </div>
      )}
      
      {/* 다음 단계로 큰 버튼 */}
      {goNext && (
        <button
          type="button"
          onClick={goNext}
          style={{
            marginTop: 18,
            width: '100%',
            padding: '14px 18px',
            background: '#0a0a0a',
            color: '#ffffff',
            border: 'none',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
          }}
        >
          프롬프트 확인 완료 · 다음 단계로 →
        </button>
      )}
    </>
  );
}

// ============================================================
// v11.0 NEW: STEP 5 - 영상 제작 (추후 공개)
// 박 대표님 v11.0 의도:
//   "이 사이트의 본질은 영상 프롬프트로 영상 제작하러 가는 것"
//   "영상 제작은 추후 공개 + 개발 중 홍보"
// ============================================================
function ProductionComingSoonPanel() {
  return (
    <>
      <div className="prod-card">
        <div className="prod-kicker">
          <span className="prod-kicker-arrow">▍</span>
          영상 제작 · 개발 중
        </div>
        
        <h2 className="prod-title">
          영상 프롬프트로<br />
          <span className="prod-title-accent">실제 영상까지</span> 만들기
        </h2>
        
        <p className="prod-sub">
          AlgoMaker가 만들어드린 프롬프트를 바로 영상으로 변환하는 기능을 개발 중입니다.
          Sora, VEO, Midjourney 등 최신 AI 도구를 한 번에 연동하여
          버튼 한 번 클릭만으로 실제 영상을 만들 수 있습니다.
        </p>

        {/* 개발 중 프로그레스 바 */}
        <div className="prod-progress-section">
          <div className="prod-progress-row">
            <span className="prod-progress-label">개발 진행률</span>
            <span className="prod-progress-pct">68%</span>
          </div>
          <div className="prod-progress-bar">
            <div className="prod-progress-fill" />
          </div>
          <div className="prod-progress-eta">
            🚀 2026년 6월 중순 베타 오픈 예정
          </div>
        </div>

        {/* 기능 소개 */}
        <div className="prod-features">
          <div className="prod-features-title">곧 출시될 기능</div>
          <div className="prod-feature-list">
            <div className="prod-feature">
              <div className="prod-feature-icon">🎬</div>
              <div>
                <div className="prod-feature-name">원클릭 영상 생성</div>
                <div className="prod-feature-desc">프롬프트 → 실제 영상 자동 변환</div>
              </div>
            </div>
            <div className="prod-feature">
              <div className="prod-feature-icon">🤖</div>
              <div>
                <div className="prod-feature-name">5개 AI 엔진 동시 연동</div>
                <div className="prod-feature-desc">Sora, VEO, Midjourney, Flow, NotebookLM</div>
              </div>
            </div>
            <div className="prod-feature">
              <div className="prod-feature-icon">⚡</div>
              <div>
                <div className="prod-feature-name">5분 내 영상 완성</div>
                <div className="prod-feature-desc">키워드 입력부터 완성된 영상까지</div>
              </div>
            </div>
            <div className="prod-feature">
              <div className="prod-feature-icon">💰</div>
              <div>
                <div className="prod-feature-name">베타 기간 무료</div>
                <div className="prod-feature-desc">초기 사용자에게 한정 무료 제공</div>
              </div>
            </div>
          </div>
        </div>

        {/* 알림 신청 */}
        <div className="prod-notify">
          <div className="prod-notify-title">📬 출시 알림 받기</div>
          <p className="prod-notify-desc">
            영상 제작 기능이 오픈되면 가장 먼저 알려드립니다.
            아래 이메일로 문의·신청 주세요.
          </p>
          <a 
            href="mailto:apark12321@gmail.com?subject=AlgoMaker 영상 제작 베타 알림 신청&body=베타 오픈 시 알림 부탁드립니다."
            className="prod-notify-btn"
          >
            ✉️ 알림 신청하기
          </a>
        </div>

        {/* 안내 메시지 */}
        <div className="prod-info">
          <div className="prod-info-icon">💡</div>
          <div>
            <strong>지금 만들어드린 프롬프트로 직접 영상 만드시려면:</strong><br />
            현재는 STEP 4 영상 프롬프트를 복사하여 Sora, VEO, Midjourney 등의
            공식 사이트에서 직접 사용하실 수 있습니다.
          </div>
        </div>
      </div>

      <style jsx>{`
        .prod-card {
          padding: 28px 24px;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          border: 1px solid #e5e5e5;
          border-radius: 0;
        }
        @media (max-width: 600px) {
          .prod-card { padding: 22px 18px; }
        }

        .prod-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          background: rgba(194, 65, 12, 0.08);
          color: #c2410c;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          text-transform: uppercase;
        }
        .prod-kicker-arrow {
          color: #c2410c;
          font-weight: 800;
        }

        .prod-title {
          font-size: 28px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.25;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .prod-title { font-size: 22px; }
        }
        .prod-title-accent {
          background: linear-gradient(135deg, #c2410c, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .prod-sub {
          font-size: 15px;
          color: #525252;
          line-height: 1.65;
          margin: 0 0 24px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .prod-sub { font-size: 14px; margin-bottom: 20px; }
        }

        /* 프로그레스 바 */
        .prod-progress-section {
          padding: 18px 18px;
          background: #0a0a0a;
          color: #ffffff;
          margin-bottom: 24px;
          border-radius: 8px;
        }
        @media (max-width: 600px) {
          .prod-progress-section { padding: 14px 14px; margin-bottom: 20px; }
        }

        .prod-progress-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        .prod-progress-label {
          font-size: 12px;
          font-family: 'SF Mono', monospace;
          letter-spacing: 0.08em;
          color: #a3a3a3;
          text-transform: uppercase;
        }
        .prod-progress-pct {
          font-size: 28px;
          font-weight: 800;
          color: #fbbf24;
          font-family: 'SF Mono', monospace;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) {
          .prod-progress-pct { font-size: 24px; }
        }

        .prod-progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 10px;
          overflow: hidden;
          position: relative;
        }
        .prod-progress-fill {
          height: 100%;
          width: 68%;
          background: linear-gradient(90deg, #c2410c, #fbbf24);
          animation: progressShine 2s ease-in-out infinite;
          position: relative;
        }
        .prod-progress-fill::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: progressBarShine 2s ease-in-out infinite;
        }
        @keyframes progressBarShine {
          0%, 100% { left: -100%; }
          50% { left: 100%; }
        }
        @keyframes progressShine {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .prod-progress-eta {
          font-size: 13px;
          color: #fbbf24;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        /* 기능 소개 */
        .prod-features {
          margin-bottom: 24px;
        }
        .prod-features-title {
          font-size: 11.5px;
          font-weight: 800;
          color: #737373;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-family: 'SF Mono', monospace;
        }
        .prod-feature-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .prod-feature-list { grid-template-columns: 1fr; gap: 8px; }
        }

        .prod-feature {
          display: flex;
          gap: 12px;
          padding: 12px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          align-items: flex-start;
        }
        .prod-feature-icon {
          font-size: 22px;
          line-height: 1;
          flex-shrink: 0;
        }
        .prod-feature-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          margin-bottom: 2px;
          word-break: keep-all;
        }
        .prod-feature-desc {
          font-size: 11.5px;
          color: #737373;
          line-height: 1.4;
          word-break: keep-all;
        }

        /* 알림 신청 */
        .prod-notify {
          padding: 18px 18px;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3e7 100%);
          border: 1px solid rgba(194, 65, 12, 0.15);
          margin-bottom: 18px;
          text-align: center;
        }
        .prod-notify-title {
          font-size: 15px;
          font-weight: 800;
          color: #c2410c;
          margin-bottom: 6px;
          letter-spacing: -0.018em;
        }
        .prod-notify-desc {
          font-size: 13px;
          color: #78350f;
          line-height: 1.55;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        .prod-notify-btn {
          display: inline-block;
          padding: 11px 22px;
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.015em;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(194, 65, 12, 0.2);
        }
        .prod-notify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(194, 65, 12, 0.3);
        }

        /* 안내 메시지 */
        .prod-info {
          display: flex;
          gap: 10px;
          padding: 14px 14px;
          background: #f0f9ff;
          border-left: 3px solid #0284c7;
          font-size: 13px;
          line-height: 1.6;
          color: #0c4a6e;
          word-break: keep-all;
        }
        .prod-info-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
        .prod-info strong {
          color: #075985;
          display: block;
          margin-bottom: 4px;
        }
      `}</style>
    </>
  );
}

// ============================================================
// STEP 5: 메타데이터 (v11.0: 사용 X, 박 대표님 자산 보존용 유지)
// ============================================================
function MetaPanel({ 
  description, 
  tags, 
  thumbnails, 
  copy, 
  copied,
  goNext,
}: any) {
  return (
    <>
      {/* DESCRIPTION */}
      <div className="wt-meta-section">
        <div className="wt-meta-head">
          <div className="wt-meta-label-block">
            <div className="wt-meta-label">설명문</div>
            <div className="wt-meta-name">영상 설명</div>
          </div>
          <button
            type="button"
            className={`wt-btn wt-btn-sm ${copied === 'desc' ? 'copied' : ''}`}
            onClick={() => copy(description, 'desc')}
          >
            {copied === 'desc' ? '✓ 복사됨' : '📋 복사'}
          </button>
        </div>
        <div className="wt-meta-desc-text">{description}</div>
      </div>

      {/* TAGS */}
      <div className="wt-meta-section">
        <div className="wt-meta-head">
          <div className="wt-meta-label-block">
            <div className="wt-meta-label">태그</div>
            <div className="wt-meta-name">YouTube 태그</div>
          </div>
          <button
            type="button"
            className={`wt-btn wt-btn-sm ${copied === 'tags' ? 'copied' : ''}`}
            onClick={() => copy(
              (tags || []).map((t: any) => typeof t === 'string' ? t : (t?.tag || '')).filter(Boolean).join(', '), 
              'tags'
            )}
          >
            {copied === 'tags' ? '✓ 복사됨' : '📋 모두 복사'}
          </button>
        </div>
        <div className="wt-tag-flow">
          {(tags && Array.isArray(tags) ? tags : []).map((t: any, i: number) => {
            const tagText = typeof t === 'string' ? t : (t?.tag || '');
            return tagText ? <span key={i} className="wt-tag-chip">{tagText}</span> : null;
          })}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="wt-meta-section">
        <div className="wt-meta-head">
          <div className="wt-meta-label-block">
            <div className="wt-meta-label">썸네일</div>
            <div className="wt-meta-name">3가지 컨셉</div>
          </div>
        </div>
        <div className="wt-thumb-list">
          {(thumbnails && Array.isArray(thumbnails) ? thumbnails : []).map((t: any, i: number) => (
            <div key={i} className="wt-thumb-card">
              <div className="wt-thumb-card-head">
                <div className="wt-thumb-card-idx">{String.fromCharCode(65 + i)}</div>
                <div className="wt-thumb-card-name">{t?.type || `컨셉 ${i + 1}`}</div>
                <div className="wt-thumb-card-rating">{t?.ctr_estimate || ''}</div>
              </div>
              <div className="wt-thumb-card-grid">
                <div className="wt-thumb-card-key">배경</div>
                <div>{t?.background || '-'}</div>
                <div className="wt-thumb-card-key">메인</div>
                <div>{t?.mainText || '-'}</div>
                {t?.subText && (
                  <>
                    <div className="wt-thumb-card-key">서브</div>
                    <div>{t.subText}</div>
                  </>
                )}
                <div className="wt-thumb-card-key">표정</div>
                <div>{t?.expression || '-'}</div>
                <div className="wt-thumb-card-key">색상</div>
                <div>{t?.colors || '-'}</div>
              </div>
              <div className="wt-thumb-card-actions">
                {t?.imagePromptKr && (
                  <button
                    type="button"
                    className={`wt-btn wt-btn-sm ${copied === `thumb-${i}` ? 'copied' : ''}`}
                    onClick={() => copy(t.imagePromptKr, `thumb-${i}`)}
                  >
                    {copied === `thumb-${i}` ? '✓ 복사됨' : '📋 한글 프롬프트'}
                  </button>
                )}
                {t?.imagePromptEn && (
                  <Link
                    href={`/imagegen?prompt=${encodeURIComponent(t.imagePromptEn)}&ar=16:9`}
                    className="wt-btn wt-btn-sm wt-btn-primary"
                  >
                    🎨 이미지 만들기
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 다음 단계로 큰 버튼 */}
      {goNext && (
        <button
          type="button"
          onClick={goNext}
          style={{
            marginTop: 18,
            width: '100%',
            padding: '14px 18px',
            background: '#c2410c',
            color: '#ffffff',
            border: 'none',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
          }}
        >
          메타데이터 확인 완료 · SNS 업로드 자료 보기 →
        </button>
      )}
    </>
  );
}

// ============================================================
// STEP 6: SNS 업로드 (v10.5 - 자체 구현, Tailwind 미사용)
// 박 대표님 SNSUploadPanel은 보존, 여기서 v650Data.sns 데이터 직접 사용
// ============================================================
function SnsPanel({ 
  v650Data, 
  proSnsMode, 
  setProSnsMode,
  shortsScript,
}: any) {
  const [activeTab, setActiveTab] = useState<'youtube' | 'shorts' | 'instagram' | 'tiktok'>('youtube');
  const [snsCopied, setSnsCopied] = useState<string | null>(null);
  
  const snsCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setSnsCopied(key);
        setTimeout(() => setSnsCopied(null), 1800);
      });
    }
  };

  return (
    <>
      <div
        className={`wt-toggle ${proSnsMode ? 'on' : ''}`}
        onClick={() => setProSnsMode((m: boolean) => !m)}
      >
        <div className="wt-toggle-switch">
          <div className="wt-toggle-knob" />
        </div>
        <div className="wt-toggle-text">
          <div className="wt-toggle-name">
            SNS 실제 화면 모드 {proSnsMode ? '(켜짐)' : '(꺼짐)'}
          </div>
          <div className="wt-toggle-desc">
            {proSnsMode 
              ? 'YouTube · Shorts · Instagram · TikTok 실제 업로드 화면' 
              : '클릭하면 4개 플랫폼 실제 업로드 화면으로 전환됩니다'}
          </div>
        </div>
      </div>

      {proSnsMode && v650Data?.sns ? (
        <div className="sns-container">
          <style jsx global>{`
            .sns-container {
              border: 1px solid #e5e5e5;
              background: #ffffff;
              overflow: hidden;
            }
            .sns-tabs {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              border-bottom: 1px solid #e5e5e5;
              background: #fafafa;
            }
            .sns-tab {
              padding: 14px 8px;
              background: transparent;
              border: none;
              border-bottom: 3px solid transparent;
              cursor: pointer;
              font-family: inherit;
              transition: all 0.15s;
              text-align: center;
              min-height: 64px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 2px;
            }
            .sns-tab:hover {
              background: #f5f5f5;
            }
            .sns-tab.active {
              background: #ffffff;
              border-bottom-color: #c2410c;
            }
            .sns-tab-icon { font-size: 20px; line-height: 1; }
            .sns-tab-label {
              font-size: 12px;
              font-weight: 700;
              color: #404040;
              letter-spacing: -0.01em;
            }
            .sns-tab.active .sns-tab-label { color: #0a0a0a; }
            .sns-tab-sub {
              font-size: 10px;
              color: #737373;
              font-weight: 500;
            }
            @media (max-width: 600px) {
              .sns-tab { padding: 10px 4px; min-height: 58px; }
              .sns-tab-icon { font-size: 18px; }
              .sns-tab-label { font-size: 11px; }
              .sns-tab-sub { font-size: 9px; }
            }
            
            .sns-body {
              padding: 16px 18px;
            }
            @media (max-width: 600px) {
              .sns-body { padding: 12px 14px; }
            }
            
            .sns-platform-head {
              display: flex;
              align-items: center;
              gap: 12px;
              padding-bottom: 10px;
              margin-bottom: 14px;
              border-bottom: 1px solid #e5e5e5;
            }
            .sns-platform-icon {
              width: 38px;
              height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              color: #ffffff;
              font-size: 18px;
              font-weight: 800;
              flex-shrink: 0;
            }
            .sns-platform-icon.yt { background: #ff0000; }
            .sns-platform-icon.shorts { background: linear-gradient(135deg, #ff4458, #c2185b); }
            .sns-platform-icon.ig { background: linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7); }
            .sns-platform-icon.tt { background: #000000; }
            
            /* 플랫폼별 고유 아이덴티티 (v10.7) */
            .sns-platform-banner {
              padding: 14px 18px;
              margin: -22px -20px 18px -20px;
              display: flex;
              align-items: center;
              gap: 12px;
              color: #ffffff;
              font-size: 14px;
              font-weight: 700;
              letter-spacing: -0.01em;
            }
            @media (max-width: 600px) {
              .sns-platform-banner { 
                padding: 12px 14px;
                margin: -16px -18px 14px -18px;
                font-size: 13px;
              }
            }
            .sns-platform-banner.yt {
              background: linear-gradient(180deg, #ff0000 0%, #cc0000 100%);
            }
            .sns-platform-banner.shorts {
              background: linear-gradient(135deg, #ff4458 0%, #ec407a 50%, #c2185b 100%);
            }
            .sns-platform-banner.ig {
              background: linear-gradient(45deg, #f9ce34, #ee2a7b 50%, #6228d7);
            }
            .sns-platform-banner.tt {
              background: #000000;
              border-bottom: 2px solid #25f4ee;
            }
            .sns-platform-banner-logo {
              width: 28px;
              height: 28px;
              background: rgba(255,255,255,0.2);
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              flex-shrink: 0;
            }
            .sns-platform-banner.tt .sns-platform-banner-logo {
              background: linear-gradient(45deg, #25f4ee, #fe2c55);
            }
            .sns-platform-banner-info { flex: 1; min-width: 0; }
            .sns-platform-banner-title {
              font-size: 14px;
              font-weight: 800;
              line-height: 1.3;
              margin: 0;
            }
            .sns-platform-banner-sub {
              font-size: 11px;
              opacity: 0.85;
              margin-top: 1px;
              font-weight: 500;
            }
            
            /* 9:16 모바일 미리보기 (Shorts/Instagram/TikTok) */
            .sns-mobile-preview {
              max-width: 220px;
              aspect-ratio: 9/16;
              background: #0a0a0a;
              border-radius: 16px;
              margin: 0 auto 16px;
              padding: 10px;
              position: relative;
              overflow: hidden;
            }
            .sns-mobile-screen {
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
              border-radius: 10px;
              padding: 12px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              position: relative;
            }
            .sns-mobile-top {
              position: absolute;
              top: 10px;
              left: 12px;
              right: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
            }
            .sns-mobile-bottom {
              color: #ffffff;
              font-size: 12px;
              line-height: 1.45;
              word-break: keep-all;
            }
            .sns-mobile-bottom-title {
              font-weight: 700;
              margin-bottom: 6px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .sns-mobile-bottom-tags {
              color: #88aaff;
              font-size: 11px;
              line-height: 1.5;
            }
            .sns-mobile-side-icons {
              position: absolute;
              right: 18px;
              bottom: 70px;
              display: flex;
              flex-direction: column;
              gap: 14px;
              color: #ffffff;
              font-size: 18px;
            }
            .sns-mobile-side-icon { text-align: center; }
            .sns-mobile-side-icon-num {
              font-size: 9px;
              font-weight: 700;
              margin-top: 1px;
            }
            .sns-platform-name {
              font-size: 15px;
              font-weight: 800;
              color: #0a0a0a;
              letter-spacing: -0.02em;
              line-height: 1.3;
            }
            .sns-platform-sub {
              font-size: 11.5px;
              color: #737373;
              margin-top: 2px;
            }
            
            .sns-field {
              margin-bottom: 14px;
            }
            .sns-field-label {
              font-size: 12px;
              font-weight: 700;
              color: #0a0a0a;
              margin-bottom: 3px;
              letter-spacing: -0.01em;
            }
            .sns-field-sub {
              font-size: 11.5px;
              color: #737373;
              margin-bottom: 8px;
              line-height: 1.5;
              word-break: keep-all;
            }
            .sns-field-input {
              border: 1px solid #d4d4d4;
              background: #ffffff;
              padding: 10px 12px;
              border-radius: 6px;
              position: relative;
            }
            .sns-field-text {
              font-size: 14px;
              color: #0a0a0a;
              line-height: 1.55;
              word-break: keep-all;
              white-space: pre-wrap;
              margin: 0;
            }
            @media (max-width: 600px) {
              .sns-field-text { font-size: 13.5px; }
            }
            .sns-field-counter {
              font-size: 11px;
              color: #a3a3a3;
              text-align: right;
              margin-top: 4px;
            }
            .sns-field-scroll {
              max-height: 280px;
              overflow-y: auto;
            }
            
            .sns-copy-btn {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              margin-top: 8px;
              padding: 6px 12px;
              background: #f5f5f5;
              border: 1px solid #d4d4d4;
              color: #0a0a0a;
              font-family: inherit;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              border-radius: 4px;
              transition: all 0.15s;
              min-height: 32px;
            }
            .sns-copy-btn:hover {
              background: #e5e5e5;
            }
            .sns-copy-btn.copied {
              background: #16a34a;
              color: #ffffff;
              border-color: #16a34a;
            }
            
            .sns-tag-list {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            .sns-tag-chip {
              padding: 4px 10px;
              background: #f5f5f5;
              color: #404040;
              border-radius: 4px;
              font-size: 12px;
              letter-spacing: -0.01em;
            }
            .sns-tag-chip.ig {
              background: #fdf2f8;
              color: #be185d;
              border-radius: 999px;
            }
            .sns-tag-chip.tt {
              background: #0a0a0a;
              color: #ffffff;
              border-radius: 4px;
              font-weight: 600;
            }
            
            .sns-info-box {
              padding: 10px 12px;
              background: #fffbeb;
              border-left: 3px solid #fbbf24;
              border-radius: 4px;
              font-size: 13px;
              line-height: 1.55;
              color: #78350f;
              word-break: keep-all;
            }
            .sns-info-box.ig {
              background: linear-gradient(135deg, #fdf2f8, #f3e8ff);
              border-left-color: #ec4899;
              color: #831843;
            }
            .sns-info-box.tt {
              background: #0a0a0a;
              color: #ffffff;
              border-left-color: #ec4899;
            }
            
            .sns-chapter-list {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .sns-chapter-row {
              display: grid;
              grid-template-columns: 56px 1fr;
              gap: 10px;
              font-size: 13px;
              line-height: 1.5;
              padding: 4px 0;
            }
            .sns-chapter-time {
              font-weight: 700;
              color: #c2410c;
              letter-spacing: 0;
            }
            .sns-chapter-label {
              color: #0a0a0a;
              word-break: keep-all;
            }
            
            .sns-options {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .sns-option-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 8px 10px;
              border: 1px solid #e5e5e5;
              border-radius: 6px;
              background: #fafafa;
              gap: 12px;
            }
            .sns-option-info { flex: 1; min-width: 0; }
            .sns-option-name {
              font-size: 13px;
              font-weight: 600;
              color: #0a0a0a;
              margin-bottom: 2px;
            }
            .sns-option-desc {
              font-size: 12px;
              color: #737373;
              line-height: 1.5;
              word-break: keep-all;
            }
            .sns-option-state {
              font-size: 18px;
              flex-shrink: 0;
            }
            .sns-option-state.on { color: #16a34a; }
            .sns-option-state.off { color: #a3a3a3; }
            
            .sns-permissions {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              margin-top: 8px;
            }
            .sns-perm {
              padding: 10px;
              border: 1px solid #e5e5e5;
              border-radius: 6px;
              text-align: center;
              background: #fafafa;
            }
            .sns-perm.allow {
              border-color: #86efac;
              background: #f0fdf4;
            }
            .sns-perm-label {
              font-size: 12px;
              font-weight: 700;
              color: #0a0a0a;
              margin-bottom: 2px;
            }
            .sns-perm.allow .sns-perm-label { color: #166534; }
            .sns-perm-state {
              font-size: 11px;
              color: #737373;
              font-weight: 500;
            }
            .sns-perm.allow .sns-perm-state { color: #15803d; }
          `}</style>

          {/* 4개 플랫폼 탭 */}
          <div className="sns-tabs">
            <button
              type="button"
              className={`sns-tab ${activeTab === 'youtube' ? 'active' : ''}`}
              onClick={() => setActiveTab('youtube')}
            >
              <span className="sns-tab-icon">📺</span>
              <span className="sns-tab-label">YouTube</span>
              <span className="sns-tab-sub">긴 영상</span>
            </button>
            <button
              type="button"
              className={`sns-tab ${activeTab === 'shorts' ? 'active' : ''}`}
              onClick={() => setActiveTab('shorts')}
            >
              <span className="sns-tab-icon">🩳</span>
              <span className="sns-tab-label">Shorts</span>
              <span className="sns-tab-sub">60초</span>
            </button>
            <button
              type="button"
              className={`sns-tab ${activeTab === 'instagram' ? 'active' : ''}`}
              onClick={() => setActiveTab('instagram')}
            >
              <span className="sns-tab-icon">📸</span>
              <span className="sns-tab-label">Instagram</span>
              <span className="sns-tab-sub">Reels</span>
            </button>
            <button
              type="button"
              className={`sns-tab ${activeTab === 'tiktok' ? 'active' : ''}`}
              onClick={() => setActiveTab('tiktok')}
            >
              <span className="sns-tab-icon">🎵</span>
              <span className="sns-tab-label">TikTok</span>
              <span className="sns-tab-sub">For You</span>
            </button>
          </div>

          {/* 플랫폼별 본문 */}
          <div className="sns-body">
            {activeTab === 'youtube' && (
              <YoutubeUI data={v650Data.sns.youtube} copy={snsCopy} copied={snsCopied} />
            )}
            {activeTab === 'shorts' && (
              <ShortsUI data={v650Data.sns.shorts} copy={snsCopy} copied={snsCopied} />
            )}
            {activeTab === 'instagram' && (
              <InstagramUI data={v650Data.sns.instagram} copy={snsCopy} copied={snsCopied} />
            )}
            {activeTab === 'tiktok' && (
              <TiktokUI data={v650Data.sns.tiktok} copy={snsCopy} copied={snsCopied} />
            )}
          </div>
        </div>
      ) : (
        <div className="wt-card">
          <div className="wt-card-label">
            쇼츠/릴스용 대본
            {shortsScript?.totalDuration && (
              <span style={{ marginLeft: 8, fontSize: 10, color: '#737373', fontWeight: 500 }}>
                · {shortsScript.totalDuration}
              </span>
            )}
          </div>
          <p className="wt-card-body" style={{ whiteSpace: 'pre-line' }}>
            {shortsScript?.fullScript || shortsScript?.body || ''}
          </p>
        </div>
      )}
    </>
  );
}

// ============================================================
// YouTube UI
// ============================================================
function YoutubeUI({ data, copy, copied }: any) {
  if (!data) return <div style={{padding:20, color:'#737373'}}>데이터 준비중</div>;
  return (
    <div>
      <div className="sns-platform-banner yt">
        <div className="sns-platform-banner-logo">▶</div>
        <div className="sns-platform-banner-info">
          <div className="sns-platform-banner-title">YouTube Studio</div>
          <div className="sns-platform-banner-sub">동영상 세부정보 · 실제 업로드 페이지 형식</div>
        </div>
      </div>

      <div className="sns-field">
        <div className="sns-field-label">제목 (필수)</div>
        <div className="sns-field-sub">시청자에게 동영상 콘텐츠를 알릴 수 있는 제목</div>
        <div className="sns-field-input">
          <p className="sns-field-text">{data.title || ''}</p>
          <div className="sns-field-counter">{data.titleCharCount || 0}/100</div>
        </div>
        <button
          type="button"
          className={`sns-copy-btn ${copied === 'yt-title' ? 'copied' : ''}`}
          onClick={() => copy(data.title || '', 'yt-title')}
        >
          {copied === 'yt-title' ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>

      <div className="sns-field">
        <div className="sns-field-label">설명</div>
        <div className="sns-field-sub">시청자에게 동영상에 대해 설명해 주세요</div>
        <div className="sns-field-input sns-field-scroll">
          <p className="sns-field-text">{data.description || ''}</p>
          <div className="sns-field-counter">{data.descriptionCharCount || 0}/5000</div>
        </div>
        <button
          type="button"
          className={`sns-copy-btn ${copied === 'yt-desc' ? 'copied' : ''}`}
          onClick={() => copy(data.description || '', 'yt-desc')}
        >
          {copied === 'yt-desc' ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>

      {data.thumbnailGuide && (
        <div className="sns-field">
          <div className="sns-field-label">썸네일</div>
          <div className="sns-info-box">💡 {data.thumbnailGuide}</div>
        </div>
      )}

      {data.tags && data.tags.length > 0 && (
        <div className="sns-field">
          <div className="sns-field-label">태그 ({data.tags.length}개)</div>
          <div className="sns-field-sub">잘못 쓰이는 단어가 있을 경우 태그가 유용합니다</div>
          <div className="sns-field-input">
            <div className="sns-tag-list">
              {data.tags.map((tag: string, i: number) => (
                <span key={i} className="sns-tag-chip">{tag}</span>
              ))}
            </div>
            <div className="sns-field-counter">{data.tagsCharCount || 0}/500</div>
          </div>
          <button
            type="button"
            className={`sns-copy-btn ${copied === 'yt-tags' ? 'copied' : ''}`}
            onClick={() => copy((data.tags || []).join(', '), 'yt-tags')}
          >
            {copied === 'yt-tags' ? '✓ 복사됨' : '📋 복사'}
          </button>
        </div>
      )}

      {data.category && (
        <div className="sns-field">
          <div className="sns-field-label">카테고리</div>
          <div className="sns-field-input">
            <p className="sns-field-text">{data.category}</p>
          </div>
        </div>
      )}

      {data.chapters && data.chapters.length > 0 && (
        <div className="sns-field">
          <div className="sns-field-label">챕터 (자동 생성)</div>
          <div className="sns-field-sub">시청자가 원하는 부분으로 바로 이동 가능</div>
          <div className="sns-field-input">
            <div className="sns-chapter-list">
              {data.chapters.map((ch: any, i: number) => (
                <div key={i} className="sns-chapter-row">
                  <span className="sns-chapter-time">{ch.time}</span>
                  <span className="sns-chapter-label">{ch.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(data.endScreenSuggestion || data.cardSuggestion) && (
        <div className="sns-field">
          <div className="sns-field-label">최종화면 + 카드 추천</div>
          <div className="sns-field-sub">알고리즘 우호적인 배치</div>
          <div className="sns-info-box">
            {data.endScreenSuggestion && (
              <div style={{ marginBottom: 6 }}>
                <strong>📍 최종화면:</strong> {data.endScreenSuggestion}
              </div>
            )}
            {data.cardSuggestion && (
              <div>
                <strong>📍 카드:</strong> {data.cardSuggestion}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Shorts UI
// ============================================================
function ShortsUI({ data, copy, copied }: any) {
  if (!data) return <div style={{padding:20, color:'#737373'}}>데이터 준비중</div>;
  return (
    <div>
      <div className="sns-platform-banner shorts">
        <div className="sns-platform-banner-logo">🩳</div>
        <div className="sns-platform-banner-info">
          <div className="sns-platform-banner-title">YouTube Shorts</div>
          <div className="sns-platform-banner-sub">60초 이하 세로 영상 · 9:16</div>
        </div>
      </div>

      {/* 모바일 미리보기 */}
      <div className="sns-mobile-preview">
        <div className="sns-mobile-screen">
          <div className="sns-mobile-top">
            <span>Shorts</span>
            <span>⋯</span>
          </div>
          <div className="sns-mobile-side-icons">
            <div className="sns-mobile-side-icon">❤️<div className="sns-mobile-side-icon-num">좋아요</div></div>
            <div className="sns-mobile-side-icon">💬<div className="sns-mobile-side-icon-num">댓글</div></div>
            <div className="sns-mobile-side-icon">↗<div className="sns-mobile-side-icon-num">공유</div></div>
            <div className="sns-mobile-side-icon">🎵<div className="sns-mobile-side-icon-num">사운드</div></div>
          </div>
          <div className="sns-mobile-bottom">
            <div className="sns-mobile-bottom-title">{data.title || ''}</div>
            {data.hashtags && data.hashtags.length > 0 && (
              <div className="sns-mobile-bottom-tags">
                {data.hashtags.slice(0, 4).join(' ')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sns-field">
        <div className="sns-field-label">제목 (#Shorts 필수)</div>
        <div className="sns-field-input">
          <p className="sns-field-text">{data.title || ''}</p>
          <div className="sns-field-counter">{data.titleCharCount || 0}/100</div>
        </div>
        <button
          type="button"
          className={`sns-copy-btn ${copied === 'sh-title' ? 'copied' : ''}`}
          onClick={() => copy(data.title || '', 'sh-title')}
        >
          {copied === 'sh-title' ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>

      <div className="sns-field">
        <div className="sns-field-label">설명</div>
        <div className="sns-field-input sns-field-scroll">
          <p className="sns-field-text">{data.description || ''}</p>
        </div>
        <button
          type="button"
          className={`sns-copy-btn ${copied === 'sh-desc' ? 'copied' : ''}`}
          onClick={() => copy(data.description || '', 'sh-desc')}
        >
          {copied === 'sh-desc' ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>

      {data.hashtags && data.hashtags.length > 0 && (
        <div className="sns-field">
          <div className="sns-field-label">해시태그 ({data.hashtags.length}개)</div>
          <div className="sns-field-sub">트렌드 + 니치 조합</div>
          <div className="sns-field-input">
            <div className="sns-tag-list">
              {data.hashtags.map((tag: string, i: number) => (
                <span key={i} className="sns-tag-chip">{tag}</span>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={`sns-copy-btn ${copied === 'sh-tags' ? 'copied' : ''}`}
            onClick={() => copy((data.hashtags || []).join(' '), 'sh-tags')}
          >
            {copied === 'sh-tags' ? '✓ 복사됨' : '📋 복사'}
          </button>
        </div>
      )}

      <div className="sns-field">
        <div className="sns-field-label">추가 설정</div>
        <div className="sns-options">
          {data.thumbnailFrame && (
            <div className="sns-option-row">
              <div className="sns-option-info">
                <div className="sns-option-name">썸네일</div>
                <div className="sns-option-desc">{data.thumbnailFrame}</div>
              </div>
            </div>
          )}
          <div className="sns-option-row">
            <div className="sns-option-info">
              <div className="sns-option-name">리믹스 허용</div>
              <div className="sns-option-desc">허용 시 도달 범위 ↑</div>
            </div>
            <span className={`sns-option-state ${data.remixAllow ? 'on' : 'off'}`}>
              {data.remixAllow ? '✓' : '○'}
            </span>
          </div>
          {data.soundCredit && (
            <div className="sns-option-row">
              <div className="sns-option-info">
                <div className="sns-option-name">사운드</div>
                <div className="sns-option-desc">{data.soundCredit}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Instagram UI
// ============================================================
function InstagramUI({ data, copy, copied }: any) {
  if (!data) return <div style={{padding:20, color:'#737373'}}>데이터 준비중</div>;
  return (
    <div>
      <div className="sns-platform-banner ig">
        <div className="sns-platform-banner-logo">📸</div>
        <div className="sns-platform-banner-info">
          <div className="sns-platform-banner-title">Instagram - 새 릴스</div>
          <div className="sns-platform-banner-sub">9:16 세로 영상</div>
        </div>
      </div>

      <div className="sns-field">
        <div className="sns-field-label">문구 작성</div>
        <div className="sns-field-sub">첫 125자가 미리보기에 표시됩니다</div>
        <div className="sns-field-input sns-field-scroll">
          <p className="sns-field-text">{data.caption || ''}</p>
          <div className="sns-field-counter">{data.captionCharCount || 0}/2200</div>
        </div>
        <button
          type="button"
          className={`sns-copy-btn ${copied === 'ig-cap' ? 'copied' : ''}`}
          onClick={() => copy(data.caption || '', 'ig-cap')}
        >
          {copied === 'ig-cap' ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>

      {data.hashtags && data.hashtags.length > 0 && (
        <div className="sns-field">
          <div className="sns-field-label">해시태그 ({data.hashtagsCount || data.hashtags.length}/30)</div>
          <div className="sns-field-sub">첫 댓글에 추가하면 캡션이 깔끔합니다</div>
          <div className="sns-field-input">
            <div className="sns-tag-list">
              {data.hashtags.map((tag: string, i: number) => (
                <span key={i} className="sns-tag-chip ig">{tag}</span>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={`sns-copy-btn ${copied === 'ig-tags' ? 'copied' : ''}`}
            onClick={() => copy((data.hashtags || []).join(' '), 'ig-tags')}
          >
            {copied === 'ig-tags' ? '✓ 복사됨' : '📋 복사'}
          </button>
        </div>
      )}

      {data.coverFrame && (
        <div className="sns-field">
          <div className="sns-field-label">커버 선택</div>
          <div className="sns-field-sub">피드 그리드에 보여질 이미지</div>
          <div className="sns-info-box ig">🎨 {data.coverFrame}</div>
        </div>
      )}

      {data.audioName && (
        <div className="sns-field">
          <div className="sns-field-label">오디오</div>
          <div className="sns-field-sub">트렌드 음원 사용 시 알고리즘 우호적</div>
          <div className="sns-info-box">🎵 {data.audioName}</div>
        </div>
      )}

      <div className="sns-field">
        <div className="sns-field-label">추가 옵션</div>
        <div className="sns-options">
          {data.location && (
            <div className="sns-option-row">
              <div className="sns-option-info">
                <div className="sns-option-name">위치 추가</div>
                <div className="sns-option-desc">{data.location}</div>
              </div>
              <span className="sns-option-state on">✓</span>
            </div>
          )}
          <div className="sns-option-row">
            <div className="sns-option-info">
              <div className="sns-option-name">피드에도 공유</div>
              <div className="sns-option-desc">메인 피드 노출 → 도달 범위 확장</div>
            </div>
            <span className={`sns-option-state ${data.shareToFeed ? 'on' : 'off'}`}>
              {data.shareToFeed ? '✓' : '○'}
            </span>
          </div>
          <div className="sns-option-row">
            <div className="sns-option-info">
              <div className="sns-option-name">스토리에도 공유</div>
              <div className="sns-option-desc">초기 24시간 노출 ↑</div>
            </div>
            <span className={`sns-option-state ${data.shareToStory ? 'on' : 'off'}`}>
              {data.shareToStory ? '✓' : '○'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TikTok UI
// ============================================================
function TiktokUI({ data, copy, copied }: any) {
  if (!data) return <div style={{padding:20, color:'#737373'}}>데이터 준비중</div>;
  return (
    <div>
      <div className="sns-platform-banner tt">
        <div className="sns-platform-banner-logo">🎵</div>
        <div className="sns-platform-banner-info">
          <div className="sns-platform-banner-title">TikTok - 동영상 게시</div>
          <div className="sns-platform-banner-sub">9:16 세로 · For You 페이지 최적화</div>
        </div>
      </div>

      <div className="sns-field">
        <div className="sns-field-label">설명</div>
        <div className="sns-field-sub">2200자 이내. 첫 줄이 가장 중요합니다</div>
        <div className="sns-field-input sns-field-scroll">
          <p className="sns-field-text">{data.caption || ''}</p>
          <div className="sns-field-counter">{data.captionCharCount || 0}/2200</div>
        </div>
        <button
          type="button"
          className={`sns-copy-btn ${copied === 'tt-cap' ? 'copied' : ''}`}
          onClick={() => copy(data.caption || '', 'tt-cap')}
        >
          {copied === 'tt-cap' ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>

      {data.hashtags && data.hashtags.length > 0 && (
        <div className="sns-field">
          <div className="sns-field-label">해시태그 ({data.hashtagsCount || data.hashtags.length}개)</div>
          <div className="sns-field-sub">#fyp 와 니치 태그 조합이 핵심</div>
          <div className="sns-field-input">
            <div className="sns-tag-list">
              {data.hashtags.map((tag: string, i: number) => (
                <span key={i} className="sns-tag-chip tt">{tag}</span>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={`sns-copy-btn ${copied === 'tt-tags' ? 'copied' : ''}`}
            onClick={() => copy((data.hashtags || []).join(' '), 'tt-tags')}
          >
            {copied === 'tt-tags' ? '✓ 복사됨' : '📋 복사'}
          </button>
        </div>
      )}

      {data.soundChoice && (
        <div className="sns-field">
          <div className="sns-field-label">사운드 추가</div>
          <div className="sns-field-sub">For You 페이지 노출의 핵심 요소</div>
          <div className="sns-info-box tt">🎵 {data.soundChoice}</div>
        </div>
      )}

      {data.coverImage && (
        <div className="sns-field">
          <div className="sns-field-label">커버 선택</div>
          <div className="sns-info-box">🖼 {data.coverImage}</div>
        </div>
      )}

      {data.whoCanWatch && (
        <div className="sns-field">
          <div className="sns-field-label">누가 볼 수 있나요</div>
          <div className="sns-options">
            <div className="sns-option-row">
              <div className="sns-option-info">
                <div className="sns-option-name">{data.whoCanWatch}</div>
                <div className="sns-option-desc">For You 페이지 진입 가능</div>
              </div>
              <span className="sns-option-state on">✓</span>
            </div>
          </div>
          <div className="sns-permissions">
            <div className={`sns-perm ${data.allowComments ? 'allow' : ''}`}>
              <div className="sns-perm-label">댓글</div>
              <div className="sns-perm-state">{data.allowComments ? '허용' : '차단'}</div>
            </div>
            <div className={`sns-perm ${data.allowDuet ? 'allow' : ''}`}>
              <div className="sns-perm-label">듀엣</div>
              <div className="sns-perm-state">{data.allowDuet ? '허용' : '차단'}</div>
            </div>
            <div className={`sns-perm ${data.allowStitch ? 'allow' : ''}`}>
              <div className="sns-perm-label">이어찍기</div>
              <div className="sns-perm-state">{data.allowStitch ? '허용' : '차단'}</div>
            </div>
          </div>
        </div>
      )}

      {data.scheduledTime && (
        <div className="sns-field">
          <div className="sns-field-label">발행 시간 추천</div>
          <div className="sns-field-sub">알고리즘이 가장 활성화되는 시간대</div>
          <div className="sns-info-box ig">⏰ {data.scheduledTime}</div>
        </div>
      )}
    </div>
  );
}
