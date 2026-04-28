import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '영상 만들기 - 분야 선택 | AI 영상 자료 자동 생성',
  description: '12개 분야 중 원하는 카테고리를 선택해 AI가 영상 제목·태그·대본·썸네일까지 자동 생성. 퇴직 예정/예정자 (40대~70대)에게 인기 있는 분야 위주.',
  keywords: ['영상 만들기', 'AI 영상 자료', '카테고리 선택', '키워드 영상', '영상 자동 생성', '유튜브 자료'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '영상 만들기 - 분야 선택 | AI 영상 자료 자동 생성',
    description: '12개 분야 중 원하는 카테고리를 선택해 AI가 영상 제목·태그·대본·썸네일까지 자동 생성. 퇴직 예정/예정자 (40대~70대)에게 인기 있는 분야 위주.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/create',
  },
  twitter: {
    card: 'summary_large_image',
    title: '영상 만들기 - 분야 선택 | AI 영상 자료 자동 생성',
    description: '12개 분야 중 원하는 카테고리를 선택해 AI가 영상 제목·태그·대본·썸네일까지 자동 생성. 퇴직 예정/예정자 (40대~70대)에게 인기 있는 분야 위주.',
  },
  alternates: {
    canonical: '/create',
  },
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
      name: '영상 만들기',
      item: 'https://nutube.kr/create',
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
