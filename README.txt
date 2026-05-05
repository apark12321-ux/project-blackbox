============================================================
AlgoMaker v18 FINAL - 애드센스 승인 마무리 버전
============================================================

★★★ 박 대표님 동결 약속 ★★★
이번 ZIP 적용 후 애드센스 승인 받으실 때까지
어시스턴트는 사이트를 건드리지 않습니다.
박 대표님은 가이드 포스팅 업데이트만 진행하시면 됩니다.

============================================================
이번 ZIP 마무리 작업 내용
============================================================

[1] Cinematic 빈 필드 숨김 처리
    박 대표님 캡처 3장에서 발견된 문제:
    - Midjourney: 일부 필드만 채워짐
    - Sora: SCENE/DURATION/AUDIO/ATMOSPHERE 빈 칸
    - VEO 3: 대부분 필드 빈 칸
    
    수정:
    - SpecRow 컴포넌트에 빈 값 체크
      → 빈 값이면 행 자체가 표시 안 됨
    - Sora Audio Direction 조건부 표시
    - VEO Output Specifications 각 항목 조건부 표시
    - Negative Prompt 조건부 표시
    
    결과: 빈 라벨이 화면에 노출되지 않음 (깔끔)
    박 대표님 자산 (v650Adapter, contentEngine 등) 그대로 보존

[2] 애드센스 마무리 - sitemap.xml + robots.txt
    Next.js 동적 생성 방식:
    - frontend/app/sitemap.ts (NEW)
    - frontend/app/robots.ts (NEW)
    
    구글 검색 등록 자동화:
    - 정적 페이지 7개 (홈/blog/publish/about/contact/privacy/terms)
    - 가이드 27편 동적 등록
    - 각 페이지 priority + changeFrequency 설정
    - Mediapartners-Google (애드센스 봇) 허용

============================================================
ZIP 구성 (38개 파일)
============================================================

frontend/app/
├── _shared/
│   ├── V18Shell.tsx (헤더 + 푸터)
│   ├── CinematicPromptDisplay.tsx (빈 필드 숨김 적용)
│   └── CinematicScenarioDisplay.tsx
├── layout.tsx (SEO 메타)
├── page.tsx (메인 v18 - 도구 입력 + 매거진)
├── sitemap.ts (NEW)
├── robots.ts (NEW)
├── about/page.tsx
├── contact/page.tsx
├── publish/page.tsx (PublishWrapper + KeywordInputForm)
└── blog/
    ├── page.tsx (가이드 목록)
    └── [27편 가이드]/page.tsx

============================================================
사이트 구조 (애드센스 친화)
============================================================

[헤더 메뉴 - 5개]
홈 / 가이드 / 메타데이터 생성기 / 소개 / 문의

[페이지 흐름]
- / (메인)
  → 큰 헤딩 + 카테고리 4개 + 최신 5편 + 인기 5편
  → 영상 메타데이터 생성기 섹션 (직접 입력 가능)
  → 사이트 소개

- /blog (가이드 목록)
  → 카테고리 필터 4개
  → 27편 가이드 리스트

- /blog/[slug] (가이드 상세)
  → 표준 블로그 글 디자인
  → H1-H2-H3 명확
  → 마지막에 "함께 보면 좋은 가이드"

- /publish (메타데이터 생성기)
  → 키워드 없으면 입력 폼 (NEW)
  → 키워드 있으면 결과 표시
  → 결과: 제목 5개, 시나리오, AI 프롬프트, SEO 태그, 해시태그

- /about (소개) - 애드센스 필수
- /contact (문의) - 애드센스 필수
- /privacy (개인정보) - 박 대표님 기존
- /terms (이용약관) - 박 대표님 기존

============================================================
박 대표님 자산 100% 보존
============================================================

✅ contentEngine.ts 그대로 (1,723줄)
✅ v650Adapter.ts 그대로
✅ generateV650Data, generateTitles 등 그대로
✅ algorithmInsights.ts (박 실장 11공식) 그대로
✅ 시니어 매뉴얼 알고리즘 그대로
✅ Cinematic 두 컴포넌트는 박 대표님 직접 요청 마무리 작업으로
   빈 필드 숨김만 추가 (박 대표님 본질 데이터 흐름 그대로)

박 대표님 매뉴얼 보안 100% 통과:
✅ 위영/Wiyoung/Starlight 노출 X
✅ 당근팀/Carrot Team 노출 X
✅ 마스터 매뉴얼/배포용 노출 X
✅ GEMS 노출 X
✅ 알뜰폰/길들이기/Edits 앱 노출 X

============================================================
가이드 27편 (43,223자)
============================================================

알고리즘 (10편):
- algorithm-seo, algorithm-retention, algorithm-branding
- algorithm-mistakes, youtube-algorithm, viral-patterns
- channel-concept, youtube-start, human-warmth, youtube-monetization

시니어 (5편):
- senior-channel-start, senior-content-ideas, senior-hook-patterns
- senior-engagement, senior-policy-safe

