import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지',
  description: '유튜브 알고리즘이 좋아하는 제목 패턴과 실제 성공 사례 분석',
  keywords: ['ctr title secrets', '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지',
    description: '유튜브 알고리즘이 좋아하는 제목 패턴과 실제 성공 사례 분석',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지',
    description: '유튜브 알고리즘이 좋아하는 제목 패턴과 실제 성공 사례 분석',
  },
  alternates: {
    canonical: '/knowhow/ctr-title-secrets',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지',
  description: '유튜브 알고리즘이 좋아하는 제목 패턴과 실제 성공 사례 분석',
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
    '@id': 'https://nutube.kr/knowhow/ctr-title-secrets',
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
      name: '클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지',
      item: 'https://nutube.kr/knowhow/ctr-title-secrets',
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
