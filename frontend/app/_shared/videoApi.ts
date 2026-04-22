/**
 * Video API Client (v3)
 * 
 * 실제 백엔드 구조:
 * 1. POST /api/v1/script/generate → script_blocks 생성
 * 2. POST /api/v1/video/generate-real (script_blocks 포함) → job_id
 * 3. GET /api/v1/video/status/{job_id} (polling)
 * 4. GET /api/v1/video/download/{job_id}
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://project-blackbox-production.up.railway.app';

// ============================================================
// Types
// ============================================================
export interface GenerateRealRequest {
  keyword: string;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;
  mode?: 'normal' | 'senior';
  custom_topic?: string;
  category?: string;
}

export interface GenerateRealResponse {
  job_id: string;
  status?: string;
  message?: string;
  [key: string]: any;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | string;

export interface JobStatusResponse {
  job_id?: string;
  status: JobStatus;
  progress?: number;
  current_step?: string;
  logs?: string[];
  message?: string;
  error?: string;
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
      if (parsed?.detail) {
        msg = stringifyFastApiError(parsed.detail);
      } else if (parsed?.message) {
        msg = typeof parsed.message === 'string' ? parsed.message : stringifyFastApiError(parsed.message);
      } else {
        msg = `HTTP ${res.status}`;
      }
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
// Step 1: 대본 생성
// ============================================================
async function generateScript(req: GenerateRealRequest): Promise<any> {
  // 여러 포맷 시도
  const duration_seconds = (req.duration || 10) * 60;
  const formats = [
    // 표준 포맷
    {
      keyword: req.keyword,
      category: req.category || 'economy',
      tone: req.tone || 'formal',
      duration_seconds,
      custom_topic: req.custom_topic,
    },
    // 최소
    {
      keyword: req.keyword,
      category: req.category || 'economy',
    },
    // 다른 이름
    {
      topic: req.keyword,
      category: req.category || 'economy',
      tone: req.tone || 'formal',
      duration_minutes: req.duration || 10,
    },
  ];

  let lastErr: ApiError | null = null;
  for (const body of formats) {
    // null/undefined 제거
    const cleaned: any = {};
    Object.keys(body).forEach((k) => {
      const v = (body as any)[k];
      if (v !== undefined && v !== null && v !== '') cleaned[k] = v;
    });

    try {
      return await apiCall<any>('POST', '/api/v1/script/generate', cleaned, 90000);
    } catch (err: any) {
      lastErr = err;
      if (err?.status !== 422) throw err; // 422만 다음 포맷 시도
    }
  }
  throw lastErr || { status: 500, message: '대본 생성 모든 포맷 실패', body: null };
}

/**
 * 대본 응답에서 script_blocks 추출 (다양한 포맷 지원)
 */
function extractScriptBlocks(scriptRes: any): any[] | null {
  if (!scriptRes) return null;
  const candidates = [
    scriptRes.script_blocks,
    scriptRes.blocks,
    scriptRes.script?.blocks,
    scriptRes.script?.script_blocks,
    scriptRes.result?.script_blocks,
    scriptRes.result?.blocks,
    scriptRes.data?.script_blocks,
    scriptRes.data?.blocks,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c;
  }
  // 대본 자체가 배열이면
  if (Array.isArray(scriptRes)) return scriptRes;
  return null;
}

// ============================================================
// Step 2: 영상 생성
// ============================================================
async function generateVideoWithScript(
  scriptBlocks: any[],
  req: GenerateRealRequest
): Promise<GenerateRealResponse> {
  const duration_seconds = (req.duration || 10) * 60;

  const formats = [
    // 표준
    {
      script_blocks: scriptBlocks,
      keyword: req.keyword,
      category: req.category,
      tone: req.tone,
      duration_seconds,
      mode: req.mode,
    },
    // 최소
    {
      script_blocks: scriptBlocks,
    },
    // blocks 이름
    {
      blocks: scriptBlocks,
      keyword: req.keyword,
    },
  ];

  let lastErr: ApiError | null = null;
  for (const body of formats) {
    const cleaned: any = {};
    Object.keys(body).forEach((k) => {
      const v = (body as any)[k];
      if (v !== undefined && v !== null && v !== '') cleaned[k] = v;
    });

    try {
      return await apiCall<GenerateRealResponse>('POST', '/api/v1/video/generate-real', cleaned, 60000);
    } catch (err: any) {
      lastErr = err;
      if (err?.status !== 422) throw err;
    }
  }
  throw lastErr || { status: 500, message: '영상 생성 모든 포맷 실패', body: null };
}

// ============================================================
// Public: 2-step orchestration
// ============================================================
/**
 * 전체 영상 생성 흐름:
 * 1. 대본 생성 (최대 90초)
 * 2. 영상 생성 요청 (job_id 획득)
 */
export async function startVideoGeneration(
  req: GenerateRealRequest,
  onProgress?: (step: string) => void
): Promise<GenerateRealResponse> {
  onProgress?.('AI 대본 작성 중...');
  const scriptRes = await generateScript(req);

  const scriptBlocks = extractScriptBlocks(scriptRes);
  if (!scriptBlocks) {
    throw {
      status: 500,
      message: `대본 응답에서 script_blocks를 찾을 수 없습니다. 백엔드 응답 키: ${Object.keys(scriptRes || {}).join(', ')}`,
      body: scriptRes,
    } as ApiError;
  }

  onProgress?.('영상 생성 요청 중...');
  const videoRes = await generateVideoWithScript(scriptBlocks, req);

  const jobId = videoRes.job_id || (videoRes as any).jobId || (videoRes as any).id || (videoRes as any).task_id;
  if (!jobId) {
    throw {
      status: 500,
      message: `job_id를 찾을 수 없음. 응답 키: ${Object.keys(videoRes || {}).join(', ')}`,
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
  downloadRes?: DownloadResponse | null
): string | null {
  const candidates: (string | undefined)[] = [
    downloadRes?.download_url,
    downloadRes?.video_url,
    downloadRes?.url,
    (downloadRes as any)?.file_url,
    statusRes?.result?.video_url,
    statusRes?.result?.download_url,
    (statusRes as any)?.video_url,
    (statusRes as any)?.download_url,
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
    if (err.status === 404) return '영상 작업을 찾을 수 없습니다 (job_id 확인 필요)';
    if (err.status === 402) return '크레딧이 부족합니다';
    if (err.status === 422) return `요청 형식이 맞지 않습니다: ${err.message || ''}`;
    if (err.status === 500) return `서버 오류: ${err.message || 'Internal Server Error'}`;
    return `오류 (${err.status}): ${err.message || ''}`;
  }

  if (err.message) return String(err.message);
  try { return JSON.stringify(err); } catch { return String(err); }
}
