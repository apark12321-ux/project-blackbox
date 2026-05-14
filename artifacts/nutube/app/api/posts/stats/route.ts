/**
 * GET /api/posts/stats — 블로그 통계
 *
 * 인증 없이: 공개 통계 (카테고리별 게시물 수, 총 게시물 수)
 * 인증 시: 임시글·아카이브 포함 전체 통계
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAuth, POSTS_DIR, TRASH_DIR, CATEGORY_LABELS, calcReadTime, countWords } from '@/lib/posts-api';

export async function GET(request: NextRequest) {
  const auth      = checkAuth(request);
  const showAll   = auth.valid;

  try {
    if (!fs.existsSync(POSTS_DIR)) {
      return NextResponse.json({
        success: true,
        data: { total: 0, byCategory: {}, byStatus: {}, trash: 0 },
      });
    }

    const files = fs.readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'));

    const posts = files.map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')); }
      catch { return null; }
    }).filter(Boolean);

    // 공개 통계
    const published = posts.filter((p: any) => p.status === 'published');

    const byCategory: Record<string, number> = {};
    for (const cat of Object.keys(CATEGORY_LABELS)) {
      byCategory[cat] = published.filter((p: any) => p.category === cat).length;
    }

    // 최근 30일 게시 수
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const recentCount = published.filter((p: any) => p.publishedAt >= thirtyDaysAgo).length;

    // 월별 게시 수 (최근 6개월)
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

    // 평균 읽기 시간 (없으면 본문에서 실시간 계산)
    const readTimes = published
      .map((p: any) => {
        const rt = p.readTime || (p.content?.body ? calcReadTime(p.content.body) : '0분');
        return parseInt(rt);
      })
      .filter((n: number) => n > 0);
    const avgReadTime = readTimes.length
      ? Math.round(readTimes.reduce((a: number, b: number) => a + b, 0) / readTimes.length)
      : 0;

    // 총 단어 수 (없으면 본문에서 실시간 계산)
    const totalWords = published.reduce((sum: number, p: any) => {
      const wc = p.wordCount || (p.content?.body ? countWords(p.content.body) : 0);
      return sum + wc;
    }, 0);

    const data: any = {
      total:       published.length,
      byCategory,
      recentCount,
      monthly,
      avgReadTime: `${avgReadTime}분`,
      totalWords,
    };

    if (showAll) {
      const byStatus: Record<string, number> = {};
      for (const p of posts) {
        byStatus[p.status] = (byStatus[p.status] || 0) + 1;
      }
      data.byStatus = byStatus;

      // 휴지통 수
      const trashCount = fs.existsSync(TRASH_DIR)
        ? fs.readdirSync(TRASH_DIR).filter(f => f.endsWith('.json')).length
        : 0;
      data.trash = trashCount;

      // 태그 집계
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
