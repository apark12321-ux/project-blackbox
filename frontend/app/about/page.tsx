'use client';
/**
 * /about - AdSense 심사 필수 페이지
 *
 * 포함 내용:
 * - 서비스 목적 / 미션
 * - 운영자 정보 (한줄컴퍼니 / 박예준)
 * - 서비스의 가치 제안
 * - 연락처로 이동 CTA
 *
 * 이 페이지는 AdSense 심사 시 "실제 운영하는 사이트"임을 증명하는 핵심 자료
 */

import Link from 'next/link';
import { DashboardShell } from '../_shared/V11Shell';

export default function AboutPage() {
  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 60px;
          max-width: 820px;
          margin: 0 auto;
        }
        .pageHeader {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e8e8e8;
        }
        .pageBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 14px;
        }
        .pageTitle {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.15;
          margin-bottom: 10px;
          color: #0f0f0f;
        }
        .pageSub {
          font-size: 15px;
          color: #606060;
          line-height: 1.65;
          max-width: 600px;
        }

        .section {
          margin-bottom: 40px;
        }
        .sectionTitle {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
          color: #0f0f0f;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sectionIcon {
          width: 30px; height: 30px;
          background: #0f0f0f;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .sectionBody {
          font-size: 14.5px;
          line-height: 1.75;
          color: #333;
        }
        .sectionBody p {
          margin-bottom: 14px;
        }

        .valuesGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }
        .valueCard {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          padding: 18px;
        }
        .valueCardTitle {
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 6px;
          color: #0f0f0f;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .valueCardIcon { font-size: 18px; }
        .valueCardDesc {
          font-size: 12.5px;
          color: #555;
          line-height: 1.6;
        }

        .infoBox {
          background: #fafafa;
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          padding: 22px 24px;
        }
        .infoRow {
          display: flex;
          gap: 14px;
          padding: 10px 0;
          border-bottom: 1px solid #e8e8e8;
          font-size: 13.5px;
        }
        .infoRow:last-child { border-bottom: none; }
        .infoLabel {
          flex: 0 0 120px;
          font-weight: 700;
          color: #666;
        }
        .infoValue {
          flex: 1;
          color: #0f0f0f;
        }

        .stepList {
          counter-reset: step;
        }
        .stepItem {
          position: relative;
          padding-left: 48px;
          margin-bottom: 22px;
        }
        .stepItem::before {
          counter-increment: step;
          content: counter(step);
          position: absolute;
          left: 0;
          top: 0;
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #cc0000 0%, #8b0000 100%);
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
        }
        .stepTitle {
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 5px;
          color: #0f0f0f;
        }
        .stepDesc {
          font-size: 13px;
          color: #555;
          line-height: 1.65;
        }

        .cta {
          margin-top: 40px;
          padding: 28px;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          border-radius: 16px;
          color: #fff;
          text-align: center;
        }
        .ctaTitle {
          font-size: 19px;
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .ctaSub {
          font-size: 13px;
          color: #999;
          margin-bottom: 18px;
        }
        .ctaBtns {
          display: inline-flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ctaBtn {
          padding: 12px 26px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          display: inline-block;
          text-decoration: none;
          transition: all 0.15s;
        }
        .ctaBtnPrimary {
          background: linear-gradient(135deg, #cc0000 0%, #8b0000 100%);
          color: #fff;
        }
        .ctaBtnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(204,0,0,0.3);
        }
        .ctaBtnSecondary {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .ctaBtnSecondary:hover {
          background: rgba(255,255,255,0.15);
        }

        @media (max-width: 640px) {
          .page { padding: 22px 16px 40px; }
          .pageTitle { font-size: 26px; }
          .valuesGrid { grid-template-columns: 1fr; }
          .infoLabel { flex: 0 0 90px; }
        }
      `}</style>

      <div className="page">
        <header className="pageHeader">
          <span className="pageBadge">ABOUT</span>
          <h1 className="pageTitle">AlgoMaker 소개</h1>
          <p className="pageSub">
            AI 기술로 누구나 유튜브 크리에이터가 될 수 있도록 돕는 한국어 특화 영상 자동 생성 스튜디오입니다.
          </p>
        </header>

        {/* 미션 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionIcon">🎯</span>
            우리의 미션
          </div>
          <div className="sectionBody">
            <p>
              유튜브 영상 한 편을 만들려면 기획·대본·녹음·이미지·편집까지 최소 4~8시간이 필요합니다.
              이 과정은 전문 크리에이터에게도 부담스럽고, 초보자에게는 진입 장벽이 됩니다.
            </p>
            <p>
              AlgoMaker는 이 장벽을 허무는 것을 목표로 합니다.
              키워드 하나를 입력하면 AI가 알고리즘 친화적인 시나리오를 추천하고,
              대본·음성·이미지를 자동으로 조합해 완성된 영상을 만들어드립니다.
              크리에이터는 기획과 편집의 부담을 덜고, 본인의 독창적인 콘텐츠에 집중할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 핵심 가치 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionIcon">💎</span>
            핵심 가치
          </div>
          <div className="valuesGrid">
            <div className="valueCard">
              <div className="valueCardTitle">
                <span className="valueCardIcon">🆓</span>
                무료 접근
              </div>
              <div className="valueCardDesc">
                가입·결제 없이 12가지 시나리오 스타일을 무제한 사용할 수 있습니다.
                크리에이터의 초기 진입 비용을 0원으로 만듭니다.
              </div>
            </div>
            <div className="valueCard">
              <div className="valueCardTitle">
                <span className="valueCardIcon">🇰🇷</span>
                한국어 최적화
              </div>
              <div className="valueCardDesc">
                한국어 시장 특성에 맞춘 시나리오 구조와 한국어 TTS를 기본 제공합니다.
                해외 도구의 한계를 넘어선 현지화된 경험을 제공합니다.
              </div>
            </div>
            <div className="valueCard">
              <div className="valueCardTitle">
                <span className="valueCardIcon">📊</span>
                데이터 기반
              </div>
              <div className="valueCardDesc">
                유튜브 알고리즘의 최신 트렌드와 시청 유지율 데이터를 반영한
                시나리오 구조로 실전에서 통하는 영상을 생성합니다.
              </div>
            </div>
            <div className="valueCard">
              <div className="valueCardTitle">
                <span className="valueCardIcon">⚡</span>
                빠른 제작
              </div>
              <div className="valueCardDesc">
                기획부터 완성까지 평균 5~10분. 하루에 여러 편의 영상을 시도하며
                채널 콘텐츠 양을 빠르게 늘릴 수 있습니다.
              </div>
            </div>
          </div>
        </section>

        {/* 작동 방식 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionIcon">⚙️</span>
            AlgoMaker는 이렇게 작동합니다
          </div>
          <div className="stepList">
            <div className="stepItem">
              <div className="stepTitle">키워드 입력</div>
              <div className="stepDesc">
                만들고 싶은 영상의 주제 키워드를 입력합니다.
                예: "2026 금리 전망", "AI 도구 TOP 5", "시니어 건강 관리" 등.
              </div>
            </div>
            <div className="stepItem">
              <div className="stepTitle">AI 시나리오 추천</div>
              <div className="stepDesc">
                AI가 12가지 시나리오 구조 중 키워드에 최적화된 3가지를 추천합니다.
                미스터리 추적, 결론 먼저, 해법 찾기 등 각 구조마다 다른 몰입감과 유지율을 보여줍니다.
              </div>
            </div>
            <div className="stepItem">
              <div className="stepTitle">세부 설정</div>
              <div className="stepDesc">
                영상 길이(5~20분), 말투(격식형/친근형/반말), 타겟(일반/시니어) 등을 선택합니다.
                원하는 경우 추가 키워드도 입력할 수 있습니다.
              </div>
            </div>
            <div className="stepItem">
              <div className="stepTitle">자동 생성</div>
              <div className="stepDesc">
                AI가 대본을 쓰고, 한국어 TTS로 음성을 합성하고, 적절한 이미지를 수집해
                영상을 합성합니다. 이 과정은 평균 5~10분이 소요됩니다.
              </div>
            </div>
            <div className="stepItem">
              <div className="stepTitle">다운로드 및 업로드</div>
              <div className="stepDesc">
                완성된 MP4 파일을 다운로드해 바로 유튜브에 업로드할 수 있습니다.
                썸네일과 제목은 크리에이터가 직접 만들어 개성을 담는 것을 권장드립니다.
              </div>
            </div>
          </div>
        </section>

        {/* 운영자 정보 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionIcon">🏢</span>
            운영자 정보
          </div>
          <div className="infoBox">
            <div className="infoRow">
              <div className="infoLabel">서비스명</div>
              <div className="infoValue">AlgoMaker (알고메이커)</div>
            </div>
            <div className="infoRow">
              <div className="infoLabel">운영</div>
              <div className="infoValue">한줄컴퍼니</div>
            </div>
            <div className="infoRow">
              <div className="infoLabel">대표</div>
              <div className="infoValue">박예준</div>
            </div>
            <div className="infoRow">
              <div className="infoLabel">서비스 개시</div>
              <div className="infoValue">2026년</div>
            </div>
            <div className="infoRow">
              <div className="infoLabel">분야</div>
              <div className="infoValue">AI 기반 영상 콘텐츠 자동화 도구</div>
            </div>
            <div className="infoRow">
              <div className="infoLabel">주요 기술</div>
              <div className="infoValue">Google Gemini · Edge TTS · Pexels · Next.js · FastAPI</div>
            </div>
            <div className="infoRow">
              <div className="infoLabel">문의</div>
              <div className="infoValue">
                <Link href="/contact" style={{ color: '#cc0000', textDecoration: 'underline' }}>
                  문의하기 페이지
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 콘텐츠 정책 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionIcon">📝</span>
            콘텐츠 정책
          </div>
          <div className="sectionBody">
            <p>
              AlgoMaker는 건전하고 유익한 콘텐츠 제작을 지향합니다.
              서비스는 다음 용도의 콘텐츠 제작에는 사용할 수 없습니다:
              허위 정보, 선정적 또는 폭력적 콘텐츠, 타인의 저작권을 침해하는 콘텐츠,
              특정 개인 또는 집단을 비방하는 콘텐츠, 도박·불법 금융 상품 관련 콘텐츠.
            </p>
            <p>
              사용자는 생성된 영상의 내용에 대해 최종적인 책임을 지며,
              유튜브 커뮤니티 가이드라인과 저작권법을 준수해야 합니다.
              자세한 내용은 <Link href="/terms" style={{ color: '#cc0000' }}>이용약관</Link>을 참고해주세요.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="cta">
          <div className="ctaTitle">🎬 지금 첫 영상을 만들어보세요</div>
          <div className="ctaSub">가입 없이 바로 시작 · 무료 · 한국어 완벽 지원</div>
          <div className="ctaBtns">
            <Link href="/" className="ctaBtn ctaBtnPrimary">
              영상 만들기 시작 →
            </Link>
            <Link href="/blog" className="ctaBtn ctaBtnSecondary">
              블로그 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
