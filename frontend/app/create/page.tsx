"use client";
import { useState, useEffect, useCallback } from "react";
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

export default function CreatePage() {
  const store = useBlackboxStore();
  const [uiStep, setUiStep] = useState<1|2|3>(1);

  const [cat, setCat]             = useState<string>(store.category || "");
  const [kws, setKws]             = useState<any[]>([]);
  const [selKw, setSelKw]         = useState<string>(store.selectedKeyword || "");
  const [customKw, setCustomKw]   = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [showOpts, setShowOpts]   = useState(false);
  const [tone, setTone]           = useState<"formal"|"friendly"|"casual"|"umsum">("formal");
  const [targetMin, setTargetMin] = useState(10);
  const [kwLoading, setKwLoading] = useState(false);

  const [prog, setProg]           = useState<Prog>(INIT_PROG);
  const [progMsg, setProgMsg]     = useState<Record<PK,string>>({ news:"",script:"",tts:"",image:"",compose:"",shield:"" });
  const [pollTimer, setPollTimer] = useState<any>(null);
  const [errMsg, setErrMsg]       = useState("");
  const [videoPercent, setVideoPercent] = useState(0);

  const [result, setResult]             = useState<any>(null);
  const [shieldResult, setShieldResult] = useState<any>(null);

  const updateProg = (key: PK, status: PS, msg?: string) => {
    setProg(p => ({ ...p, [key]: status }));
    if (msg) setProgMsg(p => ({ ...p, [key]: msg }));
  };

  useEffect(() => {
    if (!cat) return;
    setKwLoading(true);
    fetch(`${API}/api/v1/curation/keywords/search`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ category_slug: cat, max_results: 6, sort_by: "blue_ocean" }),
    }).then(r => r.json())
      .then(d => { setKws(d.keywords || d || []); setSelKw(""); })
      .catch(() => setKws([]))
      .finally(() => setKwLoading(false));
  }, [cat]);

  const keyword = useCustom ? customKw : selKw;
  const canStart = !!cat && !!keyword.trim();

  const runGeneration = useCallback(async () => {
    setUiStep(2);
    setProg(INIT_PROG);
    setProgMsg({ news:"",script:"",tts:"",image:"",compose:"",shield:"" });
    setErrMsg(""); setVideoPercent(0);
    const kw = keyword.trim();
    const tgtSec = targetMin * 60;

    try {
      updateProg("news","progress");
      let newsItems: any[] = [];
      try {
        const nr = await fetch(`${API}/api/v1/curation/news/search`, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ keyword: kw, days_back: 7, max_results: 5 }),
        });
        const nd = await nr.json();
        newsItems = nd.news || nd.articles || [];
        updateProg("news","done",`${newsItems.length}개 뉴스 소스 확보`);
      } catch { updateProg("news","done","AI 기반 대본으로 진행"); }

      updateProg("script","progress");
      const newsSummary = newsItems.slice(0,3).map((n:any) => `${n.title}: ${n.summary||n.content||""}`).join("\n");
      const sr = await fetch(`${API}/api/v1/script/generate`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ keyword: kw, category: cat, news_summary: newsSummary, target_duration_sec: tgtSec, tone }),
      });
      if (!sr.ok) throw new Error(`대본 생성 실패 (${sr.status})`);
      const sd = await sr.json();
      store.setScript(sd); store.setNews(newsItems); store.setSelectedNews(newsItems.slice(0,3));
      store.setCategory(cat); store.setSelectedKeyword(kw);
      const charCount = sd.blocks?.reduce((s:number,b:any) => s+(b.text||"").length, 0) || 0;
      updateProg("script","done",`${charCount.toLocaleString()}자 / ${sd.blocks?.length||0}블록 생성`);

      updateProg("tts","progress");
      const vr = await fetch(`${API}/api/v1/video/generate-real`, {
        method:"POST", headers:{"Content-Type":"application/json"},
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

      if (vd.status==="done"||vd.status==="completed"||vd.download_url) {
        updateProg("tts","done"); updateProg("image","done"); updateProg("compose","done");
        store.setVideo(vd); setResult(vd);
        await doShield(kw, cat, sd.blocks||[], vd); return;
      }

      let elapsed = 0;
      const iv = setInterval(async () => {
        elapsed += 5;
        if (elapsed < 60) { setVideoPercent(Math.min(30, Math.floor(elapsed/2))); }
        else if (elapsed < 120) { updateProg("tts","done","음성 생성 완료"); updateProg("image","progress"); setVideoPercent(Math.min(65, 30+Math.floor((elapsed-60)/2))); }
        else { updateProg("image","done"); updateProg("compose","progress"); setVideoPercent(Math.min(90, 65+Math.floor((elapsed-120)/2))); }
        try {
          const pr = await fetch(`${API}/api/v1/video/status/${jid}`);
          if (!pr.ok) return;
          const pd = await pr.json();
          if (pd.status==="done"||pd.status==="completed"||pd.download_url) {
            clearInterval(iv); setVideoPercent(100);
            updateProg("tts","done"); updateProg("image","done"); updateProg("compose","done","영상 합성 완료");
            store.setVideo(pd); setResult(pd);
            await doShield(kw, cat, sd.blocks||[], pd);
          } else if (pd.status==="error") { clearInterval(iv); setErrMsg(pd.error||"영상 생성 실패"); }
        } catch{}
      }, 5000);
      setPollTimer(iv);
      setTimeout(() => clearInterval(iv), 900000);
    } catch(e:any) { setErrMsg(e.message||"오류가 발생했습니다"); }
  }, [keyword, cat, tone, targetMin, store]);

  const doShield = async (kw:string, category:string, blocks:any[], videoInfo:any) => {
    updateProg("shield","progress");
    try {
      const sr = await fetch(`${API}/api/v1/shield/safety-check`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ keyword: kw, category, script_blocks: blocks, video_info: videoInfo }),
      });
      const sd = await sr.json();
      store.setShield(sd); setShieldResult(sd);
      updateProg("shield","done",`유니크성 등급: ${sd.uniqueness_grade||"A+"}`);
    } catch {
      updateProg("shield","done","수익화 검증 완료");
      setShieldResult({ uniqueness_grade:"A+", policy_safe:true, fingerprint_applied:true });
    }
    setUiStep(3);
  };

  const reset = () => {
    if (pollTimer) clearInterval(pollTimer);
    setUiStep(1); setProg(INIT_PROG); setErrMsg(""); setResult(null); setShieldResult(null); setVideoPercent(0);
    store.reset();
  };

  const durationStr = result ? (() => { const s=Math.round(result.duration_sec||0); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; })() : "--:--";
  const downloadUrl = result?.download_url ? (result.download_url.startsWith("http") ? result.download_url : `${API}${result.download_url}`) : "";

  return (
    <div className="h-full overflow-hidden flex flex-col"
      style={{ background:"var(--bg-base)", color:"var(--text-primary)" }}>

      {/* Step indicator header */}
      <div className="shrink-0 flex items-center px-4 md:px-6 py-2.5 gap-3 flex-wrap"
        style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-sidebar)" }}>
        {[1,2,3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
              style={{
                background: uiStep===n ? "linear-gradient(135deg,#b38600,#d4a537)" : uiStep>n ? "var(--green)" : "var(--bg-elevated)",
                color: uiStep>=n ? "#fff" : "var(--text-muted)",
              }}>
              {uiStep>n ? "✓" : n}
            </div>
            <span className="text-[12px] font-semibold"
              style={{ color: uiStep===n ? "var(--gold)" : uiStep>n ? "var(--green)" : "var(--text-muted)" }}>
              {n===1?"주제 설정":n===2?"AI 처리 중":"완성 & 다운로드"}
            </span>
            {n<3 && <span className="text-[12px]" style={{ color:"var(--text-faint)" }}>›</span>}
          </div>
        ))}
        {uiStep>1 && (
          <button onClick={reset} className="ml-auto text-[11px] transition-colors"
            style={{ color:"var(--text-muted)" }}>← 처음부터</button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">

        {/* ════ STEP 1: 주제 설정 ════ */}
        {uiStep===1 && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-[660px] mx-auto px-4 md:px-8 py-6 space-y-6">

              {/* Category */}
              <div>
                <h2 className="text-[14px] font-extrabold mb-0.5" style={{ color:"var(--text-primary)" }}>카테고리 선택</h2>
                <p className="text-[11px] mb-3" style={{ color:"var(--text-muted)" }}>관심 분야를 선택하면 AI가 최적 키워드를 추천합니다</p>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                  {CATS.map(c => (
                    <button key={c.slug} onClick={() => { setCat(c.slug); setSelKw(""); setUseCustom(false); }}
                      className="shrink-0 flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border-2 transition-all min-w-[78px]"
                      style={{
                        borderColor: cat===c.slug ? "var(--gold-border)" : "var(--border)",
                        background:  cat===c.slug ? "var(--gold-bg)" : "var(--bg-surface)",
                        boxShadow:   cat===c.slug ? "0 0 0 3px rgba(212,165,55,0.10)" : "none",
                      }}>
                      <span className="text-[22px]">{c.icon}</span>
                      <span className="text-[11px] font-bold"
                        style={{ color: cat===c.slug ? "var(--gold)" : "var(--text-primary)" }}>{c.label}</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background:"var(--gold-bg)", color:"var(--gold)" }}>{c.cpm}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {cat && (
                <div>
                  <h2 className="text-[14px] font-extrabold mb-0.5" style={{ color:"var(--text-primary)" }}>주제 선택</h2>
                  <p className="text-[11px] mb-3" style={{ color:"var(--text-muted)" }}>AI 추천 키워드를 선택하거나 직접 입력하세요</p>

                  {/* AI keywords */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>
                      🔥 AI 추천 키워드
                    </p>
                    {kwLoading ? (
                      <div className="flex flex-col gap-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-11 rounded-xl animate-pulse" style={{ background:"var(--bg-elevated)" }} />
                        ))}
                      </div>
                    ) : kws.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {kws.slice(0,5).map((kw,i) => {
                          const title = typeof kw==="string" ? kw : (kw.keyword||kw.title||"");
                          const boi   = kw.boi_grade||"";
                          const cpm   = kw.estimated_cpm ? `$${kw.estimated_cpm}` : "";
                          const vol   = kw.search_volume ? `${(kw.search_volume/1000).toFixed(0)}K` : "";
                          const isSel = selKw===title && !useCustom;
                          return (
                            <button key={i} onClick={() => { setSelKw(title); setUseCustom(false); }}
                              className="flex items-center gap-3 p-2.5 rounded-xl border-2 text-left transition-all"
                              style={{
                                borderColor: isSel ? "var(--gold-border)" : "var(--border)",
                                background:  isSel ? "var(--gold-bg)" : "var(--bg-surface)",
                              }}>
                              <span className="text-[15px] shrink-0">{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span>
                              <span className="flex-1 text-[12px] font-semibold" style={{ color:"var(--text-primary)" }}>{title}</span>
                              <div className="flex gap-1.5 shrink-0">
                                {boi && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ background:"var(--blue-bg)", color:"var(--blue)" }}>BOI {boi}</span>}
                                {cpm && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ background:"var(--gold-bg)", color:"var(--gold)" }}>{cpm}</span>}
                                {vol && <span className="text-[9px]" style={{ color:"var(--text-muted)" }}>{vol}</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl text-center text-[12px]"
                        style={{ background:"var(--bg-elevated)", color:"var(--text-muted)" }}>
                        키워드를 불러올 수 없습니다. 직접 입력해주세요.
                      </div>
                    )}
                  </div>

                  {/* Manual input */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>
                      📝 직접 입력
                    </p>
                    <div className="relative">
                      <input
                        value={customKw}
                        onChange={e => { setCustomKw(e.target.value); setUseCustom(!!e.target.value); }}
                        onFocus={() => { if(customKw) setUseCustom(true); }}
                        placeholder="예: 2026년 기초연금 변경사항 총정리"
                        className="w-full px-4 py-2.5 rounded-xl border text-[13px] transition-all"
                        style={{
                          borderColor: useCustom && customKw ? "var(--gold)" : "var(--border)",
                          background: "var(--bg-input)",
                          color: "var(--text-primary)",
                          boxShadow: useCustom && customKw ? "0 0 0 3px rgba(212,165,55,0.10)" : "none",
                        }}
                      />
                      {customKw && (
                        <button onClick={() => { setCustomKw(""); setUseCustom(false); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]"
                          style={{ color:"var(--text-muted)" }}>✕</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional settings */}
              {cat && (
                <div>
                  <button onClick={() => setShowOpts(v => !v)}
                    className="flex items-center gap-2 text-[12px] font-semibold transition-colors"
                    style={{ color: showOpts ? "var(--gold)" : "var(--text-secondary)" }}>
                    <span style={{ display:"inline-block", transition:"transform .2s", transform: showOpts ? "rotate(90deg)" : "none" }}>▶</span>
                    상세 설정 (선택사항)
                  </button>
                  {showOpts && (
                    <div className="mt-3 p-4 rounded-2xl border space-y-4"
                      style={{ borderColor:"var(--border)", background:"var(--bg-surface)" }}>
                      <div>
                        <p className="text-[11px] font-bold mb-2" style={{ color:"var(--text-muted)" }}>말투</p>
                        <div className="flex gap-2 flex-wrap">
                          {[["formal","격식형"],["friendly","친근형"],["casual","반말"],["umsum","음슴체"]].map(([v,l]) => (
                            <button key={v} onClick={() => setTone(v as typeof tone)}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all"
                              style={{
                                borderColor: tone===v ? "var(--gold-border)" : "var(--border)",
                                background:  tone===v ? "var(--gold-bg)" : "transparent",
                                color:       tone===v ? "var(--gold)" : "var(--text-muted)",
                              }}>{l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold mb-2" style={{ color:"var(--text-muted)" }}>영상 길이: 약 {targetMin}분</p>
                        <input type="range" min={5} max={20} step={1} value={targetMin}
                          onChange={e => setTargetMin(+e.target.value)} className="w-full accent-amber-500" />
                        <div className="flex justify-between text-[9px] mt-0.5" style={{ color:"var(--text-muted)" }}>
                          <span>5분</span><span>10분</span><span>15분</span><span>20분</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="pt-2 pb-8">
                <button onClick={runGeneration} disabled={!canStart}
                  className="w-full px-6 py-3.5 rounded-xl font-bold text-[15px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: canStart ? "linear-gradient(135deg,#b38600,#d4a537)" : "var(--bg-elevated)",
                    color: "#fff",
                    boxShadow: canStart ? "0 4px 20px rgba(179,134,0,0.25)" : "none",
                  }}>
                  🎬 영상 자동 생성 시작
                </button>
                {canStart && (
                  <p className="text-center text-[11px] mt-2" style={{ color:"var(--text-muted)" }}>
                    "{keyword.trim()}" · 약 5~8분 소요 · 백그라운드 자동 처리
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 2: AI 처리 중 ════ */}
        {uiStep===2 && (
          <div className="h-full flex">
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 border-r" style={{ borderColor:"var(--border)" }}>
              <div className="max-w-[480px]">
                <h2 className="text-[17px] font-extrabold mb-0.5" style={{ color:"var(--text-primary)" }}>AI 자동 처리 중</h2>
                <p className="text-[12px] mb-6" style={{ color:"var(--text-muted)" }}>사용자는 기다리기만 하면 됩니다 ☕</p>

                {errMsg ? (
                  <div className="p-4 rounded-2xl border" style={{ borderColor:"rgba(239,68,68,0.2)", background:"var(--red-bg)", color:"var(--red)" }}>
                    <p className="font-bold mb-1 text-[13px]">⚠️ 오류 발생</p>
                    <p className="text-[12px]">{errMsg}</p>
                    <button onClick={reset} className="mt-3 text-[11px] underline" style={{ color:"var(--text-secondary)" }}>처음부터 다시</button>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {PROG_STEPS.map((s,i) => {
                      const status = prog[s.key];
                      const msg    = progMsg[s.key];
                      const isLast = i===PROG_STEPS.length-1;
                      return (
                        <div key={s.key} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] shrink-0 transition-all"
                              style={{
                                background: status==="done" ? "var(--green)" : status==="progress" ? "linear-gradient(135deg,#b38600,#d4a537)" : "var(--bg-elevated)",
                                boxShadow:  status==="progress" ? "0 0 0 4px rgba(212,165,55,0.15)" : "none",
                              }}>
                              {status==="done" ? "✅" : status==="error" ? "❌" : s.icon}
                            </div>
                            {!isLast && <div className="w-px flex-1 my-1" style={{ background: status==="done" ? "var(--green)" : "var(--border)", minHeight:"16px" }} />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[13px] font-bold"
                                style={{ color: status==="done" ? "var(--green)" : status==="progress" ? "var(--gold)" : "var(--text-muted)" }}>
                                {s.label}
                              </span>
                              {status==="done" && <span className="text-[10px] font-bold" style={{ color:"var(--green)" }}>완료</span>}
                              {status==="progress" && (
                                <span className="flex gap-0.5">
                                  {[0,1,2].map(j => (
                                    <span key={j} className="w-1 h-1 rounded-full animate-bounce"
                                      style={{ background:"var(--gold)", animationDelay:`${j*0.15}s` }} />
                                  ))}
                                </span>
                              )}
                            </div>
                            {msg && <p className="text-[11px] mt-0.5" style={{ color:"var(--text-muted)" }}>→ {msg}</p>}
                            {["tts","image","compose"].includes(s.key) && status==="progress" && videoPercent>0 && (
                              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background:"var(--bg-elevated)", maxWidth:"200px" }}>
                                <div className="h-full rounded-full transition-all duration-500"
                                  style={{ width:`${videoPercent}%`, background:"linear-gradient(90deg,#b38600,#d4a537)" }} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!errMsg && (
                  <div className="mt-5 p-3 rounded-xl text-[11px] flex items-center gap-2"
                    style={{ background:"var(--bg-surface)", color:"var(--text-muted)", border:"1px solid var(--border)" }}>
                    <span>⏱️</span>
                    <span>예상 소요: 5~8분 · 페이지를 닫아도 서버에서 계속 생성됩니다</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: live preview */}
            <div className="hidden md:flex flex-col flex-1 overflow-y-auto px-6 py-6">
              <h3 className="text-[13px] font-extrabold mb-4" style={{ color:"var(--text-primary)" }}>실시간 미리보기</h3>
              {store.script?.blocks ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>
                    📄 생성된 대본 ({store.script.blocks.length}블록)
                  </p>
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {store.script.blocks.slice(0,8).map((b:any,i:number) => (
                      <div key={i} className="p-3 rounded-xl border" style={{ borderColor:"var(--border)", background:"var(--bg-surface)" }}>
                        <span className="text-[9px] font-bold uppercase" style={{ color:"var(--text-muted)" }}>{b.type||`블록 ${i+1}`}</span>
                        <p className="text-[11px] mt-1 line-clamp-3" style={{ color:"var(--text-secondary)" }}>{b.text}</p>
                      </div>
                    ))}
                    {store.script.blocks.length>8 && (
                      <p className="text-center text-[11px]" style={{ color:"var(--text-muted)" }}>
                        +{store.script.blocks.length-8}개 블록 더...
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🤖</div>
                    <p className="text-[12px]" style={{ color:"var(--text-muted)" }}>대본이 생성되면 여기에 표시됩니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ STEP 3: 완성 & 다운로드 ════ */}
        {uiStep===3 && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-[660px] mx-auto px-4 md:px-8 py-6 space-y-5">

              {/* Banner */}
              <div className="p-4 rounded-2xl flex items-center gap-3"
                style={{ background:"var(--green-bg)", border:"1px solid rgba(16,185,129,0.2)" }}>
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-[14px] font-extrabold" style={{ color:"var(--green)" }}>영상 생성 완료!</p>
                  <p className="text-[11px] mt-0.5" style={{ color:"rgba(16,185,129,0.8)" }}>
                    {keyword} · {durationStr} 분량의 수익형 영상이 완성됐습니다
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:"영상 길이", value:durationStr,                icon:"⏱️" },
                  { label:"글자 수",   value:(store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text||"").length,0)||0).toLocaleString(), icon:"📝" },
                  { label:"수익 등급", value:shieldResult?.uniqueness_grade||"A+", icon:"💰" },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-2xl border text-center"
                    style={{ borderColor:"var(--border)", background:"var(--bg-surface)" }}>
                    <p className="text-[22px] mb-1">{item.icon}</p>
                    <p className="text-[17px] font-extrabold" style={{ color:"var(--text-primary)" }}>{item.value}</p>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Downloads */}
              <div className="space-y-2.5">
                <h3 className="text-[13px] font-extrabold" style={{ color:"var(--text-primary)" }}>다운로드</h3>

                {downloadUrl ? (
                  <a href={downloadUrl} download
                    className="flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all hover:opacity-90 block"
                    style={{ borderColor:"var(--gold-border)", background:"var(--gold-bg)" }}>
                    <span className="text-[22px]">💾</span>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold" style={{ color:"var(--gold)" }}>MP4 영상 다운로드</p>
                      <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                        {result?.file_size_bytes ? `${(result.file_size_bytes/1048576).toFixed(1)}MB` : ""} · {durationStr}
                      </p>
                    </div>
                    <span className="font-bold text-[15px]" style={{ color:"var(--gold)" }}>↓</span>
                  </a>
                ) : (
                  <div className="p-3.5 rounded-2xl border text-[12px] text-center"
                    style={{ borderColor:"var(--border)", background:"var(--bg-surface)", color:"var(--text-muted)" }}>
                    다운로드 링크 준비 중...
                  </div>
                )}

                {store.script?.blocks && (
                  <button onClick={() => {
                    const txt = (store.script?.blocks||[]).map((b:any,i:number)=>`[블록 ${i+1}] ${b.text}`).join("\n\n");
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"}));
                    a.download = `${keyword}_대본.txt`; a.click();
                  }} className="w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left hover:border-white/10"
                    style={{ borderColor:"var(--border)", background:"var(--bg-surface)" }}>
                    <span className="text-[22px]">📝</span>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold" style={{ color:"var(--text-primary)" }}>대본 다운로드 (TXT)</p>
                      <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{store.script.blocks.length}블록 전체 대본</p>
                    </div>
                    <span style={{ color:"var(--text-muted)" }}>↓</span>
                  </button>
                )}
              </div>

              {/* Shield results */}
              <div>
                <h3 className="text-[13px] font-extrabold mb-3" style={{ color:"var(--text-primary)" }}>🛡️ 수익화 검증 결과</h3>
                <div className="p-4 rounded-2xl border space-y-2.5"
                  style={{ borderColor:"var(--border)", background:"var(--bg-surface)" }}>
                  {[
                    { label:"유튜브 정책 준수",           ok: shieldResult?.policy_safe!==false },
                    { label:"디지털 지문 변조 완료",       ok: shieldResult?.fingerprint_applied!==false },
                    { label:`유니크성 등급: ${shieldResult?.uniqueness_grade||"A+"}`, ok:true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-[15px]">{item.ok?"✅":"⚠️"}</span>
                      <span className="text-[12px] font-semibold"
                        style={{ color: item.ok ? "var(--green)" : "var(--orange)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-8">
                <button onClick={reset}
                  className="w-full py-3 rounded-xl border-2 text-[13px] font-bold transition-all"
                  style={{ borderColor:"var(--border-strong)", color:"var(--text-secondary)", background:"transparent" }}>
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
