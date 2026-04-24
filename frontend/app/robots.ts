import type { MetadataRoute } from 'next';

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // API 경로 차단
          '/admin/',        // 관리자 경로 차단 (있다면)
          '/_next/',        // Next.js 내부 경로
          '/private/',      // 비공개 경로
        ],
      },
      // 구글봇 세부 설정
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // 네이버봇 (한국 서비스라 중요!)
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Yeti-Mobile',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // 빙봇
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // AI 크롤러 (GPT-Bot 등) 학습 데이터 수집 차단
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
