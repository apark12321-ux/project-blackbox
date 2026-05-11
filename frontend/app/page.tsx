'use client';

/**
 * NuTube 메인 페이지 v21 - 하우징허브 스타일
 * 인디고 컬러, 둥근 카드, 모던 미니멀 디자인
 */

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { V18Shell } from './_shared/V18Shell';

const CATEGORIES = [
  {
    id: 'algorithm',
    name: '유튜브 알고리즘',
    desc: '검색 노출, 시청 지속률, 떡상 패턴까지. 박 실장 11공식 기반 알고리즘 노하우.',
    count: 11,
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
  },
  {
    id: 'senior',
    name: '시니어 사연 쇼츠',
    desc: '50~80대 타겟 채널 운영법. 촬영 실수 방어, 편집 기초, 100명 모으기 등.',
    count: 11,
    icon: '👴',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
  },
  {
    id: 'aitools',
    name: 'AI 도구 활용',
    desc: '클로드, ChatGPT, Sora 등을 영상 제작에 활용하는 실전 가이드.',
    count: 11,
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
  },
  {
    id: 'monetization',
    name: '영상 채널 수익화',
    desc: '광고 수익 계산법, 첫 100명 구독자, 멘탈 관리까지.',
    count: 5,
    icon: '💰',
    gradient: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
  },
];

const LATEST = [
  { slug: 'senior-shooting-mistakes', cat: '시니어', catKey: 'senior', title: '시니어가 처음 영상 찍을 때 흔한 실수 7가지', date: '2026.05.06' },
  { slug: 'senior-first-100', cat: '시니어', catKey: 'senior', title: '시니어 채널 첫 100명 구독자 모으기 단계별 가이드', date: '2026.05.06' },
  { slug: 'senior-capcut-basic', cat: '시니어', catKey: 'senior', title: '시니어 영상 편집 - 무료 앱 기본 사용법', date: '2026.05.06' },
  { slug: 'senior-family-channel', cat: '시니어', catKey: 'senior', title: '50대 이후 시작하는 가족 일상 채널 가이드', date: '2026.05.06' },
  { slug: 'senior-thumbnail-design', cat: '시니어', catKey: 'senior', title: '시니어 시청자가 좋아하는 썸네일 디자인 5가지', date: '2026.05.06' },
];

