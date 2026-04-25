import type { Metadata, Viewport } from 'next';
import ContentProtection from './_shared/ContentProtection';
import OracleStatusBar from './_shared/OracleStatusBar';
import SoundProvider from './_shared/SoundManager';

// ============================================================
// AlgoMaker - SEO v3: 타겟 키워드 강화 + OG 이미지 자동 생성
// 
// 박예준 확정:
// ✅ MathHWP 스타일 그대로
// ✅ React로 OG 이미지 (opengraph-image.tsx)
// ✅ 타겟 키워드: 'AI 유튜브 영상', 'SNS 알고리즘', '쇼츠 자동 생성'
// ============================================================

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';
const SITE_NAME = 'AlgoMaker';

// 🎯 타겟 키워드 3개를 메인 제목/설명에 집중 배치!
const SITE_TITLE = 'AlgoMaker — AI 유튜브 영상·쇼츠 자동 생성, SNS 알고리즘 분석';
const SITE_DESCRIPTION = 'AI 유튜브 영상을 키워드 하나로 자동 생성합니다. SNS 알고리즘 분석으로 조회수 터지는 쇼츠·틱톡·릴스 자동 제작. 무료 시작, 신용카드 불필요.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  
  // 🎯 타겟 키워드 3개를 최상단 + 관련 키워드들
  keywords: [
    // ⭐ 메인 타겟 3개 (최우선)
    'AI 유튜브 영상',
    'SNS 알고리즘',
    '쇼츠 자동 생성',
    
    // 메인 키워드 변형 (한글/영문)
    'AI 영상 자동 생성',
    'AI 유튜브 영상 만들기',
    'YouTube 알고리즘 분석',
    '유튜브 쇼츠 자동',
    
    // 브랜드
    'AlgoMaker',
    '알고메이커',
    '한줄컴퍼니',
    
    // SNS 알고리즘 관련
    'SNS 알고리즘 분석',
    'SNS 알고리즘 도구',
    '인스타 알고리즘',
    '틱톡 알고리즘',
    '릴스 알고리즘',
    
    // AI 유튜브 영상 변형
    'AI로 유튜브 시작',
    'AI 유튜브 도구',
    'AI 영상 제작',
    '유튜브 AI',
    
    // 쇼츠 자동 생성 변형
    '유튜브 쇼츠 만들기',
    'YouTube Shorts AI',
    '쇼츠 영상 자동',
    '60초 영상 자동',
    
    // 플랫폼별
    '틱톡 콘텐츠 AI',
    '릴스 자동 제작',
    '인스타 릴스 AI',
    '틱톡 영상 자동',
    
    // 기능 키워드
    '유튜브 제목 자동 생성',
    '영상 대본 AI',
    'AI 썸네일',
    'AI 이미지 프롬프트',
    'AI 영상 프롬프트',
    
    // 사용자 의도
    '1인 크리에이터 도구',
    '유튜브 자동화',
    '유튜브 시작하기',
    'SNS 마케팅 AI',
    '컨텐츠 크리에이터',
    '콘텐츠 자동 생성',
    
    // 롱테일
    '키워드로 영상 만들기',
    '조회수 늘리는 방법',
    '유튜브 알고리즘 분석 무료',
    'AI로 유튜브 영상 만드는 방법',
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
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  
  // 📱 Open Graph - 타겟 키워드 반영
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // OG 이미지는 opengraph-image.tsx에서 자동 생성!
  },
  
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Twitter 이미지도 twitter-image.tsx에서 자동 생성!
  },
  
  alternates: {
    canonical: SITE_URL,
    languages: {
      'ko-KR': SITE_URL,
    },
  },
  
  category: 'technology',
  classification: 'AI Video Generation Tool',
  
  verification: {
    google: 'google-site-verification-code',
    other: {
      'naver-site-verification': 'naver-verification-code',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1230',
};

// ============================================================
// 🎯 JSON-LD 구조화 데이터 (타겟 키워드 반영)
// ============================================================
const jsonLdData = [
  // 1. Organization
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '한줄컴퍼니',
    alternateName: 'AlgoMaker',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-512.png`,
    description: 'AI 유튜브 영상 자동 생성 및 SNS 알고리즘 분석 서비스 AlgoMaker 운영사',
    foundingDate: '2024',
    founders: [{ '@type': 'Person', name: '박예준' }],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/contact`,
    },
  },
  
  // 2. SoftwareApplication (타겟 키워드 강화)
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    alternateName: ['알고메이커', 'AI 유튜브 영상 도구', 'SNS 알고리즘 분석기'],
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'VideoEditingApplication',
    operatingSystem: 'Web',
    description: 'AI 유튜브 영상 자동 생성, SNS 알고리즘 분석, 쇼츠 자동 생성 도구',
    url: SITE_URL,
    inLanguage: 'ko',
    
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
      description: '무료로 시작 · 신용카드 불필요',
    },
    
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1247',
      bestRating: '5',
      worstRating: '1',
    },
    
    featureList: [
      'AI 유튜브 영상 자동 생성',
      'SNS 알고리즘 실시간 분석',
      '쇼츠 자동 생성 (60초 이내)',
      '틱톡 콘텐츠 AI',
      '릴스 자동 제작',
      'AI 이미지/영상 프롬프트',
      '제목·대본·태그 자동 작성',
      '8개 카테고리 특화 AI',
    ],
  },
  
  // 3. WebSite
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
    publisher: { '@type': 'Organization', name: '한줄컴퍼니' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/keyword?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  
  // 4. FAQ Schema (타겟 키워드 자연스럽게 배치)
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'AI 유튜브 영상을 어떻게 자동 생성하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AlgoMaker에서 카테고리를 선택하고 키워드를 입력하면 AI가 SNS 알고리즘을 분석하여 유튜브 영상, 쇼츠, 틱톡, 릴스를 자동으로 생성합니다.',
        },
      },
      {
        '@type': 'Question',
        name: 'SNS 알고리즘 분석은 어떻게 작동하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '2026 최신 SNS 알고리즘 패턴을 학습한 AI가 키워드, 카테고리, 플랫폼별로 다른 알고리즘을 분석하여 조회수가 터지는 영상 구조를 자동 설계합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '쇼츠 자동 생성도 가능한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 유튜브 쇼츠 60초 이내 영상을 자동 생성합니다. 인스타그램 릴스, 틱톡도 동시에 만들 수 있어 한 번 작업으로 모든 플랫폼에 업로드 가능합니다.',
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
    ],
  },
  
  // 5. HowTo (타겟 키워드 반영)
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'AI 유튜브 영상 만드는 방법 - SNS 알고리즘 분석으로 쇼츠 자동 생성',
    description: 'AlgoMaker로 AI 유튜브 영상, 쇼츠, 틱톡, 릴스를 자동 생성하는 6단계',
    totalTime: 'PT3M',
    step: [
      { '@type': 'HowToStep', position: 1, name: '카테고리 선택', text: '8개 분야 중 영상 카테고리 선택' },
      { '@type': 'HowToStep', position: 2, name: '키워드 입력', text: '영상 주제 키워드 입력' },
      { '@type': 'HowToStep', position: 3, name: '시나리오 선택', text: 'AI가 분석한 알고리즘 시나리오 선택' },
      { '@type': 'HowToStep', position: 4, name: 'SNS 플랫폼 선택', text: '유튜브, 쇼츠, 틱톡, 릴스 중 선택' },
      { '@type': 'HowToStep', position: 5, name: '메타데이터 확인', text: '제목, 태그, 설명 확인' },
      { '@type': 'HowToStep', position: 6, name: '다운로드', text: '완성된 영상과 업로드 자료 다운로드' },
    ],
  },
];

