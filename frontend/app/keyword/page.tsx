'use client';
/**
 * /keyword - 키워드 입력
 * 트렌드 키워드 10개 자동 표시 + 직접 입력
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import { getCategoryById, getTrendingKeywords } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function KeywordPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const project = getProject();
    if (!project.category) {
      router.push('/create');
      return;
    }
    setCategory(project.category);
    if (project.keyword) setKeyword(project.keyword);
  }, [router]);

  const cat = getCategoryById(category);
  const trendingKeywords = getTrendingKeywords(category);

  if (!cat) return null;

  const handleKeywordSelect = (kw: string) => setKeyword(kw);

  const handleNext = () => {
    if (!keyword.trim()) {
      alert('키워드를 선택하거나 입력해주세요.');
      return;
    }
    setProject({ keyword: keyword.trim(), step: 2 });
    router.push('/configure');
  };

  return (
    <V11Shell currentStep={2}>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 40px 24px 60px; }
        
        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 24px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }

        .steps {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-bottom: 32px;
        }
        .stepDot {
          width: 24px; height: 24px;
          background: #c65f3b; color: #fff;
          border-radius: 50%; line-height: 24px;
          font-weight: 800; font-size: 11px;
          text-align: center;
        }
        .stepDot.inactive { background: #ddd; color: #888; }
        .stepLine { width: 24px; height: 2px; background: #ddd; }
        .stepLine.active { background: #c65f3b; }

        .header { text-align: center; margin-bottom: 32px; }
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

        .summary {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 14px 18px;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: #555;
        }
        .summary strong { color: #1a1a1a; }

        .keywordBox {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 24px;
          margin-bottom: 28px;
        }
        .boxLabel {
          font-size: 13px; font-weight: 700;
          color: #555; margin-bottom: 14px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .boxLabel .selectedCat {
          color: #c65f3b; font-weight: 800;
        }
        .keywordList {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (max-width: 600px) { .keywordList { grid-template-columns: 1fr; } }
        .keywordItem {
          padding: 11px 14px;
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 8px; cursor: pointer;
          font-size: 13.5px; color: #333;
          transition: all 0.15s; font-family: inherit;
          text-align: left; font-weight: 500;
        }
        .keywordItem:hover {
          border-color: #c65f3b; background: #fffbf8; color: #c65f3b;
        }
        .keywordItem.selected {
          border-color: #c65f3b; background: #c65f3b;
          color: #fff; font-weight: 700;
        }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 18px 0; font-size: 12px; color: #999;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #e5e5e5;
        }

        .input {
          width: 100%; padding: 14px 16px;
          font-size: 15px; font-family: inherit;
          border: 2px solid #e5e5e5; border-radius: 10px;
          background: #fff; color: #1a1a1a;
          transition: all 0.2s; box-sizing: border-box;
        }
        .input:focus { outline: none; border-color: #c65f3b; }
        .input::placeholder { color: #b0b0b0; }

        .ctaBtn {
          width: 100%; padding: 18px 24px;
          background: #c65f3b; color: #fff;
          border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .ctaBtn:hover:not(:disabled) {
          background: #a64a2a;
        }
        .ctaBtn:disabled { background: #ccc; cursor: not-allowed; }

        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/create">분야 선택</Link>
          <span className="sep">/</span>
          <span>키워드 입력</span>
        </nav>

        <div className="steps">
          <span className="stepDot">✓</span>
          <span className="stepLine active" />
          <span className="stepDot">2</span>
          <span className="stepLine" />
          <span className="stepDot inactive">3</span>
          <span className="stepLine" />
          <span className="stepDot inactive">4</span>
        </div>

        <header className="header">
          <div className="stepBadge">STEP 2 · 키워드 입력</div>
          <h1 className="title">어떤 키워드로 영상을 만드시나요?</h1>
          <p className="sub">아래 추천 키워드를 클릭하거나 직접 입력해주세요</p>
        </header>

        <div className="summary">
          <span>{cat.emoji} <strong>{cat.name}</strong></span>
          <span>·</span>
          <span>분야 선택 완료</span>
        </div>

        <div className="keywordBox">
          <div className="boxLabel">
            <span><span className="selectedCat">{cat.name}</span> 추천 키워드</span>
            <span style={{ fontSize: 12, color: '#888' }}>10개</span>
          </div>

          <div className="keywordList">
            {trendingKeywords.map((kw, idx) => (
              <button
                key={idx}
                className={`keywordItem ${keyword === kw ? 'selected' : ''}`}
                onClick={() => handleKeywordSelect(kw)}
              >
                {kw}
              </button>
            ))}
          </div>

          <div className="divider">또는 직접 입력</div>

          <input
            type="text"
            className="input"
            placeholder="원하는 키워드를 입력하세요 (예: 50대 운동 루틴)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <button 
          className="ctaBtn" 
          onClick={handleNext}
          disabled={!keyword.trim()}
        >
          다음 단계 →
        </button>

        <div className="adArea">
          <AdSlot slot="keyword-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
