/**
 * Project Blackbox — API Client & React Hooks
 * 
 * 5개 모듈의 API를 호출하는 통합 클라이언트와 React hooks.
 * B-2(영상편집)만 별도 서버(video_api:8001)로 라우팅됩니다.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import type {
  KeywordResult, NewsSource, ScriptBlock,
  ScriptResult, VideoJobResult, ShieldResult, PublishResult,
} from "@/stores/blackbox-store";
import { useBlackboxStore } from "@/stores/blackbox-store";

// ── Base URL ──
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

// ═══════════════════════════════════════
//  Module A: Curation Hooks
// ═══════════════════════════════════════

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<any[]>("/api/v1/categories")
      .then((data) => setCategories(data))
      .catch(() => {
        // Fallback: static categories
        setCategories([
          { id: "economy", name: "경제 / 재테크", icon: "📊", cpm: "$12~18", description: "주식, 부동산, 연금" },
          { id: "senior", name: "건강 / 시니어", icon: "🏥", cpm: "$15~22", description: "연금수령, 복지정책" },
          { id: "selfdev", name: "자기계발", icon: "🧠", cpm: "$8~14", description: "습관, 독서, 생산성" },
          { id: "tech", name: "IT / 테크", icon: "💻", cpm: "$10~16", description: "AI, 앱, 디지털" },
          { id: "life", name: "라이프", icon: "🌿", cpm: "$6~12", description: "요리, 여행, 인테리어" },
        ] as any);
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

export function useKeywordSearch(category: string | null) {
  const { setKeywords, setLoading, setError } = useBlackboxStore();

  const search = useCallback(async () => {
    if (!category) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ keywords: KeywordResult[] }>(
        `/api/v1/keywords/search?category=${category}`
      );
      setKeywords(data.keywords);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category, setKeywords, setLoading, setError]);

  useEffect(() => { search(); }, [search]);
}

export function useNewsSearch(keyword: string | null) {
  const { setNewsSources, setLoading } = useBlackboxStore();

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    api<{ articles: NewsSource[] }>(`/api/v1/news/search?keyword=${encodeURIComponent(keyword)}`)
      .then((d) => setNewsSources(d.articles))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, setNewsSources, setLoading]);
}

// ═══════════════════════════════════════
//  Module B: Script Hooks
// ═══════════════════════════════════════

export function useScriptGenerate() {
  const { setScript, setLoading, setError } = useBlackboxStore();

  const generate = useCallback(async (params: {
    keyword: string;
    category: string;
    newsSummary: string;
    coreFacts: string[];
    opinionSeeds: string[];
    targetDuration?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<ScriptResult>("/api/v1/script/generate", {
        method: "POST",
        body: JSON.stringify({
          keyword: params.keyword,
          category: params.category,
          news_summary: params.newsSummary,
          core_facts: params.coreFacts,
          opinion_seeds: params.opinionSeeds,
          target_duration_sec: params.targetDuration || 180,
        }),
      });
      setScript(data);
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setScript, setLoading, setError]);

  const regenerateHook = useCallback(async (keyword: string, category: string, excludeType: string) => {
    return api("/api/v1/script/regenerate-hook", {
      method: "POST",
      body: JSON.stringify({ keyword, category, exclude_type: excludeType }),
    });
  }, []);

  const regenerateOpinion = useCallback(async (keyword: string, excludeTone: string) => {
    return api("/api/v1/script/regenerate-opinion", {
      method: "POST",
      body: JSON.stringify({ keyword, exclude_tone: excludeTone }),
    });
  }, []);

  return { generate, regenerateHook, regenerateOpinion };
}

// ═══════════════════════════════════════
//  Module B-2: Video Edit Hooks
// ═══════════════════════════════════════

export function useVideoRender() {
  const { setVideoJob, setVideoPollingId, setLoading, setError, mode } = useBlackboxStore();

  const startRender = useCallback(async (params: {
    keyword: string;
    category: string;
    scriptBlocks: ScriptBlock[];
    avatarId?: string;
    coreFacts?: string[];
    totalDuration?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<any>("/api/v1/video-edit/render", {
        method: "POST",
        body: JSON.stringify({
          keyword: params.keyword,
          category: params.category,
          mode,
          avatar_id: params.avatarId || "",
          script_blocks: params.scriptBlocks.map((b) => ({
            section: b.section,
            text: b.text,
            duration_sec: b.durationSec,
            subtitle_highlight: b.subtitleHighlight,
          })),
          core_facts: params.coreFacts || [],
          total_duration_sec: params.totalDuration || 180,
        }),
      });
      setVideoJob({
        jobId: data.job_id,
        status: data.status,
        avatarName: data.avatar_name,
        layoutChart: data.notebook_layout?.chart_type || "",
        layoutVariant: data.notebook_layout?.layout_variant || 1,
        ttsBlockCount: data.tts_block_count,
        ffmpegCmdLength: data.ffmpeg_cmd?.length || 0,
        outputPath: data.output_path,
        estimatedMin: data.estimated_duration_min,
      });
      // 비동기 작업이면 폴링 시작
      if (data.status === "processing") {
        setVideoPollingId(data.job_id);
      }
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [mode, setVideoJob, setVideoPollingId, setLoading, setError]);

  return { startRender };
}

/** B-2 영상 렌더링 진행률 폴링 */
export function useVideoPolling() {
  const { videoPollingId, setVideoJob, setVideoPollingId } = useBlackboxStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!videoPollingId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const data = await api<any>(`/api/v1/video-edit/status/${videoPollingId}`);
        if (data.status === "done" || data.status === "error") {
          setVideoJob({
            jobId: data.job_id,
            status: data.status,
            avatarName: data.avatar_name || "",
            layoutChart: "",
            layoutVariant: 0,
            ttsBlockCount: 0,
            ffmpegCmdLength: 0,
            outputPath: data.output_path || "",
            estimatedMin: 0,
          });
          setVideoPollingId(null);
        }
      } catch {
        // keep polling
      }
    }, 3000); // 3초 간격

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videoPollingId, setVideoJob, setVideoPollingId]);
}

