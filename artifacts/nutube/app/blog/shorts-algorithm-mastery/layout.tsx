import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀',
  description: '긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙 완전 분석',
  keywords: ['유튜브', '알고리즘', '유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/shorts-algorithm-mastery',
  },
  openGraph: {
    title: '유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀 | NuTube',
    description: '긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙 완전 분석',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/shorts-algorithm-mastery',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀 | NuTube',
    description: '긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙 완전 분석',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
