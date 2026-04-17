"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV: { key: ActivePage; icon: string; label: string; sub: string; min: number; color: string }[] = [
  { key: "curation", icon: "🔍", label: "큐레이션", sub: "키워드·뉴스", min: 0, color: "#3b82f6" },
  { key: "script", icon: "✍️", label: "스크립트", sub: "AI 대본", min: 3, color: "#d4a537" },
  { key: "video", icon: "🎬", label: "영상 제작", sub: "합성·렌더링", min: 4, color: "#ef4444" },
  { key: "deploy", icon: "🛡️", label: "검수·배포", sub: "수익화 검증", min: 5, color: "#10b981" },
];

// 자체 앱바를 가진 페이지들은 사이드바 · 탑바를 안 씌움
const STANDALONE_PATHS = ["/", "/keyword", "/news", "/plan", "/script", "/studio", "/publish", "/done"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset, profile, setProfile } = useBlackboxStore();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  if (STANDALONE_PATHS.includes(pathname)) return <>{children}</>;

  const isDone = (k: string) =>
    (k==="curation"&&step>=3)||(k==="script"&&step>=4)||(k==="video"&&step>=5)||(k==="deploy"&&step>=6);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh]">

      {/* ═══ PC Sidebar ═══ */}
      <nav className="hidden md:flex w-[240px] lg:w-[260px] shrink-0 flex-col py-6 sidebar" style={{borderRight:"1px solid rgba(255,255,255,0.06)"}}>
        <Link href="/" onClick={reset} className="flex items-center gap-3 px-6 mb-8 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[16px] font-black text-white transition-transform group-hover:scale-105"
            style={{background:"linear-gradient(135deg,#b38600,#d4a537)",boxShadow:"0 6px 24px rgba(179,134,0,0.35)"}}>AM</div>
          <div>
            <div className="text-[20px] font-extrabold tracking-tight">
              <span className="text-white">Algo</span><span className="text-[#d4a537]">Maker</span>
            </div>
            <div className="text-[11px] text-white/30 font-medium -mt-0.5">YouTube Automation</div>
          </div>
        </Link>

        <div className="h-px mx-5 bg-white/[0.06] mb-3"/>

        <div className="flex-1 px-3 space-y-1">
          {NAV.map((item) => {
            const active = activePage === item.key;
            const ok = step >= item.min;
            const done = isDone(item.key);
            return (
              <button key={item.key} onClick={() => ok && setActivePage(item.key)} disabled={!ok}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all relative
                  ${active?"text-white":"text-white/35 hover:text-white/55 hover:bg-white/[0.03]"}
                  ${!ok?"opacity-15 cursor-not-allowed":"cursor-pointer"}`}
                style={active?{background:`${item.color}15`}:{}}>
                {active&&<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r" style={{background:item.color}}/>}
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-[18px] shrink-0 ${done&&!active?"bg-[#10b981]":""}`}
                  style={active?{background:item.color}:done?{}:{background:"rgba(255,255,255,0.06)"}}>
                  {done&&!active?"✓":item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[15px] font-bold ${active?"text-white":"text-white/50"}`}>{item.label}</div>
                  <div className="text-[11px] text-white/20">{item.sub}</div>
                </div>
                {active&&<div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:item.color}}/>}
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-4 space-y-2">
          <div className="mx-2 h-px bg-white/[0.06]"/>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" style={{boxShadow:"0 0 6px rgba(16,185,129,0.4)"}}/>
            <span className="text-[12px] text-white/25">서버 연결됨</span>
          </div>
          <button onClick={()=>setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/20 hover:text-white/35 hover:bg-white/[0.03] transition-all text-[13px]">
            ⚙ 설정
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-12 md:h-14 flex items-center px-4 md:px-6 gap-3 shrink-0 glass">
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white" style={{background:"linear-gradient(135deg,#b38600,#d4a537)"}}>AM</div>
            <span className="text-[16px] font-extrabold tracking-tight">
              <span className="text-[#fafafa]">Algo</span><span className="text-[#d4a537]">Maker</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-[18px] font-extrabold text-[#fafafa]">
              {activePage==="curation"?"뉴스 큐레이션":activePage==="script"?"AI 스크립트":activePage==="video"?"영상 제작":"검수 & 배포"}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-center md:justify-start md:ml-4">
            {NAV.map((n,i)=>{
              const active=activePage===n.key;
              const done=isDone(n.key);
              return(
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${active?"scale-125":""}`}
                    style={{background:active?n.color:done?"#10b981":"#3a3a42"}}/>
                  {i<NAV.length-1&&<div className="hidden md:block w-8 h-px" style={{background:done?"#10b981":"rgba(255,255,255,0.06)"}}/>}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex rounded-lg overflow-hidden border" style={{borderColor:"rgba(255,255,255,0.08)"}}>
              <button onClick={()=>setMode("normal")}
                className={`px-3 py-1.5 text-[13px] font-bold transition ${mode==="normal"?"text-[#d4a537] bg-[rgba(212,165,55,0.1)]":"text-[#52525b]"}`}>일반</button>
              <button onClick={()=>setMode("senior")}
                className={`px-3 py-1.5 text-[13px] font-bold transition ${mode==="senior"?"text-[#d4a537] bg-[rgba(212,165,55,0.1)]":"text-[#52525b]"}`}>시니어</button>
            </div>
            <button onClick={()=>setShowSettings(true)} className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#52525b] text-[16px]">⚙</button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      <nav className="md:hidden flex items-center justify-around shrink-0 sidebar safe-b" style={{borderTop:"1px solid rgba(255,255,255,0.06)",height:"56px"}}>
        {NAV.map((item)=>{
          const active=activePage===item.key;
          const ok=step>=item.min;
          const done=isDone(item.key);
          return(
            <button key={item.key} onClick={()=>ok&&setActivePage(item.key)} disabled={!ok}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 ${!ok?"opacity-15":""}`}>
              <span className={`text-[18px] ${active?"":done?"":"opacity-40"}`}>
                {done&&!active?"✓":item.icon}
              </span>
              <span className={`text-[10px] font-bold ${active?"text-[#d4a537]":"text-white/25"}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showSettings&&(
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={()=>setShowSettings(false)}>
          <div className="absolute inset-0 bg-black/60 ani-in"/>
          <div className="relative w-full md:w-[420px] bg-[#1a1b20] rounded-t-2xl md:rounded-2xl p-6 max-h-[70vh] overflow-y-auto ani-up" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#fafafa]">설정</h3>
              <button onClick={()=>setShowSettings(false)} className="text-[20px] text-[#52525b] hover:text-[#fafafa]">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-bold text-[#71717a] mb-1.5 block">채널 이름</label>
                <input value={profile.channelName} onChange={e=>setProfile({...profile,channelName:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-lg text-[15px]" placeholder="채널 이름"/>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#71717a] mb-1.5 block">타겟 모드</label>
                <div className="flex gap-2">
                  <button onClick={()=>setMode("normal")} className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold border transition ${mode==="normal"?"border-[#d4a537] text-[#d4a537] bg-[rgba(212,165,55,0.08)]":"border-[rgba(255,255,255,0.08)] text-[#52525b]"}`}>일반</button>
                  <button onClick={()=>setMode("senior")} className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold border transition ${mode==="senior"?"border-[#d4a537] text-[#d4a537] bg-[rgba(212,165,55,0.08)]":"border-[rgba(255,255,255,0.08)] text-[#52525b]"}`}>시니어</button>
                </div>
              </div>
              <button onClick={()=>{reset();setShowSettings(false);}}
                className="w-full py-2.5 rounded-lg text-[14px] font-bold text-[#ef4444] border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.05)] transition">
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
