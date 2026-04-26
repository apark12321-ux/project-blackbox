import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '댓글, 좋아요, 구독 자연스럽게 늘리는 6가지 방법',
  description: '강요하지 않고도 시청자가 자발적으로 행동하게 만드는 비결',
  keywords: ['community engagement', '댓글, 좋아요, 구독 자연스럽게 늘리는 6가지 방법', '유튜브 노하우', '영상 만들기', 'AlgoMaker', '알고파트너스'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '댓글, 좋아요, 구독 자연스럽게 늘리는 6가지 방법',
    description: '강요하지 않고도 시청자가 자발적으로 행동하게 만드는 비결',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '댓글, 좋아요, 구독 자연스럽게 늘리는 6가지 방법',
    description: '강요하지 않고도 시청자가 자발적으로 행동하게 만드는 비결',
  },
  alternates: {
    canonical: '/knowhow/community-engagement',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '댓글, 좋아요, 구독 자연스럽게 늘리는 6가지 방법',
  description: '강요하지 않고도 시청자가 자발적으로 행동하게 만드는 비결',
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
    '@id': 'https://nutube.kr/knowhow/community-engagement',
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
