import type { Metadata } from 'next';
import './globals.css';

/**
 * AlgoMaker — 최종 안전 SEO 메타데이터
 *
 * 전략:
 * - YouTube, 유튜브, 너튜브 언급 완전 제거
 * - "영상 제작", "콘텐츠 크리에이터" 같은 중립 키워드
 * - 도메인 nutube.kr 사용 (주소창 노출)
 * - 법적 분쟁 완전 회피
 */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nutube.kr'),
  title: {
    default: 'AlgoMaker — AI 영상 자동 생성 스튜디오',
    template: '%s | AlgoMaker',
  },
  description:
    '키워드 하나로 영상이 완성됩니다. 제목·대본·음성·이미지·편집까지 AI가 자동으로 처리해드리는 한국어 특화 영상 제작 도구. 프로 크리에이터의 조회수 공식이 반영되는 무료 AI 스튜디오.',
  keywords: [
    'AlgoMaker',
    '알고메이커',
    'AI 영상 제작',
    'AI 영상 자동 생성',
    '영상 자동화',
    '영상 제작 도구',
    '동영상 만들기',
    '콘텐츠 크리에이터',
    '대본 자동 생성',
    '영상 대본 만들기',
    '썸네일 제작',
    '1인 미디어',
    '크리에이터 도구',
    '무료 영상 제작',
    '한국어 TTS',
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
    siteName: 'AlgoMaker',
    title: 'AlgoMaker — 영상 제작, 이제 누구나 할 수 있어요',
    description:
      '키워드 하나로 영상이 완성됩니다. 프로 크리에이터의 조회수 공식이 AI에 자동으로 녹아있어요. 100% 무료.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AlgoMaker — AI 영상 자동 생성 스튜디오',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlgoMaker — 영상 제작, 이제 누구나 할 수 있어요',
    description:
      '키워드 하나로 영상이 완성됩니다. 무료로 시작하세요.',
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
        {/* 구조화 데이터 (SEO 강화) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'AlgoMaker',
              alternateName: '알고메이커',
              url: 'https://nutube.kr',
              description:
                'AI가 자동으로 영상을 만들어주는 스튜디오. 키워드 하나로 제목·대본·음성·이미지·편집까지 자동 완성.',
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
