import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

// ============================================================
// AlgoMaker - AdSense 최적화 Layout
//
// 박예준 대표 요청:
// ✅ AdSense 최적화 (스크립트, 메타)
// ✅ 가독성 좋은 폰트 (Pretendard)
// ✅ 거짓 정보 X
// ✅ 사운드/크리에이터 정보 X
// ============================================================

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker — AI 콘텐츠 추천 도구';
const SITE_DESCRIPTION = '키워드만 선택하면 AI가 영상 제목·태그·대본을 추천해드립니다. 유튜브, 쇼츠, 틱톡, 릴스 콘텐츠 기획 도구. 완전 무료.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  
  keywords: [
    'AI 콘텐츠 추천',
    '유튜브 제목 추천',
    '영상 키워드 추천',
    '유튜브 태그 추천',
    '영상 대본 추천',
    'AI 영상 도구',
    '쇼츠 키워드',
    '틱톡 콘텐츠',
    '릴스 콘텐츠',
    '유튜브 시작',
    '40대 유튜브',
    '퇴직 후 유튜브',
    'N잡 콘텐츠',
  ],
  
  authors: [{ name: '한줄컴퍼니' }],
  creator: '한줄컴퍼니',
  publisher: '한줄컴퍼니',
  
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
  
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

// AdSense Client ID (환경변수)
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

// JSON-LD (간단하게)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Pretendard 폰트 (가독성 우수) */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" 
        />
      </head>
      <body>
        {/* AdSense Auto Ads 스크립트 (환경변수 있을 때만) */}
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
