'use client';
/**
 * /configure - 시나리오 선택 (영상 구조)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import { getCategoryById, SCENARIOS } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function ConfigurePage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const project = getProject();
    if (!project.category || !project.keyword) {
      router.push('/create');
      return;
    }
    setCategory(project.category);
    setKeyword(project.keyword);
    if (project.scenarioStyleId) setSelected(project.scenarioStyleId);
  }, [router]);

  const cat = getCategoryById(category);
  if (!cat) return null;

  const handleNext = () => {
    if (!selected) {
      alert('시나리오를 선택해주세요.');
      return;
    }
    setProject({
      scenarioStyleId: selected,
      templateId: selected,
      step: 3,
    });
    router.push('/processing');
  };

  return (
    <V11Shell currentStep={3}>
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
        .stepLine { width: 24px; height: 2px; background: #c65f3b; }
        .stepLine.inactive { background: #ddd; }

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
          margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: #555; flex-wrap: wrap;
        }
        .summary strong { color: #1a1a1a; }

        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin-bottom: 28px;
        }
        @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }

        .card {
          background: #fff; border: 2px solid #e5e5e5;
          border-radius: 12px; padding: 20px;
          cursor: pointer; transition: all 0.15s;
          font-family: inherit; text-align: left;
        }
        .card:hover { border-color: #c65f3b; background: #fffbf8; }
        .card.selected { border-color: #c65f3b; background: #fdf1e7; }
        .cardHead { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .cardEmoji { font-size: 24px; }
        .cardName { font-size: 15px; font-weight: 700; color: #1a1a1a; }
        .cardDesc {
          font-size: 13px; color: #666; line-height: 1.5;
          margin-bottom: 10px;
        }
        .cardStruct {
          font-size: 11.5px; color: #888;
          padding-top: 10px; border-top: 1px dashed #e5e5e5;
        }
        .cardStruct strong { color: #555; }

        .ctaBtn {
          width: 100%; padding: 18px 24px;
          background: #c65f3b; color: #fff;
          border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .ctaBtn:hover:not(:disabled) { background: #a64a2a; }
        .ctaBtn:disabled { background: #ccc; cursor: not-allowed; }

        .adArea { margin: 32px 0; }

        /* 🎯 시니어 모바일 최적화 */
        @media (max-width: 600px) {
          .page { padding: 18px 14px 50px !important; }
          .pageTitle { font-size: 22px !important; line-height: 1.4 !important; }
          .pageSub { font-size: 14.5px !important; line-height: 1.7 !important; }
          .stepBadge { font-size: 12px !important; }
          
          /* 시나리오 카드 */
          .scenCard {
            padding: 18px 16px !important;
            min-height: 110px;
          }
          .scenEmoji { font-size: 28px !important; }
          .scenName { font-size: 15px !important; line-height: 1.4 !important; }
          .scenDesc { font-size: 13px !important; line-height: 1.65 !important; }
          
          .ctaBtn {
            font-size: 16px !important;
            padding: 16px 28px !important;
            min-height: 52px;
            width: 100%;
          }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/create">분야</Link>
          <span className="sep">/</span>
          <Link href="/keyword">키워드</Link>
          <span className="sep">/</span>
          <span>시나리오</span>
        </nav>

        <div className="steps">
          <span className="stepDot">✓</span>
          <span className="stepLine" />
          <span className="stepDot">✓</span>
          <span className="stepLine" />
          <span className="stepDot">3</span>
          <span className="stepLine inactive" />
          <span className="stepDot inactive">4</span>
        </div>

        <header className="header">
          <div className="stepBadge">STEP 3 · 시나리오 선택</div>
          <h1 className="title">어떤 형식의 영상으로 만들까요?</h1>
          <p className="sub">시청자가 끝까지 보게 만드는 영상 구조 6가지</p>
        </header>

        <div className="summary">
          <span>{cat.emoji} <strong>{cat.name}</strong></span>
          <span>·</span>
          <span>🎯 <strong>{keyword}</strong></span>
        </div>

        <div className="grid">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              className={`card ${selected === s.id ? 'selected' : ''}`}
              onClick={() => setSelected(s.id)}
            >
              <div className="cardHead">
                <span className="cardEmoji">{s.emoji}</span>
                <div className="cardName">{s.name}</div>
              </div>
              <div className="cardDesc">{s.description}</div>
              <div className="cardStruct">
                <strong>구조:</strong> {s.structure}
              </div>
            </button>
          ))}
        </div>

        <button className="ctaBtn" onClick={handleNext} disabled={!selected}>
          🚀 AI 분석 시작하기
        </button>

        <div className="adArea">
          <AdSlot slot="configure-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
