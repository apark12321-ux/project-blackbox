import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '저작권 걱정 없는 무료 BGM 사이트 10개 정리',
  description: '유튜브 수익화 가능한 무료 음악 다운로드 가이드',
  keywords: ['bgm copyright free', '저작권 걱정 없는 무료 BGM 사이트 10개 정리', '유튜브 노하우', '영상 만들기', 'AlgoMaker', '알고파트너스'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '저작권 걱정 없는 무료 BGM 사이트 10개 정리',
    description: '유튜브 수익화 가능한 무료 음악 다운로드 가이드',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '저작권 걱정 없는 무료 BGM 사이트 10개 정리',
    description: '유튜브 수익화 가능한 무료 음악 다운로드 가이드',
  },
  alternates: {
    canonical: '/knowhow/bgm-copyright-free',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '저작권 걱정 없는 무료 BGM 사이트 10개 정리',
  description: '유튜브 수익화 가능한 무료 음악 다운로드 가이드',
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
    '@id': 'https://nutube.kr/knowhow/bgm-copyright-free',
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
