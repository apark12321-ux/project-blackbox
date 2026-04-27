import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '키워드 입력 - 영상 만들기 STEP 2 | AI 영상 자료',
  description: '관심 있는 키워드만 입력하면 AI가 영상 자료 전체를 자동 생성. 분야별 인기 키워드 추천 제공.',
  keywords: ['키워드 입력', 'AI 영상 자료', '인기 키워드', '영상 키워드 추천'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '키워드 입력 - 영상 만들기 STEP 2 | AI 영상 자료',
    description: '관심 있는 키워드만 입력하면 AI가 영상 자료 전체를 자동 생성. 분야별 인기 키워드 추천 제공.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/keyword',
  },
  twitter: {
    card: 'summary_large_image',
    title: '키워드 입력 - 영상 만들기 STEP 2 | AI 영상 자료',
    description: '관심 있는 키워드만 입력하면 AI가 영상 자료 전체를 자동 생성. 분야별 인기 키워드 추천 제공.',
  },
  alternates: {
    canonical: '/keyword',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
