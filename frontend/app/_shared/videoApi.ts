/**
 * Video API Client (v4) - 정확한 스키마 기반
 * 
 * 백엔드 구조:
 * 0. POST /api/v1/curation/news/search → 뉴스 응답 (스키마 아직 추정)
 * 1. POST /api/v1/script/generate → { blocks: [...] }
 * 2. POST /api/v1/video/generate-real → { job_id, status, download_url, ... }
 * 3. GET /api/v1/video/status/{job_id} → polling
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://project-blackbox-production.up.railway.app';

// ============================================================
// Types
// ============================================================
export interface GenerateRealRequest {
  keyword: string;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;       // minutes
  mode?: 'normal' | 'senior';
  custom_topic?: string;
  category?: string;
  channel_name?: string;
}

export interface GenerateRealResponse {
  job_id: string;
  status?: string;
  download_url?: string;
  duration_sec?: number;
  file_size_bytes?: number;
  error?: string;
  [key: string]: any;
}

export interface JobStatusResponse {
  job_id?: string;
  status: string;
  progress?: number;
  current_step?: string;
  logs?: string[];
  message?: string;
  error?: string;
  download_url?: string;
  result?: any;
  [key: string]: any;
}

export interface DownloadResponse {
  download_url?: string;
  video_url?: string;
  url?: string;
  [key: string]: any;
}

export interface ApiError {
  status: number;
  message: string;
  body?: any;
}

// ============================================================
// FastAPI validation error → 문자열
// ============================================================
function stringifyFastApiError(detail: any): string {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      if (typeof item === 'string') return item;
      const loc = Array.isArray(item.loc) ? item.loc.join('.') : (item.loc || '');
      const msg = item.msg || item.message || JSON.stringify(item);
      return loc ? `${loc}: ${msg}` : msg;
    }).join(' | ');
  }
  if (typeof detail === 'object') {
    try { return JSON.stringify(detail); } catch { return String(detail); }
  }
  return String(detail);
}

// ============================================================
// fetch wrapper
// ============================================================
async function apiCall<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: any,
  timeoutMs: number = 60000
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const text = await res.text();
    let parsed: any = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text };
    }

    if (!res.ok) {
      let msg = '';
      if (parsed?.detail) msg = stringifyFastApiError(parsed.detail);
      else if (parsed?.message) msg = typeof parsed.message === 'string' ? parsed.message : stringifyFastApiError(parsed.message);
      else msg = `HTTP ${res.status}`;
      throw { status: res.status, message: msg, body: parsed } as ApiError;
    }

    return parsed as T;
  } catch (e: any) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') {
      throw { status: 0, message: '요청 시간 초과', body: null } as ApiError;
    }
    if (e?.status !== undefined) throw e;
    throw { status: 0, message: String(e?.message || '네트워크 오류'), body: null } as ApiError;
  }
}

// ============================================================
// Step 0: 뉴스 검색 → news_summary 생성
// ============================================================
async function searchNewsAndSummarize(
  keyword: string,
  category?: string
): Promise<string> {
  // 여러 body 포맷 시도 (스키마 불확실)
  const formats = [
    { keyword, category },
    { query: keyword, category },
    { keyword },
    { q: keyword },
    { search: keyword },
  ];

  let newsRes: any = null;
  let lastErr: ApiError | null = null;

  for (const body of formats) {
    const cleaned: any = {};
    Object.keys(body).forEach((k) => {
      const v = (body as any)[k];
      if (v !== undefined && v !== null && v !== '') cleaned[k] = v;
    });

    try {
      newsRes = await apiCall<any>('POST', '/api/v1/curation/news/search', cleaned, 30000);
      break;
    } catch (err: any) {
      lastErr = err;
      if (err?.status !== 422) throw err;
    }
  }

  if (!newsRes) {
    throw lastErr || { status: 500, message: '뉴스 검색 실패', body: null };
  }

  // 응답에서 뉴스 목록 추출 (여러 구조 대응)
  const newsList = extractNewsList(newsRes);
  if (!newsList || newsList.length === 0) {
    // 뉴스가 없으면 기본 요약 반환
    return `"${keyword}"는 ${category || ''} 카테고리의 주제입니다. 최근 관련 이슈와 일반적 상식을 바탕으로 영상을 제작합니다.`;
  }

  // 뉴스 목록을 하나의 문자열로 합치기
  const summary = newsList.slice(0, 5).map((n, i) => {
    const title = n.title || n.headline || n.name || '';
    const desc = n.description || n.summary || n.content || n.snippet || n.body || '';
    return `${i + 1}. ${title}${desc ? ' - ' + String(desc).slice(0, 200) : ''}`;
  }).join('\n');

  return summary || `"${keyword}" 관련 뉴스 기반 영상 제작`;
}

function extractNewsList(res: any): any[] | null {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  const candidates = [
    res.news, res.articles, res.items, res.results,
    res.data, res.list,
    res.news_list, res.article_list,
    res.result?.news, res.result?.articles, res.result?.items,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c;
  }
  return null;
}

// ============================================================
// Step 1: 대본 생성 (정확한 스키마)
// ============================================================
async function generateScript(
  req: GenerateRealRequest,
  newsSummary: string
): Promise<any> {
  const body = {
    keyword: req.keyword,
    category: req.category || 'economy',
    news_summary: newsSummary,
    core_facts: [],
    opinion_seeds: [],
    hook_triggers: [],
    target_duration_sec: (req.duration || 10) * 60,
  };

  return apiCall<any>('POST', '/api/v1/script/generate', body, 120000);
}

// 대본 응답에서 blocks 추출 (스키마: { blocks: [...] })
function extractScriptBlocks(scriptRes: any): any[] | null {
  if (!scriptRes) return null;
  if (Array.isArray(scriptRes.blocks) && scriptRes.blocks.length > 0) {
    return scriptRes.blocks;
  }
  // fallback
  const candidates = [
    scriptRes.script_blocks,
    scriptRes.script?.blocks,
    scriptRes.result?.blocks,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c;
  }
  return null;
}

// ============================================================
// Step 2: 영상 생성 (정확한 스키마)
// ============================================================
async function generateVideoWithScript(
  scriptBlocks: any[],
  req: GenerateRealRequest
): Promise<GenerateRealResponse> {
  const body = {
    keyword: req.keyword,
    category: req.category || 'economy',
    mode: req.mode || 'normal',
    script_blocks: scriptBlocks,
    channel_name: req.channel_name || '',
    watermark_text: '',
    tts_voice_id: '',   // 기본값 사용
  };

  return apiCall<GenerateRealResponse>('POST', '/api/v1/video/generate-real', body, 60000);
}

// ============================================================
// Public: 3-step orchestration
// ============================================================
export async function startVideoGeneration(
  req: GenerateRealRequest,
  onProgress?: (step: string) => void
): Promise<GenerateRealResponse> {
  // Step 0: 뉴스 검색
  onProgress?.('📰 관련 뉴스 수집 중...');
  let newsSummary: string;
  try {
    newsSummary = await searchNewsAndSummarize(req.keyword, req.category);
  } catch (err: any) {
    console.warn('[video] news search failed, using fallback:', err);
    newsSummary = `"${req.keyword}" 주제에 대한 일반 상식 기반 영상입니다.`;
  }

  // Step 1: 대본 생성
  onProgress?.('✍️ AI 대본 작성 중... (1~2분 소요)');
  const scriptRes = await generateScript(req, newsSummary);

  const scriptBlocks = extractScriptBlocks(scriptRes);
  if (!scriptBlocks) {
    throw {
      status: 500,
      message: `대본 응답에서 blocks를 찾을 수 없습니다. 응답 키: ${Object.keys(scriptRes || {}).join(', ')}`,
      body: scriptRes,
    } as ApiError;
  }

  // Step 2: 영상 생성
  onProgress?.('🎬 영상 생성 요청 중...');
  const videoRes = await generateVideoWithScript(scriptBlocks, req);

  const jobId = videoRes.job_id || (videoRes as any).jobId || (videoRes as any).id;
  if (!jobId) {
    throw {
      status: 500,
      message: `job_id를 찾을 수 없음. 응답: ${JSON.stringify(videoRes).slice(0, 200)}`,
      body: videoRes,
    } as ApiError;
  }

  return { ...videoRes, job_id: jobId };
}

// ============================================================
// Status / Download
// ============================================================
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return apiCall<JobStatusResponse>('GET', `/api/v1/video/status/${encodeURIComponent(jobId)}`, undefined, 15000);
}

export async function getDownloadUrl(jobId: string): Promise<DownloadResponse> {
  return apiCall<DownloadResponse>('GET', `/api/v1/video/download/${encodeURIComponent(jobId)}`, undefined, 15000);
}

// ============================================================
// Helpers
// ============================================================
export function extractVideoUrl(
  statusRes?: JobStatusResponse | null,
  downloadRes?: DownloadResponse | null,
  startRes?: GenerateRealResponse | null
): string | null {
  const candidates: (string | undefined)[] = [
    // status 응답에서 (확인된 스키마: download_url)
    statusRes?.download_url,
    statusRes?.result?.download_url,
    statusRes?.result?.video_url,
    (statusRes as any)?.video_url,
    // download 엔드포인트
    downloadRes?.download_url,
    downloadRes?.video_url,
    downloadRes?.url,
    (downloadRes as any)?.file_url,
    // 시작 응답에 바로 포함될 수도
    startRes?.download_url,
    (startRes as any)?.video_url,
  ];
  for (const c of candidates) {
    if (c && typeof c === 'string' && c.length > 0) {
      if (c.startsWith('http')) return c;
      return `${API_BASE}${c.startsWith('/') ? '' : '/'}${c}`;
    }
  }
  return null;
}

export function formatApiError(err: any): string {
  if (!err) return '알 수 없는 오류';
  if (typeof err === 'string') return err;

  if (err.status !== undefined) {
    if (err.status === 0) return `네트워크 오류: ${err.message || ''}`.trim();
    if (err.status === 404) return '요청한 리소스를 찾을 수 없습니다';
    if (err.status === 402) return '크레딧이 부족합니다';
    if (err.status === 422) return `요청 형식이 맞지 않습니다: ${err.message || ''}`;
    if (err.status === 500) return `서버 오류: ${err.message || 'Internal Server Error'}`;
    return `오류 (${err.status}): ${err.message || ''}`;
  }

  if (err.message) return String(err.message);
  try { return JSON.stringify(err); } catch { return String(err); }
}
