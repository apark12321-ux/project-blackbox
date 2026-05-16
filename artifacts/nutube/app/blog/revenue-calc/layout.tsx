import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 광고 수익 계산법',
  description: '조회수당 수익과 RPM 이해하기 - 유튜브 광고 수익 완전 정복',
  keywords: ['유튜브', '수익화', '유튜브 광고 수익 계산법', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/revenue-calc',
  },
  openGraph: {
    title: '유튜브 광고 수익 계산법 | NuTube',
    description: '조회수당 수익과 RPM 이해하기 - 유튜브 광고 수익 완전 정복',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/revenue-calc',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 광고 수익 계산법 | NuTube',
    description: '조회수당 수익과 RPM 이해하기 - 유튜브 광고 수익 완전 정복',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
