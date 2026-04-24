import type { MetadataRoute } from 'next';

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';

/**
 * 강력한 robots.txt 설정
 *
 * 박예준 요청사항:
 * ✅ 정상 검색엔진 허용 (Google, 네이버, Bing)
 * ❌ AI 크롤러 전체 차단 (ChatGPT, Claude, Perplexity 등)
 * ❌ 웹 스크래퍼 차단
 * ❌ 경쟁사 학습 방지
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ============================================================
      // 1. 기본 규칙 (모든 봇)
      // ============================================================
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },

      // ============================================================
      // 2. 허용되는 검색엔진 (정상 봇)
      // ============================================================
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Yeti',  // 네이버
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Yeti-Mobile',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Daumoa',  // 다음
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },

      // ============================================================
      // 3. AI 크롤러 전체 차단 ⭐ 핵심!
      // ============================================================
      
      // OpenAI (ChatGPT)
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'OAI-SearchBot', disallow: '/' },
      
      // Anthropic (Claude)
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Claude-Web', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      
      // Google Gemini/Bard
      { userAgent: 'Google-Extended', disallow: '/' },
      
      // Common Crawl (AI 학습 데이터로 많이 사용)
      { userAgent: 'CCBot', disallow: '/' },
      
      // Perplexity
      { userAgent: 'PerplexityBot', disallow: '/' },
      
      // Meta (Llama)
      { userAgent: 'FacebookBot', disallow: '/' },
      { userAgent: 'Meta-ExternalAgent', disallow: '/' },
      
      // Amazon
      { userAgent: 'Amazonbot', disallow: '/' },
      
      // Apple
      { userAgent: 'Applebot-Extended', disallow: '/' },
      
      // ByteDance (TikTok / Doubao)
      { userAgent: 'Bytespider', disallow: '/' },
      
      // Cohere
      { userAgent: 'cohere-ai', disallow: '/' },
      
      // Diffbot (크롤링 서비스)
      { userAgent: 'Diffbot', disallow: '/' },
      
      // Omgili
      { userAgent: 'omgili', disallow: '/' },
      { userAgent: 'omgilibot', disallow: '/' },
      
      // 기타 AI 크롤러
      { userAgent: 'AI2Bot', disallow: '/' },
      { userAgent: 'Timpibot', disallow: '/' },
      { userAgent: 'PanguBot', disallow: '/' },
      { userAgent: 'YouBot', disallow: '/' },
      { userAgent: 'ImagesiftBot', disallow: '/' },
      
      // ============================================================
      // 4. 웹 스크래퍼 차단
      // ============================================================
      { userAgent: 'Scrapy', disallow: '/' },
      { userAgent: 'scrapy', disallow: '/' },
      { userAgent: 'Python-urllib', disallow: '/' },
      { userAgent: 'python-requests', disallow: '/' },
      { userAgent: 'Go-http-client', disallow: '/' },
      { userAgent: 'curl', disallow: '/' },
      { userAgent: 'wget', disallow: '/' },
      { userAgent: 'Java', disallow: '/' },
      { userAgent: 'Nutch', disallow: '/' },
      { userAgent: 'HTTrack', disallow: '/' },
      { userAgent: 'httrack', disallow: '/' },
      
      // ============================================================
      // 5. SEO 분석 도구 차단 (경쟁사 접근 방지)
      // ============================================================
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
