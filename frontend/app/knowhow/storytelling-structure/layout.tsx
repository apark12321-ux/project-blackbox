import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10만 조회수 영상의 스토리텔링 구조 분석',
  description: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
  keywords: ['storytelling structure', '10만 조회수 영상의 스토리텔링 구조 분석', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '10만 조회수 영상의 스토리텔링 구조 분석',
    description: '시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
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
    '@id': 'https://nutube.kr/knowhow/storytelling-structure',
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
