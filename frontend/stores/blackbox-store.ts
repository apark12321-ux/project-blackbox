// v11 · 기존 layout-client 호환용 placeholder
// v11 페이지들은 V11Shell의 getProject/setProject 사용
export type ActivePage = 'curation' | 'script' | 'video' | 'deploy';
export type Mode = 'normal' | 'senior';
export type PipelineStep = 0 | 1 | 2 | 3 | 4 | 5;

export function useBlackboxStore<T = any>(selector?: (s: any) => T): T {
  const state: any = {
    step: 0 as PipelineStep,
    activePage: 'curation' as ActivePage,
    mode: 'normal' as Mode,
    profile: { channelName: '' },
    setStep: (_: number) => {},
    setActivePage: (_: ActivePage) => {},
    setMode: (_: Mode) => {},
    setProfile: (_: any) => {},
    reset: () => {},
  };
  return (selector ? selector(state) : state) as T;
}
