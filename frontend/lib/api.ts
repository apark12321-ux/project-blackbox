/**
 * AlgoMaker Beta API Client
 * 백엔드 API 호출. 실패 시 null 반환하므로 호출자가 fallback 처리.
 */

import { getSupabase } from './supabase';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://project-blackbox-production.up.railway.app';

async function authHeader(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return {};
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      return { Authorization: `Bearer ${data.session.access_token}` };
    }
  } catch {}
  return {};
}

async function apiCall(path: string, body: any, needsAuth = false): Promise<any> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(needsAuth ? await authHeader() : {}),
    };
    const resp = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      console.warn(`[API ${path}] ${resp.status}:`, err);
      return { ok: false, fallback: true, error: (err as any).error || `HTTP ${resp.status}` };
    }
    return await resp.json();
  } catch (e: any) {
    console.warn(`[API ${path}] 호출 실패:`, e?.message);
    return { ok: false, fallback: true, error: e?.message };
  }
}

export async function fetchKeywords(category: string, senior: boolean = false) {
  const result = await apiCall('/api/keyword-analyze', { category, senior_mode: senior });
  if (result.ok && result.data?.keywords) {
    return { source: 'gemini' as const, keywords: result.data.keywords };
  }
  return { source: 'fallback' as const, keywords: [], error: result.error };
}

export async function fetchNews(keyword: string, limit: number = 6) {
  const result = await apiCall('/api/news', { keyword, limit });
  if (result.ok && result.data?.news) {
    return { source: 'naver' as const, news: result.data.news };
  }
  return { source: 'fallback' as const, news: [], error: result.error };
}

export async function fetchScript(
  keyword: string,
  category: string,
  newsSummaries?: any[],
  senior: boolean = false
) {
  const result = await apiCall('/api/script', {
    keyword,
    category,
    news_summaries: newsSummaries,
    senior_mode: senior,
  });
  if (result.ok && result.data?.scriptBlocks) {
    return { source: 'gemini' as const, data: result.data };
  }
  return { source: 'fallback' as const, data: null, error: result.error };
}

export async function fetchSeo(keyword: string, category: string, senior: boolean = false) {
  const result = await apiCall('/api/seo', { keyword, category, senior_mode: senior });
  if (result.ok && result.data?.seoTitle) {
    return { source: 'gemini' as const, data: result.data };
  }
  return { source: 'fallback' as const, data: null, error: result.error };
}

export async function fetchTts(text: string, senior: boolean = false) {
  const result = await apiCall('/api/tts', { text, senior_mode: senior });
  if (result.ok && result.audio_base64) {
    return {
      source: result.source as 'elevenlabs' | 'edge-tts',
      audioUrl: `data:audio/mp3;base64,${result.audio_base64}`,
    };
  }
  return { source: 'fallback' as const, audioUrl: null, error: result.error };
}

export async function saveProject(data: any) {
  return apiCall('/api/project/save', data, true);
}

export async function checkHealth() {
  try {
    const resp = await fetch(`${API_BASE}/api/health`);
    if (resp.ok) return await resp.json();
  } catch {}
  return { ok: false };
}
