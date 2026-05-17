'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

function getPostImageUrl(slug: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  return `/api/og/${slug}`;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  if (iso.length <= 10) return iso.replace(/-/g, '.');
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function calculateReadTime(text: string | undefined | null, wpm = 500): string {
  if (!text) return '1분';
  const plain = String(text).replace(/[#>*_\[\]`]/g, '').replace(/\s+/g, ' ').trim();
  return `${Math.max(1, Math.ceil(plain.length / wpm))}분`;
}

function preprocessMarkdown(body: string): string {
  if (!body) return '';
  return body
    .split('\n')
    .map(line => line.trimStart())
    .join('\n');
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
      .then(res => { if (!res.ok) throw new Error('Not found'); return res.json(); })
      .then(json => {
        if (json.success && json.data) setPost(json.data);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
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

  const gradient = CATEGORY_GRADIENT[post.category] || CATEGORY_GRADIENT.algorithm;
  const icon = CATEGORY_ICON[post.category] || '📄';

  return (
    <V18Shell>
      <style jsx global>{`
        .hh-detail-page { background:#fff; font-family:'Pretendard',-apple-system,system-ui,sans-serif; color:#111827; min-height:100vh; }
        .hh-detail-container { max-width:880px; margin:0 auto; padding:40px 24px 80px; }
        @media(max-width:640px){ .hh-detail-container{ padding:24px 16px 60px; } }

        .hh-back { display:inline-block; margin-bottom:24px; padding:8px 14px; font-size:14px; font-weight:600; color:#6b7280; background:#f9fafb; border-radius:8px; text-decoration:none; transition:all .18s; }
        .hh-back:hover { background:#eef2ff; color:#4f46e5; }

        .hh-cat-badge { display:inline-block; padding:6px 14px; background:#4f46e5; color:#fff; font-size:12px; font-weight:700; border-radius:999px; margin-bottom:16px; }

        .hh-detail-title { font-size:38px; font-weight:800; line-height:1.25; letter-spacing:-.025em; color:#111827; margin:0 0 16px; padding-left:20px; border-left:4px solid #4f46e5; word-break:keep-all; }
        @media(max-width:640px){ .hh-detail-title{ font-size:26px; padding-left:14px; } }

        .hh-detail-subtitle { font-size:17px; color:#6b7280; line-height:1.6; margin:0 0 24px; padding-left:20px; word-break:keep-all; }
        @media(max-width:640px){ .hh-detail-subtitle{ font-size:15px; padding-left:14px; } }

        .hh-detail-meta { display:flex; align-items:center; gap:12px; padding:20px 0; border-top:1px solid #f3f4f6; border-bottom:1px solid #f3f4f6; margin-bottom:32px; }
        .hh-detail-avatar { width:44px; height:44px; border-radius:999px; background:#eef2ff; color:#4f46e5; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .hh-detail-author { font-weight:700; color:#111827; font-size:15px; margin:0; }
        .hh-detail-date { font-size:13px; color:#9ca3af; margin:2px 0 0; }

        .hh-cover { aspect-ratio:21/9; border-radius:24px; overflow:hidden; margin-bottom:40px; display:flex; align-items:center; justify-content:center; position:relative; }
        @media(max-width:640px){ .hh-cover{ aspect-ratio:16/9; border-radius:16px; margin-bottom:24px; } }

        /* ── 본문 마크다운 스타일 ── */
        .hh-content { font-size:17px; line-height:1.85; color:#374151; word-break:keep-all; }
        .hh-content h2 { font-size:26px; font-weight:800; color:#111827; margin:48px 0 16px; letter-spacing:-.02em; }
        .hh-content h3 { font-size:19px; font-weight:700; color:#111827; margin:28px 0 12px; }
        .hh-content p { margin:0 0 18px; line-height:1.85; color:#374151; }
        .hh-content strong { color:#4f46e5; font-weight:700; }
        .hh-content em { font-style:italic; }
        .hh-content ul { margin:0 0 18px; padding-left:24px; list-style:disc; }
        .hh-content ol { margin:0 0 18px; padding-left:24px; list-style:decimal; }
        .hh-content li { margin-bottom:8px; line-height:1.75; }
        .hh-content a { color:#4f46e5; text-decoration:underline; }
        .hh-content a:hover { color:#4338ca; }
        .hh-content hr { border:none; border-top:1px solid #e5e7eb; margin:32px 0; }
        .hh-content code { background:#f3f4f6; border-radius:4px; padding:2px 6px; font-size:14px; font-family:monospace; }
        .hh-content pre { background:#1f2937; color:#f9fafb; border-radius:12px; padding:20px; overflow-x:auto; margin:0 0 24px; }
        .hh-content pre code { background:none; padding:0; color:inherit; }
        @media(max-width:640px){ .hh-content{ font-size:16px; } .hh-content h2{ font-size:22px; margin:36px 0 14px; } .hh-content p{ line-height:1.75; } }

        /* ── 메타박스 (blockquote) ── */
        .hh-content blockquote {
          background:#f8f7ff;
          border:1.5px solid #c7d2fe;
          border-radius:16px;
          padding:24px 28px;
          margin:0 0 36px;
          border-left:none;
        }
        .hh-content blockquote p { margin:0 0 8px; color:#374151; font-size:14.5px; line-height:1.7; }
        .hh-content blockquote p:last-child { margin:0; }
        .hh-content blockquote strong { color:#4f46e5; }

        /* ── CTA ── */
        .hh-cta { margin-top:60px; padding:36px; background:linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%); border-radius:24px; text-align:center; }
        @media(max-width:640px){ .hh-cta{ padding:24px; margin-top:40px; } }
        .hh-cta-title { font-size:22px; font-weight:800; color:#111827; margin:0 0 8px; }
        .hh-cta-desc { font-size:15px; color:#6b7280; margin:0 0 20px; }
        .hh-cta-btn { display:inline-block; padding:12px 28px; background:#4f46e5; color:#fff; font-size:15px; font-weight:700; border-radius:999px; text-decoration:none; transition:all .18s; box-shadow:0 4px 16px rgba(79,70,229,.25); }
        .hh-cta-btn:hover { background:#4338ca; transform:translateY(-2px); }

        .hh-hashtags { display:flex; flex-wrap:wrap; gap:8px; margin-top:48px; padding-top:24px; border-top:1px solid #f3f4f6; }
        .hh-hashtag { font-size:13px; font-weight:600; color:#6366f1; background:#eef2ff; padding:5px 12px; border-radius:999px; }
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
              <p className="hh-detail-date">{formatDate(post.publishedAt)} 발행 · {calculateReadTime(post.content?.body)} 읽기</p>
            </div>
          </div>

          <div className="hh-cover" style={{ background: gradient }}>
            <Image
              src={getPostImageUrl(post.slug, post.imageUrl)}
              alt={post.title}
              fill
              sizes="(max-width:880px) 100vw, 880px"
              style={{ objectFit: 'cover' }}
              priority
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span style={{ position: 'relative', zIndex: 1, fontSize: 80, opacity: 0 }}>{icon}</span>
          </div>

          <div className="hh-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote({ children }) {
                  return (
                    <blockquote>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 800, color: '#4f46e5', marginBottom: 14 }}>
                        📌 이 글의 핵심 요약
                      </span>
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {preprocessMarkdown(post.content?.body || '')}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="hh-hashtags">
              {post.tags.slice(0, 10).map((tag: string) => (
                <span key={tag} className="hh-hashtag">#{tag}</span>
              ))}
            </div>
          )}

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
