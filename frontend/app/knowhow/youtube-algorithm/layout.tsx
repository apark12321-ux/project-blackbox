import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준',
  description: '구독자 수보다 더 중요한, AI가 영상을 평가하는 핵심 지표 정리',
  keywords: ['youtube algorithm', '유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준', '유튜브 노하우', '영상 만들기', 'AlgoMaker', '알고파트너스'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준',
    description: '구독자 수보다 더 중요한, AI가 영상을 평가하는 핵심 지표 정리',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준',
    description: '구독자 수보다 더 중요한, AI가 영상을 평가하는 핵심 지표 정리',
  },
  alternates: {
    canonical: '/knowhow/youtube-algorithm',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준',
  description: '구독자 수보다 더 중요한, AI가 영상을 평가하는 핵심 지표 정리',
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
    '@id': 'https://nutube.kr/knowhow/youtube-algorithm',
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
