import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어층이 사랑하는 떡상 영상 패턴 5가지',
  description: '50대~70대 시청자가 끝까지 보는 영상의 공통점',
  keywords: ["시니어 영상", "떡상 영상", "50대 영상", "60대 영상", "시니어 콘텐츠", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '시니어층이 사랑하는 떡상 영상 패턴 5가지',
    description: '50대~70대 시청자가 끝까지 보는 영상의 공통점',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어층이 사랑하는 떡상 영상 패턴 5가지',
    description: '50대~70대 시청자가 끝까지 보는 영상의 공통점',
  },
  alternates: {
    canonical: '/knowhow/viral-patterns-senior',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '시니어층이 사랑하는 떡상 영상 패턴 5가지',
  description: '50대~70대 시청자가 끝까지 보는 영상의 공통점',
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
    '@id': 'https://nutube.kr/knowhow/viral-patterns-senior',
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
      name: '시니어층이 사랑하는 떡상 영상 패턴 5가지',
      item: 'https://nutube.kr/knowhow/viral-patterns-senior',
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
