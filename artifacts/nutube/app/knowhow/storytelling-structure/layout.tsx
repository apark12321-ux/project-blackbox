import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10만 조회수 영상의 스토리텔링 구조 분석',
  description: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
  keywords: ['storytelling structure', '10만 조회수 영상의 스토리텔링 구조 분석', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '10만 조회수 영상의 스토리텔링 구조 분석',
    description: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '10만 조회수 영상의 스토리텔링 구조 분석',
    description: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
  },
  alternates: {
    canonical: '/knowhow/storytelling-structure',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '10만 조회수 영상의 스토리텔링 구조 분석',
  description: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
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
    '@id': 'https://nutube.kr/knowhow/storytelling-structure',
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
      name: '10만 조회수 영상의 스토리텔링 구조 분석',
      item: 'https://nutube.kr/knowhow/storytelling-structure',
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
