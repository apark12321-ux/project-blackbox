import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '채널 컨셉 5가지 카테고리 정리',
  description: '나에게 맞는 유튜브 채널 방향 찾기 - 5가지 카테고리 완전 분석',
  keywords: ['유튜브', '알고리즘', '채널 컨셉 5가지 카테고리 정리', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/channel-concept',
  },
  openGraph: {
    title: '채널 컨셉 5가지 카테고리 정리 | NuTube',
    description: '나에게 맞는 유튜브 채널 방향 찾기 - 5가지 카테고리 완전 분석',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/channel-concept',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '채널 컨셉 5가지 카테고리 정리 | NuTube',
    description: '나에게 맞는 유튜브 채널 방향 찾기 - 5가지 카테고리 완전 분석',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
