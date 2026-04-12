"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

export default function CreatePage() {
  const { activePage } = useBlackboxStore();
  return (
    <div className="h-full">
      {activePage === "curation" && <CurationPage />}
      {activePage === "script" && <ScriptPage />}
      {activePage === "video" && <VideoPage />}
      {activePage === "deploy" && <DeployPage />}
    </div>
  );
}

/* ── helpers ── */
function boiGrade(score: number): { grade: string; color: string; bg: string } {
  if (score >= 4.5) return { grade: "A+", color: "#22c55e", bg: "rgba(34,197,94,0.12)" };
  if (score >= 3.8) return { grade: "A", color: "#22c55e", bg: "rgba(34,197,94,0.08)" };
  if (score >= 3.0) return { grade: "B+", color: "#d4af37", bg: "rgba(212,175,55,0.10)" };
  if (score >= 2.2) return { grade: "B", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" };
  if (score >= 1.5) return { grade: "C", color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
  return { grade: "F", color: "#ef4444", bg: "rgba(239,68,68,0.06)" };
}
function fmtVol(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}
function momentumArrow(m: number) {
  if (m > 0.2) return { icon: "▲", color: "#22c55e" };
  if (m > 0) return { icon: "△", color: "#22c55e" };
  if (m < -0.2) return { icon: "▼", color: "#ef4444" };
  if (m < 0) return { icon: "▽", color: "#ef4444" };
  return { icon: "—", color: "rgba(255,255,255,0.2)" };
}

/* ═══════════════════════════════════════════════════════════════════
   MODULE A — 지능형 큐레이션 엔진
   ═══════════════════════════════════════════════════════════════════ */
function CurationPage() {
  const store = useBlackboxStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/v1/curation/categories`)
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const handleCategory = async (slug: string) => {
    store.setCategory(slug);
    store.setStep(1);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/keywords/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_slug: slug, max_results: 10, sort_by: "blue_ocean" }),
      });
      if (!res.ok) throw new Error(`키워드 로드 실패 (${res.status})`);
      const data = await res.json();
      store.setKeywords(data.keywords || []);
      try {
        const benchRes = await fetch(`${API}/api/v1/curation/benchmarks/${slug}`);
        if (benchRes.ok) store.setBenchmarks(await benchRes.json());
      } catch {}
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleKeyword = async (kw: any) => {
    store.setSelectedKeyword(kw.keyword);
    store.setStep(2);
    setNewsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/news/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw.keyword, days_back: 7, max_results: 10 }),
      });
      if (!res.ok) throw new Error(`뉴스 로드 실패 (${res.status})`);
      const data = await res.json();
      store.setNews(data.articles || []);
    } catch (e: any) { setError(e.message); }
    finally { setNewsLoading(false); }
  };

  const toggleNews = (article: any) => {
    const cur = store.selectedNews;
    const exists = cur.find((n: any) => n.id === article.id);
    store.setSelectedNews(exists ? cur.filter((n: any) => n.id !== article.id) : [...cur, article]);
  };

  const handleConfirm = () => {
    store.setStep(3);
    store.setActivePage("script");
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* ── LEFT: Category + Keywords ── */}
      <div className="w-[480px] shrink-0 border-r flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        {/* Category chips with CPM */}
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>카테고리 선택</SectionLabel>
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((cat) => {
              const active = store.category === cat.slug;
              return (
                <button key={cat.slug} onClick={() => handleCategory(cat.slug)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all
                    ${active ? "border-[#d4af37]/50" : "border-white/[0.06] hover:border-white/[0.12]"}`}
                  style={active ? { background: "rgba(212,175,55,0.1)" } : { background: "rgba(255,255,255,0.02)" }}>
                  <span className="text-[16px]">{cat.icon}</span>
                  <div className="text-left">
                    <div className={`text-[12px] font-semibold ${active ? "text-[#d4af37]" : "text-white/60"}`}>{cat.label_ko}</div>
                    <div className="text-[9px] text-white/20">{cat.cpm_range}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keyword Table with BOI bars */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>돈 되는 황금 키워드</SectionLabel>
            {store.keywords.length > 0 && (
              <span className="text-[9px] text-white/20 font-mono">{store.keywords.length} results</span>
            )}
          </div>

          {loading ? (
            <Spinner className="mt-12" />
          ) : store.keywords.length > 0 ? (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-[24px_1fr_90px_52px_52px_52px_48px] gap-1.5 text-[8px] text-white/20 font-bold uppercase tracking-wider pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span>#</span><span>Keyword</span><span>블루오션 (BOI)</span><span>검색량</span><span>경쟁</span><span>추세</span><span></span>
              </div>

              {store.keywords.map((kw: any, i: number) => {
                const isSelected = store.selectedKeyword === kw.keyword;
                const g = boiGrade(kw.blue_ocean_index || 0);
                const m = momentumArrow(kw.trend_momentum || 0);

                return (
                  <div key={i}
                    className={`grid grid-cols-[24px_1fr_90px_52px_52px_52px_48px] gap-1.5 items-center py-2 border-b cursor-pointer transition-all
                      ${isSelected ? "border-[#d4af37]/20" : "border-white/[0.03] hover:bg-white/[0.015]"}`}
                    style={isSelected ? { background: "rgba(212,175,55,0.05)" } : {}}
                    onClick={() => handleKeyword(kw)}>

                    <span className="text-[10px] text-white/20 font-mono">{i + 1}</span>

                    <div className="min-w-0">
                      <span className={`text-[11px] font-semibold truncate block ${isSelected ? "text-[#d4af37]" : "text-white/75"}`}>{kw.keyword}</span>
                    </div>

                    {/* BOI bar + grade */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (kw.blue_ocean_index / 5) * 100)}%`, background: g.color }} />
                      </div>
                      <span className="text-[9px] font-black px-1 py-0.5 rounded" style={{ color: g.color, background: g.bg }}>
                        {g.grade}
                      </span>
                    </div>

                    <span className="text-[9px] text-white/30 font-mono text-center">{fmtVol(kw.search_volume || 0)}</span>
                    <span className="text-[9px] text-white/30 font-mono text-center">{kw.competition_count || 0}</span>

                    {/* Momentum arrow */}
                    <span className="text-[10px] font-bold text-center" style={{ color: m.color }}>{m.icon}</span>

                    <button className={`text-[9px] px-1.5 py-0.5 rounded font-semibold text-center
                      ${isSelected ? "text-[#d4af37] bg-[#d4af37]/10" : "text-white/25 hover:text-white/50"}`}>
                      {isSelected ? "✓" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState className="mt-12">카테고리를 선택하세요</EmptyState>
          )}

          {/* Benchmarks */}
          {store.benchmarks?.top_videos && (
            <div className="mt-5 p-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "rgba(212,175,55,0.03)" }}>
              <div className="text-[10px] font-bold text-[#d4af37]/50 mb-2">📊 인기 영상 벤치마크</div>
              {store.benchmarks.top_videos.slice(0, 3).map((v: any, i: number) => (
                <div key={i} className="text-[10px] text-white/35 mb-1.5 truncate leading-snug">
                  <span className="text-white/15 mr-1.5">{i + 1}.</span>{v.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Curated News Feed ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>정제된 뉴스 소스 피드</SectionLabel>
          {store.selectedNews.length > 0 && (
            <span className="text-[11px] text-[#22c55e] font-semibold">{store.selectedNews.length}개 선택됨</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && <ErrorBanner>{error}</ErrorBanner>}

          {newsLoading ? (
            <Spinner className="mt-16" />
          ) : store.news.length > 0 ? (
            <div className="space-y-3">
              {store.news.map((article: any) => {
                const isSelected = store.selectedNews.some((n: any) => n.id === article.id);
                return (
                  <div key={article.id} onClick={() => toggleNews(article)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all group
                      ${isSelected ? "border-[#22c55e]/30" : "border-white/[0.04] hover:border-white/[0.08]"}`}
                    style={{ background: isSelected ? "rgba(34,197,94,0.04)" : "var(--bg-card)" }}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 text-[11px] transition-all
                        ${isSelected ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]" : "border-white/10 text-transparent group-hover:border-white/20"}`}>
                        ✓
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className={`text-[13px] font-semibold leading-snug ${isSelected ? "text-white/85" : "text-white/65"}`}>
                            {article.title}
                          </div>
                          {/* CPM Gold Badge */}
                          <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-lg"
                            style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))", color: "#d4af37", border: "1px solid rgba(212,175,55,0.2)" }}>
                            {article.cpm_level}
                          </span>
                        </div>
                        {article.summary && (
                          <div className="text-[11px] text-white/30 leading-relaxed line-clamp-2 mb-2">{article.summary}</div>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-white/20">
                          <span className="font-medium">{article.source_name}</span>
                          {article.time_ago && <span>{article.time_ago}</span>}
                          <span className="text-white/12">관련도: {(article.relevance_score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-[#22c55e]/8 text-[#22c55e]/50 font-semibold border border-[#22c55e]/10">Fact Cleansed</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-[#3b82f6]/8 text-[#3b82f6]/50 font-semibold border border-[#3b82f6]/10">Insights Extracted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState className="mt-16">키워드를 선택하면 관련 뉴스가 표시됩니다</EmptyState>
          )}
        </div>

        {store.selectedNews.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
            <button onClick={handleConfirm}
              className="w-full py-3 rounded-xl text-[13px] font-bold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 20px rgba(212,175,55,0.25)" }}>
              Analyze in Module B → ({store.selectedNews.length}개 소스)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE B — 하이브리드 서사 및 제작 엔진
   ═══════════════════════════════════════════════════════════════════ */
function ScriptPage() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!store.script && store.selectedKeyword && store.selectedNews.length > 0) generateScript();
  }, []);

  const generateScript = async () => {
    setLoading(true); setError(null);
    try {
      const newsSummary = store.selectedNews.map((n: any) => `${n.title}: ${n.summary}`).join("\n\n");
      const res = await fetch(`${API}/api/v1/script/generate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: store.selectedKeyword, category: store.category, news_summary: newsSummary, core_facts: [], opinion_seeds: [], hook_triggers: [], target_duration_sec: 480 }),
      });
      if (!res.ok) throw new Error(`스크립트 생성 실패 (${res.status})`);
      store.setScript(await res.json());
      store.setStep(4);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleEditBlock = async (idx: number) => {
    if (!store.script) return;
    try {
      const res = await fetch(`${API}/api/v1/script/edit-block`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block_index: idx, new_text: editText, blocks: store.script.blocks }),
      });
      if (res.ok) { const d = await res.json(); store.setScript({ ...store.script, blocks: d.blocks || d }); setEditingBlock(null); }
    } catch {}
  };

  const handleRegenerateBlock = async (idx: number) => {
    if (!store.script) return;
    try {
      const res = await fetch(`${API}/api/v1/script/regenerate-block`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block_index: idx, keyword: store.selectedKeyword, category: store.category, instruction: "", blocks: store.script.blocks }),
      });
      if (res.ok) { const d = await res.json(); store.setScript({ ...store.script, blocks: d.blocks || d }); }
    } catch {}
  };

  const handleExtend = async () => {
    if (!store.script) return; setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/script/extend`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: store.selectedKeyword, category: store.category, current_blocks: store.script.blocks, extend_paragraphs: 3, instruction: "" }),
      });
      if (res.ok) { const d = await res.json(); store.setScript({ ...store.script, blocks: d.blocks || d }); }
    } catch {} finally { setLoading(false); }
  };

  const handleRewrite = async () => {
    if (!store.script) return; setLoading(true);
    try {
      const newsSummary = store.selectedNews.map((n: any) => `${n.title}: ${n.summary}`).join("\n\n");
      const res = await fetch(`${API}/api/v1/script/rewrite`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: store.selectedKeyword, category: store.category, news_summary: newsSummary, core_facts: [], instruction: "", target_duration_sec: 480 }),
      });
      if (res.ok) store.setScript(await res.json());
    } catch {} finally { setLoading(false); }
  };

  const totalDuration = store.script?.total_duration_sec || 0;
  const totalChars = store.script?.blocks?.reduce((s: number, b: any) => s + (b.text?.length || 0), 0) || 0;

  return (
    <div className="flex h-full animate-fade-in">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>AI 스크립트</SectionLabel>
          {store.script && (
            <div className="flex items-center gap-3 text-[10px] text-white/25">
              <Stat label="글자수" value={`${totalChars.toLocaleString()}자`} />
              <Stat label="재생시간" value={`${Math.round(totalDuration / 60)}분 ${Math.round(totalDuration % 60)}초`} />
              <Stat label="블록" value={`${store.script.blocks?.length || 0}`} />
              <Stat label="훅" value={store.script.hook_type} />
              <Stat label="톤" value={store.script.opinion_tone} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {error && <ErrorBanner>{error}</ErrorBanner>}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Spinner /><div className="text-[12px] text-white/25">Gemini가 대본을 작성하고 있습니다...</div>
            </div>
          ) : store.script?.blocks ? (
            <>
              {store.script.dynamic_intro && (
                <div className="p-3 rounded-xl text-[11px] text-[#d4af37]/50 italic border border-[#d4af37]/10" style={{ background: "rgba(212,175,55,0.03)" }}>
                  🎬 인트로: {store.script.dynamic_intro}
                </div>
              )}
              {store.script.blocks.map((block: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border group" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[#d4af37]/30 uppercase tracking-widest font-mono">{block.section || `BLOCK ${String(i + 1).padStart(2, "0")}`}</span>
                      <span className="text-[9px] text-white/15 font-mono">{block.duration_sec?.toFixed(1)}s</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingBlock(i); setEditText(block.text); }} className="px-2 py-0.5 rounded text-[9px] text-white/30 hover:text-white/60 hover:bg-white/[0.04]">✏️ 수정</button>
                      <button onClick={() => handleRegenerateBlock(i)} className="px-2 py-0.5 rounded text-[9px] text-white/30 hover:text-white/60 hover:bg-white/[0.04]">🔄 재생성</button>
                    </div>
                  </div>
                  {editingBlock === i ? (
                    <div>
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                        className="w-full h-32 p-3 rounded-lg text-[12px] text-white/80 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }} />
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleEditBlock(i)} className="px-3 py-1 rounded-lg text-[10px] font-bold text-[#09090b]" style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}>저장</button>
                        <button onClick={() => setEditingBlock(null)} className="px-3 py-1 rounded-lg text-[10px] text-white/30 border" style={{ borderColor: "var(--border)" }}>취소</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[12px] text-white/65 leading-[1.8] whitespace-pre-wrap">{block.text}</p>
                      {block.subtitle_highlight && <div className="mt-2 text-[9px] text-[#3b82f6]/50">💡 자막 강조: {block.subtitle_highlight}</div>}
                    </>
                  )}
                </div>
              ))}
              {store.script.dynamic_outro && (
                <div className="p-3 rounded-xl text-[11px] text-[#d4af37]/50 italic border border-[#d4af37]/10" style={{ background: "rgba(212,175,55,0.03)" }}>
                  🎬 아웃트로: {store.script.dynamic_outro}
                </div>
              )}
            </>
          ) : (
            <EmptyState className="mt-16">큐레이션을 먼저 완료해주세요</EmptyState>
          )}
        </div>
      </div>

      {/* RIGHT Panel */}
      <div className="w-[300px] shrink-0 border-l flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}><SectionLabel>스크립트 도구</SectionLabel></div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <ToolButton icon="🔄" label="전체 재생성" desc="같은 소스로 새로 작성" onClick={generateScript} disabled={loading || !store.selectedKeyword} />
          <ToolButton icon="📝" label="분량 추가 (Extend)" desc="기존 대본 뒤에 3문단 추가" onClick={handleExtend} disabled={loading || !store.script} />
          <ToolButton icon="✨" label="전체 재작성 (Rewrite)" desc="스타일/톤 변경하여 재작성" onClick={handleRewrite} disabled={loading || !store.script} />
          <div className="h-px my-4" style={{ background: "var(--border)" }} />
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-2">Enhancement</div>
          <ToolChip label="Hook Logic" /><ToolChip label="Opinion Injector" /><ToolChip label="Fact Density+" /><ToolChip label="CTA Optimizer" />
        </div>
        {store.script && (
          <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
            <button onClick={() => { store.setStep(4); store.setActivePage("video"); }}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>
              Create Video →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE B2 — AI 영상 제작 엔진
   ═══════════════════════════════════════════════════════════════════ */
function VideoPage() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const generateVideo = async () => {
    if (!store.script) return;
    setLoading(true); setError(null); setProgress(10);
    try {
      const res = await fetch(`${API}/api/v1/video/generate-real`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: store.selectedKeyword, category: store.category, mode: store.mode, script_blocks: store.script.blocks }),
      });
      if (!res.ok) throw new Error(`영상 생성 실패 (${res.status})`);
      const data = await res.json();
      if (data.status === "completed" || data.status === "done" || data.download_url) {
        store.setVideo(data); store.setStep(5); setProgress(100); setLoading(false);
      } else {
        pollStatus(data.job_id);
      }
    } catch (e: any) { setError(e.message); setLoading(false); }
  };

  const pollStatus = (jid: string) => {
    let p = 15;
    const iv = setInterval(async () => {
      p = Math.min(p + 5, 92); setProgress(p);
      try {
        const r = await fetch(`${API}/api/v1/video/status/${jid}`);
        if (r.ok) {
          const d = await r.json();
          if (d.status === "completed" || d.status === "done") { clearInterval(iv); store.setVideo(d); store.setStep(5); setProgress(100); setLoading(false); }
          else if (d.status === "error" || d.status === "failed") { clearInterval(iv); setError(d.error || "실패"); setLoading(false); }
        }
      } catch {}
    }, 5000);
    setTimeout(() => { clearInterval(iv); setLoading(false); }, 600000);
  };

  useEffect(() => {
    if (store.script) {
      fetch(`${API}/api/v1/video/preview-slides`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: store.selectedKeyword, category: store.category, script_blocks: store.script.blocks }),
      }).then(r => r.ok ? r.json() : null).then(d => { if (d?.slides) setSlides(d.slides); }).catch(() => {});
    }
  }, []);

  return (
    <div className="flex h-full animate-fade-in">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}><SectionLabel>영상 미리보기</SectionLabel></div>
        <div className="flex-1 flex items-center justify-center p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-6">
              <Spinner size="lg" />
              <div className="w-72">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #d4af37, #f0d060)" }} />
                </div>
                <div className="text-[11px] text-white/25 text-center mt-2">{progress}% — TTS + FFmpeg 렌더링 중...</div>
              </div>
            </div>
          ) : store.video ? (
            <div className="text-center space-y-4">
              <div className="w-[640px] h-[360px] rounded-xl border flex items-center justify-center" style={{ borderColor: "var(--border)", background: "#000" }}>
                <span className="text-[48px]">🎬</span>
              </div>
              <div className="flex items-center gap-4 justify-center text-[11px] text-white/30">
                <span>⏱ {store.video.duration_sec?.toFixed(1) || "—"}s</span>
                <span>📦 {store.video.file_size_bytes ? `${(store.video.file_size_bytes / 1024 / 1024).toFixed(1)}MB` : "—"}</span>
                <span className="text-[#22c55e]">✓ {store.video.status}</span>
              </div>
              {store.video.download_url && (
                <a href={store.video.download_url.startsWith("http") ? store.video.download_url : `${API}${store.video.download_url}`}
                  target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2 rounded-lg text-[12px] font-bold text-[#09090b]"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}>⬇ Download MP4</a>
              )}
            </div>
          ) : slides.length > 0 ? (
            <div className="text-center space-y-4">
              <div className="w-[640px] h-[360px] rounded-xl border flex items-center justify-center p-6 overflow-hidden" style={{ borderColor: "var(--border)", background: "#0a0a0a" }}>
                {slides[currentSlide]?.image_base64
                  ? <img src={`data:image/png;base64,${slides[currentSlide].image_base64}`} alt="" className="max-w-full max-h-full object-contain" />
                  : <div className="text-[13px] text-white/50 leading-relaxed">{slides[currentSlide]?.text || ""}</div>}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white/60" style={{ borderColor: "var(--border)" }}>◀</button>
                <span className="text-[11px] text-white/25 font-mono">{currentSlide + 1} / {slides.length}</span>
                <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white/60" style={{ borderColor: "var(--border)" }}>▶</button>
              </div>
            </div>
          ) : (
            <EmptyState>스크립트가 필요합니다</EmptyState>
          )}
        </div>
      </div>
      <div className="w-[300px] shrink-0 border-l flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}><SectionLabel>영상 설정</SectionLabel></div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/50">Senior Mode</span>
            <button onClick={() => store.setMode(store.mode === "senior" ? "normal" : "senior")}
              className={`w-10 h-5 rounded-full relative transition-all ${store.mode === "senior" ? "bg-[#d4af37]" : "bg-white/10"}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${store.mode === "senior" ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
          <div className="h-px" style={{ background: "var(--border)" }} />
          <SettingRow label="모드" value={store.mode} /><SettingRow label="해상도" value="1920×1080" /><SettingRow label="자막" value="Font 11" />
          <SettingRow label="배경" value="Pexels 실사" /><SettingRow label="TTS" value="ElevenLabs" /><SettingRow label="레이아웃" value="8가지 인포그래픽" />
        </div>
        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          {!store.video ? (
            <button onClick={generateVideo} disabled={loading || !store.script}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] disabled:opacity-30 transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>Generate Final Video</button>
          ) : (
            <button onClick={() => store.setActivePage("deploy")}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>실드 & 배포 →</button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE C+D — 알고리즘 실드 & 배포
   ═══════════════════════════════════════════════════════════════════ */
function DeployPage() {
  const store = useBlackboxStore();
  const [shieldLoading, setShieldLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.shield && store.script) runShield();
    if (store.category) loadSchedule();
  }, []);

  const runShield = async () => {
    setShieldLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/v1/shield/safety-check`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ has_avatar: true, has_opinion: true, has_custom_voice: false, script_sections: store.script?.blocks?.length || 5, total_duration_sec: store.script?.total_duration_sec || 180, core_facts_count: 3, variation_applied: false }),
      });
      if (!res.ok) throw new Error("실드 분석 실패");
      store.setShield(await res.json());
    } catch (e: any) { setError(e.message); } finally { setShieldLoading(false); }
  };

  const generateSeo = async () => {
    setSeoLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/publish/seo/generate?keyword=${encodeURIComponent(store.selectedKeyword || "")}&category=${encodeURIComponent(store.category || "economy")}`);
      if (res.ok) setSeoData(await res.json());
    } catch {} finally { setSeoLoading(false); }
  };

  const loadSchedule = async () => {
    try {
      const res = await fetch(`${API}/api/v1/publish/schedule/recommend?category=${encodeURIComponent(store.category || "economy")}`);
      if (res.ok) setScheduleData(await res.json());
    } catch {}
  };

  const score = store.shield?.total_score || 0;
  const sc = (s: number) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex h-full animate-fade-in">
      {/* LEFT: Shield */}
      <div className="flex-1 border-r flex flex-col" style={{ borderColor: "var(--border)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}><SectionLabel>모듈 C: 알고리즘 보안 실드</SectionLabel></div>
        <div className="flex-1 overflow-y-auto p-6">
          {error && <ErrorBanner>{error}</ErrorBanner>}
          {shieldLoading ? <Spinner className="mt-16" /> : store.shield ? (
            <div className="space-y-6">
              {/* Big score + gauge */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-[64px] font-black leading-none" style={{ color: sc(score), fontFamily: "'Outfit', sans-serif" }}>{Math.round(score)}</div>
                  <div className="text-[14px] font-bold mt-1" style={{ color: sc(score) }}>{store.shield.grade} ({store.shield.passed ? "안전" : "위험"})</div>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white/30 mb-3">전체 수익화 안전 등급</div>
                  <div className="h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${sc(score)}, ${sc(score)}88)` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-white/15"><span>0</span><span>50</span><span>100</span></div>
                </div>
              </div>

              {/* Factor cards */}
              {store.shield.factors && (
                <div className="grid grid-cols-2 gap-3">
                  {store.shield.factors.map((f: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-white/45">{f.name}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold ${f.score >= 70 ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#f59e0b]/10 text-[#f59e0b]"}`}>{f.score >= 70 ? "Safe" : "Warn"}</span>
                      </div>
                      <div className="text-[9px] text-white/25 mb-2 line-clamp-1">{f.description}</div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="h-full rounded-full" style={{ width: `${f.score}%`, background: sc(f.score) }} />
                      </div>
                      <div className="flex justify-between mt-1"><span className="text-[8px] font-mono" style={{ color: sc(f.score) }}>{f.score.toFixed(0)}</span><span className="text-[8px] text-white/12">w:{(f.weight * 100).toFixed(0)}%</span></div>
                      {f.suggestion && <div className="mt-1 text-[8px] text-[#3b82f6]/40">💡 {f.suggestion}</div>}
                    </div>
                  ))}
                </div>
              )}

              {store.shield.risk_items?.length > 0 && (
                <div className="p-3 rounded-xl border border-[#f59e0b]/20" style={{ background: "rgba(245,158,11,0.03)" }}>
                  <div className="text-[10px] font-bold text-[#f59e0b]/60 mb-1">⚠️ 위험 항목</div>
                  {store.shield.risk_items.map((r: string, i: number) => <div key={i} className="text-[9px] text-white/30 mb-0.5">• {r}</div>)}
                </div>
              )}
              <div className="p-3 rounded-xl text-[10px] text-white/20 leading-relaxed" style={{ background: "rgba(34,197,94,0.03)" }}>유튜브 AI 재사용 콘텐츠 감독 회피 시스템 작동 중. 정책 우회 완료.</div>
            </div>
          ) : <EmptyState className="mt-16">스크립트가 필요합니다</EmptyState>}
        </div>
      </div>

      {/* RIGHT: Publish */}
      <div className="flex-1 flex flex-col">
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}><SectionLabel>모듈 D: 알고리즘 동기화 배포</SectionLabel></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* SEO */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-white/50">SEO 최적화</span>
              {!seoData && <button onClick={generateSeo} disabled={seoLoading || !store.selectedKeyword} className="text-[10px] px-2.5 py-1 rounded-lg text-[#d4af37] font-medium disabled:opacity-30" style={{ background: "rgba(212,175,55,0.1)" }}>{seoLoading ? "생성 중..." : "Gemini SEO 생성"}</button>}
            </div>
            {seoData ? (
              <div className="space-y-2">
                {seoData.title && <div className="text-[12px] text-white/70 font-semibold">{seoData.title}</div>}
                {seoData.description && <div className="text-[10px] text-white/30 leading-relaxed">{seoData.description}</div>}
                {seoData.tags && <div className="flex flex-wrap gap-1 mt-2">{(Array.isArray(seoData.tags) ? seoData.tags : []).slice(0, 10).map((t: string, i: number) => <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/25 border" style={{ borderColor: "var(--border)" }}>{t}</span>)}</div>}
              </div>
            ) : <div className="text-[10px] text-white/15">Gemini SEO 메타데이터를 생성하세요</div>}
          </div>

          {/* Schedule */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <span className="text-[11px] font-bold text-white/50">스케줄 추천</span>
            {scheduleData ? (
              <div className="mt-2 space-y-1">
                {scheduleData.recommended_time && <div className="text-[12px] text-[#d4af37]/70 font-semibold">⏰ {scheduleData.recommended_time}</div>}
                {scheduleData.reason && <div className="text-[10px] text-white/30">{scheduleData.reason}</div>}
              </div>
            ) : <div className="text-[10px] text-white/15 mt-2">로딩 중...</div>}
          </div>

          {/* Download */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}>
            <div className="text-[12px] font-bold text-[#d4af37] mb-2">강체 출력 모드 (예외 처리)</div>
            <div className="text-[10px] text-white/25 space-y-1"><div>정책 위험: 자동 업로드 차단 (24시간 이만)</div><div>유니크 영상 로컬 다운로드만 가능</div></div>
            {store.video?.download_url && (
              <a href={store.video.download_url.startsWith("http") ? store.video.download_url : `${API}${store.video.download_url}`}
                target="_blank" rel="noopener noreferrer"
                className="block mt-3 p-2.5 rounded-lg text-center text-[11px] font-bold text-[#d4af37]"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>⬇ 유니크 영상 다운로드 (MP4)</a>
            )}
          </div>
        </div>
        <div className="p-4 border-t flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <button className="flex-1 py-2.5 rounded-xl text-[12px] font-bold border text-white/40 hover:text-white/60" style={{ borderColor: "var(--border)" }}>Publish</button>
          <button onClick={() => { if (store.video?.download_url) window.open(store.video.download_url.startsWith("http") ? store.video.download_url : `${API}${store.video.download_url}`, "_blank"); }}
            className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>Download</button>
        </div>
      </div>
    </div>
  );
}


/* ═══ SHARED COMPONENTS ═══ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold text-white/35 uppercase tracking-[0.12em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{children}</div>;
}
function Spinner({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const s = size === "lg" ? "w-10 h-10 border-[3px]" : "w-6 h-6 border-2";
  return <div className={`flex items-center justify-center ${className}`}><div className={`${s} border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin`} /></div>;
}
function EmptyState({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-center text-white/15 text-[13px] ${className}`}>{children}</div>;
}
function ErrorBanner({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-[12px]">{children}</div>;
}
function ToolButton({ icon, label, desc, onClick, disabled }: { icon: string; label: string; desc: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="w-full text-left p-3 rounded-xl border transition-all hover:border-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
      <div className="flex items-center gap-2.5"><span className="text-[16px]">{icon}</span><div><div className="text-[12px] font-semibold text-white/60">{label}</div><div className="text-[9px] text-white/20">{desc}</div></div></div>
    </button>
  );
}
function ToolChip({ label }: { label: string }) {
  return <div className="px-3 py-2 rounded-lg border text-[11px] font-medium text-white/25 border-white/[0.04] hover:border-white/[0.08] cursor-pointer transition-all">{label}</div>;
}
function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-[11px] text-white/35">{label}</span><span className="text-[11px] text-white/55 font-mono">{value}</span></div>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center gap-1"><span className="text-white/15">{label}:</span><span className="text-white/40 font-mono">{value}</span></div>;
}
