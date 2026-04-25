'use client';
/**
 * 플랫폼 선택 페이지 - 깔끔한 도구
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, getProject, setProject } from '../_shared/V11Shell';
import { PLATFORMS } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function PlatformPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [projectReady, setProjectReady] = useState(false);

  useEffect(() => {
    const project = getProject();
    if (!project.category || !project.keyword || !project.scenarioStyleId) {
      router.push('/');
      return;
    }
    setProjectReady(true);
  }, [router]);

  const togglePlatform = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) {
      alert('업로드할 플랫폼을 1개 이상 선택해주세요.');
      return;
    }
    setProject({ step: 4 });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('v11_platforms', JSON.stringify(selected));
      } catch {}
    }
    router.push('/metadata');
  };

  if (!projectReady) return null;

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
        .hint {
          background: #f0f7ff; border: 1px solid #d0e4ff;
          border-radius: 8px; padding: 12px 16px; font-size: 13px;
          color: #2855a3; margin-bottom: 24px;
        }
        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 14px; margin-bottom: 28px;
        }
        @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
        .card {
          background: #fff; border: 2px solid #e5e5e5;
          border-radius: 14px; padding: 20px; cursor: pointer;
          transition: all 0.15s; font-family: inherit; text-align: left;
          position: relative;
        }
        .card:hover { border-color: #c65f3b; background: #fffbf8; }
        .card.selected { border-color: #c65f3b; background: #fdf1e7; }
        .cardCheck {
          position: absolute; top: 16px; right: 16px;
          width: 24px; height: 24px; border-radius: 50%;
          border: 2px solid #ddd; background: #fff;
          display: flex; align-items: center; justify-content: center;
          color: transparent; font-weight: 800; font-size: 14px;
        }
        .card.selected .cardCheck {
          border-color: #c65f3b; background: #c65f3b; color: #fff;
        }
        .cardHead { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .cardEmoji { font-size: 28px; }
        .cardName { font-size: 17px; font-weight: 800; color: #1a1a1a; }
        .cardDuration { font-size: 11.5px; color: #888; margin-top: 2px; }
        .cardDesc {
          font-size: 13px; color: #555; line-height: 1.5;
          padding-top: 12px; border-top: 1px dashed #e5e5e5;
        }
        .cardSpecs {
          display: flex; gap: 12px; margin-top: 8px;
          font-size: 11px; color: #888;
        }
        .cardSpecs span { display: inline-flex; align-items: center; gap: 4px; }
        .ctaBtn {
          width: 100%; padding: 16px 24px; background: #c65f3b;
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .ctaBtn:hover:not(:disabled) { background: #a64a2a; }
        .ctaBtn:disabled { background: #ccc; cursor: not-allowed; }
        .selectedCount {
          text-align: center; font-size: 13px; color: #666;
          margin-bottom: 12px;
        }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/keyword">시나리오</Link>
          <span className="sep">/</span>
          <span>플랫폼 선택</span>
        </nav>

        <section className="hero">
          <div className="stepBadge">STEP 3 · 플랫폼 선택</div>
          <h1 className="heroTitle">어디에 업로드하시나요?</h1>
          <p className="heroSub">플랫폼별로 최적화된 자료를 추천해드립니다</p>
        </section>

        <div className="hint">
          💡 여러 개 선택 가능. 각 플랫폼별 맞춤 제목·태그·설명을 모두 받을 수 있어요.
        </div>

        <div className="grid">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className={`card ${selected.includes(p.id) ? 'selected' : ''}`}
              onClick={() => togglePlatform(p.id)}
            >
              <div className="cardCheck">✓</div>
              <div className="cardHead">
                <span className="cardEmoji">{p.emoji}</span>
                <div>
                  <div className="cardName">{p.name}</div>
                  <div className="cardDuration">{p.durationLabel}</div>
                </div>
              </div>
              <div className="cardDesc">
                {p.exampleContent}
                <div className="cardSpecs">
                  <span>📐 {p.orientation}</span>
                  <span>👥 {p.audience}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="selectedCount">
            {selected.length}개 플랫폼 선택됨
          </div>
        )}

        <button 
          className="ctaBtn" 
          onClick={handleNext}
          disabled={selected.length === 0}
        >
          다음 단계 →
        </button>

        <div className="adArea">
          <AdSlot slot="platform-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
