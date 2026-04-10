/**
 * StepBar — 6단계 파이프라인 진행 표시기
 * 각 단계 옆에 모듈 라벨(A, B, B-2, C+D)을 표시합니다.
 */
"use client";
import { useBlackboxStore, type PipelineStep } from "@/stores/blackbox-store";

const STEPS = [
  { label: "카테고리", module: "A", color: "text-blue-400" },
  { label: "키워드", module: "A", color: "text-blue-400" },
  { label: "소스", module: "A", color: "text-blue-400" },
  { label: "스크립트", module: "B", color: "text-emerald-400" },
  { label: "영상편집", module: "B-2", color: "text-purple-400" },
  { label: "실드&배포", module: "C+D", color: "text-amber-400" },
];

export default function StepBar() {
  const step = useBlackboxStore((s) => s.step);

  return (
    <div className="flex gap-1 mb-3 flex-wrap">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={i} className="flex items-center gap-0.5">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs
                ${active ? "border-blue-500/50 bg-blue-500/5" : ""}
                ${done ? "border-emerald-500/30 bg-emerald-500/4" : ""}
                ${!active && !done ? "border-white/10" : ""}
              `}
            >
              <span
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-semibold
                  ${done ? "bg-emerald-500 text-white border-emerald-500" : ""}
                  ${active ? "border-blue-500 text-blue-400 border-[1.5px]" : ""}
                  ${!active && !done ? "border-white/15 text-white/30 border-[1.5px]" : ""}
                `}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={`font-medium ${active ? "text-white" : done ? "text-emerald-400" : "text-white/30"}`}>
                {s.label}
              </span>
              <span className={`text-[9px] ${done ? "text-emerald-400/60" : active ? s.color + "/60" : "text-white/20"}`}>
                {s.module}
              </span>
            </div>
            {i < 5 && <span className="text-white/20 text-[9px] mx-0.5">›</span>}
          </div>
        );
      })}
    </div>
  );
}
