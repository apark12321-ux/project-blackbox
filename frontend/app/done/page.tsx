'use client';
/**
 * /done - 완료 페이지 (status 호출 생략, download만 사용)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, clearProject } from '../_shared/V11Shell';
import { getDownloadUrl, extractVideoUrl, formatApiError } from '../_shared/videoApi';
import { getScenarioById } from '../_shared/scenarios';

export default function DonePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');
  const [duration, setDuration] = useState<number>(10);
  const [jobId, setJobId] = useState<string>('');
  const [styleName, setStyleName] = useState<string>('');

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadResRaw, setDownloadResRaw] = useState<any>(null);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) {
      router.replace('/');
      return;
    }
    setKeyword(p.keyword);
    setDuration(p.duration || 10);
    setJobId(p.jobId || '');

    const style = getScenarioById(p.scenarioStyleId || p.templateId);
    if (style) setStyleName(`${style.emoji} ${style.name}`);

    if (p.jobId) fetchResult(p.jobId);
    else { setErrorMsg('Job ID가 없어 영상을 찾을 수 없습니다.'); setLoading(false); }
     
  }, [router]);

  const fetchResult = async (id: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const downloadR = await getDownloadUrl(id);
      setDownloadResRaw(downloadR);
      const url = extractVideoUrl(null, downloadR, null);
      if (url) {
        setVideoUrl(url);
      } else {
        setErrorMsg('영상 URL을 찾지 못했습니다. 아직 생성 중이거나 백엔드 응답 구조가 다를 수 있습니다.');
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
    window.open(videoUrl, '_blank');
  };

  const videoTitle = `${keyword} | AlgoMaker로 만든 영상`;

  return (
    <V11Shell currentStep={5}>
      <style jsx>{`
        .page { max-width: 1000px; margin: 0 auto; padding: 32px 24px 60px; }
        .header { text-align: center; margin-bottom: 24px; }
        .celebrate { font-size: 48px; margin-bottom: 12px; }
        .title { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 10px; }
        .subText { font-size: 14px; color: #606060; margin: 0 0 14px; }
        .subText strong { color: #cc0000; }

        .metaRow {
          display: flex; justify-content: center;
          gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .metaChip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 12px; color: #606060;
        }
        .chipStyle { background: #f0f0ff; color: #4338ca; border-color: #ddd6fe; font-weight: 600; }

        .loadingBox {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
        }
        .loadingTitle { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
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
          margin: 10px 0;
          text-align: left;
          max-height: 200px;
          overflow: auto;
        }
        .errorActions {
          display: flex; gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 16px;
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
        .jobIdBox {
          margin-top: 12px;
          padding: 10px;
          background: #fff;
          border-radius: 8px;
          font-size: 11px;
          color: #888;
          font-family: monospace;
        }

        .videoPanel {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .videoWrap {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
        }
        .videoWrap video {
          width: 100%; height: 100%;
          display: block;
        }
        .videoInfo {
          padding: 14px 18px;
          display: flex; gap: 12px;
          align-items: center;
          border-top: 1px solid #f0f0f0;
        }
        .avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 14px;
          flex-shrink: 0;
        }
        .videoMeta { flex: 1; min-width: 0; }
        .videoTitle {
          font-size: 15px; font-weight: 700;
          margin: 0 0 3px;
          line-height: 1.3;
        }
        .videoStats { font-size: 12px; color: #606060; }

        .actionsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }
        .actionBtn {
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .actionBtnPrimary { background: #cc0000; color: #fff; }
        .actionBtnPrimary:hover { background: #a80000; }
        .actionBtnSecondary { background: #f2f2f2; color: #0f0f0f; }
        .actionBtnSecondary:hover { background: #e5e5e5; }

        .newBtn {
          display: block;
          margin: 28px auto 0;
          padding: 14px 32px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .newBtn:hover { background: #f2f2f2; }

        @media (max-width: 768px) {
          .page { padding: 24px 14px 40px; }
          .celebrate { font-size: 40px; }
          .title { font-size: 22px; }
          .actionsGrid { grid-template-columns: 1fr; }
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

        <div className="metaRow">
          {styleName && <div className="metaChip chipStyle">{styleName}</div>}
          <div className="metaChip">⏱️ {duration}분</div>
          {jobId && <div className="metaChip" style={{ fontFamily: 'monospace' }}>Job {jobId.slice(0, 12)}</div>}
        </div>

        {loading && (
          <div className="loadingBox">
            <div className="loadingSpinner"></div>
            <div className="loadingTitle">영상 URL을 가져오고 있어요</div>
            <div className="loadingSub">백엔드에 확인 요청 중...</div>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="errorBox">
            <div className="errorT">영상 URL을 가져오지 못했어요</div>
            <div className="errorM">{errorMsg}</div>
            {downloadResRaw && (
              <details>
                <summary style={{ cursor: 'pointer', fontSize: 11, color: '#888' }}>기술 상세</summary>
                <div className="errorDetails">{JSON.stringify(downloadResRaw, null, 2)}</div>
              </details>
            )}
            <div className="jobIdBox">Job ID: {jobId}</div>
            <div className="errorActions">
              <button className="btnPrimary" onClick={() => jobId && fetchResult(jobId)}>
                🔄 다시 확인
              </button>
              <button className="btnSecondary" onClick={() => router.push('/processing')}>
                처리 중 페이지로
              </button>
              <button className="btnSecondary" onClick={handleNewVideo}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {!loading && !errorMsg && videoUrl && (
          <>
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

            <div className="actionsGrid">
              <button className="actionBtn actionBtnPrimary" onClick={handleDownload}>
                ⬇️ MP4 다운로드
              </button>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="actionBtn actionBtnSecondary" style={{ textDecoration: 'none' }}>
                🔗 새 탭에서 열기
              </a>
            </div>

            <button className="newBtn" onClick={handleNewVideo}>✨ 새 영상 만들기</button>
          </>
        )}
      </div>
    </V11Shell>
  );
}
