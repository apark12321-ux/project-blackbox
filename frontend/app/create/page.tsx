"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

export default function CreatePage() {
  const { activePage } = useBlackboxStore();
  return <div className="h-full">{activePage==="curation"&&<CurationPage/>}{activePage==="script"&&<ScriptPage/>}{activePage==="video"&&<VideoPage/>}{activePage==="deploy"&&<DeployPage/>}</div>;
}

/* ── helpers ── */
function boi(s:number){if(s>=4.5)return{g:"A+",c:"#34d399",bg:"rgba(52,211,153,0.15)"};if(s>=3.8)return{g:"A",c:"#34d399",bg:"rgba(52,211,153,0.10)"};if(s>=3)return{g:"B+",c:"#d4af37",bg:"rgba(212,175,55,0.12)"};if(s>=2.2)return{g:"B",c:"#f59e0b",bg:"rgba(245,158,11,0.10)"};return{g:"C",c:"#f87171",bg:"rgba(248,113,113,0.10)"};}
function fv(v:number){if(v>=1e6)return`${(v/1e6).toFixed(1)}M`;if(v>=1e3)return`${(v/1e3).toFixed(0)}K`;return String(v);}
function mom(m:number){if(m>0.15)return{i:"▲",c:"#34d399"};if(m>0)return{i:"→",c:"#d4af37"};return{i:"▼",c:"#f87171"};}
function sc(s:number){return s>=80?"#34d399":s>=60?"#f59e0b":"#f87171";}

/* ═══════════════════════════════════════
   MODULE A
   ═══════════════════════════════════════ */
