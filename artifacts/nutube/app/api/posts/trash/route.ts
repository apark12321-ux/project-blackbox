/**
 * GET    /api/posts/trash  — 휴지통 목록 (인증 필요)
 * DELETE /api/posts/trash  — 휴지통 비우기 (인증 필요)
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAuth, TRASH_DIR, serializePost } from '@/lib/posts-api';

export async function GET(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(TRASH_DIR)) {
      return NextResponse.json({ success: true, data: { total: 0, posts: [] } });
    }

    const files = fs.readdirSync(TRASH_DIR).filter(f => f.endsWith('.json'));
    const posts = files.map(f => {
      try {
        const p = JSON.parse(fs.readFileSync(path.join(TRASH_DIR, f), 'utf-8'));
        return { ...serializePost(p), deletedAt: p.deletedAt };
      } catch { return null; }
    }).filter(Boolean);

    posts.sort((a: any, b: any) => (b.deletedAt || '').localeCompare(a.deletedAt || ''));

    return NextResponse.json({
      success: true,
      data: { total: posts.length, posts },
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
    if (!fs.existsSync(TRASH_DIR)) {
      return NextResponse.json({ success: true, data: { deleted: 0 } });
    }

    const files = fs.readdirSync(TRASH_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      fs.unlinkSync(path.join(TRASH_DIR, f));
    }

    return NextResponse.json({
      success: true,
      data: { deleted: files.length, purgedAt: new Date().toISOString() },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
