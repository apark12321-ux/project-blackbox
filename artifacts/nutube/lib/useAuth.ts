// useAuth placeholder - Supabase 미설치 시에도 빌드 통과
// 사용처: 없음 (향후 사용 가능)

export type User = any;
export type Session = any;

export function useAuth() {
  return {
    user: null as any,
    session: null as any,
    loading: false,
    signIn: async (_email: string, _password: string) => ({ error: null }),
    signOut: async () => ({ error: null }),
    isReady: false,
  };
}