function CurationPage(){
  const store=useBlackboxStore();
  const[cats,setCats]=useState<any[]>([]);
  const[ld,setLd]=useState(false);
  const[nld,setNld]=useState(false);
  const[err,setErr]=useState<string|null>(null);

  useEffect(()=>{fetch(`${API}/api/v1/curation/categories`).then(r=>r.json()).then(d=>setCats(d.categories||[])).catch(()=>{});},[]);

  const pickCat=async(slug:string)=>{
    store.setCategory(slug);store.setStep(1);setLd(true);setErr(null);
    store.setNews([]);store.setSelectedNews([]);store.setSelectedKeyword(null);store.setScript(null);store.setVideo(null);store.setShield(null);
    try{const r=await fetch(`${API}/api/v1/curation/keywords/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({category_slug:slug,max_results:10,sort_by:"blue_ocean"})});if(!r.ok)throw new Error(`실패(${r.status})`);store.setKeywords((await r.json()).keywords||[]);try{const b=await fetch(`${API}/api/v1/curation/benchmarks/${slug}`);if(b.ok)store.setBenchmarks(await b.json());}catch{}}catch(e:any){setErr(e.message);}finally{setLd(false);}
  };
  const pickKw=async(kw:any)=>{
    store.setSelectedKeyword(kw.keyword);store.setStep(2);setNld(true);setErr(null);
    store.setNews([]);store.setSelectedNews([]);store.setScript(null);store.setVideo(null);store.setShield(null);
    try{const r=await fetch(`${API}/api/v1/curation/news/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:kw.keyword,days_back:7,max_results:10})});if(!r.ok)throw new Error("뉴스 로드 실패");store.setNews((await r.json()).articles||[]);}catch(e:any){setErr(e.message);}finally{setNld(false);}
  };
  const togNews=(a:any)=>{const c=store.selectedNews;store.setSelectedNews(c.find((n:any)=>n.id===a.id)?c.filter((n:any)=>n.id!==a.id):[...c,a]);};

  return(
    <div className="flex h-full">
      {/* LEFT */}
      <div className="w-[540px] shrink-0 border-r flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-7 border-b" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[20px] font-extrabold text-white/60 mb-5">카테고리 선택</h2>
          <div className="grid grid-cols-2 gap-3">
            {cats.map(cat=>{
              const on=store.category===cat.slug;
              return(
                <button key={cat.slug} onClick={()=>pickCat(cat.slug)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden
                    ${on?"border-[#d4af37]/40 glow-gold":"border-white/[0.04] hover:border-white/10"}`}
                  style={on?{background:"rgba(212,175,55,0.06)"}:{background:"var(--bg-card)"}}>
                  {/* Subtle gradient bg on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:"linear-gradient(135deg,rgba(212,175,55,0.03),transparent)"}} />
                  <span className="text-[28px] relative z-10 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                  <div className="relative z-10 text-left">
                    <div className={`text-[16px] font-bold ${on?"text-[#d4af37]":"text-white/75"}`}>{cat.label_ko}</div>
                    <div className="text-[13px] text-white/25 font-semibold tracking-wide">{cat.cpm_range}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keywords */}
        <div className="flex-1 overflow-y-auto p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-extrabold text-white/60">황금 키워드</h2>
            {store.keywords.length>0&&<span className="text-[14px] text-white/20 font-bold">{store.keywords.length}개</span>}
          </div>

          {ld?<Spinner className="mt-20"/>:store.keywords.length>0?(
            <div className="space-y-3">
              {store.keywords.map((kw:any,i:number)=>{
                const on=store.selectedKeyword===kw.keyword;
                const g=boi(kw.blue_ocean_index||0);
                const m=mom(kw.trend_momentum||0);
                return(
                  <div key={i} onClick={()=>pickKw(kw)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 anim-fade-up relative overflow-hidden
                      ${on?"border-[#d4af37]/30 glow-gold":"border-white/[0.03] hover:border-white/8"}`}
                    style={{animationDelay:`${i*70}ms`,...(on?{background:"rgba(212,175,55,0.04)"}:{background:"var(--bg-card)"})}}>
                    {/* Shimmer effect on selected */}
                    {on&&<div className="absolute inset-0" style={{background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.03),transparent)",backgroundSize:"200% 100%",animation:"gradientFlow 3s ease infinite"}} />}

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <span className="text-[14px] text-white/20 font-bold w-7 text-center">{i+1}</span>
                      <span className={`text-[18px] font-extrabold flex-1 ${on?"text-[#d4af37]":"text-white/85"}`}>{kw.keyword}</span>
                      <span className="text-[15px] font-black px-3 py-1.5 rounded-xl" style={{color:g.c,background:g.bg,boxShadow:on?`0 0 12px ${g.c}33`:"none"}}>{g.g}</span>
                    </div>

                    {/* BOI Progress Bar */}
                    <div className="ml-11 mb-3 relative z-10">
                      <div className="h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
                        <div className="h-full rounded-full anim-bar" style={{width:`${Math.min(100,(kw.blue_ocean_index/5)*100)}%`,background:`linear-gradient(90deg,${g.c},${g.c}88)`,animationDelay:`${i*100+300}ms`}} />
                      </div>
                    </div>

                    {/* Data chips */}
                    <div className="flex items-center gap-5 ml-11 relative z-10">
                      <Dchip label="검색량" val={fv(kw.search_volume||0)} />
                      <Dchip label="경쟁" val={String(kw.competition_count||0)} />
                      <Dchip label="CPM" val={kw.estimated_cpm?`$${kw.estimated_cpm.toFixed(0)}`:"-"} />
                      <span className="text-[15px] font-extrabold ml-auto" style={{color:m.c}}>{m.i}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ):<Empty icon="◈" text="카테고리를 선택하세요" />}
        </div>
      </div>

      {/* RIGHT: News */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-7 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[20px] font-extrabold text-white/60">뉴스 소스 피드</h2>
          {store.selectedNews.length>0&&<span className="text-[15px] font-bold text-[#34d399] px-4 py-1.5 rounded-xl" style={{background:"rgba(52,211,153,0.08)"}}>{store.selectedNews.length}개 선택</span>}
        </div>
        <div className="flex-1 overflow-y-auto p-7">
          {err&&<ErrBox>{err}</ErrBox>}
          {nld?<Spinner className="mt-20"/>:store.news.length>0?(
            <div className="space-y-4">
              {store.news.map((a:any,i:number)=>{
                const on=store.selectedNews.some((n:any)=>n.id===a.id);
                return(
                  <div key={a.id} onClick={()=>togNews(a)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 group anim-fade-up relative overflow-hidden
                      ${on?"border-[#34d399]/25":"border-white/[0.04] hover:border-white/8"}`}
                    style={{animationDelay:`${i*60}ms`,background:on?"rgba(52,211,153,0.03)":"var(--bg-card)"}}>
                    {on&&<div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{background:"#34d399"}} />}
                    <div className="flex items-start gap-4">
                      <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 mt-1 text-[14px] font-bold transition-all duration-300
                        ${on?"border-[#34d399] bg-[#34d399]/15 text-[#34d399]":"border-white/8 text-transparent group-hover:border-white/15"}`}>✓</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <span className={`text-[17px] font-bold leading-snug ${on?"text-white/90":"text-white/70"}`}>{a.title}</span>
                          <span className="shrink-0 text-[12px] font-extrabold px-3.5 py-1 rounded-full anim-float"
                            style={{background:"linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))",color:"#d4af37",border:"1px solid rgba(212,175,55,0.2)",animationDelay:`${i*200}ms`}}>
                            {a.cpm_level}
                          </span>
                        </div>
                        {a.summary&&<p className="text-[14px] text-white/30 leading-relaxed line-clamp-2 mb-3">{a.summary}</p>}
                        <div className="flex items-center gap-4 text-[13px] text-white/25">
                          <span className="font-bold">{a.source_name}</span>
                          {a.time_ago&&<span>{a.time_ago}</span>}
                          <span className="ml-auto">관련도 <b className="text-white/45">{(a.relevance_score*100).toFixed(0)}%</b></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ):<Empty icon="📰" text="키워드를 선택하면 뉴스가 표시됩니다" />}
        </div>
        {store.selectedNews.length>0&&(
          <div className="p-6 border-t" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
            <button onClick={()=>{store.setStep(3);store.setActivePage("script");}}
              className="w-full py-4 rounded-2xl text-[18px] font-extrabold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.99] anim-pulse"
              style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 8px 40px rgba(212,175,55,0.3)"}}>
              스크립트 생성 → ({store.selectedNews.length}개 소스)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE B — Script (블록 편집 + 최종 시나리오)
   ═══════════════════════════════════════ */
function ScriptPage(){
  const store=useBlackboxStore();
  const[ld,setLd]=useState(false);
  const[err,setErr]=useState<string|null>(null);
  const[ebi,setEbi]=useState<number|null>(null);
  const[et,setEt]=useState("");
  const[view,setView]=useState<"blocks"|"scenario">("blocks");

  useEffect(()=>{if(!store.script&&store.selectedKeyword&&store.selectedNews.length>0)gen();},[]);

  const gen=async()=>{setLd(true);setErr(null);try{const ns=store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n");const r=await fetch(`${API}/api/v1/script/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],opinion_seeds:[],hook_triggers:[],target_duration_sec:480})});if(!r.ok)throw new Error(`실패(${r.status})`);store.setScript(await r.json());store.setStep(4);}catch(e:any){setErr(e.message);}finally{setLd(false);}};
  const eb=async(i:number)=>{if(!store.script)return;try{const r=await fetch(`${API}/api/v1/script/edit-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,new_text:et,blocks:store.script.blocks})});if(r.ok){const d=await r.json();store.setScript({...store.script,blocks:d.blocks||d});setEbi(null);}}catch{}};
  const rb=async(i:number)=>{if(!store.script)return;try{const r=await fetch(`${API}/api/v1/script/regenerate-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,keyword:store.selectedKeyword,category:store.category,instruction:"",blocks:store.script.blocks})});if(r.ok){const d=await r.json();store.setScript({...store.script,blocks:d.blocks||d});}}catch{}};
  const ext=async()=>{if(!store.script)return;setLd(true);try{const r=await fetch(`${API}/api/v1/script/extend`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,current_blocks:store.script.blocks,extend_paragraphs:3,instruction:""})});if(r.ok){const d=await r.json();store.setScript({...store.script,blocks:d.blocks||d});}}catch{}finally{setLd(false);}};
  const rew=async()=>{if(!store.script)return;setLd(true);try{const ns=store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n");const r=await fetch(`${API}/api/v1/script/rewrite`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],instruction:"",target_duration_sec:480})});if(r.ok)store.setScript(await r.json());}catch{}finally{setLd(false);}};

  const dur=store.script?.total_duration_sec||0;
  const ch=store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text?.length||0),0)||0;

  // 최종 시나리오: 모든 블록 텍스트를 하나의 흐름으로
  const buildScenario=()=>{
    if(!store.script?.blocks)return{intro:"",sections:[] as {label:string;text:string;time:string}[],outro:""};
    const sections:{label:string;text:string;time:string}[]=[];
    let cumTime=0;
    for(const b of store.script.blocks){
      const mm=Math.floor(cumTime/60);
      const ss=Math.round(cumTime%60);
      const timeStr=`${mm}:${String(ss).padStart(2,'0')}`;
      const labelMap:{[k:string]:string}={hook:"오프닝 훅",body:"본문",opinion:"채널 의견",cta:"구독 유도"};
      sections.push({label:labelMap[b.section]||b.section,text:b.text,time:timeStr});
      cumTime+=b.duration_sec||0;
    }
    return{intro:store.script.dynamic_intro||"",sections,outro:store.script.dynamic_outro||""};
  };

  return(
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with view toggle */}
        <div className="p-7 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <div className="flex items-center gap-5">
            <h2 className="text-[20px] font-extrabold text-white/60">AI 스크립트</h2>
            {store.script&&(
              <div className="flex rounded-xl overflow-hidden border" style={{borderColor:"var(--border)"}}>
                <button onClick={()=>setView("blocks")}
                  className={`px-4 py-1.5 text-[13px] font-bold transition-all ${view==="blocks"?"text-[#d4af37]":"text-white/25 hover:text-white/40"}`}
                  style={view==="blocks"?{background:"rgba(212,175,55,0.1)"}:{}}>
                  블록 편집
                </button>
                <button onClick={()=>setView("scenario")}
                  className={`px-4 py-1.5 text-[13px] font-bold transition-all ${view==="scenario"?"text-[#d4af37]":"text-white/25 hover:text-white/40"}`}
                  style={view==="scenario"?{background:"rgba(212,175,55,0.1)"}:{}}>
                  최종 시나리오
                </button>
              </div>
            )}
          </div>
          {store.script&&<div className="flex gap-4">
            <Badge label="글자" val={ch.toLocaleString()} color="#d4af37"/>
            <Badge label="시간" val={`${Math.floor(dur/60)}:${String(Math.round(dur%60)).padStart(2,'0')}`} color="#60a5fa"/>
            <Badge label="블록" val={String(store.script.blocks?.length||0)} color="#a78bfa"/>
          </div>}
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {err&&<ErrBox>{err}</ErrBox>}
          {ld?<div className="flex flex-col items-center py-32 gap-5"><Spinner size="lg"/><span className="text-[16px] text-white/25">Gemini가 대본을 작성 중...</span></div>

          /* ═══ 블록 편집 뷰 ═══ */
          :view==="blocks"&&store.script?.blocks?(
            <div className="space-y-4">
              {store.script.dynamic_intro&&<div className="p-5 rounded-2xl text-[14px] text-[#d4af37]/50 italic border border-[#d4af37]/10" style={{background:"rgba(212,175,55,0.03)"}}>🎬 인트로: {store.script.dynamic_intro}</div>}
              {store.script.blocks.map((b:any,i:number)=>(
                <div key={i} className="p-6 rounded-2xl border group anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${i*60}ms`}}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-[#d4af37]/35 uppercase tracking-widest">{b.section||`BLOCK ${String(i+1).padStart(2,"0")}`}</span>
                      <span className="text-[12px] text-white/15">{b.duration_sec?.toFixed(1)}s</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>{setEbi(i);setEt(b.text);}} className="px-3 py-1 rounded-xl text-[12px] text-white/30 hover:text-white/60 hover:bg-white/[0.04]">✏️ 수정</button>
                      <button onClick={()=>rb(i)} className="px-3 py-1 rounded-xl text-[12px] text-white/30 hover:text-white/60 hover:bg-white/[0.04]">🔄 재생성</button>
                    </div>
                  </div>
                  {ebi===i?<div><textarea value={et} onChange={e=>setEt(e.target.value)} className="w-full h-40 p-5 rounded-2xl text-[15px] text-white/80 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20" style={{background:"rgba(0,0,0,0.3)",border:"1px solid var(--border)"}}/><div className="flex gap-2 mt-3"><button onClick={()=>eb(i)} className="px-5 py-2 rounded-xl text-[14px] font-bold text-[#09090b]" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)"}}>저장</button><button onClick={()=>setEbi(null)} className="px-5 py-2 rounded-xl text-[14px] text-white/30 border" style={{borderColor:"var(--border)"}}>취소</button></div></div>
                  :<p className="text-[16px] text-white/70 leading-[2] whitespace-pre-wrap">{b.text}</p>}
                </div>
              ))}
              {store.script.dynamic_outro&&<div className="p-5 rounded-2xl text-[14px] text-[#d4af37]/50 italic border border-[#d4af37]/10" style={{background:"rgba(212,175,55,0.03)"}}>🎬 아웃트로: {store.script.dynamic_outro}</div>}
            </div>

          /* ═══ 최종 시나리오 뷰 ═══ */
          ):view==="scenario"&&store.script?.blocks?(()=>{
            const sc=buildScenario();
            return(
              <div className="max-w-3xl mx-auto">
                {/* 시나리오 헤더 */}
                <div className="text-center mb-10 anim-fade-up">
                  <div className="inline-block px-4 py-1.5 rounded-full text-[12px] font-bold text-[#d4af37] mb-4" style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)"}}>FINAL SCENARIO</div>
                  <h1 className="text-[28px] font-extrabold text-white/90 mb-2">{store.selectedKeyword}</h1>
                  <p className="text-[15px] text-white/30">
                    {ch.toLocaleString()}자  ·  {Math.floor(dur/60)}분 {Math.round(dur%60)}초  ·  {store.script.blocks.length}개 섹션
                  </p>
                </div>

                {/* 인트로 */}
                {sc.intro&&(
                  <div className="flex items-center gap-4 mb-8 anim-fade-up" style={{animationDelay:"100ms"}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[16px] shrink-0" style={{background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.2)"}}>🎬</div>
                    <p className="text-[15px] text-[#d4af37]/60 italic">{sc.intro}</p>
                  </div>
                )}

                {/* 시나리오 본문 — 하나의 흐름 */}
                <div className="relative">
                  {/* 타임라인 세로선 */}
                  <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{background:"linear-gradient(180deg,rgba(212,175,55,0.3),rgba(212,175,55,0.05))"}} />

                  {sc.sections.map((s,i)=>{
                    const isHook=s.label==="오프닝 훅";
                    const isOpinion=s.label==="채널 의견";
                    const isCta=s.label==="구독 유도";
                    const dotColor=isHook?"#d4af37":isOpinion?"#a78bfa":isCta?"#34d399":"rgba(255,255,255,0.15)";
                    return(
                      <div key={i} className="flex gap-6 mb-8 anim-fade-up relative" style={{animationDelay:`${(i+1)*80}ms`}}>
                        {/* 타임라인 도트 */}
                        <div className="flex flex-col items-center shrink-0 z-10">
                          <div className="w-[10px] h-[10px] rounded-full" style={{background:dotColor,boxShadow:`0 0 8px ${dotColor}44`}} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* 섹션 라벨 + 시간 */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[12px] font-bold uppercase tracking-wider ${isHook?"text-[#d4af37]/60":isOpinion?"text-[#a78bfa]/60":isCta?"text-[#34d399]/60":"text-white/20"}`}>{s.label}</span>
                            <span className="text-[11px] text-white/15 font-bold">{s.time}</span>
                          </div>

                          {/* 텍스트 */}
                          <p className={`leading-[2.2] whitespace-pre-wrap ${
                            isHook?"text-[18px] font-bold text-white/85":
                            isOpinion?"text-[16px] text-[#a78bfa]/70 italic border-l-2 border-[#a78bfa]/20 pl-5":
                            isCta?"text-[15px] text-[#34d399]/60":
                            "text-[16px] text-white/70"
                          }`}>{s.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 아웃트로 */}
                {sc.outro&&(
                  <div className="flex items-center gap-4 mt-4 anim-fade-up" style={{animationDelay:`${(sc.sections.length+2)*80}ms`}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[16px] shrink-0" style={{background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.2)"}}>🎬</div>
                    <p className="text-[15px] text-[#d4af37]/60 italic">{sc.outro}</p>
                  </div>
                )}

                {/* 하단 요약 카드 */}
                <div className="mt-12 p-6 rounded-2xl border anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${(sc.sections.length+3)*80}ms`}}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold text-white/40">시나리오 요약</span>
                    <span className="text-[12px] text-white/20">생성 방식: {store.script.metadata?.method||"gemini"}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <SummaryCard label="총 글자수" value={`${ch.toLocaleString()}자`} color="#d4af37" />
                    <SummaryCard label="재생 시간" value={`${Math.floor(dur/60)}분 ${Math.round(dur%60)}초`} color="#60a5fa" />
                    <SummaryCard label="훅 타입" value={store.script.hook_type} color="#f59e0b" />
                    <SummaryCard label="의견 톤" value={store.script.opinion_tone} color="#a78bfa" />
                  </div>
                </div>
              </div>
            );
          })()

          :!store.script?<Empty icon="◆" text="큐레이션을 먼저 완료해주세요"/>:null}
        </div>
      </div>

      {/* Right tools panel */}
      <div className="w-[340px] shrink-0 border-l flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[20px] font-extrabold text-white/60">도구</h2></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <TBtn icon="🔄" label="전체 재생성" desc="같은 소스로 새로 작성" onClick={gen} disabled={ld||!store.selectedKeyword}/>
          <TBtn icon="📝" label="분량 추가" desc="3문단 추가" onClick={ext} disabled={ld||!store.script}/>
          <TBtn icon="✨" label="전체 재작성" desc="톤/스타일 변경" onClick={rew} disabled={ld||!store.script}/>
          <div className="h-px my-5" style={{background:"var(--border)"}} />
          {store.script&&(
            <div className="p-4 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
              <p className="text-[13px] font-bold text-white/30 mb-3">빠른 전환</p>
              <div className="space-y-2">
                <button onClick={()=>setView("blocks")} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${view==="blocks"?"text-[#d4af37] border border-[#d4af37]/20":"text-white/40 hover:text-white/60"}`} style={view==="blocks"?{background:"rgba(212,175,55,0.06)"}:{}}>
                  📝 블록 편집 모드
                </button>
                <button onClick={()=>setView("scenario")} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${view==="scenario"?"text-[#d4af37] border border-[#d4af37]/20":"text-white/40 hover:text-white/60"}`} style={view==="scenario"?{background:"rgba(212,175,55,0.06)"}:{}}>
                  📖 최종 시나리오
                </button>
              </div>
            </div>
          )}
        </div>
        {store.script&&<div className="p-6 border-t" style={{borderColor:"var(--border)"}}><GoldBtn onClick={()=>{store.setStep(4);store.setActivePage("video");}}>영상 제작 →</GoldBtn></div>}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE B2 — Video
   ═══════════════════════════════════════ */
function VideoPage(){
  const store=useBlackboxStore();
  const[ld,setLd]=useState(false);const[pg,setPg]=useState(0);const[err,setErr]=useState<string|null>(null);
  const[sl,setSl]=useState<any[]>([]);const[ci,setCi]=useState(0);

  const gen=async()=>{if(!store.script)return;setLd(true);setErr(null);setPg(8);
    try{const r=await fetch(`${API}/api/v1/video/generate-real`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,mode:store.mode,script_blocks:store.script.blocks})});if(!r.ok)throw new Error(`실패(${r.status})`);const d=await r.json();if(d.status==="completed"||d.status==="done"||d.download_url){store.setVideo(d);store.setStep(5);setPg(100);setLd(false);}else{let p=12;const iv=setInterval(async()=>{p=Math.min(p+4,92);setPg(p);try{const r2=await fetch(`${API}/api/v1/video/status/${d.job_id}`);if(r2.ok){const d2=await r2.json();if(d2.status==="completed"||d2.status==="done"){clearInterval(iv);store.setVideo(d2);store.setStep(5);setPg(100);setLd(false);}else if(d2.status==="error"){clearInterval(iv);setErr(d2.error||"실패");setLd(false);}}}catch{}},5000);setTimeout(()=>{clearInterval(iv);setLd(false);},600000);}}catch(e:any){setErr(e.message);setLd(false);}};

  useEffect(()=>{if(store.script){fetch(`${API}/api/v1/video/preview-slides`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,script_blocks:store.script.blocks})}).then(r=>r.ok?r.json():null).then(d=>{if(d?.slides)setSl(d.slides);}).catch(()=>{});}},[]);

  // 스토리보드 데이터 생성
  const storyboard=store.script?.blocks?.map((b:any,i:number)=>{
    const secMap:{[k:string]:string}={hook:"🎯 오프닝",body:"📝 본문",opinion:"💬 의견",cta:"📢 CTA"};
    const colorMap:{[k:string]:string}={hook:"#d4af37",body:"#60a5fa",opinion:"#a78bfa",cta:"#34d399"};
    return{label:secMap[b.section]||"본문",color:colorMap[b.section]||"#60a5fa",dur:b.duration_sec||0,text:b.text?.slice(0,50)+"...",section:b.section};
  })||[];
  const totalDur=store.script?.total_duration_sec||0;
  const totalChars=store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text?.length||0),0)||0;
  const maxDur=Math.max(...storyboard.map((s:any)=>s.dur),1);

  return(
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-7 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[20px] font-extrabold text-white/60">영상 제작</h2>
          {store.script&&!store.video&&!ld&&(
            <span className="text-[13px] text-white/25">스토리보드 프리뷰</span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {err&&<ErrBox>{err}</ErrBox>}

          {/* 렌더링 중 */}
          {ld?<div className="flex flex-col items-center justify-center py-20 gap-8">
            <Spinner size="lg"/>
            <div className="w-96">
              <div className="h-3 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
                <div className="h-full rounded-full transition-all duration-1000 anim-bar" style={{width:`${pg}%`,background:"linear-gradient(90deg,#d4af37,#f0d060)"}}/>
              </div>
              <p className="text-[15px] text-white/25 text-center mt-4">{pg}% — Gemini 일러스트 + TTS + FFmpeg 렌더링</p>
            </div>
          </div>

          /* 영상 완료 */
          :store.video?<div className="flex flex-col items-center justify-center py-12 gap-6">
            <div className="w-[680px] h-[380px] rounded-2xl border-2 flex items-center justify-center" style={{borderColor:"var(--border)",background:"#000"}}><span className="text-[64px]">🎬</span></div>
            <div className="flex items-center gap-6 text-[15px] text-white/35">
              <span>⏱ {store.video.duration_sec?.toFixed(1)||"-"}s</span>
              <span>📦 {store.video.file_size_bytes?`${(store.video.file_size_bytes/1024/1024).toFixed(1)}MB`:"-"}</span>
              <span className="text-[#34d399] font-bold">✓ 생성 완료</span>
            </div>
            <p className="text-[14px] text-white/25">실드 & 배포 페이지에서 최종 다운로드가 가능합니다</p>
            <button onClick={()=>store.setActivePage("deploy")}
              className="px-10 py-4 rounded-2xl text-[17px] font-extrabold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.98]"
              style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 6px 24px rgba(212,175,55,0.3)"}}>
              실드 & 배포로 이동 →
            </button>
          </div>

          /* ★ 스토리보드 프리뷰 (스크립트 있지만 영상 미생성) */
          :store.script?.blocks?<div className="max-w-4xl mx-auto space-y-8">
            {/* 상단 스펙 카드 */}
            <div className="grid grid-cols-4 gap-4 anim-fade-up">
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.12)"}}>
                <div className="text-[28px] font-black text-[#d4af37] anim-score">{Math.floor(totalDur/60)}:{String(Math.round(totalDur%60)).padStart(2,'0')}</div>
                <div className="text-[12px] text-white/30 mt-1">예상 재생시간</div>
              </div>
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.12)"}}>
                <div className="text-[28px] font-black text-[#60a5fa] anim-score">{totalChars.toLocaleString()}</div>
                <div className="text-[12px] text-white/30 mt-1">총 글자수</div>
              </div>
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.12)"}}>
                <div className="text-[28px] font-black text-[#a78bfa] anim-score">{store.script.blocks.length}</div>
                <div className="text-[12px] text-white/30 mt-1">블록 수</div>
              </div>
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.12)"}}>
                <div className="text-[28px] font-black text-[#34d399] anim-score">HD</div>
                <div className="text-[12px] text-white/30 mt-1">1920×1080</div>
              </div>
            </div>

            {/* 타임라인 바 차트 */}
            <div className="p-6 rounded-2xl border anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:"100ms"}}>
              <h3 className="text-[15px] font-bold text-white/50 mb-5">블록별 타임라인</h3>
              <div className="space-y-3">
                {storyboard.map((s:any,i:number)=>(
                  <div key={i} className="flex items-center gap-4 anim-fade-up" style={{animationDelay:`${i*50+200}ms`}}>
                    <span className="text-[11px] text-white/20 w-6 text-right font-bold">{i+1}</span>
                    <span className="text-[11px] w-20 shrink-0 font-bold" style={{color:s.color}}>{s.label}</span>
                    <div className="flex-1 h-7 rounded-lg overflow-hidden relative" style={{background:"rgba(255,255,255,0.03)"}}>
                      <div className="h-full rounded-lg anim-bar flex items-center px-3" style={{width:`${Math.max(8,(s.dur/maxDur)*100)}%`,background:`${s.color}20`,borderLeft:`3px solid ${s.color}`,animationDelay:`${i*80+300}ms`}}>
                        <span className="text-[10px] text-white/40 truncate">{s.text}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-white/20 w-12 text-right font-bold">{s.dur.toFixed(0)}s</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 영상 구성 요소 */}
            <div className="grid grid-cols-3 gap-4 anim-fade-up" style={{animationDelay:"300ms"}}>
              <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                <span className="text-[24px]">🎨</span>
                <h4 className="text-[14px] font-bold text-white/60 mt-2">Gemini 일러스트</h4>
                <p className="text-[12px] text-white/25 mt-1">블록마다 AI 생성 밝은 파스텔 일러스트</p>
              </div>
              <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                <span className="text-[24px]">🎙️</span>
                <h4 className="text-[14px] font-bold text-white/60 mt-2">ElevenLabs TTS</h4>
                <p className="text-[12px] text-white/25 mt-1">고품질 한국어 음성 합성, 스테레오</p>
              </div>
              <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                <span className="text-[24px]">📑</span>
                <h4 className="text-[14px] font-bold text-white/60 mt-2">챕터 카드</h4>
                <p className="text-[12px] text-white/25 mt-1">번호 인포그래픽 + 핵심 키워드</p>
              </div>
            </div>

            {/* 큰 생성 버튼 */}
            <div className="text-center anim-fade-up" style={{animationDelay:"400ms"}}>
              <button onClick={gen} disabled={ld}
                className="px-16 py-5 rounded-2xl text-[20px] font-extrabold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.98] anim-pulse"
                style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 8px 40px rgba(212,175,55,0.3)"}}>
                🎬 영상 생성 시작
              </button>
              <p className="text-[13px] text-white/20 mt-3">Gemini 일러스트 + TTS + FFmpeg 렌더링 (3~5분 소요)</p>
            </div>
          </div>

          :<Empty icon="▶" text="스크립트가 필요합니다"/>}
        </div>
      </div>

      {/* 우측 설정 */}
      <div className="w-[340px] shrink-0 border-l flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[20px] font-extrabold text-white/60">설정</h2></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between"><span className="text-[15px] text-white/50">시니어 모드</span><Tog on={store.mode==="senior"} fn={()=>store.setMode(store.mode==="senior"?"normal":"senior")}/></div>
          <div className="h-px" style={{background:"var(--border)"}}/>
          {([["모드",store.mode],["해상도","1920×1080"],["TTS","ElevenLabs"],["일러스트","Gemini AI"],["자막","한글 24px"],["BGM","Ambient"]] as [string,string][]).map(([l,v])=><Row key={l} l={l} v={v}/>)}

          {store.script&&!store.video&&(
            <div className="mt-4 p-4 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
              <p className="text-[12px] font-bold text-white/30 mb-2">예상 출력</p>
              <div className="space-y-2">
                <Row l="포맷" v="MP4 (H.264)"/>
                <Row l="비트레이트" v="~2Mbps"/>
                <Row l="오디오" v="스테레오 192k"/>
                <Row l="소요시간" v="약 3~5분"/>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t" style={{borderColor:"var(--border)"}}>
          {!store.video
            ?<GoldBtn onClick={gen} disabled={ld||!store.script}>🎬 영상 생성</GoldBtn>
            :<GoldBtn onClick={()=>store.setActivePage("deploy")}>실드 & 배포 →</GoldBtn>}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE C+D — Deploy
   ═══════════════════════════════════════ */
function DeployPage(){
  const store=useBlackboxStore();
  const[sL,setSL]=useState(false);const[soL,setSoL]=useState(false);const[seo,setSeo]=useState<any>(null);const[sch,setSch]=useState<any>(null);const[err,setErr]=useState<string|null>(null);

  useEffect(()=>{if(!store.shield&&store.script)doShield();if(store.category)doSch();},[]);

  const doShield=async()=>{setSL(true);setErr(null);try{const r=await fetch(`${API}/api/v1/shield/safety-check`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({has_avatar:true,has_opinion:true,has_custom_voice:false,script_sections:store.script?.blocks?.length||5,total_duration_sec:store.script?.total_duration_sec||180,core_facts_count:3,variation_applied:false})});if(!r.ok)throw new Error("실패");store.setShield(await r.json());}catch(e:any){setErr(e.message);}finally{setSL(false);}};
  const doSeo=async()=>{setSoL(true);try{const r=await fetch(`${API}/api/v1/publish/seo/generate?keyword=${encodeURIComponent(store.selectedKeyword||"")}&category=${encodeURIComponent(store.category||"economy")}`);if(r.ok)setSeo(await r.json());}catch{}finally{setSoL(false);}};
  const doSch=async()=>{try{const r=await fetch(`${API}/api/v1/publish/schedule/recommend?category=${encodeURIComponent(store.category||"economy")}`);if(r.ok)setSch(await r.json());}catch{}};

  const s=store.shield?.total_score||0;

  return(
    <div className="flex h-full">
      {/* Shield */}
      <div className="flex-1 border-r flex flex-col" style={{borderColor:"var(--border)"}}>
        <div className="p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[20px] font-extrabold text-white/60">알고리즘 실드</h2></div>
        <div className="flex-1 overflow-y-auto p-8">
          {err&&<ErrBox>{err}</ErrBox>}
          {sL?<Spinner className="mt-24"/>:store.shield?(
            <div className="space-y-8">
              <div className="flex items-center gap-12">
                <div className="text-center anim-score">
                  <div className="text-[80px] font-black leading-none" style={{color:sc(s),fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{Math.round(s)}</div>
                  <div className="text-[18px] font-bold mt-2" style={{color:sc(s)}}>{store.shield.grade}</div>
                  <div className="text-[13px] text-white/25 mt-1">{store.shield.passed?"✓ 수익화 안전":"⚠ 개선 필요"}</div>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-white/40 mb-3">수익화 안전 등급</p>
                  <div className="h-6 rounded-full overflow-hidden relative" style={{background:"rgba(255,255,255,0.04)"}}>
                    <div className="h-full rounded-full anim-bar" style={{width:`${s}%`,background:`linear-gradient(90deg,${sc(s)},${sc(s)}88)`}}/>
                    {/* Scale marks */}
                    <div className="absolute inset-0 flex items-center justify-between px-1">
                      {[0,25,50,75,100].map(v=><div key={v} className="w-px h-3 bg-white/5"/>)}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[12px] text-white/15 font-bold">
                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                  </div>
                </div>
              </div>
              {store.shield.factors&&<div className="grid grid-cols-2 gap-4">{store.shield.factors.map((f:any,i:number)=>(
                <div key={i} className="p-5 rounded-2xl border anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${i*100}ms`}}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[15px] font-bold text-white/55">{f.name}</span>
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-xl ${f.score>=70?"text-[#34d399]":"text-[#f59e0b]"}`} style={{background:f.score>=70?"rgba(52,211,153,0.1)":"rgba(245,158,11,0.1)"}}>{f.score>=70?"Safe":"Warn"}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{background:"rgba(255,255,255,0.04)"}}>
                    <div className="h-full rounded-full anim-bar" style={{width:`${f.score}%`,background:sc(f.score),animationDelay:`${i*120+400}ms`}}/>
                  </div>
                  <div className="flex justify-between text-[12px]"><span style={{color:sc(f.score)}} className="font-bold">{f.score.toFixed(0)}</span><span className="text-white/15">w:{(f.weight*100).toFixed(0)}%</span></div>
                  {f.suggestion&&<p className="mt-2 text-[12px] text-[#60a5fa]/40">💡 {f.suggestion}</p>}
                </div>
              ))}</div>}
              {store.shield.risk_items?.length>0&&<div className="p-5 rounded-2xl border border-[#f59e0b]/15" style={{background:"rgba(245,158,11,0.03)"}}><p className="text-[14px] font-bold text-[#f59e0b]/60 mb-2">⚠️ 위험 항목</p>{store.shield.risk_items.map((r:string,i:number)=><p key={i} className="text-[13px] text-white/30 mb-1">• {r}</p>)}</div>}
            </div>
          ):<Empty icon="◉" text="스크립트가 필요합니다"/>}
        </div>
      </div>
      {/* Publish */}
      <div className="flex-1 flex flex-col">
        <div className="p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[20px] font-extrabold text-white/60">배포 관리</h2></div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="p-6 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
            <div className="flex items-center justify-between mb-4"><span className="text-[16px] font-bold text-white/55">SEO 최적화</span>{!seo&&<button onClick={doSeo} disabled={soL||!store.selectedKeyword} className="text-[14px] px-4 py-2 rounded-xl text-[#d4af37] font-bold disabled:opacity-30" style={{background:"rgba(212,175,55,0.08)"}}>{soL?"생성 중...":"Gemini SEO"}</button>}</div>
            {seo?<div className="space-y-3">{seo.title&&<p className="text-[17px] text-white/75 font-bold">{seo.title}</p>}{seo.description&&<p className="text-[14px] text-white/35 leading-relaxed">{seo.description}</p>}{seo.tags&&<div className="flex flex-wrap gap-2 mt-3">{(Array.isArray(seo.tags)?seo.tags:[]).slice(0,10).map((t:string,i:number)=><span key={i} className="text-[12px] px-2.5 py-1 rounded-xl bg-white/[0.03] text-white/25 border" style={{borderColor:"var(--border)"}}>{t}</span>)}</div>}</div>:<p className="text-[14px] text-white/15">SEO 메타데이터를 생성하세요</p>}
          </div>
          <div className="p-6 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
            <span className="text-[16px] font-bold text-white/55">스케줄 추천</span>
            {sch?<div className="mt-3">{sch.recommended_time&&<p className="text-[18px] text-[#d4af37] font-bold">⏰ {sch.recommended_time}</p>}{sch.reason&&<p className="text-[14px] text-white/30 mt-1">{sch.reason}</p>}</div>:<p className="text-[14px] text-white/15 mt-2">로딩 중...</p>}
          </div>
          <div className="p-6 rounded-2xl grad-border relative overflow-hidden" style={{background:"rgba(212,175,55,0.03)"}}>
            <div className="absolute inset-0 noise"/>
            <p className="text-[17px] font-bold text-[#d4af37] mb-2 relative z-10">유니크 영상 출력</p>
            <p className="text-[14px] text-white/25 relative z-10">실드 적용 완료. 로컬 다운로드 가능</p>
            {store.video?.download_url&&<a href={store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`} target="_blank" rel="noopener noreferrer" className="block mt-4 p-3 rounded-xl text-center text-[15px] font-bold text-[#d4af37] relative z-10" style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)"}}>⬇ MP4 다운로드</a>}
          </div>
        </div>
        <div className="p-6 border-t flex gap-4" style={{borderColor:"var(--border)"}}>
          <button className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold border text-white/40 hover:text-white/60" style={{borderColor:"var(--border)"}}>Publish</button>
          <button onClick={()=>{if(store.video?.download_url)window.open(store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`,"_blank");}} className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold text-[#09090b] hover:brightness-110" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 6px 24px rgba(212,175,55,0.25)"}}>Download</button>
        </div>
      </div>
    </div>
  );
}


/* ═══ SHARED ═══ */
function Spinner({className="",size="md"}:{className?:string;size?:"md"|"lg"}){const s=size==="lg"?"w-14 h-14 border-[3px]":"w-8 h-8 border-2";return<div className={`flex items-center justify-center ${className}`}><div className={`${s} border-[#d4af37]/15 border-t-[#d4af37] rounded-full animate-spin`}/></div>;}
function Empty({icon,text}:{icon:string;text:string}){return<div className="flex flex-col items-center justify-center py-28 text-white/10"><span className="text-[56px] mb-5 anim-float">{icon}</span><span className="text-[17px]">{text}</span></div>;}
function ErrBox({children}:{children:React.ReactNode}){return<div className="mb-5 p-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-[15px]">{children}</div>;}
function GoldBtn({children,onClick,disabled}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean}){return<button onClick={onClick} disabled={disabled} className="w-full py-4 rounded-2xl text-[16px] font-extrabold text-[#09090b] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-30" style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",boxShadow:"0 6px 24px rgba(212,175,55,0.25)"}}>{children}</button>;}
function TBtn({icon,label,desc,onClick,disabled}:{icon:string;label:string;desc:string;onClick:()=>void;disabled?:boolean}){return<button onClick={onClick} disabled={disabled} className="w-full text-left p-5 rounded-2xl border transition-all hover:border-white/8 disabled:opacity-20 disabled:cursor-not-allowed" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}><div className="flex items-center gap-4"><span className="text-[24px]">{icon}</span><div><div className="text-[15px] font-bold text-white/65">{label}</div><div className="text-[12px] text-white/25">{desc}</div></div></div></button>;}
function Dchip({label,val}:{label:string;val:string}){return<div><div className="text-[11px] text-white/20 mb-0.5">{label}</div><div className="text-[14px] text-white/50 font-bold">{val}</div></div>;}
function Badge({label,val,color}:{label:string;val:string;color:string}){return<div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl" style={{background:`${color}12`}}><span className="text-[12px] text-white/25">{label}</span><span className="text-[14px] font-bold" style={{color}}>{val}</span></div>;}
function Row({l,v}:{l:string;v:string}){return<div className="flex items-center justify-between"><span className="text-[14px] text-white/35">{l}</span><span className="text-[14px] text-white/55 font-bold">{v}</span></div>;}
function Tog({on,fn}:{on:boolean;fn:()=>void}){return<button onClick={fn} className={`w-12 h-6 rounded-full relative transition-all ${on?"bg-[#d4af37]":"bg-white/10"}`}><div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${on?"left-[26px]":"left-0.5"}`}/></button>;}
function SummaryCard({label,value,color}:{label:string;value:string;color:string}){return<div className="p-4 rounded-xl text-center" style={{background:`${color}08`,border:`1px solid ${color}15`}}><div className="text-[11px] text-white/25 mb-1">{label}</div><div className="text-[16px] font-extrabold" style={{color}}>{value}</div></div>;}
