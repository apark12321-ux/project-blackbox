// v11 · 기존 layout-client 호환용 placeholder
// v11 페이지들은 V11Shell의 getProject/setProject 사용
export type ActivePage = 'curation' | 'script' | 'video' | 'deploy';
export type Mode = 'normal' | 'senior';

export function useBlackboxStore() {
  return {
    step: 0,
    activePage: 'curation' as ActivePage,
    mode: 'normal' as Mode,
    profile: { channelName: '' },
    setStep: (_: number) => {},
    setActivePage: (_: ActivePage) => {},
    setMode: (_: Mode) => {},
    setProfile: (_: any) => {},
    reset: () => {},
  };
}
