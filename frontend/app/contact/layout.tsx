import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 - AlgoMaker 고객 지원',
  description:
    'AlgoMaker 문의하기 페이지. 서비스 이용 중 궁금한 점이나 개선 제안이 있으시면 apark12321@gmail.com로 메일 주세요.',
  keywords: ['문의하기', 'AlgoMaker 고객지원', 'AlgoMaker 문의'],
  alternates: {
    canonical: '/contact',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: 'https://nutube.kr',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '문의하기',
      item: 'https://nutube.kr/contact',
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
