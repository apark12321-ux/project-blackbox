import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '일관된 스타일 영상 만드는 법 - 무료 워크플로우',
  description:
    '60장 이미지를 일관된 스타일로 만드는 NotebookLM 워크플로우. 한 사람이 그린 듯한 일관성으로 조회수 20만 채널 운영자들의 비결. Pinterest + NotebookLM + Pollinations 모두 무료.',
  keywords: [
    'NotebookLM 영상',
    '일관된 이미지',
    'AI 영상 일관성',
    '무료 영상 제작',
    'NotebookLM 가이드',
    '영상 워크플로우',
    'Pinterest 레퍼런스',
    '60장 이미지',
    '대사 없는 영상',
  ],
  openGraph: {
    title: '일관된 스타일 영상 만드는 법 - 무료',
    description: 'NotebookLM으로 60장 일관된 이미지 만드는 5단계 가이드',
    type: 'article',
  },
  alternates: {
    canonical: '/workflow',
  },
};

export default function WorkflowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