const POPULAR = [
  { slug: 'algorithm-seo', cat: '알고리즘', catKey: 'algorithm', title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', date: '2026.05.02' },
  { slug: 'algorithm-mistakes', cat: '알고리즘', catKey: 'algorithm', title: '치명적 실수 7가지 - 알고 피하면 떡상', date: '2026.05.02' },
  { slug: 'algorithm-retention', cat: '알고리즘', catKey: 'algorithm', title: '시청자를 채널에 가두는 무한 루프 세팅', date: '2026.05.02' },
  { slug: 'algorithm-mindset', cat: '수익화', catKey: 'monetization', title: '6개월간 떡상이 안 와도 버티는 멘탈 관리', date: '2026.05.02' },
  { slug: 'first-100-subs', cat: '수익화', catKey: 'monetization', title: '첫 100명 구독자 모으는 방법', date: '2026.05.02' },
];

const CATEGORY_ICON: Record<string, string> = {
  algorithm: '🎯',
  senior: '👴',
  aitools: '🤖',
  monetization: '💰',
};

const CATEGORY_GRADIENT: Record<string, string> = {
  algorithm: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
  senior: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
  aitools: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
  monetization: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
};

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/publish?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <V18Shell>
      <style jsx global>{`
        .nh-home {
          background: #fff;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #111827;
          min-height: 100vh;
        }

        /* HERO */
        .nh-hero {
          position: relative;
          padding: 80px 24px 100px;
          background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #fff 100%);
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .nh-hero { padding: 48px 16px 64px; }
        }
        .nh-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .nh-hero-inner { grid-template-columns: 1fr; gap: 32px; }
        }
        .nh-hero-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #fff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid #c7d2fe;
          border-radius: 999px;
          letter-spacing: 0.04em;
          margin-bottom: 18px;
        }
        .nh-hero-title {
          font-size: 56px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #111827;
          margin: 0 0 20px;
          word-break: keep-all;
        }
        @media (max-width: 900px) {
          .nh-hero-title { font-size: 40px; }
        }
        @media (max-width: 640px) {
          .nh-hero-title { font-size: 32px; }
        }
        .nh-hero-accent { color: #4f46e5; }
        .nh-hero-desc {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.65;
          margin: 0 0 32px;
          max-width: 540px;
          word-break: keep-all;
        }
        @media (max-width: 640px) {
          .nh-hero-desc { font-size: 15px; }
        }
        .nh-hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .nh-btn-primary {
          padding: 16px 32px;
          background: #4f46e5;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .nh-btn-primary:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.35);
        }
        .nh-btn-outline {
          padding: 16px 32px;
          background: #fff;
          color: #4f46e5;
          font-size: 16px;
          font-weight: 700;
          border: 2px solid #e5e7eb;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .nh-btn-outline:hover {
          border-color: #4f46e5;
        }
        @media (max-width: 640px) {
          .nh-btn-primary, .nh-btn-outline { padding: 13px 24px; font-size: 14px; }
        }

        /* HERO Right Card */
        .nh-hero-card {
          position: relative;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%);
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 30px 60px -15px rgba(79, 70, 229, 0.3);
          border: 8px solid #fff;
        }
        .nh-hero-card-inner {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
        }
        @media (max-width: 900px) {
          .nh-hero-card { max-width: 480px; margin: 0 auto; }
          .nh-hero-card-inner { font-size: 80px; }
        }
        .nh-hero-floating {
          position: absolute;
          bottom: -24px;
          left: -24px;
          background: #fff;
          padding: 20px 24px;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        @media (max-width: 900px) {
          .nh-hero-floating { display: none; }
        }
        .nh-hero-floating-icon {
          width: 44px;
          height: 44px;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        .nh-hero-floating-text {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .nh-hero-floating-sub {
          font-size: 12px;
          color: #9ca3af;
          margin: 2px 0 0;
        }

        /* SECTIONS */
        .nh-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
        }
        @media (max-width: 640px) {
          .nh-section { padding: 48px 16px; }
        }
        .nh-section-head {
          margin-bottom: 40px;
        }
        .nh-section-tag {
          display: inline-block;
          padding: 4px 12px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .nh-section-title {
          font-size: 36px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.025em;
          margin: 0 0 12px;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 640px) {
          .nh-section-title { font-size: 26px; }
        }
        .nh-section-desc {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
          word-break: keep-all;
        }

        /* CATEGORY GRID */
        .nh-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .nh-cat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .nh-cat-grid { grid-template-columns: 1fr; gap: 14px; }
        }
        .nh-cat-card {
          padding: 28px 24px;
          background: #fff;
          border: 1px solid #f3f4f6;
          border-radius: 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
        }
        .nh-cat-card:hover {
          transform: translateY(-6px);
          border-color: #c7d2fe;
          box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.15);
        }
        .nh-cat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 18px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }
        .nh-cat-name {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 10px;
          letter-spacing: -0.018em;
        }
        .nh-cat-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 18px;
          flex: 1;
          word-break: keep-all;
        }
        .nh-cat-count {
          font-size: 13px;
          color: #4f46e5;
          font-weight: 700;
          padding-top: 14px;
          border-top: 1px solid #f3f4f6;
        }

        /* FEATURES (3 columns) */
        .nh-feat-bg {
          background: #f9fafb;
        }
        .nh-feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .nh-feat-grid { grid-template-columns: 1fr; }
        }
        .nh-feat {
          padding: 32px 28px;
          background: #fff;
          border-radius: 20px;
          text-align: center;
        }
        .nh-feat-icon {
          width: 64px;
          height: 64px;
          background: #eef2ff;
          border-radius: 16px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }
        .nh-feat-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 10px;
        }
        .nh-feat-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.65;
          margin: 0;
          word-break: keep-all;
        }

        /* POST LIST */
        .nh-post-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .nh-post-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .nh-post-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        .nh-post {
          background: #fff;
          border: 1px solid #f3f4f6;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
        }
        .nh-post:hover {
          transform: translateY(-4px);
          border-color: #e0e7ff;
          box-shadow: 0 16px 32px -8px rgba(79, 70, 229, 0.12);
        }
        .nh-post-image {
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          position: relative;
        }
        .nh-post-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          border-radius: 999px;
        }
        .nh-post-body {
          padding: 20px 22px;
        }
        .nh-post-date {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .nh-post-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.4;
          letter-spacing: -0.012em;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nh-post:hover .nh-post-title { color: #4f46e5; }

        .nh-more-row {
          text-align: center;
          margin-top: 40px;
        }
        .nh-more-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 14px 32px;
          background: #fff;
          color: #4f46e5;
          font-size: 15px;
          font-weight: 700;
          border: 2px solid #e0e7ff;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .nh-more-link:hover {
          background: #4f46e5;
          color: #fff;
          border-color: #4f46e5;
        }

        /* TOOL SECTION */
        .nh-tool {
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
        }
        .nh-tool-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .nh-tool-wrap { grid-template-columns: 1fr; }
        }
        .nh-tool-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 24px 0 32px;
        }
        .nh-tool-feat {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 16px;
          align-items: start;
          padding: 18px 20px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .nh-tool-num {
          width: 44px;
          height: 44px;
          background: #4f46e5;
          color: #fff;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
        }
        .nh-tool-feat-title {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }
        .nh-tool-feat-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
          word-break: keep-all;
        }
        .nh-tool-form {
          display: flex;
          gap: 10px;
          padding: 12px;
          background: #fff;
          border-radius: 999px;
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.12);
        }
        @media (max-width: 640px) {
          .nh-tool-form {
            border-radius: 16px;
            flex-direction: column;
          }
        }
        .nh-tool-input {
          flex: 1;
          padding: 12px 18px;
          font-size: 15px;
          color: #111827;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
        }
        .nh-tool-input::placeholder { color: #9ca3af; }
        .nh-tool-submit {
          padding: 12px 24px;
          background: #4f46e5;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .nh-tool-submit:hover:not(:disabled) {
          background: #4338ca;
        }
        .nh-tool-submit:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        .nh-tool-note {
          margin-top: 14px;
          font-size: 13px;
          color: #6b7280;
          text-align: center;
        }

        /* ABOUT */
        .nh-about {
          max-width: 880px;
          margin: 0 auto;
          padding: 80px 24px;
          text-align: center;
        }
        @media (max-width: 640px) {
          .nh-about { padding: 48px 16px; }
        }
        .nh-about-p {
          font-size: 17px;
          color: #4b5563;
          line-height: 1.8;
          margin: 0 0 18px;
          word-break: keep-all;
        }
        @media (max-width: 640px) {
          .nh-about-p { font-size: 15px; }
        }
        .nh-about-p strong {
          color: #4f46e5;
          font-weight: 700;
        }
        .nh-about-link {
          color: #4f46e5;
          font-weight: 700;
          text-decoration: underline;
        }
      `}</style>

      <div className="nh-home">
        {/* HERO */}
        <section className="nh-hero">
          <div className="nh-hero-inner">
            <div>
              <span className="nh-hero-badge">유튜브 채널 운영 가이드</span>
              <h1 className="nh-hero-title">
                알고리즘 · 시니어 · AI<br />
                <span className="nh-hero-accent">유튜브 가이드</span>
              </h1>
              <p className="nh-hero-desc">
                유튜브 채널 운영에 필요한 모든 노하우를 무료로 제공합니다.
                알고리즘 분석부터 자동 메타데이터 생성 도구까지 한 곳에서.
              </p>
              <div className="nh-hero-buttons">
                <Link href="/blog" className="nh-btn-primary">
                  가이드 둘러보기 →
                </Link>
                <Link href="/publish" className="nh-btn-outline">
                  메타데이터 생성
                </Link>
              </div>
            </div>
            <div className="nh-hero-card">
              <div className="nh-hero-card-inner">🎬</div>
              <div className="nh-hero-floating">
                <div className="nh-hero-floating-icon">📚</div>
                <div>
                  <p className="nh-hero-floating-text">실전 가이드 38편</p>
                  <p className="nh-hero-floating-sub">매주 새 글 업데이트</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="nh-section">
          <div className="nh-section-head">
            <span className="nh-section-tag">CATEGORIES</span>
            <h2 className="nh-section-title">4가지 카테고리</h2>
            <p className="nh-section-desc">
              유튜브 채널 운영의 모든 영역을 다룹니다.
            </p>
          </div>
          <div className="nh-cat-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/blog?cat=${c.id}`} className="nh-cat-card">
                <div className="nh-cat-icon" style={{ background: c.gradient }}>
                  {c.icon}
                </div>
                <h3 className="nh-cat-name">{c.name}</h3>
                <p className="nh-cat-desc">{c.desc}</p>
                <div className="nh-cat-count">가이드 {c.count}편 →</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <div className="nh-feat-bg">
          <section className="nh-section">
            <div className="nh-section-head">
              <span className="nh-section-tag">WHY NUTUBE</span>
              <h2 className="nh-section-title">NuTube의 강점</h2>
              <p className="nh-section-desc">
                실전 데이터, AI 시너지, 시니어 맞춤형 - 우리만의 3가지 가치
              </p>
            </div>
            <div className="nh-feat-grid">
              <div className="nh-feat">
                <div className="nh-feat-icon">📊</div>
                <h3 className="nh-feat-title">실전 데이터 기반</h3>
                <p className="nh-feat-desc">
                  실제 채널 데이터를 분석한 알고리즘 11공식과
                  검증된 운영 노하우.
                </p>
              </div>
              <div className="nh-feat">
                <div className="nh-feat-icon">🤝</div>
                <h3 className="nh-feat-title">인간 + AI 시너지</h3>
                <p className="nh-feat-desc">
                  AI 도구 활용법과 인간만의 따뜻한 감성을 결합해
                  자동 생성을 넘어선 가치 창출.
                </p>
              </div>
              <div className="nh-feat">
                <div className="nh-feat-icon">👥</div>
                <h3 className="nh-feat-title">시니어 맞춤형</h3>
                <p className="nh-feat-desc">
                  디지털 도구가 어려운 50~70 세대를 위한
                  큰 글씨와 단계별 친절한 설명.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* LATEST POSTS */}
        <section className="nh-section">
          <div className="nh-section-head">
            <span className="nh-section-tag">LATEST</span>
            <h2 className="nh-section-title">최신 가이드</h2>
            <p className="nh-section-desc">
              새로 업데이트된 가이드를 확인하세요.
            </p>
          </div>
          <div className="nh-post-grid">
            {LATEST.slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="nh-post">
                <div
                  className="nh-post-image"
                  style={{ background: CATEGORY_GRADIENT[p.catKey] }}
                >
                  {CATEGORY_ICON[p.catKey]}
                  <span className="nh-post-badge">{p.cat}</span>
                </div>
                <div className="nh-post-body">
                  <div className="nh-post-date">📅 {p.date}</div>
                  <h3 className="nh-post-title">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="nh-more-row">
            <Link href="/blog" className="nh-more-link">전체 가이드 보기 →</Link>
          </div>
        </section>

        {/* POPULAR POSTS */}
        <div className="nh-feat-bg">
          <section className="nh-section">
            <div className="nh-section-head">
              <span className="nh-section-tag">POPULAR</span>
              <h2 className="nh-section-title">인기 가이드</h2>
              <p className="nh-section-desc">
                많은 분들이 읽은 검증된 가이드들.
              </p>
            </div>
            <div className="nh-post-grid">
              {POPULAR.slice(0, 3).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="nh-post">
                  <div
                    className="nh-post-image"
                    style={{ background: CATEGORY_GRADIENT[p.catKey] }}
                  >
                    {CATEGORY_ICON[p.catKey]}
                    <span className="nh-post-badge">{p.cat}</span>
                  </div>
                  <div className="nh-post-body">
                    <div className="nh-post-date">📅 {p.date}</div>
                    <h3 className="nh-post-title">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* TOOL SECTION */}
        <div className="nh-tool">
          <section className="nh-section">
            <div className="nh-tool-wrap">
              <div>
                <span className="nh-section-tag">TOOL</span>
                <h2 className="nh-section-title">메타데이터 자동 생성기</h2>
                <p className="nh-section-desc">
                  키워드만 입력하면 박 실장 11공식이 자동 적용된
                  영상 메타데이터(제목·시나리오·해시태그·SEO)를 5초 안에.
                </p>

                <div className="nh-tool-features">
                  <div className="nh-tool-feat">
                    <div className="nh-tool-num">1</div>
                    <div>
                      <h3 className="nh-tool-feat-title">알고리즘 11공식 자동 적용</h3>
                      <p className="nh-tool-feat-desc">
                        제목 8:2 법칙, 음성 SEO, 챕터 전략, 해시태그 패턴
                      </p>
                    </div>
                  </div>
                  <div className="nh-tool-feat">
                    <div className="nh-tool-num">2</div>
                    <div>
                      <h3 className="nh-tool-feat-title">시니어 알고리즘 자동 인식</h3>
                      <p className="nh-tool-feat-desc">
                        시니어 키워드 입력 시 전용 후크·업로드 시간 자동 적용
                      </p>
                    </div>
                  </div>
                  <div className="nh-tool-feat">
                    <div className="nh-tool-num">3</div>
                    <div>
                      <h3 className="nh-tool-feat-title">한 번에 전체 메타데이터</h3>
                      <p className="nh-tool-feat-desc">
                        제목 5개, 시나리오, AI 영상 프롬프트, SEO 태그까지 한 번에
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="nh-tool-form">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="영상 키워드 (예: 50대 부업 유튜브)"
                    className="nh-tool-input"
                    aria-label="영상 키워드"
                  />
                  <button type="submit" className="nh-tool-submit" disabled={!keyword.trim()}>
                    생성하기 →
                  </button>
                </form>
                <p className="nh-tool-note">완전 무료 · 회원가입 불필요</p>
              </div>

              <div className="nh-hero-card" style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
              }}>
                <div className="nh-hero-card-inner">⚡</div>
              </div>
            </div>
          </section>
        </div>

        {/* ABOUT */}
        <section className="nh-about">
          <span className="nh-section-tag">ABOUT</span>
          <h2 className="nh-section-title" style={{ marginBottom: 24 }}>사이트 소개</h2>
          <p className="nh-about-p">
            NuTube는 유튜브 채널을 시작하거나 키우고 싶은 분들을 위한 정보 사이트입니다.
            <strong> 가이드 + 도구</strong> 두 가지 방식으로 도와드립니다.
          </p>
          <p className="nh-about-p">
            모든 가이드는 무료이며 회원가입이 필요하지 않습니다.
            50대 이상 시니어 분들이 편하게 보실 수 있도록 큰 글씨와
            단계별 설명으로 작성했습니다.
          </p>
          <p className="nh-about-p">
            궁금하신 점은 <Link href="/contact" className="nh-about-link">문의 페이지</Link>를
            통해 연락 주세요. 매주 새로운 가이드가 추가됩니다.
          </p>
        </section>
      </div>
    </V18Shell>
  );
}
