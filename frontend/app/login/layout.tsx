import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 (불필요) | AlgoMaker',
  description: 'AlgoMaker는 로그인이 필요 없습니다. 바로 키워드를 입력해 영상 자료를 만드세요.',
  keywords: ['로그인', '회원가입 없음', '바로 사용'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '로그인 (불필요) | AlgoMaker',
    description: 'AlgoMaker는 로그인이 필요 없습니다. 바로 키워드를 입력해 영상 자료를 만드세요.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/login',
  },
  alternates: {
    canonical: '/login',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
