/**
 * POST /api/posts/[slug]/restore — 휴지통에서 복구
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAuth, POSTS_DIR, TRASH_DIR, ensureDir } from '@/lib/posts-api';

type Ctx = { params: { slug: string } };

export async function POST(request: NextRequest, { params }: Ctx) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trashPath  = path.join(TRASH_DIR, `${params.slug}.json`);
    const postPath   = path.join(POSTS_DIR,  `${params.slug}.json`);

    if (!fs.existsSync(trashPath)) {
      return NextResponse.json({ success: false, error: 'Post not in trash' }, { status: 404 });
    }
    if (fs.existsSync(postPath)) {
      return NextResponse.json({ success: false, error: 'Slug already exists in posts' }, { status: 409 });
    }

    ensureDir(POSTS_DIR);
    const post = JSON.parse(fs.readFileSync(trashPath, 'utf-8'));
    const restored = {
      ...post,
      status:      'published',
      updatedAt:   new Date().toISOString(),
      deletedAt:   undefined,
    };
    delete restored.deletedAt;

    fs.writeFileSync(postPath, JSON.stringify(restored, null, 2), 'utf-8');
    fs.unlinkSync(trashPath);

    return NextResponse.json({
      success: true,
      action:  'restored',
      data: {
        slug:      params.slug,
        url:       `https://nutube.kr/blog/${params.slug}`,
        title:     restored.title,
        restoredAt: restored.updatedAt,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
