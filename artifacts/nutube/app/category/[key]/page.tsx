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
              {post.thumbnail && (
                <div className="nt-blog-card-thumb">
                  <img src={post.thumbnail} alt={post.title} loading="lazy" />
                </div>
              )}
              <div className="nt-blog-card-body">
                <div className="nt-blog-card-cat" style={{ color: cat.color }}>{cat.label}</div>
                <h3 className="nt-blog-card-title">{post.title}</h3>
                {post.summary && <p className="nt-blog-card-summary">{post.summary}</p>}
                <div className="nt-blog-card-date">{formatDate(post.publishedAt)}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: 24, background: '#f9fafb', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 15, color: '#6b7280' }}>
            다른 카테고리도 확인해보세요:{' '}
            {CATEGORY_KEYS.filter((k) => k !== key).map((k, i) => {
              const c = (CATEGORIES as any)[k];
              return (
                <span key={k}>
                  <Link href={`/category/${k}`} style={{ color: c.color, fontWeight: 600 }}>{c.label}</Link>
                  {i < 2 ? ' · ' : ''}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </>
  );
}
