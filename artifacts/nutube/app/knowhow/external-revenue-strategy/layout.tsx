import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '조회수 0원에서 2,500만원으로 - 외부 수익화 5가지 경로',
  description: '구독자 4,000명 채널이 250만 채널보다 더 버는 이유. 조회수 수익 0원에서 외부 수익 2,500만 원으로 전환한 실전 노하우 정리.',
  keywords: ['외부 수익화', '쿠팡 파트너스', '유튜브 수익', '제휴 마케팅', '지식 강의', '구독자 적은 채널 수익화', '소수 정예 찐팬', '유튜브 비즈니스'],
  openGraph: {
    title: '조회수 0원에서 2,500만원으로 - 외부 수익화 5가지 경로',
    description: '구독자 4,000명 채널이 250만 채널보다 더 버는 이유.',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '조회수 0원에서 2,500만원으로',
    description: '소수 정예 찐팬으로 외부 수익 만드는 5가지 경로.',
  },
  alternates: {
    canonical: '/knowhow/external-revenue-strategy',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '조회수 0원에서 2,500만원으로 - 외부 수익화 5가지 경로',
  description: '구독자 4,000명 채널이 250만 채널보다 더 버는 이유. 조회수 수익 0원에서 외부 수익 2,500만 원으로 전환한 실전 노하우 정리.',
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
    '@id': 'https://nutube.kr/knowhow/external-revenue-strategy',
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
