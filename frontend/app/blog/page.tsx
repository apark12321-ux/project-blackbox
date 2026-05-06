'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { V18Shell } from '../_shared/V18Shell';

interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  category: 'algorithm' | 'senior' | 'aitools' | 'monetization';
  categoryLabel: string;
  readTime: string;
  publishedAt: string;
}

const GUIDES: Guide[] = [
  // 알고리즘 (10편)
  { slug: 'algorithm-seo', title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', subtitle: '제목 8:2 법칙과 음성 SEO로 검색 노출 200%', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'algorithm-retention', title: '시청자를 채널에 가두는 무한 루프 세팅', subtitle: '챕터 + 최종화면 + 재생목록으로 체류시간 2배', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'algorithm-branding', title: '클릭을 부르는 브랜딩과 디테일의 힘', subtitle: '60-30-10 컬러 법칙과 채널 아트 3요소 공식', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'algorithm-mistakes', title: '치명적 실수 7가지 - 알고 피하면 떡상', subtitle: '99% 채널이 모르는 알고리즘 위반 행동', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'youtube-algorithm', title: '유튜브 알고리즘 작동 원리 완벽 분석', subtitle: '추천 영상에 노출되는 진짜 기준 6가지', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-01' },
  { slug: 'viral-patterns', title: '떡상 채널 패턴 분석', subtitle: '조회수 100만+ 채널들의 공통점 7가지', category: 'algorithm', categoryLabel: '알고리즘', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'channel-concept', title: '채널 컨셉 5가지 카테고리 정리', subtitle: '나에게 맞는 채널 방향 찾기', category: 'algorithm', categoryLabel: '알고리즘', readTime: '6분', publishedAt: '2026-05-01' },
  { slug: 'youtube-start', title: '유튜브 시작 가이드 - 첫 한 달 핵심', subtitle: '0명에서 100명 구독자까지 단계별 안내', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'human-warmth', title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도', subtitle: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-05-04' },
  { slug: 'youtube-monetization', title: '유튜브 채널 수익화 완전 정복', subtitle: '광고 수익부터 협찬·멤버십까지 다양한 수익 모델', category: 'algorithm', categoryLabel: '알고리즘', readTime: '7분', publishedAt: '2026-04-28' },

  // 시니어 (5편)
  { slug: 'senior-channel-start', title: '50대부터 시작하는 시니어 사연 쇼츠 채널', subtitle: '처음 시작하시는 분들을 위한 단계별 안내', category: 'senior', categoryLabel: '시니어', readTime: '8분', publishedAt: '2026-05-04' },
  { slug: 'senior-content-ideas', title: '시니어 채널 콘텐츠 아이디어 30가지', subtitle: '시청자 공감을 부르는 검증된 주제 30가지', category: 'senior', categoryLabel: '시니어', readTime: '9분', publishedAt: '2026-05-04' },
  { slug: 'senior-hook-patterns', title: '시청자를 사로잡는 시니어 영상 후크 8가지', subtitle: '영상 첫 5초로 시청 완료율 60% 올리는 법', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-04' },
  { slug: 'senior-engagement', title: '시니어 채널 댓글과 참여 늘리는 5가지 질문', subtitle: '알고리즘이 좋아하는 참여형 질문 패턴', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-04' },
  { slug: 'senior-policy-safe', title: '시니어 채널 정책 위반 피하는 6가지 규칙', subtitle: '안전하게 채널 키우는 핵심 운영 규칙', category: 'senior', categoryLabel: '시니어', readTime: '7분', publishedAt: '2026-05-04' },

  // AI 도구 (9편)
  { slug: 'claude-youtube-workflow', title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스', subtitle: '기획부터 업로드 패키지까지 클로드 한 곳에서 완성', category: 'aitools', categoryLabel: 'AI 도구', readTime: '9분', publishedAt: '2026-05-04' },
  { slug: 'chatgpt-script', title: 'ChatGPT로 영상 대본 빠르게 쓰는 법', subtitle: 'AI를 보조 도구로 활용하는 5가지 프롬프트', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-04-30' },
  { slug: 'ai-thumbnail', title: 'AI 썸네일 만드는 도구 5개 비교', subtitle: 'Midjourney, DALL-E, Sora 등 AI 이미지 생성 비교', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-04-29' },
  { slug: 'ai-tools', title: 'AI 영상 만들기 도구 모음', subtitle: '초보도 쓸 수 있는 AI 도구 추천 가이드', category: 'aitools', categoryLabel: 'AI 도구', readTime: '8분', publishedAt: '2026-04-28' },
  { slug: 'phone-shooting', title: '핸드폰만으로 영상 잘 찍는 법', subtitle: '카메라 없이도 가능한 촬영 노하우', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'free-editing-apps', title: '무료 영상 편집 앱 추천', subtitle: '초보가 바로 쓸 수 있는 편집 도구 5선', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'camera-anxiety', title: '카메라 울렁증 극복하기', subtitle: '얼굴 안 나와도 채널 운영 가능한 방법', category: 'aitools', categoryLabel: 'AI 도구', readTime: '6분', publishedAt: '2026-05-01' },
  { slug: 'thumbnail-tips', title: '눈길을 사로잡는 썸네일 글자 디자인', subtitle: '클릭율 2배 늘리는 썸네일 폰트 활용법', category: 'aitools', categoryLabel: 'AI 도구', readTime: '7분', publishedAt: '2026-05-01' },
  { slug: 'voice-seo', title: '음성 SEO 완전 정복 - 검색 노출 200%', subtitle: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식', category: 'aitools', categoryLabel: 'AI 도구', readTime: '6분', publishedAt: '2026-05-01' },

  // 수익화 (3편)
  { slug: 'algorithm-mindset', title: '6개월간 떡상이 안 와도 버티는 멘탈 관리', subtitle: '실패해도 다시 도전하는 5가지 마인드셋', category: 'monetization', categoryLabel: '수익화', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'first-100-subs', title: '첫 100명 구독자 모으는 방법', subtitle: '0명에서 100명까지 4단계 전략', category: 'monetization', categoryLabel: '수익화', readTime: '7분', publishedAt: '2026-05-02' },
  { slug: 'side-job-50', title: '50대 부업 유튜브 시작 가이드', subtitle: '늦은 나이가 오히려 무기가 되는 채널 운영', category: 'monetization', categoryLabel: '수익화', readTime: '8분', publishedAt: '2026-05-02' },
  { slug: 'revenue-calc', title: '유튜브 광고 수익 계산법', subtitle: '조회수당 수익과 RPM 이해하기', category: 'monetization', categoryLabel: '수익화', readTime: '6분', publishedAt: '2026-04-30' },
];

const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'algorithm', label: '알고리즘' },
  { id: 'senior', label: '시니어' },
  { id: 'aitools', label: 'AI 도구' },
  { id: 'monetization', label: '수익화' },
];

export default function BlogPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    // 1. 필터링 (카테고리)
    const list = filter === 'all' ? GUIDES : GUIDES.filter((g) => g.category === filter);
    // 2. 최신순 정렬 (publishedAt 내림차순)
    return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [filter]);

  return (
    <V18Shell>
      <div className="container">
        <header className="page-head">
          <h1 className="page-title">전체 가이드</h1>
          <p className="page-sub">
            유튜브 채널 운영 노하우 {GUIDES.length}편. 알고리즘, 시니어 사연 쇼츠,
            AI 도구 활용, 채널 수익화까지 영상 채널의 모든 것을 정리했습니다.
          </p>
        </header>

        <nav className="filter">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={filter === f.id ? 'filter-btn active' : 'filter-btn'}
            >
              {f.label}
              {f.id !== 'all' && (
                <span className="filter-count">
                  {GUIDES.filter((g) => g.category === f.id).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="result-count">
          {filtered.length}편의 가이드
        </div>

        <ul className="post-list">
          {filtered.map((g) => (
            <li key={g.slug} className="post-item">
              <Link href={`/blog/${g.slug}`} className="post-link">
                <div className="post-meta">
                  <span className="post-cat">{g.categoryLabel}</span>
                  <span className="post-dot">·</span>
                  <span>{g.publishedAt.replace(/-/g, '.')}</span>
                </div>
                <h2 className="post-title">{g.title}</h2>
                <p className="post-subtitle">{g.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .page-head {
          padding: 48px 0 36px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 28px;
        }
        @media (max-width: 600px) {
          .page-head { padding: 32px 0 24px; margin-bottom: 20px; }
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        @media (max-width: 600px) {
          .page-title { font-size: 24px; margin-bottom: 10px; }
        }

        .page-sub {
          font-size: 16px;
          color: #525252;
          line-height: 1.7;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .page-sub { font-size: 14.5px; }
        }

        .filter {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          color: #525252;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-btn:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }
        .filter-btn.active {
          background: #1a1a1a;
          color: #ffffff;
          border-color: #1a1a1a;
        }

        .filter-count {
          display: inline-block;
          padding: 0 6px;
          font-size: 11.5px;
          background: rgba(0,0,0,0.08);
          border-radius: 100px;
          line-height: 1.7;
          font-weight: 700;
        }
        .filter-btn.active .filter-count {
          background: rgba(255,255,255,0.2);
        }

        .result-count {
          font-size: 13.5px;
          color: #737373;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e5e5;
        }

        .post-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .post-item {
          border-bottom: 1px solid #e5e5e5;
        }

        .post-link {
          display: block;
          padding: 22px 0;
          transition: opacity 0.15s;
        }
        .post-link:hover { opacity: 0.7; }

        .post-meta {
          display: flex;
          gap: 8px;
          font-size: 12.5px;
          color: #737373;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .post-cat {
          font-weight: 700;
          color: #c2410c;
        }
        .post-dot { color: #d4d4d4; }

        .post-title {
          font-size: 19px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.018em;
          line-height: 1.45;
          margin: 0 0 6px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .post-title { font-size: 17px; line-height: 1.4; }
        }

        .post-subtitle {
          font-size: 14.5px;
          color: #525252;
          line-height: 1.6;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .post-subtitle { font-size: 13.5px; }
        }
      `}</style>
    </V18Shell>
  );
}
