/**
 * IndexNow 색인 제출 + sitemap 핑 스크립트
 *
 * 배포 후 실행하여 검색엔진에 새 콘텐츠를 즉시 알린다:
 * 1. IndexNow (Bing, Naver, Yandex 등) — 전체 URL을 한 번에 제출
 * 2. Google / Bing sitemap 핑 — sitemap 갱신 통보
 *
 * 사용: tsx scripts/submit-indexnow.ts
 *
 * 주의: 배포가 완료된 후(URL이 실제 접근 가능할 때) 실행해야 한다.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = 'www.nutube.kr';
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = 'f75151a757c095ec118fc7b565e3f4cc';

// 추출된 데이터에서 URL 목록 생성
const data = JSON.parse(readFileSync(join(__dirname, '_extracted_data.json'), 'utf-8'));
const { posts, categories } = data;

const urls: string[] = [
  `${BASE_URL}/`,
  `${BASE_URL}/blog`,
  ...categories.map((c: any) => `${BASE_URL}/category/${c.key}`),
  ...posts.map((p: any) => `${BASE_URL}/blog/${p.slug}`),
  `${BASE_URL}/about`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/terms`,
  `${BASE_URL}/partnership`,
  `${BASE_URL}/announcement`,
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  // IndexNow 엔드포인트 (하나에 보내면 참여 검색엔진끼리 공유됨)
  const endpoint = 'https://api.indexnow.org/indexnow';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    console.log(`IndexNow 제출: ${res.status} ${res.statusText} (${urls.length}개 URL)`);
    if (res.status === 200 || res.status === 202) {
      console.log('  ✅ 색인 요청 접수됨 (Bing, Naver, Yandex 등)');
    } else {
      const txt = await res.text();
      console.log(`  응답: ${txt.slice(0, 200)}`);
    }
  } catch (e) {
    console.error('  IndexNow 제출 실패:', (e as Error).message);
  }
}

async function pingSitemap() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  // Bing sitemap 핑 (Google은 2023년 핑 폐지 — sitemap 자동 발견에 의존)
  const pings = [
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
  ];
  for (const url of pings) {
    try {
      const res = await fetch(url);
      console.log(`sitemap 핑: ${res.status} (${url.split('?')[0]})`);
    } catch (e) {
      console.error('  sitemap 핑 실패:', (e as Error).message);
    }
  }
}

(async () => {
  console.log(`\n=== 검색엔진 색인 제출 시작 (${urls.length}개 URL) ===`);
  await submitIndexNow();
  await pingSitemap();
  console.log('=== 완료 ===\n');
})();
