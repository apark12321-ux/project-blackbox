"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const FEATURES = [
  { icon: "◈", title: "AI 뉴스 큐레이션", desc: "블루오션 키워드 발굴 + 실시간 뉴스 수집", color: "#6366f1", delay: 0 },
  { icon: "◆", title: "AI 스크립트 생성", desc: "Gemini 기반 수익 최적화 대본 자동 작성", color: "#c49a1a", delay: 100 },
  { icon: "▶", title: "원클릭 영상 제작", desc: "TTS + 인포그래픽 + 자막 자동 합성", color: "#0ea5e9", delay: 200 },
  { icon: "◉", title: "알고리즘 실드", desc: "수익화 안전 검증 + SEO 자동 최적화", color: "#22c55e", delay: 300 },
];

const STATS = [
  { label: "CPM 분석", value: "$12~22", icon: "📊" },
  { label: "키워드 발굴", value: "실시간", icon: "🔍" },
  { label: "영상 생성", value: "3~5분", icon: "⚡" },
  { label: "수익화 검증", value: "AI 자동", icon: "🛡" },
];

export default function HomePage() {
  const router = useRouter();
  const [vis, setVis] = useState(false);

  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  return (
    <div className="h-[100dvh] overflow-y-auto scrollbar-hide">
      {/* Hero */}
      <section className="hero-bg relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10"
              style={{
                width: `${20 + i * 15}px`, height: `${20 + i * 15}px`,
                background: `linear-gradient(135deg, #c49a1a, #e8c84a)`,
                left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 25}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }} />
          ))}
        </div>

        {/* Logo */}
        <div className={`transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-[24px] md:text-[30px] font-black text-white mx-auto mb-6"
            style={{ background: "linear-gradient(135deg,#c49a1a,#e8c84a)", boxShadow: "0 8px 40px rgba(196,154,26,0.4)" }}>
            AM
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-[28px] md:text-[48px] font-black text-white leading-tight mb-4 transition-all duration-1000 delay-200 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span className="text-white">Algo</span>
          <span style={{ background: "linear-gradient(90deg,#c49a1a,#e8c84a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maker</span>
        </h1>

        <p className={`text-[14px] md:text-[20px] text-white/50 font-medium max-w-lg mb-3 transition-all duration-1000 delay-300 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          알고리즘이 숨어있는
        </p>
        <p className={`text-[18px] md:text-[28px] text-white/80 font-bold max-w-lg mb-10 transition-all duration-1000 delay-400 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          유튜브 영상 자동 생성 프로그램
        </p>

        {/* CTA */}
        <button onClick={() => router.push("/create")}
          className={`px-8 py-3.5 md:px-12 md:py-4 rounded-xl text-[15px] md:text-[18px] font-bold text-white transition-all hover:brightness-110 hover:scale-105 active:scale-[0.98] anim-pulse
            ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ background: "linear-gradient(135deg,#c49a1a,#e8c84a)", boxShadow: "0 8px 40px rgba(196,154,26,0.3)", transitionDelay: "500ms", transitionDuration: "1000ms" }}>
          시작하기 →
        </button>

        {/* Stats bar */}
        <div className={`flex flex-wrap justify-center gap-4 md:gap-8 mt-12 transition-all duration-1000 delay-[700ms] ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span className="text-[16px]">{s.icon}</span>
              <div>
                <div className="text-[10px] text-white/30 font-bold">{s.label}</div>
                <div className="text-[13px] text-white/70 font-bold">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] text-white/50 font-bold tracking-widest">SCROLL</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/40" style={{ animation: "float 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4" style={{background:"var(--bg-card)"}}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] md:text-[36px] font-black text-center text-white/90 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            4단계 자동화 파이프라인
          </h2>
          <p className="text-[13px] md:text-[16px] text-white/35 text-center mb-10 md:mb-16">
            키워드 발굴부터 영상 생성까지, AI가 전부 처리합니다
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 anim-fade-up"
                style={{ borderColor: "var(--border)", animationDelay: `${f.delay}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}12`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-[16px] md:text-[18px] font-bold text-white/90 mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-16 md:py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #1a1d23, #2d1f0e)" }}>
        <h3 className="text-[20px] md:text-[30px] font-black text-white mb-4">지금 바로 시작하세요</h3>
        <p className="text-[13px] md:text-[16px] text-white/40 mb-8">카테고리 선택 → 키워드 → 스크립트 → 영상 완성</p>
        <button onClick={() => router.push("/create")}
          className="px-10 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all hover:brightness-110 hover:scale-105"
          style={{ background: "linear-gradient(135deg,#c49a1a,#e8c84a)", boxShadow: "0 6px 24px rgba(196,154,26,0.3)" }}>
          무료로 시작 →
        </button>
        <p className="text-[11px] text-white/20 mt-6">AlgoMaker v2.1 — Powered by Gemini AI + ElevenLabs</p>
      </section>
    </div>
  );
}
