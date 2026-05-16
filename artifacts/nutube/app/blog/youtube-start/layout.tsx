import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 시작 가이드 - 첫 한 달 핵심',
  description: '0명에서 100명 구독자까지 단계별 안내 - 첫 달 필수 체크리스트',
  keywords: ['유튜브', '알고리즘', '유튜브 시작 가이드 - 첫 한 달 핵심', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/youtube-start',
  },
  openGraph: {
    title: '유튜브 시작 가이드 - 첫 한 달 핵심 | NuTube',
    description: '0명에서 100명 구독자까지 단계별 안내 - 첫 달 필수 체크리스트',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/youtube-start',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 시작 가이드 - 첫 한 달 핵심 | NuTube',
    description: '0명에서 100명 구독자까지 단계별 안내 - 첫 달 필수 체크리스트',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
