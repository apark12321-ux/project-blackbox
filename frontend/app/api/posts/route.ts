import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ============================================
// 공통 설정
// ============================================

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

// ============================================
// 인증
// ============================================

function checkAuth(request: NextRequest): boolean {
  if (!API_KEY) return false;
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  return auth === `Bearer ${API_KEY}`;
}

// ============================================
// 검증
// ============================================

function validatePost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!post.slug) errors.push('slug is required');
  if (!post.title) errors.push('title is required');
  if (!post.subtitle) errors.push('subtitle is required');
  if (!post.category) errors.push('category is required');
  if (!post.content?.body) errors.push('content.body is required');
  if (!post.publishedAt) errors.push('publishedAt is required');

  if (post.slug && !/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push('slug must contain only lowercase letters, numbers, and hyphens');
  }

  if (post.category && !ALLOWED_CATEGORIES.includes(post.category)) {
    errors.push(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (post.title && post.title.length > 100) {
    errors.push('title must be 100 characters or less');
  }

  if (post.content?.body && post.content.body.length < 1500) {
    errors.push('content.body must be at least 1,500 characters');
  }

  // 박 대표님 자산 보안
  const allText = JSON.stringify(post);
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (allText.includes(keyword)) {
      errors.push(`Security violation: forbidden keyword detected`);
      break;
    }
  }

  if (allText.includes('박예준')) {
    errors.push('Personal name is not allowed');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================
// 파일 시스템
// ============================================

function postExists(slug: string): boolean {
  return fs.existsSync(path.join(POSTS_DIR, `${slug}.json`));
}

function readPost(slug: string): any {
  const filePath = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writePost(slug: string, post: any): void {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
  fs.writeFileSync(
    path.join(POSTS_DIR, `${slug}.json`),
    JSON.stringify(post, null, 2),
    'utf-8'
  );
}

function listPosts(filter?: { category?: string }): any[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  let posts = files.map(f => readPost(f.replace('.json', ''))).filter(p => p);

  if (filter?.category) {
    posts = posts.filter(p => p.category === filter.category);
  }
  posts = posts.filter(p => p.status === 'published');
  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return posts;
}

function updateIndex(): void {
  const allPosts = listPosts();
  const index = {
    total: allPosts.length,
    lastUpdated: new Date().toISOString().split('T')[0],
    posts: allPosts.map(p => ({
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
// GET /api/posts (목록)
// ============================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const allPosts = listPosts({ category });
    const total = allPosts.length;
    const posts = allPosts.slice(offset, offset + limit).map(p => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      categoryLabel: p.categoryLabel,
      publishedAt: p.publishedAt,
      summary: p.summary,
    }));

    return NextResponse.json({
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      posts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/posts (등록)
// ============================================

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }

  try {
    const post = await request.json();

    const { valid, errors } = validatePost(post);
    if (!valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    if (postExists(post.slug)) {
      return NextResponse.json(
        { error: 'Slug already exists', slug: post.slug },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newPost = {
      ...post,
      author: post.author || '알고파트너스',
      status: post.status || 'published',
      createdAt: now,
      updatedAt: now,
    };

    writePost(post.slug, newPost);
    updateIndex();

    return NextResponse.json(
      {
        success: true,
        slug: post.slug,
        url: `https://nutube.kr/blog/${post.slug}`,
        createdAt: now,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
