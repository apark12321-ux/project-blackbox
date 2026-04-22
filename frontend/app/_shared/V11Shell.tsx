'use client';
/**
 * AlgoMaker v13 - Shell (중복 렌더링 방지 버전)
 * - Context로 중첩 감지, 이미 렌더링된 경우 children만 반환
 * - 기존 V11Shell({children, currentStep}) 시그니처 호환
 */

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, createContext, useContext } from 'react';

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

// 중첩 감지용 Context
const ShellContext = createContext<boolean>(false);

// 기존 페이지 호환용
export function V11Shell({ children, currentStep }: { children: React.ReactNode; currentStep?: number }) {
  return <DashboardShell>{children}</DashboardShell>;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const alreadyInShell = useContext(ShellContext);

  // 이미 Shell 안에 있으면 children만 반환 (중첩 방지)
  if (alreadyInShell) {
    return <>{children}</>;
  }

  return (
    <ShellContext.Provider value={true}>
      <ShellInner>{children}</ShellInner>
    </ShellContext.Provider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const credits = 100;

  const menu = [
    { icon: '🏠', label: '홈', path: '/', key: 'home' },
    { icon: '📋', label: '템플릿', path: '/templates', key: 'templates' },
    { icon: '🎬', label: '내 영상', path: '/assets', key: 'assets' },
    { icon: '📊', label: '분석', path: '/analytics', key: 'analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

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
        .app {
          display: flex;
          min-height: 100vh;
          background: #fafafa;
        }
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
        .logoSub {
          font-size: 11px;
          color: #888;
          margin-top: 2px;
          font-weight: 500;
        }
        .menuSection { padding: 0 12px; flex: 1; }
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

        .createBtn {
          margin: 16px 12px;
          padding: 12px 16px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }
        .createBtn:hover { background: #a80000; }

        .credits {
          margin: 0 12px;
          padding: 14px;
          background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
          border: 1px solid #e5e5e5;
          border-radius: 12px;
        }
        .creditsTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .creditsLabel {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.05em;
        }
        .creditsBadge {
          font-size: 10px;
          padding: 2px 6px;
          background: #fff;
          border-radius: 999px;
          color: #666;
          font-weight: 600;
        }
        .creditsValue {
          font-size: 20px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .upgradeBtn {
          width: 100%;
          padding: 8px;
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .upgradeBtn:hover { background: #333; }

        .sidebarFooter {
          padding: 16px 20px 0;
          margin-top: 16px;
          border-top: 1px solid #f0f0f0;
          font-size: 11px;
          color: #888;
          line-height: 1.6;
        }
        .techStack {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .techBadge {
          padding: 3px 7px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #555;
        }

        .main { flex: 1; min-width: 0; }
        .topBar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(250, 250, 250, 0.9);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e5e5e5;
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .hamburger {
          display: none;
          width: 36px;
          height: 36px;
          border: none;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
        }
        .searchBar {
          flex: 1;
          max-width: 540px;
          padding: 10px 16px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 14px;
        }
        .topBtns {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .iconBtn {
          width: 38px;
          height: 38px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: background 0.15s;
        }
        .iconBtn:hover { background: #f5f5f5; }
        .profileBtn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000 0%, #a80000 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          border: none;
        }

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
          .topBar { padding: 10px 16px; }
          .searchBar { font-size: 13px; padding: 8px 14px; }
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

          <button className="createBtn" onClick={() => { router.push('/create'); setSidebarOpen(false); }}>
            ▶ 새 영상 만들기
          </button>

          <div className="menuSection">
            <div className="menuTitle">MENU</div>
            {menu.map((m) => (
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

          <div className="credits">
            <div className="creditsTop">
              <span className="creditsLabel">CREDITS</span>
              <span className="creditsBadge">무료</span>
            </div>
            <div className="creditsValue">{credits}</div>
            <button className="upgradeBtn" onClick={() => alert('업그레이드 기능 준비 중')}>
              ⚡ 업그레이드
            </button>
          </div>

          <div className="sidebarFooter">
            <div>Powered by</div>
            <div className="techStack">
              <span className="techBadge">Gemini</span>
              <span className="techBadge">ElevenLabs</span>
              <span className="techBadge">Naver API</span>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topBar">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="searchBar">
              <span>🔍</span>
              <span>템플릿 검색... (예: 쇼츠, 뉴스, 종교)</span>
            </div>
            <div className="topBtns">
              <button className="iconBtn" title="알림">🔔</button>
              <button className="profileBtn">YJ</button>
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
