import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결',
  description: 'AI 조합으로 프로 썸네일 5분 완성 - 클릭률 5배 올리는 실전 방법',
  keywords: ['유튜브', 'AI 도구', 'AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/ai-thumbnail-master',
  },
  openGraph: {
    title: 'AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결 | NuTube',
    description: 'AI 조합으로 프로 썸네일 5분 완성 - 클릭률 5배 올리는 실전 방법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/ai-thumbnail-master',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결 | NuTube',
    description: 'AI 조합으로 프로 썸네일 5분 완성 - 클릭률 5배 올리는 실전 방법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
