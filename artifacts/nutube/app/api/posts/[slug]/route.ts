/**
 * GET    /api/posts/[slug]  — 단일 글 조회
 * PUT    /api/posts/[slug]  — 전체 수정
 * PATCH  /api/posts/[slug]  — 부분 수정
 * DELETE /api/posts/[slug]  — 소프트 삭제 (기본) / 영구 삭제 (?permanent=true)
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  checkAuth, normalizeUpdates, checkSecurity, validatePost,
  readPost, serializePost,
  POSTS_DIR, TRASH_DIR, ALLOWED_CATEGORIES, ensureDir,
  calcReadTime, countWords,
} from '@/lib/posts-api';

type Ctx = { params: { slug: string } };

// ─────────────────────────────────────────────
// GET /api/posts/[slug]
// ─────────────────────────────────────────────
// Query params:
//   include=content       본문 포함 (기본 포함)
//   related=5             연관 글 N개 포함
//   allow_draft=true      임시글도 조회 (인증 필요)

export async function GET(request: NextRequest, { params }: Ctx) {
  const { searchParams } = new URL(request.url);
  const allowDraft = searchParams.get('allow_draft') === 'true';
  const relatedN   = parseInt(searchParams.get('related') || '0');

  try {
    const post = readPost(params.slug);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found', slug: params.slug }, { status: 404 });
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

    // 연관 글 (같은 카테고리, 최신 N개, 자기 자신 제외)
    if (relatedN > 0) {
      const allFiles = fs.existsSync(POSTS_DIR)
        ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'))
        : [];
      const related = allFiles
        .map(f => { try { return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')); } catch { return null; } })
        .filter((p: any) => p && p.status === 'published' && p.slug !== post.slug && p.category === post.category)
        .sort((a: any, b: any) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, relatedN)
        .map((p: any) => serializePost(p));
      data.related = related;
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// PUT /api/posts/[slug] — 전체 수정
// PATCH /api/posts/[slug] — 부분 수정 (동일 동작)
// ─────────────────────────────────────────────

async function handleUpdate(request: NextRequest, { params }: Ctx) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'Post not found', slug: params.slug }, { status: 404 });
    }

    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const updates  = normalizeUpdates(await request.json());

    if (updates.slug && updates.slug !== params.slug) {
      return NextResponse.json({ success: false, error: 'slug 변경은 불가합니다' }, { status: 400 });
    }

    const merged: any = {
      ...existing,
      ...updates,
      slug:      params.slug,
      updatedAt: new Date().toISOString(),
    };

    // 카테고리 유효성
    if (merged.category && !ALLOWED_CATEGORIES.includes(merged.category)) {
      return NextResponse.json({
        success: false,
        error:   `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      }, { status: 400 });
    }

    // 본문 최소 길이
    if (merged.content?.body && merged.content.body.length < 1500) {
      return NextResponse.json({ success: false, error: 'content.body must be at least 1,500 characters' }, { status: 400 });
    }

    // 읽기 시간·단어 수 갱신
    if (updates.content?.body) {
      merged.readTime  = calcReadTime(updates.content.body);
      merged.wordCount = countWords(updates.content.body);
    }

    const security = checkSecurity(merged);
    if (!security.valid) {
      return NextResponse.json({ success: false, error: security.error }, { status: 400 });
    }

    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: {
        slug:        params.slug,
        url:         `https://nutube.kr/blog/${params.slug}`,
        title:       merged.title,
        status:      merged.status,
        readTime:    merged.readTime,
        wordCount:   merged.wordCount,
        updatedAt:   merged.updatedAt,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, ctx: Ctx)   { return handleUpdate(request, ctx); }
export async function PATCH(request: NextRequest, ctx: Ctx) { return handleUpdate(request, ctx); }

// ─────────────────────────────────────────────
// DELETE /api/posts/[slug]
// ─────────────────────────────────────────────
// Query params:
//   permanent=true   파일 영구 삭제 (기본: trash로 이동)

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const permanent = new URL(request.url).searchParams.get('permanent') === 'true';

  try {
    const filePath = path.join(POSTS_DIR, `${params.slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const deletedAt = new Date().toISOString();

    if (permanent) {
      fs.unlinkSync(filePath);
      return NextResponse.json({
        success: true,
        action:  'permanently_deleted',
        data:    { slug: params.slug, deletedAt },
      });
    }

    // 소프트 삭제: trash 폴더로 이동
    ensureDir(TRASH_DIR);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const trashed = { ...post, status: 'archived', deletedAt };
    fs.writeFileSync(path.join(TRASH_DIR, `${params.slug}.json`), JSON.stringify(trashed, null, 2), 'utf-8');
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      action:  'moved_to_trash',
      data: {
        slug:      params.slug,
        deletedAt,
        restore:   `PATCH /api/posts/${params.slug}/restore`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
