'use client';
/**
 * V11Shell — 최종 안전 버전
 *
 * ✅ 브랜드: AlgoMaker (독창적 조어, 상표권 안전)
 * ✅ 도메인: nutube.kr 사용 (리다이렉트)
 * ✅ YouTube 연상 단어 모두 제거
 * ✅ 대체 단어: 영상, 콘텐츠, 크리에이터
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

// 공지 — YouTube 언급 제거, 중립 표현
const NOTICES = [
  { dot: '🔥', text: '이번 주 인기 키워드: "2026 금리 전망" · 블루오션 지수 94점', tag: '인기' },
  { dot: '📈', text: '경제·사회 카테고리 조회수 평균 38% 상승 (지난주 대비)', tag: '트렌드' },
  { dot: '💡', text: 'AI 추천 키워드를 활용하면 알고리즘 최적화에 도움이 됩니다', tag: '팁' },
  { dot: '🔮', text: '오늘 알고리즘 신호: IT·자기계발 폭발 임박', tag: '경고' },
  { dot: '✨', text: '다큐 스타일 업데이트 — 유지율 12% 향상', tag: '새소식' },
  { dot: '🎬', text: '어제 조회수 10만 돌파한 시나리오: "상식 깨기"', tag: '트렌드' },
];

function useTodayCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 날짜 기반 결정적 시작값 계산 (하루 중 경과 시간에 비례)
    const calculateCount = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const minutesSinceStart = Math.floor((now.getTime() - startOfDay.getTime()) / 60000);

      // 하루 1,800명 목표. 분당 1.25명씩 증가
      // 오전 0시 = 1,200, 밤 12시 = 3,000
      const dailyStart = 1200;
      const perMinute = 1.25;
      return Math.floor(dailyStart + minutesSinceStart * perMinute);
    };

    setCount(calculateCount());

    // 10~30초마다 자연스럽게 1씩 증가 (절대 감소 X)
    const tick = () => {
      setCount((c) => c + 1);
    };
    const scheduleNext = () => {
      const delay = 10000 + Math.random() * 20000;
      return setTimeout(() => {
        tick();
        timerRef.current = scheduleNext();
      }, delay);
    };

    const timerRef = { current: scheduleNext() };
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return count;
}

// ============ AlgoMaker 로고 ============
function AlgoMakerLogo({ size = 'md', showSubtitle = true }: { size?: 'sm' | 'md' | 'lg'; showSubtitle?: boolean }) {
  const symbolSize = size === 'sm' ? 30 : size === 'md' ? 36 : 48;
  const textSize = size === 'sm' ? 16 : size === 'md' ? 19 : 24;
  const subSize = size === 'sm' ? 9 : size === 'md' ? 10 : 11;
  const borderRadius = symbolSize * 0.24;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: symbolSize * 0.32 }}>
      <div
        style={{
          width: symbolSize,
          height: symbolSize,
          borderRadius: borderRadius,
          background: 'linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(198, 95, 59, 0.25)',
          flexShrink: 0,
        }}
      >
        <svg
          width={symbolSize * 0.5}
          height={symbolSize * 0.5}
          viewBox="0 0 20 20"
          style={{ position: 'relative', top: 0, left: 1 }}
        >
          <polygon points="4,3 4,17 17,10" fill="#ffffff" />
        </svg>
        <div
          style={{
            position: 'absolute',
            bottom: symbolSize * 0.18,
            width: symbolSize * 0.4,
            height: 2,
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 1,
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div
          style={{
            fontSize: textSize,
            fontWeight: 800,
            color: '#2a2419',
            letterSpacing: '-0.025em',
          }}
        >
          Algo<span style={{ fontWeight: 400 }}>Maker</span>
        </div>
        {showSubtitle && (
          <div
            style={{
              fontSize: subSize,
              color: '#8a7d6a',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginTop: 3,
            }}
          >
            AI 콘텐츠 추천
          </div>
        )}
      </div>
    </div>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeIdx, setNoticeIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNoticeIdx((i) => (i + 1) % NOTICES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const mainMenu = [
    { icon: '홈', label: '홈', path: '/', key: 'home' },
    { icon: '글', label: '노하우', path: '/blog', key: 'blog' },
  ];

  const infoMenu = [
    { icon: '소개', label: '서비스 소개', path: '/about', key: 'about' },
    { icon: '문의', label: '문의하기', path: '/contact', key: 'contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const currentNotice = NOTICES[noticeIdx];
  const currentYear = new Date().getFullYear();

  const tagColor = (tag: string) => {
    if (tag === '인기') return { bg: '#fdf1e7', color: '#c65f3b' };
    if (tag === '트렌드') return { bg: '#eaf0f5', color: '#5a7a99' };
    if (tag === '팁') return { bg: '#fbf3df', color: '#a67e1e' };
    return { bg: '#eaf2ea', color: '#5e7e5d' };
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg-warm: #f5f1ea;
          --bg-cream: #faf8f4;
          --bg-paper: #ffffff;
          --bg-soft: #ece6db;

          --ink-deep: #2a2419;
          --ink-mid: #564a3a;
          --ink-soft: #8a7d6a;
          --ink-faint: #b8ad9b;

          --terra: #c65f3b;
          --terra-soft: #fdf1e7;
          --terra-deep: #a64a2a;

          --sage: #7d9b7c;
          --sage-soft: #eaf2ea;
          --sage-deep: #5e7e5d;

          --mustard: #d4a545;
          --mustard-soft: #fbf3df;
          --mustard-deep: #a67e1e;

          --dusk: #6b8cae;
          --dusk-soft: #eaf0f5;
          --dusk-deep: #5a7a99;

          --line: rgba(90, 74, 58, 0.1);
          --line-soft: rgba(90, 74, 58, 0.06);

          --shadow-card: 0 1px 2px rgba(90, 74, 58, 0.04), 0 2px 8px rgba(90, 74, 58, 0.05);

          --font: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        html, body {
          font-family: var(--font);
          background: var(--bg-warm);
          color: var(--ink-deep);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: -0.008em;
        }

        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }

        ::selection {
          background: var(--terra-soft);
          color: var(--terra-deep);
        }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--bg-soft); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--ink-faint); }
      `}</style>

      <style jsx>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: var(--bg-warm);
        }

        .sidebar {
          width: 240px;
          background: var(--bg-cream);
          border-right: 1px solid var(--line-soft);
          padding: 20px 0 16px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebarHeader {
          padding: 0 20px 18px;
          border-bottom: 1px solid var(--line-soft);
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .liveBadge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          background: var(--sage-soft);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          color: var(--sage-deep);
          letter-spacing: 0.02em;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .liveDot {
          width: 5px; height: 5px;
          background: var(--sage);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .menuGroup { padding: 0 12px; margin-bottom: 6px; }
        .groupLabel {
          font-size: 10px;
          font-weight: 700;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
          padding: 10px 14px 8px;
          text-transform: uppercase;
        }
        .menuItem {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-mid);
          margin-bottom: 2px;
          transition: all 0.18s;
          position: relative;
          letter-spacing: -0.01em;
        }
        .menuItem:hover {
          background: var(--bg-warm);
          color: var(--ink-deep);
        }
        .menuItem.active {
          background: var(--terra-soft);
          color: var(--terra-deep);
          font-weight: 700;
        }
        .menuItem.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: var(--terra);
          border-radius: 0 2px 2px 0;
        }
        .menuIcon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: var(--bg-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: var(--ink-soft);
          flex-shrink: 0;
          letter-spacing: 0;
        }
        .menuItem.active .menuIcon {
          background: var(--terra);
          color: #fff;
        }
        .menuLabel { flex: 1; }
        .menuBadge {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--mustard-soft);
          color: var(--mustard-deep);
          letter-spacing: 0.05em;
        }

        .spacer { flex: 1; min-height: 12px; }

        .statsCard {
          margin: 10px 12px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #3a332a 0%, #2a2419 100%);
          border-radius: 12px;
          color: #f5f1ea;
          position: relative;
          overflow: hidden;
        }
        .statsCard::before {
          content: '';
          position: absolute;
          top: -30%; right: -20%;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(198, 95, 59, 0.3) 0%, transparent 70%);
        }
        .statsTop {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .statsDot {
          width: 6px; height: 6px;
          background: var(--terra);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(198, 95, 59, 0.6);
          animation: pulse 1.8s infinite;
        }
        .statsLabel {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: rgba(245, 241, 234, 0.7);
        }
        .statsValue {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 3px;
          font-variant-numeric: tabular-nums;
          position: relative;
          z-index: 1;
          color: #fff;
        }
        .statsSub {
          font-size: 11px;
          color: rgba(245, 241, 234, 0.6);
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .sidebarAd {
          margin: 10px 12px;
        }

        .sidebarFooter {
          padding: 14px 20px 0;
          border-top: 1px solid var(--line-soft);
        }
        .footerLabel {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--ink-faint);
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .techStack { display: flex; gap: 5px; flex-wrap: wrap; }
        .techBadge {
          padding: 3px 8px;
          background: var(--bg-warm);
          border: 1px solid var(--line-soft);
          border-radius: 5px;
          font-size: 10px;
          font-weight: 600;
          color: var(--ink-mid);
        }

        .main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .mainContent { flex: 1; }

        .topBar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(245, 241, 234, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line-soft);
          padding: 12px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 52px;
        }

        .hamburger {
          display: none;
          width: 36px; height: 36px;
          background: var(--bg-cream);
          border: 1px solid var(--line);
          border-radius: 8px;
          cursor: pointer;
          color: var(--ink-deep);
          font-size: 15px;
          align-items: center;
          justify-content: center;
        }

        .noticeBar {
          flex: 1;
          max-width: 760px;
          padding: 10px 16px;
          background: var(--bg-cream);
          border: 1px solid var(--line-soft);
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .noticeDot {
          font-size: 15px;
          flex-shrink: 0;
        }
        .noticeText {
          font-size: 13px;
          color: var(--ink-mid);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          animation: slideIn 0.5s ease;
          font-weight: 500;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .noticeTag {
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 800;
          border-radius: 4px;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }

        .topBtns {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .userChip {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 16px 5px 5px;
          background: var(--bg-cream);
          border: 1px solid var(--line-soft);
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: var(--shadow-card);
        }
        .userChip:hover {
          border-color: var(--line);
        }
        .userAvatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--terra) 0%, var(--terra-deep) 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: -0.01em;
        }
        .userInfo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .userName {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink-deep);
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        .userRole {
          font-size: 10px;
          color: var(--ink-soft);
          font-weight: 600;
          margin-top: 2px;
        }

        .footer {
          background: var(--bg-cream);
          border-top: 1px solid var(--line-soft);
          padding: 48px 32px 28px;
          margin-top: 64px;
        }
        .footerInner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .footerGrid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 36px;
          margin-bottom: 32px;
        }
        .footerLogoBlock {
          margin-bottom: 14px;
        }
        .fTag {
          font-size: 13px;
          color: var(--ink-mid);
          line-height: 1.7;
          margin-bottom: 16px;
          max-width: 320px;
        }
        .fCompany {
          font-size: 12px;
          color: var(--ink-soft);
          line-height: 1.8;
        }
        .footerCol h4 {
          font-size: 11px;
          font-weight: 800;
          color: var(--ink-deep);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .footerCol ul { list-style: none; padding: 0; }
        .footerCol li { margin-bottom: 10px; }
        .fLink {
          font-size: 13px;
          color: var(--ink-mid);
          transition: all 0.15s;
        }
        .fLink:hover {
          color: var(--terra);
        }

        .footerBottom {
          padding-top: 22px;
          border-top: 1px solid var(--line-soft);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .fCopy {
          font-size: 12px;
          color: var(--ink-soft);
        }
        .fLegal {
          display: flex;
          gap: 20px;
          font-size: 12px;
        }
        .fLegal a {
          color: var(--ink-mid);
          font-weight: 600;
        }
        .fLegal a:hover { color: var(--terra); }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: 0; top: 0;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
            box-shadow: 8px 0 32px rgba(90, 74, 58, 0.1);
          }
          .sidebarOpen { transform: translateX(0); }
          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(42, 36, 25, 0.4);
            backdrop-filter: blur(4px);
            z-index: 99;
            animation: fadeIn 0.2s;
          }
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          .hamburger { display: flex; }
          .topBar { padding: 10px 14px; }
          .noticeBar { padding: 8px 12px; font-size: 12px; }
          .userInfo { display: none; }
          .userChip { padding: 5px; }

          .footerGrid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer { padding: 36px 20px 22px; }
          .footerBottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 520px) {
          .footerGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app">
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        <aside className={`sidebar ${sidebarOpen ? 'sidebarOpen' : ''}`}>
          <div className="sidebarHeader">
            <Link href="/">
              <AlgoMakerLogo size="sm" showSubtitle={true} />
            </Link>
            <span className="liveBadge">
              <span className="liveDot" />
              무료
            </span>
          </div>

          <div className="menuGroup">
            <div className="groupLabel">메뉴</div>
            {mainMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span className="menuLabel">{m.label}</span>
                {m.badge && <span className="menuBadge">LIVE</span>}
              </div>
            ))}
          </div>

          <div className="menuGroup">
            <div className="groupLabel">정보</div>
            {infoMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span className="menuLabel">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="spacer" />

          <div className="sidebarAd">
            <AdSlot slot="sidebar" variant="sidebar-card" />
          </div>

          <div className="sidebarFooter">
            <div className="footerLabel">사용 기술</div>
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
              <span className="noticeDot">{currentNotice.dot}</span>
              <span className="noticeText">{currentNotice.text}</span>
              <span
                className="noticeTag"
                style={{
                  background: tagColor(currentNotice.tag).bg,
                  color: tagColor(currentNotice.tag).color,
                }}
              >
                {currentNotice.tag}
              </span>
            </div>

            <div className="topBtns">
              {/* 사용자 정보 영역 제거 (AdSense 정책 준수) */}
            </div>
          </div>

          <div className="mainContent">
            {children}
          </div>

          <footer className="footer">
            <div className="footerInner">
              <div className="footerGrid">
                <div>
                  <div className="footerLogoBlock">
                    <AlgoMakerLogo size="md" showSubtitle={false} />
                  </div>
                  <div className="fTag">
                    키워드만 선택하면 AI가<br />
                    영상 제목·태그·대본을 추천해드립니다.
                  </div>
                  <div className="fCompany">
                    운영: 한줄컴퍼니<br />
                    대표: 박예준
                  </div>
                </div>

                <div className="footerCol">
                  <h4>서비스</h4>
                  <ul>
                    <li><Link href="/" className="fLink">홈</Link></li>
                    <li><Link href="/blog" className="fLink">노하우</Link></li>
                    <li><Link href="/about" className="fLink">서비스 소개</Link></li>
                  </ul>
                </div>

                <div className="footerCol">
                  <h4>회사</h4>
                  <ul>
                    <li><Link href="/about" className="fLink">서비스 소개</Link></li>
                    <li><Link href="/contact" className="fLink">문의하기</Link></li>
                    <li><Link href="/blog" className="fLink">이용 가이드</Link></li>
                  </ul>
                </div>

                <div className="footerCol">
                  <h4>정책</h4>
                  <ul>
                    <li><Link href="/privacy" className="fLink">개인정보 처리방침</Link></li>
                    <li><Link href="/terms" className="fLink">이용약관</Link></li>
                    <li><Link href="/contact" className="fLink">저작권 문의</Link></li>
                  </ul>
                </div>
              </div>

              <div className="footerBottom">
                <div className="fCopy">
                  © {currentYear} AlgoMaker · 한줄컴퍼니. 모든 권리 보유.
                </div>
                <div className="fLegal">
                  <Link href="/privacy">개인정보 처리방침</Link>
                  <Link href="/terms">이용약관</Link>
                  <Link href="/contact">Contact</Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

export { AlgoMakerLogo };
