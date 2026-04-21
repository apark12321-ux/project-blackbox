/**
 * AlgoMaker · v10 Zustand Store
 * 기존 layout-client.tsx 및 다른 컴포넌트가 기대하는 인터페이스 호환
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActivePage = 'curation' | 'script' | 'video' | 'deploy';
export type Mode = 'normal' | 'senior';

export interface Profile {
  channelName: string;
  targetAge?: string;
  topic?: string;
}

export interface BlackboxState {
  /** 진행 단계 0~6 */
  step: number;
  /** 현재 활성 페이지 */
  activePage: ActivePage;
  /** 일반/시니어 모드 */
  mode: Mode;
  /** 채널 프로필 */
  profile: Profile;

  /** v10용 · 선택된 카테고리 */
  category?: string;
  categoryLabel?: string;

  /** v10용 · 선택된 키워드 */
  keyword?: string;
  keywordData?: any;

  /** v10용 · 상세 설정 */
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;
  customTopic?: string;

  // Actions
  setStep: (step: number) => void;
  setActivePage: (page: ActivePage) => void;
  setMode: (mode: Mode) => void;
  setProfile: (profile: Profile) => void;
  setCategory: (category: string, label: string) => void;
  setKeyword: (keyword: string, data?: any) => void;
  setConfig: (cfg: { tone?: any; duration?: number; customTopic?: string }) => void;
  reset: () => void;
}

const initialState = {
  step: 0,
  activePage: 'curation' as ActivePage,
  mode: 'normal' as Mode,
  profile: {
    channelName: '',
    targetAge: '',
    topic: '',
  },
  category: undefined,
  categoryLabel: undefined,
  keyword: undefined,
  keywordData: undefined,
  tone: 'formal' as const,
  duration: 10,
  customTopic: '',
};

export const useBlackboxStore = create<BlackboxState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setActivePage: (page) => set({ activePage: page }),
      setMode: (mode) => set({ mode }),
      setProfile: (profile) => set({ profile }),
      setCategory: (category, label) => set({ category, categoryLabel: label, step: 1 }),
      setKeyword: (keyword, data) => set({ keyword, keywordData: data, step: 2 }),
      setConfig: (cfg) => set(cfg as any),
      reset: () => set(initialState),
    }),
    {
      name: 'blackbox-storage',
      version: 1,
    }
  )
);
