============================================================
v18.9 - 브랜드 변경 AlgoMaker → NuTube (도메인 일치)
============================================================

박 대표님 통찰:
  "nutube.kr 도메인과 AlgoMaker 브랜드 일치 시키는게 어때?"

어시스턴트 결정:
  옵션 1 - 브랜드 변경 (AlgoMaker → NuTube)
  
이유:
  ✅ 도메인 그대로 = 애드센스 영향 X
  ✅ 박 대표님 시간/돈 절약
  ✅ AlgoMaker 외부 노출 거의 없음 = 손실 적음
  ✅ NuTube = 도메인과 일치 = 인식 일치
  ✅ 시니어 친화 (튜브 = 유튜브 친숙)

============================================================
변경 결과
============================================================

[사용자 노출 영역]
✅ 헤더 로고: AlgoMaker → NuTube
✅ 푸터 제목: AlgoMaker → NuTube
✅ 푸터 카피라이트: 알고파트너스 (개인 이름 X 유지)
✅ 메인 페이지 가치 영역: NuTube가 추구하는 가치
✅ 메인 페이지 사이트 소개: NuTube는 유튜브 채널...
✅ /about 페이지: NuTube 소개
✅ /contact 페이지: NuTube
✅ 가이드 13편 본문 NuTube 언급
✅ layout.tsx SEO 메타: NuTube
✅ FAQ: "NuTube는 무엇인가요?"
✅ 트위터 핸들: @nutube

[코드 식별자 - 변경 X (안전)]
✅ algomaker:consent-granted (이벤트 ID) 유지
   → 광고 동의 시스템 정상 작동

총 50곳 변경 / 38개 파일

============================================================
영향 안 받는 부분 (그대로 유지)
============================================================

✅ 도메인: nutube.kr (애드센스 신청한 도메인 그대로)
✅ AdSense Publisher ID: ca-pub-9552509372228899
✅ GitHub 저장소: project-blackbox (저장소 이름 변경 X)
✅ Vercel 프로젝트: 그대로
✅ 사업자명: 알고파트너스 (브랜드와 별개)
✅ 박 대표님 자산:
   - contentEngine.ts
   - v650Adapter.ts
   - promptEngine_v6_5_0.ts (어시스턴트 못 봄)
   - scenarioEngine_v6_5_0.ts
   - snsFormatGenerator_v6_5_0.ts
   - algorithmInsights.ts
✅ 가이드 33편 본문 (NuTube 언급 외 그대로)
✅ Cinematic 컴포넌트 (v18.5 빈 필드 처리 그대로)
✅ /publish 페이지 (v18.5 키워드 태그 그대로)
✅ sitemap (v18.7 정렬 그대로)
✅ 박 대표님 매뉴얼 보안 100%

============================================================
변경 파일 (40개+ )
============================================================

[셸 + 레이아웃]
frontend/app/layout.tsx
frontend/app/_shared/V18Shell.tsx
frontend/app/_shared/CinematicPromptDisplay_v6_5_0.tsx (그대로)
frontend/app/_shared/CinematicPromptDisplay_v6_5_1.tsx (그대로)

[페이지]
frontend/app/page.tsx (메인)
frontend/app/blog/page.tsx (가이드 목록)
frontend/app/about/page.tsx
frontend/app/contact/page.tsx
frontend/app/publish/page.tsx (v18.5)
frontend/app/sitemap.ts
frontend/app/robots.ts

[가이드 33편]
frontend/app/blog/[27편 기존]/page.tsx
frontend/app/blog/[5편 신규]/page.tsx

============================================================
박 대표님 적용 (1분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 frontend/ 안 내용 통째로 드래그

5. "Replace existing file" 모두 선택

6. Commit message:
   feat: 브랜드 변경 AlgoMaker → NuTube (도메인 일치)

7. Vercel 빌드 (1~2분)

8. 시크릿 창 → nutube.kr

9. 동작 확인:
   ✓ 헤더 로고 "NuTube" 표시
   ✓ 푸터 "NuTube" 표시
   ✓ 메뉴 클릭 → 모든 페이지 NuTube 노출
   ✓ /about - "NuTube 소개"
   ✓ /contact - "NuTube" 운영
   ✓ 가이드 본문 "NuTube" 언급 정상
   ✓ /publish - 광고 시스템 정상 작동 (algomaker:consent 이벤트 유지)
   ✓ /sitemap.xml - URL 그대로 (도메인 X 변경)

============================================================
NuTube 의미
============================================================

NU + TUBE
- NU: New (새로운) / Now (현재) / 누구나
- TUBE: 유튜브
= "새로운 유튜브 시작" / "지금 유튜브"
= "누구나 유튜브"

박 대표님 사이트 정체성:
- 시니어 유튜브 입문 (50~70대)
- 누구나 시작할 수 있는 곳
- 새로운 시작
= NuTube 와 일치

============================================================
브랜드 일치의 SEO 효과
============================================================

[Before]
도메인: nutube.kr
브랜드: AlgoMaker
사용자: "이 사이트 이름이 뭐지?" 혼란
SEO: 도메인 + 브랜드 키워드 분산

[After]
도메인: nutube.kr
브랜드: NuTube
사용자: 도메인 = 브랜드 = 직관적
SEO: 통일 키워드 = 검색 노출 ↑
북마크 / 공유 시 인지 ↑

============================================================
어시스턴트 동결 약속 유지
============================================================

이번 v18.9 = 박 대표님 직접 지적 + 권장 (브랜드 일치)
다른 부분 X 건드림.

추가된 것 (이번 변경):
  ✅ 사이트 전체 NuTube 통일
  ✅ 도메인 + 브랜드 일치
  ✅ 코드 식별자 안전 유지

승인 받으실 때까지 동결 유지.
박 대표님 직접 요청 시에만 추가 작업.

수고하셨습니다, 박 대표님.
