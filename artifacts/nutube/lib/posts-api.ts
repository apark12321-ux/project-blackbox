/**
 * NuTube Posts API — 공유 유틸리티
 * 읽기: 정적 파일(data/posts/) + Redis 병합 (Redis 우선)
 * 쓰기: Upstash Redis 전용 (Vercel 읽기전용 FS 대응)
 */

import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

// ─────────────────────────────────────────────
// Redis 클라이언트
// ─────────────────────────────────────────────

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url:   process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _redis;
}

const RK = {
  post:        (slug: string) => `nutube:post:${slug}`,
  trash:       (slug: string) => `nutube:trash:${slug}`,
  postsIndex:  'nutube:slugs',
  trashIndex:  'nutube:trash_slugs',
};

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────

export const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
export const TRASH_DIR  = path.join(process.cwd(), 'data', 'trash');

export const ALLOWED_CATEGORIES = ['algorithm', 'senior', 'aitools', 'monetization'] as const;
export type Category = typeof ALLOWED_CATEGORIES[number];

export const CATEGORY_LABELS: Record<string, string> = {
  algorithm:    '알고리즘',
  senior:       '시니어 사연 쇼츠',
  aitools:      'AI 도구',
  monetization: '수익화',
};

const KO_TO_EN: Record<string, string> = {
  '알고리즘': 'algorithm',
  '시니어': 'senior',
  '시니어 사연 쇼츠': 'senior',
  'AI 도구': 'aitools',
  'AI도구': 'aitools',
  'aitool': 'aitools',
  '수익화': 'monetization',
  '영상 채널 수익화': 'monetization',
  '업데이트': 'algorithm',
};

const FORBIDDEN_KEYWORDS = [
  '위영', 'Wiyoung', 'Starlight', '당근팀', 'Carrot Team',
  '마스터 매뉴얼', '배포용', 'GEMS',
  '알뜰폰', '비행기 모드', '공기계', '중고폰', '길들이기',
];

// ─────────────────────────────────────────────
// 인증
// ─────────────────────────────────────────────

