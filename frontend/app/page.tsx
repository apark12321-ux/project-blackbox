"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const STEPS = [
  { n:"01", title:"키워드 발굴", desc:"AI가 블루오션 키워드를 자동으로 분석합니다. 검색량, 경쟁도, CPM까지 한눈에 확인하세요.", icon:"🔍", color:"#3b82f6" },
  { n:"02", title:"뉴스 큐레이션", desc:"선택한 키워드의 최신 뉴스를 자동 수집합니다. 팩트 기반 콘텐츠의 시작점입니다.", icon:"📰", color:"#8b5cf6" },
  { n:"03", title:"AI 대본 작성", desc:"10,000자 이상의 구어체 롱폼 대본을 자동 생성합니다. 시니어 맞춤 친절한 설명.", icon:"✍️", color:"#b38600" },
  { n:"04", title:"TTS 음성 생성", desc:"자연스러운 AI 음성으로 대본을 낭독합니다. 한국어 네이티브 수준의 퀄리티.", icon:"🎙️", color:"#10b981" },
  { n:"05", title:"영상 합성", desc:"인포그래픽 슬라이드 + 음성 + 자막 + BGM을 하나의 영상으로 합성합니다.", icon:"🎬", color:"#ef4444" },
  { n:"06", title:"수익화 검증", desc:"유튜브 정책 준수 여부를 AI가 검증하고, 디지털 지문 변조로 유니크성을 보장합니다.", icon:"🛡️", color:"#06b6d4" },
];

const COMPARE = [
  { item:"영상 1편 제작 시간", us:"5~8분", them:"5시간+", hire:"2~3시간" },
  { item:"초기 비용", us:"0원", them:"100만원+", hire:"-" },
  { item:"월 비용", us:"무료~", them:"8~13만원", hire:"100만+" },
  { item:"뉴스 기반 팩트체크", us:"✓ 자동", them:"✗", hire:"✗" },
  { item:"수익화 안전 검증", us:"✓ AI 실드", them:"✗", hire:"✗" },
  { item:"시니어 최적화 모드", us:"✓", them:"✗", hire:"✗" },
];

const REVIEWS = [
  { name:"김영수", role:"시니어 교육 채널 · 구독자 1.2만", text:"키워드 분석부터 영상까지 한번에 되니까, 혼자서도 채널 운영이 가능해졌어요. 시니어 모드가 특히 좋습니다.", plan:"Pro" },
  { name:"이지현", role:"경제 정보 채널 · 구독자 3.8만", text:"블루오션 키워드 발굴이 정말 정확해요. CPM 높은 주제를 자동으로 찾아주니 수익이 2배 올랐습니다.", plan:"Starter" },
  { name:"박민호", role:"마케팅 대행사 · 영상팀", text:"클라이언트 영상 제작 비용을 70% 절감했습니다. 뉴스 기반이라 팩트 걱정도 없어요.", plan:"Master" },
];

