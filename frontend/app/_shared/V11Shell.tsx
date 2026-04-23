'use client';
/**
 * V11Shell v4 — "Neural Lab"
 *
 * 컨셉: AI 뉴럴 네트워크 연구실 / NASA 미션 컨트롤 / Cursor IDE
 * 색: 검정 + 네온 시안/바이올렛/핑크
 * 폰트: Space Grotesk (헤딩) + JetBrains Mono (데이터)
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

const TRANSMISSIONS = [
  { code: 'SIG-001', text: 'TRENDING NODE · "2026 INTEREST_RATE" · BLUE_OCEAN_SCORE: 94', tone: 'critical' },
  { code: 'SIG-002', text: 'DATA_STREAM · CATEGORY.ECONOMY retention +38% (wk-over-wk)', tone: 'info' },
  { code: 'SIG-003', text: 'ANALYSIS · scenario.mystery → retention.avg 95.0%', tone: 'alert' },
  { code: 'SIG-004', text: 'MARKET_SCAN · IT_SELF-DEV cluster · competition.low', tone: 'critical' },
  { code: 'SIG-005', text: 'UPDATE_PUSH · scenario.docu v2.1 · retention +12%', tone: 'new' },
  { code: 'SIG-006', text: 'BREAKTHROUGH · scenario.flip · 10M+ views (yesterday)', tone: 'info' },
];

function useTodayCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const now = new Date();
    const dayKey = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const base = 1200 + (dayKey % 600);
    const hourProgress = (hour * 60 + minute) / (24 * 60);
    const current = Math.floor(base * hourProgress);
    setCount(current);
    const tick = () => setCount((c) => c + 1);
    const timer = setTimeout(tick, 30000 + Math.random() * 60000);
    return () => clearTimeout(timer);
  }, []);
  return count;
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transmissionIdx, setTransmissionIdx] = useState(0);
  const todayCount = useTodayCounter();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTransmissionIdx((i) => (i + 1) % TRANSMISSIONS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // uptime ticker
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const mainMenu = [
    { code: 'N01', icon: '◉', label: 'HOME', labelKr: '홈', path: '/', key: 'home' },
    { code: 'N02', icon: '▸', label: 'ASSETS', labelKr: '내 영상', path: '/assets', key: 'assets' },
    { code: 'N03', icon: '⊹', label: 'ANALYZE', labelKr: '경쟁 분석', path: '/analytics', key: 'analytics', badge: 'LIVE' },
    { code: 'N04', icon: '◈', label: 'JOURNAL', labelKr: '블로그', path: '/blog', key: 'blog' },
  ];

  const infoMenu = [
    { code: 'I01', icon: '○', label: 'ABOUT', labelKr: '소개', path: '/about', key: 'about' },
    { code: 'I02', icon: '◇', label: 'CONTACT', labelKr: '문의', path: '/contact', key: 'contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const currentTransmission = TRANSMISSIONS[transmissionIdx];
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg-0: #050507;
          --bg-1: #0a0a0f;
          --bg-2: #0f0f18;
          --bg-3: #15151f;
          --bg-4: #1a1a28;
          --line-dim: rgba(255,255,255,0.06);
          --line: rgba(255,255,255,0.1);
          --line-strong: rgba(255,255,255,0.18);
          --text-0: #ffffff;
          --text-1: #e5e5ee;
          --text-2: #a0a0b0;
          --text-3: #606070;
          --text-4: #404050;
          --cyan: #00e5ff;
          --cyan-dim: rgba(0, 229, 255, 0.15);
          --violet: #a855f7;
          --violet-dim: rgba(168, 85, 247, 0.15);
          --pink: #ec4899;
          --pink-dim: rgba(236, 72, 153, 0.15);
          --green: #4ade80;
          --green-dim: rgba(74, 222, 128, 0.15);
          --amber: #fbbf24;
          --red: #ef4444;

          --font-sans: 'Inter', 'Pretendard', -apple-system, sans-serif;
          --font-display: 'Space Grotesk', 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', ui-monospace, monospace;
        }

        html, body {
          font-family: var(--font-sans);
          background: var(--bg-0);
          color: var(--text-1);
          -webkit-font-smoothing: antialiased;
          font-feature-settings: 'cv11', 'ss01';
        }

        /* Global noise texture */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
          opacity: 0.04;
          mix-blend-mode: screen;
        }

        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }

        ::selection {
          background: var(--cyan);
          color: var(--bg-0);
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-0); }
        ::-webkit-scrollbar-thumb { background: var(--bg-4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-4); }
      `}</style>

      <style jsx>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: var(--bg-0);
          position: relative;
        }

        /* Subtle grid overlay */
        .app::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--line-dim) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-dim) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.4;
          z-index: 0;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
        }

        /* ============ SIDEBAR ============ */
        .sidebar {
          width: 240px;
          background: var(--bg-1);
          border-right: 1px solid var(--line-dim);
          padding: 16px 0 14px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 10;
        }

        .sidebarHeader {
          padding: 0 18px 16px;
          border-bottom: 1px solid var(--line-dim);
          margin-bottom: 14px;
        }
        .brandRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .brand {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-0);
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .brand-mark {
          color: var(--cyan);
          font-weight: 500;
        }
        .statusBadge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          color: var(--green);
          letter-spacing: 0.08em;
        }
        .statusDot {
          width: 6px; height: 6px;
          background: var(--green);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--green);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .versionLine {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-3);
          letter-spacing: 0.04em;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .versionLine .uptime {
          color: var(--cyan);
        }

        /* Menu */
        .menuGroup {
          padding: 0 10px;
          margin-bottom: 4px;
        }
        .groupLabel {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          color: var(--text-4);
          letter-spacing: 0.15em;
          padding: 10px 12px 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .groupLabel::before {
          content: '';
          width: 12px;
          height: 1px;
          background: var(--line);
        }

        .menuItem {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-2);
          margin-bottom: 1px;
          transition: all 0.18s ease;
          position: relative;
          font-family: var(--font-sans);
        }
        .menuItem:hover {
          background: var(--bg-3);
          color: var(--text-0);
        }
        .menuItem.active {
          background: linear-gradient(90deg, var(--cyan-dim) 0%, transparent 100%);
          color: var(--cyan);
        }
        .menuItem.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 2px;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
          border-radius: 0 2px 2px 0;
        }
        .menuIcon {
          font-size: 14px;
          width: 14px;
          text-align: center;
          color: var(--text-3);
          flex-shrink: 0;
        }
        .menuItem.active .menuIcon {
          color: var(--cyan);
        }
        .menuLabelBlock {
          flex: 1;
          min-width: 0;
        }
        .menuCode {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-4);
          letter-spacing: 0.06em;
          display: block;
          line-height: 1.3;
        }
        .menuLabel {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.2;
        }
        .menuBadge {
          font-family: var(--font-mono);
          font-size: 8.5px;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 3px;
          background: var(--pink-dim);
          color: var(--pink);
          letter-spacing: 0.08em;
          border: 1px solid rgba(236,72,153,0.3);
        }

        .spacer { flex: 1; min-height: 10px; }

        /* Live counter card */
        .metricCard {
          margin: 8px 10px;
          padding: 12px 14px;
          background: linear-gradient(180deg, var(--bg-2) 0%, var(--bg-1) 100%);
          border: 1px solid var(--line);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .metricCard::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          opacity: 0.6;
        }
        .metricTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .metricLabel {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          color: var(--text-3);
          letter-spacing: 0.1em;
        }
        .metricDot {
          width: 6px; height: 6px;
          background: var(--cyan);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--cyan);
          animation: pulse 1.5s ease-in-out infinite;
        }
        .metricValue {
          font-family: var(--font-mono);
          font-size: 22px;
          font-weight: 600;
          color: var(--text-0);
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 4px;
          font-feature-settings: 'tnum';
        }
        .metricSub {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--text-3);
          letter-spacing: 0.04em;
        }

        .sidebarAd {
          margin: 8px 10px;
        }

        .sidebarFooter {
          padding: 12px 18px 0;
          border-top: 1px solid var(--line-dim);
        }
        .footerLabel {
          font-family: var(--font-mono);
          font-size: 8.5px;
          font-weight: 600;
          color: var(--text-4);
          letter-spacing: 0.15em;
          margin-bottom: 7px;
        }
        .techStack {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .techBadge {
          padding: 3px 6px;
          background: var(--bg-3);
          border: 1px solid var(--line);
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 500;
          color: var(--text-2);
          letter-spacing: 0.02em;
        }

        /* ============ MAIN ============ */
        .main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .topBar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--line-dim);
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 48px;
        }

        .hamburger {
          display: none;
          width: 32px; height: 32px;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-1);
          font-size: 14px;
          align-items: center;
          justify-content: center;
        }
        .hamburger:hover { background: var(--bg-3); }

        /* Transmission bar */
        .transmissionBar {
          flex: 1;
          max-width: 760px;
          padding: 7px 14px;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          position: relative;
        }
        .transmissionBar::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
        }
        .txCode {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          color: var(--cyan);
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }
        .txText {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          animation: txFade 0.5s ease;
          letter-spacing: 0.02em;
        }
        @keyframes txFade {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .txBadge {
          font-family: var(--font-mono);
          font-size: 8.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          border: 1px solid currentColor;
        }
        .tx-critical { color: var(--pink); background: var(--pink-dim); }
        .tx-info { color: var(--cyan); background: var(--cyan-dim); }
        .tx-alert { color: var(--amber); background: rgba(251,191,36,0.15); }
        .tx-new { color: var(--green); background: var(--green-dim); }

        .topRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .userSlot {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 14px 4px 4px;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .userSlot:hover {
          border-color: var(--cyan);
        }
        .userAvatar {
          width: 26px; height: 26px;
          border-radius: 4px;
          background: linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%);
          color: var(--bg-0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 10.5px;
          letter-spacing: 0;
        }
        .userInfo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .userId {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-1);
          line-height: 1.1;
          letter-spacing: 0.02em;
        }
        .userRole {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-3);
          letter-spacing: 0.08em;
          margin-top: 1px;
        }

        .mainContent { flex: 1; position: relative; }

        /* ============ FOOTER ============ */
        .footer {
          background: var(--bg-1);
          border-top: 1px solid var(--line-dim);
          padding: 40px 28px 24px;
          margin-top: 60px;
          position: relative;
        }
        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan) 30%, var(--violet) 70%, transparent);
          opacity: 0.4;
        }
        .footerInner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .footerGrid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 28px;
        }
        .fBrand {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-0);
          letter-spacing: -0.025em;
          margin-bottom: 8px;
          display: inline-flex;
        }
        .fBrand-mark { color: var(--cyan); }
        .fTag {
          font-size: 12px;
          color: var(--text-3);
          line-height: 1.65;
          margin-bottom: 14px;
          max-width: 320px;
        }
        .fCompany {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-4);
          line-height: 1.8;
          letter-spacing: 0.02em;
        }
        .footerCol h4 {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--text-3);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footerCol h4::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--line-dim);
        }
        .footerCol ul { list-style: none; padding: 0; }
        .footerCol li { margin-bottom: 8px; }
        .fLink {
          font-size: 12.5px;
          color: var(--text-2);
          transition: all 0.15s;
          display: inline-block;
        }
        .fLink:hover {
          color: var(--cyan);
          transform: translateX(2px);
        }
        .footerBottom {
          padding-top: 20px;
          border-top: 1px solid var(--line-dim);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .fCopy {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-4);
          letter-spacing: 0.04em;
        }
        .fLegal {
          display: flex;
          gap: 18px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.04em;
        }
        .fLegal a {
          color: var(--text-3);
          transition: color 0.15s;
        }
        .fLegal a:hover { color: var(--cyan); }

        /* Mobile */
        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: 0; top: 0;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
            box-shadow: 0 0 40px rgba(0,0,0,0.5);
          }
          .sidebarOpen { transform: translateX(0); }
          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(4px);
            z-index: 99;
            animation: fadeIn 0.2s;
          }
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          .hamburger { display: flex; }
          .topBar { padding: 10px 14px; }
          .transmissionBar { padding: 6px 12px; gap: 8px; }
          .txCode { display: none; }
          .userInfo { display: none; }
          .userSlot { padding: 4px; }

          .footerGrid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer { padding: 32px 20px 20px; }
          .footerBottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 520px) {
          .footerGrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app">
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ========== SIDEBAR ========== */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebarOpen' : ''}`}>
          <div className="sidebarHeader">
            <div className="brandRow">
              <Link href="/" className="brand">
                Algo<span className="brand-mark">Maker</span>
              </Link>
              <span className="statusBadge">
                <span className="statusDot" />
                ONLINE
              </span>
            </div>
            <div className="versionLine">
              <span>v0.9.2 · neural</span>
              <span className="uptime">{formatUptime(uptime)}</span>
            </div>
          </div>

          <div className="menuGroup">
            <div className="groupLabel">NAVIGATION</div>
            {mainMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <div className="menuLabelBlock">
                  <span className="menuCode">{m.code}</span>
                  <span className="menuLabel">{m.labelKr}</span>
                </div>
                {m.badge && <span className="menuBadge">{m.badge}</span>}
              </div>
            ))}
          </div>

          <div className="menuGroup">
            <div className="groupLabel">INFO</div>
            {infoMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <div className="menuLabelBlock">
                  <span className="menuCode">{m.code}</span>
                  <span className="menuLabel">{m.labelKr}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="spacer" />

          <div className="metricCard">
            <div className="metricTop">
              <span className="metricLabel">TODAY · GEN.COUNT</span>
              <span className="metricDot" />
            </div>
            <div className="metricValue">{todayCount.toLocaleString()}</div>
            <div className="metricSub">videos generated · 24h</div>
          </div>

          <div className="sidebarAd">
            <AdSlot slot="sidebar" variant="sidebar-card" />
          </div>

          <div className="sidebarFooter">
            <div className="footerLabel">▸ POWERED_BY</div>
            <div className="techStack">
              <span className="techBadge">Gemini</span>
              <span className="techBadge">Edge</span>
              <span className="techBadge">Pexels</span>
            </div>
          </div>
        </aside>

        {/* ========== MAIN ========== */}
        <main className="main">
          <div className="topBar">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>

            <div className="transmissionBar" key={transmissionIdx}>
              <span className="txCode">{currentTransmission.code}</span>
              <span className="txText">{currentTransmission.text}</span>
              <span className={`txBadge tx-${currentTransmission.tone}`}>
                {currentTransmission.tone.toUpperCase()}
              </span>
            </div>

            <div className="topRight">
              <div className="userSlot">
                <div className="userAvatar">YJ</div>
                <div className="userInfo">
                  <span className="userId">user.parkyj</span>
                  <span className="userRole">CREATOR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mainContent">
            {children}
          </div>

          {/* ========== FOOTER ========== */}
          <footer className="footer">
            <div className="footerInner">
              <div className="footerGrid">
                <div>
                  <div className="fBrand">
                    Algo<span className="fBrand-mark">Maker</span>
                  </div>
                  <div className="fTag">
                    AI 뉴럴 네트워크 기반의 한국어 특화 YouTube 자동 생성 스튜디오.
                    크리에이터의 초기 진입 비용을 0으로 만듭니다.
                  </div>
                  <div className="fCompany">
                    한줄컴퍼니 · 대표 박예준<br />
                    서비스: AlgoMaker
                  </div>
                </div>

                <div className="footerCol">
                  <h4>PRODUCT</h4>
                  <ul>
                    <li><Link href="/" className="fLink">홈</Link></li>
                    <li><Link href="/analytics" className="fLink">경쟁 분석</Link></li>
                    <li><Link href="/assets" className="fLink">내 영상</Link></li>
                    <li><Link href="/blog" className="fLink">블로그</Link></li>
                  </ul>
                </div>

                <div className="footerCol">
                  <h4>COMPANY</h4>
                  <ul>
                    <li><Link href="/about" className="fLink">소개</Link></li>
                    <li><Link href="/contact" className="fLink">문의</Link></li>
                    <li><Link href="/blog" className="fLink">인사이트</Link></li>
                  </ul>
                </div>

                <div className="footerCol">
                  <h4>LEGAL</h4>
                  <ul>
                    <li><Link href="/privacy" className="fLink">개인정보 처리방침</Link></li>
                    <li><Link href="/terms" className="fLink">이용약관</Link></li>
                    <li><Link href="/contact" className="fLink">저작권</Link></li>
                  </ul>
                </div>
              </div>

              <div className="footerBottom">
                <div className="fCopy">
                  © {currentYear} 한줄컴퍼니 · AlgoMaker™ · ALL_RIGHTS_RESERVED
                </div>
                <div className="fLegal">
                  <Link href="/privacy">PRIVACY</Link>
                  <Link href="/terms">TERMS</Link>
                  <Link href="/contact">CONTACT</Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
