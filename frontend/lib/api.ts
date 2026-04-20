/**
 * AlgoMaker Beta API Client
 * 백엔드 호출 + Gemini 실패 시 로컬 contentEngine fallback
 */

import { getSupabase } from './supabase';
import { generateContent, type GeneratedContent } from '../app/_shared/contentEngine';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://project-blackbox-production.up.railway.app';

async function authHeader(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    return { Authorization: `Bearer ${data.session.access_token}` };
  }
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
      return { ok: false, fallback: true, error: err.error || `HTTP ${resp.status}` };
    }
    return await resp.json();
  } catch (e: any) {
    console.warn(`[API ${path}] 호출 실패:`, e.message);
    return { ok: false, fallback: true, error: e.message };
  }
}

// ═══════════════════════════════════════════════
// 키워드 발굴
// ═══════════════════════════════════════════════

export async function fetchKeywords(category: string, senior: boolean = false) {
  const result = await apiCall('/api/keyword-analyze', {
    category,
    senior_mode: senior,
  });
  if (result.ok && result.data?.keywords) {
    return { source: 'gemini' as const, keywords: result.data.keywords };
  }
  // Fallback은 호출자가 처리 (contentEngine의 하드코딩 키워드 풀 사용)
  return { source: 'fallback' as const, keywords: [], error: result.error };
}

// ═══════════════════════════════════════════════
// 뉴스 검색
// ═══════════════════════════════════════════════

export async function fetchNews(keyword: string, limit: number = 6) {
  const result = await apiCall('/api/news', { keyword, limit });
  if (result.ok && result.data?.news) {
    return { source: 'naver' as const, news: result.data.news };
  }
  return { source: 'fallback' as const, news: [], error: result.error };
}

// ═══════════════════════════════════════════════
// 대본 생성
// ═══════════════════════════════════════════════

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
    return {
      source: 'gemini' as const,
      data: result.data,
    };
  }
  // Fallback: 로컬 contentEngine
  const content = generateContent({ keyword, category, senior });
  return {
    source: 'fallback' as const,
    data: {
      scriptBlocks: content.scriptBlocks,
      headline: content.headline,
      dek: content.dek,
      hook: content.hook,
    },
    error: result.error,
  };
}

// ═══════════════════════════════════════════════
// SEO 생성
// ═══════════════════════════════════════════════

export async function fetchSeo(keyword: string, category: string, senior: boolean = false) {
  const result = await apiCall('/api/seo', {
    keyword,
    category,
    senior_mode: senior,
  });
  if (result.ok && result.data?.seoTitle) {
    return { source: 'gemini' as const, data: result.data };
  }
  // Fallback: 로컬
  const content = generateContent({ keyword, category, senior });
  return {
    source: 'fallback' as const,
    data: {
      seoTitle: content.seoTitle,
      seoTitleAlt: content.seoTitleAlt,
      thumbnail: content.thumbnail,
      thumbnailAlt: content.thumbnailAlt,
      description: content.description,
      tags: content.tags,
    },
    error: result.error,
  };
}

// ═══════════════════════════════════════════════
// TTS
// ═══════════════════════════════════════════════

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

// ═══════════════════════════════════════════════
// 프로젝트 저장 (인증 필요)
// ═══════════════════════════════════════════════

export async function saveProject(data: any) {
  return apiCall('/api/project/save', data, true);
}

// ═══════════════════════════════════════════════
// 헬스체크
// ═══════════════════════════════════════════════

export async function checkHealth() {
  try {
    const resp = await fetch(`${API_BASE}/api/health`);
    if (resp.ok) return await resp.json();
  } catch {}
  return { ok: false };
}