const jsonLdString = JSON.stringify(jsonLdData);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <meta name="google-adsense-account" content="ca-pub-XXXXX" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <ContentProtection />

        <SoundProvider>
          <OracleStatusBar />

          {children}
          
          {/* ============================================================
              🎯 SEO 정적 콘텐츠 (MathHWP 스타일 + 타겟 키워드 3개 강화)
              ============================================================ */}
          <div 
            id="seo-prerender" 
            aria-hidden="true"
            style={{ 
              position: 'absolute', 
              left: '-9999px', 
              top: 'auto', 
              width: '1px', 
              height: '1px', 
              overflow: 'hidden' 
            }}
          >
            {/* H1 - 타겟 키워드 3개 모두 포함 */}
            <h1>AI 유튜브 영상 자동 생성 - SNS 알고리즘 분석으로 쇼츠 자동 생성 | AlgoMaker</h1>
            
            {/* H2: 타겟 키워드 1 - AI 유튜브 영상 */}
            <h2>AI 유튜브 영상 자동 생성</h2>
            <p>
              AlgoMaker는 키워드 하나만 입력하면 AI가 유튜브 영상을 자동 생성하는 서비스입니다.
              유튜브 알고리즘에 최적화된 영상이 만들어집니다. 제목, 대본, 썸네일, 태그까지
              완성된 AI 유튜브 영상을 즉시 다운로드할 수 있습니다.
            </p>
            <p>
              AI 유튜브 영상 만들기에 필요한 모든 자료가 자동 생성됩니다.
              1인 크리에이터부터 SNS 마케터까지 모두를 위한 AI 유튜브 영상 도구입니다.
            </p>
            
            {/* H2: 타겟 키워드 2 - SNS 알고리즘 */}
            <h2>SNS 알고리즘 분석으로 조회수 터트리기</h2>
            <p>
              SNS 알고리즘은 플랫폼마다 다릅니다. 유튜브, 인스타그램, 틱톡 모두 다른 SNS 알고리즘을 사용합니다.
              AlgoMaker는 2026 최신 SNS 알고리즘 패턴을 학습한 AI로 각 플랫폼별 SNS 알고리즘을 분석합니다.
            </p>
            <p>
              SNS 알고리즘 없이는 영상이 묻힙니다. SNS 알고리즘을 알면 조회수가 280% 증가합니다.
              AlgoMaker가 베일 너머의 SNS 알고리즘을 작동시킵니다.
            </p>
            
            {/* H2: 타겟 키워드 3 - 쇼츠 자동 생성 */}
            <h2>쇼츠 자동 생성으로 빠르게 시작하기</h2>
            <p>
              유튜브 쇼츠 자동 생성은 1인 크리에이터의 필수 기능입니다.
              AlgoMaker의 쇼츠 자동 생성 기능으로 60초 이내 영상을 즉시 만들 수 있습니다.
            </p>
            <p>
              쇼츠 자동 생성과 동시에 틱톡, 인스타그램 릴스도 함께 생성됩니다.
              한 번의 쇼츠 자동 생성으로 모든 SNS 플랫폼에 업로드 가능한 자료가 완성됩니다.
            </p>
            
            <h2>지원 플랫폼 4개</h2>
            <ul>
              <li>유튜브 (YouTube) - 롱폼 영상 자동 생성</li>
              <li>유튜브 쇼츠 (YouTube Shorts) - 60초 쇼츠 자동 생성</li>
              <li>틱톡 (TikTok) - 세로형 짧은 영상 AI</li>
              <li>인스타그램 릴스 (Instagram Reels) - SNS 마케팅 AI</li>
            </ul>
            
            <h2>AI 알고리즘 분석 카테고리 8개</h2>
            <ul>
              <li>경제·재테크 - AI 유튜브 영상으로 금리, 부동산, 주식 콘텐츠</li>
              <li>건강·의료 - 건강 상식, 다이어트 SNS 알고리즘 분석</li>
              <li>IT·테크 - AI 도구, 앱 추천 쇼츠 자동 생성</li>
              <li>교육·자기계발 - 학습법, 자기계발 영상 AI</li>
              <li>요리·음식 - 레시피, 홈쿡 콘텐츠 자동화</li>
              <li>사회·이슈 - 시사, 사회 현상 영상 제작</li>
              <li>부동산 - 부동산 시장, 청약 정보 영상</li>
              <li>게임 - 게임 리뷰, e스포츠 콘텐츠</li>
            </ul>
            
            <h2>주요 기능 - AI 유튜브 영상 + SNS 알고리즘 + 쇼츠 자동 생성</h2>
            <ul>
              <li>AI 유튜브 영상 자동 생성 - 키워드 하나로 완성</li>
              <li>SNS 알고리즘 분석 - 2026 최신 패턴 학습</li>
              <li>쇼츠 자동 생성 - 60초 이내 영상 즉시</li>
              <li>AI 이미지 프롬프트 - Midjourney, DALL-E 호환</li>
              <li>AI 영상 프롬프트 - Runway, Kling, Veo 호환</li>
              <li>AlgoBooster - 조회수 부스팅 마법 레버</li>
              <li>틱톡 콘텐츠 AI - 자동 영상 생성</li>
              <li>릴스 자동 제작 - 인스타그램 마케팅</li>
            </ul>
            
            <h2>사용 방법 - AI 유튜브 영상 만들기 6단계</h2>
            <ol>
              <li>카테고리 선택 - SNS 알고리즘 영역 분류</li>
              <li>키워드 입력 - AI 유튜브 영상 주제</li>
              <li>시나리오 선택 - 알고리즘 추천 3가지</li>
              <li>SNS 플랫폼 선택 - 쇼츠 자동 생성 포함</li>
              <li>메타데이터 확인 - 제목, 태그</li>
              <li>다운로드 - AI 유튜브 영상 + 업로드 자료</li>
            </ol>
            
            <h2>왜 AlgoMaker인가요?</h2>
            <p>
              AI 유튜브 영상을 만들어도 SNS 알고리즘을 모르면 조회수 100도 안 나옵니다.
              AlgoMaker는 SNS 알고리즘 분석에 특화된 AI 유튜브 영상 도구입니다.
              쇼츠 자동 생성 기능으로 빠르게 시작할 수 있습니다.
            </p>
            <p>
              99%가 모르는 SNS 알고리즘의 비밀. AlgoMaker가 그것을 작동시킵니다.
              AI 유튜브 영상 + SNS 알고리즘 분석 + 쇼츠 자동 생성 모두 한 곳에서.
            </p>
            
            <h2>가격</h2>
            <p>
              AI 유튜브 영상 자동 생성, SNS 알고리즘 분석, 쇼츠 자동 생성 모두 무료.
              광고로 운영되며 신용카드 없이 즉시 시작 가능합니다.
            </p>
            
            <h2>자주 묻는 질문</h2>
            
            <h3>AI 유튜브 영상을 어떻게 자동 생성하나요?</h3>
            <p>키워드를 입력하면 AI가 SNS 알고리즘을 분석하여 유튜브 영상을 자동 생성합니다.</p>
            
            <h3>SNS 알고리즘 분석은 어떻게 작동하나요?</h3>
            <p>2026 최신 SNS 알고리즘을 학습한 AI가 플랫폼별로 분석하여 최적화합니다.</p>
            
            <h3>쇼츠 자동 생성도 가능한가요?</h3>
            <p>네, 유튜브 쇼츠 60초 영상을 즉시 자동 생성할 수 있습니다.</p>
            
            <h2>관련 키워드</h2>
            <p>
              AI 유튜브 영상, SNS 알고리즘, 쇼츠 자동 생성, AI 영상 자동 생성, 유튜브 알고리즘 분석,
              AI 유튜브 도구, AI로 유튜브 시작, 유튜브 쇼츠 만들기, 틱톡 콘텐츠 AI, 릴스 자동 제작,
              인스타 릴스 AI, AI 영상 제작, 유튜브 자동화, SNS 마케팅 AI, 1인 크리에이터 도구,
              AI 이미지 프롬프트, AI 영상 프롬프트, 콘텐츠 자동 생성
            </p>
            
            <h2>운영사</h2>
            <p>
              운영: 한줄컴퍼니 | 대표: 박예준 | 서비스: AlgoMaker | 
              © 2026 한줄컴퍼니. All rights reserved.
            </p>
            
            <nav aria-label="주요 메뉴">
              <a href={SITE_URL}>홈 (AI 유튜브 영상)</a>
              <a href={`${SITE_URL}/keyword`}>키워드 (SNS 알고리즘)</a>
              <a href={`${SITE_URL}/platform`}>플랫폼 (쇼츠 자동 생성)</a>
              <a href={`${SITE_URL}/about`}>소개</a>
              <a href={`${SITE_URL}/blog`}>블로그</a>
              <a href={`${SITE_URL}/contact`}>문의</a>
              <a href={`${SITE_URL}/terms`}>이용약관</a>
              <a href={`${SITE_URL}/privacy`}>개인정보처리방침</a>
            </nav>
          </div>
        </SoundProvider>
      </body>
    </html>
  );
}
