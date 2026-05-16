import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '50대 부업 유튜브 시작 가이드',
  description: '늦은 나이가 오히려 무기가 되는 채널 운영 - 50대 유튜브 부업 완전판',
  keywords: ['유튜브', '수익화', '50대 부업 유튜브 시작 가이드', '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  alternates: {
    canonical: '/blog/side-job-50',
  },
  openGraph: {
    title: '50대 부업 유튜브 시작 가이드 | NuTube',
    description: '늦은 나이가 오히려 무기가 되는 채널 운영 - 50대 유튜브 부업 완전판',
    type: 'article',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog/side-job-50',
    siteName: 'NuTube',
  },
  twitter: {
    card: 'summary_large_image',
    title: '50대 부업 유튜브 시작 가이드 | NuTube',
    description: '늦은 나이가 오히려 무기가 되는 채널 운영 - 50대 유튜브 부업 완전판',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
