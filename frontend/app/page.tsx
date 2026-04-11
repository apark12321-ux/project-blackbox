"use client";
import { useEffect, useState } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate, useVideoRender, useShield, usePublish } from "@/hooks/use-api";

/* ═══════════════════════════════════════════════════
   Section Header Component
   ═══════════════════════════════════════════════════ */
const SectionTitle = ({ children, color = "#d4af37" }: { children: string; color?: string }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div className="w-1 h-5 rounded-sm" style={{ background: `linear-gradient(180deg, ${color}, ${color}88)` }} />
    <h2 className="text-[17px] font-bold" style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>{children}</h2>
  </div>
);

const Badge = ({ children, color = "#d4af37" }: { children: React.ReactNode; color?: string }) => (
  <span className="text-[11px] px-2.5 py-0.5 rounded-md font-bold"
    style={{ background: color + "18", color, fontFamily: "'JetBrains Mono', monospace" }}>
    {children}
  </span>
);

/* ═══════════════════════════════════════════════════
   Module A: Curation (Steps 0-2)
   ═══════════════════════════════════════════════════ */
const CurationModule = () => {
  const store = useBlackboxStore();
  const { step, selectedCategory, selectCategory, keywords, selectedKeyword, selectKeyword, newsSources, selectedNews, selectNews } = store;
  const { categories } = useCategories();

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  return (
    <div className="animate-fadeUp">
      {/* Page Header */}
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.04]"
        style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold text-[#09090b]"
            style={{ background: "linear-gradient(135deg, #d4af37, #c4a030)" }}>◈</div>
          <div>
            <div className="text-[10px] font-semibold tracking-[0.15em] text-[#d4af37] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 01</div>
            <h1 className="text-[22px] font-extrabold"
              style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
              모듈 A: 지능형 큐레이션 엔진
            </h1>
          </div>
        </div>
        <p className="text-[12px] text-white/25 ml-12">카테고리 선택 → 키워드 분석 → 뉴스 소스 큐레이션</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Categories */}
        <section>
          <SectionTitle>카테고리 선택</SectionTitle>
          <div className="flex gap-2.5 flex-wrap">
            {categories.map((c: any) => (
              <button key={c.id} onClick={() => selectCategory(c)}
                className={`px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 flex items-center gap-2
                  ${selectedCategory?.id === c.id
                    ? "border-[#d4af37]/30 text-[#f0d060] font-semibold"
                    : "border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/60"}`}
                style={{
                  border: `1px solid ${selectedCategory?.id === c.id ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: selectedCategory?.id === c.id
                    ? "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))"
                    : "rgba(255,255,255,0.02)",
                  boxShadow: selectedCategory?.id === c.id ? "0 4px 20px rgba(212,175,55,0.08)" : "none",
                }}>
                <span className="text-[17px]">{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
        </section>

        {/* Keywords */}
        {step >= 1 && keywords.length > 0 && (
          <section className="animate-fadeUp">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-1 h-5 rounded-sm" style={{ background: "linear-gradient(180deg, #06b6d4, #0891b2)" }} />
              <h2 className="text-[17px] font-bold" style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
                Trending Blue Ocean Keywords
              </h2>
              <Badge color="#06b6d4">LIVE</Badge>
            </div>

            <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
              {/* Table header */}
              <div className="grid gap-3 px-6 py-3 border-b border-white/[0.06] text-[10px] font-semibold text-white/20 uppercase tracking-[0.08em]"
                style={{ gridTemplateColumns: "40px 1fr 70px 70px 80px 50px", fontFamily: "'JetBrains Mono', monospace" }}>
                <span>#</span><span>Keyword</span><span className="text-right">BOI</span>
                <span className="text-right">경쟁</span><span className="text-right">트렌딩</span><span className="text-right">등급</span>
              </div>
              {keywords.slice(0, 6).map((k: any, i: number) => (
                <button key={i} onClick={() => selectKeyword(k)}
                  className={`w-full grid gap-3 px-6 py-3.5 items-center transition-all duration-150 text-left
                    ${selectedKeyword?.keyword === k.keyword ? "bg-[#d4af37]/[0.06]" : "hover:bg-white/[0.02]"}`}
                  style={{
                    gridTemplateColumns: "40px 1fr 70px 70px 80px 50px",
                    borderBottom: i < Math.min(keywords.length, 6) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                  <span className="text-[13px] font-bold text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</span>
                  <span className={`text-[14px] font-semibold truncate ${selectedKeyword?.keyword === k.keyword ? "text-[#f0d060]" : "text-white/70"}`}>
                    {k.keyword}
                  </span>
                  <span className="text-right text-[14px] font-bold text-[#d4af37]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {k.boiScore?.toFixed(1) || "—"}
                  </span>
                  <span className="text-right text-[13px] text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {k.competitionCount || "—"}
                  </span>
                  <span className={`text-right text-[13px] font-semibold ${k.momentum > 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {k.momentum > 0 ? "↑" : "↓"}{Math.abs(k.momentum * 100).toFixed(0)}%
                  </span>
                  <span className="text-right">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold
                      ${k.boiGrade === "A" ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : k.boiGrade === "B" ? "bg-[#d4af37]/10 text-[#d4af37]"
                        : k.boiGrade === "C" ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                        : "bg-[#ef4444]/10 text-[#ef4444]"}`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {k.boiGrade || "—"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* News Feed */}
        {step >= 2 && newsSources.length > 0 && (
          <section className="animate-fadeUp">
            <SectionTitle color="#22c55e">Curated News Source Feed</SectionTitle>
            <div className="flex flex-col gap-3">
              {newsSources.slice(0, 4).map((n: any, i: number) => (
                <button key={i} onClick={() => selectNews(n)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-200
                    ${selectedNews?.title === n.title
                      ? "border-[#d4af37]/25"
                      : "border-white/[0.06] hover:border-white/[0.1] hover:-translate-y-0.5"}`}
                  style={{
                    border: `1px solid ${selectedNews?.title === n.title ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.06)"}`,
                    background: selectedNews?.title === n.title ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.015)",
                  }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Badge color="#22c55e">{n.cpmGrade} CPM</Badge>
                    <span className="text-[11px] text-white/20">{n.source}</span>
                  </div>
                  <p className="text-[15px] text-white/60 font-medium leading-relaxed">{n.title}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Module B: Script (Step 3)
   ═══════════════════════════════════════════════════ */
const ScriptModule = () => {
  const store = useBlackboxStore();
  const { script, mode, setMode, isLoading, step, selectedKeyword, selectedCategory } = store;
  const { startRender } = useVideoRender();

  const sectionColors: Record<string, { bg: string; color: string; label: string }> = {
    hook: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Hook Logic" },
    body: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", label: "Body" },
    opinion: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", label: "Opinion Injector" },
  };

  const goToVideo = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    store.setStep(4);
    await startRender({
      keyword: selectedKeyword.keyword, category: selectedCategory.id,
      scriptBlocks: script.blocks.map((b: any) => ({
        section: b.section, text: b.text, duration_sec: b.durationSec, subtitle_highlight: b.subtitleHighlight
      }))
    });
  };

  return (
    <div className="animate-fadeUp">
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.04]"
        style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold text-[#09090b]"
            style={{ background: "linear-gradient(135deg, #d4af37, #c4a030)" }}>◆</div>
          <div>
            <div className="text-[10px] font-semibold tracking-[0.15em] text-[#d4af37] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 02</div>
            <h1 className="text-[22px] font-extrabold"
              style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
              모듈 B: 하이브리드 서사 엔진
            </h1>
          </div>
        </div>
        <p className="text-[12px] text-white/25 ml-12">AI 스크립트 자동 생성 · 섹션별 시간 배분 · 후킹 전략</p>
      </div>

      <div className="p-8">
        {script ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 mb-5">
              <SectionTitle>스크립트 멀티어</SectionTitle>
              <Badge>총 {script.totalDurationSec}초</Badge>
            </div>

            {script.blocks.map((b: any, i: number) => {
              const s = sectionColors[b.section] || sectionColors.body;
              return (
                <div key={i} className="rounded-2xl border border-white/[0.06] overflow-hidden animate-fadeUp"
                  style={{ animationDelay: `${i * 0.08}s`, background: "rgba(255,255,255,0.015)" }}>
                  <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.015)" }}>
                    <span className="text-[12px] px-3 py-1 rounded-lg font-bold"
                      style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    <span className="text-[12px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {b.durationSec}s
                    </span>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-[15px] text-white/60 leading-[1.85]">{b.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Controls */}
            <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.06] mt-6"
              style={{ background: "rgba(255,255,255,0.015)" }}>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-white/40">Senior Mode</span>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${mode === "senior" ? "bg-emerald-500" : "bg-white/10"}`}
                  onClick={() => setMode(mode === "senior" ? "normal" : "senior")}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                    style={{ left: mode === "senior" ? "22px" : "2px" }} />
                </div>
              </div>
              <div className="w-px h-5 bg-white/[0.06]" />
              <span className="text-[12px] text-white/30">속도: <strong className="text-white/60">{mode === "senior" ? "0.92x" : "1.0x"}</strong></span>
              <span className="text-[12px] text-white/30">자막: <strong className="text-white/60">{mode === "senior" ? "150%" : "100%"}</strong></span>
              <div className="ml-auto flex gap-4">
                <span className="text-[11px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  후킹: <span className="text-[#f59e0b]">{script.hookType}</span>
                </span>
                <span className="text-[11px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  톤: <span className="text-[#06b6d4]">{script.opinionTone}</span>
                </span>
              </div>
            </div>

            {step === 3 && (
              <button onClick={goToVideo}
                className="w-full py-4 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.05))",
                  border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e"
                }}>
                영상 편집 진행 →
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-white/10 text-[15px]">
            {isLoading ? "스크립트 생성 중..." : "뉴스를 선택하면 스크립트가 자동 생성됩니다"}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Module B2: Video (Step 4)
   ═══════════════════════════════════════════════════ */
const VideoModule = () => {
  const store = useBlackboxStore();
  const { script, selectedKeyword, selectedCategory, mode, videoJob, isLoading } = store;
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  const handleGenerate = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 95) { clearInterval(interval); return 95; } return p + Math.random() * 3 + 1; });
    }, 300);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(API + "/api/v1/video/generate-real", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: selectedKeyword.keyword, category: selectedCategory.id, mode,
          script_blocks: script.blocks.map((b: any) => ({ text: b.text, section: b.section, duration_sec: b.durationSec }))
        })
      });
      const data = await res.json();
      clearInterval(interval);
      setProgress(100);
      if (data.download_url) window.open(API + data.download_url, "_blank");
    } catch (e) { console.error(e); clearInterval(interval); } finally { setGenerating(false); }
  };

  const goToShield = async () => {
    if (!videoJob) return;
    store.setStep(5);
    await applyShield(videoJob.outputPath || "/output/video.mp4");
    if (selectedKeyword && selectedCategory) {
      await preparePublish({
        channelId: "CH001", videoPath: videoJob.outputPath || "/output/video.mp4",
        keyword: selectedKeyword.keyword, category: selectedCategory.id
      });
    }
  };

  return (
    <div className="animate-fadeUp">
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.04]"
        style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold text-[#09090b]"
            style={{ background: "linear-gradient(135deg, #d4af37, #c4a030)" }}>▶</div>
          <div>
            <div className="text-[10px] font-semibold tracking-[0.15em] text-[#d4af37] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 03</div>
            <h1 className="text-[22px] font-extrabold"
              style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
              모듈 B2: AI 영상 제작
            </h1>
          </div>
        </div>
        <p className="text-[12px] text-white/25 ml-12">Pillow + FFmpeg + ElevenLabs TTS 기반 MP4 생성</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <SectionTitle>영상 미리보기</SectionTitle>
            <div className="aspect-video rounded-2xl border border-white/[0.06] flex items-center justify-center flex-col gap-4 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a1a2e, #16162a, #0f0f23)" }}>
              <div className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl text-[#d4af37] cursor-pointer z-10"
                style={{ background: "rgba(212,175,55,0.12)", border: "2px solid rgba(212,175,55,0.25)" }}>
                ▶
              </div>
              <span className="text-[12px] text-white/20 z-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Preview available after generation
              </span>
            </div>
          </div>

          {/* Settings */}
          <div>
            <SectionTitle color="#06b6d4">영상 설정</SectionTitle>
            <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "rgba(255,255,255,0.015)" }}>
              {[
                { label: "해상도", value: "1920 × 1080 (FHD)" },
                { label: "음성 엔진", value: "ElevenLabs Korean" },
                { label: "배경 스타일", value: "NotebookLM Dark" },
                { label: "자막", value: "한국어 SRT" },
                { label: "음성 속도", value: mode === "senior" ? "0.92x" : "1.0x" },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center py-3.5 ${i < 4 ? "border-b border-white/[0.04]" : ""}`}>
                  <span className="text-[13px] text-white/40">{item.label}</span>
                  <span className="text-[13px] font-semibold text-white/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generation Bar */}
        <div className="mt-6 p-6 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold">영상 생성</h3>
              <p className="text-[12px] text-white/20 mt-1">
                {generating ? (progress >= 100 ? "생성 완료!" : "Pillow + FFmpeg + ElevenLabs TTS 처리 중...") : "준비되면 생성 버튼을 눌러주세요"}
              </p>
            </div>
            <button onClick={handleGenerate} disabled={generating && progress < 100 || !script}
              className="px-7 py-3 rounded-xl text-[14px] font-bold transition-all disabled:opacity-30"
              style={{
                background: generating && progress < 100
                  ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #d4af37, #c4a030)",
                color: generating && progress < 100 ? "rgba(255,255,255,0.3)" : "#09090b",
                cursor: generating && progress < 100 ? "not-allowed" : "pointer",
              }}>
              {progress >= 100 ? "✓ 완료" : generating ? "생성 중..." : "Generate MP4"}
            </button>
          </div>
          {generating && (
            <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded transition-all duration-300"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: progress >= 100
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : "linear-gradient(90deg, #d4af37, #f0d060)"
                }} />
            </div>
          )}
        </div>

        {videoJob && (
          <button onClick={goToShield}
            className="w-full mt-5 py-4 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.05))",
              border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b"
            }}>
            실드 분석 시작 →
          </button>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Module C+D: Shield & Deploy (Step 5)
   ═══════════════════════════════════════════════════ */
const DeployModule = () => {
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
        body: JSON.stringify({
          keyword: selectedKeyword.keyword, category: selectedCategory.id, mode,
          script_blocks: script.blocks.map((b: any) => ({ text: b.text, section: b.section, duration_sec: b.durationSec }))
        })
      });
      const data = await res.json();
      if (data.download_url) window.open(API + data.download_url, "_blank");
    } catch (e) { console.error(e); } finally { setGenerating(false); }
  };

  return (
    <div className="animate-fadeUp">
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.04]"
        style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold text-[#09090b]"
            style={{ background: "linear-gradient(135deg, #d4af37, #c4a030)" }}>◉</div>
          <div>
            <div className="text-[10px] font-semibold tracking-[0.15em] text-[#d4af37] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 04</div>
            <h1 className="text-[22px] font-extrabold"
              style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
              모듈 C+D: 실드 & 배포
            </h1>
          </div>
        </div>
        <p className="text-[12px] text-white/25 ml-12">알고리즘 보안 · Algo-Sync · SEO 최적화 · 퍼블리시</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Shield */}
          <div>
            <SectionTitle color="#22c55e">알고리즘 보안 실드</SectionTitle>

            {shield ? (
              <>
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden mb-5"
                  style={{ background: "rgba(255,255,255,0.015)" }}>
                  {shield.factors?.map((f: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 animate-fadeUp"
                      style={{
                        borderBottom: i < (shield.factors?.length || 0) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        animationDelay: `${i * 0.05}s`
                      }}>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] text-white/40">Uniqueness Check</span>
                        <span className="text-[11px] text-white/20 px-2 py-0.5 rounded bg-white/[0.03]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>[{f.name}]</span>
                      </div>
                      <Badge color="#22c55e">Safe</Badge>
                    </div>
                  ))}
                </div>

                {/* Score */}
                <div className="rounded-2xl border border-white/[0.06] p-7 text-center"
                  style={{ background: "rgba(255,255,255,0.015)" }}>
                  <div className="text-[11px] text-white/20 mb-2 tracking-[0.1em]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>수익화 안전 등급</div>
                  <div className="text-[56px] font-black leading-none"
                    style={{ fontFamily: "'Outfit', sans-serif", background: "linear-gradient(135deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {shield.safetyGrade}
                  </div>
                  <div className="text-[14px] text-emerald-400/50 mt-1">({shield.passed ? "안전" : "위험"})</div>
                  <div className="text-[36px] font-extrabold text-white/80 mt-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {Math.round(shield.safetyScore)}<span className="text-[16px] text-white/20">/100</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/10 text-[14px]">실드 분석 대기 중...</div>
            )}
          </div>

          {/* Deploy */}
          <div>
            <SectionTitle color="#f59e0b">알고리즘 동기화 배포</SectionTitle>

            {publish ? (
              <div className="space-y-5">
                {/* Algo-Sync */}
                <div className="rounded-2xl border border-white/[0.06] p-5"
                  style={{ background: "rgba(255,255,255,0.015)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold">Algo-Sync Check</span>
                    <Badge color="#22c55e">동기화 전환</Badge>
                  </div>
                  <p className="text-[11px] text-white/20 mb-4">24시간 간격 정책 점검 모듈. 동기화 시행중</p>
                  <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{
                        width: `${publish.syncProgress}%`,
                        background: "linear-gradient(90deg, #22c55e, #4ade80)",
                        boxShadow: "0 0 10px rgba(34,197,94,0.25)"
                      }} />
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-[18px] font-extrabold text-[#22c55e]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {Math.round(publish.syncProgress)}%
                    </span>
                  </div>
                </div>

                {/* SEO */}
                <div className="rounded-2xl border border-white/[0.06] p-5"
                  style={{ background: "rgba(255,255,255,0.015)" }}>
                  <h3 className="text-[14px] font-semibold mb-4">SEO 최적화</h3>
                  {publish.titles?.slice(0, 2).map((t: string, i: number) => (
                    <div key={i} className="text-[14px] text-white/50 p-3 mb-2 rounded-xl border border-white/[0.04]"
                      style={{ background: "rgba(255,255,255,0.02)" }}>
                      {i + 1}. {t}
                    </div>
                  ))}
                  {publish.hashtags && (
                    <div className="flex gap-2 flex-wrap mt-4">
                      {publish.hashtags.slice(0, 6).map((h: string, i: number) => (
                        <span key={i} className="text-[12px] px-3 py-1.5 rounded-full font-semibold"
                          style={{ background: "rgba(212,175,55,0.1)", color: "#d4af37" }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scheduling */}
                <div className="rounded-2xl border border-white/[0.06] p-5"
                  style={{ background: "rgba(255,255,255,0.015)" }}>
                  <div className="text-[13px] text-white/30 mb-1">Scheduling</div>
                  <div className="text-[14px] text-white/50">프라임 타임에 추천 사항 참고</div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-4 rounded-xl text-[15px] font-semibold text-white/40 border border-white/[0.06] hover:border-white/[0.12] transition-all"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    Publish
                  </button>
                  <button onClick={handleGenerate} disabled={generating}
                    className="py-4 rounded-xl text-[15px] font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #d4af37, #c4a030)",
                      color: "#09090b",
                      boxShadow: "0 4px 20px rgba(212,175,55,0.2)"
                    }}>
                    {generating ? "생성중..." : "Download"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/10 text-[14px]">실드 분석 후 배포가 준비됩니다</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Main Page — Renders current module based on step
   ═══════════════════════════════════════════════════ */
export default function CreatePage() {
  const store = useBlackboxStore();
  const { step, selectedNews, selectedKeyword, selectedCategory, script, isLoading } = store;
  const { generate } = useScriptGenerate();

  // Auto-generate script when news selected
  useEffect(() => {
    if (step === 3 && selectedNews && selectedKeyword && selectedCategory && !script && !isLoading) {
      generate({
        keyword: selectedKeyword.keyword,
        category: selectedCategory.id,
        newsSummary: selectedNews.summary,
        coreFacts: [selectedNews.title],
        opinionSeeds: []
      });
    }
  }, [step, selectedNews]);

  // Render the active module based on pipeline step
  const renderModule = () => {
    if (step <= 2) return <CurationModule />;
    if (step === 3) return <ScriptModule />;
    if (step === 4) return <VideoModule />;
    return <DeployModule />;
  };

  return (
    <div className="min-h-full">
      {renderModule()}

      {/* Bottom Status Bar */}
      <div className="sticky bottom-0 left-0 right-0 h-11 border-t border-white/[0.04] flex items-center px-8 gap-2"
        style={{ background: "rgba(9,9,11,0.9)", backdropFilter: "blur(12px)" }}>
        {[
          { label: "카테고리", done: step >= 1 },
          { label: "키워드", done: step >= 2 },
          { label: "소스", done: step >= 3 },
          { label: "스크립트", done: !!script },
          { label: "영상편집", done: step >= 4 },
          { label: "실드&배포", done: step >= 5 },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-all ${s.done ? "bg-[#22c55e]" : "bg-white/10"}`}
              style={s.done ? { boxShadow: "0 0 6px rgba(34,197,94,0.3)" } : {}} />
            <span className={`text-[11px] ${s.done ? "text-[#22c55e]" : "text-white/15"}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</span>
            {i < 5 && <div className={`w-6 h-px mx-1 ${s.done ? "bg-[#22c55e]/20" : "bg-white/[0.04]"}`} />}
          </div>
        ))}
        <div className="ml-auto text-[11px] text-white/15" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {isLoading && "처리 중..."}
        </div>
      </div>
    </div>
  );
}
