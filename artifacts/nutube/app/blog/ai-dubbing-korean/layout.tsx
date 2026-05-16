import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 자동 더빙으로 한국어 영상 자연스럽게 만들기',
  description: '외국어 자막 영상을 자연스러운 한국어 더빙으로 자동화하는 방법',
  keywords: ['유튜브', 'AI 도구', 'AI 자동 더빙으로 한국어 영상 자연스럽게 만들기', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/ai-dubbing-korean',
  },
  openGraph: {
    title: 'AI 자동 더빙으로 한국어 영상 자연스럽게 만들기 | NuTube',
    description: '외국어 자막 영상을 자연스러운 한국어 더빙으로 자동화하는 방법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/ai-dubbing-korean',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 자동 더빙으로 한국어 영상 자연스럽게 만들기 | NuTube',
    description: '외국어 자막 영상을 자연스러운 한국어 더빙으로 자동화하는 방법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
