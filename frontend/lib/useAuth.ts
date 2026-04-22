/**
 * 인증 훅 (env-gated)
 *
 * Supabase가 설정돼 있으면 실제 세션 관리, 없으면 placeholder (비로그인 모드).
 * 호출 측은 isSupabaseReady() 또는 ready 플래그로 분기 가능.
 */
'use client';
import { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseReady } from './supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  ready: boolean;          // Supabase 설정 + 초기 세션 로드 완료
  enabled: boolean;        // Supabase 가 활성화돼 있는지
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password?: string) => Promise<{ error: any; data: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signInWithGoogle: () => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
}

const NOT_READY = { error: { message: 'Supabase 미설정 — 관리자에게 문의하세요' }, data: null };

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      setReady(true);
      return;
    }

    sb.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
      setReady(true);
    }).catch(() => {
      setLoading(false);
      setReady(true);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const enabled = isSupabaseReady();

  return {
    user,
    session,
    loading,
    ready,
    enabled,
    isAuthenticated: !!user,

    signInWithEmail: async (email: string, password?: string) => {
      const sb = getSupabase();
      if (!sb) return NOT_READY;
      // password 있으면 비밀번호 로그인, 없으면 매직 링크
      if (password) {
        return sb.auth.signInWithPassword({ email, password });
      }
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/assets`
        : undefined;
      return sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    },

    signUpWithEmail: async (email: string, password: string) => {
      const sb = getSupabase();
      if (!sb) return NOT_READY;
      return sb.auth.signUp({ email, password });
    },

    signInWithGoogle: async () => {
      const sb = getSupabase();
      if (!sb) return NOT_READY;
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/assets`
        : undefined;
      return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    },

    signOut: async () => {
      const sb = getSupabase();
      if (sb) await sb.auth.signOut();
    },
  };
}
