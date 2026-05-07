'use client';

// NuTube 가이드 동적 렌더링 (JSON 기반)
// react-markdown X 사용 - 자체 markdown 파서

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

// 자체 Markdown → HTML 파서 (외부 패키지 X)
function markdownToHtml(md: string): string {
  let html = md;
  
  // 헤더
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  
  // 강조
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // 링크
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#c2410c;">$1</a>');
  
  // 리스트 처리 (라인별)
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
      
      // 빈 줄 X 무시, 일반 줄은 <p> 로
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

export default function BlogPostPage() {
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
      .then(data => {
        setPost(data);
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
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          가이드 불러오는 중...
        </div>
      </V18Shell>
    );
  }
  
  if (error || !post) {
    return (
      <V18Shell>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
          <h1>가이드를 찾을 수 없습니다</h1>
          <Link href="/blog" style={{ color: '#c2410c' }}>← 가이드 목록으로</Link>
        </div>
      </V18Shell>
    );
  }
  
  const dateFormatted = post.publishedAt.replace(/-/g, '.');
  const htmlContent = markdownToHtml(post.content.body);
  
  return (
    <V18Shell>
      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          color: #c2410c; margin-bottom: 8px; text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 32px; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.3; margin: 0 0 12px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle {
          font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex; gap: 12px; font-size: 14px; color: #737373;
          margin-bottom: 32px; padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }
        .markdown-body :global(h2) {
          font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
          margin: 36px 0 16px; padding-top: 12px; color: #0a0a0a;
        }
        @media (max-width: 600px) { .markdown-body :global(h2) { font-size: 19px; } }
        .markdown-body :global(h3) {
          font-size: 17px; font-weight: 700; letter-spacing: -0.018em;
          margin: 24px 0 10px; color: #0a0a0a;
        }
        .markdown-body :global(p) {
          font-size: 16px; margin: 0 0 14px; line-height: 1.75;
          word-break: keep-all; color: #0a0a0a;
        }
        @media (max-width: 600px) { .markdown-body :global(p) { font-size: 15px; } }
        .markdown-body :global(ul), .markdown-body :global(ol) {
          margin: 0 0 16px; padding-left: 24px;
        }
        .markdown-body :global(li) {
          font-size: 16px; margin-bottom: 8px; line-height: 1.7;
          word-break: keep-all; color: #0a0a0a;
        }
        @media (max-width: 600px) { .markdown-body :global(li) { font-size: 15px; } }
        .markdown-body :global(strong) { color: #c2410c; font-weight: 700; }
      `}</style>

      <article className="guide">
        <Link href="/blog" style={{ fontSize: 13, color: '#737373', marginBottom: 16, display: 'inline-block' }}>
          ← 가이드 목록으로
        </Link>

        {post.kicker && <div className="guide-kicker">{post.kicker}</div>}
        <h1 className="guide-h1">{post.title}</h1>
        <p className="guide-subtitle">{post.subtitle}</p>

        <div className="guide-meta">
          <span>📅 {dateFormatted} 발행</span>
          <span>·</span>
          <span>📂 {post.categoryLabel}</span>
        </div>

        <div 
          className="markdown-body" 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </article>
    </V18Shell>
  );
}
