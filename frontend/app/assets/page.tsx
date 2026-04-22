'use client';
/**
 * /assets - 내 영상
 * localStorage에 저장된 Job 이력 표시 + 빈 상태 + 첫 영상 유도
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, clearProject } from '../_shared/V11Shell';
import { getScenarioById } from '../_shared/scenarios';

interface VideoJob {
  job_id: string;
  keyword: string;
  scenarioStyleId?: string;
  createdAt: string;   // ISO
  duration?: number;
}

const JOBS_KEY = 'algomaker_jobs';

function getJobs(): VideoJob[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function AssetsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setJobs(getJobs());
    setLoaded(true);
  }, []);

  const handleCreateNew = () => {
    clearProject();
    router.push('/');
  };

  const handleOpen = (job: VideoJob) => {
    // 세션 복구 후 done 페이지로
    const project = {
      keyword: job.keyword,
      jobId: job.job_id,
      scenarioStyleId: job.scenarioStyleId,
      duration: job.duration,
    };
    try {
      localStorage.setItem('v11_project', JSON.stringify(project));
      router.push('/done');
    } catch {}
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 48px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .headerLeft { min-width: 0; }
        .eyebrow {
          display: inline-block;
          padding: 3px 10px;
          background: #fff0f0;
          color: #cc0000;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }
        .title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }
        .sub {
          font-size: 13px;
          color: #606060;
        }
        .newBtn {
          padding: 12px 22px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
        }
        .newBtn:hover { background: #a80000; }

        .statsBar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .statCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 16px;
        }
        .statLabel {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .statValue {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f0f0f;
        }
        .statSub {
          font-size: 11px;
          color: #888;
          margin-top: 2px;
        }

        /* Empty state */
        .emptyState {
          background: #fff;
          border: 2px dashed #e5e5e5;
          border-radius: 16px;
          padding: 80px 24px;
          text-align: center;
        }
        .emptyIcon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.7;
        }
        .emptyTitle {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .emptySub {
          font-size: 14px;
          color: #606060;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .emptyBtn {
          padding: 14px 28px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .emptyBtn:hover { background: #a80000; }

        .tipGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }
        .tip {
          padding: 14px;
          background: #fafafa;
          border-radius: 10px;
          text-align: left;
        }
        .tipEmoji { font-size: 20px; margin-bottom: 6px; }
        .tipTitle {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .tipDesc {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
        }

        /* Job list */
        .jobGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .jobCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .jobCard:hover {
          border-color: #cc0000;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }
        .jobThumb {
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .jobThumb::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 40%, rgba(204,0,0,0.3) 0%, transparent 60%);
        }
        .jobPlay {
          position: relative;
          z-index: 1;
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #cc0000;
        }
        .jobDuration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          padding: 2px 8px;
          background: rgba(0,0,0,0.8);
          color: #fff;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
        }
        .jobStyle {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 3px 10px;
          background: rgba(255,255,255,0.95);
          color: #0f0f0f;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
        }
        .jobInfo {
          padding: 14px;
        }
        .jobTitle {
          font-size: 14px;
          font-weight: 700;
          color: #0f0f0f;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .jobMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #888;
        }
        .jobId {
          font-family: monospace;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
        }

        @media (max-width: 768px) {
          .page { padding: 20px 14px 40px; }
          .title { font-size: 22px; }
          .statsBar { grid-template-columns: 1fr 1fr; }
          .tipGrid { grid-template-columns: 1fr; }
          .emptyState { padding: 48px 20px; }
          .jobGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="headerLeft">
            <div className="eyebrow">🎬 MY VIDEOS</div>
            <h1 className="title">내 영상</h1>
            <p className="sub">지금까지 제작한 영상 목록</p>
          </div>
          <button className="newBtn" onClick={handleCreateNew}>
            ▶ 새 영상 만들기
          </button>
        </div>

        {loaded && jobs.length > 0 && (
          <div className="statsBar">
            <div className="statCard">
              <div className="statLabel">제작 완료</div>
              <div className="statValue">{jobs.length}<span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>편</span></div>
              <div className="statSub">누적 영상 수</div>
            </div>
            <div className="statCard">
              <div className="statLabel">이번 달</div>
              <div className="statValue">{jobs.filter(j => new Date(j.createdAt).getMonth() === new Date().getMonth()).length}<span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>편</span></div>
              <div className="statSub">최근 30일</div>
            </div>
            <div className="statCard">
              <div className="statLabel">총 길이</div>
              <div className="statValue">{jobs.reduce((sum, j) => sum + (j.duration || 10), 0)}<span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>분</span></div>
              <div className="statSub">전체 영상 합계</div>
            </div>
          </div>
        )}

        {!loaded ? (
          <div className="emptyState">
            <div className="emptySub">불러오는 중...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">🎬</div>
            <div className="emptyTitle">아직 만든 영상이 없어요</div>
            <div className="emptySub">
              키워드 하나로 AI가 영상을 만들어드립니다<br />
              5~8분이면 완성되는 유튜브 자동화
            </div>
            <button className="emptyBtn" onClick={handleCreateNew}>
              <span>▶</span>
              <span>첫 영상 만들기</span>
            </button>

            <div className="tipGrid">
              <div className="tip">
                <div className="tipEmoji">🔍</div>
                <div className="tipTitle">블루오션 분석</div>
                <div className="tipDesc">경쟁 낮은 주제를 AI가 자동 발굴</div>
              </div>
              <div className="tip">
                <div className="tipEmoji">📝</div>
                <div className="tipTitle">12가지 스타일</div>
                <div className="tipDesc">같은 키워드도 매번 다른 컨셉</div>
              </div>
              <div className="tip">
                <div className="tipEmoji">🎬</div>
                <div className="tipTitle">완성 영상</div>
                <div className="tipDesc">내레이션+자막+영상 한번에</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="jobGrid">
            {jobs.map((job) => {
              const style = getScenarioById(job.scenarioStyleId);
              const date = new Date(job.createdAt).toLocaleDateString('ko-KR');
              return (
                <div key={job.job_id} className="jobCard" onClick={() => handleOpen(job)}>
                  <div className="jobThumb">
                    {style && <div className="jobStyle">{style.emoji} {style.name}</div>}
                    <div className="jobPlay">▶</div>
                    <div className="jobDuration">{job.duration || 10}:00</div>
                  </div>
                  <div className="jobInfo">
                    <div className="jobTitle">{job.keyword}</div>
                    <div className="jobMeta">
                      <span>{date}</span>
                      <span className="jobId">{job.job_id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
