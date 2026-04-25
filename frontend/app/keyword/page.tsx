'use client';
/**
 * 키워드 페이지 - 시나리오 선택
 * 박예준 대표 컨셉: 깔끔한 도구
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, getProject, setProject } from '../_shared/V11Shell';
import { getCategoryById } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

const SCENARIOS = [
  {
    id: 'curiosity',
    name: '호기심 자극형',
    emoji: '🤔',
    description: '시청자의 궁금증을 유발하는 구조',
    structure: '문제 제기 → 단서 제공 → 핵심 공개',
  },
  {
    id: 'tutorial',
    name: '단계별 가이드',
    emoji: '📋',
    description: '따라하기 쉬운 단계별 설명',
    structure: '도입 → 1단계 → 2단계 → 마무리',
  },
  {
    id: 'review',
    name: '리뷰·비교',
    emoji: '⚖️',
    description: '제품·서비스 비교 분석',
    structure: '소개 → 장점 → 단점 → 결론',
  },
  {
    id: 'storytelling',
    name: '스토리텔링',
    emoji: '📖',
    description: '경험담 기반 자연스러운 흐름',
    structure: '시작 → 갈등 → 해결 → 교훈',
  },
  {
    id: 'list',
    name: '리스트형',
    emoji: '🔢',
    description: 'BEST/TOP 형식 모음',
    structure: '인트로 → 1위 → 2위 → 3위 → 정리',
  },
  {
    id: 'qa',
    name: 'Q&A형',
    emoji: '💬',
    description: '질문-답변 형식',
    structure: '질문 → 답변 → 부연 설명',
  },
];

export default function KeywordPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const project = getProject();
    if (!project.category || !project.keyword) {
      router.push('/');
      return;
    }
    setCategory(project.category);
    setKeyword(project.keyword);
  }, [router]);

  const cat = getCategoryById(category);
  if (!cat) return null;

  const handleNext = () => {
    if (!selected) {
      alert('시나리오를 선택해주세요.');
      return;
    }
    setProject({
      category, keyword,
      scenarioStyleId: selected,
      templateId: selected,
      step: 3,
    });
    router.push('/platform');
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 40px 24px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #888; margin-bottom: 24px; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .hero { text-align: center; margin-bottom: 36px; }
        .stepBadge {
          display: inline-block; padding: 6px 14px; background: #fdf1e7;
          color: #c65f3b; border-radius: 100px; font-size: 12px;
          font-weight: 700; margin-bottom: 16px;
        }
        .heroTitle {
          font-size: 32px; font-weight: 800; color: #1a1a1a;
          letter-spacing: -0.025em; margin-bottom: 12px;
        }
        .heroSub { font-size: 15px; color: #666; line-height: 1.6; }
        .summary {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 16px 20px; margin-bottom: 32px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .summaryItem { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; }
        .summaryItem strong { color: #1a1a1a; }
        .summarySep { width: 1px; height: 16px; background: #ddd; }
        .sectionTitle { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin-bottom: 28px;
        }
        @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
        .card {
          background: #fff; border: 2px solid #e5e5e5;
          border-radius: 12px; padding: 20px; cursor: pointer;
          transition: all 0.15s; font-family: inherit; text-align: left;
        }
        .card:hover { border-color: #c65f3b; background: #fffbf8; }
        .card.selected { border-color: #c65f3b; background: #fdf1e7; }
        .cardHead { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .cardEmoji { font-size: 24px; }
        .cardName { font-size: 15px; font-weight: 700; color: #1a1a1a; }
        .cardDesc { font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 8px; }
        .cardStruct {
          font-size: 11.5px; color: #888; padding-top: 8px;
          border-top: 1px dashed #e5e5e5;
        }
        .cardStruct strong { color: #555; }
        .ctaBtn {
          width: 100%; padding: 16px 24px; background: #c65f3b;
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .ctaBtn:hover:not(:disabled) { background: #a64a2a; }
        .ctaBtn:disabled { background: #ccc; cursor: not-allowed; }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>시나리오 선택</span>
        </nav>

        <section className="hero">
          <div className="stepBadge">STEP 2 · 시나리오 선택</div>
          <h1 className="heroTitle">어떤 형식으로 만들까요?</h1>
          <p className="heroSub">시청자가 끝까지 보게 만드는 영상 구조를 선택하세요</p>
        </section>

        <div className="summary">
          <div className="summaryItem">
            <span>{cat.emoji}</span>
            <strong>{cat.name}</strong>
          </div>
          <div className="summarySep" />
          <div className="summaryItem">
            <span>🎯</span>
            <strong>{keyword}</strong>
          </div>
        </div>

        <div className="sectionTitle">시나리오 6개 중 선택</div>

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
          다음 단계 →
        </button>

        <div className="adArea">
          <AdSlot slot="keyword-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
