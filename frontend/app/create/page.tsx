"use client";
import { useEffect, useState } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate, useVideoRender, useShield, usePublish } from "@/hooks/use-api";

export default function CreatePage() {
  const store = useBlackboxStore();
  const { step, setStep, mode, setMode, isLoading,
    selectedCategory, selectCategory,
    keywords,
    selectedKeyword, selectKeyword,
    newsSources,
    selectedNews, selectNews,
    script, videoJob, shield, publish } = store;
  const [generating, setGenerating] = useState(false);

  const { categories } = useCategories();
  const { generate } = useScriptGenerate();
  const { startRender } = useVideoRender();
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  useEffect(() => {
    if (step === 3 && selectedNews && selectedKeyword && selectedCategory && !script && !isLoading) {
      generate({ keyword: selectedKeyword.keyword, category: selectedCategory.id,
        newsSummary: selectedNews.summary, coreFacts: [selectedNews.title], opinionSeeds: [] });
    }
  }, [step, selectedNews]);

  const goToVideo = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    setStep(4);
    await startRender({ keyword: selectedKeyword.keyword, category: selectedCategory.id,
      scriptBlocks: script.blocks.map((b: any) => ({ section: b.section, text: b.text, duration_sec: b.durationSec, subtitle_highlight: b.subtitleHighlight })) });
  };

  const goToShield = async () => {
    if (!videoJob) return;
    setStep(5);
    await applyShield(videoJob.outputPath || "/output/video.mp4");
    if (selectedKeyword && selectedCategory) {
      await preparePublish({ channelId: "CH001", videoPath: videoJob.outputPath || "/output/video.mp4",
        keyword: selectedKeyword.keyword, category: selectedCategory.id });
    }
  };

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

  const ModuleHeader = ({ id, title }: { id: string; title: string }) => (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1f2e, #0d1117)" }}>
          <span className="text-[12px] font-black text-[#c9a84c]">PB</span>
        </div>
        <span className="text-[16px] font-bold text-white/80">{id}: {title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[14px] text-white/30">User 2026</span>
        {step >= 3 && (
          <button onClick={handleGenerate} disabled={generating || !script}
            className="text-[14px] px-4 py-1.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] font-semibold hover:bg-[#c9a84c]/30 disabled:opacity-30">
            {generating ? "생성중..." : "Create Video"}
          </button>
        )}
      </div>
    </div>
  );

  const Badge = ({ children, color = "#c9a84c" }: any) => (
    <span className="text-[13px] px-2.5 py-0.5 rounded font-bold" style={{ background: color + "20", color }}>{children}</span>
  );

  return (
    <div className="min-h-screen bg-[#080b10] text-white p-5">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1f2e, #0d1117)", border: "1px solid #c9a84c40" }}>
            <span className="text-[13px] font-black text-[#c9a84c]">PB</span>
          </div>
          <div>
            <div className="text-[15px] font-black tracking-wider text-white/90">PROJECT</div>
            <div className="text-[15px] font-black tracking-wider text-[#c9a84c]">BLACKBOX</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-[18px] font-bold text-white/80">PROJECT BLACKBOX CLIENT SaaS</div>
          <div className="text-[14px] text-white/30">고객 SaaS: 사용자 인터페이스</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-white/10 rounded overflow-hidden">
            <button onClick={() => setMode("normal")} className={`px-4 py-1.5 text-[14px] font-bold ${mode === "normal" ? "bg-[#c9a84c]/15 text-[#c9a84c]" : "text-white/30"}`}>일반</button>
            <button onClick={() => setMode("senior")} className={`px-4 py-1.5 text-[14px] font-bold ${mode === "senior" ? "bg-[#c9a84c]/15 text-[#c9a84c]" : "text-white/30"}`}>시니어</button>
          </div>
        </div>
      </div>

      {/* 4모듈 그리드 */}
      <div className="grid grid-cols-2 gap-4">

        {/* ═══ 모듈 A ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-5">
          <ModuleHeader id="모듈 A" title="지능형 큐레이션 엔진" />

          <div className="mb-4">
            <div className="text-[14px] text-white/40 mb-2">Category</div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c: any) => (
                <button key={c.id} onClick={() => selectCategory(c)}
                  className={`px-4 py-2 rounded text-[14px] font-semibold transition-all ${selectedCategory?.id === c.id ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"}`}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {step >= 1 && keywords.length > 0 && (
            <div className="mb-4">
              <div className="text-[14px] text-white/40 mb-2">Trending Blue Ocean Keywords</div>
              <div className="text-[12px] text-white/20 flex gap-4 mb-1.5 px-2">
                <span className="w-6">#</span><span className="flex-1">Keyword</span>
                <span className="w-16 text-right">BOI</span><span className="w-12 text-right">경쟁</span>
                <span className="w-16 text-right">모멘텀</span><span className="w-10 text-right">등급</span>
              </div>
              {keywords.slice(0, 5).map((k: any, i: number) => (
                <button key={i} onClick={() => selectKeyword(k)}
                  className={`w-full flex items-center gap-3 px-2 py-2.5 rounded text-[14px] transition-all ${selectedKeyword?.keyword === k.keyword ? "bg-[#2d80ff]/10 border border-[#2d80ff]/20" : "hover:bg-white/5 border border-transparent"}`}>
                  <span className="w-6 text-white/20">{i + 1}</span>
                  <span className="flex-1 text-left text-white/70 font-medium truncate">{k.keyword}</span>
                  <span className="w-16 text-right font-bold text-[#2d80ff]">{k.boiScore?.toFixed(1) || "—"}</span>
                  <span className="w-12 text-right text-white/30">{k.competitionCount || "—"}</span>
                  <span className={`w-16 text-right font-semibold ${k.momentum > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {k.momentum > 0 ? "↑" : "↓"}{Math.abs(k.momentum * 100).toFixed(0)}%
                  </span>
                  <span className={`w-10 text-right font-bold ${k.boiGrade === "A" ? "text-emerald-400" : k.boiGrade === "B" ? "text-[#c9a84c]" : "text-red-400"}`}>{k.boiGrade || "—"}</span>
                </button>
              ))}
            </div>
          )}

          {step >= 2 && newsSources.length > 0 && (
            <div>
              <div className="text-[14px] text-white/40 mb-2">Curated News Source Feed</div>
              {newsSources.slice(0, 3).map((n: any, i: number) => (
                <button key={i} onClick={() => selectNews(n)}
                  className={`w-full text-left p-3 mb-1.5 rounded transition-all ${selectedNews?.title === n.title ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20" : "bg-white/3 hover:bg-white/5 border border-transparent"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] text-white/30">{n.source}</span>
                    <Badge color="#2d80ff">{n.cpmGrade} CPM</Badge>
                  </div>
                  <div className="text-[15px] text-white/60 line-clamp-1">{n.title}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ 모듈 B ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-5">
          <ModuleHeader id="모듈 B" title="하이브리드 서사 및 제작 엔진" />

          {step >= 3 && script ? (
            <div>
              <div className="text-[14px] text-white/40 mb-2">스크립트 멀티어</div>
              <div className="space-y-2 mb-4">
                {script.blocks.map((b: any, i: number) => (
                  <div key={i} className="p-3 rounded bg-white/3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[13px] px-2 py-0.5 rounded font-bold text-white ${b.section === "hook" ? "bg-[#2d80ff]" : b.section === "opinion" ? "bg-[#e5a620]" : "bg-[#1aad6b]"}`}>
                        {b.section === "hook" ? "Hook Logic" : b.section === "opinion" ? "Opinion Injector" : "Body"}
                      </span>
                      <span className="text-[13px] text-white/20 ml-auto">{b.durationSec}s</span>
                    </div>
                    <div className="text-[14px] text-white/50 leading-relaxed line-clamp-2">{b.text}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 p-3 rounded bg-white/3 border border-white/5 mb-4">
                <span className="text-[14px] text-white/50">Senior Mode</span>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer ${mode === "senior" ? "bg-emerald-500" : "bg-white/10"}`} onClick={() => setMode(mode === "senior" ? "normal" : "senior")}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: mode === "senior" ? "22px" : "2px" }} />
                </div>
                <span className="text-[13px] text-white/30">속도: {mode === "senior" ? "0.92x" : "1.0x"}</span>
                <span className="text-[13px] text-white/30">자막: {mode === "senior" ? "150%" : "100%"}</span>
              </div>

              {step === 3 && (
                <button onClick={goToVideo} className="w-full py-3 rounded bg-[#1aad6b]/10 border border-[#1aad6b]/20 text-[#1aad6b] text-[15px] font-semibold hover:bg-[#1aad6b]/15">
                  Analyze in Module B →
                </button>
              )}

              <div className="text-[13px] text-white/20 mt-2 text-right">총 {script.totalDurationSec}초 | 후킹: {script.hookType} | 톤: {script.opinionTone}</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/10 text-[16px]">
              {step < 3 ? "뉴스를 선택하면 스크립트가 자동 생성됩니다" : isLoading ? "스크립트 생성 중..." : "대기 중..."}
            </div>
          )}
        </div>

        {/* ═══ 모듈 C ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-5">
          <ModuleHeader id="모듈 C" title="알고리즘 보안 실드" />

          {step >= 5 && shield ? (
            <div>
              <div className="flex items-center gap-8 mb-5">
                <div className="flex-1">
                  {shield.factors && shield.factors.map((f: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[14px] text-white/50">Uniqueness Check</span>
                      <span className="text-[14px] text-white/40">[{f.name}]</span>
                      <Badge color="#1aad6b">Safe</Badge>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-[14px] text-white/40 mb-2">수익화 안전 등급</div>
                  <div className="text-[72px] font-black text-emerald-400">{shield.safetyGrade}</div>
                  <div className="text-[16px] text-emerald-400/60">({shield.passed ? "안전" : "위험"})</div>
                  <div className="text-[36px] font-bold text-white/80 mt-1">{Math.round(shield.safetyScore)}<span className="text-[18px] text-white/30">/100</span></div>
                </div>
              </div>
              <div className="text-[13px] text-white/20 text-center">유튜브 AI의 재사용 콘텐츠 판독 회피 시스템 작동 중. 정책 우회 완료.</div>
            </div>
          ) : step >= 4 && videoJob ? (
            <button onClick={goToShield} className="w-full py-3 rounded bg-[#e5a620]/10 border border-[#e5a620]/20 text-[#e5a620] text-[15px] font-semibold hover:bg-[#e5a620]/15">
              실드 분석 시작 →
            </button>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/10 text-[16px]">
              영상 편집 완료 후 실드가 시작됩니다
            </div>
          )}
        </div>

        {/* ═══ 모듈 D ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-5">
          <ModuleHeader id="모듈 D" title="알고리즘 동기화 배포" />

          {step >= 5 && publish ? (
            <div>
              <div className="mb-4 p-3 rounded bg-white/3 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-semibold text-white/60">Algo-Sync Check</span>
                  <span className="text-[14px] text-white/30">동기화 전환</span>
                </div>
                <div className="text-[13px] text-white/30 mb-3">24시간 간격 정책 점검 모듈. 동기화 시행중</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded" style={{ width: `${publish.syncProgress}%` }} />
                  </div>
                  <span className="text-[15px] font-bold text-emerald-400">{Math.round(publish.syncProgress)}%</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[14px] text-white/40 mb-2">SEO</div>
                {publish.titles?.slice(0, 2).map((t: string, i: number) => (
                  <div key={i} className="text-[14px] text-white/50 p-2.5 mb-1 rounded bg-white/3">{i + 1}. {t}</div>
                ))}
                {publish.hashtags && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {publish.hashtags.slice(0, 6).map((h: string, i: number) => (
                      <span key={i} className="text-[12px] px-2 py-1 rounded bg-white/5 text-[#2d80ff]">{h}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4 p-3 rounded bg-white/3 border border-white/5">
                <div className="text-[14px] text-white/40">Scheduling</div>
                <div className="text-[14px] text-white/50">프라임 타임에 추천 사항 참고</div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded bg-white/5 text-white/40 text-[15px] font-semibold border border-white/10 hover:bg-white/10">
                  Publish
                </button>
                <button onClick={handleGenerate} disabled={generating}
                  className="flex-1 py-3 rounded bg-[#c9a84c] text-black text-[15px] font-bold hover:bg-[#d4b85c] disabled:opacity-50">
                  {generating ? "생성중..." : "Download"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/10 text-[16px]">
              실드 분석 후 배포가 준비됩니다
            </div>
          )}
        </div>
      </div>

      {/* 하단 상태바 */}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-5">
          {[
            { label: "카테고리", done: step >= 1 },
            { label: "키워드", done: step >= 2 },
            { label: "소스", done: step >= 3 },
            { label: "스크립트", done: !!script },
            { label: "영상편집", done: step >= 4 },
            { label: "실드&배포", done: step >= 5 },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${s.done ? "bg-emerald-400" : "bg-white/10"}`} />
              <span className={`text-[13px] ${s.done ? "text-emerald-400" : "text-white/20"}`}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="text-[13px] text-white/20">
          {isLoading && "처리 중..."} {generating && "영상 생성 중..."}
        </div>
      </div>
    </div>
  );
}
