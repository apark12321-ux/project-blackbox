import type { Metadata } from 'next';
import './globals.css';

/**
 * 너튜브 NuTube — 전역 메타데이터
 *
 * SEO 전략:
 * - 타이틀: "너튜브" + "NuTube" 병기
 * - 설명: 너튜브 시작 도와주는 서비스임을 명확히
 * - 키워드: "너튜브", "너튜브 시작", "유튜브 자동화" 등 다양한 조합
 */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nutube.kr'),
  title: {
    default: '너튜브 NuTube — AI 유튜브 영상 자동 생성 · 너도 할 수 있어',
    template: '%s | 너튜브 NuTube',
  },
  description:
    '너튜브 시작, 이제 너도 할 수 있어요. 키워드 하나로 제목·대본·음성·이미지·편집까지 AI가 자동으로 완성해드립니다. 프로 너튜버의 조회수 공식이 자동 반영되는 무료 AI 스튜디오.',
  keywords: [
    '너튜브',
    '너튜브 시작',
    'NuTube',
    '유튜브 자동화',
    '유튜브 영상 만들기',
    'AI 영상 제작',
    '유튜브 초보',
    '유튜브 대본 만들기',
    '유튜브 제목 만들기',
    '유튜브 썸네일',
    '유튜브 알고리즘',
    '너튜브 시작하는 법',
    '유튜브 조회수 올리는 법',
    '1인 미디어',
    '콘텐츠 크리에이터',
  ],
  authors: [{ name: '한줄컴퍼니', url: 'https://nutube.kr' }],
  creator: '한줄컴퍼니',
  publisher: '한줄컴퍼니',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://nutube.kr',
    siteName: '너튜브 NuTube',
    title: '너튜브 NuTube — 너튜브 시작, 이제 너도 할 수 있어',
    description:
      '키워드 하나로 너튜브 영상이 완성됩니다. 프로 너튜버의 조회수 공식이 AI에 자동으로 녹아있어요. 100% 무료.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '너튜브 NuTube — AI 유튜브 영상 자동 생성',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '너튜브 NuTube — 너튜브 시작, 이제 너도 할 수 있어',
    description:
      '키워드 하나로 너튜브 영상이 완성됩니다. 무료로 시작하세요.',
    images: ['/og-image.png'],
  },
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
  alternates: {
    canonical: 'https://nutube.kr',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Google Search Console 인증 토큰 (나중에 추가)
    // google: 'your-google-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';

  return (
    <html lang="ko">
      <head>
        {adsenseEnabled && adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
        {/* 구조화 데이터 (SEO + GEO 강화) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '너튜브 NuTube',
              alternateName: ['너튜브', 'NuTube'],
              url: 'https://nutube.kr',
              description:
                '너튜브 시작을 도와주는 AI 영상 자동 생성 서비스. 키워드 하나로 제목·대본·음성·이미지·편집까지 자동 완성.',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Web',
              inLanguage: 'ko-KR',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KRW',
              },
              creator: {
                '@type': 'Organization',
                name: '한줄컴퍼니',
                url: 'https://nutube.kr',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
