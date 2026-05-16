'use client';

// NuTube 가이드 동적 페이지 - Upstash Redis 에서 읽음
// Blog Studio 등 외부에서 발행한 새 가이드 표시
// 하우징허브 스타일 디자인 적용

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { V18Shell } from '../../_shared/V18Shell';

interface Post {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  kicker?: string;
  summary: string;
  content: { type: string; body: string };
  tags?: string[];
  imageUrl?: string;
  relatedPosts?: string[];
  status: string;
}

// Unsplash 카테고리별 큐레이션 이미지 (CDN 즉시 로딩)
const CATEGORY_IMAGES: Record<string, string[]> = {
  algorithm: [
    '1551288049-bebda4e38f71',
    '1460925895917-afdab827c52f',
    '1504868584819-f8e8b4b6d7e3',
    '1526374965328-7f61d4dc18c5',
    '1611532736597-de2d4265fba3',
  ],
  senior: [
    '1560250097-0b93528c311a',
    '1484981138541-3d074aa97716',
    '1522202176988-66273c2fd55f',
    '1517694712202-14dd9538aa97',
    '1573496359142-b8d87734a5a2',
  ],
  aitools: [
    '1488590528505-98d2b5aba04b',
    '1515378791036-0648a3ef77b2',
    '1507003211169-0a1dd7228f2d',
    '1498050108023-c5249f4df085',
    '1519389950473-47ba0277781c',
  ],
  monetization: [
    '1554224155-6726b3ff858f',
    '1526304640581-d334cdbbf45e',
    '1579621970563-ebec7560ff3e',
    '1611974789855-9c2a0a7236a3',
    '1565514020179-026b92b2d70b',
  ],
};

function getPostImageUrl(slug: string, _category: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  return `/thumbnails/${slug}.svg`;
}

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

// 인라인 마크다운 변환 (bold, link)
function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#4f46e5;">$1</a>');
}

// 블록쿼트 라인들을 핵심 요약 카드로 변환
function renderBlockquote(lines: string[]): string {
  const items: string[] = [];
  let title = '';

  for (const line of lines) {
    const stripped = line.replace(/^>\s?/, '');
    if (!stripped.trim()) continue;

    // 첫 번째 bold 텍스트를 제목으로
    const titleMatch = stripped.match(/^\*\*(.+?)\*\*$/);
    if (titleMatch && !title) {
      title = titleMatch[1];
    } else {
      const liMatch = stripped.match(/^[-*]\s+(.+)$/);
      if (liMatch) {
        items.push(applyInline(liMatch[1]));
      } else if (stripped.trim()) {
        items.push(applyInline(stripped));
      }
    }
  }

  const titleHtml = title
    ? `<div class="hh-summary-title">${title}</div>`
    : `<div class="hh-summary-title">이 글의 핵심 요약</div>`;

  const itemsHtml = items
    .map(it => `<div class="hh-summary-item">${it}</div>`)
    .join('');

  return `<div class="hh-summary-box">${titleHtml}${itemsHtml}</div>`;
}

