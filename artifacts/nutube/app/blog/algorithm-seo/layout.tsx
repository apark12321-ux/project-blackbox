import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략',
  description: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 올리는 실전 방법',
  keywords: ['유튜브', '알고리즘', '알고리즘이 내 영상을 알아보게 하는 SEO 전략', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/algorithm-seo',
  },
  openGraph: {
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략 | NuTube',
    description: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 올리는 실전 방법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/algorithm-seo',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략 | NuTube',
    description: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 올리는 실전 방법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
