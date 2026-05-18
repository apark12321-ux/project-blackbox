# NuTube v2 적용 가이드

## 변경 요약

박 대표님께서 요청하신 대로 **메타데이터 생성기는 그대로 유지하고, 블로그 부분을 zip9.kr 스타일로 통째 재구축**한 버전입니다.

### 핵심 변경 사항

1. **블로그 페이지 (`/blog/[slug]`)** - 마크다운 확실히 렌더링되는 단순 구조
2. **새 글 32편** - 카테고리별 페르소나 차별화 (알고리즘 8 + 시니어 8 + AI도구 8 + 수익화 8)
3. **자연스러운 발행 패턴** - 4/28 ~ 5/17, 일부 휴재일 포함
4. **운영자 정보 통일** - 알고파트너스 / 박예준 / apark12321@gmail.com
5. **5개 정적 페이지** - About / Privacy / Terms / Partnership / Announcement
6. **SEO 인프라** - sitemap.xml, robots.txt, JSON-LD, ads.txt
7. **AdSense 코드** - 메타 태그 + 스크립트 자동 적용

### 메타데이터 생성기 (`/publish`)

- **현재 상태:** "점검 중" 임시 안내 페이지로 대체
- **이유:** 박 대표님 핵심 자산 (V18Shell, ContentProtection, contentEngine, promptEngine 등)을 GitHub에서 받아 통합해야 함
- **다음 단계:** 박 대표님이 GitHub에서 `/publish` 관련 코드를 별도로 ZIP 묶어 올려주시면 통합 진행

---

## 적용 절차

### 1단계: 현재 코드 백업

GitHub Desktop에서:
- `Repository → Show in Explorer`
- `artifacts/nutube/` 폴더 전체를 별도 위치로 복사 (예: `artifacts/nutube_backup_20260518/`)

### 2단계: 새 파일로 덮어쓰기

ZIP에서 추출한 `artifacts/nutube/` 폴더 내용을 기존 위치에 덮어쓰기.

**유지할 박 대표님 자산** (덮어쓰면 안 되는 것):
- `app/publish/` 폴더 — 메타데이터 생성기 (단, 이 ZIP의 임시 페이지로 교체된 상태이니 백업본에서 복원 필요)
- `app/_shared/` 또는 관련 V18Shell·ContentProtection 코드 (있다면)
- `lib/contentEngine*`, `lib/promptEngine*` (있다면)

### 3단계: GitHub Desktop에서 커밋

```
Commit message: rebuild: NuTube blog system - 32 posts with category personas, SEO infrastructure
```

`Commit to main` 클릭 → `Push origin` 클릭

### 4단계: Vercel 자동 빌드 대기

1~2분 후 `https://www.nutube.kr/`에서 확인:
- 홈페이지 정상 표시
- 4개 카테고리 카드 보임
- 최신 글 9개 노출
- `/blog` 클릭 시 32편 목록
- 글 클릭 시 본문이 마크다운으로 정상 렌더링되는지

---

## 다음 작업 (메타데이터 생성기 복원)

1. GitHub에서 `artifacts/nutube/app/publish/` 폴더 + 관련 의존성 (V18Shell, contentEngine 등) ZIP으로 묶어 올려주세요.
2. 그러면 이번 새 구조에 통합해서 다시 ZIP 드립니다.

---

## 파일 구조

```
artifacts/nutube/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (AdSense, OG, JSON-LD)
│   ├── globals.css             # 전역 스타일
│   ├── page.tsx                # 홈
│   ├── not-found.tsx           # 404
│   ├── sitemap.ts              # 동적 sitemap
│   ├── robots.ts               # robots.txt
│   ├── blog/
│   │   ├── page.tsx            # 블로그 목록
│   │   └── [slug]/page.tsx     # 블로그 상세 (마크다운 렌더)
│   ├── api/posts/
│   │   ├── route.ts            # 전체 글 API
│   │   └── [slug]/route.ts     # 개별 글 API
│   ├── publish/page.tsx        # 메타데이터 생성기 (임시)
│   ├── about/page.tsx          # 소개
│   ├── privacy/page.tsx        # 개인정보처리방침
│   ├── terms/page.tsx          # 이용약관
│   ├── partnership/page.tsx    # 제휴 문의
│   └── announcement/page.tsx   # 공지사항
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── site.ts                 # 사이트 설정 + 카테고리 정의
│   └── posts.ts                # 게시물 로딩 (서버사이드 fs)
├── data/posts/                 # 32개 JSON 글
├── public/
│   ├── ads.txt                 # AdSense 인증
│   └── thumbnails/             # 32개 SVG 썸네일
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## 카테고리별 페르소나

| 카테고리 | 페르소나 | 톤 |
|---|---|---|
| 유튜브 알고리즘 | 깐깐한 전략가 | "결론부터.", 단호, 숫자 우선 |
| 시니어 사연 쇼츠 | 친근한 멘토 | "~죠?", "드디어", 따뜻함 |
| AI 도구 | 실용적 동네 형 | "~게요", "~거든요", 가벼움 |
| 영상 채널 수익화 | 정중한 컨설턴트 | "신중히", "검토하시기 바랍니다" |

---

## 주의 사항

- **사용 라이브러리 추가:** `react-markdown`, `remark-gfm` (package.json에 포함)
- **next.js 15.5.18** 기준
- **데이터는 fs.readFileSync로 서버사이드 로딩** — Vercel에서도 작동 (정적 빌드 시)
- **SVG 썸네일** — 1200x630, 카테고리별 그라데이션 + 이모지

---

## 문제 발생 시

빌드 실패 메시지를 그대로 전달해주시면 즉시 진단 가능합니다.

가장 흔한 문제:
1. `react-markdown`, `remark-gfm` 미설치 → `pnpm install` 한 번 더 실행
2. 박 대표님 기존 코드와 충돌 → `/publish` 폴더만 백업본에서 복원
3. 환경 변수 누락 → `.env.local` 확인 (메타데이터 생성기 복원 후)
