/**
 * NuTube Posts API — 공유 유틸리티
 * 모든 /api/posts 라우트가 이 모듈을 사용합니다.
 */

import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

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
// 읽기 시간 / 단어 수 자동 계산
// ─────────────────────────────────────────────

export function calcReadTime(body: string): string {
  // 한국어 평균 독서 속도: 분당 400자
  const chars = body.replace(/\s+/g, '').length;
  const minutes = Math.ceil(chars / 400);
  return `${Math.max(1, minutes)}분`;
}

export function countWords(body: string): number {
  // 한국어: 어절 기준 (공백 구분), 영어: 단어 기준
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
// 입력값 정규화 (BlogStudio / mathHWP 모두 지원)
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

  // BlogStudio 영문 slug 무시 — 항상 제목 기반 한국어 URL 생성
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
// 데이터 조회
// ─────────────────────────────────────────────

export interface ListOptions {
  category?: string;
  status?: string;           // 'published' | 'draft' | 'archived' | 'all'
  search?: string;           // 제목·내용 키워드
  tags?: string[];
  sort?: string;             // 'publishedAt' | 'updatedAt' | 'title' | 'wordCount'
  order?: 'asc' | 'desc';
  includeContent?: boolean;
  fields?: string[];
}

export function readPost(slug: string): any | null {
  const filePath = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export function listAllPosts(opts: ListOptions = {}): any[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'));

  let posts = files.map(f => {
    try {
      return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));
    } catch {
      return null;
    }
  }).filter(Boolean);

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

  // 검색 (제목 + 부제목 + 요약 + 본문)
  if (opts.search) {
    const q = opts.search.toLowerCase();
    posts = posts.filter(p => {
      const haystack = [
        p.title, p.subtitle, p.summary,
        p.content?.body,
        (p.tags || []).join(' '),
      ].filter(Boolean).join(' ').toLowerCase();
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

export function serializePost(p: any, opts: { includeContent?: boolean; fields?: string[] } = {}): any {
  // 기존 포스트에 readTime/wordCount 없으면 본문에서 실시간 계산
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
// 디렉토리 보장
// ─────────────────────────────────────────────

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
