"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

export default function CreatePage() {
  const { activePage } = useBlackboxStore();
  return (
    <div className="h-full">
      {activePage==="curation" && <CurationPage/>}
      {activePage==="script"   && <ScriptPage/>}
      {activePage==="video"    && <VideoPage/>}
      {activePage==="deploy"   && <DeployPage/>}
      {activePage==="channel"  && <ChannelPage/>}
    </div>
  );
}

/* ── helpers ── */
function boi(s:number){if(s>=4.5)return{g:"A+",c:"#34d399",bg:"rgba(52,211,153,0.10)"};if(s>=3.8)return{g:"A",c:"#6ee7b7",bg:"rgba(110,231,183,0.08)"};if(s>=3)return{g:"B+",c:"#e8c84a",bg:"rgba(232,200,74,0.10)"};if(s>=2.2)return{g:"B",c:"#f59e0b",bg:"rgba(245,158,11,0.08)"};return{g:"C",c:"#f87171",bg:"rgba(248,113,113,0.08)"};}
function fv(v:number){if(v>=1e6)return`${(v/1e6).toFixed(1)}M`;if(v>=1e3)return`${(v/1e3).toFixed(0)}K`;return String(v);}
function mom(m:number){if(m>0.15)return{i:"▲",c:"#34d399"};if(m>0)return{i:"→",c:"#e8c84a"};return{i:"▼",c:"#f87171"};}
function sc(s:number){return s>=80?"#34d399":s>=60?"#e8c84a":"#f87171";}

