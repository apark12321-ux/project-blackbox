'use client';
/**
 * AlgoMaker 메인 페이지 v8.0 (B안 - 다이나믹 떡상 도구 느낌)
 *
 * 박예준 대표 비전:
 * "SNS 초보자가 사이트에 딱 왔을 때 뭔가 필이 팍 꽂혀야 한다"
 * "100명이 같은 키워드 입력해도 100가지 결과"
 * "겉으로는 안보이고, 뒷단에서 알고리즘이 움직임"
 *
 * v8.0 변경사항 (2026.04.30):
 * - 🔥 히어로 영역 다이나믹 리뉴얼 (다크 그라데이션 + 키워드 입력창)
 * - 📊 시청 유지율 차트 시각화 (떡상 곡선)
 * - ⚡ 실시간 카운터 애니메이션
 * - 🎯 AI 도구 vs 일반 도구 비교
 * - 🏷️ 인기 키워드 칩 (한 번에 시작)
 * - ✅ 박 대표님 가이드 6편, FAQ, 카테고리 9개 100% 유지
 * - ✅ AEO/GEO 최적화 그대로 유지
 */

import { useState } from 'react';
import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import AdSlot from './_shared/AdSlot';

// ============================================================
// 추천 가이드 (메인에 노출할 핵심 글) - v7.0 그대로 유지
// ============================================================
const FEATURED_GUIDES = [
  {
    slug: 'middle-aged-channel-tips',
    emoji: '👴',
    category: '시니어 입문',
    title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
    subtitle: '퇴직 후 영상 시작하시는 분들을 위한 현실적 가이드',
    readTime: '10분',
    badge: '입문자 추천',
  },
  {
    slug: 'family-story-shorts',
    emoji: '💝',
    category: '가족 사연',
    title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
    subtitle: '시니어층이 가장 빠르게 시작한 영상 카테고리 분석',
    readTime: '12분',
    badge: '인기',
  },
  {
    slug: 'first-30-seconds-hook',
    emoji: '🎬',
    category: '영상 제작',
    title: '첫 30초가 90%를 결정합니다 - 후크(Hook) 작성법',
    subtitle: '시청자가 끝까지 보게 만드는 영상 시작 비결',
    readTime: '9분',
    badge: '필독',
  },
  {
    slug: 'thumbnail-design',
    emoji: '🖼️',
    category: '디자인',
    title: '조회수 차이 만드는 썸네일 디자인 7가지 법칙',
    subtitle: '한글 텍스트가 잘 들어간 썸네일 만드는 비결',
    readTime: '8분',
  },
  {
    slug: 'storytelling-structure',
    emoji: '📖',
    category: '스토리텔링',
    title: '오래 보는 영상의 스토리텔링 구조 분석',
    subtitle: '시청자가 끝까지 보는 영상의 4단계 이야기 공식',
    readTime: '11분',
  },
  {
    slug: 'content-value-paths',
    emoji: '💡',
    category: '콘텐츠 가치',
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    subtitle: '내가 잘하는 것을 영상으로 풀어낼 때 다양한 길',
    readTime: '8분',
  },
];

// ============================================================
// 분야별 탐색 (시니어 친화 우선 정렬) - v7.0 그대로 유지
// ============================================================
const CATEGORY_NAV = [
  { id: 'senior', emoji: '🌳', name: '시니어 라이프', desc: '50대~70대 인생 이야기' },
  { id: 'family', emoji: '💝', name: '가족 사연', desc: '진심 담은 일상 이야기' },
  { id: 'economy', emoji: '📈', name: '재테크 / 노후', desc: '돈 관리, 연금, 자산' },
  { id: 'realestate', emoji: '🏘️', name: '부동산', desc: '청약, 투자, 동네 변화' },
  { id: 'health', emoji: '💪', name: '건강 / 운동', desc: '집에서 하는 운동, 식단' },
  { id: 'food', emoji: '🍳', name: '요리 / 맛집', desc: '집밥 레시피, 동네 맛집' },
  { id: 'travel', emoji: '🗺️', name: '여행 / 취미', desc: '국내외 여행, 즐거움' },
  { id: 'aitech', emoji: '🤖', name: 'AI / 디지털', desc: '핸드폰, AI 도구 입문' },
  { id: 'language', emoji: '🌏', name: '외국어', desc: '영어, 일본어 학습 후기' },
];

