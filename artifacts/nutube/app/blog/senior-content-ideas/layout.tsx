import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 채널 콘텐츠 아이디어 30가지',
  description: '시청자 공감을 부르는 검증된 주제 30가지 - 시니어 유튜브 콘텐츠 완전판',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 채널 콘텐츠 아이디어 30가지', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-content-ideas',
  },
  openGraph: {
    title: '시니어 채널 콘텐츠 아이디어 30가지 | NuTube',
    description: '시청자 공감을 부르는 검증된 주제 30가지 - 시니어 유튜브 콘텐츠 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-content-ideas',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 채널 콘텐츠 아이디어 30가지 | NuTube',
    description: '시청자 공감을 부르는 검증된 주제 30가지 - 시니어 유튜브 콘텐츠 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
