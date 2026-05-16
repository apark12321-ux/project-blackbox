import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '50대부터 시작하는 시니어 사연 쇼츠 채널',
  description: '처음 시작하시는 분들을 위한 단계별 안내 - 50·60·70대 완전 초보 가이드',
  keywords: ['유튜브', '시니어 사연 쇼츠', '50대부터 시작하는 시니어 사연 쇼츠 채널', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-channel-start',
  },
  openGraph: {
    title: '50대부터 시작하는 시니어 사연 쇼츠 채널 | NuTube',
    description: '처음 시작하시는 분들을 위한 단계별 안내 - 50·60·70대 완전 초보 가이드',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-channel-start',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '50대부터 시작하는 시니어 사연 쇼츠 채널 | NuTube',
    description: '처음 시작하시는 분들을 위한 단계별 안내 - 50·60·70대 완전 초보 가이드',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
