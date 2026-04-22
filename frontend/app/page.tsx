'use client';
/**
 * AlgoMaker v12 - 홈 (YouTube 스타일 카드)
 */

import Link from 'next/link';
import { useState } from 'react';
import { V11Shell } from './_shared/V11Shell';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <V11Shell>
      <style jsx>{`
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 24px 48px;
          text-align: center;
        }
        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #ffebeb;
          color: #cc0000;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .heroTitle {
          font-size: 48px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin: 0 0 18px;
        }
        .heroTitleAccent { color: #ff0000; }
        .heroSub {
          font-size: 17px;
          color: #606060;
          line-height: 1.7;
          max-width: 620px;
          margin: 0 auto 28px;
        }
        .heroCtas {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .primaryBtn {
          padding: 14px 26px;
          background: #ff0000;
          color: #fff;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .primaryBtn:hover { background: #cc0000; }
        .secondaryBtn {
          padding: 14px 26px;
          background: #f2f2f2;
          color: #0f0f0f;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
        }
        .secondaryBtn:hover { background: #e5e5e5; }
        
        .heroStats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .statBox { text-align: center; }
        .statNum {
          font-size: 30px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
        }
        .statLabel { font-size: 12px; color: #606060; margin-top: 4px; }
        
        /* Section */
        .section {
          padding: 64px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .sectionHead {
          text-align: center;
          margin-bottom: 40px;
        }
        .sectionLabel {
          font-size: 12px;
          font-weight: 700;
          color: #ff0000;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
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
        
        /* YouTube-style thumbnail cards */
        .cardGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px 16px;
        }
        .card {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .thumb {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          color: #fff;
          font-weight: 800;
        }
        .thumb1 { background: linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%); }
        .thumb2 { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); }
        .thumb3 { background: linear-gradient(135deg, #ffa751 0%, #ffe259 100%); }
        .thumb4 { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .thumb5 { background: linear-gradient(135deg, #7F7FD5 0%, #86A8E7 100%); }
        
        .thumbDuration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.8);
          color: #fff;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .thumbStep {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
        }
        .cardMeta {
          padding: 12px 4px 0;
        }
        .cardTitle {
          font-size: 15px;
          font-weight: 700;
          color: #0f0f0f;
          margin: 0 0 6px;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .cardDesc {
          font-size: 13px;
          color: #606060;
          line-height: 1.5;
          margin: 0;
        }
        
        /* Compare table section */
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
          min-width: 520px; 
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
        .thAccent { color: #ff0000; background: #ffebeb; }
        .td {
          padding: 12px 16px;
          text-align: center;
          color: #606060;
          border-bottom: 1px solid #e5e5e5;
        }
        .tdLabel { text-align: left; color: #0f0f0f; font-weight: 500; }
        .tdAccent { color: #ff0000; font-weight: 700; background: #fffafa; }
        
        /* FAQ */
        .faqList {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .faqItem {
          padding: 16px 20px;
          background: #f9f9f9;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .faqItem:hover { background: #f2f2f2; }
        .faqItemOpen { background: #fff; border: 1px solid #e5e5e5; }
        .faqQRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }
        .faqQ { font-size: 15px; font-weight: 600; color: #0f0f0f; }
        .faqPlus {
          font-size: 22px;
          color: #606060;
          font-weight: 400;
          line-height: 1;
          flex-shrink: 0;
        }
        .faqA {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #606060;
          line-height: 1.7;
        }
        
        /* Final CTA */
        .finalCta {
          background: #0f0f0f;
          padding: 64px 24px;
          text-align: center;
          color: #fff;
        }
        .finalTitle {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .finalSub {
          font-size: 15px;
          color: #aaa;
          margin: 0 0 24px;
        }
        .finalBtn {
          display: inline-flex;
          align-items: center;
          padding: 14px 30px;
          background: #ff0000;
          color: #fff;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          min-height: 48px;
          gap: 6px;
        }
        .finalBtn:hover { background: #cc0000; }
        
        /* Mobile */
        @media (max-width: 768px) {
          .hero { padding: 40px 18px 32px; }
          .heroTitle { font-size: 30px; }
          .heroSub { font-size: 15px; }
          .heroCtas { flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 32px; }
          .primaryBtn, .secondaryBtn { width: 100%; justify-content: center; }
          .heroStats { gap: 24px; }
          .statNum { font-size: 24px; }
          
          .section { padding: 40px 18px; }
          .sectionHead { margin-bottom: 24px; }
          .sectionTitle { font-size: 24px; }
          .sectionSub { font-size: 14px; }
          
          .cardGrid { grid-template-columns: 1fr; gap: 18px; }
          .cardTitle { font-size: 14px; }
          .cardDesc { font-size: 12px; }
          
          .faqItem { padding: 14px 16px; }
          .faqQ { font-size: 14px; }
          .faqA { font-size: 13px; }
          
          .finalCta { padding: 40px 18px; }
          .finalTitle { font-size: 24px; }
          .finalBtn { width: 100%; justify-content: center; }
        }
      `}</style>

      <section className="hero">
        <div className="heroBadge">🎬 AI YouTube 자동화 플랫폼</div>
        <h1 className="heroTitle">
          키워드 하나로<br />
          <span className="heroTitleAccent">영상이 완성됩니다</span>
        </h1>
        <p className="heroSub">
          뉴스 수집부터 대본·음성·영상·SEO까지 AI가 전부 처리. 
          5분 안에 YouTube에 바로 업로드 가능한 MP4 완성.
        </p>
        <div className="heroCtas">
          <Link href="/create" className="primaryBtn">▶ 무료로 시작하기</Link>
          <a href="#process" className="secondaryBtn">프로세스 보기</a>
        </div>
        <div className="heroStats">
          <div className="statBox">
            <div className="statNum">5~8분</div>
            <div className="statLabel">영상 1편 제작</div>
          </div>
          <div className="statBox">
            <div className="statNum">0원</div>
            <div className="statLabel">초기 비용</div>
          </div>
          <div className="statBox">
            <div className="statNum">A+</div>
            <div className="statLabel">수익화 안전도</div>
          </div>
        </div>
      </section>

      <section id="process" className="section">
        <div className="sectionHead">
          <div className="sectionLabel">PROCESS</div>
          <h2 className="sectionTitle">5단계로 완성됩니다</h2>
          <p className="sectionSub">
            사용자는 <strong>처음 설정</strong>만 하시면 돼요. 나머진 AI가 알아서.
          </p>
        </div>
        <div className="cardGrid">
          {[
            { n: 1, t: '카테고리 선택', d: '경제·건강·자기계발·IT·라이프 중 관심 분야 선택', thumb: 'thumb1', icon: '🎯', time: '30초' },
            { n: 2, t: '블루오션 키워드', d: 'AI가 경쟁도·CPM·트렌드 분석해 키워드 추천', thumb: 'thumb2', icon: '🔍', time: '1분' },
            { n: 3, t: '말투·길이 설정', d: '격식체/친근체/반말/음슴체, 5~20분 선택', thumb: 'thumb3', icon: '⚙️', time: '30초' },
            { n: 4, t: 'AI 자동 처리', d: '뉴스 → 대본 → TTS → 인포그래픽 → 영상', thumb: 'thumb4', icon: '🤖', time: '5~8분' },
            { n: 5, t: '다운로드 & 업로드', d: 'MP4와 SEO 메타데이터 완성. 바로 YouTube 업로드', thumb: 'thumb5', icon: '✅', time: '즉시' },
          ].map((s) => (
            <div key={s.n} className="card">
              <div className={`thumb ${s.thumb}`}>
                <div className="thumbStep">{s.n}</div>
                <span>{s.icon}</span>
                <div className="thumbDuration">{s.time}</div>
              </div>
              <div className="cardMeta">
                <h3 className="cardTitle">{s.t}</h3>
                <p className="cardDesc">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: '#f9f9f9', maxWidth: 'none', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
                  <tr key={i}>
                    <td className="td tdLabel">{row[0]}</td>
                    <td className="td tdAccent">{row[1]}</td>
                    <td className="td">{row[2]}</td>
                    <td className="td">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
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
      </section>

      <section className="finalCta">
        <h2 className="finalTitle">지금 시작하세요</h2>
        <p className="finalSub">5분 안에 첫 영상을 만들어보세요. 비용 0원.</p>
        <Link href="/create" className="finalBtn">▶ 무료로 시작하기</Link>
      </section>
    </V11Shell>
  );
}
