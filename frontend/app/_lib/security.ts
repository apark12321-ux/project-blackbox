// NuTube 보안 모듈
// 박 대표님 자산 보호 + 인증

import type { NextRequest } from 'next/server';

// 박 대표님 자산 보호 - 매뉴얼 키워드
export const FORBIDDEN_KEYWORDS = [
  '위영', 'Wiyoung', 'Starlight',
  '당근팀', 'Carrot Team',
  '마스터 매뉴얼', '배포용',
  'GEMS',
  '알뜰폰', '비행기 모드', '공기계', '중고폰',
  '길들이기',
];

export const ALLOWED_CATEGORIES = ['algorithm', 'senior', 'aitools', 'monetization'];

/**
 * 인증 검증 - 4가지 방식
 */
export function checkAuth(request: NextRequest): { valid: boolean; method: string } {
  const API_KEY = process.env.NUTUBE_API_KEY || '';
  const BASIC_USER = process.env.NUTUBE_BASIC_USER || '';
  const BASIC_PASS = process.env.NUTUBE_BASIC_PASS || '';
  
  const auth = request.headers.get('authorization') || '';
  const apiKeyHeader = request.headers.get('x-api-key') || '';

  // 1. Bearer Token
  if (auth.startsWith('Bearer ') && API_KEY) {
    const token = auth.substring(7);
    if (token === API_KEY) return { valid: true, method: 'bearer' };
  }

  // 2. X-API-Key
  if (apiKeyHeader && API_KEY && apiKeyHeader === API_KEY) {
    return { valid: true, method: 'apikey' };
  }

  // 3. Basic Auth
  if (auth.startsWith('Basic ') && BASIC_USER && BASIC_PASS) {
    const decoded = Buffer.from(auth.substring(6), 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');
    if (user === BASIC_USER && pass === BASIC_PASS) {
      return { valid: true, method: 'basic' };
    }
  }

  return { valid: false, method: 'none' };
}

/**
 * HTML → Markdown 변환
 */
export function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match: string, items: string) => {
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  });
  md = md.replace(/<[^>]+>/g, '');
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

/**
 * 한글 카테고리 → 영문 자동 매핑
 */
export const KO_TO_EN_CATEGORY: Record<string, string> = {
  '알고리즘': 'algorithm',
  '시니어': 'senior',
  '시니어 사연 쇼츠': 'senior',
  'AI 도구': 'aitools',
  'AI도구': 'aitools',
  'aitool': 'aitools',
  '수익화': 'monetization',
  '영상 채널 수익화': 'monetization',
  '업데이트': 'algorithm',
};

/**
 * 입력 정규화
 */
export function normalizePost(input: any): any {
  const post: any = { ...input };

  // mathHWP 표준: content (string) → content.body
  if (typeof input.content === 'string') {
    post.content = {
      type: 'markdown',
      body: input.content.includes('<')
        ? htmlToMarkdown(input.content)
        : input.content,
    };
  }

  // Blog Studio 표준: body (HTML) → content.body
  if (input.body && !input.content) {
    post.content = {
      type: 'markdown',
      body: typeof input.body === 'string' && input.body.includes('<')
        ? htmlToMarkdown(input.body)
        : input.body,
    };
    delete post.body;
  }

  // postStatus → status
  if (input.postStatus && !input.status) {
    post.status = input.postStatus;
    delete post.postStatus;
  }

  // status 정규화
  if (post.status === 'publish') post.status = 'published';

  // seoDescription → seo.metaDescription
  if (input.seoDescription) {
    if (!post.seo) post.seo = {};
    post.seo.metaDescription = input.seoDescription;
    delete post.seoDescription;
  }

  // tags 배열
  if (Array.isArray(input.tags)) {
    post.tags = input.tags;
  }

  // 한글 카테고리 → 영문
  if (post.category && KO_TO_EN_CATEGORY[post.category]) {
    post.category = KO_TO_EN_CATEGORY[post.category];
  }

  // 카테고리 라벨 자동
  if (post.category && !post.categoryLabel) {
    const labels: Record<string, string> = {
      algorithm: '알고리즘',
      senior: '시니어 사연 쇼츠',
      aitools: 'AI 도구',
      monetization: '수익화',
    };
    post.categoryLabel = labels[post.category] || post.category;
  }

  // slug 자동 생성
  if (!post.slug && post.title) {
    post.slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    if (!/^[a-z0-9-]+$/.test(post.slug)) {
      post.slug = `post-${Date.now()}`;
    }
  }

  return post;
}

/**
 * 가이드 검증
 */
export function validatePost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!post.slug) errors.push('slug is required');
  if (!post.title) errors.push('title is required');
  if (!post.category) errors.push('category is required');
  if (!post.content?.body) errors.push('content.body (or body) is required');
  if (!post.publishedAt) {
    post.publishedAt = new Date().toISOString().split('T')[0];
  }

  if (post.slug && !/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push('slug format invalid (use [a-z0-9-]+)');
  }

  if (post.category && !ALLOWED_CATEGORIES.includes(post.category)) {
    errors.push(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (post.content?.body && post.content.body.length < 1500) {
    errors.push('content.body must be at least 1,500 characters');
  }

  // 박 대표님 자산 보안
  const text = JSON.stringify(post);
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (text.includes(kw)) {
      errors.push('Security violation: forbidden keyword detected');
      break;
    }
  }

  if (text.includes('박예준')) {
    errors.push('Personal name not allowed');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 보안 점검 (수정 시)
 */
export function checkSecurity(post: any): { valid: boolean; error?: string } {
  const text = JSON.stringify(post);
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (text.includes(kw)) return { valid: false, error: 'Security violation' };
  }
  if (text.includes('박예준')) return { valid: false, error: 'Personal name not allowed' };
  return { valid: true };
}
