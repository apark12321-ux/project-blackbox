'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';
import { GuideMetadata } from '../../_shared/GuideMetadata';

/**
 * 가이드 3편: 유튜브 수익 창출 조건 (2026년 기준)
 * 경로: /app/blog/youtube-monetization/page.tsx
 * AdSense 안전: 가짜 데이터 0, 외부 브랜드명 0, 오리지널 콘텐츠
 */
export default function YouTubeMonetizationGuide() {
  return (
    <V18Shell>
      <GuideMetadata
        slug="youtube-monetization"
        title="유튜브 채널 수익화 완전 정복"
        subtitle="광고 수익부터 협찬·멤버십까지 다양한 수익 모델"
        description="광고 수익부터 협찬·멤버십까지 다양한 수익 모델"
        category="알고리즘"
        publishedAt="2026-04-28"
        readTime="8분"
      />

      <style jsx>{`
        .guide {
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          line-height: 1.75;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .guide { padding: 18px 16px 50px; }
        }
        .guide-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-h1 { font-size: 26px; }
        }
        .guide-subtitle {
          font-size: 15px;
          color: #525252;
          margin: 0 0 24px;
          line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex;
          gap: 12px;
          font-size: 14px;
          color: #737373;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 36px 0 14px;
          padding-top: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h2 { font-size: 21px; margin: 28px 0 12px; }
        }
        .guide h3 {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.015em;
          margin: 24px 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h3 { font-size: 17.5px; }
        }
        .guide p {
          font-size: 18px;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide p { font-size: 17px; }
        }
        .guide ul, .guide ol {
          padding-left: 22px;
          margin: 8px 0 18px;
        }
        .guide li {
          font-size: 18px;
          margin-bottom: 8px;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide li { font-size: 17px; }
        }
        .guide-callout {
          padding: 14px 16px;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          margin: 16px 0;
          font-size: 17px;
          line-height: 1.6;
          color: #78350f;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-callout { font-size: 13.5px; padding: 12px 14px; }
        }
        .guide-condition-box {
          padding: 16px 18px;
          background: #f0fdf4;
          border: 1px solid #86efac;
          margin: 18px 0;
        }
        .guide-condition-title {
          font-size: 13px;
          font-weight: 700;
          color: #166534;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .guide-cta {
          margin-top: 36px;
          padding: 20px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          text-align: center;
        }
        .guide-cta-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #0a0a0a;
        }
        .guide-cta-desc {
          font-size: 15.5px;
          color: #525252;
          margin: 0 0 14px;
          line-height: 1.55;
        }
        .guide-cta-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #0a0a0a;
          color: #ffffff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .guide-cta-btn:hover {
          background: #c2410c;
        }
        .guide-related {
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid #e5e5e5;
        }
        .guide-related-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #737373;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .guide-related-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .guide-related-item {
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          font-size: 14px;
          color: #0a0a0a;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: background 0.15s;
        }
        .guide-related-item:hover {
          background: #fafafa;
        }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 수익 가이드 · 수익 창출</div>
        <h1 className="guide-h1">유튜브 수익 창출 조건 완벽 정리</h1>
        <p className="guide-subtitle">
          유튜브 파트너 프로그램(YPP) 가입 조건, 수익 종류, 첫 수익까지 걸리는 시간을
          현실적으로 정리했습니다.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 4월</span>
          <span>·</span><span>·</span>
          <span>💰 수익</span>
        </div>

        <p>
          유튜브로 돈을 벌 수 있다는 건 다들 들어봤을 겁니다.
          하지만 정확히 어떤 조건을 채워야 하는지, 처음부터 얼마나 걸리는지
          모르시는 분이 많습니다. 이 글에서 정확하게 정리합니다.
        </p>

        <h2>1. 유튜브 파트너 프로그램(YPP)이 무엇인가요?</h2>

        <p>
          유튜브 파트너 프로그램(YouTube Partner Program, 줄여서 YPP)은
          유튜브가 크리에이터에게 수익을 분배해주는 공식 프로그램입니다.
          쉽게 말해 "광고로 돈 받는 자격"이라고 보시면 됩니다.
        </p>

        <p>
          이 프로그램에 가입하지 않으면 영상에 광고가 붙어도
          크리에이터에게 돈이 가지 않습니다.
        </p>

        <h2>2. YPP 가입 조건 (2026년 기준)</h2>

        <p>
          YPP 가입에는 두 가지 단계가 있습니다.
          1단계는 일부 수익(예: 채널 멤버십, 슈퍼 챗)만 가능하고,
          2단계가 진짜 광고 수익이 가능한 단계입니다.
        </p>

        <div className="guide-condition-box">
          <div className="guide-condition-title">▍ 1단계 조건 (제한적 수익)</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>구독자 500명 이상</li>
            <li>최근 90일 내 영상 3편 이상 업로드</li>
            <li>다음 중 하나: 시청 시간 3,000시간 또는 쇼츠 조회수 300만 이상</li>
            <li>커뮤니티 가이드 위반 사항 없음</li>
            <li>2단계 인증 활성화된 구글 계정</li>
          </ul>
        </div>

        <div className="guide-condition-box">
          <div className="guide-condition-title">▍ 2단계 조건 (광고 수익)</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>구독자 1,000명 이상</li>
            <li>다음 중 하나:
              <ul style={{ marginTop: 4 }}>
                <li>최근 12개월 시청 시간 4,000시간</li>
                <li>최근 90일 쇼츠 조회수 1,000만</li>
              </ul>
            </li>
            <li>커뮤니티 가이드 위반 사항 없음</li>
            <li>주거 국가에서 YPP 사용 가능</li>
          </ul>
        </div>

        <h2>3. 시청 시간 4,000시간이 얼마나 어려운가요?</h2>

        <p>
          많은 분이 "4,000시간이 너무 많다"고 느끼시는데
          실제 계산해보면 그렇게 어렵지 않습니다.
        </p>

        <p>예시:</p>

        <ul>
          <li>10분 영상 1편 × 1,000명이 봄 = 약 100시간</li>
          <li>10분 영상 40편 × 1,000명 = 4,000시간</li>
          <li>또는 인기 영상 1편이 4만 회 시청되면 4,000시간 가능</li>
        </ul>

        <p>
          매주 1편씩 1년 꾸준히 올리시고 영상 품질이 안정되면
          1년~1년 6개월 사이에 도달하는 게 일반적입니다.
        </p>

        <h2>4. 쇼츠로 수익 창출하기</h2>

        <p>
          긴 영상이 어려우신 분은 쇼츠(60초 이하)로도 가능합니다.
          쇼츠 조회수 1,000만이 조건인데, 쇼츠 한 편이 잘 터지면
          한 번에 100만~500만이 나오기도 해서 의외로 빠를 수 있습니다.
        </p>

        <h3>쇼츠 수익은 일반 영상보다 적습니다</h3>

        <p>
          쇼츠는 광고가 영상에 직접 붙는 게 아니라
          쇼츠 피드 광고 수익을 분배하는 방식입니다.
          그래서 일반 영상보다 조회수당 수익이 적습니다.
        </p>

        <p>
          긴 영상과 쇼츠를 함께 운영하시는 게 가장 좋은 전략입니다.
          쇼츠로 채널을 빨리 키우고, 긴 영상으로 수익을 늘리는 방식.
        </p>

        <h2>5. 수익 종류 (광고만 있는 게 아닙니다)</h2>

        <h3>광고 수익</h3>
        <p>
          영상 앞·중간·뒤에 붙는 광고에서 발생하는 수익입니다.
          전체 광고비의 55%를 크리에이터가 가져갑니다.
        </p>

        <h3>채널 멤버십</h3>
        <p>
          시청자가 매월 일정 금액을 내고 채널 멤버가 되는 방식입니다.
          멤버 전용 영상, 이모지, 뱃지 같은 혜택을 줄 수 있습니다.
        </p>

        <h3>슈퍼 챗 / 슈퍼 땡스</h3>
        <p>
          라이브 방송이나 일반 영상에 시청자가 후원하는 방식입니다.
          후원하면 댓글이 강조되어 표시됩니다.
        </p>

        <h3>쇼핑 / 협찬</h3>
        <p>
          제품을 영상에 소개하고 받는 광고 수익입니다.
          이건 유튜브가 아니라 광고주와 직접 거래하는 방식입니다.
          채널이 어느 정도 자라면 광고 제안이 들어옵니다.
        </p>

        <h2>6. 평균 수익 (현실적인 숫자)</h2>

        <p>
          한국 채널 기준 광고 수익은 영상 조회수 1,000회당
          1,000원~5,000원 정도입니다. (CPM이라고 부릅니다)
          분야에 따라 차이가 큽니다.
        </p>

        <ul>
          <li>금융, 부동산, 보험 같은 분야: 높은 단가</li>
          <li>일상, 일반 정보: 중간 단가</li>
          <li>음악, 게임: 낮은 단가</li>
        </ul>

        <p>
          예를 들어 매월 100만 조회수가 나오는 채널이면
          월 100만~500만원 수익이 가능합니다.
          (다만 처음 1년은 거의 수익이 없습니다.)
        </p>

        <h2>7. 첫 수익까지 걸리는 시간</h2>

        <p>
          매주 1편 꾸준히 올리시는 분 기준으로:
        </p>

        <ul>
          <li>1단계 (멤버십 가능): 6개월~1년</li>
          <li>2단계 (광고 수익): 1년~1년 6개월</li>
          <li>월 100만원 수익: 2년~3년</li>
        </ul>

        <p>
          물론 영상 한 편이 크게 터지면 이 기간은 크게 단축됩니다.
        </p>

        <div className="guide-callout">
          💡 처음부터 수익만 보고 시작하시면 지치기 쉽습니다.
          "내가 즐겁게 만들 수 있는 주제"를 우선 정하시고,
          꾸준히 하다 보면 수익은 자연스럽게 따라옵니다.
        </div>

        <h2>8. 자주 묻는 질문</h2>

        <h3>한국에서 유튜브 수익은 어떻게 받나요?</h3>
        <p>
          유튜브가 매월 21일경에 수익을 정산하고,
          한국 은행 계좌로 송금됩니다. 최소 100달러 이상 모여야 송금됩니다.
        </p>

        <h3>세금은 어떻게 내나요?</h3>
        <p>
          유튜브 수익은 사업소득으로 분류되어 종합소득세 대상입니다.
          매년 5월에 신고하시면 됩니다. 일정 금액 이상이면 사업자 등록도 필요합니다.
          정확한 건 세무사와 상담하세요.
        </p>

        <h3>여러 채널 운영해도 되나요?</h3>
        <p>
          네. 한 구글 계정으로 여러 채널을 만들 수 있습니다.
          각 채널마다 별도로 YPP 가입해야 합니다.
        </p>


        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/revenue-calc" style={{ color: "#c2410c" }}>광고 수익 계산법</Link></li>
            <li><Link href="/blog/first-100-subs" style={{ color: "#c2410c" }}>첫 100명 구독자</Link></li>
            <li><Link href="/blog/algorithm-seo" style={{ color: "#c2410c" }}>SEO 전략</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
