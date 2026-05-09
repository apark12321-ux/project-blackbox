import { NextResponse } from 'next/server';
import { getAllSlugs } from '../../_lib/upstash';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slugs = await getAllSlugs();
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'ok',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        site: 'nutube.kr',
        storage: 'upstash-redis',
        totalPosts: slugs.length,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      data: {
        status: 'degraded',
        version: '2.0.0',
        site: 'nutube.kr',
      },
    }, { status: 503 });
  }
}
