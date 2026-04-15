"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import type { ActivePage } from "@/stores/blackbox-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_TABS: { key: ActivePage; label: string; minStep: number; always?: boolean }[] = [
  { key: "curation", label: "큐레이션",   minStep: 0 },
  { key: "script",   label: "스크립트",   minStep: 3 },
  { key: "video",    label: "영상 제작",   minStep: 4 },
  { key: "deploy",   label: "검수·배포",   minStep: 5 },
];

const SIDEBAR_STEPS = [
  { key: "curation" as ActivePage, label: "뉴스 큐레이션", n: 1, cost: "FREE", minStep: 0 },
  { key: "script"   as ActivePage, label: "AI 스크립트",   n: 2, cost: "0.2",  minStep: 3 },
  { key: "video"    as ActivePage, label: "영상 제작",     n: 3, cost: "2.5",  minStep: 4 },
  { key: "deploy"   as ActivePage, label: "검수 & 배포",   n: 4, cost: "0.1",  minStep: 5 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { step, activePage, setActivePage, reset, profile } = useBlackboxStore();
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const isDone = (k: string) =>
    (k==="curation"&&step>=3)||(k==="script"&&step>=4)||(k==="video"&&step>=5)||(k==="deploy"&&step>=6);

  if (isLanding) return <>{children}</>;

  const isChannel = activePage === "channel";

  return (
    <div className="flex flex-col h-[100dvh]" style={{background:"#0d0c0a"}}>

      {/* ═══ TOP NAVIGATION ═══ */}
      <header className="shrink-0 h-[52px] flex items-center px-4 md:px-6"
        style={{background:"#0d0c0a",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>

        {/* Logo */}
        <Link href="/" onClick={reset}
          className="flex items-center gap-2 mr-6 md:mr-8 shrink-0 group">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[11px] md:text-[12px] font-black text-white transition-transform group-hover:scale-105"
            style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 2px 12px rgba(196,154,26,0.30)"}}>
            AM
          </div>
          <span className="hidden md:block text-[14px] font-black tracking-tight"
            style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            <span style={{color:"rgba(255,255,255,0.85)"}}>Algo</span>
            <span style={{color:"#e8c84a"}}>Maker</span>
          </span>
        </Link>

        {/* Workflow Tabs */}
        <nav className="flex items-center flex-1 min-w-0">
          {NAV_TABS.map(tab => {
            const active = activePage === tab.key;
            const ok = step >= tab.minStep;
            const done = isDone(tab.key);
            return (
              <button key={tab.key}
                onClick={() => ok && setActivePage(tab.key)}
                disabled={!ok}
                className="h-[52px] px-3 md:px-5 text-[12px] md:text-[13px] font-bold transition-all shrink-0"
                style={{
                  color: active ? "rgba(255,255,255,0.92)" : ok ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.16)",
                  borderBottom: active ? "2px solid #e8c84a" : "2px solid transparent",
                  cursor: ok ? "pointer" : "not-allowed",
                }}>
                {tab.label}
                {done && !active && <span className="ml-1 text-[9px]" style={{color:"#34d399"}}>✓</span>}
              </button>
            );
          })}
        </nav>

        {/* Right: 내 채널 관리 */}
        <button
          onClick={() => setActivePage("channel")}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all"
          style={{
            background: isChannel ? "rgba(232,200,74,0.10)" : "transparent",
            border: `1px solid ${isChannel ? "rgba(232,200,74,0.30)" : "rgba(255,255,255,0.09)"}`,
            color: isChannel ? "#e8c84a" : "rgba(255,255,255,0.45)",
          }}>
          <span>📺</span>
          <span>내 채널 관리</span>
          {profile.channelName && (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{background:"rgba(232,200,74,0.10)",color:"#e8c84a"}}>
              {profile.channelName.length > 8 ? profile.channelName.substring(0,8)+"…" : profile.channelName}
            </span>
          )}
        </button>
        {/* Mobile channel icon */}
        <button onClick={() => setActivePage("channel")}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[16px] ml-1"
          style={{
            background: isChannel ? "rgba(232,200,74,0.10)" : "transparent",
            border: `1px solid ${isChannel ? "rgba(232,200,74,0.25)" : "rgba(255,255,255,0.08)"}`,
          }}>
          📺
        </button>
      </header>

      {/* ═══ BODY ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className="hidden md:flex w-[176px] lg:w-[192px] shrink-0 flex-col py-5"
          style={{background:"#0d0c0a",borderRight:"1px solid rgba(255,255,255,0.07)"}}>

          <div className="px-4 mb-3">
            <div className="text-[9px] font-black tracking-widest uppercase"
              style={{color:"rgba(255,255,255,0.22)"}}>PIPELINE</div>
          </div>

          {/* Workflow Steps */}
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

          {/* Divider + Channel Management */}
          <div className="px-2 pt-3" style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <button
              onClick={() => setActivePage("channel")}
              className="w-full text-left rounded-xl flex items-center gap-3 px-3 py-2.5 transition-all"
              style={{
                background: isChannel ? "rgba(232,200,74,0.07)" : "transparent",
                borderLeft: isChannel ? "2px solid #e8c84a" : "2px solid transparent",
              }}
              onMouseEnter={e => { if (!isChannel) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!isChannel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px] shrink-0"
                style={{
                  background: isChannel ? "rgba(232,200,74,0.15)" : "rgba(255,255,255,0.06)",
                  color: isChannel ? "#e8c84a" : "rgba(255,255,255,0.35)",
                }}>
                📺
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold truncate"
                  style={{color: isChannel ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.42)"}}>
                  내 채널 관리
                </div>
                {profile.channelName && (
                  <div className="text-[9px] truncate mt-0.5" style={{color:isChannel?"rgba(232,200,74,0.55)":"rgba(255,255,255,0.20)"}}>
                    {profile.channelName}
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Server Status */}
          <div className="px-3 pt-2">
            <div className="flex items-center gap-2 px-1 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full"
                style={{background:"#34d399",boxShadow:"0 0 6px rgba(52,211,153,0.5)"}}/>
              <span className="text-[10px]" style={{color:"rgba(255,255,255,0.28)"}}>서버 연결됨</span>
            </div>
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="md:hidden flex items-center justify-around shrink-0 safe-bottom"
        style={{background:"#0d0c0a",borderTop:"1px solid rgba(255,255,255,0.07)",height:"54px"}}>
        {[...NAV_TABS, {key:"channel" as ActivePage, label:"채널", minStep:0}].map(tab => {
          const active = activePage === tab.key;
          const ok = tab.key==="channel" || step >= tab.minStep;
          const done = isDone(tab.key);
          return (
            <button key={tab.key}
              onClick={() => ok && setActivePage(tab.key)}
              disabled={!ok}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 ${!ok?"opacity-20":""}`}>
              <span className="text-[9px] font-black"
                style={{color: active ? "#e8c84a" : done ? "#34d399" : "rgba(255,255,255,0.28)"}}>
                {active ? "●" : done ? "✓" : "○"}
              </span>
              <span className="text-[9px] font-bold"
                style={{color: active ? "#e8c84a" : "rgba(255,255,255,0.28)"}}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
