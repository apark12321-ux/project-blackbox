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

function checkAuth(request: NextRequest): boolean {
  if (!API_KEY) return false;
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${API_KEY}`;
}

function checkSecurity(post: any): boolean {
  const text = JSON.stringify(post);
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (text.includes(kw)) return false;
  }
  if (text.includes('박예준')) return false;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found', slug: params.slug }, { status: 404 });
    }
    
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (post.status !== 'published') {
      return NextResponse.json({ error: 'Post not available' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }
  
  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found', slug: params.slug }, { status: 404 });
    }
    
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const updates = await request.json();
    
    if (updates.slug && updates.slug !== params.slug) {
      return NextResponse.json({ error: 'Cannot change slug' }, { status: 400 });
    }
    
    const merged = {
      ...existing,
      ...updates,
      slug: params.slug,
      updatedAt: new Date().toISOString(),
    };
    
    if (!checkSecurity(merged)) {
      return NextResponse.json({ error: 'Security violation' }, { status: 400 });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
    
    return NextResponse.json({
      success: true,
      slug: params.slug,
      url: `https://nutube.kr/blog/${params.slug}`,
      updatedAt: merged.updatedAt,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }
  
  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    fs.unlinkSync(filePath);
    
    return NextResponse.json({
      success: true,
      slug: params.slug,
      deletedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
