import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import CookieConsent from './_shared/CookieConsent';
import './globals.css';

// ============================================================
// 사이트 핵심 정보 (환경변수로도 설정 가능)
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nutube.kr';
const SITE_NAME = 'NuTube';
const SITE_TITLE = 'NuTube - 유튜브 채널 운영 노하우 가이드 | 알고리즘·시니어·AI·수익화';
const SITE_DESCRIPTION =
  '유튜브 채널 운영에 필요한 모든 노하우를 무료로 정리해드립니다. 알고리즘, 시니어 사연 쇼츠, AI 도구 활용, 채널 수익화까지 실전 가이드 제공. 유튜브 시작하시는 분들을 위한 단계별 안내. 회원가입 불필요, 완전 무료.';

const SITE_KEYWORDS = [
  // 핵심 정보 사이트 키워드
  '유튜브 채널 운영 노하우',
  '유튜브 알고리즘',
  '유튜브 가이드',
  '유튜브 SEO 전략',
  '유튜브 시작 방법',
  '유튜브 채널 성장',
  // 시니어 카테고리
  '시니어 유튜브',
  '시니어 사연 쇼츠',
  '50대 유튜브',
  '60대 유튜브',
  '시니어 채널 운영',
  // AI 도구 카테고리
  'AI 영상 도구',
  'ChatGPT 영상 대본',
  'AI 썸네일',
  'Sora 영상 제작',
  // 수익화 카테고리
  '유튜브 수익화',
  '유튜브 광고 수익',
  '첫 100명 구독자',
  '유튜브 부업',
  // 노하우
  '유튜브 떡상',
  'CTR 높은 제목',
  '영상 시청 지속률',
  '유튜브 후크',
  '음성 SEO',
  // 보조 도구
  '영상 메타데이터 생성기',
  '제목 추천 도구',
  '시나리오 작성',
];

const SITE_AUTHOR = {
  name: '알고파트너스',
  url: SITE_URL,
};

const ORGANIZATION = {
  name: '알고파트너스',
  legalName: '알고파트너스',
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
  // og-image는 /opengraph-image.tsx로 동적 생성됨 (1200x630)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  // Twitter Card (twitter-image.tsx로 동적 생성)
  twitter: {
    card: 'summary_large_image',
    site: '@nutube',
    creator: '@nutube',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  // Canonical URL (중복 콘텐츠 방지)
  alternates: {
    canonical: SITE_URL,
    languages: {
      'ko-KR': SITE_URL,
      'ko': SITE_URL,
      'x-default': SITE_URL,
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },

  // manifest (PWA 잠재 지원)
  manifest: '/manifest.json',

  // 추가 메타 (포맷)
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // AdSense 사이트 인증 (pub-ID는 공개 식별자)
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9552509372228899',
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
  featureList: [
    'AI 영상 제목 추천 (CTR 분석)',
    '영상 태그 추천 (검색량 분석)',
    '영상 설명 자동 생성',
    '썸네일 콘셉트 추천',
    '영상 대본 시퀀스 (6단계)',
    '한글/영문 영상 프롬프트',
    'AI 이미지 생성',
    'SNS 메타데이터 (유튜브/쇼츠/틱톡/릴스)',
    'NotebookLM 일관된 영상 워크플로우',
  ],
  inLanguage: 'ko-KR',
  audience: {
    '@type': 'Audience',
    audienceType: '시니어층(40대~70대) 영상 콘텐츠 입문자',
  },
};

// FAQ 구조화 데이터 (AEO 최적화 - ChatGPT, Perplexity 인용 가능)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'NuTube는 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NuTube는 키워드 하나만 입력하면 AI가 영상 제목, 태그, 대본, 썸네일, SNS 메타데이터를 모두 자동 생성해주는 무료 도구입니다. 부동산은 수치 중심, 영어는 경험담 중심처럼 분야별로 다른 떡상 트리거를 자동 매칭합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '다른 AI 글쓰기 도구와 무엇이 다른가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '키워드별로 다른 떡상 트리거를 자동 매칭한다는 점이 가장 큰 차이입니다. 부동산은 수치 중심, 영어는 경험담 중심, 다이어트는 비포애프터 중심으로 각 분야에 최적화된 시나리오를 만듭니다. 또한 다시 생성 버튼을 누를 때마다 완전히 새로운 결과가 나와 100명이 같은 키워드를 입력해도 100가지 다른 시나리오가 만들어집니다.',
      },
    },
    {
      '@type': 'Question',
      name: '정말 완전 무료인가요? 회원가입은요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 100% 무료입니다. 회원가입, 신용카드 등록, 결제가 절대 필요 없습니다. 서비스 운영비는 Google AdSense 광고 수익으로 충당하며, 사용자 데이터를 판매하거나 유료 구독으로 전환하지 않습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 분야의 영상을 만들 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '8개 주요 분야가 자동 인식됩니다. 재테크/부동산, 영어/외국어, 다이어트/건강, 자기계발/공부, AI/디지털 도구, 시니어/은퇴, 요리/맛집, 여행/취미. 키워드만 입력하면 AI가 분야를 자동 감지해 맞는 트리거를 적용합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '생성된 결과물은 어디서 사용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '유튜브, 유튜브 쇼츠, 틱톡, 인스타그램 릴스 4개 SNS 플랫폼에 그대로 사용 가능한 메타데이터를 제공합니다. 영상 대본 7단계 시퀀스, 한글/영문 영상 생성 프롬프트, 썸네일 콘셉트도 포함됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '시니어층(40대~70대)도 사용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 그게 주 타겟입니다. 회원가입도 결제도 필요 없고, 키워드 하나만 입력하면 끝입니다. 디지털 도구가 익숙하지 않으셔도 1분 안에 영상 자료가 완성됩니다. 시니어층(40대~70대) 시청자에게 인기 있는 분야 - 시니어 라이프, 재테크, 건강, 가족 관계, 사연/감동 콘텐츠 - 위주로 트리거가 최적화되어 있습니다.',
      },
    },
  ],
};

