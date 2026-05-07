'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { V18Shell } from '../_shared/V18Shell';

interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  category: 'algorithm' | 'senior' | 'aitools' | 'monetization';
  categoryLabel: string;
  publishedAt: string;
  summary: string;
}

const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'algorithm', label: '알고리즘' },
  { id: 'senior', label: '시니어' },
  { id: 'aitools', label: 'AI 도구' },
  { id: 'monetization', label: '수익화' },
];

export default function BlogListPage() {
  const [filter, setFilter] = useState<string>('all');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/posts/_index.json')
      .then(res => res.json())
      .then(data => {
        setGuides(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? guides : guides.filter((g) => g.category === filter);
    return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [filter, guides]);

  return (
    <V18Shell>
      <div className="container">
        <header className="page-head">
          <h1 className="page-title">전체 가이드</h1>
          <p className="page-sub">
            유튜브 채널 운영 노하우 {guides.length}편. 알고리즘, 시니어 사연 쇼츠,
            AI 도구 활용, 채널 수익화까지 영상 채널의 모든 것을 정리했습니다.
          </p>
        </header>

        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.id !== 'all' && (
                <span className="filter-count">
                  {guides.filter((g) => g.category === f.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="post-count">
          {loading ? '불러오는 중...' : `${filtered.length}편의 가이드`}
        </div>

        <ul className="post-list">
          {filtered.map((g) => (
            <li key={g.slug} className="post-item">
              <Link href={`/blog/${g.slug}`} className="post-link">
                <div className="post-meta">
                  <span className="post-cat">{g.categoryLabel}</span>
                  <span className="post-dot">·</span>
                  <span className="post-date">{g.publishedAt.replace(/-/g, '.')}</span>
                </div>
                <h2 className="post-title">{g.title}</h2>
                <p className="post-summary">{g.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .container {
          max-width: 760px; margin: 0 auto; padding: 32px 20px 60px;
        }
        @media (max-width: 600px) { .container { padding: 24px 16px 50px; } }

        .page-head {
          padding-bottom: 24px; margin-bottom: 32px;
          border-bottom: 1px solid #e5e5e5;
        }
        .page-title {
          font-size: 32px; font-weight: 800; letter-spacing: -0.025em;
          margin: 0 0 12px; color: #1a1a1a;
        }
        @media (max-width: 600px) { .page-title { font-size: 26px; } }
        .page-sub {
          font-size: 15px; color: #525252; line-height: 1.7;
          margin: 0; word-break: keep-all;
        }

        .filter-bar {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;
        }
        .filter-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; font-size: 14px; font-weight: 600;
          background: #ffffff; border: 1px solid #e5e5e5; color: #525252;
          cursor: pointer; transition: all 0.15s;
        }
        .filter-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .filter-btn.active {
          background: #1a1a1a; color: #ffffff; border-color: #1a1a1a;
        }
        .filter-count {
          font-size: 12px; opacity: 0.7;
        }

        .post-count {
          font-size: 13px; color: #737373; margin-bottom: 20px;
          font-weight: 600;
        }

        .post-list { list-style: none; padding: 0; margin: 0; }
        .post-item {
          padding: 24px 0; border-bottom: 1px solid #e5e5e5;
        }
        .post-link {
          display: block; text-decoration: none; color: inherit;
        }
        .post-meta {
          font-size: 13px; color: #737373;
          display: flex; gap: 8px; margin-bottom: 8px;
        }
        .post-cat { color: #c2410c; font-weight: 700; }
        .post-title {
          font-size: 19px; font-weight: 700; letter-spacing: -0.02em;
          margin: 0 0 6px; color: #1a1a1a; line-height: 1.4;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .post-title { font-size: 17px; } }
        .post-summary {
          font-size: 14px; color: #525252; line-height: 1.6;
          margin: 0; word-break: keep-all;
        }
        .post-link:hover .post-title { color: #c2410c; }
      `}</style>
    </V18Shell>
  );
}
