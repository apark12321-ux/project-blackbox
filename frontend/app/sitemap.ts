import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nutube.kr';

const GUIDE_SLUGS = [
  // 알고리즘 (10편)
  'algorithm-seo', 'algorithm-retention', 'algorithm-branding',
  'algorithm-mistakes', 'youtube-algorithm', 'viral-patterns',
  'channel-concept', 'youtube-start', 'human-warmth', 'youtube-monetization',
  // 시니어 (5편)
  'senior-channel-start', 'senior-content-ideas', 'senior-hook-patterns',
  'senior-engagement', 'senior-policy-safe',
  // AI 도구 (9편)
  'claude-youtube-workflow', 'chatgpt-script', 'ai-thumbnail',
  'ai-tools', 'phone-shooting', 'free-editing-apps',
  'camera-anxiety', 'thumbnail-tips', 'voice-seo',
  // 수익화 (3편)
  'algorithm-mindset', 'first-100-subs', 'side-job-50', 'revenue-calc',
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

  const guidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}
