'use client';
/**
 * V11Shell v15 - AdSense 피벗 버전
 * 변경:
 * - Pro 업그레이드 카드 제거 → AdSense 사이드바 슬롯으로 교체
 * - 무료 크레딧 100/100 제거 (무료 서비스라 의미 없음)
 * - 프로필 "FREE" 라벨 단순화
 * - 공지 띠/네비게이션 유지
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

export function V11Shell({ children, currentStep }: { children: React.ReactNode; currentStep?: number }) {
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

// 회전 공지·트렌드 메시지
const TOP_NOTICES = [
  { icon: '🔥', text: '오늘 급상승: "2026 금리 전망" · 경제 카테고리' },
  { icon: '💡', text: 'AI 분석 통계: 사건 추적형이 평균 CTR +18%' },
  { icon: '🎯', text: '이번 주 블루오션: IT·자기계발 카테고리' },
  { icon: '🎁', text: '모든 시나리오 무료 공개 중 · 가입 없이 바로 사용' },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeIdx, setNoticeIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNoticeIdx((i) => (i + 1) % TOP_NOTICES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const mainMenu = [
    { icon: '🏠', label: '홈', path: '/', key: 'home' },
    { icon: '🎬', label: '내 영상', path: '/assets', key: 'assets' },
    { icon: '📊', label: '경쟁 분석', path: '/analytics', key: 'analytics' },
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
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
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
          width: 240px;
          background: #fff;
          border-right: 1px solid #e5e5e5;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          overflow-y: auto;
        }
        .sidebarHeader {
          padding: 0 20px 20px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 16px;
        }
        .logo {
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .logoAccent { color: #cc0000; }
        .logoSub { font-size: 11px; color: #888; margin-top: 2px; font-weight: 500; }

        .menuSection { padding: 0 12px; }
        .menuTitle {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.1em;
          padding: 8px 12px;
          margin-top: 8px;
        }
        .menuItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #0f0f0f;
          margin-bottom: 2px;
          transition: background 0.15s;
        }
        .menuItem:hover { background: #f5f5f5; }
        .menuItemActive {
          background: #fff0f0;
          color: #cc0000;
          font-weight: 700;
        }
        .menuIcon { font-size: 18px; flex-shrink: 0; }

        .divider { height: 1px; background: #f0f0f0; margin: 12px 20px; }
        .sidebarSpacer { flex: 1; min-height: 16px; }

        /* 무료 배지 카드 (Pro 업그레이드 자리 대체) */
        .freeBadgeCard {
          margin: 16px 12px 12px;
          padding: 14px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #a7f3d0;
          border-radius: 12px;
        }
        .freeBadgeTop {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .freeBadgeEmoji { font-size: 14px; }
        .freeBadgeLabel {
          font-size: 10px;
          font-weight: 800;
          color: #047857;
          letter-spacing: 0.1em;
        }
        .freeBadgeTitle {
          font-size: 14px;
          font-weight: 800;
          color: #064e3b;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .freeBadgeDesc {
          font-size: 11px;
          color: #047857;
          line-height: 1.5;
        }

        /* AdSense 사이드바 슬롯 */
        .sidebarAd {
          margin: 12px;
        }

        .sidebarFooter {
          padding: 16px 20px 0;
          margin-top: 4px;
          border-top: 1px solid #f0f0f0;
          font-size: 11px;
          color: #888;
          line-height: 1.6;
        }
        .techStack { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .techBadge {
          padding: 3px 7px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #555;
        }

        /* ============ MAIN ============ */
        .main { flex: 1; min-width: 0; }

        .topBar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(250, 250, 250, 0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e5e5e5;
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
          border: none;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .noticeBar {
          flex: 1;
          max-width: 680px;
          padding: 8px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .noticeIcon {
          font-size: 14px;
          flex-shrink: 0;
        }
        .noticeText {
          font-size: 12px;
          color: #606060;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          animation: slideIn 0.4s ease;
          letter-spacing: -0.01em;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .topBtns { display: flex; gap: 8px; align-items: center; }

        .userChip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 5px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .userChip:hover { background: #f5f5f5; }
        .userAvatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
        }
        .userInfo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .userName { font-size: 12px; font-weight: 700; color: #0f0f0f; line-height: 1.1; }
        .userTier { font-size: 9px; color: #888; letter-spacing: 0.05em; font-weight: 600; }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.2s;
            box-shadow: 0 0 30px rgba(0,0,0,0.1);
          }
          .sidebarOpen { transform: translateX(0); }
          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
          }
          .hamburger { display: flex; align-items: center; justify-content: center; }
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
            <Link href="/" className="logo">
              Algo<span className="logoAccent">Maker</span>
            </Link>
            <div className="logoSub">AI YouTube Studio</div>
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
                <span>{m.label}</span>
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
                <span>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="sidebarSpacer" />

          {/* 무료 배지 (Pro 카드 자리 대체) */}
          <div className="freeBadgeCard">
            <div className="freeBadgeTop">
              <span className="freeBadgeEmoji">🎁</span>
              <span className="freeBadgeLabel">ALL FREE</span>
            </div>
            <div className="freeBadgeTitle">전체 기능 무료 공개</div>
            <div className="freeBadgeDesc">12개 스타일 · 무제한 영상 · 가입 없이 사용</div>
          </div>

          {/* AdSense 사이드바 슬롯 */}
          <div className="sidebarAd">
            <AdSlot slot="sidebar" variant="vertical" label="sidebar" />
          </div>

          <div className="sidebarFooter">
            <div>Powered by</div>
            <div className="techStack">
              <span className="techBadge">Gemini</span>
              <span className="techBadge">ElevenLabs</span>
              <span className="techBadge">Naver</span>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topBar">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

            <div className="noticeBar" key={noticeIdx}>
              <span className="noticeIcon">{currentNotice.icon}</span>
              <span className="noticeText">{currentNotice.text}</span>
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
