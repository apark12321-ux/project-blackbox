/**
 * /robots.txt - 검색 엔진 크롤링 지시
 *
 * Next.js App Router 규칙:
 * frontend/app/robots.ts 파일로 생성하면 자동으로 /robots.txt 라우트 활성화
 */

import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://algomaker.kr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 내부 라우트 중 크롤링 차단할 것들
        disallow: [
          '/api/',           // API 엔드포인트
          '/configure',      // 영상 생성 과정 중간 단계
          '/keyword',
          '/processing',
          '/done',
          '/login',          // 로그인 페이지 (있다면)
        ],
      },
      {
        // Googlebot은 더 관대하게
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/processing',
          '/done',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
