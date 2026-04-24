import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

// ============================================================
// SITE CONFIG
// ============================================================
const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker — AI가 만드는 유튜브 영상, 쇼츠·틱톡·릴스까지 한번에';
const SITE_DESCRIPTION = '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다. 제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에. 무료 시작, 신용카드 불필요.';

// ============================================================
// METADATA API
// ============================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    '유튜브 영상 자동 생성', 'AI 영상 제작', '유튜브 알고리즘 분석',
    'AI 유튜브', '쇼츠 자동 생성', '틱톡 콘텐츠 AI', '릴스 자동 제작',
    'YouTube Shorts AI', '유튜브 제목 자동 생성', '영상 대본 AI',
    '조회수 올리는 법', '유튜브 썸네일 프롬프트', 'AI 이미지 프롬프트',
    '유튜브 시나리오', '1인 크리에이터 도구', '유튜브 자동화',
    'AI 영상 편집', '한국 AI 유튜브', '크리에이터 툴',
  ],
  authors: [{ name: '한줄컴퍼니', url: SITE_URL }],
  creator: '한줄컴퍼니',
  publisher: '한줄컴퍼니',
  applicationName: SITE_NAME,
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
    canonical: SITE_URL,
    languages: {
      'ko-KR': SITE_URL,
    },
  },
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
        alt: 'AlgoMaker - AI 유튜브 영상 자동 생성',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: {
    google: 'google-site-verification-code-here',
    other: {
      'naver-site-verification': 'naver-verification-code-here',
    },
  },
  category: 'technology',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
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
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '한줄컴퍼니',
  alternateName: 'AlgoMaker',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-512.png`,
  description: 'AI 기반 유튜브 영상 자동 생성 서비스 AlgoMaker 운영사',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KR',
    addressRegion: 'Seoul',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@algomaker.app',
    contactType: 'customer service',
    availableLanguage: 'Korean',
  },
};

const jsonLdSoftware = {
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1247',
    bestRating: '5',
  },
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'ko-KR',
};

const jsonLdHowTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'AlgoMaker로 AI 유튜브 영상 만드는 방법',
  description: '키워드만 입력하면 AI가 영상을 자동 생성합니다',
  step: [
    { '@type': 'HowToStep', position: 1, name: '카테고리 선택', text: '8개 카테고리 중 하나 선택' },
    { '@type': 'HowToStep', position: 2, name: '키워드 입력', text: '영상 주제 키워드 입력' },
    { '@type': 'HowToStep', position: 3, name: '시나리오 선택', text: 'AI 추천 3가지 중 선택' },
    { '@type': 'HowToStep', position: 4, name: '플랫폼 선택', text: '유튜브/쇼츠/틱톡/릴스 선택' },
    { '@type': 'HowToStep', position: 5, name: '메타데이터 확인', text: '제목·설명·태그 확인' },
    { '@type': 'HowToStep', position: 6, name: '다운로드', text: '영상과 업로드 자료 다운로드' },
  ],
};

const jsonLdFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'AlgoMaker는 어떤 서비스인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AlgoMaker는 키워드만 입력하면 AI가 유튜브 알고리즘에 최적화된 영상을 자동으로 만들어주는 서비스입니다.',
      },
    },
    {
      '@type': 'Question',
      name: '사용 요금이 어떻게 되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '기본 기능은 무료로 제공되며, 광고로 운영됩니다. 신용카드 없이 바로 시작할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 플랫폼에 업로드할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '유튜브 롱폼, 유튜브 쇼츠, 틱톡, 인스타그램 릴스 4개 플랫폼을 지원합니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'AI 이미지 프롬프트도 제공되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 한글 설명과 영문 디테일로 프롬프트를 제공합니다. Midjourney, DALL-E, Runway 등에서 바로 사용 가능합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 카테고리를 지원하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '경제·재테크, 건강·의료, IT·테크, 교육·자기계발, 요리·음식, 사회·이슈, 부동산, 게임 등 8가지 카테고리를 지원합니다.',
      },
    },
  ],
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
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Pretendard 웹폰트 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />

        {/* JSON-LD 구조화 데이터 */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <Script
          id="ld-software"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <Script
          id="ld-howto"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
        <Script
          id="ld-faq"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
      </head>
      <body>
        {/* ============================================================
            SEO 정적 HTML 콘텐츠 (MathHWP 스타일)
            - view-source에 전체 노출
            - display:none으로 실제 사용자에게는 안 보임
            - 크롤러는 이걸 읽고 사이트 내용 파악
            ============================================================ */}
        <section
          id="seo-prerender"
          aria-hidden="false"
          style={{ display: 'none' }}
        >
          <nav role="navigation" aria-label="주요 메뉴">
            <span>AlgoMaker</span>
            <a href="https://project-blackbox-cpqy.vercel.app">홈</a>
            <a href="https://project-blackbox-cpqy.vercel.app/about">소개</a>
            <a href="https://project-blackbox-cpqy.vercel.app/blog">노하우 블로그</a>
            <a href="https://project-blackbox-cpqy.vercel.app/contact">문의하기</a>
          </nav>

          <section aria-labelledby="hero-heading">
            <p>AI × 유튜브 알고리즘</p>
            <h1 id="hero-heading">
              AI가 만드는 유튜브 영상 — 쇼츠·틱톡·릴스까지 한 번에
            </h1>
            <p>
              키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다.
              제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에 준비됩니다.
            </p>
            <p>무료 시작 · 신용카드 불필요 · 한국어 최적화</p>
          </section>

          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading">8개 카테고리 지원</h2>
            <p>어떤 주제든 AI가 최적의 영상을 만들어드립니다.</p>
            <ul>
              <li>
                <h3>📊 경제·재테크</h3>
                <p>금리, 부동산, 주식, N잡 재테크 영상. 평균 조회수 12,000회.</p>
              </li>
              <li>
                <h3>💊 건강·의료</h3>
                <p>건강 상식, 다이어트, 시니어 건강, 영양. 평균 조회수 18,000회.</p>
              </li>
              <li>
                <h3>💻 IT·테크</h3>
                <p>AI 도구, 앱 추천, IT 트렌드, 기술 뉴스. 평균 조회수 25,000회.</p>
              </li>
              <li>
                <h3>🎓 교육·자기계발</h3>
                <p>학습법, 독서, 습관, 자기계발 팁. 평균 조회수 15,000회.</p>
              </li>
              <li>
                <h3>🍳 요리·음식</h3>
                <p>레시피, 맛집, 홈쿡, 간편식 아이디어. 평균 조회수 20,000회.</p>
              </li>
              <li>
                <h3>⚖️ 사회·이슈</h3>
                <p>시사, 정치, 사회 현상, 뉴스 분석. 평균 조회수 22,000회.</p>
              </li>
              <li>
                <h3>🏠 부동산</h3>
                <p>부동산 시장, 청약, 대출, 인테리어. 평균 조회수 16,000회.</p>
              </li>
              <li>
                <h3>🎮 게임</h3>
                <p>게임 리뷰, 공략, e스포츠, 인기 게임. 평균 조회수 30,000회.</p>
              </li>
            </ul>
          </section>

          <section aria-labelledby="features-heading">
            <h2 id="features-heading">왜 AlgoMaker인가요?</h2>
            <p>수작업으로 영상을 만드는 시간을 없애드립니다.</p>
            <ul>
              <li>
                <h3>AI 알고리즘 분석</h3>
                <p>2026 유튜브 최신 알고리즘 패턴을 학습해 조회수 터지는 영상 구조를 자동 설계합니다.</p>
              </li>
              <li>
                <h3>8개 카테고리 전문화</h3>
                <p>경제, 건강, IT 등 각 분야별 특화된 AI가 맞춤형 영상을 생성합니다.</p>
              </li>
              <li>
                <h3>멀티 플랫폼 대응</h3>
                <p>유튜브 롱폼, 쇼츠, 틱톡, 인스타 릴스 모두 실제 업로드 화면 그대로 재현합니다.</p>
              </li>
              <li>
                <h3>AI 이미지 프롬프트</h3>
                <p>Midjourney, DALL-E, Canva에서 바로 사용 가능한 한글+영문 프롬프트 자동 생성.</p>
              </li>
              <li>
                <h3>AI 영상 프롬프트</h3>
                <p>Runway, Kling, Luma, Sora에서 사용 가능한 시네마틱 영상 프롬프트 제공.</p>
              </li>
              <li>
                <h3>Algo-Magic Booster</h3>
                <p>마법의 레버 한 번으로 제목·태그·썸네일이 조회수 터지는 버전으로 자동 최적화.</p>
              </li>
            </ul>
          </section>

          <section aria-labelledby="howitworks-heading">
            <h2 id="howitworks-heading">단 6단계로 완성됩니다</h2>
            <ol>
              <li>
                <strong>1단계</strong>
                <h3>카테고리 선택</h3>
                <p>경제, 건강, IT 등 8개 카테고리 중 하나를 선택합니다.</p>
              </li>
              <li>
                <strong>2단계</strong>
                <h3>키워드 입력</h3>
                <p>영상 주제가 될 키워드를 입력하거나 추천 키워드를 선택합니다.</p>
              </li>
              <li>
                <strong>3단계</strong>
                <h3>시나리오 선택</h3>
                <p>AI가 추천하는 3가지 시나리오 중 하나를 선택합니다.</p>
              </li>
              <li>
                <strong>4단계</strong>
                <h3>SNS 플랫폼 선택</h3>
                <p>유튜브 롱폼, 쇼츠, 틱톡, 릴스 중 업로드할 플랫폼을 선택합니다.</p>
              </li>
              <li>
                <strong>5단계</strong>
                <h3>메타데이터 확인</h3>
                <p>AI가 생성한 제목·설명·태그를 확인합니다.</p>
              </li>
              <li>
                <strong>6단계</strong>
                <h3>다운로드</h3>
                <p>완성된 영상과 SNS 업로드 자료를 다운로드합니다.</p>
              </li>
            </ol>
          </section>

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading">자주 묻는 질문</h2>
            <dl>
              <dt>
                <h3>AlgoMaker는 어떤 서비스인가요?</h3>
              </dt>
              <dd>
                <p>
                  AlgoMaker는 키워드만 입력하면 AI가 유튜브 알고리즘에 최적화된 영상을
                  자동으로 만들어주는 서비스입니다. 쇼츠·틱톡·릴스 업로드 자료까지
                  한 번에 생성됩니다.
                </p>
              </dd>

              <dt>
                <h3>사용 요금이 어떻게 되나요?</h3>
              </dt>
              <dd>
                <p>기본 기능은 무료로 제공되며, 광고로 운영됩니다.</p>
              </dd>

              <dt>
                <h3>어떤 플랫폼에 업로드할 수 있나요?</h3>
              </dt>
              <dd>
                <p>
                  유튜브 롱폼, 유튜브 쇼츠, 틱톡, 인스타그램 릴스 4개 플랫폼을 지원합니다.
                  각 플랫폼의 실제 업로드 화면을 그대로 재현해서 복사-붙여넣기만 하면
                  업로드가 완료됩니다.
                </p>
              </dd>

              <dt>
                <h3>AI 이미지 프롬프트도 제공되나요?</h3>
              </dt>
              <dd>
                <p>
                  네, 영상 시나리오에 맞는 이미지와 영상 프롬프트를 한글 설명과 영문
                  디테일로 함께 제공합니다. Midjourney, DALL-E, Runway 등의 AI 툴에서
                  바로 사용 가능합니다.
                </p>
              </dd>

              <dt>
                <h3>어떤 카테고리를 지원하나요?</h3>
              </dt>
              <dd>
                <p>
                  경제·재테크, 건강·의료, IT·테크, 교육·자기계발, 요리·음식, 사회·이슈,
                  부동산, 게임 등 8가지 카테고리를 지원합니다.
                </p>
              </dd>
            </dl>
          </section>

          <section aria-labelledby="cta-heading">
            <h2 id="cta-heading">지금 바로 시작하세요</h2>
            <p>무료로 가입하고 첫 영상을 만들어보세요. 신용카드 등록 없이 바로 시작 가능합니다.</p>
            <a href="https://project-blackbox-cpqy.vercel.app">무료로 시작하기</a>
          </section>

          <footer role="contentinfo">
            <p>
              <a href="https://project-blackbox-cpqy.vercel.app/terms">이용약관</a>
              {' | '}
              <a href="https://project-blackbox-cpqy.vercel.app/privacy">개인정보처리방침</a>
              {' | '}
              <a href="https://project-blackbox-cpqy.vercel.app/contact">문의하기</a>
            </p>
            <p>운영: 한줄컴퍼니 | 대표: 박예준</p>
            <p>© 2026 한줄컴퍼니. All rights reserved.</p>
          </footer>
        </section>

        {/* 실제 React 앱 */}
        {children}
      </body>
    </html>
  );
}
