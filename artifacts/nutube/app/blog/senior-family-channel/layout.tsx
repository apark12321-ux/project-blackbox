import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '50대 이후 시작하는 가족 일상 채널 가이드',
  description: '가족과 함께 추억을 영상으로 남기는 채널 운영법',
  keywords: ['유튜브', '시니어 사연 쇼츠', '50대 이후 시작하는 가족 일상 채널 가이드', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-family-channel',
  },
  openGraph: {
    title: '50대 이후 시작하는 가족 일상 채널 가이드 | NuTube',
    description: '가족과 함께 추억을 영상으로 남기는 채널 운영법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-family-channel',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '50대 이후 시작하는 가족 일상 채널 가이드 | NuTube',
    description: '가족과 함께 추억을 영상으로 남기는 채널 운영법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
