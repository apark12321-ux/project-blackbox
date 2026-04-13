"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV: { key: ActivePage; icon: string; label: string; min: number }[] = [
  { key: "curation", icon: "◈", label: "큐레이션", min: 0 },
  { key: "script", icon: "◆", label: "스크립트", min: 3 },
  { key: "video", icon: "▶", label: "영상", min: 4 },
  { key: "deploy", icon: "◉", label: "배포", min: 5 },
];

const STEPS = [
  { key: "curation" as const, n: 1, color: "#6366f1" },
  { key: "script" as const, n: 2, color: "#c49a1a" },
  { key: "video" as const, n: 3, color: "#0ea5e9" },
  { key: "deploy" as const, n: 4, color: "#22c55e" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset, profile, setProfile } = useBlackboxStore();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const isDone = (k: string) =>
    (k==="curation"&&step>=3)||(k==="script"&&step>=4)||(k==="video"&&step>=5)||(k==="deploy"&&step>=6);

  // Landing page — no sidebar/header
  if (isLanding) return <>{children}</>;

  return (
    <div className="flex flex-col md:flex-row h-[100dvh]">

      {/* ═══ Desktop Sidebar ═══ */}
      <nav className="hidden md:flex w-[72px] shrink-0 flex-col items-center py-4 gap-2 sidebar-dark"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" onClick={reset}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-black mb-4 text-white transition-transform hover:scale-105"
          style={{ background: "linear-gradient(135deg,#c49a1a,#e8c84a)", boxShadow: "0 4px 16px rgba(196,154,26,0.3)" }}>
          AM
        </Link>
        {NAV.map((item) => {
          const active = activePage === item.key;
          const ok = step >= item.min;
          const done = isDone(item.key);
          return (
            <button key={item.key} onClick={() => ok && setActivePage(item.key)} disabled={!ok} title={item.label}
              className={`w-[56px] h-[48px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all relative
                ${!ok?"opacity-15 cursor-not-allowed":"cursor-pointer hover:bg-white/[0.05]"}`}
              style={active?{background:"rgba(212,175,55,0.15)"}:{}}>
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-6 rounded-r" style={{background:"#d4af37"}} />}
              <span className={`text-[17px] ${active?"text-[#d4af37]":done?"text-[#34d399]":"text-white/25"}`}>{done&&!active?"✓":item.icon}</span>
              <span className={`text-[9px] font-bold ${active?"text-[#d4af37]":"text-white/20"}`}>{item.label}</span>
            </button>
          );
        })}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button onClick={() => setShowSettings(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:bg-white/[0.05] hover:text-white/40 text-[14px] transition-all">⚙</button>
          <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" style={{boxShadow:"0 0 6px rgba(52,211,153,0.4)"}} />
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="h-11 md:h-12 border-b flex items-center px-3 md:px-5 gap-2 md:gap-4 shrink-0 glass"
          style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-md flex items-center justify-center text-[10px] md:text-[11px] font-black text-white" style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>A</div>
            <span className="text-[14px] md:text-[16px] font-black tracking-tight hidden sm:inline" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              <span className="text-[#1a1d23]">Algo</span><span style={{background:"linear-gradient(90deg,#c49a1a,#e8c84a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Maker</span>
            </span>
          </div>

          {/* Step pills */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {STEPS.map((s) => {
              const active = activePage === s.key;
              const done = isDone(s.key);
              return (
                <div key={s.key} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all ${active?"":"opacity-35"}`}
                  style={active?{background:`${s.color}10`}:{}}>
                  <span className="text-[8px] md:text-[9px] font-black w-4 h-4 rounded flex items-center justify-center text-white"
                    style={{background:active?s.color:done?"#22c55e":"#d1d5db"}}>
                    {done&&!active?"✓":`${s.n}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex rounded-lg overflow-hidden border" style={{borderColor:"var(--border)"}}>
              <button onClick={()=>setMode("normal")} className={`px-2 py-0.5 text-[10px] md:text-[11px] font-bold ${mode==="normal"?"text-[#c49a1a]":"text-[#b0b5bf]"}`} style={mode==="normal"?{background:"rgba(196,154,26,0.08)"}:{}}>일반</button>
              <button onClick={()=>setMode("senior")} className={`px-2 py-0.5 text-[10px] md:text-[11px] font-bold ${mode==="senior"?"text-[#c49a1a]":"text-[#b0b5bf]"}`} style={mode==="senior"?{background:"rgba(196,154,26,0.08)"}:{}}>시니어</button>
            </div>
            <button onClick={() => setShowSettings(true)} className="md:hidden w-7 h-7 rounded-md flex items-center justify-center text-[#9ca3af]">⚙</button>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] text-[#6b7280]" style={{borderColor:"var(--border)"}}>
              <span>👤</span> {profile.channelName || "채널 미설정"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* ═══ Mobile Bottom Tab ═══ */}
      <nav className="md:hidden flex items-center justify-around shrink-0 sidebar-dark safe-bottom"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", height: "52px" }}>
        {NAV.map((item) => {
          const active = activePage === item.key;
          const ok = step >= item.min;
          const done = isDone(item.key);
          return (
            <button key={item.key} onClick={() => ok && setActivePage(item.key)} disabled={!ok}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-4 ${!ok?"opacity-20":""}`}>
              <span className={`text-[16px] ${active?"text-[#d4af37]":done?"text-[#34d399]":"text-white/30"}`}>
                {done&&!active?"✓":item.icon}
              </span>
              <span className={`text-[9px] font-bold ${active?"text-[#d4af37]":"text-white/25"}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ═══ Settings ═══ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={()=>setShowSettings(false)} style={{background:"rgba(0,0,0,0.4)"}}>
          <div onClick={e=>e.stopPropagation()} className="w-full md:w-[440px] max-h-[85vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-5 md:p-6 space-y-4 shadow-2xl anim-fade-up"
            style={{background:"var(--bg-secondary)",border:"1px solid var(--border)"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold text-[#1a1d23]">채널 설정</h2>
              <button onClick={() => setShowSettings(false)} className="text-[18px] text-[#9ca3af] hover:text-[#4b5563]">✕</button>
            </div>
            {[
              {label:"채널 이름 *",key:"channelName" as const,ph:"예: 돈이 보이는 경제"},
              {label:"인트로 멘트",key:"introText" as const,ph:"안녕하세요, 오늘도 핵심만 짚어드리겠습니다."},
              {label:"아웃트로 멘트",key:"outroText" as const,ph:"다음 영상에서 더 유익한 정보로 찾아뵙겠습니다."},
              {label:"워터마크",key:"watermarkText" as const,ph:"비우면 채널명 사용"},
            ].map(f=>(
              <div key={f.key}>
                <label className="text-[12px] font-bold text-[#6b7280] block mb-1.5">{f.label}</label>
                <input value={profile[f.key]} onChange={e => setProfile({ [f.key]: e.target.value })}
                  placeholder={f.ph}
                  className="w-full px-3 py-2.5 rounded-lg text-[14px] text-[#1a1d23] focus:outline-none focus:ring-2 focus:ring-[#c49a1a]/30"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border)"}} />
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