AI 도구 (9편):
- claude-youtube-workflow, chatgpt-script, ai-thumbnail
- ai-tools, phone-shooting, free-editing-apps
- camera-anxiety, thumbnail-tips, voice-seo

수익화 (3편):
- algorithm-mindset, first-100-subs, side-job-50, revenue-calc

평균 1,601자 (박 실장 권장 1,500-1,800자 충족)

============================================================
박 실장 7계명 점검
============================================================

1. 카테고리 1개만           ⚠️ 4개 (모두 유튜브 큰 주제)
2. 단정적 문어체            ✅ 27편 모두
3. 사진 1~2장만             ✅ 텍스트 위주
4. 1,500~1,800자            ✅ 평균 1,601자
5. H1-H2-H3 구조            ✅ 표준 블로그 구조
6. 게시물 20개 이상         ✅ 27편
7. 크롬 사용자              박 대표님 환경 OK

추가:
✅ /about, /contact, /privacy, /terms (애드센스 필수)
✅ sitemap.xml, robots.txt (구글 검색 등록)
✅ HTTPS Vercel 호스팅
✅ 모바일 우선 디자인
✅ URL 구조 단순
✅ 광고 코드 (ca-pub-9552509372228899) 그대로
✅ 도메인 nutube.kr 그대로

============================================================
박 대표님 적용 (1분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 frontend/ 안 내용 통째로 드래그
   ★ NEW: app/sitemap.ts, app/robots.ts
   ★ 수정: app/_shared/CinematicPromptDisplay.tsx
   ★ 수정: app/publish/page.tsx (이미 v18.2 적용됨)
   ★ 다른 파일들 (이미 적용된 v18 파일들)

5. "Replace existing file" 모두 선택

6. Commit message:
   feat: v18 final - 빈 필드 숨김 + sitemap/robots 추가

7. Vercel 빌드 (1~2분)

8. 시크릿 창 (Ctrl+Shift+N) → nutube.kr

9. 동작 테스트:
   ✓ 메인 → 키워드 입력 → 결과 정상 표시
   ✓ /publish 직접 접속 → 입력 폼 정상
   ✓ 결과 페이지 → 빈 필드가 안 보임 (이번 수정 확인)
   ✓ /sitemap.xml → XML 정상 표시
   ✓ /robots.txt → 정상 표시

10. 애드센스 재신청
    - https://www.google.com/adsense
    - 사이트 검토 요청
    - sitemap.xml 도 Google Search Console에 등록 권장

============================================================
포스팅 업데이트 가이드 (애드센스 승인 받으실 때까지)
============================================================

박 대표님이 직접 포스팅 추가하실 때:

[1] 새 가이드 만들기
    GitHub → frontend/app/blog/[새-slug]/page.tsx
    
    가장 쉬운 방법:
    1. 기존 가이드 (예: youtube-start) 복사
    2. 폴더 이름과 파일 내용 수정
    3. 글자 수 1,500자+ 유지

[2] 가이드 목록에 등록
    frontend/app/blog/page.tsx 의 GUIDES 배열에 추가
    
    {
      slug: '새-slug',
      title: '제목',
      subtitle: '부제',
      category: 'algorithm', // algorithm/senior/aitools/monetization
      categoryLabel: '알고리즘',
      readTime: '7분',
      publishedAt: '2026-05-XX',
    }

[3] sitemap.ts 에도 추가
    frontend/app/sitemap.ts 의 GUIDE_SLUGS 배열에 새 slug 추가

[4] 메인 페이지 (선택)
    frontend/app/page.tsx 의 LATEST 또는 POPULAR 배열 업데이트

★ 박 대표님이 수정하시기 어려우시면 어시스턴트에게 요청하세요
  단, 디자인/구조 변경 X, 포스팅 추가만

============================================================
승인 후 다음 작업 (어시스턴트 도움)
============================================================

박 대표님 애드센스 승인 받으시면:
- 광고 슬롯 자연스러운 배치
- 인-피드 광고 (가이드 목록 사이)
- 인-아티클 광고 (가이드 본문 안)
- 콘텐츠 추가 (계속 성장)
- 박 대표님이 원하시는 디자인 개선

만약 거절되면:
- Plan C 적용 (박 실장 권장)
- Google Search Console 색인 확인
- 카테고리 1개로 집중 (필요 시)
- 추가 가이드 작성

============================================================
어시스턴트 동결 약속
============================================================

이번 ZIP 적용 후 박 대표님이 다시 작업 요청하시기 전까지:
✅ 사이트 디자인 변경 X
✅ 페이지 구조 변경 X
✅ 컴포넌트 수정 X
✅ 박 대표님 자산 건드림 X

박 대표님은 안심하시고 애드센스 승인을 기다리시면 됩니다.
포스팅 업데이트가 필요하시면 말씀해주세요.

수고하셨습니다, 박 대표님.
