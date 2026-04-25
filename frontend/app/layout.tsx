import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker — AI 콘텐츠 추천 도구 | 키워드만 입력하면 끝';
const SITE_DESCRIPTION = '키워드만 입력하면 AI가 영상 제목·태그·대본·썸네일까지 추천해드립니다. 유튜브, 쇼츠, 틱톡, 릴스 SNS 메타데이터 한 번에. 40대 퇴직 예정자 환영. 완전 무료, 회원가입 불필요.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: [
    'AI 콘텐츠 추천', '유튜브 제목 추천', 'AI 영상 도구',
    '영상 키워드 추천', '유튜브 태그 추천', '쇼츠 키워드',
    '틱톡 콘텐츠', '릴스 콘텐츠', '40대 유튜브', '퇴직 후 유튜브',
    'N잡 콘텐츠', 'SNS 메타데이터', '유튜브 시작', '50대 N잡',
  ],
  authors: [{ name: '한줄컴퍼니' }],
  creator: '한줄컴퍼니',
  publisher: '한줄컴퍼니',
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website', locale: 'ko_KR', url: SITE_URL,
    siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE, description: SITE_DESCRIPTION,
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5,
  themeColor: '#ffffff',
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
