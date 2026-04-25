'use client';
/**
 * Step 4: SNS 플랫폼 선택
 *
 * 각 플랫폼 카드에 상세 설명 (베일 벗기기)
 * YouTube 롱폼 / Shorts / TikTok / Instagram Reels
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, getProject, setProject } from '../_shared/V11Shell';
import { PLATFORMS } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';
import AlgorithmReveal from '../_shared/AlgorithmReveal';
import LiveAnalysisBadge from '../_shared/LiveAnalysisBadge';

export default function PlatformPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const project = getProject();
    if (!project.keyword || !project.scenarioStyleId) {
      router.push('/');
      return;
    }
    setKeyword(project.keyword);
  }, [router]);

  const togglePlatform = (platformId: string) => {
    setSelected((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const [revealing, setRevealing] = useState(false);

  const handleNext = () => {
    if (selected.length === 0) return;
    setProject({
      step: 4,
    });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('v11_platforms', JSON.stringify(selected));
      } catch {}
    }
    
    // 🔮 알고리즘 작동 풀스크린
    setRevealing(true);
    setTimeout(() => {
      router.push('/metadata');
    }, 2800);
  };

  return (
    <>
      <AlgorithmReveal active={revealing} stage="플랫폼 알고리즘 매핑 · 메타데이터 생성" />
      <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 64px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .breadcrumb a { color: #8a7d6a; transition: color 0.15s; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #b8ad9b; }

        .hero {
          text-align: center;
          margin-bottom: 36px;
        }
        .stepBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          color: #a64a2a;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .heroTitle {
          font-size: 38px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 15px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .heroSub strong { color: #c65f3b; font-weight: 700; }
        .heroHint {
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }

        /* 플랫폼 그리드 */
        .platformGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .platformCard {
          background: #faf8f4;
          border: 2px solid rgba(90, 74, 58, 0.08);
          border-radius: 16px;
          padding: 24px 26px;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .platformCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(90, 74, 58, 0.08);
        }
        .platformCard.selected {
          border-color: #c65f3b;
          background: linear-gradient(180deg, #fdf1e7 0%, #faf8f4 60%);
          box-shadow: 0 8px 20px rgba(198, 95, 59, 0.15);
        }
        .checkbox {
          position: absolute;
          top: 20px; right: 20px;
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 2px solid rgba(90, 74, 58, 0.2);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .platformCard.selected .checkbox {
          background: #c65f3b;
          border-color: #c65f3b;
        }
        .checkIcon {
          color: #fff;
          font-size: 16px;
          font-weight: 800;
        }

        .platformHead {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 16px;
          padding-right: 40px;
        }
        .platformEmoji {
          font-size: 38px;
          line-height: 1;
          flex-shrink: 0;
        }
        .platformNames {
          flex: 1;
        }
        .platformName {
          font-size: 18px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        .platformNameEn {
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .platformSpecs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
          padding: 12px 14px;
          background: #fff;
          border-radius: 10px;
        }
        .specItem {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .specLabel {
          font-size: 10px;
          color: #8a7d6a;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .specValue {
          font-size: 12.5px;
          color: #2a2419;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .platformExample {
          padding: 10px 12px;
          background: #fff;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 12px;
          color: #564a3a;
          line-height: 1.5;
          font-weight: 500;
          font-style: italic;
        }
        .platformExample strong {
          color: #c65f3b;
          font-style: normal;
          font-weight: 700;
        }

        .platformAdvantages {
          padding: 12px 14px;
          background: rgba(125, 155, 124, 0.1);
          border-radius: 8px;
        }
        .advantagesLabel {
          font-size: 10px;
          font-weight: 800;
          color: #5e7e5d;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .advItem {
          font-size: 11.5px;
          color: #2a2419;
          line-height: 1.55;
          padding: 2px 0;
          font-weight: 500;
        }
        .advItem::before {
          content: '✓';
          color: #5e7e5d;
          font-weight: 800;
          margin-right: 6px;
        }

        /* 하단 버튼 */
        .bottomBar {
          position: sticky;
          bottom: 20px;
          background: rgba(245, 241, 234, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(198, 95, 59, 0.15);
          border-radius: 14px;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          box-shadow: 0 8px 24px rgba(90, 74, 58, 0.1);
        }
        .countBadge {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #2a2419;
          font-weight: 700;
        }
        .countNum {
          padding: 4px 12px;
          background: #c65f3b;
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        .countNum.zero {
          background: #b8ad9b;
        }
        .nextBtn {
          padding: 12px 28px;
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
          box-shadow: 0 4px 14px rgba(198, 95, 59, 0.3);
        }
        .nextBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(198, 95, 59, 0.4);
        }
        .nextBtn:disabled {
          background: #ece6db;
          color: #b8ad9b;
          cursor: not-allowed;
          box-shadow: none;
        }

        .adWrap { margin: 28px 0 0; }

        @media (max-width: 768px) {
          .page { padding: 24px 16px 40px; }
          .heroTitle { font-size: 28px; }
          .platformGrid { grid-template-columns: 1fr; }
          .platformSpecs { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/keyword">키워드</Link>
          <span className="sep">/</span>
          <span>플랫폼 선택</span>
        </nav>

        <LiveAnalysisBadge stage="플랫폼별 알고리즘 분석 중" signals={4892} />

        <section className="hero">
          <div className="stepBadge">⚠️ STEP 4 · 알고리즘 매핑</div>
          <h1 className="heroTitle">
            플랫폼마다<br />
            <span className="accent">알고리즘이 다릅니다.</span>
          </h1>
          <p className="heroSub">
            같은 영상도 플랫폼별로 다르게 작동.<br />
            <strong>알고리즘이 각각 최적화합니다.</strong>
          </p>
        </section>

        <div className="platformGrid">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className={`platformCard ${selected.includes(platform.id) ? 'selected' : ''}`}
              onClick={() => togglePlatform(platform.id)}
              style={{
                borderTopColor: selected.includes(platform.id) ? '#c65f3b' : undefined,
                borderTop: `3px solid ${platform.color}`,
              }}
            >
              <div className="checkbox">
                {selected.includes(platform.id) && <span className="checkIcon">✓</span>}
              </div>

              <div className="platformHead">
                <span className="platformEmoji">{platform.emoji}</span>
                <div className="platformNames">
                  <div className="platformName">{platform.name}</div>
                  <div className="platformNameEn">{platform.nameEn}</div>
                </div>
              </div>

              <div className="platformSpecs">
                <div className="specItem">
                  <span className="specLabel">📏 길이</span>
                  <span className="specValue">{platform.durationLabel}</span>
                </div>
                <div className="specItem">
                  <span className="specLabel">📱 화면</span>
                  <span className="specValue">{platform.orientation}</span>
                </div>
                <div className="specItem">
                  <span className="specLabel">💰 수익</span>
                  <span className="specValue">{platform.revenue}</span>
                </div>
                <div className="specItem">
                  <span className="specLabel">👥 타겟</span>
                  <span className="specValue" style={{fontSize: 11}}>{platform.audience}</span>
                </div>
              </div>

              <div className="platformExample">
                💡 이런 영상이에요:<br />
                <strong>{platform.exampleContent}</strong>
              </div>

              <div className="platformAdvantages">
                <div className="advantagesLabel">✨ 유리한 점</div>
                {platform.advantages.slice(0, 3).map((adv, i) => (
                  <div key={i} className="advItem">{adv}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bottomBar">
          <div className="countBadge">
            <span>선택한 플랫폼</span>
            <span className={`countNum ${selected.length === 0 ? 'zero' : ''}`}>
              {selected.length}개
            </span>
          </div>
          <button
            className="nextBtn"
            onClick={handleNext}
            disabled={selected.length === 0}
          >
            다음 단계 →
          </button>
        </div>

        <div className="adWrap">
          <AdSlot slot="platform-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
    </>
  );
}
