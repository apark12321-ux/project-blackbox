import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도',
  description: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지',
  keywords: ['유튜브', '알고리즘', 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/human-warmth',
  },
  openGraph: {
    title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도 | NuTube',
    description: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/human-warmth',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도 | NuTube',
    description: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
