/**
 * POST /api/posts/batch — 일괄 작업 (인증 필요)
 *
 * { action: 'delete'|'publish'|'unpublish'|'archive', slugs: [...], permanent?: false }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAuth, readPost, writePost, removePost, writeTrashPost,
} from '@/lib/posts-api';

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

    const now = new Date().toISOString();
    const results: { slug: string; ok: boolean; note?: string }[] = [];

    await Promise.all(slugs.map(async slug => {
      try {
        const post = await readPost(slug);
        if (!post) {
          results.push({ slug, ok: false, note: 'not found' });
          return;
        }

        if (action === 'delete') {
          if (permanent) {
            await removePost(slug);
            results.push({ slug, ok: true, note: 'permanently deleted' });
          } else {
            const trashed = { ...post, status: 'archived', deletedAt: now };
            await Promise.all([writeTrashPost(trashed), removePost(slug)]);
            results.push({ slug, ok: true, note: 'moved to trash' });
          }
        } else {
          const statusMap: Record<string, string> = {
            publish:   'published',
            unpublish: 'draft',
            archive:   'archived',
          };
          const updated = { ...post, status: statusMap[action], updatedAt: now };
          await writePost(updated);
          results.push({ slug, ok: true, note: `status → ${statusMap[action]}` });
        }
      } catch (err: any) {
        results.push({ slug, ok: false, note: err.message });
      }
    }));

    const succeeded = results.filter(r => r.ok).length;
    const failed    = results.length - succeeded;

    return NextResponse.json({
      success:  failed === 0,
      action,
      summary:  { total: results.length, succeeded, failed },
      results,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
