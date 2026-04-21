'use client';
/**
 * /create - 카테고리 선택 (STEP 1)
 * 모바일 최적화 + V11Shell
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, setProject } from '../_shared/V11Shell';

const CATEGORIES = [
  { slug: 'economy', label: '경제', icon: '💰', sub: '주식·부동산·연금·절세', cpm: '$12~18' },
  { slug: 'health', label: '건강', icon: '🏥', sub: '시니어·질병예방·의학상식', cpm: '$15~22' },
  { slug: 'selfdev', label: '자기계발', icon: '🧠', sub: '습관·독서·마인드셋', cpm: '$8~14' },
  { slug: 'tech', label: 'IT', icon: '💻', sub: 'AI·앱·디지털 트렌드', cpm: '$10~16' },
  { slug: 'life', label: '라이프', icon: '🌿', sub: '요리·여행·인테리어', cpm: '$8~12' },
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
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 20px 60px;
        }
        .header {
          text-align: center;
          margin-bottom: 36px;
        }
        .eyebrow {
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .title {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .sub {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }
        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 84px;
        }
        .card:hover {
          border-color: #cbd5e1;
        }
        .cardSelected {
          border-color: #2563eb;
          background: #eff6ff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }
        .icon {
          width: 48px;
          height: 48px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .cardSelected .icon { background: #fff; }
        .cardText { flex: 1; min-width: 0; }
        .cardLabel {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .cardSub {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
        .cardCpm {
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          margin-top: 4px;
        }
        .footerBar {
          position: sticky;
          bottom: 20px;
          background: #fff;
          padding: 12px;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
        }
        .nextBtn {
          width: 100%;
          padding: 16px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          min-height: 52px;
        }
        .nextBtn:hover:not(:disabled) { background: #1d4ed8; }
        .nextBtn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          color: #fff;
        }

        @media (max-width: 640px) {
          .page { padding: 28px 16px 40px; }
          .header { margin-bottom: 24px; }
          .title { font-size: 24px; }
          .sub { font-size: 14px; }
          .grid { grid-template-columns: 1fr; gap: 10px; }
          .card { padding: 16px; gap: 12px; min-height: 76px; }
          .icon { width: 44px; height: 44px; font-size: 22px; }
          .cardLabel { font-size: 15px; }
          .nextBtn { padding: 14px; font-size: 14px; }
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
              <div className="icon">{cat.icon}</div>
              <div className="cardText">
                <div className="cardLabel">{cat.label}</div>
                <div className="cardSub">{cat.sub}</div>
                <div className="cardCpm">예상 CPM {cat.cpm}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="footerBar">
          <button className="nextBtn" onClick={handleNext} disabled={!selected}>
            {selected
              ? `${CATEGORIES.find((c) => c.slug === selected)?.label} 선택하고 키워드 받기 →`
              : '카테고리를 선택하세요'}
          </button>
        </div>
      </div>
    </V11Shell>
  );
}
