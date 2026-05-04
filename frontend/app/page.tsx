'use client';

/**
 * AlgoMaker 메인 페이지 v17.0 - 도구 + 매거진 하이브리드
 *
 * 박 대표님 v17.0 결정:
 *   "매거진이 아닌 영상 만드는 툴이라는 직관적인 느낌이 필요"
 *   = 두 가지 모두 살리기
 *
 * 구조:
 *   1. 통일 헤더 (V17Shell)
 *   2. 도구 영역 (상단) - 영상 만드는 툴 직관성
 *      - 키워드 입력란 (메인 CTA)
 *      - "5초 안에" 약속
 *      - 행동 유도 (자료 만들기 버튼)
 *   3. 매거진 영역 (하단) - 가이드 깊이
 *      - EDITOR'S PICK (큰 영역)
 *      - FEATURED STORIES (번호 매긴 리스트)
 *      - 카테고리 섹션 통계
 *      - 전체 26편 보기
 *
 * 박 대표님 자산 보존:
 *   - /publish 도구 페이지 그대로
 *   - 가이드 26편 콘텐츠 그대로
 */

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { V17Shell } from './_shared/V17Shell';

const FEATURED_PICK = {
  slug: 'human-warmth',
  category: 'CHANNEL',
  title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도',
  subtitle: 'AI는 빠르고 유창하지만 흉내 낼 수 없는 것이 있습니다. 시청자가 진짜 원하는 것은 완벽한 정보가 아닐지도 모릅니다.',
  readTime: '7 MIN',
  date: '2026.05.04',
};

