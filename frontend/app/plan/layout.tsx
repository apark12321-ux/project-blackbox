import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '요금제 (모두 무료) | AlgoMaker',
  description: 'AlgoMaker는 모든 기능이 완전 무료입니다. 회원가입 없이 광고 시청만으로 무제한 사용.',
  keywords: ['요금제', 'AlgoMaker 가격', '무료', '플랜'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '요금제 (모두 무료) | AlgoMaker',
    description: 'AlgoMaker는 모든 기능이 완전 무료입니다. 회원가입 없이 광고 시청만으로 무제한 사용.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/plan',
  },
  alternates: {
    canonical: '/plan',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
