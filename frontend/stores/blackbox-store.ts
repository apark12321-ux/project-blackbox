import { create } from "zustand";

export type ActivePage = "curation" | "script" | "video" | "deploy";

interface BlackboxState {
  // Mode
  mode: "normal" | "senior";
  setMode: (m: "normal" | "senior") => void;

  // Step tracking
  step: number;
  setStep: (s: number) => void;

  // Active page (module navigation)
  activePage: ActivePage;
  setActivePage: (p: ActivePage) => void;

  // Category & Keywords
  category: string | null;
  setCategory: (c: string | null) => void;
  keywords: string[];
  setKeywords: (k: string[]) => void;
  selectedKeyword: string | null;
  setSelectedKeyword: (k: string | null) => void;

  // News
  news: any[];
  setNews: (n: any[]) => void;
  selectedNews: any[];
  setSelectedNews: (n: any[]) => void;

  // Script
  script: any | null;
  setScript: (s: any | null) => void;

  // Benchmarks
  benchmarks: any | null;
  setBenchmarks: (b: any | null) => void;

  // Video
  video: any | null;
  setVideo: (v: any | null) => void;

  // Shield
  shield: any | null;
  setShield: (s: any | null) => void;

  // Publish
  publish: any | null;
  setPublish: (p: any | null) => void;

  // Reset
  reset: () => void;
}

export const useBlackboxStore = create<BlackboxState>((set) => ({
  mode: "normal",
  setMode: (m) => set({ mode: m }),

  step: 0,
  setStep: (s) => set({ step: s }),

  activePage: "curation",
  setActivePage: (p) => set({ activePage: p }),

  category: null,
  setCategory: (c) => set({ category: c }),
  keywords: [],
  setKeywords: (k) => set({ keywords: k }),
  selectedKeyword: null,
  setSelectedKeyword: (k) => set({ selectedKeyword: k }),

  news: [],
  setNews: (n) => set({ news: n }),
  selectedNews: [],
  setSelectedNews: (n) => set({ selectedNews: n }),

  script: null,
  setScript: (s) => set({ script: s }),

  benchmarks: null,
  setBenchmarks: (b) => set({ benchmarks: b }),

  video: null,
  setVideo: (v) => set({ video: v }),

  shield: null,
  setShield: (s) => set({ shield: s }),

  publish: null,
  setPublish: (p) => set({ publish: p }),

  reset: () =>
    set({
      step: 0,
      activePage: "curation",
      category: null,
      keywords: [],
      selectedKeyword: null,
      news: [],
      selectedNews: [],
      script: null,
      benchmarks: null,
      video: null,
      shield: null,
      publish: null,
    }),
}));
