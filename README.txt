============================================================
AlgoMaker — FINAL ★ 전부 다 (D안)
============================================================

박 대표님 요청: "전부 다"
→ 가이드 5편 + 백단 인사이트 + 메인 11편 + 체크리스트 15

============================================================
이번 추가 (v10.4 → v10.5 메인)
============================================================

1. FEATURED_GUIDES 6편 → 11편 (알고리즘 5편 추가)
   - 🔍 algorithm-seo (NEW)
   - ⏱ algorithm-retention (NEW)
   - 🎨 algorithm-branding (NEW)
   - ⚠️ algorithm-mistakes (NEW)
   - 💪 algorithm-mindset (NEW)
   각각 NEW 배지 표시

2. 새 섹션: 📋 업로드 전 체크리스트 15가지
   FAQ 직전에 위치
   5개 그룹 그리드 (자동 반응형):
     - 기초 브랜딩 (4개)
     - 검색 최적화 (4개)
     - 노출 및 유입 (3개)
     - 체류 시간 (3개)
     - 운영 및 수익 (1개)
   각 항목: □ 체크박스 + 제목 + 상세

3. 가이드 카드 링크 분기 자동 처리
   - blogPath: true → /blog/algorithm-* (NEW)
   - blogPath: undefined → /knowhow/* (기존)

============================================================
이전 작업도 모두 포함 (지난 ZIP과 통합)
============================================================

★ 알고리즘 가이드 5편 페이지:
  /blog/algorithm-seo
  /blog/algorithm-retention
  /blog/algorithm-branding
  /blog/algorithm-mistakes
  /blog/algorithm-mindset

★ 백단 인사이트 데이터:
  frontend/app/_shared/algorithmInsights.ts
  - 14가지 export (SEO_TITLE_FORMULA, CHECKLIST_15, getAlgorithmInsights 등)
  - 박 대표님 contentEngine.ts 에서 import 해서 활용 가능

============================================================
v10.5 메인 페이지 전체 흐름
============================================================

1. 상단: ALGORITHM ENGINE 영역
   - ▍ ALGORITHM ENGINE  ●LIVE
   - 큰 타이틀 "유튜브 알고리즘을 읽어드립니다"
   - 검정 박스 5단계 파이프라인 (01→02→03→04→05)
   - [▶ 무료로 시작] [📚 가이드 17편 보기]

2. 추천 가이드 11편 (6 기존 + 5 알고리즘 NEW)
   - 알고리즘 가이드는 NEW 배지 표시

3. 분야별 9개 (클릭 시 /blog?category=xxx 이동)

4. [광고]

5. ★ NEW: 업로드 전 체크리스트 15가지
   - 5그룹 카드 그리드
   - 각 그룹별 항목 + 체크박스 + 상세
   - 시청자가 인쇄해서 사용 가능

6. FAQ 6개 아코디언

7. 보조 도구 안내 + 푸터

============================================================
박 대표님 적용 (3분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 폴더의 frontend/ 안 내용 통째로 드래그
   - app/ (page.tsx, layout.tsx, _shared, blog, publish)
   - public/ (ads.txt)

5. Commit message: feat: 알고리즘 가이드 5편 + 메인 11편 + 체크리스트 15

6. Vercel 자동 빌드 1~2분

7. 시크릿 창 → nutube.kr 접속

8. 확인:
   ✓ 메인 추천 가이드: 11편 카드 (NEW 배지 5개)
   ✓ NEW 알고리즘 가이드 클릭 → /blog/algorithm-* 이동
   ✓ 메인에 "📋 업로드 전 체크리스트 15가지" 섹션
   ✓ 5개 그룹 카드 + □ 체크박스
   ✓ 시청자가 체크리스트 읽으면서 체류시간 ↑

============================================================
포함 파일 16개
============================================================

[메인 + 핵심]
- frontend/app/page.tsx                       v10.5 (전부 다)
- frontend/app/layout.tsx                     v9.4
- frontend/app/_shared/V11Shell.tsx           v11.2
- frontend/app/_shared/algorithmInsights.ts   백단 데이터 (14 exports)
- frontend/public/ads.txt

[publish]
- frontend/app/publish/page.tsx               v10.7

[기존 가이드 5편]
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/ai-tools/page.tsx

[알고리즘 가이드 5편]
- frontend/app/blog/algorithm-seo/page.tsx
- frontend/app/blog/algorithm-retention/page.tsx
- frontend/app/blog/algorithm-branding/page.tsx
- frontend/app/blog/algorithm-mistakes/page.tsx
- frontend/app/blog/algorithm-mindset/page.tsx

============================================================
박 대표님 자료 활용 정리 (3중 반영)
============================================================

A. 가이드 페이지 5편 (각 장의 깊이 있는 풀이) ★ COMPLETED
B. 메인 페이지 카드 11편 + NEW 배지 ★ COMPLETED
C. 메인 페이지 체크리스트 15가지 섹션 ★ COMPLETED
D. 백단 인사이트 데이터 (publish 페이지에서 활용 가능) ★ READY

박 대표님 자료가 사이트 곳곳에 자연스럽게 녹아들었습니다.
출처/타 명의는 모두 제거되었고, AlgoMaker 오리지널 콘텐츠로 재구성.