function SH({icon,label}:{icon:string;label:string}){
  return(
    <div className="flex items-center gap-2 mb-3">
      <div className="w-[3px] h-[16px] rounded-full flex-shrink-0" style={{background:"#e8c84a"}}/>
      <span className="text-[11px] font-black tracking-wider uppercase" style={{color:"rgba(255,255,255,0.45)"}}>{icon} {label}</span>
    </div>
  );
}

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
    try{const r=await fetch(`${API}/api/v1/curation/news/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:kw.keyword,days_back:7,max_results:10})});if(!r.ok)throw new Error("뉴스 로드 실패");store.setNews((await r.json()).articles||[]);}catch(e:any){setErr(e.message);}finally{setNld(false);}
  };
  const togNews=(a:any)=>{const c=store.selectedNews;store.setSelectedNews(c.find((n:any)=>n.id===a.id)?c.filter((n:any)=>n.id!==a.id):[...c,a]);};

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      {/* Left Panel */}
      <div className="w-full md:w-[400px] lg:w-[420px] shrink-0 md:flex md:flex-col md:overflow-hidden md:border-r"
        style={{borderColor:"rgba(255,255,255,0.07)"}}>
        <div className="px-4 py-3 shrink-0" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <h2 className="text-[15px] font-extrabold" style={{color:"rgba(255,255,255,0.88)"}}>뉴스 큐레이션</h2>
          <p className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,0.32)"}}>카테고리 선택 → 키워드 발굴 → 뉴스 수집</p>
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-4 space-y-5">
          {err&&<ErrBox>{err}</ErrBox>}
          <div>
            <SH icon="⊞" label="카테고리"/>
            <div className="grid grid-cols-2 gap-2">
              {cats.map(cat=>{
                const on=store.category===cat.slug;
                return(
                  <button key={cat.slug} onClick={()=>pickCat(cat.slug)}
                    className={`vto-card ${on?"active":""} p-3 text-left transition-all`}>
                    <div className="text-[22px] mb-1.5">{cat.icon}</div>
                    <div className="text-[12px] font-bold" style={{color:on?"#e8c84a":"rgba(255,255,255,0.75)"}}>
                      {cat.label_ko?.split(' / ')[0]||cat.slug}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{color:on?"rgba(232,200,74,0.65)":"rgba(255,255,255,0.28)"}}>
                      CPM {cat.cpm_range}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <SH icon="◈" label="황금 키워드"/>
              {store.keywords.length>0&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{background:"rgba(232,200,74,0.10)",color:"#e8c84a"}}>{store.keywords.length}개</span>}
            </div>
            {ld?<Spinner className="py-8"/>:store.keywords.length>0?(
              <div className="space-y-2">
                {store.keywords.map((kw:any,i:number)=>{
                  const on=store.selectedKeyword===kw.keyword;
                  const g=boi(kw.blue_ocean_index||0);
                  const m=mom(kw.trend_momentum||0);
                  const boiVal=(kw.blue_ocean_index||0);
                  const cpm=kw.estimated_cpm||15;
                  const vol=kw.search_volume||0;
                  const comp=kw.competition_count||0;
                  const diffColor=comp>30000?"#f87171":comp>10000?"#e8c84a":"#34d399";
                  return(
                    <div key={i} onClick={()=>pickKw(kw)}
                      className={`vto-card ${on?"active":""} p-3 cursor-pointer anim-fade-up`}
                      style={{animationDelay:`${i*40}ms`}}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold w-5 text-center" style={{color:"rgba(255,255,255,0.22)"}}>{i+1}</span>
                        <span className="text-[13px] font-extrabold flex-1 truncate"
                          style={{color:on?"#e8c84a":"rgba(255,255,255,0.85)"}}>{kw.keyword}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md" style={{color:g.c,background:g.bg}}>{g.g}</span>
                        <span className="text-[10px] font-bold" style={{color:m.c}}>{m.i}</span>
                      </div>
                      <div className="ml-7">
                        <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{background:"rgba(255,255,255,0.06)"}}>
                          <div className="h-full rounded-full anim-bar" style={{width:`${Math.min(100,(boiVal/5)*100)}%`,background:`linear-gradient(90deg,${g.c}77,${g.c})`,animationDelay:`${i*60+200}ms`}}/>
                        </div>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span style={{color:"rgba(255,255,255,0.35)"}}>검색 <b style={{color:"rgba(255,255,255,0.65)"}}>{fv(vol)}</b></span>
                          <span style={{color:"rgba(255,255,255,0.35)"}}>CPM <b style={{color:"#e8c84a"}}>${cpm.toFixed(0)}</b></span>
                          <span style={{color:"rgba(255,255,255,0.35)"}}>경쟁 <b style={{color:diffColor}}>{comp>30000?"높음":comp>10000?"보통":"낮음"}</b></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ):<Empty icon="◈" text="카테고리를 선택하세요"/>}
          </div>
        </div>
      </div>

      {/* Right Panel: News */}
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden min-w-0">
        <div className="px-4 py-3 shrink-0 flex items-center justify-between"
          style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <div>
            <h2 className="text-[15px] font-extrabold" style={{color:"rgba(255,255,255,0.88)"}}>뉴스 소스 피드</h2>
            <p className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,0.32)"}}>
              {store.selectedKeyword?`"${store.selectedKeyword}" 관련 최신 뉴스`:"키워드를 선택하면 뉴스가 표시됩니다"}
            </p>
          </div>
          {store.selectedNews.length>0&&(
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{background:"rgba(52,211,153,0.10)",color:"#34d399"}}>
              {store.selectedNews.length}개 선택
            </span>
          )}
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-4">
          {nld?<Spinner className="py-12"/>:store.news.length>0?(
            <div className="space-y-2">
              {store.news.map((a:any,i:number)=>{
                const sel=store.selectedNews.find((n:any)=>n.id===a.id);
                const rel=a.relevance_score||0.7;
                const relColor=rel>=0.85?"#34d399":rel>=0.7?"#e8c84a":"rgba(255,255,255,0.35)";
                const tierColor=a.cpm_tier==="High"?"#34d399":a.cpm_tier==="Mid"?"#e8c84a":"rgba(255,255,255,0.35)";
                return(
                  <div key={i} onClick={()=>togNews(a)}
                    className={`vto-card ${sel?"glow-green":""} p-3 md:p-4 cursor-pointer anim-fade-up`}
                    style={{animationDelay:`${i*50}ms`}}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${sel?"border-[#34d399] bg-[#34d399]":"border-white/15"}`}>
                        {sel&&<span className="text-white text-[10px] font-black">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold leading-tight mb-1 line-clamp-2" style={{color:"rgba(255,255,255,0.85)"}}>{a.title}</h3>
                        <p className="text-[11px] line-clamp-2 mb-2 leading-relaxed" style={{color:"rgba(255,255,255,0.42)"}}>{a.summary}</p>
                        {a.key_facts&&a.key_facts.length>0&&(
                          <div className="mb-2 space-y-1">
                            {a.key_facts.slice(0,2).map((f:string,fi:number)=>(
                              <div key={fi} className="flex items-start gap-1.5">
                                <span className="text-[9px] mt-0.5">💡</span>
                                <span className="text-[10px] leading-tight" style={{color:"rgba(255,255,255,0.60)"}}>{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{background:`${tierColor}18`,color:tierColor}}>
                            {a.cpm_tier==="High"?"💰 High CPM":a.cpm_tier==="Mid"?"💵 Mid CPM":"📊 CPM"}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.45)"}}>
                            {a.source||"News"}
                          </span>
                          <span className="text-[9px] font-bold ml-auto" style={{color:relColor}}>{Math.round(rel*100)}%</span>
                          {a.published_at&&<span className="text-[9px]" style={{color:"rgba(255,255,255,0.25)"}}>{new Date(a.published_at).toLocaleDateString("ko-KR",{month:"short",day:"numeric"})}</span>}
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
                스크립트 생성하기 → ({store.selectedNews.length}개 뉴스 선택됨)
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
  const secMap:{[k:string]:{label:string;color:string;icon:string}}={
    hook:{label:"오프닝",color:"#e8c84a",icon:"🎯"},
    body:{label:"본문",color:"#60a5fa",icon:"📝"},
    opinion:{label:"의견",color:"#a78bfa",icon:"💬"},
    cta:{label:"CTA",color:"#34d399",icon:"📢"},
  };

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden min-w-0">
        <div className="px-4 py-3 shrink-0 flex items-center justify-between"
          style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-extrabold" style={{color:"rgba(255,255,255,0.88)"}}>AI 스크립트</h2>
            {store.script&&(
              <div className="flex rounded-lg overflow-hidden" style={{border:"1px solid rgba(255,255,255,0.09)"}}>
                {["blocks","scenario"].map(v=>(
                  <button key={v} onClick={()=>setView(v as "blocks"|"scenario")}
                    className="px-3 py-1 text-[11px] font-bold transition-all"
                    style={view===v?{background:"rgba(232,200,74,0.10)",color:"#e8c84a"}:{color:"rgba(255,255,255,0.35)"}}>
                    {v==="blocks"?"블록":"시나리오"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {store.script&&(
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded-md font-bold" style={{background:"rgba(96,165,250,0.10)",color:"#60a5fa"}}>{ch.toLocaleString()}자</span>
              <span className="px-2 py-0.5 rounded-md font-bold" style={{background:"rgba(167,139,250,0.10)",color:"#a78bfa"}}>{Math.floor(dur/60)}:{String(Math.round(dur%60)).padStart(2,"0")}</span>
              <span className="px-2 py-0.5 rounded-md font-bold" style={{background:"rgba(52,211,153,0.10)",color:"#34d399"}}>{store.script.blocks?.length||0}블록</span>
            </div>
          )}
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-4">
          {err&&<ErrBox>{err}</ErrBox>}
          {ld?<Spinner className="py-16"/>:store.script&&view==="blocks"?(
            <div className="space-y-2">
              {store.script.blocks?.map((b:any,i:number)=>{
                const s=secMap[b.section]||secMap.body;
                return(
                  <div key={i} className="vto-card p-3 md:p-4 anim-fade-up" style={{animationDelay:`${i*40}ms`}}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px]">{s.icon}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{color:s.color,background:`${s.color}12`}}>{s.label}</span>
                      <span className="text-[9px] ml-auto" style={{color:"rgba(255,255,255,0.25)"}}>{b.duration_sec?.toFixed(0)}s</span>
                      <button onClick={()=>rb(i)} className="text-[11px] px-1 transition-all" style={{color:"rgba(255,255,255,0.25)"}} title="재생성">🔄</button>
                      <button onClick={()=>{setEbi(i);setEt(b.text);}} className="text-[11px] px-1 transition-all" style={{color:"rgba(255,255,255,0.25)"}} title="편집">✏️</button>
                    </div>
                    {ebi===i?(
                      <div className="space-y-2">
                        <textarea value={et} onChange={e=>setEt(e.target.value)} rows={4}
                          className="w-full p-2 rounded-lg text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-[#e8c84a]/30"
                          style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.80)"}}/>
                        <div className="flex gap-2">
                          <button onClick={()=>eb(i)} className="px-3 py-1 rounded-md text-[10px] font-bold text-white" style={{background:"#c49a1a"}}>저장</button>
                          <button onClick={()=>setEbi(null)} className="px-3 py-1 rounded-md text-[10px] font-bold" style={{color:"rgba(255,255,255,0.40)"}}>취소</button>
                        </div>
                      </div>
                    ):<p className="text-[12px] md:text-[13px] leading-relaxed" style={{color:"rgba(255,255,255,0.65)"}}>{b.text}</p>}
                  </div>
                );
              })}
            </div>
          ):store.script&&view==="scenario"?(
            <div className="p-4 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
              {store.script.blocks?.map((b:any,i:number)=>(
                <p key={i} className="text-[13px] leading-relaxed mb-3" style={{color:"rgba(255,255,255,0.65)"}}>{b.text}</p>
              ))}
            </div>
          ):!store.script?<Empty icon="◆" text="큐레이션을 먼저 완료하세요"/>:null}
        </div>
      </div>
      <div className="w-full md:w-[260px] shrink-0 md:flex md:flex-col"
        style={{borderLeft:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="px-4 py-3 shrink-0" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <h2 className="text-[13px] font-extrabold" style={{color:"rgba(255,255,255,0.70)"}}>도구</h2>
        </div>
        <div className="p-4 space-y-2">
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
    try{const r=await fetch(`${API}/api/v1/video/generate-real`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,mode:"normal",script_blocks:store.script.blocks,channel_name:store.profile.channelName,watermark_text:store.profile.watermarkText||store.profile.channelName,tts_voice_id:store.profile.ttsVoiceId})});
      clearInterval(ticker);if(!r.ok)throw new Error(`실패(${r.status})`);const d=await r.json();
      if(d.status==="completed"||d.status==="done"||d.download_url){setPhase(5);setPg(100);store.setVideo(d);store.setStep(5);setLd(false);}
      else if(d.status==="error"){throw new Error(d.error||"실패");}
      else{const iv=setInterval(async()=>{try{const r2=await fetch(`${API}/api/v1/video/status/${d.job_id}`);if(r2.ok){const d2=await r2.json();if(d2.status==="completed"||d2.status==="done"){clearInterval(iv);setPhase(5);setPg(100);store.setVideo(d2);store.setStep(5);setLd(false);}}}catch{}},5000);setTimeout(()=>{clearInterval(iv);setLd(false);},600000);}
    }catch(e:any){clearInterval(ticker);setErr(e.message);setLd(false);}};

  const totalDur=store.script?.total_duration_sec||0;
  const totalBlocks=store.script?.blocks?.length||0;
  const phases=[
    {label:"TTS 음성 생성",icon:"🎙"},
    {label:"자료화면 합성",icon:"🎨"},
    {label:"아바타 렌더링",icon:"👤"},
    {label:"최종 영상 합성",icon:"🎬"},
  ];

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden min-w-0">
        <div className="px-4 py-3 shrink-0" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <h2 className="text-[15px] font-extrabold" style={{color:"rgba(255,255,255,0.88)"}}>영상 제작</h2>
          <p className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,0.32)"}}>TTS + 인포그래픽 + 자막 자동 합성</p>
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-4 md:p-6">
          {err&&<ErrBox>{err}</ErrBox>}
          {ld?(
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="w-full max-w-sm p-5 rounded-2xl relative overflow-hidden"
                style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{background:"linear-gradient(90deg,#c49a1a,#e8c84a,#c49a1a)",backgroundSize:"200% 100%",animation:"shimmer 2s linear infinite"}}/>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-bold" style={{color:"rgba(255,255,255,0.85)"}}>영상 생성 중</span>
                  <span className="text-[18px] font-black tabular-nums" style={{color:"#e8c84a"}}>{pg}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-5" style={{background:"rgba(255,255,255,0.06)"}}>
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${pg}%`,background:"linear-gradient(90deg,#c49a1a,#e8c84a)"}}/>
                </div>
                <div className="space-y-1.5">
                  {phases.map((s,i)=>{
                    const done=phase>i+1;const active=phase===i+1;
                    return(
                      <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg transition-all"
                        style={{background:active?"rgba(232,200,74,0.06)":done?"rgba(52,211,153,0.04)":"transparent",
                          border:active?"1px solid rgba(232,200,74,0.12)":"1px solid transparent"}}>
                        <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{background:done?"rgba(52,211,153,0.12)":active?"rgba(232,200,74,0.12)":"rgba(255,255,255,0.06)",
                            color:done?"#34d399":active?"#e8c84a":"rgba(255,255,255,0.20)"}}>
                          {done?"✓":active?<span style={{animation:"spin 2s linear infinite",display:"inline-block"}}>{s.icon}</span>:<span>{i+1}</span>}
                        </div>
                        <span className="text-[11px] font-semibold" style={{color:done?"rgba(255,255,255,0.60)":active?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.22)"}}>{s.label}</span>
                        {done&&<span className="text-[9px] font-bold ml-auto" style={{color:"#34d399"}}>완료</span>}
                        {active&&<div className="flex gap-0.5 ml-auto">{[0,1,2].map(d=><span key={d} className="w-1 h-1 rounded-full" style={{background:"#e8c84a",animation:`dot-bounce 1.4s ease-in-out ${d*0.2}s infinite`}}/>)}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-[11px]" style={{color:"rgba(255,255,255,0.28)"}}>{elapsed>0?`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,"0")} 경과`:"약 3~5분 소요"}</p>
            </div>
          ):store.video?(
            <div className="flex flex-col items-center py-8 gap-4 anim-fade-up">
              <div className="text-[48px] anim-score">🎬</div>
              <h3 className="text-[18px] font-bold" style={{color:"rgba(255,255,255,0.88)"}}>영상 완성!</h3>
              <p className="text-[12px]" style={{color:"rgba(255,255,255,0.35)"}}>{store.video.duration_sec?.toFixed(0)}초 · {((store.video.file_size_bytes||0)/1024/1024).toFixed(1)}MB</p>
              <a href={`${API}${store.video.download_url}`} download
                className="px-8 py-3 rounded-xl text-[14px] font-bold text-white"
                style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>⬇ 다운로드</a>
              <GoldBtn onClick={()=>{store.setStep(5);store.setActivePage("deploy");}}>검수 & 배포 →</GoldBtn>
            </div>
          ):store.script?(
            <div className="flex flex-col items-center py-12 gap-5">
              <div className="vto-card p-5 w-full max-w-sm text-center space-y-3">
                <div className="text-[40px]">🎬</div>
                <div>
                  <p className="text-[14px] font-bold" style={{color:"rgba(255,255,255,0.80)"}}>영상 생성 준비 완료</p>
                  <p className="text-[11px] mt-1" style={{color:"rgba(255,255,255,0.35)"}}>{totalBlocks}블록 · {Math.floor(totalDur/60)}분 {Math.round(totalDur%60)}초</p>
                </div>
                <button onClick={gen}
                  className="w-full py-3 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] anim-pulse"
                  style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 6px 30px rgba(196,154,26,0.25)"}}>
                  🎬 영상 생성 시작
                </button>
              </div>
            </div>
          ):<Empty icon="▶" text="스크립트가 필요합니다"/>}
        </div>
      </div>
      <div className="w-full md:w-[240px] shrink-0 md:flex md:flex-col"
        style={{borderLeft:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="px-4 py-3 shrink-0" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <h2 className="text-[13px] font-extrabold" style={{color:"rgba(255,255,255,0.70)"}}>영상 설정</h2>
        </div>
        <div className="p-4 space-y-3 text-[12px]">
          {([["해상도","1920×1080"],["TTS","ElevenLabs"],["비주얼","Gemini AI"],["자막","한글"],["BGM","Ambient"]] as [string,string][]).map(([l,v])=><Row key={l} l={l} v={v}/>)}
          {store.profile.channelName&&(
            <>
              <div className="h-px" style={{background:"rgba(255,255,255,0.06)"}}/>
              <Row l="채널명" v={store.profile.channelName}/>
            </>
          )}
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

  return(
    <div className="h-full overflow-y-auto md:overflow-hidden md:flex">
      <div className="flex-1 md:flex md:flex-col md:overflow-hidden">
        <div className="px-4 py-3 shrink-0" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <h2 className="text-[15px] font-extrabold" style={{color:"rgba(255,255,255,0.88)"}}>알고리즘 실드™</h2>
          <p className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,0.32)"}}>수익화 안전도 검증 + SEO 자동 최적화</p>
        </div>
        <div className="md:flex-1 md:overflow-y-auto p-4 md:p-6">
          {err&&<ErrBox>{err}</ErrBox>}
          {sL?<Spinner className="py-16"/>:store.shield?(
            <div className="space-y-5">
              <div className="vto-card p-5 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[56px] font-black leading-none anim-score" style={{color:sc(s)}}>{Math.round(s)}</div>
                  <div className="text-[12px] font-bold mt-1" style={{color:sc(s)}}>{store.shield.grade}</div>
                  <div className="text-[10px] mt-0.5" style={{color:"rgba(255,255,255,0.30)"}}>{passed?"✓ 안전":"⚠ 개선 필요"}</div>
                </div>
                <div className="flex-1">
                  <div className="h-3 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
                    <div className="h-full rounded-full anim-bar transition-all" style={{width:`${s}%`,background:sc(s)}}/>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px]" style={{color:"rgba(255,255,255,0.28)"}}>
                    <span>0</span><span>70 (기준)</span><span>100</span>
                  </div>
                </div>
              </div>
              {!passed&&(
                <div className="p-4 rounded-xl" style={{background:"rgba(248,113,113,0.05)",border:"1px solid rgba(248,113,113,0.15)"}}>
                  <p className="text-[13px] font-bold mb-2" style={{color:"#f87171"}}>🚫 수익화 위험</p>
                  <div className="flex gap-2">
                    <button onClick={()=>store.setActivePage("script")} className="flex-1 p-2.5 rounded-lg text-center text-[11px] font-bold transition-all hover:bg-white/[0.04]"
                      style={{border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.55)"}}>📝 스크립트 수정</button>
                    <button onClick={()=>{store.setActivePage("video");store.setVideo(null);}} className="flex-1 p-2.5 rounded-lg text-center text-[11px] font-bold transition-all hover:bg-white/[0.04]"
                      style={{border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.55)"}}>🎬 영상 재생성</button>
                  </div>
                </div>
              )}
              {store.shield.checks&&(
                <div className="space-y-1.5">
                  {store.shield.checks.map((c:any,i:number)=>(
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg anim-fade-up"
                      style={{animationDelay:`${i*60}ms`,background:c.passed?"rgba(52,211,153,0.04)":"rgba(248,113,113,0.04)"}}>
                      <span className="text-[12px]">{c.passed?"✅":"❌"}</span>
                      <span className="text-[12px] flex-1" style={{color:"rgba(255,255,255,0.65)"}}>{c.label}</span>
                      <span className="text-[10px] font-bold" style={{color:c.passed?"#34d399":"#f87171"}}>{c.score}/{c.max}</span>
                    </div>
                  ))}
                </div>
              )}
              {passed&&store.video&&(
                <a href={`${API}${store.video.download_url}`} download
                  className="block w-full py-3 rounded-xl text-center text-[14px] font-bold text-white"
                  style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>⬇ 최종 다운로드</a>
              )}
            </div>
          ):<Empty icon="◉" text="영상이 필요합니다"/>}
        </div>
      </div>
      <div className="w-full md:w-[260px] shrink-0 md:flex md:flex-col"
        style={{borderLeft:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="px-4 py-3 shrink-0" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <h2 className="text-[13px] font-extrabold" style={{color:"rgba(255,255,255,0.70)"}}>SEO & 스케줄</h2>
        </div>
        <div className="p-4 space-y-3">
          {store.shield?.seo?(
            <>
              <div>
                <label className="text-[10px] font-bold block mb-1" style={{color:"rgba(255,255,255,0.35)"}}>추천 제목</label>
                <p className="text-[12px] font-bold p-2.5 rounded-lg" style={{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.80)"}}>{store.shield.seo.title}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1" style={{color:"rgba(255,255,255,0.35)"}}>설명</label>
                <p className="text-[11px] p-2.5 rounded-lg line-clamp-4" style={{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.55)"}}>{store.shield.seo.description}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1" style={{color:"rgba(255,255,255,0.35)"}}>태그</label>
                <div className="flex flex-wrap gap-1">
                  {store.shield.seo.tags?.map((t:string,i:number)=>(
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.50)"}}>{t}</span>
                  ))}
                </div>
              </div>
            </>
          ):<p className="text-[11px]" style={{color:"rgba(255,255,255,0.28)"}}>분석 후 자동 생성됩니다</p>}
          {store.shield?.schedule&&(
            <div className="p-3 rounded-xl" style={{background:"rgba(232,200,74,0.05)",border:"1px solid rgba(232,200,74,0.12)"}}>
              <p className="text-[10px] font-bold mb-1" style={{color:"#e8c84a"}}>추천 업로드 시간</p>
              <p className="text-[13px] font-bold" style={{color:"rgba(255,255,255,0.85)"}}>{store.shield.schedule.best_time}</p>
              <p className="text-[10px] mt-0.5" style={{color:"rgba(255,255,255,0.35)"}}>{store.shield.schedule.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MODULE E — CHANNEL MANAGEMENT
   (videoto.kr "내 채널 관리" style)
   ═══════════════════════════════════════ */
function ChannelPage(){
  const store=useBlackboxStore();
  const[tab,setTab]=useState<"settings"|"tts">("settings");
  const[saved,setSaved]=useState(false);

  const fields=[
    {label:"채널 이름 *",key:"channelName" as const,ph:"예: 돈이 보이는 경제",type:"input",desc:"YouTube 채널에 표시될 이름"},
    {label:"인트로 멘트",key:"introText" as const,ph:"안녕하세요, 오늘도 핵심만 짚어드리겠습니다.",type:"textarea",desc:"영상 시작 시 읽는 인사말"},
    {label:"아웃트로 멘트",key:"outroText" as const,ph:"다음 영상에서 더 유익한 정보로 찾아뵙겠습니다.",type:"textarea",desc:"영상 마무리 멘트"},
    {label:"워터마크",key:"watermarkText" as const,ph:"비우면 채널명 사용",type:"input",desc:"영상에 표시될 채널 워터마크"},
  ];

  const ttsVoices=[
    {id:"jBpfuIE2acCO8z3wKNLl",name:"기본 한국어",desc:"자연스러운 표준 한국어"},
    {id:"pNInz6obpgDQGcFmaJgB",name:"남성 저음",desc:"신뢰감 있는 낮은 목소리"},
    {id:"XB0fDUnXU5powFXDhCwa",name:"여성 밝음",desc:"활기차고 명랑한 목소리"},
    {id:"29vD33N1CtxCmqQRPOHJ",name:"뉴스 앵커",desc:"격식 있는 뉴스 진행 스타일"},
  ];

  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};

  return(
    <div className="h-full overflow-y-auto">
      {/* Page Header */}
      <div className="px-6 md:px-8 pt-6 pb-0">
        <div className="flex items-center gap-2 mb-1 text-[11px]" style={{color:"rgba(255,255,255,0.30)"}}>
          <span>채널</span>
          <span>/</span>
          <span style={{color:"rgba(255,255,255,0.55)"}}>채널 설정</span>
        </div>
        <h1 className="text-[22px] font-extrabold mb-4" style={{color:"rgba(255,255,255,0.92)"}}>내 채널 관리</h1>

        {/* Sub Tabs */}
        <div className="flex items-center gap-0 border-b" style={{borderColor:"rgba(255,255,255,0.07)"}}>
          {([["settings","⚙ 채널 설정"],["tts","🎙 TTS 음성"]] as [typeof tab,string][]).map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              className="px-5 py-2.5 text-[13px] font-bold transition-all"
              style={{
                color: tab===k ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)",
                borderBottom: tab===k ? "2px solid #e8c84a" : "2px solid transparent",
                marginBottom: "-1px",
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-8 py-6">
        {tab==="settings"?(
          <div className="max-w-[640px]">
            {/* Channel Card */}
            <div className="mb-6 p-4 rounded-2xl flex items-center gap-4"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[24px] shrink-0"
                style={{background:"linear-gradient(135deg,#1a1208,#2a2010)",border:"1px solid rgba(232,200,74,0.20)"}}>
                📺
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-extrabold truncate" style={{color:"rgba(255,255,255,0.88)"}}>
                  {store.profile.channelName||<span style={{color:"rgba(255,255,255,0.28)"}}>채널 이름 미설정</span>}
                </div>
                <div className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,0.35)"}}>
                  {store.profile.channelName ? "AlgoMaker 채널 · 설정 완료" : "아래에서 채널 정보를 입력해주세요"}
                </div>
              </div>
              {store.profile.channelName&&(
                <div className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{background:"rgba(52,211,153,0.10)",color:"#34d399",border:"1px solid rgba(52,211,153,0.20)"}}>
                  ✓ 등록됨
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="space-y-5">
              {fields.map(f=>(
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-bold" style={{color:"rgba(255,255,255,0.60)"}}>
                      {f.label}
                    </label>
                    <span className="text-[10px]" style={{color:"rgba(255,255,255,0.25)"}}>{f.desc}</span>
                  </div>
                  {f.type==="textarea"?(
                    <textarea value={store.profile[f.key]} onChange={e=>store.setProfile({[f.key]:e.target.value})}
                      placeholder={f.ph} rows={3}
                      className="w-full px-3.5 py-3 rounded-xl text-[13px] resize-none focus:outline-none focus:ring-1 focus:ring-[#e8c84a]/25 placeholder:opacity-25"
                      style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.80)"}}/>
                  ):(
                    <input value={store.profile[f.key]} onChange={e=>store.setProfile({[f.key]:e.target.value})}
                      placeholder={f.ph}
                      className="w-full px-3.5 py-3 rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[#e8c84a]/25 placeholder:opacity-25"
                      style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.80)"}}/>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={save}
                className="flex-1 md:flex-none md:w-40 py-3 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>
                {saved?"✓ 저장됨":"저장"}
              </button>
              {saved&&<span className="text-[12px]" style={{color:"#34d399"}}>채널 설정이 저장되었습니다</span>}
            </div>
          </div>
        ):(
          /* TTS Voice Selection */
          <div className="max-w-[640px]">
            <p className="text-[13px] mb-5" style={{color:"rgba(255,255,255,0.40)"}}>영상에 사용할 TTS 음성을 선택하세요</p>
            <div className="space-y-2">
              {ttsVoices.map(v=>{
                const sel=store.profile.ttsVoiceId===v.id;
                return(
                  <button key={v.id}
                    onClick={()=>store.setProfile({ttsVoiceId:v.id,ttsVoiceName:v.name})}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${sel?"glow-gold":""}`}
                    style={{
                      background:sel?"rgba(232,200,74,0.06)":"rgba(255,255,255,0.04)",
                      border:`1px solid ${sel?"rgba(232,200,74,0.30)":"rgba(255,255,255,0.07)"}`,
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shrink-0"
                      style={{background:sel?"rgba(232,200,74,0.12)":"rgba(255,255,255,0.06)"}}>
                      🎙
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold" style={{color:sel?"#e8c84a":"rgba(255,255,255,0.78)"}}>{v.name}</div>
                      <div className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,0.35)"}}>{v.desc}</div>
                    </div>
                    {sel&&(
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                        style={{background:"#e8c84a",color:"#0d0c0a"}}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-5">
              <button onClick={save}
                className="w-full md:w-40 py-3 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110"
                style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>
                {saved?"✓ 저장됨":"저장"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══ SHARED COMPONENTS ═══ */
function Spinner({className=""}:{className?:string}){
  return(
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-7 h-7 rounded-full border-2 animate-spin"
        style={{borderColor:"rgba(232,200,74,0.12)",borderTopColor:"#e8c84a"}}/>
    </div>
  );
}
function Empty({icon,text}:{icon:string;text:string}){
  return(
    <div className="flex flex-col items-center justify-center py-16" style={{color:"rgba(255,255,255,0.20)"}}>
      <span className="text-[40px] mb-3 anim-float">{icon}</span>
      <span className="text-[13px]">{text}</span>
    </div>
  );
}
function ErrBox({children}:{children:React.ReactNode}){
  return(
    <div className="mb-3 p-3 rounded-xl text-[12px]" style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.20)",color:"#f87171"}}>
      {children}
    </div>
  );
}
function GoldBtn({children,onClick,disabled}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean}){
  return(
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-30"
      style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 4px 20px rgba(196,154,26,0.22)"}}>
      {children}
    </button>
  );
}
function TBtn({icon,label,desc,onClick,disabled}:{icon:string;label:string;desc:string;onClick:()=>void;disabled?:boolean}){
  return(
    <button onClick={onClick} disabled={disabled}
      className="w-full text-left p-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-20 vto-card"
      style={{cursor:disabled?"not-allowed":"pointer"}}>
      <div className="flex items-center gap-3">
        <span className="text-[18px]">{icon}</span>
        <div>
          <div className="text-[12px] font-bold" style={{color:"rgba(255,255,255,0.75)"}}>{label}</div>
          <div className="text-[10px]" style={{color:"rgba(255,255,255,0.30)"}}>{desc}</div>
        </div>
      </div>
    </button>
  );
}
function Row({l,v}:{l:string;v:string}){
  return(
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px]" style={{color:"rgba(255,255,255,0.30)"}}>{l}</span>
      <span className="text-[11px] font-bold" style={{color:"rgba(255,255,255,0.60)"}}>{v}</span>
    </div>
  );
}
