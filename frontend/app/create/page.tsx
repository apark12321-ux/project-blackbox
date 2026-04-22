'use client';
/**
 * /create - 카테고리 선택 (YouTube 썸네일 카드 스타일)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, setProject } from '../_shared/V11Shell';

const CATEGORIES = [
  { slug: 'economy', label: '경제', icon: '💰', sub: '주식·부동산·연금·절세', cpm: '$12~18', thumb: 'linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%)' },
  { slug: 'health', label: '건강', icon: '🏥', sub: '시니어·질병예방·의학상식', cpm: '$15~22', thumb: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
  { slug: 'selfdev', label: '자기계발', icon: '🧠', sub: '습관·독서·마인드셋', cpm: '$8~14', thumb: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)' },
  { slug: 'tech', label: 'IT', icon: '💻', sub: 'AI·앱·디지털 트렌드', cpm: '$10~16', thumb: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { slug: 'life', label: '라이프', icon: '🌿', sub: '요리·여행·인테리어', cpm: '$8~12', thumb: 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 100%)' },
];

export default function CreatePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('');

  const handleNext = () => {
    if (!selected) return;
    const cat = CATEGORIES.find((c) => c.slug === selected);
    if (!cat) return;
    setProject({ category: selected, categoryLabel: cat.label, step: 1 });
    router.push('/keyword');
  };

  return (
    <V11Shell currentStep={1}>
      <style jsx>{`
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 60px;
        }
        .header {
          text-align: center;
          margin-bottom: 36px;
        }
        .eyebrow {
          font-size: 12px;
          font-weight: 700;
          color: #ff0000;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }
        .title {
          font-size: 32px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .sub {
          font-size: 15px;
          color: #606060;
          line-height: 1.6;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px 16px;
          margin-bottom: 32px;
        }
        .card {
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .thumb {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .cardSelected .thumb {
          box-shadow: 0 0 0 3px #ff0000;
        }
        .thumbIcon {
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
        }
        .cpmBadge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }
        .selectedCheck {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: #ff0000;
          color: #fff;
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
        .cardRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .miniIcon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f2f2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .cardText { flex: 1; min-width: 0; }
        .cardTitle {
          font-size: 15px;
          font-weight: 700;
          color: #0f0f0f;
          margin: 0 0 3px;
          letter-spacing: -0.01em;
        }
        .cardSub {
          font-size: 13px;
          color: #606060;
          line-height: 1.4;
          margin: 0;
        }
        .footerBar {
          position: sticky;
          bottom: 16px;
          background: #fff;
          padding: 10px;
          border-radius: 999px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          border: 1px solid #e5e5e5;
        }
        .nextBtn {
          width: 100%;
          padding: 14px;
          background: #ff0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          min-height: 52px;
        }
        .nextBtn:hover:not(:disabled) { background: #cc0000; }
        .nextBtn:disabled {
          background: #e5e5e5;
          cursor: not-allowed;
          color: #888;
        }

        @media (max-width: 640px) {
          .page { padding: 24px 16px 40px; }
          .header { margin-bottom: 24px; }
          .title { font-size: 24px; }
          .sub { font-size: 14px; }
          .grid { grid-template-columns: 1fr; gap: 16px; }
          .thumb { font-size: 56px; }
          .cardTitle { font-size: 14px; }
          .cardSub { font-size: 12px; }
          .nextBtn { padding: 13px; font-size: 14px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="eyebrow">STEP 1 · 카테고리</div>
          <h1 className="title">관심 분야를 선택하세요</h1>
          <p className="sub">선택한 카테고리의 <strong>블루오션 키워드</strong>를 AI가 추천합니다</p>
        </div>

        <div className="grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              className={`card ${selected === cat.slug ? 'cardSelected' : ''}`}
              onClick={() => setSelected(cat.slug)}
            >
              <div className="thumb" style={{ background: cat.thumb }}>
                <span className="thumbIcon">{cat.icon}</span>
                <div className="cpmBadge">CPM {cat.cpm}</div>
                {selected === cat.slug && <div className="selectedCheck">✓</div>}
              </div>
              <div className="cardMeta">
                <div className="cardRow">
                  <div className="miniIcon">{cat.icon}</div>
                  <div className="cardText">
                    <h3 className="cardTitle">{cat.label}</h3>
                    <p className="cardSub">{cat.sub}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="footerBar">
          <button className="nextBtn" onClick={handleNext} disabled={!selected}>
            {selected
              ? `▶ ${CATEGORIES.find((c) => c.slug === selected)?.label} 키워드 받기`
              : '카테고리를 선택하세요'}
          </button>
        </div>
      </div>
    </V11Shell>
  );
}
