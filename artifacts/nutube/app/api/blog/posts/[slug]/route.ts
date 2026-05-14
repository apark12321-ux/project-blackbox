/**
 * /api/blog/posts/[slug] → /api/posts/[slug] 로 포워드 (하위 호환)
 */
export { GET, PUT, PATCH, DELETE } from '@/app/api/posts/[slug]/route';
