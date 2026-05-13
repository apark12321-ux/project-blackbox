import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
  description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
  keywords: ['middle aged channel tips', '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
    description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
    description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
  },
  alternates: {
    canonical: '/knowhow/middle-aged-channel-tips',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
  description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
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
    '@id': 'https://nutube.kr/knowhow/middle-aged-channel-tips',
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
      name: '시니어층(40대~70대)가 유튜브 시작할 때 꼭 알아야 할 7가지',
      item: 'https://nutube.kr/knowhow/middle-aged-channel-tips',
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
