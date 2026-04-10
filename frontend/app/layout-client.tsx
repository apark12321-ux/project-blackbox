/**
 * Root Layout — 사이드바 + 상단 바 + 모드 토글
 */
"use client";
import { useEffect } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/create", label: "영상 제작", icon: "M4 4h16v16H4z M8 8h8 M8 12h8" },
  { href: "/dashboard", label: "대시보드", icon: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, reset } = useBlackboxStore();
  const pathname = usePathname();

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(s);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0e13] text-white">
      {/* Sidebar */}
      <nav className="w-14 bg-[#0f1419] border-r border-white/8 flex flex-col items-center py-3 shrink-0">
        <Link href="/" onClick={reset} className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-extrabold mb-5">
          B
        </Link>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 transition-colors
                ${active ? "bg-blue-500/12 text-blue-400" : "text-white/25 hover:bg-white/5 hover:text-white/40"}
              `}
              title={item.label}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d={item.icon} />
              </svg>
            </Link>
          );
        })}
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-12 border-b border-white/8 flex items-center px-5 gap-3 shrink-0">
          <span className="text-sm font-semibold">
            {pathname === "/create" ? "영상 제작" : pathname === "/dashboard" ? "대시보드" : "Project Blackbox"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {/* Mode toggle */}
            <div className="flex border border-white/10 rounded-md overflow-hidden">
              <button
                onClick={() => setMode("normal")}
                className={`px-3 py-1 text-[10px] font-semibold transition-colors
                  ${mode === "normal" ? "bg-emerald-500/10 text-emerald-400" : "text-white/30"}
                `}
              >
                일반
              </button>
              <button
                onClick={() => setMode("senior")}
                className={`px-3 py-1 text-[10px] font-semibold transition-colors
                  ${mode === "senior" ? "bg-emerald-500/10 text-emerald-400" : "text-white/30"}
                `}
              >
                시니어
              </button>
            </div>
            <div className="text-[10px] text-white/40 px-2 py-1 border border-white/10 rounded-md">내 채널</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
