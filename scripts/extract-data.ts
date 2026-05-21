/**
 * 글 데이터 + 카테고리 + 사업자정보를 JSON으로 추출
 * 프리렌더링 스크립트가 사용
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { POSTS_GROUP_1 } from '../src/data/posts1';
import { POSTS_GROUP_2 } from '../src/data/posts2';
import { POSTS_GROUP_3 } from '../src/data/posts3';
import { CATEGORIES, SITE_OPERATOR } from '../src/data';

const __dirname = dirname(fileURLToPath(import.meta.url));

const allPosts = [...POSTS_GROUP_1, ...POSTS_GROUP_2, ...POSTS_GROUP_3]
  .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

const out = { posts: allPosts, categories: CATEGORIES, operator: SITE_OPERATOR };

writeFileSync(join(__dirname, '_extracted_data.json'), JSON.stringify(out, null, 2), 'utf-8');
console.log(`추출 완료: 글 ${allPosts.length}편, 카테고리 ${CATEGORIES.length}개`);
