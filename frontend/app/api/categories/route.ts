import { NextResponse } from 'next/server';
import { getAllPosts, CATEGORY_LABELS } from '../../_lib/upstash';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORIES = [
  { id: 'algorithm', label: '알고리즘' },
  { id: 'senior', label: '시니어 사연 쇼츠' },
  { id: 'aitools', label: 'AI 도구 활용' },
  { id: 'monetization', label: '영상 채널 수익화' },
];

export async function GET() {
  try {
    const posts = await getAllPosts();
    
    const categoriesWithCount = CATEGORIES.map(cat => ({
      ...cat,
      count: posts.filter(p => p.category === cat.id).length,
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithCount,
        total: posts.length,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      data: {
        categories: CATEGORIES.map(c => ({ ...c, count: 0 })),
        total: 0,
      },
    });
  }
}
