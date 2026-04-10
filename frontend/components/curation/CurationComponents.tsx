/**
 * Module A UI Components — 카테고리, 키워드, 뉴스
 */
"use client";
import { useBlackboxStore, type Category, type KeywordResult, type NewsSource } from "@/stores/blackbox-store";

// ── Category Grid ──
export function CategoryPicker({ categories }: { categories: Category[] }) {
  const { selectedCategory, selectCategory } = useBlackboxStore();

  return (
    <div className="grid grid-cols-5 gap-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => selectCategory(c)}
          className={`p-3 rounded-xl border text-center transition-all
            ${selectedCategory?.id === c.id
              ? "border-blue-500/50 bg-blue-500/5 -translate-y-0.5"
              : "border-white/10 hover:border-white/20 hover:bg-white/3"
            }`}
        >
          <div className="text-2xl mb-1">{c.icon}</div>
          <div className="text-[11px] font-semibold mb-0.5">{c.name}</div>
          <div className="text-[9px] text-white/40 mb-1.5">{c.description}</div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
            CPM {c.cpm}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Keyword List ──
function boiColor(v: number) {
  if (v >= 4) return "text-emerald-400";
  if (v >= 3) return "text-amber-400";
  return "text-red-400";
}

function momBadge(m: number) {
  const pct = Math.round(m * 100);
  if (m >= 0.5) return { color: "bg-emerald-500/10 text-emerald-400", label: `⬆+${pct}%` };
  if (m >= 0.15) return { color: "bg-emerald-500/10 text-emerald-300", label: `↑+${pct}%` };
  if (m > -0.15) return { color: "bg-white/5 text-white/40", label: `→${pct}%` };
  return { color: "bg-amber-500/10 text-amber-400", label: `↓${pct}%` };
}

export function KeywordList({ keywords }: { keywords: KeywordResult[] }) {
  const { selectedKeyword, selectKeyword } = useBlackboxStore();

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-[22px_1fr_48px_36px_50px_110px] gap-1 px-2 text-[10px] text-white/30 font-medium">
        <span />
        <span>키워드</span>
        <span className="text-right">검색량</span>
        <span className="text-center">경쟁</span>
        <span className="text-center">모멘텀</span>
        <span>블루오션 v2</span>
      </div>
      {/* Rows */}
      {keywords.map((k, i) => {
        const sel = selectedKeyword?.keyword === k.keyword;
        const bc = boiColor(k.boiScore);
        const mb = momBadge(k.momentum);
        return (
          <button
            key={k.keyword}
            onClick={() => selectKeyword(k)}
            className={`grid grid-cols-[22px_1fr_48px_36px_50px_110px] gap-1 items-center px-2 py-2 rounded-lg border w-full text-left transition-all
              ${sel ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-white/15 hover:bg-white/3"}
            `}
          >
            <span className="text-[10px] text-white/30 text-center">#{i + 1}</span>
            <div>
              <div className="text-[11px] font-medium truncate">{k.keyword}</div>
              <div className="text-[9px] text-white/30">${k.estimatedCpm}/CPM</div>
            </div>
            <span className="text-[10px] text-white/50 text-right">{k.searchVolume}K</span>
            <span className="text-[10px] text-white/50 text-center">{k.competitionCount}편</span>
            <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${mb.color}`}>{mb.label}</span>
            <div className="flex items-center gap-1">
              <div className="flex-1 h-[5px] bg-white/5 rounded overflow-hidden">
                <div className={`h-full rounded ${bc.replace("text-", "bg-")}`} style={{ width: `${(k.boiScore / 5) * 100}%` }} />
              </div>
              <span className={`text-[10px] font-semibold ${bc}`}>{k.boiScore.toFixed(2)}</span>
              <span className={`text-[8px] font-bold px-1 rounded ${bc} bg-current/10`}>{k.boiGrade}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── News Picker ──
export function NewsPicker({ news }: { news: NewsSource[] }) {
  const { selectedNews, selectNews } = useBlackboxStore();

  return (
    <div className="grid grid-cols-3 gap-2">
      {news.map((n, i) => {
        const sel = selectedNews?.title === n.title;
        const cpmCol = n.cpmGrade === "매우 높음" ? "text-emerald-400 bg-emerald-500/10" : "text-teal-300 bg-teal-500/10";
        return (
          <button
            key={i}
            onClick={() => selectNews(n)}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all
              ${sel ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-white/15"}
            `}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-blue-400 font-semibold">{n.source}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-semibold ${cpmCol}`}>CPM {n.cpmGrade}</span>
            </div>
            <div className="text-[11px] font-medium leading-snug">{n.title}</div>
            <div className="text-[10px] text-white/35 leading-snug">{n.summary}</div>
            <div className="text-[9px] text-white/25 mt-auto">{n.publishedAt}</div>
          </button>
        );
      })}
    </div>
  );
}
