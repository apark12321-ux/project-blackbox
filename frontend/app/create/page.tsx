'use client';
/**
 * /create - 분야 선택 (12개 카테고리)
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V11Shell, setProject } from '../_shared/V11Shell';
import { CATEGORIES, getTrendingKeywords } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

function CreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string>('');
  const [demoKeyword, setDemoKeyword] = useState<string>('');

  useEffect(() => {
    // URL 파라미터로 카테고리 미리 선택
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.find(c => c.id === cat)) {
      setSelected(cat);
    }
    // 홈에서 입력한 키워드 보존
    const demo = searchParams.get('demo');
    if (demo) {
      setDemoKeyword(demo);
    }
  }, [searchParams]);

  const handleNext = () => {
    if (!selected) return;
    const cat = CATEGORIES.find((c) => c.id === selected);
    if (!cat) return;
    setProject({
      category: selected,
      categoryLabel: cat.name,
      keyword: demoKeyword || undefined,  // 홈에서 입력한 키워드 보존
      step: 1
    });
    // 키워드가 이미 있으면 /keyword 페이지에 미리 채워서 보냄
    if (demoKeyword) {
      router.push(`/keyword?category=${selected}&kw=${encodeURIComponent(demoKeyword)}`);
    } else {
      router.push('/keyword');
    }
  };

  return (
    <V11Shell currentStep={1}>
      <style jsx>{`
        .page { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }
        
        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 24px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }

        .header { text-align: center; margin-bottom: 36px; }
        .stepBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .title {
          font-size: 32px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; line-height: 1.6; }
        @media (max-width: 600px) { .title { font-size: 24px; } }

        .steps {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-bottom: 32px;
          font-size: 12px; color: #888;
          flex-wrap: wrap;
        }
        .stepDot {
          width: 24px; height: 24px;
          background: #c65f3b; color: #fff;
          border-radius: 50%; line-height: 24px;
          font-weight: 800; font-size: 11px;
        }
        .stepDot.inactive { background: #ddd; color: #888; }
        .stepLine { width: 24px; height: 2px; background: #ddd; }

        .grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 32px;
        }
        @media (max-width: 720px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); } }

        .card {
          background: #fff; border: 2px solid #e5e5e5;
          border-radius: 14px; padding: 20px 14px;
          cursor: pointer; transition: all 0.15s;
          font-family: inherit; text-align: center;
          position: relative;
        }
        .card:hover { border-color: #c65f3b; background: #fffbf8; }
        .card.selected {
          border-color: #c65f3b; background: #fdf1e7;
        }
        .cardEmoji { font-size: 32px; margin-bottom: 8px; }
        .cardName {
          font-size: 14px; font-weight: 700;
          color: #1a1a1a; margin-bottom: 4px;
        }
        .cardDesc {
          font-size: 11px; color: #888;
          line-height: 1.4;
        }
        .cardHot {
          position: absolute; top: 8px; right: 8px;
          padding: 1px 6px; background: #ff6b35;
          color: #fff; font-size: 9px; font-weight: 700;
          border-radius: 4px;
        }
        .cardMeta {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }
        .cardLevel {
          font-size: 10px;
          font-weight: 700; padding: 3px 8px;
          border-radius: 100px;
          display: inline-block;
        }
        .cardLevel.level-easy { background: #e8f5e9; color: #2e7d32; }
        .cardLevel.level-normal { background: #fff8e1; color: #f57c00; }
        .cardLevel.level-hard { background: #ffebee; color: #c62828; }
        .cardKeywords {
          font-size: 10px;
          color: #888;
          font-weight: 600;
        }

        .ctaBtn {
          width: 100%; padding: 18px 24px;
          background: #c65f3b; color: #fff;
          border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .ctaBtn:hover:not(:disabled) {
          background: #a64a2a; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.25);
        }
        .ctaBtn:disabled { background: #ccc; cursor: not-allowed; }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>분야 선택</span>
        </nav>

        <div className="steps">
          <span className="stepDot">1</span>
          <span className="stepLine" />
          <span className="stepDot inactive">2</span>
          <span className="stepLine" />
          <span className="stepDot inactive">3</span>
          <span className="stepLine" />
          <span className="stepDot inactive">4</span>
        </div>

        <header className="header">
          <div className="stepBadge">STEP 1 · 분야 선택</div>
          <h1 className="title">어떤 분야의 영상을 만드시나요?</h1>
          <p className="sub">12개 분야 중 원하는 카테고리를 선택해주세요</p>
        </header>

        <div className="grid">
          {CATEGORIES.map((cat) => {
            const keywordCount = getTrendingKeywords(cat.id).length;
            return (
              <button
                key={cat.id}
                className={`card ${selected === cat.id ? 'selected' : ''}`}
                onClick={() => setSelected(cat.id)}
              >
                {cat.hot && <div className="cardHot">HOT</div>}
                <div className="cardEmoji">{cat.emoji}</div>
                <div className="cardName">{cat.name}</div>
                <div className="cardDesc">{cat.description}</div>
                <div className="cardMeta">
                  <span className={`cardLevel level-${cat.competition === '낮음' ? 'easy' : cat.competition === '높음' ? 'hard' : 'normal'}`}>
                    {cat.competition === '낮음' ? '🟢 입문 쉬움' : cat.competition === '높음' ? '🔴 경쟁 치열' : '🟡 보통 난이도'}
                  </span>
                  <span className="cardKeywords">
                    🎯 키워드 {keywordCount}개
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button className="ctaBtn" onClick={handleNext} disabled={!selected}>
          다음 단계 →
        </button>

        <div className="adArea">
          <AdSlot slot="create-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div />}>
      <CreatePageInner />
    </Suspense>
  );
}
