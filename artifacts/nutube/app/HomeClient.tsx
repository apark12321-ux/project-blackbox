'use client';
/**
 * 새 홈 페이지 - 카테고리 선택 먼저
 *
 * Step 1: 카테고리 선택 (8개, 베일 벗기기)
 * → Step 2: 키워드 입력 (/keyword)
 *
 * SEO: 시맨틱 HTML 구조 + JSON-LD
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject, AlgoMakerLogo } from './_shared/V11Shell';
import { CATEGORIES } from './_shared/platforms';
import AdSlot from './_shared/AdSlot';

export default function HomeClient() {
  const router = useRouter();
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const calculateUsers = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const minutesSinceStart = Math.floor((now.getTime() - startOfDay.getTime()) / 60000);
      const dailyStart = 1200;
      const perMinute = 1.25;
      return Math.floor(dailyStart + minutesSinceStart * perMinute);
    };

    setActiveUsers(calculateUsers());

    // 10~30초마다 자연스럽게 1씩 증가 (절대 감소 X)
    let timerId: NodeJS.Timeout;
    const scheduleNext = () => {
      const delay = 10000 + Math.random() * 20000;
      timerId = setTimeout(() => {
        setActiveUsers((u) => u + 1);
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setProject({ category: categoryId, step: 1 });
    router.push('/keyword');
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 0 0 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero {
          padding: 48px 32px 36px;
          text-align: center;
          position: relative;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 350px;
          background: radial-gradient(ellipse, rgba(198, 95, 59, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .heroLogoWrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .stepBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border: 1px solid rgba(198, 95, 59, 0.15);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          color: #a64a2a;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 1;
        }
        .heroTitle {
          font-size: 46px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #2a2419;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 16px;
          color: #564a3a;
          font-weight: 500;
          line-height: 1.65;
          max-width: 560px;
          margin: 0 auto 22px;
          position: relative;
          z-index: 1;
        }
        .heroMeta {
          font-size: 13px;
          color: #8a7d6a;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .heroMeta strong {
          color: #c65f3b;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        /* 카테고리 그리드 */
        .catSection {
          padding: 20px 32px 0;
        }
        .catHead {
          text-align: center;
          margin-bottom: 24px;
        }
        .catHeadTitle {
          font-size: 22px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .catHeadSub {
          font-size: 14px;
          color: #8a7d6a;
          font-weight: 500;
        }

        .catGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .catCard {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 16px;
          padding: 24px 22px;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 280px;
        }
        .catCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(90, 74, 58, 0.1);
          border-color: rgba(198, 95, 59, 0.2);
        }
        .catCardHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .catEmoji {
          font-size: 34px;
          line-height: 1;
        }
        .hotBadge {
          padding: 3px 9px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.01em;
          box-shadow: 0 2px 6px rgba(198, 95, 59, 0.3);
        }
        .catName {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .catDesc {
          font-size: 12.5px;
          color: #564a3a;
          line-height: 1.55;
          font-weight: 500;
          margin-bottom: 14px;
        }
        .catExamples {
          flex: 1;
          background: #fff;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 14px;
        }
        .catExamplesLabel {
          font-size: 10px;
          font-weight: 800;
          color: #8a7d6a;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .catExample {
          font-size: 11px;
          color: #564a3a;
          line-height: 1.55;
          padding: 2px 0;
          font-weight: 500;
        }
        .catExample::before {
          content: '•';
          margin-right: 5px;
          color: #c65f3b;
          font-weight: 800;
        }
        .catStats {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px dashed rgba(90, 74, 58, 0.1);
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .catStats strong {
          color: #2a2419;
          font-weight: 700;
        }

        .adWrap {
          padding: 40px 32px 0;
        }

        @media (max-width: 1024px) {
          .catGrid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .hero { padding: 32px 20px 28px; }
          .heroTitle { font-size: 30px; }
          .heroSub { font-size: 14px; }
          .catSection { padding: 16px 16px 0; }
          .catGrid { grid-template-columns: repeat(2, 1fr); }
          .adWrap { padding: 32px 16px 0; }
        }
        @media (max-width: 500px) {
          .catGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="heroLogoWrap">
            <AlgoMakerLogo size="lg" showSubtitle={false} />
          </div>
          <div className="stepBadge">
            <span>✨</span>
            <span>STEP 1 / 6 · 분야 선택</span>
          </div>
          <h1 className="heroTitle" id="hero-heading">
            어떤 분야의 영상을<br />
            <span className="accent">만들고 싶으세요?</span>
          </h1>
          <p className="heroSub">
            카테고리를 선택하면 해당 분야 특화 AI가<br />
            키워드 분석부터 영상 완성까지 자동 처리해요
          </p>
          <div className="heroMeta">
            지금 <strong>{activeUsers.toLocaleString()}</strong>명이 AlgoMaker로 영상을 만들고 있어요
          </div>
        </section>

        <section className="catSection" aria-labelledby="category-heading">
          <div className="catHead">
            <h2 className="catHeadTitle" id="category-heading">📂 카테고리 선택</h2>
            <p className="catHeadSub">각 카드에 어떤 영상을 만들 수 있는지 예시가 들어있어요</p>
          </div>

          <div className="catGrid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="catCard"
                style={{ borderTop: `3px solid ${cat.color}` }}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="catCardHead">
                  <span className="catEmoji">{cat.emoji}</span>
                  {cat.hot && <span className="hotBadge">🔥 인기</span>}
                </div>
                <div className="catName">{cat.name}</div>
                <div className="catDesc">{cat.description}</div>
                <div className="catExamples">
                  <div className="catExamplesLabel">💡 이런 영상 만들 수 있어요</div>
                  {cat.examples.slice(0, 2).map((ex, i) => (
                    <div key={i} className="catExample">{ex}</div>
                  ))}
                </div>
                <div className="catStats">
                  <span>📊 평균 <strong>{cat.avgViews}</strong></span>
                  <span>⚔️ 경쟁 <strong>{cat.competition}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="adWrap">
          <AdSlot slot="home-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
