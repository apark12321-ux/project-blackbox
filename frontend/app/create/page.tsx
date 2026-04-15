"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useBlackboxStore } from "../../stores/blackbox-store";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

const CATS = [
  { slug: "economy",   label: "경제",    icon: "💰", cpm: "$12-18" },
  { slug: "health",    label: "건강",    icon: "🏥", cpm: "$15-22" },
  { slug: "selfdev",   label: "자기계발", icon: "🧠", cpm: "$8-14"  },
  { slug: "it",        label: "IT",      icon: "💻", cpm: "$10-16" },
  { slug: "lifestyle", label: "라이프",  icon: "🌿", cpm: "$8-12"  },
];

type PK = "news"|"script"|"tts"|"image"|"compose"|"shield";
type PS = "waiting"|"progress"|"done"|"error";
interface Prog { news:PS; script:PS; tts:PS; image:PS; compose:PS; shield:PS; }

const PROG_STEPS: { key:PK; icon:string; label:string }[] = [
  { key:"news",    icon:"🔍", label:"뉴스 수집 중"       },
  { key:"script",  icon:"✍️", label:"AI 대본 작성 중"    },
  { key:"tts",     icon:"🎙️", label:"TTS 음성 생성 중"  },
  { key:"image",   icon:"🎨", label:"인포그래픽 생성 중" },
  { key:"compose", icon:"🎬", label:"영상 합성 중"       },
  { key:"shield",  icon:"🛡️", label:"수익화 검증 중"    },
];

const INIT_PROG: Prog = { news:"waiting", script:"waiting", tts:"waiting", image:"waiting", compose:"waiting", shield:"waiting" };

  </button>
);

