import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법',
  description: '키워드 분석부터 태그 배치까지 검색 상위 노출 완벽 가이드',
  keywords: ['seo tags', '유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법',
    description: '키워드 분석부터 태그 배치까지 검색 상위 노출 완벽 가이드',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법',
    description: '키워드 분석부터 태그 배치까지 검색 상위 노출 완벽 가이드',
  },
  alternates: {
    canonical: '/knowhow/seo-tags',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법',
  description: '키워드 분석부터 태그 배치까지 검색 상위 노출 완벽 가이드',
  author: {
    '@type': 'Person',
    name: '박예준',
    url: 'https://nutube.kr/about',
  },
  publisher: {
    '@type': 'Organization',
    name: url: 'https://nutube.kr',
  },
  datePublished: '2026-04-25T00:00:00Z',
  dateModified: '2026-04-25T00:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://nutube.kr/knowhow/seo-tags',
  },
  inLanguage: 'ko-KR',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