export function checkAuth(request: NextRequest): { valid: boolean; method: string } {
  const API_KEY    = process.env.NUTUBE_API_KEY   || '';
  const BASIC_USER = process.env.NUTUBE_BASIC_USER || '';
  const BASIC_PASS = process.env.NUTUBE_BASIC_PASS || '';

  const auth         = request.headers.get('authorization') || '';
  const apiKeyHeader = request.headers.get('x-api-key')     || '';

  if (auth.startsWith('Bearer ') && API_KEY) {
    if (auth.substring(7) === API_KEY) return { valid: true, method: 'bearer' };
  }
  if (apiKeyHeader && API_KEY && apiKeyHeader === API_KEY) {
    return { valid: true, method: 'apikey' };
  }
  if (auth.startsWith('Basic ') && BASIC_USER && BASIC_PASS) {
    const decoded = Buffer.from(auth.substring(6), 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');
    if (user === BASIC_USER && pass === BASIC_PASS) {
      return { valid: true, method: 'basic' };
    }
  }
  return { valid: false, method: 'none' };
}

// ─────────────────────────────────────────────
// HTML → Markdown 변환
// ─────────────────────────────────────────────

export function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_: string, inner: string) =>
    inner.trim().split('\n').map((l: string) => `> ${l}`).join('\n') + '\n'
  );
  md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_: string, items: string) =>
    items.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
  );
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_: string, items: string) => {
    let idx = 1;
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${idx++}. $1\n`);
  });
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```\n');
  md = md.replace(/<[^>]+>/g, '');
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

// ─────────────────────────────────────────────
// Slug 생성
// ─────────────────────────────────────────────

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318Fa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

// ─────────────────────────────────────────────
// 읽기 시간 / 단어 수
// ─────────────────────────────────────────────

export function calcReadTime(body: string): string {
  const chars = body.replace(/\s+/g, '').length;
  const minutes = Math.ceil(chars / 400);
  return `${Math.max(1, minutes)}분`;
}

export function countWords(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

// ─────────────────────────────────────────────
// 보안 검사
// ─────────────────────────────────────────────

export function checkSecurity(post: any): { valid: boolean; error?: string } {
  const text = JSON.stringify(post);
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (text.includes(kw)) return { valid: false, error: 'Security violation: forbidden keyword' };
  }
  if (text.includes('박예준')) {
    return { valid: false, error: 'Personal name not allowed' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────────
// 입력값 정규화
// ─────────────────────────────────────────────

export function normalizePost(input: any): any {
  const post: any = { ...input };

  if (typeof input.content === 'string') {
    post.content = {
      type: 'markdown',
      body: input.content.includes('<') ? htmlToMarkdown(input.content) : input.content,
    };
  }

  if (input.body && !input.content) {
    post.content = {
      type: 'markdown',
      body: typeof input.body === 'string' && input.body.includes('<')
        ? htmlToMarkdown(input.body)
        : input.body,
    };
    delete post.body;
  }

  if (Array.isArray(input.tags)) post.tags = input.tags;

  if (post.category && KO_TO_EN[post.category]) {
    post.category = KO_TO_EN[post.category];
  }

  if (post.title) {
    post.slug = generateSlugFromTitle(post.title);
  }

  if (input.postStatus && !input.status) {
    post.status = input.postStatus;
    delete post.postStatus;
  }
  if (post.status === 'publish') post.status = 'published';

  if (input.seoDescription) {
    if (!post.seo) post.seo = {};
    post.seo.metaDescription = input.seoDescription;
    delete post.seoDescription;
  }

  if (post.category && !post.categoryLabel) {
    post.categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  }

  if (post.content?.body) {
    post.readTime  = post.readTime  || calcReadTime(post.content.body);
    post.wordCount = post.wordCount || countWords(post.content.body);
  }

  return post;
}

export function normalizeUpdates(input: any): any {
  const updates: any = { ...input };

  if (typeof input.content === 'string') {
    updates.content = {
      type: 'markdown',
      body: input.content.includes('<') ? htmlToMarkdown(input.content) : input.content,
    };
  }
  if (input.body && !input.content) {
    updates.content = {
      type: 'markdown',
      body: typeof input.body === 'string' && input.body.includes('<')
        ? htmlToMarkdown(input.body)
        : input.body,
    };
    delete updates.body;
  }
  if (Array.isArray(input.tags)) updates.tags = input.tags;
  if (updates.category && KO_TO_EN[updates.category]) {
    updates.category = KO_TO_EN[updates.category];
  }
  if (updates.category && !updates.categoryLabel) {
    updates.categoryLabel = CATEGORY_LABELS[updates.category] || updates.category;
  }
  if (input.postStatus && !input.status) {
    updates.status = input.postStatus;
    delete updates.postStatus;
  }
  if (updates.status === 'publish') updates.status = 'published';
  if (input.seoDescription) {
    if (!updates.seo) updates.seo = {};
    updates.seo.metaDescription = input.seoDescription;
    delete updates.seoDescription;
  }
  if (updates.content?.body) {
    updates.readTime  = calcReadTime(updates.content.body);
    updates.wordCount = countWords(updates.content.body);
  }
  return updates;
}

// ─────────────────────────────────────────────
// 유효성 검사
// ─────────────────────────────────────────────

export function validatePost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!post.slug)          errors.push('title is required to auto-generate slug');
  if (!post.title)         errors.push('title is required');
  if (!post.category)      errors.push('category is required');
  if (!post.content?.body) errors.push('content.body (or body) is required');

  if (!post.publishedAt) {
    post.publishedAt = new Date().toISOString().split('T')[0];
  }

  if (post.category && !ALLOWED_CATEGORIES.includes(post.category)) {
    errors.push(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (post.content?.body && post.content.body.length < 1500) {
    errors.push('content.body must be at least 1,500 characters');
  }

  const security = checkSecurity(post);
  if (!security.valid) errors.push(security.error!);

  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────
// 직렬화
// ─────────────────────────────────────────────

export function serializePost(p: any, opts: { includeContent?: boolean; fields?: string[] } = {}): any {
  const body = p.content?.body || '';
  const readTime  = p.readTime  || (body ? calcReadTime(body)  : '0분');
  const wordCount = p.wordCount || (body ? countWords(body)    : 0);

  const base: any = {
    slug:          p.slug,
    title:         p.title,
    subtitle:      p.subtitle,
    category:      p.category,
    categoryLabel: p.categoryLabel,
    status:        p.status,
    publishedAt:   p.publishedAt,
    updatedAt:     p.updatedAt,
    summary:       p.summary,
    readTime,
    wordCount,
    tags:          p.tags || [],
    imageUrl:      p.imageUrl,
    url:           `https://nutube.kr/blog/${p.slug}`,
  };

  if (opts.includeContent) {
    base.content = p.content;
    base.seo     = p.seo;
    base.author  = p.author;
  }

  if (opts.fields && opts.fields.length > 0) {
    const result: any = {};
    for (const f of opts.fields) {
      if (f in base) result[f] = base[f];
    }
    return result;
  }

  return base;
}

// ─────────────────────────────────────────────
// 정적 파일 읽기 (동기, 읽기전용 — Vercel에서도 정상 동작)
// ─────────────────────────────────────────────

export function readStaticPost(slug: string): any | null {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export function listStaticPosts(): any[] {
  try {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs.readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'))
      .map(f => {
        try { return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')); }
        catch { return null; }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// Redis 비동기 CRUD
// ─────────────────────────────────────────────

export async function readPost(slug: string): Promise<any | null> {
  const redis = getRedis();
  const cached = await redis.get<any>(RK.post(slug));
  if (cached) return cached;
  return readStaticPost(slug);
}

export async function writePost(post: any): Promise<void> {
  const redis = getRedis();
  await Promise.all([
    redis.set(RK.post(post.slug), post),
    redis.sadd(RK.postsIndex, post.slug),
  ]);
}

export async function removePost(slug: string): Promise<void> {
  const redis = getRedis();
  await Promise.all([
    redis.del(RK.post(slug)),
    redis.srem(RK.postsIndex, slug),
  ]);
}

export async function listAllPosts(opts: ListOptions = {}): Promise<any[]> {
  const redis = getRedis();

  // 정적 파일 포스트 (읽기전용 FS, Vercel에서도 OK)
  const staticPosts = listStaticPosts();
  const staticMap   = new Map<string, any>(staticPosts.map(p => [p.slug, p]));

  // Redis 동적 포스트
  const slugs = await redis.smembers(RK.postsIndex);
  const redisPosts: any[] = [];
  if (slugs.length > 0) {
    const items = await Promise.all(slugs.map(s => redis.get<any>(RK.post(s))));
    for (const p of items) { if (p) redisPosts.push(p); }
  }

  // 병합: Redis 포스트가 같은 slug면 정적 파일 override
  const merged = new Map(staticMap);
  for (const p of redisPosts) {
    if (p) merged.set(p.slug, p);
  }

  let posts = Array.from(merged.values());

  // status 필터
  if (!opts.status || opts.status === 'published') {
    posts = posts.filter(p => p.status === 'published');
  } else if (opts.status !== 'all') {
    posts = posts.filter(p => p.status === opts.status);
  }

  // category 필터
  if (opts.category) {
    posts = posts.filter(p => p.category === opts.category);
  }

  // tags 필터
  if (opts.tags && opts.tags.length > 0) {
    posts = posts.filter(p =>
      Array.isArray(p.tags) && opts.tags!.some(t => p.tags.includes(t))
    );
  }

  // 검색
  if (opts.search) {
    const q = opts.search.toLowerCase();
    posts = posts.filter(p => {
      const haystack = [p.title, p.subtitle, p.summary, p.content?.body, (p.tags || []).join(' ')]
        .filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  // 정렬
  const sortField = opts.sort || 'publishedAt';
  const dir = opts.order === 'asc' ? 1 : -1;
  posts.sort((a: any, b: any) => {
    const av = a[sortField] || '';
    const bv = b[sortField] || '';
    return av < bv ? -dir : av > bv ? dir : 0;
  });

  return posts;
}

// ─────────────────────────────────────────────
// 휴지통 Redis CRUD
// ─────────────────────────────────────────────

export async function readTrashPost(slug: string): Promise<any | null> {
  return getRedis().get<any>(RK.trash(slug));
}

export async function writeTrashPost(post: any): Promise<void> {
  const redis = getRedis();
  await Promise.all([
    redis.set(RK.trash(post.slug), post),
    redis.sadd(RK.trashIndex, post.slug),
  ]);
}

export async function removeTrashPost(slug: string): Promise<void> {
  const redis = getRedis();
  await Promise.all([
    redis.del(RK.trash(slug)),
    redis.srem(RK.trashIndex, slug),
  ]);
}

export async function listTrashPosts(): Promise<any[]> {
  const redis = getRedis();
  const slugs = await redis.smembers(RK.trashIndex);
  if (slugs.length === 0) return [];
  const items = await Promise.all(slugs.map(s => redis.get<any>(RK.trash(s))));
  return items.filter(Boolean);
}

export async function emptyTrash(): Promise<number> {
  const redis = getRedis();
  const slugs = await redis.smembers(RK.trashIndex);
  if (slugs.length === 0) return 0;
  await Promise.all([
    ...slugs.map(s => redis.del(RK.trash(s))),
    redis.del(RK.trashIndex),
  ]);
  return slugs.length;
}

export async function trashCount(): Promise<number> {
  return getRedis().scard(RK.trashIndex);
}

// ─────────────────────────────────────────────
// ListOptions 타입
// ─────────────────────────────────────────────

export interface ListOptions {
  category?: string;
  status?: string;
  search?: string;
  tags?: string[];
  sort?: string;
  order?: 'asc' | 'desc';
  includeContent?: boolean;
  fields?: string[];
}

// ─────────────────────────────────────────────
// 하위 호환 (더 이상 FS에 쓰지 않음)
// ─────────────────────────────────────────────

export function ensureDir(_dir: string) {
  // Vercel 읽기전용 FS — no-op (Redis 사용으로 불필요)
}
