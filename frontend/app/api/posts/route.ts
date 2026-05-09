import { NextRequest, NextResponse } from 'next/server';
import {
  savePost,
  getAllPosts,
  getPostsByCategory,
  postExists,
  CATEGORY_LABELS,
} from '../../_lib/upstash';
import {
  checkAuth,
  normalizePost,
  validatePost,
} from '../../_lib/security';

// 동적 처리 - 캐시 X
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/posts - 가이드 목록
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const allPosts = category
      ? await getPostsByCategory(category)
      : await getAllPosts();
    
    const total = allPosts.length;
    const posts = allPosts.slice(offset, offset + limit).map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      categoryLabel: p.categoryLabel || CATEGORY_LABELS[p.category],
      publishedAt: p.publishedAt,
      summary: p.summary,
      url: `https://nutube.kr/blog/${p.slug}`,
    }));

    return NextResponse.json({
      success: true,
      data: {
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        posts,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/posts - 가이드 등록
 */
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

    // 중복 체크
    const exists = await postExists(post.slug);
    if (exists) {
      return NextResponse.json({
        success: false,
        error: 'Slug already exists',
        slug: post.slug,
      }, { status: 409 });
    }

    const now = new Date().toISOString();
    const newPost = {
      ...post,
      author: post.author || '알고파트너스',
      status: post.status || 'published',
      createdAt: now,
      updatedAt: now,
    };

    // Upstash Redis 저장
    await savePost(newPost);

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
