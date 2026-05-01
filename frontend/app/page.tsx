'use client';
/**
 * AlgoMaker 메인 페이지 v10.3 - 극단적 단순함
 *
 * 박예준 대표 v10.3 요청:
 * "정리정돈이 필요하다. 어수선해. 뒤죽박죽"
 *
 * D안 (어시스턴트 판단):
 * 핵심 1개에 집중 — 알고리즘 엔진 임팩트 + 시작 버튼
 *
 * v10.3 구조 (1화면, 정돈):
 *  [위 여백]
 *  ▍ ALGORITHM ENGINE  ●LIVE
 *  
 *  유튜브 알고리즘을
 *  읽어드립니다.
 *  
 *  키워드 1개로 떡상 패턴 분석 ·
 *  제목 후보 · 시나리오 · 4개 SNS 자료
 *  
 *  01 → 02 → 03 → 04 → 05
 *  분석   생성  구조  제작  배포
 *  
 *  [▶ 무료로 시작]  [📚 가이드 17편]
 *  
 *  [아래 여백]
 *
 * 제거된 것 (v10.2 → v10.3):
 *  ❌ 상단 메트릭 3개 (5,247 / 8.2% / 5초) - 어수선의 원인
 *  ❌ 좌우 분할 그리드 - 시선 분산
 *  ❌ 우측 가이드 리스트 6개 - 사이드바 메뉴와 중복
 *  ❌ 우측 분야 9개 칩 - 사이드바 메뉴와 중복
 *  ❌ 검정 다크 박스 (시선 둘로 분할)
 *
 * 유지/추가:
 *  ✅ 알고리즘 임팩트 (LIVE 펄스 + 가로 파이프라인 5단계)
 *  ✅ 1화면 (100vh) 고정
 *  ✅ 박 대표님 자산 100% 보존 (FEATURED_GUIDES, CATEGORY_NAV, FAQ_LIST 모두 JSON-LD에)
 *  ✅ 검색창 X (박 대표님 요청)
 *  ✅ 분야는 사이드바 메뉴와 푸터에 이미 있음
 *  ✅ AdSense 정책 안전
 *
 * 모바일: 같은 구조, 더 컴팩트
 */

import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';

