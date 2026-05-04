'use client';

/**
 * AlgoMaker 메인 페이지 v18.0 - 애드센스 친화 표준 블로그
 *
 * 박 대표님 v18 결정:
 *   "구글이 애드센스 승인 위한 사람들을 위해서 만든 샘플 사이트처럼"
 *   "오류 없이 깔끔하게"
 *   "내가 하고 싶은 내용은 다 들어가게"
 *
 * 박 대표님 콘텐츠 자산 (모두 포함):
 *   1. 알고리즘 노하우 (11공식)
 *   2. 시니어 사연 쇼츠
 *   3. AI 도구 활용
 *   4. 영상 채널 수익화
 *
 * 설계 원칙:
 *   ✅ 표준 블로그 구조
 *   ✅ 단일 컬럼, 큰 글씨
 *   ✅ H1-H2-H3 명확
 *   ✅ 카테고리 + 최신 글 + 추천 글
 *   ✅ 모바일 최적화
 *   ✅ 인터랙션 / 카드 / 매거진 / 도구 중심 X
 */

import Link from 'next/link';
import { V18Shell } from './_shared/V18Shell';

const CATEGORIES = [
  {
    id: 'algorithm',
    name: '유튜브 알고리즘',
    desc: '검색 노출, 시청 지속률, 떡상 패턴까지. 박 실장 11공식 기반 알고리즘 노하우.',
    count: 10,
  },
  {
    id: 'senior',
    name: '시니어 사연 쇼츠',
    desc: '50~80대 타겟 채널 운영법. 후크 패턴, 콘텐츠 아이디어 30가지, 정책 안전 운영.',
    count: 5,
  },
  {
    id: 'aitools',
    name: 'AI 도구 활용',
    desc: '클로드, ChatGPT, Sora 등을 영상 제작에 활용하는 실전 가이드.',
    count: 9,
  },
  {
    id: 'monetization',
    name: '영상 채널 수익화',
    desc: '광고 수익 계산법, 첫 100명 구독자, 멘탈 관리까지.',
    count: 3,
  },
];

