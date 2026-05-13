import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '완료 / 결과 모음 | 영상 자료',
  description: 'AI가 생성한 영상 자료 모두 정리. SNS 메타데이터 + 이미지 + 음성 생성 가이드.',
  keywords: ['영상 자료 완성', '결과 모음', '메타데이터'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '완료 / 결과 모음 | 영상 자료',
    description: 'AI가 생성한 영상 자료 모두 정리. SNS 메타데이터 + 이미지 + 음성 생성 가이드.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/done',
  },
  alternates: {
    canonical: '/done',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
