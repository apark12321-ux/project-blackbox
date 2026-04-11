"use client";
import { useEffect, useState } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate, useVideoRender, useShield, usePublish } from "@/hooks/use-api";

export default function CreatePage() {
  const store = useBlackboxStore();
  const { step, setStep, mode, setMode, isLoading, selectedCategory, setSelectedCategory,
    keywords, setKeywords, selectedKeyword, setSelectedKeyword,
    newsSources, selectedNews, setSelectedNews,
    script, videoJob, shield, publish } = store;
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const { categories } = useCategories();
  const { generate } = useScriptGenerate();
  const { startRender } = useVideoRender();
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  // Auto script
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
      if (data.download_url) { setDownloadUrl(API + data.download_url); window.open(API + data.download_url, "_blank"); }
    } catch (e) { console.error(e); } finally { setGenerating(false); }
  };

  const ModuleHeader = ({ id, title, color }: { id: string; title: string; color: string }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1f2e, #0d1117)" }}>
          <span className="text-base font-black text-[#c9a84c]">PB</span>
        </div>
        <span className="text-base font-bold text-white/80">{id}: {title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base text-white/30">User 2026</span>
        {step >= 3 && (
          <button onClick={handleGenerate} disabled={generating || !script}
            className="text-base px-3 py-2 rounded bg-[#c9a84c]/20 text-[#c9a84c] font-semibold hover:bg-[#c9a84c]/30 disabled:opacity-30">
            {generating ? "생성중..." : "Create Video"}
          </button>
        )}
      </div>
    </div>
  );

  const Badge = ({ children, color = "#c9a84c" }: any) => (
    <span className="text-base px-2 py-0.5 rounded font-bold" style={{ background: color + "20", color }}>{children}</span>
  );

  return (
    <div className="min-h-screen bg-[#080b10] text-white p-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1f2e, #0d1117)", border: "1px solid #c9a84c40" }}>
              <span className="text-base font-black text-[#c9a84c]">PB</span>
            </div>
            <div>
              <div className="text-base font-black tracking-wider text-white/90">PROJECT</div>
              <div className="text-base font-black tracking-wider text-[#c9a84c]">BLACKBOX</div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white/80">PROJECT BLACKBOX CLIENT SaaS</div>
          <div className="text-base text-white/30">고객 SaaS: 사용자 인터페이스</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-white/10 rounded overflow-hidden">
            <button onClick={() => setMode("normal")} className={`px-3 py-2 text-base font-bold ${mode === "normal" ? "bg-[#c9a84c]/15 text-[#c9a84c]" : "text-white/30"}`}>일반</button>
            <button onClick={() => setMode("senior")} className={`px-3 py-2 text-base font-bold ${mode === "senior" ? "bg-[#c9a84c]/15 text-[#c9a84c]" : "text-white/30"}`}>시니어</button>
          </div>
        </div>
      </div>

      {/* 4모듈 그리드 */}
      <div className="grid grid-cols-2 gap-4">

        {/* ═══ 모듈 A: 지능형 큐레이션 ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-6">
          <ModuleHeader id="모듈 A" title="지능형 큐레이션 엔진" color="#2d80ff" />

          {/* 카테고리 */}
          <div className="mb-4">
            <div className="text-base text-white/40 mb-2">Category</div>
            <div className="flex gap-4 flex-wrap">
              {categories.map((c: any) => (
                <button key={c.id} onClick={() => { setSelectedCategory(c); setStep(1); }}
                  className={`px-4 py-2 rounded text-base font-semibold transition-all ${selectedCategory?.id === c.id ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"}`}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* 키워드 */}
          {step >= 1 && keywords.length > 0 && (
            <div className="mb-4">
              <div className="text-base text-white/40 mb-2">Trending Blue Ocean Keywords</div>
              <div className="text-sm text-white/20 flex gap-6 mb-1 px-1">
                <span className="w-4">#</span><span className="flex-1">Keyword</span>
                <span className="w-14 text-right">BOI</span><span className="w-10 text-right">경쟁</span>
                <span className="w-14 text-right">모멘텀</span><span className="w-8 text-right">등급</span>
              </div>
              {keywords.slice(0, 5).map((k: any, i: number) => (
                <button key={i} onClick={() => { setSelectedKeyword(k); setStep(2); }}
                  className={`w-full flex items-center gap-4 px-1 py-2.5 rounded text-base transition-all ${selectedKeyword?.keyword === k.keyword ? "bg-[#2d80ff]/10 border border-[#2d80ff]/20" : "hover:bg-white/5 border border-transparent"}`}>
                  <span className="w-4 text-white/20">{i + 1}</span>
                  <span className="flex-1 text-left text-white/70 font-medium truncate">{k.keyword}</span>
                  <span className="w-14 text-right font-bold text-[#2d80ff]">{k.boiScore?.toFixed(1) || "—"}</span>
                  <span className="w-10 text-right text-white/30">{k.competitionCount || "—"}</span>
                  <span className={`w-14 text-right font-semibold ${k.momentum > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {k.momentum > 0 ? "↑" : "↓"}{Math.abs(k.momentum * 100).toFixed(0)}%
                  </span>
                  <span className={`w-8 text-right font-bold ${k.boiGrade === "A" ? "text-emerald-400" : k.boiGrade === "B" ? "text-[#c9a84c]" : "text-red-400"}`}>{k.boiGrade || "—"}</span>
                </button>
              ))}
            </div>
          )}

          {/* 뉴스 */}
          {step >= 2 && newsSources.length > 0 && (
            <div>
              <div className="text-base text-white/40 mb-2">Curated News Source Feed</div>
              {newsSources.slice(0, 3).map((n: any, i: number) => (
                <button key={i} onClick={() => { setSelectedNews(n); setStep(3); }}
                  className={`w-full text-left p-3 mb-1 rounded transition-all ${selectedNews?.title === n.title ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20" : "bg-white/3 hover:bg-white/5 border border-transparent"}`}>
                  <div className="flex items-center gap-4 mb-0.5">
                    <span className="text-sm text-white/30">{n.source}</span>
                    <Badge color="#2d80ff">{n.cpmGrade} CPM</Badge>
                  </div>
                  <div className="text-base text-white/60 line-clamp-1">{n.title}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ 모듈 B: 하이브리드 서사 ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-6">
          <ModuleHeader id="모듈 B" title="하이브리드 서사 및 제작 엔진" color="#1aad6b" />

          {step >= 3 && script ? (
            <div>
              {/* 스크립트 블록 */}
              <div className="text-base text-white/40 mb-2">스크립트 멀티어</div>
              <div className="space-y-1.5 mb-4">
                {script.blocks.map((b: any, i: number) => (
                  <div key={i} className="p-3 rounded bg-white/3 border border-white/5">
                    <div className="flex items-center gap-4 mb-1">
                      <span className={`text-sm px-3 py-0.5 rounded font-bold text-white ${b.section === "hook" ? "bg-[#2d80ff]" : b.section === "opinion" ? "bg-[#e5a620]" : "bg-[#1aad6b]"}`}>
                        {b.section === "hook" ? "Hook Logic" : b.section === "opinion" ? "Opinion Injector" : "Body"}
                      </span>
                      <span className="text-sm text-white/20 ml-auto">{b.durationSec}s</span>
                    </div>
                    <div className="text-base text-white/50 leading-relaxed line-clamp-2">{b.text}</div>
                  </div>
                ))}
              </div>

              {/* Senior Mode */}
              <div className="flex items-center gap-4 p-3 rounded bg-white/3 border border-white/5 mb-4">
                <span className="text-base text-white/50">Senior Mode</span>
                <div className={`w-8 h-4 rounded-full relative cursor-pointer ${mode === "senior" ? "bg-emerald-500" : "bg-white/10"}`} onClick={() => setMode(mode === "senior" ? "normal" : "senior")}>
                  <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${mode === "senior" ? "left-4.5" : "left-0.5"}`} style={{ left: mode === "senior" ? "18px" : "2px" }} />
                </div>
                <span className="text-sm text-white/30">속도: {mode === "senior" ? "0.92x" : "1.0x"}</span>
                <span className="text-sm text-white/30">자막: {mode === "senior" ? "150%" : "100%"}</span>
              </div>

              {step === 3 && (
                <button onClick={goToVideo} className="w-full py-2 rounded bg-[#1aad6b]/10 border border-[#1aad6b]/20 text-[#1aad6b] text-base font-semibold hover:bg-[#1aad6b]/15">
                  Analyze in Module B →
                </button>
              )}

              {/* 총 시간 */}
              <div className="text-sm text-white/20 mt-2 text-right">총 {script.totalDurationSec}초 | 후킹: {script.hookType} | 톤: {script.opinionTone}</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/10 text-base">
              {step < 3 ? "뉴스를 선택하면 스크립트가 자동 생성됩니다" : isLoading ? "스크립트 생성 중..." : "대기 중..."}
            </div>
          )}
        </div>

        {/* ═══ 모듈 C: 알고리즘 보안 실드 ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-6">
          <ModuleHeader id="모듈 C" title="알고리즘 보안 실드" color="#e5a620" />

          {step >= 5 && shield ? (
            <div>
              {/* Safety Score 게이지 */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex-1">
                  {/* Uniqueness Checks */}
                  {shield.factors && shield.factors.map((f: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-base text-white/50">Uniqueness Check</span>
                      <span className="text-base text-white/40">[{f.name}]</span>
                      <Badge color="#1aad6b">Safe</Badge>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-base text-white/40 mb-1">수익화 안전 등급</div>
                  <div className="text-6xl font-black text-emerald-400">{shield.safetyGrade}</div>
                  <div className="text-base text-emerald-400/60">({shield.passed ? "안전" : "위험"})</div>
                  <div className="text-4xl font-bold text-white/80 mt-1">{Math.round(shield.safetyScore)}<span className="text-sm text-white/30">/100</span></div>
                </div>
              </div>
              <div className="text-sm text-white/20 text-center">유튜브 AI의 재사용 콘텐츠 판독 회피 시스템 작동 중. 정책 우회 완료.</div>
            </div>
          ) : step >= 4 && videoJob ? (
            <button onClick={goToShield} className="w-full py-2 rounded bg-[#e5a620]/10 border border-[#e5a620]/20 text-[#e5a620] text-base font-semibold hover:bg-[#e5a620]/15">
              실드 분석 시작 →
            </button>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/10 text-base">
              영상 편집 완료 후 실드가 시작됩니다
            </div>
          )}
        </div>

        {/* ═══ 모듈 D: 알고리즘 동기화 배포 ═══ */}
        <div className="rounded-xl border border-white/5 bg-[#0c1018] p-6">
          <ModuleHeader id="모듈 D" title="알고리즘 동기화 배포" color="#2d80ff" />

          {step >= 5 && publish ? (
            <div>
              {/* Algo-Sync */}
              <div className="mb-4 p-3 rounded bg-white/3 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-semibold text-white/60">Algo-Sync Check</span>
                  <span className="text-base text-white/30">동기화 전환</span>
                </div>
                <div className="text-sm text-white/30 mb-2">24시간 간격 정책 점검 모듈. 24시간 간격형 동기화 돌려서 전략적 강형으로 시행중</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/5 rounded overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded" style={{ width: `${publish.syncProgress}%` }} />
                  </div>
                  <span className="text-base font-bold text-emerald-400">{Math.round(publish.syncProgress)}%</span>
                </div>
              </div>

              {/* SEO */}
              <div className="mb-4">
                <div className="text-base text-white/40 mb-1">SEO</div>
                {publish.titles?.slice(0, 2).map((t: string, i: number) => (
                  <div key={i} className="text-base text-white/50 p-2 mb-0.5 rounded bg-white/3">{i + 1}. {t}</div>
                ))}
                {publish.hashtags && (
                  <div className="flex gap-1 flex-wrap mt-1">
                    {publish.hashtags.slice(0, 6).map((h: string, i: number) => (
                      <span key={i} className="text-sm px-3 py-0.5 rounded bg-white/5 text-[#2d80ff]">{h}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* 스케줄 */}
              <div className="mb-4 p-3 rounded bg-white/3 border border-white/5">
                <div className="text-base text-white/40">Scheduling</div>
                <div className="text-base text-white/50">프라임 타임에 추천 사항에 참고</div>
              </div>

              {/* 강제 출력 모드 */}
              {!publish.syncStatus?.includes("sync") && (
                <div className="p-3 rounded border border-red-500/20 bg-red-500/5 mb-4">
                  <div className="text-base font-bold text-red-400">강제 출력 모드 (예외 처리)</div>
                  <div className="text-sm text-red-400/60">정책 위반: 자동 업로드 차단 (24시간 미만)</div>
                  <div className="text-sm text-red-400/60">유니크한 영상 로컬 다운로드만 가능</div>
                </div>
              )}

              {/* Publish & Download */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded bg-white/5 text-white/40 text-base font-semibold border border-white/10 hover:bg-white/10">
                  Publish
                </button>
                <button onClick={handleGenerate} disabled={generating}
                  className="flex-1 py-2 rounded bg-[#c9a84c] text-black text-base font-bold hover:bg-[#d4b85c] disabled:opacity-50">
                  {generating ? "생성중..." : "Download"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/10 text-base">
              실드 분석 후 배포가 준비됩니다
            </div>
          )}
        </div>

      </div>

      {/* 하단 상태바 */}
      <div className="mt-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          {[
            { label: "카테고리", done: step >= 1, module: "A" },
            { label: "키워드", done: step >= 2, module: "A" },
            { label: "소스", done: step >= 3, module: "A" },
            { label: "스크립트", done: !!script, module: "B" },
            { label: "영상편집", done: step >= 4, module: "B-2" },
            { label: "실드&배포", done: step >= 5, module: "C+D" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${s.done ? "bg-emerald-400" : "bg-white/10"}`} />
              <span className={`text-sm ${s.done ? "text-emerald-400" : "text-white/20"}`}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-white/20">
          {isLoading && "처리 중..."} {generating && "영상 생성 중..."}
        </div>
      </div>
    </div>
  );
}
