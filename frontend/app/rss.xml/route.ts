import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1시간 캐시

interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  category: string;
  categoryLabel?: string;
  publishedAt: string;
  status: string;
  content?: { body: string };
  seo?: { metaDescription?: string };
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getAllPosts(): Post[] {
  const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
  if (!fs.existsSync(POSTS_DIR)) return [];
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  return files.map(f => {
    try {
      return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));
    } catch {
      return null;
    }
  })
    .filter((p): p is Post => p !== null && p.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function GET() {
  const SITE_URL = 'https://nutube.kr';
  const SITE_TITLE = 'NuTube - 유튜브 채널 운영 노하우';
  const SITE_DESC = '유튜브 알고리즘, 시니어 사연 쇼츠, AI 도구 활용, 채널 수익화까지. 영상 채널 운영의 모든 노하우.';
  
  const posts = getAllPosts().slice(0, 50); // 최신 50편
  const buildDate = new Date().toUTCString();
  
  const itemsXml = posts.map(p => {
    const pubDate = new Date(p.publishedAt).toUTCString();
    const description = p.seo?.metaDescription || p.summary || p.subtitle || '';
    const link = `${SITE_URL}/blog/${p.slug}`;
    
    return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      <category>${escapeXml(p.categoryLabel || p.category)}</category>
    </item>`;
  }).join('');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>ko-KR</language>
    <copyright>© 2026 알고파트너스</copyright>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;
  
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
