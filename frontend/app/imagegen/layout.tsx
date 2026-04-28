import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 이미지 생성 가이드 | 무료 도구 활용법',
  description: 'NotebookLM, Midjourney 등 AI 이미지 도구로 일관된 60장 이미지 만들기. 영상에 그대로 사용 가능한 명화급 이미지 제작 가이드.',
  keywords: ['AI 이미지', 'NotebookLM', '미드저니', 'AI 이미지 생성', '이미지 일관성', '영상 이미지'],
  authors: [{ name: '박예준', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: 'AI 이미지 생성 가이드 | 무료 도구 활용법',
    description: 'NotebookLM, Midjourney 등 AI 이미지 도구로 일관된 60장 이미지 만들기. 영상에 그대로 사용 가능한 명화급 이미지 제작 가이드.',
    type: 'website',
    siteName: 'AlgoMaker',
    locale: 'ko_KR',
    url: 'https://nutube.kr/imagegen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 이미지 생성 가이드 | 무료 도구 활용법',
    description: 'NotebookLM, Midjourney 등 AI 이미지 도구로 일관된 60장 이미지 만들기. 영상에 그대로 사용 가능한 명화급 이미지 제작 가이드.',
  },
  alternates: {
    canonical: '/imagegen',
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
      name: '이미지 생성 가이드',
      item: 'https://nutube.kr/imagegen',
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
