// v11 · 기존 layout-client 호환용 placeholder
// v11 페이지들은 V11Shell의 getProject/setProject 사용
// 타입 체크를 우회하여 어떤 속성이든 접근 가능하도록 함

export type ActivePage = 'curation' | 'script' | 'video' | 'deploy';
export type Mode = 'normal' | 'senior';
export type PipelineStep = 0 | 1 | 2 | 3 | 4 | 5;
export type Category = any;
export type KeywordResult = any;
export type NewsSource = any;
export type Profile = any;
export type BlackboxState = any;

const defaultState: any = {
  step: 0,
  activePage: 'curation',
  mode: 'normal',
  profile: { channelName: '' },
  selectedCategory: null,
  selectedKeyword: null,
  selectedNews: null,
  shield: null,
  publish: null,
  videoJob: null,
  script: null,
  setStep: () => {},
  setActivePage: () => {},
  setMode: () => {},
  setProfile: () => {},
  selectCategory: () => {},
  selectKeyword: () => {},
  selectNews: () => {},
  reset: () => {},
};

// Proxy로 어떤 속성 접근이든 안전하게 처리
const proxiedState: any = new Proxy(defaultState, {
  get(target, prop) {
    if (prop in target) return target[prop as string];
    // 함수 형태 속성은 빈 함수로
    if (typeof prop === 'string' && prop.startsWith('set')) return () => {};
    if (typeof prop === 'string' && prop.startsWith('select')) return () => {};
    return null;
  },
});

export function useBlackboxStore(): any;
export function useBlackboxStore<T>(selector: (s: any) => T): T;
export function useBlackboxStore<T>(selector?: (s: any) => T): T | any {
  if (selector) return selector(proxiedState);
  return proxiedState;
}
