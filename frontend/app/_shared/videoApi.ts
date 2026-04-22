/**
 * Video API Client (v2 - FastAPI 422 에러 대응 + 다중 포맷 시도)
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
  message: string;   // 항상 문자열!
  body?: any;
}

// ============================================================
// FastAPI validation error → 읽기 쉬운 문자열
// ============================================================
function stringifyFastApiError(detail: any): string {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    // FastAPI 형식: [{type, loc, msg, input}, ...]
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
// Internal: fetch wrapper (에러를 항상 문자열로)
// ============================================================
async function apiCall<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: any,
  timeoutMs: number = 30000
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
      // FastAPI의 422는 { detail: [...] } 구조
      let msg = '';
      if (parsed?.detail) {
        msg = stringifyFastApiError(parsed.detail);
      } else if (parsed?.message) {
        msg = typeof parsed.message === 'string' ? parsed.message : stringifyFastApiError(parsed.message);
      } else if (parsed?.error) {
        msg = typeof parsed.error === 'string' ? parsed.error : stringifyFastApiError(parsed.error);
      } else {
        msg = `HTTP ${res.status}`;
      }
      const err: ApiError = { status: res.status, message: msg, body: parsed };
      throw err;
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
// 여러 필드명 포맷으로 순차 시도 (백엔드 스키마 불확실 시)
// ============================================================
async function tryMultipleFormats<T>(
  path: string,
  formats: any[]
): Promise<T> {
  let lastError: ApiError | null = null;
  for (const body of formats) {
    try {
      return await apiCall<T>('POST', path, body, 30000);
    } catch (err: any) {
      lastError = err;
      // 422(validation)면 다음 포맷 시도, 그 외 에러(500 등)는 즉시 중단
      if (err?.status !== 422) throw err;
    }
  }
  throw lastError || { status: 500, message: '모든 포맷 시도 실패', body: null };
}

// ============================================================
// Public API
// ============================================================

/**
 * 영상 생성 요청 - 다양한 body 포맷 시도
 */
export async function startVideoGeneration(req: GenerateRealRequest): Promise<GenerateRealResponse> {
  // 후보 body 포맷들 (백엔드가 어떤 이름을 기대하는지 모르니 순차 시도)
  const duration_seconds = (req.duration || 10) * 60;

  const formats = [
    // Format 1: 현재 전달받은 그대로
    {
      keyword: req.keyword,
      tone: req.tone,
      duration: req.duration,
      mode: req.mode,
      custom_topic: req.custom_topic,
      category: req.category,
    },
    // Format 2: 최소 필드만 (keyword만)
    {
      keyword: req.keyword,
    },
    // Format 3: query 필드명
    {
      query: req.keyword,
      category: req.category,
    },
    // Format 4: topic 필드명
    {
      topic: req.keyword,
      duration_minutes: req.duration,
      category: req.category,
    },
    // Format 5: 영상 공통 스키마 추정
    {
      keyword: req.keyword,
      category: req.category || 'economy',
      duration_seconds,
      tone: req.tone || 'formal',
    },
  ];

  // null/undefined 필드 제거
  const cleanedFormats = formats.map((f) => {
    const cleaned: any = {};
    Object.keys(f).forEach((k) => {
      if ((f as any)[k] !== undefined && (f as any)[k] !== null && (f as any)[k] !== '') {
        cleaned[k] = (f as any)[k];
      }
    });
    return cleaned;
  });

  const res = await tryMultipleFormats<any>('/api/v1/video/generate-real', cleanedFormats);

  // job_id 추출 (다양한 필드명 지원)
  const jobId = res.job_id || res.jobId || res.id || res.task_id || res.taskId;
  if (!jobId) {
    throw {
      status: 500,
      message: `job_id 필드를 찾을 수 없음. 백엔드 응답 키: ${Object.keys(res || {}).join(', ')}`,
      body: res,
    } as ApiError;
  }

  return { ...res, job_id: jobId };
}

/**
 * 영상 생성 상태 조회
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return apiCall<JobStatusResponse>('GET', `/api/v1/video/status/${encodeURIComponent(jobId)}`, undefined, 15000);
}

/**
 * 영상 다운로드 URL 획득
 */
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

/**
 * 에러를 사용자용 문자열로 (React 렌더 안전)
 */
export function formatApiError(err: any): string {
  if (!err) return '알 수 없는 오류';
  if (typeof err === 'string') return err;

  // ApiError
  if (err.status !== undefined) {
    if (err.status === 0) return `네트워크 오류: ${err.message || ''}`.trim();
    if (err.status === 404) return '영상 작업을 찾을 수 없습니다 (job_id 확인 필요)';
    if (err.status === 402) return '크레딧이 부족합니다';
    if (err.status === 422) return `요청 형식이 맞지 않습니다: ${err.message || ''}`;
    if (err.status === 500) return `서버 오류: ${err.message || 'Internal Server Error'}`;
    return `오류 (${err.status}): ${err.message || ''}`;
  }

  // 일반 Error 객체
  if (err.message) return String(err.message);

  // 최후: JSON stringify
  try { return JSON.stringify(err); } catch { return String(err); }
}
