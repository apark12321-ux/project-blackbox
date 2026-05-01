'use client';
/**
 * AlgoMaker 메인 페이지 v10.0 - 대시보드 1화면 구조
 *
 * 박예준 대표 비전:
 * "50대~70대 시니어층을 위한 영상 제작 도움말 채널"
 * "가이드 글이 메인 콘텐츠"
 * "AlgoMaker 자체 = 완전 무료"
 *
 * 박 대표님 v10.0 요청 (D안):
 * "메인 페이지를 아래로 쭉 스크롤하지 않고 전체를 볼 수 있도록 설계"
 * "모바일에서도 잘 보이도록"
 *
 * v10.0 변경 (2026.05.01) - 대시보드 구조:
 *  - ❌ 큰 Hero 섹션 제거 (50대도 시작하는~ 큰 글자 제거)
 *  - ❌ 추천 시작 카드 제거 (가이드 카드와 중복)
 *  - ❌ 보조 도구 섹션 제거 (메뉴에 이미 있음)
 *  - ❌ 메타 라인 4개 제거
 *
 *  - ✅ 키워드 박스 = 가장 위 (핵심 액션 1순위)
 *  - ✅ 가이드 6개 + 카테고리 9개 = 가로 2분할 (데스크탑)
 *  - ✅ FAQ = 모두 접힘 (공간 절약)
 *  - ✅ 모바일: 1열 stack, 짧게
 *  - ✅ 데스크탑 1280×800에서 거의 1화면 안에 다 보임
 *
 * 박 대표님 자산 100% 보존:
 *  - FEATURED_GUIDES 6편
 *  - CATEGORY_NAV 9개
 *  - FAQ_LIST 6개
 *  - AEO/GEO JSON-LD
 *  - 광고 위치
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('general');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const url = `/publish?keyword=${encodeURIComponent(trimmed)}&category=${encodeURIComponent(selectedCat)}`;
    router.push(url);
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

      <style jsx>{`
        .dash {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          padding: 16px 20px 28px;
          max-width: 1280px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .dash { padding: 12px 14px 24px; }
        }

        /* 키워드 박스 (가장 위, 강조) */
        .startBox {
          padding: 18px 20px;
          background: linear-gradient(135deg, #fffbf7 0%, #fff8f0 100%);
          border: 2px solid #c2410c;
          margin-bottom: 18px;
        }
        @media (max-width: 600px) {
          .startBox { padding: 14px 14px; margin-bottom: 14px; }
        }

        .startTitle {
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          line-height: 1.5;
          margin-bottom: 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .startTitle { font-size: 13px; margin-bottom: 8px; }
        }

        .startKicker {
          display: inline-block;
          padding: 3px 9px;
          background: #c2410c;
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-right: 8px;
        }
        @media (max-width: 600px) {
          .startKicker { font-size: 10px; padding: 2px 7px; }
        }

        .startRow {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        @media (max-width: 600px) {
          .startRow { gap: 6px; margin-bottom: 10px; }
        }

        .startInput {
          flex: 1;
          min-width: 0;
          padding: 12px 14px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          color: #0a0a0a;
          background: #ffffff;
          border: 1.5px solid #d4d4d4;
          outline: none;
          transition: border-color 0.15s;
          letter-spacing: -0.01em;
          min-height: 44px;
        }
        .startInput:focus {
          border-color: #c2410c;
        }
        .startInput::placeholder {
          color: #a3a3a3;
          font-weight: 400;
        }
        @media (max-width: 600px) {
          .startInput { padding: 10px 12px; font-size: 14px; min-height: 42px; }
        }

        .startBtn {
          flex-shrink: 0;
          padding: 0 18px;
          background: #0a0a0a;
          color: #ffffff;
          border: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: background 0.15s;
          min-height: 44px;
          white-space: nowrap;
        }
        .startBtn:hover:not(:disabled) {
          background: #c2410c;
        }
        .startBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .startBtn { padding: 0 14px; font-size: 13px; min-height: 42px; }
        }

        .startCatsLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .startCatsLabel { font-size: 10px; }
        }

        .startCats {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        @media (max-width: 600px) {
          .startCats { gap: 4px; }
        }

        .startCat {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          color: #525252;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: -0.005em;
          min-height: 32px;
        }
        .startCat:hover {
          border-color: #0a0a0a;
          color: #0a0a0a;
        }
        .startCat.active {
          background: #fffbf7;
          font-weight: 700;
        }
        @media (max-width: 600px) {
          .startCat { padding: 5px 8px; font-size: 11px; min-height: 28px; gap: 3px; }
        }

        .startCatEmoji {
          font-size: 14px;
          line-height: 1;
        }

        /* 2분할 그리드 (가이드 + 분야) */
        .splitGrid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }
        @media (max-width: 900px) {
          .splitGrid {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-bottom: 14px;
          }
        }

        .panel {
          background: #ffffff;
        }

        .panelHead {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 2px solid #0a0a0a;
          margin-bottom: 10px;
        }

        .panelTitle {
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .panelTitle { font-size: 13px; }
        }

        .panelMore {
          font-size: 11px;
          color: #737373;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.005em;
        }
        .panelMore:hover {
          color: #c2410c;
        }

        /* 추천 가이드 그리드 */
        .guideGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 1100px) {
          .guideGrid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .guideGrid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
        }

        .guideCard {
          padding: 12px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 132px;
        }
        .guideCard:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-1px);
        }
        @media (max-width: 600px) {
          .guideCard { padding: 10px 10px; min-height: 118px; }
        }

        .guideCardAccent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .guideCardHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .guideCardEmoji {
          font-size: 22px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 600px) { .guideCardEmoji { font-size: 18px; } }

        .guideCardKicker {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #c2410c;
          text-transform: uppercase;
          flex: 1;
          min-width: 0;
        }

        .guideCardTitle {
          font-size: 13px;
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
          font-size: 11px;
          color: #737373;
          line-height: 1.45;
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
          padding-top: 6px;
          margin-top: 8px;
          border-top: 1px dashed #d4d4d4;
        }

        .guideCardTime {
          font-size: 9.5px;
          color: #737373;
          letter-spacing: 0.04em;
        }

        .guideCardArrow {
          font-size: 9.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* 카테고리 그리드 (3x3) */
        .catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .catCard {
          padding: 11px 8px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
          position: relative;
          overflow: hidden;
          min-height: 84px;
          justify-content: center;
        }
        .catCard:hover {
          background: #fafafa;
          border-color: #0a0a0a;
          transform: translateY(-1px);
        }
        @media (max-width: 600px) {
          .catCard { padding: 10px 6px; min-height: 76px; }
        }

        .catCardAccent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
        }

        .catCardEmoji {
          font-size: 22px;
          line-height: 1;
        }
        @media (max-width: 600px) { .catCardEmoji { font-size: 20px; } }

        .catName {
          font-size: 11.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.2;
        }
        @media (max-width: 600px) { .catName { font-size: 11px; } }

        .catDesc {
          display: none;
        }

        /* FAQ 아코디언 (모두 접힘) */
        .faqPanel {
          margin-bottom: 18px;
        }

        .faqList {
          background: #ffffff;
        }

        .faqItem {
          border-bottom: 1px solid #e5e5e5;
        }
        .faqItem:first-child {
          border-top: 1px solid #e5e5e5;
        }

        .faqItem summary {
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          padding: 11px 32px 11px 4px;
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
          font-size: 20px;
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
          .faqItem summary { font-size: 12.5px; padding: 10px 28px 10px 4px; }
          .faqItem summary::after { font-size: 18px; right: 2px; }
        }

        .faqA {
          font-size: 12.5px;
          color: #525252;
          line-height: 1.6;
          margin: 0;
          padding: 0 4px 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .faqA { font-size: 12px; padding-bottom: 10px; }
        }

        /* 광고 영역 (작게) */
        .adWrap {
          margin: 0 0 18px;
        }
        @media (max-width: 600px) {
          .adWrap { margin-bottom: 14px; }
        }
      `}</style>

      <div className="dash">
        {/* 1. 키워드 박스 (가장 위) */}
        <form className="startBox" onSubmit={handleSubmit}>
          <div className="startTitle">
            <span className="startKicker">⚡ 빠른 시작</span>
            영상 키워드를 입력하면 5초 안에 자료를 만들어드립니다
          </div>
          <div className="startRow">
            <input
              type="text"
              className="startInput"
              placeholder="예: 50대 재취업, 부동산 전망, 집밥 레시피"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="영상 키워드 입력"
              maxLength={50}
            />
            <button
              type="submit"
              className="startBtn"
              disabled={!keyword.trim()}
            >
              만들기 →
            </button>
          </div>
          <div className="startCatsLabel">분야 선택 (선택사항)</div>
          <div className="startCats">
            {CATEGORY_NAV.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`startCat ${selectedCat === c.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(c.id)}
                style={selectedCat === c.id ? { borderColor: c.color, color: c.color } : {}}
              >
                <span className="startCatEmoji">{c.emoji}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </form>

        {/* 2. 가이드 + 분야 (가로 2분할) */}
        <div className="splitGrid">
          <section className="panel">
            <div className="panelHead">
              <div className="panelTitle">📚 추천 가이드</div>
              <Link href="/blog" className="panelMore">전체 보기 →</Link>
            </div>
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

          <section className="panel">
            <div className="panelHead">
              <div className="panelTitle">🗂 분야별</div>
              <Link href="/blog" className="panelMore">전체 보기 →</Link>
            </div>
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
        </div>

        {/* 3. 광고 */}
        <div className="adWrap">
          <AdSlot slot="home-middle" variant="horizontal" />
        </div>

        {/* 4. FAQ (모두 접힘) */}
        <section className="panel faqPanel">
          <div className="panelHead">
            <div className="panelTitle">❓ 자주 묻는 질문</div>
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
