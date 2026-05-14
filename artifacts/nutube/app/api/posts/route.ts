/**
 * GET  /api/posts  — 목록 조회 (검색·필터·정렬·페이지네이션)
 * POST /api/posts  — 글 생성 (BlogStudio / mathHWP 호환)
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  checkAuth, normalizePost, validatePost,
  listAllPosts, serializePost,
  POSTS_DIR, ensureDir,
} from '@/lib/posts-api';

// ─────────────────────────────────────────────
// GET /api/posts
// ─────────────────────────────────────────────
// Query params:
//   search=키워드        제목·본문 전체 검색
//   category=algorithm   카테고리 필터
//   tags=tag1,tag2       태그 필터 (OR)
//   status=published     published(기본)|draft|archived|all (all은 인증 필요)
//   sort=publishedAt     publishedAt(기본)|updatedAt|title|wordCount
//   order=desc           asc|desc(기본)
//   limit=20             최대 100
//   offset=0             오프셋 페이지네이션
//   cursor=slug          커서 기반 페이지네이션 (offset보다 빠름)
//   include=content      전체 본문 포함
//   fields=slug,title    선택 필드만 반환

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search   = searchParams.get('search')   || undefined;
  const category = searchParams.get('category') || undefined;
  const tagsRaw  = searchParams.get('tags')     || '';
  const tags     = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : undefined;
  const sort     = searchParams.get('sort')     || 'publishedAt';
  const order    = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
  const limit    = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset   = parseInt(searchParams.get('offset') || '0');
  const cursor   = searchParams.get('cursor')   || undefined;
  const include  = searchParams.get('include')  || '';
  const fieldsRaw = searchParams.get('fields')  || '';
  const fields   = fieldsRaw ? fieldsRaw.split(',').map(f => f.trim()).filter(Boolean) : undefined;

  // 비공개 상태 조회는 인증 필요
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
    const allPosts = listAllPosts({
      category, status, search,
      tags, sort, order,
      includeContent: include.includes('content'),
    });

    const total = allPosts.length;

    // 커서 페이지네이션: cursor slug 이후부터 반환
    let startIdx = offset;
    if (cursor) {
      const idx = allPosts.findIndex(p => p.slug === cursor);
      startIdx = idx === -1 ? 0 : idx + 1;
    }

    const page = allPosts.slice(startIdx, startIdx + limit);
    const lastItem = page[page.length - 1];

    const posts = page.map(p => serializePost(p, {
      includeContent: include.includes('content'),
      fields,
    }));

    return NextResponse.json({
      success: true,
      data: {
        total,
        count:    posts.length,
        limit,
        offset:   startIdx,
        hasMore:  startIdx + limit < total,
        nextCursor: lastItem ? lastItem.slug : null,
        posts,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/posts
// ─────────────────────────────────────────────
// Query params:
//   upsert=true   동일 slug 존재 시 409 대신 업데이트

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

    ensureDir(POSTS_DIR);
    const filePath = path.join(POSTS_DIR, `${post.slug}.json`);
    const exists   = fs.existsSync(filePath);

    if (exists && !upsert) {
      return NextResponse.json({
        success: false,
        error:   'Slug already exists — use ?upsert=true to update instead',
        slug:    post.slug,
        url:     `https://nutube.kr/blog/${post.slug}`,
      }, { status: 409 });
    }

    const now = new Date().toISOString();
    const existing = exists ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};

    const saved = {
      ...existing,
      ...post,
      author:    post.author    || existing.author    || '알고파트너스',
      status:    post.status    || existing.status    || 'published',
      createdAt: existing.createdAt || now,
      updatedAt: now,
    };

    fs.writeFileSync(filePath, JSON.stringify(saved, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      action:  exists ? 'updated' : 'created',
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
    }, { status: exists ? 200 : 201 });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
