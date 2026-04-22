/**
 * Video API Client
 * 
 * 백엔드(Railway FastAPI)의 영상 생성 엔드포인트 호출 유틸
 * 
 * 주의: 백엔드 응답 구조가 문서와 다를 수 있으므로
 *       모든 호출에서 catch + 상세 에러 메시지 반환
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://project-blackbox-production.up.railway.app';

// ============================================================
// Types
// ============================================================
export interface GenerateRealRequest {
  keyword: string;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;   // minutes
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
  progress?: number;          // 0~100
  current_step?: string;
  logs?: string[];
  message?: string;
  error?: string;
  result?: {
    video_url?: string;
    download_url?: string;
    [key: string]: any;
  };
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
// Internal: fetch wrapper
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
      const err: ApiError = {
        status: res.status,
        message: parsed?.detail || parsed?.message || parsed?.error || `HTTP ${res.status}`,
        body: parsed,
      };
      throw err;
    }

    return parsed as T;
  } catch (e: any) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') {
      throw { status: 0, message: '요청 시간 초과 (30초)', body: null } as ApiError;
    }
    if (e?.status !== undefined) throw e;
    throw { status: 0, message: e?.message || '네트워크 오류', body: null } as ApiError;
  }
}

// ============================================================
// Public API
// ============================================================

/**
 * 영상 생성 요청 → job_id 반환
 * Primary:  POST /api/v1/video/generate-real
 */
export async function startVideoGeneration(req: GenerateRealRequest): Promise<GenerateRealResponse> {
  return apiCall<GenerateRealResponse>('POST', '/api/v1/video/generate-real', req, 30000);
}

/**
 * 영상 생성 상태 조회
 * GET /api/v1/video/status/{job_id}
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return apiCall<JobStatusResponse>('GET', `/api/v1/video/status/${encodeURIComponent(jobId)}`, undefined, 15000);
}

/**
 * 영상 다운로드 URL 획득
 * GET /api/v1/video/download/{job_id}
 */
export async function getDownloadUrl(jobId: string): Promise<DownloadResponse> {
  return apiCall<DownloadResponse>('GET', `/api/v1/video/download/${encodeURIComponent(jobId)}`, undefined, 15000);
}

// ============================================================
// Helpers
// ============================================================

/**
 * 다양한 응답 포맷에서 video URL을 최대한 추출
 */
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
      // Relative path → absolute 변환
      return `${API_BASE}${c.startsWith('/') ? '' : '/'}${c}`;
    }
  }
  return null;
}

/**
 * 에러 → 사용자용 메시지 변환
 */
export function formatApiError(err: any): string {
  if (!err) return '알 수 없는 오류';
  if (typeof err === 'string') return err;
  if (err.status === 0) return `네트워크 오류: ${err.message || ''}`.trim();
  if (err.status === 404) return '영상 작업을 찾을 수 없습니다 (job_id 확인 필요)';
  if (err.status === 500) return `서버 오류: ${err.message || 'Internal Server Error'}`;
  if (err.status === 402) return '크레딧이 부족합니다';
  return err.message || 'API 호출 실패';
}
