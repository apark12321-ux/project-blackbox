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

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization') || '';
  const apiKeyHeader = request.headers.get('x-api-key') || '';

  if (auth.startsWith('Bearer ') && API_KEY) {
    const token = auth.substring(7);
    if (token === API_KEY) return true;
  }

  if (apiKeyHeader && API_KEY && apiKeyHeader === API_KEY) {
    return true;
  }

  if (auth.startsWith('Basic ') && BASIC_USER && BASIC_PASS) {
    const decoded = Buffer.from(auth.substring(6), 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');
    if (user === BASIC_USER && pass === BASIC_PASS) return true;
  }

  return false;
}

function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
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

function normalizeUpdates(input: any): any {
  const updates: any = { ...input };

  if (input.body && !input.content) {
    updates.content = {
      type: 'markdown',
      body: typeof input.body === 'string' && input.body.includes('<')
        ? htmlToMarkdown(input.body)
        : input.body,
    };
    delete updates.body;
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

  return updates;
}

function checkSecurity(post: any): { valid: boolean; error?: string } {
  const text = JSON.stringify(post);
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (text.includes(kw)) return { valid: false, error: 'Security violation' };
  }
  if (text.includes('박예준')) {
    return { valid: false, error: 'Personal name not allowed' };
  }
  return { valid: true };
}

// ============================================================
// GET /api/posts/[slug] - 단일 조회
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
        slug: params.slug,
      }, { status: 404 });
    }

    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (post.status !== 'published') {
      return NextResponse.json({
        success: false,
        error: 'Post not available',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        url: `https://nutube.kr/blog/${post.slug}`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}

// ============================================================
// PUT /api/posts/[slug] - 전체 수정
// ============================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
    }, { status: 401 });
  }

  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
        slug: params.slug,
      }, { status: 404 });
    }

    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const updates = normalizeUpdates(await request.json());

    if (updates.slug && updates.slug !== params.slug) {
      return NextResponse.json({
        success: false,
        error: 'Cannot change slug',
      }, { status: 400 });
    }

    const merged = {
      ...existing,
      ...updates,
      slug: params.slug,
      updatedAt: new Date().toISOString(),
    };

    if (merged.category && !ALLOWED_CATEGORIES.includes(merged.category)) {
      return NextResponse.json({
        success: false,
        error: `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      }, { status: 400 });
    }

    if (merged.content?.body && merged.content.body.length < 1500) {
      return NextResponse.json({
        success: false,
        error: 'content.body must be at least 1,500 characters',
      }, { status: 400 });
    }

    const security = checkSecurity(merged);
    if (!security.valid) {
      return NextResponse.json({
        success: false,
        error: security.error,
      }, { status: 400 });
    }

    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: {
        slug: params.slug,
        url: `https://nutube.kr/blog/${params.slug}`,
        updatedAt: merged.updatedAt,
        title: merged.title,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/posts/[slug] - 부분 수정 (Blog Studio 호환)
// ============================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // PATCH는 PUT과 동일 동작 (부분 수정)
  return PUT(request, { params });
}

// ============================================================
// DELETE /api/posts/[slug] - 삭제
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
    }, { status: 401 });
  }

  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      data: {
        slug: params.slug,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}
