"use client";
import { useEffect } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import {
  useCategories, useKeywordSearch, useNewsSearch,
  useScriptGenerate, useVideoRender, useShield, usePublish,
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
  const { generate: generateScript } = useScriptGenerate();
  const { startRender } = useVideoRender();
  const { applyShield } = useShield();
  const { preparePublish } = usePublish();

  useKeywordSearch(selectedCategory?.id || null);
  useNewsSearch(selectedKeyword?.keyword || null);

  // Auto-generate script when news is selected
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

  const handleScriptToVideo = async () => {
    if (!script || !selectedKeyword || !selectedCategory) return;
    setStep(4);
    await startRender({
      keyword: selectedKeyword.keyword,
      category: selectedCategory.id,
      scriptBlocks: script.blocks,
    });
  };

  const handleVideoToShield = async () => {
    if (!videoJob) return;
    setStep(5);
    await applyShield(videoJob.outputPath);
    await preparePublish({
      channelId: "CH001",
      videoPath: videoJob.outputPath,
      keyword: selectedKeyword!.keyword,
      category: selectedCategory!.id,
    });
  };

  const SectionHeader = ({ module, color, children }: any) => (
    <div className="flex items-center gap-1.5 mb-2">
      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${color}`}>{module}</span>
      <span className="text-xs font-semibold text-white/60">{children}</span>
    </div>
  );

  return (
    <div>
      <StepBar />

      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-blue-500/20 z-50">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: "60%" }} />
        </div>
      )}

      {step === 0 && (
        <div>
          <SectionHeader module="A" color="bg-blue-500/10 text-blue-400">카테고리 초이스</SectionHeader>
          <CategoryPicker categories={categories} />
        </div>
      )}

      {step >= 1 && (
        <div className="mb-4">
          <SectionHeader module="A" color="bg-blue-500/10 text-blue-400">키워드 자동 서치</SectionHeader>
          <KeywordList keywords={keywords} />
        </div>
      )}

      {step >= 2 && (
        <div className="mb-4">
          <SectionHeader module="A" color="bg-blue-500/10 text-blue-400">뉴스 소스 선택</SectionHeader>
          <NewsPicker news={newsSources} />
        </div>
      )}

      {step >= 3 && !script && isLoading && (
        <div className="text-center py-8 text-white/40">
          스크립트 생성 중...
        </div>
      )}

      {step >= 3 && script && (
        <div className="mb-4">
          <ScriptPanel onAdvance={handleScriptToVideo} />
        </div>
      )}

      {step >= 4 && videoJob && (
        <div className="mb-4">
          <VideoEditPanel onAdvance={handleVideoToShield} />
        </div>
      )}

      {step >= 5 && shield && (
        <ShieldPublishPanel />
      )}
    </div>
  );
}
