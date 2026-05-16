import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '떡상 채널 패턴 분석',
  description: '조회수 100만+ 채널들의 공통점 7가지 데이터 분석',
  keywords: ['유튜브', '알고리즘', '떡상 채널 패턴 분석', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/viral-patterns',
  },
  openGraph: {
    title: '떡상 채널 패턴 분석 | NuTube',
    description: '조회수 100만+ 채널들의 공통점 7가지 데이터 분석',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/viral-patterns',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '떡상 채널 패턴 분석 | NuTube',
    description: '조회수 100만+ 채널들의 공통점 7가지 데이터 분석',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
