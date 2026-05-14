/**
 * POST /api/posts/batch — 일괄 작업 (인증 필요)
 *
 * Request body:
 * {
 *   action: 'delete' | 'publish' | 'unpublish' | 'archive',
 *   slugs: ['slug-1', 'slug-2', ...],
 *   permanent: false   // delete 시 영구 삭제 여부 (기본: 소프트 삭제)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAuth, POSTS_DIR, TRASH_DIR, ensureDir } from '@/lib/posts-api';

type Action = 'delete' | 'publish' | 'unpublish' | 'archive';

export async function POST(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: { action: Action; slugs: string[]; permanent?: boolean } = await request.json();

    const { action, slugs, permanent = false } = body;

    if (!action || !Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json({
        success: false,
        error:   'action과 slugs[] 가 필요합니다',
        example: { action: 'delete', slugs: ['slug-1', 'slug-2'] },
      }, { status: 400 });
    }

    const VALID_ACTIONS: Action[] = ['delete', 'publish', 'unpublish', 'archive'];
    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({
        success: false,
        error:   `action은 ${VALID_ACTIONS.join(' | ')} 중 하나여야 합니다`,
      }, { status: 400 });
    }

    const results: { slug: string; ok: boolean; note?: string }[] = [];
    const now = new Date().toISOString();

    for (const slug of slugs) {
      const filePath = path.join(POSTS_DIR, `${slug}.json`);

      if (!fs.existsSync(filePath)) {
        results.push({ slug, ok: false, note: 'not found' });
        continue;
      }

      try {
        const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        if (action === 'delete') {
          if (permanent) {
            fs.unlinkSync(filePath);
            results.push({ slug, ok: true, note: 'permanently deleted' });
          } else {
            ensureDir(TRASH_DIR);
            const trashed = { ...post, status: 'archived', deletedAt: now };
            fs.writeFileSync(path.join(TRASH_DIR, `${slug}.json`), JSON.stringify(trashed, null, 2), 'utf-8');
            fs.unlinkSync(filePath);
            results.push({ slug, ok: true, note: 'moved to trash' });
          }
        } else {
          const statusMap: Record<string, string> = {
            publish:   'published',
            unpublish: 'draft',
            archive:   'archived',
          };
          const newStatus = statusMap[action];
          const updated   = { ...post, status: newStatus, updatedAt: now };
          fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
          results.push({ slug, ok: true, note: `status → ${newStatus}` });
        }
      } catch (err: any) {
        results.push({ slug, ok: false, note: err.message });
      }
    }

    const succeeded = results.filter(r => r.ok).length;
    const failed    = results.length - succeeded;

    return NextResponse.json({
      success:   failed === 0,
      action,
      summary:   { total: results.length, succeeded, failed },
      results,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
