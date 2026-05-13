import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '뉴스 / 트렌드 | AlgoMaker',
  description: '영상 콘텐츠 트렌드 + 알고리즘 변화 + AI 도구 업데이트 소식.',
  keywords: ['영상 트렌드', '유튜브 뉴스', 'AI 도구 업데이트', '알고리즘 변화'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '뉴스 / 트렌드 | AlgoMaker',
    description: '영상 콘텐츠 트렌드 + 알고리즘 변화 + AI 도구 업데이트 소식.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/news',
  },
  alternates: {
    canonical: '/news',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
