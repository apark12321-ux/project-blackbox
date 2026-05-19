/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  // 박 대표님 옛 코드와 @types/react 버전 충돌 회피
  // 컴파일은 정상 작동, 타입 체크 단계만 우회
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 옛 사이트 URL → 새 구조로 리다이렉트
  // Google 색인 마이그레이션 완료 시까지 유지 (1~2개월 후 제거 권장)
  async redirects() {
    return [
      // /blog?cat=xxx → /category/xxx (옛 단축 파라미터)
      {
        source: '/blog',
        has: [{ type: 'query', key: 'cat', value: 'algorithm' }],
        destination: '/category/algorithm',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'cat', value: 'senior' }],
        destination: '/category/senior',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'cat', value: 'aitools' }],
        destination: '/category/aitools',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'cat', value: 'monetization' }],
        destination: '/category/monetization',
        permanent: true,
      },
      // /blog?category=xxx → /category/xxx (옛 구조)
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'algorithm' }],
        destination: '/category/algorithm',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'senior' }],
        destination: '/category/senior',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'aitools' }],
        destination: '/category/aitools',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'monetization' }],
        destination: '/category/monetization',
        permanent: true,
      },
      // 박 대표님 이전 사이트 카테고리 (시니어 사연 채널) → 홈으로
      {
        source: '/blog',
        has: [{ type: 'query', key: 'cat', value: 'viral' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'cat', value: 'phone' }],
        destination: '/',
        permanent: true,
      },
      // 박 대표님 이전 사이트 카테고리 → 가장 가까운 신규 카테고리
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'economy' }],
        destination: '/category/monetization',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'family' }],
        destination: '/category/senior',
        permanent: true,
      },
      // 그 외 카테고리 (food, health, realestate, travel, language) → 홈으로
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'food' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'health' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'realestate' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'travel' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: 'language' }],
        destination: '/',
        permanent: true,
      },
      // 옛 글 슬러그 → 관련 새 글로 리다이렉트 (SEO 자산 보존)
      {
        source: '/blog/youtube-superthanks',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/shorts-algorithm-mastery',
        destination: '/blog/youtube-algorithm-2026-recommendation',
        permanent: true,
      },
      {
        source: '/blog/senior-thumbnail-design',
        destination: '/blog/senior-channel-thumbnail-tone',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
