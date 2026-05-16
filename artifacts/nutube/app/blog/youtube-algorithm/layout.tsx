import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 알고리즘 작동 원리 완벽 분석',
  description: '추천 영상에 노출되는 진짜 기준 6가지 완전 정복',
  keywords: ['유튜브', '알고리즘', '유튜브 알고리즘 작동 원리 완벽 분석', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/youtube-algorithm',
  },
  openGraph: {
    title: '유튜브 알고리즘 작동 원리 완벽 분석 | NuTube',
    description: '추천 영상에 노출되는 진짜 기준 6가지 완전 정복',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/youtube-algorithm',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 알고리즘 작동 원리 완벽 분석 | NuTube',
    description: '추천 영상에 노출되는 진짜 기준 6가지 완전 정복',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
