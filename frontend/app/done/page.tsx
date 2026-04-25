'use client';
/**
 * 결과 페이지 - AI 추천 자료
 * 직접 접속해도 데모 데이터로 작동
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardShell, getProject } from '../_shared/V11Shell';
import { getPlatformById, getCategoryById } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function DonePage() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [scenarioId, setScenarioId] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activePlatform, setActivePlatform] = useState('youtube-long');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const project = getProject();
    
    // 직접 접속 안전장치 - 데모 데이터
    setKeyword(project.keyword || '2026년 부동산 전망');
    setCategory(project.category || 'realestate');
    setScenarioId(project.scenarioStyleId || 'curiosity');

    if (typeof window !== 'undefined') {
      try {
        const p = localStorage.getItem('v11_platforms');
        if (p) {
          const arr = JSON.parse(p);
          if (arr.length > 0) {
            setSelectedPlatforms(arr);
            setActivePlatform(arr[0]);
            return;
          }
        }
        setSelectedPlatforms(['youtube-long']);
        setActivePlatform('youtube-long');
      } catch {
        setSelectedPlatforms(['youtube-long']);
        setActivePlatform('youtube-long');
      }
    }
  }, []);

  const cat = getCategoryById(category);
  const currentPlatform = getPlatformById(activePlatform);

  // 추천 자료 생성 (간단한 템플릿)
  const titles = [
    `${keyword}, 이것만 알면 끝납니다`,
    `2026년 ${keyword} 완벽 정리`,
    `${keyword} - 전문가도 모르는 진짜 정보`,
  ];

  const tags = [
    `#${keyword.replace(/\s/g, '')}`,
    `#${cat?.name.replace(/[·]/g, '')}`,
    '#알고리즘',
    '#정보',
    '#트렌드',
    '#2026',
    '#전망',
    '#핵심정리',
  ];

  const description = `이 영상은 "${keyword}"에 대한 핵심 정보를 정리했습니다.

${cat?.name} 분야에서 꼭 알아야 할 내용을 단계별로 설명드립니다.

📌 주요 내용:
- 현재 상황 분석
- 핵심 포인트 정리
- 실전 적용 방법

영상이 도움이 되셨다면 구독·좋아요 부탁드립니다!`;

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
      });
    }
  };

  if (!cat) return null;

  return (
    <DashboardShell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 40px 24px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #888; margin-bottom: 24px; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .hero { text-align: center; margin-bottom: 36px; }
        .doneBadge {
          display: inline-block; padding: 6px 14px; background: #e8f5e9;
          color: #2e7d32; border-radius: 100px; font-size: 12px;
          font-weight: 700; margin-bottom: 16px;
        }
        .heroTitle {
          font-size: 32px; font-weight: 800; color: #1a1a1a;
          letter-spacing: -0.025em; margin-bottom: 12px;
        }
        .heroSub { font-size: 15px; color: #666; line-height: 1.6; }
        .summary {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          font-size: 13px; color: #555;
        }
        .summary strong { color: #1a1a1a; }
        .platformTabs {
          display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .tab {
          padding: 8px 16px; background: #fff; border: 1px solid #e5e5e5;
          border-radius: 100px; font-size: 13px; color: #666;
          cursor: pointer; font-family: inherit; font-weight: 600;
        }
        .tab.active {
          background: #c65f3b; color: #fff; border-color: #c65f3b;
        }
        .resultBox {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 24px; margin-bottom: 16px;
        }
        .resultHead {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; padding-bottom: 12px;
          border-bottom: 1px solid #eee;
        }
        .resultTitle {
          font-size: 14px; font-weight: 700; color: #1a1a1a;
          display: flex; align-items: center; gap: 8px;
        }
        .copyBtn {
          padding: 6px 12px; background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 8px; font-size: 11.5px; color: #555;
          cursor: pointer; font-family: inherit; font-weight: 600;
          transition: all 0.15s;
        }
        .copyBtn:hover { background: #f0f0f0; border-color: #ccc; }
        .copyBtn.copied { background: #e8f5e9; color: #2e7d32; border-color: #c8e6c9; }
        .titleItem {
          padding: 12px 14px; background: #fafafa; border-radius: 8px;
          margin-bottom: 8px; font-size: 14px; color: #1a1a1a;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .titleItem:last-child { margin-bottom: 0; }
        .titleNum {
          width: 22px; height: 22px; background: #c65f3b;
          color: #fff; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
        }
        .titleText { flex: 1; }
        .tagList { display: flex; flex-wrap: wrap; gap: 6px; }
        .tagItem {
          padding: 6px 12px; background: #fdf1e7;
          color: #c65f3b; border-radius: 100px;
          font-size: 12px; font-weight: 600;
        }
        .description {
          font-size: 13.5px; color: #333; line-height: 1.7;
          white-space: pre-wrap; padding: 12px 0;
        }
        .ctaArea { margin-top: 32px; text-align: center; }
        .homeLink {
          display: inline-block; padding: 14px 28px;
          background: #fafafa; border: 1px solid #e5e5e5;
          color: #555; border-radius: 100px;
          font-size: 14px; font-weight: 600;
          text-decoration: none; transition: all 0.15s;
        }
        .homeLink:hover { background: #f0f0f0; }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>완성</span>
        </nav>

        <section className="hero">
          <div className="doneBadge">✓ 자료 생성 완료</div>
          <h1 className="heroTitle">AI 추천 자료가 준비되었어요</h1>
          <p className="heroSub">아래 내용을 복사해서 영상 업로드 시 활용하세요</p>
        </section>

        <div className="summary">
          <span>{cat.emoji} <strong>{cat.name}</strong></span>
          <span>·</span>
          <span>🎯 <strong>{keyword}</strong></span>
        </div>

        {/* 플랫폼 탭 */}
        {selectedPlatforms.length > 1 && (
          <div className="platformTabs">
            {selectedPlatforms.map(pid => {
              const p = getPlatformById(pid);
              if (!p) return null;
              return (
                <button
                  key={pid}
                  className={`tab ${activePlatform === pid ? 'active' : ''}`}
                  onClick={() => setActivePlatform(pid)}
                >
                  {p.emoji} {p.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 영상 제목 */}
        <div className="resultBox">
          <div className="resultHead">
            <div className="resultTitle">
              <span>📝</span>
              <span>영상 제목 추천 (3개)</span>
            </div>
            <button 
              className={`copyBtn ${copied === 'titles' ? 'copied' : ''}`}
              onClick={() => copy(titles.join('\n'), 'titles')}
            >
              {copied === 'titles' ? '✓ 복사됨' : '복사'}
            </button>
          </div>
          {titles.map((t, i) => (
            <div key={i} className="titleItem">
              <span className="titleNum">{i + 1}</span>
              <span className="titleText">{t}</span>
            </div>
          ))}
        </div>

        {/* 광고 */}
        <div className="adArea">
          <AdSlot slot="done-mid" variant="horizontal" />
        </div>

        {/* 태그 */}
        <div className="resultBox">
          <div className="resultHead">
            <div className="resultTitle">
              <span>🏷️</span>
              <span>알고리즘 최적화 태그</span>
            </div>
            <button 
              className={`copyBtn ${copied === 'tags' ? 'copied' : ''}`}
              onClick={() => copy(tags.join(' '), 'tags')}
            >
              {copied === 'tags' ? '✓ 복사됨' : '복사'}
            </button>
          </div>
          <div className="tagList">
            {tags.map((tag, i) => (
              <span key={i} className="tagItem">{tag}</span>
            ))}
          </div>
        </div>

        {/* 영상 설명 */}
        <div className="resultBox">
          <div className="resultHead">
            <div className="resultTitle">
              <span>📄</span>
              <span>영상 설명 (Description)</span>
            </div>
            <button 
              className={`copyBtn ${copied === 'desc' ? 'copied' : ''}`}
              onClick={() => copy(description, 'desc')}
            >
              {copied === 'desc' ? '✓ 복사됨' : '복사'}
            </button>
          </div>
          <div className="description">{description}</div>
        </div>

        <div className="ctaArea">
          <Link href="/" className="homeLink">
            🏠 홈으로 돌아가기
          </Link>
        </div>

        <div className="adArea">
          <AdSlot slot="done-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
