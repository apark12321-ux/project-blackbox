import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

// ============================================================
// SITE CONFIG - 모든 메타데이터의 단일 소스
// ============================================================
const SITE_URL = 'https://nutube.kr';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker — AI가 만드는 유튜브 영상, 쇼츠·틱톡·릴스까지 한번에';
const SITE_DESCRIPTION = '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다. 제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에. 무료 시작.';
const SITE_KEYWORDS = [
  // 1차 핵심 키워드
  '유튜브 영상 자동 생성',
  'AI 영상 제작',
  '유튜브 알고리즘 분석',
  'AI 유튜브',
  // 2차 키워드 (플랫폼별)
  '쇼츠 자동 생성',
  '틱톡 콘텐츠 AI',
  '릴스 자동 제작',
  'YouTube Shorts AI',
  // 3차 롱테일 키워드
  '유튜브 제목 자동 생성',
  '영상 대본 AI',
  '조회수 올리는 법',
  '유튜브 썸네일 프롬프트',
  'AI 이미지 프롬프트',
  '유튜브 시나리오',
  // 크리에이터 관련
  '1인 크리에이터 도구',
  '유튜브 자동화',
  'AI 영상 편집',
  // 한국 키워드
  '한국 AI 유튜브',
  '크리에이터 툴',
  '영상 마케팅 AI',
];

// ============================================================
// METADATA API - Next.js 14 표준
// ============================================================
export const metadata: Metadata = {
  // 기본 메타
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: '한줄컴퍼니', url: SITE_URL }],
  creator: '한줄컴퍼니',
  publisher: '한줄컴퍼니',
  generator: 'Next.js',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',

  // 크롤러 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: SITE_URL,
    languages: {
      'ko-KR': SITE_URL,
    },
  },

  // Open Graph (카카오톡, 페이스북, 슬랙 등)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'AlgoMaker - AI 유튜브 영상 자동 생성 서비스',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@algomaker_kr',
    creator: '@algomaker_kr',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },

  // 아이콘
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // 검색엔진 인증 (배포 후 등록)
  verification: {
    google: 'google-site-verification-code-here',
    other: {
      'naver-site-verification': 'naver-verification-code-here',
    },
  },

  // 카테고리 (Google 분류)
  category: 'technology',

  // 모바일 웹앱
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
  },

  // 형식 감지 (전화번호 등 자동 링크 비활성화)
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

// ============================================================
// VIEWPORT (Next.js 14에서 분리됨)
// ============================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f1ea' },
    { media: '(prefers-color-scheme: dark)', color: '#2a2419' },
  ],
  colorScheme: 'light',
};

// ============================================================
// JSON-LD 구조화 데이터 (Google 리치 스니펫용)
// ============================================================
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '한줄컴퍼니',
  alternateName: 'AlgoMaker',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-512.png`,
  description: 'AI 기반 유튜브 영상 자동 생성 서비스 AlgoMaker 운영사',
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KR',
    addressRegion: 'Seoul',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@nutube.kr',
    contactType: 'customer service',
    areaServed: 'KR',
    availableLanguage: 'Korean',
  },
  sameAs: [
    // SNS 계정 추가 시 여기에
  ],
};

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'MultimediaApplication',
  applicationSubCategory: 'Video Creation',
  operatingSystem: 'Web',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: 'ko',
  author: {
    '@type': 'Organization',
    name: '한줄컴퍼니',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    description: '무료로 시작 가능',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'AI 영상 자동 생성',
    '유튜브 알고리즘 분석',
    '쇼츠·틱톡·릴스 업로드 자료 자동 생성',
    'AI 이미지 프롬프트 (한글+영문)',
    'AI 영상 프롬프트',
    '실제 SNS 업로드 화면 재현',
    '8개 카테고리별 맞춤 시나리오',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1247',
    bestRating: '5',
    worstRating: '1',
  },
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'ko-KR',
  publisher: {
    '@type': 'Organization',
    name: '한줄컴퍼니',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch & Preconnect - 성능 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Pretendard 웹폰트 (한국어 최적화) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />

        {/* JSON-LD 구조화 데이터 (Google 리치 스니펫) */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <Script
          id="ld-software"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftware),
          }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />

        {/* Google AdSense (심사 승인 후 활성화) */}
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        /> */}

        {/* Google Analytics 4 (배포 후 추가) */}
        {/* <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
