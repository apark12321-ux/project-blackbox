'use client';
/**
 * 메타데이터 확인 페이지 - AI가 생성할 자료 안내
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, getProject } from '../_shared/V11Shell';
import { getPlatformById, getCategoryById } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function MetadataPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const project = getProject();
    if (!project.category || !project.keyword || !project.scenarioStyleId) {
      router.push('/');
      return;
    }
    setCategory(project.category);
    setKeyword(project.keyword);

    if (typeof window !== 'undefined') {
      try {
        const p = localStorage.getItem('v11_platforms');
        if (p) {
          const arr = JSON.parse(p);
          if (arr.length > 0) {
            setPlatforms(arr);
            return;
          }
        }
        router.push('/platform');
      } catch {
        router.push('/platform');
      }
    }
  }, [router]);

  const cat = getCategoryById(category);
  const platformObjs = platforms.map(id => getPlatformById(id)).filter(Boolean);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => router.push('/done'), 1500);
  };

  if (!cat || platformObjs.length === 0) return null;

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
          border-radius: 14px; padding: 24px; margin-bottom: 24px;
        }
        .summaryRow {
          display: flex; align-items: flex-start; gap: 16px; padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .summaryRow:last-child { border-bottom: none; }
        .summaryLabel {
          font-size: 12px; font-weight: 700; color: #888;
          width: 80px; flex-shrink: 0; padding-top: 2px;
        }
        .summaryValue {
          font-size: 14px; color: #1a1a1a; font-weight: 600;
          flex: 1;
        }
        .platformChips { display: flex; flex-wrap: wrap; gap: 8px; }
        .platformChip {
          padding: 6px 12px; background: #fff; border: 1px solid #e5e5e5;
          border-radius: 100px; font-size: 12.5px; color: #555;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .featuresBox {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 24px; margin-bottom: 28px;
        }
        .featuresBoxTitle {
          font-size: 14px; font-weight: 700; color: #1a1a1a;
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }
        .featuresList { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 600px) { .featuresList { grid-template-columns: 1fr; } }
        .featureItem {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #555;
        }
        .featureItem .check { color: #5e7e5d; font-weight: 800; }
        .ctaBtn {
          width: 100%; padding: 18px 24px; background: #c65f3b;
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .ctaBtn:hover:not(:disabled) { background: #a64a2a; }
        .ctaBtn:disabled { background: #ccc; cursor: not-allowed; }
        .ctaSub { font-size: 12px; opacity: 0.9; display: block; margin-top: 4px; }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/keyword">시나리오</Link>
          <span className="sep">/</span>
          <Link href="/platform">플랫폼</Link>
          <span className="sep">/</span>
          <span>확인</span>
        </nav>

        <section className="hero">
          <div className="stepBadge">STEP 4 · 최종 확인</div>
          <h1 className="heroTitle">선택 내용을 확인해주세요</h1>
          <p className="heroSub">아래 내용으로 AI 추천 자료를 생성합니다</p>
        </section>

        <div className="summary">
          <div className="summaryRow">
            <div className="summaryLabel">분야</div>
            <div className="summaryValue">{cat.emoji} {cat.name}</div>
          </div>
          <div className="summaryRow">
            <div className="summaryLabel">키워드</div>
            <div className="summaryValue">🎯 {keyword}</div>
          </div>
          <div className="summaryRow">
            <div className="summaryLabel">플랫폼</div>
            <div className="summaryValue">
              <div className="platformChips">
                {platformObjs.map((p: any) => (
                  <span key={p.id} className="platformChip">
                    {p.emoji} {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="featuresBox">
          <div className="featuresBoxTitle">
            <span>📦</span>
            <span>받게 될 자료</span>
          </div>
          <div className="featuresList">
            <div className="featureItem"><span className="check">✓</span> 클릭률 높은 영상 제목 3개</div>
            <div className="featureItem"><span className="check">✓</span> 알고리즘 최적화 태그</div>
            <div className="featureItem"><span className="check">✓</span> 영상 대본 구조</div>
            <div className="featureItem"><span className="check">✓</span> 썸네일 콘셉트</div>
            <div className="featureItem"><span className="check">✓</span> AI 이미지 프롬프트</div>
            <div className="featureItem"><span className="check">✓</span> AI 영상 프롬프트</div>
          </div>
        </div>

        <button 
          className="ctaBtn" 
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? '생성 중...' : '🚀 AI 추천 자료 생성하기'}
          <span className="ctaSub">완성된 자료를 즉시 받아보세요</span>
        </button>

        <div className="adArea">
          <AdSlot slot="metadata-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