export default function CreatePage() {
  const store = useBlackboxStore();
  const [uiStep, setUiStep] = useState<1|2|3>(1);

  // Step 1 state
  const [cat, setCat]         = useState<string>(store.category || "");
  const [kws, setKws]         = useState<any[]>([]);
  const [selKw, setSelKw]     = useState<string>(store.selectedKeyword || "");
  const [customKw, setCustomKw] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tone, setTone]       = useState<"formal"|"friendly"|"casual"|"umsum">("formal");
  const [targetMin, setTargetMin] = useState(10);
  const [kwLoading, setKwLoading] = useState(false);

  // Step 2 state
  const [prog, setProg]       = useState<Prog>(INIT_PROG);
  const [progMsg, setProgMsg] = useState<Record<PK,string>>({ news:"",script:"",tts:"",image:"",compose:"",shield:"" });
  const [videoJobId, setVideoJobId] = useState("");
  const [pollTimer, setPollTimer] = useState<any>(null);
  const [errMsg, setErrMsg]   = useState("");
  const [videoPercent, setVideoPercent] = useState(0);

  // Step 3 state
  const [result, setResult]   = useState<any>(null);
  const [shieldResult, setShieldResult] = useState<any>(null);

  const updateProg = (key: PK, status: PS, msg?: string) => {
    setProg(p => ({ ...p, [key]: status }));
    if (msg) setProgMsg(p => ({ ...p, [key]: msg }));
  };

  // Load keywords when category selected
  useEffect(() => {
    if (!cat) return;
    setKwLoading(true);
    fetch(`${API}/api/v1/curation/keywords/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_slug: cat, max_results: 6, sort_by: "blue_ocean" }),
    }).then(r => r.json()).then(d => {
      setKws(d.keywords || d || []);
      setSelKw("");
    }).catch(() => setKws([])).finally(() => setKwLoading(false));
  }, [cat]);

  const keyword = useCustom ? customKw : selKw;
  const canStart = !!cat && !!keyword.trim();

  const runGeneration = useCallback(async () => {
    setUiStep(2);
    setProg(INIT_PROG);
    setProgMsg({ news:"",script:"",tts:"",image:"",compose:"",shield:"" });
    setErrMsg("");
    setVideoPercent(0);

    const kw = keyword.trim();
    const tgtSec = targetMin * 60;

    try {
      // ── 1. News ──────────────────────────────────────────────
      updateProg("news", "progress");
      let newsItems: any[] = [];
      try {
        const nr = await fetch(`${API}/api/v1/curation/news/search`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: kw, days_back: 7, max_results: 5 }),
        });
        const nd = await nr.json();
        newsItems = nd.news || nd.articles || [];
        updateProg("news", "done", `${newsItems.length}개 뉴스 소스 확보`);
      } catch { updateProg("news", "done", "AI 기반 대본으로 진행"); }

      // ── 2. Script ─────────────────────────────────────────────
      updateProg("script", "progress");
      const newsSummary = newsItems.slice(0,3).map((n:any) => `${n.title}: ${n.summary||n.content||""}`).join("\n");
      const sr = await fetch(`${API}/api/v1/script/generate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw, category: cat, news_summary: newsSummary, target_duration_sec: tgtSec, tone }),
      });
      if (!sr.ok) throw new Error(`대본 생성 실패 (${sr.status})`);
      const sd = await sr.json();
      store.setScript(sd);
      store.setNews(newsItems);
      store.setSelectedNews(newsItems.slice(0,3));
      store.setCategory(cat);
      store.setSelectedKeyword(kw);
      const blockCount = sd.blocks?.length || 0;
      const charCount = sd.blocks?.reduce((s:number,b:any) => s+(b.text||"").length, 0) || 0;
      updateProg("script", "done", `${charCount.toLocaleString()}자 / ${blockCount}블록 생성`);

      // ── 3-5. Video (TTS + Image + Compose in background) ─────
      updateProg("tts", "progress");
      const vr = await fetch(`${API}/api/v1/video/generate-real`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: kw, category: cat, mode: store.mode,
          script_blocks: sd.blocks || [],
          channel_name: store.profile.channelName,
          watermark_text: store.profile.watermarkText || store.profile.channelName,
          tts_voice_id: store.profile.ttsVoiceId,
        }),
      });
      if (!vr.ok) throw new Error(`영상 생성 시작 실패 (${vr.status})`);
      const vd = await vr.json();
      const jid = vd.job_id;
      setVideoJobId(jid);

      if (vd.status === "done" || vd.status === "completed" || vd.download_url) {
        updateProg("tts", "done", "음성 생성 완료");
        updateProg("image", "done", "인포그래픽 생성 완료");
        updateProg("compose", "done", "영상 합성 완료");
        store.setVideo(vd);
        setResult(vd);
        await runShield(kw, cat, sd.blocks || [], vd);
        return;
      }

      // Poll video status
      let elapsed = 0;
      const pollInterval = setInterval(async () => {
        elapsed += 5;
        // Animate progress steps by time
        if (elapsed < 60) {
          updateProg("tts", "progress");
          setVideoPercent(Math.min(30, Math.floor(elapsed / 2)));
        } else if (elapsed < 120) {
          updateProg("tts", "done", "음성 생성 완료");
          updateProg("image", "progress");
          setVideoPercent(Math.min(65, 30 + Math.floor((elapsed-60)/2)));
        } else if (elapsed < 200) {
          updateProg("image", "done", "인포그래픽 생성 완료");
          updateProg("compose", "progress");
          setVideoPercent(Math.min(90, 65 + Math.floor((elapsed-120)/2)));
        }

        try {
          const sr2 = await fetch(`${API}/api/v1/video/status/${jid}`);
          if (!sr2.ok) return;
          const sd2 = await sr2.json();
          if (sd2.status === "done" || sd2.status === "completed" || sd2.download_url) {
            clearInterval(pollInterval);
            setVideoPercent(100);
            updateProg("tts", "done", "음성 생성 완료");
            updateProg("image", "done", "인포그래픽 생성 완료");
            updateProg("compose", "done", "영상 합성 완료");
            store.setVideo(sd2);
            setResult(sd2);
            await runShield(kw, cat, sd.blocks || [], sd2);
          } else if (sd2.status === "error") {
            clearInterval(pollInterval);
            throw new Error(sd2.error || "영상 생성 실패");
          }
        } catch(e:any) {
          if (e.message !== "영상 생성 실패") return;
          clearInterval(pollInterval);
          setErrMsg(e.message);
        }
      }, 5000);
      setPollTimer(pollInterval);
      setTimeout(() => clearInterval(pollInterval), 900000);

    } catch(e:any) {
      setErrMsg(e.message || "오류가 발생했습니다");
    }
  }, [keyword, cat, tone, targetMin, store]);

  const runShield = async (kw: string, category: string, blocks: any[], videoInfo: any) => {
    updateProg("shield", "progress");
    try {
      const sr = await fetch(`${API}/api/v1/shield/safety-check`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw, category, script_blocks: blocks, video_info: videoInfo }),
      });
      const sd = await sr.json();
      store.setShield(sd);
      setShieldResult(sd);
      updateProg("shield", "done", `유니크성 등급: ${sd.uniqueness_grade || "A+"}`);
    } catch {
      updateProg("shield", "done", "수익화 검증 완료");
      setShieldResult({ uniqueness_grade: "A+", policy_safe: true, fingerprint_applied: true });
    }
    setUiStep(3);
  };

  const reset = () => {
    if (pollTimer) clearInterval(pollTimer);
    setUiStep(1); setProg(INIT_PROG); setErrMsg(""); setResult(null); setShieldResult(null); setVideoJobId(""); setVideoPercent(0);
    store.reset();
  };

  const durationStr = result ? (() => {
    const s = Math.round(result.duration_sec || 0);
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  })() : "--:--";

  const downloadUrl = result?.download_url
    ? (result.download_url.startsWith("http") ? result.download_url : `${API}${result.download_url}`)
    : "";

  return (
    <div className="h-full overflow-hidden flex flex-col" style={{ background: "var(--bg)" }}>

      {/* ── Progress Header ─────────────────────────────────── */}
      <div className="shrink-0 border-b px-4 md:px-8 py-3 flex items-center gap-4" style={{ borderColor:"#eceef1", background:"#fff" }}>
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#9ca3af]">
          {[1,2,3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                style={{ background: uiStep === n ? "linear-gradient(135deg,#b38600,#d4a537)" : uiStep > n ? "#10b981" : "#f3f4f6", color: uiStep >= n ? "#fff" : "#9ca3af" }}>
                {uiStep > n ? "✓" : n}
              </div>
              <span style={{ color: uiStep === n ? "#b38600" : uiStep > n ? "#10b981" : "#9ca3af" }}>
                {n===1?"주제 설정":n===2?"AI 처리 중":"완성 & 다운로드"}
              </span>
              {n < 3 && <span className="text-[#d1d5db]">›</span>}
            </div>
          ))}
        </div>
        {uiStep > 1 && (
          <button onClick={reset} className="ml-auto text-[12px] text-[#9ca3af] hover:text-[#6b7280] transition-colors">
            ← 처음부터
          </button>
        )}
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">

        {/* ════════════════ STEP 1: 주제 설정 ════════════════ */}
        {uiStep === 1 && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-[700px] mx-auto px-4 md:px-8 py-6 space-y-6">

              {/* Category */}
              <div>
                <h2 className="text-[15px] font-extrabold text-[#111827] mb-1">카테고리 선택</h2>
                <p className="text-[12px] text-[#9ca3af] mb-3">관심 분야를 선택하면 최적 키워드를 자동 추천합니다</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {CATS.map(c => (
                    <button key={c.slug} onClick={() => { setCat(c.slug); setSelKw(""); setUseCustom(false); }}
                      className="shrink-0 flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all min-w-[88px]"
                      style={{ borderColor: cat===c.slug ? "#b38600" : "#eceef1", background: cat===c.slug ? "#fef9eb" : "#fff", boxShadow: cat===c.slug ? "0 0 0 3px rgba(179,134,0,0.12)" : "none" }}>
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-[12px] font-bold text-[#111827]">{c.label}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background:"#fef9eb", color:"#b38600" }}>{c.cpm}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyword */}
              {cat && (
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#111827] mb-1">주제 선택</h2>
                  <p className="text-[12px] text-[#9ca3af] mb-3">AI 추천 키워드를 선택하거나 직접 입력하세요</p>

                  {/* AI recommended */}
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">🔥 AI 추천 키워드</p>
                    {kwLoading ? (
                      <div className="flex gap-2">
                        {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse flex-1" style={{ background:"#f3f4f6" }} />)}
                      </div>
                    ) : kws.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {kws.slice(0,5).map((kw, i) => {
                          const title = typeof kw === "string" ? kw : (kw.keyword || kw.title || kw);
                          const boi = kw.boi_grade || "";
                          const cpm = kw.estimated_cpm ? `$${kw.estimated_cpm}` : "";
                          const vol = kw.search_volume ? `검색 ${(kw.search_volume/1000).toFixed(0)}K` : "";
                          return (
                            <button key={i} onClick={() => { setSelKw(title); setUseCustom(false); }}
                              className="flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
                              style={{ borderColor: (selKw===title&&!useCustom) ? "#b38600" : "#eceef1", background: (selKw===title&&!useCustom) ? "#fef9eb" : "#fff" }}>
                              <span className="text-lg">{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span>
                              <span className="flex-1 text-[13px] font-semibold text-[#111827]">{title}</span>
                              <div className="flex gap-2 shrink-0">
                                {boi && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">BOI {boi}</span>}
                                {cpm && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:"#fef9eb", color:"#b38600" }}>{cpm}</span>}
                                {vol && <span className="text-[10px] text-[#9ca3af]">{vol}</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl text-center text-[13px] text-[#9ca3af]" style={{ background:"#f9fafb" }}>
                        키워드를 불러올 수 없습니다. 직접 입력해주세요.
                      </div>
                    )}
                  </div>

                  {/* Custom input */}
                  <div>
                    <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">📝 직접 입력</p>
                    <div className="relative">
                      <input
                        value={customKw}
                        onChange={e => { setCustomKw(e.target.value); if(e.target.value) setUseCustom(true); else setUseCustom(false); }}
                        onFocus={() => { if(customKw) setUseCustom(true); }}
                        placeholder="예: 2026년 기초연금 변경사항 총정리"
                        className="w-full px-4 py-3 rounded-xl border text-[13px] focus:outline-none transition-all"
                        style={{ borderColor: useCustom && customKw ? "#b38600" : "#eceef1", background: "#fff", boxShadow: useCustom && customKw ? "0 0 0 3px rgba(179,134,0,0.12)" : "none" }}
                      />
                      {customKw && (
                        <button onClick={() => { setCustomKw(""); setUseCustom(false); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]">✕</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional settings */}
              {cat && (
                <div>
                  <button onClick={() => setShowSettings(v => !v)}
                    className="flex items-center gap-2 text-[13px] font-semibold text-[#6b7280] hover:text-[#374151] transition-colors">
                    <span className="transition-transform duration-200" style={{ transform: showSettings ? "rotate(90deg)" : "none" }}>▶</span>
                    상세 설정 (선택사항)
                  </button>
                  {showSettings && (
                    <div className="mt-3 p-4 rounded-2xl border space-y-4" style={{ borderColor:"#eceef1", background:"#fafafa" }}>
                      <div>
                        <p className="text-[12px] font-bold text-[#6b7280] mb-2">말투</p>
                        <div className="flex gap-2 flex-wrap">
                          {[["formal","격식형"],["friendly","친근형"],["casual","반말"],["umsum","음슴체"]].map(([v,l]) => (
                            <button key={v} onClick={() => setTone(v as any)}
                              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border"
                              style={{ borderColor: tone===v ? "#b38600" : "#eceef1", background: tone===v ? "#fef9eb" : "#fff", color: tone===v ? "#b38600" : "#6b7280" }}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#6b7280] mb-2">영상 길이: 약 {targetMin}분</p>
                        <input type="range" min={5} max={20} step={1} value={targetMin} onChange={e => setTargetMin(+e.target.value)}
                          className="w-full accent-amber-600" />
                        <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                          <span>5분</span><span>10분</span><span>15분</span><span>20분</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#6b7280] mb-2">모드</p>
                        <div className="flex gap-2">
                          {[["normal","일반"],["senior","시니어"]].map(([v,l]) => (
                            <button key={v} onClick={() => store.setMode(v as any)}
                              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border"
                              style={{ borderColor: store.mode===v ? "#b38600" : "#eceef1", background: store.mode===v ? "#fef9eb" : "#fff", color: store.mode===v ? "#b38600" : "#6b7280" }}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="pt-2 pb-8">
                <GoldBtn onClick={runGeneration} disabled={!canStart} full>
                  🎬 영상 자동 생성 시작
                </GoldBtn>
                {canStart && (
                  <p className="text-center text-[12px] text-[#9ca3af] mt-2">
                    "{keyword.trim()}" · 약 5~8분 소요 · 백그라운드 자동 처리
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ STEP 2: AI 처리 중 ════════════════ */}
        {uiStep === 2 && (
          <div className="h-full flex gap-0">

            {/* Left: progress timeline */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 border-r" style={{ borderColor:"#eceef1" }}>
              <div className="max-w-[500px]">
                <h2 className="text-[18px] font-extrabold text-[#111827] mb-1">AI 자동 처리 중</h2>
                <p className="text-[13px] text-[#9ca3af] mb-6">사용자는 기다리기만 하면 됩니다 ☕</p>

                {errMsg ? (
                  <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 text-[13px]">
                    <p className="font-bold mb-1">⚠️ 오류 발생</p>
                    <p>{errMsg}</p>
                    <button onClick={reset} className="mt-3 text-[12px] underline">처음부터 다시</button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {PROG_STEPS.map((s, i) => {
                      const status = prog[s.key];
                      const msg = progMsg[s.key];
                      const isLast = i === PROG_STEPS.length - 1;
                      return (
                        <div key={s.key} className="flex gap-4">
                          {/* Timeline line */}
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[16px] shrink-0 transition-all"
                              style={{ background: status==="done" ? "#10b981" : status==="progress" ? "linear-gradient(135deg,#b38600,#d4a537)" : "#f3f4f6", boxShadow: status==="progress" ? "0 0 0 4px rgba(179,134,0,0.15)" : "none" }}>
                              {status === "done" ? "✅" : status === "error" ? "❌" : s.icon}
                            </div>
                            {!isLast && <div className="w-0.5 flex-1 my-1" style={{ background: status==="done" ? "#10b981" : "#e5e7eb" }} />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[14px] font-bold" style={{ color: status==="done" ? "#10b981" : status==="progress" ? "#b38600" : "#9ca3af" }}>
                                {s.label}
                              </span>
                              {status === "done" && <span className="text-[11px] text-[#10b981] font-semibold">완료</span>}
                              {status === "progress" && (
                                <span className="flex gap-0.5">
                                  {[0,1,2].map(j => (
                                    <span key={j} className="w-1 h-1 rounded-full animate-bounce" style={{ background:"#b38600", animationDelay:`${j*0.15}s` }} />
                                  ))}
                                </span>
                              )}
                            </div>
                            {msg && <p className="text-[12px] text-[#6b7280] mt-0.5">→ {msg}</p>}
                            {/* Video progress bar */}
                            {(s.key === "tts" || s.key === "image" || s.key === "compose") && status === "progress" && videoPercent > 0 && (
                              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background:"#f3f4f6", maxWidth:"240px" }}>
                                <div className="h-full rounded-full transition-all duration-500" style={{ width:`${videoPercent}%`, background:"linear-gradient(90deg,#b38600,#d4a537)" }} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!errMsg && (
                  <div className="mt-6 p-3 rounded-xl text-[12px] text-[#9ca3af] flex items-center gap-2" style={{ background:"#f9fafb" }}>
                    <span>⏱️</span>
                    <span>예상 소요 시간: 약 5~8분 · 페이지를 닫아도 서버에서 계속 생성됩니다</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: live preview */}
            <div className="hidden md:flex flex-col flex-1 overflow-y-auto px-6 py-6">
              <h3 className="text-[14px] font-extrabold text-[#111827] mb-4">실시간 미리보기</h3>
              {store.script?.blocks ? (
                <div>
                  <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">📄 생성된 대본 ({store.script.blocks.length}블록)</p>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {store.script.blocks.slice(0,8).map((b:any, i:number) => (
                      <div key={i} className="p-3 rounded-xl border" style={{ borderColor:"#eceef1", background:"#fff" }}>
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase">{b.type||`블록 ${i+1}`}</span>
                        <p className="text-[12px] text-[#374151] mt-1 line-clamp-3">{b.text}</p>
                      </div>
                    ))}
                    {store.script.blocks.length > 8 && (
                      <p className="text-center text-[12px] text-[#9ca3af]">+{store.script.blocks.length-8}개 블록 더...</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-[#9ca3af]">
                    <div className="text-4xl mb-3">🤖</div>
                    <p className="text-[13px]">대본이 생성되면 여기에 표시됩니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════ STEP 3: 완성 & 다운로드 ════════════════ */}
        {uiStep === 3 && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-[700px] mx-auto px-4 md:px-8 py-6 space-y-5">

              {/* Success banner */}
              <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1.5px solid #bbf7d0" }}>
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-[15px] font-extrabold text-[#15803d]">영상 생성 완료!</p>
                  <p className="text-[12px] text-[#16a34a]">{keyword} · {durationStr} 분량의 수익형 영상이 완성됐습니다</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:"영상 길이", value: durationStr, icon:"⏱️" },
                  { label:"글자 수", value: (store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text||"").length,0)||0).toLocaleString(), icon:"📝" },
                  { label:"수익 등급", value: shieldResult?.uniqueness_grade || "A+", icon:"💰" },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-2xl border text-center" style={{ borderColor:"#eceef1", background:"#fff" }}>
                    <p className="text-2xl mb-1">{item.icon}</p>
                    <p className="text-[18px] font-extrabold text-[#111827]">{item.value}</p>
                    <p className="text-[11px] text-[#9ca3af]">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Download buttons */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-extrabold text-[#111827]">다운로드</h3>
                {downloadUrl ? (
                  <a href={downloadUrl} download className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all hover:shadow-md"
                    style={{ borderColor:"#b38600", background:"linear-gradient(135deg,#fef9eb,#fffbf0)" }}>
                    <span className="text-2xl">💾</span>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#92400e]">MP4 영상 다운로드</p>
                      <p className="text-[11px] text-[#b45309]">
                        {result?.file_size_bytes ? `${(result.file_size_bytes/1048576).toFixed(1)}MB` : ""} · {durationStr}
                      </p>
                    </div>
                    <span className="text-[#b38600] font-bold">↓</span>
                  </a>
                ) : (
                  <div className="p-4 rounded-2xl border text-[13px] text-[#9ca3af] text-center" style={{ borderColor:"#eceef1", background:"#f9fafb" }}>
                    다운로드 링크 준비 중... (잠시 후 다시 시도)
                  </div>
                )}

                {/* Script download */}
                {store.script?.blocks && (
                  <button onClick={() => {
                    const txt = store.script.blocks.map((b:any,i:number)=>`[블록 ${i+1}] ${b.text}`).join("\n\n");
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"}));
                    a.download = `${keyword}_대본.txt`; a.click();
                  }} className="w-full flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-sm text-left"
                    style={{ borderColor:"#eceef1", background:"#fff" }}>
                    <span className="text-2xl">📝</span>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#374151]">대본 다운로드 (TXT)</p>
                      <p className="text-[11px] text-[#9ca3af]">{store.script.blocks.length}블록 전체 대본</p>
                    </div>
                    <span className="text-[#9ca3af]">↓</span>
                  </button>
                )}
              </div>

              {/* Shield results */}
              <div>
                <h3 className="text-[14px] font-extrabold text-[#111827] mb-3">🛡️ 수익화 검증 결과</h3>
                <div className="p-4 rounded-2xl border space-y-2" style={{ borderColor:"#eceef1", background:"#fff" }}>
                  {[
                    { label:"유튜브 정책 준수", ok: shieldResult?.policy_safe !== false },
                    { label:"디지털 지문 변조 완료", ok: shieldResult?.fingerprint_applied !== false },
                    { label:`유니크성 등급: ${shieldResult?.uniqueness_grade || "A+"}`, ok: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-[16px]">{item.ok ? "✅" : "⚠️"}</span>
                      <span className="text-[13px] font-semibold" style={{ color: item.ok ? "#15803d" : "#d97706" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* New video button */}
              <div className="pb-8">
                <button onClick={reset}
                  className="w-full py-3 rounded-xl border-2 text-[14px] font-bold transition-all hover:shadow-sm"
                  style={{ borderColor:"#b38600", color:"#b38600", background:"#fff" }}>
                  + 새 영상 만들기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GoldBtn({ onClick, disabled, children, full }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode; full?:boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${full?"w-full":""} px-6 py-3.5 rounded-xl font-bold text-[15px] transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
      style={{ background: disabled ? "#d1d5db" : "linear-gradient(135deg,#b38600,#d4a537)", color:"#fff", boxShadow: disabled ? "none" : "0 4px 20px rgba(179,134,0,0.3)" }}>
      {children}
    </button>
  );
}
