// v11 · 빈 훅 (하위 호환)
export function useApi() {
  return { call: async () => null, loading: false, data: null, error: null };
}
