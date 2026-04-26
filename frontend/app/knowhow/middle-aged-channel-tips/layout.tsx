import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '40대 50대 시니어가 유튜브 시작할 때 꼭 알아야 할 7가지',
  description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
  keywords: ['middle aged channel tips', '40대 50대 시니어가 유튜브 시작할 때 꼭 알아야 할 7가지', '유튜브 노하우', '영상 만들기', 'AlgoMaker', '알고파트너스'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '40대 50대 시니어가 유튜브 시작할 때 꼭 알아야 할 7가지',
    description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '40대 50대 시니어가 유튜브 시작할 때 꼭 알아야 할 7가지',
    description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
  },
  alternates: {
    canonical: '/knowhow/middle-aged-channel-tips',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '40대 50대 시니어가 유튜브 시작할 때 꼭 알아야 할 7가지',
  description: '퇴직 후 유튜브 시작하는 시니어를 위한 현실적인 가이드',
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
    '@id': 'https://nutube.kr/knowhow/middle-aged-channel-tips',
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
