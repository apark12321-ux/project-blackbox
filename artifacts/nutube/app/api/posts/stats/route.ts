/**
 * GET /api/posts/stats — 블로그 통계
 *
 * 인증 없이: 공개 통계
 * 인증 시: 임시글·아카이브 포함 전체 통계
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAuth, listAllPosts, listTrashPosts,
  CATEGORY_LABELS, calcReadTime, countWords,
} from '@/lib/posts-api';

export async function GET(request: NextRequest) {
  const auth    = checkAuth(request);
  const showAll = auth.valid;

  try {
    const allPosts = await listAllPosts({ status: 'all' });

    const published = allPosts.filter((p: any) => p.status === 'published');

    const byCategory: Record<string, number> = {};
    for (const cat of Object.keys(CATEGORY_LABELS)) {
      byCategory[cat] = published.filter((p: any) => p.category === cat).length;
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const recentCount   = published.filter((p: any) => p.publishedAt >= thirtyDaysAgo).length;

    const monthly: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = 0;
    }
    for (const p of published) {
      const month = (p.publishedAt || '').substring(0, 7);
      if (month in monthly) monthly[month]++;
    }

    const readTimes = published
      .map((p: any) => {
        const rt = p.readTime || (p.content?.body ? calcReadTime(p.content.body) : '0분');
        return parseInt(rt);
      })
      .filter((n: number) => n > 0);
    const avgReadTime = readTimes.length
      ? Math.round(readTimes.reduce((a: number, b: number) => a + b, 0) / readTimes.length)
      : 0;

    const totalWords = published.reduce((sum: number, p: any) => {
      const wc = p.wordCount || (p.content?.body ? countWords(p.content.body) : 0);
      return sum + wc;
    }, 0);

    const data: any = {
      total: published.length,
      byCategory,
      recentCount,
      monthly,
      avgReadTime: `${avgReadTime}분`,
      totalWords,
    };

    if (showAll) {
      const byStatus: Record<string, number> = {};
      for (const p of allPosts) {
        byStatus[p.status] = (byStatus[p.status] || 0) + 1;
      }
      data.byStatus = byStatus;

      const trashed  = await listTrashPosts();
      data.trash     = trashed.length;

      const tagMap: Record<string, number> = {};
      for (const p of published) {
        for (const tag of (p.tags || [])) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      }
      data.topTags = Object.entries(tagMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([tag, count]) => ({ tag, count }));
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
