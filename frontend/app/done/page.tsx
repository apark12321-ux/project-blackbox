'use client';
/**
 * 결과 페이지 (/done)
 *
 * 영상 완성 → Algo-Magic Booster로 최적화 → 다운로드
 */

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DashboardShell, getProject } from '../_shared/V11Shell';
import AlgoBooster, { BoosterData } from '../_shared/AlgoBooster';
import AdSlot from '../_shared/AdSlot';

export default function DonePage() {
  const [keyword, setKeyword] = useState('영상');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const project = getProject();
    if (project.keyword) setKeyword(project.keyword);
  }, []);

  // 초기 상태: 평범한 영상
  const initialData: BoosterData = {
    title: `${keyword} 2026년 달라지는 점`,
    grade: 'B+',
    retention: 42,
    ctr: 4.2,
  };

  // 최적화 상태: 알고리즘 적용됨
  const optimizedData: BoosterData = {
    title: `⚠️ 2026 ${keyword}, 이 3가지 모르면 매달 30만원 손해봅니다`,
    grade: 'A++',
    retention: 78,
    ctr: 8.7,
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 36px 24px 64px;
        }

        .pageHead {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(90, 74, 58, 0.08);
        }
        .stepIndicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: #eaf2ea;
          color: #5e7e5d;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .stepDot {
          width: 6px; height: 6px;
          background: #5e7e5d;
          border-radius: 50%;
        }

        .pageTitle {
          font-size: 32px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 10px;
        }
        .pageTitle .accent { color: #c65f3b; }
        .pageSub {
          font-size: 15px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
          max-width: 560px;
          margin: 0 auto;
        }

        /* 영상 미리보기 */
        .previewSection {
          margin-bottom: 28px;
        }
        .previewCard {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        .previewBody {
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #3a332a 0%, #2a2419 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .previewBody::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 30% 30%, rgba(198, 95, 59, 0.2) 0%, transparent 60%);
        }
        .playBtn {
          width: 72px;
          height: 72px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          position: relative;
          z-index: 1;
          cursor: pointer;
          transition: all 0.2s;
        }
        .playBtn:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }
        .playBtn::after {
          content: '';
          width: 0; height: 0;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-left: 22px solid #c65f3b;
          margin-left: 6px;
        }
        .previewMeta {
          position: absolute;
          bottom: 14px; right: 14px;
          padding: 5px 12px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(4px);
          z-index: 1;
        }
        .previewBadge {
          position: absolute;
          top: 14px; left: 14px;
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #c65f3b;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          z-index: 1;
          letter-spacing: -0.01em;
        }
        .previewFooter {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .previewInfo {
          font-size: 12.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .previewInfo strong {
          color: #2a2419;
          font-weight: 700;
        }

        /* 안내 배너 */
        .guideBanner {
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border: 1px dashed rgba(198, 95, 59, 0.3);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .guideIcon {
          font-size: 28px;
          flex-shrink: 0;
        }
        .guideText {
          flex: 1;
          font-size: 13px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
        }
        .guideText strong {
          color: #a64a2a;
          font-weight: 800;
        }

        /* 다운로드 섹션 */
        .downloadSection {
          margin-top: 28px;
          padding: 24px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
        }
        .downloadSectionDisabled {
          opacity: 0.6;
          pointer-events: none;
        }
        .downloadHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .downloadTitle {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
        }
        .downloadMeta {
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .downloadMeta strong {
          color: #c65f3b;
          font-weight: 700;
        }

        .downloadBtns {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 10px;
        }
        .primaryBtn {
          padding: 14px 20px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.3);
        }
        .primaryBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.4);
        }
        .primaryBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .secondaryBtn {
          padding: 14px 16px;
          background: #fff;
          color: #564a3a;
          border: 1px solid rgba(90, 74, 58, 0.15);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .secondaryBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }

        .adWrap {
          margin: 32px 0;
        }

        .nextSteps {
          margin-top: 40px;
          padding: 28px;
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 16px;
        }
        .nextStepsTitle {
          font-size: 18px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
        }
        .nextStepsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .nextStepCard {
          padding: 16px 18px;
          background: #faf8f4;
          border-radius: 10px;
          border: 1px solid rgba(90, 74, 58, 0.06);
          transition: all 0.18s;
        }
        .nextStepCard:hover {
          transform: translateY(-2px);
          border-color: rgba(198, 95, 59, 0.25);
        }
        .nextStepIcon {
          font-size: 22px;
          margin-bottom: 8px;
        }
        .nextStepTitle {
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
          margin-bottom: 4px;
        }
        .nextStepDesc {
          font-size: 12px;
          color: #8a7d6a;
          line-height: 1.55;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .page { padding: 24px 16px 48px; }
          .pageTitle { font-size: 24px; }
          .pageSub { font-size: 14px; }
          .downloadBtns { grid-template-columns: 1fr; }
          .nextStepsGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <header className="pageHead">
          <div className="stepIndicator">
            <span className="stepDot" />
            STEP 6 / 6 · 영상 완성
          </div>
          <h1 className="pageTitle">
            영상이 <span className="accent">완성되었어요!</span>
          </h1>
          <p className="pageSub">
            이제 <strong style={{color: '#c65f3b'}}>Algo-Magic Booster</strong>로 영상에 2026 최신 알고리즘을 적용해보세요.
            한 번의 클릭으로 조회수가 터지는 영상으로 변신합니다.
          </p>
        </header>

        {/* 영상 미리보기 */}
        <section className="previewSection">
          <div className="previewCard">
            <div className="previewBody">
              <span className="previewBadge">⚡ Made by AlgoMaker</span>
              <div className="playBtn" />
              <span className="previewMeta">8:42</span>
            </div>
            <div className="previewFooter">
              <div className="previewInfo">
                <strong>{keyword}</strong> · HD 화질 · 한국어 내레이션
              </div>
              <div className="previewInfo">
                🎬 12 섹션 · 📊 해법 찾기 스타일
              </div>
            </div>
          </div>
        </section>

        {/* 안내 배너 */}
        {!applied && (
          <div className="guideBanner">
            <span className="guideIcon">💡</span>
            <div className="guideText">
              <strong>한 번의 클릭으로 모든 것이 바뀝니다.</strong><br />
              아래 레버를 올리면 2026 알고리즘이 자동으로 적용돼요.
              제목·태그·후킹이 모두 최적화됩니다.
            </div>
          </div>
        )}

        {/* 🎯 Algo-Magic Booster */}
        <AlgoBooster
          initialData={initialData}
          optimizedData={optimizedData}
          onApply={() => setApplied(true)}
          variant="full"
        />

        <div className="adWrap">
          <AdSlot slot="done-mid" variant="horizontal" />
        </div>

        {/* 다운로드 섹션 */}
        <section className={`downloadSection ${!applied ? 'downloadSectionDisabled' : ''}`}>
          <div className="downloadHead">
            <div className="downloadTitle">
              {applied ? '🎉 최적화된 영상 다운로드' : '📥 다운로드 (알고리즘 적용 후 가능)'}
            </div>
            <div className="downloadMeta">
              {applied ? (
                <>등급 <strong>A++</strong> · 예상 조회수 ↑↑↑</>
              ) : (
                <>레버를 먼저 올려주세요</>
              )}
            </div>
          </div>
          <div className="downloadBtns">
            <button className="primaryBtn" disabled={!applied}>
              📥 HD 화질 다운로드 (.mp4)
            </button>
            <button className="secondaryBtn" disabled={!applied}>
              📝 대본 (.txt)
            </button>
            <button className="secondaryBtn" disabled={!applied}>
              🏷️ 태그 복사
            </button>
          </div>
        </section>

        {/* 다음 단계 */}
        <section className="nextSteps">
          <h3 className="nextStepsTitle">🚀 다음 단계</h3>
          <div className="nextStepsGrid">
            <Link href="/" className="nextStepCard" style={{textDecoration: 'none'}}>
              <div className="nextStepIcon">🎬</div>
              <div className="nextStepTitle">또 다른 영상 만들기</div>
              <div className="nextStepDesc">다른 키워드로 새 영상 제작</div>
            </Link>
            <Link href="/assets" className="nextStepCard" style={{textDecoration: 'none'}}>
              <div className="nextStepIcon">📁</div>
              <div className="nextStepTitle">내 영상 보관함</div>
              <div className="nextStepDesc">만든 영상들 관리하기</div>
            </Link>
            <Link href="/blog" className="nextStepCard" style={{textDecoration: 'none'}}>
              <div className="nextStepIcon">📚</div>
              <div className="nextStepTitle">크리에이터 노하우</div>
              <div className="nextStepDesc">조회수 올리는 비법 읽기</div>
            </Link>
          </div>
        </section>

        <div className="adWrap">
          <AdSlot slot="done-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
