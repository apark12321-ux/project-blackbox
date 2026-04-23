'use client';
/**
 * 블로그 글: 노하우 05 - 첫 30초 훅 3종 법칙
 *
 * URL: /knowhow/first-30-seconds-hook
 * 타겟 키워드: "유튜브 인트로 만들기", "유튜브 첫 30초"
 * 월 검색량: 5,400회
 *
 * 이 페이지는 노하우 글 12개의 공통 템플릿입니다.
 */

import Link from 'next/link';
import { DashboardShell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';

export default function Knowhow05Page() {
  const publishedDate = '2026년 4월 23일';
  const readingTime = '8분';

  return (
    <DashboardShell>
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
        .breadcrumb a:hover {
          color: #c65f3b;
        }
        .breadcrumb .sep {
          color: #b8ad9b;
        }

        /* ============ HERO ============ */
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
        .heroTitle .accent {
          color: #c65f3b;
        }
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
        .heroMetaItem {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .heroMetaDot {
          width: 4px;
          height: 4px;
          background: #b8ad9b;
          border-radius: 50%;
        }

        /* ============ TOC ============ */
        .toc {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 32px;
        }
        .tocLabel {
          font-size: 11px;
          font-weight: 800;
          color: #8a7d6a;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .tocList {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tocList li {
          margin-bottom: 6px;
        }
        .tocList li:last-child {
          margin-bottom: 0;
        }
        .tocLink {
          font-size: 13.5px;
          color: #564a3a;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.15s;
        }
        .tocLink:hover {
          color: #c65f3b;
        }
        .tocNum {
          font-size: 10px;
          font-weight: 800;
          color: #c65f3b;
          min-width: 20px;
        }

        /* ============ SUMMARY BOX ============ */
        .summaryBox {
          background: linear-gradient(135deg, #fdf1e7 0%, #faf8f4 100%);
          border: 1px solid rgba(198, 95, 59, 0.2);
          border-left: 4px solid #c65f3b;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 32px;
        }
        .summaryLabel {
          font-size: 11px;
          font-weight: 800;
          color: #a64a2a;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .summaryText {
          font-size: 15px;
          color: #2a2419;
          font-weight: 600;
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        /* ============ SECTION ============ */
        .section {
          margin-bottom: 40px;
        }
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

        /* ============ HIGHLIGHT BOX ============ */
        .highlightBox {
          background: #fff;
          border: 2px solid #c65f3b;
          border-radius: 14px;
          padding: 24px 28px;
          margin: 24px 0;
        }
        .highlightLabel {
          display: inline-block;
          padding: 4px 10px;
          background: #c65f3b;
          color: #fff;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .highlightNumber {
          font-size: 36px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .highlightText {
          font-size: 15px;
          color: #2a2419;
          line-height: 1.6;
          font-weight: 600;
        }

        /* ============ HOOK CARD ============ */
        .hookCard {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.1);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 20px;
          position: relative;
        }
        .hookCard.curiosity {
          border-left: 6px solid #c65f3b;
        }
        .hookCard.benefit {
          border-left: 6px solid #d4a545;
        }
        .hookCard.loss {
          border-left: 6px solid #7d9b7c;
        }
        .hookHead {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .hookEmoji {
          font-size: 32px;
          line-height: 1;
        }
        .hookTitleBlock {
          flex: 1;
        }
        .hookTag {
          font-size: 11px;
          font-weight: 800;
          color: #8a7d6a;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .hookName {
          font-size: 20px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .hookDesc {
          font-size: 14px;
          color: #564a3a;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .hookExamples {
          background: #faf8f4;
          border-radius: 10px;
          padding: 16px 18px;
          margin-bottom: 14px;
        }
        .hookExamplesLabel {
          font-size: 11px;
          font-weight: 800;
          color: #8a7d6a;
          margin-bottom: 10px;
          letter-spacing: 0.05em;
        }
        .hookExample {
          font-size: 13.5px;
          color: #2a2419;
          line-height: 1.6;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(90, 74, 58, 0.08);
          font-style: italic;
        }
        .hookExample:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .hookExample::before {
          content: '"';
          color: #c65f3b;
          font-weight: 800;
          margin-right: 2px;
        }
        .hookExample::after {
          content: '"';
          color: #c65f3b;
          font-weight: 800;
        }
        .hookPrinciple {
          padding: 12px 16px;
          background: #fdf1e7;
          border-radius: 8px;
          font-size: 13px;
          color: #564a3a;
          line-height: 1.6;
        }
        .hookPrinciple strong {
          color: #c65f3b;
          font-weight: 800;
        }

        /* ============ VS TABLE ============ */
        .vsTable {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 24px 0;
        }
        .vsCol {
          padding: 20px 22px;
          border-radius: 12px;
        }
        .vsCol.bad {
          background: #fce8e8;
          border: 1px solid rgba(185, 74, 74, 0.2);
        }
        .vsCol.good {
          background: #eaf2ea;
          border: 1px solid rgba(125, 155, 124, 0.3);
        }
        .vsLabel {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .vsLabel.bad {
          background: #b94a4a;
          color: #fff;
        }
        .vsLabel.good {
          background: #5e7e5d;
          color: #fff;
        }
        .vsItem {
          font-size: 13.5px;
          color: #2a2419;
          line-height: 1.6;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
        }
        .vsItem:last-child {
          border-bottom: none;
        }

        /* ============ PREMIUM INSIGHT ============ */
        .premiumInsight {
          background: linear-gradient(135deg, #3a332a 0%, #2a2419 100%);
          color: #f5f1ea;
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          position: relative;
          overflow: hidden;
        }
        .premiumInsight::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(198, 95, 59, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .premiumBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
          letter-spacing: -0.01em;
        }
        .premiumTitle {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .premiumText {
          font-size: 15px;
          color: rgba(245, 241, 234, 0.9);
          line-height: 1.8;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .premiumText strong {
          color: #f5a26b;
          font-weight: 800;
        }
        .premiumList {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .premiumList li {
          font-size: 14px;
          color: rgba(245, 241, 234, 0.9);
          line-height: 1.8;
          padding-left: 24px;
          position: relative;
          margin-bottom: 8px;
        }
        .premiumList li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #f5a26b;
          font-weight: 800;
        }

        /* ============ TEMPLATES ============ */
        .templates {
          background: #faf8f4;
          border-radius: 14px;
          padding: 24px 28px;
          margin: 24px 0;
        }
        .templatesLabel {
          font-size: 12px;
          font-weight: 800;
          color: #a64a2a;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .templateItem {
          padding: 14px 16px;
          background: #fff;
          border-radius: 8px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #2a2419;
          line-height: 1.6;
          border-left: 3px solid #d4a545;
          font-style: italic;
        }
        .templateItem:last-child {
          margin-bottom: 0;
        }
        .templateNum {
          display: inline-block;
          color: #d4a545;
          font-weight: 800;
          margin-right: 8px;
          font-style: normal;
        }

        /* ============ CHECKLIST ============ */
        .checklist {
          background: #eaf2ea;
          border-radius: 14px;
          padding: 24px 28px;
          margin: 24px 0;
        }
        .checklistLabel {
          font-size: 12px;
          font-weight: 800;
          color: #5e7e5d;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .checklistItem {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          font-size: 14px;
          color: #2a2419;
          line-height: 1.6;
          border-bottom: 1px dashed rgba(94, 126, 93, 0.2);
        }
        .checklistItem:last-child {
          border-bottom: none;
        }
        .checklistBox {
          width: 18px;
          height: 18px;
          border: 2px solid #5e7e5d;
          border-radius: 4px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ============ CTA ============ */
        .cta {
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          border-radius: 16px;
          padding: 36px 32px;
          text-align: center;
          color: #fff;
          margin: 32px 0;
        }
        .ctaTitle {
          font-size: 24px;
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
          margin-bottom: 22px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .ctaBtn {
          display: inline-block;
          padding: 14px 28px;
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

        /* ============ RELATED ============ */
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

        /* ============ AD WRAP ============ */
        .adWrap {
          margin: 32px 0;
        }

        @media (max-width: 768px) {
          .page {
            padding: 0 16px 32px;
          }
          .heroTitle {
            font-size: 28px;
          }
          .heroSub {
            font-size: 15px;
          }
          .sectionTitle {
            font-size: 20px;
          }
          .vsTable {
            grid-template-columns: 1fr;
          }
          .relatedGrid {
            grid-template-columns: 1fr;
          }
          .premiumInsight {
            padding: 24px 20px;
          }
          .premiumTitle {
            font-size: 20px;
          }
          .cta {
            padding: 28px 20px;
          }
          .ctaTitle {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="page">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog">블로그</Link>
          <span className="sep">/</span>
          <span>첫 30초 훅 3종 법칙</span>
        </nav>

        {/* HERO */}
        <header className="hero">
          <div className="heroTag">🎯 노하우 05 · 제작 단계</div>
          <h1 className="heroTitle">
            첫 30초에 <span className="accent">70%</span>를 남게 하는<br />
            유튜브 훅 3종 법칙
          </h1>
          <p className="heroSub">
            2026년 유튜브 알고리즘은 "Quality CTR"을 본다.
            클릭만으로는 부족하고, 첫 30초를 버티게 해야 추천된다.
            프로 크리에이터들이 쓰는 3가지 검증된 훅 공식을 공개한다.
          </p>
          <div className="heroMeta">
            <span className="heroMetaItem">
              📅 {publishedDate}
            </span>
            <span className="heroMetaDot" />
            <span className="heroMetaItem">
              ⏱ 읽는 시간 {readingTime}
            </span>
            <span className="heroMetaDot" />
            <span className="heroMetaItem">
              🏷️ 제작 노하우
            </span>
          </div>
        </header>

        {/* TOC */}
        <nav className="toc">
          <div className="tocLabel">이 글에서 배우는 것</div>
          <ul className="tocList">
            <li><a href="#why" className="tocLink"><span className="tocNum">01</span>왜 첫 30초가 결정적인가</a></li>
            <li><a href="#hooks" className="tocLink"><span className="tocNum">02</span>훅 3종 법칙 (호기심/이득/손실)</a></li>
            <li><a href="#comparison" className="tocLink"><span className="tocNum">03</span>좋은 훅 vs 나쁜 훅</a></li>
            <li><a href="#secrets" className="tocLink"><span className="tocNum">04</span>일반인이 모르는 비밀</a></li>
            <li><a href="#templates" className="tocLink"><span className="tocNum">05</span>실전 훅 템플릿 15개</a></li>
            <li><a href="#checklist" className="tocLink"><span className="tocNum">06</span>업로드 전 체크리스트</a></li>
          </ul>
        </nav>

        {/* SUMMARY */}
        <div className="summaryBox">
          <div className="summaryLabel">📋 한줄 요약</div>
          <div className="summaryText">
            첫 30초에 시청자 70%가 남지 않으면 유튜브 알고리즘이 즉시 추천을 중단한다.
            호기심·이득·손실 중 하나의 훅을 <strong>15초 안에</strong> 던져야 한다.
          </div>
        </div>

        {/* Section 1: Why */}
        <section className="section" id="why">
          <h2 className="sectionTitle">왜 첫 30초가 결정적인가</h2>
          <p className="sectionText">
            2026년 유튜브는 완전히 새로운 방식으로 영상을 평가한다.
            예전엔 클릭만 받으면 알고리즘이 밀어줬지만, 이제는 다르다.
            유튜브 엔지니어들이 <strong>"Quality CTR"</strong>이라 부르는 개념이 핵심이다.
          </p>
          <p className="sectionText">
            Quality CTR은 단순히 클릭 수가 아니라, 클릭 후 시청자가 얼마나 버티는지를 측정한다.
            클릭률이 높아도 첫 15~30초에 대거 이탈하면,
            알고리즘은 해당 영상을 <strong>"약속을 지키지 못한 영상"</strong>으로 분류하고 추천을 중단한다.
          </p>

          <div className="highlightBox">
            <span className="highlightLabel">⚠️ 2026 알고리즘 기준</span>
            <div className="highlightNumber">70%</div>
            <div className="highlightText">
              첫 30초 유지율 <strong style={{color: '#c65f3b'}}>70% 미만</strong>이면
              알고리즘이 추천을 즉시 중단한다.
              나머지 시청 시간이 아무리 좋아도 만회할 수 없다.
            </div>
          </div>

          <p className="sectionText">
            실제 데이터를 보면 충격적이다. 평균 유튜브 영상은 시청자의 <strong>23.7%만 남는다</strong>.
            6명 중 1명만 50% 이상 유지율을 기록한다.
            이 차이를 만드는 건 바로 <strong>첫 30초의 훅</strong>이다.
          </p>
        </section>

        {/* 광고 #1 */}
        <div className="adWrap">
          <AdSlot slot="blog-post-top" variant="horizontal" />
        </div>

        {/* Section 2: Hooks */}
        <section className="section" id="hooks">
          <h2 className="sectionTitle">훅 3종 법칙</h2>
          <p className="sectionText">
            프로 크리에이터들이 검증한 3가지 훅 공식이 있다.
            각각 시청자의 다른 심리 버튼을 누른다.
            중요한 건, 이 중 <strong>반드시 하나는</strong> 첫 15초 안에 등장해야 한다는 것이다.
          </p>

          {/* Hook 1: Curiosity */}
          <div className="hookCard curiosity">
            <div className="hookHead">
              <span className="hookEmoji">🎣</span>
              <div className="hookTitleBlock">
                <div className="hookTag">HOOK 1</div>
                <div className="hookName">호기심 질문형</div>
              </div>
            </div>
            <div className="hookDesc">
              시청자의 뇌에 <strong>정보 공백</strong>을 만든다.
              인간의 뇌는 공백을 혐오하기 때문에, 답을 알기 전에는 이탈하지 못한다.
              심리학 용어로 <strong>'지식 격차 이론(Information Gap Theory)'</strong>이라 부른다.
            </div>
            <div className="hookExamples">
              <div className="hookExamplesLabel">실전 예시</div>
              <div className="hookExample">당신이 매일 쓰는 이 앱이 사실 수면을 망치고 있다면?</div>
              <div className="hookExample">금리가 내렸는데 왜 은행 이자는 그대로일까?</div>
              <div className="hookExample">하루 10분 투자로 시청자 10만을 만든 영상 공식이 있다면?</div>
            </div>
            <div className="hookPrinciple">
              <strong>심리 원리:</strong> 뇌의 정보 공백 자극 → 답을 알기 전엔 이탈 불가.
              특히 <strong>"~하고 있다면?"</strong>, <strong>"왜 ~일까?"</strong> 형태가 가장 강력하다.
            </div>
          </div>

          {/* Hook 2: Benefit */}
          <div className="hookCard benefit">
            <div className="hookHead">
              <span className="hookEmoji">💰</span>
              <div className="hookTitleBlock">
                <div className="hookTag">HOOK 2</div>
                <div className="hookName">이득 약속형</div>
              </div>
            </div>
            <div className="hookDesc">
              시청자가 끝까지 봤을 때 얻게 될 <strong>구체적 가치</strong>를 약속한다.
              단, 추상적 약속은 안 된다. "도움이 됩니다"는 약속이 아니다.
              <strong>"월 30만원"</strong>, <strong>"8분"</strong> 같은 숫자로 구체화해야 한다.
            </div>
            <div className="hookExamples">
              <div className="hookExamplesLabel">실전 예시</div>
              <div className="hookExample">이 영상 8분만 보시면, 월 30만원이 달라집니다.</div>
              <div className="hookExample">끝까지 보면 썸네일 CTR 2배 올리는 공식 알려드려요.</div>
              <div className="hookExample">마지막에 3번은 꼭 들으셔야 할 핵심 팁이 있습니다.</div>
            </div>
            <div className="hookPrinciple">
              <strong>심리 원리:</strong> 손실 회피 심리 → 이득을 놓치기 싫어 끝까지 시청.
              <strong>"마지막에 ~가 있습니다"</strong> 패턴이 유지율을 60% 이상 끌어올린다.
            </div>
          </div>

          {/* Hook 3: Loss */}
          <div className="hookCard loss">
            <div className="hookHead">
              <span className="hookEmoji">⚠️</span>
              <div className="hookTitleBlock">
                <div className="hookTag">HOOK 3</div>
                <div className="hookName">손실 경고형</div>
              </div>
            </div>
            <div className="hookDesc">
              시청자가 현재 모르는 것 때문에 <strong>잃고 있는 것</strong>을 경고한다.
              긴급성과 두려움을 동시에 자극해 <strong>즉시 집중</strong>하게 만든다.
              경제·건강·재테크 주제에 가장 효과적이다.
            </div>
            <div className="hookExamples">
              <div className="hookExamplesLabel">실전 예시</div>
              <div className="hookExample">아직 이거 모르면 매달 20만원 손해 보고 계십니다.</div>
              <div className="hookExample">지금 이 실수 안 고치면, 평생 유튜브 성공 못 합니다.</div>
              <div className="hookExample">올해 안에 이거 안 하면 3년 뒤 정말 후회합니다.</div>
            </div>
            <div className="hookPrinciple">
              <strong>심리 원리:</strong> 두려움·긴급성 자극 → 즉시 집중.
              단, <strong>근거 없는 과장은 역효과</strong>다. 구체적 숫자나 시점을 반드시 포함해야 신뢰감이 유지된다.
            </div>
          </div>
        </section>

        {/* Section 3: VS Table */}
        <section className="section" id="comparison">
          <h2 className="sectionTitle">좋은 훅 vs 나쁜 훅</h2>
          <p className="sectionText">
            같은 주제라도 시작 방식에 따라 유지율이 <strong>3배 이상</strong> 차이난다.
            아래는 실제 크리에이터들의 비교 데이터다.
          </p>

          <div className="vsTable">
            <div className="vsCol bad">
              <span className="vsLabel bad">❌ 나쁜 예</span>
              <div className="vsItem">"안녕하세요 여러분~ 오늘은 재테크 이야기를 해볼게요..."</div>
              <div className="vsItem">"저번 영상 봐주신 분들 감사드려요. 구독 눌러주세요."</div>
              <div className="vsItem">"오늘은 요즘 핫한 주제에 대해 알려드릴게요."</div>
              <div className="vsItem">"영상 시작하기 전에 채널 소개부터 할게요."</div>
            </div>
            <div className="vsCol good">
              <span className="vsLabel good">✅ 좋은 예</span>
              <div className="vsItem">"이것만 알면 올해 세금 150만원 덜 냅니다."</div>
              <div className="vsItem">"왜 부자들은 이 시기에 이 자산을 사는 걸까요?"</div>
              <div className="vsItem">"이 실수만 안 해도 수익률이 40% 올라갑니다."</div>
              <div className="vsItem">"끝까지 보시면 3번째 방법이 왜 가장 효과적인지 알려드립니다."</div>
            </div>
          </div>
        </section>

        {/* 광고 #2 */}
        <div className="adWrap">
          <AdSlot slot="blog-post-mid" variant="horizontal" />
        </div>

        {/* Section 4: Premium Insight */}
        <section className="section" id="secrets">
          <div className="premiumInsight">
            <span className="premiumBadge">🔥 일반인이 모르는 비밀</span>
            <h2 className="premiumTitle">
              훅보다 더 중요한 것:<br />
              자기소개 "늦추기" 전략
            </h2>
            <p className="premiumText">
              인트로 길이가 <strong>15초를 넘으면 20%가 이탈</strong>한다.
              근데 많은 초보 크리에이터가 훅을 잘 만들어놓고, 자기소개로 망친다.
            </p>
            <p className="premiumText">
              <strong>"안녕하세요, OO 채널의 OO입니다"</strong>로 시작하면
              첫 주 조회수가 <strong>40% 감소</strong>한다는 연구 결과가 있다.
              알고리즘이 "시청 시간 짧은 영상"으로 학습하기 때문이다.
            </p>
            <p className="premiumText" style={{ marginBottom: 20 }}>
              <strong style={{color: '#f5a26b'}}>프로들이 쓰는 전략:</strong>
            </p>
            <ul className="premiumList">
              <li>0초~15초: 훅 폭탄 (질문/이득/경고 중 1개)</li>
              <li>15초~30초: 훅에 대한 구체적 맛보기 (답은 아직)</li>
              <li>30초~50초: 그제서야 자기소개 + 채널 정체성</li>
              <li>50초~2분: 로드맵 ("오늘 3가지 알려드립니다")</li>
              <li>2분~: 본문 시작</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Templates */}
        <section className="section" id="templates">
          <h2 className="sectionTitle">실전 훅 템플릿 15개</h2>
          <p className="sectionText">
            당신의 주제에 숫자와 키워드만 바꿔 넣으면 되는 검증된 템플릿들이다.
            실제 조회수 10만 이상 달성한 영상들에서 추출했다.
          </p>

          <div className="templates">
            <div className="templatesLabel">🎣 호기심 질문형 (5개)</div>
            <div className="templateItem"><span className="templateNum">01.</span>당신이 매일 [행동하는 것]이 사실 [부정적 결과]를 만든다면?</div>
            <div className="templateItem"><span className="templateNum">02.</span>왜 [특정 집단]은 [남들과 다른 행동]을 할까요?</div>
            <div className="templateItem"><span className="templateNum">03.</span>[주제]에 대해 90%가 모르는 한 가지 비밀이 있습니다.</div>
            <div className="templateItem"><span className="templateNum">04.</span>[유명 사례]가 성공한 진짜 이유, 아직도 오해하고 계신가요?</div>
            <div className="templateItem"><span className="templateNum">05.</span>[특정 상황]에서 [반전 현상]이 일어나는 이유, 아세요?</div>
          </div>

          <div className="templates">
            <div className="templatesLabel">💰 이득 약속형 (5개)</div>
            <div className="templateItem"><span className="templateNum">06.</span>이 영상 [시간]만 보시면, [구체적 이득]이 생깁니다.</div>
            <div className="templateItem"><span className="templateNum">07.</span>끝까지 보시면 [가장 중요한 정보]를 공개할게요.</div>
            <div className="templateItem"><span className="templateNum">08.</span>[숫자] 단계로 [결과]를 만드는 방법, 바로 알려드립니다.</div>
            <div className="templateItem"><span className="templateNum">09.</span>오늘 이 영상 하나로 [고민]이 완전히 해결됩니다.</div>
            <div className="templateItem"><span className="templateNum">10.</span>마지막에 [특별한 보너스/팁]이 있으니 꼭 끝까지 보세요.</div>
          </div>

          <div className="templates">
            <div className="templatesLabel">⚠️ 손실 경고형 (5개)</div>
            <div className="templateItem"><span className="templateNum">11.</span>아직 [이것] 모르면 매달 [구체적 손실] 중입니다.</div>
            <div className="templateItem"><span className="templateNum">12.</span>지금 [행동] 안 하면, [시점]에 반드시 후회합니다.</div>
            <div className="templateItem"><span className="templateNum">13.</span>[이 실수] 하고 계시다면, 지금 당장 영상 멈추고 확인하세요.</div>
            <div className="templateItem"><span className="templateNum">14.</span>[긴급한 상황] 때문에 [부정적 결과]를 겪는 사람들이 늘고 있습니다.</div>
            <div className="templateItem"><span className="templateNum">15.</span>[특정 시기]가 지나기 전에 꼭 알아야 할 [중요 정보]입니다.</div>
          </div>
        </section>

        {/* Section 6: Checklist */}
        <section className="section" id="checklist">
          <h2 className="sectionTitle">업로드 전 체크리스트</h2>
          <p className="sectionText">
            영상 업로드 전, 이 체크리스트로 훅을 점검해보자.
            하나라도 해당 안 되면 첫 30초를 다시 녹화하는 게 낫다.
          </p>

          <div className="checklist">
            <div className="checklistLabel">✅ 훅 점검 체크리스트</div>
            <div className="checklistItem">
              <div className="checklistBox" />
              <div>훅이 <strong>15초 안에</strong> 등장하는가?</div>
            </div>
            <div className="checklistItem">
              <div className="checklistBox" />
              <div>3종 법칙 (호기심/이득/손실) 중 <strong>하나 이상</strong> 포함되는가?</div>
            </div>
            <div className="checklistItem">
              <div className="checklistBox" />
              <div>추상적 약속 대신 <strong>구체적 숫자</strong>가 들어갔는가?</div>
            </div>
            <div className="checklistItem">
              <div className="checklistBox" />
              <div><strong>자기소개를 뒤로</strong> 미뤘는가? (30초 이후)</div>
            </div>
            <div className="checklistItem">
              <div className="checklistBox" />
              <div>썸네일·제목의 <strong>약속을 지키는</strong> 훅인가?</div>
            </div>
            <div className="checklistItem">
              <div className="checklistBox" />
              <div>첫 30초에 <strong>"구독해주세요"</strong> 안 들어갔는가? (시청 방해)</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta">
          <h3 className="ctaTitle">
            이 노하우가 자동으로 적용되는<br />
            AlgoMaker를 만나보세요
          </h3>
          <p className="ctaText">
            키워드만 입력하면 AlgoMaker가 3종 훅 중 최적의 하나를 자동으로 선택해
            대본 첫 30초에 삽입합니다. 직접 훅 고민 안 하셔도 돼요.
          </p>
          <Link href="/" className="ctaBtn">
            무료로 영상 만들기 →
          </Link>
        </div>

        {/* Related */}
        <section className="related">
          <h3 className="relatedTitle">📚 함께 읽으면 좋은 노하우</h3>
          <div className="relatedGrid">
            <Link href="/knowhow/8min-hook-points" className="relatedCard">
              <div className="relatedTag">노하우 06</div>
              <div className="relatedName">8분 후킹 포인트 시스템</div>
              <div className="relatedDesc">첫 30초 다음엔 5분 지점이 중요하다</div>
            </Link>
            <Link href="/knowhow/algorithm-script-structure" className="relatedCard">
              <div className="relatedTag">노하우 08</div>
              <div className="relatedName">알고리즘 친화 대본 구조</div>
              <div className="relatedDesc">훅부터 클로징까지 황금 공식</div>
            </Link>
            <Link href="/knowhow/retention-editing-rhythm" className="relatedCard">
              <div className="relatedTag">노하우 07</div>
              <div className="relatedName">유지율 극대화 편집 리듬</div>
              <div className="relatedDesc">훅 뒤의 편집이 결정한다</div>
            </Link>
          </div>
        </section>

        {/* 광고 #3 */}
        <div className="adWrap">
          <AdSlot slot="blog-post-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
