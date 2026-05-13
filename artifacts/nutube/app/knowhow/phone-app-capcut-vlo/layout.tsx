import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교',
  description: '두 앱의 장단점과 본인에게 맞는 앱 고르는 기준',
  keywords: ["캡캠", "CapCut", "블로", "VLLO", "영상 편집 앱", "시니어 앱 사용법", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교',
    description: '두 앱의 장단점과 본인에게 맞는 앱 고르는 기준',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교',
    description: '두 앱의 장단점과 본인에게 맞는 앱 고르는 기준',
  },
  alternates: {
    canonical: '/knowhow/phone-app-capcut-vlo',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교',
  description: '두 앱의 장단점과 본인에게 맞는 앱 고르는 기준',
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
    '@id': 'https://nutube.kr/knowhow/phone-app-capcut-vlo',
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
      name: '캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교',
      item: 'https://nutube.kr/knowhow/phone-app-capcut-vlo',
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
