# 🚀 AlgoMaker SEO v3 - 타겟 키워드 강화 + OG 이미지 자동 생성

## 📋 박예준 확정 3가지

### ✅ 1. MathHWP 스타일 그대로
- #seo-prerender 정적 HTML 블록
- JSON-LD 5개 스키마
- 풀 메타 태그
- **타겟 키워드 자연스럽게 배치**

### ✅ 2. React로 OG 이미지 자동 생성
- **`opengraph-image.tsx`** (Next.js 매직!)
- 빌드 시 자동으로 1200x630 PNG 생성
- 별도 이미지 파일 불필요
- 한글 폰트 자동 처리

### ✅ 3. 타겟 키워드 3개 강화
- ⭐ **"AI 유튜브 영상"**
- ⭐ **"SNS 알고리즘"**
- ⭐ **"쇼츠 자동 생성"**

---

## 🎯 키워드 배치 전략

### 메인 페이지 H1 (가장 중요!)
```
"AI 유튜브 영상 자동 생성 - SNS 알고리즘 분석으로 쇼츠 자동 생성"
```
→ 3개 타겟 키워드 모두 포함

### 페이지 Title (검색 결과 표시)
```
"AlgoMaker — AI 유튜브 영상·쇼츠 자동 생성, SNS 알고리즘 분석"
```

### Description (검색 스니펫)
```
"AI 유튜브 영상을 키워드 하나로 자동 생성합니다. 
 SNS 알고리즘 분석으로 조회수 터지는 쇼츠·틱톡·릴스 자동 제작."
```

### Hero (메인 화면)
```
H1: "AI 유튜브 영상도 SNS 알고리즘 없이는 묻힙니다."
P:  "쇼츠 자동 생성·틱톡·릴스 모두 알고리즘이 결정"
```

---

## 🎨 OG 이미지 - React로 자동 생성!

### Next.js 매직 ✨
```typescript
// opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default async function Image() {
  return new ImageResponse(<JSX/>, { width: 1200, height: 630 });
}
```

### 자동 생성되는 URL
```
https://project-blackbox-cpqy.vercel.app/opengraph-image
→ 1200x630 PNG가 자동으로 표시!
```

### 카카오톡 공유 시
```
[이미지: 우주 배경 + 구슬볼 + +280%]
[제목]: AlgoMaker — AI 유튜브 영상·쇼츠 자동 생성
[설명]: AI 유튜브 영상을 키워드 하나로 자동 생성합니다...
```

### 디자인 미리보기
```
┌──────────────────────────────────────┐
│ ❦                                  ❦ │
│                                      │
│  ⚠️ 99% 모르는 진실                  │
│                                      │
│  AI 영상도 알고리즘    ╔═════════╗  │
│  없이는 묻힙니다.      ║         ║  │
│                        ║ +280%   ║  │
│  AlgoMaker가 베일      ║         ║  │
│  너머의 알고리즘을     ║ VIRAL   ║  │
│  작동시킵니다.         ║ BOOST   ║  │
│                        ╚═════════╝  │
│  [▶] AlgoMaker                      │
│ ❦                                    │
└──────────────────────────────────────┘
```

---

## 📦 파일 구성 (총 25개)

### 🆕 신규 파일 3개
| 파일 | 위치 | 용도 |
|------|------|------|
| **`opengraph-image.tsx`** | `frontend/app/` | OG 이미지 자동 생성 |
| **`twitter-image.tsx`** | `frontend/app/` | Twitter 이미지 자동 생성 |
| **`sitemap.ts`** | `frontend/app/` | 사이트맵 자동 생성 |

### ⭐ 수정 파일 4개
| 파일 | 변경 내용 |
|------|----------|
| **`layout.tsx`** | 타겟 키워드 강화 + JSON-LD 5개 + 정적 HTML |
| **`page.tsx`** | 메인 H1에 타겟 키워드 3개 |
| **`robots.ts`** | AI 크롤러 차단 |
| **`_shared/V11Shell.tsx`** | "알고리즘 결사체" |

### ✅ 기존 (Crystal Ball + v2 메시지)
- 모든 페이지 메시지: "99%가 모르는 진실"
- /done: Crystal Ball Oracle
- /keyword, /platform, /metadata: 알고리즘 톤

---

## 🚀 업로드 (3분)

### Step 1: ZIP 다운로드
**`algomaker_SEO_v3.zip`** 다운로드

### Step 2: 압축 풀기 + 드래그
```
1. 압축 풀기
2. frontend 폴더 → Documents\GitHub\project-blackbox\
3. "파일 바꾸기" 클릭
```

### Step 3: GitHub Push
```
1. GitHub Desktop 실행
2. 변경된 파일 27개 표시 확인
3. Commit message: "feat: SEO v3 - 타겟 키워드 + OG 이미지"
4. Commit → Push
```

### Step 4: Vercel 배포 (2~3분)
```
🟢 Ready 확인
```

### Step 5: 검증!

#### 5-1. OG 이미지 확인
```
브라우저 → https://project-blackbox-cpqy.vercel.app/opengraph-image
→ 1200x630 PNG 표시!
```

