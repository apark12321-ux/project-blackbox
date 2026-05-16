/**
 * GET    /api/posts/[slug]  — 단일 글 조회
 * PUT    /api/posts/[slug]  — 전체 수정
 * PATCH  /api/posts/[slug]  — 부분 수정
 * DELETE /api/posts/[slug]  — 소프트 삭제 (기본) / 영구 삭제 (?permanent=true)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAuth, normalizeUpdates, checkSecurity,
  readPost, writePost, removePost,
  writeTrashPost, serializePost,
  listAllPosts,
  ALLOWED_CATEGORIES,
  calcReadTime, countWords,
} from '@/lib/posts-api';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const allowDraft = searchParams.get('allow_draft') === 'true';
  const relatedN   = parseInt(searchParams.get('related') || '0');

  try {
    const post = await readPost(slug);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found', slug }, { status: 404 });
    }

    if (post.status !== 'published') {
      if (!allowDraft) {
        return NextResponse.json({ success: false, error: 'Post not available' }, { status: 404 });
      }
      const auth = checkAuth(request);
      if (!auth.valid) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }

    const data: any = { ...post, url: `https://nutube.kr/blog/${post.slug}` };

    if (relatedN > 0) {
      const all = await listAllPosts({ status: 'published' });
      data.related = all
        .filter((p: any) => p.slug !== post.slug && p.category === post.category)
        .sort((a: any, b: any) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, relatedN)
        .map((p: any) => serializePost(p));
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

async function handleUpdate(request: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await readPost(slug);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Post not found', slug }, { status: 404 });
    }

    const updates = normalizeUpdates(await request.json());

    if (updates.slug && updates.slug !== slug) {
      return NextResponse.json({ success: false, error: 'slug 변경은 불가합니다' }, { status: 400 });
    }

    const merged: any = {
      ...existing,
      ...updates,
      slug,
      updatedAt: new Date().toISOString(),
    };

    if (merged.category && !ALLOWED_CATEGORIES.includes(merged.category)) {
      return NextResponse.json({
        success: false,
        error:   `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      }, { status: 400 });
    }

    if (merged.content?.body && merged.content.body.length < 1500) {
      return NextResponse.json({
        success: false,
        error:   'content.body must be at least 1,500 characters',
      }, { status: 400 });
    }

    if (updates.content?.body) {
      merged.readTime  = calcReadTime(updates.content.body);
      merged.wordCount = countWords(updates.content.body);
    }

    const security = checkSecurity(merged);
    if (!security.valid) {
      return NextResponse.json({ success: false, error: security.error }, { status: 400 });
    }

    await writePost(merged);

    return NextResponse.json({
      success: true,
      data: {
        slug,
        url:       `https://nutube.kr/blog/${slug}`,
        title:     merged.title,
        status:    merged.status,
        readTime:  merged.readTime,
        wordCount: merged.wordCount,
        updatedAt: merged.updatedAt,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, ctx: Ctx)   { return handleUpdate(request, ctx); }
export async function PATCH(request: NextRequest, ctx: Ctx) { return handleUpdate(request, ctx); }

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const permanent = new URL(request.url).searchParams.get('permanent') === 'true';

  try {
    const post = await readPost(slug);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const deletedAt = new Date().toISOString();

    if (permanent) {
      await removePost(slug);
      return NextResponse.json({
        success: true,
        action:  'permanently_deleted',
        data:    { slug, deletedAt },
      });
    }

    const trashed = { ...post, status: 'archived', deletedAt };
    await Promise.all([
      writeTrashPost(trashed),
      removePost(slug),
    ]);

    return NextResponse.json({
      success: true,
      action:  'moved_to_trash',
      data: {
        slug,
        deletedAt,
        restore: `POST /api/posts/${slug}/restore`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
