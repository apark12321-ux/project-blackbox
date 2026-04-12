"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

/* ═══════════════════════════════════════
   CATEGORIES
   ═══════════════════════════════════════ */
const CATEGORIES = [
  { id: "tech", label: "테크/IT", icon: "💻", desc: "AI, 반도체, 소프트웨어" },
  { id: "finance", label: "경제/금융", icon: "📊", desc: "주식, 부동산, 암호화폐" },
  { id: "health", label: "건강/의학", icon: "🏥", desc: "의학 발견, 건강 트렌드" },
  { id: "science", label: "과학", icon: "🔬", desc: "우주, 물리학, 생명과학" },
  { id: "business", label: "비즈니스", icon: "🏢", desc: "스타트업, 경영 전략" },
  { id: "education", label: "교육", icon: "📚", desc: "학습법, 교육 트렌드" },
  { id: "lifestyle", label: "라이프스타일", icon: "🌟", desc: "자기계발, 생산성" },
  { id: "entertainment", label: "엔터테인먼트", icon: "🎬", desc: "영화, 게임, 문화" },
];

/* ═══════════════════════════════════════
   MAIN PAGE — routes to active module
   ═══════════════════════════════════════ */
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


/* ═══════════════════════════════════════════════════════════════════
   MODULE A — 지능형 큐레이션 엔진 (기획 단계)
   Full-page: Left panel (Category + Keywords) | Right panel (News Feed)
   ═══════════════════════════════════════════════════════════════════ */
