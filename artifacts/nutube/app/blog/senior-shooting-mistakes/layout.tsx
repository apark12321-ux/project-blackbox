import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어가 처음 영상 찍을 때 흔한 실수 7가지',
  description: '50대 이후 처음 촬영 시 자주 하는 실수와 해결법 완전 정리',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어가 처음 영상 찍을 때 흔한 실수 7가지', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-shooting-mistakes',
  },
  openGraph: {
    title: '시니어가 처음 영상 찍을 때 흔한 실수 7가지 | NuTube',
    description: '50대 이후 처음 촬영 시 자주 하는 실수와 해결법 완전 정리',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-shooting-mistakes',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어가 처음 영상 찍을 때 흔한 실수 7가지 | NuTube',
    description: '50대 이후 처음 촬영 시 자주 하는 실수와 해결법 완전 정리',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
