import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '영상 노하우 블로그 - 알고리즘 비결',
  description:
    '영상 알고리즘이 어떻게 작동하는지, 클릭률 높은 제목 만드는 법, 시청 유지율 올리는 영상 구조까지. 40대 50대 시니어가 영상 콘텐츠로 성공하는 노하우 블로그.',
  keywords: [
    '영상 노하우',
    '유튜브 알고리즘',
    '영상 제목 노하우',
    '클릭률 높이는 법',
    '시청 유지율',
    '40대 유튜브 노하우',
    '시니어 영상 가이드',
  ],
  openGraph: {
    title: '영상 노하우 블로그 - 알고리즘 비결',
    description: '영상 알고리즘 + 클릭률 + 시청 유지율 노하우',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
