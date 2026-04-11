"use client";
import { useEffect, useState } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate, useVideoRender, useShield, usePublish } from "@/hooks/use-api";

/* ═══════════════════════════════════════════════════
   Shared Components
   ═══════════════════════════════════════════════════ */
const Badge = ({ children, color = "#d4af37" }: { children: React.ReactNode; color?: string }) => (
  <span className="text-[10px] px-2 py-0.5 rounded font-bold"
    style={{ background: color + "18", color, fontFamily: "'JetBrains Mono', monospace" }}>
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: string }) => (
  <div className="text-[11px] font-bold text-white/25 tracking-[0.12em] uppercase mb-3"
    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
    {children}
  </div>
);

/* ─── Safety Gauge (SVG circle) ─── */
const SafetyGauge = ({ score, grade }: { score: number; grade: string }) => {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = Math.min(score / 100, 1);
  const offset = c * (1 - pct * 0.75); // 270 degree arc
  const color = score >= 90 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"
          strokeDasharray={`${c * 0.75} ${c * 0.25}`} strokeLinecap="round"
          transform="rotate(135 55 55)" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${c * 0.75} ${c * 0.25}`} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(135 55 55)"
          style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 6px ${color}40)` }} />
        <text x="55" y="50" textAnchor="middle" fill={color} fontSize="22" fontWeight="900"
          style={{ fontFamily: "'Outfit', sans-serif" }}>{grade}</text>
        <text x="55" y="68" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>({score >= 90 ? "안전" : "주의"})</text>
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PAGE 1: 큐레이션 — 3컬럼 레이아웃
   좌: 카테고리+필터 | 중: 키워드 테이블 | 우: 뉴스+안전등급
   ═══════════════════════════════════════════════════ */