// HowTo 구조화 데이터 (AEO - ChatGPT가 사용법 추천 시 인용)
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'NuTube로 영상 자료 만드는 방법',
  description: '키워드 하나로 영상 제목, 태그, 대본, 썸네일을 자동 생성하는 4단계 가이드',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: '분야 선택',
      text: '12개 카테고리 중 원하는 분야를 선택합니다. 재테크, 부동산, 건강, 시니어 라이프, 가족 사연 등 시니어층(40대~70대)에게 인기 있는 분야 위주로 구성되어 있습니다.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: '키워드 입력',
      text: '관심 있는 주제의 키워드 1개를 입력합니다. AI가 자동으로 9개 도메인 중 하나로 분류합니다.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'AI 자동 분석',
      text: 'AI가 분야별 떡상 트리거를 매칭합니다. 부동산은 수치 중심, 영어는 경험담 중심으로 다르게 처리됩니다.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: '결과 확인 및 사용',
      text: '영상 제목 3개, 태그 13개, 대본 7단계 시퀀스, 썸네일 콘셉트, SNS 메타데이터를 받아 그대로 복사해 사용합니다.',
    },
  ],
  totalTime: 'PT1M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'KRW',
    value: '0',
  },
};

// ============================================================
// 루트 레이아웃
// ============================================================

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        {/* JSON-LD 구조화 데이터 — body 최상단 배치 (Next.js 14 hydration 호환) */}
        <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(websiteSchema)}
        </Script>
        <Script id="ld-organization" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(organizationSchema)}
        </Script>
        <Script id="ld-webapp" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(webApplicationSchema)}
        </Script>
        <Script id="ld-faq" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(faqSchema)}
        </Script>
        <Script id="ld-howto" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(howToSchema)}
        </Script>

        {/* Google Consent Mode V2 (AdSense 필수) - 기본 거부 상태로 시작 */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

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
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
                
                // Consent Mode V2 통합 - 쿠키 동의 후 GA4 활성화
                window.addEventListener('algomaker:consent-granted', function() {
                  gtag('consent', 'update', {
                    analytics_storage: 'granted',
                  });
                });
              `}
            </Script>
          </>
        )}

        {children}

        {/* Cookie Consent Banner (AdSense GDPR 준수 필수) */}
        <CookieConsent />
      </body>
    </html>
  );
}
