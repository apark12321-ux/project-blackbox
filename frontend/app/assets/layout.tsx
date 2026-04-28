import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '제작 자료 / 다운로드 | 영상 만들기',
  description: '영상 제작에 필요한 이미지, 음성, 자막 파일 다운로드 + 가이드.',
  keywords: ['영상 자료', '이미지 다운로드', '자막 파일', '음성 파일'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '제작 자료 / 다운로드 | 영상 만들기',
    description: '영상 제작에 필요한 이미지, 음성, 자막 파일 다운로드 + 가이드.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/assets',
  },
  alternates: {
    canonical: '/assets',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
