import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 영상 편집 앱 추천',
  description: '초보가 바로 쓸 수 있는 편집 도구 5선 - 완전 무료 영상 편집 완전판',
  keywords: ['유튜브', 'AI 도구', '무료 영상 편집 앱 추천', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/free-editing-apps',
  },
  openGraph: {
    title: '무료 영상 편집 앱 추천 | NuTube',
    description: '초보가 바로 쓸 수 있는 편집 도구 5선 - 완전 무료 영상 편집 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/free-editing-apps',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '무료 영상 편집 앱 추천 | NuTube',
    description: '초보가 바로 쓸 수 있는 편집 도구 5선 - 완전 무료 영상 편집 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
