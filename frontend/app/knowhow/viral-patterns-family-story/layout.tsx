import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '가족 사연 채널의 떡상 패턴 - 8가지 검증된 공식',
  description: '진심 담은 사연이 떡상하는 이유와 만드는 법',
  keywords: ["가족 사연", "사연 채널", "떡상 영상", "감동 콘텐츠", "사연 영상 만들기", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '가족 사연 채널의 떡상 패턴 - 8가지 검증된 공식',
    description: '진심 담은 사연이 떡상하는 이유와 만드는 법',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '가족 사연 채널의 떡상 패턴 - 8가지 검증된 공식',
    description: '진심 담은 사연이 떡상하는 이유와 만드는 법',
  },
  alternates: {
    canonical: '/knowhow/viral-patterns-family-story',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '가족 사연 채널의 떡상 패턴 - 8가지 검증된 공식',
  description: '진심 담은 사연이 떡상하는 이유와 만드는 법',
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
    '@id': 'https://nutube.kr/knowhow/viral-patterns-family-story',
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
