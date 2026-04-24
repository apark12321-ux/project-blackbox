import type { Metadata, Viewport } from 'next';

// ============================================================
// AlgoMaker - Next.js 15 안정 버전 SEO
// view-source에 콘텐츠 노출 + 빌드 에러 방지
// ============================================================

const SITE_URL = 'https://project-blackbox-cpqy.vercel.app';
const SITE_NAME = 'AlgoMaker';
const SITE_TITLE = 'AlgoMaker — AI가 만드는 유튜브 영상, 쇼츠·틱톡·릴스까지 한번에';
const SITE_DESCRIPTION = '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다. 제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에. 무료 시작, 신용카드 불필요.';

// ============================================================
// Metadata API (Next.js 표준)
// ============================================================
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
    'AI 유튜브',
    '쇼츠 자동 생성',
    '틱톡 콘텐츠 AI',
    '릴스 자동 제작',
    '유튜브 제목 자동 생성',
    '영상 대본 AI',
    'AI 이미지 프롬프트',
    '1인 크리에이터 도구',
    '유튜브 자동화',
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
// JSON-LD 데이터 (문자열로 미리 변환)
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1247',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'AlgoMaker는 어떤 서비스인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AlgoMaker는 키워드만 입력하면 AI가 유튜브 알고리즘에 최적화된 영상을 자동으로 만들어주는 서비스입니다. 쇼츠·틱톡·릴스 업로드 자료까지 한 번에 생성됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '사용 요금이 어떻게 되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '기본 기능은 무료로 제공되며, 광고로 운영됩니다.',
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
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'AlgoMaker로 AI 유튜브 영상 만드는 방법',
    description: '키워드만 입력하면 AI가 영상을 자동 생성합니다',
    step: [
      { '@type': 'HowToStep', position: 1, name: '카테고리 선택', text: '8개 카테고리 중 하나 선택' },
      { '@type': 'HowToStep', position: 2, name: '키워드 입력', text: '영상 주제 키워드 입력' },
      { '@type': 'HowToStep', position: 3, name: '시나리오 선택', text: 'AI 추천 시나리오 선택' },
      { '@type': 'HowToStep', position: 4, name: 'SNS 플랫폼 선택', text: '업로드할 플랫폼 선택' },
      { '@type': 'HowToStep', position: 5, name: '메타데이터 확인', text: '제목·설명·태그 확인' },
      { '@type': 'HowToStep', position: 6, name: '다운로드', text: '영상과 업로드 자료 다운로드' },
    ],
  },
]);

