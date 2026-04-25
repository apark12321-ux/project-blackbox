import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '영상 만들기 - 12개 분야 중 선택하세요',
  description:
    '경제, 부동산, 건강, 여행, 요리, IT 등 12개 분야 중 원하는 카테고리를 선택하시면 AI가 트렌드 키워드를 추천해드립니다. 40대 50대 시니어 입문자도 쉽게 시작할 수 있는 영상 콘텐츠 도구.',
  keywords: [
    '영상 만들기',
    '유튜브 만들기',
    '영상 분야',
    '영상 카테고리',
    'AI 영상 추천',
    '40대 영상 시작',
    '50대 영상 시작',
  ],
  openGraph: {
    title: '영상 만들기 - 12개 분야 중 선택',
    description: '키워드만 입력하면 AI가 영상 자료를 만들어드립니다',
    type: 'website',
  },
  alternates: {
    canonical: '/create',
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
