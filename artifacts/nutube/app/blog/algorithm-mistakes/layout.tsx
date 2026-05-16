import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '치명적 실수 7가지 - 알고 피하면 떡상',
  description: '99% 채널이 모르는 유튜브 알고리즘 위반 행동 7가지 완전 정리',
  keywords: ['유튜브', '알고리즘', '치명적 실수 7가지 - 알고 피하면 떡상', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/algorithm-mistakes',
  },
  openGraph: {
    title: '치명적 실수 7가지 - 알고 피하면 떡상 | NuTube',
    description: '99% 채널이 모르는 유튜브 알고리즘 위반 행동 7가지 완전 정리',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/algorithm-mistakes',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '치명적 실수 7가지 - 알고 피하면 떡상 | NuTube',
    description: '99% 채널이 모르는 유튜브 알고리즘 위반 행동 7가지 완전 정리',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
