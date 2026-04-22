"use client";
import { useBlackboxStore } from "@/stores/blackbox-store";

const ALGO_STEPS = [
  { n: "1", label: "시그널 수집", color: "border-purple-400 text-purple-400" },
  { n: "2", label: "패턴 생성", color: "border-emerald-400 text-emerald-400" },
  { n: "3", label: "프레임 처리", color: "border-blue-400 text-blue-400" },
  { n: "4", label: "알고리즘 합성", color: "border-amber-400 text-amber-400" },
];

export default function VideoEditPanel({ onAdvance }: { onAdvance: () => void }) {
  const { videoJob, mode, selectedKeyword, script } = useBlackboxStore();
  if (!videoJob) return null;

  const isSr = mode === "senior";

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{animation:"pulse 2s ease-in-out infinite"}}/>
        <span className="text-xs font-semibold text-white/60">알고리즘 처리 완료</span>
        {isSr && (
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold ml-1">시니어 최적화 ON</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Video preview */}
        <div className="aspect-video bg-white/4 rounded-xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-2 rounded-lg bg-white/3 border border-white/8 p-2 flex flex-col">
            <div className="flex gap-1 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[9px] font-semibold mb-1.5">{selectedKeyword?.keyword}</div>
            <div className="space-y-0.5 mb-2">
              {[92, 68, 80, 55].map((w, i) => (
                <div key={i} className="h-1 bg-white/8 rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="flex-1 flex items-end gap-0.5 px-1">
              {[62, 42, 78, 52, 68, 38, 82, 48].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-500/40 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          {/* Subtitle bar */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/75 px-2 py-0.5 rounded text-white whitespace-nowrap"
            style={{ fontSize: isSr ? 11 : 9 }}
          >
            {script?.blocks[0]?.text.slice(0, 24)}...
          </div>
          {/* PiP slot */}
          <div
            className="absolute bottom-2 right-2 rounded-lg bg-white/8 border-2 border-black/50 flex flex-col items-center justify-center"
            style={{ width: isSr ? 68 : 56, height: isSr ? 68 : 56 }}
          >
            <div className="text-[8px] text-white/30">●●●</div>
          </div>
        </div>

        {/* Algo steps */}
        <div>
          {ALGO_STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-white/4 rounded-lg mb-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold border-[1.5px] ${s.color}`}>
                {s.n}
              </div>
              <span className="text-[10px] text-white/60 flex-1">{s.label}</span>
              <span className="text-[9px] text-white/25">✓</span>
            </div>
          ))}

          {/* Engine status indicators */}
          <div className="grid grid-cols-4 gap-1 mt-2">
            {[
              ["정밀도", "HIGH"],
              ["동기화", "ON"],
              ["품질", "MAX"],
              ["보정", "AUTO"],
            ].map(([label, val]) => (
              <div key={label} className="p-1.5 bg-white/4 rounded text-center">
                <div className="text-[8px] text-white/30">{label}</div>
                <div className="text-[9px] font-bold text-amber-400/80">{val}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onAdvance}
            className="w-full p-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20 hover:bg-amber-500/12 transition-colors text-left mt-2"
          >
            <div className="text-[11px] font-semibold text-amber-400">다음 단계로 →</div>
            <div className="text-[9px] text-white/30 mt-0.5">알고리즘 검증 완료</div>
          </button>
        </div>
      </div>
    </div>
  );
}
