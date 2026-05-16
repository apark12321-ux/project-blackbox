/**
 * GET    /api/posts/trash  — 휴지통 목록 (인증 필요)
 * DELETE /api/posts/trash  — 휴지통 비우기 (인증 필요)
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, listTrashPosts, emptyTrash, serializePost } from '@/lib/posts-api';

export async function GET(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await listTrashPosts();
    const serialized = posts
      .map(p => ({ ...serializePost(p), deletedAt: p.deletedAt }))
      .sort((a: any, b: any) => (b.deletedAt || '').localeCompare(a.deletedAt || ''));

    return NextResponse.json({
      success: true,
      data: { total: serialized.length, posts: serialized },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deleted = await emptyTrash();
    return NextResponse.json({
      success: true,
      data: { deleted, purgedAt: new Date().toISOString() },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
