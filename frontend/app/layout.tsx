import type { Metadata, Viewport } from 'next';
import ContentProtection from './_shared/ContentProtection';
import './globals.css';

// ============================================================
// AlgoMaker - Next.js 15 완전판 SEO + 보호
// ============================================================

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker — AI가 만드는 유튜브 영상, 쇼츠·틱톡·릴스까지 한번에';
const SITE_DESCRIPTION = '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다. 제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    '유튜브 영상 자동 생성',
    'AI 영상 제작',
    '유튜브 알고리즘 분석',
    '쇼츠 자동 생성',
    '틱톡 콘텐츠 AI',
    '릴스 자동 제작',
    '유튜브 제목 자동 생성',
    'AI 이미지 프롬프트',
    '1인 크리에이터 도구',
  ],
  authors: [{ name: '한줄컴퍼니' }],
  creator: '한줄컴퍼니',
  publisher: '한줄컴퍼니',
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f5f1ea',
};

// ============================================================
// JSON-LD 구조화 데이터
// ============================================================
const jsonLdString = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '한줄컴퍼니',
    alternateName: 'AlgoMaker',
    url: SITE_URL,
    description: 'AI 기반 유튜브 영상 자동 생성 서비스 AlgoMaker 운영사',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'ko-KR',
  },
]);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* JSON-LD 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </head>
      <body>
        {/* 🔐 콘텐츠 보호 컴포넌트 (전역) */}
        <ContentProtection />

        {children}
      </body>
    </html>
  );
}
