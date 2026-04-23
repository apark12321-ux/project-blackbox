/**
 * /sitemap.xml - Google Search Console용 sitemap
 * v2: blog/page.tsx import 제거, 블로그 슬러그 직접 정의
 */

import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://algomaker.kr';

// 블로그 글 목록 (app/blog/page.tsx의 blogPosts와 동일해야 함)
const BLOG_SLUGS = [
  { slug: 'youtube-algorithm-2026', publishedAt: '2026-04-22' },
  { slug: 'retention-rate-editing-tips', publishedAt: '2026-04-21' },
  { slug: 'thumbnail-ctr-guide', publishedAt: '2026-04-20' },
  { slug: 'first-month-creator-checklist', publishedAt: '2026-04-19' },
  { slug: 'ai-video-automation-trends', publishedAt: '2026-04-18' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/assets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
