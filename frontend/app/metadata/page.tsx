'use client';
/**
 * Step 5: 메타데이터 페이지
 *
 * 선택한 플랫폼별 업로드 자료 표시 (베일 벗기기)
 * 각 항목마다: 뭔가요? / 예시 / 어떻게?
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, getProject } from '../_shared/V11Shell';
import { getPlatformById, getCategoryById } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function MetadataPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const project = getProject();
    if (!project.keyword) {
      router.push('/');
      return;
    }
    setKeyword(project.keyword);
    setCategory(project.category || '');

    if (typeof window !== 'undefined') {
      try {
        const platforms = localStorage.getItem('v11_platforms');
        if (platforms) {
          setSelectedPlatforms(JSON.parse(platforms));
        } else {
          router.push('/platform');
        }
      } catch {
        router.push('/platform');
      }
    }
  }, [router]);

  const currentCategory = getCategoryById(category);
  const platforms = selectedPlatforms.map((id) => getPlatformById(id)).filter(Boolean);

  const handleGenerateAll = () => {
    setGenerating(true);
    setTimeout(() => {
      router.push('/done');
    }, 2500);
  };

  if (platforms.length === 0) return null;

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 64px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #8a7d6a;
          font-weight: 500;
        }
        .breadcrumb a { color: #8a7d6a; transition: color 0.15s; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #b8ad9b; }

        .hero {
          text-align: center;
          margin-bottom: 32px;
        }
        .stepBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          color: #a64a2a;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .heroTitle {
          font-size: 34px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 14px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
        }

        /* 프로젝트 요약 */
        .projectSummary {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 28px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .summaryItem {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .summaryLabel {
          font-size: 10px;
          color: #8a7d6a;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .summaryValue {
          font-size: 14px;
          color: #2a2419;
          font-weight: 700;
          letter-spacing: -0.015em;
        }

        /* 안내 배너 */
        .infoBanner {
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border: 1px dashed rgba(198, 95, 59, 0.3);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .infoIcon { font-size: 28px; flex-shrink: 0; }
        .infoText {
          flex: 1;
          font-size: 13px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
        }
        .infoText strong { color: #a64a2a; font-weight: 800; }

        /* 플랫폼 섹션 */
        .platformSection {
          margin-bottom: 32px;
        }
        .platformSectionHead {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: #faf8f4;
          border-radius: 12px 12px 0 0;
          border-left: 4px solid;
        }
        .platformSectionEmoji { font-size: 26px; }
        .platformSectionNames { flex: 1; }
        .platformSectionName {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
        }
        .platformSectionNameEn {
          font-size: 11.5px;
          color: #8a7d6a;
          font-weight: 600;
          margin-top: 2px;
        }
        .platformSectionCount {
          padding: 4px 10px;
          background: #fff;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          color: #564a3a;
        }

        .fieldsList {
          background: #faf8f4;
          border-radius: 0 0 12px 12px;
          padding: 16px;
          display: grid;
          gap: 10px;
        }
        .fieldCard {
          background: #fff;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 10px;
          padding: 16px 18px;
          transition: all 0.18s;
        }
        .fieldCard:hover {
          border-color: rgba(198, 95, 59, 0.2);
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.05);
        }
        .fieldHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
        }
        .fieldTitle {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fieldIcon { font-size: 22px; line-height: 1; }
        .fieldLabels {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .fieldName {
          font-size: 14px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.015em;
          line-height: 1.2;
        }
        .fieldNameEn {
          font-size: 10.5px;
          color: #8a7d6a;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .aiBadge {
          padding: 3px 9px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .fieldInfo {
          display: grid;
          gap: 6px;
          padding: 10px 12px;
          background: #faf8f4;
          border-radius: 7px;
          margin-top: 8px;
        }
        .infoRow {
          display: flex;
          gap: 6px;
          font-size: 11.5px;
          line-height: 1.55;
        }
        .infoRowLabel {
          min-width: 60px;
          color: #8a7d6a;
          font-weight: 700;
          flex-shrink: 0;
        }
        .infoRowValue {
          color: #564a3a;
          font-weight: 500;
        }
        .infoRowValue.example {
          font-style: italic;
        }

        /* 하단 버튼 */
        .bottomActions {
          position: sticky;
          bottom: 20px;
          background: rgba(245, 241, 234, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(198, 95, 59, 0.15);
          border-radius: 14px;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          box-shadow: 0 8px 24px rgba(90, 74, 58, 0.1);
          margin-top: 32px;
        }
        .actionsInfo {
          font-size: 13px;
          color: #2a2419;
          font-weight: 700;
        }
        .actionsInfo strong {
          color: #c65f3b;
          font-weight: 800;
        }
        .generateBtn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 4px 14px rgba(198, 95, 59, 0.3);
        }
        .generateBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(198, 95, 59, 0.4);
        }
        .generateBtn:disabled {
          background: #8a7d6a;
          cursor: wait;
        }

        /* 생성 중 오버레이 */
        .generatingOverlay {
          position: fixed;
          inset: 0;
          background: rgba(42, 36, 25, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .generatingBox {
          background: #fff;
          border-radius: 20px;
          padding: 40px 48px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 420px;
        }
        .genIcon {
          font-size: 52px;
          margin-bottom: 18px;
          display: inline-block;
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .genTitle {
          font-size: 20px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 10px;
        }
        .genSub {
          font-size: 13px;
          color: #8a7d6a;
          line-height: 1.6;
        }

        .adWrap { margin: 24px 0; }

        @media (max-width: 768px) {
          .page { padding: 24px 16px 40px; }
          .heroTitle { font-size: 26px; }
          .projectSummary { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/keyword">키워드</Link>
          <span className="sep">/</span>
          <Link href="/platform">플랫폼</Link>
          <span className="sep">/</span>
          <span>업로드 자료</span>
        </nav>

        <section className="hero">
          <div className="stepBadge">STEP 5 / 6 · 업로드 자료 확인</div>
          <h1 className="heroTitle">
            이 자료들을 <span className="accent">AI가 자동으로</span> 만들어요
          </h1>
          <p className="heroSub">
            각 항목마다 3가지 안을 추천해드려요. 마음에 드는 걸 고르시면 돼요.
          </p>
        </section>

        {/* 프로젝트 요약 */}
        <section className="projectSummary">
          <div className="summaryItem">
            <span className="summaryLabel">📂 카테고리</span>
            <span className="summaryValue">
              {currentCategory?.emoji} {currentCategory?.name}
            </span>
          </div>
          <div className="summaryItem">
            <span className="summaryLabel">🔍 키워드</span>
            <span className="summaryValue">{keyword}</span>
          </div>
          <div className="summaryItem">
            <span className="summaryLabel">📱 선택 플랫폼</span>
            <span className="summaryValue">{platforms.length}개</span>
          </div>
        </section>

        {/* 안내 배너 */}
        <div className="infoBanner">
          <span className="infoIcon">💡</span>
          <div className="infoText">
            <strong>각 플랫폼마다 필요한 업로드 자료가 달라요.</strong><br />
            아래는 각 자료가 뭐고, AI가 어떻게 만드는지 자세히 설명이에요.
          </div>
        </div>

        {/* 플랫폼별 메타데이터 필드 */}
        {platforms.map((platform) => platform && (
          <section key={platform.id} className="platformSection">
            <div
              className="platformSectionHead"
              style={{ borderLeftColor: platform.color }}
            >
              <span className="platformSectionEmoji">{platform.emoji}</span>
              <div className="platformSectionNames">
                <div className="platformSectionName">{platform.name}</div>
                <div className="platformSectionNameEn">{platform.nameEn} 업로드 자료</div>
              </div>
              <div className="platformSectionCount">
                {platform.metaFields.length}개 항목
              </div>
            </div>

            <div className="fieldsList">
              {platform.metaFields.map((field) => (
                <div key={field.id} className="fieldCard">
                  <div className="fieldHead">
                    <div className="fieldTitle">
                      <span className="fieldIcon">{field.icon}</span>
                      <div className="fieldLabels">
                        <span className="fieldName">{field.label}</span>
                        <span className="fieldNameEn">{field.labelEn}</span>
                      </div>
                    </div>
                    {field.autoGenerate && (
                      <span className="aiBadge">🤖 AI 자동 생성</span>
                    )}
                  </div>
                  <div className="fieldInfo">
                    <div className="infoRow">
                      <span className="infoRowLabel">뭔가요?</span>
                      <span className="infoRowValue">{field.description}</span>
                    </div>
                    <div className="infoRow">
                      <span className="infoRowLabel">예시:</span>
                      <span className="infoRowValue example">{field.example}</span>
                    </div>
                    <div className="infoRow">
                      <span className="infoRowLabel">어떻게?</span>
                      <span className="infoRowValue">{field.howItWorks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="adWrap">
          <AdSlot slot="metadata-mid" variant="horizontal" />
        </div>

        {/* 하단 버튼 */}
        <div className="bottomActions">
          <div className="actionsInfo">
            총 <strong>{platforms.reduce((sum, p) => sum + (p?.metaFields.length || 0), 0)}개 항목</strong>이 자동 생성됩니다
          </div>
          <button
            className="generateBtn"
            onClick={handleGenerateAll}
            disabled={generating}
          >
            {generating ? '⚙️ 생성 중...' : '✨ AI로 전체 자동 생성 →'}
          </button>
        </div>

        {/* 생성 중 오버레이 */}
        {generating && (
          <div className="generatingOverlay">
            <div className="generatingBox">
              <div className="genIcon">⚙️</div>
              <div className="genTitle">AI가 영상과 자료를 만들고 있어요</div>
              <div className="genSub">
                평균 5분 소요 · 곧 완성됩니다<br />
                잠시만 기다려주세요...
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
