import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어 채널 정책 위반 피하는 6가지 규칙',
  description: '안전하게 채널 키우는 핵심 운영 규칙 - 경고 없이 채널 성장하기',
  keywords: ['유튜브', '시니어 사연 쇼츠', '시니어 채널 정책 위반 피하는 6가지 규칙', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/senior-policy-safe',
  },
  openGraph: {
    title: '시니어 채널 정책 위반 피하는 6가지 규칙 | NuTube',
    description: '안전하게 채널 키우는 핵심 운영 규칙 - 경고 없이 채널 성장하기',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/senior-policy-safe',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어 채널 정책 위반 피하는 6가지 규칙 | NuTube',
    description: '안전하게 채널 키우는 핵심 운영 규칙 - 경고 없이 채널 성장하기',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
