import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '눈길을 사로잡는 썸네일 글자 디자인',
  description: '클릭율 2배 늘리는 썸네일 폰트 활용법 - CTR 높이는 디자인 원칙',
  keywords: ['유튜브', 'AI 도구', '눈길을 사로잡는 썸네일 글자 디자인', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/thumbnail-tips',
  },
  openGraph: {
    title: '눈길을 사로잡는 썸네일 글자 디자인 | NuTube',
    description: '클릭율 2배 늘리는 썸네일 폰트 활용법 - CTR 높이는 디자인 원칙',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/thumbnail-tips',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '눈길을 사로잡는 썸네일 글자 디자인 | NuTube',
    description: '클릭율 2배 늘리는 썸네일 폰트 활용법 - CTR 높이는 디자인 원칙',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
