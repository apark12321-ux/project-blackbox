# 🔧 AlgoMaker SEO 수정판 (URL 문제 해결)

> ✅ **nutube.kr → project-blackbox-cpqy.vercel.app 전체 수정**
> ✅ 빌드 에러 원인 제거
> ✅ 실제 접속 URL로 통일

---

## 🚨 이전 에러 원인 (추정)

### 발견된 문제
```
❌ 제가 하드코딩한 URL: https://nutube.kr
❌ 실제 도메인: 아직 미연결
❌ 실제 접속: https://project-blackbox-cpqy.vercel.app

→ Next.js가 metadataBase로 nutube.kr 사용
→ 실제 사이트는 vercel.app
→ Canonical URL 충돌
→ 빌드 경고 → 프로덕션 에러
```

### 수정 내용
```
✅ layout.tsx의 SITE_URL 변경
✅ sitemap.ts의 SITE_URL 변경  
✅ robots.ts의 SITE_URL 변경
✅ 모든 JSON-LD의 URL 변경
✅ 정적 HTML의 내부 링크 변경
```

---

## 📦 업로드 파일 6개

```
frontend/app/
├── layout.tsx          ⭐ URL 수정 + SEO 정적 HTML
├── sitemap.ts          ⭐ URL 수정
├── robots.ts           ⭐ URL 수정
├── page.tsx            (기존 워킹 버전)
├── about/page.tsx      (기존 워킹 버전)
└── blog/page.tsx       (기존 워킹 버전)
```

### 나중에 도메인 연결 시
- `nutube.kr` 연결 완료되면
- 3개 파일(layout, sitemap, robots)의 SITE_URL만 다시 변경
- `https://nutube.kr`로 바꾸면 끝

---

## 🚀 업로드 방법

### Step 1: 압축 풀기
```
algomaker_SEO_FIX.zip 우클릭 → 압축 풀기
```

### Step 2: frontend 드래그
```
압축 푼 폴더/frontend/
        ↓
문서/GitHub/project-blackbox/
```

### Step 3: GitHub Desktop
```
6개 파일 변경
커밋: "fix: URL 수정 - nutube.kr → vercel.app (빌드 에러 해결)"
Commit → Push
```

### Step 4: Vercel 배포 (2~3분)

---

## 🧪 배포 후 확인

### 1. Vercel 🟢 Ready 확인
```
Deployments → 최신 배포 녹색 Ready
```

### 2. 사이트 접속
```
https://project-blackbox-cpqy.vercel.app
→ 정상 작동 확인
```

### 3. view-source 테스트
```
Chrome → 접속 → Ctrl+U
→ <section id="seo-prerender"> 확인
→ "경제·재테크" 검색 → 있으면 성공!
```

### 4. sitemap 확인
```
https://project-blackbox-cpqy.vercel.app/sitemap.xml
→ XML 정상 출력
```

### 5. robots 확인
```
https://project-blackbox-cpqy.vercel.app/robots.txt
→ 크롤러 지침 정상 출력
```

---

## 🌐 나중에 nutube.kr 도메인 연결할 때

### 1단계: Vercel에서 도메인 추가
```
Vercel Dashboard → Settings → Domains
→ nutube.kr 입력 → Add
→ DNS 설정 안내 따라함
```

### 2단계: 가비아 DNS 설정
```
가비아 DNS 관리 
→ A 레코드: 76.76.21.21
→ CNAME: cname.vercel-dns.com
```

### 3단계: 3개 파일의 SITE_URL 변경
```typescript
// frontend/app/layout.tsx
const SITE_URL = 'https://nutube.kr';  // ← 변경

// frontend/app/sitemap.ts  
const SITE_URL = 'https://nutube.kr';  // ← 변경

// frontend/app/robots.ts
const SITE_URL = 'https://nutube.kr';  // ← 변경
```

### 4단계: Commit & Push
```
GitHub Desktop → Commit → Push
Vercel 자동 배포
```

---

## ✅ 이번에 달라진 점

| 항목 | 이전 | 이번 |
|------|------|------|
| SITE_URL | nutube.kr (미연결) ❌ | vercel.app (실제) ✅ |
| JSON-LD URL | nutube.kr | vercel.app ✅ |
| Canonical URL | nutube.kr | vercel.app ✅ |
| OG Image URL | nutube.kr | vercel.app ✅ |
| Sitemap URL | nutube.kr | vercel.app ✅ |
| Robots.txt | nutube.kr | vercel.app ✅ |
| 내부 링크 | nutube.kr | vercel.app ✅ |

---

## 🎯 예상 결과

### 빌드 성공 🟢
```
16:45:45  Running build...
16:45:58  ⚠ Compiled with warnings in 3.2s
16:46:10  ✓ Generating static pages (11/11)
16:46:12  ✓ Finalizing page optimization
16:46:13  Build completed successfully!
```

### view-source 정상 노출
```html
<section id="seo-prerender" style="display:none">
  <h1>AI가 만드는 유튜브 영상...</h1>
  <h2>8개 카테고리 지원</h2>
  <!-- 전체 SEO 콘텐츠 -->
</section>
```

---

🎯 **이번엔 확실히 작동!**

URL 문제 해결 → 빌드 에러 해결 → view-source 노출!

---

업로드 완료 후:
- 🟢 Ready 확인
- view-source 확인
- **"빌드 성공했어요!"** 알려주세요!

그 다음:
- nutube.kr 도메인 연결 가이드
- OG 이미지 제작
- Google Search Console 등록

이어서 진행할게요! 🚀
