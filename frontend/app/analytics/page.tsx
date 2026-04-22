'use client';
/**
 * /analytics - 분석 (Pro 전용)
 * 결제 유도의 핵심 페이지
 * - Free 사용자는 흐릿하게 미리보기 + 락 + 업그레이드 CTA
 */

import { DashboardShell } from '../_shared/V11Shell';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();

  const handleUpgrade = () => {
    alert('🎉 Pro 업그레이드\n\n✓ 경쟁 채널 분석 무제한\n✓ 썸네일 A/B 테스트\n✓ 트렌드 예측 AI\n✓ 수익 시뮬레이션\n✓ 모든 데이터 CSV 다운로드\n\n결제 기능이 곧 출시됩니다!');
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 48px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Hero - Pro 업그레이드 */
        .proHero {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
          border-radius: 18px;
          padding: 32px 36px;
          color: #fff;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          border: 1px solid #222;
        }
        .proHero::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(204,0,0,0.25) 0%, transparent 60%);
          pointer-events: none;
        }
        .proHeroInner {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .proHeroLeft { flex: 1; min-width: 260px; }
        .proBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: rgba(204, 0, 0, 0.15);
          border: 1px solid rgba(204, 0, 0, 0.3);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          color: #ff6b6b;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }
        .proLock {
          font-size: 14px;
        }
        .proHeroTitle {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .proHeroSub {
          font-size: 14px;
          color: #aaa;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .proFeatures {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .proFeature {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #ccc;
        }
        .proFeature span:first-child {
          color: #16a34a;
          font-weight: 700;
        }
        .proHeroRight {
          text-align: right;
        }
        .priceRow {
          font-size: 13px;
          color: #666;
          text-decoration: line-through;
          margin-bottom: 2px;
        }
        .priceBig {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 2px;
        }
        .priceBig span {
          font-size: 14px;
          color: #888;
          font-weight: 500;
        }
        .priceSavings {
          display: inline-block;
          margin-bottom: 12px;
          padding: 2px 8px;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .upgradeBtn {
          padding: 12px 32px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s;
        }
        .upgradeBtn:hover { background: #a80000; }

        /* Section titles */
        .sectionTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .sectionTitleLeft {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .sectionNum {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px; height: 24px;
          background: #0f0f0f;
          color: #fff;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
        }

        /* Locked preview cards */
        .lockedGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .lockedCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
        }
        .lockBadge {
          position: absolute;
          top: 14px; right: 14px;
          padding: 4px 10px;
          background: #0f0f0f;
          color: #fff;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          z-index: 2;
        }
        .lockTitle {
          font-size: 15px;
          font-weight: 800;
          color: #0f0f0f;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .lockDesc {
          font-size: 12px;
          color: #666;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .fakeChart {
          position: relative;
          height: 120px;
          border-radius: 8px;
          padding: 12px;
          filter: blur(3px);
          pointer-events: none;
          opacity: 0.6;
        }
        .fakeChartBars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 100%;
        }
        .fakeChartBar {
          flex: 1;
          background: linear-gradient(180deg, #cc0000 0%, #880000 100%);
          border-radius: 4px 4px 0 0;
        }
        .fakeChartLine {
          position: absolute;
          inset: 12px;
          background:
            linear-gradient(180deg, transparent 49%, #cc0000 49%, #cc0000 51%, transparent 51%);
          transform: rotate(-8deg);
          opacity: 0.4;
        }
        .fakeMetrics {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          filter: blur(2px);
          opacity: 0.6;
        }
        .fakeMetric {
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          text-align: center;
        }
        .fakeMetricLabel {
          font-size: 10px;
          color: #888;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .fakeMetricValue {
          font-size: 18px;
          font-weight: 800;
          color: #0f0f0f;
        }

        /* Upgrade overlay (on top of locked cards) */
        .cardOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 60%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 20px;
          z-index: 1;
        }
        .overlayBtn {
          padding: 8px 18px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
        .overlayBtn:hover { background: #a80000; }

        /* Testimonials */
        .testimonials {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .testimonialGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 14px;
        }
        .testimonial {
          padding: 16px;
          background: #fafafa;
          border-radius: 10px;
        }
        .testimonialText {
          font-size: 13px;
          color: #0f0f0f;
          line-height: 1.6;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .testimonialAuthor {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .authorAvatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }
        .authorName {
          font-size: 12px;
          font-weight: 700;
        }
        .authorRole {
          font-size: 10px;
          color: #888;
        }

        /* Bottom CTA */
        .bottomCTA {
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          border-radius: 16px;
          padding: 28px;
          color: #fff;
          text-align: center;
          margin-top: 24px;
        }
        .bottomCTATitle {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .bottomCTASub {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          margin-bottom: 18px;
        }
        .bottomCTABtn {
          padding: 13px 30px;
          background: #fff;
          color: #cc0000;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
        }
        .bottomCTABtn:hover { background: #fafafa; }

        @media (max-width: 900px) {
          .lockedGrid { grid-template-columns: 1fr; }
          .testimonialGrid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .page { padding: 20px 14px 40px; }
          .proHero { padding: 24px; }
          .proHeroTitle { font-size: 22px; }
          .proHeroRight { text-align: left; width: 100%; }
          .priceBig { font-size: 26px; }
          .fakeMetrics { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        {/* PRO UPGRADE HERO */}
        <section className="proHero">
          <div className="proHeroInner">
            <div className="proHeroLeft">
              <span className="proBadge">
                <span className="proLock">🔒</span>
                PRO EXCLUSIVE
              </span>
              <h1 className="proHeroTitle">고급 분석 기능을<br />Pro로 열어보세요</h1>
              <p className="proHeroSub">
                경쟁 채널 분석·썸네일 A/B·트렌드 예측까지, 수익을 극대화하는 데이터 도구
              </p>
              <div className="proFeatures">
                <div className="proFeature"><span>✓</span> 경쟁 채널 분석</div>
                <div className="proFeature"><span>✓</span> 썸네일 A/B 테스트</div>
                <div className="proFeature"><span>✓</span> 트렌드 예측 AI</div>
              </div>
            </div>
            <div className="proHeroRight">
              <div className="priceRow">정가 29,000원</div>
              <div className="priceBig">9,900<span> 원/월</span></div>
              <div className="priceSavings">66% SAVE</div>
              <div>
                <button className="upgradeBtn" onClick={handleUpgrade}>
                  ⚡ Pro 시작하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* LOCKED FEATURES */}
        <div className="sectionTitle">
          <div className="sectionTitleLeft">
            <span className="sectionNum">1</span>
            Pro에서 열리는 기능들
          </div>
        </div>

        <div className="lockedGrid">
          <div className="lockedCard">
            <span className="lockBadge">🔒 PRO</span>
            <div className="lockTitle">🎯 경쟁 채널 분석</div>
            <div className="lockDesc">
              같은 키워드의 경쟁 영상 평균 조회수·CTR·시청 유지율 분석
            </div>
            <div className="fakeChart">
              <div className="fakeChartBars">
                <div className="fakeChartBar" style={{ height: '40%' }} />
                <div className="fakeChartBar" style={{ height: '65%' }} />
                <div className="fakeChartBar" style={{ height: '55%' }} />
                <div className="fakeChartBar" style={{ height: '85%' }} />
                <div className="fakeChartBar" style={{ height: '70%' }} />
                <div className="fakeChartBar" style={{ height: '92%' }} />
                <div className="fakeChartBar" style={{ height: '78%' }} />
              </div>
            </div>
            <div className="cardOverlay">
              <button className="overlayBtn" onClick={handleUpgrade}>Pro로 보기 →</button>
            </div>
          </div>

          <div className="lockedCard">
            <span className="lockBadge">🔒 PRO</span>
            <div className="lockTitle">🖼️ 썸네일 A/B 테스트</div>
            <div className="lockDesc">
              AI가 만든 4가지 썸네일 후보 중 가장 클릭률 높은 것 자동 선별
            </div>
            <div className="fakeMetrics">
              <div className="fakeMetric">
                <div className="fakeMetricLabel">CTR A</div>
                <div className="fakeMetricValue">14.2%</div>
              </div>
              <div className="fakeMetric">
                <div className="fakeMetricLabel">CTR B</div>
                <div className="fakeMetricValue">9.8%</div>
              </div>
              <div className="fakeMetric">
                <div className="fakeMetricLabel">승자</div>
                <div className="fakeMetricValue">A</div>
              </div>
            </div>
            <div className="cardOverlay">
              <button className="overlayBtn" onClick={handleUpgrade}>Pro로 보기 →</button>
            </div>
          </div>

          <div className="lockedCard">
            <span className="lockBadge">🔒 PRO</span>
            <div className="lockTitle">📈 트렌드 예측 AI</div>
            <div className="lockDesc">
              2주 뒤 급상승할 주제를 뉴스·SNS·검색 데이터로 미리 예측
            </div>
            <div className="fakeChart">
              <div className="fakeChartLine" />
              <div className="fakeChartBars">
                {[30, 40, 50, 45, 65, 75, 90].map((h, i) => (
                  <div key={i} className="fakeChartBar" style={{ height: `${h}%`, opacity: 0.3 + i * 0.1 }} />
                ))}
              </div>
            </div>
            <div className="cardOverlay">
              <button className="overlayBtn" onClick={handleUpgrade}>Pro로 보기 →</button>
            </div>
          </div>

          <div className="lockedCard">
            <span className="lockBadge">🔒 PRO</span>
            <div className="lockTitle">💰 수익 시뮬레이션</div>
            <div className="lockDesc">
              채널 특성·영상 주제별 예상 월 수익 구간 계산 (광고+멤버십)
            </div>
            <div className="fakeMetrics">
              <div className="fakeMetric">
                <div className="fakeMetricLabel">최소</div>
                <div className="fakeMetricValue">$180</div>
              </div>
              <div className="fakeMetric">
                <div className="fakeMetricLabel">평균</div>
                <div className="fakeMetricValue">$420</div>
              </div>
              <div className="fakeMetric">
                <div className="fakeMetricLabel">최대</div>
                <div className="fakeMetricValue">$950</div>
              </div>
            </div>
            <div className="cardOverlay">
              <button className="overlayBtn" onClick={handleUpgrade}>Pro로 보기 →</button>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <section className="testimonials">
          <div className="sectionTitleLeft">
            <span className="sectionNum">2</span>
            Pro 사용자 후기
          </div>
          <div className="testimonialGrid">
            <div className="testimonial">
              <div className="testimonialText">
                "경쟁 채널 분석 덕에 우리 채널만의 각도를 찾았어요. 조회수 평균이 3배 올랐습니다."
              </div>
              <div className="testimonialAuthor">
                <div className="authorAvatar">김</div>
                <div>
                  <div className="authorName">김○○</div>
                  <div className="authorRole">경제 채널 · 구독 12만</div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonialText">
                "썸네일 A/B가 진짜 게임 체인저. 하루에 영상 2개씩 업로드 가능해졌어요."
              </div>
              <div className="testimonialAuthor">
                <div className="authorAvatar">이</div>
                <div>
                  <div className="authorName">이○○</div>
                  <div className="authorRole">IT 리뷰 · 구독 8만</div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonialText">
                "트렌드 예측이 놀랍도록 정확해요. 블루오션을 먼저 선점할 수 있어요."
              </div>
              <div className="testimonialAuthor">
                <div className="authorAvatar">박</div>
                <div>
                  <div className="authorName">박○○</div>
                  <div className="authorRole">자기계발 · 구독 23만</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bottomCTA">
          <div className="bottomCTATitle">지금 시작하면 첫 달 66% 할인</div>
          <div className="bottomCTASub">
            정가 29,000원 → 9,900원 · 언제든 해지 가능
          </div>
          <button className="bottomCTABtn" onClick={handleUpgrade}>
            ⚡ Pro 시작하기 9,900원/월
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}
