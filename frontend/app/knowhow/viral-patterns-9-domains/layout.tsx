import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식',
  description: '부동산부터 가족 사연까지, 실제로 잘된 영상의 공통 패턴 정리',
  keywords: ["떡상 영상", "영상 패턴", "조회수 늘리기", "검증된 공식", "분야별 영상", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식',
    description: '부동산부터 가족 사연까지, 실제로 잘된 영상의 공통 패턴 정리',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식',
    description: '부동산부터 가족 사연까지, 실제로 잘된 영상의 공통 패턴 정리',
  },
  alternates: {
    canonical: '/knowhow/viral-patterns-9-domains',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식',
  description: '부동산부터 가족 사연까지, 실제로 잘된 영상의 공통 패턴 정리',
  author: {
    '@type': 'Organization',
    name: '알고파트너스',
    url: 'https://nutube.kr/about',
  },
  publisher: {
    '@type': 'Organization',
    name: '알고파트너스',
    url: 'https://nutube.kr',
  },
  datePublished: '2026-04-28T00:00:00Z',
  dateModified: '2026-04-28T00:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://nutube.kr/knowhow/viral-patterns-9-domains',
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
      name: '가이드',
      item: 'https://nutube.kr/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식',
      item: 'https://nutube.kr/knowhow/viral-patterns-9-domains',
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