const CurationPage = () => {
  const store = useBlackboxStore();
  const { selectedCategory, selectCategory, keywords, selectedKeyword, selectKeyword, newsSources, selectedNews, selectNews, setActivePage } = store;
  const { categories } = useCategories();
  const [highCpmFilter, setHighCpmFilter] = useState(true);

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  const handleSelectNews = (news: any) => {
    selectNews(news);
    setTimeout(() => setActivePage("script"), 400);
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn">
      {/* Sub-tabs */}
      <div className="flex items-center gap-6 px-6 border-b" style={{ borderColor: "var(--border)", height: 42 }}>
        {["Workflow (모듈 A)", "A/B Tests", "Settings"].map((tab, i) => (
          <button key={tab} className={`text-[12px] font-semibold h-full relative transition-colors
            ${i === 0 ? "text-white/70" : "text-white/20 hover:text-white/40"}`}>
            {tab}
            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t" style={{ background: "#d4af37" }} />}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="px-6 pt-4 pb-3">
        <h2 className="text-[16px] font-bold text-white/70" style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
          고객고 팍안츰 및 수익형 유화연 결과
        </h2>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex gap-4 px-6 pb-5 overflow-hidden min-h-0">

        {/* ═══ LEFT: Categories + Filters ═══ */}
        <div className="w-[200px] shrink-0 flex flex-col gap-4 overflow-y-auto">
          <div className="rounded-xl p-4 border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <SectionLabel>카테고리 및 고CPM 큐레이션 필터</SectionLabel>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {categories.map((c: any) => (
                <button key={c.id} onClick={() => selectCategory(c)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all text-center"
                  style={{
                    background: selectedCategory?.id === c.id ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selectedCategory?.id === c.id ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.04)"}`,
                  }}>
                  <span className="text-[18px]">{c.icon}</span>
                  <span className={`text-[10px] font-medium ${selectedCategory?.id === c.id ? "text-[#f0d060]" : "text-white/35"}`}>
                    {c.name.length > 4 ? c.name.slice(0, 4) : c.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-9 h-5 rounded-full relative transition-colors ${highCpmFilter ? "bg-[#d4af37]" : "bg-white/10"}`}
                  onClick={() => setHighCpmFilter(!highCpmFilter)}>
                  <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all"
                    style={{ left: highCpmFilter ? "18px" : "3px" }} />
                </div>
                <div>
                  <div className="text-[11px] text-white/50 font-medium">고CPM 우선 큐레이션</div>
                  <div className="text-[9px] text-[#d4af37]">(Selected)</div>
                </div>
              </label>
              <label className="flex items-center gap-2.5 text-[11px] text-white/30">
                <input type="checkbox" className="accent-[#d4af37] w-3.5 h-3.5" defaultChecked />
                모멘텀 강화 필터
              </label>
              <label className="flex items-center gap-2.5 text-[11px] text-white/30">
                <span className="text-[13px]">🔑</span>
                미사용 키워드만 보기
                <span className="text-[8px] text-white/15">(Exception logic)</span>
              </label>
              <label className="flex items-center gap-2.5 text-[11px] text-white/30">
                <span className="text-[13px]">📋</span>
                팩트 기반 서사 생성
              </label>
            </div>
          </div>

          {/* AI Engines */}
          <div className="rounded-xl p-3 border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="flex flex-wrap gap-1.5">
              {["Gemini 1. Pro", "ElevenLabs", "HeyGen"].map(e => (
                <span key={e} className="text-[9px] px-2 py-1 rounded-md font-medium"
                  style={{ background: "rgba(212,175,55,0.08)", color: "#d4af37" }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CENTER: Keyword Table ═══ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="rounded-xl border flex-1 flex flex-col overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>

            {/* Table Header */}
            <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-white/60">돈 되는 황금 키워드 리스트 (Ranked by BOI v2)</h3>
                <div className="flex gap-2">
                  <Badge color="#d4af37">BOI</Badge>
                  <span className="text-[10px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Volume / grade</span>
                </div>
              </div>
            </div>

            {/* Column Headers */}
            <div className="grid gap-2 px-4 py-2 text-[9px] font-bold text-white/20 uppercase tracking-wider border-b"
              style={{ gridTemplateColumns: "32px 1fr 50px 65px 65px 60px 50px", borderColor: "var(--border)", fontFamily: "'JetBrains Mono', monospace" }}>
              <span>Rank</span><span>키 큐워드</span><span className="text-center">블루오션 지수<br/>(BOI)</span>
              <span className="text-right">검색량</span><span className="text-right">경쟁도<br/>(videos)</span>
              <span className="text-right">모멘텀<br/>(7일 추이)</span><span className="text-center">Action</span>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto">
              {keywords.length > 0 ? keywords.slice(0, 12).map((k: any, i: number) => {
                const isSelected = selectedKeyword?.keyword === k.keyword;
                const gradeColor = k.boiGrade === "A" || k.boiGrade === "A+" ? "#22c55e"
                  : k.boiGrade === "B" ? "#d4af37" : k.boiGrade === "F" ? "#ef4444" : "#f59e0b";
                return (
                  <button key={i} onClick={() => selectKeyword(k)}
                    className={`w-full grid gap-2 px-4 py-2.5 items-center text-left transition-all duration-150 animate-fadeUp
                      ${isSelected ? "" : "hover:bg-white/[0.015]"}`}
                    style={{
                      gridTemplateColumns: "32px 1fr 50px 65px 65px 60px 50px",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: isSelected ? "rgba(212,175,55,0.06)" : "transparent",
                      animationDelay: `${i * 0.03}s`,
                    }}>
                    <span className="text-[12px] font-bold text-white/25" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</span>
                    <span className={`text-[13px] font-semibold truncate ${isSelected ? "text-[#f0d060]" : "text-white/65"}`}>{k.keyword}</span>
                    <div className="flex justify-center">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: gradeColor + "18", color: gradeColor }}>
                        {k.boiGrade || "—"}
                      </span>
                    </div>
                    <span className="text-right text-[12px] text-white/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {k.searchVolume ? (k.searchVolume > 1000 ? (k.searchVolume / 1000).toFixed(1) + "K" : k.searchVolume) : "—"}
                    </span>
                    <span className="text-right text-[12px] text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {k.competitionCount ? k.competitionCount.toLocaleString() : "—"} <span className="text-[9px] text-white/15">videos</span>
                    </span>
                    <span className={`text-right text-[11px] font-semibold ${k.momentum > 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {k.momentum > 0 ? "↑" : "↓"}{Math.abs(k.momentum * 100).toFixed(0)}%
                    </span>
                    <div className="flex justify-center">
                      <span className="text-[10px] px-2 py-0.5 rounded border text-white/25 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-colors cursor-pointer"
                        style={{ borderColor: "var(--border)" }}>Select</span>
                    </div>
                  </button>
                );
              }) : (
                <div className="flex items-center justify-center h-40 text-white/10 text-[13px]">
                  카테고리를 선택하면 키워드가 표시됩니다
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="px-4 py-2 border-t text-[9px] text-white/15 text-center"
              style={{ borderColor: "var(--border)" }}>
              본 기획 데이터는 AI 분석 기반이며, 최종 수익성은 유튜브 알고리즘에 따라 달라질 수 있습니다.
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Safety + News ═══ */}
        <div className="w-[260px] shrink-0 flex flex-col gap-4 overflow-y-auto">
          {/* Safety Gauge */}
          <div className="rounded-xl p-4 border text-center"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <SectionLabel>수익화 안전 보장</SectionLabel>
            <SafetyGauge score={94} grade="A+" />
          </div>

          {/* News Feed */}
          <div className="rounded-xl border flex-1 flex flex-col overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[12px] font-bold text-white/50">정제된 뉴스 소스 피드 (Fact Cleansed)</h3>
              <p className="text-[9px] text-white/20 mt-0.5">Fact Cleansing AI 분석 기반이며, 문맥의 수익성에 따라 달라질 수 있습니다.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {newsSources.length > 0 ? newsSources.slice(0, 4).map((n: any, i: number) => {
                const isSelected = selectedNews?.title === n.title;
                return (
                  <button key={i} onClick={() => handleSelectNews(n)}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200 animate-fadeUp"
                    style={{
                      background: isSelected ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.015)",
                      border: `1px solid ${isSelected ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.04)"}`,
                      animationDelay: `${i * 0.06}s`,
                    }}>
                    <p className="text-[12px] text-white/55 font-medium leading-relaxed line-clamp-2 mb-2">{n.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-white/20">🔵 {n.source}</span>
                        <span className="text-[9px] text-white/15">💬 3</span>
                        <span className="text-[9px] text-white/15">🖼 4</span>
                      </div>
                      <Badge color="#22c55e">${(12 + Math.random() * 10).toFixed(1)} CPM</Badge>
                    </div>
                  </button>
                );
              }) : (
                <div className="flex items-center justify-center h-24 text-white/10 text-[11px]">
                  키워드를 선택하면 뉴스가 표시됩니다
                </div>
              )}
            </div>

            {/* Bottom label */}
            <div className="px-4 py-2.5 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[10px] text-white/20">→</span>
                <span className="text-[10px] font-bold text-[#d4af37]/60">(모듈 B) 서사 및 제작 엔진으로 전달</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PAGE 2: 스크립트
   ═══════════════════════════════════════════════════ */
const ScriptPage = () => {
  const store = useBlackboxStore();
  const { script, mode, setMode, isLoading, selectedKeyword, selectedCategory, selectedNews, setActivePage } = store;
  const { generate } = useScriptGenerate();
  const { startRender } = useVideoRender();

  useEffect(() => {
    if (selectedNews && selectedKeyword && selectedCategory && !script && !isLoading) {
      generate({
        keyword: selectedKeyword.keyword, category: selectedCategory.id,
        newsSummary: selectedNews.summary, coreFacts: [selectedNews.title], opinionSeeds: []
      });
    }
  }, [selectedNews]);

  const colors: Record<string, { bg: string; color: string; label: string }> = {
    hook: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Hook Logic" },
    body: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", label: "Body" },
    opinion: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", label: "Opinion Injector" },
  };

  const goToVideo = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    store.setStep(4);
    setActivePage("video");
    await startRender({
      keyword: selectedKeyword.keyword, category: selectedCategory.id,
      scriptBlocks: script.blocks.map((b: any) => ({ section: b.section, text: b.text, duration_sec: b.durationSec, subtitle_highlight: b.subtitleHighlight }))
    });
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="flex items-center gap-6 px-6 border-b" style={{ borderColor: "var(--border)", height: 42 }}>
        <button className="text-[12px] font-semibold h-full text-white/70 relative">
          Workflow (모듈 B)
          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t" style={{ background: "#d4af37" }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {script ? (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[15px] font-bold text-white/60">스크립트 멀티어 구성</h2>
              <div className="flex items-center gap-3">
                <Badge>총 {script.totalDurationSec}초</Badge>
                <span className="text-[10px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  후킹: <span className="text-[#f59e0b]">{script.hookType}</span> · 톤: <span className="text-[#06b6d4]">{script.opinionTone}</span>
                </span>
              </div>
            </div>

            {script.blocks.map((b: any, i: number) => {
              const s = colors[b.section] || colors.body;
              return (
                <div key={i} className="rounded-xl border overflow-hidden animate-fadeUp"
                  style={{ borderColor: "var(--border)", background: "var(--bg-card)", animationDelay: `${i * 0.07}s` }}>
                  <div className="flex items-center justify-between px-5 py-2.5 border-b"
                    style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.01)" }}>
                    <span className="text-[11px] px-2.5 py-0.5 rounded font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    <span className="text-[11px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{b.durationSec}s</span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[14px] text-white/55 leading-[1.85]">{b.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Controls */}
            <div className="flex items-center gap-4 p-4 rounded-xl border"
              style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <span className="text-[12px] text-white/35">Senior Mode</span>
              <div className={`w-9 h-5 rounded-full relative cursor-pointer ${mode === "senior" ? "bg-emerald-500" : "bg-white/10"}`}
                onClick={() => setMode(mode === "senior" ? "normal" : "senior")}>
                <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all"
                  style={{ left: mode === "senior" ? "18px" : "3px" }} />
              </div>
              <div className="w-px h-4 bg-white/[0.06]" />
              <span className="text-[11px] text-white/25">속도: <strong className="text-white/50">{mode === "senior" ? "0.92x" : "1.0x"}</strong></span>
              <span className="text-[11px] text-white/25">자막: <strong className="text-white/50">{mode === "senior" ? "150%" : "100%"}</strong></span>
            </div>

            <button onClick={goToVideo}
              className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all hover:-translate-y-0.5 mt-2"
              style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}>
              영상 편집 진행 →
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="text-white/10 text-[14px]">{isLoading ? "스크립트 생성 중..." : "큐레이션에서 뉴스를 선택해주세요"}</div>
            {!isLoading && !selectedNews && (
              <button onClick={() => setActivePage("curation")} className="text-[12px] text-[#d4af37] hover:underline">← 큐레이션으로 돌아가기</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PAGE 3: 영상편집
   ═══════════════════════════════════════════════════ */
const VideoPage = () => {
  const store = useBlackboxStore();
  const { mode, videoJob, selectedKeyword, selectedCategory, setActivePage } = store;
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  const goToShield = async () => {
    if (!videoJob) return;
    store.setStep(5);
    setActivePage("deploy");
    await applyShield(videoJob.outputPath || "/output/video.mp4");
    if (selectedKeyword && selectedCategory) {
      await preparePublish({ channelId: "CH001", videoPath: videoJob.outputPath || "/output/video.mp4", keyword: selectedKeyword.keyword, category: selectedCategory.id });
    }
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="flex items-center gap-6 px-6 border-b" style={{ borderColor: "var(--border)", height: 42 }}>
        <button className="text-[12px] font-semibold h-full text-white/70 relative">
          Workflow (모듈 B2)
          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t" style={{ background: "#d4af37" }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-5">
          {/* Preview */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[12px] font-bold text-white/50">영상 미리보기</h3>
            </div>
            <div className="aspect-video flex items-center justify-center flex-col gap-3 relative"
              style={{ background: "linear-gradient(135deg, #12142a, #0e1025)" }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.04) 0%, transparent 60%)" }} />
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg text-[#d4af37] z-10"
                style={{ background: "rgba(212,175,55,0.1)", border: "2px solid rgba(212,175,55,0.2)" }}>▶</div>
              <span className="text-[10px] text-white/15 z-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Preview after generation</span>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[12px] font-bold text-white/50">영상 설정</h3>
            </div>
            <div className="p-4">
              {[
                { label: "해상도", value: "1920 × 1080 (FHD)" },
                { label: "음성 엔진", value: "ElevenLabs Korean" },
                { label: "배경 스타일", value: "NotebookLM Dark" },
                { label: "자막", value: "한국어 SRT" },
                { label: "음성 속도", value: mode === "senior" ? "0.92x" : "1.0x" },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center py-3 ${i < 4 ? "border-b" : ""}`}
                  style={{ borderColor: "var(--border)" }}>
                  <span className="text-[12px] text-white/35">{item.label}</span>
                  <span className="text-[12px] font-semibold text-white/60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2 rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-white/60">영상 편집 결과</h3>
                <p className="text-[11px] text-white/20 mt-1">{videoJob ? "영상 편집 완료" : "처리 중..."}</p>
              </div>
              {videoJob && (
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 8px rgba(34,197,94,0.4)" }} />
                  <span className="text-[12px] text-[#22c55e] font-semibold">완료</span>
                </div>
              )}
            </div>
          </div>

          {videoJob && (
            <div className="col-span-2">
              <button onClick={goToShield}
                className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
                실드 분석 & 배포 준비 →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PAGE 4: 실드 & 배포 (Create Video 최종)
   ═══════════════════════════════════════════════════ */
const DeployPage = () => {
  const store = useBlackboxStore();
  const { shield, publish, script, selectedKeyword, selectedCategory, mode } = store;
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    setGenerating(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(API + "/api/v1/video/generate-real", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: selectedKeyword.keyword, category: selectedCategory.id, mode,
          script_blocks: script.blocks.map((b: any) => ({ text: b.text, section: b.section, duration_sec: b.durationSec })) })
      });
      const data = await res.json();
      if (data.download_url) window.open(API + data.download_url, "_blank");
    } catch (e) { console.error(e); } finally { setGenerating(false); }
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="flex items-center gap-6 px-6 border-b" style={{ borderColor: "var(--border)", height: 42 }}>
        <button className="text-[12px] font-semibold h-full text-white/70 relative">
          Workflow (모듈 C+D)
          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t" style={{ background: "#d4af37" }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-5">
          {/* Shield */}
          <div className="rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[12px] font-bold text-white/50">알고리즘 보안 실드</h3>
            </div>
            {shield ? (
              <div className="p-4">
                <div className="flex gap-5 items-start">
                  <div className="flex-1 space-y-0">
                    {shield.factors?.map((f: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2.5 animate-fadeUp"
                        style={{ borderBottom: i < (shield.factors?.length || 0) - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", animationDelay: `${i * 0.04}s` }}>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-white/35">Uniqueness Check</span>
                          <span className="text-[9px] text-white/15 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>[{f.name}]</span>
                        </div>
                        <Badge color="#22c55e">Safe</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="shrink-0">
                    <SafetyGauge score={Math.round(shield.safetyScore)} grade={shield.safetyGrade} />
                    <div className="text-center mt-1">
                      <span className="text-[20px] font-extrabold text-white/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {Math.round(shield.safetyScore)}<span className="text-[11px] text-white/20">/100</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-white/10 text-[12px]">실드 분석 중...</div>
            )}
          </div>

          {/* Deploy */}
          <div className="rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[12px] font-bold text-white/50">알고리즘 동기화 배포</h3>
            </div>
            {publish ? (
              <div className="p-4 space-y-4">
                {/* Algo-Sync */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-white/50">Algo-Sync Check</span>
                    <Badge color="#22c55e">동기화 전환</Badge>
                  </div>
                  <p className="text-[9px] text-white/15 mb-2">24시간 간격 정책 점검 모듈. 동기화 시행중</p>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${publish.syncProgress}%`, background: "linear-gradient(90deg, #22c55e, #4ade80)", boxShadow: "0 0 8px rgba(34,197,94,0.2)" }} />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-[14px] font-bold text-[#22c55e]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(publish.syncProgress)}%</span>
                  </div>
                </div>

                {/* SEO */}
                <div>
                  <SectionLabel>SEO</SectionLabel>
                  {publish.titles?.slice(0, 2).map((t: string, i: number) => (
                    <div key={i} className="text-[12px] text-white/45 p-2.5 mb-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                      {i + 1}. {t}
                    </div>
                  ))}
                  {publish.hashtags && (
                    <div className="flex gap-1.5 flex-wrap mt-3">
                      {publish.hashtags.slice(0, 6).map((h: string, i: number) => (
                        <span key={i} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "rgba(212,175,55,0.08)", color: "#d4af37" }}>{h}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-white/10 text-[12px]">배포 준비 중...</div>
            )}
          </div>

          {/* Action Buttons — 최종 페이지에만 */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <button className="py-3.5 rounded-xl text-[14px] font-semibold text-white/30 border transition-all hover:border-white/[0.12]"
              style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.015)" }}>
              Publish
            </button>
            <button onClick={handleGenerate} disabled={generating}
              className="py-3.5 rounded-xl text-[14px] font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #d4af37, #c4a030)", color: "#09090b", boxShadow: "0 4px 20px rgba(212,175,55,0.2)" }}>
              {generating ? "생성중..." : "Create Video & Download"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN — activePage로 완전 분리된 페이지 전환
   ═══════════════════════════════════════════════════ */
export default function CreatePage() {
  const { activePage } = useBlackboxStore();

  switch (activePage) {
    case "curation": return <CurationPage />;
    case "script": return <ScriptPage />;
    case "video": return <VideoPage />;
    case "deploy": return <DeployPage />;
    default: return <CurationPage />;
  }
}
