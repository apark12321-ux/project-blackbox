# NuTube v2 적용 가이드 (메타데이터 생성기 통합 버전)

## 이번 변경 핵심

박 대표님께서 올려주신 옛 코드 `nutube_FINAL__6_.zip`에서 메타데이터 생성기 자산을 추출해
새 사이트 디자인에 통합했습니다.

### 추가된 자산 (46개 파일)

- **`app/publish/`** - 메타데이터 생성기 v15.0 본체 (page.tsx 1,365줄)
  - 박 대표님 v15: "케이스 바이 케이스로 모든 결과물이 보이는 구조"
  - 진입 즉시 모든 결과 펼침
  - 영상 미리보기 시각화
  - 시나리오 패턴 빠른 전환

- **`app/_shared/`** - 42개 컴포넌트/모듈
  - V18Shell (헤더/푸터 제거 버전으로 수정 - 새 layout과 중복 방지)
  - ContentProtection, AdGate, AdSlot 등 광고/보호 컴포넌트
  - contentEngine, promptEngine_v6_5_0, v650Adapter
  - CinematicPromptDisplay (영상 시퀀스 시각화)
  - algorithmInsights (시니어 타깃 최적화)
  - 그 외 모든 박 대표님 자산

### V18Shell 수정 사항

기존 V18Shell은 자체 헤더/푸터를 갖고 있었습니다.
새 사이트는 `app/layout.tsx`의 Header/Footer를 쓰므로 중복 방지를 위해
V18Shell의 헤더/푸터를 제거하고 단순 컨테이너로 변환했습니다.

따라서 `/publish` 페이지에서도:
- 상단: 새 사이트 헤더 (NuTube / 가이드 / 소개 / 메타데이터 생성기 버튼)
- 중간: 박 대표님의 메타데이터 생성기 v15.0
- 하단: 새 사이트 푸터

이렇게 통합된 모습으로 보일 겁니다.

## 적용 절차

박 대표님이 `rmdir /s /q artifacts\nutube && mkdir artifacts\nutube`로 폴더를 비우신 상태입니다.

1. 이 ZIP을 다운로드
2. 압축 해제 → `artifacts/nutube/` 안 내용물 전체 복사
3. GitHub Desktop이 관리하는 `artifacts/nutube/` (비어있는 상태)에 붙여넣기
4. GitHub Desktop에서 변경사항 확인 (134개 파일 Added)
5. Commit & Push

Commit 메시지 예시:
```
feat: integrate metadata generator v15.0 with new design
```

## 빌드 결과 예상

- ✅ 사이트 디자인: 새 v2 (4개 카테고리 + 32편 글)
- ✅ /publish: 박 대표님 메타데이터 생성기 v15.0 (새 헤더/푸터 안에 통합)
- ✅ /blog/[slug]: 32편 글 마크다운 렌더링
- ✅ 모든 정적 페이지: About / Privacy / Terms / Partnership / Announcement

## 파일 구조

```
artifacts/nutube/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Header + Footer)
│   ├── globals.css
│   ├── page.tsx                # 홈
│   ├── publish/                # ★ 메타데이터 생성기 v15.0
│   │   ├── page.tsx           
│   │   ├── layout.tsx         
│   │   └── publish.module.css
│   ├── _shared/                # ★ 메타데이터 생성기 의존성 (42개)
│   │   ├── V18Shell.tsx       (헤더/푸터 제거 버전)
│   │   ├── contentEngine.ts
│   │   ├── v650Adapter.ts
│   │   ├── algorithmInsights.ts
│   │   ├── ContentProtection.tsx
│   │   └── ... 그 외 38개
│   ├── blog/, about/, privacy/, ...
│   └── api/
├── components/
│   ├── Header.tsx              # /publish 링크 포함
│   └── Footer.tsx
├── lib/site.ts, posts.ts
├── data/posts/                 # 32개 글
├── public/thumbnails/          # 32개 SVG
├── scripts/generate-sitemap.mjs
├── package.json
├── next.config.js
└── tsconfig.json
```

## 알려진 제한 사항

- 박 대표님 옛 `_lib/upstash.ts`, `_lib/security.ts`는 빌드 에러 방지를 위해 제외
  (publish 페이지가 사용하지 않음)
- 박 대표님 옛 `components/publish/`, `lib/api.ts` 등 일부는 publish 페이지가 직접 사용하지 않아 제외

만약 추가로 필요한 자산이 있다면 알려주세요.
