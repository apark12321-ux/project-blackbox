import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 채널 수익화 완전 정복',
  description: '광고 수익부터 협찬·멤버십까지 다양한 수익 모델 한번에 정리',
  keywords: ['유튜브', '알고리즘', '유튜브 채널 수익화 완전 정복', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/youtube-monetization',
  },
  openGraph: {
    title: '유튜브 채널 수익화 완전 정복 | NuTube',
    description: '광고 수익부터 협찬·멤버십까지 다양한 수익 모델 한번에 정리',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/youtube-monetization',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 채널 수익화 완전 정복 | NuTube',
    description: '광고 수익부터 협찬·멤버십까지 다양한 수익 모델 한번에 정리',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
