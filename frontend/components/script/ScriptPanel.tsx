/**
 * Module B UI — 3단 스크립트 표시 + 재생성 버튼
 */
"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";

const TAG_COLORS: Record<string, string> = {
  hook: "bg-blue-500/15 text-blue-400",
  body: "bg-emerald-500/15 text-emerald-400",
  opinion: "bg-amber-500/15 text-amber-400",
};

const TAG_LABELS: Record<string, string> = {
  hook: "5초 후킹",
  body: "팩트 본문",
  opinion: "Opinion Injector",
};

export default function ScriptPanel({
  onAdvance,
  onRegenHook,
  onRegenOpinion,
}: {
  onAdvance: () => void;
  onRegenHook?: () => void;
  onRegenOpinion?: () => void;
}) {
  const script = useBlackboxStore((s) => s.script);
  if (!script) return null;

  const totalSec = script.totalDurationSec;

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">B</span>
        <span className="text-xs font-semibold text-white/60">3단 스크립트 생성</span>
        <span className="text-[10px] text-white/30 ml-auto">{Math.round(totalSec)}초</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Script blocks */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          {script.blocks.map((b, i) => (
            <div key={i} className="px-3 py-2.5 border-b border-white/8 last:border-b-0 hover:bg-white/3 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[b.section]}`}>
                  {TAG_LABELS[b.section]}
                </span>
                <span className="text-[9px] text-white/25 ml-auto font-mono">{b.durationSec.toFixed(1)}s</span>
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        {/* Side info */}
        <div className="space-y-1.5">
          <div className="p-2.5 bg-white/4 rounded-lg">
            <div className="text-[9px] text-white/30 font-medium mb-1">후킹 전략</div>
            <div className="text-[11px] font-medium text-blue-400">{script.hookType}</div>
            <div className="text-[9px] text-white/25 mt-0.5">카테고리 최적 전략 자동 선택</div>
            {onRegenHook && (
              <button onClick={onRegenHook} className="text-[10px] text-blue-400/60 hover:text-blue-400 mt-1">↻ 재생성</button>
            )}
          </div>

          <div className="p-2.5 bg-white/4 rounded-lg">
            <div className="text-[9px] text-white/30 font-medium mb-1">Opinion 톤</div>
            <div className="text-[11px] font-medium text-amber-400">{script.opinionTone}</div>
            <div className="text-[9px] text-white/25 mt-0.5">최근 2회 사용 톤 회피</div>
            {onRegenOpinion && (
              <button onClick={onRegenOpinion} className="text-[10px] text-amber-400/60 hover:text-amber-400 mt-1">↻ 재생성</button>
            )}
          </div>

          <div className="p-2.5 bg-white/4 rounded-lg">
            <div className="text-[9px] text-white/30 font-medium mb-1">비정형성</div>
            <div className="text-[10px] text-white/50 leading-relaxed">
              인트로/아웃트로 매번 다른 문구
            </div>
          </div>

          <button
            onClick={onAdvance}
            className="w-full p-2.5 rounded-lg bg-purple-500/8 border border-purple-500/20 hover:bg-purple-500/12 transition-colors text-left"
          >
            <div className="text-[11px] font-semibold text-purple-400">다음: Module B-2 영상 편집 →</div>
            <div className="text-[9px] text-white/30 mt-0.5">script_blocks → TTS → Avatar → FFmpeg</div>
          </button>
        </div>
      </div>
    </div>
  );
}
