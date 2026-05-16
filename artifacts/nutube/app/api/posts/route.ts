/**
 * GET  /api/posts  — 목록 조회
 * POST /api/posts  — 글 생성 (BlogStudio / mathHWP 호환)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAuth, normalizePost, validatePost,
  listAllPosts, serializePost, readPost, writePost,
} from '@/lib/posts-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search    = searchParams.get('search')   || undefined;
  const category  = searchParams.get('category') || undefined;
  const tagsRaw   = searchParams.get('tags')     || '';
  const tags      = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : undefined;
  const sort      = searchParams.get('sort')     || 'publishedAt';
  const order     = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
  const limit     = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset    = parseInt(searchParams.get('offset') || '0');
  const cursor    = searchParams.get('cursor')   || undefined;
  const include   = searchParams.get('include')  || '';
  const fieldsRaw = searchParams.get('fields')   || '';
  const fields    = fieldsRaw ? fieldsRaw.split(',').map(f => f.trim()).filter(Boolean) : undefined;

  const requestedStatus = searchParams.get('status') || 'published';
  let status = requestedStatus;
  if (status !== 'published') {
    const auth = checkAuth(request);
    if (!auth.valid) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized — status filter requires authentication',
      }, { status: 401 });
    }
  }

  try {
    const allPosts = await listAllPosts({
      category, status, search,
      tags, sort, order,
      includeContent: include.includes('content'),
    });

    const total = allPosts.length;

    let startIdx = offset;
    if (cursor) {
      const idx = allPosts.findIndex(p => p.slug === cursor);
      startIdx = idx === -1 ? 0 : idx + 1;
    }

    const page    = allPosts.slice(startIdx, startIdx + limit);
    const lastItem = page[page.length - 1];

    const posts = page.map(p => serializePost(p, {
      includeContent: include.includes('content'),
      fields,
    }));

    return NextResponse.json({
      success: true,
      data: {
        total,
        count:      posts.length,
        limit,
        offset:     startIdx,
        hasMore:    startIdx + limit < total,
        nextCursor: lastItem ? lastItem.slug : null,
        posts,
      },
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
      error:   'Unauthorized',
      message: 'X-API-Key 헤더 또는 Bearer/Basic 인증이 필요합니다',
    }, { status: 401 });
  }

  const upsert = new URL(request.url).searchParams.get('upsert') === 'true';

  try {
    const input = await request.json();
    const post  = normalizePost(input);

    const { valid, errors } = validatePost(post);
    if (!valid) {
      return NextResponse.json({
        success: false,
        error:   'Validation failed',
        details: errors,
      }, { status: 400 });
    }

    const existing = await readPost(post.slug);

    if (existing && !upsert) {
      return NextResponse.json({
        success: false,
        error:   'Slug already exists — use ?upsert=true to update instead',
        slug:    post.slug,
        url:     `https://nutube.kr/blog/${post.slug}`,
      }, { status: 409 });
    }

    const now = new Date().toISOString();
    const saved = {
      ...(existing || {}),
      ...post,
      author:    post.author    || existing?.author    || '알고파트너스',
      status:    post.status    || existing?.status    || 'published',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    await writePost(saved);

    return NextResponse.json({
      success: true,
      action:  existing ? 'updated' : 'created',
      data: {
        slug:        saved.slug,
        url:         `https://nutube.kr/blog/${saved.slug}`,
        title:       saved.title,
        category:    saved.category,
        status:      saved.status,
        readTime:    saved.readTime,
        wordCount:   saved.wordCount,
        publishedAt: saved.publishedAt,
        createdAt:   saved.createdAt,
        updatedAt:   saved.updatedAt,
      },
    }, { status: existing ? 200 : 201 });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
