"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

export default function CreatePage() {
  const { activePage } = useBlackboxStore();
  return <div className="h-full">{activePage==="curation"&&<CurationPage/>}{activePage==="script"&&<ScriptPage/>}{activePage==="video"&&<VideoPage/>}{activePage==="deploy"&&<DeployPage/>}</div>;
}

/* ── helpers ── */
function boi(s:number){if(s>=4.5)return{g:"A+",c:"#16a34a",bg:"rgba(22,163,74,0.1)"};if(s>=3.8)return{g:"A",c:"#22c55e",bg:"rgba(34,197,94,0.08)"};if(s>=3)return{g:"B+",c:"#c49a1a",bg:"rgba(196,154,26,0.1)"};if(s>=2.2)return{g:"B",c:"#f59e0b",bg:"rgba(245,158,11,0.08)"};return{g:"C",c:"#f87171",bg:"rgba(248,113,113,0.08)"};}
function fv(v:number){if(v>=1e6)return`${(v/1e6).toFixed(1)}M`;if(v>=1e3)return`${(v/1e3).toFixed(0)}K`;return String(v);}
function mom(m:number){if(m>0.15)return{i:"▲",c:"#16a34a"};if(m>0)return{i:"→",c:"#c49a1a"};return{i:"▼",c:"#f87171"};}
function sc(s:number){return s>=80?"#16a34a":s>=60?"#f59e0b":"#f87171";}