const STORIES = [
  { slug: 'algorithm-seo', num: '01', cat: 'ALGORITHM', title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', meta: '8 MIN · 12.3K' },
  { slug: 'senior-channel-start', num: '02', cat: 'SENIOR', title: '50대부터 시작하는 시니어 사연 쇼츠 채널', meta: '8 MIN · NEW' },
  { slug: 'algorithm-mistakes', num: '03', cat: 'MISTAKE', title: '치명적 실수 7가지 - 알고 피하면 떡상', meta: '8 MIN · 8.7K' },
  { slug: 'algorithm-retention', num: '04', cat: 'RETENTION', title: '시청자를 채널에 가두는 무한 루프 세팅', meta: '7 MIN · 7.2K' },
  { slug: 'senior-hook-patterns', num: '05', cat: 'HOOK', title: '시청자를 사로잡는 시니어 영상 후크 8가지', meta: '7 MIN · NEW' },
  { slug: 'voice-seo', num: '06', cat: 'AI TOOL', title: '음성 SEO 완전 정복 - 검색 노출 200%', meta: '6 MIN · 5.4K' },
];

const SECTIONS = [
  { id: 'algorithm', label: '알고리즘', count: 10 },
  { id: 'senior', label: '시니어', count: 5 },
  { id: 'aitools', label: 'AI 도구', count: 8 },
  { id: 'monetization', label: '수익화', count: 3 },
];

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/publish?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <V17Shell>
      <div className="home-v17">
        <section className="tool-hero">
          <div className="tool-hero-inner">
            <div className="tool-kicker">
              <span className="tool-kicker-arrow">▶</span>
              영상 자료 만들기
            </div>

            <h1 className="tool-title">
              키워드만 입력하면<br />
              <span className="tool-title-accent">제목·시나리오·해시태그까지</span>
            </h1>

            <p className="tool-sub">
              알고리즘 11공식이 자동 적용된 영상 자료를 5초 안에 받아보세요.
              유튜브 시작하시는 분들을 위한 무료 도구입니다.
            </p>

            <form onSubmit={handleSubmit} className="tool-form">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: 50대 부업 유튜브"
                className="tool-input"
                aria-label="영상 키워드"
              />
              <button type="submit" className="tool-btn">
                <span>자료 만들기</span>
                <span className="tool-btn-arrow">→</span>
              </button>
            </form>

            <div className="tool-features">
              <div className="tool-feature"><span className="tool-check">✓</span> 5초 안에</div>
              <div className="tool-feature"><span className="tool-check">✓</span> 무료</div>
              <div className="tool-feature"><span className="tool-check">✓</span> 알고리즘 11공식 자동 적용</div>
            </div>
          </div>
        </section>

        <section className="mag-section">
          <div className="mag-section-head">
            <div className="mag-section-kicker-row">
              <div className="mag-section-kicker">GUIDES · 따라하면 성공</div>
              <Link href="/blog" className="mag-section-more">전체 26편 보기 →</Link>
            </div>
            <h2 className="mag-section-title">유튜브 운영 가이드 26편</h2>
            <p className="mag-section-sub">
              알고리즘부터 시니어 사연 쇼츠까지, 영상 채널 운영의 모든 노하우를 정리했습니다.
            </p>
          </div>

          <Link href={`/blog/${FEATURED_PICK.slug}`} className="editor-pick">
            <div className="editor-pick-kicker">EDITOR'S PICK</div>
            <h3 className="editor-pick-title">{FEATURED_PICK.title}</h3>
            <p className="editor-pick-sub">{FEATURED_PICK.subtitle}</p>
            <div className="editor-pick-meta">
              <span>{FEATURED_PICK.category}</span>
              <span className="editor-pick-dot">·</span>
              <span>{FEATURED_PICK.readTime}</span>
              <span className="editor-pick-dot">·</span>
              <span>{FEATURED_PICK.date}</span>
            </div>
          </Link>

          <div className="stories-kicker">FEATURED STORIES</div>

          <div className="stories">
            {STORIES.map((s) => (
              <Link key={s.slug} href={`/blog/${s.slug}`} className="story">
                <div className="story-num-col">
                  <div className="story-num">{s.num}</div>
                  <div className="story-cat">{s.cat}</div>
                </div>
                <div className="story-content">
                  <div className="story-title">{s.title}</div>
                  <div className="story-meta">{s.meta}</div>
                </div>
                <div className="story-arrow">→</div>
              </Link>
            ))}
          </div>

          <div className="sections-grid">
            <div className="sections-kicker">SECTIONS · 26 GUIDES</div>
            <div className="sections-row">
              {SECTIONS.map((s) => (
                <Link key={s.id} href={`/blog?cat=${s.id}`} className="section-card">
                  <div className="section-count">{s.count}</div>
                  <div className="section-label">{s.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <style jsx>{`
          .home-v17 {
            max-width: 1080px;
            margin: 0 auto;
            padding: 0;
          }

          .tool-hero {
            padding: 56px 24px 64px;
            background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
            border-bottom: 0.5px solid #e5e5e5;
          }
          @media (max-width: 600px) {
            .tool-hero { padding: 40px 16px 44px; }
          }

          .tool-hero-inner {
            max-width: 760px;
            margin: 0 auto;
          }

          .tool-kicker {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: #fff7ed;
            color: #c2410c;
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            margin-bottom: 20px;
            text-transform: uppercase;
          }
          .tool-kicker-arrow { font-size: 10px; }

          .tool-title {
            font-size: 44px;
            font-weight: 700;
            color: #0a0a0a;
            letter-spacing: -0.03em;
            line-height: 1.15;
            margin: 0 0 18px;
            word-break: keep-all;
          }
          @media (max-width: 800px) {
            .tool-title { font-size: 32px; margin-bottom: 14px; }
          }
          @media (max-width: 600px) {
            .tool-title { font-size: 26px; line-height: 1.2; }
          }

          .tool-title-accent {
            color: #c2410c;
          }

          .tool-sub {
            font-size: 15px;
            color: #525252;
            line-height: 1.7;
            margin: 0 0 28px;
            word-break: keep-all;
            max-width: 600px;
          }
          @media (max-width: 600px) {
            .tool-sub { font-size: 13.5px; line-height: 1.65; margin-bottom: 22px; }
          }

          .tool-form {
            display: flex;
            gap: 8px;
            margin-bottom: 18px;
            max-width: 600px;
          }
          @media (max-width: 600px) {
            .tool-form { flex-direction: column; gap: 10px; }
          }

          .tool-input {
            flex: 1;
            padding: 14px 16px;
            font-size: 15px;
            font-family: inherit;
            font-weight: 500;
            color: #0a0a0a;
            background: #ffffff;
            border: 1.5px solid #d4d4d4;
            border-radius: 0;
            outline: none;
            transition: border-color 0.15s;
            letter-spacing: -0.012em;
          }
          .tool-input:focus {
            border-color: #0a0a0a;
          }
          .tool-input::placeholder {
            color: #a3a3a3;
            font-weight: 400;
          }
          @media (max-width: 600px) {
            .tool-input { font-size: 14px; padding: 12px 14px; }
          }

          .tool-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: -0.015em;
            color: #ffffff;
            background: #0a0a0a;
            border: 1.5px solid #0a0a0a;
            cursor: pointer;
            transition: all 0.15s;
            white-space: nowrap;
          }
          .tool-btn:hover {
            background: #c2410c;
            border-color: #c2410c;
          }
          @media (max-width: 600px) {
            .tool-btn { padding: 13px 22px; font-size: 14px; }
          }
          .tool-btn-arrow {
            font-size: 18px;
            font-weight: 700;
          }

          .tool-features {
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
          }
          @media (max-width: 600px) {
            .tool-features { gap: 12px; }
          }

          .tool-feature {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 12.5px;
            color: #737373;
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          @media (max-width: 600px) {
            .tool-feature { font-size: 11.5px; }
          }
          .tool-check {
            color: #16a34a;
            font-weight: 800;
            font-size: 13px;
          }

          .mag-section {
            padding: 56px 24px 60px;
          }
          @media (max-width: 600px) {
            .mag-section { padding: 36px 16px 40px; }
          }

          .mag-section-head {
            margin-bottom: 28px;
          }
          @media (max-width: 600px) {
            .mag-section-head { margin-bottom: 22px; }
          }

          .mag-section-kicker-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }

          .mag-section-kicker {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #a3a3a3;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .mag-section-more {
            font-size: 12.5px;
            color: #c2410c;
            font-weight: 700;
            letter-spacing: -0.012em;
            text-decoration: none;
          }
          .mag-section-more:hover { color: #0a0a0a; }

          .mag-section-title {
            font-size: 32px;
            font-weight: 700;
            color: #0a0a0a;
            letter-spacing: -0.028em;
            margin: 0 0 6px;
            line-height: 1.2;
            word-break: keep-all;
          }
          @media (max-width: 600px) {
            .mag-section-title { font-size: 24px; margin-bottom: 4px; }
          }

          .mag-section-sub {
            font-size: 14px;
            color: #737373;
            line-height: 1.6;
            margin: 0;
            letter-spacing: -0.012em;
            word-break: keep-all;
          }
          @media (max-width: 600px) {
            .mag-section-sub { font-size: 12.5px; }
          }

          .editor-pick {
            display: block;
            padding: 28px 28px;
            background: #fafafa;
            border-left: 4px solid #0a0a0a;
            margin-bottom: 36px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @media (max-width: 600px) {
            .editor-pick { padding: 22px 20px; margin-bottom: 28px; }
          }
          .editor-pick:hover {
            background: #f0f0f0;
            border-left-color: #c2410c;
          }

          .editor-pick-kicker {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 10.5px;
            font-weight: 700;
            color: #a3a3a3;
            letter-spacing: 0.14em;
            margin-bottom: 10px;
            text-transform: uppercase;
          }

          .editor-pick-title {
            font-size: 24px;
            font-weight: 700;
            color: #0a0a0a;
            letter-spacing: -0.024em;
            line-height: 1.3;
            margin: 0 0 10px;
            word-break: keep-all;
          }
          @media (max-width: 600px) {
            .editor-pick-title { font-size: 19px; line-height: 1.35; margin-bottom: 8px; }
          }

          .editor-pick-sub {
            font-size: 14px;
            color: #525252;
            line-height: 1.7;
            margin: 0 0 14px;
            word-break: keep-all;
          }
          @media (max-width: 600px) {
            .editor-pick-sub { font-size: 13px; line-height: 1.65; margin-bottom: 12px; }
          }

          .editor-pick-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 10.5px;
            color: #a3a3a3;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .editor-pick-dot { color: #d4d4d4; }

          .stories-kicker {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #a3a3a3;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 6px;
          }

          .stories {
            display: flex;
            flex-direction: column;
            margin-bottom: 40px;
          }
          @media (max-width: 600px) {
            .stories { margin-bottom: 32px; }
          }

          .story {
            display: grid;
            grid-template-columns: 90px 1fr 30px;
            gap: 18px;
            align-items: center;
            padding: 20px 0;
            border-top: 0.5px solid #e5e5e5;
            text-decoration: none;
            color: inherit;
            transition: all 0.15s;
          }
          .story:last-child { border-bottom: 0.5px solid #e5e5e5; }
          .story:hover {
            background: #fafafa;
            padding-left: 12px;
          }
          @media (max-width: 600px) {
            .story { grid-template-columns: 60px 1fr 20px; gap: 12px; padding: 16px 0; }
          }

          .story-num-col {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .story-num {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 28px;
            font-weight: 600;
            color: #d4d4d4;
            line-height: 1;
            letter-spacing: -0.02em;
          }
          @media (max-width: 600px) {
            .story-num { font-size: 22px; }
          }

          .story-cat {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 9.5px;
            font-weight: 700;
            color: #737373;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          @media (max-width: 600px) {
            .story-cat { font-size: 9px; }
          }

          .story-content {
            min-width: 0;
          }

          .story-title {
            font-size: 16px;
            font-weight: 600;
            color: #0a0a0a;
            letter-spacing: -0.018em;
            line-height: 1.45;
            margin-bottom: 5px;
            word-break: keep-all;
          }
          @media (max-width: 600px) {
            .story-title { font-size: 14px; line-height: 1.4; }
          }

          .story-meta {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 10.5px;
            font-weight: 600;
            color: #a3a3a3;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          @media (max-width: 600px) {
            .story-meta { font-size: 10px; }
          }

          .story-arrow {
            font-size: 16px;
            font-weight: 700;
            color: #d4d4d4;
            text-align: right;
            transition: color 0.15s;
          }
          .story:hover .story-arrow { color: #c2410c; }

          .sections-grid {
            background: #fafafa;
            padding: 22px 24px;
          }
          @media (max-width: 600px) {
            .sections-grid { padding: 18px 18px; }
          }

          .sections-kicker {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #737373;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 14px;
          }

          .sections-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
          @media (max-width: 600px) {
            .sections-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          }

          .section-card {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 16px 14px;
            background: #ffffff;
            text-decoration: none;
            color: inherit;
            transition: all 0.15s;
          }
          .section-card:hover {
            background: #0a0a0a;
            color: #ffffff;
          }

          .section-count {
            font-family: 'SF Mono', 'Roboto Mono', monospace;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1;
          }
          @media (max-width: 600px) {
            .section-count { font-size: 20px; }
          }

          .section-label {
            font-size: 12.5px;
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          @media (max-width: 600px) {
            .section-label { font-size: 11.5px; }
          }
        `}</style>
      </div>
    </V17Shell>
  );
}
