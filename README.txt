============================================================
AlgoMaker v10.7 — styled-jsx scope 버그 수정 (HOTFIX)
============================================================

진단:
  박 대표님 화면에서 v10.7 헤더는 보였지만 빨강 배너/9:16 미리보기가 안 보임
  
원인:
  SnsPanel의 <style jsx> 가 scoped 였음
  styled-jsx scoped는 같은 컴포넌트 함수 내에서만 작동
  YoutubeUI/ShortsUI/InstagramUI/TiktokUI 가 별도 함수라
  CSS가 적용 안 됨

수정:
  <style jsx> → <style jsx global> 로 변경
  이제 4개 UI 함수에도 CSS 적용됨

============================================================
박 대표님 적용 단계 (3분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 폴더의 frontend/ 안 내용 통째로 드래그
   (app/ + public/)

5. Commit message: hotfix: SNS CSS scope

6. Vercel 자동 빌드 (방금 commit 추적되면 자동 시작) 1~2분

7. 빌드 완료 (Ready) 후 → 자동 Production 적용 또는 Promote

8. 시크릿 창 (Ctrl+Shift+N) 으로 nutube.kr/publish?keyword=test

9. STEP 6 → SNS 모드 ON → YouTube 탭 → 빨강 배너 보이면 성공

============================================================
변경 사항 (이번 hotfix)
============================================================

수정 1: SnsPanel CSS scope → global
  → 빨강/핑크/그라디언트/검정 배너 표시
  → 9:16 모바일 미리보기 박스 표시
  → 사이드 아이콘 (좋아요/댓글/공유/사운드) 표시

============================================================
포함 파일 (10개)
============================================================

[v10.7 + hotfix 핵심 5개]
- frontend/app/page.tsx
- frontend/app/layout.tsx
- frontend/app/publish/page.tsx          ← HOTFIX
- frontend/app/_shared/V11Shell.tsx
- frontend/public/ads.txt

[가이드 5편]
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/ai-tools/page.tsx
