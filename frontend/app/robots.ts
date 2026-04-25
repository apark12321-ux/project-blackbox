import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nutube.kr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API 경로 차단
          '/_next/',         // Next.js 내부 차단
          '/private/',       // 비공개 영역
          '/admin/',         // 관리자 페이지
          '/processing',     // 처리 중 페이지 (인덱싱 불필요)
        ],
      },
      {
        // Google 검색 (광고 + AdSense 봇 명시)
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      {
        // AdSense 봇 (광고 콘텐츠 분석용)
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        // AdSense 광고 봇
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        // Naver 검색
        userAgent: 'Yeti',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      {
        // Bing 검색
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
