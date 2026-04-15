"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, reset, profile, setProfile } = useBlackboxStore();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;

  return (
    <div className="app-shell flex flex-col md:flex-row h-[100dvh]"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ═══ PC Sidebar (180px) ═══ */}
      <nav className="hidden md:flex w-[180px] shrink-0 flex-col sidebar"
        style={{ borderRight: "1px solid var(--border)" }}>

        {/* Logo */}
        <Link href="/" onClick={reset} className="flex items-center gap-2.5 px-4 py-4 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#b38600,#d4a537)", boxShadow: "0 3px 12px rgba(179,134,0,0.30)" }}>
            AM
          </div>
          <div>
            <div className="text-[13px] font-extrabold tracking-tight leading-tight">
              <span style={{ color: "var(--text-primary)" }}>Algo</span>
              <span style={{ color: "var(--gold)" }}>Maker</span>
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: "var(--text-faint)" }}>YouTube Auto</div>
          </div>
        </Link>

        <div className="h-px mx-3 mb-2" style={{ background: "var(--border)" }} />

        {/* Nav — single item */}
        <div className="flex-1 px-2 space-y-1">
          <Link href="/create"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
            style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] shrink-0"
              style={{ background: "linear-gradient(135deg,#b38600,#d4a537)" }}>
              🎬
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold" style={{ color: "var(--gold)" }}>영상 만들기</div>
              <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>원클릭 자동화</div>
            </div>
          </Link>
        </div>

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-1.5">
          <div className="h-px mx-1 mb-2" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-2 px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full ani-dot" style={{ background: "var(--green)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>서버 연결됨</span>
          </div>
          <button onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-white/5 text-left"
            style={{ color: "var(--text-secondary)" }}>
            <span className="text-[14px]">⚙</span>
            <span className="text-[11px] font-semibold">설정</span>
          </button>
        </div>
      </nav>

      {/* ═══ Main area ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top header bar */}
        <header className="h-11 shrink-0 flex items-center px-4 gap-3"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-sidebar)" }}>

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white"
              style={{ background: "linear-gradient(135deg,#b38600,#d4a537)" }}>AM</div>
          </div>

          <div className="flex-1" />

          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {[["normal","일반"],["senior","시니어"]].map(([v,l]) => (
              <button key={v} onClick={() => setMode(v as "normal"|"senior")}
                className="px-3 py-1 text-[11px] font-bold transition-all"
                style={{
                  background: mode===v ? "var(--gold-bg)" : "transparent",
                  color: mode===v ? "var(--gold)" : "var(--text-muted)",
                }}>
                {l}
              </button>
            ))}
          </div>

          {/* Settings icon */}
          <button onClick={() => setShowSettings(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-all hover:bg-white/5"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>⚙</button>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* ═══ Mobile bottom tab ═══ */}
      <nav className="md:hidden flex items-center justify-around shrink-0 sidebar safe-b"
        style={{ borderTop: "1px solid var(--border)", height: "52px" }}>
        <Link href="/create" className="flex flex-col items-center gap-0.5 py-2 px-5">
          <span className="text-[15px]">🎬</span>
          <span className="text-[9px] font-bold" style={{ color: "var(--gold)" }}>영상 만들기</span>
        </Link>
        <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-0.5 py-2 px-5">
          <span className="text-[15px]">⚙️</span>
          <span className="text-[9px] font-bold" style={{ color: "var(--text-muted)" }}>설정</span>
        </button>
      </nav>

      {/* ═══ Settings Modal (dark) ═══ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowSettings(false)}>
          <div className="absolute inset-0 bg-black/60 ani-in" />
          <div className="relative w-full md:w-[400px] rounded-t-2xl md:rounded-2xl p-6 ani-up max-h-[70vh] overflow-y-auto"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-strong)" }}
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>설정</h3>
              <button onClick={() => setShowSettings(false)} className="text-[18px]" style={{ color: "var(--text-muted)" }}>✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold block mb-1.5" style={{ color: "var(--text-muted)" }}>채널 이름</label>
                <input value={profile.channelName}
                  onChange={e => setProfile({ ...profile, channelName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-[13px]"
                  style={{ background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  placeholder="채널 이름" />
              </div>
              <div>
                <label className="text-[11px] font-bold block mb-1.5" style={{ color: "var(--text-muted)" }}>워터마크 텍스트</label>
                <input value={profile.watermarkText}
                  onChange={e => setProfile({ ...profile, watermarkText: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-[13px]"
                  style={{ background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  placeholder="채널명 또는 브랜드" />
              </div>
              <div>
                <label className="text-[11px] font-bold block mb-1.5" style={{ color: "var(--text-muted)" }}>타겟 모드</label>
                <div className="flex gap-2">
                  {[["normal","일반"],["senior","시니어"]].map(([v,l]) => (
                    <button key={v} onClick={() => setMode(v as "normal"|"senior")}
                      className="flex-1 py-2.5 rounded-lg text-[13px] font-bold border transition-all"
                      style={{
                        borderColor: mode===v ? "var(--gold-border)" : "var(--border)",
                        color: mode===v ? "var(--gold)" : "var(--text-muted)",
                        background: mode===v ? "var(--gold-bg)" : "transparent",
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { reset(); setShowSettings(false); }}
                className="w-full py-2.5 rounded-lg text-[13px] font-bold transition-all"
                style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)" }}>
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
