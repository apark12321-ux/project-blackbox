import type { Metadata } from 'next';
import './globals.css';
import AppLayout from './layout-client';

export const metadata: Metadata = {
  title: 'AlgoMaker · AI YouTube 자동화',
  description: 'AI가 키워드 발굴부터 대본·영상·SEO까지 자동 생성하는 YouTube 콘텐츠 자동화 플랫폼',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
