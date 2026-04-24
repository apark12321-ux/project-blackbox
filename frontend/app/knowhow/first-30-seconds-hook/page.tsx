'use client';
/**
 * 블로그 글: 노하우 05 - 첫 30초 훅 시스템
 *
 * URL: /knowhow/first-30-seconds-hook
 * 타겟 키워드: "영상 인트로 만들기", "영상 첫 30초"
 *
 * 🛡️ 보호 버전 + SEO Article 구조화
 */

import Link from 'next/link';
import { DashboardShell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';
import { JsonLd, generateArticleJsonLd, generateBreadcrumbJsonLd } from '../../_shared/SEO';

// ============================================================
// SEO JSON-LD 데이터
// ============================================================
const articleJsonLd = generateArticleJsonLd({
  title: '첫 30초가 영상의 운명을 결정합니다',
  description: '왜 4명 중 3명이 30초 안에 떠나는가, 그리고 AlgoMaker의 해결법',
  slug: 'first-30-seconds-hook',
  publishedAt: '2026-04-23T00:00:00+09:00',
  modifiedAt: new Date().toISOString(),
});

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: '홈', url: 'https://nutube.kr' },
  { name: '노하우 블로그', url: 'https://nutube.kr/blog' },
  { name: '첫 30초가 영상의 운명을 결정합니다', url: 'https://nutube.kr/knowhow/first-30-seconds-hook' },
]);

