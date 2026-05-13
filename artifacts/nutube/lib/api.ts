// v11 · 백엔드 API 호출 (Supabase 의존 없음)

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://project-blackbox-production.up.railway.app';

async function apiCall(path: string, body: any): Promise<any> {
  try {
    const resp = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return { ok: false, fallback: true, error: (err as any).error || `HTTP ${resp.status}` };
    }
    return await resp.json();
  } catch (e: any) {
    return { ok: false, fallback: true, error: e?.message };
  }
}

export async function fetchKeywords(category: string, senior = false) {
  const r = await apiCall('/api/keyword-analyze', { category, senior_mode: senior });
  if (r.ok && r.data?.keywords) return { source: 'gemini' as const, keywords: r.data.keywords };
  return { source: 'fallback' as const, keywords: [], error: r.error };
}

export async function fetchNews(keyword: string, limit = 6) {
  const r = await apiCall('/api/news', { keyword, limit });
  if (r.ok && r.data?.news) return { source: 'naver' as const, news: r.data.news };
  return { source: 'fallback' as const, news: [], error: r.error };
}

export async function fetchScript(keyword: string, category: string, news?: any[], senior = false) {
  const r = await apiCall('/api/script', { keyword, category, news_summaries: news, senior_mode: senior });
  if (r.ok && r.data?.scriptBlocks) return { source: 'gemini' as const, data: r.data };
  return { source: 'fallback' as const, data: null, error: r.error };
}

export async function fetchSeo(keyword: string, category: string, senior = false) {
  const r = await apiCall('/api/seo', { keyword, category, senior_mode: senior });
  if (r.ok && r.data?.seoTitle) return { source: 'gemini' as const, data: r.data };
  return { source: 'fallback' as const, data: null, error: r.error };
}
