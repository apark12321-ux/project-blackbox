import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시청자를 사로잡는 시니어 영상 후크 8가지',
  description: '영상 첫 5초로 시청 완료율 60% 올리는 후크 패턴 완전 분석',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시청자를 사로잡는 시니어 영상 후크 8가지', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-hook-patterns',
  },
  openGraph: {
    title: '시청자를 사로잡는 시니어 영상 후크 8가지 | NuTube',
    description: '영상 첫 5초로 시청 완료율 60% 올리는 후크 패턴 완전 분석',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-hook-patterns',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시청자를 사로잡는 시니어 영상 후크 8가지 | NuTube',
    description: '영상 첫 5초로 시청 완료율 60% 올리는 후크 패턴 완전 분석',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
