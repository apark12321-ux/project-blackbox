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
  return auth === `Bearer ${API_KEY}`;
}

function validatePost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!post.slug) errors.push('slug is required');
  if (!post.title) errors.push('title is required');
  if (!post.category) errors.push('category is required');
  if (!post.content?.body) errors.push('content.body is required');
  if (!post.publishedAt) errors.push('publishedAt is required');
  
  if (post.slug && !/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push('slug format invalid');
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
      errors.push('Security violation');
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
    }));
    
    return NextResponse.json({
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      posts,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }
  
  try {
    const post = await request.json();
    
    const { valid, errors } = validatePost(post);
    if (!valid) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }
    
    const filePath = path.join(POSTS_DIR, `${post.slug}.json`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Slug already exists', slug: post.slug }, { status: 409 });
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
      slug: post.slug,
      url: `https://nutube.kr/blog/${post.slug}`,
      createdAt: now,
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
