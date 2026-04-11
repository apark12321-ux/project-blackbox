"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MODULES: { key: ActivePage; id: number; label: string; icon: string; subtitle: string; minStep: number }[] = [
  { key: "curation", id: 1, label: "큐레이션", icon: "◈", subtitle: "카테고리 · 키워드 · 소스", minStep: 0 },
  { key: "script", id: 2, label: "스크립트", icon: "◆", subtitle: "하이브리드 서사 엔진", minStep: 3 },
  { key: "video", id: 3, label: "영상편집", icon: "▶", subtitle: "AI 영상 제작", minStep: 4 },
  { key: "deploy", id: 4, label: "실드&배포", icon: "◉", subtitle: "보안 · 동기화 · 퍼블리시", minStep: 5 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, step, activePage, setActivePage, reset } = useBlackboxStore();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#09090b] text-white">
      {/* ═══ Sidebar ═══ */}
      <nav className="w-[260px] shrink-0 flex flex-col border-r border-white/[0.06]"
        style={{ background: "linear-gradient(180deg, #0c0c0f 0%, #111114 50%, #0c0c0f 100%)" }}>

        {/* Logo */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.06]">
          <Link href="/" onClick={reset} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[15px] font-black text-[#09090b]"
              style={{ background: "linear-gradient(135deg, #d4af37, #b8941e)", boxShadow: "0 4px 20px rgba(212,175,55,0.3)" }}>
              PB
            </div>
            <div>
              <div className="text-[14px] font-extrabold tracking-[0.05em] text-white/90"
                style={{ fontFamily: "'Outfit', sans-serif" }}>PROJECT</div>
              <div className="text-[14px] font-extrabold tracking-[0.12em]"
                style={{ fontFamily: "'Outfit', sans-serif", background: "linear-gradient(90deg, #d4af37, #f0d060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                BLACKBOX
              </div>
            </div>
          </Link>
          <div className="mt-3 text-[10px] text-white/25 tracking-[0.08em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            YouTube Automation SaaS
          </div>
        </div>

        {/* Pipeline Navigation */}
        <div className="px-3 pt-5 flex-1">
          <div className="text-[10px] font-semibold text-white/20 tracking-[0.15em] uppercase px-3 mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            PIPELINE
          </div>

          <div className="flex flex-col gap-1">
            {MODULES.map((mod) => {
              const isActive = activePage === mod.key;
              const isUnlocked = step >= mod.minStep;
              const isDone =
                (mod.key === "curation" && step >= 3) ||
                (mod.key === "script" && step >= 4) ||
                (mod.key === "video" && step >= 5) ||
                (mod.key === "deploy" && step >= 5 && !!useBlackboxStore.getState().publish);

              return (
                <button
                  key={mod.key}
                  onClick={() => { if (isUnlocked) setActivePage(mod.key); }}
                  disabled={!isUnlocked}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl relative transition-all duration-200 w-full text-left
                    ${!isUnlocked ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                    ${!isActive && isUnlocked ? "hover:bg-white/[0.02]" : ""}`}
                  style={isActive ? {
                    background: "linear-gradient(90deg, rgba(212,175,55,0.12), rgba(212,175,55,0.03))"
                  } : {}}>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-sm"
                      style={{ background: "linear-gradient(180deg, #d4af37, #f0d060)", boxShadow: "0 0 10px rgba(212,175,55,0.4)" }} />
                  )}

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold shrink-0 transition-all duration-200
                    ${isActive
                      ? "text-[#09090b]"
                      : isDone
                        ? "text-[#22c55e] border border-[#22c55e]/20"
                        : "text-white/25 border border-white/[0.06]"}`}
                    style={isActive
                      ? { background: "linear-gradient(135deg, #d4af37, #c4a030)" }
                      : isDone
                        ? { background: "rgba(34,197,94,0.1)" }
                        : { background: "rgba(255,255,255,0.03)" }}>
                    {isDone && !isActive ? "✓" : mod.icon}
                  </div>

                  {/* Label */}
                  <div className="min-w-0 flex-1">
                    <div className={`text-[13px] transition-colors duration-200
                      ${isActive ? "font-bold text-[#d4af37]" : "font-medium text-white/70"}`}>
                      {mod.label}
                    </div>
                    <div className="text-[10px] text-white/20 truncate mt-0.5">{mod.subtitle}</div>
                  </div>

                  {/* Step number */}
                  <div className={`text-[10px] font-semibold opacity-50
                    ${isActive ? "text-[#d4af37]" : "text-white/30"}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    0{mod.id}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Progress + Status */}
        <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/20 tracking-[0.1em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>PROGRESS</span>
            <span className="text-[12px] font-bold text-[#d4af37]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {[step >= 3, step >= 4, step >= 5, step >= 5].filter(Boolean).length}/4
            </span>
          </div>
          <div className="h-1 rounded bg-white/[0.06] overflow-hidden mb-4">
            <div className="h-full rounded transition-all duration-500"
              style={{
                width: `${Math.min(step / 5 * 100, 100)}%`,
                background: "linear-gradient(90deg, #d4af37, #f0d060)"
              }} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]"
              style={{ boxShadow: "0 0 6px rgba(34,197,94,0.4)" }} />
            <span className="text-[11px] text-white/40">시스템 정상</span>
            <span className="text-[10px] text-white/15 ml-auto"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>v2.0</span>
          </div>
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/[0.06] flex items-center px-7 gap-4 shrink-0"
          style={{ background: "rgba(9,9,11,0.8)", backdropFilter: "blur(12px)" }}>
          <h1 className="text-[15px] font-bold text-white/80"
            style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>영상 제작</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <button onClick={() => setMode("normal")}
                className={`px-4 py-1.5 text-[12px] font-semibold transition-all
                  ${mode === "normal" ? "text-[#d4af37]" : "text-white/25"}`}
                style={mode === "normal" ? { background: "rgba(212,175,55,0.12)" } : {}}>
                일반
              </button>
              <button onClick={() => setMode("senior")}
                className={`px-4 py-1.5 text-[12px] font-semibold transition-all
                  ${mode === "senior" ? "text-[#d4af37]" : "text-white/25"}`}
                style={mode === "senior" ? { background: "rgba(212,175,55,0.12)" } : {}}>
                시니어
              </button>
            </div>
            <div className="text-[11px] text-white/25 px-3 py-1.5 border border-white/[0.06] rounded-lg">내 채널</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
