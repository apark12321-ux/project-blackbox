import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 소개 - AlgoMaker는 어떤 도구?',
  description:
    'AlgoMaker는 알고파트너스가 운영하는 무료 AI 콘텐츠 추천 도구입니다. 40대 50대 시니어 영상 입문자가 키워드만 입력하면 AI가 영상 제목, 태그, 대본, 썸네일까지 추천해드립니다. 운영자: 알고파트너스 박예준.',
  keywords: ['서비스 소개', 'AlgoMaker 소개', '알고파트너스', '박예준', 'AI 영상 도구 소개'],
  openGraph: {
    title: '서비스 소개 - AlgoMaker',
    description: '알고파트너스가 운영하는 무료 AI 콘텐츠 추천 도구',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
