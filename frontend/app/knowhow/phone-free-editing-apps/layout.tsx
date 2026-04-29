import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어층 무료 영상 편집 앱 5가지 비교',
  description: '돈 안 내고 충분히 만드는 영상, 본인에게 맞는 앱 고르기',
  keywords: ["무료 영상 편집", "시니어 영상 앱", "무료 앱", "영상 편집 앱 비교", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '시니어층 무료 영상 편집 앱 5가지 비교',
    description: '돈 안 내고 충분히 만드는 영상, 본인에게 맞는 앱 고르기',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어층 무료 영상 편집 앱 5가지 비교',
    description: '돈 안 내고 충분히 만드는 영상, 본인에게 맞는 앱 고르기',
  },
  alternates: {
    canonical: '/knowhow/phone-free-editing-apps',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '시니어층 무료 영상 편집 앱 5가지 비교',
  description: '돈 안 내고 충분히 만드는 영상, 본인에게 맞는 앱 고르기',
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
    '@id': 'https://nutube.kr/knowhow/phone-free-editing-apps',
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
