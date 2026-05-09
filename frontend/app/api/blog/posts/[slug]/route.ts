import { NextRequest, NextResponse } from 'next/server';
import {
  getPost,
  savePost,
  deletePost as deletePostFromKV,
} from '../../../../_lib/upstash';
import {
  checkAuth,
  normalizePost,
  checkSecurity,
  ALLOWED_CATEGORIES,
} from '../../../../_lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/posts/[slug] - 단일 가이드
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPost(params.slug);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
        slug: params.slug,
      }, { status: 404 });
    }

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

/**
 * PUT /api/posts/[slug] - 전체 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request).valid) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
    }, { status: 401 });
  }

  try {
    const existing = await getPost(params.slug);
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
        slug: params.slug,
      }, { status: 404 });
    }

    const input = await request.json();
    const updates = normalizePost(input);

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

    await savePost(merged);

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

/**
 * PATCH /api/posts/[slug] - 부분 수정 (PUT 과 동일)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return PUT(request, { params });
}

/**
 * DELETE /api/posts/[slug] - 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!checkAuth(request).valid) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
    }, { status: 401 });
  }

  try {
    const success = await deletePostFromKV(params.slug);
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
      }, { status: 404 });
    }

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
