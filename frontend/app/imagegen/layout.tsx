import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 이미지 생성 - 무료 영상 썸네일 만들기',
  description:
    '프롬프트만 입력하면 AI가 이미지를 자동으로 생성해드립니다. 영상 썸네일, 콘텐츠 이미지, 광고 이미지로 바로 활용하세요. 회원가입 X, API 키 X, 완전 무료.',
  keywords: [
    'AI 이미지 생성',
    '무료 이미지 생성',
    '썸네일 만들기',
    'AI 썸네일',
    '영상 썸네일 무료',
    'AI 그림 생성',
    'Pollinations AI',
    'Flux 이미지 생성',
  ],
  openGraph: {
    title: 'AI 이미지 생성 - 무료 썸네일 도구',
    description: '프롬프트로 AI 이미지 자동 생성. 회원가입 X, 무료',
    type: 'website',
  },
  alternates: {
    canonical: '/imagegen',
  },
};

export default function ImagegenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