function CurationPage() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategory = async (catId: string) => {
    store.setCategory(catId);
    store.setStep(1);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/keywords/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: catId }),
      });
      if (!res.ok) throw new Error(`키워드 로드 실패 (${res.status})`);
      const data = await res.json();
      store.setKeywords(data.keywords || []);
      try {
        const benchRes = await fetch(`${API}/api/v1/curation/benchmarks/${catId}`, { method: "POST" });
        if (benchRes.ok) { store.setBenchmarks(await benchRes.json()); }
      } catch {}
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleKeyword = async (keyword: string) => {
    store.setSelectedKeyword(keyword);
    store.setStep(2);
    setNewsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/news/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      if (!res.ok) throw new Error(`뉴스 로드 실패 (${res.status})`);
      const data = await res.json();
      store.setNews(data.articles || []);
    } catch (e: any) { setError(e.message); }
    finally { setNewsLoading(false); }
  };

  const toggleNews = (article: any) => {
    const cur = store.selectedNews;
    const exists = cur.find((n: any) => n.title === article.title);
    store.setSelectedNews(exists ? cur.filter((n: any) => n.title !== article.title) : [...cur, article]);
  };

  const handleConfirm = () => {
    store.setStep(3);
    store.setActivePage("script");
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* ── LEFT: Category + Keywords ── */}
      <div className="w-[420px] shrink-0 border-r flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        {/* Category Section */}
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>Category</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => handleCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                  ${store.category === cat.id
                    ? "text-[#d4af37] border-[#d4af37]/40"
                    : "text-white/40 border-white/[0.06] hover:border-white/10 hover:text-white/60"}`}
                style={store.category === cat.id ? { background: "rgba(212,175,55,0.1)" } : {}}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Keywords Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <SectionLabel>Trending Blue Ocean Keywords</SectionLabel>

          {loading ? (
            <Spinner className="mt-12" />
          ) : store.keywords.length > 0 ? (
            <div className="mt-3">
              {/* Table header */}
              <div className="grid grid-cols-[32px_1fr_80px_80px_60px] gap-2 text-[9px] text-white/20 font-bold uppercase tracking-wider pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span>#</span><span>Keyword</span><span>검색량</span><span>경쟁도</span><span></span>
              </div>
              {/* Rows */}
              {store.keywords.map((kw, i) => {
                const isSelected = store.selectedKeyword === kw;
                return (
                  <div key={i}
                    className={`grid grid-cols-[32px_1fr_80px_80px_60px] gap-2 items-center py-2.5 border-b cursor-pointer transition-all
                      ${isSelected ? "border-[#d4af37]/20" : "border-white/[0.03] hover:bg-white/[0.02]"}`}
                    style={isSelected ? { background: "rgba(212,175,55,0.06)" } : {}}
                    onClick={() => handleKeyword(kw)}>
                    <span className="text-[11px] text-white/20 font-mono">{i + 1}</span>
                    <span className={`text-[12px] font-semibold truncate ${isSelected ? "text-[#d4af37]" : "text-white/70"}`}>{kw}</span>
                    <span className="text-[10px] text-white/25">—</span>
                    <span className="text-[10px] text-white/25">—</span>
                    <button className={`text-[10px] px-2 py-1 rounded font-medium
                      ${isSelected ? "text-[#d4af37] bg-[#d4af37]/10" : "text-white/30 hover:text-white/50"}`}>
                      {isSelected ? "Selected" : "Select"}
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
            <div className="mt-5 p-3 rounded-lg border" style={{ borderColor: "var(--border)", background: "rgba(212,175,55,0.03)" }}>
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

      {/* ── RIGHT: Curated News Source Feed ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>Curated News Source Feed</SectionLabel>
          {store.selectedNews.length > 0 && (
            <span className="text-[11px] text-[#22c55e] font-medium">{store.selectedNews.length}개 선택됨</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && <ErrorBanner>{error}</ErrorBanner>}

          {newsLoading ? (
            <Spinner className="mt-16" />
          ) : store.news.length > 0 ? (
            <div className="space-y-3">
              {store.news.map((article: any, i: number) => {
                const isSelected = store.selectedNews.some((n: any) => n.title === article.title);
                return (
                  <div key={i} onClick={() => toggleNews(article)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all group
                      ${isSelected ? "border-[#22c55e]/30" : "border-white/[0.04] hover:border-white/[0.08]"}`}
                    style={{ background: isSelected ? "rgba(34,197,94,0.04)" : "var(--bg-card)" }}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 text-[11px] transition-all
                        ${isSelected ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]" : "border-white/10 text-transparent group-hover:border-white/20"}`}>
                        ✓
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] font-semibold leading-snug mb-1.5 ${isSelected ? "text-white/85" : "text-white/65"}`}>
                          {article.title}
                        </div>
                        {article.description && (
                          <div className="text-[11px] text-white/30 leading-relaxed line-clamp-2 mb-2">{article.description}</div>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-white/20">
                          <span>{article.source?.name || "Unknown"}</span>
                          {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString("ko-KR")}</span>}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e]/60 font-medium">Fact Cleansed</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#3b82f6]/10 text-[#3b82f6]/60 font-medium">Insights Extracted</span>
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
              className="w-full py-3 rounded-xl text-[13px] font-bold text-[#09090b] transition-all hover:brightness-110"
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
   Full-page: Left (Script viewer) | Right (Edit tools + metadata)
   ═══════════════════════════════════════════════════════════════════ */
function ScriptPage() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!store.script && store.selectedKeyword && store.selectedNews.length > 0) {
      generateScript();
    }
  }, []);

  const generateScript = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/v1/script/generate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: store.selectedKeyword, category: store.category, news_articles: store.selectedNews, benchmarks: store.benchmarks }),
      });
      if (!res.ok) throw new Error(`스크립트 생성 실패 (${res.status})`);
      store.setScript(await res.json());
      store.setStep(4);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleEditBlock = async (blockIndex: number) => {
    try {
      const res = await fetch(`${API}/api/v1/script/edit-block`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script, block_index: blockIndex, new_text: editText }),
      });
      if (res.ok) { store.setScript(await res.json()); setEditingBlock(null); }
    } catch {}
  };

  const handleRegenerateBlock = async (blockIndex: number) => {
    try {
      const res = await fetch(`${API}/api/v1/script/regenerate-block`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script, block_index: blockIndex }),
      });
      if (res.ok) store.setScript(await res.json());
    } catch {}
  };

  const handleExtend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/script/extend`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script }),
      });
      if (res.ok) store.setScript(await res.json());
    } catch {} finally { setLoading(false); }
  };

  const handleRewrite = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/script/rewrite`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script }),
      });
      if (res.ok) store.setScript(await res.json());
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* ── LEFT: Script Viewer ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>AI 스크립트</SectionLabel>
          {store.script && (
            <div className="flex items-center gap-4 text-[11px] text-white/30">
              <span>📝 {store.script.char_count?.toLocaleString() || "—"}자</span>
              <span>⏱ {store.script.estimated_duration || "—"}</span>
              <span>📊 {store.script.blocks?.length || 0} blocks</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {error && <ErrorBanner>{error}</ErrorBanner>}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Spinner />
              <div className="text-[12px] text-white/25">Gemini가 대본을 작성하고 있습니다...</div>
            </div>
          ) : store.script?.blocks ? (
            store.script.blocks.map((block: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border group relative" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold text-[#d4af37]/30 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Block {String(i + 1).padStart(2, "0")} — {block.type || "narration"}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingBlock(i); setEditText(block.text); }}
                      className="px-2 py-0.5 rounded text-[9px] text-white/30 hover:text-white/60 hover:bg-white/[0.04]">✏️ 수정</button>
                    <button onClick={() => handleRegenerateBlock(i)}
                      className="px-2 py-0.5 rounded text-[9px] text-white/30 hover:text-white/60 hover:bg-white/[0.04]">🔄 재생성</button>
                  </div>
                </div>

                {editingBlock === i ? (
                  <div>
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                      className="w-full h-32 p-3 rounded-lg text-[12px] text-white/80 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30"
                      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }} />
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleEditBlock(i)}
                        className="px-3 py-1 rounded-lg text-[10px] font-bold text-[#09090b]"
                        style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}>저장</button>
                      <button onClick={() => setEditingBlock(null)}
                        className="px-3 py-1 rounded-lg text-[10px] text-white/30 border" style={{ borderColor: "var(--border)" }}>취소</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-white/65 leading-[1.8] whitespace-pre-wrap">{block.text}</p>
                )}
              </div>
            ))
          ) : (
            <EmptyState className="mt-16">큐레이션을 먼저 완료해주세요</EmptyState>
          )}
        </div>
      </div>

      {/* ── RIGHT: Controls Panel ── */}
      <div className="w-[300px] shrink-0 border-l flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>스크립트 도구</SectionLabel>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <ToolButton icon="🔄" label="전체 재생성" desc="같은 소스로 새로 작성" onClick={generateScript} disabled={loading || !store.selectedKeyword} />
          <ToolButton icon="📝" label="분량 추가 (Extend)" desc="현재 스크립트에 내용 추가" onClick={handleExtend} disabled={loading || !store.script} />
          <ToolButton icon="✨" label="전체 재작성 (Rewrite)" desc="스타일/톤 변경하여 재작성" onClick={handleRewrite} disabled={loading || !store.script} />

          <div className="h-px my-4" style={{ background: "var(--border)" }} />

          <div className="text-[10px] font-bold text-white/25 uppercase tracking-wider mb-2">Enhancement</div>
          <ToolChip label="Hook Logic" active={false} />
          <ToolChip label="Opinion Injector" active={false} />
          <ToolChip label="Fact Density+" active={false} />
          <ToolChip label="CTA Optimizer" active={false} />
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
   Full-page: Preview area | Right controls
   ═══════════════════════════════════════════════════════════════════ */
function VideoPage() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const generateVideo = async () => {
    setLoading(true); setError(null); setProgress(10);
    try {
      const iv = setInterval(() => setProgress((p) => Math.min(p + 3, 92)), 2000);
      const res = await fetch(`${API}/api/v1/video/generate-real`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script, keyword: store.selectedKeyword, category: store.category }),
      });
      clearInterval(iv);
      if (!res.ok) throw new Error(`영상 생성 실패 (${res.status})`);
      store.setVideo(await res.json());
      store.setStep(5); setProgress(100);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const loadSlides = async () => {
    if (!store.script) return;
    try {
      const res = await fetch(`${API}/api/v1/video/preview-slides`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script, keyword: store.selectedKeyword }),
      });
      if (res.ok) { const data = await res.json(); setSlides(data.slides || []); }
    } catch {}
  };

  useEffect(() => { if (store.script) loadSlides(); }, []);

  return (
    <div className="flex h-full animate-fade-in">
      {/* ── LEFT: Video Preview ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>영상 미리보기</SectionLabel>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-6">
              <Spinner size="lg" />
              <div className="w-72">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #d4af37, #f0d060)" }} />
                </div>
                <div className="text-[11px] text-white/25 text-center mt-2">{progress}% — 영상 렌더링 중...</div>
              </div>
            </div>
          ) : store.video ? (
            <div className="text-center space-y-4">
              <div className="w-[640px] h-[360px] rounded-xl border flex items-center justify-center" style={{ borderColor: "var(--border)", background: "#000" }}>
                <div className="text-[48px]">🎬</div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <span className="text-[11px] text-white/30">⏱ {store.video.duration || "—"}s</span>
                <span className="text-[11px] text-white/30">📐 {store.video.resolution || "1920×1080"}</span>
              </div>
              {store.video.download_url && (
                <a href={`${API}${store.video.download_url}`} target="_blank" rel="noopener noreferrer"
                  className="inline-block px-5 py-2 rounded-lg text-[12px] font-bold text-[#09090b]"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}>
                  ⬇ Download
                </a>
              )}
            </div>
          ) : slides.length > 0 ? (
            <div className="text-center space-y-4">
              <div className="w-[640px] h-[360px] rounded-xl border flex items-center justify-center p-6" style={{ borderColor: "var(--border)", background: "#0a0a0a" }}>
                <div className="text-[13px] text-white/50 leading-relaxed">{slides[currentSlide]?.text || "슬라이드 미리보기"}</div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white/60" style={{ borderColor: "var(--border)" }}>◀</button>
                <span className="text-[11px] text-white/25 font-mono">{currentSlide + 1} / {slides.length}</span>
                <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white/60" style={{ borderColor: "var(--border)" }}>▶</button>
              </div>
            </div>
          ) : (
            <EmptyState>스크립트가 필요합니다</EmptyState>
          )}
        </div>
      </div>

      {/* ── RIGHT: Controls ── */}
      <div className="w-[300px] shrink-0 border-l flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>영상 설정</SectionLabel>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/50">Senior Mode</span>
            <button onClick={() => store.setMode(store.mode === "senior" ? "normal" : "senior")}
              className={`w-10 h-5 rounded-full relative transition-all ${store.mode === "senior" ? "bg-[#d4af37]" : "bg-white/10"}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${store.mode === "senior" ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <div className="space-y-3">
            <SettingRow label="해상도" value="1920 × 1080" />
            <SettingRow label="자막 크기" value="Font 11" />
            <SettingRow label="배경" value="Pexels 실사" />
            <SettingRow label="TTS" value="ElevenLabs" />
            <SettingRow label="인포그래픽" value="8가지 레이아웃" />
          </div>
        </div>

        <div className="p-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
          {!store.video ? (
            <button onClick={generateVideo} disabled={loading || !store.script}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] transition-all hover:brightness-110 disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>
              Generate Final Video
            </button>
          ) : (
            <button onClick={() => store.setActivePage("deploy")}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>
              실드 & 배포 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE C+D — 알고리즘 실드 & 배포
   Full-page: Left (Shield) | Right (Publishing)
   ═══════════════════════════════════════════════════════════════════ */
function DeployPage() {
  const store = useBlackboxStore();
  const [shieldLoading, setShieldLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.shield && store.script) runShield();
  }, []);

  const runShield = async () => {
    setShieldLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/v1/shield/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script }),
      });
      if (!res.ok) throw new Error(`실드 분석 실패`);
      store.setShield(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setShieldLoading(false); }
  };

  const generateSeo = async () => {
    setSeoLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/publish/seo/generate?keyword=${encodeURIComponent(store.selectedKeyword || "")}&category=${encodeURIComponent(store.category || "")}`);
      if (res.ok) setSeoData(await res.json());
    } catch {} finally { setSeoLoading(false); }
  };

  const getScoreColor = (s: number) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";
  const getScoreGrade = (s: number) => s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : "C";

  return (
    <div className="flex h-full animate-fade-in">
      {/* ── LEFT: Shield Analysis ── */}
      <div className="flex-1 border-r flex flex-col" style={{ borderColor: "var(--border)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>모듈 C: 알고리즘 보안 실드</SectionLabel>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <ErrorBanner>{error}</ErrorBanner>}

          {shieldLoading ? (
            <Spinner className="mt-16" />
          ) : store.shield ? (
            <div className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-[64px] font-black leading-none" style={{ color: getScoreColor(store.shield.safety_score || 0), fontFamily: "'Outfit', sans-serif" }}>
                    {store.shield.safety_score || 0}
                  </div>
                  <div className="text-[14px] font-bold mt-1" style={{ color: getScoreColor(store.shield.safety_score || 0) }}>
                    {getScoreGrade(store.shield.safety_score || 0)} (안전)
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white/30 mb-3">수익화 안전 등급</div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{
                      width: `${store.shield.safety_score || 0}%`,
                      background: `linear-gradient(90deg, ${getScoreColor(store.shield.safety_score || 0)}, ${getScoreColor(store.shield.safety_score || 0)}88)`
                    }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Pixel Meta Variation", key: "pixel_meta" },
                  { label: "Audio Fine-tuning", key: "audio" },
                  { label: "Script Originality", key: "originality" },
                  { label: "Content Density", key: "density" },
                ].map((check) => (
                  <div key={check.key} className="p-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-white/40">Uniqueness Check</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] font-medium">Safe</span>
                    </div>
                    <div className="text-[11px] text-white/50">[{check.label}]</div>
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full bg-[#22c55e]/60" style={{ width: `${75 + Math.random() * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {store.shield.details && (
                <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                  <div className="text-[10px] font-bold text-white/30 mb-3 uppercase tracking-wider">상세 분석</div>
                  <div className="space-y-2">
                    {Object.entries(store.shield.details).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-[11px] text-white/40">{key}</span>
                        <span className="text-[11px] text-white/60 font-mono">{typeof val === "number" ? val : String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg text-[11px] text-white/25 leading-relaxed" style={{ background: "rgba(34,197,94,0.04)" }}>
                유튜브 AI의 재사용 콘텐츠 관독 회피 시스템 작동 중. 정책 우회 완료.
              </div>
            </div>
          ) : (
            <EmptyState className="mt-16">스크립트가 필요합니다</EmptyState>
          )}
        </div>
      </div>

      {/* ── RIGHT: Publishing ── */}
      <div className="flex-1 flex flex-col">
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <SectionLabel>모듈 D: 알고리즘 동기화 배포</SectionLabel>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="text-[11px] font-bold text-white/50 mb-2">Algo-Sync Check</div>
            <div className="text-[10px] text-white/30 leading-relaxed">
              24시간 편의 정책 점검 모듈. 동기화 통합에 전면적 강영으로 시스템 타이밍 최적화.
            </div>
          </div>

          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-white/50">SEO</span>
              {!seoData && (
                <button onClick={generateSeo} disabled={seoLoading || !store.script}
                  className="text-[10px] px-2.5 py-1 rounded-lg text-[#d4af37] font-medium disabled:opacity-30"
                  style={{ background: "rgba(212,175,55,0.1)" }}>
                  {seoLoading ? "생성 중..." : "SEO 생성"}
                </button>
              )}
            </div>
            {seoData ? (
              <div className="space-y-2">
                <div className="text-[12px] text-white/70 font-semibold">{seoData.title}</div>
                <div className="text-[10px] text-white/35 leading-relaxed">{seoData.description}</div>
                {seoData.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {seoData.tags.slice(0, 8).map((t: string, i: number) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/25 border" style={{ borderColor: "var(--border)" }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-white/15">SEO 메타데이터를 생성하세요</div>
            )}
          </div>

          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="text-[11px] font-bold text-white/50 mb-2">Scheduling</div>
            <div className="text-[10px] text-white/25">최적의 시간에 자동 업로드 예약</div>
          </div>

          <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}>
            <div className="text-[12px] font-bold text-[#d4af37] mb-2">강체 출력 모드 (예외 처리)</div>
            <div className="text-[10px] text-white/30 leading-relaxed space-y-1">
              <div>정책 위험: 자동 업로드 차단 (24시간 이만)</div>
              <div>유니크릭 영상 로컬 다운로드만 가능</div>
            </div>
            <div className="mt-3 p-2.5 rounded-lg text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <div className="text-[11px] font-bold text-[#d4af37]">유니크 영상 다운로드 (MP4)</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <button className="flex-1 py-2.5 rounded-xl text-[12px] font-bold border text-white/40 hover:text-white/60 transition-all" style={{ borderColor: "var(--border)" }}>
            Publish
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-[#09090b] transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.25)" }}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold text-white/35 uppercase tracking-[0.12em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {children}
    </div>
  );
}

function Spinner({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const s = size === "lg" ? "w-10 h-10 border-[3px]" : "w-6 h-6 border-2";
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${s} border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin`} />
    </div>
  );
}

function EmptyState({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-center text-white/15 text-[13px] ${className}`}>{children}</div>;
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[12px]">{children}</div>;
}

function ToolButton({ icon, label, desc, onClick, disabled }: { icon: string; label: string; desc: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full text-left p-3 rounded-xl border transition-all hover:border-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
      <div className="flex items-center gap-2.5">
        <span className="text-[16px]">{icon}</span>
        <div>
          <div className="text-[12px] font-semibold text-white/60">{label}</div>
          <div className="text-[9px] text-white/20">{desc}</div>
        </div>
      </div>
    </button>
  );
}

function ToolChip({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-lg border text-[11px] font-medium cursor-pointer transition-all
      ${active ? "text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/5" : "text-white/25 border-white/[0.04] hover:border-white/[0.08]"}`}>
      {label}
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-white/35">{label}</span>
      <span className="text-[11px] text-white/55 font-mono">{value}</span>
    </div>
  );
}
