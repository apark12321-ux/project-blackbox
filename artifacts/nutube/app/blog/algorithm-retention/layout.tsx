import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시청자를 채널에 가두는 무한 루프 세팅',
  description: '챕터 + 최종화면 + 재생목록으로 체류시간 2배 늘리는 방법',
  keywords: ['유튜브', '알고리즘', '시청자를 채널에 가두는 무한 루프 세팅', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/algorithm-retention',
  },
  openGraph: {
    title: '시청자를 채널에 가두는 무한 루프 세팅 | NuTube',
    description: '챕터 + 최종화면 + 재생목록으로 체류시간 2배 늘리는 방법',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/algorithm-retention',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시청자를 채널에 가두는 무한 루프 세팅 | NuTube',
    description: '챕터 + 최종화면 + 재생목록으로 체류시간 2배 늘리는 방법',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
