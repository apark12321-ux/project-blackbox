import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '첫 30초가 90%를 결정한다 - 후크(Hook) 작성법',
  description: '시청자 이탈률 50%에서 10%로 만드는 영상 시작 비결',
  keywords: ['후크', '영상 시작', '시청 유지율', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '첫 30초가 90%를 결정한다 - 후크(Hook) 작성법',
    description: '시청자 이탈률 50%에서 10%로 만드는 영상 시작 비결',
    type: 'article',
    publishedTime: '2026-04-18T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '첫 30초가 90%를 결정한다 - 후크(Hook) 작성법',
    description: '시청자 이탈률 50%에서 10%로 만드는 영상 시작 비결',
  },
  alternates: {
    canonical: '/knowhow/first-30-seconds-hook',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '첫 30초가 90%를 결정한다 - 후크(Hook) 작성법',
  description: '시청자 이탈률 50%에서 10%로 만드는 영상 시작 비결',
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
  datePublished: '2026-04-18T00:00:00Z',
  dateModified: '2026-04-25T00:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://nutube.kr/knowhow/first-30-seconds-hook',
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
      name: '첫 30초가 90%를 결정한다 - 후크(Hook) 작성법',
      item: 'https://nutube.kr/knowhow/first-30-seconds-hook',
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
