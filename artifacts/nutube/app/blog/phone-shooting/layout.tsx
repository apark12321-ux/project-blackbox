import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '핸드폰만으로 영상 잘 찍는 법',
  description: '카메라 없이도 가능한 촬영 노하우 - 스마트폰 영상 퀄리티 올리기',
  keywords: ['유튜브', 'AI 도구', '핸드폰만으로 영상 잘 찍는 법', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/phone-shooting',
  },
  openGraph: {
    title: '핸드폰만으로 영상 잘 찍는 법 | NuTube',
    description: '카메라 없이도 가능한 촬영 노하우 - 스마트폰 영상 퀄리티 올리기',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/phone-shooting',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '핸드폰만으로 영상 잘 찍는 법 | NuTube',
    description: '카메라 없이도 가능한 촬영 노하우 - 스마트폰 영상 퀄리티 올리기',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
