'use client';

// NuTube 가이드 동적 페이지 - Upstash Redis 에서 읽음
// Blog Studio 등 외부에서 발행한 새 가이드 표시
// 하우징허브 스타일 디자인 적용

import Link from 'next/link';
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

// 자체 Markdown 파서 (외부 패키지 X)
function markdownToHtml(md: string): string {
  let html = md;
  
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#4f46e5;">$1</a>');
  
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
      if (inList) { result.push('</ul>'); inList = false; }
      if (inOrdered) { result.push('</ol>'); inOrdered = false; }
      
      if (line.trim() && !line.match(/^<(h2|h3|ul|ol|li|p)/)) {
        result.push(`<p>${line}</p>`);
      } else if (line.trim()) {
        result.push(line);
      }
    }
  }
  if (inList) result.push('</ul>');
  if (inOrdered) result.push('</ol>');
  
  return result.join('\n');
}

function formatDate(iso: string): string {
  if (!iso) return '';
  if (iso.length <= 10) return iso.replace(/-/g, '.');
  // ISO with time
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
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
              <p className="hh-detail-date">{dateFormatted} 발행</p>
            </div>
          </div>

          {/* 그라데이션 커버 */}
          <div className="hh-cover" style={{ background: gradient }}>
            <div className="hh-cover-icon">{icon}</div>
          </div>

          {/* 본문 */}
          <div
            className="hh-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

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
