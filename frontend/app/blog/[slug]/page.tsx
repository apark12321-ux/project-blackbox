// NuTube 가이드 동적 렌더링 (JSON 기반)
// 33개 가이드 → 1개 컴포넌트로 통합
// 박 대표님 v18 디자인 100% 유지

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

// ============================================
// 데이터 타입
// ============================================

interface Post {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  updatedAt?: string;
  kicker?: string;
  summary: string;
  content: {
    type: 'markdown' | 'structured';
    body: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  relatedPosts: string[];
  status: 'published' | 'draft' | 'archived';
}

interface RelatedPost {
  slug: string;
  title: string;
}

// ============================================
// 박 대표님 매뉴얼 보안 (자동 차단)
// ============================================

const FORBIDDEN_KEYWORDS = [
  '위영', 'Wiyoung', 'Starlight',
  '당근팀', 'Carrot Team',
  '마스터 매뉴얼', '배포용',
  'GEMS',
  '알뜰폰', '비행기 모드', '공기계', '중고폰',
  '길들이기',
];

// ============================================
// JSON 파일에서 글 가져오기
// ============================================

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');

function getPost(slug: string): Post | null {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const post: Post = JSON.parse(fileContent);
    
    // 보안: 박 대표님 매뉴얼 키워드 자동 차단
    const allText = JSON.stringify(post);
    for (const keyword of FORBIDDEN_KEYWORDS) {
      if (allText.includes(keyword)) {
        console.error(`보안 위반: ${keyword} in ${slug}`);
        return null;
      }
    }
    
    if (post.status !== 'published') return null;
    
    return post;
  } catch (e) {
    return null;
  }
}

function getRelatedPosts(slugs: string[]): RelatedPost[] {
  return slugs
    .map(slug => {
      const post = getPost(slug);
      return post ? { slug: post.slug, title: post.title } : null;
    })
    .filter((p): p is RelatedPost => p !== null);
}

// ============================================
// SEO 메타데이터
// ============================================

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) {
    return { title: '가이드 없음' };
  }
  
  return {
    title: post.seo?.metaTitle || `${post.title} | NuTube`,
    description: post.seo?.metaDescription || post.summary,
    keywords: post.seo?.keywords,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: `https://nutube.kr/blog/${post.slug}`,
      siteName: 'NuTube',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
    alternates: {
      canonical: `https://nutube.kr/blog/${post.slug}`,
    },
  };
}

// ============================================
// 정적 경로 자동 생성 (빌드 시 33개 페이지 자동 생성)
// ============================================

export async function generateStaticParams() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  
  const files = fs.readdirSync(POSTS_DIR);
  return files
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => ({ slug: f.replace('.json', '') }));
}

// ============================================
// 메인 컴포넌트
// ============================================

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const related = getRelatedPosts(post.relatedPosts || []);
  
  // 발행일 형식 (2026-05-04 → 2026.05.04)
  const dateFormatted = post.publishedAt.replace(/-/g, '.');
  
  return (
    <V18Shell>
      <style jsx>{`
        /* === 박 대표님 v18 디자인 100% 동일 === */
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
        
        /* Markdown 렌더링 - 기존 guide-section 스타일 적용 */
        .markdown-body :global(h2) {
          font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
          margin: 36px 0 16px; padding-top: 12px;
          color: #0a0a0a;
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
        
        .markdown-body :global(ul),
        .markdown-body :global(ol) {
          margin: 0 0 16px; padding-left: 24px;
        }
        
        .markdown-body :global(li) {
          font-size: 16px; margin-bottom: 8px; line-height: 1.7;
          word-break: keep-all; color: #0a0a0a;
        }
        @media (max-width: 600px) { .markdown-body :global(li) { font-size: 15px; } }
        
        .markdown-body :global(strong) {
          color: #c2410c; font-weight: 700;
        }
        
        .markdown-body :global(a) {
          color: #c2410c; text-decoration: underline;
        }
        
        .related-section {
          margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5;
        }
        .related-title {
          font-size: 17px; font-weight: 700; letter-spacing: -0.018em;
          margin: 0 0 12px;
        }
        .related-list {
          margin: 0; padding-left: 24px;
        }
        .related-list li {
          font-size: 16px; margin-bottom: 8px; line-height: 1.7;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .related-list li { font-size: 15px; } }
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

        {/* Markdown 본문 자동 렌더링 */}
        <div className="markdown-body">
          <ReactMarkdown>{post.content.body}</ReactMarkdown>
        </div>

        {/* 관련 글 자동 표시 */}
        {related.length > 0 && (
          <div className="related-section">
            <h3 className="related-title">✨ 함께 보면 좋은 가이드</h3>
            <ul className="related-list">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} style={{ color: '#c2410c' }}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </V18Shell>
  );
}
