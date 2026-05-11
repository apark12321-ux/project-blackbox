// v11 · 기존 layout-client 호환용 placeholder
// v11 페이지들은 V11Shell의 getProject/setProject 사용
// 모든 타입과 메서드를 export하여 빌드 에러 방지

export type ActivePage = 'curation' | 'script' | 'video' | 'deploy';
export type Mode = 'normal' | 'senior';
export type PipelineStep = 0 | 1 | 2 | 3 | 4 | 5;

export type Category = {
  id: string;
  name: string;
  label?: string;
  icon?: string;
  [key: string]: any;
};

export type KeywordResult = {
  keyword: string;
  score?: number;
  volume?: number;
  trend?: string;
  [key: string]: any;
};

export type NewsSource = {
  id?: string;
  title: string;
  url?: string;
  source?: string;
  publishedAt?: string;
  [key: string]: any;
};

export type Profile = {
  channelName: string;
  [key: string]: any;
};

export type BlackboxState = {
  step: PipelineStep;
  activePage: ActivePage;
  mode: Mode;
  profile: Profile;
  selectedCategory: Category | null;
  selectedKeyword: KeywordResult | null;
  selectedNews: NewsSource | null;
  setStep: (s: number) => void;
  setActivePage: (p: ActivePage) => void;
  setMode: (m: Mode) => void;
  setProfile: (p: any) => void;
  selectCategory: (c: Category | null) => void;
  selectKeyword: (k: KeywordResult | null) => void;
  selectNews: (n: NewsSource | null) => void;
  reset: () => void;
};

const defaultState: BlackboxState = {
  step: 0,
  activePage: 'curation',
  mode: 'normal',
  profile: { channelName: '' },
  selectedCategory: null,
  selectedKeyword: null,
  selectedNews: null,
  setStep: () => {},
  setActivePage: () => {},
  setMode: () => {},
  setProfile: () => {},
  selectCategory: () => {},
  selectKeyword: () => {},
  selectNews: () => {},
  reset: () => {},
};

export function useBlackboxStore(): BlackboxState;
export function useBlackboxStore<T>(selector: (s: BlackboxState) => T): T;
export function useBlackboxStore<T>(selector?: (s: BlackboxState) => T): T | BlackboxState {
  if (selector) return selector(defaultState);
  return defaultState;
}
