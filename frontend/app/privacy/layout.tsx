import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | AlgoMaker',
  description: 'AlgoMaker 개인정보처리방침. 회원가입 없이 사용 가능. Google AdSense 광고 쿠키 처리 방침 포함. GDPR 준수.',
  keywords: ['개인정보처리방침', 'AlgoMaker 정책', '쿠키 정책', 'AdSense 정책'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '개인정보처리방침 | AlgoMaker',
    description: 'AlgoMaker 개인정보처리방침. 회원가입 없이 사용 가능. Google AdSense 광고 쿠키 처리 방침 포함. GDPR 준수.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/privacy',
  },
  twitter: {
    card: 'summary_large_image',
    title: '개인정보처리방침 | AlgoMaker',
    description: 'AlgoMaker 개인정보처리방침. 회원가입 없이 사용 가능. Google AdSense 광고 쿠키 처리 방침 포함. GDPR 준수.',
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
