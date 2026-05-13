import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '설정 / 시나리오 선택 | 영상 만들기',
  description: '키워드 입력 후 시나리오 톤과 카테고리 옵션 선택.',
  keywords: ['시나리오 선택', '영상 톤', '시나리오 옵션'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '설정 / 시나리오 선택 | 영상 만들기',
    description: '키워드 입력 후 시나리오 톤과 카테고리 옵션 선택.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/configure',
  },
  alternates: {
    canonical: '/configure',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
