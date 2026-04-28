import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 소개 | AlgoMaker',
  description: '키워드 하나로 영상 자료를 만드는 무료 AI 도구 AlgoMaker 소개. 분야별 다른 트리거 자동 매칭 + 매번 다른 떡상 시나리오 + 회원가입 불필요.',
  keywords: ['AlgoMaker 소개', 'AI 영상 도구', 'AI 영상 자료', '무료 영상 도구', '영상 콘텐츠 자동 생성', '키워드 영상 자료'],
  openGraph: {
    title: '서비스 소개 | AlgoMaker',
    description: '키워드 하나로 영상 자료를 만드는 무료 AI 도구 AlgoMaker 소개. 분야별 다른 트리거 자동 매칭.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: '서비스 소개 | AlgoMaker',
    description: '키워드 하나로 영상 자료를 만드는 무료 AI 도구.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
