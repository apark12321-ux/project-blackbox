/**
 * useApi · 백엔드 API 호출 통합 훅
 * v10에서는 거의 사용 안 함 (페이지 내부에서 직접 호출)
 * 하지만 기존 컴포넌트 호환을 위해 유지
 */

import { useState, useCallback } from 'react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://project-blackbox-production.up.railway.app';

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  source?: string;
  fallback?: boolean;
}

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (path: string, body?: any, method: 'GET' | 'POST' = 'POST') => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        const msg = (err as any).error || `HTTP ${resp.status}`;
        setError(msg);
        return { ok: false, error: msg, fallback: true } as ApiResult<T>;
      }
      const json = await resp.json();
      setData(json.data || json);
      return { ok: true, data: json.data || json, source: json.source } as ApiResult<T>;
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
      return { ok: false, error: e?.message, fallback: true } as ApiResult<T>;
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, data, error };
}

/** 헬스체크 간단 버전 */
export async function checkHealth() {
  try {
    const resp = await fetch(`${API_BASE}/health`);
    if (resp.ok) return await resp.json();
  } catch {}
  return { ok: false };
}
