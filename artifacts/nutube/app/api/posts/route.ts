import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
const API_KEY = process.env.NUTUBE_API_KEY || '';
const BASIC_USER = process.env.NUTUBE_BASIC_USER || '';
const BASIC_PASS = process.env.NUTUBE_BASIC_PASS || '';

const FORBIDDEN_KEYWORDS = [
  '위영', 'Wiyoung', 'Starlight',
  '당근팀', 'Carrot Team',
  '마스터 매뉴얼', '배포용',
  'GEMS',
  '알뜰폰', '비행기 모드', '공기계', '중고폰',
  '길들이기',
];

const ALLOWED_CATEGORIES = ['algorithm', 'senior', 'aitools', 'monetization'];

function checkAuth(request: NextRequest): { valid: boolean; method: string } {
  const auth = request.headers.get('authorization') || '';
  const apiKeyHeader = request.headers.get('x-api-key') || '';

  if (auth.startsWith('Bearer ') && API_KEY) {
    const token = auth.substring(7);
    if (token === API_KEY) return { valid: true, method: 'bearer' };
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

function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match: string, items: string) => {
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  });
  md = md.replace(/<[^>]+>/g, '');
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

function normalizePost(input: any): any {
  const post: any = { ...input };

  if (input.body && !input.content) {
    post.content = {
      type: 'markdown',
      body: typeof input.body === 'string' && input.body.includes('<')
        ? htmlToMarkdown(input.body)
        : input.body,
    };
    delete post.body;
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
    const labels: Record<string, string> = {
      algorithm: '알고리즘',
      senior: '시니어 사연 쇼츠',
      aitools: 'AI 도구',
      monetization: '수익화',
    };
    post.categoryLabel = labels[post.category] || post.category;
  }

  return post;
}

/**
 * 제목에서 SEO 최적화 슬러그 자동 생성
 * 한국어 키워드를 URL에 포함시켜 AdSense/검색엔진 최적화
 * 예) "AI 자동 더빙으로 한국어 영상 만들기" → "ai-자동-더빙으로-한국어-영상-만들기"
 */
function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318Fa-z0-9\s-]/g, '') // 한글+영숫자+공백+하이픈만 허용
    .replace(/\s+/g, '-')      // 공백 → 하이픈
    .replace(/-+/g, '-')       // 연속 하이픈 제거
    .replace(/^-|-$/g, '');    // 양끝 하이픈 제거
}

function validatePost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // slug 없으면 title에서 자동 생성
  if (!post.slug && post.title) {
    post.slug = generateSlugFromTitle(post.title);
  }

  if (!post.slug) errors.push('slug is required (or provide title to auto-generate)');
  if (!post.title) errors.push('title is required');
  if (!post.category) errors.push('category is required');
  if (!post.content?.body) errors.push('content.body (or body) is required');
  if (!post.publishedAt) {
    post.publishedAt = new Date().toISOString().split('T')[0];
  }

  // 한국어 포함 슬러그 허용 (애드센스 SEO 최적화)
  if (post.slug && !/^[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318Fa-z0-9-]+$/.test(post.slug)) {
    errors.push('slug format invalid (use Korean, a-z, 0-9, hyphens only)');
  }

  if (post.category && !ALLOWED_CATEGORIES.includes(post.category)) {
    errors.push(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (post.content?.body && post.content.body.length < 1500) {
    errors.push('content.body must be at least 1,500 characters');
  }

  const text = JSON.stringify(post);
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (text.includes(kw)) {
      errors.push('Security violation: forbidden keyword detected');
      break;
    }
  }

  if (text.includes('박예준')) {
    errors.push('Personal name not allowed');
  }

  return { valid: errors.length === 0, errors };
}

function listPosts(filter?: { category?: string }): any[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  let posts = files.map(f => {
    try {
      return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));
    } catch {
      return null;
    }
  }).filter(p => p && p.status === 'published');

  if (filter?.category) {
    posts = posts.filter(p => p.category === filter.category);
  }

  posts.sort((a: any, b: any) => b.publishedAt.localeCompare(a.publishedAt));
  return posts;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const allPosts = listPosts({ category });
    const total = allPosts.length;
    const posts = allPosts.slice(offset, offset + limit).map((p: any) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      categoryLabel: p.categoryLabel,
      publishedAt: p.publishedAt,
      summary: p.summary,
      url: `https://nutube.kr/blog/${p.slug}`,
    }));

    return NextResponse.json({
      success: true,
      data: { total, page: Math.floor(offset / limit) + 1, limit, posts },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
      message: 'Provide Bearer Token, X-API-Key, or Basic Auth',
    }, { status: 401 });
  }

  try {
    const input = await request.json();
    const post = normalizePost(input);

    const { valid, errors } = validatePost(post);
    if (!valid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: errors,
      }, { status: 400 });
    }

    const filePath = path.join(POSTS_DIR, `${post.slug}.json`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Slug already exists',
        slug: post.slug,
      }, { status: 409 });
    }

    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    const now = new Date().toISOString();
    const newPost = {
      ...post,
      author: post.author || '알고파트너스',
      status: post.status || 'published',
      createdAt: now,
      updatedAt: now,
    };

    fs.writeFileSync(filePath, JSON.stringify(newPost, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: {
        slug: post.slug,
        url: `https://nutube.kr/blog/${post.slug}`,
        createdAt: now,
        title: post.title,
        category: post.category,
      },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}