/* ═══════════════════════════════════════
   MODULE A — CURATION
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
    try{const r=await fetch(`${API}/api/v1/curation/keywords/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({category_slug:slug,max_results:10,sort_by:"blue_ocean"})});if(!r.ok)throw new Error(`실패(${r.status})`);store.setKeywords((await r.json()).keywords||[]);}catch(e:any){setErr(e.message);}finally{setLd(false);}
  };
  const pickKw=async(kw:any)=>{
    store.setSelectedKeyword(kw.keyword);store.setStep(2);setNld(true);setErr(null);
    store.setNews([]);store.setSelectedNews([]);store.setScript(null);store.setVideo(null);store.setShield(null);
    setTimeout(()=>{document.getElementById("news-feed")?.scrollIntoView({behavior:"smooth"});},200);
    try{const r=await fetch(`${API}/api/v1/curation/news/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:kw.keyword,days_back:7,max_results:10})});if(!r.ok)throw new Error("뉴스 로드 실패");store.setNews((await r.json()).articles||[]);}catch(e:any){setErr(e.message);}finally{setNld(false);}
  };
  const togNews=(a:any)=>{const c=store.selectedNews;store.setSelectedNews(c.find((n:any)=>n.id===a.id)?c.filter((n:any)=>n.id!==a.id):[...c,a]);};

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      {/* Left Panel */}
      <div className="w-full md:w-[420px] shrink-0 md:border-r md:flex md:flex-col md:overflow-hidden" style={{borderColor:"var(--border)"}}>
        {/* Categories */}
        <div className="p-3 md:p-4 border-b shrink-0" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] md:text-[15px] font-extrabold text-[#4b5563]">카테고리</h2>
            <Guide items={[{q:"CPM ($12~18)?",a:"광고 1,000회 노출당 수익. CPM $15 → 1만 조회 시 $150."},
              {q:"어떤 카테고리?",a:"수익 우선 → 경제/시니어. 성장 우선 → 테크/라이프."}]}/>
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {cats.map(cat=>{
              const on=store.category===cat.slug;
              return(
                <button key={cat.slug} onClick={()=>pickCat(cat.slug)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg shrink-0 transition-all
                    ${on?"border border-[#c49a1a]/40":"border border-transparent"}`}
                  style={on?{background:"rgba(212,175,55,0.06)"}:{}}>
                  <span className="text-[20px]">{cat.icon}</span>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${on?"text-[#c49a1a]":"text-[#6b7280]"}`}>{cat.label_ko?.split(' / ')[0]||cat.slug}</span>
                  <span className="text-[8px] text-[#b0b5bf]">{cat.cpm_range}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keywords */}
        <div className="md:flex-1 md:overflow-y-auto p-3 md:p-4" style={{background:"var(--bg-secondary)"}}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] md:text-[15px] font-extrabold text-[#4b5563]">황금 키워드</h2>
            <div className="flex items-center gap-2">
              {store.keywords.length>0&&<span className="text-[10px] text-[#b0b5bf] font-bold">{store.keywords.length}개</span>}
              <Guide items={[{q:"BOI 등급?",a:"검색량 대비 경쟁이 적으면 높은 등급. A+=틈새 기회."},
                {q:"데이터 의미?",a:"검색=월간 검색수. 경쟁=기존 영상 수. CPM=광고 단가."}]}/>
            </div>
          </div>
          {err&&<ErrBox>{err}</ErrBox>}
          {ld?<Spinner className="py-8"/>:store.keywords.length>0?(
            <div className="space-y-1.5">
              {store.keywords.map((kw:any,i:number)=>{
                const on=store.selectedKeyword===kw.keyword;
                const g=boi(kw.blue_ocean_index||0);
                const m=mom(kw.trend_momentum||0);
                return(
                  <div key={i} onClick={()=>pickKw(kw)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all anim-fade-up
                      ${on?"border-[#c49a1a]/30 glow-gold":"border-[#f0f1f3] hover:border-[#d5d7db] active:scale-[0.98]"}`}
                    style={{animationDelay:`${i*40}ms`,...(on?{background:"rgba(212,175,55,0.04)"}:{})}}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-[#c0c5ce] font-bold w-4 shrink-0">{i+1}</span>
                      <span className={`text-[13px] md:text-[15px] font-extrabold flex-1 truncate ${on?"text-[#c49a1a]":"text-[#1a1d23]"}`}>{kw.keyword}</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0" style={{color:g.c,background:g.bg}}>{g.g}</span>
                    </div>
                    <div className="ml-6 mb-1.5">
                      <div className="h-1 rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.04)"}}>
                        <div className="h-full rounded-full anim-bar" style={{width:`${Math.min(100,(kw.blue_ocean_index/5)*100)}%`,background:g.c,animationDelay:`${i*60+200}ms`}}/>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6 text-[9px] md:text-[11px]">
                      <span className="text-[#9ca3af]">검색 <b className="text-[#6b7280]">{fv(kw.search_volume||0)}</b></span>
                      <span className="text-[#9ca3af]">경쟁 <b className="text-[#6b7280]">{kw.competition_count||0}</b></span>
                      <span className="text-[#9ca3af]">CPM <b className="text-[#6b7280]">{kw.estimated_cpm?`$${kw.estimated_cpm.toFixed(0)}`:"-"}</b></span>
                      <span className="font-bold ml-auto" style={{color:m.c}}>{m.i}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ):<Empty icon="◈" text="카테고리를 선택하세요"/>}
        </div>
      </div>

      {/* Right: News Feed */}
      <div id="news-feed" className="flex-1 md:flex md:flex-col md:overflow-hidden min-w-0" style={{background:"var(--bg-primary)"}}>
        <div className="p-3 md:p-4 border-b flex items-center justify-between shrink-0" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[13px] md:text-[15px] font-extrabold text-[#4b5563]">뉴스 소스 피드</h2>
          <div className="flex items-center gap-2">
            {store.selectedNews.length>0&&<span className="text-[11px] font-bold text-[#16a34a] px-2 py-0.5 rounded-md" style={{background:"rgba(22,163,74,0.08)"}}>{store.selectedNews.length}개</span>}
            <Guide items={[{q:"뉴스 출처?",a:"선택 키워드로 최근 7일 뉴스를 AI가 자동 수집."},
              {q:"몇 개 선택?",a:"2~4개가 적당. 적으면 빈약, 많으면 초점 흐림."}]}/>
          </div>
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-3 md:p-4">
          {nld?<Spinner className="py-12"/>:store.news.length>0?(
            <div className="space-y-2">
              {store.news.map((a:any,i:number)=>{
                const sel=store.selectedNews.find((n:any)=>n.id===a.id);
                return(
                  <div key={i} onClick={()=>togNews(a)}
                    className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all anim-fade-up active:scale-[0.98]
                      ${sel?"border-[#16a34a]/30 glow-green":"border-[#f0f1f3] hover:border-[#d5d7db]"}`}
                    style={{animationDelay:`${i*50}ms`,...(sel?{background:"rgba(22,163,74,0.03)"}:{})}}>
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${sel?"border-[#16a34a] bg-[#16a34a]":"border-[#d1d5db]"}`}>
                        {sel&&<span className="text-white text-[10px]">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] md:text-[14px] font-bold text-[#1a1d23] leading-tight mb-1 line-clamp-2">{a.title}</h3>
                        <p className="text-[11px] text-[#9ca3af] line-clamp-2 mb-1.5">{a.summary}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{background:"rgba(196,154,26,0.08)",color:"#c49a1a"}}>{a.cpm_tier||"Mid"}</span>
                          <span className="text-[9px] text-[#b0b5bf]">{a.source||"News"}</span>
                          {a.relevance_score&&<span className="text-[9px] text-[#b0b5bf]">관련도 {Math.round(a.relevance_score*100)}%</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ):store.selectedKeyword?<Empty icon="📰" text="뉴스를 불러오는 중..."/>:<Empty icon="📰" text="키워드를 선택하면 뉴스가 표시됩니다"/>}

          {store.selectedNews.length>0&&(
            <div className="mt-4 sticky bottom-0">
              <GoldBtn onClick={()=>{store.setStep(3);store.setActivePage("script");}}>
                스크립트 생성 → ({store.selectedNews.length}개 뉴스)
              </GoldBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE B — SCRIPT
   ═══════════════════════════════════════ */
function ScriptPage(){
  const store=useBlackboxStore();
  const[ld,setLd]=useState(false);const[err,setErr]=useState<string|null>(null);
  const[view,setView]=useState<"blocks"|"scenario">("blocks");
  const[ebi,setEbi]=useState<number|null>(null);const[et,setEt]=useState("");

  const gen=async()=>{if(!store.selectedKeyword)return;setLd(true);setErr(null);
    const ns=store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n");
    try{const r=await fetch(`${API}/api/v1/script/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],opinion_tone:"balanced",target_duration_sec:600})});if(!r.ok)throw new Error(`실패(${r.status})`);store.setScript(await r.json());}catch(e:any){setErr(e.message);}finally{setLd(false);}};

  useEffect(()=>{if(!store.script&&store.selectedKeyword&&store.selectedNews.length>0)gen();},[]);

  const eb=async(i:number)=>{if(!store.script)return;try{const r=await fetch(`${API}/api/v1/script/edit-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,new_text:et,blocks:store.script.blocks})});if(r.ok){const d=await r.json();const nb=Array.isArray(d.blocks)?d.blocks:Array.isArray(d)?d:store.script.blocks;store.setScript({...store.script,blocks:nb});setEbi(null);}}catch{}};
  const rb=async(i:number)=>{if(!store.script)return;try{const r=await fetch(`${API}/api/v1/script/regenerate-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,keyword:store.selectedKeyword,category:store.category,instruction:"",blocks:store.script.blocks})});if(r.ok){const d=await r.json();const nb=Array.isArray(d.blocks)?d.blocks:Array.isArray(d)?d:store.script.blocks;store.setScript({...store.script,blocks:nb});}}catch{}};
  const ext=async()=>{if(!store.script)return;setLd(true);setErr(null);try{const r=await fetch(`${API}/api/v1/script/extend`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,current_blocks:store.script.blocks,extend_paragraphs:3,instruction:""})});const d=await r.json();if(d.error){setErr(d.error);}else{const nb=Array.isArray(d.blocks)?d.blocks:Array.isArray(d)?d:store.script.blocks;store.setScript({...store.script,blocks:nb,total_duration_sec:d.total_duration_sec||nb.reduce((s:number,b:any)=>s+(b.duration_sec||0),0)});}}catch(e:any){setErr(e.message||"분량 추가 실패");}finally{setLd(false);}};
  const rew=async()=>{if(!store.script)return;setLd(true);try{const ns=store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n");const r=await fetch(`${API}/api/v1/script/rewrite`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],instruction:"",target_duration_sec:600})});if(r.ok)store.setScript(await r.json());}catch{}finally{setLd(false);}};

  const dur=store.script?.total_duration_sec||0;
  const ch=store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text?.length||0),0)||0;

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      {/* Main */}
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden min-w-0">
        <div className="p-3 md:p-4 border-b flex items-center justify-between shrink-0" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
          <div className="flex items-center gap-3">
            <h2 className="text-[13px] md:text-[15px] font-extrabold text-[#4b5563]">AI 스크립트</h2>
            {store.script&&(
              <div className="flex rounded-lg overflow-hidden border" style={{borderColor:"var(--border)"}}>
                <button onClick={()=>setView("blocks")} className={`px-2.5 py-1 text-[10px] md:text-[11px] font-bold ${view==="blocks"?"text-[#c49a1a]":"text-[#b0b5bf]"}`} style={view==="blocks"?{background:"rgba(196,154,26,0.08)"}:{}}>블록</button>
                <button onClick={()=>setView("scenario")} className={`px-2.5 py-1 text-[10px] md:text-[11px] font-bold ${view==="scenario"?"text-[#c49a1a]":"text-[#b0b5bf]"}`} style={view==="scenario"?{background:"rgba(196,154,26,0.08)"}:{}}>시나리오</button>
              </div>
            )}
          </div>
          {store.script&&<div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded-md font-bold" style={{background:"rgba(99,102,241,0.08)",color:"#6366f1"}}>{ch.toLocaleString()}자</span>
            <span className="px-2 py-0.5 rounded-md font-bold" style={{background:"rgba(14,165,233,0.08)",color:"#0ea5e9"}}>{Math.floor(dur/60)}:{String(Math.round(dur%60)).padStart(2,'0')}</span>
            <span className="px-2 py-0.5 rounded-md font-bold" style={{background:"rgba(168,139,250,0.08)",color:"#a78bfa"}}>{store.script.blocks?.length||0}블록</span>
          </div>}
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-3 md:p-5">
          {err&&<ErrBox>{err}</ErrBox>}
          {ld?<Spinner className="py-16"/>:store.script&&view==="blocks"?(
            <div className="space-y-2">
              {store.script.blocks?.map((b:any,i:number)=>{
                const secMap:{[k:string]:{label:string;color:string;icon:string}}={
                  hook:{label:"오프닝",color:"#c49a1a",icon:"🎯"},
                  body:{label:"본문",color:"#3b82f6",icon:"📝"},
                  opinion:{label:"의견",color:"#a78bfa",icon:"💬"},
                  cta:{label:"CTA",color:"#22c55e",icon:"📢"},
                };
                const s=secMap[b.section]||secMap.body;
                return(
                  <div key={i} className="p-3 md:p-4 rounded-xl border anim-fade-up" style={{borderColor:"var(--border)",animationDelay:`${i*40}ms`}}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[12px]">{s.icon}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{color:s.color,background:`${s.color}12`}}>{s.label}</span>
                      <span className="text-[9px] text-[#b0b5bf] ml-auto">{b.duration_sec?.toFixed(0)}s</span>
                      <button onClick={()=>rb(i)} className="text-[9px] text-[#b0b5bf] hover:text-[#6b7280] px-1">🔄</button>
                      <button onClick={()=>{setEbi(i);setEt(b.text);}} className="text-[9px] text-[#b0b5bf] hover:text-[#6b7280] px-1">✏️</button>
                    </div>
                    {ebi===i?(
                      <div className="space-y-2">
                        <textarea value={et} onChange={e=>setEt(e.target.value)} rows={4} className="w-full p-2 rounded-lg text-[12px] border resize-none focus:outline-none focus:ring-1 focus:ring-[#c49a1a]/30" style={{borderColor:"var(--border)"}}/>
                        <div className="flex gap-2">
                          <button onClick={()=>eb(i)} className="px-3 py-1 rounded-md text-[10px] font-bold text-white" style={{background:"#c49a1a"}}>저장</button>
                          <button onClick={()=>setEbi(null)} className="px-3 py-1 rounded-md text-[10px] font-bold text-[#9ca3af]">취소</button>
                        </div>
                      </div>
                    ):<p className="text-[12px] md:text-[13px] text-[#4b5563] leading-relaxed">{b.text}</p>}
                  </div>
                );
              })}
            </div>
          ):store.script&&view==="scenario"?(
            <div className="p-4 rounded-xl border" style={{borderColor:"var(--border)"}}>
              {store.script.blocks?.map((b:any,i:number)=>(
                <p key={i} className="text-[13px] text-[#4b5563] leading-relaxed mb-3">{b.text}</p>
              ))}
            </div>
          ):!store.script?<Empty icon="◆" text="큐레이션을 먼저 완료하세요"/>:null}
        </div>
      </div>

      {/* Tools Panel */}
      <div className="w-full md:w-[280px] shrink-0 md:border-l md:flex md:flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-3 md:p-4 border-b md:border-t-0 border-t shrink-0" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[13px] font-extrabold text-[#4b5563]">도구</h2>
        </div>
        <div className="p-3 md:p-4 space-y-2">
          <Guide items={[{q:"재생성/재작성 차이?",a:"재생성=같은 뉴스로 새 대본. 재작성=톤/스타일 완전 변경."},
            {q:"분량 추가?",a:"현재 대본에 3문단 추가. 영상 길이가 늘어남."}]}/>
          <TBtn icon="🔄" label="전체 재생성" desc="같은 소스로 새로 작성" onClick={gen} disabled={ld||!store.selectedKeyword}/>
          <TBtn icon="📝" label="분량 추가" desc="3문단 추가" onClick={ext} disabled={ld||!store.script}/>
          <TBtn icon="✨" label="전체 재작성" desc="톤/스타일 변경" onClick={rew} disabled={ld||!store.script}/>
          {store.script&&<div className="pt-3"><GoldBtn onClick={()=>{store.setStep(4);store.setActivePage("video");}}>영상 제작 →</GoldBtn></div>}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE C — VIDEO
   ═══════════════════════════════════════ */
function VideoPage(){
  const store=useBlackboxStore();
  const[ld,setLd]=useState(false);const[pg,setPg]=useState(0);const[err,setErr]=useState<string|null>(null);
  const[phase,setPhase]=useState(0);const[elapsed,setElapsed]=useState(0);

  const gen=async()=>{if(!store.script)return;setLd(true);setErr(null);setPg(0);setPhase(1);setElapsed(0);
    const t0=Date.now();
    const ticker=setInterval(()=>{
      const sec=Math.floor((Date.now()-t0)/1000);setElapsed(sec);
      if(sec<15){setPhase(1);setPg(Math.min(18,Math.floor(sec/15*18)));}
      else if(sec<90){setPhase(2);setPg(18+Math.min(37,Math.floor((sec-15)/75*37)));}
      else if(sec<120){setPhase(3);setPg(55+Math.min(20,Math.floor((sec-90)/30*20)));}
      else if(sec<210){setPhase(4);setPg(75+Math.min(20,Math.floor((sec-120)/90*20)));}
      else{setPg(Math.min(96,95));}
    },500);
    try{const r=await fetch(`${API}/api/v1/video/generate-real`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,mode:store.mode,script_blocks:store.script.blocks,channel_name:store.profile.channelName,watermark_text:store.profile.watermarkText||store.profile.channelName,tts_voice_id:store.profile.ttsVoiceId})});
      clearInterval(ticker);if(!r.ok)throw new Error(`실패(${r.status})`);const d=await r.json();
      if(d.status==="completed"||d.status==="done"||d.download_url){setPhase(5);setPg(100);store.setVideo(d);store.setStep(5);setLd(false);}
      else if(d.status==="error"){throw new Error(d.error||"실패");}
      else{const iv=setInterval(async()=>{try{const r2=await fetch(`${API}/api/v1/video/status/${d.job_id}`);if(r2.ok){const d2=await r2.json();if(d2.status==="completed"||d2.status==="done"){clearInterval(iv);setPhase(5);setPg(100);store.setVideo(d2);store.setStep(5);setLd(false);}}}catch{}},5000);setTimeout(()=>{clearInterval(iv);setLd(false);},600000);}
    }catch(e:any){clearInterval(ticker);setErr(e.message);setLd(false);}};

  const totalDur=store.script?.total_duration_sec||0;
  const totalBlocks=store.script?.blocks?.length||0;

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden min-w-0">
        <div className="p-3 md:p-4 border-b shrink-0" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
          <h2 className="text-[13px] md:text-[15px] font-extrabold text-[#4b5563]">영상 제작</h2>
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-4 md:p-6">
          {err&&<ErrBox>{err}</ErrBox>}

          {ld?(
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-full max-w-sm p-5 rounded-2xl relative overflow-hidden" style={{background:"var(--bg-card)",border:"1px solid var(--border)",boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:"linear-gradient(90deg,#c49a1a,#e8c84a,#c49a1a)",backgroundSize:"200% 100%",animation:"shimmer 2s linear infinite"}}/>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-bold text-[#1a1d23]">영상 생성 중</span>
                  <span className="text-[16px] font-black tabular-nums" style={{color:"#c49a1a"}}>{pg}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-5" style={{background:"rgba(0,0,0,0.05)"}}>
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${pg}%`,background:"linear-gradient(90deg,#c49a1a,#e8c84a)"}}/>
                </div>
                <div className="space-y-1">
                  {([{label:"TTS 음성",done:phase>1,active:phase===1,icon:"🎙"},
                     {label:"자료화면",done:phase>2,active:phase===2,icon:"🎨"},
                     {label:"아바타",done:phase>3,active:phase===3,icon:"👤"},
                     {label:"최종 합성",done:phase>=5,active:phase===4,icon:"🎬"}
                  ] as const).map((s,i)=>(
                    <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all ${s.active?"bg-[#c49a1a]/5 border border-[#c49a1a]/15":s.done?"bg-[#16a34a]/3":"border border-transparent"}`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${s.done?"bg-[#16a34a]/10 text-[#16a34a]":s.active?"bg-[#c49a1a]/10 text-[#c49a1a]":"bg-[#f3f4f6] text-[#d1d5db]"}`}>
                        {s.done?"✓":s.active?<span style={{animation:"spin 2s linear infinite",display:"inline-block"}}>{s.icon}</span>:<span className="text-[10px]">{i+1}</span>}
                      </div>
                      <span className={`text-[12px] font-semibold ${s.done?"text-[#374151]":s.active?"text-[#1a1d23]":"text-[#c0c5ce]"}`}>{s.label}</span>
                      {s.done&&<span className="text-[9px] text-[#16a34a] font-bold ml-auto">완료</span>}
                      {s.active&&<div className="flex gap-0.5 ml-auto">{[0,1,2].map(d=><span key={d} className="w-1 h-1 rounded-full bg-[#c49a1a]" style={{animation:`dot-bounce 1.4s ease-in-out ${d*0.2}s infinite`}}/>)}</div>}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-[#b0b5bf]">{elapsed>0?`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')} 경과`:"약 3~5분 소요"}</p>
            </div>
          ):store.video?(
            <div className="flex flex-col items-center py-8 gap-4 anim-fade-up">
              <div className="text-[48px] anim-score">🎬</div>
              <h3 className="text-[18px] font-bold text-[#1a1d23]">영상 완성!</h3>
              <p className="text-[12px] text-[#9ca3af]">{store.video.duration_sec?.toFixed(0)}초 · {((store.video.file_size_bytes||0)/1024/1024).toFixed(1)}MB</p>
              <a href={`${API}${store.video.download_url}`} download className="px-8 py-3 rounded-xl text-[14px] font-bold text-white" style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>⬇ 다운로드</a>
              <GoldBtn onClick={()=>{store.setStep(5);store.setActivePage("deploy");}}>검수 & 배포 →</GoldBtn>
            </div>
          ):store.script?(
            <div className="flex flex-col items-center py-12 gap-5">
              <Guide items={[{q:"영상 생성 과정?",a:"TTS → Gemini 인포그래픽/Pexels 배경 → 아바타(선택) → FFmpeg 합성."},
                {q:"시니어 모드?",a:"TTS 느리게, 자막 크게, BGM 작게. 50대+ 타겟."}]}/>
              <div className="text-center">
                <p className="text-[12px] text-[#9ca3af] mb-1">{totalBlocks}블록 · {Math.floor(totalDur/60)}분 {Math.round(totalDur%60)}초</p>
                <button onClick={gen} className="px-10 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.97] anim-pulse"
                  style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 6px 30px rgba(196,154,26,0.3)"}}>
                  🎬 영상 생성 시작
                </button>
              </div>
            </div>
          ):<Empty icon="▶" text="스크립트가 필요합니다"/>}
        </div>
      </div>

      {/* Settings */}
      <div className="w-full md:w-[260px] shrink-0 md:border-l md:flex md:flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-3 md:p-4 border-b md:border-t-0 border-t shrink-0" style={{borderColor:"var(--border)"}}><h2 className="text-[13px] font-extrabold text-[#4b5563]">설정</h2></div>
        <div className="p-3 md:p-4 space-y-3 text-[12px]">
          <div className="flex justify-between"><span className="text-[#9ca3af]">시니어 모드</span><Tog on={store.mode==="senior"} fn={()=>store.setMode(store.mode==="senior"?"normal":"senior")}/></div>
          <div className="h-px" style={{background:"var(--border)"}}/>
          {([["해상도","1920×1080"],["TTS","ElevenLabs"],["비주얼","Gemini AI"],["자막","한글"],["BGM","Ambient"]] as [string,string][]).map(([l,v])=><Row key={l} l={l} v={v}/>)}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE D — DEPLOY
   ═══════════════════════════════════════ */
function DeployPage(){
  const store=useBlackboxStore();
  const[sL,setSl]=useState(false);const[err,setErr]=useState<string|null>(null);

  const runShield=async()=>{if(!store.script||!store.video)return;setSl(true);setErr(null);
    try{const r=await fetch(`${API}/api/v1/shield/safety-check`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,script_blocks:store.script.blocks,video_info:store.video})});if(!r.ok)throw new Error(`실패(${r.status})`);store.setShield(await r.json());store.setStep(6);}catch(e:any){setErr(e.message);}finally{setSl(false);}};
  useEffect(()=>{if(!store.shield&&store.video&&store.script)runShield();},[]);

  const s=store.shield?.safety_score||0;
  const passed=s>=70;
  const goBackToScript=()=>{store.setActivePage("script");};
  const goBackToVideo=()=>{store.setActivePage("video");store.setVideo(null);};

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden">
        <div className="p-3 md:p-4 border-b shrink-0" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}><h2 className="text-[13px] md:text-[15px] font-extrabold text-[#4b5563]">알고리즘 실드</h2></div>
        <div className="md:flex-1 md:overflow-y-auto p-4 md:p-6">
          <Guide items={[{q:"Safety Score?",a:"유튜브 수익 창출 정책 안전도 (0~100). 70+ 필요."},
            {q:"점수 낮으면?",a:"의견/팩트 추가, 영상 길이 늘리기, 아바타 활성화."}]}/>
          {err&&<ErrBox>{err}</ErrBox>}
          {sL?<Spinner className="py-16"/>:store.shield?(
            <div className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="text-center anim-score">
                  <div className="text-[56px] md:text-[72px] font-black leading-none" style={{color:sc(s)}}>{Math.round(s)}</div>
                  <div className="text-[13px] font-bold mt-1" style={{color:sc(s)}}>{store.shield.grade}</div>
                  <div className="text-[11px] text-[#b0b5bf] mt-0.5">{passed?"✓ 안전":"⚠ 개선 필요"}</div>
                </div>
                <div className="flex-1">
                  <div className="h-4 rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.04)"}}>
                    <div className="h-full rounded-full anim-bar" style={{width:`${s}%`,background:sc(s)}}/>
                  </div>
                </div>
              </div>

              {!passed&&(
                <div className="p-4 rounded-xl border border-[#f87171]/20 anim-fade-up" style={{background:"rgba(248,113,113,0.03)"}}>
                  <p className="text-[13px] font-bold text-[#f87171] mb-2">🚫 수익화 위험</p>
                  <div className="flex gap-2">
                    <button onClick={goBackToScript} className="flex-1 p-3 rounded-lg border text-center text-[11px] font-bold text-[#6b7280]" style={{borderColor:"var(--border)"}}>📝 스크립트 수정</button>
                    <button onClick={goBackToVideo} className="flex-1 p-3 rounded-lg border text-center text-[11px] font-bold text-[#6b7280]" style={{borderColor:"var(--border)"}}>🎬 영상 재생성</button>
                  </div>
                </div>
              )}

              {store.shield.checks&&(
                <div className="space-y-1.5">
                  {store.shield.checks.map((c:any,i:number)=>(
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg anim-fade-up" style={{animationDelay:`${i*60}ms`,background:c.passed?"rgba(22,163,74,0.03)":"rgba(248,113,113,0.03)"}}>
                      <span className="text-[12px]">{c.passed?"✅":"❌"}</span>
                      <span className="text-[12px] text-[#4b5563] flex-1">{c.label}</span>
                      <span className="text-[10px] font-bold" style={{color:c.passed?"#16a34a":"#f87171"}}>{c.score}/{c.max}</span>
                    </div>
                  ))}
                </div>
              )}

              {passed&&store.video&&(
                <div className="space-y-3 pt-4">
                  <a href={`${API}${store.video.download_url}`} download
                    className="block w-full py-3 rounded-xl text-center text-[14px] font-bold text-white"
                    style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>
                    ⬇ 최종 다운로드
                  </a>
                </div>
              )}
            </div>
          ):<Empty icon="◉" text="영상이 필요합니다"/>}
        </div>
      </div>

      {/* SEO/Schedule */}
      <div className="w-full md:w-[280px] shrink-0 md:border-l md:flex md:flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-3 md:p-4 border-b md:border-t-0 border-t shrink-0" style={{borderColor:"var(--border)"}}><h2 className="text-[13px] font-extrabold text-[#4b5563]">SEO & 스케줄</h2></div>
        <div className="p-3 md:p-4 space-y-3">
          {store.shield?.seo?(
            <>
              <div><label className="text-[10px] font-bold text-[#9ca3af] block mb-1">추천 제목</label><p className="text-[12px] font-bold text-[#1a1d23] p-2 rounded-lg" style={{background:"var(--bg-elevated)"}}>{store.shield.seo.title}</p></div>
              <div><label className="text-[10px] font-bold text-[#9ca3af] block mb-1">설명</label><p className="text-[11px] text-[#6b7280] p-2 rounded-lg line-clamp-4" style={{background:"var(--bg-elevated)"}}>{store.shield.seo.description}</p></div>
              <div><label className="text-[10px] font-bold text-[#9ca3af] block mb-1">태그</label><div className="flex flex-wrap gap-1">{store.shield.seo.tags?.map((t:string,i:number)=><span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#6b7280]">{t}</span>)}</div></div>
            </>
          ):<p className="text-[11px] text-[#b0b5bf]">분석 후 자동 생성됩니다</p>}
          {store.shield?.schedule&&(
            <div className="p-3 rounded-xl" style={{background:"rgba(196,154,26,0.04)",border:"1px solid rgba(196,154,26,0.1)"}}>
              <p className="text-[10px] font-bold text-[#c49a1a] mb-1">추천 업로드 시간</p>
              <p className="text-[13px] font-bold text-[#1a1d23]">{store.shield.schedule.best_time}</p>
              <p className="text-[10px] text-[#9ca3af] mt-0.5">{store.shield.schedule.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══ SHARED COMPONENTS ═══ */
function Guide({items}:{items:{q:string;a:string}[]}){
  const[open,setOpen]=useState(false);
  return(
    <div className="mb-2">
      <button onClick={()=>setOpen(!open)} className="flex items-center gap-1.5 text-[10px] text-[#b0b5bf] hover:text-[#9ca3af] transition-colors">
        <span style={{transform:open?"rotate(90deg)":"",transition:"transform 0.2s",display:"inline-block",fontSize:"8px"}}>▶</span>
        <span className="font-bold">사용법</span>
      </button>
      {open&&(
        <div className="mt-2 p-3 rounded-lg space-y-2 text-[11px] anim-fade-up" style={{background:"rgba(196,154,26,0.03)",border:"1px solid rgba(196,154,26,0.08)"}}>
          {items.map((item,i)=>(
            <div key={i}>
              <div className="font-bold text-[#c49a1a] mb-0.5 text-[10px]">{item.q}</div>
              <div className="text-[#7c8290] leading-relaxed text-[10px]">{item.a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Spinner({className=""}:{className?:string}){return<div className={`flex items-center justify-center ${className}`}><div className="w-7 h-7 border-2 border-[#c49a1a]/15 border-t-[#c49a1a] rounded-full animate-spin"/></div>;}
function Empty({icon,text}:{icon:string;text:string}){return<div className="flex flex-col items-center justify-center py-16 text-[#d1d5db]"><span className="text-[40px] mb-3 anim-float">{icon}</span><span className="text-[13px]">{text}</span></div>;}
function ErrBox({children}:{children:React.ReactNode}){return<div className="mb-3 p-3 rounded-xl border border-red-400/20 bg-red-50 text-red-500 text-[12px]">{children}</div>;}
function GoldBtn({children,onClick,disabled}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean}){return<button onClick={onClick} disabled={disabled} className="w-full py-3 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-30" style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 4px 16px rgba(196,154,26,0.2)"}}>{children}</button>;}
function TBtn({icon,label,desc,onClick,disabled}:{icon:string;label:string;desc:string;onClick:()=>void;disabled?:boolean}){return<button onClick={onClick} disabled={disabled} className="w-full text-left p-3 rounded-xl border transition-all hover:border-[#d5d7db] active:scale-[0.98] disabled:opacity-20" style={{borderColor:"var(--border)"}}><div className="flex items-center gap-3"><span className="text-[18px]">{icon}</span><div><div className="text-[12px] font-bold text-[#374151]">{label}</div><div className="text-[10px] text-[#b0b5bf]">{desc}</div></div></div></button>;}
function Row({l,v}:{l:string;v:string}){return<div className="flex items-center justify-between"><span className="text-[11px] text-[#b0b5bf]">{l}</span><span className="text-[11px] text-[#6b7280] font-bold">{v}</span></div>;}
function Tog({on,fn}:{on:boolean;fn:()=>void}){return<button onClick={fn} className={`w-10 h-5 rounded-full relative transition-all ${on?"bg-[#c49a1a]":"bg-[#e5e7eb]"}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${on?"left-[22px]":"left-0.5"}`}/></button>;}
