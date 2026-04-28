import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시청 유지율 50% 넘기는 영상 구조 7단계',
  description: '시청자가 끝까지 보게 만드는 검증된 영상 구성법',
  keywords: ['viewer retention', '시청 유지율 50% 넘기는 영상 구조 7단계', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '시청 유지율 50% 넘기는 영상 구조 7단계',
    description: '시청자가 끝까지 보게 만드는 검증된 영상 구성법',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시청 유지율 50% 넘기는 영상 구조 7단계',
    description: '시청자가 끝까지 보게 만드는 검증된 영상 구성법',
  },
  alternates: {
    canonical: '/knowhow/viewer-retention',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '시청 유지율 50% 넘기는 영상 구조 7단계',
  description: '시청자가 끝까지 보게 만드는 검증된 영상 구성법',
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
    '@id': 'https://nutube.kr/knowhow/viewer-retention',
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
