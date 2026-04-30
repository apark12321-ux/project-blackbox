'use client';
/**
 * AlgoMaker 결과 페이지 v8.2
 *
 * 박예준 대표 비전:
 * "SNS 초보자가 사이트에 딱 왔을 때 뭔가 필이 팍 꽂혀야 한다"
 * "100명이 같은 키워드 입력해도 100가지 결과"
 * "AlgoMaker 자체 = 완전 무료"
 *
 * v8.2 변경사항 (2026.04.30):
 * - 🏷️ 태그 다양화 시스템 (도메인별 연관 키워드 풀)
 *   → 13개 태그가 모두 다른 의미로 다양해짐
 *   → "2026 부동산 전망 추천/방법/입문..." 식 중복 제거
 * - 📊 가짜 검색량/경쟁 강도 라벨 완전 제거 (AdSense 정책 안전)
 *
 * v8.1 변경사항 유지:
 * - "넷플릭스" 등 외부 브랜드명 모두 제거
 * - "작가급 스토리텔링 + 떡상 패턴 융합"
 *
 * v6.5.1 변경사항 유지:
 * - 5회 무료 제한 + RewardedAd 모달 제거
 * - 무제한 사용 → AdSense 노출 ↑
 *
 * v6.5.0 변경사항 유지:
 * - 📖 작가급 스토리 모드 토글 (STEP 3)
 * - 📱 SNS 4종 실제 UI 모드 (STEP 6, 기본 ON)
 * - 🎨 전문가급 프롬프트 모드 (STEP 4)
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
import { SNSUploadPanel } from '../_shared/SNSUploadPanel_v6_5_0';

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
function diversifyTags(
  originalTags: any[],
  keyword: string,
  categoryId: string,
  seed: number
): { tag: string }[] {
  const domain = detectTagDomain(keyword, categoryId);
  const pool = DOMAIN_KEYWORD_POOL[domain];
  const generalPool = DOMAIN_KEYWORD_POOL.general;
  
  // 메인 키워드는 항상 첫 번째
  const mainTag = keyword.trim();
  
  // 도메인 풀에서 시드 기반으로 11개 선택
  const shuffledDomain = seededShuffle(pool, seed);
  const domainTags = shuffledDomain.slice(0, 11);
  
  // 일반 풀에서 1개 추가 (다양성 보장)
  const shuffledGeneral = seededShuffle(generalPool, seed + 1);
  const generalTag = shuffledGeneral[0];
  
  // 13개 조합: 메인 + 도메인 11 + 일반 1
  const allTags = [mainTag, ...domainTags, generalTag];
  
  // 중복 제거 (혹시 모를 케이스)
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 13);
  
  // 기존 generateTags 와 호환되는 형식으로 반환 (volume, competition 필드 제거)
  return uniqueTags.map(t => ({ tag: t }));
}

type StepId = 'cases' | 'title' | 'script' | 'video' | 'meta' | 'sns';


// ============================================================
// v10.0: 워크스루 STEP 정의
// 한글 라벨 + 작은 영문 보조 (시니어 친화)
// ============================================================
type StepKey = 'cases' | 'title' | 'script' | 'video' | 'meta' | 'sns';

const STEPS_V10: { 
  key: StepKey; 
  num: string; 
  ko: string;       // 한글 메인 라벨
  en: string;       // 영문 보조
  desc: string;     // 한 줄 설명
}[] = [
  { key: 'cases',  num: '1', ko: '비슷한 사례',     en: 'Reference',     desc: '이 키워드로 잘 된 영상들 살펴보기' },
  { key: 'title',  num: '2', ko: '제목 후보',       en: 'Title',         desc: '클릭률 높은 제목 3가지' },
  { key: 'script', num: '3', ko: '시나리오',        en: 'Scenario',      desc: '6단계 영상 구조와 흐름' },
  { key: 'video',  num: '4', ko: '영상 제작',       en: 'Production',    desc: 'AI 도구별 프롬프트' },
  { key: 'meta',   num: '5', ko: '메타데이터',      en: 'Metadata',      desc: '설명 · 태그 · 썸네일' },
  { key: 'sns',    num: '6', ko: 'SNS 업로드',      en: 'Distribution',  desc: '4개 플랫폼별 자료' },
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
  const v650Data = useMemo<V650DataPackage | null>(() => {
    if (!data) return null;
    try {
      // tags가 string[] 인지 {tag: string}[] 인지 안전하게 변환
      const safeTags = (data.tags || []).map((t: any) => 
        typeof t === 'string' ? t : (t?.tag || '')
      ).filter(Boolean);
      
      return generateV650Data({
        keyword,
        categoryId,
        seed,
        titles: data.titles,
        description: data.description,
        tags: safeTags,
        sequences: data.sequences,
        thumbnails: data.thumbnails,
        // shortsScript는 ShortsScript 객체이므로 fullScript 문자열로 변환
        shortsScript: typeof data.shortsScript === 'string' 
          ? data.shortsScript 
          : (data.shortsScript?.fullScript || ''),
      });
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
          line-height: 1.7;
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
          padding: 24px 20px 18px;
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
          padding: 28px 20px 100px;
          min-height: 60vh;
        }
        @media (max-width: 600px) {
          .wt-step { padding: 22px 16px 100px; }
        }

        .wt-step-head {
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 2px solid var(--c-fg);
        }
        @media (max-width: 600px) {
          .wt-step-head { margin-bottom: 20px; padding-bottom: 14px; }
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
          line-height: 1.6;
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
          padding: 18px 20px;
          margin-bottom: 14px;
          border-radius: 0;
        }
        @media (max-width: 600px) {
          .wt-card { padding: 16px; margin-bottom: 12px; }
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
          line-height: 1.75;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-card-body { font-size: 14px; line-height: 1.7; }
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
          padding: 14px 16px;
          background: var(--c-bg-2);
          border: 1px solid var(--c-line);
          margin-bottom: 18px;
          cursor: pointer;
          transition: background 0.15s;
        }
        @media (max-width: 600px) {
          .wt-toggle { padding: 12px 14px; gap: 12px; }
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
          padding: 16px 18px;
          background: var(--c-bg);
          border: 1.5px solid var(--c-line);
          margin-bottom: 10px;
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
          .wt-title-card { padding: 14px 16px; }
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
          margin-bottom: 24px;
          padding-bottom: 20px;
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
          line-height: 1.75;
          margin: 0;
          padding: 14px 16px;
          background: var(--c-bg-2);
          word-break: keep-all;
          white-space: pre-wrap;
        }
        @media (max-width: 600px) {
          .wt-meta-desc-text { font-size: 13.5px; line-height: 1.7; }
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
          padding: 16px;
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
          padding: 16px 0;
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
          line-height: 1.75;
          margin: 6px 0 0;
          padding: 12px 14px;
          background: var(--c-bg-2);
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .wt-beat-text { font-size: 13.5px; line-height: 1.7; }
        }
      `}</style>

      <div className="wt">
        <div className="wt-container">
          {/* 키워드 헤더 */}
          <div className="wt-header">
            <div className="wt-kicker">▍ 영상 자료 준비 완료</div>
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
              <div className="wt-step-num">STEP {stepDef.num} OF 6 · {stepDef.en}</div>
              <h2 className="wt-step-title">
                {stepDef.ko}
              </h2>
              <p className="wt-step-desc">{stepDef.desc}</p>
            </div>

            {/* STEP 콘텐츠 */}
            {currentStep === 0 && (
              <CasesPanel cases={data.cases} />
            )}

            {currentStep === 1 && (
              <TitlePanel
                titles={data.titles}
                selectedIdx={selectedTitleIdx}
                onSelect={setSelectedTitleIdx}
                copy={copy}
                copied={copied}
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
              />
            )}

            {currentStep === 3 && (
              <PromptPanel
                v650Data={v650Data}
                proPromptMode={proPromptMode}
                setProPromptMode={setProPromptMode}
              />
            )}

            {currentStep === 4 && (
              <MetaPanel
                description={data.description}
                tags={data.tags}
                thumbnails={data.thumbnails}
                copy={copy}
                copied={copied}
              />
            )}

            {currentStep === 5 && (
              <SnsPanel
                v650Data={v650Data}
                proSnsMode={proSnsMode}
                setProSnsMode={setProSnsMode}
                shortsScript={data.shortsScript}
              />
            )}

            {/* 다시 만들기 버튼 (모든 STEP에 표시) */}
            <div style={{ 
              marginTop: 28, 
              padding: 16, 
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
              <div style={{ marginTop: 28 }}>
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
              <strong>{currentStep + 1}</strong> / 6
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
// ============================================================
function CasesPanel({ cases }: { cases: any[] }) {
  if (!cases || !Array.isArray(cases) || cases.length === 0) {
    return (
      <div className="wt-card">
        <div className="wt-card-label">사례 데이터 준비중</div>
        <p className="wt-card-body">잠시만 기다려주세요.</p>
      </div>
    );
  }
  return (
    <div className="wt-case-list">
      {cases.map((c: any, i: number) => (
        <div key={i} className="wt-card">
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
  );
}

// ============================================================
// STEP 2: 제목 후보
// ============================================================
function TitlePanel({ 
  titles, 
  selectedIdx, 
  onSelect, 
  copy, 
  copied 
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
      {titles.map((t: any, i: number) => {
        const titleText = typeof t === 'string' ? t : (t?.title || '');
        return (
          <div
            key={i}
            className={`wt-title-card ${selectedIdx === i ? 'selected' : ''}`}
            onClick={() => onSelect(i)}
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
                e.stopPropagation();
                copy(titleText, `title-${i}`);
              }}
            >
              {copied === `title-${i}` ? '✓ 복사됨' : '📋 복사'}
            </button>
          </div>
        );
      })}
    </>
  );
}

// ============================================================
// STEP 3: 시나리오
// ============================================================
function ScriptPanel({ 
  v650Data, 
  cinematicMode, 
  setCinematicMode, 
  sequences,
  copy,
  copied,
}: any) {
  return (
    <>
      <div
        className={`wt-toggle ${cinematicMode ? 'on' : ''}`}
        onClick={() => setCinematicMode((m: boolean) => !m)}
      >
        <div className="wt-toggle-switch">
          <div className="wt-toggle-knob" />
        </div>
        <div className="wt-toggle-text">
          <div className="wt-toggle-name">
            작가급 시나리오 모드 {cinematicMode ? '(켜짐)' : '(꺼짐)'}
          </div>
          <div className="wt-toggle-desc">
            {cinematicMode 
              ? '6단계 비트 + 알고리즘 후킹 구조로 보고 있습니다' 
              : '클릭하면 단순 시퀀스 → 작가급 시나리오로 전환됩니다'}
          </div>
        </div>
      </div>

      {cinematicMode && v650Data ? (
        <CinematicScenarioDisplay scenario={v650Data.scenario} />
      ) : (
        <div className="wt-beats">
          {(sequences && Array.isArray(sequences) ? sequences : []).map((seq: any, i: number) => (
            <div key={i} className="wt-beat">
              <div className="wt-beat-head">
                <div className="wt-beat-num">B0{seq?.number || i + 1}</div>
                <div className="wt-beat-info">
                  <div className="wt-beat-name">{seq?.title || `단계 ${i + 1}`}</div>
                  <div className="wt-beat-time">{seq?.duration || ''}</div>
                </div>
              </div>
              {seq?.purpose && (
                <div style={{ 
                  fontSize: 12, 
                  color: '#737373', 
                  fontStyle: 'italic',
                  marginBottom: 4,
                  paddingLeft: 0,
                  wordBreak: 'keep-all',
                }}>
                  목적: {seq.purpose}
                </div>
              )}
              <p className="wt-beat-text">{seq?.script || ''}</p>
              {seq?.tip && (
                <div style={{ 
                  marginTop: 8, 
                  padding: '8px 12px',
                  background: '#fffbeb',
                  borderLeft: '2px solid #fbbf24',
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: '#78350f',
                  wordBreak: 'keep-all',
                }}>
                  {seq.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
// STEP 4: 영상 제작 프롬프트
// ============================================================
function PromptPanel({ 
  v650Data, 
  proPromptMode, 
  setProPromptMode,
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
    </>
  );
}

// ============================================================
// STEP 5: 메타데이터
// ============================================================
function MetaPanel({ 
  description, 
  tags, 
  thumbnails, 
  copy, 
  copied 
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
    </>
  );
}

// ============================================================
// STEP 6: SNS 업로드
// ============================================================
function SnsPanel({ 
  v650Data, 
  proSnsMode, 
  setProSnsMode,
  shortsScript,
}: any) {
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
              ? 'YouTube Studio · 인스타 릴스 · 틱톡 실제 업로드 화면' 
              : '클릭하면 각 SNS 실제 업로드 화면으로 전환됩니다'}
          </div>
        </div>
      </div>

      {proSnsMode && v650Data ? (
        <SNSUploadPanel formats={v650Data.sns} />
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