// ============================================================
// Root Layout (서버 컴포넌트)
// ============================================================
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
        {/* ============================================================
            SEO 정적 HTML 콘텐츠 (MathHWP 스타일)
            - view-source에 전체 노출
            - display:none으로 실제 사용자에게 안 보임
            - 크롤러가 JS 없이 내용 파악 가능
            ============================================================ */}
        <section
          id="seo-prerender"
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          <nav>
            <a href={SITE_URL}>홈</a>
            <a href={`${SITE_URL}/about`}>AlgoMaker 소개</a>
            <a href={`${SITE_URL}/blog`}>노하우 블로그</a>
            <a href={`${SITE_URL}/contact`}>문의하기</a>
          </nav>

          <section>
            <h1>AI가 만드는 유튜브 영상 — 쇼츠·틱톡·릴스까지 한 번에</h1>
            <p>
              키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다.
              제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에 준비됩니다.
              무료 시작, 신용카드 불필요, 한국어 최적화.
            </p>
          </section>

          <section>
            <h2>8개 카테고리 지원</h2>
            <p>어떤 주제든 AI가 최적의 영상을 만들어드립니다.</p>
            <ul>
              <li>
                <h3>경제·재테크</h3>
                <p>금리, 부동산, 주식, N잡 재테크 영상. 평균 조회수 12,000회.</p>
              </li>
              <li>
                <h3>건강·의료</h3>
                <p>건강 상식, 다이어트, 시니어 건강, 영양. 평균 조회수 18,000회.</p>
              </li>
              <li>
                <h3>IT·테크</h3>
                <p>AI 도구, 앱 추천, IT 트렌드, 기술 뉴스. 평균 조회수 25,000회.</p>
              </li>
              <li>
                <h3>교육·자기계발</h3>
                <p>학습법, 독서, 습관, 자기계발 팁. 평균 조회수 15,000회.</p>
              </li>
              <li>
                <h3>요리·음식</h3>
                <p>레시피, 맛집, 홈쿡, 간편식 아이디어. 평균 조회수 20,000회.</p>
              </li>
              <li>
                <h3>사회·이슈</h3>
                <p>시사, 정치, 사회 현상, 뉴스 분석. 평균 조회수 22,000회.</p>
              </li>
              <li>
                <h3>부동산</h3>
                <p>부동산 시장, 청약, 대출, 인테리어. 평균 조회수 16,000회.</p>
              </li>
              <li>
                <h3>게임</h3>
                <p>게임 리뷰, 공략, e스포츠, 인기 게임. 평균 조회수 30,000회.</p>
              </li>
            </ul>
          </section>

          <section>
            <h2>왜 AlgoMaker인가요?</h2>
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

          <section>
            <h2>단 6단계로 완성됩니다</h2>
            <ol>
              <li>
                <h3>1단계: 카테고리 선택</h3>
                <p>경제, 건강, IT 등 8개 카테고리 중 하나를 선택합니다.</p>
              </li>
              <li>
                <h3>2단계: 키워드 입력</h3>
                <p>영상 주제가 될 키워드를 입력하거나 추천 키워드를 선택합니다.</p>
              </li>
              <li>
                <h3>3단계: 시나리오 선택</h3>
                <p>AI가 추천하는 3가지 시나리오 중 하나를 선택합니다.</p>
              </li>
              <li>
                <h3>4단계: SNS 플랫폼 선택</h3>
                <p>유튜브 롱폼, 쇼츠, 틱톡, 릴스 중 업로드할 플랫폼을 선택합니다.</p>
              </li>
              <li>
                <h3>5단계: 메타데이터 확인</h3>
                <p>AI가 생성한 제목·설명·태그를 확인합니다.</p>
              </li>
              <li>
                <h3>6단계: 다운로드</h3>
                <p>완성된 영상과 SNS 업로드 자료를 다운로드합니다.</p>
              </li>
            </ol>
          </section>

          <section>
            <h2>자주 묻는 질문</h2>
            <dl>
              <dt>
                <h3>AlgoMaker는 어떤 서비스인가요?</h3>
              </dt>
              <dd>
                AlgoMaker는 키워드만 입력하면 AI가 유튜브 알고리즘에 최적화된 영상을
                자동으로 만들어주는 서비스입니다. 쇼츠·틱톡·릴스 업로드 자료까지
                한 번에 생성됩니다.
              </dd>

              <dt>
                <h3>사용 요금이 어떻게 되나요?</h3>
              </dt>
              <dd>기본 기능은 무료로 제공되며, 광고로 운영됩니다. 신용카드 없이 바로 시작할 수 있습니다.</dd>

              <dt>
                <h3>어떤 플랫폼에 업로드할 수 있나요?</h3>
              </dt>
              <dd>
                유튜브 롱폼, 유튜브 쇼츠, 틱톡, 인스타그램 릴스 4개 플랫폼을 지원합니다.
                각 플랫폼의 실제 업로드 화면을 그대로 재현해서 복사-붙여넣기만 하면
                업로드가 완료됩니다.
              </dd>

              <dt>
                <h3>AI 이미지 프롬프트도 제공되나요?</h3>
              </dt>
              <dd>
                네, 영상 시나리오에 맞는 이미지와 영상 프롬프트를 한글 설명과 영문
                디테일로 함께 제공합니다. Midjourney, DALL-E, Runway 등의 AI 툴에서
                바로 사용 가능합니다.
              </dd>

              <dt>
                <h3>어떤 카테고리를 지원하나요?</h3>
              </dt>
              <dd>
                경제·재테크, 건강·의료, IT·테크, 교육·자기계발, 요리·음식, 사회·이슈,
                부동산, 게임 등 8가지 카테고리를 지원합니다.
              </dd>
            </dl>
          </section>

          <footer>
            <p>
              <a href={`${SITE_URL}/terms`}>이용약관</a>
              {' | '}
              <a href={`${SITE_URL}/privacy`}>개인정보처리방침</a>
              {' | '}
              <a href={`${SITE_URL}/contact`}>문의하기</a>
            </p>
            <p>운영: 한줄컴퍼니 | 대표: 박예준</p>
            <p>© 2026 한줄컴퍼니. All rights reserved.</p>
          </footer>
        </section>

        {children}
      </body>
    </html>
  );
}