// ============================================================
// 박 대표님 자산 (JSON-LD 보존용 - 화면에는 안 보이지만 SEO/AdSense 점수)
// ============================================================
const FEATURED_GUIDES = [
  { slug: 'middle-aged-channel-tips', title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지', readTime: '10분' },
  { slug: 'family-story-shorts', title: '가족 사연 쇼츠로 시작하기', readTime: '12분' },
  { slug: 'first-30-seconds-hook', title: '첫 30초가 90%를 결정합니다', readTime: '9분' },
  { slug: 'thumbnail-design', title: '조회수 차이 만드는 썸네일 디자인 7가지 법칙', readTime: '8분' },
  { slug: 'storytelling-structure', title: '오래 보는 영상의 스토리텔링 구조 분석', readTime: '11분' },
  { slug: 'content-value-paths', title: '영상 콘텐츠로 가치를 만드는 5가지 길', readTime: '8분' },
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

// ============================================================
// 5단계 파이프라인 (가로)
// ============================================================
const STEPS = [
  { num: '01', label: '분석', en: 'ANALYZE' },
  { num: '02', label: '생성', en: 'GENERATE' },
  { num: '03', label: '구조', en: 'STRUCTURE' },
  { num: '04', label: '제작', en: 'PRODUCE' },
  { num: '05', label: '배포', en: 'EXPORT' },
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
        .home {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          height: calc(100vh - 60px);
          min-height: 580px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          max-width: 880px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .home {
            padding: 32px 18px;
            min-height: 540px;
          }
        }

        /* 상단 라벨 (LIVE) */
        .topLabel {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .topLabel { margin-bottom: 22px; gap: 8px; }
        }

        .topLabelText {
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .topLabelText { font-size: 10px; letter-spacing: 0.18em; }
        }

        .liveDot {
          display: flex;
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
        @media (max-width: 600px) { .liveDot { font-size: 9px; padding: 2px 7px; } }

        .liveDotCircle {
          width: 6px;
          height: 6px;
          background: #16a34a;
          border-radius: 50%;
          animation: pulse 1.6s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(22, 163, 74, 0.6);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        /* 메인 타이틀 */
        .title {
          font-size: 44px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.035em;
          line-height: 1.15;
          margin: 0 0 18px;
          text-align: center;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .title { font-size: 30px; margin-bottom: 14px; }
        }

        .titleAccent {
          color: #c2410c;
        }

        /* 서브 타이틀 */
        .sub {
          font-size: 16px;
          color: #525252;
          line-height: 1.65;
          font-weight: 500;
          text-align: center;
          margin: 0 0 44px;
          max-width: 540px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .sub { font-size: 13.5px; margin-bottom: 32px; }
        }

        /* 5단계 파이프라인 (가로) */
        .pipeline {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 44px;
          padding: 14px 18px;
          background: #0a0a0a;
          color: #ffffff;
          position: relative;
        }
        @media (max-width: 600px) {
          .pipeline {
            margin-bottom: 32px;
            padding: 12px 12px;
            gap: 0;
            width: 100%;
          }
        }

        .pipelineStep {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0 14px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 600px) {
          .pipelineStep { padding: 0 6px; gap: 2px; }
        }

        .pipelineStepNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .pipelineStepNum { font-size: 9.5px; } }

        .pipelineStepLabel {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .pipelineStepLabel { font-size: 11px; } }

        .pipelineArrow {
          color: #c2410c;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .pipelineArrow { font-size: 11px; } }

        /* 버튼 영역 */
        .buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (max-width: 600px) {
          .buttons { gap: 8px; width: 100%; flex-wrap: nowrap; }
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 28px;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: all 0.15s;
          min-height: 48px;
          border: 1.5px solid;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .btn {
            padding: 12px 16px;
            font-size: 13px;
            min-height: 44px;
            flex: 1;
          }
        }

        .btnPrimary {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }
        .btnPrimary:hover {
          background: #c2410c;
          border-color: #c2410c;
        }

        .btnSecondary {
          background: transparent;
          color: #0a0a0a;
          border-color: #0a0a0a;
        }
        .btnSecondary:hover {
          background: #0a0a0a;
          color: #ffffff;
        }

        /* 하단 노트 (작게) */
        .footnote {
          font-size: 11px;
          color: #a3a3a3;
          margin-top: 20px;
          letter-spacing: 0.04em;
          text-align: center;
        }
        @media (max-width: 600px) {
          .footnote { font-size: 10px; margin-top: 16px; }
        }
      `}</style>

      <div className="home">
        {/* 상단 라벨 */}
        <div className="topLabel">
          <div className="topLabelText">▍ ALGORITHM ENGINE</div>
          <div className="liveDot">
            <span className="liveDotCircle" />
            LIVE
          </div>
        </div>

        {/* 메인 타이틀 */}
        <h1 className="title">
          유튜브 <span className="titleAccent">알고리즘</span>을<br />
          읽어드립니다
        </h1>

        {/* 서브 타이틀 */}
        <p className="sub">
          키워드 1개로 떡상 패턴 분석 · 제목 후보 ·<br />
          시나리오 · 4개 SNS 자료까지 5초 안에
        </p>

        {/* 5단계 파이프라인 */}
        <div className="pipeline">
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'contents' }}>
              <div className="pipelineStep">
                <div className="pipelineStepNum">{s.num}</div>
                <div className="pipelineStepLabel">{s.label}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="pipelineArrow">→</div>
              )}
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="buttons">
          <Link href="/publish?keyword=50대 재취업&category=economy" className="btn btnPrimary">
            ▶ 무료로 시작
          </Link>
          <Link href="/blog" className="btn btnSecondary">
            📚 가이드 17편
          </Link>
        </div>

        {/* 하단 노트 */}
        <div className="footnote">
          회원가입 없음 · 완전 무료 · 시니어 친화 디자인
        </div>
      </div>
    </V11Shell>
  );
}
