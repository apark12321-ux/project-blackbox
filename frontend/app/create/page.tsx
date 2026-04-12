"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect, useRef } from "react";

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

/* ── Helpers ── */
function boiGrade(s: number) {
  if (s >= 4.5) return { grade: "A+", color: "#34d399", bg: "rgba(52,211,153,0.12)", glow: "glow-green" };
  if (s >= 3.8) return { grade: "A", color: "#34d399", bg: "rgba(52,211,153,0.08)", glow: "" };
  if (s >= 3.0) return { grade: "B+", color: "#d4af37", bg: "rgba(212,175,55,0.10)", glow: "" };
  if (s >= 2.2) return { grade: "B", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", glow: "" };
  return { grade: "C", color: "#f87171", bg: "rgba(248,113,113,0.08)", glow: "" };
}
function fmtVol(v: number) {
  if (v >= 1e6) return `${(v/1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v/1e3).toFixed(0)}K`;
  return String(v);
}
function momentum(m: number) {
  if (m > 0.15) return { icon: "↑", color: "#34d399", label: "상승" };
  if (m > 0) return { icon: "→", color: "#d4af37", label: "보합" };
  return { icon: "↓", color: "#f87171", label: "하락" };
}

/* ═══════════════════════════════════════════════════════════════════
   MODULE A — 큐레이션
   ═══════════════════════════════════════════════════════════════════ */
function CurationPage() {
  const store = useBlackboxStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/v1/curation/categories`).then(r=>r.json()).then(d=>setCategories(d.categories||[])).catch(()=>{});
  }, []);

  const handleCategory = async (slug: string) => {
    store.setCategory(slug); store.setStep(1); setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/keywords/search`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({category_slug:slug,max_results:10,sort_by:"blue_ocean"}) });
      if (!res.ok) throw new Error(`키워드 로드 실패 (${res.status})`);
      store.setKeywords((await res.json()).keywords || []);
      try { const b = await fetch(`${API}/api/v1/curation/benchmarks/${slug}`); if(b.ok) store.setBenchmarks(await b.json()); } catch{}
    } catch(e:any){setError(e.message)} finally{setLoading(false)}
  };

  const handleKeyword = async (kw: any) => {
    store.setSelectedKeyword(kw.keyword); store.setStep(2); setNewsLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/v1/curation/news/search`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({keyword:kw.keyword,days_back:7,max_results:10}) });
      if (!res.ok) throw new Error(`뉴스 로드 실패`);
      store.setNews((await res.json()).articles || []);
    } catch(e:any){setError(e.message)} finally{setNewsLoading(false)}
  };

  const toggleNews = (a:any) => {
    const c = store.selectedNews;
    store.setSelectedNews(c.find((n:any)=>n.id===a.id) ? c.filter((n:any)=>n.id!==a.id) : [...c,a]);
  };

  return (
    <div className="flex h-full">
      {/* ── LEFT PANEL ── */}
      <div className="w-[520px] shrink-0 border-r flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        {/* Categories */}
        <div className="p-6 border-b" style={{borderColor:"var(--border)"}}>
          <h3 className="text-[15px] font-bold text-white/50 mb-4" style={{fontFamily:"var(--font-display)"}}>카테고리 선택</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const active = store.category === cat.slug;
              return (
                <button key={cat.slug} onClick={() => handleCategory(cat.slug)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 group
                    ${active ? "border-[#d4af37]/40 glow-gold" : "border-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.02]"}`}
                  style={active ? {background:"rgba(212,175,55,0.08)"} : {}}>
                  <span className="text-[22px] group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <div className="text-left">
                    <div className={`text-[14px] font-bold ${active ? "text-[#d4af37]" : "text-white/70"}`}>{cat.label_ko}</div>
                    <div className="text-[12px] text-white/25 font-medium" style={{fontFamily:"var(--font-mono)"}}>{cat.cpm_range}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keywords */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-[15px] font-bold text-white/50 mb-4" style={{fontFamily:"var(--font-display)"}}>
            황금 키워드 <span className="text-[12px] text-white/20 ml-2">{store.keywords.length > 0 ? `${store.keywords.length}개` : ""}</span>
          </h3>

          {loading ? <Spinner className="mt-16" /> : store.keywords.length > 0 ? (
            <div className="space-y-2">
              {store.keywords.map((kw:any, i:number) => {
                const sel = store.selectedKeyword === kw.keyword;
                const g = boiGrade(kw.blue_ocean_index||0);
                const m = momentum(kw.trend_momentum||0);
                return (
                  <div key={i} onClick={() => handleKeyword(kw)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 animate-fade-up
                      ${sel ? "border-[#d4af37]/30 glow-gold" : "border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.015]"}`}
                    style={{animationDelay:`${i*60}ms`, ...(sel ? {background:"rgba(212,175,55,0.05)"} : {})}}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[12px] text-white/20 font-bold w-6" style={{fontFamily:"var(--font-mono)"}}>{i+1}</span>
                      <span className={`text-[16px] font-bold flex-1 ${sel ? "text-[#d4af37]" : "text-white/85"}`}>{kw.keyword}</span>
                      {/* BOI Grade Badge */}
                      <span className="text-[13px] font-black px-2.5 py-1 rounded-lg" style={{color:g.color,background:g.bg}}>
                        {g.grade}
                      </span>
                    </div>
                    {/* Data row */}
                    <div className="flex items-center gap-4 ml-9">
                      {/* BOI Bar */}
                      <div className="flex-1">
                        <div className="h-[5px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
                          <div className="h-full rounded-full animate-bar-fill" style={{width:`${Math.min(100,(kw.blue_ocean_index/5)*100)}%`,background:g.color}} />
                        </div>
                      </div>
                      <DataChip label="검색" value={fmtVol(kw.search_volume||0)} />
                      <DataChip label="경쟁" value={String(kw.competition_count||0)} />
                      <span className="text-[13px] font-bold" style={{color:m.color}}>{m.icon} {m.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/15">
              <span className="text-[40px] mb-3">◈</span>
              <span className="text-[15px]">카테고리를 선택하세요</span>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: News ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>뉴스 소스 피드</h3>
          {store.selectedNews.length > 0 && (
            <span className="text-[13px] font-bold text-[#34d399] px-3 py-1 rounded-lg" style={{background:"rgba(52,211,153,0.1)"}}>
              {store.selectedNews.length}개 선택
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {error && <ErrorBanner>{error}</ErrorBanner>}
          {newsLoading ? <Spinner className="mt-16" /> : store.news.length > 0 ? (
            <div className="space-y-3">
              {store.news.map((a:any,i:number) => {
                const sel = store.selectedNews.some((n:any)=>n.id===a.id);
                return (
                  <div key={a.id} onClick={()=>toggleNews(a)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 group animate-fade-up
                      ${sel ? "border-[#34d399]/30" : "border-white/[0.04] hover:border-white/[0.08]"}`}
                    style={{animationDelay:`${i*50}ms`, background:sel?"rgba(52,211,153,0.03)":"var(--bg-card)"}}>
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 text-[13px] font-bold transition-all
                        ${sel ? "border-[#34d399] bg-[#34d399]/15 text-[#34d399]" : "border-white/10 text-transparent group-hover:border-white/20"}`}>✓</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className={`text-[16px] font-bold leading-snug ${sel?"text-white/90":"text-white/70"}`}>{a.title}</span>
                          <span className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-full"
                            style={{background:"linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))",color:"#d4af37",border:"1px solid rgba(212,175,55,0.2)"}}>
                            {a.cpm_level}
                          </span>
                        </div>
                        {a.summary && <p className="text-[13px] text-white/35 leading-relaxed line-clamp-2 mb-3">{a.summary}</p>}
                        <div className="flex items-center gap-4 text-[12px] text-white/25">
                          <span className="font-semibold">{a.source_name}</span>
                          {a.time_ago && <span>{a.time_ago}</span>}
                          <span className="ml-auto text-[11px]">관련도 <span className="font-bold text-white/40">{(a.relevance_score*100).toFixed(0)}%</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/15">
              <span className="text-[40px] mb-3">📰</span>
              <span className="text-[15px]">키워드를 선택하면 뉴스가 표시됩니다</span>
            </div>
          )}
        </div>
        {store.selectedNews.length > 0 && (
          <div className="p-5 border-t" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
            <button onClick={()=>{store.setStep(3);store.setActivePage("script");}}
              className="w-full py-4 rounded-2xl text-[16px] font-bold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.99] animate-pulse-glow"
              style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 8px 32px rgba(212,175,55,0.3)"}}>
              스크립트 생성 → ({store.selectedNews.length}개 소스)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE B — 스크립트
   ═══════════════════════════════════════════════════════════════════ */
function ScriptPage() {
  const store = useBlackboxStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<number|null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => { if(!store.script && store.selectedKeyword && store.selectedNews.length>0) gen(); }, []);

  const gen = async () => {
    setLoading(true); setError(null);
    try {
      const ns = store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n");
      const r = await fetch(`${API}/api/v1/script/generate`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],opinion_seeds:[],hook_triggers:[],target_duration_sec:480})});
      if(!r.ok) throw new Error(`생성 실패 (${r.status})`);
      store.setScript(await r.json()); store.setStep(4);
    } catch(e:any){setError(e.message)} finally{setLoading(false)}
  };

  const editBlock = async (i:number) => {
    if(!store.script) return;
    try { const r = await fetch(`${API}/api/v1/script/edit-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,new_text:editText,blocks:store.script.blocks})}); if(r.ok){const d=await r.json();store.setScript({...store.script,blocks:d.blocks||d});setEditingBlock(null);} } catch{}
  };
  const regenBlock = async (i:number) => {
    if(!store.script) return;
    try { const r = await fetch(`${API}/api/v1/script/regenerate-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,keyword:store.selectedKeyword,category:store.category,instruction:"",blocks:store.script.blocks})}); if(r.ok){const d=await r.json();store.setScript({...store.script,blocks:d.blocks||d});} } catch{}
  };
  const extend = async () => {
    if(!store.script)return; setLoading(true);
    try { const r = await fetch(`${API}/api/v1/script/extend`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,current_blocks:store.script.blocks,extend_paragraphs:3,instruction:""})}); if(r.ok){const d=await r.json();store.setScript({...store.script,blocks:d.blocks||d});} } catch{} finally{setLoading(false)}
  };
  const rewrite = async () => {
    if(!store.script)return; setLoading(true);
    try { const ns=store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n"); const r=await fetch(`${API}/api/v1/script/rewrite`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],instruction:"",target_duration_sec:480})}); if(r.ok) store.setScript(await r.json()); } catch{} finally{setLoading(false)}
  };

  const dur = store.script?.total_duration_sec||0;
  const chars = store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text?.length||0),0)||0;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>AI 스크립트</h3>
          {store.script && (
            <div className="flex items-center gap-5">
              <StatBadge label="글자" value={`${chars.toLocaleString()}`} color="#d4af37" />
              <StatBadge label="시간" value={`${Math.floor(dur/60)}:${String(Math.round(dur%60)).padStart(2,'0')}`} color="#60a5fa" />
              <StatBadge label="블록" value={`${store.script.blocks?.length||0}`} color="#a78bfa" />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && <ErrorBanner>{error}</ErrorBanner>}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-5">
              <Spinner size="lg" /><span className="text-[15px] text-white/30">Gemini가 대본을 작성하고 있습니다...</span>
            </div>
          ) : store.script?.blocks ? (
            <>
              {store.script.dynamic_intro && <GoldBanner>🎬 인트로: {store.script.dynamic_intro}</GoldBanner>}
              {store.script.blocks.map((b:any,i:number) => (
                <div key={i} className="p-5 rounded-2xl border group animate-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${i*50}ms`}}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-[#d4af37]/40 uppercase tracking-widest" style={{fontFamily:"var(--font-mono)"}}>{b.section||`BLOCK ${String(i+1).padStart(2,"0")}`}</span>
                      <span className="text-[11px] text-white/15" style={{fontFamily:"var(--font-mono)"}}>{b.duration_sec?.toFixed(1)}s</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MiniBtn onClick={()=>{setEditingBlock(i);setEditText(b.text);}}>✏️ 수정</MiniBtn>
                      <MiniBtn onClick={()=>regenBlock(i)}>🔄 재생성</MiniBtn>
                    </div>
                  </div>
                  {editingBlock===i ? (
                    <div>
                      <textarea value={editText} onChange={e=>setEditText(e.target.value)} className="w-full h-36 p-4 rounded-xl text-[14px] text-white/80 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30" style={{background:"rgba(0,0,0,0.3)",border:"1px solid var(--border)",fontFamily:"var(--font-body)"}} />
                      <div className="flex gap-2 mt-3">
                        <button onClick={()=>editBlock(i)} className="px-4 py-2 rounded-xl text-[13px] font-bold text-[#09090b]" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)"}}>저장</button>
                        <button onClick={()=>setEditingBlock(null)} className="px-4 py-2 rounded-xl text-[13px] text-white/30 border" style={{borderColor:"var(--border)"}}>취소</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[15px] text-white/70 leading-[1.9] whitespace-pre-wrap">{b.text}</p>
                  )}
                </div>
              ))}
              {store.script.dynamic_outro && <GoldBanner>🎬 아웃트로: {store.script.dynamic_outro}</GoldBanner>}
            </>
          ) : <EmptyState icon="◆" text="큐레이션을 먼저 완료해주세요" />}
        </div>
      </div>

      {/* Right tools */}
      <div className="w-[320px] shrink-0 border-l flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-6 border-b" style={{borderColor:"var(--border)"}}><h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>스크립트 도구</h3></div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <ToolBtn icon="🔄" label="전체 재생성" desc="같은 소스로 새로 작성" onClick={gen} disabled={loading||!store.selectedKeyword} />
          <ToolBtn icon="📝" label="분량 추가" desc="기존 대본 뒤에 3문단 추가" onClick={extend} disabled={loading||!store.script} />
          <ToolBtn icon="✨" label="전체 재작성" desc="톤/스타일 변경" onClick={rewrite} disabled={loading||!store.script} />
          <div className="h-px my-5" style={{background:"var(--border)"}} />
          <p className="text-[12px] font-bold text-white/20 uppercase tracking-wider mb-2">Enhancement</p>
          {["Hook Logic","Opinion Injector","Fact Density+","CTA Optimizer"].map(l=><Chip key={l} label={l} />)}
        </div>
        {store.script && (
          <div className="p-5 border-t" style={{borderColor:"var(--border)"}}>
            <GoldButton onClick={()=>{store.setStep(4);store.setActivePage("video");}}>영상 제작 →</GoldButton>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE B2 — 영상
   ═══════════════════════════════════════════════════════════════════ */
function VideoPage() {
  const store = useBlackboxStore();
  const [loading,setLoading] = useState(false);
  const [progress,setProgress] = useState(0);
  const [error,setError] = useState<string|null>(null);
  const [slides,setSlides] = useState<any[]>([]);
  const [cur,setCur] = useState(0);

  const genVideo = async () => {
    if(!store.script) return; setLoading(true); setError(null); setProgress(8);
    try {
      const r = await fetch(`${API}/api/v1/video/generate-real`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,mode:store.mode,script_blocks:store.script.blocks})});
      if(!r.ok) throw new Error(`영상 생성 실패 (${r.status})`);
      const d=await r.json();
      if(d.status==="completed"||d.status==="done"||d.download_url){store.setVideo(d);store.setStep(5);setProgress(100);setLoading(false);}
      else { poll(d.job_id); }
    } catch(e:any){setError(e.message);setLoading(false);}
  };
  const poll = (jid:string) => {
    let p=12;
    const iv=setInterval(async()=>{p=Math.min(p+4,92);setProgress(p);try{const r=await fetch(`${API}/api/v1/video/status/${jid}`);if(r.ok){const d=await r.json();if(d.status==="completed"||d.status==="done"){clearInterval(iv);store.setVideo(d);store.setStep(5);setProgress(100);setLoading(false);}else if(d.status==="error"){clearInterval(iv);setError(d.error||"실패");setLoading(false);}}}catch{}},5000);
    setTimeout(()=>{clearInterval(iv);setLoading(false);},600000);
  };

  useEffect(()=>{
    if(store.script){fetch(`${API}/api/v1/video/preview-slides`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,script_blocks:store.script.blocks})}).then(r=>r.ok?r.json():null).then(d=>{if(d?.slides)setSlides(d.slides);}).catch(()=>{});}
  },[]);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b" style={{borderColor:"var(--border)"}}><h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>영상 미리보기</h3></div>
        <div className="flex-1 flex items-center justify-center p-10">
          {loading ? (
            <div className="flex flex-col items-center gap-8 w-80">
              <Spinner size="lg" />
              <div className="w-full"><div className="h-2.5 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}><div className="h-full rounded-full transition-all duration-1000 animate-bar-fill" style={{width:`${progress}%`,background:"linear-gradient(90deg,#d4af37,#f0d060)"}} /></div><p className="text-[13px] text-white/25 text-center mt-3">{progress}% — TTS + FFmpeg 렌더링</p></div>
            </div>
          ) : store.video ? (
            <div className="text-center space-y-5">
              <div className="w-[660px] h-[370px] rounded-2xl border-2 flex items-center justify-center" style={{borderColor:"var(--border)",background:"#000"}}><span className="text-[56px]">🎬</span></div>
              <div className="flex items-center gap-6 justify-center text-[14px] text-white/35">
                <span>⏱ {store.video.duration_sec?.toFixed(1)||"—"}s</span>
                <span>📦 {store.video.file_size_bytes?`${(store.video.file_size_bytes/1024/1024).toFixed(1)}MB`:"—"}</span>
                <span className="text-[#34d399] font-bold">✓ 완료</span>
              </div>
              {store.video.download_url && <a href={store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 rounded-2xl text-[15px] font-bold text-[#09090b]" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)"}}>⬇ Download MP4</a>}
            </div>
          ) : slides.length>0 ? (
            <div className="text-center space-y-5">
              <div className="w-[660px] h-[370px] rounded-2xl border overflow-hidden" style={{borderColor:"var(--border)",background:"#0a0a0a"}}>
                {slides[cur]?.image_base64 ? <img src={`data:image/png;base64,${slides[cur].image_base64}`} alt="" className="w-full h-full object-contain" /> : <div className="flex items-center justify-center h-full text-[15px] text-white/40 p-8 leading-relaxed">{slides[cur]?.text||""}</div>}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button onClick={()=>setCur(Math.max(0,cur-1))} className="w-10 h-10 rounded-xl border flex items-center justify-center text-[16px] text-white/30 hover:text-white/60" style={{borderColor:"var(--border)"}}>◀</button>
                <span className="text-[14px] text-white/30" style={{fontFamily:"var(--font-mono)"}}>{cur+1} / {slides.length}</span>
                <button onClick={()=>setCur(Math.min(slides.length-1,cur+1))} className="w-10 h-10 rounded-xl border flex items-center justify-center text-[16px] text-white/30 hover:text-white/60" style={{borderColor:"var(--border)"}}>▶</button>
              </div>
            </div>
          ) : <EmptyState icon="▶" text="스크립트가 필요합니다" />}
        </div>
      </div>
      <div className="w-[320px] shrink-0 border-l flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-6 border-b" style={{borderColor:"var(--border)"}}><h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>영상 설정</h3></div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center justify-between"><span className="text-[14px] text-white/50">시니어 모드</span><Toggle on={store.mode==="senior"} onToggle={()=>store.setMode(store.mode==="senior"?"normal":"senior")} /></div>
          <div className="h-px" style={{background:"var(--border)"}} />
          {[["모드",store.mode],["해상도","1920×1080"],["자막","Font 22"],["배경","Pexels HD"],["TTS","ElevenLabs"],["레이아웃","8가지"]].map(([l,v])=><Row key={l as string} label={l as string} value={v as string} />)}
        </div>
        <div className="p-5 border-t" style={{borderColor:"var(--border)"}}>
          {!store.video ? <GoldButton onClick={genVideo} disabled={loading||!store.script}>영상 생성 시작</GoldButton> : <GoldButton onClick={()=>store.setActivePage("deploy")}>실드 & 배포 →</GoldButton>}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MODULE C+D — 실드 & 배포
   ═══════════════════════════════════════════════════════════════════ */
function DeployPage() {
  const store = useBlackboxStore();
  const [sL,setSL] = useState(false);
  const [soL,setSoL] = useState(false);
  const [seo,setSeo] = useState<any>(null);
  const [sched,setSched] = useState<any>(null);
  const [err,setErr] = useState<string|null>(null);

  useEffect(()=>{if(!store.shield&&store.script) shield(); if(store.category) loadSched();},[]);

  const shield = async () => {
    setSL(true);setErr(null);
    try{const r=await fetch(`${API}/api/v1/shield/safety-check`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({has_avatar:true,has_opinion:true,has_custom_voice:false,script_sections:store.script?.blocks?.length||5,total_duration_sec:store.script?.total_duration_sec||180,core_facts_count:3,variation_applied:false})});if(!r.ok) throw new Error("실드 분석 실패");store.setShield(await r.json());}catch(e:any){setErr(e.message);}finally{setSL(false);}
  };
  const genSeo = async () => {
    setSoL(true);
    try{const r=await fetch(`${API}/api/v1/publish/seo/generate?keyword=${encodeURIComponent(store.selectedKeyword||"")}&category=${encodeURIComponent(store.category||"economy")}`);if(r.ok)setSeo(await r.json());}catch{}finally{setSoL(false);}
  };
  const loadSched = async () => {
    try{const r=await fetch(`${API}/api/v1/publish/schedule/recommend?category=${encodeURIComponent(store.category||"economy")}`);if(r.ok)setSched(await r.json());}catch{}
  };

  const sc = store.shield?.total_score||0;
  const sColor = (s:number) => s>=80?"#34d399":s>=60?"#f59e0b":"#f87171";

  return (
    <div className="flex h-full">
      {/* Shield */}
      <div className="flex-1 border-r flex flex-col" style={{borderColor:"var(--border)"}}>
        <div className="p-6 border-b" style={{borderColor:"var(--border)"}}><h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>알고리즘 보안 실드</h3></div>
        <div className="flex-1 overflow-y-auto p-6">
          {err && <ErrorBanner>{err}</ErrorBanner>}
          {sL ? <Spinner className="mt-20" /> : store.shield ? (
            <div className="space-y-8">
              {/* Score */}
              <div className="flex items-center gap-10">
                <div className="text-center animate-count-up">
                  <div className="text-[72px] font-black leading-none" style={{color:sColor(sc),fontFamily:"var(--font-display)"}}>{Math.round(sc)}</div>
                  <div className="text-[16px] font-bold mt-2" style={{color:sColor(sc)}}>{store.shield.grade}</div>
                  <div className="text-[12px] text-white/25 mt-1">{store.shield.passed?"✓ 수익화 안전":"⚠ 개선 필요"}</div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[14px] font-bold text-white/35">수익화 안전 등급</p>
                  <div className="h-5 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
                    <div className="h-full rounded-full animate-bar-fill" style={{width:`${sc}%`,background:`linear-gradient(90deg,${sColor(sc)},${sColor(sc)}aa)`}} />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/15" style={{fontFamily:"var(--font-mono)"}}><span>0</span><span>50</span><span>100</span></div>
                </div>
              </div>
              {/* Factors */}
              {store.shield.factors && (
                <div className="grid grid-cols-2 gap-4">
                  {store.shield.factors.map((f:any,i:number) => (
                    <div key={i} className="p-4 rounded-2xl border animate-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${i*80}ms`}}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-white/50">{f.name}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${f.score>=70?"text-[#34d399]":"text-[#f59e0b]"}`} style={{background:f.score>=70?"rgba(52,211,153,0.1)":"rgba(245,158,11,0.1)"}}>{f.score>=70?"Safe":"Warn"}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden mb-2" style={{background:"rgba(255,255,255,0.04)"}}>
                        <div className="h-full rounded-full animate-bar-fill" style={{width:`${f.score}%`,background:sColor(f.score),animationDelay:`${i*100+200}ms`}} />
                      </div>
                      <div className="flex justify-between text-[11px]"><span style={{color:sColor(f.score)}} className="font-bold">{f.score.toFixed(0)}점</span><span className="text-white/15">가중치 {(f.weight*100).toFixed(0)}%</span></div>
                      {f.suggestion && <p className="mt-2 text-[11px] text-[#60a5fa]/50">💡 {f.suggestion}</p>}
                    </div>
                  ))}
                </div>
              )}
              {store.shield.risk_items?.length>0 && (
                <div className="p-4 rounded-2xl border border-[#f59e0b]/15" style={{background:"rgba(245,158,11,0.03)"}}>
                  <p className="text-[13px] font-bold text-[#f59e0b]/60 mb-2">⚠️ 위험 항목</p>
                  {store.shield.risk_items.map((r:string,i:number)=><p key={i} className="text-[12px] text-white/30 mb-1">• {r}</p>)}
                </div>
              )}
            </div>
          ) : <EmptyState icon="◉" text="스크립트가 필요합니다" />}
        </div>
      </div>

      {/* Publish */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b" style={{borderColor:"var(--border)"}}><h3 className="text-[15px] font-bold text-white/50" style={{fontFamily:"var(--font-display)"}}>배포 관리</h3></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* SEO */}
          <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
            <div className="flex items-center justify-between mb-4"><span className="text-[14px] font-bold text-white/55">SEO 최적화</span>{!seo&&<button onClick={genSeo} disabled={soL||!store.selectedKeyword} className="text-[13px] px-3 py-1.5 rounded-xl text-[#d4af37] font-bold disabled:opacity-30" style={{background:"rgba(212,175,55,0.08)"}}>{soL?"생성 중...":"Gemini SEO 생성"}</button>}</div>
            {seo ? (<div className="space-y-3">{seo.title&&<p className="text-[15px] text-white/75 font-bold">{seo.title}</p>}{seo.description&&<p className="text-[13px] text-white/35 leading-relaxed">{seo.description}</p>}{seo.tags&&<div className="flex flex-wrap gap-1.5 mt-2">{(Array.isArray(seo.tags)?seo.tags:[]).slice(0,10).map((t:string,i:number)=><span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-white/[0.03] text-white/25 border" style={{borderColor:"var(--border)"}}>{t}</span>)}</div>}</div>) : <p className="text-[13px] text-white/15">SEO 메타데이터를 생성하세요</p>}
          </div>
          {/* Schedule */}
          <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
            <span className="text-[14px] font-bold text-white/55">스케줄 추천</span>
            {sched ? <div className="mt-3 space-y-2">{sched.recommended_time&&<p className="text-[16px] text-[#d4af37] font-bold">⏰ {sched.recommended_time}</p>}{sched.reason&&<p className="text-[13px] text-white/30">{sched.reason}</p>}</div> : <p className="text-[13px] text-white/15 mt-2">로딩 중...</p>}
          </div>
          {/* Download */}
          <div className="p-5 rounded-2xl border gradient-border" style={{background:"rgba(212,175,55,0.03)"}}>
            <p className="text-[15px] font-bold text-[#d4af37] mb-2">유니크 영상 출력</p>
            <p className="text-[13px] text-white/25">알고리즘 실드 적용 완료. 로컬 다운로드 가능</p>
            {store.video?.download_url && <a href={store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`} target="_blank" rel="noopener noreferrer" className="block mt-4 p-3 rounded-xl text-center text-[14px] font-bold text-[#d4af37]" style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)"}}>⬇ MP4 다운로드</a>}
          </div>
        </div>
        <div className="p-5 border-t flex gap-3" style={{borderColor:"var(--border)"}}>
          <button className="flex-1 py-3 rounded-2xl text-[14px] font-bold border text-white/40 hover:text-white/60" style={{borderColor:"var(--border)"}}>Publish</button>
          <button onClick={()=>{if(store.video?.download_url)window.open(store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`,"_blank");}} className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-[#09090b] hover:brightness-110" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 6px 24px rgba(212,175,55,0.25)"}}>Download</button>
        </div>
      </div>
    </div>
  );
}


/* ═══ SHARED COMPONENTS ═══ */
function Spinner({className="",size="md"}:{className?:string;size?:"md"|"lg"}) {
  const s=size==="lg"?"w-12 h-12 border-[3px]":"w-7 h-7 border-2";
  return <div className={`flex items-center justify-center ${className}`}><div className={`${s} border-[#d4af37]/15 border-t-[#d4af37] rounded-full animate-spin`} /></div>;
}
function EmptyState({icon,text}:{icon:string;text:string}) {
  return <div className="flex flex-col items-center justify-center py-24 text-white/12"><span className="text-[48px] mb-4">{icon}</span><span className="text-[16px]">{text}</span></div>;
}
function ErrorBanner({children}:{children:React.ReactNode}) {
  return <div className="mb-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-[14px]">{children}</div>;
}
function GoldBanner({children}:{children:React.ReactNode}) {
  return <div className="p-4 rounded-2xl text-[13px] text-[#d4af37]/50 italic border border-[#d4af37]/10" style={{background:"rgba(212,175,55,0.03)"}}>{children}</div>;
}
function GoldButton({children,onClick,disabled}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean}) {
  return <button onClick={onClick} disabled={disabled} className="w-full py-3.5 rounded-2xl text-[15px] font-bold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-30" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 6px 24px rgba(212,175,55,0.25)"}}>{children}</button>;
}
function ToolBtn({icon,label,desc,onClick,disabled}:{icon:string;label:string;desc:string;onClick:()=>void;disabled?:boolean}) {
  return <button onClick={onClick} disabled={disabled} className="w-full text-left p-4 rounded-2xl border transition-all hover:border-white/[0.08] disabled:opacity-20 disabled:cursor-not-allowed" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
    <div className="flex items-center gap-3"><span className="text-[20px]">{icon}</span><div><div className="text-[14px] font-bold text-white/65">{label}</div><div className="text-[11px] text-white/25">{desc}</div></div></div></button>;
}
function MiniBtn({children,onClick}:{children:React.ReactNode;onClick:()=>void}) {
  return <button onClick={onClick} className="px-2.5 py-1 rounded-lg text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all">{children}</button>;
}
function Chip({label}:{label:string}) {
  return <div className="px-4 py-2.5 rounded-xl border text-[13px] font-medium text-white/25 border-white/[0.04] hover:border-white/[0.08] cursor-pointer transition-all">{label}</div>;
}
function DataChip({label,value}:{label:string;value:string}) {
  return <div className="text-center"><div className="text-[10px] text-white/20 mb-0.5">{label}</div><div className="text-[13px] text-white/45 font-bold" style={{fontFamily:"var(--font-mono)"}}>{value}</div></div>;
}
function StatBadge({label,value,color}:{label:string;value:string;color:string}) {
  return <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{background:`${color}10`}}><span className="text-[11px] text-white/25">{label}</span><span className="text-[13px] font-bold" style={{color,fontFamily:"var(--font-mono)"}}>{value}</span></div>;
}
function Row({label,value}:{label:string;value:string}) {
  return <div className="flex items-center justify-between"><span className="text-[13px] text-white/35">{label}</span><span className="text-[13px] text-white/55 font-medium" style={{fontFamily:"var(--font-mono)"}}>{value}</span></div>;
}
function Toggle({on,onToggle}:{on:boolean;onToggle:()=>void}) {
  return <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-all ${on?"bg-[#d4af37]":"bg-white/10"}`}><div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${on?"left-[26px]":"left-0.5"}`} /></button>;
}
