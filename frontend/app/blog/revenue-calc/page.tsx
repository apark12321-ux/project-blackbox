'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '유튜브 광고 수익 실수령액 계산법 — 통장에 얼마 들어오나',
  description: '유튜브 조회수 × 광고비 → 실수령액 계산. 세금, 환율, 수수료까지 모두 반영한 실전 가이드.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'AlgoMaker' },
  publisher: { '@type': 'Organization', name: 'AlgoMaker', url: 'https://nutube.kr' },
  inLanguage: 'ko',
};

export default function RevenueCalcGuide() {
  return (
    <V11Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <style jsx>{`
        .guide { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; font-family: 'Pretendard', -apple-system, system-ui, sans-serif; color: #0a0a0a; line-height: 1.65; letter-spacing: -0.01em; }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #c2410c; margin-bottom: 8px; text-transform: uppercase; }
        .guide-h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.3; margin: 0 0 12px; word-break: keep-all; }
        @media (max-width: 600px) { .guide-h1 { font-size: 22px; } }
        .guide-subtitle { font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6; word-break: keep-all; }
        .guide-meta { display: flex; gap: 12px; font-size: 12px; color: #737373; padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px; flex-wrap: wrap; }
        .guide h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h2 { font-size: 17px; margin: 28px 0 12px; } }
        .guide h3 { font-size: 17px; font-weight: 700; letter-spacing: -0.015em; margin: 24px 0 10px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h3 { font-size: 15.5px; } }
        .guide p { font-size: 15.5px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 14.5px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 15.5px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 14.5px; } }
        .guide-callout { padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24; margin: 16px 0; font-size: 14.5px; line-height: 1.6; color: #78350f; word-break: keep-all; }
        .guide-formula { padding: 16px 18px; background: #0a0a0a; color: #ffffff; margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace; font-size: 14px; line-height: 1.7; word-break: keep-all; }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta { margin-top: 36px; padding: 20px; background: #fafafa; border: 1px solid #e5e5e5; text-align: center; }
        .guide-cta-title { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 13.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn { display: inline-block; padding: 12px 24px; background: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; }
        .guide-cta-btn:hover { background: #c2410c; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 수익화 · 실전</div>
        <h1 className="guide-h1">유튜브 광고 수익 실수령액 계산법</h1>
        <p className="guide-subtitle">
          조회수 × 광고비 = 통장 입금액? 그렇지 않습니다. 세금·환율·수수료 모두 반영한
          실수령액 계산법과 분야별 RPM 차이.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span><span>·</span><span>⏱ 9분</span><span>·</span><span>💰 수익화</span>
        </div>

        <p>
          유튜브 시작하시면 가장 궁금한 게 "조회수 1만 회면 얼마 벌어?" 입니다.
          인터넷에 떠도는 답은 천차만별입니다. 실제 통장에 들어오는 돈은
          여러분이 생각하는 것보다 적습니다.
        </p>

        <p>
          정확한 계산법을 알려드립니다. 분야별 RPM (1,000회 조회당 수익) 까지
          포함된 실전 가이드입니다.
        </p>

        <h2>핵심 개념 3가지</h2>

        <h3>1. CPM (광고주가 내는 돈)</h3>

        <p>
          CPM 은 "1,000회 광고 노출당 광고주가 내는 돈" 입니다.
          한국 평균 약 2~5달러. 광고주가 본 비용이라 유튜버가 받는 돈은 아닙니다.
        </p>

        <h3>2. RPM (유튜버가 받는 돈)</h3>

        <p>
          RPM 은 "1,000회 영상 조회당 유튜버가 받는 돈" 입니다.
          이게 실제 유튜버 수익입니다. CPM 의 약 55% 정도입니다.
          (구글이 45% 가져감)
        </p>

        <h3>3. 조회수 vs 광고 노출</h3>

        <p>
          조회수가 1만이라고 광고가 1만 번 나오는 게 아닙니다. 광고가
          있는 영상에서만, 광고를 끝까지 본 시청자만 카운트됩니다.
        </p>

        <h2>분야별 RPM (실제 평균)</h2>

        <div className="guide-formula">
          <strong>높은 분야:</strong><br />
          금융·재테크:    $5~12 (약 6,500~16,000원)<br />
          IT·기술:        $4~10<br />
          비즈니스·마케팅: $4~10<br />
          교육·강의:      $3~8<br /><br />
          <strong>중간 분야:</strong><br />
          건강·운동:      $2~5<br />
          뷰티·패션:      $2~5<br />
          여행:           $2~5<br /><br />
          <strong>낮은 분야:</strong><br />
          게임·엔터테인먼트: $1~3<br />
          ASMR·음악:        $1~2<br />
          키즈:             $0.5~1.5
        </div>

        <p>
          금융·재테크 분야가 RPM 이 가장 높습니다. 50대 분들이 재테크 채널을
          많이 시작하시는 이유 중 하나입니다.
        </p>

        <h2>실수령액 계산 단계별 — 실전 예시</h2>

        <p>
          50대 재테크 채널, 한 달에 영상 4편, 영상당 평균 조회수 1만 회 가정.
        </p>

        <h3>1단계: 총 조회수</h3>

        <div className="guide-formula">
          한 달 조회수 = 영상 4편 × 1만 회 = <strong>40,000회</strong>
        </div>

        <h3>2단계: RPM 적용 (재테크 평균 $7)</h3>

        <div className="guide-formula">
          유튜브 수익 = 40,000회 × $7 ÷ 1,000<br />
          = 280달러<br />
          = 약 <strong>38만원</strong> (1달러 = 1,350원 가정)
        </div>

        <h3>3단계: 환율 변동 (-2~3%)</h3>

        <p>
          유튜브는 달러로 들어옵니다. 환전할 때 은행 수수료가 있고
          환율이 변동합니다. 약 -2~3% 손해.
        </p>

        <div className="guide-formula">
          환전 후 = 38만원 × 0.97 = 약 <strong>37만원</strong>
        </div>

        <h3>4단계: 사업소득 종합소득세</h3>

        <p>
          유튜브 수익은 사업소득으로 신고해야 합니다. 다른 소득과 합쳐 종합과세됩니다.
          50대 직장인이면 평균 약 15~24% 세율.
        </p>

        <div className="guide-formula">
          세율 20% 가정<br />
          세금 = 37만원 × 20% = 7.4만원<br />
          실수령 = 37만원 - 7.4만원 = 약 <strong>29.6만원</strong>
        </div>

        <h3>5단계: 4대 보험·건강보험 추가 (직장 소득 외 추가 시)</h3>

        <p>
          직장인이 부수입으로 연 2,000만원 이상 벌면 직장 건강보험료가 오릅니다.
          금액에 따라 다르지만 평균 5~10% 추가 부담.
        </p>

        <div className="guide-formula">
          최종 실수령 = 약 <strong>27~29만원</strong>
        </div>

        <h2>구독자별 월 평균 수익 가이드</h2>

        <div className="guide-formula">
          (재테크 분야 기준)<br /><br />
          1,000명:    월 5~10만원<br />
          5,000명:    월 30~60만원<br />
          1만 명:     월 60~150만원<br />
          3만 명:     월 200~400만원<br />
          5만 명:     월 400~700만원<br />
          10만 명:    월 800~1,500만원<br />
          30만 명:    월 2,500~5,000만원<br /><br />
          ※ 영상 업로드 빈도에 따라 큰 차이
        </div>

        <h2>광고 수익 외 부가 수익</h2>

        <p>
          유튜브 광고 수익만 있는 게 아닙니다. 채널 성장하면 다른 수익이
          더 큽니다.
        </p>

        <h3>1. 협찬·브랜디드 콘텐츠</h3>

        <ul>
          <li>구독자 1만 명 이상부터 협찬 제안 들어옴</li>
          <li>1편당 50~500만원 (구독자 수·분야에 따라)</li>
          <li>유튜브 광고 수익 + 협찬 수익이 보통 1:2 비율</li>
        </ul>

        <h3>2. 멤버십·후원</h3>

        <ul>
          <li>유튜브 멤버십: 월 4,990원~14,990원 구독</li>
          <li>슈퍼 챗 (라이브 후원)</li>
          <li>패트리온, 카카오 후원 등</li>
        </ul>

        <h3>3. 본인 상품·서비스</h3>

        <ul>
          <li>전자책, 강의, 컨설팅</li>
          <li>제휴 마케팅 (쿠팡 파트너스 등)</li>
          <li>본인 직접 제품 판매</li>
        </ul>

        <h2>현실적 기대치 — 첫 1년</h2>

        <p>
          첫 1년은 거의 수익이 안 납니다. 정상입니다.
        </p>

        <ul>
          <li><strong>3개월:</strong> 거의 0원 (수익화 조건 미달)</li>
          <li><strong>6개월:</strong> 수익화 시작해도 월 1~5만원</li>
          <li><strong>12개월:</strong> 평균 월 10~30만원 (꾸준히 한 경우)</li>
          <li><strong>24개월:</strong> 월 50~200만원</li>
        </ul>

        <div className="guide-callout">
          💡 유튜브로 큰 돈 벌고 싶으시면 최소 2년은 꾸준해야 합니다.
          단기 수익을 약속하는 강의는 모두 사기입니다.
        </div>

        <h2>세금 신고 시 주의사항</h2>

        <ul>
          <li><strong>5월 종합소득세 신고:</strong> 매년 5월에 전년 수익 신고</li>
          <li><strong>증빙 보관:</strong> 장비비, 인터넷비, 전기료 등 비용 처리 가능</li>
          <li><strong>세무사 상담:</strong> 연 수익 1,000만 원 이상이면 세무사 활용 추천</li>
          <li><strong>현금영수증·세금계산서:</strong> 유튜브 관련 지출 모두 받기</li>
        </ul>

        <div className="guide-cta">
          <div className="guide-cta-title">💰 매주 영상으로 수익화</div>
          <div className="guide-cta-desc">
            매주 영상 만드는 데 자료 준비가 가장 어렵죠. AlgoMaker가 5초 만에 만들어드립니다.
          </div>
          <Link href="/" className="guide-cta-btn">지금 바로 만들기 →</Link>
        </div>
      </article>
    </V11Shell>
  );
}
