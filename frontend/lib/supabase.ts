/**
 * Supabase 클라이언트 (env-gated)
 *
 * NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY 가 Vercel에 설정돼 있으면
 * 실제 클라이언트 반환. 없으면 null 반환 → 호출하는 코드는 자동으로 비활성 모드.
 *
 * 켜는 방법:
 *   1. Supabase 대시보드 → Settings → API 에서 URL과 anon key 복사
 *   2. Vercel 프로젝트 → Settings → Environment Variables 에 두 값 추가
 *   3. supabase/schema.sql 을 Supabase SQL Editor 에서 실행
 *   4. 재배포 → 자동으로 Auth 활성화됨
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function isSupabaseReady(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null; // 클라이언트에서만 동작
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  _client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _client;
}
