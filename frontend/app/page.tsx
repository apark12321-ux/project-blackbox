/**
 * 🏠 홈 페이지 (서버 컴포넌트)
 *
 * MathHWP 스타일 SEO Prerender 적용
 * - view-source에 모든 콘텐츠 노출
 * - 크롤러가 JavaScript 없이도 내용 파악
 * - React 하이드레이션 후 실제 인터랙티브 UI 표시
 */

import type { Metadata } from 'next';
import Script from 'next/script';
import HomeClient from './HomeClient';
import { generateHowToJsonLd, generateFAQJsonLd } from './_shared/SEO';

// ============================================================
// 페이지별 Metadata (서버 컴포넌트만 가능)
// ============================================================
export const metadata: Metadata = {
  title: 'AlgoMaker — AI가 만드는 유튜브 영상, 쇼츠·틱톡·릴스까지 한 번에',
  description: '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다. 제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에. 무료 시작, 신용카드 불필요.',
  alternates: {
    canonical: 'https://nutube.kr',
  },
  openGraph: {
    title: 'AlgoMaker — AI가 만드는 유튜브 영상',
    description: '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성',
    url: 'https://nutube.kr',
    type: 'website',
  },
};

// ============================================================
// JSON-LD 구조화 데이터
// ============================================================
const howToJsonLd = generateHowToJsonLd({
  name: 'AlgoMaker로 AI 유튜브 영상 만드는 방법',
  description: '키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다',
  steps: [
    { name: '카테고리 선택', text: '경제, 건강, IT 등 8개 카테고리 중 하나를 선택합니다' },
    { name: '키워드 입력', text: '영상 주제가 될 키워드를 입력합니다' },
    { name: '시나리오 선택', text: 'AI가 추천하는 3가지 시나리오 중 하나를 선택합니다' },
    { name: 'SNS 플랫폼 선택', text: '유튜브, 쇼츠, 틱톡, 릴스 중 업로드할 플랫폼을 선택합니다' },
    { name: '메타데이터 확인', text: 'AI가 생성한 제목·설명·태그를 확인합니다' },
    { name: '영상 생성 및 다운로드', text: '완성된 영상과 SNS 업로드 자료를 다운로드합니다' },
  ],
});

const faqJsonLd = generateFAQJsonLd([
  {
    question: 'AlgoMaker는 어떤 서비스인가요?',
    answer: 'AlgoMaker는 키워드만 입력하면 AI가 유튜브 알고리즘에 최적화된 영상을 자동으로 만들어주는 서비스입니다. 쇼츠·틱톡·릴스 업로드 자료까지 한 번에 생성됩니다.',
  },
  {
    question: '사용 요금이 어떻게 되나요?',
    answer: '기본 기능은 무료로 제공되며, 광고로 운영됩니다. 신용카드 없이 바로 시작할 수 있습니다.',
  },
  {
    question: '어떤 플랫폼에 업로드할 수 있나요?',
    answer: '유튜브 롱폼, 유튜브 쇼츠, 틱톡, 인스타그램 릴스 4개 플랫폼을 지원합니다. 각 플랫폼의 실제 업로드 화면을 그대로 재현해서 복사-붙여넣기만 하면 업로드가 완료됩니다.',
  },
  {
    question: 'AI 이미지 프롬프트도 제공되나요?',
    answer: '네, 영상 시나리오에 맞는 이미지와 영상 프롬프트를 한글 설명과 영문 디테일로 함께 제공합니다. Midjourney, DALL-E, Runway 등의 AI 툴에서 바로 사용 가능합니다.',
  },
  {
    question: '어떤 카테고리를 지원하나요?',
    answer: '경제·재테크, 건강·의료, IT·테크, 교육·자기계발, 요리·음식, 사회·이슈, 부동산, 게임 등 8가지 카테고리를 지원합니다.',
  },
]);

// ============================================================
// 페이지 컴포넌트
// ============================================================
export default function HomePage() {
  return (
    <>
      {/* ============================================================
          JSON-LD 구조화 데이터 (Google 리치 스니펫용)
          ============================================================ */}
      <Script
        id="ld-howto-home"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Script
        id="ld-faq-home"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ============================================================
          SEO 정적 콘텐츠 (MathHWP 스타일)
          - view-source에 전체 노출됨
          - 크롤러가 JavaScript 없이 읽을 수 있음
          - React 마운트 후 HomeClient로 교체됨
          ============================================================ */}
      <section className="seo-static" aria-hidden="false" style={{ display: 'none' }}>
        <nav role="navigation" aria-label="주요 메뉴">
          <span>AlgoMaker</span>
          <a href="https://nutube.kr/about">소개</a>
          <a href="https://nutube.kr/blog">노하우 블로그</a>
          <a href="https://nutube.kr/contact">문의하기</a>
        </nav>

        <section aria-labelledby="hero-heading">
          <p>AI × 유튜브 알고리즘</p>
          <h1 id="hero-heading">
            AI가 만드는 유튜브 영상 — 쇼츠·틱톡·릴스까지 한 번에
          </h1>
          <p>
            키워드만 입력하면 AI가 유튜브 알고리즘에 맞는 영상을 자동 생성합니다.
            제목·대본·썸네일·태그 완성, 쇼츠·틱톡·릴스 업로드 자료까지 한 번에.
          </p>
          <p>무료 시작 · 신용카드 불필요 · 한국어 최적화</p>
          <a href="/">지금 시작하기</a>
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
          <p>주요 기능</p>
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
              <p>Midjourney, DALL-E, Canva 등에서 바로 사용 가능한 한글+영문 프롬프트 자동 생성.</p>
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
          <p>사용 방법</p>
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
              <p>AI가 생성한 제목·설명·태그를 확인하고 자동 생성을 시작합니다.</p>
            </li>
            <li>
              <strong>6단계</strong>
              <h3>다운로드</h3>
              <p>완성된 영상과 SNS 업로드 자료를 다운로드해 바로 업로드합니다.</p>
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
              <p>기본 기능은 무료로 제공되며, 광고로 운영됩니다. 신용카드 없이 바로 시작할 수 있습니다.</p>
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
          <a href="/">무료로 시작하기</a>
        </section>

        <footer role="contentinfo">
          <p>
            <a href="https://nutube.kr/terms">이용약관</a>
            {' | '}
            <a href="https://nutube.kr/privacy">개인정보처리방침</a>
            {' | '}
            <a href="https://nutube.kr/contact">문의하기</a>
          </p>
          <p>운영: 한줄컴퍼니 | 대표: 박예준</p>
          <p>© 2026 한줄컴퍼니. All rights reserved.</p>
        </footer>
      </section>

      {/* ============================================================
          실제 인터랙티브 UI (HomeClient)
          React가 마운트되면 이것만 표시됨
          ============================================================ */}
      <HomeClient />
    </>
  );
}
