"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";

const NAV_ITEMS: { key: ActivePage; icon: string; label: string; minStep: number }[] = [
  { key: "curation", icon: "◈", label: "큐레이션", minStep: 0 },
  { key: "script", icon: "◆", label: "스크립트", minStep: 3 },
  { key: "video", icon: "▶", label: "영상편집", minStep: 4 },
  { key: "deploy", icon: "◉", label: "실드&배포", minStep: 5 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset } = useBlackboxStore();

  return (
    <div className="flex h-screen text-white" style={{ background: "var(--bg-primary)" }}>
      {/* ═══ Icon Sidebar ═══ */}
      <nav className="w-[68px] shrink-0 flex flex-col items-center border-r py-4 gap-1"
        style={{ borderColor: "var(--border)", background: "linear-gradient(180deg, #0a0c12, #080a10)" }}>

        {/* Logo */}
        <Link href="/" onClick={reset}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-black mb-5"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8941e)", color: "#09090b", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>
          PB
        </Link>

        {/* Nav Icons */}
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.key;
          const isUnlocked = step >= item.minStep;
          const isDone =
            (item.key === "curation" && step >= 3) ||
            (item.key === "script" && step >= 4) ||
            (item.key === "video" && step >= 5) ||
            (item.key === "deploy" && step >= 5 && !!useBlackboxStore.getState().publish);

          return (
            <button
              key={item.key}
              onClick={() => { if (isUnlocked) setActivePage(item.key); }}
              disabled={!isUnlocked}
              title={item.label}
              className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 relative
                ${!isUnlocked ? "opacity-20 cursor-not-allowed" : "cursor-pointer"}
                ${isActive ? "" : isUnlocked ? "hover:bg-white/[0.04]" : ""}`}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))",
                boxShadow: "0 0 12px rgba(212,175,55,0.1)",
              } : {}}>

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-5 rounded-r"
                  style={{ background: "linear-gradient(180deg, #d4af37, #f0d060)" }} />
              )}

              <span className={`text-[15px] ${isActive ? "text-[#d4af37]" : isDone ? "text-[#22c55e]" : "text-white/30"}`}>
                {isDone && !isActive ? "✓" : item.icon}
              </span>
              <span className={`text-[8px] font-medium ${isActive ? "text-[#d4af37]" : "text-white/20"}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {item.label.slice(0, 3)}
              </span>
            </button>
          );
        })}

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:bg-white/[0.04] cursor-pointer text-[12px]">⚙</div>
          <div className="w-2 h-2 rounded-full bg-[#22c55e] mb-1" style={{ boxShadow: "0 0 6px rgba(34,197,94,0.4)" }} />
        </div>
      </nav>

      {/* ═══ Main Area ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-12 border-b flex items-center px-6 gap-4 shrink-0"
          style={{ borderColor: "var(--border)", background: "rgba(7,8,12,0.85)", backdropFilter: "blur(12px)" }}>

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-extrabold tracking-[0.05em] text-white/80" style={{ fontFamily: "'Outfit', sans-serif" }}>PROJECT</span>
            <span className="text-[13px] font-extrabold tracking-[0.1em]"
              style={{ fontFamily: "'Outfit', sans-serif", background: "linear-gradient(90deg, #d4af37, #f0d060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              BLACKBOX
            </span>
          </div>

          <div className="h-5 w-px bg-white/[0.06] mx-2" />

          {/* Module title */}
          <h1 className="text-[14px] font-bold text-white/60" style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
            {activePage === "curation" && "모듈 A: 지능형 큐레이션 (기획 단계)"}
            {activePage === "script" && "모듈 B: 하이브리드 서사 및 제작 엔진"}
            {activePage === "video" && "모듈 B2: AI 영상 제작 엔진"}
            {activePage === "deploy" && "모듈 C+D: 알고리즘 실드 & 배포"}
          </h1>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => setMode("normal")}
                className={`px-3.5 py-1 text-[11px] font-semibold transition-all
                  ${mode === "normal" ? "text-[#d4af37]" : "text-white/20"}`}
                style={mode === "normal" ? { background: "rgba(212,175,55,0.12)" } : {}}>일반</button>
              <button onClick={() => setMode("senior")}
                className={`px-3.5 py-1 text-[11px] font-semibold transition-all
                  ${mode === "senior" ? "text-[#d4af37]" : "text-white/20"}`}
                style={mode === "senior" ? { background: "rgba(212,175,55,0.12)" } : {}}>시니어</button>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] text-white/30"
              style={{ borderColor: "var(--border)" }}>
              <span>👤</span> 관리자 &apos;User 2026&apos;님
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
