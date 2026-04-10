import { useState, useEffect, useCallback, useRef } from "react";
import { useBlackboxStore } from "@/stores/blackbox-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function api(path: string, options?: RequestInit): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/v1/curation/categories")
      .then((res: any) => {
        const list = res.categories || res || [];
        setCategories(list.map((c: any) => ({
          id: c.slug || c.id,
          name: c.label_ko || c.name,
          icon: c.icon,
          cpm: c.cpm_range || c.cpm,
          description: c.description,
        })));
      })
      .catch(() => {
        setCategories([
          { id: "economy", name: "경제 / 재테크", icon: "📊", cpm: "$12~18", description: "주식, 부동산, 연금" },
          { id: "senior", name: "건강 / 시니어", icon: "🏥", cpm: "$15~22", description: "연금수령, 복지정책" },
          { id: "selfdev", name: "자기계발", icon: "🧠", cpm: "$8~14", description: "습관, 독서, 생산성" },
          { id: "tech", name: "IT / 테크", icon: "💻", cpm: "$10~16", description: "AI, 앱, 디지털" },
          { id: "life", name: "라이프", icon: "🌿", cpm: "$6~12", description: "요리, 여행, 인테리어" },
        ]);
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
      const data = await api(`/api/v1/curation/keywords/search`, {
        method: "POST",
        body: JSON.stringify({ category_slug: category }),
      });
      const list = data.keywords || data || [];
      setKeywords(list.map((k: any) => ({
        keyword: k.keyword,
        searchVolume: k.search_volume || 0,
        competitionCount: k.competition_count || 0,
        boiScore: k.blue_ocean_index || k.boi_score || 0,
        boiGrade: k.opportunity_grade || k.boi_grade || "C",
        momentum: k.trend_momentum || k.momentum || 0,
        estimatedCpm: k.estimated_cpm || 0,
        subScores: {
          gap: k.sub_scores?.gap_score || k.sub_scores?.gap || 0,
          momentum: k.sub_scores?.momentum_score || k.sub_scores?.momentum || 0,
          cpm: k.sub_scores?.cpm_score || k.sub_scores?.cpm || 0,
          volume: k.sub_scores?.volume_score || k.sub_scores?.volume || 0,
        },
      })));
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
    api(`/api/v1/curation/news/search`, {
      method: "POST",
      body: JSON.stringify({ keyword }),
    })
      .then((d: any) => {
        const list = d.articles || d || [];
        setNewsSources(list.map((n: any) => ({
          title: n.title,
          source: n.source,
          summary: n.summary,
          publishedAt: n.published_at || n.publishedAt || "",
          cpmGrade: n.cpm_grade || n.cpmGrade || "높음",
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, setNewsSources, setLoading]);
}

export function useScriptGenerate() {
  const { setScript, setLoading, setError } = useBlackboxStore();

  const generate = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api("/api/v1/script/generate", {
        method: "POST",
        body: JSON.stringify({
          keyword: params.keyword,
          category: params.category,
          news_summary: params.newsSummary,
          core_facts: params.coreFacts,
          opinion_seeds: params.opinionSeeds,
        }),
      });
      const script = {
        hookType: data.hook_type || data.hookType || "",
        opinionTone: data.opinion_tone || data.opinionTone || "",
        blocks: (data.blocks || []).map((b: any) => ({
          section: b.section,
          text: b.text,
          durationSec: b.duration_sec || b.durationSec || 0,
          subtitleHighlight: b.subtitle_highlight || b.subtitleHighlight || "",
        })),
        totalDurationSec: data.total_duration_sec || data.totalDurationSec || 0,
        dynamicIntro: data.dynamic_intro || "",
        dynamicOutro: data.dynamic_outro || "",
      };
      setScript(script);
      return script;
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

export function useVideoRender() {
  const { setVideoJob, setVideoPollingId, setLoading, setError, mode } = useBlackboxStore();

  const startRender = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api("/api/v1/video-edit/render", {
        method: "POST",
        body: JSON.stringify({
          keyword: params.keyword,
          category: params.category,
          mode,
          script_blocks: params.scriptBlocks,
        }),
      });
      setVideoJob({
        jobId: data.job_id || "",
        status: data.status || "done",
        avatarName: data.avatar_name || "",
        layoutChart: data.notebook_layout?.chart_type || "",
        layoutVariant: data.notebook_layout?.layout_variant || 1,
        ttsBlockCount: data.tts_block_count || 0,
        ffmpegCmdLength: 0,
        outputPath: data.output_path || "",
        estimatedMin: 0,
      });
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

export function useVideoPolling() {}

export function useShield() {
  const { setShield, setLoading, setError } = useBlackboxStore();

  const applyShield = useCallback(async (inputPath: string, params?: any) => {
    setLoading(true);
    try {
      const data = await api("/api/v1/shield/apply", {
        method: "POST",
        body: JSON.stringify({ input_path: inputPath }),
      });
      setShield({
        safetyScore: data.safety_report?.total_score || 0,
        safetyGrade: data.safety_report?.grade || "",
        passed: data.safety_report?.passed || false,
        factors: data.safety_report?.factors || [],
        uniqueId: data.variation_params?.unique_id || "",
        outputPath: data.output_path || "",
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

export function usePublish() {
  const { setPublish, setLoading, setError } = useBlackboxStore();

  const preparePublish = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const data = await api("/api/v1/publish/prepare", {
        method: "POST",
        body: JSON.stringify({
          channel_id: params.channelId,
          video_path: params.videoPath,
          keyword: params.keyword,
          category: params.category,
        }),
      });
      setPublish({
        syncStatus: data.algo_sync?.status || "",
        syncProgress: data.algo_sync?.sync_progress || 0,
        publishMode: data.publish_mode || "",
        titles: data.seo?.titles || [],
        hashtags: data.seo?.hashtags || [],
        schedule: data.schedule?.recommended_time || "",
        thumbnails: data.thumbnails || [],
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
