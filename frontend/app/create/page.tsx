"use client";
import { useEffect } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate, useVideoRender, useShield, usePublish } from "@/hooks/use-api";
import StepBar from "@/components/common/StepBar";
import { CategoryPicker, KeywordList, NewsPicker } from "@/components/curation/CurationComponents";

export default function CreatePage() {
  const store = useBlackboxStore();
  const { step, setStep, isLoading, selectedCategory, keywords, selectedKeyword, newsSources, selectedNews, script, videoJob, shield, publish } = store;

  const { categories } = useCategories();
  const { generate } = useScriptGenerate();
  const { startRender } = useVideoRender();
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  useEffect(() => {
    if (step === 3 && selectedNews && selectedKeyword && selectedCategory && !script && !isLoading) {
      generate({
        keyword: selectedKeyword.keyword,
        category: selectedCategory.id,
        newsSummary: selectedNews.summary,
        coreFacts: [selectedNews.title],
        opinionSeeds: [],
      });
    }
  }, [step, selectedNews]);

  const goToVideo = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    setStep(4);
    await startRender({
      keyword: selectedKeyword.keyword,
      category: selectedCategory.id,
      scriptBlocks: script.blocks.map((b: any) => ({ section: b.section, text: b.text, duration_sec: b.durationSec, subtitle_highlight: b.subtitleHighlight })),
    });
  };

  const goToShield = async () => {
    if (!videoJob) return;
    setStep(5);
    await applyShield(videoJob.outputPath || "/output/video.mp4");
    if (selectedKeyword && selectedCategory) {
      await preparePublish({
        channelId: "CH001",
        videoPath: videoJob.outputPath || "/output/video.mp4",
        keyword: selectedKeyword.keyword,
        category: selectedCategory.id,
      });
    }
  };

  return (
    <div>
      <StepBar />
      {isLoading && <div className="text-center py-3 text-blue-400 text-sm animate-pulse">처리 중...</div>}

      {step === 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-white/60 mb-2">카테고리를 선택하세요</div>
          <CategoryPicker categories={categories} />
        </div>
      )}

      {step >= 1 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-white/60 mb-2">키워드를 선택하세요</div>
          <KeywordList keywords={keywords} />
        </div>
      )}

      {step >= 2 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-white/60 mb-2">뉴스를 선택하세요</div>
          <NewsPicker news={newsSources} />
        </div>
      )}

      {step >= 3 && script && (
        <div className="mb-4 p-4 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">B</span>
            <span className="text-xs font-semibold text-white/60">3단 스크립트</span>
            <span className="text-[10px] text-white/30 ml-auto">{script.totalDurationSec}초</span>
          </div>
          <div className="text-xs text-white/40 mb-3">후킹: {script.hookType} | 톤: {script.opinionTone}</div>
          {script.blocks.map((b: any, i: number) => (
            <div key={i} className="mb-2 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${b.section === "hook" ? "bg-blue-500/20 text-blue-400" : b.section === "opinion" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>{b.section}</span>
                <span className="text-[10px] text-white/30 ml-auto">{b.durationSec}s</span>
              </div>
              <div className="text-sm text-white/70 leading-relaxed">{b.text}</div>
            </div>
          ))}
          {step === 3 && (
            <button onClick={goToVideo} className="mt-3 w-full p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/15 text-left">
              <div className="text-sm font-semibold text-purple-400">다음: Module B-2 영상 편집 →</div>
              <div className="text-[10px] text-white/30 mt-0.5">TTS + 아바타 + FFmpeg 합성</div>
            </button>
          )}
        </div>
      )}

      {step >= 4 && videoJob && (
        <div className="mb-4 p-4 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">B-2</span>
            <span className="text-xs font-semibold text-white/60">영상 편집 완료</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 bg-white/5 rounded-lg"><div className="text-[10px] text-white/30">상태</div><div className="text-sm font-semibold text-emerald-400">{videoJob.status}</div></div>
            <div className="p-3 bg-white/5 rounded-lg"><div className="text-[10px] text-white/30">아바타</div><div className="text-sm font-semibold">{videoJob.avatarName || "자동 선택"}</div></div>
            <div className="p-3 bg-white/5 rounded-lg"><div className="text-[10px] text-white/30">레이아웃</div><div className="text-sm font-semibold">{videoJob.layoutChart || "NotebookLM"}</div></div>
            <div className="p-3 bg-white/5 rounded-lg"><div className="text-[10px] text-white/30">출력</div><div className="text-sm font-semibold text-blue-400 truncate">{videoJob.outputPath || "생성됨"}</div></div>
          </div>
          {step === 4 && (
            <button onClick={goToShield} className="w-full p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 text-left">
              <div className="text-sm font-semibold text-amber-400">다음: Module C+D 실드 & 배포 →</div>
              <div className="text-[10px] text-white/30 mt-0.5">3중 변주 + Safety Score + Algo-Sync</div>
            </button>
          )}
        </div>
      )}

      {step >= 5 && shield && (
        <div className="mb-4 p-4 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">C+D</span>
            <span className="text-xs font-semibold text-white/60">실드 & 배포</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 mb-3">
            <span className="text-3xl font-bold text-emerald-400">{Math.round(shield.safetyScore)}</span>
            <span className="text-lg font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">{shield.safetyGrade}</span>
            <div className="ml-2"><div className="text-sm text-emerald-400">{shield.passed ? "수익화 안전 기준 통과" : "기준 미달"}</div></div>
          </div>
          {shield.factors && shield.factors.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mb-3">
              {shield.factors.map((f: any, i: number) => (
                <div key={i} className="p-2 bg-white/5 rounded text-center">
                  <div className="text-[9px] text-white/30">{f.name}</div>
                  <div className="text-sm font-semibold text-emerald-400">{Math.round(f.score)}</div>
                </div>
              ))}
            </div>
          )}
          {publish && (
            <div>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-emerald-400">Algo-Sync {publish.syncStatus}</span>
                  <span className="text-sm font-semibold text-emerald-400">{Math.round(publish.syncProgress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded overflow-hidden"><div className="h-full bg-emerald-400 rounded" style={{width: `${publish.syncProgress}%`}} /></div>
              </div>
              {publish.titles && publish.titles.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-white/50 mb-1">CTR 제목</div>
                  {publish.titles.slice(0, 3).map((t: string, i: number) => (
                    <div key={i} className="p-2 mb-1 rounded border border-white/10 text-sm text-white/70">{i + 1}. {t}</div>
                  ))}
                </div>
              )}
              {publish.hashtags && publish.hashtags.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {publish.hashtags.map((h: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-blue-400">{h}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={async () => { if(!script || !selectedKeyword) return; const API = process.env.NEXT_PUBLIC_API_URL || ''; const res = await fetch(API + '/api/v1/video/generate-real', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ keyword: selectedKeyword.keyword, category: selectedCategory?.id, mode, script_blocks: script.blocks.map((b:any) => ({text:b.text, section:b.section, duration_sec:b.durationSec})) }) }); const data = await res.json(); if(data.download_url) window.open(API + data.download_url, '_blank'); }} className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold">영상 생성 & 다운로드</button>
                <button onClick={() => { if(videoJob) window.open(process.env.NEXT_PUBLIC_API_URL + '/api/v1/video/download/' + videoJob.jobId, '_blank') }} className="py-3 px-5 rounded-lg border border-white/15 text-white/60 text-sm hover:bg-white/5">MP4 다운로드</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
