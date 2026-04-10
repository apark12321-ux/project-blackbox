"use client";
import { useEffect } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";
import { useCategories, useKeywordSearch, useNewsSearch, useScriptGenerate } from "@/hooks/use-api";
import StepBar from "@/components/common/StepBar";
import { CategoryPicker, KeywordList, NewsPicker } from "@/components/curation/CurationComponents";

export default function CreatePage() {
  const {
    step, mode, isLoading,
    selectedCategory, keywords, selectedKeyword,
    newsSources, selectedNews, script,
  } = useBlackboxStore();

  const { categories } = useCategories();
  const { generate } = useScriptGenerate();

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

  return (
    <div>
      <StepBar />

      {isLoading && (
        <div className="text-center py-4 text-blue-400 text-sm">로딩 중...</div>
      )}

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

      {step >= 3 && !script && !isLoading && (
        <div className="text-center py-4 text-white/40 text-sm">스크립트 생성 대기 중...</div>
      )}

      {step >= 3 && script && (
        <div className="mb-4 p-4 border border-white/10 rounded-xl">
          <div className="text-xs font-semibold text-emerald-400 mb-3">Module B — 3단 스크립트</div>
          <div className="text-xs text-white/40 mb-2">후킹: {script.hookType} | 톤: {script.opinionTone} | {script.totalDurationSec}초</div>
          {script.blocks.map((b: any, i: number) => (
            <div key={i} className="mb-2 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  b.section === "hook" ? "bg-blue-500/20 text-blue-400" :
                  b.section === "opinion" ? "bg-amber-500/20 text-amber-400" :
                  "bg-emerald-500/20 text-emerald-400"
                }`}>{b.section}</span>
                <span className="text-[10px] text-white/30 ml-auto">{b.durationSec}s</span>
              </div>
              <div className="text-sm text-white/70 leading-relaxed">{b.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
