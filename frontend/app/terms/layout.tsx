import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | AlgoMaker',
  description: 'AlgoMaker 서비스 이용약관. 무료 사용 조건, 책임 범위, 콘텐츠 권리 등 명시.',
  keywords: ['이용약관', 'AlgoMaker 약관', '서비스 약관'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '이용약관 | AlgoMaker',
    description: 'AlgoMaker 서비스 이용약관. 무료 사용 조건, 책임 범위, 콘텐츠 권리 등 명시.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/terms',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이용약관 | AlgoMaker',
    description: 'AlgoMaker 서비스 이용약관. 무료 사용 조건, 책임 범위, 콘텐츠 권리 등 명시.',
  },
  alternates: {
    canonical: '/terms',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
