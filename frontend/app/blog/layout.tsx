import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 노하우 모음 | 영상 만들기 전 꼭 봐야 할 15개 글',
  description: '시니어층(40대~70대) 유튜브 입문자를 위한 핵심 노하우 15개. 알고리즘 작동 원리, CTR 높이는 제목, 시청 유지율, SEO 태그, 수익화 전략까지 60,000자 정리.',
  keywords: ['유튜브 노하우', '유튜브 알고리즘', 'CTR 제목', '시청 유지율', '유튜브 SEO', '유튜브 수익화', '40대 유튜브', '시니어 유튜브'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '유튜브 노하우 모음 | 영상 만들기 전 꼭 봐야 할 15개 글',
    description: '시니어층(40대~70대) 유튜브 입문자를 위한 핵심 노하우 15개. 알고리즘 작동 원리, CTR 높이는 제목, 시청 유지율, SEO 태그, 수익화 전략까지 60,000자 정리.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 노하우 모음 | 영상 만들기 전 꼭 봐야 할 15개 글',
    description: '시니어층(40대~70대) 유튜브 입문자를 위한 핵심 노하우 15개. 알고리즘 작동 원리, CTR 높이는 제목, 시청 유지율, SEO 태그, 수익화 전략까지 60,000자 정리.',
  },
  alternates: {
    canonical: '/blog',
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
      name: '노하우',
      item: 'https://nutube.kr/blog',
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
