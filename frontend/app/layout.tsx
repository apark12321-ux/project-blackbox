import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AlgoMaker · AI YouTube 자동화',
  description: 'AI가 키워드 발굴부터 대본·영상·SEO까지 자동 생성하는 YouTube 콘텐츠 자동화 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
