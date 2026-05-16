import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 시청자가 좋아하는 썸네일 디자인 5가지',
  description: '50~70대 시청자의 클릭을 부르는 썸네일 원칙 5가지 완전 정리',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 시청자가 좋아하는 썸네일 디자인 5가지', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-thumbnail-design',
  },
  openGraph: {
    title: '시니어 시청자가 좋아하는 썸네일 디자인 5가지 | NuTube',
    description: '50~70대 시청자의 클릭을 부르는 썸네일 원칙 5가지 완전 정리',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-thumbnail-design',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 시청자가 좋아하는 썸네일 디자인 5가지 | NuTube',
    description: '50~70대 시청자의 클릭을 부르는 썸네일 원칙 5가지 완전 정리',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
