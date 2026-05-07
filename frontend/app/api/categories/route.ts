import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');

const CATEGORIES = [
  { id: 'algorithm', label: '알고리즘' },
  { id: 'senior', label: '시니어 사연 쇼츠' },
  { id: 'aitools', label: 'AI 도구 활용' },
  { id: 'monetization', label: '영상 채널 수익화' },
];

export async function GET() {
  try {
    const indexPath = path.join(POSTS_DIR, '_index.json');
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ categories: CATEGORIES, total: 0 });
    }

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const posts = index.posts || [];

    const categoriesWithCount = CATEGORIES.map(cat => ({
      ...cat,
      count: posts.filter((p: any) => p.category === cat.id).length,
    }));

    return NextResponse.json({
      categories: categoriesWithCount,
      total: posts.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
