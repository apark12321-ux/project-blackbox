'use client';
/**
 * V11Shell v2 — "살아있는 스튜디오" 버전
 *
 * 업그레이드:
 * - 로고 옆 작은 LIVE dot + 실시간 카운터
 * - 사이드바 하단: 오늘 생성된 영상 N개 (실시간 느낌 숫자)
 * - 광고 슬롯 → 네이티브 카드 스타일로 자연스럽게
 * - 공지 바: 슬라이드 애니메이션 + 긴급 스타일
 * - 메뉴 hover 시 subtle glow
 * - 프리미엄 도구 느낌의 microinteraction
 */

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, createContext, useContext, useEffect } from 'react';
import AdSlot from './AdSlot';

export interface ProjectState {
  category?: string;
  categoryLabel?: string;
  keyword?: string;
  keywordData?: any;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;
  mode?: 'normal' | 'senior';
  customTopic?: string;
  templateId?: string;
  scenarioStyleId?: string;
  step?: number;
  jobId?: string;
}

const PROJECT_KEY = 'v11_project';

export function getProject(): ProjectState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function setProject(updates: Partial<ProjectState>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getProject();
    localStorage.setItem(PROJECT_KEY, JSON.stringify({ ...current, ...updates }));
  } catch {}
}

export function clearProject() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(PROJECT_KEY); } catch {}
}

const ShellContext = createContext<boolean>(false);

export function V11Shell({ children }: { children: React.ReactNode; currentStep?: number }) {
  return <DashboardShell>{children}</DashboardShell>;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const alreadyInShell = useContext(ShellContext);
  if (alreadyInShell) return <>{children}</>;
  return (
    <ShellContext.Provider value={true}>
      <ShellInner>{children}</ShellInner>
    </ShellContext.Provider>
  );
}

// 회전 공지 — 더 흥미롭게
const TOP_NOTICES = [
  { icon: '🔥', text: '이번 주 급상승: "2026 금리 전망" · 블루오션 지수 94/100', tone: 'hot' },
  { icon: '📈', text: '경제·사회 카테고리 조회수 평균 +38% (지난주 대비)', tone: 'trend' },
  { icon: '💡', text: 'AI 분석 통계: 미스터리 추적형이 유지율 95% 기록', tone: 'tip' },
  { icon: '🎯', text: '이번 달 주목 카테고리: IT·자기계발 · 경쟁 강도 낮음', tone: 'hot' },
  { icon: '⚡', text: '다큐 스타일 업데이트 — BBC식 호흡으로 유지율 +12%', tone: 'new' },
  { icon: '🎬', text: '바로 어제 조회수 10만+ 돌파한 시나리오: "상식 깨기"', tone: 'trend' },
];

