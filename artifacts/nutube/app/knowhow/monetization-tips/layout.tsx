import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '구독자 1,000명 안 되어도 가능한 수익화 5가지',
  description: '유튜브 광고 외에도 수익을 만드는 다양한 방법 정리',
  keywords: ['monetization tips', '구독자 1,000명 안 되어도 가능한 수익화 5가지', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '구독자 1,000명 안 되어도 가능한 수익화 5가지',
    description: '유튜브 광고 외에도 수익을 만드는 다양한 방법 정리',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '구독자 1,000명 안 되어도 가능한 수익화 5가지',
    description: '유튜브 광고 외에도 수익을 만드는 다양한 방법 정리',
  },
  alternates: {
    canonical: '/knowhow/monetization-tips',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '구독자 1,000명 안 되어도 가능한 수익화 5가지',
  description: '유튜브 광고 외에도 수익을 만드는 다양한 방법 정리',
  author: {
    '@type': 'Person',
    name: '알고파트너스',
    url: 'https://nutube.kr/about',
  },
  publisher: {
    '@type': 'Organization',
    name: '알고파트너스',
    url: 'https://nutube.kr',
  },
  datePublished: '2026-04-25T00:00:00Z',
  dateModified: '2026-04-25T00:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://nutube.kr/knowhow/monetization-tips',
  },
  inLanguage: 'ko-KR',
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
    {
      '@type': 'ListItem',
      position: 3,
      name: '구독자 1,000명 안 되어도 가능한 수익화 5가지',
      item: 'https://nutube.kr/knowhow/monetization-tips',
    },
  ],
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
