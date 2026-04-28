import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
  description: '시니어층이 가장 빠르게 영상 수익화에 성공한 모델. 가족 사연/감동 1분 쇼츠 만드는 방법과 실전 노하우 정리.',
  keywords: ['가족 사연', '쇼츠 수익화', '시니어 영상', '사연 채널', '감동 영상', '시어머니 며느리', '가족 갈등', '쇼츠 만들기', '1분 쇼츠'],
  openGraph: {
    title: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
    description: '시니어층이 가장 빠르게 영상 수익화에 성공한 모델 분석.',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '가족 사연 쇼츠로 시작하기',
    description: '시니어층이 가장 빠르게 수익화한 영상 모델 분석.',
  },
  alternates: {
    canonical: '/knowhow/family-story-shorts',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델',
  description: '시니어층이 가장 빠르게 영상 수익화에 성공한 모델. 가족 사연/감동 1분 쇼츠 만드는 방법과 실전 노하우 정리.',
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
  datePublished: '2026-04-28T00:00:00Z',
  dateModified: '2026-04-28T00:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://nutube.kr/knowhow/family-story-shorts',
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
