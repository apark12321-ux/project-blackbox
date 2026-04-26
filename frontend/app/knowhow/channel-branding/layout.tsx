import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기억에 남는 채널 브랜딩 만드는 7가지 요소',
  description: '구독자가 다른 영상에서도 한눈에 알아보는 채널 만들기',
  keywords: ['channel branding', '기억에 남는 채널 브랜딩 만드는 7가지 요소', '유튜브 노하우', '영상 만들기', 'AlgoMaker', '알고파트너스'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '기억에 남는 채널 브랜딩 만드는 7가지 요소',
    description: '구독자가 다른 영상에서도 한눈에 알아보는 채널 만들기',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '기억에 남는 채널 브랜딩 만드는 7가지 요소',
    description: '구독자가 다른 영상에서도 한눈에 알아보는 채널 만들기',
  },
  alternates: {
    canonical: '/knowhow/channel-branding',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '기억에 남는 채널 브랜딩 만드는 7가지 요소',
  description: '구독자가 다른 영상에서도 한눈에 알아보는 채널 만들기',
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
    '@id': 'https://nutube.kr/knowhow/channel-branding',
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
