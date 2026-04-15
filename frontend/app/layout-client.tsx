"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV: { key: ActivePage; icon: string; label: string; sub: string; min: number; color: string }[] = [
  { key: "curation", icon: "🔍", label: "큐레이션", sub: "키워드·뉴스", min: 0, color: "#3b82f6" },
  { key: "script", icon: "✍️", label: "스크립트", sub: "AI 대본", min: 3, color: "#b38600" },
  { key: "video", icon: "🎬", label: "영상 제작", sub: "합성·렌더링", min: 4, color: "#ef4444" },
  { key: "deploy", icon: "🛡️", label: "검수·배포", sub: "수익화 검증", min: 5, color: "#10b981" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset, profile, setProfile } = useBlackboxStore();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;

  const isDone = (k: string) =>
    (k==="curation"&&step>=3)||(k==="script"&&step>=4)||(k==="video"&&step>=5)||(k==="deploy"&&step>=6);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh]">

      {/* ═══ PC Sidebar ═══ */}
      <nav className="hidden md:flex w-[240px] shrink-0 flex-col sidebar" style={{borderRight:"1px solid rgba(255,255,255,0.06)"}}>
        {/* Logo */}
        <Link href="/" onClick={reset} className="flex items-center gap-3 px-5 py-5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] font-black text-white transition-transform group-hover:scale-105"
            style={{background:"linear-gradient(135deg,#b38600,#d4a537)",boxShadow:"0 4px 16px rgba(179,134,0,0.3)"}}>AM</div>
          <div>
            <div className="text-[15px] font-extrabold tracking-tight">
              <span className="text-white/90">Algo</span><span className="text-[#d4a537]">Maker</span>
            </div>
            <div className="text-[15px] text-white/25 -mt-0.5">YouTube Automation</div>
          </div>
        </Link>

        <div className="h-px mx-4 bg-[#1a1b20]/[0.06] mb-2"/>

        {/* Nav */}
        <div className="flex-1 px-3 space-y-1">
          {NAV.map((item) => {
            const active = activePage === item.key;
            const ok = step >= item.min;
            const done = isDone(item.key);
            return (
              <button key={item.key} onClick={() => ok && setActivePage(item.key)} disabled={!ok}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all relative
                  ${active?"text-white":"text-white/35 hover:text-white/55 hover:bg-[#1a1b20]/[0.03]"}
                  ${!ok?"opacity-15 cursor-not-allowed":"cursor-pointer"}`}
                style={active?{background:`${item.color}15`}:{}}>
                {active&&<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r" style={{background:item.color}}/>}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 ${done&&!active?"bg-[#10b981]":""}`}
                  style={active?{background:item.color}:done?{}:{background:"rgba(255,255,255,0.06)"}}>
                  {done&&!active?"✓":item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[15px] font-bold ${active?"text-white":"text-white/45"}`}>{item.label}</div>
                  <div className="text-[15px] text-white/20">{item.sub}</div>
                </div>
                {active&&<div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:item.color}}/>}
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-2">
          <div className="mx-2 h-px bg-[#1a1b20]/[0.06]"/>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" style={{boxShadow:"0 0 6px rgba(16,185,129,0.4)"}}/>
            <span className="text-[15px] text-white/25">서버 연결됨</span>
          </div>
          <button onClick={()=>setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/20 hover:text-white/35 hover:bg-[#1a1b20]/[0.03] transition-all text-[15px]">
            ⚙ 설정
          </button>
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-12 md:h-14 border-b flex items-center px-4 md:px-6 gap-3 shrink-0 glass" style={{borderColor:"rgba(255,255,255,0.06)"}}>
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[15px] font-black text-white" style={{background:"linear-gradient(135deg,#b38600,#d4a537)"}}>AM</div>
          </div>

          {/* PC: Page title */}
          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-[16px] font-extrabold text-[#e8e8ec]">
              {activePage==="curation"?"뉴스 큐레이션":activePage==="script"?"AI 스크립트":activePage==="video"?"영상 제작":"검수 & 배포"}
            </h1>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 flex-1 justify-center md:justify-start md:ml-4">
            {NAV.map((n,i)=>{
              const active=activePage===n.key;
              const done=isDone(n.key);
              return(
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full transition-all ${active?"scale-125":""}`}
                    style={{background:active?n.color:done?"#10b981":"#d1d5db"}}/>
                  {i<NAV.length-1&&<div className="hidden md:block w-8 h-px" style={{background:done?"#10b981":"#e5e7eb"}}/>}
                </div>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex rounded-lg overflow-hidden border" style={{borderColor:"rgba(255,255,255,0.06)"}}>
              <button onClick={()=>setMode("normal")}
                className={`px-2.5 py-1 text-[15px] font-bold transition ${mode==="normal"?"text-[#b38600] bg-[rgba(212,165,55,0.1)]":"text-[#5a5a64]"}`}>일반</button>
              <button onClick={()=>setMode("senior")}
                className={`px-2.5 py-1 text-[15px] font-bold transition ${mode==="senior"?"text-[#b38600] bg-[rgba(212,165,55,0.1)]":"text-[#5a5a64]"}`}>시니어</button>
            </div>
            <button onClick={()=>setShowSettings(true)} className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#5a5a64] text-[15px]">⚙</button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* ═══ Mobile Bottom Tab ═══ */}
      <nav className="md:hidden flex items-center justify-around shrink-0 sidebar safe-b" style={{borderTop:"1px solid rgba(255,255,255,0.06)",height:"56px"}}>
        {NAV.map((item)=>{
          const active=activePage===item.key;
          const ok=step>=item.min;
          const done=isDone(item.key);
          return(
            <button key={item.key} onClick={()=>ok&&setActivePage(item.key)} disabled={!ok}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 ${!ok?"opacity-15":""}`}>
              <span className={`text-[16px] ${active?"":done?"":"opacity-40"}`}>
                {done&&!active?"✓":item.icon}
              </span>
              <span className={`text-[15px] font-bold ${active?"text-[#d4a537]":"text-white/25"}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ═══ Settings Modal ═══ */}
      {showSettings&&(
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={()=>setShowSettings(false)}>
          <div className="absolute inset-0 bg-black/60 ani-in"/>
          <div className="relative w-full md:w-[420px] bg-[#1a1b20] rounded-t-2xl md:rounded-2xl p-6 max-h-[70vh] overflow-y-auto ani-up" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold">설정</h3>
              <button onClick={()=>setShowSettings(false)} className="text-[18px] text-[#5a5a64] hover:text-[#e8e8ec]">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[15px] font-bold text-[#808088] mb-1.5 block">채널 이름</label>
                <input value={profile.channelName} onChange={e=>setProfile({...profile,channelName:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-lg border text-[15px]" style={{borderColor:"rgba(255,255,255,0.06)"}} placeholder="채널 이름"/>
              </div>
              <div>
                <label className="text-[15px] font-bold text-[#808088] mb-1.5 block">타겟 모드</label>
                <div className="flex gap-2">
                  <button onClick={()=>setMode("normal")} className={`flex-1 py-2.5 rounded-lg text-[15px] font-bold border transition ${mode==="normal"?"border-[#b38600] text-[#b38600] bg-[rgba(212,165,55,0.1)]":"border-[rgba(255,255,255,0.06)] text-[#5a5a64]"}`}>일반</button>
                  <button onClick={()=>setMode("senior")} className={`flex-1 py-2.5 rounded-lg text-[15px] font-bold border transition ${mode==="senior"?"border-[#b38600] text-[#b38600] bg-[rgba(212,165,55,0.1)]":"border-[rgba(255,255,255,0.06)] text-[#5a5a64]"}`}>시니어</button>
                </div>
              </div>
              <button onClick={()=>{reset();setShowSettings(false);}}
                className="w-full py-2.5 rounded-lg text-[15px] font-bold text-[#ef4444] border border-[#fee2e2] hover:bg-[#fef2f2] transition">
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
