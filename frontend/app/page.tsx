'use client';
/**
 * AlgoMaker 메인 랜딩 페이지 v4.0
 *
 * 박예준 대표 비전:
 * "광고 보고서라도 꼭 해야 할 가치"
 *
 * 2026 트렌드 반영:
 * - SEO (전통 검색 최적화)
 * - AEO (Answer Engine - ChatGPT, Perplexity 인용 가능)
 * - GEO (Generative Engine - AI 추천 받기)
 * - Story-driven Hero (Before → After)
 * - Interactive Live Demo
 * - Bold Typography + Micro-animation
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import AdSlot from './_shared/AdSlot';

// ============================================================
// 라이브 데모용 - 도메인별 떡상 후크 미리보기
// ============================================================
const DEMO_HOOKS: Record<string, { domain: string; hook: string; trigger: string }> = {
  부동산: {
    domain: '재테크',
    hook: '부동산 매물 하나로 6개월 만에 8천만원 차익. 40대 평범한 직장인이었어요.',
    trigger: '수치 중심 트리거',
  },
  주식: {
    domain: '재테크',
    hook: '주식, 1년 만에 자본금 5천만원으로 1억 만든 직장인 이야기.',
    trigger: '수치 + 경험담',
  },
  영어: {
    domain: '교육',
    hook: '학원 한 번 안 가고 6개월 만에 토익 850점. 하루 15분만 투자한 결과.',
    trigger: '경험담 + 시간효율',
  },
  '영어 회화': {
    domain: '교육',
    hook: '학원 안 가고 외국인이랑 30분 대화 가능해진 비결, 6개월의 기록.',
    trigger: '경험담 중심',
  },
  다이어트: {
    domain: '건강',
    hook: '3개월 -12kg, 헬스장 한 번 안 갔습니다. 식단 강박도 없이.',
    trigger: '비포애프터 중심',
  },
  AI: {
    domain: 'AI/디지털',
    hook: '지금 보신 이 영상, 빵원으로 만들었습니다. 그것도 횟수 제한 없이 무제한.',
    trigger: '무료/무제한 중심',
  },
  은퇴: {
    domain: '시니어',
    hook: '은퇴 준비자였던 제가 직접 2년 도전한 진짜 이야기. 60대 시작해도 늦지 않습니다.',
    trigger: '연령 가능성 증명',
  },
  코딩: {
    domain: '자기계발',
    hook: '평범한 직장인이 하루 30분으로 6개월 만에 코딩 마스터한 방법.',
    trigger: '평범인 변신',
  },
  요리: {
    domain: '음식',
    hook: '재료 3개로 5분 만에 끝. 자취생도 매번 성공하는 진짜 방법.',
    trigger: '쉬움 강조',
  },
  여행: {
    domain: '여행',
    hook: '3박 4일 50만원으로 다녀온 진짜 일정. 현지인만 아는 코스 공개합니다.',
    trigger: '가성비 + 비밀',
  },
  시어머니: {
    domain: '가족 사연',
    hook: '시집 10년 만에 처음 한 마디 했습니다. 그날따라 진심으로 풀어놓겠습니다.',
    trigger: '사이다형 (참다가 폭발)',
  },
  며느리: {
    domain: '가족 사연',
    hook: '며느리 5년 차의 진짜 이야기. 명절에 결국 한 번에 터졌습니다.',
    trigger: '사이다형 (고부 갈등)',
  },
  가족사연: {
    domain: '가족 사연',
    hook: '오랫동안 묻어둔 가족 이야기, 한 번에 풀어놓겠습니다. 누구나 한 번쯤 겪어보셨을 거예요.',
    trigger: '보편 공감 (큐레이션)',
  },
  황혼사랑: {
    domain: '가족 사연',
    hook: '60대에 만난 인생 2막의 시작이었어요. 누구도 예상 못 한 반전, 끝까지 들어주세요.',
    trigger: '인생 반전형',
  },
  수면사연: {
    domain: '가족 사연',
    hook: '오늘 밤 편히 잠드시기 전에 들려드릴 이야기. 마음이 따뜻해질 거예요.',
    trigger: '수면 라디오형',
  },
};

// 키워드 → 도메인 매핑 (간단 버전)
function getKeywordPreview(keyword: string) {
  const k = keyword.trim();
  if (!k) return null;
  
  // 정확 매칭
  if (DEMO_HOOKS[k]) return DEMO_HOOKS[k];
  
  // 부분 매칭 - family 우선 + 5가지 톤 변형 자동 분기
  if (/황혼|노후 사랑|인생 2막|인생.{0,2}반전|시니어 로맨스/.test(k)) return DEMO_HOOKS['황혼사랑'];
  if (/수면|잠.{0,2}자|잠들기|밤에 듣는|베개|잘자/.test(k)) return DEMO_HOOKS['수면사연'];
  if (/시어머니|며느리|사위|장인|장모|시댁|친정|가족.*사연|시집|이혼|명절|제사|시동생|동서|올케|고부/.test(k)) return DEMO_HOOKS['시어머니'];
  if (/부동산|아파트|매물|청약|분양/.test(k)) return DEMO_HOOKS['부동산'];
  if (/주식|투자|코인|비트|증권/.test(k)) return DEMO_HOOKS['주식'];
  if (/영어|토익|토플|회화/.test(k)) return DEMO_HOOKS['영어 회화'];
  if (/다이어트|살빼기|체중|헬스|운동/.test(k)) return DEMO_HOOKS['다이어트'];
  if (/ai|chatgpt|gpt|미드저니|notebook|gemini/i.test(k)) return DEMO_HOOKS['AI'];
  if (/은퇴|시니어|50대|60대|70대|노후/.test(k)) return DEMO_HOOKS['은퇴'];
  if (/코딩|프로그래밍|개발/.test(k)) return DEMO_HOOKS['코딩'];
  if (/요리|레시피|음식/.test(k)) return DEMO_HOOKS['요리'];
  if (/여행|투어|관광/.test(k)) return DEMO_HOOKS['여행'];
  
  // 기본
  return {
    domain: '일반',
    hook: `${k} 직접 1년 해본 결과를 솔직하게 정리했습니다. 끝까지만 봐주세요.`,
    trigger: '경험담 + 진정성',
  };
}

// ============================================================
// 8개 분야별 트리거 매핑 (AEO 핵심 정보)
// ============================================================
const TRIGGER_MATRIX = [
  { emoji: '🏠', domain: '부동산/재테크', trigger: '수치 + 시간단축', example: '"6개월 만에 8천만원 차익"' },
  { emoji: '🗣️', domain: '영어/외국어', trigger: '경험담 + 시간효율', example: '"학원 안 가고 토익 850점"' },
  { emoji: '💪', domain: '다이어트/건강', trigger: '비포애프터', example: '"3개월 -12kg, 헬스장 X"' },
  { emoji: '📚', domain: '자기계발/공부', trigger: '시간효율 + 평범인변신', example: '"하루 30분으로 변화"' },
  { emoji: '🤖', domain: 'AI/디지털 도구', trigger: '무료 + 무제한', example: '"빵원으로, 무제한 사용"' },
  { emoji: '👴', domain: '시니어/은퇴', trigger: '연령 가능성', example: '"60대도 가능합니다"' },
  { emoji: '💝', domain: '가족 사연/감동', trigger: '공감 + 카타르시스', example: '"시집 10년 만에 처음 한 말"' },
  { emoji: '🍳', domain: '요리/맛집', trigger: '쉬움 + 검증', example: '"재료 3개로 5분 컷"' },
  { emoji: '✈️', domain: '여행/취미', trigger: '가성비 + 비밀', example: '"3박 50만원, 현지인 코스"' },
];

// ============================================================
// FAQ - AEO 핵심 (ChatGPT, Perplexity 인용 형식)
// ============================================================
const FAQ_LIST = [
  {
    q: 'AlgoMaker는 무엇인가요?',
    a: 'AlgoMaker는 키워드 하나만 입력하면 AI가 영상 제목, 태그, 대본, 썸네일, SNS 메타데이터를 모두 자동 생성해주는 무료 도구입니다. 부동산은 수치 중심, 영어는 경험담 중심처럼 분야별로 다른 떡상 트리거를 자동 매칭하는 것이 특징입니다.',
  },
  {
    q: '다른 AI 글쓰기 도구와 무엇이 다른가요?',
    a: '키워드별로 다른 떡상 트리거를 자동 매칭한다는 점이 가장 큰 차이입니다. 부동산은 수치 중심, 영어는 경험담 중심, 다이어트는 비포애프터 중심으로 각 분야에 최적화된 시나리오를 만듭니다. 또한 "다시 생성" 버튼을 누를 때마다 완전히 새로운 결과가 나와 100명이 같은 키워드를 입력해도 100가지 다른 시나리오가 만들어집니다.',
  },
  {
    q: '정말 완전 무료인가요? 회원가입은요?',
    a: '네, 100% 무료입니다. 회원가입, 신용카드 등록, 결제 절대 필요 없습니다. 서비스 운영비는 Google AdSense 광고 수익으로 충당하며, 사용자 데이터를 판매하거나 유료 구독으로 전환하지 않습니다.',
  },
  {
    q: '어떤 분야의 영상을 만들 수 있나요?',
    a: '8개 주요 분야가 자동 인식됩니다: 재테크/부동산, 영어/외국어, 다이어트/건강, 자기계발/공부, AI/디지털 도구, 시니어/은퇴, 요리/맛집, 여행/취미. 키워드만 입력하면 AI가 분야를 자동 감지해 맞는 트리거를 적용합니다.',
  },
  {
    q: '생성된 결과물은 어디서 사용할 수 있나요?',
    a: '유튜브, 유튜브 쇼츠, 틱톡, 인스타그램 릴스 4개 SNS 플랫폼에 그대로 사용 가능한 메타데이터를 제공합니다. 영상 대본 7단계 시퀀스, 한글/영문 영상 생성 프롬프트, 썸네일 콘셉트도 포함됩니다.',
  },
  {
    q: '시니어층(40대~70대)도 사용할 수 있나요?',
    a: '네, 그게 주 타겟입니다. 회원가입도 결제도 필요 없고, 키워드 하나만 입력하면 끝입니다. 디지털 도구가 익숙하지 않으셔도 1분 안에 영상 자료가 완성됩니다. 시니어층(40대~70대) 시청자에게 인기 있는 분야 - 시니어 라이프, 재테크, 건강, 가족 관계, 사연/감동 콘텐츠 - 위주로 트리거가 최적화되어 있습니다.',
  },
];

// ============================================================
// Definition Box - AEO/GEO 핵심
// ChatGPT, Perplexity가 인용하기 좋은 명확한 정의
// 사용자 가치 중심 (운영자 정보는 /about 하단에만)
// ============================================================
const DEFINITION = {
  what: 'AlgoMaker는 키워드 하나로 영상 콘텐츠 자료(제목, 태그, 대본, 썸네일, SNS 메타데이터)를 자동 생성하는 무료 AI 도구입니다.',
  feature: '8개 도메인을 자동 인식하고 분야별로 다른 떡상 트리거를 매칭합니다. 부동산은 수치 중심, 영어는 경험담 중심, 다이어트는 비포애프터 중심으로 작동합니다.',
  how: '키워드 하나만 입력하면 AI가 영상 제목 3개, 태그 13개, 대본 7단계 시퀀스, 썸네일 콘셉트, 4개 SNS 메타데이터를 자동 생성합니다.',
  why: '회원가입, 결제, 신용카드 등록이 일절 필요 없으며 광고 시청만으로 무제한 사용 가능합니다.',
};

export default function HomePage() {
  const router = useRouter();
  const [demoKeyword, setDemoKeyword] = useState('');
  const [demoResult, setDemoResult] = useState<ReturnType<typeof getKeywordPreview>>(null);
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 라이브 데모: 키워드 입력 시 실시간 미리보기
  useEffect(() => {
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    if (!demoKeyword.trim()) {
      setDemoResult(null);
      return;
    }
    demoTimerRef.current = setTimeout(() => {
      setDemoResult(getKeywordPreview(demoKeyword));
    }, 300);
  }, [demoKeyword]);

  // 데모 키워드로 실제 시작
  const handleDemoStart = () => {
    if (demoKeyword.trim()) {
      router.push(`/create?demo=${encodeURIComponent(demoKeyword)}`);
    } else {
      router.push('/create');
    }
  };

  return (
    <V11Shell>
      {/* AEO/GEO용 - 페이지 상단 hidden 정의 (AI 인용용) */}
      <div style={{ position: 'absolute', left: '-9999px', overflow: 'hidden' }} aria-hidden="false">
        <h1>AlgoMaker - AI 영상 콘텐츠 자료 자동 생성 도구</h1>
        <p>
          <strong>AlgoMaker란?</strong> {DEFINITION.what}
        </p>
        <p>
          <strong>차별점:</strong> {DEFINITION.feature}
        </p>
        <p>
          <strong>작동 방식:</strong> {DEFINITION.how}
        </p>
        <p>
          <strong>비용:</strong> {DEFINITION.why}
        </p>
      </div>

      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 0 24px 60px; }
        @media (max-width: 600px) { .page { padding: 0 18px 40px; } }

        /* ============================================ */
        /* [1] HERO - 떡상 후크 */
        /* ============================================ */
        .hero {
          padding: 64px 0 48px;
          text-align: center;
          position: relative;
        }
        @media (max-width: 600px) { .hero { padding: 40px 0 32px; } }

        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: 0.04em;
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .heroTitle {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.03em;
          color: #1a1a1a;
        }
        @media (max-width: 720px) { .heroTitle { font-size: 32px; } }
        @media (max-width: 480px) { .heroTitle { font-size: 26px; } }

        .accent {
          background: linear-gradient(120deg, #c65f3b 0%, #ea7755 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .heroSub {
          font-size: 17px;
          color: #555;
          line-height: 1.7;
          margin: 0 auto 28px;
          max-width: 640px;
        }
        @media (max-width: 600px) { .heroSub { font-size: 15px; } }

        /* 핵심 통계 (proof density) */
        .heroStats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 600px;
          margin: 0 auto 32px;
        }
        @media (max-width: 600px) {
          .heroStats { grid-template-columns: 1fr; gap: 8px; }
        }
        .heroStat {
          padding: 16px 12px;
          background: #fff;
          border: 1px solid #fde0c5;
          border-radius: 12px;
          text-align: center;
        }
        .heroStatNum {
          font-size: 22px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .heroStatLabel {
          font-size: 12px;
          color: #666;
          font-weight: 600;
          line-height: 1.4;
        }

        /* ============================================ */
        /* [2] LIVE DEMO - 라이브 데모 */
        /* ============================================ */
        .demoSection {
          margin: 0 auto 48px;
          max-width: 720px;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1.5px solid #fbbf24;
          border-radius: 16px;
          padding: 28px 24px;
        }
        @media (max-width: 600px) {
          .demoSection { padding: 22px 16px; }
        }
        .demoTitle {
          font-size: 16px;
          font-weight: 800;
          color: #92400e;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .demoDesc {
          font-size: 13px;
          color: #78350f;
          margin: 0 0 18px;
          text-align: center;
          line-height: 1.6;
        }
        .demoInputWrap {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }
        @media (max-width: 480px) {
          .demoInputWrap { flex-direction: column; }
        }
        .demoInput {
          flex: 1;
          padding: 14px 18px;
          font-size: 16px;
          font-weight: 700;
          border: 2px solid #fff;
          border-radius: 100px;
          background: #fff;
          color: #1a1a1a;
          outline: none;
          font-family: inherit;
          transition: all 0.15s;
          min-height: 50px;
        }
        .demoInput:focus {
          border-color: #c65f3b;
          box-shadow: 0 0 0 3px rgba(198, 95, 59, 0.15);
        }
        .demoInput::placeholder { color: #aaa; }
        .demoBtn {
          padding: 14px 26px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.15s;
          min-height: 50px;
        }
        .demoBtn:hover {
          background: #b04e2d;
          transform: translateY(-1px);
        }

        .demoResult {
          background: #fff;
          border-radius: 12px;
          padding: 18px 20px;
          border-left: 4px solid #c65f3b;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .demoResultLabel {
          font-size: 11px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .demoResultTags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .demoTag {
          padding: 3px 10px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .demoHook {
          font-size: 14.5px;
          color: #1a1a1a;
          line-height: 1.7;
          font-weight: 500;
        }
        @media (max-width: 600px) { .demoHook { font-size: 13.5px; } }
        
        .demoHints {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 14px;
        }
        .demoHint {
          padding: 5px 12px;
          background: rgba(255,255,255,0.7);
          color: #92400e;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(146, 64, 14, 0.15);
          transition: all 0.15s;
        }
        .demoHint:hover {
          background: #fff;
          border-color: #c65f3b;
        }

        /* ============================================ */
        /* [공통] 섹션 */
        /* ============================================ */
        .section {
          margin-bottom: 60px;
        }
        @media (max-width: 600px) { .section { margin-bottom: 44px; } }
        .sectionHeader {
          text-align: center;
          margin-bottom: 32px;
        }
        .sectionTitle {
          font-size: 30px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0 0 10px;
          line-height: 1.25;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 22px; } }
        .sectionSub {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
        }
        @media (max-width: 600px) { .sectionSub { font-size: 13.5px; } }

        /* ============================================ */
        /* [3] BEFORE vs AFTER */
        /* ============================================ */
        .compareGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 720px) { .compareGrid { grid-template-columns: 1fr; } }
        .compareCard {
          padding: 24px 22px;
          border-radius: 14px;
          line-height: 1.7;
        }
        .compareCard.before {
          background: #fafafa;
          border: 1px solid #e5e5e5;
        }
        .compareCard.after {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 2px solid #c65f3b;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.1);
        }
        .compareLabel {
          display: inline-block;
          padding: 4px 11px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          border-radius: 100px;
          margin-bottom: 12px;
        }
        .compareCard.before .compareLabel {
          background: #888;
          color: #fff;
        }
        .compareCard.after .compareLabel {
          background: #c65f3b;
          color: #fff;
        }
        .compareTitle {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 10px;
        }
        .compareText {
          font-size: 14px;
          color: #444;
          line-height: 1.75;
          margin: 0;
        }
        .compareCard.before .compareText { color: #888; }

        /* ============================================ */
        /* [4] 8개 분야별 트리거 매트릭스 */
        /* ============================================ */
        .matrixGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (max-width: 600px) { .matrixGrid { grid-template-columns: 1fr; gap: 10px; } }
        .matrixCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: all 0.2s;
        }
        .matrixCard:hover {
          border-color: #c65f3b;
          background: #fffbf8;
          transform: translateY(-1px);
        }
        .matrixEmoji {
          font-size: 28px;
          flex-shrink: 0;
          line-height: 1;
        }
        .matrixContent { flex: 1; min-width: 0; }
        .matrixDomain {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .matrixTrigger {
          font-size: 12px;
          color: #c65f3b;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .matrixExample {
          font-size: 12.5px;
          color: #666;
          line-height: 1.55;
          font-style: italic;
        }

        /* ============================================ */
        /* [5] FAQ - AEO 핵심 */
        /* ============================================ */
        .faqList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faqItem {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }
        .faqQuestion {
          padding: 18px 22px;
          background: #fafafa;
          font-size: 15px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1.5;
        }
        @media (max-width: 600px) {
          .faqQuestion { padding: 16px 18px; font-size: 14px; }
        }
        .faqQuestion::before {
          content: 'Q. ';
          color: #c65f3b;
          font-weight: 800;
        }
        .faqAnswer {
          padding: 18px 22px;
          font-size: 14px;
          color: #444;
          line-height: 1.75;
          border-top: 1px solid #f0f0f0;
        }
        @media (max-width: 600px) {
          .faqAnswer { padding: 16px 18px; font-size: 13px; }
        }
        .faqAnswer::before {
          content: 'A. ';
          color: #c65f3b;
          font-weight: 800;
        }

        /* ============================================ */
        /* [6] HOW IT WORKS */
        /* ============================================ */
        .howGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) { .howGrid { grid-template-columns: 1fr 1fr; } }
        .howCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 22px 18px;
          text-align: center;
          transition: all 0.2s;
        }
        .howCard:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
        }
        .howNum {
          width: 36px;
          height: 36px;
          margin: 0 auto 10px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 800;
        }
        .howTitle {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .howDesc {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }

        /* ============================================ */
        /* [7] FINAL CTA */
        /* ============================================ */
        .finalCTA {
          background: linear-gradient(135deg, #c65f3b 0%, #ea7755 100%);
          border-radius: 18px;
          padding: 48px 32px;
          text-align: center;
          margin: 60px 0 0;
        }
        @media (max-width: 600px) {
          .finalCTA { padding: 36px 22px; }
        }
        .finalCTATitle {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          margin: 0 0 10px;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .finalCTATitle { font-size: 22px; } }
        .finalCTASub {
          font-size: 15px;
          color: #ffe0d0;
          margin: 0 0 24px;
          line-height: 1.6;
        }
        .finalCTABtn {
          display: inline-block;
          padding: 16px 36px;
          background: #fff;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.15s;
        }
        .finalCTABtn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        {/* ============================================ */}
        {/* [1] HERO */}
        {/* ============================================ */}
        <section className="hero">
          <div className="heroBadge">
            <span>✓</span>
            <span>완전 무료 · 회원가입 불필요 · 광고 보고 무제한 사용</span>
          </div>

          <h1 className="heroTitle">
            키워드 하나로<br />
            <span className="accent">떡상 시나리오</span>가 만들어집니다
          </h1>

          <p className="heroSub">
            AI가 분야별로 다른 트리거를 자동 매칭합니다.<br />
            부동산은 수치 중심, 영어는 경험담 중심, 다이어트는 비포애프터 중심으로.
          </p>

          <div className="heroStats">
            <div className="heroStat">
              <div className="heroStatNum">100명 = 100가지</div>
              <div className="heroStatLabel">매번 다른 결과</div>
            </div>
            <div className="heroStat">
              <div className="heroStatNum">8개 분야</div>
              <div className="heroStatLabel">자동 인식 + 트리거 매칭</div>
            </div>
            <div className="heroStat">
              <div className="heroStatNum">무제한 무료</div>
              <div className="heroStatLabel">결제 / 신용카드 X</div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* [2] LIVE DEMO - 라이브 데모 (혹하게!) */}
        {/* ============================================ */}
        <section className="demoSection">
          <h2 className="demoTitle">🔥 키워드 하나만 입력해보세요</h2>
          <p className="demoDesc">
            실시간으로 어떤 떡상 시나리오가 만들어지는지 미리 확인하세요
          </p>

          <div className="demoInputWrap">
            <input
              type="text"
              className="demoInput"
              placeholder="예: 부동산, 영어 회화, 다이어트, AI 영상..."
              value={demoKeyword}
              onChange={(e) => setDemoKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDemoStart()}
              maxLength={30}
            />
            <button className="demoBtn" onClick={handleDemoStart}>
              {demoKeyword.trim() ? '시작 →' : '바로 시작'}
            </button>
          </div>

          {demoResult && (
            <div className="demoResult" key={demoKeyword}>
              <div className="demoResultLabel">✨ 떡상 시나리오 미리보기 (예시 후크)</div>
              <div className="demoResultTags">
                <span className="demoTag">📂 {demoResult.domain}</span>
                <span className="demoTag">🎯 {demoResult.trigger}</span>
              </div>
              <div className="demoHook">"{demoResult.hook}"</div>
            </div>
          )}

          {!demoResult && (
            <div className="demoHints">
              <button className="demoHint" onClick={() => setDemoKeyword('부동산')}>부동산</button>
              <button className="demoHint" onClick={() => setDemoKeyword('영어 회화')}>영어 회화</button>
              <button className="demoHint" onClick={() => setDemoKeyword('다이어트')}>다이어트</button>
              <button className="demoHint" onClick={() => setDemoKeyword('시어머니 사연')}>시어머니 사연</button>
              <button className="demoHint" onClick={() => setDemoKeyword('황혼 사랑')}>황혼 사랑</button>
            </div>
          )}
        </section>

        <div className="adArea">
          <AdSlot slot="home-mid-1" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* [3] BEFORE vs AFTER */}
        {/* ============================================ */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">일반 AI 글쓰기 vs AlgoMaker</h2>
            <p className="sectionSub">같은 키워드 "부동산" 입력 시 결과가 이렇게 다릅니다</p>
          </div>
          <div className="compareGrid">
            <div className="compareCard before">
              <span className="compareLabel">🟡 일반 AI 도구</span>
              <h3 className="compareTitle">일기장 톤 / 추상적</h3>
              <p className="compareText">
                "솔직히 처음에는 부동산을 만만하게 봤습니다. 하지만 시간이 지나면서 한 가지 비결을 알게 되었어요. 오늘은 그 이야기를 나눠드리려 합니다..."
              </p>
            </div>
            <div className="compareCard after">
              <span className="compareLabel">🔥 AlgoMaker 떡상 엔진</span>
              <h3 className="compareTitle">결과 먼저 / 구체적 수치</h3>
              <p className="compareText">
                "지금 보여드릴 부동산 매물 하나로 6개월 만에 8천만원 차익 만들었습니다. 40대 평범한 직장인이었어요. 학력도 자본도 평범했습니다..."
              </p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.6 }}>
            💡 같은 키워드도 매번 다른 결과 · 100명이 입력해도 100가지 시나리오
          </p>
        </section>

        {/* ============================================ */}
        {/* [4] 8개 분야 트리거 매트릭스 (AEO 핵심) */}
        {/* ============================================ */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">분야별 다른 떡상 트리거</h2>
            <p className="sectionSub">AI가 키워드를 분석해 8개 도메인 중 하나로 자동 매칭합니다</p>
          </div>
          <div className="matrixGrid">
            {TRIGGER_MATRIX.map((item, i) => (
              <div key={i} className="matrixCard">
                <div className="matrixEmoji">{item.emoji}</div>
                <div className="matrixContent">
                  <div className="matrixDomain">{item.domain}</div>
                  <div className="matrixTrigger">{item.trigger}</div>
                  <div className="matrixExample">{item.example}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="adArea">
          <AdSlot slot="home-mid-2" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* [5] FAQ - AEO ★★★ */}
        {/* ============================================ */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">자주 묻는 질문</h2>
            <p className="sectionSub">사용 전 궁금하신 점들</p>
          </div>
          <div className="faqList">
            {FAQ_LIST.map((item, i) => (
              <div key={i} className="faqItem">
                <div className="faqQuestion">{item.q}</div>
                <div className="faqAnswer">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* [6] HOW IT WORKS - 4단계 */}
        {/* ============================================ */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">사용은 단 4단계</h2>
            <p className="sectionSub">키워드 하나에서 영상 자료 완성까지 1분</p>
          </div>
          <div className="howGrid">
            <div className="howCard">
              <div className="howNum">1</div>
              <div className="howTitle">분야 선택</div>
              <div className="howDesc">12개 카테고리에서<br />원하는 분야</div>
            </div>
            <div className="howCard">
              <div className="howNum">2</div>
              <div className="howTitle">키워드 입력</div>
              <div className="howDesc">관심 있는 주제<br />키워드 1개</div>
            </div>
            <div className="howCard">
              <div className="howNum">3</div>
              <div className="howTitle">AI 자동 분석</div>
              <div className="howDesc">분야별 트리거<br />자동 매칭</div>
            </div>
            <div className="howCard">
              <div className="howNum">4</div>
              <div className="howTitle">결과 받기</div>
              <div className="howDesc">제목 · 태그 · 대본<br />복사해서 사용</div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* [7] FINAL CTA */}
        {/* ============================================ */}
        <section className="finalCTA">
          <h2 className="finalCTATitle">지금 바로 시작해보세요</h2>
          <p className="finalCTASub">
            회원가입도, 결제도, 신용카드도 필요 없습니다.<br />
            키워드 하나만 입력하면 1분 안에 결과 확인.
          </p>
          <Link href="/create" className="finalCTABtn">
            🚀 무료로 시작하기
          </Link>
        </section>
      </div>
    </V11Shell>
  );
}
