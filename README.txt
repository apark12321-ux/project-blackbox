============================================================
AlgoMaker — FINAL (메인 v10.0 대시보드 + V11Shell v11.2 + 모든 자산)
============================================================

박 대표님 v10.0 요청 (D안 어시스턴트 판단):
  "메인 페이지를 아래로 쭉 스크롤하지 않고 전체를 볼 수 있도록 설계"
  "모바일에서도 잘 보이도록"

해결: 대시보드 1화면 구조
  - Hero 큰 영역 제거
  - 추천 시작 카드 제거 (가이드와 중복)
  - 보조 도구 섹션 제거 (메뉴에 이미 있음)
  - 메타 4개 (가이드 17편/9분야/매주/무료) 제거
  
  새 구조:
    1. 키워드 박스 (가장 위)
    2. 가이드 6개 + 분야 9개 (가로 2분할 3:2 비율)
    3. 광고
    4. FAQ 6개 (모두 접힘)
  
  총 4섹션, 데스크탑 1280×800에서 거의 1화면 안에 보임.

============================================================
변경 비교 (v9.7 → v10.0)
============================================================

코드 줄 수:    1131 → 764 (33% 단축)
섹션 개수:    7개 → 4개
모바일 스크롤: 8~10번 → 2~3번 (약 70% 감소)

제거된 것:
  ❌ Hero 큰 타이틀 ("50대도 시작하는 영상 만들기, 처음부터 끝까지~")
  ❌ Hero 메타 4개 (가이드 17편/9분야/매주/무료)
  ❌ 추천 시작 큰 카드
  ❌ 보조 도구 섹션
  ❌ 가이드/분야/FAQ 섹션 헤더의 큰 타이틀

유지된 것:
  ✅ 키워드 박스 (강조 형태)
  ✅ 카테고리 9개 빠른 선택 칩
  ✅ 추천 가이드 6개 (emoji + 색상)
  ✅ 분야별 9개 (emoji + 색상)
  ✅ FAQ 6개 (아코디언, 모두 접힘)
  ✅ 광고 1개

============================================================
박 대표님 적용 (5분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"
   (같은 경로 파일은 자동 덮어씌움)

4. 압축 푼 폴더의 frontend/ 안 내용 통째로 드래그
   (app/ + public/)

5. Commit message: feat: 메인 v10.0 대시보드 1화면

6. Vercel 자동 빌드 1~2분

7. 시크릿 창 (Ctrl+Shift+N) → nutube.kr 접속

8. 확인:
   ✓ 큰 Hero 영역 없음
   ✓ 위에서부터 키워드 박스 → 가이드+분야 → FAQ
   ✓ 데스크탑: 가이드(왼쪽 6개) + 분야(오른쪽 9개) 가로 2분할
   ✓ 모바일: 위→아래 stack, 짧음
   ✓ FAQ 모두 접혀있고 클릭하면 펼쳐짐
   ✓ 키워드 입력 → /publish 페이지 정상 이동

============================================================
박 대표님 자산 100% 보존
============================================================

✅ FEATURED_GUIDES 6편 (slug, title, subtitle, readTime, badge, category)
✅ CATEGORY_NAV 9개 (id, name, desc)
✅ FAQ_LIST 6개 (q, a)
✅ AEO/GEO JSON-LD (faqSchema + howToSchema)
✅ AdSlot 위치 (가이드 다음 1개)
✅ 21개 메뉴 (V11Shell)
✅ NOTICES 4개 (V11Shell)
✅ contentEngine.ts 수정 없음
✅ v650Adapter.ts 수정 없음

추가만 한 것:
  - emoji 필드 (FEATURED_GUIDES, CATEGORY_NAV)
  - color 필드 (액센트 색상용)

============================================================
포함 파일 10개
============================================================

[메인 영역]
- frontend/app/page.tsx              v10.0 (대시보드)
- frontend/app/layout.tsx            v9.4
- frontend/app/_shared/V11Shell.tsx  v11.2 (로고 확대 + 클릭)
- frontend/public/ads.txt

[publish 영역]
- frontend/app/publish/page.tsx      v10.7

[가이드 5편]
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/ai-tools/page.tsx
