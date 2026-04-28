import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nutube.kr';

// 노하우 글 슬러그 (15개)
const KNOWHOW_SLUGS = [
  'youtube-algorithm',
  'ctr-title-secrets',
  'thumbnail-design',
  'viewer-retention',
  'first-30-seconds-hook',
  'seo-tags',
  'shorts-vs-longform',
  'middle-aged-channel-tips',
  'monetization-tips',
  'trending-keywords-research',
  'storytelling-structure',
  'bgm-copyright-free',
  'upload-time-optimization',
  'channel-branding',
  'community-engagement',
  'family-story-shorts',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 메인 페이지들 (최우선)
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/create`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/imagegen`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/workflow`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/analytics`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 서비스 페이지들
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/keyword`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/configure`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/publish`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/done`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/assets`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 정보 페이지 (필수 - AdSense 승인용)
  const infoPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/plan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 노하우 / 블로그 콘텐츠 15개 (SEO 핵심!)
  const knowhowPages: MetadataRoute.Sitemap = KNOWHOW_SLUGS.map((slug) => ({
    url: `${SITE_URL}/knowhow/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...mainPages, ...servicePages, ...infoPages, ...knowhowPages];
}