// 실시간 카운터 — 시드 기반 자연스러운 숫자
function useTodayCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 오늘 날짜 기반 시드 → 매일 다른 시작 숫자, 하지만 같은 날 동안엔 일관됨
    const now = new Date();
    const dayKey = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

    // 시간대별 기본 증가량
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 하루에 약 1200~1800 사이 영상이 만들어진다 (가짜 baseline)
    const base = 1200 + (dayKey % 600);
    // 시간에 따라 누적
    const hourProgress = (hour * 60 + minute) / (24 * 60);
    const current = Math.floor(base * hourProgress);

    setCount(current);

    // 실시간 느낌 — 30~90초마다 한 명씩 증가
    const tick = () => {
      setCount((c) => c + 1);
    };
    const randomInterval = 30000 + Math.random() * 60000;
    const timer = setTimeout(tick, randomInterval);
    return () => clearTimeout(timer);
  }, []);

  return count;
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeIdx, setNoticeIdx] = useState(0);
  const todayCount = useTodayCounter();

  useEffect(() => {
    const t = setInterval(() => setNoticeIdx((i) => (i + 1) % TOP_NOTICES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const mainMenu = [
    { icon: '🏠', label: '홈', path: '/', key: 'home' },
    { icon: '🎬', label: '내 영상', path: '/assets', key: 'assets' },
    { icon: '📊', label: '경쟁 분석', path: '/analytics', key: 'analytics', badge: 'LIVE' },
    { icon: '📝', label: '블로그', path: '/blog', key: 'blog' },
  ];

  const infoMenu = [
    { icon: '💡', label: '소개', path: '/about', key: 'about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const currentNotice = TOP_NOTICES[noticeIdx];

  return (
    <>
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fafafa;
          color: #0f0f0f;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }
      `}</style>

      <style jsx>{`
        .app { display: flex; min-height: 100vh; background: #fafafa; }

        /* ============ SIDEBAR ============ */
        .sidebar {
          width: 248px;
          background: #fff;
          border-right: 1px solid #e8e8e8;
          padding: 18px 0 16px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .sidebar::-webkit-scrollbar { width: 4px; }
        .sidebar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

        .sidebarHeader {
          padding: 0 22px 18px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 14px;
        }
        .logoRow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .logo {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .logoAccent { color: #cc0000; }
        .liveChip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          background: #fee2e2;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 800;
          color: #b91c1c;
          letter-spacing: 0.05em;
        }
        .livedot {
          width: 5px; height: 5px;
          background: #dc2626;
          border-radius: 50%;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .logoSub {
          font-size: 10.5px;
          color: #808080;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .menuSection { padding: 0 12px; }
        .menuTitle {
          font-size: 10px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.12em;
          padding: 10px 14px 6px;
        }
        .menuItem {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 14px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 2px;
          transition: all 0.15s ease;
          position: relative;
        }
        .menuItem:hover {
          background: #f6f6f6;
          transform: translateX(2px);
        }
        .menuItemActive {
          background: linear-gradient(90deg, #fff0f0 0%, #fff5f5 100%);
          color: #cc0000;
          font-weight: 700;
        }
        .menuItemActive::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: #cc0000;
          border-radius: 0 2px 2px 0;
        }
        .menuIcon { font-size: 16px; flex-shrink: 0; }
        .menuLabel { flex: 1; }
        .menuBadge {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: #fef3c7;
          color: #92400e;
          letter-spacing: 0.05em;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #f0f0f0 20%, #f0f0f0 80%, transparent 100%);
          margin: 10px 22px;
        }
        .sidebarSpacer { flex: 1; min-height: 12px; }

        /* Live stats card */
        .liveStatsCard {
          margin: 0 12px 10px;
          padding: 13px 14px 12px;
          background: linear-gradient(145deg, #0f0f0f 0%, #1f1f1f 100%);
          border-radius: 11px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .liveStatsCard::before {
          content: '';
          position: absolute;
          top: -20%; right: -10%;
          width: 100px; height: 100px;
          background: radial-gradient(circle, rgba(204,0,0,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .liveStatsTop {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 7px;
          position: relative;
          z-index: 1;
        }
        .liveStatsDot {
          width: 5px; height: 5px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        .liveStatsLabel {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.7);
        }
        .liveStatsNumber {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 3px;
          font-feature-settings: 'tnum';
          position: relative;
          z-index: 1;
        }
        .liveStatsSubtitle {
          font-size: 10.5px;
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }

        /* Sidebar ad slot */
        .sidebarAdSlot {
          margin: 0 12px 10px;
        }

        .sidebarFooter {
          padding: 12px 22px 0;
          border-top: 1px solid #f0f0f0;
          font-size: 10px;
          color: #999;
          line-height: 1.6;
        }
        .footerLabel {
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #707070;
          margin-bottom: 4px;
          font-size: 9px;
          text-transform: uppercase;
        }
        .techStack { display: flex; gap: 4px; flex-wrap: wrap; }
        .techBadge {
          padding: 3px 7px;
          background: #f5f5f5;
          border: 1px solid #ebebeb;
          border-radius: 4px;
          font-size: 9.5px;
          font-weight: 600;
          color: #555;
        }

        /* ============ MAIN ============ */
        .main { flex: 1; min-width: 0; }

        .topBar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(250, 250, 250, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8e8e8;
          padding: 10px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 52px;
        }
        .hamburger {
          display: none;
          width: 34px; height: 34px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          align-items: center;
          justify-content: center;
        }

        .noticeBar {
          flex: 1;
          max-width: 720px;
          padding: 9px 16px;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          transition: all 0.2s;
        }
        .noticeBar:hover {
          border-color: #cc0000;
          box-shadow: 0 2px 8px rgba(204,0,0,0.06);
        }
        .noticeIconWrap {
          width: 24px; height: 24px;
          background: #fafafa;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        .noticeText {
          font-size: 12px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          letter-spacing: -0.01em;
          font-weight: 500;
        }
        .noticeBadge {
          padding: 2px 7px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.06em;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .badgeHot { background: #fee2e2; color: #b91c1c; }
        .badgeTrend { background: #dbeafe; color: #1e40af; }
        .badgeTip { background: #fef3c7; color: #92400e; }
        .badgeNew { background: #dcfce7; color: #15803d; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .topBtns { display: flex; gap: 8px; align-items: center; }

        .userChip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px 5px 5px;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .userChip:hover {
          border-color: #0f0f0f;
          transform: translateY(-1px);
        }
        .userAvatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000 0%, #7a0000 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.02em;
        }
        .userInfo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .userName {
          font-size: 12px;
          font-weight: 700;
          color: #0f0f0f;
          line-height: 1.1;
        }
        .userTier {
          font-size: 9px;
          color: #888;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-top: 1px;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
            box-shadow: 0 0 40px rgba(0,0,0,0.15);
          }
          .sidebarOpen { transform: translateX(0); }
          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
            animation: fadeIn 0.2s;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .hamburger { display: flex; }
          .topBar { padding: 10px 14px; }
          .noticeBar { padding: 7px 12px; font-size: 11px; }
          .userInfo { display: none; }
          .userChip { padding: 5px; }
        }
      `}</style>

      <div className="app">
        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`sidebar ${sidebarOpen ? 'sidebarOpen' : ''}`}>
          <div className="sidebarHeader">
            <div className="logoRow">
              <Link href="/" className="logo">
                Algo<span className="logoAccent">Maker</span>
              </Link>
              <span className="liveChip">
                <span className="livedot" />
                LIVE
              </span>
            </div>
            <div className="logoSub">AI YouTube Studio · 2026</div>
          </div>

          <div className="menuSection">
            <div className="menuTitle">MENU</div>
            {mainMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'menuItemActive' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span className="menuLabel">{m.label}</span>
                {m.badge && <span className="menuBadge">{m.badge}</span>}
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="menuSection">
            <div className="menuTitle">INFO</div>
            {infoMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'menuItemActive' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span className="menuLabel">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="sidebarSpacer" />

          {/* 🎯 라이브 통계 카드 — Pro 업그레이드 카드 자리 */}
          <div className="liveStatsCard">
            <div className="liveStatsTop">
              <span className="liveStatsDot" />
              <span className="liveStatsLabel">TODAY · LIVE</span>
            </div>
            <div className="liveStatsNumber">
              {todayCount.toLocaleString()}
            </div>
            <div className="liveStatsSubtitle">
              개 영상이 오늘 제작됐어요
            </div>
          </div>

          {/* 📢 네이티브 광고 (사이드바) */}
          <div className="sidebarAdSlot">
            <AdSlot slot="sidebar" variant="sidebar-card" />
          </div>

          <div className="sidebarFooter">
            <div className="footerLabel">POWERED BY</div>
            <div className="techStack">
              <span className="techBadge">Gemini</span>
              <span className="techBadge">Edge TTS</span>
              <span className="techBadge">Pexels</span>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topBar">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>

            <div className="noticeBar" key={noticeIdx}>
              <div className="noticeIconWrap">{currentNotice.icon}</div>
              <span className="noticeText">{currentNotice.text}</span>
              <span className={`noticeBadge badge${currentNotice.tone.charAt(0).toUpperCase() + currentNotice.tone.slice(1)}`}>
                {currentNotice.tone === 'hot' ? 'HOT' :
                 currentNotice.tone === 'trend' ? 'TREND' :
                 currentNotice.tone === 'tip' ? 'TIP' : 'NEW'}
              </span>
            </div>

            <div className="topBtns">
              <div className="userChip">
                <div className="userAvatar">YJ</div>
                <div className="userInfo">
                  <span className="userName">박예준</span>
                  <span className="userTier">크리에이터</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
