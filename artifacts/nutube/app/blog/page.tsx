'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { V18Shell } from '../_shared/V18Shell';

interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  category: 'algorithm' | 'senior' | 'aitools' | 'monetization';
  categoryLabel: string;
  readTime?: string;
  publishedAt: string;
  tags?: string[];
}

// 정적 38편 (빠른 초기 표시용)
const STATIC_GUIDES: Guide[] = [
  // 알고리즘 (10편)
  { slug: 'algorithm-seo', title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', subtitle: '제목 8:2 법칙과 음성 SEO로 검색 노출 200%', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'algorithm-retention', title: '시청자를 채널에 가두는 무한 루프 세팅', subtitle: '챕터 + 최종화면 + 재생목록으로 체류시간 2배', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'algorithm-branding', title: '클릭을 부르는 브랜딩과 디테일의 힘', subtitle: '60-30-10 컬러 법칙과 채널 아트 3요소 공식', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'algorithm-mistakes', title: '치명적 실수 7가지 - 알고 피하면 떡상', subtitle: '99% 채널이 모르는 알고리즘 위반 행동', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'viral-patterns', title: '떡상 채널 패턴 분석', subtitle: '조회수 100만+ 채널들의 공통점 7가지', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'youtube-algorithm', title: '유튜브 알고리즘 작동 원리 완벽 분석', subtitle: '추천 영상에 노출되는 진짜 기준 6가지', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-01' },
  { slug: 'channel-concept', title: '채널 컨셉 5가지 카테고리 정리', subtitle: '나에게 맞는 채널 방향 찾기', category: 'algorithm', categoryLabel: '알고리즘', readTime: '6분', publishedAt: '2026-05-01' },
  { slug: 'youtube-start', title: '유튜브 시작 가이드 - 첫 한 달 핵심', subtitle: '0명에서 100명 구독자까지 단계별 안내', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-01' },
  { slug: 'youtube-monetization', title: '유튜브 채널 수익화 완전 정복', subtitle: '광고 수익부터 협찬·멤버십까지 다양한 수익 모델', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-04-28' },
  { slug: 'human-warmth', title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도', subtitle: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-04' },

  // 시니어 (10편)
  { slug: 'senior-channel-start', title: '50대부터 시작하는 시니어 사연 쇼츠 채널', subtitle: '처음 시작하시는 분들을 위한 단계별 안내', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-04' },
  { slug: 'senior-content-ideas', title: '시니어 채널 콘텐츠 아이디어 30가지', subtitle: '시청자 공감을 부르는 검증된 주제 30가지', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-04' },
  { slug: 'senior-hook-patterns', title: '시청자를 사로잡는 시니어 영상 후크 8가지', subtitle: '영상 첫 5초로 시청 완료율 60% 올리는 법', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-04' },
  { slug: 'senior-engagement', title: '시니어 채널 댓글과 참여 늘리는 5가지 질문', subtitle: '알고리즘이 좋아하는 참여형 질문 패턴', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-04' },
  { slug: 'senior-policy-safe', title: '시니어 채널 정책 위반 피하는 6가지 규칙', subtitle: '안전하게 채널 키우는 핵심 운영 규칙', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-04' },
  { slug: 'senior-shooting-mistakes', title: '시니어가 처음 영상 찍을 때 흔한 실수 7가지', subtitle: '50대 이후 처음 촬영 시 자주 하는 실수와 해결법', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-06' },
  { slug: 'senior-first-100', title: '시니어 채널 첫 100명 구독자 모으기 단계별 가이드', subtitle: '50~70대 채널의 100명 도달 4단계 전략', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-06' },
  { slug: 'senior-capcut-basic', title: '시니어 영상 편집 - 무료 앱 기본 사용법', subtitle: '처음 시작하는 시니어를 위한 영상 편집 5단계', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-06' },
  { slug: 'senior-family-channel', title: '50대 이후 시작하는 가족 일상 채널 가이드', subtitle: '가족과 함께 추억을 영상으로 남기는 채널 운영법', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-06' },
  { slug: 'senior-thumbnail-design', title: '시니어 시청자가 좋아하는 썸네일 디자인 5가지', subtitle: '50~70대 시청자의 클릭을 부르는 썸네일 원칙', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-06' },

  // AI 도구 (11편)
  { slug: 'ai-tools', title: 'AI 영상 만들기 도구 모음', subtitle: '초보도 쓸 수 있는 AI 도구 추천 가이드', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-04-28' },
  { slug: 'ai-thumbnail', title: 'AI 썸네일 만드는 도구 5개 비교', subtitle: 'Midjourney, DALL-E, Sora 등 AI 이미지 생성 비교', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-04-29' },
  { slug: 'chatgpt-script', title: 'ChatGPT로 영상 대본 빠르게 쓰는 법', subtitle: 'AI를 보조 도구로 활용하는 5가지 프롬프트', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-04-30' },
  { slug: 'voice-seo', title: '음성 SEO 완전 정복 - 검색 노출 200%', subtitle: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-05-01' },
  { slug: 'thumbnail-tips', title: '눈길을 사로잡는 썸네일 글자 디자인', subtitle: '클릭율 2배 늘리는 썸네일 폰트 활용법', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'camera-anxiety', title: '카메라 울렁증 극복하기', subtitle: '얼굴 안 나와도 채널 운영 가능한 방법', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'free-editing-apps', title: '무료 영상 편집 앱 추천', subtitle: '초보가 바로 쓸 수 있는 편집 도구 5선', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'phone-shooting', title: '핸드폰만으로 영상 잘 찍는 법', subtitle: '카메라 없이도 가능한 촬영 노하우', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-05-01' },
  { slug: 'claude-youtube-workflow', title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스', subtitle: '기획부터 업로드 패키지까지 클로드 한 곳에서 완성', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-05-04' },
  { slug: 'ai-dubbing-korean', title: 'AI 자동 더빙으로 한국어 영상 자연스럽게 만들기', subtitle: '외국어 자막 영상 → 자연스러운 한국어 더빙 자동화', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-05-08' },
  { slug: 'ai-thumbnail-master', title: 'AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결', subtitle: 'Midjourney + Canva + ChatGPT 조합으로 프로 썸네일 5분 완성', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-05-08' },

  // 수익화 (5편)
  { slug: 'algorithm-mindset', title: '6개월간 떡상이 안 와도 버티는 멘탈 관리', subtitle: '실패해도 다시 도전하는 5가지 마인드셋', category: 'monetization', categoryLabel: '수익화', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'first-100-subs', title: '첫 100명 구독자 모으는 방법', subtitle: '0명에서 100명까지 4단계 전략', category: 'monetization', categoryLabel: '수익화', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'side-job-50', title: '50대 부업 유튜브 시작 가이드', subtitle: '늦은 나이가 오히려 무기가 되는 채널 운영', category: 'monetization', categoryLabel: '수익화', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'revenue-calc', title: '유튜브 광고 수익 계산법', subtitle: '조회수당 수익과 RPM 이해하기', category: 'monetization', categoryLabel: '수익화', readTime: '7분', publishedAt: '2026-04-30' },
  { slug: 'sponsorship-strategy', title: '유튜브 스폰서십 받는 채널 만드는 5단계 전략', subtitle: '구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결', category: 'monetization', categoryLabel: '수익화', readTime: '8분', publishedAt: '2026-05-08' },

  // v19 추가
  { slug: 'shorts-algorithm-mastery', title: '유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀', subtitle: '긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙', category: 'algorithm', categoryLabel: '알고리즘', readTime: '9분', publishedAt: '2026-05-08' },
  { slug: 'senior-comment-reply', title: '시니어 채널 댓글 답변 5가지 - 진짜 팬을 만드는 비결', subtitle: '구독자 → 진짜 팬 → 후원자로 키우는 댓글 답변 전략', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-08' },
];

const FILTERS = [
  { id: 'all', label: '전체보기' },
  { id: 'algorithm', label: '알고리즘' },
  { id: 'senior', label: '시니어' },
  { id: 'aitools', label: 'AI 도구' },
  { id: 'monetization', label: '수익화' },
];

// 카테고리별 그라데이션 (이미지 대체용)
const CATEGORY_GRADIENT: Record<string, string> = {
  algorithm: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
  senior: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
  aitools: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
  monetization: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
};

const CATEGORY_ICON: Record<string, string> = {
  algorithm: '🎯',
  senior: '👴',
  aitools: '🤖',
  monetization: '💰',
};

// 날짜 포맷: ISO 8601 → YYYY.MM.DD
function formatDate(iso: string): string {
  if (!iso) return '';
  if (iso.length <= 10) return iso.replace(/-/g, '.');
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function BlogPage() {
  const [filter, setFilter] = useState<string>('all');
  const [dynamicGuides, setDynamicGuides] = useState<Guide[]>([]);

  // Upstash 에서 동적 가이드 추가 (Blog Studio 발행 등)
  useEffect(() => {
    fetch('/api/posts?limit=100')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.posts) {
          const staticSlugs = new Set(STATIC_GUIDES.map(g => g.slug));
          const newGuides = json.data.posts
            .filter((p: any) => !staticSlugs.has(p.slug))
            .map((p: any) => ({
              slug: p.slug,
              title: p.title,
              subtitle: p.subtitle,
              category: p.category,
              categoryLabel: p.categoryLabel || '',
              publishedAt: p.publishedAt,
              readTime: '8분',
              tags: p.tags || [],
            }));
          setDynamicGuides(newGuides);
        }
      })
      .catch(() => {});
  }, []);

  const allGuides = useMemo(() => {
    return [...STATIC_GUIDES, ...dynamicGuides]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [dynamicGuides]);

  const filtered = useMemo(() => {
    return filter === 'all' ? allGuides : allGuides.filter(g => g.category === filter);
  }, [allGuides, filter]);

  return (
    <V18Shell>
      <style jsx global>{`
        .hh-page {
          background: linear-gradient(180deg, #eef2ff 0%, #ffffff 280px);
          min-height: 100vh;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #111827;
        }
        .hh-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }
        @media (max-width: 640px) {
          .hh-container { padding: 32px 16px 60px; }
        }
        .hh-hero {
          margin-bottom: 40px;
        }
        .hh-badge {
          display: inline-block;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 700;
          color: #4f46e5;
          background: #fff;
          border: 1px solid #c7d2fe;
          border-radius: 999px;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .hh-title {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 16px;
          color: #111827;
        }
        @media (max-width: 640px) {
          .hh-title { font-size: 32px; }
        }
        .hh-title-accent { color: #4f46e5; }
        .hh-desc {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.6;
          max-width: 640px;
          word-break: keep-all;
          margin: 0 0 32px;
        }
        @media (max-width: 640px) {
          .hh-desc { font-size: 15px; }
        }
        .hh-filter-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 16px;
          background: rgba(249, 250, 251, 0.5);
          border-radius: 16px;
          margin-bottom: 32px;
          backdrop-filter: blur(8px);
        }
        .hh-filter-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          background: #fff;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .hh-filter-btn:hover {
          border-color: #4f46e5;
          color: #4f46e5;
        }
        .hh-filter-btn.active {
          background: #4f46e5;
          color: #fff;
          border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }
        .hh-count {
          font-size: 11.5px;
          color: #9ca3af;
          margin-left: 6px;
          font-weight: 500;
        }
        .hh-filter-btn.active .hh-count { color: #c7d2fe; }
        .hh-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hh-section-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .hh-section-meta {
          font-size: 14px;
          color: #9ca3af;
        }
        .hh-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .hh-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 640px) {
          .hh-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        .hh-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }
        .hh-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.15);
          border-color: #e0e7ff;
        }
        .hh-card-image {
          aspect-ratio: 16 / 9;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hh-card-icon {
          font-size: 56px;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }
        .hh-card-category {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #4f46e5;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 999px;
          letter-spacing: -0.005em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .hh-card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .hh-card-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 10px;
        }
        .hh-card-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .hh-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 10px;
          line-height: 1.35;
          letter-spacing: -0.015em;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hh-card:hover .hh-card-title { color: #4f46e5; }
        .hh-card-excerpt {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.55;
          word-break: keep-all;
          flex: 1;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hh-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .hh-card-tag {
          display: inline-flex;
          padding: 3px 10px;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 11.5px;
          font-weight: 500;
          border-radius: 999px;
          transition: all 0.18s;
        }
        .hh-card:hover .hh-card-tag {
          background: #eef2ff;
          color: #4f46e5;
        }
        .hh-card-footer {
          padding-top: 14px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hh-card-author {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        .hh-card-arrow {
          font-size: 16px;
          color: #4f46e5;
          font-weight: 700;
          transition: transform 0.2s;
        }
        .hh-card:hover .hh-card-arrow { transform: translateX(4px); }
        .hh-empty {
          padding: 80px 20px;
          text-align: center;
          background: #f9fafb;
          border-radius: 20px;
          border: 2px dashed #e5e7eb;
        }
        .hh-empty-icon { font-size: 48px; opacity: 0.4; margin-bottom: 12px; }
        .hh-empty-text { font-size: 16px; font-weight: 600; color: #9ca3af; }
      `}</style>

      <div className="hh-page">
        <div className="hh-container">
          {/* Hero */}
          <div className="hh-hero">
            <span className="hh-badge">유튜브 채널 운영 가이드</span>
            <h1 className="hh-title">
              영상 채널 운영의<br />
              <span className="hh-title-accent">모든 노하우</span>
            </h1>
            <p className="hh-desc">
              알고리즘, 시니어 사연 쇼츠, AI 도구 활용, 수익화까지.
              유튜브 채널 운영에 필요한 실전 가이드를 정리했습니다.
            </p>
          </div>

          {/* Filter */}
          <div className="hh-filter-bar">
            {FILTERS.map(f => {
              const count = f.id === 'all'
                ? allGuides.length
                : allGuides.filter(g => g.category === f.id).length;
              return (
                <button
                  key={f.id}
                  className={`hh-filter-btn ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}<span className="hh-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Section Head */}
          <div className="hh-section-head">
            <h2 className="hh-section-title">
              {filter === 'all' ? '최근 게시물' : FILTERS.find(f => f.id === filter)?.label + ' 가이드'}
            </h2>
            <span className="hh-section-meta">총 {filtered.length}편</span>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="hh-grid">
              {filtered.map(g => (
                <Link key={g.slug} href={`/blog/${g.slug}`} className="hh-card">
                  <div
                    className="hh-card-image"
                    style={{ background: CATEGORY_GRADIENT[g.category] }}
                  >
                    <div className="hh-card-icon">{CATEGORY_ICON[g.category]}</div>
                    <span className="hh-card-category">{g.categoryLabel}</span>
                  </div>
                  <div className="hh-card-body">
                    <div className="hh-card-meta">
                      <span className="hh-card-meta-item">📅 {formatDate(g.publishedAt)}</span>
                      <span className="hh-card-meta-item">⏱ {g.readTime}</span>
                    </div>
                    <h3 className="hh-card-title">{g.title}</h3>
                    <p className="hh-card-excerpt">{g.subtitle}</p>
                    {g.tags && g.tags.length > 0 && (
                      <div className="hh-card-tags">
                        {g.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="hh-card-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="hh-card-footer">
                      <span className="hh-card-author">NuTube</span>
                      <span className="hh-card-arrow">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="hh-empty">
              <div className="hh-empty-icon">📭</div>
              <p className="hh-empty-text">해당 카테고리에 가이드가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </V18Shell>
  );
}
