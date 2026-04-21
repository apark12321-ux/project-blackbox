// v11 · Auth 미사용 placeholder
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
