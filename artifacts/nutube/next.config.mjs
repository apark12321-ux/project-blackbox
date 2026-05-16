/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 이미지 최적화 (Next.js 15: remotePatterns 방식)
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'nutube.kr' },
      { protocol: 'https', hostname: 'www.nutube.kr' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 압축
  compress: true,

  // 빌드 성능
  poweredByHeader: false,

  // 헤더 (보안 + SEO)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/rss.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/rss+xml; charset=utf-8',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
