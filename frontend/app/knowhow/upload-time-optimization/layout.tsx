import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유튜브 업로드 최적 시간 - 데이터로 검증된 황금 시간',
  description: '내 채널 시청자가 가장 많이 접속하는 시간대 찾는 법',
  keywords: ['upload time optimization', '유튜브 업로드 최적 시간 - 데이터로 검증된 황금 시간', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '유튜브 업로드 최적 시간 - 데이터로 검증된 황금 시간',
    description: '내 채널 시청자가 가장 많이 접속하는 시간대 찾는 법',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 업로드 최적 시간 - 데이터로 검증된 황금 시간',
    description: '내 채널 시청자가 가장 많이 접속하는 시간대 찾는 법',
  },
  alternates: {
    canonical: '/knowhow/upload-time-optimization',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '유튜브 업로드 최적 시간 - 데이터로 검증된 황금 시간',
  description: '내 채널 시청자가 가장 많이 접속하는 시간대 찾는 법',
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
    '@id': 'https://nutube.kr/knowhow/upload-time-optimization',
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
