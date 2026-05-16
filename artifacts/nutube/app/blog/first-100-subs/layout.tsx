import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '첫 100명 구독자 모으는 방법',
  description: '0명에서 100명까지 4단계 전략 - 검증된 구독자 성장 로드맵',
  keywords: ['유튜브', '수익화', '첫 100명 구독자 모으는 방법', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/first-100-subs',
  },
  openGraph: {
    title: '첫 100명 구독자 모으는 방법 | NuTube',
    description: '0명에서 100명까지 4단계 전략 - 검증된 구독자 성장 로드맵',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/first-100-subs',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '첫 100명 구독자 모으는 방법 | NuTube',
    description: '0명에서 100명까지 4단계 전략 - 검증된 구독자 성장 로드맵',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
