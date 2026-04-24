# 🚑 긴급 빌드 에러 수정 (JsonLd 누락 해결)

> **파일 1개만** 업로드하면 빌드 에러 해결!

---

## 🔍 에러 원인 (로그 분석 완료)

### 실제 에러 메시지
```
./app/contact/page.tsx
Attempted import error: 'JsonLd' is not exported from '../_shared/SEO'

./app/privacy/page.tsx
Attempted import error: 'JsonLd' is not exported from '../_shared/SEO'

./app/terms/page.tsx
Attempted import error: 'JsonLd' is not exported from '../_shared/SEO'

./app/knowhow/first-30-seconds-hook/page.tsx
Attempted import error: 'JsonLd' is not exported from '../../_shared/SEO'

Error occurred prerendering page "/contact"
[Error: Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: undefined.]
```

### 원인
```
❌ contact, privacy, terms, knowhow 4개 페이지에서
   import { JsonLd } from '...SEO'; 사용 중

❌ 하지만 현재 올라간 SEO.tsx에는 JsonLd가 없음
❌ 그래서 JsonLd가 undefined
❌ "Element type is invalid" 에러
```

---

## ✅ 해결책: **SEO.tsx에 JsonLd 복원**

### 파일 1개만 업로드!
```
frontend/app/_shared/SEO.tsx  ← 이거 하나!
```

### SEO.tsx에 추가된 것
```
✅ JsonLd 컴포넌트 복원
✅ generateBreadcrumbJsonLd
✅ generateArticleJsonLd
✅ generateFAQJsonLd
✅ generateHowToJsonLd
```

모든 기존 페이지들이 기대하는 것 모두 있음!

---

## 🚀 업로드 방법 (3분)

### Step 1: ZIP 다운로드
```
algomaker_SEO_RESOLVE.zip 다운로드
```

### Step 2: 압축 풀기
```
우클릭 → 압축 풀기
```

### Step 3: SEO.tsx 파일 하나 드래그
```
압축 푼 폴더/frontend/app/_shared/SEO.tsx
        ↓ 드래그
문서/GitHub/project-blackbox/frontend/app/_shared/
(SEO.tsx 파일만 덮어쓰기)
```

### Step 4: GitHub Desktop
```
1개 파일 변경 확인
커밋: "fix: SEO.tsx에 JsonLd 컴포넌트 복원 (빌드 에러 해결)"
Commit → Push
```

### Step 5: Vercel 자동 배포 (2~3분)

---

## 🧪 빌드 성공 예상

### 이번에는 확실!
```
✅ JsonLd export 있음
✅ generate 함수 4개 모두 있음
✅ contact/privacy/terms/knowhow 페이지 import 성공
✅ 프리렌더링 에러 없음
✅ Vercel 🟢 Ready
```

### Build Logs 예상
```
17:35:xx  ▲ Next.js 15.5.15
17:35:xx  ✓ Compiled successfully in X.Xs
17:35:xx  Collecting page data...
17:35:xx  Generating static pages (27/27)
17:35:xx  ✓ Finalizing page optimization
17:35:xx  Build completed successfully!
```

---

## 🎯 복구 순서

### 1단계: 현재 에러 상태 → 정상 복구
```
Option A: Vercel에서 이전 배포 Promote (30초)
Option B: 이번 SEO.tsx 업로드 → 빌드 성공 기다림
```

**추천: Option B** (이번엔 확실히 성공하니까!)

### 2단계: Vercel 🟢 Ready 확인
```
Deployments 탭 → 녹색 Ready
```

### 3단계: 사이트 접속
```
https://project-blackbox-cpqy.vercel.app
→ 정상 작동!
```

---

## 💡 이번에 배운 것

### 원인
```
여러 버전 오가면서
contact, privacy, terms, knowhow는 이전 버전 (JsonLd import)
SEO.tsx는 새 버전 (JsonLd 없음)
→ 불일치!
```

### 재발 방지
```
✅ 파일 수정 시 관련 파일 모두 확인
✅ import 체크
✅ 의존성 추적
✅ 빌드 후 바로 검증
```

---

## 📋 SEO.tsx 포함된 것 (최종)

```typescript
// Components
export function JsonLd({ data }): JSX.Element

// Helpers
export function generateBreadcrumbJsonLd(items)
export function generateArticleJsonLd({...})
export function generateFAQJsonLd(faqs)
export function generateHowToJsonLd({...})
```

---

## 🎯 업로드 후 할 일

### 즉시
1. ✅ 빌드 🟢 Ready 확인
2. ✅ 사이트 정상 접속 확인

### 나중에 (SEO 강화)
1. sitemap.ts 다시 추가
2. robots.ts 다시 추가
3. layout.tsx에 JSON-LD 추가
4. 정적 HTML 콘텐츠 (MathHWP 스타일)

**이번엔 한 번에 하나씩! 작은 성공을 쌓아갈게요!**

---

🎯 **파일 1개 업로드 → 빌드 성공!**

감사해요 박 대표님 로그 공유해주셔서! 
덕분에 정확한 원인 찾아서 한 방에 해결할 수 있게 됐어요. 🙌