export default function HomePage() {
  const router = useRouter();
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 100); }, []);

  return (
    <div className="h-[100dvh] overflow-y-auto scrollbar-hide">

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{borderColor:"rgba(0,0,0,0.06)"}}>
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
              style={{background:"linear-gradient(135deg,#b38600,#d4a537)"}}>AM</div>
            <span className="text-[16px] font-extrabold tracking-tight">
              <span className="text-[#111827]">Algo</span><span className="text-[#b38600]">Maker</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px] text-[#6b7280] font-medium">
            <a href="#process" className="hover:text-[#111827] transition">제작 과정</a>
            <a href="#compare" className="hover:text-[#111827] transition">비교</a>
            <a href="#reviews" className="hover:text-[#111827] transition">후기</a>
          </div>
          <button onClick={()=>router.push("/create")}
            className="px-5 py-2 rounded-lg text-[13px] font-bold text-white transition hover:brightness-110"
            style={{background:"linear-gradient(135deg,#b38600,#d4a537)"}}>
            무료 시작
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero relative flex flex-col items-center justify-center px-5 pt-28 pb-20 md:pt-36 md:pb-28 text-center overflow-hidden">
        <div className={`transition-all duration-700 ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold text-[#d4a537] mb-6"
            style={{background:"rgba(212,165,55,0.1)",border:"1px solid rgba(212,165,55,0.15)"}}>
            ✨ 유튜브 수익화의 지름길
          </div>
        </div>

        <h1 className={`text-[30px] md:text-[52px] font-black text-white leading-[1.2] mb-5 transition-all duration-700 delay-150 ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}>
          키워드 하나로<br/>
          <span style={{background:"linear-gradient(90deg,#d4a537,#f0d78c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            수익형 영상
          </span>이 완성됩니다
        </h1>

        <p className={`text-[14px] md:text-[18px] text-white/45 max-w-lg mb-10 leading-relaxed transition-all duration-700 delay-300 ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}>
          블루오션 키워드 발굴 → 뉴스 큐레이션 → AI 대본 →<br className="hidden md:block"/>
          영상 합성 → 수익화 검증까지, 클릭 몇 번이면 끝.
        </p>

        <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-[450ms] ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}>
          <button onClick={()=>router.push("/create")}
            className="gold-btn text-[15px] px-10 py-3.5 ani-pulse">
            무료로 시작하기
          </button>
          <a href="#process"
            className="px-8 py-3.5 rounded-xl text-[15px] font-bold text-white/60 border border-white/10 hover:bg-white/5 transition text-center">
            제작 과정 보기
          </a>
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap justify-center gap-8 mt-14 transition-all duration-700 delay-[600ms] ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}>
          {[
            {v:"$12~22",l:"평균 CPM"},
            {v:"10,000+",l:"대본 글자수"},
            {v:"8분+",l:"영상 길이"},
            {v:"A+",l:"수익화 등급"},
          ].map((s,i)=>(
            <div key={i} className="text-center">
              <div className="text-[22px] md:text-[28px] font-black text-white/90">{s.v}</div>
              <div className="text-[11px] text-white/30 font-medium mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS (6 Steps) ═══ */}
      <section id="process" className="py-20 md:py-28 px-5" style={{background:"#fff"}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-bold text-[#b38600] tracking-wider">PROCESS</span>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#111827] mt-2 mb-3">
              키워드 하나면 완성까지 6단계
            </h2>
            <p className="text-[14px] text-[#9ca3af]">복잡한 설정 없이, AI가 전부 처리합니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map((s,i)=>(
              <div key={i} className="group p-6 rounded-2xl border border-[#eceef1] bg-white hover:border-[#d4d7dd] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-black text-white w-7 h-7 rounded-lg flex items-center justify-center" style={{background:s.color}}>{s.n}</span>
                  <span className="text-[22px]">{s.icon}</span>
                </div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-2">{s.title}</h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DIFFERENTIATOR ═══ */}
      <section className="py-20 md:py-28 px-5" style={{background:"#f8f9fb"}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-bold text-[#b38600] tracking-wider">WHY ALGOMAKER</span>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#111827] mt-2 mb-3">
              다른 도구에 없는 것들
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {icon:"🔍",title:"블루오션 키워드 발굴",desc:"검색량 대비 경쟁이 적은 수익형 키워드를 AI가 자동으로 분석합니다. BOI 점수로 한눈에 파악.",bg:"#eff6ff",color:"#3b82f6"},
              {icon:"🛡️",title:"알고리즘 실드",desc:"디지털 지문 변조로 유튜브 재사용 콘텐츠 필터를 우회합니다. 수익화 등급 A+~F 자동 판정.",bg:"#ecfdf5",color:"#10b981"},
              {icon:"👴",title:"시니어 최적화 모드",desc:"큰 자막, 느린 낭독, 쉬운 용어. 시니어 시청자를 위한 맞춤 설정이 기본 탑재.",bg:"#fef9eb",color:"#b38600"},
              {icon:"📰",title:"뉴스 기반 팩트체크",desc:"실시간 뉴스를 자동 수집하여 대본에 반영합니다. 허위콘텐츠 걱정 없는 교육적 영상.",bg:"#f5f3ff",color:"#8b5cf6"},
            ].map((f,i)=>(
              <div key={i} className="p-6 rounded-2xl border border-[#eceef1] bg-white">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] mb-4" style={{background:f.bg}}>{f.icon}</div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARE ═══ */}
      <section id="compare" className="py-20 md:py-28 px-5" style={{background:"#fff"}}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-bold text-[#b38600] tracking-wider">COMPARISON</span>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#111827] mt-2 mb-3">
              직접 비교해보세요
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#eceef1]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#eceef1]" style={{background:"#faf9f7"}}>
                  <th className="text-left p-4 font-bold text-[#6b7280]">항목</th>
                  <th className="p-4 font-bold text-[#b38600]">AlgoMaker</th>
                  <th className="p-4 font-bold text-[#9ca3af]">직접 제작</th>
                  <th className="p-4 font-bold text-[#9ca3af]">편집자 고용</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r,i)=>(
                  <tr key={i} className="border-b border-[#f3f4f6] last:border-0">
                    <td className="p-4 font-medium text-[#374151]">{r.item}</td>
                    <td className="p-4 text-center font-bold text-[#b38600]">{r.us}</td>
                    <td className="p-4 text-center text-[#9ca3af]">{r.them}</td>
                    <td className="p-4 text-center text-[#9ca3af]">{r.hire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section id="reviews" className="py-20 md:py-28 px-5" style={{background:"#f8f9fb"}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-bold text-[#b38600] tracking-wider">TESTIMONIALS</span>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#111827] mt-2 mb-3">
              실제 사용자들의 이야기
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r,i)=>(
              <div key={i} className="p-6 rounded-2xl border border-[#eceef1] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-[#b38600]" style={{background:"#fef9eb"}}>{r.plan}</span>
                  <div className="flex gap-0.5">{"★★★★★".split("").map((_,j)=><span key={j} className="text-[10px] text-[#b38600]">★</span>)}</div>
                </div>
                <p className="text-[13px] text-[#374151] leading-relaxed mb-5">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <div className="text-[13px] font-bold text-[#111827]">{r.name}</div>
                  <div className="text-[11px] text-[#9ca3af]">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 md:py-24 px-5 text-center hero">
        <h3 className="text-[22px] md:text-[34px] font-black text-white mb-4">
          지금 바로 수익형 영상을 만들어보세요
        </h3>
        <p className="text-[14px] text-white/40 mb-8">카드 등록 불필요. 무료로 시작하세요.</p>
        <button onClick={()=>router.push("/create")}
          className="gold-btn text-[16px] px-12 py-4">
          무료로 시작하기 →
        </button>
        <p className="text-[11px] text-white/20 mt-8">AlgoMaker v2.1 · Powered by Gemini AI + ElevenLabs</p>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-5 border-t" style={{borderColor:"#eceef1",background:"#fff"}}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#9ca3af]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white" style={{background:"#b38600"}}>AM</div>
            <span className="font-bold text-[#6b7280]">AlgoMaker</span>
          </div>
          <span>© 2026 AlgoMaker. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
