"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { useState } from "react";

const NAV: { key: ActivePage; icon: string; label: string; min: number }[] = [
  { key: "curation", icon: "◈", label: "큐레이션", min: 0 },
  { key: "script", icon: "◆", label: "스크립트", min: 3 },
  { key: "video", icon: "▶", label: "영상편집", min: 4 },
  { key: "deploy", icon: "◉", label: "실드&배포", min: 5 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset, profile, setProfile } = useBlackboxStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-screen text-white" style={{ background: "var(--bg-primary)" }}>
      {/* ═══ Sidebar ═══ */}
      <nav className="w-[100px] shrink-0 flex flex-col items-center border-r py-6 gap-3 sidebar-dark"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
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
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:bg-white/[0.04] hover:text-white/40 cursor-pointer text-[16px] transition-all">⚙</button>
          <div className="w-3 h-3 rounded-full bg-[#34d399]" style={{boxShadow:"0 0 8px rgba(52,211,153,0.4)"}} />
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b flex items-center px-7 gap-5 shrink-0"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-extrabold tracking-wide text-[#1a1d23]" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Auto</span>
            <span className="text-[15px] font-extrabold tracking-widest"
              style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"linear-gradient(90deg,#c49a1a,#e8c84a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Tube</span>
          </div>
          <div className="h-5 w-px bg-white/[0.06] mx-1" />
          <h1 className="text-[15px] font-bold text-[#4b5563]">
            {activePage==="curation"&&"Step 1 · 뉴스 큐레이션"}
            {activePage==="script"&&"Step 2 · AI 스크립트"}
            {activePage==="video"&&"Step 3 · 영상 제작"}
            {activePage==="deploy"&&"Step 4 · 검수 & 배포"}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex rounded-xl overflow-hidden border" style={{borderColor:"var(--border)"}}>
              <button onClick={()=>setMode("normal")} className={`px-4 py-1.5 text-[13px] font-bold ${mode==="normal"?"text-[#c49a1a]":"text-[#9ca3af]"}`} style={mode==="normal"?{background:"rgba(196,154,26,0.08)"}:{}}>일반</button>
              <button onClick={()=>setMode("senior")} className={`px-4 py-1.5 text-[13px] font-bold ${mode==="senior"?"text-[#c49a1a]":"text-[#9ca3af]"}`} style={mode==="senior"?{background:"rgba(196,154,26,0.08)"}:{}}>시니어</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[13px] text-[#4b5563]" style={{borderColor:"var(--border)"}}>
              <span>👤</span> {profile.channelName || "채널 미설정"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* ═══ Settings Modal ═══ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.3)"}}>
          <div className="w-[520px] rounded-3xl border p-8 space-y-6 shadow-xl" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-extrabold text-[#1a1d23]">채널 설정</h2>
              <button onClick={() => setShowSettings(false)} className="text-[20px] text-[#9ca3af] hover:text-[#4b5563]">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-bold text-[#4b5563] block mb-2">채널 이름 *</label>
                <input value={profile.channelName} onChange={e => setProfile({ channelName: e.target.value })}
                  placeholder="예: 돈이 보이는 경제"
                  className="w-full px-4 py-3 rounded-xl text-[15px] text-[#1a1d23] focus:outline-none focus:ring-2 focus:ring-[#c49a1a]/30"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border)"}} />
              </div>

              <div>
                <label className="text-[13px] font-bold text-[#4b5563] block mb-2">인트로 멘트</label>
                <input value={profile.introText} onChange={e => setProfile({ introText: e.target.value })}
                  placeholder="안녕하세요, 오늘도 핵심만 짚어드리겠습니다."
                  className="w-full px-4 py-3 rounded-xl text-[15px] text-[#1a1d23] focus:outline-none focus:ring-2 focus:ring-[#c49a1a]/30"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border)"}} />
              </div>

              <div>
                <label className="text-[13px] font-bold text-[#4b5563] block mb-2">아웃트로 멘트</label>
                <input value={profile.outroText} onChange={e => setProfile({ outroText: e.target.value })}
                  placeholder="다음 영상에서 더 유익한 정보로 찾아뵙겠습니다."
                  className="w-full px-4 py-3 rounded-xl text-[15px] text-[#1a1d23] focus:outline-none focus:ring-2 focus:ring-[#c49a1a]/30"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border)"}} />
              </div>

              <div>
                <label className="text-[13px] font-bold text-[#4b5563] block mb-2">워터마크 텍스트</label>
                <input value={profile.watermarkText} onChange={e => setProfile({ watermarkText: e.target.value })}
                  placeholder="채널 이름과 동일하게 (비우면 채널명 사용)"
                  className="w-full px-4 py-3 rounded-xl text-[15px] text-[#1a1d23] focus:outline-none focus:ring-2 focus:ring-[#c49a1a]/30"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border)"}} />
              </div>

              <div className="p-4 rounded-xl" style={{background:"rgba(196,154,26,0.06)",border:"1px solid rgba(196,154,26,0.12)"}}>
                <p className="text-[12px] text-[#c49a1a]">TTS 보이스와 아바타는 추후 선택 기능이 추가됩니다.</p>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)}
              className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white"
              style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
