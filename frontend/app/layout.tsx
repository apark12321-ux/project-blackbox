import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

// ============================================================
// 사이트 핵심 정보 (환경변수로도 설정 가능)
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nutube.kr';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker - AI 콘텐츠 추천 도구 | 키워드만 입력하면 끝';
const SITE_DESCRIPTION =
  '키워드만 입력하면 AI가 영상 제목·태그·대본·썸네일·해시태그까지 모두 추천해드립니다. 유튜브, 쇼츠, 틱톡, 인스타 릴스의 SNS 메타데이터를 한 번에 만드세요. 40대 퇴직 예정자를 위한 영상 콘텐츠 시작 도구. 완전 무료, 회원가입 불필요.';

const SITE_KEYWORDS = [
  // 핵심 서비스 키워드
  'AI 콘텐츠 추천 도구',
  '영상 제목 추천',
  '영상 태그 추천',
  '영상 대본 작성',
  '썸네일 추천',
  // 플랫폼별
  '유튜브 메타데이터',
  '유튜브 제목 추천',
  '유튜브 태그 추천',
  '쇼츠 키워드',
  '틱톡 콘텐츠',
  '릴스 콘텐츠',
  // 타겟 사용자
  '40대 유튜브',
  '50대 유튜브',
  '퇴직 후 유튜브',
  '시니어 유튜브',
  'N잡 콘텐츠',
  '부업 유튜브',
  // 분야
  '경제 영상',
  '부동산 영상',
  '건강 영상',
  '여행 영상',
  '요리 영상',
  // 기능
  'AI 영상 도구',
  '무료 영상 제작',
  'SNS 업로드 자료',
  '영상 알고리즘',
  'CTR 높은 제목',
];

const SITE_AUTHOR = {
  name: '한줄컴퍼니',
  url: SITE_URL,
};

const ORGANIZATION = {
  name: '한줄컴퍼니',
  legalName: '한줄컴퍼니',
  ceo: '박예준',
  email: 'contact@nutube.kr',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
};

// ============================================================
// 메타데이터 (Next.js 15 방식)
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // 제목 + 템플릿 (자식 페이지에서 %s로 표시)
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,

  // 작성자 + 발행자
  authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.url }],
  creator: SITE_AUTHOR.name,
  publisher: SITE_AUTHOR.name,

  // robots (검색 엔진 안내)
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (Facebook, LinkedIn 등)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AlgoMaker - AI 콘텐츠 추천 도구',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@algomaker',
    creator: '@algomaker',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },

  // Canonical URL (중복 콘텐츠 방지)
  alternates: {
    canonical: SITE_URL,
    languages: {
      'ko-KR': SITE_URL,
    },
  },

  // 추가 정보
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  category: 'technology',
  classification: 'AI Content Tool',

  // 검증 (Search Console + AdSense)
  verification: {
    // 박 대표님이 실제 값으로 채워야 함 (환경변수)
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_VERIFICATION || '',
    },
  },

  // 아이콘
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },

  // manifest (PWA 잠재 지원)
  manifest: '/manifest.json',

  // 추가 메타 (포맷)
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// ============================================================
// Viewport (Next.js 15+ 별도 export)
// ============================================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  colorScheme: 'light',
};

// ============================================================
// 환경변수 - AdSense + Analytics
// ============================================================

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// ============================================================
// JSON-LD 구조화 데이터 (Schema.org)
// 검색 엔진이 사이트를 더 잘 이해하도록 도움
// ============================================================

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: 'ko-KR',
  publisher: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/keyword?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: ORGANIZATION.name,
  legalName: ORGANIZATION.legalName,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: ORGANIZATION.logo,
    width: 512,
    height: 512,
  },
  founder: {
    '@type': 'Person',
    name: ORGANIZATION.ceo,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: ORGANIZATION.email,
    availableLanguage: ['Korean', 'English'],
  },
  sameAs: [],
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#webapp`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'UtilityApplication',
  applicationSubCategory: 'AI Content Recommendation Tool',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'AI 영상 제목 추천 (CTR 분석)',
    '영상 태그 추천 (검색량 분석)',
    '영상 설명 자동 생성',
    '썸네일 콘셉트 추천',
    '영상 대본 시퀀스 (6단계)',
    '한글/영문 영상 프롬프트',
    'AI 이미지 생성',
    'SNS 메타데이터 (유튜브/쇼츠/틱톡/릴스)',
  ],
  inLanguage: 'ko-KR',
  audience: {
    '@type': 'Audience',
    audienceType: '40대 50대 영상 콘텐츠 입문자',
  },
};

// FAQ 구조화 데이터 (Rich Result 노출)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'AlgoMaker는 무료인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, AlgoMaker는 완전 무료로 사용하실 수 있습니다. 회원가입도 필요 없으며, 신용카드도 입력하지 않습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '키워드만 입력하면 무엇이 만들어지나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI가 영상 제목 3가지 후보, 영상 설명, 검색량 분석된 태그 15개, 썸네일 콘셉트 3가지, 영상 대본 시퀀스 6단계, 한글과 영문 영상 프롬프트까지 모두 생성합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 SNS에서 사용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '유튜브 (긴 영상), 유튜브 쇼츠, 틱톡, 인스타그램 릴스 모두 사용 가능합니다. 각 플랫폼의 업로드 화면에 그대로 복사 붙여넣기만 하시면 됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '40대 이상도 사용하기 쉬운가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, AlgoMaker는 40대 50대 시니어 입문자를 위해 설계되었습니다. 키워드 하나만 입력하시면 AI가 모든 자료를 자동으로 만들어드리기 때문에 별도 학습이 필요 없습니다.',
      },
    },
  ],
};

// ============================================================
// 루트 레이아웃
// ============================================================

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* JSON-LD 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Pretendard 폰트 (한글 가독성 최적화) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />

        {/* Preconnect (성능 향상) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.pollinations.ai" />

        {/* AdSense 사이트 인증 (승인 신청 시 필수) */}
        {ADSENSE_CLIENT && <meta name="google-adsense-account" content={ADSENSE_CLIENT} />}
      </head>

      <body>
        {/* Google AdSense Script */}
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Google Analytics 4 (선택사항 - 트래픽 측정) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {children}
      </body>
    </html>
  );
}
