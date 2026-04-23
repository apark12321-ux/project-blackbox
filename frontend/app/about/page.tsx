'use client';
/**
 * About 페이지 — 너튜브 NuTube 서비스 소개
 */

import Link from 'next/link';
import { DashboardShell, NuTubeLogo } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

export default function AboutPage() {
  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 24px 64px;
        }

        .hero {
          text-align: center;
          margin-bottom: 48px;
          padding: 40px 24px;
          background: linear-gradient(135deg, #fdf1e7 0%, #faf8f4 100%);
          border-radius: 20px;
        }
        .heroLogo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .heroTitle {
          font-size: 34px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 16px;
          color: #564a3a;
          line-height: 1.7;
          font-weight: 500;
          max-width: 560px;
          margin: 0 auto;
        }

        .sectionTitle {
          font-size: 22px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
          padding-left: 14px;
          border-left: 4px solid #c65f3b;
        }

        .section {
          margin-bottom: 40px;
        }
        .text {
          font-size: 15px;
          color: #2a2419;
          line-height: 1.8;
          margin-bottom: 14px;
        }
        .text strong {
          color: #c65f3b;
          font-weight: 800;
        }

        .valueGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 20px;
        }
        .valueCard {
          padding: 22px 24px;
          background: #faf8f4;
          border-radius: 14px;
          border-top: 3px solid #c65f3b;
        }
        .valueEmoji {
          font-size: 30px;
          margin-bottom: 12px;
          display: inline-block;
        }
        .valueTitle {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .valueDesc {
          font-size: 13px;
          color: #564a3a;
          line-height: 1.7;
        }

        .quote {
          background: #faf8f4;
          border-left: 4px solid #c65f3b;
          padding: 22px 26px;
          margin: 24px 0;
          border-radius: 0 10px 10px 0;
          font-size: 16px;
          color: #2a2419;
          line-height: 1.7;
          font-weight: 500;
          font-style: italic;
        }
        .quote strong {
          font-style: normal;
          color: #c65f3b;
          font-weight: 800;
        }

        .infoBox {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 12px;
          padding: 20px 24px;
          margin-top: 16px;
        }
        .infoRow {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px dashed rgba(90, 74, 58, 0.1);
          font-size: 14px;
        }
        .infoRow:last-child { border-bottom: none; }
        .infoLabel {
          min-width: 120px;
          color: #8a7d6a;
          font-weight: 700;
        }
        .infoValue {
          color: #2a2419;
          font-weight: 500;
          flex: 1;
        }

        .cta {
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          border-radius: 16px;
          padding: 32px 28px;
          text-align: center;
          color: #fff;
          margin-top: 40px;
        }
        .ctaTitle {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.025em;
          margin-bottom: 12px;
        }
        .ctaText {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 22px;
        }
        .ctaBtn {
          display: inline-block;
          padding: 14px 28px;
          background: #fff;
          color: #c65f3b;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.01em;
          transition: all 0.18s;
        }
        .ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .adWrap {
          margin: 32px 0;
        }

        @media (max-width: 768px) {
          .page { padding: 24px 16px 48px; }
          .hero { padding: 30px 20px; }
          .heroTitle { font-size: 26px; }
          .heroSub { font-size: 14px; }
          .valueGrid { grid-template-columns: 1fr; }
          .sectionTitle { font-size: 18px; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="heroLogo">
            <NuTubeLogo size="lg" showSubtitle={false} />
          </div>
          <h1 className="heroTitle">
            너튜브 시작,<br />
            <span className="accent">너도 할 수 있어요</span>
          </h1>
          <p className="heroSub">
            너튜브는 유튜브 시작을 고민하는 모든 분들을 위해 만들어졌어요.
            프로들이 쓰는 노하우가 AI에 자동으로 녹아있는,
            한국어 최적화 영상 제작 스튜디오입니다.
          </p>
        </section>

        {/* 왜 만들었나 */}
        <section className="section">
          <h2 className="sectionTitle">왜 너튜브를 만들었나요</h2>
          <p className="text">
            유튜브를 시작하고 싶은 분들은 많아요. 근데 문제는 <strong>"어디서부터 시작해야 할지 모르겠다"</strong>는 거예요.
          </p>
          <p className="text">
            제목은 어떻게 지어야 조회수가 터지는지, 썸네일은 어떻게 만들어야 클릭률이 높아지는지,
            대본 구조는 어떻게 짜야 시청자가 끝까지 보는지… 전문 지식이 너무 많아요.
          </p>
          <div className="quote">
            "이 모든 노하우를 일반인도 쉽게 쓸 수 있다면?"<br />
            <strong>그게 바로 너튜브가 시작된 이유예요.</strong>
          </div>
          <p className="text">
            프로 너튜버들이 수년간 시행착오로 쌓은 노하우 12가지를 <strong>AI에 자동으로 반영</strong>해,
            키워드 하나만 입력하면 검증된 구조의 영상이 만들어져요.
          </p>
        </section>

        {/* 4가지 핵심 가치 */}
        <section className="section">
          <h2 className="sectionTitle">너튜브의 약속</h2>
          <div className="valueGrid">
            <div className="valueCard">
              <div className="valueEmoji">🎯</div>
              <div className="valueTitle">검증된 노하우</div>
              <div className="valueDesc">
                2026 유튜브 알고리즘 기준, 구독자 10만+ 채널들의 검증된 공식만 반영해요.
              </div>
            </div>
            <div className="valueCard">
              <div className="valueEmoji">🆓</div>
              <div className="valueTitle">완전 무료</div>
              <div className="valueDesc">
                가입 없음, 결제 없음. 바로 키워드 넣고 영상 받으세요. 영원히 무료예요.
              </div>
            </div>
            <div className="valueCard">
              <div className="valueEmoji">🇰🇷</div>
              <div className="valueTitle">한국어 최적화</div>
              <div className="valueDesc">
                자연스러운 한국어 내레이션, 한국 시청자 취향, 한국 시장 트렌드 반영해요.
              </div>
            </div>
            <div className="valueCard">
              <div className="valueEmoji">⚡</div>
              <div className="valueTitle">5분 자동화</div>
              <div className="valueDesc">
                대본·음성·이미지·편집까지 전부 자동. 너는 키워드만 입력하면 끝이에요.
              </div>
            </div>
          </div>
        </section>

        <div className="adWrap">
          <AdSlot slot="about-mid" variant="horizontal" />
        </div>

        {/* 서비스 운영 정보 */}
        <section className="section">
          <h2 className="sectionTitle">서비스 운영 정보</h2>
          <div className="infoBox">
            <div className="infoRow">
              <span className="infoLabel">서비스명</span>
              <span className="infoValue">너튜브 NuTube</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">운영사</span>
              <span className="infoValue">한줄컴퍼니</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">대표자</span>
              <span className="infoValue">박예준</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">웹사이트</span>
              <span className="infoValue">https://nutube.kr</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">문의 이메일</span>
              <span className="infoValue">contact@nutube.kr</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">서비스 시작</span>
              <span className="infoValue">2026년 4월</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta">
          <h3 className="ctaTitle">지금 바로 너튜브 시작하기</h3>
          <p className="ctaText">
            복잡한 설정 없이, 키워드 하나만 넣으면 끝이에요.<br />
            너튜브가 너도 할 수 있게 도와드릴게요.
          </p>
          <Link href="/" className="ctaBtn">
            무료로 시작하기 →
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
