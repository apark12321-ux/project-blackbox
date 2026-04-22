'use client';
/**
 * /about - 서비스 소개 + 사업자 정보
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '../_shared/V11Shell';

const FAQ_ITEMS = [
  {
    q: '영상 1편 만드는 데 얼마나 걸려요?',
    a: '키워드 입력부터 완성까지 평균 5~8분 소요됩니다. AI가 뉴스 수집 → 대본 생성 → 영상 합성을 자동 처리하니 커피 한 잔 드시면 완성돼요.',
  },
  {
    q: '같은 키워드로 다시 만들면 똑같은 영상이 나오나요?',
    a: '아니요. AlgoMaker는 12가지 시나리오 스타일을 랜덤 조합하고, 매번 다른 뉴스를 기반으로 대본을 새로 쓰기 때문에 같은 키워드여도 전혀 다른 영상이 나옵니다.',
  },
  {
    q: '만들어진 영상은 어디에 쓸 수 있나요?',
    a: '완성된 MP4 파일을 다운로드해서 본인의 YouTube 채널에 그대로 업로드하거나, 별도 편집 후 사용할 수 있습니다. 저작권은 사용자에게 있어요.',
  },
  {
    q: 'YouTube 수익화 승인되나요?',
    a: 'AlgoMaker 영상은 디지털 지문 변조 기술로 재사용 콘텐츠 필터를 회피하도록 설계되어 있습니다. 평균 승인률 94.7%를 기록 중이지만, 최종 승인은 YouTube 정책에 따릅니다.',
  },
  {
    q: 'Free와 Pro 차이가 뭐예요?',
    a: 'Free: 월 3편 영상, 시나리오 6가지 사용 가능. Pro (9,900원/월): 무제한 영상, 12가지 전체 시나리오, 경쟁 채널 분석, 썸네일 A/B 테스트, 트렌드 예측 AI까지 사용 가능합니다.',
  },
  {
    q: '결제는 어떻게 하나요?',
    a: '결제 시스템은 곧 출시될 예정입니다. 지금은 Free로 서비스를 체험하실 수 있으며, Pro 기능을 미리 확인하실 수 있습니다.',
  },
];

const STEPS = [
  { num: '01', emoji: '🔍', title: '키워드 입력', desc: '하고 싶은 주제를 한 단어로 입력하세요' },
  { num: '02', emoji: '📰', title: 'AI 뉴스 수집', desc: '최근 7일간 관련 뉴스 10건 자동 수집' },
  { num: '03', emoji: '✨', title: '시나리오 추천', desc: '12가지 스타일 중 최적 3가지 AI 추천' },
  { num: '04', emoji: '✍️', title: 'AI 대본 작성', desc: '뉴스 팩트 기반으로 대본 자동 생성' },
  { num: '05', emoji: '🎤', title: 'TTS 음성 합성', desc: 'ElevenLabs 고품질 한국어 내레이션' },
  { num: '06', emoji: '🎬', title: '영상 합성', desc: '인포그래픽+자막+BGM 자동 합성' },
];

const COMPARISONS = [
  { feat: '영상 1편 제작 시간', ai: '5~8분', manual: '4~8시간', diff: '×60배' },
  { feat: '제작 비용', ai: '0원~9,900원/월', manual: '10~30만원', diff: '×30배' },
  { feat: '전문 지식', ai: '필요 없음', manual: '편집/디자인/기획', diff: '진입장벽' },
  { feat: '하루 생산량', ai: '10편 이상', manual: '1편', diff: '×10배' },
];

export default function AboutPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HERO */
        .hero {
          text-align: center;
          padding: 32px 20px 40px;
          margin-bottom: 32px;
        }
        .heroBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #fff0f0;
          color: #cc0000;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 14px;
        }
        .heroTitle {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 14px;
        }
        .heroTitle span { color: #cc0000; }
        .heroSub {
          font-size: 16px;
          color: #606060;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 24px;
        }
        .heroCTA {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .ctaPrimary {
          padding: 14px 28px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
        .ctaPrimary:hover { background: #a80000; }
        .ctaSecondary {
          padding: 14px 24px;
          background: #fff;
          color: #0f0f0f;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .ctaSecondary:hover { background: #f5f5f5; }

        /* SECTIONS */
        .section { margin-bottom: 40px; }
        .sectionHead {
          text-align: center;
          margin-bottom: 24px;
        }
        .sectionEyebrow {
          font-size: 11px;
          font-weight: 700;
          color: #cc0000;
          letter-spacing: 0.12em;
          margin-bottom: 6px;
        }
        .sectionTitle {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .sectionSub {
          font-size: 13px;
          color: #888;
        }

        /* STEPS */
        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .stepCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 22px 20px;
          position: relative;
          overflow: hidden;
        }
        .stepNum {
          position: absolute;
          top: 14px; right: 16px;
          font-size: 32px;
          font-weight: 800;
          color: #f0f0f0;
          letter-spacing: -0.02em;
        }
        .stepEmoji {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .stepTitle {
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .stepDesc {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }

        /* COMPARISON */
        .compare {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          overflow: hidden;
        }
        .compareRow {
          display: grid;
          grid-template-columns: 2fr 2fr 2fr 1fr;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
          gap: 10px;
        }
        .compareRow:last-child { border-bottom: none; }
        .compareRowHead {
          background: #fafafa;
          font-size: 11px;
          font-weight: 700;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .compareFeat {
          font-size: 14px;
          font-weight: 700;
          color: #0f0f0f;
        }
        .compareAI {
          font-size: 14px;
          font-weight: 700;
          color: #cc0000;
        }
        .compareManual {
          font-size: 14px;
          color: #666;
        }
        .compareDiff {
          text-align: right;
          padding: 4px 10px;
          background: #fff0f0;
          color: #cc0000;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 800;
          display: inline-block;
          justify-self: end;
        }

        /* FAQ */
        .faqList {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          overflow: hidden;
        }
        .faqItem {
          border-bottom: 1px solid #f0f0f0;
        }
        .faqItem:last-child { border-bottom: none; }
        .faqQ {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 22px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          color: #0f0f0f;
          gap: 10px;
        }
        .faqQ:hover { background: #fafafa; }
        .faqArrow {
          transition: transform 0.2s;
          color: #888;
          flex-shrink: 0;
        }
        .faqArrowOpen { transform: rotate(180deg); color: #cc0000; }
        .faqA {
          padding: 0 22px 18px;
          font-size: 13px;
          color: #606060;
          line-height: 1.7;
          animation: faqSlide 0.2s ease;
        }
        @keyframes faqSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* BUSINESS INFO */
        .bizInfo {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 20px 24px;
        }
        .bizTitle {
          font-size: 13px;
          font-weight: 800;
          color: #0f0f0f;
          margin-bottom: 10px;
        }
        .bizRow {
          display: grid;
          grid-template-columns: 120px 1fr;
          padding: 6px 0;
          font-size: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        .bizRow:last-child { border-bottom: none; }
        .bizLabel { color: #888; font-weight: 500; }
        .bizValue { color: #0f0f0f; font-weight: 500; }

        /* FINAL CTA */
        .finalCTA {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: #fff;
          border-radius: 16px;
          padding: 36px;
          text-align: center;
          margin-top: 40px;
        }
        .finalCTATitle {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .finalCTASub {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 20px;
        }
        .finalCTABtn {
          padding: 14px 32px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
        }
        .finalCTABtn:hover { background: #a80000; }

        @media (max-width: 768px) {
          .page { padding: 20px 14px 40px; }
          .heroTitle { font-size: 28px; }
          .heroSub { font-size: 14px; }
          .sectionTitle { font-size: 20px; }
          .stepsGrid { grid-template-columns: 1fr; }
          .compareRow { grid-template-columns: 1.5fr 1fr; gap: 8px; padding: 12px 14px; }
          .compareRow > :nth-child(3),
          .compareRow > :nth-child(4) { display: none; }
          .finalCTA { padding: 24px; }
          .finalCTATitle { font-size: 20px; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <span className="heroBadge">✨ ABOUT ALGOMAKER</span>
          <h1 className="heroTitle">
            AI가 만드는 YouTube,<br />
            <span>키워드 하나면 끝</span>
          </h1>
          <p className="heroSub">
            뉴스 수집부터 대본·TTS·영상 합성·자막·BGM까지.<br />
            5~8분 만에 완성되는 유튜브 자동화 플랫폼.
          </p>
          <div className="heroCTA">
            <button className="ctaPrimary" onClick={() => router.push('/')}>
              ▶ 지금 시작하기
            </button>
            <button className="ctaSecondary" onClick={() => router.push('/analytics')}>
              Pro 기능 보기 →
            </button>
          </div>
        </section>

        {/* STEPS */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionEyebrow">HOW IT WORKS</div>
            <h2 className="sectionTitle">영상이 만들어지는 6단계</h2>
            <p className="sectionSub">모든 단계가 자동으로 진행됩니다</p>
          </div>
          <div className="stepsGrid">
            {STEPS.map((s) => (
              <div key={s.num} className="stepCard">
                <div className="stepNum">{s.num}</div>
                <div className="stepEmoji">{s.emoji}</div>
                <div className="stepTitle">{s.title}</div>
                <div className="stepDesc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionEyebrow">WHY ALGOMAKER</div>
            <h2 className="sectionTitle">수작업 vs AlgoMaker</h2>
            <p className="sectionSub">같은 결과물, 60배 빠른 속도</p>
          </div>
          <div className="compare">
            <div className="compareRow compareRowHead">
              <div>항목</div>
              <div>AlgoMaker</div>
              <div>수작업</div>
              <div style={{ textAlign: 'right' }}>차이</div>
            </div>
            {COMPARISONS.map((c, i) => (
              <div key={i} className="compareRow">
                <div className="compareFeat">{c.feat}</div>
                <div className="compareAI">✓ {c.ai}</div>
                <div className="compareManual">{c.manual}</div>
                <div className="compareDiff">{c.diff}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionEyebrow">FAQ</div>
            <h2 className="sectionTitle">자주 묻는 질문</h2>
          </div>
          <div className="faqList">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faqItem">
                <div className="faqQ" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>Q. {item.q}</span>
                  <span className={`faqArrow ${openFaq === i ? 'faqArrowOpen' : ''}`}>▾</span>
                </div>
                {openFaq === i && (
                  <div className="faqA">A. {item.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BUSINESS INFO */}
        <section className="section">
          <div className="sectionHead">
            <div className="sectionEyebrow">BUSINESS</div>
            <h2 className="sectionTitle">운영 정보</h2>
          </div>
          <div className="bizInfo">
            <div className="bizTitle">사업자 정보</div>
            <div className="bizRow">
              <span className="bizLabel">상호</span>
              <span className="bizValue">한줄컴퍼니</span>
            </div>
            <div className="bizRow">
              <span className="bizLabel">대표</span>
              <span className="bizValue">박예준</span>
            </div>
            <div className="bizRow">
              <span className="bizLabel">사업자등록번호</span>
              <span className="bizValue">450-07-03104</span>
            </div>
            <div className="bizRow">
              <span className="bizLabel">통신판매업신고</span>
              <span className="bizValue">제 2025-인천서구-3321호</span>
            </div>
            <div className="bizRow">
              <span className="bizLabel">주소</span>
              <span className="bizValue">인천광역시 서구 청라커낼로 270, 커넬힐스빌 2층 2498호</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="finalCTA">
          <div className="finalCTATitle">지금 바로 첫 영상 만들어보세요</div>
          <div className="finalCTASub">
            회원가입 없이 무료로 시작 · 5~8분이면 완성
          </div>
          <button className="finalCTABtn" onClick={() => router.push('/')}>
            ▶ 무료로 시작하기
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}
