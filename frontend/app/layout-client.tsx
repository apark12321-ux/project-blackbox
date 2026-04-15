"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_TABS: { key: ActivePage; label: string; minStep: number }[] = [
  { key: "curation", label: "큐레이션", minStep: 0 },
  { key: "script",   label: "스크립트", minStep: 3 },
  { key: "video",    label: "영상 제작", minStep: 4 },
  { key: "deploy",   label: "검수·배포", minStep: 5 },
];

const SIDEBAR_STEPS = [
  { key: "curation" as const, label: "뉴스 큐레이션", n: 1, cost: "FREE",  icon: "◈", minStep: 0 },
  { key: "script"   as const, label: "AI 스크립트",   n: 2, cost: "0.2",   icon: "◆", minStep: 3 },
  { key: "video"    as const, label: "영상 제작",     n: 3, cost: "2.5",   icon: "▶", minStep: 4 },
  { key: "deploy"   as const, label: "검수 & 배포",   n: 4, cost: "0.1",   icon: "◉", minStep: 5 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset, profile, setProfile } = useBlackboxStore();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const isDone = (k: string) =>
    (k==="curation"&&step>=3)||(k==="script"&&step>=4)||(k==="video"&&step>=5)||(k==="deploy"&&step>=6);

  if (isLanding) return <>{children}</>;

  return (
    <div className="flex flex-col h-[100dvh]" style={{background:"#0d0c0a"}}>

      {/* ═══ TOP NAVIGATION BAR ═══ */}
      <header style={{background:"#0d0c0a",borderBottom:"1px solid rgba(255,255,255,0.07)"}}
        className="shrink-0 h-[52px] flex items-center px-4 md:px-6 gap-0">

        {/* Logo */}
        <Link href="/" onClick={reset} className="flex items-center gap-2 mr-6 md:mr-8 shrink-0 group">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[11px] md:text-[12px] font-black text-white transition-transform group-hover:scale-105"
            style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 2px 12px rgba(196,154,26,0.30)"}}>
            AM
          </div>
          <span className="hidden md:block text-[14px] font-black tracking-tight" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            <span className="text-white/85">Algo</span><span style={{color:"#e8c84a"}}>Maker</span>
          </span>
        </Link>

        {/* Nav Tabs */}
        <nav className="flex items-center flex-1 min-w-0">
          {NAV_TABS.map(tab => {
            const active = activePage === tab.key;
            const ok = step >= tab.minStep;
            const done = isDone(tab.key);
            return (
              <button key={tab.key}
                onClick={() => ok && setActivePage(tab.key)}
                disabled={!ok}
                className="h-[52px] px-3 md:px-5 text-[12px] md:text-[13px] font-bold transition-all relative shrink-0"
                style={{
                  color: active ? "rgba(255,255,255,0.92)" : ok ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.18)",
                  borderBottom: active ? "2px solid #e8c84a" : "2px solid transparent",
                  cursor: ok ? "pointer" : "not-allowed",
                }}>
                {tab.label}
                {done && !active && (
                  <span className="ml-1 text-[9px] text-[#34d399]">✓</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mode Toggle */}
          <div className="flex rounded-lg overflow-hidden"
            style={{border:"1px solid rgba(255,255,255,0.10)"}}>
            {["normal","senior"].map(m => (
              <button key={m} onClick={() => setMode(m as "normal"|"senior")}
                className="px-2.5 md:px-3 py-1.5 text-[10px] md:text-[11px] font-bold transition-all"
                style={mode===m
                  ? {background:"rgba(232,200,74,0.12)",color:"#e8c84a"}
                  : {color:"rgba(255,255,255,0.32)"}}>
                {m==="normal"?"일반":"시니어"}
              </button>
            ))}
          </div>

          {/* Channel / Settings */}
          <button onClick={() => setShowSettings(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-white/[0.05]"
            style={{border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.45)"}}>
            <span>채널</span>
            <span className="font-bold" style={{color:"#e8c84a"}}>{profile.channelName||"미설정"}</span>
          </button>
          <button onClick={() => setShowSettings(true)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[14px] transition-all hover:bg-white/[0.05]"
            style={{color:"rgba(255,255,255,0.40)"}}>⚙</button>
        </div>
      </header>

      {/* ═══ BODY ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className="hidden md:flex w-[176px] lg:w-[192px] shrink-0 flex-col py-5"
          style={{background:"#0d0c0a",borderRight:"1px solid rgba(255,255,255,0.07)"}}>

          <div className="px-4 mb-3">
            <div className="text-[9px] font-black tracking-widest uppercase" style={{color:"rgba(255,255,255,0.22)"}}>PIPELINE</div>
          </div>

          <div className="flex-1 px-2 space-y-0.5">
            {SIDEBAR_STEPS.map(s => {
              const active = activePage === s.key;
              const done = isDone(s.key);
              const ok = step >= s.minStep;
              return (
                <button key={s.key}
                  onClick={() => ok && setActivePage(s.key)}
                  disabled={!ok}
                  className="w-full text-left rounded-xl transition-all flex items-center gap-3 px-3 py-3"
                  style={{
                    background: active ? "rgba(232,200,74,0.07)" : "transparent",
                    borderLeft: active ? "2px solid #e8c84a" : "2px solid transparent",
                    opacity: ok ? 1 : 0.25,
                    cursor: ok ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={e => { if (ok && !active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>

                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{
                      background: active ? "rgba(232,200,74,0.15)" : done && !active ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                      color: active ? "#e8c84a" : done && !active ? "#34d399" : "rgba(255,255,255,0.35)",
                    }}>
                    {done && !active ? "✓" : s.n}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold truncate"
                      style={{color: active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.42)"}}>
                      {s.label}
                    </div>
                    <div className="text-[9px] font-bold mt-0.5"
                      style={{color: active ? "rgba(232,200,74,0.55)" : "rgba(255,255,255,0.18)"}}>
                      Step {s.n} · {s.cost}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="px-3 mt-2 pt-3 space-y-1" style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="px-1 py-1.5 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{background:"#34d399",boxShadow:"0 0 6px rgba(52,211,153,0.5)"}}/>
              <span className="text-[10px]" style={{color:"rgba(255,255,255,0.28)"}}>서버 연결됨</span>
            </div>
            <button onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/[0.04]"
              style={{color:"rgba(255,255,255,0.25)"}}>
              <span className="text-[13px]">⚙</span>
              <span className="text-[11px]">설정</span>
            </button>
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="md:hidden flex items-center justify-around shrink-0 safe-bottom"
        style={{background:"#0d0c0a",borderTop:"1px solid rgba(255,255,255,0.07)",height:"54px"}}>
        {NAV_TABS.map(tab => {
          const active = activePage === tab.key;
          const ok = step >= tab.minStep;
          const done = isDone(tab.key);
          return (
            <button key={tab.key}
              onClick={() => ok && setActivePage(tab.key)}
              disabled={!ok}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 ${!ok?"opacity-20":""}`}>
              <span className="text-[9px] font-black" style={{
                color: active ? "#e8c84a" : done ? "#34d399" : "rgba(255,255,255,0.28)"
              }}>
                {active ? "●" : done ? "✓" : "○"}
              </span>
              <span className="text-[10px] font-bold" style={{color: active ? "#e8c84a" : "rgba(255,255,255,0.30)"}}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ═══ SETTINGS MODAL ═══ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowSettings(false)}
          style={{background:"rgba(0,0,0,0.65)"}}>
          <div onClick={e => e.stopPropagation()}
            className="w-full md:w-[440px] max-h-[88vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-5 md:p-6 space-y-4 shadow-2xl"
            style={{background:"#161510",border:"1px solid rgba(255,255,255,0.09)"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-extrabold" style={{color:"rgba(255,255,255,0.90)"}}>채널 설정</h2>
              <button onClick={() => setShowSettings(false)}
                className="text-[18px] transition-all hover:text-white/60" style={{color:"rgba(255,255,255,0.28)"}}>✕</button>
            </div>
            {[
              {label:"채널 이름 *",key:"channelName" as const,ph:"예: 돈이 보이는 경제"},
              {label:"인트로 멘트",key:"introText" as const,ph:"안녕하세요, 오늘도 핵심만 짚어드리겠습니다."},
              {label:"아웃트로 멘트",key:"outroText" as const,ph:"다음 영상에서 더 유익한 정보로 찾아뵙겠습니다."},
              {label:"워터마크",key:"watermarkText" as const,ph:"비우면 채널명 사용"},
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] font-bold block mb-1.5" style={{color:"rgba(255,255,255,0.40)"}}>
                  {f.label}
                </label>
                <input value={profile[f.key]} onChange={e => setProfile({[f.key]: e.target.value})}
                  placeholder={f.ph}
                  className="w-full px-3 py-2.5 rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[#e8c84a]/30 placeholder:opacity-25"
                  style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.80)"}}/>
              </div>
            ))}
            <button onClick={() => setShowSettings(false)}
              className="w-full py-3 rounded-xl text-[14px] font-bold text-white"
              style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
