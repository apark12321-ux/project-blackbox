// Supabase placeholder - 패키지 미설치 시에도 빌드 통과
// 실제 사용처: 없음 (lib/useAuth.ts만 import하지만 useAuth도 사용되지 않음)
// 향후 Supabase 도입 시: npm install @supabase/supabase-js 후 이 파일 복구

export type SupabaseClient = any;

let _client: any = null;

export function getSupabase(): any {
  return _client;
}

export function isSupabaseReady(): boolean {
  return false;
}

export function createClient(_url?: string, _key?: string): any {
  return null;
}
