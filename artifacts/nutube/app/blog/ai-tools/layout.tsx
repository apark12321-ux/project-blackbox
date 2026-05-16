import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 영상 만들기 도구 모음',
  description: '초보도 쓸 수 있는 AI 도구 추천 가이드 - 무료·유료 완전 비교',
  keywords: ['유튜브', 'AI 도구', 'AI 영상 만들기 도구 모음', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/ai-tools',
  },
  openGraph: {
    title: 'AI 영상 만들기 도구 모음 | NuTube',
    description: '초보도 쓸 수 있는 AI 도구 추천 가이드 - 무료·유료 완전 비교',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/ai-tools',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 영상 만들기 도구 모음 | NuTube',
    description: '초보도 쓸 수 있는 AI 도구 추천 가이드 - 무료·유료 완전 비교',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
