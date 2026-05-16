import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChatGPT로 영상 대본 빠르게 쓰는 법',
  description: 'AI를 보조 도구로 활용하는 5가지 프롬프트 - 대본 작성 시간 90% 단축',
  keywords: ['유튜브', 'AI 도구', 'ChatGPT로 영상 대본 빠르게 쓰는 법', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/chatgpt-script',
  },
  openGraph: {
    title: 'ChatGPT로 영상 대본 빠르게 쓰는 법 | NuTube',
    description: 'AI를 보조 도구로 활용하는 5가지 프롬프트 - 대본 작성 시간 90% 단축',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/chatgpt-script',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatGPT로 영상 대본 빠르게 쓰는 법 | NuTube',
    description: 'AI를 보조 도구로 활용하는 5가지 프롬프트 - 대본 작성 시간 90% 단축',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
