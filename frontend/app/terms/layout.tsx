import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'AlgoMaker 서비스 이용약관입니다. 한줄컴퍼니가 운영합니다.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
