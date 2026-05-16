import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '카메라 울렁증 극복하기',
  description: '얼굴 안 나와도 채널 운영 가능한 방법 - 카메라 공포 완전 극복 가이드',
  keywords: ['유튜브', 'AI 도구', '카메라 울렁증 극복하기', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/camera-anxiety',
  },
  openGraph: {
    title: '카메라 울렁증 극복하기 | NuTube',
    description: '얼굴 안 나와도 채널 운영 가능한 방법 - 카메라 공포 완전 극복 가이드',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/camera-anxiety',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '카메라 울렁증 극복하기 | NuTube',
    description: '얼굴 안 나와도 채널 운영 가능한 방법 - 카메라 공포 완전 극복 가이드',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
