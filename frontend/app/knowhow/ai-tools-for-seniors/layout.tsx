import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시니어층이 영상 만들 때 쓸 만한 무료 AI 도구 5가지',
  description: 'ChatGPT부터 미드저니까지, 진짜 도움되는 도구만 정리',
  keywords: ["AI 도구", "시니어 AI", "무료 AI", "영상 AI 도구", "ChatGPT", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '시니어층이 영상 만들 때 쓸 만한 무료 AI 도구 5가지',
    description: 'ChatGPT부터 미드저니까지, 진짜 도움되는 도구만 정리',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시니어층이 영상 만들 때 쓸 만한 무료 AI 도구 5가지',
    description: 'ChatGPT부터 미드저니까지, 진짜 도움되는 도구만 정리',
  },
  alternates: {
    canonical: '/knowhow/ai-tools-for-seniors',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '시니어층이 영상 만들 때 쓸 만한 무료 AI 도구 5가지',
  description: 'ChatGPT부터 미드저니까지, 진짜 도움되는 도구만 정리',
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
    '@id': 'https://nutube.kr/knowhow/ai-tools-for-seniors',
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
