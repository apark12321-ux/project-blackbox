import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 소개 | 알고파트너스 박예준 대표',
  description: '40대 퇴직 예정자를 위한 AI 영상 콘텐츠 추천 도구 AlgoMaker 소개. 박예준 대표가 직접 만든 무료 도구. 사업자 정보 + 운영 방침 투명 공개.',
  keywords: ['AlgoMaker 소개', '알고파트너스', '박예준 대표', 'AI 영상 도구', '40대 유튜브 입문', 'AlgoMaker 운영', '무료 영상 도구'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '서비스 소개 | 알고파트너스 박예준 대표',
    description: '40대 퇴직 예정자를 위한 AI 영상 콘텐츠 추천 도구 AlgoMaker 소개. 박예준 대표가 직접 만든 무료 도구. 사업자 정보 + 운영 방침 투명 공개.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: '서비스 소개 | 알고파트너스 박예준 대표',
    description: '40대 퇴직 예정자를 위한 AI 영상 콘텐츠 추천 도구 AlgoMaker 소개. 박예준 대표가 직접 만든 무료 도구. 사업자 정보 + 운영 방침 투명 공개.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
