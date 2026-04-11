/**
 * Project Blackbox — Zustand Global Store
 * 
 * 6단계 파이프라인 상태를 중앙 관리합니다.
 * Step 0: 카테고리 → Step 1: 키워드 → Step 2: 소스
 * Step 3: 스크립트(B) → Step 4: 영상편집(B-2) → Step 5: 실드&배포(C+D)
 * 
 * activePage: 현재 보고 있는 모듈 페이지 (UI 전환용, step과 독립)
 */
import { create } from "zustand";

// ── Types ──
export type ViewMode = "normal" | "senior";
export type PipelineStep = 0 | 1 | 2 | 3 | 4 | 5;
export type ActivePage = "curation" | "script" | "video" | "deploy";

export interface Category {
  id: string;
  name: string;
  icon: string;
  cpm: string;
  description: string;
}

export interface KeywordResult {
  keyword: string;
  searchVolume: number;
  competitionCount: number;
  boiScore: number;
  boiGrade: string;
  momentum: number;
  estimatedCpm: number;
  subScores: { gap: number; momentum: number; cpm: number; volume: number };
}

export interface NewsSource {
  title: string;
  source: string;
  summary: string;
  publishedAt: string;
  cpmGrade: string;
}

export interface ScriptBlock {
  section: "hook" | "body" | "opinion";
  text: string;
  durationSec: number;
  subtitleHighlight: string;
}

export interface ScriptResult {
  hookType: string;
  opinionTone: string;
  blocks: ScriptBlock[];
  totalDurationSec: number;
  dynamicIntro: string;
  dynamicOutro: string;
}

export interface VideoJobResult {
  jobId: string;
  status: string;
  avatarName: string;
  layoutChart: string;
  layoutVariant: number;
  ttsBlockCount: number;
  ffmpegCmdLength: number;
  outputPath: string;
  estimatedMin: number;
}

export interface ShieldResult {
  safetyScore: number;
  safetyGrade: string;
  passed: boolean;
  factors: { name: string; score: number; weight: number }[];
  uniqueId: string;
  outputPath: string;
}

export interface PublishResult {
  syncStatus: string;
  syncProgress: number;
  publishMode: string;
  titles: string[];
  hashtags: string[];
  schedule: string;
  thumbnails: { style: string; headline: string }[];
}

// ── Store ──
interface BlackboxStore {
  // Pipeline state
  step: PipelineStep;
  mode: ViewMode;
  isLoading: boolean;
  error: string | null;

  // ★ 현재 보고 있는 페이지 (사이드바 클릭으로 전환)
  activePage: ActivePage;

  // Step data
  selectedCategory: Category | null;
  keywords: KeywordResult[];
  selectedKeyword: KeywordResult | null;
  newsSources: NewsSource[];
  selectedNews: NewsSource | null;
  script: ScriptResult | null;
  videoJob: VideoJobResult | null;
  shield: ShieldResult | null;
  publish: PublishResult | null;

  // Polling
  videoPollingId: string | null;

  // Actions
  setStep: (step: PipelineStep) => void;
  setMode: (mode: ViewMode) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActivePage: (page: ActivePage) => void;

  selectCategory: (cat: Category) => void;
  setKeywords: (kws: KeywordResult[]) => void;
  selectKeyword: (kw: KeywordResult) => void;
  setNewsSources: (news: NewsSource[]) => void;
  selectNews: (news: NewsSource) => void;
  setScript: (script: ScriptResult) => void;
  setVideoJob: (job: VideoJobResult) => void;
  setShield: (shield: ShieldResult) => void;
  setPublish: (publish: PublishResult) => void;
  setVideoPollingId: (id: string | null) => void;

  reset: () => void;
}

const initialState = {
  step: 0 as PipelineStep,
  mode: "normal" as ViewMode,
  isLoading: false,
  error: null,
  activePage: "curation" as ActivePage,
  selectedCategory: null,
  keywords: [],
  selectedKeyword: null,
  newsSources: [],
  selectedNews: null,
  script: null,
  videoJob: null,
  shield: null,
  publish: null,
  videoPollingId: null,
};

export const useBlackboxStore = create<BlackboxStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActivePage: (activePage) => set({ activePage }),

  selectCategory: (cat) => set({ selectedCategory: cat, step: 1, keywords: [], selectedKeyword: null }),
  setKeywords: (keywords) => set({ keywords }),
  selectKeyword: (kw) => set({ selectedKeyword: kw, step: 2, newsSources: [] }),
  setNewsSources: (newsSources) => set({ newsSources }),
  selectNews: (news) => set({ selectedNews: news, step: 3 }),
  setScript: (script) => set({ script }),
  setVideoJob: (job) => set({ videoJob: job }),
  setShield: (shield) => set({ shield }),
  setPublish: (publish) => set({ publish }),
  setVideoPollingId: (id) => set({ videoPollingId: id }),

  reset: () => set(initialState),
}));
