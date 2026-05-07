import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
const API_KEY = process.env.NUTUBE_API_KEY || '';

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
  if (!API_KEY) return false;
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  return auth === `Bearer ${API_KEY}`;
}

function checkSecurity(post: any): { valid: boolean; error?: string } {
  const allText = JSON.stringify(post);
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (allText.includes(keyword)) {
      return { valid: false, error: 'Security violation' };
    }
  }
  if (allText.includes('박예준')) {
    return { valid: false, error: 'Personal name not allowed' };
  }
  return { valid: true };
}

function getPostPath(slug: string): string {
  return path.join(POSTS_DIR, `${slug}.json`);
}

function readPost(slug: string): any {
  const fp = getPostPath(slug);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

function listPostsForIndex(): any[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  return files.map(f => readPost(f.replace('.json', ''))).filter(p => p && p.status === 'published');
}

function updateIndex(): void {
  const all = listPostsForIndex();
  all.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const index = {
    total: all.length,
    lastUpdated: new Date().toISOString().split('T')[0],
    posts: all.map(p => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      categoryLabel: p.categoryLabel,
      publishedAt: p.publishedAt,
      summary: p.summary,
      featured: p.featured || false,
    })),
  };
  fs.writeFileSync(
    path.join(POSTS_DIR, '_index.json'),
    JSON.stringify(index, null, 2),
    'utf-8'
  );
}

// ============================================
// GET /api/posts/[slug]
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = readPost(params.slug);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found', slug: params.slug },
        { status: 404 }
      );
    }

    if (post.status !== 'published') {
      return NextResponse.json(
        { error: 'Post not available', slug: params.slug },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/posts/[slug]
// ============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }

  try {
    const existing = readPost(params.slug);
    if (!existing) {
      return NextResponse.json(
        { error: 'Post not found', slug: params.slug },
        { status: 404 }
      );
    }

    const updates = await request.json();

    // slug 변경 X
    if (updates.slug && updates.slug !== params.slug) {
      return NextResponse.json(
        { error: 'Cannot change slug. Delete and create new post.' },
        { status: 400 }
      );
    }

    // 카테고리 검증
    if (updates.category && !ALLOWED_CATEGORIES.includes(updates.category)) {
      return NextResponse.json(
        { error: `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    // 본문 길이
    if (updates.content?.body && updates.content.body.length < 1500) {
      return NextResponse.json(
        { error: 'content.body must be at least 1,500 characters' },
        { status: 400 }
      );
    }

    const merged = {
      ...existing,
      ...updates,
      slug: params.slug,
      updatedAt: new Date().toISOString(),
    };

    // 보안 점검
    const security = checkSecurity(merged);
    if (!security.valid) {
      return NextResponse.json(
        { error: security.error },
        { status: 400 }
      );
    }

    fs.writeFileSync(
      getPostPath(params.slug),
      JSON.stringify(merged, null, 2),
      'utf-8'
    );
    updateIndex();

    return NextResponse.json({
      success: true,
      slug: params.slug,
      url: `https://nutube.kr/blog/${params.slug}`,
      updatedAt: merged.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/posts/[slug]
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }

  try {
    const fp = getPostPath(params.slug);
    if (!fs.existsSync(fp)) {
      return NextResponse.json(
        { error: 'Post not found', slug: params.slug },
        { status: 404 }
      );
    }

    fs.unlinkSync(fp);
    updateIndex();

    return NextResponse.json({
      success: true,
      slug: params.slug,
      deletedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
