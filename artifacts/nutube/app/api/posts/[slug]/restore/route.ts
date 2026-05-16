/**
 * POST /api/posts/[slug]/restore — 휴지통에서 복구
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAuth, readPost, writePost,
  readTrashPost, removeTrashPost,
} from '@/lib/posts-api';

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [trashed, existing] = await Promise.all([
      readTrashPost(slug),
      readPost(slug),
    ]);

    if (!trashed) {
      return NextResponse.json({ success: false, error: 'Post not in trash' }, { status: 404 });
    }
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists in posts' }, { status: 409 });
    }

    const restored = {
      ...trashed,
      status:    'published',
      updatedAt: new Date().toISOString(),
    };
    delete restored.deletedAt;

    await Promise.all([
      writePost(restored),
      removeTrashPost(slug),
    ]);

    return NextResponse.json({
      success: true,
      action:  'restored',
      data: {
        slug,
        url:        `https://nutube.kr/blog/${slug}`,
        title:      restored.title,
        restoredAt: restored.updatedAt,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
