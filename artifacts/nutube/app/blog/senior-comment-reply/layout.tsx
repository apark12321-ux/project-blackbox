import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 채널 댓글 답변 5가지 - 진짜 팬을 만드는 비결',
  description: '구독자를 진짜 팬으로, 후원자로 키우는 댓글 답변 전략 완전판',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 채널 댓글 답변 5가지 - 진짜 팬을 만드는 비결', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-comment-reply',
  },
  openGraph: {
    title: '시니어 채널 댓글 답변 5가지 - 진짜 팬을 만드는 비결 | NuTube',
    description: '구독자를 진짜 팬으로, 후원자로 키우는 댓글 답변 전략 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-comment-reply',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 채널 댓글 답변 5가지 - 진짜 팬을 만드는 비결 | NuTube',
    description: '구독자를 진짜 팬으로, 후원자로 키우는 댓글 답변 전략 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
