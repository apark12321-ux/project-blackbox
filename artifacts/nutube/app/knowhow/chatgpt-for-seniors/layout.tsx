import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChatGPT 시니어층 활용법 - 영상 대본 만들기',
  description: '복잡한 명령 없이 간단하게 대본 받는 5가지 질문 패턴',
  keywords: ["ChatGPT", "시니어 ChatGPT", "AI 대본", "영상 대본 만들기", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: 'ChatGPT 시니어층 활용법 - 영상 대본 만들기',
    description: '복잡한 명령 없이 간단하게 대본 받는 5가지 질문 패턴',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatGPT 시니어층 활용법 - 영상 대본 만들기',
    description: '복잡한 명령 없이 간단하게 대본 받는 5가지 질문 패턴',
  },
  alternates: {
    canonical: '/knowhow/chatgpt-for-seniors',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'ChatGPT 시니어층 활용법 - 영상 대본 만들기',
  description: '복잡한 명령 없이 간단하게 대본 받는 5가지 질문 패턴',
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
    '@id': 'https://nutube.kr/knowhow/chatgpt-for-seniors',
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
      name: 'ChatGPT 시니어층 활용법 - 영상 대본 만들기',
      item: 'https://nutube.kr/knowhow/chatgpt-for-seniors',
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
