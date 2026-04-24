/**
 * 📘 About 페이지 (서버 컴포넌트)
 *
 * SEO Prerender 적용 - view-source에 모든 콘텐츠 노출
 */

import type { Metadata } from 'next';
import Script from 'next/script';
import AboutClient from './AboutClient';
import { generateBreadcrumbJsonLd } from '../_shared/SEO';

export const metadata: Metadata = {
  title: 'AlgoMaker 소개 - AI 유튜브 영상 자동 생성 서비스',
  description: 'AlgoMaker는 한줄컴퍼니가 운영하는 AI 기반 유튜브 영상 제작 도구입니다. 8개 카테고리 지원, 멀티 플랫폼 대응, 한글+영문 이미지 프롬프트 제공.',
  alternates: {
    canonical: 'https://nutube.kr/about',
  },
  openGraph: {
    title: 'AlgoMaker 소개 - AI가 만드는 유튜브 영상',
    description: '한줄컴퍼니가 운영하는 AI 기반 크리에이터 도구',
    url: 'https://nutube.kr/about',
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'AlgoMaker 소개',
  description: 'AlgoMaker는 한줄컴퍼니가 운영하는 AI 기반 유튜브 영상 자동 생성 서비스입니다.',
  url: 'https://nutube.kr/about',
  publisher: {
    '@type': 'Organization',
    name: '한줄컴퍼니',
    url: 'https://nutube.kr',
  },
};

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: '홈', url: 'https://nutube.kr' },
  { name: 'AlgoMaker 소개', url: 'https://nutube.kr/about' },
]);

export default function AboutPage() {
  return (
    <>
      <Script
        id="ld-about"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Script
        id="ld-breadcrumb-about"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* SEO 정적 콘텐츠 (크롤러용) */}
      <section className="seo-static" aria-hidden="false" style={{ display: 'none' }}>
        <nav role="navigation" aria-label="주요 메뉴">
          <a href="https://nutube.kr">홈</a>
          <a href="https://nutube.kr/blog">노하우 블로그</a>
          <a href="https://nutube.kr/contact">문의하기</a>
        </nav>

        <section aria-labelledby="about-heading">
          <h1 id="about-heading">AlgoMaker 소개 — AI가 만드는 유튜브 영상</h1>
          <p>
            AlgoMaker는 한줄컴퍼니가 운영하는 AI 기반 유튜브 영상 자동 생성 서비스입니다.
            키워드만 입력하면 2026 유튜브 알고리즘에 최적화된 영상을 자동으로 만들어드립니다.
          </p>
        </section>

        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading">우리의 미션</h2>
          <p>
            혼자 영상을 만드는 크리에이터가 대기업 채널과도 경쟁할 수 있도록,
            AI로 영상 제작의 기술적 장벽을 없애는 것이 우리의 목표입니다.
          </p>
          <p>
            기획, 대본, 제목, 썸네일, 태그, 업로드 자료까지 모든 반복 작업을
            AI가 자동 처리합니다. 크리에이터는 본인만의 개성과 창의성에 집중할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading">AlgoMaker의 특징</h2>
          <ul>
            <li>
              <h3>8개 카테고리 전문화</h3>
              <p>경제, 건강, IT, 교육, 요리, 사회, 부동산, 게임 등 각 분야별 특화 AI</p>
            </li>
            <li>
              <h3>멀티 플랫폼 대응</h3>
              <p>유튜브 롱폼, 쇼츠, 틱톡, 인스타그램 릴스 모두 실제 업로드 화면 재현</p>
            </li>
            <li>
              <h3>한글+영문 이미지 프롬프트</h3>
              <p>Midjourney, DALL-E, Canva AI에서 바로 사용 가능한 프롬프트 자동 생성</p>
            </li>
            <li>
              <h3>AI 영상 프롬프트</h3>
              <p>Runway Gen-3, Kling AI, Luma, Sora에서 사용 가능한 시네마틱 프롬프트</p>
            </li>
            <li>
              <h3>Algo-Magic Booster</h3>
              <p>마법 레버 한 번으로 조회수 터지는 영상으로 자동 최적화</p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="company-heading">
          <h2 id="company-heading">운영 회사</h2>
          <p>
            AlgoMaker는 <strong>한줄컴퍼니</strong>가 운영합니다.
            한줄컴퍼니는 AI 기술로 크리에이터의 생산성을 극대화하는 도구를 만드는 회사입니다.
          </p>
          <p>대표: 박예준</p>
          <p>이메일: contact@nutube.kr</p>
          <p>
            <a href="https://nutube.kr/contact">문의하기 →</a>
          </p>
        </section>

        <section aria-labelledby="legal-heading">
          <h2 id="legal-heading">법적 고지</h2>
          <p>
            AlgoMaker는 YouTube, TikTok, Instagram의 공식 파트너가 아니며,
            각 플랫폼과 직접적인 관련이 없습니다. 도메인 nutube.kr은 본 서비스의
            접근 편의성을 위한 주소이며, YouTube의 상표를 침해하지 않습니다.
          </p>
          <p>
            YouTube는 Google LLC의 등록 상표이며, TikTok은 Bytedance Ltd.,
            Instagram은 Meta Platforms, Inc.의 등록 상표입니다.
          </p>
        </section>
      </section>

      <AboutClient />
    </>
  );
}
