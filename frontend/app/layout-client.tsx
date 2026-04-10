"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode, reset } = useBlackboxStore();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0a0e13] text-white">
      <nav className="w-14 bg-[#0f1419] border-r border-white/10 flex flex-col items-center py-3 shrink-0">
        <Link href="/" onClick={reset} className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-extrabold mb-5">B</Link>
        <Link href="/create" className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 ${pathname === "/create" ? "bg-blue-500/12 text-blue-400" : "text-white/25 hover:bg-white/5"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </Link>
      </nav>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 border-b border-white/10 flex items-center px-5 gap-3 shrink-0">
          <span className="text-sm font-semibold">영상 제작</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex border border-white/10 rounded-md overflow-hidden">
              <button onClick={() => setMode("normal")} className={`px-3 py-1 text-[10px] font-semibold ${mode === "normal" ? "bg-emerald-500/10 text-emerald-400" : "text-white/30"}`}>일반</button>
              <button onClick={() => setMode("senior")} className={`px-3 py-1 text-[10px] font-semibold ${mode === "senior" ? "bg-emerald-500/10 text-emerald-400" : "text-white/30"}`}>시니어</button>
            </div>
            <div className="text-[10px] text-white/40 px-2 py-1 border border-white/10 rounded-md">내 채널</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