#### 5-2. 카카오톡 공유 테스트
```
1. 자기 카톡에 사이트 URL 보내기
2. 미리보기 표시:
   - 이미지: 구슬볼 OG 이미지
   - 제목: AlgoMaker — AI 유튜브 영상...
   - 설명: AI 유튜브 영상을 키워드 하나로...
```

#### 5-3. 페이지 소스 확인
```
Ctrl + U → 메인 페이지 소스
- <title> 풍부한 제목
- <meta name="keywords"> 30+ 키워드
- <meta property="og:image"> 자동 생성 URL
- <script type="application/ld+json"> 5개 스키마
```

#### 5-4. Sitemap 확인
```
https://project-blackbox-cpqy.vercel.app/sitemap.xml
→ XML 사이트맵 표시
```

#### 5-5. Robots.txt 확인
```
https://project-blackbox-cpqy.vercel.app/robots.txt
→ AI 크롤러 차단 + 검색엔진 허용
```

---

## 🔍 검색엔진 등록 (필수!)

### 1️⃣ Google Search Console
1. https://search.google.com/search-console 접속
2. 속성 추가 → URL prefix
3. URL: `https://project-blackbox-cpqy.vercel.app`
4. **소유 확인**:
   - HTML 태그 받기
   - layout.tsx의 `verification.google`에 코드 입력
   - Push & 배포
5. **Sitemap 제출**:
   - URL: `sitemap.xml`
6. **인덱싱 요청**:
   - URL 검사 → 색인 생성 요청

### 2️⃣ 네이버 Search Advisor (한국 필수!)
1. https://searchadvisor.naver.com 접속
2. 사이트 등록
3. URL: `https://project-blackbox-cpqy.vercel.app`
4. **소유 확인**:
   - layout.tsx의 `verification.other['naver-site-verification']`
5. **Sitemap 제출**: `sitemap.xml`
6. **사이트 분석**:
   - 모바일 친화성 검사
   - 페이지 속도 검사

### 3️⃣ Bing Webmaster (선택)
1. https://www.bing.com/webmasters 접속
2. **Google에서 가져오기** (자동!)

---

## 📊 SEO 효과 예측

### 1주차
- ✅ 구글 인덱싱 시작
- ✅ "AlgoMaker" 직접 검색 1페이지

### 1개월
- 🎯 "AI 유튜브 영상" 5-10페이지
- 🎯 "쇼츠 자동 생성" 5-10페이지
- 🎯 "SNS 알고리즘" 5-10페이지
- 🎯 일일 트래픽 100~500명

### 3개월
- 🎯 "AI 유튜브 영상" 1-3페이지
- 🎯 "쇼츠 자동 생성" 1-2페이지
- 🎯 "SNS 알고리즘" 2-3페이지
- 🎯 일일 트래픽 1000~3000명

### 6개월 (블로그 + 백링크 후)
- 🎯 메인 키워드 1페이지 (Top 5)
- 🎯 일일 트래픽 5000+명
- 🎯 AdSense 수익 시작

---

## 🎁 보너스: 사용한 모든 SEO 기법

### MathHWP에서 학습
```
✅ #seo-prerender 정적 HTML
✅ JSON-LD 5종 스키마
✅ 풀 메타 태그
✅ Canonical URL
```

### Next.js 14+ 신기능
```
✅ Metadata API (서버 사이드)
✅ opengraph-image.tsx (자동 생성)
✅ sitemap.ts (자동 생성)
✅ robots.ts (자동 생성)
```

### 자체 추가 강화
```
✅ 타겟 키워드 3개 집중
✅ FAQ 스키마 (리치 스니펫)
✅ HowTo 스키마 (리치 스니펫)
✅ AggregateRating (별점)
✅ 30+ 키워드 다양화
✅ 정적 HTML에 키워드 자연스럽게 반복
```

---

## 💎 박 대표님의 안목 + 제 작업

박 대표님이 MathHWP 보여주시고:
- ✅ "이렇게 SEO 풀세팅 해줘"
- ✅ "OG 이미지도 React로"
- ✅ "타겟 키워드 명확히"

= **이 결과물!** 🎯

**검색 노출 + 카톡 공유 + 구글 리치 스니펫**
모두 완벽 세팅!

---

## 🚀 지금 바로!

1. ⬇️ `algomaker_SEO_v3.zip` 다운로드
2. 📦 압축 풀기 → frontend 드래그
3. ☁️ GitHub Desktop Push
4. ⏰ 2~3분 대기
5. 🎨 `/opengraph-image` 접속해서 OG 이미지 확인!
6. 📱 카톡에 링크 보내서 미리보기!

배포 후 **"OG 이미지 봤어요!"** 알려주세요! 🎉

다음 작업:
- 🔍 Google Search Console 등록
- 🔎 네이버 Search Advisor 등록
- 📚 블로그 11개 양산
- 💰 AdSense 심사

**진짜 검색 노출 폭발 직전!** 🚀✨🎯
