import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readPost } from '@/lib/posts-api';

type Ctx = { params: Promise<{ slug: string }> };

const GRADIENTS: Record<string, [string, string]> = {
  algorithm:    ['#818cf8', '#4f46e5'],
  senior:       ['#fb923c', '#ea580c'],
  aitools:      ['#38bdf8', '#0284c7'],
  monetization: ['#facc15', '#ca8a04'],
};

const ICONS: Record<string, string> = {
  algorithm:    '🎯',
  senior:       '👴',
  aitools:      '🤖',
  monetization: '💰',
};

const LABELS: Record<string, string> = {
  algorithm:    '유튜브 알고리즘',
  senior:       '시니어 사연 쇼츠',
  aitools:      'AI 도구 활용',
  monetization: '영상 채널 수익화',
};

/** 한글 기준 SVG tspan 자동 줄바꿈 (글자 수 기준) */
function wrapTitle(title: string, maxChars = 14): string[] {
  if (title.length <= maxChars) return [title];
  const lines: string[] = [];
  let cur = '';
  for (const char of title) {
    cur += char;
    if (cur.length >= maxChars) {
      lines.push(cur);
      cur = '';
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3); // 최대 3줄
}

function buildSvg(title: string, category: string, categoryLabel: string): string {
  const [c1, c2] = GRADIENTS[category] ?? GRADIENTS.algorithm;
  const icon      = ICONS[category] ?? '📄';
  const label     = categoryLabel || LABELS[category] || category;

  const lines     = wrapTitle(title);
  const lineH     = 88;
  const titleY0   = 280 - ((lines.length - 1) * lineH) / 2;

  const titleSvg  = lines
    .map((l, i) =>
      `<text x="80" y="${titleY0 + i * lineH}" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="76" font-weight="800" fill="white" letter-spacing="-2">${escXml(l)}</text>`
    )
    .join('\n  ');

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
  </defs>

  <!-- 배경 -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 카테고리 뱃지 -->
  <rect x="60" y="56" width="${label.length * 18 + 40}" height="44" rx="22" fill="rgba(255,255,255,0.25)"/>
  <text x="80" y="85" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="20" font-weight="700" fill="white">${escXml(label)}</text>

  <!-- 제목 -->
  ${titleSvg}

  <!-- 이모지 아이콘 -->
  <text x="1060" y="390" font-size="180" text-anchor="middle" filter="url(#shadow)">${icon}</text>

  <!-- 하단 -->
  <line x1="60" y1="560" x2="1140" y2="560" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <text x="60" y="598" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="22" fill="rgba(255,255,255,0.8)">NuTube.kr  ·  유튜브 채널 운영 가이드  ·  ${escXml(label)}</text>
</svg>`;
}

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;

  // 1) 정적 파일 우선 서빙
  const staticPath = path.join(process.cwd(), 'public', 'thumbnails', `${slug}.svg`);
  if (fs.existsSync(staticPath)) {
    const svg = fs.readFileSync(staticPath, 'utf-8');
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  }

  // 2) 포스트 데이터로 동적 생성
  let title         = 'NuTube 가이드';
  let category      = 'algorithm';
  let categoryLabel = '유튜브 알고리즘';

  try {
    const post = await readPost(slug);
    if (post) {
      title         = post.title         || title;
      category      = post.category      || category;
      categoryLabel = post.categoryLabel || LABELS[category] || categoryLabel;
    }
  } catch {
    // 포스트 없으면 기본값 사용
  }

  const svg = buildSvg(title, category, categoryLabel);
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
    },
  });
}
