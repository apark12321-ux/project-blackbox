'use client';
/**
 * /processing - AI 생성 중
 * 광고 노출 핵심 페이지 (사용자가 기다리는 동안)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject } from '../_shared/V11Shell';
import { getCategoryById } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

const STEPS = [
  { label: '키워드 분석 중', emoji: '🔍' },
  { label: '알고리즘 트렌드 확인 중', emoji: '📊' },
  { label: '제목 후보 생성 중', emoji: '📝' },
  { label: '태그 최적화 중', emoji: '🏷️' },
  { label: '대본 구조 작성 중', emoji: '📋' },
  { label: '플랫폼별 메타데이터 생성 중', emoji: '✨' },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const project = getProject();
    if (!project.category || !project.keyword) {
      router.push('/create');
      return;
    }
    setCategory(project.category);
    setKeyword(project.keyword);
  }, [router]);

  useEffect(() => {
    // 진행 상태 시뮬레이션 (실제로는 백엔드 API 응답 기반)
    const totalDuration = 8000; // 8초
    const stepDuration = totalDuration / STEPS.length;
    const tickInterval = 50;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      const newStep = Math.min(Math.floor(elapsed / stepDuration), STEPS.length - 1);
      
      setProgress(newProgress);
      setCurrentStep(newStep);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        // ⚠️ 핵심 버그 수정 - publish는 URL 파라미터로 데이터 받음
        // localStorage의 project 데이터를 URL 파라미터로 전달
        setTimeout(() => {
          const project = getProject();
          const params = new URLSearchParams();
          if (project.keyword) params.set('keyword', project.keyword);
          if (project.category) params.set('category', project.category);
          if (project.scenarioStyleId) params.set('scenario', project.scenarioStyleId);
          router.push(`/publish?${params.toString()}`);
        }, 500);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [router]);

  const cat = getCategoryById(category);
  if (!cat) return null;

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page {
          max-width: 720px; margin: 0 auto;
          padding: 60px 24px;
        }

        .header { text-align: center; margin-bottom: 40px; }
        .title {
          font-size: 28px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; }

        .summary {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 14px 18px;
          margin-bottom: 32px;
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: #555; flex-wrap: wrap;
          justify-content: center;
        }
        .summary strong { color: #1a1a1a; }

        .progressBar {
          height: 6px; background: #f0f0f0;
          border-radius: 100px; overflow: hidden;
          margin-bottom: 12px;
        }
        .progressFill {
          height: 100%; background: linear-gradient(90deg, #c65f3b, #d4a545);
          border-radius: 100px; transition: width 0.1s;
        }
        .progressText {
          text-align: center; font-size: 12px;
          color: #888; margin-bottom: 32px;
          font-weight: 600;
        }

        .stepsList {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 24px;
          margin-bottom: 32px;
        }
        .stepRow {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0; transition: opacity 0.3s;
        }
        .stepRow.inactive { opacity: 0.3; }
        .stepRow.active {
          opacity: 1;
        }
        .stepRow.done {
          opacity: 0.6;
        }
        .stepEmoji { font-size: 18px; width: 24px; }
        .stepText {
          flex: 1; font-size: 14px;
          color: #1a1a1a; font-weight: 500;
        }
        .stepStatus {
          font-size: 11px; font-weight: 700;
        }
        .stepStatus.done { color: #5e7e5d; }
        .stepStatus.active { color: #c65f3b; }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid #fdf1e7;
          border-top-color: #c65f3b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .infoBox {
          background: #f0f7ff; border: 1px solid #d0e4ff;
          border-radius: 10px; padding: 14px 16px;
          font-size: 13px; color: #2855a3;
          line-height: 1.6;
          text-align: center;
        }

        .adArea { margin: 40px 0; }
      `}</style>

      <div className="page">
        <header className="header">
          <h1 className="title">AI가 콘텐츠를 분석하고 있어요</h1>
          <p className="sub">잠시만 기다려주세요. 약 10초 소요됩니다.</p>
        </header>

        <div className="summary">
          <span>{cat.emoji} <strong>{cat.name}</strong></span>
          <span>·</span>
          <span>🎯 <strong>{keyword}</strong></span>
        </div>

        <div className="progressBar">
          <div className="progressFill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progressText">{Math.round(progress)}%</div>

        <div className="stepsList">
          {STEPS.map((step, idx) => {
            const status = idx < currentStep ? 'done' : idx === currentStep ? 'active' : 'inactive';
            return (
              <div key={idx} className={`stepRow ${status}`}>
                <span className="stepEmoji">{step.emoji}</span>
                <span className="stepText">{step.label}</span>
                <span className={`stepStatus ${status}`}>
                  {status === 'done' && '✓ 완료'}
                  {status === 'active' && <span className="spinner" />}
                </span>
              </div>
            );
          })}
        </div>

        <div className="infoBox">
          💡 잠시 기다리는 동안 다른 분야의 트렌드 키워드도 확인해보세요!
        </div>

        <div className="adArea">
          <AdSlot slot="processing-mid" variant="horizontal" />
        </div>

        <div className="adArea">
          <AdSlot slot="processing-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
