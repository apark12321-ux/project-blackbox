'use client';
/**
 * /done - 영상 제작 완료 (STEP 5)
 * 모바일 최적화
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, clearProject } from '../_shared/V11Shell';

export default function DonePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');
  const [categoryLabel, setCategoryLabel] = useState<string>('');
  const [duration, setDuration] = useState<number>(10);
  const [titleCopied, setTitleCopied] = useState(false);
  const [descCopied, setDescCopied] = useState(false);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) {
      router.replace('/create');
      return;
    }
    setKeyword(p.keyword);
    setCategoryLabel(p.categoryLabel || '');
    setDuration(p.duration || 10);
  }, [router]);

  const videoTitle = `${keyword} 위험한 3가지 신호 | 모르면 당합니다 (2026)`;
  const videoDesc = `${keyword}에 관심 있으신 분 필독.

이 영상에서 다루는 내용:
✓ 실제 전문가가 경고하는 3가지 위험 신호
✓ 2026년 최신 데이터 기반 분석
✓ ${categoryLabel} 분야 초보자도 쉽게 이해

도움이 되셨다면 구독과 좋아요 부탁드립니다!

#${keyword.replace(/\s/g, '')} #${categoryLabel} #2026 #YouTube`;

  const tags = [`#${keyword}`, `#${categoryLabel}`, '#2026', '#트렌드', '#분석', '#가이드', '#초보자', '#실전', '#꿀팁', '#정보', '#YouTube', '#유튜브'];

  const handleCopy = (text: string, which: 'title' | 'desc') => {
    navigator.clipboard?.writeText(text);
    if (which === 'title') {
      setTitleCopied(true);
      setTimeout(() => setTitleCopied(false), 2000);
    } else {
      setDescCopied(true);
      setTimeout(() => setDescCopied(false), 2000);
    }
  };

  const handleNewVideo = () => {
    clearProject();
    router.push('/create');
  };

  return (
    <V11Shell currentStep={5}>
      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }
        .header {
          text-align: center;
          margin-bottom: 28px;
        }
        .celebrate { font-size: 48px; margin-bottom: 12px; }
        .title {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .subText {
          font-size: 15px;
          color: #64748b;
          margin: 0 0 16px;
        }
        .subText strong { color: #2563eb; }
        .meta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #64748b;
          padding: 8px 16px;
          background: #f8fafc;
          border-radius: 999px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .metaItem { display: inline-flex; align-items: center; gap: 4px; }
        .safetyBadge {
          padding: 4px 10px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 999px;
          font-weight: 700;
          font-size: 11px;
        }
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }
        .videoBox {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          border-radius: 14px;
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .videoTitle {
          text-align: center;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          padding: 20px;
          line-height: 1.3;
        }
        .videoDuration {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .downloadBox {
          background: #2563eb;
          color: #fff;
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .downloadBox:hover { background: #1d4ed8; }
        .subDownloads {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .subDlBtn {
          padding: 10px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
        }
        .subDlBtn:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
        .ytBox {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px;
        }
        .ytHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .ytLogo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }
        .ytDot {
          font-size: 18px;
          color: #dc2626;
        }
        .ytStatus {
          font-size: 11px;
          color: #94a3b8;
          padding: 3px 8px;
          background: #f8fafc;
          border-radius: 999px;
        }
        .ytUpload {
          width: 100%;
          padding: 12px;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ytUpload:hover { background: #b91c1c; }
        .seoPanel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 22px;
        }
        .seoHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .seoTitle {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }
        .seoGrade {
          padding: 4px 10px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
        }
        .seoField { margin-bottom: 14px; }
        .seoLabelRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .seoLabel {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }
        .seoCount { font-size: 11px; color: #94a3b8; }
        .seoBox {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13px;
          color: #0f172a;
          position: relative;
          line-height: 1.6;
        }
        .seoBoxTextarea { white-space: pre-wrap; }
        .copyBtn {
          position: absolute;
          top: 6px;
          right: 6px;
          padding: 5px 10px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          font-family: inherit;
          color: #64748b;
          font-weight: 600;
        }
        .copyBtn:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
        .tagList {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .tag {
          padding: 4px 10px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
        }
        .metricsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          margin-top: 14px;
        }
        .metric { text-align: center; }
        .metricNum {
          font-size: 22px;
          font-weight: 800;
          color: #16a34a;
          letter-spacing: -0.02em;
        }
        .metricNumBlue { color: #2563eb; }
        .metricLabel {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }
        .newBtn {
          display: block;
          margin: 28px auto 0;
          padding: 14px 32px;
          background: #fff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
        .newBtn:hover { background: #eff6ff; }

        @media (max-width: 768px) {
          .page { padding: 24px 14px 40px; }
          .celebrate { font-size: 40px; }
          .title { font-size: 24px; }
          .subText { font-size: 14px; }
          .layout { grid-template-columns: 1fr; gap: 14px; }
          .videoTitle { font-size: 20px; padding: 16px; }
          .seoPanel { padding: 18px; }
          .metricsGrid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .metricNum { font-size: 18px; }
          .tag { font-size: 11px; padding: 3px 8px; }
          .meta { font-size: 11px; padding: 6px 12px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="celebrate">🎉</div>
          <h1 className="title">영상 제작 완료!</h1>
          <p className="subText">
            "<strong>{keyword}</strong>" {duration}분 분량 YouTube 영상이 준비되었습니다
          </p>
          <div className="meta">
            <span className="metaItem">🎥 1920×1080</span>
            <span className="metaItem">⏱️ {duration}분 12초</span>
            <span className="metaItem">💾 142 MB</span>
            <span className="safetyBadge">수익화 안전도 A+ (92/100)</span>
          </div>
        </div>

        <div className="layout">
          <div>
            <div className="videoBox">
              <div className="videoTitle">
                {keyword}<br />
                위험한 3가지 신호
              </div>
              <div className="videoDuration">{duration}:12</div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="downloadBox">
                <span>⬇️ 영상 MP4 다운로드</span>
                <span style={{ fontSize: 13, opacity: 0.9 }}>142 MB</span>
              </div>
              <div className="subDownloads">
                <button className="subDlBtn">🎵 MP3</button>
                <button className="subDlBtn">📝 대본 TXT</button>
                <button className="subDlBtn">🖼️ 썸네일</button>
              </div>
              <div className="ytBox">
                <div className="ytHeader">
                  <div className="ytLogo">
                    <span className="ytDot">▶</span>
                    YouTube
                  </div>
                  <div className="ytStatus">연결 대기</div>
                </div>
                <button className="ytUpload">
                  🚀 YouTube에 바로 업로드
                </button>
              </div>
            </div>
          </div>

          <div className="seoPanel">
            <div className="seoHeader">
              <div className="seoTitle">🎯 YouTube SEO 2026</div>
              <div className="seoGrade">A+</div>
            </div>

            <div className="seoField">
              <div className="seoLabelRow">
                <span className="seoLabel">제목</span>
                <span className="seoCount">{videoTitle.length}/60</span>
              </div>
              <div className="seoBox">
                {videoTitle}
                <button className="copyBtn" onClick={() => handleCopy(videoTitle, 'title')}>
                  {titleCopied ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <div className="seoField">
              <div className="seoLabelRow">
                <span className="seoLabel">설명</span>
                <span className="seoCount">{videoDesc.length}자</span>
              </div>
              <div className="seoBox seoBoxTextarea">
                {videoDesc}
                <button className="copyBtn" onClick={() => handleCopy(videoDesc, 'desc')}>
                  {descCopied ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <div className="seoField">
              <div className="seoLabelRow">
                <span className="seoLabel">태그</span>
                <span className="seoCount">{tags.length}개</span>
              </div>
              <div className="tagList">
                {tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="metricsGrid">
              <div className="metric">
                <div className="metricNum">92</div>
                <div className="metricLabel">안전도</div>
              </div>
              <div className="metric">
                <div className="metricNum metricNumBlue">$18</div>
                <div className="metricLabel">예상 CPM</div>
              </div>
              <div className="metric">
                <div className="metricNum">87%</div>
                <div className="metricLabel">CTR 예상</div>
              </div>
              <div className="metric">
                <div className="metricNum">A+</div>
                <div className="metricLabel">블루오션</div>
              </div>
            </div>
          </div>
        </div>

        <button className="newBtn" onClick={handleNewVideo}>✨ 새 영상 만들기</button>
      </div>
    </V11Shell>
  );
}