// ═══════════════════════════════════════
//  Module C: Shield Hooks
// ═══════════════════════════════════════

export function useShield() {
  const { setShield, setLoading, setError } = useBlackboxStore();

  const applyShield = useCallback(async (inputPath: string, params?: {
    hasAvatar?: boolean;
    hasOpinion?: boolean;
    scriptSections?: number;
    totalDuration?: number;
    coreFactsCount?: number;
  }) => {
    setLoading(true);
    try {
      const data = await api<any>("/api/v1/shield/apply", {
        method: "POST",
        body: JSON.stringify({
          input_path: inputPath,
          has_avatar: params?.hasAvatar ?? true,
          has_opinion: params?.hasOpinion ?? true,
          script_sections: params?.scriptSections ?? 5,
          total_duration_sec: params?.totalDuration ?? 180,
          core_facts_count: params?.coreFactsCount ?? 3,
        }),
      });
      setShield({
        safetyScore: data.safety_report.total_score,
        safetyGrade: data.safety_report.grade,
        passed: data.safety_report.passed,
        factors: data.safety_report.factors,
        uniqueId: data.variation_params.unique_id,
        outputPath: data.output_path,
      });
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setShield, setLoading, setError]);

  return { applyShield };
}

// ═══════════════════════════════════════
//  Module D: Publish Hooks
// ═══════════════════════════════════════

export function usePublish() {
  const { setPublish, setLoading, setError } = useBlackboxStore();

  const preparePublish = useCallback(async (params: {
    channelId: string;
    videoPath: string;
    keyword: string;
    category: string;
    hoursSinceLastUpload?: number;
  }) => {
    setLoading(true);
    try {
      const data = await api<any>("/api/v1/publish/prepare", {
        method: "POST",
        body: JSON.stringify({
          channel_id: params.channelId,
          video_path: params.videoPath,
          keyword: params.keyword,
          category: params.category,
          hours_since_last_upload: params.hoursSinceLastUpload ?? 30,
        }),
      });
      setPublish({
        syncStatus: data.algo_sync.status,
        syncProgress: data.algo_sync.sync_progress,
        publishMode: data.publish_mode,
        titles: data.seo.titles,
        hashtags: data.seo.hashtags,
        schedule: data.schedule.recommended_time,
        thumbnails: data.thumbnails,
      });
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setPublish, setLoading, setError]);

  return { preparePublish };
}
