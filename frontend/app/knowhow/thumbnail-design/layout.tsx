import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙',
  description: '한글 텍스트 잘 들어간 썸네일과 그렇지 못한 썸네일의 차이',
  keywords: ['thumbnail design', '조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙', '유튜브 노하우', '영상 만들기', 'AlgoMaker'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙',
    description: '한글 텍스트 잘 들어간 썸네일과 그렇지 못한 썸네일의 차이',
    type: 'article',
    publishedTime: '2026-04-25T00:00:00Z',
    authors: ['박예준'],
    siteName: 'AlgoMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: '조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙',
    description: '한글 텍스트 잘 들어간 썸네일과 그렇지 못한 썸네일의 차이',
  },
  alternates: {
    canonical: '/knowhow/thumbnail-design',
  },
};

// BlogPosting Schema (JSON-LD) - 검색 노출 강화
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙',
  description: '한글 텍스트 잘 들어간 썸네일과 그렇지 못한 썸네일의 차이',
  author: {
    '@type': 'Person',
    name: '박예준',
    url: 'https://nutube.kr/about',
  },
  publisher: {
    '@type': 'Organization',
    name: url: 'https://nutube.kr',
  },
  datePublished: '2026-04-25T00:00:00Z',
  dateModified: '2026-04-25T00:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://nutube.kr/knowhow/thumbnail-design',
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
