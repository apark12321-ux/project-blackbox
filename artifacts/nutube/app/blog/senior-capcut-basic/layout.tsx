import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 영상 편집 - 무료 앱 기본 사용법',
  description: '처음 시작하는 시니어를 위한 영상 편집 5단계 완전 초보 가이드',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 영상 편집 - 무료 앱 기본 사용법', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-capcut-basic',
  },
  openGraph: {
    title: '시니어 영상 편집 - 무료 앱 기본 사용법 | NuTube',
    description: '처음 시작하는 시니어를 위한 영상 편집 5단계 완전 초보 가이드',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-capcut-basic',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 영상 편집 - 무료 앱 기본 사용법 | NuTube',
    description: '처음 시작하는 시니어를 위한 영상 편집 5단계 완전 초보 가이드',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
