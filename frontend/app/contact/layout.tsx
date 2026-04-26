import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 - AlgoMaker 고객 지원',
  description:
    'AlgoMaker(알고파트너스) 문의하기 페이지. 서비스 이용 중 궁금한 점이나 문제가 있으시면 apark12321@gmail.com 로 문의해주세요.',
  keywords: ['문의하기', 'AlgoMaker 고객지원', '알고파트너스 연락처'],
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
