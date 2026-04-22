'use client';
/**
 * /done - 완료 (YouTube 스타일 영상 카드)
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 60px;
        }
        .header {
          text-align: center;
          margin-bottom: 28px;
        }
        .celebrate { font-size: 48px; margin-bottom: 12px; }
        .title {
          font-size: 32px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .subText {
          font-size: 15px;
          color: #606060;
          margin: 0 0 16px;
        }
        .subText strong { color: #ff0000; }
        .meta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #606060;
          padding: 8px 16px;
          background: #f9f9f9;
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
        
        /* YouTube-style video card */
        .layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }
        .videoCard {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
        }
        .videoThumb {
          position: relative;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          overflow: hidden;
          border-radius: 12px;
        }
        .playBtn {
          width: 72px;
          height: 72px;
          background: rgba(255, 0, 0, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s;
          z-index: 2;
        }
        .playBtn:hover {
          transform: scale(1.1);
          background: #ff0000;
        }
        .videoThumbText {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          text-align: center;
        }
        .videoThumbMain {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .videoThumbSub {
          font-size: 16px;
          font-weight: 500;
          opacity: 0.9;
        }
        .videoDuration {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.8);
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          z-index: 3;
        }
        .videoInfo {
          padding: 16px 4px;
          display: flex;
          gap: 12px;
        }
        .videoAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
          flex-shrink: 0;
        }
        .videoMeta { flex: 1; min-width: 0; }
        .videoTitle {
          font-size: 16px;
          font-weight: 700;
          color: #0f0f0f;
          margin: 0 0 4px;
          line-height: 1.3;
        }
        .videoChannel {
          font-size: 13px;
          color: #606060;
          margin: 0 0 2px;
        }
        .videoStats {
          font-size: 13px;
          color: #606060;
        }
        
        /* Download actions */
        .downloadBox {
          background: #ff0000;
          color: #fff;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          margin-bottom: 10px;
          font-weight: 700;
          transition: background 0.15s;
        }
        .downloadBox:hover { background: #cc0000; }
        .subDownloads {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .subDlBtn {
          padding: 10px;
          background: #f2f2f2;
          border: none;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #0f0f0f;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          transition: background 0.15s;
        }
        .subDlBtn:hover { background: #e5e5e5; }
        
        .ytBox {
          background: #0f0f0f;
          color: #fff;
          border-radius: 12px;
          padding: 16px;
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
          font-size: 14px;
        }
        .ytDot {
          font-size: 20px;
          color: #ff0000;
        }
        .ytStatus {
          font-size: 11px;
          color: #aaa;
          padding: 3px 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 999px;
        }
        .ytUpload {
          width: 100%;
          padding: 12px;
          background: #ff0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }
        .ytUpload:hover { background: #cc0000; }
        
        /* SEO panel */
        .seoPanel {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
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
          color: #0f0f0f;
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
          color: #0f0f0f;
        }
        .seoCount { font-size: 11px; color: #888; }
        .seoBox {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13px;
          color: #0f0f0f;
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
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 11px;
          cursor: pointer;
          font-family: inherit;
          color: #606060;
          font-weight: 600;
        }
        .copyBtn:hover { background: #f2f2f2; color: #0f0f0f; }
        .tagList {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .tag {
          padding: 4px 10px;
          background: #f2f2f2;
          color: #0f0f0f;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
        }
        .metricsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
          margin-top: 14px;
        }
        .metric { text-align: center; }
        .metricNum {
          font-size: 22px;
          font-weight: 800;
          color: #16a34a;
          letter-spacing: -0.02em;
        }
        .metricNumRed { color: #ff0000; }
        .metricLabel {
          font-size: 11px;
          color: #606060;
          margin-top: 2px;
        }
        .newBtn {
          display: block;
          margin: 28px auto 0;
          padding: 14px 32px;
          background: #f2f2f2;
          color: #0f0f0f;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .newBtn:hover { background: #e5e5e5; }

        @media (max-width: 768px) {
          .page { padding: 24px 14px 40px; }
          .celebrate { font-size: 40px; }
          .title { font-size: 24px; }
          .subText { font-size: 14px; }
          .layout { grid-template-columns: 1fr; gap: 18px; }
          .videoThumbMain { font-size: 24px; }
          .videoThumbSub { font-size: 14px; }
          .playBtn { width: 56px; height: 56px; font-size: 22px; }
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
            <div className="videoCard">
              <div className="videoThumb">
                <div className="playBtn">▶</div>
                <div className="videoThumbText">
                  <div className="videoThumbMain">{keyword || '영상'}</div>
                  <div className="videoThumbSub">위험한 3가지 신호</div>
                </div>
                <div className="videoDuration">{duration}:12</div>
              </div>
              <div className="videoInfo">
                <div className="videoAvatar">AM</div>
                <div className="videoMeta">
                  <div className="videoTitle">{videoTitle}</div>
                  <div className="videoChannel">AlgoMaker · AI 생성</div>
                  <div className="videoStats">방금 생성됨 · 수익화 준비 완료</div>
                </div>
              </div>
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
                  {titleCopied ? '✓' : '복사'}
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
                  {descCopied ? '✓' : '복사'}
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
                <div className="metricNum metricNumRed">$18</div>
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
