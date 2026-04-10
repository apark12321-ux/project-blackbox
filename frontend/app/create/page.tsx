/**
 * /create — 영상 제작 메인 페이지
 * 6단계 파이프라인을 단계별로 렌더링합니다.
 */
"use client";
import { useEffect } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import {
  useCategories, useKeywordSearch, useNewsSearch,
  useScriptGenerate, useVideoRender, useShield, usePublish,
  useVideoPolling,
} from "@/hooks/use-api";
import StepBar from "@/components/common/StepBar";
import { CategoryPicker, KeywordList, NewsPicker } from "@/components/curation/CurationComponents";
import ScriptPanel from "@/components/script/ScriptPanel";
import VideoEditPanel from "@/components/video/VideoEditPanel";
import ShieldPublishPanel from "@/components/publish/ShieldPublishPanel";

export default function CreatePage() {
  const {
    step, setStep, mode, isLoading,
    selectedCategory, keywords, selectedKeyword,
    newsSources, selectedNews, script, videoJob, shield,
  } = useBlackboxStore();

  const { categories } = useCategories();
  const { generate: generateScript, regenerateHook, regenerateOpinion } = useScriptGenerate();
  const { startRender } = useVideoRender();
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  // Keyword search on category select
  useKeywordSearch(selectedCategory?.id || null);

  // News search on keyword select
  useNewsSearch(selectedKeyword?.keyword || null);

  // Video polling for async rendering
  useVideoPolling();
  useEffect(() => {
    if (step === 3 && selectedNews && selectedKeyword && selectedCategory && !script) {
      generateScript({
        keyword: selectedKeyword.keyword,
        category: selectedCategory.id,
        newsSummary: selectedNews.summary,
        coreFacts: [selectedNews.title],
        opinionSeeds: [],
      });
    }
  }, [step, selectedNews]);
  // ── Step transition handlers ──
  const handleNewsSelect = async () => {
    if (!selectedKeyword || !selectedNews) return;
    // Auto-generate script after news selection
    await generateScript({
      keyword: selectedKeyword.keyword,
      category: selectedCategory!.id,
      newsSummary: selectedNews.summary,
      coreFacts: [selectedNews.title],
      opinionSeeds: [],
    });
  };

  const handleScriptToVideo = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    setStep(4);
    await startRender({
      keyword: selectedKeyword.keyword,
      category: selectedCategory.id,
      scriptBlocks: script.blocks,
      coreFacts: [selectedNews?.title || ""],
      totalDuration: script.totalDurationSec,
    });
  };

  const handleVideoToShield = async () => {
    if (!videoJob) return;
    setStep(5);
    await applyShield(videoJob.outputPath, {
      hasAvatar: true,
      hasOpinion: true,
      scriptSections: script?.blocks.length,
      totalDuration: script?.totalDurationSec,
      coreFactsCount: 3,
    });
    // Auto-prepare publish
    await preparePublish({
      channelId: "CH001",
      videoPath: videoJob.outputPath,
      keyword: selectedKeyword!.keyword,
      category: selectedCategory!.id,
    });
  };

  // ── Section header helper ──
  const SectionHeader = ({ module, color, children }: { module: string; color: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-1.5 mb-2">
      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${color}`}>{module}</span>
      <span className="text-xs font-semibold text-white/60">{children}</span>
    </div>
  );

  return (
    <div>
      <StepBar />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-blue-500/20 z-50">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: "60%" }} />
        </div>
      )}

      {/* Step 0: Category */}
      {step === 0 && (
        <div className="animate-fadeUp">
          <SectionHeader module="A" color="bg-blue-500/10 text-blue-400">카테고리 초이스</SectionHeader>
          <CategoryPicker categories={categories} />
        </div>
      )}

      {/* Step 1: Keywords */}
      {step >= 1 && (
        <div className="animate-fadeUp mb-4">
          <SectionHeader module="A" color="bg-blue-500/10 text-blue-400">키워드 자동 서치</SectionHeader>
          <KeywordList keywords={keywords} />
        </div>
      )}

      {/* Step 2: News */}
      {step >= 2 && (
        <div className="animate-fadeUp mb-4">
          <SectionHeader module="A" color="bg-blue-500/10 text-blue-400">뉴스 소스 선택</SectionHeader>
          <NewsPicker news={newsSources} />
        </div>
      )}

      {/* Step 3: Script (Module B) */}
      {step >= 3 && script && (
        <div className="mb-4">
          <ScriptPanel
            onAdvance={handleScriptToVideo}
            onRegenHook={() => {
              if (selectedKeyword && selectedCategory) {
                regenerateHook(selectedKeyword.keyword, selectedCategory.id, script.hookType);
              }
            }}
            onRegenOpinion={() => {
              if (selectedKeyword) {
                regenerateOpinion(selectedKeyword.keyword, script.opinionTone);
              }
            }}
          />
        </div>
      )}

      {/* Step 4: Video Edit (Module B-2) */}
      {step >= 4 && videoJob && (
        <div className="mb-4">
          <VideoEditPanel onAdvance={handleVideoToShield} />
        </div>
      )}

      {/* Step 5: Shield & Publish (Modules C + D) */}
      {step >= 5 && shield && (
        <ShieldPublishPanel />
      )}
    </div>
  );
}
