import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { savePost, getAllSlugs } from '../../../_lib/upstash';
import { checkAuth } from '../../../_lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/migrate
 * 38편 JSON → Upstash 일괄 마이그레이션
 * Bearer Token 또는 X-API-Key 인증 필요
 */
export async function POST(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
      message: 'Migration requires authentication',
    }, { status: 401 });
  }

  try {
    const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
    
    if (!fs.existsSync(POSTS_DIR)) {
      return NextResponse.json({
        success: false,
        error: 'JSON data directory not found',
      }, { status: 404 });
    }

    const files = fs.readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'));
    
    const existingSlugs = await getAllSlugs();
    
    const results = {
      total: files.length,
      saved: 0,
      skipped: 0,
      errors: [] as string[],
    };
    
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8'));
        
        if (existingSlugs.includes(data.slug)) {
          results.skipped++;
          continue;
        }
        
        await savePost(data);
        results.saved++;
      } catch (e: any) {
        results.errors.push(`${file}: ${e.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Migration complete',
        ...results,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}

/**
 * GET /api/admin/migrate
 * 마이그레이션 상태 확인
 */
export async function GET(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
    }, { status: 401 });
  }

  try {
    const slugs = await getAllSlugs();
    
    const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
    let jsonCount = 0;
    if (fs.existsSync(POSTS_DIR)) {
      jsonCount = fs.readdirSync(POSTS_DIR)
        .filter(f => f.endsWith('.json') && !f.startsWith('_'))
        .length;
    }

    return NextResponse.json({
      success: true,
      data: {
        upstash: {
          total: slugs.length,
          slugs: slugs.slice(0, 10),
        },
        json: {
          total: jsonCount,
        },
        needsMigration: jsonCount > slugs.length,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    }, { status: 500 });
  }
}
