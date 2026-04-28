import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '일관된 영상 만들기 6단계 워크플로우',
  description: '대본 → 자막 → 제목 → 영상 → 음성 → 음악까지. 일관된 1분 쇼츠 만들기 6단계 워크플로우. AI 도구 추천 포함.',
  keywords: ['영상 워크플로우', '쇼츠 만들기', 'AI 영상 제작', '자막 자동', '대본 작성', '영상 만들기 단계'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '일관된 영상 만들기 6단계 워크플로우',
    description: '대본 → 자막 → 제목 → 영상 → 음성 → 음악까지. 일관된 1분 쇼츠 만들기 6단계 워크플로우. AI 도구 추천 포함.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/workflow',
  },
  twitter: {
    card: 'summary_large_image',
    title: '일관된 영상 만들기 6단계 워크플로우',
    description: '대본 → 자막 → 제목 → 영상 → 음성 → 음악까지. 일관된 1분 쇼츠 만들기 6단계 워크플로우. AI 도구 추천 포함.',
  },
  alternates: {
    canonical: '/workflow',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
