import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '트렌드 키워드 발굴하는 무료 도구 7가지',
  description: '유료 도구 없이 검색량 높은 키워드를 찾는 실전 방법',
  keywords: ['trending keywords research', '트렌드 키워드 발굴하는 무료 도구 7가지', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '트렌드 키워드 발굴하는 무료 도구 7가지',
    description: '유료 도구 없이 검색량 높은 키워드를 찾는 실전 방법',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '트렌드 키워드 발굴하는 무료 도구 7가지',
    description: '유료 도구 없이 검색량 높은 키워드를 찾는 실전 방법',
  },
  alternates: {
    canonical: '/knowhow/trending-keywords-research',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '트렌드 키워드 발굴하는 무료 도구 7가지',
  description: '유료 도구 없이 검색량 높은 키워드를 찾는 실전 방법',
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
    '@id': 'https://nutube.kr/knowhow/trending-keywords-research',
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
      name: '트렌드 키워드 발굴하는 무료 도구 7가지',
      item: 'https://nutube.kr/knowhow/trending-keywords-research',
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