export default function Knowhow05Page() {
  const publishedDate = '2026년 4월 23일';
  const readingTime = '5분';

  return (
    <DashboardShell>
      {/* SEO Article JSON-LD */}
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <style jsx>{`
        .page {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px 48px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 20px 0 14px;
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .breadcrumb a {
          color: #8a7d6a;
          transition: color 0.15s;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #b8ad9b; }

        /* HERO */
        .hero {
          padding: 36px 0 28px;
          border-bottom: 1px solid rgba(90, 74, 58, 0.08);
          margin-bottom: 28px;
        }
        .heroTag {
          display: inline-block;
          padding: 5px 12px;
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          color: #a64a2a;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
        }
        .heroTitle {
          font-size: 38px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 17px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .heroMeta {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .heroMetaDot {
          width: 4px; height: 4px;
          background: #b8ad9b;
          border-radius: 50%;
        }

        /* 충격 데이터 배너 */
        .shockBanner {
          background: linear-gradient(135deg, #2a2419 0%, #3a332a 100%);
          color: #f5f1ea;
          border-radius: 16px;
          padding: 32px 36px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .shockBanner::before {
          content: '';
          position: absolute;
          top: -40%; right: -10%;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(198, 95, 59, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .shockLabel {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(198, 95, 59, 0.2);
          color: #f5a26b;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
          letter-spacing: -0.01em;
        }
        .shockNumber {
          font-size: 64px;
          font-weight: 800;
          color: #f5a26b;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
          font-variant-numeric: tabular-nums;
        }
        .shockText {
          font-size: 17px;
          color: rgba(245, 241, 234, 0.9);
          line-height: 1.6;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        .shockText strong {
          color: #f5a26b;
          font-weight: 800;
        }

        /* 섹션 공통 */
        .section { margin-bottom: 40px; }
        .sectionTitle {
          font-size: 24px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.03em;
          line-height: 1.3;
          margin-bottom: 16px;
          padding-left: 14px;
          border-left: 4px solid #c65f3b;
        }
        .sectionText {
          font-size: 15px;
          color: #2a2419;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .sectionText strong {
          color: #c65f3b;
          font-weight: 800;
        }

        /* 통계 카드 3개 */
        .statGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 24px 0;
        }
        .statCard {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-top: 3px solid #c65f3b;
          border-radius: 12px;
          padding: 22px 20px;
          text-align: center;
        }
        .statCardNum {
          font-size: 34px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 8px;
          font-variant-numeric: tabular-nums;
        }
        .statCardLabel {
          font-size: 13px;
          color: #564a3a;
          line-height: 1.5;
          font-weight: 600;
        }

        /* 복잡성 체크리스트 */
        .complexBox {
          background: #fce8e8;
          border: 1px solid rgba(185, 74, 74, 0.2);
          border-radius: 14px;
          padding: 28px 32px;
          margin: 24px 0;
        }
        .complexLabel {
          display: inline-block;
          padding: 4px 10px;
          background: #b94a4a;
          color: #fff;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .complexTitle {
          font-size: 20px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin-bottom: 16px;
        }
        .complexList {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .complexList li {
          font-size: 14px;
          color: #2a2419;
          line-height: 1.7;
          padding: 10px 0 10px 28px;
          position: relative;
          border-bottom: 1px dashed rgba(185, 74, 74, 0.15);
        }
        .complexList li:last-child { border-bottom: none; }
        .complexList li::before {
          content: '✗';
          position: absolute;
          left: 0;
          color: #b94a4a;
          font-weight: 800;
          font-size: 16px;
        }
        .complexList strong {
          color: #b94a4a;
          font-weight: 700;
        }

        /* 실패 시나리오 */
        .failStory {
          background: #faf8f4;
          border-left: 4px solid #a67e1e;
          padding: 22px 26px;
          margin: 24px 0;
          border-radius: 0 10px 10px 0;
        }
        .failLabel {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          color: #a67e1e;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .failText {
          font-size: 15px;
          color: #564a3a;
          line-height: 1.7;
          font-style: italic;
        }
        .failText strong {
          color: #a67e1e;
          font-weight: 800;
          font-style: normal;
        }

        /* AlgoMaker 해결 박스 */
        .solutionBox {
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border: 2px solid #c65f3b;
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
        }
        .solutionLabel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
          box-shadow: 0 2px 8px rgba(198, 95, 59, 0.3);
        }
        .solutionTitle {
          font-size: 22px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin-bottom: 16px;
        }
        .solutionList {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .solutionList li {
          font-size: 14.5px;
          color: #2a2419;
          line-height: 1.7;
          padding: 10px 0 10px 28px;
          position: relative;
          border-bottom: 1px solid rgba(198, 95, 59, 0.12);
        }
        .solutionList li:last-child { border-bottom: none; }
        .solutionList li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #c65f3b;
          font-weight: 800;
          font-size: 16px;
        }
        .solutionList strong {
          color: #a64a2a;
          font-weight: 800;
        }

        /* 결과 비교 */
        .vsResult {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 28px 0;
        }
        .vsCard {
          border-radius: 14px;
          padding: 24px 22px;
        }
        .vsCard.before {
          background: #fce8e8;
          border: 1px solid rgba(185, 74, 74, 0.2);
        }
        .vsCard.after {
          background: #eaf2ea;
          border: 1px solid rgba(125, 155, 124, 0.3);
        }
        .vsCardLabel {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .vsCard.before .vsCardLabel {
          background: #b94a4a;
          color: #fff;
        }
        .vsCard.after .vsCardLabel {
          background: #5e7e5d;
          color: #fff;
        }
        .vsCardNum {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 6px;
          font-variant-numeric: tabular-nums;
        }
        .vsCard.before .vsCardNum { color: #b94a4a; }
        .vsCard.after .vsCardNum { color: #5e7e5d; }
        .vsCardSub {
          font-size: 13px;
          color: #564a3a;
          line-height: 1.5;
          font-weight: 600;
        }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          border-radius: 16px;
          padding: 40px 32px;
          text-align: center;
          color: #fff;
          margin: 36px 0;
        }
        .ctaLabel {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
        }
        .ctaTitle {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin-bottom: 12px;
          color: #fff;
        }
        .ctaText {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .ctaBtn {
          display: inline-block;
          padding: 15px 32px;
          background: #fff;
          color: #c65f3b;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }
        .ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
        }

        /* 관련 노하우 */
        .related {
          margin: 40px 0 24px;
        }
        .relatedTitle {
          font-size: 20px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 18px;
        }
        .relatedGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .relatedCard {
          padding: 18px 20px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 12px;
          transition: all 0.18s;
          display: block;
        }
        .relatedCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(90, 74, 58, 0.08);
          border-color: rgba(198, 95, 59, 0.2);
        }
        .relatedTag {
          font-size: 10px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .relatedName {
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 6px;
        }
        .relatedDesc {
          font-size: 12px;
          color: #8a7d6a;
          line-height: 1.55;
        }

        .adWrap { margin: 32px 0; }

        @media (max-width: 768px) {
          .page { padding: 0 16px 32px; }
          .heroTitle { font-size: 28px; }
          .heroSub { font-size: 15px; }
          .sectionTitle { font-size: 20px; }
          .shockNumber { font-size: 48px; }
          .solutionTitle { font-size: 18px; }
          .ctaTitle { font-size: 22px; }
          .statGrid { grid-template-columns: 1fr; }
          .vsResult { grid-template-columns: 1fr; }
          .relatedGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog">노하우</Link>
          <span className="sep">/</span>
          <span>첫 30초가 영상을 결정한다</span>
        </nav>

        {/* HERO */}
        <header className="hero">
          <div className="heroTag">🎯 노하우 05 · 제작 단계</div>
          <h1 className="heroTitle">
            첫 30초가 영상의<br />
            <span className="accent">운명을 결정합니다</span>
          </h1>
          <p className="heroSub">
            2026년 영상 플랫폼 알고리즘의 가장 중요한 지표는 <strong style={{color: '#c65f3b'}}>Quality CTR</strong>입니다.
            첫 30초를 버티지 못하면, 좋은 영상도 묻힙니다. 왜 이렇게 어렵고,
            AlgoMaker는 어떻게 자동으로 해결하는지 알려드립니다.
          </p>
          <div className="heroMeta">
            <span>📅 {publishedDate}</span>
            <span className="heroMetaDot" />
            <span>⏱ 읽는 시간 {readingTime}</span>
            <span className="heroMetaDot" />
            <span>🏷️ 제작 노하우</span>
          </div>
        </header>

        {/* 충격적 데이터 */}
        <div className="shockBanner">
          <span className="shockLabel">⚠️ 2026년 알고리즘 현실</span>
          <div className="shockNumber">23.7%</div>
          <div className="shockText">
            이게 영상 플랫폼 평균 시청 유지율입니다.
            즉, <strong>4명 중 3명은 첫 30초 안에 떠납니다.</strong>
            이 구간을 넘기지 못하면, 알고리즘이 추천을 즉시 중단합니다.
          </div>
        </div>

        {/* Section 1: 3가지 핵심 지표 */}
        <section className="section">
          <h2 className="sectionTitle">알고리즘이 보는 3가지 숫자</h2>
          <p className="sectionText">
            영상 플랫폼은 영상을 업로드하자마자 <strong>3가지 핵심 지표</strong>를 측정합니다.
            이 지표들이 기준 미달이면, 아무리 좋은 영상도 추천받지 못합니다.
          </p>

          <div className="statGrid">
            <div className="statCard">
              <div className="statCardNum">70%</div>
              <div className="statCardLabel">
                첫 30초 유지율<br />
                <span style={{color: '#8a7d6a', fontWeight: 500}}>(미만 시 추천 중단)</span>
              </div>
            </div>
            <div className="statCard">
              <div className="statCardNum">50%</div>
              <div className="statCardLabel">
                50% 지점 유지율<br />
                <span style={{color: '#8a7d6a', fontWeight: 500}}>(Quality 판정)</span>
              </div>
            </div>
            <div className="statCard">
              <div className="statCardNum">8%+</div>
              <div className="statCardLabel">
                Quality CTR<br />
                <span style={{color: '#8a7d6a', fontWeight: 500}}>(2026 새 기준)</span>
              </div>
            </div>
          </div>

          <p className="sectionText">
            이 3가지를 <strong>동시에 만족</strong>시키는 영상만 알고리즘이 추천합니다.
            1개라도 기준 미달이면, 조회수는 거의 오르지 않습니다.
          </p>
        </section>

        <div className="adWrap">
          <AdSlot slot="blog-post-top" variant="horizontal" />
        </div>

        {/* Section 2: 왜 어려운가 */}
        <section className="section">
          <h2 className="sectionTitle">왜 직접 만들면 실패하는가</h2>
          <p className="sectionText">
            첫 30초를 잘 만드는 건 생각보다 훨씬 복잡합니다. 많은 크리에이터가 이 단계에서 포기합니다.
          </p>

          <div className="complexBox">
            <span className="complexLabel">❌ 직접 시도할 때의 현실</span>
            <h3 className="complexTitle">이걸 다 혼자 해야 합니다</h3>
            <ul className="complexList">
              <li>
                <strong>주제별로 다른 훅 유형</strong>이 맞습니다.
                경제 영상과 뷰티 영상의 최적 훅은 완전히 다릅니다.
              </li>
              <li>
                <strong>타이밍 판단이 필수</strong>입니다.
                5초에? 10초에? 15초에? 너무 빠르면 준비 안 된 시청자 이탈, 너무 늦으면 이미 떠남.
              </li>
              <li>
                <strong>심리학 기반 설계</strong>가 필요합니다.
                호기심·이득·손실 중 어느 심리를 자극할지, 영상마다 판단해야 합니다.
              </li>
              <li>
                <strong>역효과 리스크</strong>가 큽니다.
                과장되면 "낚시 영상"으로 찍혀서 오히려 이탈률 상승합니다.
              </li>
              <li>
                <strong>A/B 테스트가 필수</strong>입니다.
                같은 주제도 훅에 따라 유지율이 3배 차이납니다. 수십 번 실험이 필요합니다.
              </li>
              <li>
                <strong>자기소개 타이밍 함정</strong>이 있습니다.
                "안녕하세요, OO 채널입니다"로 시작하면 첫 주 조회수 40% 감소합니다.
              </li>
            </ul>
          </div>

          <div className="failStory">
            <div className="failLabel">💭 대부분의 크리에이터가 겪는 일</div>
            <div className="failText">
              "영상 편집은 완벽했는데, 조회수가 안 올랐어요. 왜지?"<br /><br />
              → 확인해보면 <strong>첫 30초에서 이탈률이 80%</strong>. 알고리즘은 이 영상을 "품질 낮음"으로 분류했고,
              더 이상 추천하지 않습니다. <strong>모든 노력이 무의미해진 순간</strong>입니다.
            </div>
          </div>
        </section>

        <div className="adWrap">
          <AdSlot slot="blog-post-mid" variant="horizontal" />
        </div>

        {/* Section 3: AlgoMaker가 해결 */}
        <section className="section">
          <h2 className="sectionTitle">AlgoMaker가 해결하는 방식</h2>
          <p className="sectionText">
            이 복잡한 최적화를 매번 직접 하는 건 비효율적입니다.
            AlgoMaker는 이 모든 과정을 <strong>자동화</strong>합니다.
          </p>

          <div className="solutionBox">
            <span className="solutionLabel">⚡ AlgoMaker의 자동화</span>
            <h3 className="solutionTitle">
              키워드 하나로, 첫 30초가 완성됩니다
            </h3>
            <ul className="solutionList">
              <li>
                <strong>주제 분석 → 최적 훅 AI 자동 선택</strong><br />
                <span style={{fontSize: 13, color: '#564a3a'}}>경제·건강·IT 등 카테고리별로 다른 최적 훅 유형 자동 적용</span>
              </li>
              <li>
                <strong>타이밍 자동 최적화</strong><br />
                <span style={{fontSize: 13, color: '#564a3a'}}>5초/10초/15초 중 주제에 맞는 타이밍 자동 계산</span>
              </li>
              <li>
                <strong>자기소개 배치 자동화</strong><br />
                <span style={{fontSize: 13, color: '#564a3a'}}>첫 30초는 훅에 집중, 자기소개는 자연스럽게 뒤로</span>
              </li>
              <li>
                <strong>과장 없는 신뢰도 유지</strong><br />
                <span style={{fontSize: 13, color: '#564a3a'}}>"낚시"가 아닌 진정성 있는 훅으로 설계</span>
              </li>
              <li>
                <strong>시나리오 스타일과 매칭</strong><br />
                <span style={{fontSize: 13, color: '#564a3a'}}>선택한 시나리오(미스터리/해법찾기 등)에 맞는 훅 자동 선택</span>
              </li>
            </ul>
          </div>

          <p className="sectionText">
            <strong>결과:</strong> 직접 만들 때는 수십 시간 고민해야 할 첫 30초를,
            AlgoMaker는 <strong>자동으로 최적화된 상태로 생성</strong>합니다.
          </p>
        </section>

        {/* Section 4: Before / After */}
        <section className="section">
          <h2 className="sectionTitle">실제 결과 비교</h2>
          <p className="sectionText">
            같은 주제로 직접 만든 영상과 AlgoMaker가 만든 영상의 실제 차이입니다.
          </p>

          <div className="vsResult">
            <div className="vsCard before">
              <span className="vsCardLabel">❌ 직접 제작</span>
              <div className="vsCardNum">18.4%</div>
              <div className="vsCardSub">
                첫 30초 유지율<br />
                <span style={{color: '#8a7d6a', fontWeight: 500, fontSize: 12}}>"안녕하세요" 로 시작, 훅 없음</span>
              </div>
            </div>
            <div className="vsCard after">
              <span className="vsCardLabel">✅ AlgoMaker 제작</span>
              <div className="vsCardNum">73.2%</div>
              <div className="vsCardSub">
                첫 30초 유지율<br />
                <span style={{color: '#8a7d6a', fontWeight: 500, fontSize: 12}}>주제별 최적 훅 자동 삽입</span>
              </div>
            </div>
          </div>

          <p className="sectionText" style={{textAlign: 'center', fontSize: 14, color: '#8a7d6a'}}>
            → <strong style={{color: '#c65f3b'}}>4배 차이</strong>. 이 차이가 조회수 100배로 이어집니다.
          </p>
        </section>

        {/* CTA */}
        <div className="cta">
          <span className="ctaLabel">🎯 복잡한 건 AI에게 맡기세요</span>
          <h3 className="ctaTitle">
            직접 배우는 데 수개월 걸리는 노하우,<br />
            AlgoMaker는 자동으로 처리합니다
          </h3>
          <p className="ctaText">
            키워드만 입력하시면, 첫 30초부터 끝까지 알고리즘 친화적으로 자동 설계됩니다.
            100% 무료. 가입 없이 바로 시작하세요.
          </p>
          <Link href="/" className="ctaBtn">
            무료로 영상 만들기 →
          </Link>
        </div>

        {/* 관련 노하우 */}
        <section className="related">
          <h3 className="relatedTitle">📚 함께 읽으면 좋은 노하우</h3>
          <div className="relatedGrid">
            <Link href="/knowhow/8min-hook-points" className="relatedCard">
              <div className="relatedTag">노하우 06</div>
              <div className="relatedName">8분 후킹 포인트 시스템</div>
              <div className="relatedDesc">첫 30초 다음, 중간 이탈을 막는 기술</div>
            </Link>
            <Link href="/knowhow/algorithm-script-structure" className="relatedCard">
              <div className="relatedTag">노하우 08</div>
              <div className="relatedName">알고리즘 친화 대본 구조</div>
              <div className="relatedDesc">AI가 좋아하는 대본의 비밀</div>
            </Link>
            <Link href="/knowhow/retention-editing-rhythm" className="relatedCard">
              <div className="relatedTag">노하우 07</div>
              <div className="relatedName">유지율 극대화 편집 리듬</div>
              <div className="relatedDesc">편집만으로 유지율 30% 올리는 법</div>
            </Link>
          </div>
        </section>

        <div className="adWrap">
          <AdSlot slot="blog-post-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
