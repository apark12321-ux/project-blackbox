import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nutube.kr';

// 가이드 메타데이터 (publishedAt + 카테고리)
// /blog 페이지 GUIDES 배열과 동기화 필요
type GuideMeta = {
  slug: string;
  publishedAt: string; // YYYY-MM-DD
  category: 'algorithm' | 'senior' | 'aitools' | 'monetization';
};

const GUIDES: GuideMeta[] = [
  // 알고리즘 (10편)
  { slug: 'algorithm-seo', publishedAt: '2026-05-02', category: 'algorithm' },
  { slug: 'algorithm-retention', publishedAt: '2026-05-02', category: 'algorithm' },
  { slug: 'algorithm-branding', publishedAt: '2026-05-02', category: 'algorithm' },
  { slug: 'algorithm-mistakes', publishedAt: '2026-05-02', category: 'algorithm' },
  { slug: 'youtube-algorithm', publishedAt: '2026-05-01', category: 'algorithm' },
  { slug: 'viral-patterns', publishedAt: '2026-05-02', category: 'algorithm' },
  { slug: 'channel-concept', publishedAt: '2026-05-01', category: 'algorithm' },
  { slug: 'youtube-start', publishedAt: '2026-05-01', category: 'algorithm' },
  { slug: 'human-warmth', publishedAt: '2026-05-04', category: 'algorithm' },
  { slug: 'youtube-monetization', publishedAt: '2026-04-28', category: 'algorithm' },
  // 시니어 (5편) - 박 대표님 핵심 카테고리, 우선순위 ↑
  { slug: 'senior-channel-start', publishedAt: '2026-05-04', category: 'senior' },
  { slug: 'senior-content-ideas', publishedAt: '2026-05-04', category: 'senior' },
  { slug: 'senior-hook-patterns', publishedAt: '2026-05-04', category: 'senior' },
  { slug: 'senior-engagement', publishedAt: '2026-05-04', category: 'senior' },
  { slug: 'senior-policy-safe', publishedAt: '2026-05-04', category: 'senior' },
  // 시니어 추가 5편 (v18.7)
  { slug: 'senior-shooting-mistakes', publishedAt: '2026-05-06', category: 'senior' },
  { slug: 'senior-first-100', publishedAt: '2026-05-06', category: 'senior' },
  { slug: 'senior-capcut-basic', publishedAt: '2026-05-06', category: 'senior' },
  { slug: 'senior-family-channel', publishedAt: '2026-05-06', category: 'senior' },
  { slug: 'senior-thumbnail-design', publishedAt: '2026-05-06', category: 'senior' },
  // AI 도구 (9편)
  { slug: 'claude-youtube-workflow', publishedAt: '2026-05-04', category: 'aitools' },
  { slug: 'chatgpt-script', publishedAt: '2026-04-30', category: 'aitools' },
  { slug: 'ai-thumbnail', publishedAt: '2026-04-29', category: 'aitools' },
  { slug: 'ai-tools', publishedAt: '2026-04-28', category: 'aitools' },
  { slug: 'phone-shooting', publishedAt: '2026-05-01', category: 'aitools' },
  { slug: 'free-editing-apps', publishedAt: '2026-05-01', category: 'aitools' },
  { slug: 'camera-anxiety', publishedAt: '2026-05-01', category: 'aitools' },
  { slug: 'thumbnail-tips', publishedAt: '2026-05-01', category: 'aitools' },
  { slug: 'voice-seo', publishedAt: '2026-05-01', category: 'aitools' },
  // 수익화 (4편)
  { slug: 'algorithm-mindset', publishedAt: '2026-05-02', category: 'monetization' },
  { slug: 'first-100-subs', publishedAt: '2026-05-02', category: 'monetization' },
  { slug: 'side-job-50', publishedAt: '2026-05-02', category: 'monetization' },
  { slug: 'revenue-calc', publishedAt: '2026-04-30', category: 'monetization' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/publish`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // 가이드별 차별화된 lastmod + priority
  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${BASE_URL}/blog/${g.slug}`,
    lastModified: new Date(g.publishedAt),
    changeFrequency: 'weekly' as const,
    // 시니어 카테고리 = 박 대표님 핵심 = 0.8
    // 그 외 = 0.7
    priority: g.category === 'senior' ? 0.8 : 0.7,
  }));

  return [...staticPages, ...guidePages];
}
