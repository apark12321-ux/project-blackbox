import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');

export async function GET() {
  try {
    const indexPath = path.join(POSTS_DIR, '_index.json');
    let totalPosts = 0;

    if (fs.existsSync(indexPath)) {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      totalPosts = index.total || 0;
    }

    return NextResponse.json({
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      totalPosts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
