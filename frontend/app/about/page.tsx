'use client';

import Link from 'next/link';
import { V18Shell } from '../_shared/V18Shell';

export default function AboutPage() {
  return (
    <V18Shell>
      <div className="container">
        <article className="page">
          <h1 className="page-h1">AlgoMaker 소개</h1>
          <p className="page-lede">
            유튜브 채널 운영에 필요한 모든 노하우를 한 곳에 정리해드리는 무료 정보 사이트입니다.
          </p>

          <h2>사이트 운영 목적</h2>
          <p>
            AlgoMaker는 유튜브를 처음 시작하시는 분들, 또는 채널이 잘 성장하지 않아 고민이신 분들을
            위해 만들어진 정보 사이트입니다. 알고리즘, 시니어 사연 쇼츠, AI 도구, 채널 수익화 등
            영상 채널 운영에 필요한 실전 노하우를 27편의 가이드로 정리해드립니다.
          </p>

          <p>
            특히 50대 이상 시니어 분들이 보시기 편하도록 큰 글씨와 단계별 설명으로 작성했습니다.
            모든 가이드는 무료이며 회원가입이 필요하지 않습니다.
          </p>

          <h2>다루는 4가지 주제</h2>

          <h3>1. 유튜브 알고리즘</h3>
          <p>
            구글 알고리즘이 영상을 추천하는 진짜 기준, SEO 전략, 시청 지속률 향상,
            치명적 실수 방어, 떡상 채널 패턴 분석까지. 박 실장 11공식을 기반으로
            검증된 알고리즘 노하우를 정리했습니다.
          </p>

          <h3>2. 시니어 사연 쇼츠</h3>
          <p>
            50~80대 시청자를 타겟으로 한 짧은 영상 콘텐츠 운영법. 진입 장벽이 낮고
            시청자 반응이 강한 시니어 사연 쇼츠 채널의 시작부터 정책 안전 운영까지
            5편의 시리즈로 다룹니다.
          </p>

          <h3>3. AI 도구 활용</h3>
          <p>
            클로드, ChatGPT, Sora, Midjourney 등 AI 도구를 영상 제작에 활용하는 방법.
            대본 작성, 썸네일 생성, 편집까지 AI를 도구로 활용하되 인간만의 차별점을
            놓치지 않는 균형 잡힌 가이드입니다.
          </p>

          <h3>4. 영상 채널 수익화</h3>
          <p>
            유튜브 광고 수익 계산법, 첫 100명 구독자 모으는 법, 6개월간 떡상이 안 와도
            버티는 멘탈 관리까지. 채널을 단기간이 아닌 장기적으로 키우는 실전 전략을 다룹니다.
          </p>

          <h2>자료 만들기 도구</h2>
          <p>
            가이드 글 외에도 영상 자료 (제목·시나리오·해시태그) 를 자동으로 만들어주는
            도구를 무료로 제공합니다. 키워드만 입력하시면 알고리즘 11공식이 자동 적용된
            결과물을 받으실 수 있습니다. <Link href="/publish" className="link">자료 만들기</Link>에서
            바로 사용하실 수 있습니다.
          </p>

          <h2>운영자</h2>
          <p>
            <strong>알고파트너스</strong> · 대표 박예준<br />
            이메일: apark12321@gmail.com
          </p>

          <p>
            궁금하신 점이 있으시거나 다뤘으면 하는 주제가 있으시면 언제든
            <Link href="/contact" className="link">문의하기</Link>를 통해 알려주세요.
            매주 새로운 가이드가 추가됩니다.
          </p>
        </article>
      </div>

      <style jsx>{`
        .page {
          padding: 48px 0 60px;
        }
        @media (max-width: 600px) {
          .page { padding: 32px 0 50px; }
        }

        .page-h1 {
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0 0 16px;
        }
        @media (max-width: 600px) {
          .page-h1 { font-size: 26px; }
        }

        .page-lede {
          font-size: 18px;
          color: #525252;
          line-height: 1.7;
          margin: 0 0 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e5e5;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .page-lede { font-size: 16px; }
        }

        .page h2 {
          font-size: 24px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin: 36px 0 14px;
        }
        @media (max-width: 600px) {
          .page h2 { font-size: 20px; margin: 28px 0 12px; }
        }

        .page h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 24px 0 10px;
        }

        .page p {
          font-size: 16.5px;
          line-height: 1.8;
          color: #1a1a1a;
          margin: 0 0 16px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .page p { font-size: 15.5px; }
        }

        .page strong {
          font-weight: 700;
        }

        .link {
          color: #c2410c;
          font-weight: 600;
          text-decoration: underline;
        }
        .link:hover { color: #1a1a1a; }
      `}</style>
    </V18Shell>
  );
}
