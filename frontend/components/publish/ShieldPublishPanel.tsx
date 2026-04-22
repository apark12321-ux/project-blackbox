/**
 * Modules C+D UI — Safety Score, Algo-Sync, SEO, 업로드 버튼
 */
"use client";
import { useState } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";

export default function ShieldPublishPanel() {
  const { shield, publish } = useBlackboxStore();
  const [selTitle, setSelTitle] = useState(0);

  if (!shield || !publish) return null;

  const synced = publish.syncStatus === "synced";

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">C+D</span>
        <span className="text-xs font-semibold text-white/60">실드 & Algo-Sync 배포</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left: Safety Score */}
        <div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/8 mb-2">
            <span className="text-3xl font-bold text-emerald-400">{Math.round(shield.safetyScore)}</span>
            <span className="text-lg font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">{shield.safetyGrade}</span>
            <div className="ml-1">
              <div className="text-[11px] font-medium text-emerald-400">
                {shield.passed ? "수익화 안전 기준 통과" : "기준 미달"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {shield.factors.map((f) => (
              <div key={f.name} className="p-1.5 bg-white/4 rounded text-center">
                <div className="text-[8px] text-white/30 mb-0.5">{f.name.slice(0, 4)}</div>
                <div className="text-sm font-semibold text-emerald-400">{Math.round(f.score)}</div>
                <div className="h-0.5 bg-white/8 rounded mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded" style={{ width: `${f.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Algo-Sync + Schedule + Thumbnails */}
        <div>
          <div className={`p-3 rounded-xl border mb-2 ${synced ? "border-emerald-500/30 bg-emerald-500/4" : "border-red-500/30 bg-red-500/4"}`}>
            <div className="flex justify-between mb-1">
              <span className={`text-[11px] font-semibold ${synced ? "text-emerald-400" : "text-red-400"}`}>
                {synced ? "Algo-Sync 완료" : "세이프가드 활성"}
              </span>
              <span className={`text-[11px] font-semibold ${synced ? "text-emerald-400" : "text-red-400"}`}>
                {Math.round(publish.syncProgress)}%
              </span>
            </div>
            <div className="h-2 bg-white/8 rounded overflow-hidden mb-1.5">
              <div
                className={`h-full rounded ${synced ? "bg-emerald-400" : "bg-red-400"}`}
                style={{ width: `${publish.syncProgress}%` }}
              />
            </div>
            <div className={`text-[10px] ${synced ? "text-emerald-400" : "text-red-400"}`}>
              {synced ? "자동 배포 가능" : "다운로드만 가능"}
            </div>
          </div>

          <div className="flex gap-1.5 mb-2">
            <div className="flex-1 p-2 bg-white/4 rounded">
              <div className="text-[8px] text-white/30">프라임 타임</div>
              <div className="text-[11px] font-semibold mt-0.5">{publish.schedule.split("(")[0]}</div>
            </div>
            <div className="flex-1 p-2 bg-white/4 rounded">
              <div className="text-[8px] text-white/30">썸네일 A/B</div>
              <div className="text-[11px] font-semibold mt-0.5">
                {publish.thumbnails[0]?.style} / {publish.thumbnails[1]?.style}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="mt-3">
        <div className="text-[10px] font-semibold text-white/50 mb-1.5">CTR 최적화 제목</div>
        <div className="space-y-1 mb-3">
          {publish.titles.slice(0, 3).map((t, i) => (
            <button
              key={i}
              onClick={() => setSelTitle(i)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] transition-all
                ${selTitle === i ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-white/15"}
              `}
            >
              <span className="text-[9px] text-white/30 mr-2">{i + 1}</span>
              {t}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-semibold text-white/50 mb-1">해시태그</div>
        <div className="flex gap-1 flex-wrap mb-4">
          {publish.hashtags.map((h, i) => (
            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-blue-400 font-medium">{h}</span>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors">
            유튜브 자동 업로드 예약
          </button>
          <button className="py-3 px-5 rounded-lg border border-white/15 text-white/60 text-xs hover:bg-white/5 transition-colors">
            MP4 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}
