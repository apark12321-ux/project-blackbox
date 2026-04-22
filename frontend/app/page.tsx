'use client';
/**
 * AlgoMaker v12.1 - 홈 (개선판)
 * - 프로세스 카드 정렬 개선 (3+2 → 중앙 정렬 + 마지막 와이드)
 * - 빨강 톤 다운 (#E50914)
 * - 버튼 일관성
 * - 메타 정보 추가 (아바타, 조회수 스타일)
 * - 샘플 영상 카드 섹션 신규
 * - 통계 카드화
 * - 선언 섹션 (작게)
 * - FAQ 시각적 개선
 */

import Link from 'next/link';
import { useState } from 'react';
import { V11Shell } from './_shared/V11Shell';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <V11Shell>
      <style jsx>{`
        /* ============ HERO ============ */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 24px 56px;
          text-align: center;
        }
        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #fff0f0;
          color: #cc0000;
          border: 1px solid #ffd4d4;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .heroTitle {
          font-size: 52px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.03em;
          line-height: 1.12;
          margin: 0 0 18px;
        }
        .heroTitleAccent { color: #cc0000; }
        .heroSub {
          font-size: 17px;
          color: #606060;
          line-height: 1.7;
          max-width: 600px;
          margin: 0 auto 32px;
        }
        .heroCtas {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .primaryBtn {
          padding: 14px 28px;
          background: #cc0000;
          color: #fff;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
          border: 2px solid #cc0000;
        }
        .primaryBtn:hover { background: #a80000; border-color: #a80000; }
        .secondaryBtn {
          padding: 14px 28px;
          background: #fff;
          color: #0f0f0f;
          border: 2px solid #e5e5e5;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .secondaryBtn:hover { border-color: #0f0f0f; }

        /* Stats - card style */
        .heroStats {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          max-width: 620px;
          margin: 0 auto;
        }
        .statBox {
          flex: 1;
          min-width: 140px;
          padding: 18px 16px;
          background: #f9f9f9;
          border-radius: 14px;
          text-align: center;
          transition: all 0.15s;
        }
        .statBox:hover { background: #f2f2f2; }
        .statIcon { font-size: 22px; margin-bottom: 6px; }
        .statNum {
          font-size: 26px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .statLabel { font-size: 12px; color: #606060; margin-top: 6px; }

        /* ============ MANIFEST (작은 선언) ============ */
        .manifest {
          background: #0f0f0f;
          color: #fff;
          padding: 40px 24px;
          text-align: center;
        }
        .manifestInner {
          max-width: 780px;
          margin: 0 auto;
        }
        .manifestLabel {
          font-size: 11px;
          font-weight: 700;
          color: #cc0000;
          letter-spacing: 0.2em;
          margin-bottom: 10px;
        }
        .manifestText {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.7;
          letter-spacing: -0.01em;
          color: #fff;
          margin: 0;
        }
        .manifestText em {
          font-style: normal;
          color: #ff6b6b;
        }

        /* ============ SECTION ============ */
        .section {
          padding: 64px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .sectionSoft {
          background: #f9f9f9;
          padding: 64px 24px;
        }
        .sectionSoftInner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sectionHead {
          text-align: center;
          margin-bottom: 40px;
        }
        .sectionLabel {
          display: inline-block;
          padding: 4px 12px;
          background: #fff0f0;
          color: #cc0000;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .sectionTitle {
          font-size: 32px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .sectionSub {
          font-size: 15px;
          color: #606060;
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto;
        }

        /* ============ PROCESS CARDS (개선) ============ */
        .processGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .processCard {
          grid-column: span 1;
        }
        .processLastRow {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 18px;
          margin-top: 18px;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }
        .card {
          cursor: default;
          transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-2px); }
        .thumb {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 54px;
          color: #fff;
        }
        .thumbWide { aspect-ratio: 21/9; }
        .thumb1 { background: linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%); }
        .thumb2 { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); }
        .thumb3 { background: linear-gradient(135deg, #ffa751 0%, #ffe259 100%); }
        .thumb4 { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .thumb5 { background: linear-gradient(135deg, #7F7FD5 0%, #86A8E7 100%); }
        .thumbDuration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .thumbStep {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.75);
          color: #fff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
        }
        .cardMeta {
          padding: 12px 4px 0;
          display: flex;
          gap: 10px;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          flex-shrink: 0;
        }
        .cardText { flex: 1; min-width: 0; }
        .cardTitle {
          font-size: 14px;
          font-weight: 700;
          color: #0f0f0f;
          margin: 0 0 3px;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .cardSub {
          font-size: 12px;
          color: #606060;
          line-height: 1.5;
          margin: 0 0 2px;
        }
        .cardStats {
          font-size: 11px;
          color: #888;
        }

        /* ============ SAMPLE VIDEOS ============ */
        .sampleGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .sampleCard {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .sampleCard:hover { transform: translateY(-2px); }
        .sampleThumb {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .sampleThumbA { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
        .sampleThumbB { background: linear-gradient(135deg, #2d1b4e 0%, #5a189a 100%); }
        .sampleThumbC { background: linear-gradient(135deg, #134e4a 0%, #042f2e 100%); }
        .sampleHeading {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          padding: 20px;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }
        .playBadge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 56px;
          height: 56px;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .sampleCard:hover .playBadge { opacity: 1; }

        /* ============ TABLE ============ */
        .tableWrap {
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e5e5;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 540px;
        }
        .th {
          padding: 14px 16px;
          text-align: center;
          font-weight: 700;
          color: #0f0f0f;
          background: #f9f9f9;
          border-bottom: 1px solid #e5e5e5;
          font-size: 13px;
        }
        .thAccent { color: #cc0000; background: #fff0f0; }
        .td {
          padding: 12px 16px;
          text-align: center;
          color: #606060;
          border-bottom: 1px solid #e5e5e5;
        }
        .tr:last-child .td { border-bottom: none; }
        .tdLabel { text-align: left; color: #0f0f0f; font-weight: 500; }
        .tdAccent { color: #cc0000; font-weight: 700; background: #fffafa; }

        /* ============ FAQ ============ */
        .faqList {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .faqItem {
          padding: 16px 20px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .faqItem:hover { border-color: #cc0000; }
        .faqItemOpen {
          border-color: #cc0000;
          background: #fffafa;
        }
        .faqQRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }
        .faqQ {
          font-size: 15px;
          font-weight: 600;
          color: #0f0f0f;
          flex: 1;
        }
        .faqPlus {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f2f2f2;
          color: #606060;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 400;
          line-height: 1;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .faqItemOpen .faqPlus {
          background: #cc0000;
          color: #fff;
        }
        .faqA {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #606060;
          line-height: 1.7;
        }

        /* ============ FINAL CTA (강화) ============ */
        .finalCta {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          padding: 72px 24px;
          text-align: center;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .finalCta::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -10%;
          width: 120%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(204, 0, 0, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }
        .finalInner { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }
        .finalBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(204, 0, 0, 0.15);
          color: #ff6b6b;
          border: 1px solid rgba(204, 0, 0, 0.3);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .finalTitle {
          font-size: 38px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .finalSub {
          font-size: 15px;
          color: #aaa;
          margin: 0 0 28px;
          line-height: 1.6;
        }
        .finalBtn {
          display: inline-flex;
          align-items: center;
          padding: 14px 32px;
          background: #cc0000;
          color: #fff;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          min-height: 48px;
          gap: 8px;
          border: 2px solid #cc0000;
          transition: all 0.15s;
        }
        .finalBtn:hover { background: #a80000; border-color: #a80000; }
        .finalNote {
          margin-top: 18px;
          font-size: 12px;
          color: #666;
          letter-spacing: -0.01em;
        }

        /* ============ MOBILE ============ */
        @media (max-width: 1024px) {
          .processGrid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .processLastRow { grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px; }
          .thumbWide { aspect-ratio: 16/9; }
          .sampleGrid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero { padding: 48px 18px 36px; }
          .heroTitle { font-size: 32px; }
          .heroSub { font-size: 15px; }
          .heroCtas { flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 32px; }
          .primaryBtn, .secondaryBtn { width: 100%; justify-content: center; }
          .heroStats { gap: 8px; }
          .statBox { min-width: 0; padding: 14px 10px; }
          .statNum { font-size: 20px; }
          .statIcon { font-size: 20px; margin-bottom: 4px; }

          .manifest { padding: 32px 20px; }
          .manifestText { font-size: 15px; }

          .section, .sectionSoft { padding: 48px 18px; }
          .sectionHead { margin-bottom: 28px; }
          .sectionTitle { font-size: 24px; }
          .sectionSub { font-size: 14px; }

          .processGrid { grid-template-columns: 1fr; gap: 14px; }
          .processLastRow { grid-template-columns: 1fr; gap: 14px; margin-top: 14px; }
          .sampleGrid { grid-template-columns: 1fr; gap: 14px; }
          .sampleHeading { font-size: 18px; padding: 16px; }

          .faqItem { padding: 14px 16px; }
          .faqQ { font-size: 14px; }
          .faqA { font-size: 13px; }

          .finalCta { padding: 52px 18px; }
          .finalTitle { font-size: 26px; }
          .finalBtn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="heroBadge">🎬 AI YouTube 자동화 플랫폼</div>
        <h1 className="heroTitle">
          키워드 하나로<br />
          <span className="heroTitleAccent">영상이 완성됩니다</span>
        </h1>
        <p className="heroSub">
          뉴스 수집부터 대본·음성·영상·SEO까지 AI가 전부 처리.
          5분 안에 YouTube에 바로 업로드할 수 있는 MP4 완성.
        </p>
        <div className="heroCtas">
          <Link href="/create" className="primaryBtn">▶ 무료로 시작하기</Link>
          <a href="#process" className="secondaryBtn">프로세스 보기</a>
        </div>
        <div className="heroStats">
          <div className="statBox">
            <div className="statIcon">⏱️</div>
            <div className="statNum">5~8분</div>
            <div className="statLabel">영상 1편 제작</div>
          </div>
          <div className="statBox">
            <div className="statIcon">💰</div>
            <div className="statNum">0원</div>
            <div className="statLabel">초기 비용</div>
          </div>
          <div className="statBox">
            <div className="statIcon">🎯</div>
            <div className="statNum">A+</div>
            <div className="statLabel">수익화 안전도</div>
          </div>
        </div>
      </section>

      {/* ============ MANIFEST ============ */}
      <section className="manifest">
        <div className="manifestInner">
          <div className="manifestLabel">OUR MISSION</div>
          <p className="manifestText">
            좋은 콘텐츠 만드는 게 <em>기술 장벽 때문에</em> 어려워선 안 됩니다.<br />
            AI가 복잡한 제작을 맡고, 크리에이터는 아이디어에만 집중할 수 있게.
          </p>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="process" className="section">
        <div className="sectionHead">
          <div className="sectionLabel">PROCESS</div>
          <h2 className="sectionTitle">5단계로 완성됩니다</h2>
          <p className="sectionSub">
            사용자는 <strong>처음 설정</strong>만 하시면 돼요. 나머진 AI가 알아서.
          </p>
        </div>

        <div className="processGrid">
          {[
            { n: 1, t: '카테고리 선택', d: '경제·건강·자기계발·IT·라이프 중 선택', thumb: 'thumb1', icon: '🎯', time: '30초', stats: '즉시 시작' },
            { n: 2, t: '블루오션 키워드', d: 'AI가 경쟁도·CPM·트렌드 분석', thumb: 'thumb2', icon: '🔍', time: '1분', stats: '실시간 AI 추천' },
            { n: 3, t: '말투·길이 설정', d: '격식/친근/반말/음슴체, 5~20분', thumb: 'thumb3', icon: '⚙️', time: '30초', stats: '4가지 톤' },
          ].map((s) => (
            <div key={s.n} className="card processCard">
              <div className={`thumb ${s.thumb}`}>
                <div className="thumbStep">{s.n}</div>
                <span>{s.icon}</span>
                <div className="thumbDuration">{s.time}</div>
              </div>
              <div className="cardMeta">
                <div className="avatar">AM</div>
                <div className="cardText">
                  <h3 className="cardTitle">{s.t}</h3>
                  <p className="cardSub">{s.d}</p>
                  <div className="cardStats">{s.stats}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="processLastRow">
          <div className="card">
            <div className="thumb thumb4 thumbWide">
              <div className="thumbStep">4</div>
              <span>🤖</span>
              <div className="thumbDuration">5~8분</div>
            </div>
            <div className="cardMeta">
              <div className="avatar">AM</div>
              <div className="cardText">
                <h3 className="cardTitle">AI 자동 처리</h3>
                <p className="cardSub">뉴스 → 대본 → TTS → 인포그래픽 → 영상 합성</p>
                <div className="cardStats">6단계 파이프라인 자동화</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="thumb thumb5">
              <div className="thumbStep">5</div>
              <span>✅</span>
              <div className="thumbDuration">즉시</div>
            </div>
            <div className="cardMeta">
              <div className="avatar">AM</div>
              <div className="cardText">
                <h3 className="cardTitle">다운로드 & 업로드</h3>
                <p className="cardSub">MP4와 SEO 메타데이터 완성. 바로 YouTube 업로드</p>
                <div className="cardStats">원클릭 게시</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SAMPLE VIDEOS ============ */}
      <section className="sectionSoft">
        <div className="sectionSoftInner">
          <div className="sectionHead">
            <div className="sectionLabel">SAMPLES</div>
            <h2 className="sectionTitle">이런 영상이 완성됩니다</h2>
            <p className="sectionSub">
              실제 AlgoMaker로 제작된 영상 샘플입니다. 카테고리별 스타일을 확인해보세요.
            </p>
          </div>

          <div className="sampleGrid">
            {[
              { t: '2026 금리 전망', sub: '지금 꼭 알아야 할 3가지', thumb: 'sampleThumbA', cat: '경제', time: '10:12' },
              { t: '간헐적 단식 진실', sub: '의사가 직접 말하는 부작용', thumb: 'sampleThumbB', cat: '건강', time: '8:45' },
              { t: 'AI 도구 TOP 5', sub: '일상을 바꾸는 최신 앱', thumb: 'sampleThumbC', cat: 'IT', time: '12:30' },
            ].map((s, i) => (
              <div key={i} className="sampleCard">
                <div className={`sampleThumb ${s.thumb}`}>
                  <div className="sampleHeading">{s.t}</div>
                  <div className="playBadge">▶</div>
                  <div className="thumbDuration">{s.time}</div>
                </div>
                <div className="cardMeta">
                  <div className="avatar">AM</div>
                  <div className="cardText">
                    <h3 className="cardTitle">{s.t} - {s.sub}</h3>
                    <p className="cardSub">AlgoMaker AI · {s.cat}</p>
                    <div className="cardStats">예시 영상 · A+ 등급</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMPARE ============ */}
      <section className="section">
        <div className="sectionHead">
          <div className="sectionLabel">COMPARE</div>
          <h2 className="sectionTitle">왜 AlgoMaker인가</h2>
        </div>
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th className="th"></th>
                <th className="th thAccent">ALGOMAKER</th>
                <th className="th">수동 제작</th>
                <th className="th">외주</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['영상 1편 제작 시간', '5~8분', '5시간+', '2~3일'],
                ['초기 비용', '0원', '100만원+', '견적'],
                ['월 비용', '무료~', '8~13만원', '100만원+'],
                ['뉴스 기반 팩트체크', '✓ 자동', '수동', '×'],
                ['YouTube SEO 2026', '✓ AI 자동', '수동', '별도비용'],
                ['시니어 특화 모드', '✓ 내장', '×', '×'],
              ].map((row, i) => (
                <tr key={i} className="tr">
                  <td className="td tdLabel">{row[0]}</td>
                  <td className="td tdAccent">{row[1]}</td>
                  <td className="td">{row[2]}</td>
                  <td className="td">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="sectionSoft">
        <div className="sectionSoftInner">
          <div className="sectionHead">
            <div className="sectionLabel">FAQ</div>
            <h2 className="sectionTitle">자주 묻는 질문</h2>
          </div>
          <div className="faqList">
            {[
              { q: 'AI가 만든 영상도 수익화되나요?', a: '네. 2026년 YouTube 정책 기준 "실질적 변형·사실 기반·교육적 가치"가 있으면 수익화 가능합니다. AlgoMaker는 뉴스 기반 팩트체크와 SEO 최적화로 YPP 승인률을 높입니다.' },
              { q: '실제로 얼마나 벌 수 있나요?', a: '카테고리에 따라 다릅니다. 경제 CPM $12~22, 건강 $15~22, IT $10~16. 월 조회수 10만~50만 시 월 $300~$2,000 수익이 관찰됩니다.' },
              { q: '음성이 어색하지 않나요?', a: 'ElevenLabs 기반 한국어 TTS. 2026년 기준 사람 목소리와 구분이 어려운 수준입니다.' },
              { q: '저작권 문제 없나요?', a: '뉴스 원문을 인용하지 않고 AI가 사실만 재구성. 영상 소스는 저작권 무료 라이브러리만 사용.' },
              { q: 'YouTube 정책에 어긋나지 않나요?', a: '2026년 "합성·조작 콘텐츠 표시 의무"에 따라 AI 생성 영상은 자동으로 표시 태그가 추가됩니다.' },
            ].map((item, i) => (
              <div
                key={i}
                className={`faqItem ${openFaq === i ? 'faqItemOpen' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faqQRow">
                  <span className="faqQ">{item.q}</span>
                  <span className="faqPlus">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <div className="faqA">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="finalCta">
        <div className="finalInner">
          <div className="finalBadge">🔥 지금 가입하면 평생 무료</div>
          <h2 className="finalTitle">오늘 첫 영상을 완성하세요</h2>
          <p className="finalSub">
            카테고리 고르고 키워드 선택하면 끝. 5분 후 유튜브 업로드 가능한 MP4가 준비됩니다.
          </p>
          <Link href="/create" className="finalBtn">▶ 무료로 시작하기</Link>
          <div className="finalNote">신용카드 불필요 · 설치 불필요 · 바로 시작</div>
        </div>
      </section>
    </V11Shell>
  );
}
