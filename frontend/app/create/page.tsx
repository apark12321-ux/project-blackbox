"use client";
import { useEffect, useState } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate, useVideoRender, useShield, usePublish } from "@/hooks/use-api";

/* ═══════════════════════════════════════════════════
   Shared Components
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

const PageHeader = ({ stepNum, icon, title, subtitle }: { stepNum: number; icon: string; title: string; subtitle: string }) => (
  <div className="px-8 pt-7 pb-5 border-b border-white/[0.04]"
    style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, transparent 100%)" }}>
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold text-[#09090b]"
        style={{ background: "linear-gradient(135deg, #d4af37, #c4a030)" }}>{icon}</div>
      <div>
        <div className="text-[10px] font-semibold tracking-[0.15em] text-[#d4af37] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>STEP 0{stepNum}</div>
        <h1 className="text-[22px] font-extrabold"
          style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>{title}</h1>
      </div>
    </div>
    <p className="text-[12px] text-white/25 ml-12">{subtitle}</p>
  </div>
);

const NextStepButton = ({ onClick, label, color = "#22c55e" }: { onClick: () => void; label: string; color?: string }) => (
  <button onClick={onClick}
    className="w-full py-4 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-0.5 mt-6"
    style={{
      background: `linear-gradient(135deg, ${color}18, ${color}0a)`,
      border: `1px solid ${color}30`, color
    }}>
    {label}
  </button>
);

/* ═══════════════════════════════════════════════════
   PAGE 1: 큐레이션 (카테고리 → 키워드 → 뉴스)
   ═══════════════════════════════════════════════════ */
