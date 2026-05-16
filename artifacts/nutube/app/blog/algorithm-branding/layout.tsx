import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '클릭을 부르는 브랜딩과 디테일의 힘',
  description: '60-30-10 컬러 법칙과 채널 아트 3요소 공식으로 CTR 높이기',
  keywords: ['유튜브', '알고리즘', '클릭을 부르는 브랜딩과 디테일의 힘', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/algorithm-branding',
  },
  openGraph: {
    title: '클릭을 부르는 브랜딩과 디테일의 힘 | NuTube',
    description: '60-30-10 컬러 법칙과 채널 아트 3요소 공식으로 CTR 높이기',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/algorithm-branding',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '클릭을 부르는 브랜딩과 디테일의 힘 | NuTube',
    description: '60-30-10 컬러 법칙과 채널 아트 3요소 공식으로 CTR 높이기',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