// 자체 Markdown 파서 (외부 패키지 X)
function markdownToHtml(md: string): string {
  const rawLines = md.split('\n');
  const segments: string[] = [];
  let bqLines: string[] = [];
  let normalLines: string[] = [];

  const flushNormal = () => {
    if (normalLines.length === 0) return;
    segments.push(normalLines.join('\n'));
    normalLines = [];
  };
  const flushBq = () => {
    if (bqLines.length === 0) return;
    segments.push(renderBlockquote(bqLines));
    bqLines = [];
  };

  for (const line of rawLines) {
    if (line.startsWith('>')) {
      flushNormal();
      bqLines.push(line);
    } else {
      flushBq();
      normalLines.push(line);
    }
  }
  flushNormal();
  flushBq();

  // 각 일반 세그먼트에 나머지 마크다운 적용
  const processedSegments = segments.map(seg => {
    if (seg.startsWith('<div class="hh-summary-box">')) return seg;

    let html = seg;
    html = html.replace(/^### (.+)$/gm, (_m: string, t: string) => `<h3>${applyInline(t)}</h3>`);
    html = html.replace(/^## (.+)$/gm,  (_m: string, t: string) => `<h2>${applyInline(t)}</h2>`);
    html = applyInline(html);

    const lines = html.split('\n');
    const result: string[] = [];
    let inList = false;
    let inOrdered = false;

    for (const line of lines) {
      const ulMatch = line.match(/^[-*] (.+)$/);
      const olMatch = line.match(/^\d+\. (.+)$/);

      if (ulMatch) {
        if (!inList) { result.push('<ul>'); inList = true; }
        result.push(`<li>${ulMatch[1]}</li>`);
      } else if (olMatch) {
        if (!inOrdered) { result.push('<ol>'); inOrdered = true; }
        result.push(`<li>${olMatch[1]}</li>`);
      } else {
        if (inList)    { result.push('</ul>'); inList = false; }
        if (inOrdered) { result.push('</ol>'); inOrdered = false; }
        if (line.trim() && !line.match(/^<(h2|h3|ul|ol|li|div)/)) {
          result.push(`<p>${line}</p>`);
        } else if (line.trim()) {
          result.push(line);
        }
      }
    }
    if (inList)    result.push('</ul>');
    if (inOrdered) result.push('</ol>');

    return result.join('\n');
  });

  return processedSegments.join('\n');
}

function formatDate(iso: string): string {
  if (!iso) return '';
  if (iso.length <= 10) return iso.replace(/-/g, '.');
  // ISO with time
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 본문 글자수 기반 읽기 시간 자동 계산 (한국어 분당 500자 기준)
function calculateReadTime(text: string | undefined | null, wpm: number = 500): string {
  if (!text) return '1분';
  const plainText = String(text).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const length = plainText.length;
  if (length === 0) return '1분';
  const minutes = Math.max(1, Math.ceil(length / wpm));
  return `${minutes}분`;
}

export default function DynamicBlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (!slug) return;
    
    fetch(`/api/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(json => {
        if (json.success && json.data) {
          setPost(json.data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);
  
  if (loading) {
    return (
      <V18Shell>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 20px', textAlign: 'center', color: '#9ca3af' }}>
          가이드 불러오는 중...
        </div>
      </V18Shell>
    );
  }
  
  if (error || !post) {
    return (
      <V18Shell>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ color: '#111827', fontSize: 28, fontWeight: 800 }}>가이드를 찾을 수 없습니다</h1>
          <Link href="/blog" style={{ display: 'inline-block', marginTop: 24, color: '#4f46e5', fontWeight: 600 }}>
            ← 가이드 목록으로
          </Link>
        </div>
      </V18Shell>
    );
  }
  
  const dateFormatted = formatDate(post.publishedAt);
  const htmlContent = markdownToHtml(post.content.body);
  const readTime = calculateReadTime(post.content.body);
  const gradient = CATEGORY_GRADIENT[post.category] || CATEGORY_GRADIENT.algorithm;
  const icon = CATEGORY_ICON[post.category] || '📄';
  
  return (
    <V18Shell>
      <style jsx global>{`
        .hh-detail-page {
          background: #fff;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #111827;
          min-height: 100vh;
        }
        .hh-detail-container {
          max-width: 880px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }
        @media (max-width: 640px) {
          .hh-detail-container { padding: 24px 16px 60px; }
        }
        .hh-back {
          display: inline-block;
          margin-bottom: 24px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: #f9fafb;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.18s;
        }
        .hh-back:hover { background: #eef2ff; color: #4f46e5; }
        .hh-cat-badge {
          display: inline-block;
          padding: 6px 14px;
          background: #4f46e5;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
          margin-bottom: 16px;
          letter-spacing: 0.01em;
        }
        .hh-detail-title {
          font-size: 38px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: #111827;
          margin: 0 0 16px;
          padding-left: 20px;
          border-left: 4px solid #4f46e5;
          word-break: keep-all;
        }
        @media (max-width: 640px) {
          .hh-detail-title { font-size: 26px; padding-left: 14px; }
        }
        .hh-detail-subtitle {
          font-size: 17px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 24px;
          padding-left: 20px;
          word-break: keep-all;
        }
        @media (max-width: 640px) {
          .hh-detail-subtitle { font-size: 15px; padding-left: 14px; }
        }
        .hh-detail-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 0;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 32px;
        }
        .hh-detail-avatar {
          width: 44px; height: 44px; border-radius: 999px;
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .hh-detail-author { font-weight: 700; color: #111827; font-size: 15px; margin: 0; }
        .hh-detail-date { font-size: 13px; color: #9ca3af; margin: 2px 0 0; }
        
        .hh-cover {
          aspect-ratio: 21/9;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .hh-cover-icon {
          font-size: 120px;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
        }
        @media (max-width: 640px) {
          .hh-cover { aspect-ratio: 16/9; border-radius: 16px; margin-bottom: 24px; }
          .hh-cover-icon { font-size: 72px; }
        }
        
        .hh-summary-box {
          background: #f8f7ff;
          border: 1.5px solid #c7d2fe;
          border-radius: 16px;
          padding: 24px 28px;
          margin: 0 0 36px;
        }
        .hh-summary-title {
          font-size: 15px;
          font-weight: 800;
          color: #4f46e5;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hh-summary-title::before {
          content: '📌';
          font-size: 16px;
        }
        .hh-summary-item {
          font-size: 14.5px;
          color: #374151;
          line-height: 1.7;
          padding: 6px 0;
          border-bottom: 1px solid #e0e7ff;
          display: flex;
          gap: 8px;
        }
        .hh-summary-item:last-child { border-bottom: none; }
        .hh-summary-item strong { color: #4f46e5; }
        .hh-hashtags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }
        .hh-hashtag {
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          background: #eef2ff;
          padding: 5px 12px;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .hh-hashtag:hover { background: #e0e7ff; color: #4338ca; }
        .hh-content {
          font-size: 17px; line-height: 1.85; color: #374151;
          word-break: keep-all;
        }
        .hh-content h2 {
          font-size: 26px; font-weight: 800; color: #111827;
          margin: 48px 0 16px; letter-spacing: -0.02em;
        }
        @media (max-width: 640px) {
          .hh-content h2 { font-size: 22px; margin: 36px 0 14px; }
        }
        .hh-content h3 {
          font-size: 19px; font-weight: 700; color: #111827;
          margin: 28px 0 12px;
        }
        .hh-content p {
          margin: 0 0 18px; line-height: 1.85; color: #374151;
        }
        @media (max-width: 640px) {
          .hh-content { font-size: 16px; }
          .hh-content p { line-height: 1.75; }
        }
        .hh-content strong { color: #4f46e5; font-weight: 700; }
        .hh-content ul, .hh-content ol { margin: 0 0 18px; padding-left: 24px; }
        .hh-content li { margin-bottom: 8px; line-height: 1.75; }
        
        .hh-cta {
          margin-top: 60px;
          padding: 36px;
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
          border-radius: 24px;
          text-align: center;
        }
        @media (max-width: 640px) {
          .hh-cta { padding: 24px; margin-top: 40px; }
        }
        .hh-cta-title {
          font-size: 22px; font-weight: 800; color: #111827;
          margin: 0 0 8px;
        }
        .hh-cta-desc {
          font-size: 15px; color: #6b7280;
          margin: 0 0 20px;
        }
        .hh-cta-btn {
          display: inline-block;
          padding: 12px 28px;
          background: #4f46e5;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.18s;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.25);
        }
        .hh-cta-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
        }
      `}</style>

      <div className="hh-detail-page">
        <div className="hh-detail-container">
          <Link href="/blog" className="hh-back">← 목록으로 돌아가기</Link>

          <span className="hh-cat-badge">{post.categoryLabel}</span>
          
          <h1 className="hh-detail-title">{post.title}</h1>
          {post.subtitle && <p className="hh-detail-subtitle">{post.subtitle}</p>}

          <div className="hh-detail-meta">
            <div className="hh-detail-avatar">N</div>
            <div>
              <p className="hh-detail-author">NuTube</p>
              <p className="hh-detail-date">{dateFormatted} 발행 · {readTime} 읽기</p>
            </div>
          </div>

          {/* 커버 이미지 */}
          <div className="hh-cover" style={{ background: gradient, position: 'relative' }}>
            <Image
              src={getPostImageUrl(post.slug, post.category, post.imageUrl)}
              alt={post.title}
              fill
              sizes="(max-width: 880px) 100vw, 880px"
              style={{ objectFit: 'cover' }}
              priority
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="hh-cover-icon" style={{ position: 'relative', zIndex: 1, opacity: 0 }}>{icon}</div>
          </div>

          {/* 본문 */}
          <div
            className="hh-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* 해시태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="hh-hashtags">
              {post.tags.slice(0, 10).map((tag: string) => (
                <span key={tag} className="hh-hashtag">#{tag}</span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="hh-cta">
            <h3 className="hh-cta-title">도움이 되셨나요?</h3>
            <p className="hh-cta-desc">다른 가이드도 확인해보세요.</p>
            <Link href="/blog" className="hh-cta-btn">가이드 더 보기 →</Link>
          </div>
        </div>
      </div>
    </V18Shell>
  );
}
