import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description:
    'AlgoMaker(한줄컴퍼니)의 개인정보 처리방침입니다. 본 사이트는 사용자 개인정보를 보호하며 Google AdSense 광고 쿠키 정책을 준수합니다.',
  keywords: ['개인정보 처리방침', 'AlgoMaker 개인정보', '쿠키 정책'],
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
