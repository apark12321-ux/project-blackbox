// v10 · Auth 미사용 (로그인 없는 버전)
// (Beta 시절 파일 덮어씀)

export function useAuth() {
  return {
    user: null,
    session: null,
    loading: false,
    ready: false,
    signInWithEmail: async () => ({ error: null, data: null }),
    signUpWithEmail: async () => ({ error: null, data: null }),
    signInWithGoogle: async () => ({ error: null, data: null }),
    signOut: async () => {},
    isAuthenticated: false,
  };
}