const CurationPage = () => {
  const store = useBlackboxStore();
  const { step, selectedCategory, selectCategory, keywords, selectedKeyword, selectKeyword, newsSources, selectedNews, selectNews, setActivePage } = store;
  const { categories } = useCategories();
  const { generate } = useScriptGenerate();

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  // 뉴스 선택 후 → 스크립트 페이지로 자동 이동
  const handleSelectNews = (news: any) => {
    selectNews(news);
    // 약간의 딜레이 후 스크립트 페이지로 전환
    setTimeout(() => setActivePage("script"), 300);
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader stepNum={1} icon="◈" title="모듈 A: 지능형 큐레이션 엔진" subtitle="카테고리 선택 → 키워드 분석 → 뉴스 소스 큐레이션" />

      <div className="p-8 space-y-8">
        {/* Categories */}
        <section>
          <SectionTitle>카테고리 선택</SectionTitle>
          <div className="flex gap-2.5 flex-wrap">
            {categories.map((c: any) => (
              <button key={c.id} onClick={() => selectCategory(c)}
                className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 flex items-center gap-2"
                style={{
                  border: `1px solid ${selectedCategory?.id === c.id ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: selectedCategory?.id === c.id
                    ? "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))"
                    : "rgba(255,255,255,0.02)",
                  color: selectedCategory?.id === c.id ? "#f0d060" : "rgba(255,255,255,0.4)",
                  fontWeight: selectedCategory?.id === c.id ? 600 : 400,
                  boxShadow: selectedCategory?.id === c.id ? "0 4px 20px rgba(212,175,55,0.08)" : "none",
                }}>
                <span className="text-[17px]">{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
        </section>

        {/* Keywords */}
        {keywords.length > 0 && (
          <section className="animate-fadeUp">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-1 h-5 rounded-sm" style={{ background: "linear-gradient(180deg, #06b6d4, #0891b2)" }} />
              <h2 className="text-[17px] font-bold" style={{ fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
                Trending Blue Ocean Keywords
              </h2>
              <Badge color="#06b6d4">LIVE</Badge>
            </div>

            <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
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

        {/* News */}
        {newsSources.length > 0 && (
          <section className="animate-fadeUp">
            <SectionTitle color="#22c55e">Curated News Source Feed</SectionTitle>
            <div className="flex flex-col gap-3">
              {newsSources.slice(0, 4).map((n: any, i: number) => (
                <button key={i} onClick={() => handleSelectNews(n)}
                  className="w-full text-left p-5 rounded-2xl transition-all duration-200"
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
   PAGE 2: 스크립트
   ═══════════════════════════════════════════════════ */
const ScriptPage = () => {
  const store = useBlackboxStore();
  const { script, mode, setMode, isLoading, selectedKeyword, selectedCategory, selectedNews, step, setActivePage } = store;
  const { generate } = useScriptGenerate();
  const { startRender } = useVideoRender();

  // 이 페이지 진입 시 스크립트 자동 생성
  useEffect(() => {
    if (selectedNews && selectedKeyword && selectedCategory && !script && !isLoading) {
      generate({
        keyword: selectedKeyword.keyword,
        category: selectedCategory.id,
        newsSummary: selectedNews.summary,
        coreFacts: [selectedNews.title],
        opinionSeeds: []
      });
    }
  }, [selectedNews]);

  const sectionColors: Record<string, { bg: string; color: string; label: string }> = {
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
      scriptBlocks: script.blocks.map((b: any) => ({
        section: b.section, text: b.text, duration_sec: b.durationSec, subtitle_highlight: b.subtitleHighlight
      }))
    });
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader stepNum={2} icon="◆" title="모듈 B: 하이브리드 서사 엔진" subtitle="AI 스크립트 자동 생성 · 섹션별 시간 배분 · 후킹 전략" />

      <div className="p-8">
        {script ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
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
            <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.06] mt-4"
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

            <NextStepButton onClick={goToVideo} label="영상 편집 진행 →" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="text-white/10 text-[15px]">
              {isLoading ? "스크립트 생성 중..." : "큐레이션에서 뉴스를 선택해주세요"}
            </div>
            {!isLoading && !selectedNews && (
              <button onClick={() => setActivePage("curation")}
                className="text-[13px] text-[#d4af37] hover:underline">
                ← 큐레이션으로 돌아가기
              </button>
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
  const { script, selectedKeyword, selectedCategory, mode, videoJob, setActivePage } = store;
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  const goToShield = async () => {
    if (!videoJob) return;
    store.setStep(5);
    setActivePage("deploy");
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
      <PageHeader stepNum={3} icon="▶" title="모듈 B2: AI 영상 제작" subtitle="Pillow + FFmpeg + ElevenLabs TTS 기반 MP4 생성" />

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
                style={{ background: "rgba(212,175,55,0.12)", border: "2px solid rgba(212,175,55,0.25)" }}>▶</div>
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

        {/* Render Status */}
        <div className="mt-6 p-6 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold">영상 편집 결과</h3>
              <p className="text-[12px] text-white/20 mt-1">
                {videoJob ? "영상 편집이 완료되었습니다" : "영상 편집 처리 중..."}
              </p>
            </div>
            {videoJob && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 8px rgba(34,197,94,0.4)" }} />
                <span className="text-[13px] text-[#22c55e] font-semibold">완료</span>
              </div>
            )}
          </div>
        </div>

        {videoJob && (
          <NextStepButton onClick={goToShield} label="실드 분석 & 배포 준비 →" color="#f59e0b" />
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PAGE 4: 실드 & 배포 (최종 — Create Video 버튼)
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
      <PageHeader stepNum={4} icon="◉" title="모듈 C+D: 실드 & 배포" subtitle="알고리즘 보안 · Algo-Sync · SEO 최적화 · 퍼블리시" />

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
              <div className="flex items-center justify-center h-48 text-white/10 text-[14px]">실드 분석 처리 중...</div>
            )}
          </div>

          {/* Deploy */}
          <div>
            <SectionTitle color="#f59e0b">알고리즘 동기화 배포</SectionTitle>
            {publish ? (
              <div className="space-y-5">
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

                <div className="rounded-2xl border border-white/[0.06] p-5"
                  style={{ background: "rgba(255,255,255,0.015)" }}>
                  <div className="text-[13px] text-white/30 mb-1">Scheduling</div>
                  <div className="text-[14px] text-white/50">프라임 타임에 추천 사항 참고</div>
                </div>

                {/* ★ Create Video — 최종 페이지에만 */}
                <div className="grid grid-cols-2 gap-3 pt-2">
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
                    {generating ? "생성중..." : "Create Video & Download"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/10 text-[14px]">배포 정보 준비 중...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN — activePage로 페이지 전환 (step과 독립)
   ═══════════════════════════════════════════════════ */
export default function CreatePage() {
  const { activePage, step, script, isLoading } = useBlackboxStore();

  // ★ activePage에 따라 딱 1개 페이지만 보여줌
  const renderPage = () => {
    switch (activePage) {
      case "curation": return <CurationPage />;
      case "script": return <ScriptPage />;
      case "video": return <VideoPage />;
      case "deploy": return <DeployPage />;
      default: return <CurationPage />;
    }
  };

  return (
    <div className="min-h-full">
      {renderPage()}

      {/* Bottom Status Bar */}
      <div className="sticky bottom-0 left-0 right-0 h-11 border-t border-white/[0.04] flex items-center px-8 gap-2"
        style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(12px)" }}>
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
