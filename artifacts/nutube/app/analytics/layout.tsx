import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '분석 / 통계 | AlgoMaker',
  description: '영상 콘텐츠 트렌드 분석. CTR, 시청 유지율, 카테고리별 인기 키워드.',
  keywords: ['영상 분석', '유튜브 통계', 'CTR 분석', '시청 유지율'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '분석 / 통계 | AlgoMaker',
    description: '영상 콘텐츠 트렌드 분석. CTR, 시청 유지율, 카테고리별 인기 키워드.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/analytics',
  },
  alternates: {
    canonical: '/analytics',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
