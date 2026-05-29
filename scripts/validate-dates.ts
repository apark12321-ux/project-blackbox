/**
 * 발행일 검증 스크립트
 *
 * 빌드 전 실행하여 날짜 관련 실수를 자동으로 잡는다:
 * 1. 미래 날짜 (오늘 이후) → 에러
 * 2. 같은 시각(정시)에 과도하게 몰림 → 경고
 * 3. 발행일 빈 날(빈틈) → 경고
 *
 * 사용: tsx scripts/validate-dates.ts
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, '_extracted_data.json'), 'utf-8'));
const posts: any[] = data.posts;

const today = new Date();
today.setHours(23, 59, 59, 999); // 오늘 끝까지는 허용

let hasError = false;
const warnings: string[] = [];

// 1. 미래 날짜 검사
const future = posts.filter(p => {
  const d = new Date(p.publishedAt);
  return d > today;
});
if (future.length > 0) {
  hasError = true;
  console.error(`\n❌ [에러] 미래 날짜 발행 글 ${future.length}건:`);
  future.forEach(p => console.error(`   - ${p.slug}: ${p.publishedAt}`));
}

// 2. 정시(00분 00초) 과다 검사
const exactHour = posts.filter(p => /T\d{2}:00:00/.test(p.publishedAt));
if (exactHour.length > posts.length * 0.5) {
  warnings.push(`발행 시각이 정시(00분 00초)에 ${exactHour.length}/${posts.length}건 몰림 — 자연스럽게 분산 권장`);
}

// 3. 발행일 빈틈 검사 (가장 이른 글 ~ 가장 늦은 글 사이)
const dates = posts.map(p => p.publishedAt.slice(0, 10)).sort();
const start = new Date(dates[0]);
const end = new Date(dates[dates.length - 1]);
const dateSet = new Set(dates);
const gaps: string[] = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const ds = d.toISOString().slice(0, 10);
  if (!dateSet.has(ds)) gaps.push(ds);
}
if (gaps.length > 0) {
  warnings.push(`발행 빈틈 ${gaps.length}일: ${gaps.join(', ')}`);
}

// 결과 출력
if (warnings.length > 0) {
  console.warn('\n⚠️  [경고]');
  warnings.forEach(w => console.warn(`   - ${w}`));
}

if (hasError) {
  console.error('\n날짜 검증 실패. 위 오류를 수정하세요.\n');
  process.exit(1);
} else {
  console.log(`\n✅ 날짜 검증 통과 (글 ${posts.length}편, 미래 날짜 0건)`);
}
