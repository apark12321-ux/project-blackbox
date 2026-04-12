"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";

const NAV: { key: ActivePage; icon: string; label: string; min: number }[] = [
  { key: "curation", icon: "◈", label: "큐레이션", min: 0 },
  { key: "script", icon: "◆", label: "스크립트", min: 3 },
  { key: "video", icon: "▶", label: "영상편집", min: 4 },
  { key: "deploy", icon: "◉", label: "실드&배포", min: 5 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset } = useBlackboxStore();

  return (
    <div className="flex h-screen text-white" style={{ background: "var(--bg-primary)" }}>
      {/* ═══ Sidebar ═══ */}
      <nav className="w-[100px] shrink-0 flex flex-col items-center border-r py-6 gap-3"
        style={{ borderColor: "var(--border)", background: "linear-gradient(180deg,#0a0c14,#080a10)" }}>
        <Link href="/" onClick={reset}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-[16px] font-black mb-6"
          style={{ background: "linear-gradient(135deg,#d4af37,#b8941e)", color: "#09090b", boxShadow: "0 4px 20px rgba(212,175,55,0.3)" }}>
          PB
        </Link>

        {NAV.map((item) => {
          const active = activePage === item.key;
          const ok = step >= item.min;
          const done = (item.key==="curation"&&step>=3)||(item.key==="script"&&step>=4)||(item.key==="video"&&step>=5);
          return (
            <button key={item.key} onClick={() => ok && setActivePage(item.key)} disabled={!ok} title={item.label}
              className={`w-[80px] h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 relative
                ${!ok?"opacity-15 cursor-not-allowed":"cursor-pointer"}
                ${active?"":"ok"?"hover:bg-white/[0.04]":""}`}
              style={active?{background:"linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.06))",boxShadow:"0 0 16px rgba(212,175,55,0.1)"}:{}}>
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r" style={{background:"linear-gradient(180deg,#d4af37,#f0d060)"}} />}
              <span className={`text-[20px] ${active?"text-[#d4af37]":done?"text-[#34d399]":"text-white/25"}`}>{done&&!active?"✓":item.icon}</span>
              <span className={`text-[11px] font-bold ${active?"text-[#d4af37]":"text-white/20"}`}>{item.label}</span>
            </button>
          );
        })}

        <div className="mt-auto flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:bg-white/[0.04] cursor-pointer text-[16px]">⚙</div>
          <div className="w-3 h-3 rounded-full bg-[#34d399]" style={{boxShadow:"0 0 8px rgba(52,211,153,0.4)"}} />
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b flex items-center px-7 gap-5 shrink-0 glass"
          style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-extrabold tracking-wide text-white/80" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>PROJECT</span>
            <span className="text-[15px] font-extrabold tracking-widest"
              style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"linear-gradient(90deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>BLACKBOX</span>
          </div>
          <div className="h-5 w-px bg-white/[0.06] mx-1" />
          <h1 className="text-[15px] font-bold text-white/55">
            {activePage==="curation"&&"모듈 A: 지능형 큐레이션 (기획 단계)"}
            {activePage==="script"&&"모듈 B: AI 스크립트 엔진"}
            {activePage==="video"&&"모듈 B2: AI 영상 제작"}
            {activePage==="deploy"&&"모듈 C+D: 실드 & 배포"}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex rounded-xl overflow-hidden border" style={{borderColor:"var(--border)"}}>
              <button onClick={()=>setMode("normal")} className={`px-4 py-1.5 text-[13px] font-bold ${mode==="normal"?"text-[#d4af37]":"text-white/20"}`} style={mode==="normal"?{background:"rgba(212,175,55,0.12)"}:{}}>일반</button>
              <button onClick={()=>setMode("senior")} className={`px-4 py-1.5 text-[13px] font-bold ${mode==="senior"?"text-[#d4af37]":"text-white/20"}`} style={mode==="senior"?{background:"rgba(212,175,55,0.12)"}:{}}>시니어</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[13px] text-white/30" style={{borderColor:"var(--border)"}}>
              <span>👤</span> 관리자 &apos;User 2026&apos;님
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
