// NuTube Upstash Redis 클라이언트
// Vercel 환경 변수 자동 사용:
// - KV_REST_API_URL
// - KV_REST_API_TOKEN

import { Redis } from '@upstash/redis';

// Vercel 자동 환경 변수
export const redis = Redis.fromEnv();

// Key 패턴
export const KEY_PATTERNS = {
  POST: (slug: string) => `post:${slug}`,
  POST_LIST: 'posts:list', // 전체 목록 (slug 배열)
  POSTS_BY_CATEGORY: (cat: string) => `posts:category:${cat}`,
  CATEGORIES: 'categories',
};

// 가이드 데이터 타입
export interface GuidePost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  updatedAt?: string;
  createdAt?: string;
  author?: string;
  kicker?: string;
  summary: string;
  content: {
    type: string;
    body: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  tags?: string[];
  relatedPosts?: string[];
  status: string;
  featured?: boolean;
}

// CRUD 함수

/**
 * 가이드 1편 저장
 */
export async function savePost(post: GuidePost): Promise<void> {
  // 1. 가이드 본문 저장
  await redis.set(KEY_PATTERNS.POST(post.slug), JSON.stringify(post));
  
  // 2. 전체 목록에 slug 추가 (sadd = 중복 X)
  await redis.sadd(KEY_PATTERNS.POST_LIST, post.slug);
  
  // 3. 카테고리별 목록에 slug 추가
  await redis.sadd(KEY_PATTERNS.POSTS_BY_CATEGORY(post.category), post.slug);
}

/**
 * 가이드 1편 조회
 */
export async function getPost(slug: string): Promise<GuidePost | null> {
  const data = await redis.get(KEY_PATTERNS.POST(slug));
  if (!data) return null;
  
  // Upstash 가 자동 파싱하지만, 문자열일 수도 있음
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as GuidePost;
    } catch {
      return null;
    }
  }
  return data as GuidePost;
}

/**
 * 가이드 1편 삭제
 */
export async function deletePost(slug: string): Promise<boolean> {
  const post = await getPost(slug);
  if (!post) return false;
  
  // 1. 가이드 본문 삭제
  await redis.del(KEY_PATTERNS.POST(slug));
  
  // 2. 전체 목록에서 제거
  await redis.srem(KEY_PATTERNS.POST_LIST, slug);
  
  // 3. 카테고리별 목록에서 제거
  await redis.srem(KEY_PATTERNS.POSTS_BY_CATEGORY(post.category), slug);
  
  return true;
}

/**
 * 모든 slug 목록 조회
 */
export async function getAllSlugs(): Promise<string[]> {
  const slugs = await redis.smembers(KEY_PATTERNS.POST_LIST);
  return slugs as string[];
}

/**
 * 카테고리별 slug 목록
 */
export async function getSlugsByCategory(category: string): Promise<string[]> {
  const slugs = await redis.smembers(KEY_PATTERNS.POSTS_BY_CATEGORY(category));
  return slugs as string[];
}

/**
 * 모든 가이드 조회 (목록용 - summary 정보만)
 */
export async function getAllPosts(): Promise<GuidePost[]> {
  const slugs = await getAllSlugs();
  if (slugs.length === 0) return [];
  
  const keys = slugs.map(s => KEY_PATTERNS.POST(s));
  const data = await redis.mget(...keys);
  
  return data
    .filter(d => d !== null)
    .map(d => {
      if (typeof d === 'string') {
        try { return JSON.parse(d) as GuidePost; } catch { return null; }
      }
      return d as GuidePost;
    })
    .filter((p): p is GuidePost => p !== null && p.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * 카테고리별 가이드 조회
 */
export async function getPostsByCategory(category: string): Promise<GuidePost[]> {
  const slugs = await getSlugsByCategory(category);
  if (slugs.length === 0) return [];
  
  const keys = slugs.map(s => KEY_PATTERNS.POST(s));
  const data = await redis.mget(...keys);
  
  return data
    .filter(d => d !== null)
    .map(d => {
      if (typeof d === 'string') {
        try { return JSON.parse(d) as GuidePost; } catch { return null; }
      }
      return d as GuidePost;
    })
    .filter((p): p is GuidePost => p !== null && p.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * 가이드 존재 여부
 */
export async function postExists(slug: string): Promise<boolean> {
  const exists = await redis.exists(KEY_PATTERNS.POST(slug));
  return exists === 1;
}

/**
 * 카테고리 라벨
 */
export const CATEGORY_LABELS: Record<string, string> = {
  algorithm: '알고리즘',
  senior: '시니어 사연 쇼츠',
  aitools: 'AI 도구',
  monetization: '수익화',
};

export const ALLOWED_CATEGORIES = ['algorithm', 'senior', 'aitools', 'monetization'];
