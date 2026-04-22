'use client';
/**
 * /done - 완료 페이지 (실제 MP4 재생 + 다운로드)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, clearProject } from '../_shared/V11Shell';
import {
  getDownloadUrl,
  getJobStatus,
  extractVideoUrl,
  formatApiError,
  type JobStatusResponse,
  type DownloadResponse,
} from '../_shared/videoApi';

export default function DonePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');
  const [categoryLabel, setCategoryLabel] = useState<string>('');
  const [duration, setDuration] = useState<number>(10);
  const [jobId, setJobId] = useState<string>('');

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusRes, setStatusRes] = useState<JobStatusResponse | null>(null);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) {
      router.replace('/create');
      return;
    }
    setKeyword(p.keyword);
    setCategoryLabel(p.categoryLabel || '');
    setDuration(p.duration || 10);
    setJobId(p.jobId || '');

    if (p.jobId) {
      fetchResult(p.jobId);
    } else {
      setErrorMsg('Job ID가 없어 영상을 찾을 수 없습니다.');
      setLoading(false);
    }
     
  }, [router]);

  const fetchResult = async (id: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // status에서 이미 video_url 있을 수 있음
      let statusR: JobStatusResponse | null = null;
      let downloadR: DownloadResponse | null = null;

      try {
        statusR = await getJobStatus(id);
        setStatusRes(statusR);
      } catch (e) {
        // status 실패해도 download 시도
        console.warn('[done] status fetch failed:', e);
      }

      try {
        downloadR = await getDownloadUrl(id);
      } catch (e) {
        console.warn('[done] download fetch failed:', e);
      }

      const url = extractVideoUrl(statusR, downloadR);
      if (url) {
        setVideoUrl(url);
      } else {
        setErrorMsg('영상 URL을 찾지 못했습니다. 백엔드 응답을 확인해주세요.');
        console.error('[done] status:', statusR, 'download:', downloadR);
      }
    } catch (err: any) {
      setErrorMsg(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleNewVideo = () => {
    clearProject();
    router.push('/');
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    // 다운로드 링크 열기
    window.open(videoUrl, '_blank');
  };

  // SEO 데이터 (백엔드 응답에서 찾거나 기본값)
  const seoData = (statusRes?.result as any)?.seo || (statusRes as any)?.seo || null;
  const videoTitle = seoData?.title || `${keyword} | AlgoMaker로 만든 영상`;
  const videoDesc = seoData?.description || `${keyword}에 대한 AI 제작 영상입니다.`;
  const tags: string[] = seoData?.tags || [`#${keyword}`, '#AlgoMaker', '#AI'];

  return (
    <V11Shell currentStep={5}>
      <style jsx>{`
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 60px;
        }
        .header { text-align: center; margin-bottom: 24px; }
        .celebrate { font-size: 48px; margin-bottom: 12px; }
        .title {
          font-size: 30px; font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
        }
        .subText {
          font-size: 14px; color: #606060;
          margin: 0 0 14px;
        }
        .subText strong { color: #cc0000; }

        .loadingBox {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
        }
        .loadingTitle {
          font-size: 16px; font-weight: 700;
          margin-bottom: 8px;
        }
        .loadingSub { font-size: 13px; color: #888; }
        .loadingSpinner {
          width: 36px; height: 36px;
          border: 3px solid #f0f0f0;
          border-top-color: #cc0000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .errorBox {
          background: #fff0f0;
          border: 1px solid #ffcccc;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
        }
        .errorT {
          font-size: 16px; font-weight: 700;
          color: #cc0000; margin-bottom: 8px;
        }
        .errorM {
          font-size: 13px; color: #990000;
          line-height: 1.6; margin-bottom: 16px;
        }
        .errorDetails {
          font-size: 11px; color: #888;
          font-family: monospace;
          background: #fff;
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
          text-align: left;
          max-height: 200px;
          overflow: auto;
        }
        .errorActions {
          display: flex; gap: 8px;
          justify-content: center;
        }
        .btnPrimary {
          padding: 10px 20px;
          background: #cc0000; color: #fff;
          border: none; border-radius: 999px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .btnPrimary:hover { background: #a80000; }
        .btnSecondary {
          padding: 10px 20px;
          background: #fff; color: #0f0f0f;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
        }

        .layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        .videoPanel {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
        }
        .videoWrap {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
        }
        .videoWrap video {
          width: 100%; height: 100%;
          display: block;
        }
        .videoInfo {
          padding: 16px 4px;
          display: flex; gap: 12px;
        }
        .avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px;
          flex-shrink: 0;
        }
        .videoMeta { flex: 1; min-width: 0; }
        .videoTitle {
          font-size: 16px; font-weight: 700;
          margin: 0 0 4px;
          line-height: 1.3;
        }
        .videoStats {
          font-size: 13px; color: #606060;
        }

        .downloadBtn {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: #cc0000; color: #fff;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          width: 100%;
          font-family: inherit;
          font-size: 14px;
          margin-bottom: 10px;
          transition: background 0.15s;
        }
        .downloadBtn:hover:not(:disabled) { background: #a80000; }
        .downloadBtn:disabled {
          background: #888;
          cursor: not-allowed;
        }
        .openBtn {
          display: flex; align-items: center; justify-content: center;
          padding: 10px; width: 100%;
          background: #f2f2f2;
          color: #0f0f0f;
          border: none; border-radius: 12px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
        }
        .openBtn:hover { background: #e5e5e5; }

        .seoPanel {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 22px;
        }
        .seoHead {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 16px;
        }
        .seoTitle { font-size: 15px; font-weight: 700; }
        .seoField { margin-bottom: 14px; }
        .seoLabel {
          font-size: 12px; font-weight: 700;
          color: #0f0f0f; margin-bottom: 6px;
        }
        .seoBox {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13px; color: #0f0f0f;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .tagList {
          display: flex; flex-wrap: wrap; gap: 5px;
        }
        .tag {
          padding: 4px 10px;
          background: #f2f2f2;
          border-radius: 999px;
          font-size: 12px; font-weight: 500;
        }

        .newBtn {
          display: block;
          margin: 28px auto 0;
          padding: 14px 32px;
          background: #f2f2f2;
          border: none; border-radius: 999px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .newBtn:hover { background: #e5e5e5; }

        @media (max-width: 768px) {
          .page { padding: 24px 14px 40px; }
          .celebrate { font-size: 40px; }
          .title { font-size: 22px; }
          .layout { grid-template-columns: 1fr; gap: 18px; }
          .seoPanel { padding: 18px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="celebrate">{loading ? '⏳' : errorMsg ? '⚠️' : '🎉'}</div>
          <h1 className="title">
            {loading ? '영상을 가져오는 중...' : errorMsg ? '영상을 찾을 수 없어요' : '영상 제작 완료!'}
          </h1>
          {!loading && !errorMsg && (
            <p className="subText">
              "<strong>{keyword}</strong>" 영상이 준비되었습니다
            </p>
          )}
        </div>

        {loading && (
          <div className="loadingBox">
            <div className="loadingSpinner"></div>
            <div className="loadingTitle">영상 URL을 가져오고 있어요</div>
            <div className="loadingSub">Job ID: {jobId}</div>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="errorBox">
            <div className="errorT">영상 URL을 가져오지 못했어요</div>
            <div className="errorM">{errorMsg}</div>
            {statusRes && (
              <div className="errorDetails">
                <strong>백엔드 응답:</strong><br />
                {JSON.stringify(statusRes, null, 2)}
              </div>
            )}
            <div className="errorActions" style={{ marginTop: 16 }}>
              <button className="btnPrimary" onClick={() => jobId && fetchResult(jobId)}>
                다시 시도
              </button>
              <button className="btnSecondary" onClick={handleNewVideo}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {!loading && !errorMsg && videoUrl && (
          <>
            <div className="layout">
              <div>
                <div className="videoPanel">
                  <div className="videoWrap">
                    <video src={videoUrl} controls playsInline preload="metadata">
                      브라우저가 비디오 재생을 지원하지 않습니다.
                    </video>
                  </div>
                  <div className="videoInfo">
                    <div className="avatar">AM</div>
                    <div className="videoMeta">
                      <div className="videoTitle">{videoTitle}</div>
                      <div className="videoStats">AlgoMaker AI · 방금 생성됨</div>
                    </div>
                  </div>
                </div>

                <button className="downloadBtn" onClick={handleDownload}>
                  <span>⬇️ MP4 다운로드</span>
                  <span style={{ fontSize: 12, opacity: 0.9 }}>새 탭에서 열기</span>
                </button>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="openBtn">
                  🔗 영상 URL 직접 열기
                </a>
              </div>

              <div className="seoPanel">
                <div className="seoHead">
                  <div className="seoTitle">🎯 YouTube SEO</div>
                </div>

                <div className="seoField">
                  <div className="seoLabel">제목</div>
                  <div className="seoBox">{videoTitle}</div>
                </div>

                <div className="seoField">
                  <div className="seoLabel">설명</div>
                  <div className="seoBox">{videoDesc}</div>
                </div>

                <div className="seoField">
                  <div className="seoLabel">태그</div>
                  <div className="tagList">
                    {tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 14, padding: 10, background: '#f9f9f9', borderRadius: 8, fontSize: 11, color: '#888' }}>
                  ℹ️ SEO 메타데이터는 백엔드 응답에 포함되지 않으면 기본값이 표시됩니다.
                </div>
              </div>
            </div>

            <button className="newBtn" onClick={handleNewVideo}>✨ 새 영상 만들기</button>
          </>
        )}
      </div>
    </V11Shell>
  );
}
