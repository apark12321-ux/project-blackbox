import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://nutube.kr';

function loadPosts(): any[] {
  try {
    const indexPath = path.join(process.cwd(), 'data', 'posts', '_index.json');
    if (!fs.existsSync(indexPath)) return [];
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    return index.posts || [];
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = loadPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/publish`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const guidePages: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: p.category === 'senior' ? 0.8 : 0.7,
  }));

  return [...staticPages, ...guidePages];
}
