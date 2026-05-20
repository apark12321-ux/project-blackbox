import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, CATEGORY_KEYS, SITE, type CategoryKey } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';

export function generateStaticParams() {
  return CATEGORY_KEYS.map((key) => ({ key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const cat = (CATEGORIES as any)[key];
  if (!cat) return { title: '카테고리를 찾을 수 없습니다' };
  return {
    title: cat.label,
    description: cat.description,
    alternates: { canonical: `${SITE.url}/category/${key}` },
    openGraph: {
      title: `${cat.label} | ${SITE.name}`,
      description: cat.description,
      url: `${SITE.url}/category/${key}`,
    },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default async function CategoryPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const cat = (CATEGORIES as any)[key as CategoryKey];
  if (!cat) notFound();

  const allPosts = await getAllPosts();
  const posts = allPosts.filter((p) => p.category === key);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: '블로그', item: `${SITE.url}/blog` },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `${SITE.url}/category/${key}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="nt-page">
        <nav className="nt-breadcrumb" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span>›</span>
          <Link href="/blog">블로그</Link>
          <span>›</span>
          <span className="current">{cat.label}</span>
        </nav>

        <div className="nt-cat-hero" style={{ background: cat.bgLight }}>
          <div className="nt-cat-hero-icon">{cat.icon}</div>
          <h1>{cat.label}</h1>
          <p>{cat.description}</p>
          <div className="nt-cat-hero-meta">{posts.length}편의 가이드</div>
        </div>

        <div className="nt-blog-grid" style={{ marginTop: 32 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="nt-blog-card">
              <div className="nt-post-thumb" style={{ background: cat.gradient, position: 'relative' }}>
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title} loading="lazy" />
                ) : (
                  <span style={{ fontSize: 56 }}>{cat.icon}</span>
                )}
              </div>
              <div className="nt-post-body">
                <span className="nt-post-cat" style={{ background: cat.bgLight, color: cat.color }}>{cat.label}</span>
                <h3 className="nt-post-title">{post.title}</h3>
                {post.summary && <p className="nt-post-summary">{post.summary}</p>}
                <div className="nt-post-meta">{formatDate(post.publishedAt)} · NuTube 편집팀</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 15, color: 'rgba(230,237,243,0.6)' }}>
            다른 카테고리도 확인해보세요:{' '}
            {CATEGORY_KEYS.filter((k) => k !== key).map((k, i, arr) => {
              const c = (CATEGORIES as any)[k];
              return (
                <span key={k}>
                  <Link href={`/category/${k}`} style={{ color: c.color, fontWeight: 600 }}>{c.label}</Link>
                  {i < arr.length - 1 ? ' · ' : ''}
                </span>
              );
            })}
          </p>
        </div>
      </div>

      <style>{`
        .nt-blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .nt-blog-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 640px) {
          .nt-blog-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        .nt-blog-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;
          overflow: hidden; transition: all 0.25s; text-decoration: none; color: inherit;
          display: block;
        }
        .nt-blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,.4);
          border-color: rgba(132,204,22,0.3);
        }
        .nt-post-thumb {
          aspect-ratio: 16/9;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 56px;
        }
        .nt-post-thumb img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .nt-post-body { padding: 20px; }
        .nt-post-cat {
          display: inline-block; padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 700; margin-bottom: 10px;
        }
        .nt-post-title {
          font-size: 16px; font-weight: 800; color: #fff;
          margin: 0 0 8px; line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nt-post-summary {
          font-size: 13px; color: rgba(230,237,243,0.55); line-height: 1.5;
          margin: 0 0 10px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nt-post-meta {
          font-size: 12px; color: rgba(230,237,243,0.4); font-weight: 500;
        }
      `}</style>
    </>
  );
}