const LATEST = [
  { slug: 'claude-youtube-workflow', cat: 'AI 도구', title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스', date: '2026.05.04', readTime: '9분' },
  { slug: 'human-warmth', cat: '채널 운영', title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도', date: '2026.05.04', readTime: '7분' },
  { slug: 'senior-channel-start', cat: '시니어', title: '50대부터 시작하는 시니어 사연 쇼츠 채널', date: '2026.05.04', readTime: '8분' },
  { slug: 'senior-content-ideas', cat: '시니어', title: '시니어 채널 콘텐츠 아이디어 30가지', date: '2026.05.04', readTime: '9분' },
  { slug: 'senior-hook-patterns', cat: '시니어', title: '시청자를 사로잡는 시니어 영상 후크 8가지', date: '2026.05.04', readTime: '7분' },
];

const POPULAR = [
  { slug: 'algorithm-seo', cat: '알고리즘', title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', readTime: '8분' },
  { slug: 'algorithm-mistakes', cat: '실수 방어', title: '치명적 실수 7가지 - 알고 피하면 떡상', readTime: '8분' },
  { slug: 'algorithm-retention', cat: '시청 지속', title: '시청자를 채널에 가두는 무한 루프 세팅', readTime: '7분' },
  { slug: 'algorithm-mindset', cat: '멘탈', title: '6개월간 떡상이 안 와도 버티는 멘탈 관리', readTime: '7분' },
  { slug: 'first-100-subs', cat: '구독자', title: '첫 100명 구독자 모으는 방법', readTime: '7분' },
];

export default function HomePage() {
  return (
    <V18Shell>
      <div className="container">
        <section className="hero">
          <h1 className="hero-title">유튜브 채널 운영 노하우 가이드</h1>
          <p className="hero-sub">
            알고리즘, 시니어 사연 쇼츠, AI 도구 활용, 채널 수익화까지.<br />
            유튜브 시작하시는 분들을 위한 실전 가이드 27편을 무료로 정리했습니다.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">카테고리</h2>
          <div className="cat-list">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/blog?cat=${c.id}`} className="cat-item">
                <h3 className="cat-name">{c.name}</h3>
                <p className="cat-desc">{c.desc}</p>
                <div className="cat-count">가이드 {c.count}편 →</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">최신 가이드</h2>
          <ul className="post-list">
            {LATEST.map((p) => (
              <li key={p.slug} className="post-item">
                <Link href={`/blog/${p.slug}`} className="post-link">
                  <div className="post-meta">
                    <span className="post-cat">{p.cat}</span>
                    <span className="post-dot">·</span>
                    <span className="post-date">{p.date}</span>
                    <span className="post-dot">·</span>
                    <span className="post-time">{p.readTime}</span>
                  </div>
                  <h3 className="post-title">{p.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
          <div className="more-row">
            <Link href="/blog" className="more-link">전체 27편 보기 →</Link>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">인기 가이드</h2>
          <ul className="post-list">
            {POPULAR.map((p) => (
              <li key={p.slug} className="post-item">
                <Link href={`/blog/${p.slug}`} className="post-link">
                  <div className="post-meta">
                    <span className="post-cat">{p.cat}</span>
                    <span className="post-dot">·</span>
                    <span className="post-time">{p.readTime}</span>
                  </div>
                  <h3 className="post-title">{p.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="section about-section">
          <h2 className="section-title">사이트 소개</h2>
          <p className="about-p">
            AlgoMaker는 유튜브 채널을 시작하거나 키우고 싶으신 분들을 위한 정보 사이트입니다.
            구글 알고리즘 분석, 시니어 사연 쇼츠 채널 운영법, 클로드와 ChatGPT 같은 AI 도구 활용법,
            채널 수익화 전략까지 영상 채널 운영의 모든 노하우를 한 곳에 정리했습니다.
          </p>
          <p className="about-p">
            모든 가이드는 무료이며 회원가입이 필요하지 않습니다. 50대 이상 시니어 분들이
            보시기 편하도록 큰 글씨와 단계별 설명으로 작성했습니다. 추가로 영상 자료
            (제목·시나리오·해시태그) 를 자동으로 만들어주는 도구도 무료로 제공하고 있습니다.
          </p>
          <p className="about-p">
            궁금하신 점이 있으시면 <Link href="/contact" className="link">문의 페이지</Link>를
            통해 연락 주세요. 매주 새로운 가이드가 추가됩니다.
          </p>
        </section>
      </div>

      <style jsx>{`
        .hero {
          padding: 56px 0 48px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 48px;
        }
        @media (max-width: 600px) {
          .hero { padding: 36px 0 32px; margin-bottom: 36px; }
        }

        .hero-title {
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          line-height: 1.25;
          margin: 0 0 16px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 26px; line-height: 1.3; margin-bottom: 12px; }
        }

        .hero-sub {
          font-size: 17px;
          color: #525252;
          line-height: 1.7;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .hero-sub { font-size: 15px; line-height: 1.65; }
        }

        .section {
          margin-bottom: 56px;
        }
        @media (max-width: 600px) {
          .section { margin-bottom: 40px; }
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #1a1a1a;
        }
        @media (max-width: 600px) {
          .section-title { font-size: 20px; margin-bottom: 16px; padding-bottom: 10px; }
        }

        .cat-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .cat-list { grid-template-columns: 1fr; gap: 12px; }
        }

        .cat-item {
          display: block;
          padding: 20px 22px;
          background: #f8f8f8;
          border: 1px solid #e5e5e5;
          transition: all 0.15s;
        }
        .cat-item:hover {
          background: #ffffff;
          border-color: #1a1a1a;
        }

        .cat-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
          letter-spacing: -0.018em;
        }
        @media (max-width: 600px) {
          .cat-name { font-size: 16.5px; }
        }

        .cat-desc {
          font-size: 14.5px;
          color: #525252;
          line-height: 1.6;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .cat-desc { font-size: 13.5px; }
        }

        .cat-count {
          font-size: 13px;
          color: #1a1a1a;
          font-weight: 600;
        }

        .post-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .post-item {
          border-bottom: 1px solid #e5e5e5;
        }
        .post-item:first-child { border-top: 1px solid #e5e5e5; }

        .post-link {
          display: block;
          padding: 18px 0;
          transition: opacity 0.15s;
        }
        .post-link:hover { opacity: 0.7; }

        .post-meta {
          display: flex;
          gap: 8px;
          font-size: 12.5px;
          color: #737373;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .post-cat {
          font-weight: 700;
          color: #1a1a1a;
        }
        .post-dot { color: #d4d4d4; }

        .post-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.5;
          letter-spacing: -0.015em;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .post-title { font-size: 16px; line-height: 1.45; }
        }

        .more-row {
          padding: 16px 0;
          text-align: center;
        }

        .more-link {
          font-size: 14.5px;
          color: #1a1a1a;
          font-weight: 700;
          padding: 10px 22px;
          border: 1px solid #1a1a1a;
          display: inline-block;
          transition: all 0.15s;
        }
        .more-link:hover {
          background: #1a1a1a;
          color: #ffffff;
        }

        .about-section {
          background: #f8f8f8;
          padding: 32px 28px;
        }
        @media (max-width: 600px) {
          .about-section { padding: 24px 20px; }
        }
        .about-section .section-title {
          margin-bottom: 16px;
        }

        .about-p {
          font-size: 15.5px;
          color: #404040;
          line-height: 1.8;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        .about-p:last-child { margin-bottom: 0; }
        @media (max-width: 600px) {
          .about-p { font-size: 14.5px; line-height: 1.75; }
        }

        .link {
          color: #1a1a1a;
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
    </V18Shell>
  );
}
