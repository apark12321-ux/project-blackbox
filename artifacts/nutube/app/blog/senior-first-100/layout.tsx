import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 채널 첫 100명 구독자 모으기 단계별 가이드',
  description: '50~70대 채널의 100명 도달 4단계 전략 - 검증된 실전 방법',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 채널 첫 100명 구독자 모으기 단계별 가이드', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-first-100',
  },
  openGraph: {
    title: '시니어 채널 첫 100명 구독자 모으기 단계별 가이드 | NuTube',
    description: '50~70대 채널의 100명 도달 4단계 전략 - 검증된 실전 방법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-first-100',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 채널 첫 100명 구독자 모으기 단계별 가이드 | NuTube',
    description: '50~70대 채널의 100명 도달 4단계 전략 - 검증된 실전 방법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
