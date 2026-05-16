import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스',
  description: '기획부터 업로드 패키지까지 클로드 한 곳에서 완성하는 방법',
  keywords: ['유튜브', 'AI 도구', '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/claude-youtube-workflow',
  },
  openGraph: {
    title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스 | NuTube',
    description: '기획부터 업로드 패키지까지 클로드 한 곳에서 완성하는 방법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/claude-youtube-workflow',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스 | NuTube',
    description: '기획부터 업로드 패키지까지 클로드 한 곳에서 완성하는 방법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
