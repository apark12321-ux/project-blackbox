import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '핸드폰만으로 영상 만들기 입문 - 시니어층용 step-by-step',
  description: '카메라 없이도 OK, 무료 앱만으로 영상 완성하는 법',
  keywords: ["핸드폰 영상", "시니어 영상 만들기", "영상 만들기 입문", "무료 앱", "AlgoMaker"],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '핸드폰만으로 영상 만들기 입문 - 시니어층용 step-by-step',
    description: '카메라 없이도 OK, 무료 앱만으로 영상 완성하는 법',
    type: 'article',
    publishedTime: '2026-04-28T00:00:00Z',
    authors: ['알고파트너스'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '핸드폰만으로 영상 만들기 입문 - 시니어층용 step-by-step',
    description: '카메라 없이도 OK, 무료 앱만으로 영상 완성하는 법',
  },
  alternates: {
    canonical: '/knowhow/phone-video-basics',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '핸드폰만으로 영상 만들기 입문 - 시니어층용 step-by-step',
  description: '카메라 없이도 OK, 무료 앱만으로 영상 완성하는 법',
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
    '@id': 'https://nutube.kr/knowhow/phone-video-basics',
  },
  inLanguage: 'ko-KR',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: 'https://nutube.kr',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '가이드',
      item: 'https://nutube.kr/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '핸드폰만으로 영상 만들기 입문 - 시니어층용 step-by-step',
      item: 'https://nutube.kr/knowhow/phone-video-basics',
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
