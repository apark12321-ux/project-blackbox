import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '영상 콘텐츠로 가치를 만드는 5가지 길',
  description: '내가 잘하는 것을 영상으로 풀어낼 때, 어떤 가치들이 만들어질 수 있을까요. 영상 콘텐츠의 다양한 활용 방향 정리.',
  keywords: ['영상 콘텐츠', '콘텐츠 가치', '영상 만들기', '시니어 영상', '진심 콘텐츠', '꾸준한 콘텐츠'],
  openGraph: {
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    description: '내가 잘하는 것을 영상으로 풀어낼 때 만들어지는 다양한 가치.',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '영상 콘텐츠로 가치를 만드는 5가지 길',
    description: '영상 콘텐츠의 다양한 활용 방향 정리.',
  },
  alternates: {
    canonical: '/knowhow/content-value-paths',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '영상 콘텐츠로 가치를 만드는 5가지 길',
  description: '내가 잘하는 것을 영상으로 풀어낼 때, 어떤 가치들이 만들어질 수 있을까요. 영상 콘텐츠의 다양한 활용 방향 정리.',
  author: {
    '@type': 'Organization',
    name: '알고파트너스',
    url: 'https://nutube.kr',
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
    '@id': 'https://nutube.kr/knowhow/content-value-paths',
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
