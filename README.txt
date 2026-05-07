============================================================
🔥 NuTube 최종 통합 버전 (v18.11 + v19 API)
============================================================

박 대표님 사이트의 모든 내용 통합:
- v18.11 디자인 + 가이드 33편
- v19 JSON CMS + REST API
- 박 대표님 자산 보호 (자동 차단)

============================================================
포함된 모든 내용
============================================================

[1] 사이트 디자인 (v18.11)
✅ 메인 페이지 (NuTube + 카테고리 4개 = 33편)
✅ 헤더/푸터 (V18Shell)
✅ Cinematic 컴포넌트 (빈 필드 처리)
✅ 정책 페이지 (about, contact)
✅ 메타데이터 생성기 (publish)

[2] 가이드 33편 (JSON 데이터)
✅ frontend/data/posts/[slug].json (33개)
✅ frontend/data/posts/_index.json (전체 목록)
✅ 알고리즘 10 / 시니어 10 / AI 도구 9 / 수익화 4

[3] REST API 엔드포인트 (v19)
✅ GET    /api/posts                 목록
✅ GET    /api/posts?category=...    필터
✅ GET    /api/posts/[slug]         단일
✅ POST   /api/posts                 등록 (Bearer 토큰)
✅ PUT    /api/posts/[slug]          수정 (Bearer 토큰)
✅ DELETE /api/posts/[slug]          삭제 (Bearer 토큰)
✅ GET    /api/categories            카테고리
✅ GET    /api/health                헬스 체크

[4] 동적 라우트
✅ frontend/app/blog/[slug]/page.tsx (33편 처리)
✅ frontend/app/sitemap.ts (자동 생성)

[5] 박 대표님 자산 보안 (자동)
✅ 매뉴얼 키워드 차단 (위영/당근팀/GEMS 등)
✅ 박예준 개인 이름 차단
✅ 박 실장 7계명 자동 검증

============================================================
박 대표님 적용 - 3단계
============================================================

[필수 1] frontend/package.json 편집
GitHub 에서:
"react-markdown": "^10.1.0" 추가

[필수 2] Vercel 환경 변수
NUTUBE_API_KEY = "박 대표님이 정한 비밀 키"

[필수 3] 33개 가이드 폴더 삭제
GitHub 의 frontend/app/blog/ 안 33개 폴더 모두 삭제
(새 [slug] 동적 라우트가 처리)

============================================================
적용 방법
============================================================

1. ZIP 다운로드 + 압축 풀기

2. 집 PC GitHub Desktop 에서:
   - 박 대표님 GitHub 폴더 열기
   - frontend/ 안 두 폴더 통째 복사:
     * app/ (전체)
     * data/ (NEW - 33개 JSON)
   - 기존 frontend/app/blog/ 안 33개 폴더 삭제

3. GitHub Desktop 변경 감지

4. Summary: feat: v19 - JSON CMS + REST API

5. Commit + Push

6. Vercel 자동 빌드 (3~5분)

============================================================
박 대표님 자산 (이 ZIP X 포함 - GitHub 보존)
============================================================

박 대표님 자산 파일 (어시스턴트 보유 X):
- frontend/app/_shared/contentEngine.ts (1,723줄)
- frontend/app/_shared/v650Adapter.ts (141줄)
- frontend/app/_shared/promptEngine_v6_5_0.ts
- frontend/app/_shared/scenarioEngine_v6_5_0.ts
- frontend/app/_shared/snsFormatGenerator_v6_5_0.ts
- frontend/app/_shared/algorithmInsights.ts
- frontend/app/_shared/CinematicScenarioDisplay.tsx

이 파일들은 박 대표님 GitHub 에 그대로 보존됨.
ZIP 적용 시 영향 X.

============================================================
검증 통과
============================================================

✅ 16/16 .tsx/.ts 파싱 OK
✅ 34/34 JSON 검증 OK
✅ 33편 가이드 (10/10/9/4)
✅ 박 대표님 매뉴얼 보안 100%
✅ 박 대표님 개인 이름 0곳
✅ AlgoMaker 잔재 0곳

수고하셨습니다, 박 대표님.
