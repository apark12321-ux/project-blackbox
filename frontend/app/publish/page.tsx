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

// v8.5: Studio Treatment 통일 - 모노크롬 + 앰버 1색
// 모든 STEP이 같은 디자인 언어 사용
const STEPS: { id: StepId; num: string; label: string; sub: string }[] = [
  { id: 'cases',  num: '01', label: 'REFERENCE',     sub: '비슷한 떡상 사례' },
  { id: 'title',  num: '02', label: 'TITLE',         sub: '제목 선택' },
  { id: 'script', num: '03', label: 'TREATMENT',     sub: '시나리오' },
  { id: 'video',  num: '04', label: 'CINEMATOGRAPHY', sub: '영상 제작' },
  { id: 'meta',   num: '05', label: 'METADATA',      sub: '메타데이터' },
  { id: 'sns',    num: '06', label: 'DISTRIBUTION',  sub: 'SNS 업로드' },
];

function PublishPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'realestate';
  const scenarioId = searchParams.get('scenario') || 'curiosity';

  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const scenario = SCENARIOS.find(s => s.id === scenarioId);

  // 단계별 펼치기/접기
  const [openSteps, setOpenSteps] = useState<Record<StepId, boolean>>({
    cases: true,
    title: true,
    script: true,
    video: false,
    meta: false,
    sns: false,
  });
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [snsTab, setSnsTab] = useState<'youtube' | 'shorts' | 'tiktok' | 'reels'>('youtube');
  const [copied, setCopied] = useState('');
  const [regenerateKey, setRegenerateKey] = useState(0);
  
  // ============================================================
  // v6.5.0: 작가급 모드 토글 (기본 OFF, 토글 ON 시 v6.5.0 발동)
  // ============================================================
  const [cinematicMode, setCinematicMode] = useState(false);    // STEP 3 작가급 모드
  const [proPromptMode, setProPromptMode] = useState(false);    // STEP 4 전문가 프롬프트 모드
  const [proSnsMode, setProSnsMode] = useState(true);           // STEP 6 SNS 실제 UI 모드 (기본 ON)

  // ============================================================
  // v6.5.1: 무료 횟수 제한 제거 (완전 무료 비전 부합)
  // 박 대표님 결정: AdSense 광고 최적화로 진행
  // → 5회 제한 + RewardedAd 모달 제거
  // → 무제한 사용 가능 → 페이지 더 자주 새로고침 → AdSlot 광고 노출 ↑
  // ============================================================

  // 콘텐츠 생성
  const titles = useMemo(
    () => generateTitles(keyword, scenarioId, cat.name),
    [keyword, scenarioId, cat.name, regenerateKey]
  );
  const description = useMemo(
    () => generateDescription(keyword, cat.name, scenarioId),
    [keyword, cat.name, scenarioId, regenerateKey]
  );
  const tags = useMemo(
    () => {
      // v8.2: 기존 generateTags 호출 (자산 보존)
      const originalTags = generateTags(keyword, cat.name);
      // v8.2: 도메인별 연관 키워드 풀로 다양화 (시드 기반)
      const seed = Math.abs(
        keyword.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0) 
        + regenerateKey * 7919
      );
      return diversifyTags(originalTags, keyword, categoryId, seed);
    },
    [keyword, cat.name, categoryId, regenerateKey]
  );
  const sequences = useMemo(
    () => generateVideoSequences(keyword, scenarioId),
    [keyword, scenarioId, regenerateKey]
  );
  const thumbnails = useMemo(
    () => generateThumbnailConcepts(keyword, cat.name),
    [keyword, cat.name, regenerateKey]
  );
  const shortsScript = useMemo(
    () => generateShortsScript(keyword, scenarioId),
    [keyword, scenarioId, regenerateKey]
  );

  // Phase 1: 비슷한 떡상 영상 사례 매칭
  const viralCases = useMemo(
    () => getViralCases(categoryId, 3),
    [categoryId]
  );

  // 해시태그 자동 변환 (띄어쓰기 제거 + #)
  const toHashtag = (text: string) => '#' + text.replace(/[\s·,.\-]/g, '').replace(/[^가-힣a-zA-Z0-9]/g, '');
  const hashtagsBase = tags.slice(0, 8).map(t => toHashtag(t.tag)).join(' ');
  const shortsHashtags = `#Shorts ${hashtagsBase} #쇼츠 ${toHashtag(cat.name)}`;
  const tiktokHashtags = `#fyp #foryou ${hashtagsBase} #추천 #바이럴`;
  const instaHashtags = `${hashtagsBase} #인스타그램 #릴스 ${toHashtag(cat.name)} #일상`;

  const selectedTitle = titles[selectedTitleIdx]?.title || '';

  // ============================================================
  // v6.5.0: 통합 데이터 패키지 생성
  // (선택된 제목 + 키워드 기반으로 작가급 시나리오 + SNS 4종 + 전문가 프롬프트)
  // ============================================================
  const v650Data: V650DataPackage | null = useMemo(() => {
    if (!keyword || !selectedTitle) return null;
    try {
      return generateV650Data(keyword, selectedTitle, cat.name);
    } catch (e) {
      console.error('[v6.5.0] 데이터 생성 실패:', e);
      return null;
    }
  }, [keyword, selectedTitle, cat.name, regenerateKey]);

  // ============================================================
  // v6.5.1: 다시 생성 (무제한, 광고 모달 없음)
  // 박 대표님 결정: AdSense 광고 최적화 → 페이지 새로고침 빈도 ↑ → 노출 ↑
  // ============================================================
  const handleRegenerate = () => {
    bumpSeed();
    setRegenerateKey(k => k + 1);
  };

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
      });
    }
  };

  const toggleStep = (id: StepId) => {
    setOpenSteps(s => ({ ...s, [id]: !s[id] }));
  };

  const expandAll = () => {
    setOpenSteps({ cases: true, title: true, script: true, video: true, meta: true, sns: true });
  };

  const collapseAll = () => {
    setOpenSteps({ cases: false, title: false, script: false, video: false, meta: false, sns: false });
  };

  if (!keyword) {
    if (typeof window !== 'undefined') {
      router.push('/create');
    }
    return null;
  }

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 32px 24px 60px; }
        @media (max-width: 600px) { .page { padding: 20px 16px 40px; } }

        .breadcrumb {
          display: flex; align-items: center; gap: 6px; font-size: 12px;
          color: #888; margin-bottom: 16px;
        }
        .breadcrumb a { color: #888; text-decoration: none; }
        .breadcrumb a:hover { color: #c65f3b; }

        /* 헤더 */
        .header {
          background: #fffbeb;
          border: 1.5px solid #fbbf24;
          border-radius: 16px;
          padding: 22px 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 600px) { .header { padding: 18px 16px; } }

        .headerBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }
        .headerTitle {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 6px;
          letter-spacing: -0.025em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .headerTitle { font-size: 18px; } }
        .headerSub {
          font-size: 13.5px;
          color: #78350f;
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .headerMeta {
          display: flex; gap: 8px; flex-wrap: wrap;
          font-size: 12px;
        }
        .metaChip {
          padding: 5px 12px;
          background: rgba(255,255,255,0.7);
          border-radius: 100px;
          color: #92400e;
          font-weight: 700;
        }

        /* 무료 횟수 알림 */
        .quotaBar {
          display: flex; align-items: center; justify-content: space-between;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 12px 18px;
          margin-bottom: 14px;
          font-size: 13px;
        }
        @media (max-width: 600px) {
          .quotaBar { flex-direction: column; gap: 10px; align-items: flex-start; padding: 14px 16px; }
        }
        .quotaText { color: #444; line-height: 1.5; }
        .quotaCount { color: #c65f3b; font-weight: 800; }
        .regenBtn {
          padding: 9px 18px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .regenBtn:hover { background: #b04e2d; transform: translateY(-1px); }

        /* 단계 토글 (확장/축소) */
        .toggleAll {
          display: flex; gap: 8px; margin-bottom: 16px;
          font-size: 12px;
        }
        .toggleBtn {
          padding: 5px 11px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .toggleBtn:hover { border-color: #c65f3b; color: #c65f3b; }

        /* ============================================ */
        /* STEP 카드 - v8.5 Studio Treatment 통일 */
        /* ============================================ */
        .step {
          background: #ffffff;
          border: 1px solid #0a0a0a;
          border-radius: 0;
          margin-bottom: 14px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .step.active { 
          border-color: #c2410c;
          box-shadow: 0 0 0 1px #c2410c;
        }

        .stepHead {
          display: grid;
          grid-template-columns: 56px 1fr auto;
          gap: 18px;
          padding: 18px 22px;
          cursor: pointer;
          user-select: none;
          transition: background 0.15s;
          align-items: center;
          background: #fafafa;
          border-bottom: 1px solid transparent;
        }
        @media (max-width: 600px) { 
          .stepHead { 
            padding: 14px 16px; 
            gap: 12px;
            grid-template-columns: 40px 1fr auto;
          } 
        }
        .stepHead:hover { 
          background: #f5f5f5; 
        }
        .step.active .stepHead {
          background: #0a0a0a;
          border-bottom: 1px solid #0a0a0a;
        }

        .stepNumBadge {
          font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
          font-size: 18px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1;
          padding: 4px 0;
          border-bottom: 2px solid #c2410c;
          display: inline-block;
          width: 100%;
          text-align: center;
        }
        @media (max-width: 600px) {
          .stepNumBadge { font-size: 15px; padding: 3px 0; }
        }
        .step.active .stepNumBadge {
          color: #ffffff;
          border-bottom-color: #fbbf24;
        }

        .stepInfo { 
          min-width: 0; 
        }
        .stepLabel {
          font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .stepLabel { font-size: 9.5px; letter-spacing: 0.12em; }
        }
        .step.active .stepLabel {
          color: #fbbf24;
        }

        .stepTitle {
          font-family: 'Noto Serif KR', 'Pretendard', serif;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { 
          .stepTitle { font-size: 14px; } 
        }
        .step.active .stepTitle {
          color: #ffffff;
        }

        .stepArrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #525252;
          transition: transform 0.2s;
          flex-shrink: 0;
          font-weight: 700;
        }
        .stepArrow.open { 
          transform: rotate(180deg);
          color: #fbbf24;
        }
        .step.active .stepArrow {
          color: #fbbf24;
        }

        .stepBody {
          padding: 24px 22px;
          background: #ffffff;
        }
        @media (max-width: 600px) { 
          .stepBody { padding: 20px 16px; } 
        }

        /* ============================================ */
        /* STEP 1 - 제목 선택 */
        /* ============================================ */
        /* ============================================ */
        /* STEP 1 - 비슷한 떡상 영상 사례 (Phase 1) */
        /* ============================================ */
        .casesIntro {
          background: #fafafa;
          border-left: 3px solid #185FA5;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 13px;
          color: #042c53;
          line-height: 1.7;
          margin: 16px 0 18px;
        }
        .casesList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .caseCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 16px 18px;
          transition: all 0.2s;
        }
        .caseCard:hover {
          border-color: #185FA5;
          background: #fafbfd;
        }
        .caseCardHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #e5e5e5;
        }
        .caseCardEmoji {
          font-size: 22px;
        }
        .caseCardPattern {
          font-size: 14.5px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          flex: 1;
        }
        .caseCardLength {
          font-size: 11.5px;
          color: #888;
          font-weight: 600;
        }
        .caseCardLabel {
          display: block;
          font-size: 10.5px;
          font-weight: 800;
          color: #185FA5;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .caseCardHook {
          background: #e6f1fb;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }
        .caseCardHookText {
          font-size: 14px;
          font-weight: 700;
          color: #042c53;
          font-style: italic;
          line-height: 1.5;
        }
        .caseCardWhy {
          margin-bottom: 12px;
        }
        .caseCardWhy p {
          font-size: 13px;
          color: #555;
          line-height: 1.7;
          margin: 0;
        }
        .caseCardKey {
          padding: 8px 12px;
          background: #fafafa;
          border-radius: 8px;
          font-size: 12.5px;
          color: #444;
          line-height: 1.55;
        }
        .caseCardKey .caseCardKeyLabel {
          font-weight: 700;
          color: #c65f3b;
          margin-right: 4px;
        }

        /* ============================================ */
        /* STEP 2 - 제목 선택 */
        /* ============================================ */
        .titleHelp {
          background: #fff8f3;
          border-left: 3px solid #c65f3b;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin: 16px 0 18px;
        }
        .titleList { display: flex; flex-direction: column; gap: 10px; }
        .titleCard {
          background: #fafafa;
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 16px 18px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .titleCard:hover { background: #fff8f3; }
        .titleCard.selected {
          background: #fff8f3;
          border-color: #c65f3b;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.1);
        }
        .titleCardHead {
          display: flex; gap: 8px; align-items: center;
          margin-bottom: 8px;
        }
        .titlePattern {
          padding: 3px 9px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .titleCtr {
          padding: 3px 9px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .titleSelected {
          padding: 3px 9px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          margin-left: auto;
        }
        .titleText {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.5;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .titleText { font-size: 14.5px; } }
        .titleReason {
          font-size: 12.5px;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }

        /* ============================================ */
        /* STEP 2 - 시나리오 7단계 (메인!) */
        /* ============================================ */
        .scriptIntro {
          background: #fffbeb;
          border-radius: 12px;
          padding: 16px 20px;
          margin: 16px 0 18px;
        }
        .scriptIntroLabel {
          font-size: 11px;
          font-weight: 800;
          color: #92400e;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .scriptIntroText {
          font-size: 13.5px;
          color: #78350f;
          line-height: 1.7;
        }

        .seqList { display: flex; flex-direction: column; gap: 12px; }
        .seqCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .seqCard:hover { border-color: #c65f3b; }

        .seqHead {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px;
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }
        .seqNum {
          width: 32px; height: 32px;
          background: #c65f3b;
          color: #fff;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .seqHeadInfo { flex: 1; min-width: 0; }
        .seqStepTitle {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 2px;
          letter-spacing: -0.02em;
        }
        .seqDuration {
          font-size: 11.5px;
          color: #888;
          font-weight: 600;
        }
        .seqPurpose {
          padding: 12px 18px;
          background: #fffbf8;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          border-bottom: 1px solid #f5f5f5;
        }
        .seqPurpose strong { color: #c65f3b; }
        .seqScriptBox {
          padding: 16px 18px;
          font-size: 14.5px;
          color: #1a1a1a;
          line-height: 1.85;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .seqScriptBox { font-size: 13.5px; padding: 14px 16px; } }

        .seqActions {
          display: flex; gap: 8px;
          padding: 0 18px 14px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) { .seqActions { padding: 0 16px 12px; } }

        .seqActionBtn {
          padding: 7px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .seqActionBtn:hover { border-color: #c65f3b; color: #c65f3b; }
        .seqActionBtn.copied {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        .seqTip {
          padding: 10px 18px;
          background: #fffbf3;
          border-top: 1px solid #fef3c7;
          font-size: 12px;
          color: #92400e;
          line-height: 1.55;
        }

        /* 1분 쇼츠 박스 */
        .shortsBox {
          background: #fafafa;
          border: 1.5px solid #a855f7;
          border-radius: 14px;
          padding: 18px 20px;
          margin-top: 18px;
        }
        .shortsBoxHead {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .shortsBoxTitle {
          font-size: 14px;
          font-weight: 800;
          color: #581c87;
        }
        .shortsBoxSub {
          font-size: 11.5px;
          color: #7c3aed;
          background: rgba(255,255,255,0.6);
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 700;
          margin-left: auto;
        }
        .shortsScript {
          background: #fff;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 13px;
          color: #1a1a1a;
          line-height: 1.85;
          white-space: pre-line;
        }
        @media (max-width: 600px) { .shortsScript { font-size: 12.5px; padding: 12px 14px; } }

        /* ============================================ */
        /* STEP 3 - 영상 제작 */
        /* ============================================ */
        .videoIntro {
          background: #fafafa;
          border-radius: 12px;
          padding: 16px 20px;
          margin: 16px 0 18px;
        }
        .videoIntroLabel {
          font-size: 11px;
          font-weight: 800;
          color: #065f46;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .videoIntroText {
          font-size: 13px;
          color: #064e3b;
          line-height: 1.7;
          margin-bottom: 10px;
        }
        .videoIntroLink {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 7px 14px;
          background: #10b981;
          color: #fff;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
        }
        .videoIntroLink:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .promptList { display: flex; flex-direction: column; gap: 8px; }
        .promptCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
        }
        .promptCardHead {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px;
          background: #fafafa;
          font-size: 12.5px;
          font-weight: 700;
          color: #444;
          cursor: pointer;
        }
        .promptCardHead:hover { background: #f5f5f5; }
        .promptCardSeq {
          padding: 2px 8px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 800;
        }
        .promptCardArrow {
          margin-left: auto;
          font-size: 11px;
          color: #888;
          transition: transform 0.2s;
        }
        .promptCardArrow.open { transform: rotate(180deg); }
        .promptCardBody {
          padding: 14px 16px;
          background: #fffefb;
          border-top: 1px solid #f0f0f0;
        }
        .promptItem { margin-bottom: 12px; }
        .promptItem:last-child { margin-bottom: 0; }
        .promptItemHead {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 6px;
        }
        .promptLang {
          padding: 2px 8px;
          background: #f5f5f5;
          color: #555;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 700;
        }
        .promptLang.kr { background: #dbeafe; color: #1e40af; }
        .promptLang.en { background: #fef3c7; color: #92400e; }
        .promptText {
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12.5px;
          color: #444;
          line-height: 1.6;
          font-family: 'SF Mono', Monaco, monospace;
        }
        .promptCopyBtn {
          margin-left: auto;
          padding: 4px 10px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .promptCopyBtn:hover { border-color: #c65f3b; color: #c65f3b; }
        .promptCopyBtn.copied { background: #c65f3b; color: #fff; border-color: #c65f3b; }

        /* ============================================ */
        /* STEP 4 - 메타데이터 */
        /* ============================================ */
        .metaSection {
          margin-top: 16px;
          padding: 16px 18px;
          background: #fafafa;
          border-radius: 12px;
        }
        .metaSection:first-child { margin-top: 18px; }
        .metaLabelRow {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .metaLabel {
          font-size: 13.5px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }
        .metaHelper {
          font-size: 12px;
          color: #888;
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .metaContent {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 13px;
          color: #444;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .copyBtnSm {
          margin-left: auto;
          padding: 5px 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copyBtnSm:hover { border-color: #c65f3b; color: #c65f3b; }
        .copyBtnSm.copied { background: #c65f3b; color: #fff; border-color: #c65f3b; }

        .tagGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 8px;
        }
        .tagItem {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 12.5px;
          transition: border-color 0.15s;
        }
        .tagItem:hover {
          border-color: #c65f3b;
        }
        .tagItemName {
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.4;
        }

        .thumbGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }
        .thumbCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 14px 16px;
        }
        .thumbType {
          font-size: 13px;
          font-weight: 800;
          color: #c65f3b;
          margin-bottom: 8px;
        }
        .thumbDetail {
          font-size: 11.5px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .thumbDetail strong { color: #1a1a1a; }
        .thumbCtr {
          margin-top: 8px;
          padding: 4px 10px;
          background: #fff8f3;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          color: #c65f3b;
          display: inline-block;
        }

        /* ============================================ */
        /* STEP 5 - SNS 업로드 */
        /* ============================================ */
        .snsTabs {
          display: flex;
          gap: 6px;
          margin: 18px 0 16px;
          flex-wrap: wrap;
        }
        .snsTab {
          padding: 9px 16px;
          background: #fff;
          border: 1.5px solid #e5e5e5;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .snsTab:hover { border-color: #c65f3b; color: #c65f3b; }
        .snsTab.active {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        .snsBox {
          background: #fafafa;
          border-radius: 12px;
          padding: 18px 20px;
        }
        .snsHead {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .snsName {
          font-size: 15px;
          font-weight: 800;
          color: #1a1a1a;
        }
        .snsSpec {
          font-size: 11.5px;
          color: #888;
          font-weight: 600;
        }
        .snsField { margin-bottom: 14px; }
        .snsField:last-child { margin-bottom: 0; }
        .snsFieldLabel {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .snsFieldHelper {
          font-size: 11.5px;
          color: #888;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .snsFieldContent {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 12.5px;
          color: #444;
          line-height: 1.7;
          word-break: break-all;
        }

        /* 광고 영역 */
        .adArea { margin: 24px 0; }
        
        /* 완료 안내 */
        .doneBox {
          background: #0a0a0a;
          color: #fff;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          margin-top: 28px;
        }
        .doneTitle {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) { .doneTitle { font-size: 17px; } }
        .doneSub {
          font-size: 13.5px;
          color: #ffe0d0;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .doneActions {
          display: flex; gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .doneBtn {
          display: inline-block;
          padding: 11px 22px;
          background: #fff;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 13.5px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.15s;
        }
        .doneBtn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .doneBtn.outline {
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
        }
        .doneBtn.outline:hover { background: #fff; color: #c65f3b; }

        /* 한도 모달 */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modalCard {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          max-width: 400px;
          text-align: center;
        }

        /* ============================================ */
        /* 🎯 시니어 모바일 최적화 (v6.3.0) */
        /* ============================================ */
        @media (max-width: 600px) {
          /* 페이지 여백 */
          .page { padding: 18px 12px 50px !important; }

          /* 헤더 영역 */
          .pageHeader { padding: 22px 16px !important; }
          .pageTitle { font-size: 20px !important; line-height: 1.4 !important; }
          .pageSub { font-size: 14px !important; line-height: 1.6 !important; }

          /* STEP 카드 - 시니어 시력 고려 */
          .stepHead {
            padding: 16px 14px !important;
            gap: 10px !important;
            min-height: 64px;
          }
          .stepNumBadge {
            font-size: 14px !important;
          }
          .stepLabel { font-size: 9.5px !important; }
          .stepTitle { 
            font-size: 13.5px !important; 
            line-height: 1.5 !important;
          }
          .stepArrow { font-size: 14px !important; }

          /* STEP 본문 */
          .stepBody { padding: 14px 14px 16px !important; }

          /* 시퀀스 카드 (STEP 3) */
          .seqCard { 
            padding: 0 !important; 
            margin-bottom: 12px !important;
          }
          .seqHead { padding: 14px 16px 10px !important; }
          .seqNum {
            width: 32px !important;
            height: 32px !important;
            font-size: 14px !important;
          }
          .seqStepTitle { font-size: 14.5px !important; }
          .seqDuration { font-size: 11.5px !important; }
          .seqPurpose { 
            padding: 10px 16px !important; 
            font-size: 13px !important;
            line-height: 1.65 !important;
          }
          .seqScriptBox {
            font-size: 13.5px !important;
            padding: 12px 14px !important;
            line-height: 1.7 !important;
          }
          .seqActions { padding: 0 14px 10px !important; }
          .seqActionBtn {
            font-size: 12.5px !important;
            padding: 10px 14px !important;
            min-height: 40px;
          }
          .seqTip {
            padding: 10px 14px !important;
            font-size: 12px !important;
            line-height: 1.65 !important;
          }

          /* 떡상 사례 카드 (STEP 1) */
          .caseCard { padding: 14px 14px !important; }
          .caseCardEmoji { font-size: 20px !important; }
          .caseCardPattern { font-size: 13.5px !important; }
          .caseCardLength { font-size: 11px !important; }
          .caseCardLabel { font-size: 10px !important; }
          .caseCardHookText { 
            font-size: 13px !important; 
            line-height: 1.55 !important;
          }
          .caseCardWhy p { 
            font-size: 12.5px !important; 
            line-height: 1.7 !important;
          }
          .caseCardKey { 
            font-size: 12px !important; 
            line-height: 1.6 !important;
          }
          .casesIntro {
            font-size: 12.5px !important;
            padding: 10px 14px !important;
            line-height: 1.7 !important;
          }

          /* 제목 카드 (STEP 2) */
          .titleCard { padding: 14px 16px !important; }
          .titleCardText { 
            font-size: 14.5px !important; 
            line-height: 1.5 !important;
          }
          .titleHelp { 
            font-size: 13px !important; 
            padding: 10px 14px !important;
          }

          /* SNS 탭 (STEP 6) */
          .snsTabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .snsTab { 
            font-size: 12.5px !important; 
            padding: 10px 14px !important;
            min-width: 80px;
            white-space: nowrap;
          }
          .snsBox { padding: 14px !important; }

          /* 펼치기/접기 버튼 */
          .toggleBtn { 
            font-size: 12.5px !important; 
            padding: 8px 14px !important;
            min-height: 36px;
          }

          /* 무료 횟수 안내 */
          .quotaBar { 
            padding: 12px 14px !important; 
            font-size: 13px !important;
          }
          .quotaCount { font-size: 14px !important; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span>/</span>
          <Link href="/create">분야</Link>
          <span>/</span>
          <Link href={`/keyword?category=${categoryId}`}>키워드</Link>
          <span>/</span>
          <span style={{ color: '#c65f3b', fontWeight: 700 }}>완성</span>
        </nav>

        {/* HEADER - 결과 안내 */}
        <header className="header">
          <span className="headerBadge">✨ AI 추천 완료</span>
          <h1 className="headerTitle">
            "{keyword}" 영상 자료가 준비됐습니다
          </h1>
          <p className="headerSub">
            아래 5단계 순서대로 따라가시면 됩니다. 각 단계 클릭하면 펼쳐집니다.
          </p>
          <div className="headerMeta">
            <span className="metaChip">🎯 {cat.name}</span>
            <span className="metaChip">📂 {scenario?.name || '시나리오'}</span>
            <span className="metaChip">⚡ {sequences.length}단계 시나리오</span>
          </div>
        </header>

        {/* QUOTA BAR - v6.5.1: 무제한 사용 안내로 변경 */}
        <div className="quotaBar">
          <div className="quotaText">
            🎁 마음에 안 들면 몇 번이고 다시 만들어 보세요. 매번 다른 시나리오가 나와요.<br />
            <span style={{ fontSize: '12px', color: '#888' }}>
              <span className="quotaCount">완전 무료</span> · 회원가입 없이 무제한 사용 가능 ✨
            </span>
          </div>
          <button className="regenBtn" onClick={handleRegenerate}>
            🔄 다시 생성
          </button>
        </div>

        {/* 펼치기/접기 토글 */}
        <div className="toggleAll">
          <button className="toggleBtn" onClick={expandAll}>📂 전체 펼치기</button>
          <button className="toggleBtn" onClick={collapseAll}>📁 전체 접기</button>
        </div>

        {/* ============================================ */}
        {/* STEP 1 - 비슷한 떡상 영상 사례 (Phase 1 NEW) */}
        {/* ============================================ */}
        <div className={`step ${openSteps.cases ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('cases')}>
            <div className="stepNumBadge">{STEPS[0].num}</div>
            <div className="stepInfo">
              <div className="stepLabel">{STEPS[0].label}</div>
              <div className="stepTitle">비슷한 떡상 영상 사례 — 어떤 패턴으로 잘 됐을까</div>
            </div>
            <div className={`stepArrow ${openSteps.cases ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.cases && (
            <div className="stepBody">
              <div className="casesIntro">
                💡 "{cat.name}" 분야에서 실제로 잘된 영상들의 공통 패턴이에요.
                내 영상도 이런 패턴으로 만들면 좋아요.
              </div>
              <div className="casesList">
                {viralCases.map((vc, i) => (
                  <div key={i} className="caseCard">
                    <div className="caseCardHead">
                      <span className="caseCardEmoji">{vc.emoji}</span>
                      <span className="caseCardPattern">{vc.pattern}</span>
                      <span className="caseCardLength">⏱️ {vc.videoLength}</span>
                    </div>
                    <div className="caseCardHook">
                      <span className="caseCardLabel">핵심 후크 (첫 3초)</span>
                      <div className="caseCardHookText">"{vc.hook}"</div>
                    </div>
                    <div className="caseCardWhy">
                      <span className="caseCardLabel">왜 떡상했을까?</span>
                      <p>{vc.why}</p>
                    </div>
                    <div className="caseCardKey">
                      <span className="caseCardKeyLabel">🎯 핵심 요소:</span>
                      <span>{vc.keyElement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 2 - 제목 선택 */}
        {/* ============================================ */}
        <div className={`step ${openSteps.title ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('title')}>
            <div className="stepNumBadge">{STEPS[1].num}</div>
            <div className="stepInfo">
              <div className="stepLabel">{STEPS[1].label}</div>
              <div className="stepTitle">제목 선택 — 마음에 드는 제목 1개를 골라주세요</div>
            </div>
            <div className={`stepArrow ${openSteps.title ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.title && (
            <div className="stepBody">
              <div className="titleHelp">
                💡 알고리즘 분석으로 클릭률(CTR) 예측한 제목 3개입니다. 클릭하면 선택돼요.
              </div>
              <div className="titleList">
                {titles.map((t, i) => (
                  <div
                    key={i}
                    className={`titleCard ${selectedTitleIdx === i ? 'selected' : ''}`}
                    onClick={() => setSelectedTitleIdx(i)}
                  >
                    <div className="titleCardHead">
                      <span className="titlePattern">{t.pattern}</span>
                      <span className="titleCtr">📊 CTR {t.ctr_estimate}</span>
                      {selectedTitleIdx === i && <span className="titleSelected">✓ 선택됨</span>}
                    </div>
                    <h3 className="titleText">{t.title}</h3>
                    <p className="titleReason">💬 {t.reasoning}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className={`copyBtnSm ${copied === 'title' ? 'copied' : ''}`}
                  onClick={() => copy(selectedTitle, 'title')}
                  style={{ marginLeft: 0 }}
                >
                  {copied === 'title' ? '✓ 복사됨' : '📋 선택한 제목 복사'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 2 - 시나리오 7단계 (메인!) */}
        {/* ============================================ */}
        <div className={`step ${openSteps.script ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('script')}>
            <div className="stepNumBadge">{STEPS[2].num}</div>
            <div className="stepInfo">
              <div className="stepLabel">{STEPS[2].label} · 메인 콘텐츠</div>
              <div className="stepTitle">떡상 시나리오 {sequences.length}단계 — 영상 대본 흐름</div>
            </div>
            <div className={`stepArrow ${openSteps.script ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.script && (
            <div className="stepBody">
              <div className="scriptIntro">
                <div className="scriptIntroLabel">🔥 떡상의 핵심</div>
                <div className="scriptIntroText">
                  단순한 대본이 아닙니다. 시청자가 끝까지 보게 만드는 7단계 구조예요.<br />
                  <strong>훅(0~15초)</strong>이 영상의 운명을 결정합니다. 이대로 영상을 만들어보세요.
                </div>
              </div>

              {/* ============================================ */}
              {/* v6.5.0: 작가급 스토리 모드 토글 (v8.5 Studio Treatment) */}
              {/* ============================================ */}
              {v650Data && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: cinematicMode ? '#0a0a0a' : '#fafafa',
                  border: `1px solid ${cinematicMode ? '#0a0a0a' : '#e5e5e5'}`,
                  marginBottom: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
                onClick={() => setCinematicMode(m => !m)}
                >
                  <div style={{
                    width: 38,
                    height: 22,
                    background: cinematicMode ? '#c2410c' : '#d4d4d4',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18,
                      height: 18,
                      background: '#ffffff',
                      position: 'absolute',
                      top: 2,
                      left: cinematicMode ? 18 : 2,
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontFamily: "'JetBrains Mono', monospace", 
                      fontSize: 10, 
                      fontWeight: 700, 
                      letterSpacing: '0.18em', 
                      color: cinematicMode ? '#fbbf24' : '#c2410c',
                      textTransform: 'uppercase',
                      marginBottom: 4 
                    }}>
                      Treatment Mode {cinematicMode ? '· ON' : '· OFF'}
                    </div>
                    <div style={{ 
                      fontFamily: "'Noto Serif KR', 'Pretendard', serif",
                      fontSize: 13.5, 
                      fontWeight: 600, 
                      color: cinematicMode ? '#ffffff' : '#0a0a0a',
                      lineHeight: 1.5,
                      letterSpacing: '-0.015em',
                    }}>
                      {cinematicMode 
                        ? '작가급 스토리텔링 + 떡상 패턴 융합' 
                        : '단순 시퀀스 → 클릭하여 작가급 시나리오 활성화'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* v6.5.0 작가급 모드 ON: CinematicScenarioDisplay */}
              {/* ============================================ */}
              {cinematicMode && v650Data ? (
                <CinematicScenarioDisplay scenario={v650Data.scenario} />
              ) : (
              /* 기본 모드 OFF: 기존 7단계 시퀀스 표시 */
              <>
              <div className="seqList">
                {sequences.map((seq, idx) => (
                  <div key={seq.number} className="seqCard">
                    <div className="seqHead">
                      <div className="seqNum">{seq.number}</div>
                      <div className="seqHeadInfo">
                        <div className="seqStepTitle">{seq.title}</div>
                        <div className="seqDuration">⏱️ {seq.duration}</div>
                      </div>
                    </div>
                    <div className="seqPurpose">
                      <strong>📌 목적:</strong> {seq.purpose}
                    </div>
                    <div className="seqScriptBox">{seq.script}</div>

                    <div className="seqActions">
                      <button
                        className={`seqActionBtn ${copied === `seq-${idx}` ? 'copied' : ''}`}
                        onClick={() => copy(seq.script, `seq-${idx}`)}
                      >
                        {copied === `seq-${idx}` ? '✓ 복사됨' : '📋 대본 복사'}
                      </button>
                    </div>
                    <div className="seqTip">{seq.tip}</div>
                  </div>
                ))}
              </div>

              {/* 1분 쇼츠 박스 */}
              <div className="shortsBox">
                <div className="shortsBoxHead">
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <span className="shortsBoxTitle">1분 쇼츠 버전</span>
                  <span className="shortsBoxSub">{shortsScript.totalDuration}</span>
                </div>
                <div className="shortsScript">{shortsScript.fullScript}</div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className={`copyBtnSm ${copied === 'shorts' ? 'copied' : ''}`}
                    onClick={() => copy(shortsScript.fullScript, 'shorts')}
                  >
                    {copied === 'shorts' ? '✓ 복사됨' : '📋 쇼츠 대본 복사'}
                  </button>
                </div>
              </div>

              <button
                className={`copyBtnSm ${copied === 'all-script' ? 'copied' : ''}`}
                onClick={() => copy(sequences.map(s => `[${s.number}. ${s.title} - ${s.duration}]\n${s.script}`).join('\n\n'), 'all-script')}
                style={{ marginTop: 16, marginLeft: 0, padding: '10px 18px', fontSize: '13px' }}
              >
                {copied === 'all-script' ? '✓ 전체 대본 복사됨' : '📋 전체 7단계 대본 한 번에 복사'}
              </button>
              </>
              )}
            </div>
          )}
        </div>

        <div className="adArea">
          <AdSlot slot="publish-mid" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* STEP 3 - 영상 제작 (AI 프롬프트) */}
        {/* ============================================ */}
        <div className={`step ${openSteps.video ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('video')}>
            <div className="stepNumBadge">{STEPS[3].num}</div>
            <div className="stepInfo">
              <div className="stepLabel">{STEPS[3].label}</div>
              <div className="stepTitle">영상 제작 — AI 도구용 프롬프트 (단계별)</div>
            </div>
            <div className={`stepArrow ${openSteps.video ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.video && (
            <div className="stepBody">
              <div className="videoIntro">
                <div className="videoIntroLabel">🎨 일관된 영상 만드는 비결</div>
                <div className="videoIntroText">
                  AI 영상이 어색한 이유는 매 시퀀스마다 새로 그리기 때문입니다.<br />
                  <strong>NotebookLM(무료) + Pinterest(무료)</strong> 조합으로 60장 일관된 이미지를 만들 수 있어요.
                </div>
                <Link href="/workflow" className="videoIntroLink">
                  📚 일관된 영상 만들기 가이드 →
                </Link>
              </div>

              {/* ============================================ */}
              {/* v6.5.0: 전문가 프롬프트 모드 토글 */}
              {/* ============================================ */}
              {v650Data && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: proPromptMode ? '#0a0a0a' : '#fafafa',
                  border: `1px solid ${proPromptMode ? '#0a0a0a' : '#e5e5e5'}`,
                  marginBottom: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
                onClick={() => setProPromptMode(m => !m)}
                >
                  <div style={{
                    width: 38,
                    height: 22,
                    background: proPromptMode ? '#c2410c' : '#d4d4d4',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18,
                      height: 18,
                      background: '#ffffff',
                      position: 'absolute',
                      top: 2,
                      left: proPromptMode ? 18 : 2,
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontFamily: "'JetBrains Mono', monospace", 
                      fontSize: 10, 
                      fontWeight: 700, 
                      letterSpacing: '0.18em', 
                      color: proPromptMode ? '#fbbf24' : '#c2410c',
                      textTransform: 'uppercase',
                      marginBottom: 4 
                    }}>
                      Cinematography Mode {proPromptMode ? '· ON' : '· OFF'}
                    </div>
                    <div style={{ 
                      fontFamily: "'Noto Serif KR', 'Pretendard', serif",
                      fontSize: 13.5, 
                      fontWeight: 600, 
                      color: proPromptMode ? '#ffffff' : '#0a0a0a',
                      lineHeight: 1.5,
                      letterSpacing: '-0.015em',
                    }}>
                      {proPromptMode 
                        ? 'Midjourney v7 + Sora 2 + VEO 3 — 카메라·조명·색감 사양' 
                        : '단순 프롬프트 → 클릭하여 전문가급 활성화'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* v6.5.0 전문가 모드 ON: CinematicPromptDisplay */}
              {/* ============================================ */}
              {proPromptMode && v650Data ? (
                <CinematicPromptDisplay prompts={v650Data.prompts} />
              ) : (
                /* 기본 모드 OFF: 기존 단계별 프롬프트 카드 */
                <div className="promptList">
                  {sequences.map((seq, idx) => (
                    <PromptCard
                      key={seq.number}
                      seq={seq}
                      idx={idx}
                      copied={copied}
                      onCopy={copy}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 4 - 메타데이터 */}
        {/* ============================================ */}
        <div className={`step ${openSteps.meta ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('meta')}>
            <div className="stepNumBadge">{STEPS[4].num}</div>
            <div className="stepInfo">
              <div className="stepLabel">{STEPS[4].label}</div>
              <div className="stepTitle">메타데이터 — 설명·태그·썸네일</div>
            </div>
            <div className={`stepArrow ${openSteps.meta ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.meta && (
            <div className="stepBody">
              {/* 설명 */}
              <div className="metaSection">
                <div className="metaLabelRow">
                  <span className="metaLabel">📝 영상 설명</span>
                  <button
                    className={`copyBtnSm ${copied === 'desc' ? 'copied' : ''}`}
                    onClick={() => copy(description, 'desc')}
                  >
                    {copied === 'desc' ? '✓ 복사됨' : '📋 복사'}
                  </button>
                </div>
                <div className="metaHelper">SEO 최적화 + 챕터(목차) 포함. 첫 100자가 검색 미리보기에 노출됩니다.</div>
                <div className="metaContent">{description}</div>
              </div>

              {/* 태그 (YouTube) */}
              <div className="metaSection">
                <div className="metaLabelRow">
                  <span className="metaLabel">🏷️ 태그 (YouTube 태그 필드용)</span>
                  <button
                    className={`copyBtnSm ${copied === 'tags' ? 'copied' : ''}`}
                    onClick={() => copy(tags.map(t => t.tag).join(', '), 'tags')}
                  >
                    {copied === 'tags' ? '✓ 복사됨' : '📋 모두 복사'}
                  </button>
                </div>
                <div className="metaHelper">
                  YouTube 업로드 화면 "태그" 필드에 그대로 붙여넣으세요. <strong>띄어쓰기 그대로</strong> (해시태그 X, # 기호 X).
                </div>
                <div className="tagGrid">
                  {tags.map((t, i) => (
                    <div key={i} className="tagItem">
                      <div className="tagItemName">{t.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 썸네일 */}
              <div className="metaSection">
                <div className="metaLabelRow">
                  <span className="metaLabel">🖼️ 썸네일 콘셉트 3가지</span>
                </div>
                <div className="metaHelper">
                  알고리즘 검증된 3가지 콘셉트. 클릭해서 영상 프롬프트로 만들어 사용하세요.
                </div>
                <div className="thumbGrid">
                  {thumbnails.map((t, i) => (
                    <div key={i} className="thumbCard">
                      <div className="thumbType">{t.type}</div>
                      <div className="thumbDetail"><strong>배경:</strong> {t.background}</div>
                      <div className="thumbDetail"><strong>메인 텍스트:</strong> {t.mainText}</div>
                      <div className="thumbDetail"><strong>표정:</strong> {t.expression}</div>
                      <div className="thumbDetail"><strong>색상:</strong> {t.colors}</div>
                      <div className="thumbCtr">{t.ctr_estimate}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          className={`copyBtnSm ${copied === `thumb-${i}` ? 'copied' : ''}`}
                          onClick={() => copy(t.imagePromptKr, `thumb-${i}`)}
                          style={{ marginLeft: 0, fontSize: '11px' }}
                        >
                          {copied === `thumb-${i}` ? '✓ 복사' : '🇰🇷 한글 프롬프트'}
                        </button>
                        <Link
                          href={`/imagegen?prompt=${encodeURIComponent(t.imagePromptEn)}&ar=16:9`}
                          style={{
                            padding: '5px 12px',
                            background: '#c65f3b',
                            color: '#fff',
                            borderRadius: 100,
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          🎨 영상 프롬프트로
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 5 - SNS 업로드 */}
        {/* ============================================ */}
        <div className={`step ${openSteps.sns ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('sns')}>
            <div className="stepNumBadge">{STEPS[5].num}</div>
            <div className="stepInfo">
              <div className="stepLabel">{STEPS[5].label}</div>
              <div className="stepTitle">SNS 업로드 — 4개 플랫폼별 자료</div>
            </div>
            <div className={`stepArrow ${openSteps.sns ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.sns && (
            <div className="stepBody">
              {/* ============================================ */}
              {/* v6.5.0: SNS 실제 UI 모드 토글 (기본 ON) */}
              {/* ============================================ */}
              {v650Data && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: proSnsMode ? '#0a0a0a' : '#fafafa',
                  border: `1px solid ${proSnsMode ? '#0a0a0a' : '#e5e5e5'}`,
                  marginBottom: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
                onClick={() => setProSnsMode(m => !m)}
                >
                  <div style={{
                    width: 38,
                    height: 22,
                    background: proSnsMode ? '#c2410c' : '#d4d4d4',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18,
                      height: 18,
                      background: '#ffffff',
                      position: 'absolute',
                      top: 2,
                      left: proSnsMode ? 18 : 2,
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontFamily: "'JetBrains Mono', monospace", 
                      fontSize: 10, 
                      fontWeight: 700, 
                      letterSpacing: '0.18em', 
                      color: proSnsMode ? '#fbbf24' : '#c2410c',
                      textTransform: 'uppercase',
                      marginBottom: 4 
                    }}>
                      Distribution Mode {proSnsMode ? '· ON' : '· OFF'}
                    </div>
                    <div style={{ 
                      fontFamily: "'Noto Serif KR', 'Pretendard', serif",
                      fontSize: 13.5, 
                      fontWeight: 600, 
                      color: proSnsMode ? '#ffffff' : '#0a0a0a',
                      lineHeight: 1.5,
                      letterSpacing: '-0.015em',
                    }}>
                      {proSnsMode 
                        ? 'YouTube Studio · Instagram Reels · TikTok 실제 업로드 화면' 
                        : '단순 텍스트 → 클릭하여 실제 SNS UI 활성화'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* v6.5.0 실제 UI 모드 ON: SNSUploadPanel */}
              {/* ============================================ */}
              {proSnsMode && v650Data ? (
                <SNSUploadPanel formats={v650Data.sns} />
              ) : (
              /* 기본 모드 OFF: 기존 4탭 SNS 박스 */
              <>
              <div className="snsTabs">
                <button
                  className={`snsTab ${snsTab === 'youtube' ? 'active' : ''}`}
                  onClick={() => setSnsTab('youtube')}
                >
                  📹 YouTube (긴 영상)
                </button>
                <button
                  className={`snsTab ${snsTab === 'shorts' ? 'active' : ''}`}
                  onClick={() => setSnsTab('shorts')}
                >
                  📱 YouTube 쇼츠
                </button>
                <button
                  className={`snsTab ${snsTab === 'tiktok' ? 'active' : ''}`}
                  onClick={() => setSnsTab('tiktok')}
                >
                  🎵 틱톡
                </button>
                <button
                  className={`snsTab ${snsTab === 'reels' ? 'active' : ''}`}
                  onClick={() => setSnsTab('reels')}
                >
                  📷 인스타 릴스
                </button>
              </div>

              {snsTab === 'youtube' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>📹</span>
                    <div>
                      <div className="snsName">YouTube 긴 영상</div>
                      <div className="snsSpec">8분 이상 · 가로 16:9 · 광고 수익 가능</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">📌 제목</div>
                    <div className="snsFieldHelper">최대 100자. STEP 1에서 선택한 제목입니다.</div>
                    <div className="snsFieldContent">{selectedTitle}</div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">📝 카테고리</div>
                    <div className="snsFieldHelper">YouTube 카테고리 필드 추천값.</div>
                    <div className="snsFieldContent">📂 뉴스/정치 또는 교육</div>
                  </div>
                  <div style={{ padding: '14px 16px', background: '#fff8f3', borderRadius: 10, fontSize: '12.5px', color: '#666', lineHeight: 1.6 }}>
                    💡 설명·태그·썸네일은 <strong>STEP 4</strong>에서 복사하세요.
                  </div>
                </div>
              )}

              {snsTab === 'shorts' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>📱</span>
                    <div>
                      <div className="snsName">YouTube 쇼츠</div>
                      <div className="snsSpec">60초 이내 · 세로 9:16 · 빠른 확산</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📌 제목 + #Shorts
                      <button
                        className={`copyBtnSm ${copied === 'shorts-title' ? 'copied' : ''}`}
                        onClick={() => copy(`${selectedTitle.substring(0, 80)} #Shorts`, 'shorts-title')}
                      >
                        {copied === 'shorts-title' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">최대 100자. #Shorts 필수.</div>
                    <div className="snsFieldContent">{selectedTitle.substring(0, 80)} #Shorts</div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      🏷️ 해시태그 (붙여쓰기 + #)
                      <button
                        className={`copyBtnSm ${copied === 'shorts-tags' ? 'copied' : ''}`}
                        onClick={() => copy(shortsHashtags, 'shorts-tags')}
                      >
                        {copied === 'shorts-tags' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">SNS 해시태그는 띄어쓰기 X, # 기호 O.</div>
                    <div className="snsFieldContent">{shortsHashtags}</div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📝 쇼츠 대본 (1분)
                      <button
                        className={`copyBtnSm ${copied === 'shorts-full' ? 'copied' : ''}`}
                        onClick={() => copy(shortsScript.fullScript, 'shorts-full')}
                      >
                        {copied === 'shorts-full' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldContent" style={{ whiteSpace: 'pre-line' }}>{shortsScript.fullScript}</div>
                  </div>
                </div>
              )}

              {snsTab === 'tiktok' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>🎵</span>
                    <div>
                      <div className="snsName">틱톡</div>
                      <div className="snsSpec">15~60초 · 세로 9:16 · 바이럴 강함</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📌 캡션 + 해시태그
                      <button
                        className={`copyBtnSm ${copied === 'tt-cap' ? 'copied' : ''}`}
                        onClick={() => copy(`💡 ${keyword} 진짜 핵심만!\n${selectedTitle}\n\n${tiktokHashtags}`, 'tt-cap')}
                      >
                        {copied === 'tt-cap' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">캡션은 짧게. 해시태그가 핵심.</div>
                    <div className="snsFieldContent" style={{ whiteSpace: 'pre-line' }}>
                      {`💡 ${keyword} 진짜 핵심만!\n${selectedTitle}\n\n${tiktokHashtags}`}
                    </div>
                  </div>
                </div>
              )}

              {snsTab === 'reels' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>📷</span>
                    <div>
                      <div className="snsName">인스타그램 릴스</div>
                      <div className="snsSpec">15~90초 · 세로 9:16 · 일상 톤</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📌 캡션 + 해시태그
                      <button
                        className={`copyBtnSm ${copied === 'rs-cap' ? 'copied' : ''}`}
                        onClick={() => copy(`📊 ${keyword} 핵심 정리\n\n${selectedTitle}\n\n💬 댓글로 여러분 생각 공유해주세요!\n\n${instaHashtags}`, 'rs-cap')}
                      >
                        {copied === 'rs-cap' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">최대 30개 해시태그. 인기·중간·롱테일 조합.</div>
                    <div className="snsFieldContent" style={{ whiteSpace: 'pre-line' }}>
                      {`📊 ${keyword} 핵심 정리\n\n${selectedTitle}\n\n💬 댓글로 여러분 생각 공유해주세요!\n\n${instaHashtags}`}
                    </div>
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          )}
        </div>

        {/* DONE BOX */}
        <div className="doneBox">
          <div className="doneTitle">🎉 모두 완료했어요!</div>
          <div className="doneSub">
            영상 제작 후 다른 키워드로도 만들어보세요.<br />
            매번 다른 결과가 나옵니다.
          </div>
          <div className="doneActions">
            <Link href="/create" className="doneBtn">
              🎬 다른 영상 만들기
            </Link>
            <Link href="/blog" className="doneBtn outline">
              📚 노하우 보기
            </Link>
          </div>
        </div>
      </div>
    </V11Shell>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={<div />}>
      <PublishPageInner />
    </Suspense>
  );
}

// ============================================================
// 영상 제작 프롬프트 카드 (별도 컴포넌트)
// ============================================================
type SeqType = ReturnType<typeof generateVideoSequences>[0];

function PromptCard({
  seq,
  idx,
  copied,
  onCopy,
}: {
  seq: SeqType;
  idx: number;
  copied: string;
  onCopy: (text: string, key: string) => void;
}) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="promptCard">
      <div className="promptCardHead" onClick={() => setOpen(o => !o)}>
        <span className="promptCardSeq">{seq.number}</span>
        <span>{seq.title}</span>
        <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>
          ⏱️ {seq.duration}
        </span>
        <span className={`promptCardArrow ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && (
        <div className="promptCardBody">
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang kr">🇰🇷 KR · 이미지</span>
              <button
                className={`promptCopyBtn ${copied === `imk-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.imagePromptKr, `imk-${idx}`)}
              >
                {copied === `imk-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.imagePromptKr}</div>
          </div>
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang en">🇺🇸 EN · 이미지 (Midjourney/DALL-E)</span>
              <button
                className={`promptCopyBtn ${copied === `ime-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.imagePromptEn, `ime-${idx}`)}
              >
                {copied === `ime-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.imagePromptEn}</div>
          </div>
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang kr">🇰🇷 KR · 영상</span>
              <button
                className={`promptCopyBtn ${copied === `vdk-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.videoPromptKr, `vdk-${idx}`)}
              >
                {copied === `vdk-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.videoPromptKr}</div>
          </div>
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang en">🇺🇸 EN · 영상 (Runway/Sora/Google Flow/VEO/Pika)</span>
              <button
                className={`promptCopyBtn ${copied === `vde-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.videoPromptEn, `vde-${idx}`)}
              >
                {copied === `vde-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.videoPromptEn}</div>
          </div>
        </div>
      )}
    </div>
  );
}
