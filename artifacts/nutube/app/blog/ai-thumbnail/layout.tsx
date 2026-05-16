import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 썸네일 만드는 도구 5개 비교',
  description: 'AI 이미지 생성 도구 완전 비교 - 초보자도 5분 만에 썸네일 완성',
  keywords: ['유튜브', 'AI 도구', 'AI 썸네일 만드는 도구 5개 비교', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/ai-thumbnail',
  },
  openGraph: {
    title: 'AI 썸네일 만드는 도구 5개 비교 | NuTube',
    description: 'AI 이미지 생성 도구 완전 비교 - 초보자도 5분 만에 썸네일 완성',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/ai-thumbnail',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 썸네일 만드는 도구 5개 비교 | NuTube',
    description: 'AI 이미지 생성 도구 완전 비교 - 초보자도 5분 만에 썸네일 완성',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
