import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '음성 SEO 완전 정복 - 검색 노출 200%',
  description: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식 - 음성 검색 최적화 완전판',
  keywords: ['유튜브', 'AI 도구', '음성 SEO 완전 정복 - 검색 노출 200%', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/voice-seo',
  },
  openGraph: {
    title: '음성 SEO 완전 정복 - 검색 노출 200% | NuTube',
    description: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식 - 음성 검색 최적화 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/voice-seo',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '음성 SEO 완전 정복 - 검색 노출 200% | NuTube',
    description: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식 - 음성 검색 최적화 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
