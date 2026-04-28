import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '쇼츠 vs 긴 영상, 어디에 집중해야 할까? 데이터 분석',
  description: '신규 채널 vs 기존 채널의 최적 영상 형식 선택 가이드',
  keywords: ['shorts vs longform', '쇼츠 vs 긴 영상, 어디에 집중해야 할까? 데이터 분석', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '쇼츠 vs 긴 영상, 어디에 집중해야 할까? 데이터 분석',
    description: '신규 채널 vs 기존 채널의 최적 영상 형식 선택 가이드',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '쇼츠 vs 긴 영상, 어디에 집중해야 할까? 데이터 분석',
    description: '신규 채널 vs 기존 채널의 최적 영상 형식 선택 가이드',
  },
  alternates: {
    canonical: '/knowhow/shorts-vs-longform',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '쇼츠 vs 긴 영상, 어디에 집중해야 할까? 데이터 분석',
  description: '신규 채널 vs 기존 채널의 최적 영상 형식 선택 가이드',
  author: {
    '@type': 'Person',
    name: '박예준',
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
    '@id': 'https://nutube.kr/knowhow/shorts-vs-longform',
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
      name: '쇼츠 vs 긴 영상, 어디에 집중해야 할까?',
      item: 'https://nutube.kr/knowhow/shorts-vs-longform',
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
