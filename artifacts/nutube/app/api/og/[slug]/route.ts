import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type Ctx = { params: Promise<{ slug: string }> };

// ─── 카테고리 설정 ───────────────────────────────────────────
const GRADIENTS: Record<string, [string, string]> = {
  algorithm:    ['#818cf8', '#4f46e5'],
  senior:       ['#fb923c', '#ea580c'],
  aitools:      ['#38bdf8', '#0284c7'],
  monetization: ['#facc15', '#ca8a04'],
};
const ICONS: Record<string, string> = {
  algorithm: '🎯', senior: '👴', aitools: '🤖', monetization: '💰',
};
const LABELS: Record<string, string> = {
  algorithm:    '유튜브 알고리즘',
  senior:       '시니어 사연 쇼츠',
  aitools:      'AI 도구 활용',
  monetization: '영상 채널 수익화',
};

// ─── 제목 줄바꿈 (공백 우선, 최대 15자/줄, 최대 3줄) ─────────
function wrapTitle(title: string): string[] {
  const MAX_CHARS = 15;
  const MAX_LINES = 3;

  // 공백 기준으로 단어 분리
  const words = title.split(' ');
  const lines: string[] = [];
  let cur = '';

  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (next.length > MAX_CHARS && cur) {
      lines.push(cur);
      cur = word;
      if (lines.length >= MAX_LINES) break;
    } else {
      cur = next;
    }
  }
  if (cur && lines.length < MAX_LINES) lines.push(cur);

  // 공백 없이 긴 단어면 강제 분리
  if (lines.length === 0) {
    let rem = title;
    while (rem && lines.length < MAX_LINES) {
      lines.push(rem.slice(0, MAX_CHARS));
      rem = rem.slice(MAX_CHARS);
    }
  }

  return lines;
}

// ─── SVG 빌더 (기존 정적 SVG와 동일한 800×450 레이아웃) ─────
function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FONT = "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

function buildSvg(title: string, category: string): string {
  const [c1, c2] = GRADIENTS[category] ?? GRADIENTS.algorithm;
  const icon     = ICONS[category]     ?? '📄';
  const lines    = wrapTitle(title);

  // 제목 y 좌표: 중앙(225) 기준, 줄 간격 46px
  const lineH    = 46;
  const centerY  = 225;
  const startY   = centerY - ((lines.length - 1) * lineH) / 2;

  const titleSvg = lines.map((l, i) =>
    `<text x="400" y="${Math.round(startY + i * lineH)}" font-family="${FONT}" font-size="34" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle" style="text-shadow:0 2px 8px rgba(0,0,0,0.4)">${escXml(l)}</text>`
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <circle cx="680" cy="80" r="140" fill="white" fill-opacity="0.06" filter="url(#blur)"/>
  <circle cx="120" cy="370" r="120" fill="white" fill-opacity="0.06" filter="url(#blur)"/>
  <text x="400" y="145" font-size="64" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  ${titleSvg}
  <rect x="0" y="400" width="800" height="50" fill="black" fill-opacity="0.25"/>
  <text x="400" y="425" font-family="'Noto Sans KR', Arial, sans-serif" font-size="18" fill="white" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">NuTube · 유튜브 채널 운영 가이드</text>
</svg>`;
}

// ─── 포스트 데이터 조회 (posts-api 미사용) ───────────────────
async function fetchPostData(slug: string): Promise<{ title: string; category: string } | null> {
  // 1) 정적 JSON 파일
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'posts', `${slug}.json`);
    if (fs.existsSync(jsonPath)) {
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      if (raw?.title) return { title: raw.title, category: raw.category || 'algorithm' };
    }
  } catch { /* ignore */ }

  // 2) Upstash Redis REST API (Blog Studio 신규 포스트)
  try {
    const url   = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (url && token) {
      const res = await fetch(`${url}/get/${encodeURIComponent(`nutube:post:${slug}`)}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        const post = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
        if (post?.title) return { title: post.title, category: post.category || 'algorithm' };
      }
    }
  } catch { /* ignore */ }

  return null;
}

// ─── Route Handler ────────────────────────────────────────────
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;

  // 정적 SVG 우선 (기존 58개)
  try {
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
  } catch { /* ignore */ }

  // 동적 SVG 생성
  const post = await fetchPostData(slug);
  const title    = post?.title    || 'NuTube 가이드';
  const category = post?.category || 'algorithm';

  return new NextResponse(buildSvg(title, category), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
    },
  });
}
