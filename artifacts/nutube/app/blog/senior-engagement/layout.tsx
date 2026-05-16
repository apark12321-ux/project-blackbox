import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 채널 댓글과 참여 늘리는 5가지 질문',
  description: '알고리즘이 좋아하는 참여형 질문 패턴 - 댓글 100개 채널 만들기',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 채널 댓글과 참여 늘리는 5가지 질문', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-engagement',
  },
  openGraph: {
    title: '시니어 채널 댓글과 참여 늘리는 5가지 질문 | NuTube',
    description: '알고리즘이 좋아하는 참여형 질문 패턴 - 댓글 100개 채널 만들기',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-engagement',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 채널 댓글과 참여 늘리는 5가지 질문 | NuTube',
    description: '알고리즘이 좋아하는 참여형 질문 패턴 - 댓글 100개 채널 만들기',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
