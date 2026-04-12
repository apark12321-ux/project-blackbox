import { create } from "zustand";

export type ActivePage = "curation" | "script" | "video" | "deploy";

interface UserProfile {
  channelName: string;
  introText: string;
  outroText: string;
  watermarkText: string;
  ttsVoiceId: string;
  ttsVoiceName: string;
  avatarId: string;
  avatarName: string;
}

const DEFAULT_PROFILE: UserProfile = {
  channelName: "",
  introText: "안녕하세요, 오늘도 핵심만 짚어드리겠습니다.",
  outroText: "다음 영상에서 더 유익한 정보로 찾아뵙겠습니다.",
  watermarkText: "",
  ttsVoiceId: "jBpfuIE2acCO8z3wKNLl",
  ttsVoiceName: "기본 한국어",
  avatarId: "",
  avatarName: "",
};

interface BlackboxState {
  mode: "normal" | "senior";
  setMode: (m: "normal" | "senior") => void;
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  step: number;
  setStep: (s: number) => void;
  activePage: ActivePage;
  setActivePage: (p: ActivePage) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  keywords: string[];
  setKeywords: (k: string[]) => void;
  selectedKeyword: string | null;
  setSelectedKeyword: (k: string | null) => void;
  news: any[];
  setNews: (n: any[]) => void;
  selectedNews: any[];
  setSelectedNews: (n: any[]) => void;
  script: any | null;
  setScript: (s: any | null) => void;
  benchmarks: any | null;
  setBenchmarks: (b: any | null) => void;
  video: any | null;
  setVideo: (v: any | null) => void;
  shield: any | null;
  setShield: (s: any | null) => void;
  publish: any | null;
  setPublish: (p: any | null) => void;
  reset: () => void;
}

export const useBlackboxStore = create<BlackboxState>((set) => ({
  mode: "normal",
  setMode: (m) => set({ mode: m }),
  profile: { ...DEFAULT_PROFILE },
  setProfile: (p) => set((state) => ({ profile: { ...state.profile, ...p } })),
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
