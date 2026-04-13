"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://project-blackbox-production.up.railway.app";

export default function CreatePage() {
  const { activePage } = useBlackboxStore();
  return <div className="h-full">{activePage==="curation"&&<CurationPage/>}{activePage==="script"&&<ScriptPage/>}{activePage==="video"&&<VideoPage/>}{activePage==="deploy"&&<DeployPage/>}</div>;
}

/* ── helpers ── */
function boi(s:number){if(s>=4.5)return{g:"A+",c:"#34d399",bg:"rgba(52,211,153,0.15)"};if(s>=3.8)return{g:"A",c:"#34d399",bg:"rgba(52,211,153,0.10)"};if(s>=3)return{g:"B+",c:"#c49a1a",bg:"rgba(212,175,55,0.12)"};if(s>=2.2)return{g:"B",c:"#f59e0b",bg:"rgba(245,158,11,0.10)"};return{g:"C",c:"#f87171",bg:"rgba(248,113,113,0.10)"};}
function fv(v:number){if(v>=1e6)return`${(v/1e6).toFixed(1)}M`;if(v>=1e3)return`${(v/1e3).toFixed(0)}K`;return String(v);}
function mom(m:number){if(m>0.15)return{i:"▲",c:"#34d399"};if(m>0)return{i:"→",c:"#c49a1a"};return{i:"▼",c:"#f87171"};}
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
    // 모바일: 뉴스 영역으로 자동 스크롤
    setTimeout(()=>{document.getElementById("news-section")?.scrollIntoView({behavior:"smooth"});},300);
    try{const r=await fetch(`${API}/api/v1/curation/news/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:kw.keyword,days_back:7,max_results:10})});if(!r.ok)throw new Error("뉴스 로드 실패");store.setNews((await r.json()).articles||[]);}catch(e:any){setErr(e.message);}finally{setNld(false);}
  };
  const togNews=(a:any)=>{const c=store.selectedNews;store.setSelectedNews(c.find((n:any)=>n.id===a.id)?c.filter((n:any)=>n.id!==a.id):[...c,a]);};

  return(
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
      {/* LEFT */}
      <div className="w-full md:w-[480px] shrink-0 border-b md:border-b-0 md:border-r flex flex-col" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        {/* Category — horizontal scroll on mobile */}
        <div className="p-2.5 md:p-4 border-b shrink-0" style={{borderColor:"var(--border)"}}>
          <div className="flex items-center justify-between mb-1.5 md:mb-2">
            <h2 className="text-[13px] md:text-[16px] font-extrabold text-[#4b5563]">카테고리</h2>
            <Guide items={[
              {q:"$12~18 같은 금액은?",a:"CPM — 유튜브 광고 1,000회 노출당 수익. CPM $12 영상이 1만 조회 시 약 $120."},
              {q:"어떤 카테고리가 좋나요?",a:"수익 우선 → 경제/시니어(CPM 높음). 성장 우선 → 테크/라이프(검색량 많음)."},
            ]} />
          </div>
          <div className="flex md:grid md:grid-cols-5 gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {cats.map(cat=>{
              const on=store.category===cat.slug;
              return(
                <button key={cat.slug} onClick={()=>pickCat(cat.slug)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 md:p-2.5 rounded-lg border transition-all shrink-0
                    ${on?"border-[#c49a1a]/50":"border-transparent hover:border-[#e5e7eb]"}`}
                  style={on?{background:"rgba(212,175,55,0.08)"}:{}}>
                  <span className="text-[20px] md:text-[24px]">{cat.icon}</span>
                  <span className={`text-[10px] md:text-[11px] font-bold whitespace-nowrap ${on?"text-[#c49a1a]":"text-[#6b7280]"}`}>{cat.label_ko.split(' / ')[0]}</span>
                  <span className="text-[8px] md:text-[9px] text-[#b0b5bf] font-semibold">{cat.cpm_range}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keywords — scrollable */}
        <div className="flex-1 overflow-y-auto p-2.5 md:p-4 min-h-0">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-[14px] md:text-[17px] font-extrabold text-[#4b5563]">황금 키워드</h2>
            <div className="flex items-center gap-2">
              {store.keywords.length>0&&<span className="text-[11px] text-[#b0b5bf] font-bold">{store.keywords.length}개</span>}
              <Guide items={[
                {q:"블루오션 등급 (A+~C)?",a:"검색량 대비 경쟁이 적은 키워드가 높은 등급. A+ = 수요 많고 공급 부족한 틈새."},
                {q:"검색량 / 경쟁 / CPM",a:"검색량 = 월간 검색수. 경쟁 = 기존 유튜브 영상 수. CPM = 예상 광고 단가."},
                {q:"추세 ▲→▼",a:"최근 7일 검색 트렌드. ▲ 상승, → 유지, ▼ 하락."},
              ]} />
            </div>
          </div>

          {ld?<Spinner className="mt-12"/>:store.keywords.length>0?(
            <div className="space-y-1.5 md:space-y-2">
              {store.keywords.map((kw:any,i:number)=>{
                const on=store.selectedKeyword===kw.keyword;
                const g=boi(kw.blue_ocean_index||0);
                const m=mom(kw.trend_momentum||0);
                return(
                  <div key={i} onClick={()=>pickKw(kw)}
                    className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all duration-200 anim-fade-up
                      ${on?"border-[#c49a1a]/30 glow-gold":"border-[#f0f1f3] hover:border-[#d1d5db]"}`}
                    style={{animationDelay:`${i*50}ms`,...(on?{background:"rgba(212,175,55,0.04)"}:{background:"var(--bg-card)"})}}>

                    {/* Top row: rank + keyword + grade */}
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <span className="text-[11px] md:text-[12px] text-[#c0c5ce] font-bold w-5 text-center shrink-0">{i+1}</span>
                      <span className={`text-[14px] md:text-[16px] font-extrabold flex-1 truncate ${on?"text-[#c49a1a]":"text-[#1a1d23]"}`}>{kw.keyword}</span>
                      <span className="text-[11px] md:text-[13px] font-black px-2 py-1 rounded-lg shrink-0" style={{color:g.c,background:g.bg}}>{g.g}</span>
                    </div>

                    {/* BOI bar */}
                    <div className="ml-7 mb-2">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.04)"}}>
                        <div className="h-full rounded-full anim-bar" style={{width:`${Math.min(100,(kw.blue_ocean_index/5)*100)}%`,background:g.c,animationDelay:`${i*80+200}ms`}} />
                      </div>
                    </div>

                    {/* Data row */}
                    <div className="flex items-center gap-3 md:gap-4 ml-7 text-[10px] md:text-[12px]">
                      <span className="text-[#9ca3af]">검색 <b className="text-[#6b7280]">{fv(kw.search_volume||0)}</b></span>
                      <span className="text-[#9ca3af]">경쟁 <b className="text-[#6b7280]">{kw.competition_count||0}</b></span>
                      <span className="text-[#9ca3af]">CPM <b className="text-[#6b7280]">{kw.estimated_cpm?`$${kw.estimated_cpm.toFixed(0)}`:"-"}</b></span>
                      <span className="text-[13px] font-bold ml-auto" style={{color:m.c}}>{m.i}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ):<Empty icon="◈" text="카테고리를 선택하세요" />}
        </div>
      </div>

      {/* RIGHT: News */}
      <div id="news-section" className="flex-1 flex flex-col min-h-[60vh] md:min-h-0 md:overflow-hidden min-w-0">
        <div className="p-3 md:p-7 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[14px] md:text-[20px] font-extrabold text-[#4b5563]">뉴스 소스 피드</h2>
          {store.selectedNews.length>0&&<span className="text-[15px] font-bold text-[#34d399] px-4 py-1.5 rounded-xl" style={{background:"rgba(52,211,153,0.08)"}}>{store.selectedNews.length}개 선택</span>}
        </div>
        <div className="flex-1 overflow-y-auto p-7">
          <Guide items={[
            {q:"뉴스는 어디서 가져오나요?",a:"선택한 키워드로 최근 7일간 주요 뉴스를 자동 검색합니다. Google News, 네이버 뉴스 등에서 관련도 높은 기사를 수집합니다."},
            {q:"CPM 배지 (Premium/High/Mid)",a:"이 뉴스 주제로 영상을 만들었을 때 예상되는 광고 수익 등급입니다. Premium이 가장 높은 수익이 기대됩니다."},
            {q:"관련도 %",a:"선택한 키워드와 이 뉴스의 내용 일치 정도입니다. 높을수록 키워드에 딱 맞는 기사입니다."},
            {q:"뉴스를 몇 개 선택하면 좋나요?",a:"2~4개가 적당합니다. 너무 적으면 내용이 빈약하고, 너무 많으면 초점이 흐려집니다."},
          ]} />
          {err&&<ErrBox>{err}</ErrBox>}
          {nld?<Spinner className="mt-20"/>:store.news.length>0?(
            <div className="space-y-4">
              {store.news.map((a:any,i:number)=>{
                const on=store.selectedNews.some((n:any)=>n.id===a.id);
                return(
                  <div key={a.id} onClick={()=>togNews(a)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 group anim-fade-up relative overflow-hidden
                      ${on?"border-[#34d399]/25":"border-[#e5e7eb] hover:border-[#d1d5db]"}`}
                    style={{animationDelay:`${i*60}ms`,background:on?"rgba(52,211,153,0.03)":"var(--bg-card)"}}>
                    {on&&<div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{background:"#34d399"}} />}
                    <div className="flex items-start gap-4">
                      <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 mt-1 text-[14px] font-bold transition-all duration-300
                        ${on?"border-[#34d399] bg-[#34d399]/15 text-[#34d399]":"border-[#d1d5db] text-transparent group-hover:border-[#d1d5db]"}`}>✓</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <span className={`text-[17px] font-bold leading-snug ${on?"text-[#1a1d23]":"text-[#374151]"}`}>{a.title}</span>
                          <span className="shrink-0 text-[12px] font-extrabold px-3.5 py-1 rounded-full anim-float"
                            style={{background:"linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))",color:"#c49a1a",border:"1px solid rgba(212,175,55,0.2)",animationDelay:`${i*200}ms`}}>
                            {a.cpm_level}
                          </span>
                        </div>
                        {a.summary&&<p className="text-[14px] text-[#9ca3af] leading-relaxed line-clamp-2 mb-3">{a.summary}</p>}
                        <div className="flex items-center gap-4 text-[13px] text-[#9ca3af]">
                          <span className="font-bold">{a.source_name}</span>
                          {a.time_ago&&<span>{a.time_ago}</span>}
                          <span className="ml-auto">관련도 <b className="text-[#6b7280]">{(a.relevance_score*100).toFixed(0)}%</b></span>
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
          <div className="p-4 md:p-6 border-t" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
            <button onClick={()=>{store.setStep(3);store.setActivePage("script");}}
              className="w-full py-4 rounded-2xl text-[18px] font-extrabold text-white transition-all hover:brightness-110 active:scale-[0.99] anim-pulse"
              style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 8px 40px rgba(212,175,55,0.3)"}}>
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

  const gen=async()=>{setLd(true);setErr(null);try{const ns=store.selectedNews.map((n:any)=>`${n.title}: ${n.summary}`).join("\n\n");const r=await fetch(`${API}/api/v1/script/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,news_summary:ns,core_facts:[],opinion_seeds:[],hook_triggers:[],target_duration_sec:480,channel_name:store.profile.channelName,intro_text:store.profile.introText,outro_text:store.profile.outroText})});if(!r.ok)throw new Error(`실패(${r.status})`);store.setScript(await r.json());store.setStep(4);}catch(e:any){setErr(e.message);}finally{setLd(false);}};
  const eb=async(i:number)=>{if(!store.script)return;try{const r=await fetch(`${API}/api/v1/script/edit-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,new_text:et,blocks:store.script.blocks})});if(r.ok){const d=await r.json();const nb=Array.isArray(d.blocks)?d.blocks:Array.isArray(d)?d:store.script.blocks;store.setScript({...store.script,blocks:nb});setEbi(null);}}catch{}};
  const rb=async(i:number)=>{if(!store.script)return;try{const r=await fetch(`${API}/api/v1/script/regenerate-block`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({block_index:i,keyword:store.selectedKeyword,category:store.category,instruction:"",blocks:store.script.blocks})});if(r.ok){const d=await r.json();const nb=Array.isArray(d.blocks)?d.blocks:Array.isArray(d)?d:store.script.blocks;store.setScript({...store.script,blocks:nb});}}catch{}};
  const ext=async()=>{if(!store.script)return;setLd(true);setErr(null);try{const r=await fetch(`${API}/api/v1/script/extend`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:store.selectedKeyword,category:store.category,current_blocks:store.script.blocks,extend_paragraphs:3,instruction:""})});const d=await r.json();if(d.error){setErr(d.error);}else{const nb=Array.isArray(d.blocks)?d.blocks:Array.isArray(d)?d:store.script.blocks;store.setScript({...store.script,blocks:nb,total_duration_sec:d.total_duration_sec||nb.reduce((s:number,b:any)=>s+(b.duration_sec||0),0)});}}catch(e:any){setErr(e.message||"분량 추가 실패");}finally{setLd(false);}};
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
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
      <div className="flex-1 flex flex-col md:overflow-hidden min-w-0 min-h-[50vh] md:min-h-0">
        {/* Header with view toggle */}
        <div className="p-4 md:p-7 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <div className="flex items-center gap-5">
            <h2 className="text-[16px] md:text-[20px] font-extrabold text-[#4b5563]">AI 스크립트</h2>
            <Guide items={[
              {q:"스크립트는 어떻게 만들어지나요?",a:"선택한 뉴스 소스를 Gemini AI가 분석하여 유튜브 영상용 대본을 자동 생성합니다. 훅(오프닝) → 본문 → 의견 → CTA(구독유도) 구조입니다."},
              {q:"블록 편집 vs 최종 시나리오",a:"블록 편집: 각 문단별로 수정/재생성 가능. 최종 시나리오: 타임코드가 붙은 완성 대본을 한눈에 확인."},
              {q:"재생성/분량추가/재작성 차이",a:"재생성: 같은 소스로 새로 작성. 분량추가: 기존 뒤에 3문단 추가. 재작성: 스타일/톤을 바꿔서 전체 다시 작성."},
              {q:"목표 시간 8분인 이유",a:"유튜브 수익화에 최적인 영상 길이입니다. 8분 이상이면 영상 중간에 광고를 삽입할 수 있어 수익이 2~3배 높아집니다."},
            ]} />
            {store.script&&(
              <div className="flex rounded-xl overflow-hidden border" style={{borderColor:"var(--border)"}}>
                <button onClick={()=>setView("blocks")}
                  className={`px-4 py-1.5 text-[13px] font-bold transition-all ${view==="blocks"?"text-[#c49a1a]":"text-[#9ca3af] hover:text-[#6b7280]"}`}
                  style={view==="blocks"?{background:"rgba(212,175,55,0.1)"}:{}}>
                  블록 편집
                </button>
                <button onClick={()=>setView("scenario")}
                  className={`px-4 py-1.5 text-[13px] font-bold transition-all ${view==="scenario"?"text-[#c49a1a]":"text-[#9ca3af] hover:text-[#6b7280]"}`}
                  style={view==="scenario"?{background:"rgba(212,175,55,0.1)"}:{}}>
                  최종 시나리오
                </button>
              </div>
            )}
          </div>
          {store.script&&<div className="flex gap-4">
            <Badge label="글자" val={ch.toLocaleString()} color="#c49a1a"/>
            <Badge label="시간" val={`${Math.floor(dur/60)}:${String(Math.round(dur%60)).padStart(2,'0')}`} color="#60a5fa"/>
            <Badge label="블록" val={String(store.script.blocks?.length||0)} color="#a78bfa"/>
          </div>}
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {err&&<ErrBox>{err}</ErrBox>}
          {ld?<div className="flex flex-col items-center py-32 gap-5"><Spinner size="lg"/><span className="text-[16px] text-[#9ca3af]">Gemini가 대본을 작성 중...</span></div>

          /* ═══ 블록 편집 뷰 ═══ */
          :view==="blocks"&&store.script?.blocks?(
            <div className="space-y-4">
              {store.script.dynamic_intro&&<div className="p-5 rounded-2xl text-[14px] text-[#c49a1a]/50 italic border border-[#c49a1a]/10" style={{background:"rgba(212,175,55,0.03)"}}>🎬 인트로: {store.script.dynamic_intro}</div>}
              {store.script.blocks.map((b:any,i:number)=>(
                <div key={i} className="p-4 md:p-6 rounded-2xl border group anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${i*60}ms`}}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-[#c49a1a]/35 uppercase tracking-widest">{b.section||`BLOCK ${String(i+1).padStart(2,"0")}`}</span>
                      <span className="text-[12px] text-[#d1d5db]">{b.duration_sec?.toFixed(1)}s</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>{setEbi(i);setEt(b.text);}} className="px-3 py-1 rounded-xl text-[12px] text-[#9ca3af] hover:text-[#4b5563] hover:bg-[#f3f4f6]">✏️ 수정</button>
                      <button onClick={()=>rb(i)} className="px-3 py-1 rounded-xl text-[12px] text-[#9ca3af] hover:text-[#4b5563] hover:bg-[#f3f4f6]">🔄 재생성</button>
                    </div>
                  </div>
                  {ebi===i?<div><textarea value={et} onChange={e=>setEt(e.target.value)} className="w-full h-40 p-5 rounded-2xl text-[15px] text-[#1a1d23] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#c49a1a]/20" style={{background:"rgba(0,0,0,0.3)",border:"1px solid var(--border)"}}/><div className="flex gap-2 mt-3"><button onClick={()=>eb(i)} className="px-5 py-2 rounded-xl text-[14px] font-bold text-white" style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)"}}>저장</button><button onClick={()=>setEbi(null)} className="px-5 py-2 rounded-xl text-[14px] text-[#9ca3af] border" style={{borderColor:"var(--border)"}}>취소</button></div></div>
                  :<p className="text-[16px] text-[#374151] leading-[2] whitespace-pre-wrap">{b.text}</p>}
                </div>
              ))}
              {store.script.dynamic_outro&&<div className="p-5 rounded-2xl text-[14px] text-[#c49a1a]/50 italic border border-[#c49a1a]/10" style={{background:"rgba(212,175,55,0.03)"}}>🎬 아웃트로: {store.script.dynamic_outro}</div>}
            </div>

          /* ═══ 최종 시나리오 뷰 ═══ */
          ):view==="scenario"&&store.script?.blocks?(()=>{
            const sc=buildScenario();
            return(
              <div className="max-w-3xl mx-auto">
                {/* 시나리오 헤더 */}
                <div className="text-center mb-10 anim-fade-up">
                  <div className="inline-block px-4 py-1.5 rounded-full text-[12px] font-bold text-[#c49a1a] mb-4" style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)"}}>FINAL SCENARIO</div>
                  <h1 className="text-[28px] font-extrabold text-[#1a1d23] mb-2">{store.selectedKeyword}</h1>
                  <p className="text-[15px] text-[#9ca3af]">
                    {ch.toLocaleString()}자  ·  {Math.floor(dur/60)}분 {Math.round(dur%60)}초  ·  {store.script.blocks.length}개 섹션
                  </p>
                </div>

                {/* 인트로 */}
                {sc.intro&&(
                  <div className="flex items-center gap-4 mb-8 anim-fade-up" style={{animationDelay:"100ms"}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[16px] shrink-0" style={{background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.2)"}}>🎬</div>
                    <p className="text-[15px] text-[#c49a1a]/60 italic">{sc.intro}</p>
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
                    const dotColor=isHook?"#c49a1a":isOpinion?"#a78bfa":isCta?"#34d399":"rgba(255,255,255,0.15)";
                    return(
                      <div key={i} className="flex gap-6 mb-8 anim-fade-up relative" style={{animationDelay:`${(i+1)*80}ms`}}>
                        {/* 타임라인 도트 */}
                        <div className="flex flex-col items-center shrink-0 z-10">
                          <div className="w-[10px] h-[10px] rounded-full" style={{background:dotColor,boxShadow:`0 0 8px ${dotColor}44`}} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* 섹션 라벨 + 시간 */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[12px] font-bold uppercase tracking-wider ${isHook?"text-[#c49a1a]/60":isOpinion?"text-[#a78bfa]/60":isCta?"text-[#34d399]/60":"text-[#d1d5db]"}`}>{s.label}</span>
                            <span className="text-[11px] text-[#d1d5db] font-bold">{s.time}</span>
                          </div>

                          {/* 텍스트 */}
                          <p className={`leading-[2.2] whitespace-pre-wrap ${
                            isHook?"text-[14px] md:text-[18px] font-bold text-[#1a1d23]":
                            isOpinion?"text-[16px] text-[#a78bfa]/70 italic border-l-2 border-[#a78bfa]/20 pl-5":
                            isCta?"text-[15px] text-[#34d399]/60":
                            "text-[16px] text-[#374151]"
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
                    <p className="text-[15px] text-[#c49a1a]/60 italic">{sc.outro}</p>
                  </div>
                )}

                {/* 하단 요약 카드 */}
                <div className="mt-12 p-6 rounded-2xl border anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${(sc.sections.length+3)*80}ms`}}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold text-[#6b7280]">시나리오 요약</span>
                    <span className="text-[12px] text-[#d1d5db]">생성 방식: {store.script.metadata?.method||"gemini"}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <SummaryCard label="총 글자수" value={`${ch.toLocaleString()}자`} color="#c49a1a" />
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
      <div className="w-full md:w-[340px] shrink-0 border-t md:border-t-0 md:border-l flex flex-col min-h-[40vh] md:min-h-0" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-4 md:p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[16px] md:text-[20px] font-extrabold text-[#4b5563]">도구</h2></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <Guide items={[
            {q:"스크립트 구조는?",a:"오프닝 훅(시선 끌기) → 본문(핵심 정보 전달) → 채널 의견(차별화) → CTA(구독 유도) 4단 구조로 자동 생성됩니다."},
            {q:"블록 편집 vs 시나리오",a:"블록 편집 = 각 구간별 개별 수정/재생성. 시나리오 = 전체 대본을 타임라인으로 확인."},
            {q:"재생성/재작성 차이?",a:"재생성 = 같은 뉴스 소스로 새로 작성. 재작성 = 톤/스타일을 바꿔서 완전히 다시 작성."},
          ]} />
          <TBtn icon="🔄" label="전체 재생성" desc="같은 소스로 새로 작성" onClick={gen} disabled={ld||!store.selectedKeyword}/>
          <TBtn icon="📝" label="분량 추가" desc="3문단 추가" onClick={ext} disabled={ld||!store.script}/>
          <TBtn icon="✨" label="전체 재작성" desc="톤/스타일 변경" onClick={rew} disabled={ld||!store.script}/>
          <div className="h-px my-5" style={{background:"var(--border)"}} />
          {store.script&&(
            <div className="p-4 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
              <p className="text-[13px] font-bold text-[#9ca3af] mb-3">빠른 전환</p>
              <div className="space-y-2">
                <button onClick={()=>setView("blocks")} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${view==="blocks"?"text-[#c49a1a] border border-[#c49a1a]/20":"text-[#6b7280] hover:text-[#4b5563]"}`} style={view==="blocks"?{background:"rgba(212,175,55,0.06)"}:{}}>
                  📝 블록 편집 모드
                </button>
                <button onClick={()=>setView("scenario")} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${view==="scenario"?"text-[#c49a1a] border border-[#c49a1a]/20":"text-[#6b7280] hover:text-[#4b5563]"}`} style={view==="scenario"?{background:"rgba(212,175,55,0.06)"}:{}}>
                  📖 최종 시나리오
                </button>
              </div>
            </div>
          )}
        </div>
        {store.script&&<div className="p-4 md:p-6 border-t" style={{borderColor:"var(--border)"}}><GoldBtn onClick={()=>{store.setStep(4);store.setActivePage("video");}}>영상 제작 →</GoldBtn></div>}
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
      else{const iv=setInterval(async()=>{try{const r2=await fetch(`${API}/api/v1/video/status/${d.job_id}`);if(r2.ok){const d2=await r2.json();if(d2.status==="completed"||d2.status==="done"){clearInterval(iv);setPhase(5);setPg(100);store.setVideo(d2);store.setStep(5);setLd(false);}else if(d2.status==="error"){clearInterval(iv);setErr(d2.error||"실패");setLd(false);}}}catch{}},5000);setTimeout(()=>{clearInterval(iv);setLd(false);},600000);}
    }catch(e:any){clearInterval(ticker);setErr(e.message);setLd(false);}};

  // preview-slides는 비활성화 (영상 생성에 집중)
  // useEffect(()=>{if(store.script){fetch(...)}},[]);

  // 스토리보드 데이터 생성
  const storyboard=store.script?.blocks?.map((b:any,i:number)=>{
    const secMap:{[k:string]:string}={hook:"🎯 오프닝",body:"📝 본문",opinion:"💬 의견",cta:"📢 CTA"};
    const colorMap:{[k:string]:string}={hook:"#c49a1a",body:"#60a5fa",opinion:"#a78bfa",cta:"#34d399"};
    return{label:secMap[b.section]||"본문",color:colorMap[b.section]||"#60a5fa",dur:b.duration_sec||0,text:b.text?.slice(0,50)+"...",section:b.section};
  })||[];
  const totalDur=store.script?.total_duration_sec||0;
  const totalChars=store.script?.blocks?.reduce((s:number,b:any)=>s+(b.text?.length||0),0)||0;
  const maxDur=Math.max(...storyboard.map((s:any)=>s.dur),1);

  return(
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
      <div className="flex-1 flex flex-col md:overflow-hidden min-w-0 min-h-[50vh] md:min-h-0">
        <div className="p-4 md:p-7 border-b flex items-center justify-between" style={{borderColor:"var(--border)"}}>
          <h2 className="text-[16px] md:text-[20px] font-extrabold text-[#4b5563]">영상 제작</h2>
          {store.script&&!store.video&&!ld&&(
            <span className="text-[13px] text-[#9ca3af]">스토리보드 프리뷰</span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <Guide items={[
            {q:"영상은 어떻게 만들어지나요?",a:"① TTS 음성 생성(ElevenLabs) → ② 블록별 자료화면 생성(Gemini AI 인포그래픽 또는 Pexels 실사) → ③ 아바타 렌더링(HeyGen, 선택) → ④ FFmpeg로 최종 합성. 약 3~5분 소요됩니다."},
            {q:"시니어 모드란?",a:"읽기 속도가 느려지고(0.92배), 자막이 커지고, BGM이 작아집니다. 50대 이상 시청자를 타겟하는 채널에 적합합니다."},
            {q:"스토리보드는 뭔가요?",a:"영상의 구조를 미리 보여줍니다. 각 블록(오프닝/본문/의견/CTA)의 길이와 비율을 확인할 수 있습니다."},
          ]} />
          {err&&<ErrBox>{err}</ErrBox>}

          {/* 렌더링 중 */}
          {ld?<div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-full max-w-[440px] p-5 md:p-8 rounded-2xl relative overflow-hidden" style={{background:"var(--bg-card)",border:"1px solid var(--border)",boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
              {/* 상단 shimmer 라인 */}
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{background:"linear-gradient(90deg,#c49a1a,#e8c84a,#c49a1a)",backgroundSize:"200% 100%",animation:"shimmer 2s linear infinite"}}/>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(196,154,26,0.1)"}}>
                    <span className="text-[16px]" style={{animation:"spin 2s linear infinite",display:"inline-block"}}>⚙</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#1a1d23]">영상 생성 중</span>
                </div>
                <span className="text-[20px] font-black tabular-nums" style={{color:"#c49a1a",fontFamily:"'JetBrains Mono',monospace"}}>{pg}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden mb-7 relative" style={{background:"rgba(0,0,0,0.06)"}}>
                <div className="h-full rounded-full transition-all duration-1000 relative" style={{width:`${pg}%`,background:"linear-gradient(90deg,#c49a1a,#e8c84a)"}}>
                  <div className="absolute inset-0 rounded-full" style={{background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s linear infinite"}}/>
                </div>
              </div>
              <div className="space-y-1">
                {([
                  {label:"TTS 음성 생성",done:phase>1,active:phase===1,icon:"🎙"},
                  {label:"자료화면 생성",done:phase>2,active:phase===2,icon:"🎨"},
                  {label:"아바타 렌더링",done:phase>3,active:phase===3,icon:"👤"},
                  {label:"최종 합성",done:phase>4||phase===5,active:phase===4,icon:"🎬"},
                ] as const).map((s,i)=>(
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 relative overflow-hidden`}
                    style={s.active?{background:"rgba(196,154,26,0.06)",border:"1px solid rgba(196,154,26,0.18)",animation:"step-glow 2s ease-in-out infinite"}:s.done?{background:"rgba(22,163,74,0.04)",border:"1px solid transparent"}:{border:"1px solid transparent"}}>
                    {s.active&&<div className="absolute inset-0 rounded-xl" style={{background:"linear-gradient(90deg,transparent,rgba(196,154,26,0.08),transparent)",backgroundSize:"200% 100%",animation:"shimmer 2s linear infinite"}}/>}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0 transition-all duration-500 relative ${
                      s.done?"bg-[#16a34a]/10 text-[#16a34a]":s.active?"text-[#c49a1a]":"text-[#d1d5db] bg-[#f3f4f6]"
                    }`} style={s.active?{background:"rgba(196,154,26,0.12)",animation:"pulse-ring 1.5s ease-in-out infinite"}:{}}>
                      {s.done?"✓":s.active?<span style={{animation:"spin 2s linear infinite",display:"inline-block"}}>{s.icon}</span>:<span className="text-[12px]">{i+1}</span>}
                    </div>
                    <div className="flex-1 min-w-0 relative z-[1]">
                      <span className={`text-[14px] font-semibold transition-colors ${s.done?"text-[#374151]":s.active?"text-[#1a1d23]":"text-[#9ca3af]"}`}>{s.label}</span>
                      {s.active&&<div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:"rgba(196,154,26,0.1)"}}>
                          <div className="h-full rounded-full" style={{background:"linear-gradient(90deg,#c49a1a,#e8c84a)",animation:"progress-indeterminate 1.5s ease-in-out infinite"}}/>
                        </div>
                        <span className="text-[10px] font-bold tabular-nums shrink-0" style={{color:"#c49a1a",animation:"blink 1s ease-in-out infinite"}}>처리중</span>
                      </div>}
                    </div>
                    {s.done&&<span className="text-[11px] text-[#16a34a] font-bold px-2 py-0.5 rounded-md" style={{background:"rgba(22,163,74,0.08)"}}>완료</span>}
                    {s.active&&<div className="flex gap-1 items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#c49a1a]" style={{animation:"dot-bounce 1.4s ease-in-out infinite"}} /><span className="w-1.5 h-1.5 rounded-full bg-[#c49a1a]" style={{animation:"dot-bounce 1.4s ease-in-out 0.2s infinite"}} /><span className="w-1.5 h-1.5 rounded-full bg-[#c49a1a]" style={{animation:"dot-bounce 1.4s ease-in-out 0.4s infinite"}} /></div>}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[13px] text-[#9ca3af] flex items-center gap-2">
              <span style={{animation:"blink 1.5s ease-in-out infinite"}}>●</span>
              {elapsed>0?`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')} 경과`:"약 3~5분 소요됩니다"}
            </p>
            <style>{`
              @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
              @keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 rgba(196,154,26,0.4)}50%{box-shadow:0 0 0 8px rgba(196,154,26,0)}}
              @keyframes progress-indeterminate{0%{width:15%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:15%;margin-left:85%}}
              @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
              @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
              @keyframes step-glow{0%,100%{box-shadow:0 0 0 0 rgba(196,154,26,0),background-color:rgba(196,154,26,0.04)}50%{box-shadow:0 0 20px rgba(196,154,26,0.08),background-color:rgba(196,154,26,0.08)}}
              @keyframes dot-bounce{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1.3)}}
              .render-step-active{animation:step-glow 2s ease-in-out infinite}
              @keyframes step-glow{0%,100%{background:rgba(196,154,26,0.04)}50%{background:rgba(196,154,26,0.1)}}
            `}</style>
          </div>

          /* 영상 완료 */
          :store.video?<div className="flex flex-col items-center justify-center py-12 gap-6">
            <div className="w-full max-w-[680px] aspect-video rounded-2xl border-2 flex items-center justify-center" style={{borderColor:"var(--border)",background:"#000"}}><span className="text-[64px]">🎬</span></div>
            <div className="flex items-center gap-6 text-[15px] text-[#9ca3af]">
              <span>⏱ {store.video.duration_sec?.toFixed(1)||"-"}s</span>
              <span>📦 {store.video.file_size_bytes?`${(store.video.file_size_bytes/1024/1024).toFixed(1)}MB`:"-"}</span>
              <span className="text-[#34d399] font-bold">✓ 생성 완료</span>
            </div>
            <p className="text-[14px] text-[#9ca3af]">실드 & 배포 페이지에서 최종 다운로드가 가능합니다</p>
            <button onClick={()=>store.setActivePage("deploy")}
              className="px-10 py-4 rounded-2xl text-[17px] font-extrabold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 6px 24px rgba(212,175,55,0.3)"}}>
              실드 & 배포로 이동 →
            </button>
          </div>

          /* ★ 스토리보드 프리뷰 (스크립트 있지만 영상 미생성) */
          :store.script?.blocks?<div className="max-w-4xl mx-auto space-y-8">
            {/* 상단 스펙 카드 */}
            <div className="grid grid-cols-4 gap-4 anim-fade-up">
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.12)"}}>
                <div className="text-[28px] font-black text-[#c49a1a] anim-score">{Math.floor(totalDur/60)}:{String(Math.round(totalDur%60)).padStart(2,'0')}</div>
                <div className="text-[12px] text-[#9ca3af] mt-1">예상 재생시간</div>
              </div>
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.12)"}}>
                <div className="text-[28px] font-black text-[#60a5fa] anim-score">{totalChars.toLocaleString()}</div>
                <div className="text-[12px] text-[#9ca3af] mt-1">총 글자수</div>
              </div>
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.12)"}}>
                <div className="text-[28px] font-black text-[#a78bfa] anim-score">{store.script.blocks.length}</div>
                <div className="text-[12px] text-[#9ca3af] mt-1">블록 수</div>
              </div>
              <div className="p-5 rounded-2xl text-center" style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.12)"}}>
                <div className="text-[28px] font-black text-[#34d399] anim-score">HD</div>
                <div className="text-[12px] text-[#9ca3af] mt-1">1920×1080</div>
              </div>
            </div>

            {/* 타임라인 바 차트 */}
            <div className="p-4 md:p-6 rounded-2xl border anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:"100ms"}}>
              <h3 className="text-[15px] font-bold text-[#6b7280] mb-5">블록별 타임라인</h3>
              <div className="space-y-3">
                {storyboard.map((s:any,i:number)=>(
                  <div key={i} className="flex items-center gap-4 anim-fade-up" style={{animationDelay:`${i*50+200}ms`}}>
                    <span className="text-[11px] text-[#d1d5db] w-6 text-right font-bold">{i+1}</span>
                    <span className="text-[11px] w-20 shrink-0 font-bold" style={{color:s.color}}>{s.label}</span>
                    <div className="flex-1 h-7 rounded-lg overflow-hidden relative" style={{background:"rgba(255,255,255,0.03)"}}>
                      <div className="h-full rounded-lg anim-bar flex items-center px-3" style={{width:`${Math.max(8,(s.dur/maxDur)*100)}%`,background:`${s.color}20`,borderLeft:`3px solid ${s.color}`,animationDelay:`${i*80+300}ms`}}>
                        <span className="text-[10px] text-[#6b7280] truncate">{s.text}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#d1d5db] w-12 text-right font-bold">{s.dur.toFixed(0)}s</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 영상 구성 요소 */}
            <div className="grid grid-cols-3 gap-4 anim-fade-up" style={{animationDelay:"300ms"}}>
              <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                <span className="text-[24px]">🎨</span>
                <h4 className="text-[14px] font-bold text-[#4b5563] mt-2">Gemini 일러스트</h4>
                <p className="text-[12px] text-[#9ca3af] mt-1">블록마다 AI 생성 밝은 파스텔 일러스트</p>
              </div>
              <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                <span className="text-[24px]">🎙️</span>
                <h4 className="text-[14px] font-bold text-[#4b5563] mt-2">ElevenLabs TTS</h4>
                <p className="text-[12px] text-[#9ca3af] mt-1">고품질 한국어 음성 합성, 스테레오</p>
              </div>
              <div className="p-5 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                <span className="text-[24px]">📑</span>
                <h4 className="text-[14px] font-bold text-[#4b5563] mt-2">챕터 카드</h4>
                <p className="text-[12px] text-[#9ca3af] mt-1">번호 인포그래픽 + 핵심 키워드</p>
              </div>
            </div>

            {/* 큰 생성 버튼 */}
            <div className="text-center anim-fade-up" style={{animationDelay:"400ms"}}>
              <button onClick={gen} disabled={ld}
                className="px-16 py-5 rounded-2xl text-[16px] md:text-[20px] font-extrabold text-white transition-all hover:brightness-110 active:scale-[0.98] anim-pulse"
                style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 8px 40px rgba(212,175,55,0.3)"}}>
                🎬 영상 생성 시작
              </button>
              <p className="text-[13px] text-[#d1d5db] mt-3">Gemini 일러스트 + TTS + FFmpeg 렌더링 (3~5분 소요)</p>
            </div>
          </div>

          :<Empty icon="▶" text="스크립트가 필요합니다"/>}
        </div>
      </div>

      {/* 우측 설정 */}
      <div className="w-full md:w-[340px] shrink-0 border-t md:border-t-0 md:border-l flex flex-col min-h-[40vh] md:min-h-0" style={{borderColor:"var(--border)",background:"var(--bg-secondary)"}}>
        <div className="p-4 md:p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[16px] md:text-[20px] font-extrabold text-[#4b5563]">설정</h2></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <Guide items={[
            {q:"영상은 어떻게 만들어지나요?",a:"대본 → ElevenLabs TTS 음성 생성 → Gemini AI 자료화면/Pexels 배경 이미지 → FFmpeg로 음성+영상+자막+BGM 합성."},
            {q:"시니어 모드란?",a:"TTS 속도를 0.92배로 느리게, 자막을 더 크게, BGM을 작게 — 시니어 시청자에 최적화된 설정입니다."},
            {q:"소요 시간은?",a:"블록 수에 따라 3~5분. TTS 생성 → 배경 이미지 다운로드 → 클립별 렌더링 → 최종 합성 순서로 진행됩니다."},
          ]} />
          <div className="flex items-center justify-between"><span className="text-[15px] text-[#6b7280]">시니어 모드</span><Tog on={store.mode==="senior"} fn={()=>store.setMode(store.mode==="senior"?"normal":"senior")}/></div>
          <div className="h-px" style={{background:"var(--border)"}}/>
          {([["모드",store.mode],["해상도","1920×1080"],["TTS","ElevenLabs"],["일러스트","Gemini AI"],["자막","한글 24px"],["BGM","Ambient"]] as [string,string][]).map(([l,v])=><Row key={l} l={l} v={v}/>)}

          {store.script&&!store.video&&(
            <div className="mt-4 p-4 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
              <p className="text-[12px] font-bold text-[#9ca3af] mb-2">예상 출력</p>
              <div className="space-y-2">
                <Row l="포맷" v="MP4 (H.264)"/>
                <Row l="비트레이트" v="~2Mbps"/>
                <Row l="오디오" v="스테레오 192k"/>
                <Row l="소요시간" v="약 3~5분"/>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 md:p-6 border-t" style={{borderColor:"var(--border)"}}>
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

  const doShield=async()=>{setSL(true);setErr(null);try{const fullText=store.script?.blocks?.map((b:any)=>b.text).join(" ")||"";const r=await fetch(`${API}/api/v1/shield/safety-check`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({has_avatar:true,has_opinion:true,has_custom_voice:true,script_sections:store.script?.blocks?.length||5,total_duration_sec:store.script?.total_duration_sec||180,core_facts_count:3,variation_applied:true,script_text:fullText,script_blocks:store.script?.blocks||[]})});if(!r.ok)throw new Error("실패");store.setShield(await r.json());}catch(e:any){setErr(e.message);}finally{setSL(false);}};
  const doSeo=async()=>{setSoL(true);try{const r=await fetch(`${API}/api/v1/publish/seo/generate?keyword=${encodeURIComponent(store.selectedKeyword||"")}&category=${encodeURIComponent(store.category||"economy")}`);if(r.ok)setSeo(await r.json());}catch{}finally{setSoL(false);}};
  const doSch=async()=>{try{const r=await fetch(`${API}/api/v1/publish/schedule/recommend?category=${encodeURIComponent(store.category||"economy")}`);if(r.ok)setSch(await r.json());}catch{}};

  const s=store.shield?.total_score||0;
  const passed=store.shield?.passed||false;

  // 이전 단계로 돌아가기
  const goBackToScript=()=>{store.setVideo(null);store.setShield(null);store.setStep(3);store.setActivePage("script");};
  const goBackToVideo=()=>{store.setVideo(null);store.setShield(null);store.setStep(4);store.setActivePage("video");};
  const restartAll=()=>{store.reset();store.setActivePage("curation");};

  return(
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
      {/* Shield */}
      <div className="flex-1 border-r flex flex-col" style={{borderColor:"var(--border)"}}>
        <div className="p-4 md:p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[16px] md:text-[20px] font-extrabold text-[#4b5563]">알고리즘 실드</h2></div>
        <div className="flex-1 overflow-y-auto p-8">
          <Guide items={[
            {q:"Safety Score란?",a:"유튜브 수익 창출 정책(AI 콘텐츠, 재사용, 음성 다양성 등)에 얼마나 안전한지를 0~100점으로 평가합니다. 70점 이상이면 수익화 승인 가능성이 높습니다."},
            {q:"점수가 낮으면?",a:"스크립트에 의견/팩트를 추가하거나, 영상 길이를 늘리거나, 아바타를 활성화하면 점수가 올라갑니다. 70점 미만이면 다운로드가 차단됩니다."},
            {q:"SEO 최적화",a:"Gemini AI가 영상 제목, 설명, 태그를 자동 생성합니다. 유튜브 검색에 잘 노출되도록 최적화됩니다."},
            {q:"업로드 스케줄",a:"카테고리별 최적 업로드 시간을 추천합니다. 시청자가 가장 활발한 시간대에 올리면 초기 노출이 극대화됩니다."},
          ]} />
          {err&&<ErrBox>{err}</ErrBox>}
          {sL?<Spinner className="mt-24"/>:store.shield?(
            <div className="space-y-8">
              <div className="flex items-center gap-12">
                <div className="text-center anim-score">
                  <div className="text-[80px] font-black leading-none" style={{color:sc(s),fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{Math.round(s)}</div>
                  <div className="text-[14px] md:text-[18px] font-bold mt-2" style={{color:sc(s)}}>{store.shield.grade}</div>
                  <div className="text-[13px] text-[#9ca3af] mt-1">{passed?"✓ 수익화 안전":"⚠ 개선 필요"}</div>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-[#6b7280] mb-3">수익화 안전 등급</p>
                  <div className="h-6 rounded-full overflow-hidden relative" style={{background:"rgba(255,255,255,0.04)"}}>
                    <div className="h-full rounded-full anim-bar" style={{width:`${s}%`,background:`linear-gradient(90deg,${sc(s)},${sc(s)}88)`}}/>
                    <div className="absolute inset-0 flex items-center justify-between px-1">
                      {[0,25,50,75,100].map(v=><div key={v} className="w-px h-3 bg-white/5"/>)}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[12px] text-[#d1d5db] font-bold">
                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                  </div>
                </div>
              </div>

              {/* ★ 점수 미달 시 경고 + 재작업 버튼 */}
              {!passed&&(
                <div className="p-4 md:p-6 rounded-2xl border border-[#f87171]/20 anim-fade-up" style={{background:"rgba(248,113,113,0.04)"}}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[24px]">🚫</span>
                    <div>
                      <p className="text-[16px] font-bold text-[#f87171]">수익화 위험 — 이 영상은 다운로드하지 마세요</p>
                      <p className="text-[13px] text-[#9ca3af] mt-1">Safety Score {Math.round(s)}점은 수익 창출 승인에 불리합니다. 아래 옵션으로 개선하세요.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <button onClick={goBackToScript} className="p-4 rounded-xl border text-center transition-all hover:border-[#d1d5db]" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                      <span className="text-[20px]">📝</span>
                      <p className="text-[13px] font-bold text-[#4b5563] mt-2">스크립트 수정</p>
                      <p className="text-[10px] text-[#9ca3af] mt-1">대본 내용 개선</p>
                    </button>
                    <button onClick={goBackToVideo} className="p-4 rounded-xl border text-center transition-all hover:border-[#d1d5db]" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                      <span className="text-[20px]">🎬</span>
                      <p className="text-[13px] font-bold text-[#4b5563] mt-2">영상 재생성</p>
                      <p className="text-[10px] text-[#9ca3af] mt-1">다른 비주얼로 재시도</p>
                    </button>
                    <button onClick={restartAll} className="p-4 rounded-xl border text-center transition-all hover:border-[#d1d5db]" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
                      <span className="text-[20px]">🔄</span>
                      <p className="text-[13px] font-bold text-[#4b5563] mt-2">처음부터</p>
                      <p className="text-[10px] text-[#9ca3af] mt-1">새 키워드로 시작</p>
                    </button>
                  </div>
                </div>
              )}

              {store.shield.factors&&<div className="grid grid-cols-2 gap-4">{store.shield.factors.map((f:any,i:number)=>(
                <div key={i} className="p-5 rounded-2xl border anim-fade-up" style={{borderColor:"var(--border)",background:"var(--bg-card)",animationDelay:`${i*100}ms`}}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[15px] font-bold text-[#4b5563]">{f.name}</span>
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-xl ${f.score>=70?"text-[#34d399]":"text-[#f59e0b]"}`} style={{background:f.score>=70?"rgba(52,211,153,0.1)":"rgba(245,158,11,0.1)"}}>{f.score>=70?"Safe":"Warn"}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{background:"rgba(255,255,255,0.04)"}}>
                    <div className="h-full rounded-full anim-bar" style={{width:`${f.score}%`,background:sc(f.score),animationDelay:`${i*120+400}ms`}}/>
                  </div>
                  <div className="flex justify-between text-[12px]"><span style={{color:sc(f.score)}} className="font-bold">{f.score.toFixed(0)}</span><span className="text-[#d1d5db]">w:{(f.weight*100).toFixed(0)}%</span></div>
                  {f.suggestion&&<p className="mt-2 text-[12px] text-[#60a5fa]/40">💡 {f.suggestion}</p>}
                </div>
              ))}</div>}
              {store.shield.risk_items?.length>0&&<div className="p-5 rounded-2xl border border-[#f59e0b]/15" style={{background:"rgba(245,158,11,0.03)"}}><p className="text-[14px] font-bold text-[#f59e0b]/60 mb-2">⚠️ 위험 항목</p>{store.shield.risk_items.map((r:string,i:number)=><p key={i} className="text-[13px] text-[#9ca3af] mb-1">• {r}</p>)}</div>}
            </div>
          ):<Empty icon="◉" text="스크립트가 필요합니다"/>}
        </div>
      </div>

      {/* Publish */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-7 border-b" style={{borderColor:"var(--border)"}}><h2 className="text-[16px] md:text-[20px] font-extrabold text-[#4b5563]">배포 관리</h2></div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="p-4 md:p-6 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
            <div className="flex items-center justify-between mb-4"><span className="text-[16px] font-bold text-[#4b5563]">SEO 최적화</span>{!seo&&<button onClick={doSeo} disabled={soL||!store.selectedKeyword} className="text-[14px] px-4 py-2 rounded-xl text-[#c49a1a] font-bold disabled:opacity-30" style={{background:"rgba(212,175,55,0.08)"}}>{soL?"생성 중...":"Gemini SEO"}</button>}</div>
            {seo?<div className="space-y-3">{seo.title&&<p className="text-[17px] text-[#1f2937] font-bold">{seo.title}</p>}{seo.description&&<p className="text-[14px] text-[#9ca3af] leading-relaxed">{seo.description}</p>}{seo.tags&&<div className="flex flex-wrap gap-2 mt-3">{(Array.isArray(seo.tags)?seo.tags:[]).slice(0,10).map((t:string,i:number)=><span key={i} className="text-[12px] px-2.5 py-1 rounded-xl bg-[#f3f4f6] text-[#9ca3af] border" style={{borderColor:"var(--border)"}}>{t}</span>)}</div>}</div>:<p className="text-[14px] text-[#d1d5db]">SEO 메타데이터를 생성하세요</p>}
          </div>
          <div className="p-4 md:p-6 rounded-2xl border" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}>
            <span className="text-[16px] font-bold text-[#4b5563]">스케줄 추천</span>
            {sch?<div className="mt-3">{sch.recommended_time&&<p className="text-[18px] text-[#c49a1a] font-bold">⏰ {sch.recommended_time}</p>}{sch.reason&&<p className="text-[14px] text-[#9ca3af] mt-1">{sch.reason}</p>}</div>:<p className="text-[14px] text-[#d1d5db] mt-2">로딩 중...</p>}
          </div>

          {/* ★ 점수에 따라 다운로드 영역 변경 */}
          {passed?(
            <div className="p-4 md:p-6 rounded-2xl grad-border relative overflow-hidden" style={{background:"rgba(52,211,153,0.03)"}}>
              <div className="absolute inset-0 noise"/>
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <span className="text-[24px]">✅</span>
                <p className="text-[17px] font-bold text-[#34d399]">수익화 안전 — 다운로드 가능</p>
              </div>
              <p className="text-[14px] text-[#9ca3af] relative z-10">Safety Score {Math.round(s)}점. 유튜브 수익 창출 정책에 적합합니다.</p>
              {store.video?.download_url&&<a href={store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`} target="_blank" rel="noopener noreferrer" className="block mt-4 p-4 rounded-xl text-center text-[16px] font-bold text-white relative z-10" style={{background:"linear-gradient(135deg,#34d399,#6ee7b7)",boxShadow:"0 4px 20px rgba(52,211,153,0.3)"}}>⬇ MP4 다운로드</a>}
            </div>
          ):(
            <div className="p-4 md:p-6 rounded-2xl border border-[#f87171]/15 relative overflow-hidden" style={{background:"rgba(248,113,113,0.03)"}}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[24px]">⛔</span>
                <p className="text-[17px] font-bold text-[#f87171]">다운로드 차단</p>
              </div>
              <p className="text-[14px] text-[#9ca3af]">Safety Score가 70점 미만입니다. 스크립트를 수정하거나 영상을 재생성해주세요.</p>
              <div className="flex gap-3 mt-4">
                <button onClick={goBackToScript} className="flex-1 py-3 rounded-xl text-[14px] font-bold border text-[#6b7280] hover:text-[#374151] transition-all" style={{borderColor:"var(--border)"}}>📝 스크립트 수정</button>
                <button onClick={goBackToVideo} className="flex-1 py-3 rounded-xl text-[14px] font-bold border text-[#6b7280] hover:text-[#374151] transition-all" style={{borderColor:"var(--border)"}}>🎬 영상 재생성</button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 — 점수에 따라 변경 */}
        <div className="p-4 md:p-6 border-t flex gap-4" style={{borderColor:"var(--border)"}}>
          {passed?(
            <>
              <button className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold border text-[#6b7280] hover:text-[#4b5563]" style={{borderColor:"var(--border)"}}>Publish</button>
              <button onClick={()=>{if(store.video?.download_url)window.open(store.video.download_url.startsWith("http")?store.video.download_url:`${API}${store.video.download_url}`,"_blank");}} className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold text-white hover:brightness-110" style={{background:"linear-gradient(135deg,#34d399,#6ee7b7)",boxShadow:"0 6px 24px rgba(52,211,153,0.25)"}}>✓ Download</button>
            </>
          ):(
            <>
              <button onClick={goBackToScript} className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold border text-[#f59e0b] hover:bg-[#f59e0b]/5" style={{borderColor:"rgba(245,158,11,0.3)"}}>← 스크립트로 돌아가기</button>
              <button onClick={restartAll} className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold border text-[#6b7280] hover:text-[#4b5563]" style={{borderColor:"var(--border)"}}>🔄 처음부터</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══ SHARED ═══ */
function Guide({items}:{items:{q:string;a:string}[]}){
  const[open,setOpen]=useState(false);
  return(
    <div className="mb-4">
      <button onClick={()=>setOpen(!open)} className="flex items-center gap-2 text-[12px] text-[#9ca3af] hover:text-[#6b7280] transition-colors">
        <span style={{transform:open?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s",display:"inline-block"}}>▶</span>
        <span className="font-bold">이 화면 사용법</span>
      </button>
      {open&&(
        <div className="mt-3 p-4 rounded-xl space-y-3 text-[13px] anim-fade-up" style={{background:"rgba(196,154,26,0.04)",border:"1px solid rgba(196,154,26,0.1)"}}>
          {items.map((item,i)=>(
            <div key={i}>
              <div className="font-bold text-[#c49a1a] mb-0.5">{item.q}</div>
              <div className="text-[#6b7280] leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Spinner({className="",size="md"}:{className?:string;size?:"md"|"lg"}){const s=size==="lg"?"w-14 h-14 border-[3px]":"w-8 h-8 border-2";return<div className={`flex items-center justify-center ${className}`}><div className={`${s} border-[#c49a1a]/15 border-t-[#c49a1a] rounded-full animate-spin`}/></div>;}
function Empty({icon,text}:{icon:string;text:string}){return<div className="flex flex-col items-center justify-center py-28 text-[#e5e7eb]"><span className="text-[56px] mb-5 anim-float">{icon}</span><span className="text-[17px]">{text}</span></div>;}
function ErrBox({children}:{children:React.ReactNode}){return<div className="mb-5 p-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-[15px]">{children}</div>;}
function GoldBtn({children,onClick,disabled}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean}){return<button onClick={onClick} disabled={disabled} className="w-full py-4 rounded-2xl text-[16px] font-extrabold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-30" style={{background:"linear-gradient(135deg,#c49a1a,#e8c84a)",boxShadow:"0 6px 24px rgba(212,175,55,0.25)"}}>{children}</button>;}
function TBtn({icon,label,desc,onClick,disabled}:{icon:string;label:string;desc:string;onClick:()=>void;disabled?:boolean}){return<button onClick={onClick} disabled={disabled} className="w-full text-left p-5 rounded-2xl border transition-all hover:border-[#d1d5db] disabled:opacity-20 disabled:cursor-not-allowed" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}><div className="flex items-center gap-4"><span className="text-[24px]">{icon}</span><div><div className="text-[15px] font-bold text-[#374151]">{label}</div><div className="text-[12px] text-[#9ca3af]">{desc}</div></div></div></button>;}
function Dchip({label,val}:{label:string;val:string}){return<div><div className="text-[11px] text-[#d1d5db] mb-0.5">{label}</div><div className="text-[14px] text-[#6b7280] font-bold">{val}</div></div>;}
function Badge({label,val,color}:{label:string;val:string;color:string}){return<div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl" style={{background:`${color}12`}}><span className="text-[12px] text-[#9ca3af]">{label}</span><span className="text-[14px] font-bold" style={{color}}>{val}</span></div>;}
function Row({l,v}:{l:string;v:string}){return<div className="flex items-center justify-between"><span className="text-[14px] text-[#9ca3af]">{l}</span><span className="text-[14px] text-[#4b5563] font-bold">{v}</span></div>;}
function Tog({on,fn}:{on:boolean;fn:()=>void}){return<button onClick={fn} className={`w-12 h-6 rounded-full relative transition-all ${on?"bg-[#c49a1a]":"bg-white/10"}`}><div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${on?"left-[26px]":"left-0.5"}`}/></button>;}
function SummaryCard({label,value,color}:{label:string;value:string;color:string}){return<div className="p-4 rounded-xl text-center" style={{background:`${color}08`,border:`1px solid ${color}15`}}><div className="text-[11px] text-[#9ca3af] mb-1">{label}</div><div className="text-[16px] font-extrabold" style={{color}}>{value}</div></div>;}