// ============================================================
// FAQ - AEO/GEO 최적화 - v7.0 그대로 유지
// ============================================================
const FAQ_LIST = [
  {
    q: 'AlgoMaker가 어떤 사이트인가요?',
    a: '50대~70대 시니어층을 위한 영상 제작 도움말 채널입니다. 영상 만들기 처음 시작하시는 분들을 위한 가이드 글이 메인 콘텐츠이고, 키워드만 입력하면 AI가 영상 자료(제목, 대본 흐름, 태그 등)를 만들어주는 보조 도구도 함께 제공합니다. 모든 기능은 완전 무료입니다.',
  },
  {
    q: '시니어층(40대~70대)도 사용할 수 있나요?',
    a: '네, 그게 주 타겟입니다. 회원가입도 결제도 필요 없고, 디지털 도구가 익숙하지 않으셔도 가이드 글을 따라가시면 영상 만드실 수 있습니다. 시니어층이 인기 있는 분야 - 시니어 라이프, 재테크, 건강, 가족 관계, 사연 콘텐츠 - 위주로 가이드를 정리했습니다.',
  },
  {
    q: '얼마나 다양한 가이드가 있나요?',
    a: '현재 17편 이상의 가이드 글이 있으며, 매주 새로운 가이드가 추가됩니다. 영상 시작 가이드, 제목 작성법, 썸네일 디자인, 스토리텔링, 시청 유지율 높이기, 수익화, BGM, 채널 브랜딩 등 영상 만들기에 필요한 모든 주제를 다룹니다.',
  },
  {
    q: '키워드 입력 도구는 어떻게 사용하나요?',
    a: '가이드 글 안에서 "직접 만들어보기" 버튼을 통해 사용하실 수 있습니다. 관심 있는 키워드 한 단어를 입력하시면, AI가 분야를 자동 감지해 영상 제목, 대본 흐름, 태그, SNS 메타데이터 등을 자동으로 만들어드립니다.',
  },
  {
    q: '완전 무료인가요?',
    a: '네, 회원가입도 결제도 없이 모든 기능을 무료로 사용하실 수 있습니다. 사이트는 광고 수익(Google AdSense)으로 운영되며, 광고를 보시는 것만으로도 사이트를 응원해주시는 셈입니다.',
  },
  {
    q: '광고는 얼마나 보여지나요?',
    a: '가이드 글 본문 사이에 자연스럽게 광고가 들어갑니다. 영상 자료를 자주 만드시는 분은 사용 횟수가 늘어나면 보상형 광고(Rewarded Ad)를 잠시 보시고 계속 사용하실 수 있습니다. 모두 합리적 수준으로 운영됩니다.',
  },
];

// FAQ 구조화 데이터 (AEO 최적화)
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
    { '@type': 'HowToStep', position: 1, name: '입문 가이드 읽기', text: '시니어 영상 시작 7가지 가이드를 먼저 읽어보세요. 현실적인 조언과 시작 단계를 알 수 있습니다.' },
    { '@type': 'HowToStep', position: 2, name: '관심 분야 선택', text: '시니어 라이프, 가족 사연, 재테크 등 9개 분야 중 본인이 잘 알고 즐겁게 다룰 수 있는 분야를 선택합니다.' },
    { '@type': 'HowToStep', position: 3, name: '영상 자료 만들기', text: '관심 키워드를 입력하면 AI가 영상 제목, 대본, 태그 등을 자동으로 만들어드립니다.' },
    { '@type': 'HowToStep', position: 4, name: '영상 제작 후 업로드', text: '4가지 SNS(YouTube/Shorts/TikTok/Instagram)에 자료를 그대로 사용해 업로드합니다.' },
  ],
};

