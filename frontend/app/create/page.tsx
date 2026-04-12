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

export default function CreatePage() {
  const store = useBlackboxStore();
  const { activePage } = store;

  return (
    <div className="h-full">
      {activePage === "curation" && <CurationModule />}
      {activePage === "script" && <ScriptModule />}
      {activePage === "video" && <VideoModule />}
      {activePage === "deploy" && <DeployModule />}
    </div>
  );
}

/* ═══════════════════════════════════════
   MODULE A: 큐레이션
   ═══════════════════════════════════════ */
function CurationModule() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsLoading, setNewsLoading] = useState(false);

  // Step 1: 카테고리 선택
  const handleCategory = async (catId: string) => {
    store.setCategory(catId);
    store.setStep(1);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/keywords/${catId}`);
      if (!res.ok) throw new Error(`키워드 로드 실패 (${res.status})`);
      const data = await res.json();
      store.setKeywords(data.keywords || []);
      store.setStep(1);

      // 벤치마킹 데이터도 가져오기
      try {
        const benchRes = await fetch(`${API}/api/v1/curation/benchmarks/${catId}`);
        if (benchRes.ok) {
          const benchData = await benchRes.json();
          store.setBenchmarks(benchData);
        }
      } catch {}
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 키워드 선택 → 뉴스 로드
  const handleKeyword = async (keyword: string) => {
    store.setSelectedKeyword(keyword);
    store.setStep(2);
    setNewsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/news/${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error(`뉴스 로드 실패 (${res.status})`);
      const data = await res.json();
      store.setNews(data.articles || []);
      store.setStep(2);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setNewsLoading(false);
    }
  };

  // Step 3: 뉴스 선택 완료 → 스크립트로 이동
  const handleNewsConfirm = () => {
    store.setStep(3);
    store.setActivePage("script");
  };

  const toggleNews = (article: any) => {
    const current = store.selectedNews;
    const exists = current.find((n: any) => n.title === article.title);
    if (exists) {
      store.setSelectedNews(current.filter((n: any) => n.title !== article.title));
    } else {
      store.setSelectedNews([...current, article]);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {["카테고리", "키워드", "소스"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold
              ${store.step >= i ? "text-[#09090b]" : "text-white/20 border border-white/10"}`}
              style={store.step >= i ? { background: "linear-gradient(135deg, #d4af37, #f0d060)" } : {}}>
              {store.step > i ? "✓" : i + 1}
            </div>
            <span className={`text-[12px] font-medium ${store.step >= i ? "text-white/70" : "text-white/20"}`}>{s}</span>
            {i < 2 && <div className={`w-12 h-px ${store.step > i ? "bg-[#d4af37]/40" : "bg-white/6"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[13px]">
          {error}
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="grid grid-cols-3 gap-4" style={{ height: "calc(100vh - 160px)" }}>

        {/* Column 1: 카테고리 */}
        <div className="rounded-xl border p-4 overflow-y-auto" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <h3 className="text-[13px] font-bold text-white/50 mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 01 — 카테고리</h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => handleCategory(cat.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200
                  ${store.category === cat.id ? "border-[#d4af37]/40" : "border-transparent hover:border-white/[0.06]"}`}
                style={store.category === cat.id ? { background: "rgba(212,175,55,0.08)" } : { background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-[18px]">{cat.icon}</span>
                  <div>
                    <div className={`text-[13px] font-semibold ${store.category === cat.id ? "text-[#d4af37]" : "text-white/70"}`}>{cat.label}</div>
                    <div className="text-[10px] text-white/25">{cat.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: 키워드 */}
        <div className="rounded-xl border p-4 overflow-y-auto" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <h3 className="text-[13px] font-bold text-white/50 mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 02 — 키워드</h3>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
            </div>
          ) : store.keywords.length > 0 ? (
            <div className="space-y-1.5">
              {store.keywords.map((kw: string, i: number) => (
                <button key={i} onClick={() => handleKeyword(kw)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] transition-all
                    ${store.selectedKeyword === kw ? "text-[#d4af37] border border-[#d4af37]/30" : "text-white/60 border border-transparent hover:bg-white/[0.03]"}`}
                  style={store.selectedKeyword === kw ? { background: "rgba(212,175,55,0.08)" } : {}}>
                  <span className="text-white/20 mr-2 text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                  {kw}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/15 text-[13px]">카테고리를 선택하세요</div>
          )}

          {/* 벤치마킹 데이터 */}
          {store.benchmarks && (
            <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: "var(--border)", background: "rgba(212,175,55,0.04)" }}>
              <h4 className="text-[11px] font-bold text-[#d4af37]/60 mb-2">📊 벤치마킹</h4>
              {store.benchmarks.top_videos?.slice(0, 3).map((v: any, i: number) => (
                <div key={i} className="text-[11px] text-white/40 mb-1 truncate">• {v.title}</div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: 뉴스 소스 */}
        <div className="rounded-xl border p-4 overflow-y-auto" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <h3 className="text-[13px] font-bold text-white/50 mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 03 — 소스</h3>
          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
            </div>
          ) : store.news.length > 0 ? (
            <>
              <div className="space-y-2 mb-4">
                {store.news.map((article: any, i: number) => {
                  const isSelected = store.selectedNews.some((n: any) => n.title === article.title);
                  return (
                    <button key={i} onClick={() => toggleNews(article)}
                      className={`w-full text-left p-3 rounded-lg border transition-all
                        ${isSelected ? "border-[#22c55e]/40" : "border-transparent hover:border-white/[0.06]"}`}
                      style={isSelected ? { background: "rgba(34,197,94,0.06)" } : { background: "rgba(255,255,255,0.02)" }}>
                      <div className="flex items-start gap-2">
                        <span className={`text-[14px] mt-0.5 ${isSelected ? "text-[#22c55e]" : "text-white/15"}`}>
                          {isSelected ? "✓" : "○"}
                        </span>
                        <div>
                          <div className={`text-[12px] font-medium leading-snug ${isSelected ? "text-white/80" : "text-white/50"}`}>
                            {article.title}
                          </div>
                          <div className="text-[10px] text-white/20 mt-1">{article.source?.name || "Unknown"}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {store.selectedNews.length > 0 && (
                <button onClick={handleNewsConfirm}
                  className="w-full py-2.5 rounded-lg text-[13px] font-bold text-[#09090b] transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>
                  AI 스크립트 생성 →  ({store.selectedNews.length}개 소스)
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-white/15 text-[13px]">키워드를 선택하세요</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MODULE B: 스크립트
   ═══════════════════════════════════════ */
function ScriptModule() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.script && store.selectedKeyword && store.selectedNews.length > 0) {
      generateScript();
    }
  }, []);

  const generateScript = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/script/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: store.selectedKeyword,
          category: store.category,
          news_articles: store.selectedNews,
          benchmarks: store.benchmarks,
        }),
      });
      if (!res.ok) throw new Error(`스크립트 생성 실패 (${res.status})`);
      const data = await res.json();
      store.setScript(data);
      store.setStep(4);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!store.script) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/script/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script }),
      });
      if (res.ok) {
        const data = await res.json();
        store.setScript(data);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleRewrite = async () => {
    if (!store.script) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/script/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script }),
      });
      if (res.ok) {
        const data = await res.json();
        store.setScript(data);
      }
    } catch {} finally { setLoading(false); }
  };

  const goToVideo = () => {
    store.setStep(4);
    store.setActivePage("video");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <span className="text-[#d4af37]">◆</span> AI 스크립트
        </h2>
        {store.script && (
          <div className="flex items-center gap-2">
            <button onClick={handleExtend} disabled={loading}
              className="px-3 py-1.5 rounded-lg border text-[11px] font-medium text-white/50 hover:text-white/80 transition-all"
              style={{ borderColor: "var(--border)" }}>
              + 분량 추가
            </button>
            <button onClick={handleRewrite} disabled={loading}
              className="px-3 py-1.5 rounded-lg border text-[11px] font-medium text-white/50 hover:text-white/80 transition-all"
              style={{ borderColor: "var(--border)" }}>
              ↻ 전체 재작성
            </button>
            <button onClick={generateScript} disabled={loading}
              className="px-3 py-1.5 rounded-lg border text-[11px] font-medium text-white/50 hover:text-white/80 transition-all"
              style={{ borderColor: "var(--border)" }}>
              ⟳ 재생성
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[13px]">{error}</div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
          <div className="text-[13px] text-white/30">Gemini가 대본을 작성하고 있습니다...</div>
        </div>
      ) : store.script ? (
        <div className="space-y-4">
          {/* Script metadata */}
          <div className="flex items-center gap-4 text-[11px] text-white/30 mb-4">
            <span>📝 {store.script.char_count?.toLocaleString() || "—"}자</span>
            <span>⏱ 약 {store.script.estimated_duration || "—"}</span>
            <span>📊 {store.script.blocks?.length || "—"}블록</span>
          </div>

          {/* Script blocks */}
          {store.script.blocks?.map((block: any, i: number) => (
            <div key={i} className="p-4 rounded-xl border group" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#d4af37]/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  BLOCK {String(i + 1).padStart(2, "0")} — {block.type || "narration"}
                </span>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed whitespace-pre-wrap">{block.text}</p>
            </div>
          ))}

          {/* Next step */}
          <button onClick={goToVideo}
            className="w-full py-3 rounded-lg text-[13px] font-bold text-[#09090b] mt-4 transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>
            영상 제작으로 →
          </button>
        </div>
      ) : (
        <div className="text-center py-24 text-white/15 text-[13px]">
          큐레이션을 먼저 완료해주세요
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MODULE B2: 영상편집
   ═══════════════════════════════════════ */
function VideoModule() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!store.script) return;
    setLoading(true);
    setError(null);
    setProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 5, 90));
      }, 3000);

      const res = await fetch(`${API}/api/v1/video/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: store.script,
          keyword: store.selectedKeyword,
          category: store.category,
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) throw new Error(`영상 생성 실패 (${res.status})`);
      const data = await res.json();
      store.setVideo(data);
      store.setStep(5);
      setProgress(100);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const goToDeploy = () => {
    store.setActivePage("deploy");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-[18px] font-bold mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <span className="text-[#d4af37]">▶</span> AI 영상 제작
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[13px]">{error}</div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
          <div className="w-64">
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #d4af37, #f0d060)" }} />
            </div>
            <div className="text-[11px] text-white/30 text-center mt-2">{progress}% — 영상 생성 중...</div>
          </div>
        </div>
      ) : store.video ? (
        <div className="space-y-4">
          <div className="p-6 rounded-xl border text-center" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="text-[48px] mb-3">🎬</div>
            <div className="text-[16px] font-bold text-white/80 mb-1">영상 생성 완료!</div>
            <div className="text-[12px] text-white/30">
              {store.video.duration || "—"}초 · {store.video.resolution || "1920x1080"}
            </div>
            {store.video.download_url && (
              <a href={`${API}${store.video.download_url}`} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 rounded-lg text-[12px] font-bold text-[#09090b]"
                style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}>
                ⬇ 다운로드
              </a>
            )}
          </div>
          <button onClick={goToDeploy}
            className="w-full py-3 rounded-lg text-[13px] font-bold text-[#09090b] transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>
            실드 & 배포로 →
          </button>
        </div>
      ) : (
        <div className="text-center py-24">
          <button onClick={generateVideo} disabled={!store.script}
            className="px-8 py-3 rounded-lg text-[14px] font-bold text-[#09090b] transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>
            🎬 영상 생성 시작
          </button>
          <div className="text-[12px] text-white/20 mt-3">Pexels 배경 + 인포그래픽 + TTS 자막</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MODULE C+D: 실드 & 배포
   ═══════════════════════════════════════ */
function DeployModule() {
  const store = useBlackboxStore();
  const [shieldLoading, setShieldLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 실드 분석
  const runShield = async () => {
    if (!store.script) return;
    setShieldLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/shield/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: store.script }),
      });
      if (!res.ok) throw new Error(`실드 분석 실패 (${res.status})`);
      const data = await res.json();
      store.setShield(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setShieldLoading(false);
    }
  };

  // SEO 생성
  const generateSeo = async () => {
    if (!store.script) return;
    setSeoLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/publish/seo/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: store.script,
          keyword: store.selectedKeyword,
          category: store.category,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSeoData(data);
      }
    } catch {} finally { setSeoLoading(false); }
  };

  useEffect(() => {
    if (!store.shield && store.script) runShield();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-[18px] font-bold mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <span className="text-[#d4af37]">◉</span> 알고리즘 실드 & 배포
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[13px]">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Shield Score */}
        <div className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <h3 className="text-[13px] font-bold text-white/50 mb-4">🛡 Safety Score</h3>
          {shieldLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
            </div>
          ) : store.shield ? (
            <div className="text-center">
              <div className="text-[48px] font-black" style={{ color: getScoreColor(store.shield.safety_score || 0), fontFamily: "'Outfit', sans-serif" }}>
                {store.shield.safety_score || 0}
              </div>
              <div className="text-[12px] text-white/30 mb-4">/ 100</div>
              {/* Score breakdown */}
              <div className="space-y-2 text-left">
                {store.shield.details && Object.entries(store.shield.details).map(([key, val]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-white/40">{key}</span>
                    <span className="text-white/60 font-mono">{typeof val === "number" ? val : String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-white/15 text-[13px]">스크립트가 필요합니다</div>
          )}
        </div>

        {/* SEO & Publish */}
        <div className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <h3 className="text-[13px] font-bold text-white/50 mb-4">🚀 SEO & 배포</h3>
          {seoData ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-white/30 block mb-1">제목</label>
                <div className="text-[13px] text-white/80 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>{seoData.title}</div>
              </div>
              <div>
                <label className="text-[10px] text-white/30 block mb-1">설명</label>
                <div className="text-[12px] text-white/60 p-2 rounded-lg whitespace-pre-wrap" style={{ background: "rgba(255,255,255,0.03)" }}>{seoData.description}</div>
              </div>
              {seoData.tags && (
                <div>
                  <label className="text-[10px] text-white/30 block mb-1">태그</label>
                  <div className="flex flex-wrap gap-1">
                    {seoData.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] text-white/40 border" style={{ borderColor: "var(--border)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <button onClick={generateSeo} disabled={seoLoading || !store.script}
                className="px-4 py-2 rounded-lg text-[12px] font-bold text-[#09090b] disabled:opacity-30"
                style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}>
                {seoLoading ? "생성 중..." : "SEO 메타데이터 생성"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
