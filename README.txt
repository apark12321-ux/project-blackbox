============================================================
NuTube 사이트 전체 파일 백업 (v18.11 + voice-seo)
============================================================

박 대표님 nutube.kr 사이트의 현재 적용된 상태 전체.

============================================================
포함된 내용
============================================================

[메인 페이지]
frontend/app/page.tsx
  - NuTube 브랜드
  - 카테고리 카드 (알고리즘 10 / 시니어 10 / AI 9 / 수익화 4 = 33편)
  - 헤로 + 3가지 특징 + 가치 영역
  - POPULAR 영역 (cat 라벨 통일)
  - 박 실장 알고리즘 11공식 자동 적용 도구

[SEO + 메타]
frontend/app/layout.tsx (NuTube + 33편)
frontend/app/sitemap.ts (lastmod + priority 차별화)
frontend/app/robots.ts

[셸 + 컴포넌트]
frontend/app/_shared/V18Shell.tsx (NuTube 헤더/푸터)
frontend/app/_shared/CinematicPromptDisplay_v6_5_0.tsx
frontend/app/_shared/CinematicPromptDisplay_v6_5_1.tsx (빈 필드 처리)

[정책 페이지]
frontend/app/about/page.tsx (NuTube + 알고파트너스)
frontend/app/contact/page.tsx (NuTube + 알고파트너스)

[메타데이터 생성기]
frontend/app/publish/page.tsx (v18.5 키워드 태그 # 없이)

[가이드 33편]
frontend/app/blog/page.tsx (목록, 최신순 자동 정렬)
frontend/app/blog/[33개 폴더]/page.tsx
  알고리즘 11편:
    algorithm-seo, algorithm-retention, algorithm-branding,
    algorithm-mistakes, youtube-algorithm, viral-patterns,
    channel-concept, youtube-start, human-warmth,
    youtube-monetization, algorithm-mindset
    (※ algorithm-mindset 은 monetization 카테고리)
  시니어 10편:
    senior-channel-start, senior-content-ideas,
    senior-hook-patterns, senior-engagement, senior-policy-safe,
    senior-shooting-mistakes, senior-first-100,
    senior-capcut-basic, senior-family-channel,
    senior-thumbnail-design
  AI 도구 9편:
    claude-youtube-workflow, chatgpt-script, ai-thumbnail,
    ai-tools, phone-shooting, free-editing-apps,
    camera-anxiety, thumbnail-tips, voice-seo
  수익화 4편 (algorithm-mindset 포함):
    algorithm-mindset, first-100-subs, side-job-50, revenue-calc

============================================================
박 대표님 자산 (이 ZIP 에 포함 X - GitHub 에서)
============================================================

다음 파일은 박 대표님 자산이라 어시스턴트가 보유 X:
- frontend/app/_shared/contentEngine.ts (1,723줄)
- frontend/app/_shared/v650Adapter.ts (141줄)
- frontend/app/_shared/promptEngine_v6_5_0.ts
- frontend/app/_shared/scenarioEngine_v6_5_0.ts
- frontend/app/_shared/snsFormatGenerator_v6_5_0.ts
- frontend/app/_shared/algorithmInsights.ts
- frontend/app/_shared/CinematicScenarioDisplay.tsx

이 파일들은 박 대표님 GitHub 에 그대로 보관됨.
ZIP 적용 시 GitHub 에 있는 박 대표님 자산은 영향 X.

============================================================
박 대표님 자산 보안 100% 통과
============================================================

✅ 위영, Wiyoung, Starlight - 0곳
✅ 당근팀, Carrot Team - 0곳
✅ 마스터 매뉴얼, 배포용 - 0곳
✅ GEMS - 0곳
✅ 알뜰폰, 비행기 모드, 공기계, 중고폰 - 0곳
✅ 길들이기 - 0곳
✅ 박예준 (개인 이름) - 0곳
✅ AlgoMaker (옛 브랜드) - 0곳

= 박 대표님 매뉴얼 보안 + 개인정보 보호 100%

============================================================
박 대표님 적용 방법 - 가장 쉬운 방법 (GitHub 웹 UI)
============================================================

[1] 브라우저 (크롬) 열기

[2] github.com 접속 + 로그인

[3] project-blackbox 저장소 접속:
   github.com/apark12321-ux/project-blackbox

[4] frontend 폴더 클릭

[5] "Add file" 버튼 → "Upload files"

[6] ZIP 압축 푼 후 frontend 폴더 안 내용 통째 드래그
   - app/ 폴더 (전체)

[7] 화면 아래 commit message:
   chore: nutube v18.11 전체 파일 동기화

[8] "Commit changes" 클릭

[9] Vercel 자동 빌드 (1~2분)

[10] 시크릿 창 → nutube.kr 확인

============================================================
박 대표님 노트북 GitHub Desktop 처리
============================================================

박 대표님이 노트북 GitHub Desktop 충돌 상태였음.

[권장 - 가장 안전]
1. 노트북 GitHub Desktop 의 "Abort merge" 클릭 (취소)
2. GitHub Desktop 종료
3. 노트북에서는 GitHub Desktop 안 쓰고 GitHub 웹 UI 사용

[노트북 GitHub Desktop 폴더 정리하실 경우]
1. 노트북 Documents/GitHub/project-blackbox 폴더 삭제
2. GitHub Desktop 에서 다시 clone (최신 상태 받기)
3. 데스크톱 PC 와 동일 상태

[브라우저만 사용]
- 노트북에 GitHub Desktop X 사용
- github.com 에서 모든 작업 가능
- 데스크톱 PC, 노트북 모두 동일 환경

============================================================
박 대표님 사이트 안전 보장
============================================================

이 ZIP 은 박 대표님 nutube.kr 의 현재 적용된 상태입니다.

GitHub 에 그대로 적용해도:
✅ 사이트 외관 동일 (변화 X)
✅ 박 대표님 자산 영향 X (자산 파일은 GitHub 에 그대로)
✅ 애드센스 심사 영향 X
✅ 사용자 경험 동일

만약 박 대표님 노트북 GitHub Desktop 의 옛날 코드가
이미 GitHub 에 적용되었다면:
이 ZIP 으로 다시 복구 가능

수고하셨습니다, 박 대표님.