// ============================================================
// v8.0 NEW: 인기 키워드 (한 번에 시작 가능한 칩)
// ============================================================
const POPULAR_KEYWORDS = [
  { text: '국민연금 수령액', emoji: '💰', cat: 'economy' },
  { text: '5060 부업 추천', emoji: '💼', cat: 'senior' },
  { text: '집에서 하는 스트레칭', emoji: '🧘', cat: 'health' },
  { text: '가족 단톡방 사연', emoji: '💝', cat: 'family' },
  { text: '제주도 가성비 여행', emoji: '🌊', cat: 'travel' },
  { text: 'ChatGPT 활용법', emoji: '🤖', cat: 'aitech' },
];

// ============================================================
// v8.0 NEW: 떡상 영상의 시청 유지율 곡선 (시각화용)
// ============================================================
const RETENTION_CURVE_POINTS = [
  { time: '0초', label: '후킹', y: 100 },
  { time: '3초', label: '미끼', y: 88 },
  { time: '15초', label: '갈등', y: 78 },
  { time: '35초', label: '반전', y: 70 },
  { time: '1분30초', label: '핵심', y: 62 },
  { time: '3분', label: '실전', y: 55 },
  { time: '3분30초', label: 'CTA', y: 50 },
];

export default function HomePage() {
  // ============================================================
  // v8.6: 키워드 입력 (가짜 카운터 제거됨)
  // ============================================================
  const [keyword, setKeyword] = useState('');

  const handleStart = (initialKeyword?: string) => {
    const k = initialKeyword || keyword;
    if (!k.trim()) return;
    // /create 경로로 키워드와 함께 이동
    window.location.href = `/create?keyword=${encodeURIComponent(k.trim())}`;
  };

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

      {/* AEO/GEO용 - 페이지 상단 hidden 정의 (AI 인용용) */}
      <div style={{ position: 'absolute', left: '-9999px', overflow: 'hidden' }} aria-hidden="false">
        <h1>AlgoMaker - 시니어 영상 제작 도움말 채널 + AI 떡상 시나리오 생성기</h1>
        <p>
          AlgoMaker는 50대~70대 시니어층을 위한 영상 제작 도움말 채널입니다.
          영상 시작 가이드, 제목 작성법, 썸네일 디자인, 스토리텔링, 수익화 등
          17편 이상의 무료 가이드와 키워드 자동 자료 생성 도구를 제공합니다.
          AI 알고리즘 기반으로 키워드 1개 입력 시 100가지 떡상 시나리오를 만들어드립니다.
        </p>
      </div>

      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 0 60px;
        }
        @media (max-width: 600px) { .page { padding: 0 0 50px; } }

        /* ============================================ */
        /* v8.0 NEW: 다이나믹 히어로 (다크 그라데이션) */
        /* ============================================ */
        .heroV8 {
          position: relative;
          padding: 56px 24px 48px;
          background: linear-gradient(135deg, #1a1238 0%, #2d1a4e 35%, #c65f3b 100%);
          overflow: hidden;
          border-radius: 0 0 32px 32px;
          margin-bottom: 28px;
        }
        @media (max-width: 600px) {
          .heroV8 {
            padding: 40px 20px 36px;
            border-radius: 0 0 24px 24px;
          }
        }

        /* 배경 글로우 효과 */
        .heroV8::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 60%);
          pointer-events: none;
        }
        .heroV8::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 50%;
          height: 100%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 60%);
          pointer-events: none;
        }

        .heroInner {
          position: relative;
          z-index: 2;
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }

        /* 라이브 배지 */
        .liveBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }
        .liveDot {
          width: 7px;
          height: 7px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6); }
          50% { opacity: 0.85; box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
        }

        /* 메인 헤드라인 */
        .heroV8Title {
          font-size: 38px;
          font-weight: 900;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.04em;
          margin: 0 0 14px;
        }
        @media (max-width: 600px) { .heroV8Title { font-size: 26px; } }

        .heroV8Highlight {
          background: linear-gradient(120deg, #fbbf24 0%, #fb923c 50%, #f87171 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
        }

        .heroV8Sub {
          font-size: 15.5px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
          margin: 0 0 26px;
        }
        @media (max-width: 600px) { .heroV8Sub { font-size: 13.5px; margin-bottom: 22px; } }

        /* 키워드 입력창 */
        .keywordInputWrap {
          display: flex;
          align-items: stretch;
          background: #fff;
          border-radius: 100px;
          padding: 6px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
          max-width: 580px;
          margin: 0 auto 16px;
          gap: 6px;
        }
        @media (max-width: 600px) {
          .keywordInputWrap {
            flex-direction: column;
            border-radius: 20px;
            padding: 8px;
          }
        }
        .keywordInput {
          flex: 1;
          border: none;
          outline: none;
          padding: 14px 22px;
          font-size: 15px;
          color: #1a1a1a;
          font-family: inherit;
          background: transparent;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .keywordInput {
            padding: 12px 18px;
            font-size: 14px;
            text-align: center;
          }
        }
        .keywordInput::placeholder {
          color: #9ca3af;
        }
        .keywordBtn {
          padding: 14px 26px;
          background: linear-gradient(135deg, #c65f3b 0%, #ea7755 100%);
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.4);
        }
        .keywordBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(198, 95, 59, 0.6);
        }
        @media (max-width: 600px) {
          .keywordBtn { padding: 12px 22px; font-size: 13.5px; }
        }

        /* 인기 키워드 칩 */
        .popularKeywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 14px;
        }
        .popKwLabel {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          width: 100%;
          text-align: center;
          margin-bottom: 4px;
          font-weight: 600;
        }
        .popKwChip {
          padding: 7px 14px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 100px;
          font-size: 12.5px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .popKwChip:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        /* 빠른 통계 */
        .quickStats {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .qsItem {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }
        .qsItem strong {
          color: #fbbf24;
          font-size: 14px;
          margin-right: 4px;
        }

        /* ============================================ */
        /* v8.0 NEW: 떡상 곡선 시각화 섹션 */
        /* ============================================ */
        .curveSection {
          padding: 36px 24px;
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f3f4f6;
          margin: 0 20px 36px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 600px) { 
          .curveSection { 
            padding: 24px 16px; 
            margin: 0 12px 28px;
            border-radius: 18px;
          } 
        }
        .curveHead {
          text-align: center;
          margin-bottom: 24px;
        }
        .curveBadge {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .curveTitle {
          font-size: 22px;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .curveTitle { font-size: 18px; } }
        .curveSub {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* SVG 차트 */
        .curveSvg {
          width: 100%;
          height: 200px;
          margin: 16px 0 8px;
        }
        @media (max-width: 600px) { .curveSvg { height: 160px; } }

        .curveNote {
          background: #fff8f3;
          border-left: 3px solid #c65f3b;
          padding: 10px 14px;
          border-radius: 0 8px 8px 0;
          font-size: 12.5px;
          color: #78350f;
          line-height: 1.6;
          margin-top: 12px;
        }
        @media (max-width: 600px) { .curveNote { font-size: 12px; } }

        /* ============================================ */
        /* v8.0 NEW: 비교 섹션 (일반 도구 vs AlgoMaker) */
        /* ============================================ */
        .compSection {
          padding: 0 20px;
          margin-bottom: 36px;
        }
        @media (max-width: 600px) { .compSection { padding: 0 12px; } }

        .compHead {
          text-align: center;
          margin-bottom: 22px;
        }
        .compTitle {
          font-size: 22px;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
        }
        @media (max-width: 600px) { .compTitle { font-size: 18px; } }
        .compSub {
          font-size: 13px;
          color: #6b7280;
        }
        .compGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 600px) {
          .compGrid { grid-template-columns: 1fr; gap: 10px; }
        }
        .compCard {
          padding: 22px 20px;
          border-radius: 18px;
          border: 1.5px solid;
        }
        .compCard.bad {
          background: #fafafa;
          border-color: #e5e7eb;
        }
        .compCard.good {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border-color: #c65f3b;
          box-shadow: 0 8px 20px rgba(198, 95, 59, 0.12);
        }
        .compCardLabel {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: 0.04em;
        }
        .compCard.bad .compCardLabel {
          background: #f3f4f6;
          color: #6b7280;
        }
        .compCard.good .compCardLabel {
          background: #c65f3b;
          color: #fff;
        }
        .compCardTitle {
          font-size: 15.5px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
        }
        .compList {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .compList li {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.6;
          padding-left: 22px;
          position: relative;
        }
        .compCard.bad .compList li::before {
          content: '✕';
          position: absolute;
          left: 0;
          color: #9ca3af;
          font-weight: 800;
        }
        .compCard.good .compList li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #c65f3b;
          font-weight: 800;
        }
        .compCard.good .compList li {
          color: #1a1a1a;
          font-weight: 500;
        }

        /* ============================================ */
        /* 공통 섹션 */
        /* ============================================ */
        .section {
          margin: 0 20px 32px;
        }
        @media (max-width: 600px) { .section { margin: 0 12px 28px; } }

        .sectionHead {
          margin-bottom: 16px;
        }
        .sectionTitle {
          font-size: 22px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0 0 6px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) { .sectionTitle { font-size: 18px; } }
        .sectionDesc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        /* 가이드 카드 */
        .featuredGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        @media (max-width: 600px) {
          .featuredGrid { grid-template-columns: 1fr; gap: 12px; }
        }
        .guideCard {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          display: block;
        }
        .guideCard:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(198, 95, 59, 0.08);
        }
        .guideCardHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .guideCardEmoji { font-size: 22px; }
        .guideCardCat {
          padding: 2px 9px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .guideCardBadge {
          padding: 2px 9px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .guideCardTitle {
          font-size: 14.5px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.45;
          margin: 0 0 6px;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) { .guideCardTitle { font-size: 13.5px; } }
        .guideCardSub {
          font-size: 12.5px;
          color: #6b7280;
          line-height: 1.55;
          margin: 0 0 10px;
        }
        .guideCardMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px dashed #e5e7eb;
        }
        .guideCardTime {
          font-size: 11.5px;
          color: #9ca3af;
          font-weight: 600;
        }
        .guideCardArrow {
          font-size: 12px;
          color: #c65f3b;
          font-weight: 800;
        }

        /* 분야별 카테고리 */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 600px) {
          .catGrid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        .catCard {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px 14px;
          text-align: center;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }
        .catCard:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
        }
        .catEmoji {
          font-size: 30px;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) { .catEmoji { font-size: 26px; } }
        .catName {
          font-size: 13.5px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 3px;
        }
        @media (max-width: 600px) { .catName { font-size: 12.5px; } }
        .catDesc {
          font-size: 11.5px;
          color: #6b7280;
          line-height: 1.4;
        }

        /* 오늘의 핵심 */
        .todayCard {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border-radius: 18px;
          padding: 28px 26px;
          text-align: center;
        }
        @media (max-width: 600px) { .todayCard { padding: 22px 18px; } }
        .todayBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: 0.05em;
        }
        .todayTitle {
          font-size: 19px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0 0 14px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) { .todayTitle { font-size: 16px; } }
        .todayQuote {
          font-size: 19px;
          font-weight: 800;
          color: #78350f;
          line-height: 1.5;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .todayQuote { font-size: 16px; } }
        .todayQuoteAccent {
          color: #c65f3b;
          font-size: 1.2em;
        }
        .todayBody {
          font-size: 14px;
          color: #78350f;
          line-height: 1.7;
          margin: 0 0 18px;
        }
        @media (max-width: 600px) { .todayBody { font-size: 13px; } }
        .todayCTA {
          display: inline-block;
          padding: 11px 22px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 13.5px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
        }
        .todayCTA:hover {
          background: #b04e2d;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.3);
        }

        /* FAQ */
        .faqList {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faqItem {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 18px 22px;
          transition: border-color 0.15s;
        }
        @media (max-width: 600px) { .faqItem { padding: 14px 18px; } }
        .faqItem:hover {
          border-color: #c65f3b;
        }
        .faqQ {
          font-size: 14.5px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) { .faqQ { font-size: 13.5px; } }
        .faqA {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.7;
          margin: 0;
        }
        @media (max-width: 600px) { .faqA { font-size: 12.5px; } }

        /* 최종 CTA */
        .ctaBox {
          background: linear-gradient(135deg, #c65f3b 0%, #ea7755 100%);
          border-radius: 22px;
          padding: 36px 28px;
          text-align: center;
          color: #fff;
        }
        @media (max-width: 600px) { .ctaBox { padding: 28px 20px; } }
        .ctaTitle {
          font-size: 22px;
          font-weight: 900;
          margin: 0 0 8px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) { .ctaTitle { font-size: 18px; } }
        .ctaSub {
          font-size: 14px;
          line-height: 1.7;
          opacity: 0.95;
          margin: 0 0 20px;
        }
        @media (max-width: 600px) { .ctaSub { font-size: 12.5px; } }
        .ctaBtn {
          display: inline-block;
          padding: 13px 26px;
          background: #fff;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 14.5px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
        }
        .ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* 광고 영역 */
        .adArea { margin: 24px 20px; }
        @media (max-width: 600px) { .adArea { margin: 20px 12px; } }
      `}</style>

      <div className="page">
        {/* ============================================ */}
        {/* HERO V8 — 다이나믹 다크 그라데이션 + 키워드 입력 */}
        {/* ============================================ */}
        <section className="heroV8">
          <div className="heroInner">
            <div className="liveBadge">
              <span className="liveDot"></span>
              <span>지금 알고리즘이 작동 중</span>
            </div>

            <h1 className="heroV8Title">
              키워드 한 단어로<br />
              <span className="heroV8Highlight">100가지 떡상 시나리오</span>
            </h1>

            <p className="heroV8Sub">
              같은 키워드를 입력해도, 100명에게 100가지 다른 결과.<br />
              유튜브·쇼츠·인스타·틱톡 자료까지 60초 안에 완성됩니다.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); handleStart(); }}
              className="keywordInputWrap"
            >
              <input
                type="text"
                className="keywordInput"
                placeholder="예: 국민연금 수령액, 부업 추천, 제주도 여행..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="keywordBtn">
                🚀 1분 안에 시나리오 받기
              </button>
            </form>

            <div className="popularKeywords">
              <div className="popKwLabel">💡 다른 분들이 많이 만들고 있어요</div>
              {POPULAR_KEYWORDS.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  className="popKwChip"
                  onClick={() => handleStart(kw.text)}
                >
                  {kw.emoji} {kw.text}
                </button>
              ))}
            </div>

            <div className="quickStats">
              <div className="qsItem"><strong>60초</strong>안에 결과</div>
              <div className="qsItem"><strong>100가지</strong>다른 시나리오</div>
              <div className="qsItem"><strong>완전 무료</strong>회원가입 X</div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* v8.0 NEW: 떡상 곡선 시각화 */}
        {/* ============================================ */}
        <section className="curveSection">
          <div className="curveHead">
            <div className="curveBadge">📈 떡상 영상 분석</div>
            <h2 className="curveTitle">떡상 영상의 시청 유지율 곡선</h2>
            <p className="curveSub">
              유튜브 알고리즘은 이 곡선을 좋아합니다. AlgoMaker가 만드는 시나리오는 정확히 이 구조를 따라갑니다.
            </p>
          </div>

          <svg className="curveSvg" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* 그리드 라인 */}
            <line x1="0" y1="60" x2="800" y2="60" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="0" y1="180" x2="800" y2="180" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4,4" />
            
            {/* 떡상 임계선 (65%) */}
            <line x1="0" y1="84" x2="800" y2="84" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.7" />
            <text x="790" y="80" textAnchor="end" fontSize="10" fill="#92400e" fontWeight="700">떡상 임계선 (65%)</text>

            {/* 일반 영상 곡선 (점선) */}
            <path 
              d="M 0,40 L 100,80 L 200,140 L 300,180 L 400,200 L 500,210 L 600,215 L 700,218 L 800,220" 
              fill="none" 
              stroke="#9ca3af" 
              strokeWidth="2" 
              strokeDasharray="4,4"
            />
            <text x="780" y="218" textAnchor="end" fontSize="10" fill="#9ca3af" fontWeight="600">일반 영상 (이탈 빠름)</text>

            {/* 떡상 영상 곡선 (강조) */}
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c65f3b" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c65f3b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#c65f3b" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 영역 채우기 */}
            <path 
              d="M 0,30 L 100,55 L 200,80 L 300,100 L 400,120 L 500,140 L 600,150 L 700,160 L 800,180 L 800,240 L 0,240 Z" 
              fill="url(#areaGradient)"
            />

            {/* 메인 곡선 */}
            <path 
              d="M 0,30 L 100,55 L 200,80 L 300,100 L 400,120 L 500,140 L 600,150 L 700,160 L 800,180" 
              fill="none" 
              stroke="url(#curveGradient)" 
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 데이터 포인트들 */}
            {[
              { x: 0, y: 30, label: '0초', val: '100%' },
              { x: 100, y: 55, label: '3초', val: '88%' },
              { x: 250, y: 90, label: '15초', val: '78%' },
              { x: 400, y: 120, label: '35초', val: '70%' },
              { x: 600, y: 150, label: '1분30초', val: '62%' },
              { x: 800, y: 180, label: '3분', val: '50%' },
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x === 0 ? 8 : pt.x === 800 ? 792 : pt.x} cy={pt.y} r="5" fill="#fff" stroke="#c65f3b" strokeWidth="2.5" />
                <text 
                  x={pt.x === 0 ? 8 : pt.x === 800 ? 792 : pt.x} 
                  y={pt.y - 12} 
                  textAnchor="middle" 
                  fontSize="11" 
                  fill="#c65f3b" 
                  fontWeight="800"
                >
                  {pt.val}
                </text>
                <text 
                  x={pt.x === 0 ? 8 : pt.x === 800 ? 792 : pt.x} 
                  y="232" 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#6b7280" 
                  fontWeight="600"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="curveNote">
            💡 <strong>일반 영상</strong>은 35초에 60% 이탈하지만, <strong>떡상 영상</strong>은 같은 시점에 70% 유지됩니다.
            AlgoMaker는 이 5%의 차이를 만드는 구조를 시나리오에 자동 적용합니다.
          </div>
        </section>

        {/* ============================================ */}
        {/* v8.0 NEW: 일반 도구 vs AlgoMaker 비교 */}
        {/* ============================================ */}
        <section className="compSection">
          <div className="compHead">
            <h2 className="compTitle">왜 다른 AI 도구로는 부족할까요?</h2>
            <p className="compSub">키워드만 바꿔도 매번 다른 결과를 만드는 게 진짜 차이입니다</p>
          </div>
          <div className="compGrid">
            <div className="compCard bad">
              <span className="compCardLabel">일반 AI 도구</span>
              <div className="compCardTitle">평범한 결과</div>
              <ul className="compList">
                <li>같은 키워드 = 거의 같은 결과</li>
                <li>평범한 대본 (어디서 본 듯한 멘트)</li>
                <li>영문 프롬프트 1-2줄만 제공</li>
                <li>SNS별로 따로 작업해야 함</li>
                <li>알고리즘 후킹 구조 부재</li>
              </ul>
            </div>
            <div className="compCard good">
              <span className="compCardLabel">AlgoMaker</span>
              <div className="compCardTitle">알고리즘이 움직이는 결과</div>
              <ul className="compList">
                <li>같은 키워드도 100가지 다른 시나리오</li>
                <li>작가급 스토리텔링 + 떡상 패턴 융합</li>
                <li>Midjourney v7 + Sora 2 + VEO 3 전문가급</li>
                <li>유튜브·쇼츠·인스타·틱톡 4종 자동 생성</li>
                <li>비트마다 시청 유지율 목표 명시</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 광고 영역 */}
        <div className="adArea">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* 시니어 분들께 추천하는 가이드 (v7.0 자산 보존) */}
        {/* ============================================ */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">⭐ 시니어 분들께 추천하는 가이드</h2>
            <p className="sectionDesc">
              영상 시작이 처음이신 분들이 가장 먼저 읽어보시면 좋은 가이드 6편입니다.
            </p>
          </div>
          <div className="featuredGrid">
            {FEATURED_GUIDES.map((g) => (
              <Link key={g.slug} href={`/knowhow/${g.slug}`} className="guideCard">
                <div className="guideCardHead">
                  <span className="guideCardEmoji">{g.emoji}</span>
                  <span className="guideCardCat">{g.category}</span>
                  {g.badge && <span className="guideCardBadge">{g.badge}</span>}
                </div>
                <h3 className="guideCardTitle">{g.title}</h3>
                <p className="guideCardSub">{g.subtitle}</p>
                <div className="guideCardMeta">
                  <span className="guideCardTime">⏱️ {g.readTime}</span>
                  <span className="guideCardArrow">자세히 보기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 오늘의 핵심 (v7.0 자산 보존) */}
        <section className="section">
          <div className="todayCard">
            <div className="todayBadge">📌 오늘의 핵심</div>
            <h2 className="todayTitle">처음 시작하는 분께 가장 중요한 1가지</h2>
            <div className="todayQuote">
              "영상 만들기에서 가장 중요한 건<br />
              <span className="todayQuoteAccent">"꾸준함"</span>입니다"
            </div>
            <p className="todayBody">
              일주일에 한 편이면 충분합니다. 1년에 50편이면 본인만의 색깔이 만들어집니다.
              빠른 떡상 욕심보다 <strong>매주 진심 담은 한 편</strong>이 더 강력합니다.
            </p>
            <Link href="/knowhow/middle-aged-channel-tips" className="todayCTA">
              👴 시니어 영상 시작 7가지 가이드 →
            </Link>
          </div>
        </section>

        {/* 분야별 탐색 (v7.0 자산 보존) */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">🗂️ 분야별 가이드 탐색</h2>
            <p className="sectionDesc">
              관심 있는 분야의 가이드를 모아서 보실 수 있어요. 시니어 분들이 많이 찾는 분야부터 정리했습니다.
            </p>
          </div>
          <div className="catGrid">
            {CATEGORY_NAV.map((c) => (
              <Link key={c.id} href={`/blog?category=${c.id}`} className="catCard">
                <div className="catEmoji">{c.emoji}</div>
                <div className="catName">{c.name}</div>
                <div className="catDesc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ (v7.0 자산 보존) */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">❓ 자주 묻는 질문</h2>
          </div>
          <div className="faqList">
            {FAQ_LIST.map((f, i) => (
              <div key={i} className="faqItem">
                <div className="faqQ">Q. {f.q}</div>
                <p className="faqA">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 최종 CTA */}
        <section className="section">
          <div className="ctaBox">
            <h2 className="ctaTitle">지금 키워드 한 단어로 시작해보세요</h2>
            <p className="ctaSub">
              완전 무료, 회원가입 없음, 무제한 사용.<br />
              60초 안에 떡상 시나리오를 받아보실 수 있습니다.
            </p>
            <Link href="/create" className="ctaBtn">
              🚀 키워드 입력하고 시작하기 →
            </Link>
          </div>
        </section>
      </div>
    </V11Shell>
  );
}
