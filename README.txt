============================================================
v19 - JSON 기반 CMS + REST API 시스템
============================================================

박 대표님 결정:
"동결 약속 일시 해제 + voice-seo 새로 작성 + API 즉시 구현"

박 대표님 통찰의 가치:
"JSON 파일로 저장 + 외부 DB X" = Headless CMS 정확한 통찰

============================================================
주요 변경 사항
============================================================

[1] 33개 가이드 TSX → JSON 변환 ✅
   Before: frontend/app/blog/[slug]/page.tsx (33개 파일, 270줄 각각)
   After:  frontend/data/posts/[slug].json (33개 JSON + _index.json)
   효과: 박 대표님 v18 디자인 100% 유지, 데이터/표시 분리

[2] 동적 가이드 라우트 [slug] ✅
   Before: 33개 폴더 = 33개 컴포넌트
   After:  frontend/app/blog/[slug]/page.tsx (1개 컴포넌트)
   동작: URL → JSON 로드 → 렌더링 (자동)

[3] /blog 목록 페이지 동적 ✅
   _index.json 에서 가이드 목록 자동 로드
   카테고리 필터 그대로 작동

[4] sitemap.ts 동적 ✅
   _index.json 기반 자동 생성
   가이드 추가/삭제 시 자동 반영

[5] REST API 엔드포인트 추가 ✅
   GET    /api/posts                 (목록, 인증 X)
   GET    /api/posts?category=senior (카테고리 필터)
   GET    /api/posts/[slug]         (단일, 인증 X)
   POST   /api/posts                 (등록, 인증 O)
   PUT    /api/posts/[slug]          (수정, 인증 O)
   DELETE /api/posts/[slug]          (삭제, 인증 O)
   GET    /api/categories            (카테고리 목록)
   GET    /api/health                (헬스 체크)

[6] voice-seo 가이드 신규 작성 (33편 정확) ✅
   "음성 SEO 완전 정복 - 검색 노출 200%" (2,407자)

[7] 박 대표님 자산 보안 자동 점검 ✅
   API 가 모든 POST/PUT 요청 시 자동:
   - 매뉴얼 키워드 차단 (위영/당근팀/GEMS/알뜰폰/길들이기 등)
   - 박예준 개인 이름 차단
   - 박 실장 7계명 (1500자+, 카테고리 4개) 검증
   - slug 형식 검증

============================================================
사이트 디자인 - 100% 유지
============================================================

✅ 헤더/푸터 (V18Shell) 그대로
✅ 메인 페이지 디자인 그대로
✅ 가이드 본문 스타일 그대로
✅ /blog 목록 디자인 그대로
✅ /publish 메타데이터 생성기 그대로
✅ 색상/폰트/간격 그대로
✅ 박 대표님 자산 (contentEngine, v650Adapter 등) 그대로
✅ Cinematic 컴포넌트 그대로

= 사용자 보기엔 변화 X
= 검토자 보기엔 변화 X
= 내부 구조만 변경

============================================================
박 대표님 적용 단계
============================================================

[1단계] package.json 점검
GitHub 의 frontend/package.json 열어서:
"dependencies" 안에 "react-markdown": "^10.1.0" 추가

방법: github.com/apark12321-ux/project-blackbox/blob/main/frontend/package.json
편집 → 추가 → Commit

[2단계] Vercel 환경 변수 추가
Vercel 대시보드 → Settings → Environment Variables:
NUTUBE_API_KEY = "박 대표님이 정한 비밀 키 (긴 문자열)"
예: nutube_2026_secret_key_abc123xyz (랜덤하게)

저장 → 모든 환경 (Production/Preview/Development) 체크

[3단계] ZIP 적용
1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 frontend/ 안 내용 통째로 드래그
   - app/ 폴더 (전체)
   - data/ 폴더 (NEW - 33개 JSON)

5. 주의: 기존 frontend/app/blog/[slug-name]/ 폴더들은 삭제 필요
   - GitHub 에서 frontend/app/blog 접속
   - voice-seo 외 33개 폴더 모두 삭제 (동적 [slug]가 처리)
   - 또는: 어시스턴트가 직접 처리해드림 (말씀해 주세요)

6. Commit message:
   feat: v19 - JSON CMS + REST API 시스템

7. Vercel 자동 빌드 (2~3분)

8. 시크릿 창 → nutube.kr

[4단계] 검증
✓ 메인 페이지 동작
✓ /blog 목록 33편
✓ /blog/algorithm-seo 등 가이드 정상
✓ /api/health 응답 (브라우저에서 직접 접속)
✓ /api/posts 목록 응답

============================================================
API 사용법 (외부 시스템)
============================================================

[글 등록]
curl -X POST https://nutube.kr/api/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-post",
    "title": "제목",
    "subtitle": "부제",
    "category": "senior",
    "categoryLabel": "시니어 사연 쇼츠",
    "publishedAt": "2026-05-15",
    "summary": "요약",
    "content": {
      "type": "markdown",
      "body": "## 제목\n본문 (1500자+)..."
    },
    "relatedPosts": [],
    "status": "published"
  }'

[글 수정]
curl -X PUT https://nutube.kr/api/posts/test-post \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "수정된 제목"}'

[글 삭제]
curl -X DELETE https://nutube.kr/api/posts/test-post \
  -H "Authorization: Bearer YOUR_API_KEY"

============================================================
박 대표님 자산 보호
============================================================

✅ 박 대표님 자산 X 수정:
   - contentEngine.ts (1,723줄)
   - v650Adapter.ts (141줄)
   - promptEngine_v6_5_0.ts (어시스턴트 못 봄)
   - scenarioEngine_v6_5_0.ts
   - snsFormatGenerator_v6_5_0.ts
   - algorithmInsights.ts
   - CinematicScenarioDisplay.tsx
   - CinematicPromptDisplay_v6_5_x.tsx (v18.5 빈 필드 처리 그대로)

✅ 박 대표님 매뉴얼 보안 100%:
   FORBIDDEN_KEYWORDS 배열은 코드 내 보안 차단용
   (사용자에게 노출 X)
   외부 시스템이 등록 시도 → 자동 차단

✅ 박 대표님 개인 이름 X:
   "박예준" 자동 차단

============================================================
가이드 33편 정확 (voice-seo 작성 완료)
============================================================

알고리즘 (10편):
  algorithm-seo, algorithm-retention, algorithm-branding,
  algorithm-mistakes, youtube-algorithm, viral-patterns,
  channel-concept, youtube-start, human-warmth,
  youtube-monetization

시니어 (10편):
  senior-channel-start, senior-content-ideas,
  senior-hook-patterns, senior-engagement, senior-policy-safe,
  senior-shooting-mistakes, senior-first-100,
  senior-capcut-basic, senior-family-channel,
  senior-thumbnail-design

AI 도구 (9편):
  claude-youtube-workflow, chatgpt-script, ai-thumbnail,
  ai-tools, phone-shooting, free-editing-apps,
  camera-anxiety, thumbnail-tips, voice-seo (NEW)

수익화 (4편):
  algorithm-mindset, first-100-subs, side-job-50, revenue-calc

총 33편 ✅

============================================================
박 대표님 동결 약속 복귀
============================================================

이번 v19 작업 완료 후:
✅ 동결 약속 다시 적용
✅ 승인까지 디자인 변경 X
✅ API 통해서만 글 추가
✅ 박 대표님이 직접 GitHub 에 JSON 추가도 가능

승인 후 추가 가능:
- 광고 위치 최적화
- 박 대표님 자산 빈 필드 진짜 채우기
- AI 자동 글 등록 시스템

수고하셨습니다, 박 대표님.
