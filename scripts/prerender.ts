/**
 * 프리렌더링 스크립트
 *
 * 목적: SPA(클라이언트 렌더링)는 크롤러가 빈 HTML만 보는 문제가 있음.
 *       각 라우트마다 실제 콘텐츠가 담긴 정적 HTML을 생성하여
 *       크롤러(Google, AdSense)가 콘텐츠를 읽을 수 있게 한다.
 *
 * 동작: dist/index.html을 베이스로, 각 페이지의
 *       - <title>, <meta description>, canonical, OG 태그를 페이지별로 교체
 *       - <div id="root"> 안에 SEO용 콘텐츠(제목/본문 요약 등)를 주입
 *       사용자는 JS 로드 후 기존 React 앱을 그대로 보고,
 *       크롤러는 주입된 콘텐츠를 읽는다.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const data = JSON.parse(readFileSync(join(__dirname, '_extracted_data.json'), 'utf-8'));
const { posts, categories, operator } = data;

const BASE_URL = 'https://www.nutube.kr';
const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

// 간단한 마크다운 → 텍스트(HTML) 변환 (크롤러용, 최소한의 구조)
function mdToHtml(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    // 헤더
    if (line.startsWith('### ')) { out.push(`<h3>${esc(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { out.push(`<h2>${esc(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('# ')) { out.push(`<h2>${esc(line.slice(2))}</h2>`); continue; }
    // 리스트
    if (line.startsWith('- ')) { out.push(`<li>${inline(line.slice(2))}</li>`); continue; }
    if (/^\d+\.\s/.test(line)) { out.push(`<li>${inline(line.replace(/^\d+\.\s/, ''))}</li>`); continue; }
    // 구분선/인용
    if (line === '---') continue;
    if (line.startsWith('> ')) { out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    // 일반 문단
    out.push(`<p>${inline(line)}</p>`);
  }
  return out.join('\n');
}
function inline(s: string): string {
  // 볼드 **x** → <strong>, 링크 [t](u) → <a>
  s = esc(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  return s;
}
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// HTML 메타/콘텐츠 주입 헬퍼
function buildPage(opts: {
  path: string;
  title: string;
  description: string;
  canonical: string;
  bodyHtml: string;
  jsonLd?: object[];
}): string {
  let html = baseHtml;

  // title
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(opts.title)}</title>`);
  // description
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(opts.description)}" />`);
  // canonical
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${opts.canonical}" />`);
  // OG url/title/description
  html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${opts.canonical}" />`);
  html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(opts.title)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(opts.description)}" />`);

  // JSON-LD 주입
  let jsonLdScripts = '';
  if (opts.jsonLd && opts.jsonLd.length) {
    jsonLdScripts = opts.jsonLd
      .map(obj => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
      .join('\n');
    html = html.replace('</head>', `${jsonLdScripts}\n</head>`);
  }

  // SEO 콘텐츠 주입: <div id="root"></div> → <div id="root">[콘텐츠]</div>
  // JS 로드 시 React가 이 안을 교체하므로 사용자 경험엔 영향 없음.
  // noscript에도 동일 콘텐츠를 넣어 확실히 크롤러가 읽게 함.
  // SEO 콘텐츠: React 마운트 전까지 표시(크롤러가 읽음), 마운트 시 createRoot가 교체.
  // 숨김(display:none/left:-9999px) 대신 정상 마크업으로 두어 cloaking 의심을 피함.
  const seoBlock = `<div id="prerender-seo">${opts.bodyHtml}</div>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${seoBlock}</div>`);

  return html;
}

function writePage(path: string, html: string) {
  // /about → dist/about/index.html
  const dir = path === '/' ? DIST : join(DIST, path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf-8');
}

let count = 0;

// ===== 1. 홈 =====
{
  const recent = posts.slice(0, 10);
  const body = `
    <h1>NuTube - 유튜브 채널 운영 실전 가이드</h1>
    <p>${esc(operator?.description || '유튜브 채널 운영자를 위한 실전 가이드. 알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화 노하우를 다룹니다.')}</p>
    <h2>카테고리</h2>
    <ul>${categories.map((c: any) => `<li><a href="/category/${c.key}">${esc(c.label)}</a> - ${esc(c.description)}</li>`).join('')}</ul>
    <h2>최신 가이드</h2>
    <ul>${recent.map((p: any) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> - ${esc(p.summary)}</li>`).join('')}</ul>
  `;
  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: 'NuTube', url: BASE_URL,
  }, {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: operator?.name || '상상아트', url: BASE_URL,
    ...(operator?.registrationNum ? { taxID: operator.registrationNum } : {}),
  }];
  writePage('/', buildPage({
    path: '/', title: 'NuTube - 유튜브 채널 운영 실전 가이드',
    description: '유튜브 채널 운영자를 위한 실전 가이드 - 알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화 노하우.',
    canonical: `${BASE_URL}/`, bodyHtml: body, jsonLd,
  }));
  count++;
}

// ===== 2. 글 상세 47편 =====
for (const p of posts) {
  const cat = categories.find((c: any) => c.key === p.category);
  const body = `
    <article>
      <nav><a href="/">홈</a> › <a href="/category/${p.category}">${esc(p.categoryLabel)}</a> › ${esc(p.title)}</nav>
      <h1>${esc(p.title)}</h1>
      ${p.subtitle ? `<p>${esc(p.subtitle)}</p>` : ''}
      <p>작성자: ${esc(p.author)} · 발행일: ${esc((p.publishedAt || '').slice(0,10))}</p>
      ${mdToHtml(p.content || '')}
      ${(p.tags && p.tags.length) ? `<p>${p.tags.slice(0, 10).map((t: string) => `#${esc(t)}`).join(' ')}</p>` : ''}
      ${p.authorityUrl ? `<p>참고: <a href="${esc(p.authorityUrl)}" rel="noopener">${esc(p.authorityLabel || '공식 출처')}</a></p>` : ''}
    </article>
  `;
  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'Article',
    headline: p.title,
    description: p.summary,
    datePublished: p.publishedAt,
    ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
    author: { '@type': 'Organization', name: p.author },
    publisher: {
      '@type': 'Organization', name: operator?.name || '상상아트',
      ...(operator?.registrationNum ? { taxID: operator.registrationNum } : {}),
    },
    mainEntityOfPage: `${BASE_URL}/blog/${p.slug}`,
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: p.categoryLabel, item: `${BASE_URL}/category/${p.category}` },
      { '@type': 'ListItem', position: 3, name: p.title, item: `${BASE_URL}/blog/${p.slug}` },
    ],
  }];
  writePage(`/blog/${p.slug}`, buildPage({
    path: `/blog/${p.slug}`, title: `${p.title} | NuTube`,
    description: p.summary, canonical: `${BASE_URL}/blog/${p.slug}`,
    bodyHtml: body, jsonLd,
  }));
  count++;
}

// ===== 3. 카테고리 6개 =====
for (const c of categories) {
  const catPosts = posts.filter((p: any) => p.category === c.key);
  const body = `
    <h1>${esc(c.label)}</h1>
    <p>${esc(c.description)}</p>
    <h2>${esc(c.label)} 가이드 ${catPosts.length}편</h2>
    <ul>${catPosts.map((p: any) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> - ${esc(p.summary)}</li>`).join('')}</ul>
  `;
  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: c.label, item: `${BASE_URL}/category/${c.key}` },
    ],
  }];
  writePage(`/category/${c.key}`, buildPage({
    path: `/category/${c.key}`, title: `${c.label} | NuTube`,
    description: c.description, canonical: `${BASE_URL}/category/${c.key}`,
    bodyHtml: body, jsonLd,
  }));
  count++;
}

// ===== 4. 전체 가이드 목록 =====
{
  const body = `
    <h1>전체 가이드</h1>
    <p>유튜브 채널 운영에 도움 되는 글 ${posts.length}편을 카테고리별로 정리했습니다.</p>
    <ul>${posts.map((p: any) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> (${esc(p.categoryLabel)}) - ${esc(p.summary)}</li>`).join('')}</ul>
  `;
  writePage('/blog', buildPage({
    path: '/blog', title: '전체 가이드 | NuTube',
    description: `유튜브 채널 운영 가이드 ${posts.length}편 모음.`,
    canonical: `${BASE_URL}/blog`, bodyHtml: body,
  }));
  count++;
}

// ===== 5. 정적 페이지 (about/privacy/terms/partnership/announcement/publish) =====
const staticPages: Record<string, { title: string; desc: string; body: string }> = {
  '/about': {
    title: '소개 | NuTube',
    desc: 'NuTube는 유튜브 채널 운영자를 위한 실전 가이드 미디어입니다.',
    body: `<h1>NuTube 소개</h1>
      <p>유튜브 채널을 운영하면서 마주치는 실제 문제들을 검증된 데이터와 실전 경험으로 풀어드리는 미디어입니다.</p>
      <h2>운영 정보</h2>
      <ul>
        <li>상호: ${esc(operator?.name || '상상아트')}</li>
        ${operator?.registrationNum ? `<li>사업자등록번호: ${esc(operator.registrationNum)}</li>` : ''}
        ${operator?.mailOrderNum ? `<li>통신판매업 신고: ${esc(operator.mailOrderNum)}</li>` : ''}
        ${operator?.address ? `<li>사업장 주소: ${esc(operator.address)}</li>` : ''}
        ${operator?.email ? `<li>이메일: ${esc(operator.email)}</li>` : ''}
      </ul>`,
  },
  '/privacy': {
    title: '개인정보처리방침 | NuTube',
    desc: 'NuTube 개인정보처리방침. 수집 항목, 이용 목적, 광고 쿠키, 보호책임자 안내.',
    body: `<h1>개인정보처리방침</h1>
      <p>NuTube는 이용자의 개인정보를 중요시하며 관련 법령을 준수합니다.</p>
      <h2>광고 및 쿠키</h2>
      <p>본 사이트는 Google AdSense 등 제3자 광고를 게재하며, 광고 사업자가 쿠키를 사용할 수 있습니다.</p>
      <h2>개인정보 보호책임자</h2>
      <p>${esc(operator?.privacyOfficer?.name || '박예준')}</p>`,
  },
  '/terms': {
    title: '이용약관 | NuTube',
    desc: 'NuTube 이용약관.',
    body: `<h1>이용약관</h1><p>본 약관은 NuTube를 이용하는 모든 이용자에게 적용됩니다.</p>
      <h2>운영자 정보</h2>
      <ul><li>상호: ${esc(operator?.name || '상상아트')}</li>${operator?.registrationNum ? `<li>사업자등록번호: ${esc(operator.registrationNum)}</li>` : ''}</ul>`,
  },
  '/partnership': {
    title: '제휴 문의 | NuTube',
    desc: 'NuTube 제휴, 광고, 콘텐츠 협력 문의 안내.',
    body: `<h1>제휴 및 비즈니스 문의</h1><p>제휴 문의는 ${esc(operator?.email || 'apark12321@gmail.com')}로 보내주세요.</p>`,
  },
  '/announcement': {
    title: '공지사항 | NuTube',
    desc: 'NuTube 공지사항.',
    body: `<h1>공지사항</h1><p>NuTube의 업데이트 소식을 안내합니다.</p>`,
  },
  '/publish': {
    title: '메타데이터 생성기 | NuTube',
    desc: '키워드를 입력하면 유튜브 영상용 제목·설명·태그를 자동 생성하는 무료 도구.',
    body: `<h1>메타데이터 생성기</h1><p>영상 키워드를 입력하면 알고리즘에 최적화된 제목·설명·태그·썸네일 콘셉트를 자동 생성합니다.</p>`,
  },
};

for (const [path, page] of Object.entries(staticPages)) {
  // publish는 noindex
  let html = buildPage({
    path, title: page.title, description: page.desc,
    canonical: `${BASE_URL}${path}`, bodyHtml: page.body,
  });
  if (path === '/publish') {
    html = html.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
  }
  writePage(path, html);
  count++;
}

console.log(`프리렌더 완료: ${count}개 페이지 생성`);

// ===== sitemap.xml 자동 생성 (전체 글 47편 + 카테고리 + 정적 페이지) =====
{
  const urls: { loc: string; priority: string; changefreq: string; lastmod: string }[] = [];
  const buildDate = new Date().toISOString().slice(0, 10);
  // 가장 최근 글 발행일 (홈/목록 lastmod 용)
  const latestPostDate = posts.length
    ? posts.map((p: any) => (p.publishedAt || '').slice(0, 10)).sort().reverse()[0]
    : buildDate;

  urls.push({ loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily', lastmod: latestPostDate });
  urls.push({ loc: `${BASE_URL}/blog`, priority: '0.9', changefreq: 'daily', lastmod: latestPostDate });
  for (const c of categories) {
    // 카테고리 lastmod = 그 카테고리 최신 글 발행일
    const catPosts = posts.filter((p: any) => p.category === c.key);
    const catLatest = catPosts.length
      ? catPosts.map((p: any) => (p.publishedAt || '').slice(0, 10)).sort().reverse()[0]
      : latestPostDate;
    urls.push({ loc: `${BASE_URL}/category/${c.key}`, priority: '0.8', changefreq: 'weekly', lastmod: catLatest });
  }
  for (const p of posts) {
    // 글 lastmod = updatedAt 있으면 그것, 없으면 publishedAt (실제 날짜)
    const postDate = (p.updatedAt || p.publishedAt || buildDate).slice(0, 10);
    urls.push({ loc: `${BASE_URL}/blog/${p.slug}`, priority: '0.7', changefreq: 'monthly', lastmod: postDate });
  }
  for (const path of ['/about', '/privacy', '/terms', '/partnership', '/announcement']) {
    urls.push({ loc: `${BASE_URL}${path}`, priority: '0.5', changefreq: 'monthly', lastmod: buildDate });
  }
  // publish는 noindex이므로 sitemap 제외

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf-8');
  console.log(`sitemap.xml 생성: ${urls.length}개 URL (글별 실제 발행일 lastmod 적용)`);
}

// ===== RSS 2.0 피드 자동 생성 (최신 글 순) =====
{
  const xmlEsc = (s: string) => (s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  // 최신순 정렬 (이미 정렬돼 있지만 안전하게 재정렬)
  const sorted = [...posts].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  const feedPosts = sorted.slice(0, 30); // 최신 30편
  const buildRfc822 = (iso: string) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toUTCString();
  };
  const lastBuild = feedPosts.length ? buildRfc822(feedPosts[0].publishedAt) : new Date().toUTCString();

  const items = feedPosts.map((p: any) => {
    const link = `${BASE_URL}/blog/${p.slug}`;
    const cat = categories.find((c: any) => c.key === p.category);
    return `    <item>
      <title>${xmlEsc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${buildRfc822(p.publishedAt)}</pubDate>
      <category>${xmlEsc(p.categoryLabel || (cat ? cat.label : ''))}</category>
      <description>${xmlEsc(p.summary)}</description>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NuTube - 유튜브 채널 운영 실전 가이드</title>
    <link>${BASE_URL}/</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>유튜브 알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화 노하우를 다루는 실전 가이드</description>
    <language>ko</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;

  writeFileSync(join(DIST, 'rss.xml'), rss, 'utf-8');
  console.log(`rss.xml 생성: 최신 ${feedPosts.length}편 피드`);
}
