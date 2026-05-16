import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '6개월간 떡상이 안 와도 버티는 멘탈 관리',
  description: '실패해도 다시 도전하는 5가지 마인드셋 - 유튜버 멘탈 관리 완전판',
  keywords: ['유튜브', '수익화', '6개월간 떡상이 안 와도 버티는 멘탈 관리', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/algorithm-mindset',
  },
  openGraph: {
    title: '6개월간 떡상이 안 와도 버티는 멘탈 관리 | NuTube',
    description: '실패해도 다시 도전하는 5가지 마인드셋 - 유튜버 멘탈 관리 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/algorithm-mindset',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '6개월간 떡상이 안 와도 버티는 멘탈 관리 | NuTube',
    description: '실패해도 다시 도전하는 5가지 마인드셋 - 유튜버 멘탈 관리 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
