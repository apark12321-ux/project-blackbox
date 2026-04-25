import type { MetadataRoute } from 'next';

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';

/**
 * Sitemap.xml 자동 생성
 * 
 * 검색엔진 크롤러가 사이트 구조를 빠르게 파악할 수 있도록
 * 모든 페이지의 URL과 우선순위를 명시
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  return [
    // 메인 페이지 (최고 우선순위)
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // 핵심 플로우 페이지
    {
      url: `${SITE_URL}/keyword`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/platform`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/metadata`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/done`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // 마케팅 페이지
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // 블로그 글
    {
      url: `${SITE_URL}/knowhow/first-30-seconds-hook`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    
    // 법적 페이지
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
