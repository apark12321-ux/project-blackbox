import type { MetadataRoute } from 'next';

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';

// 블로그 노하우 슬러그 목록
const KNOWHOW_SLUGS = [
  'first-30-seconds-hook',
  'seo-title-formula',
  'ctr-thumbnail',
  'viral-topic-formula',
  'algorithm-script-structure',
  'first-page-tags',
  '8min-hook-points',
  'blue-ocean-keyword',
  'retention-editing-rhythm',
  '12-narrative-structures',
  'target-viewer-design',
  'narration-tone-match',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 메인 페이지들 (우선순위 높음)
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 플로우 페이지들
  const flowPages: MetadataRoute.Sitemap = [
    'keyword',
    'platform',
    'metadata',
    'done',
  ].map((path) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 노하우 블로그 글들
  const knowhowPages: MetadataRoute.Sitemap = KNOWHOW_SLUGS.map((slug) => ({
    url: `${SITE_URL}/knowhow/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 정책 페이지들 (낮은 우선순위)
  const policyPages: MetadataRoute.Sitemap = [
    'contact',
    'privacy',
    'terms',
  ].map((path) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...mainPages, ...flowPages, ...knowhowPages, ...policyPages];
}
