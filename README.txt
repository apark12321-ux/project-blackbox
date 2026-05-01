============================================================
AlgoMaker — FINAL (메인 v9.7 + V11Shell v11.2 + 모든 자산)
============================================================

박 대표님 요청 통합:
  ✅ 메인 D안 (A+B+C 모두): 시각적 + 키워드 박스 + 컴팩트
  ✅ 로고 사이즈 확대 (약 30%)
  ✅ 로고 클릭 시 홈 이동
  ✅ publish v10.7 (자동 이동 + 4개 플랫폼)
  ✅ 가이드 5편

============================================================
포함 파일 10개
============================================================

[메인 영역]
- frontend/app/page.tsx              v9.7 (D안 + 키워드 박스)
- frontend/app/layout.tsx            v9.4 (이메일 변경)
- frontend/app/_shared/V11Shell.tsx  v11.2 (로고 확대 + 클릭)
- frontend/public/ads.txt

[publish 영역]
- frontend/app/publish/page.tsx      v10.7 (4개 플랫폼)

[가이드 5편]
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/ai-tools/page.tsx

============================================================
박 대표님 적용 단계 (5분)
============================================================

★ 박 대표님이 v9.6은 적용했지만 v9.7과 V11Shell v11.2는 아직 미적용
  이번 ZIP으로 한 번에 모두 적용

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속 (frontend 폴더)

3. 기존 파일 삭제할 필요 없음. "Add file" → "Upload files"
   (같은 경로의 파일은 덮어씌워짐)

4. 압축 푼 폴더의 frontend/ 안 내용 통째로 드래그
   - app/ 폴더 (page.tsx + layout.tsx + publish/ + _shared/ + blog/)
   - public/ 폴더

5. Commit message: feat: 메인 v9.7 + 로고 v11.2

6. Vercel 자동 빌드 1~2분 → Ready

7. 시크릿 창 (Ctrl+Shift+N) → nutube.kr 접속

8. 확인할 것:
   ✓ 로고 크게 보임 (이전보다 약 30% 확대)
   ✓ 로고 클릭하면 홈으로 이동 (어느 페이지에서든)
   ✓ Hero에 주황 테두리 키워드 박스
   ✓ "⚡ 빠른 시작" 라벨 + 입력 + 카테고리 9개 칩
   ✓ 가이드 카드 emoji + 색상 액센트
   ✓ 카테고리 카드 큰 emoji
   ✓ FAQ 아코디언 (첫 1개만 펼침)
   ✓ publish 페이지 v10.7 자동 이동 + 4개 플랫폼

============================================================
변경 상세
============================================================

V11Shell v11.2 (NEW):
  - 로고 sizes: sm 14→18, md 18→22, lg 24→28 (약 30% 확대)
  - 로고 = Link로 감싸짐 (홈으로 이동)
  - aria-label="홈으로 이동" 접근성 추가
  - 사이드바 로고: sm → md (확대)
  - 모바일 헤더 로고: sm → md (확대)
  - 푸터 로고: md → lg (확대)
  - asLink={false} 옵션으로 비활성화 가능

메인 v9.7 (NEW):
  - Hero에 키워드 입력 박스 추가
  - 카테고리 9개 빠른 선택 칩 (emoji + 색상)
  - 입력 → /publish?keyword=xxx&category=yyy 자동 이동
  
메인 v9.6 유지:
  - 가이드/카테고리 카드 emoji + 색상
  - FAQ 아코디언
  - Hero 메타 4열 grid

============================================================
박 대표님 자산 100% 보존
============================================================

✅ FEATURED_GUIDES 6편 (모든 데이터 그대로 + emoji/color 추가)
✅ CATEGORY_NAV 9개 (모든 데이터 그대로 + emoji/color 추가)
✅ FAQ_LIST 6개 (그대로)
✅ AEO/GEO JSON-LD (그대로)
✅ 21개 메뉴 (V11Shell - 그대로)
✅ NOTICES 4개 (V11Shell - 그대로)
✅ contentEngine.ts (수정 없음)
✅ v650Adapter.ts (수정 없음)
