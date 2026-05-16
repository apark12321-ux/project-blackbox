import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 스폰서십 받는 채널 만드는 5단계 전략',
  description: '구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결 5단계 완전판',
  keywords: ['유튜브', '수익화', '유튜브 스폰서십 받는 채널 만드는 5단계 전략', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/sponsorship-strategy',
  },
  openGraph: {
    title: '유튜브 스폰서십 받는 채널 만드는 5단계 전략 | NuTube',
    description: '구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결 5단계 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/sponsorship-strategy',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 스폰서십 받는 채널 만드는 5단계 전략 | NuTube',
    description: '구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결 5단계 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
