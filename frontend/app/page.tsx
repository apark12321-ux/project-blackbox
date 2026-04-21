'use client';
/**
 * AlgoMaker v11 - 홈 페이지
 * V11Shell 사용 + 완전 반응형
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
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 20px 56px;
          text-align: center;
        }
        .heroBadge {
          display: inline-block;
          padding: 7px 14px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .heroTitle {
          font-size: 44px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.25;
          margin: 0 0 18px;
        }
        .heroTitleAccent { color: #2563eb; }
        .heroSub {
          font-size: 17px;
          color: #64748b;
          line-height: 1.7;
          max-width: 620px;
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
          padding: 14px 26px;
          background: #2563eb;
          color: #fff;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .primaryBtn:hover { background: #1d4ed8; }
        .secondaryBtn {
          padding: 14px 26px;
          background: #fff;
          color: #0f172a;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .secondaryBtn:hover { background: #f8fafc; }
        .heroStats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .statBox { text-align: center; }
        .statNum {
          font-size: 28px;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: -0.02em;
        }
        .statLabel { font-size: 12px; color: #64748b; margin-top: 4px; }
        
        .section {
          padding: 72px 20px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }
        .sectionSoft {
          padding: 72px 20px;
          background: #f8fafc;
        }
        .sectionSoftInner {
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }
        .sectionLabel {
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.15em;
          margin-bottom: 10px;
        }
        .sectionTitle {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 14px;
        }
        .sectionSub {
          font-size: 15px;
          color: #64748b;
          line-height: 1.7;
          margin: 0 auto 40px;
          max-width: 560px;
        }
        
        .steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 760px;
          margin: 0 auto;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 22px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          text-align: left;
        }
        .stepNum {
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
          min-width: 28px;
        }
        .stepIcon {
          font-size: 26px;
          min-width: 34px;
        }
        .stepText { flex: 1; min-width: 0; }
        .stepT {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .stepD { font-size: 13px; color: #64748b; line-height: 1.6; }
        
        .tableWrap {
          max-width: 860px;
          margin: 0 auto;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 520px; }
        .th {
          padding: 14px 16px;
          text-align: center;
          font-weight: 700;
          color: #0f172a;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        .thAccent { color: #2563eb; background: #eff6ff; }
        .td {
          padding: 12px 16px;
          text-align: center;
          color: #64748b;
          border-bottom: 1px solid #e5e7eb;
        }
        .tdLabel { text-align: left; color: #0f172a; font-weight: 500; }
        .tdAccent { color: #2563eb; font-weight: 700; background: #fafbff; }
        
        .faqList {
          max-width: 760px;
          margin: 0 auto;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faqItem {
          padding: 18px 22px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .faqItemOpen { border-color: #2563eb; background: #fafbff; }
        .faqQRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }
        .faqQ { font-size: 15px; font-weight: 600; color: #0f172a; }
        .faqPlus {
          font-size: 22px;
          color: #2563eb;
          font-weight: 400;
          line-height: 1;
          flex-shrink: 0;
        }
        .faqA {
          margin-top: 12px;
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
        }
        
        .finalCta {
          background: #0f172a;
          padding: 72px 20px;
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
          color: #94a3b8;
          margin: 0 0 28px;
        }
        .finalBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 30px;
          background: #2563eb;
          color: #fff;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          min-height: 48px;
        }
        .finalBtn:hover { background: #1d4ed8; }
        
        @media (max-width: 768px) {
          .hero { padding: 48px 18px 40px; }
          .heroTitle { font-size: 30px; }
          .heroSub { font-size: 15px; }
          .heroCtas { flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 36px; }
          .primaryBtn, .secondaryBtn { width: 100%; }
          .heroStats { gap: 24px; }
          .statNum { font-size: 24px; }
          
          .section, .sectionSoft { padding: 48px 18px; }
          .sectionTitle { font-size: 24px; }
          .sectionSub { font-size: 14px; margin-bottom: 28px; }
          
          .step { padding: 16px 16px; gap: 12px; flex-wrap: wrap; }
          .stepIcon { font-size: 22px; min-width: 28px; }
          .stepT { font-size: 14px; }
          .stepD { font-size: 12px; }
          
          .faqItem { padding: 14px 18px; }
          .faqQ { font-size: 14px; }
          .faqA { font-size: 13px; }
          
          .finalCta { padding: 48px 18px; }
          .finalTitle { font-size: 24px; }
          .finalBtn { width: 100%; }
        }
      `}</style>

      <section className="hero">
        <div className="heroBadge">🎬 AI YouTube 자동화 플랫폼</div>
        <h1 className="heroTitle">
          설정 한 번으로<br />
          <span className="heroTitleAccent">AI가 영상을 만들어드립니다</span>
        </h1>
        <p className="heroSub">
          카테고리 고르고 키워드 선택하면 끝. AI가 뉴스 수집부터 대본·음성·영상·SEO까지 자동으로 처리합니다.
        </p>
        <div className="heroCtas">
          <Link href="/create" className="primaryBtn">무료로 시작하기 →</Link>
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
        <div className="sectionLabel">PROCESS</div>
        <h2 className="sectionTitle">5단계로 완성됩니다</h2>
        <p className="sectionSub">
          사용자는 <strong>처음 설정</strong>만 하시면 돼요. 나머진 AI가 알아서 처리합니다.
        </p>
        <div className="steps">
          {[
            { n: '01', icon: '🎯', t: '카테고리 선택', d: '경제·건강·자기계발·IT·라이프 중 관심 분야 하나 선택' },
            { n: '02', icon: '🔍', t: '블루오션 키워드 선별', d: 'AI가 경쟁도·CPM·트렌드 분석해 키워드 추천' },
            { n: '03', icon: '⚙️', t: '말투·길이 설정', d: '격식체/친근체/반말/음슴체, 5~20분, 일반/시니어' },
            { n: '04', icon: '🤖', t: 'AI 자동 처리', d: '뉴스 → 대본 → TTS → 인포그래픽 → 영상 → SEO' },
            { n: '05', icon: '✅', t: '다운로드 & 업로드', d: 'MP4와 YouTube SEO 메타데이터 완성. 바로 업로드' },
          ].map((s) => (
            <div key={s.n} className="step">
              <div className="stepNum">{s.n}</div>
              <div className="stepIcon">{s.icon}</div>
              <div className="stepText">
                <div className="stepT">{s.t}</div>
                <div className="stepD">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sectionSoft">
        <div className="sectionSoftInner">
          <div className="sectionLabel">COMPARE</div>
          <h2 className="sectionTitle">왜 AlgoMaker인가</h2>
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
        <div className="sectionLabel">FAQ</div>
        <h2 className="sectionTitle">자주 묻는 질문</h2>
        <div className="faqList">
          {[
            { q: 'AI가 만든 영상도 수익화되나요?', a: '네. 2026년 YouTube 정책 기준 "실질적 변형·사실 기반·교육적 가치"가 있으면 수익화 가능합니다. AlgoMaker는 뉴스 기반 팩트체크와 SEO 최적화로 YPP 승인률을 높입니다.' },
            { q: '실제로 얼마나 벌 수 있나요?', a: '카테고리에 따라 다릅니다. 경제 CPM $12~22, 건강 $15~22, IT $10~16. 월 조회수 10만~50만 시 월 $300~$2,000 수익이 관찰됩니다.' },
            { q: '음성이 어색하지 않나요?', a: 'ElevenLabs 기반 한국어 TTS. 2026년 기준 사람 목소리와 구분이 어려운 수준입니다. 격식체/친근체/반말/음슴체 4종과 남녀 음성 선택 가능.' },
            { q: '저작권 문제 없나요?', a: '뉴스 원문을 인용하지 않고 AI가 사실만 재구성. 영상 소스는 저작권 무료 라이브러리만 사용, BGM도 CC 또는 YouTube 오디오 보관함만 사용.' },
            { q: 'YouTube 정책에 어긋나지 않나요?', a: 'YouTube 2026년 "합성·조작 콘텐츠 표시 의무"에 따라 AI 생성 영상은 자동으로 표시 태그가 추가됩니다. AlgoMaker가 메타데이터에 자동 포함시킵니다.' },
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
        <Link href="/create" className="finalBtn">무료로 시작하기 →</Link>
      </section>
    </V11Shell>
  );
}
