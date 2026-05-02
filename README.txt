============================================================
🐛 BUG FIX — styled-jsx scope 버그 수정
============================================================

박 대표님 캡처 분석 결과:
  - Full Prompt 흰색 배경 (검정 적용 X)
  - 텍스트 가로 잘림 (overflow-wrap 적용 X)
  
원인: styled-jsx scope 끊김
  
  CinematicPromptDisplay 메인 함수에 <style jsx> 1개 정의
  → MidjourneyPanel/SoraPanel/FullPromptBox/SpecRow는
    별도 함수라서 styled-jsx scope 적용 X
  → CSS 적용 안 됨 → 흰색 배경 + 텍스트 잘림

해결:
  <style jsx> → <style jsx global>
  → 자식 함수까지 모두 적용

============================================================
변경 파일 2개
============================================================

★ frontend/app/_shared/CinematicPromptDisplay_v6_5_0.tsx
  Line 30: <style jsx> → <style jsx global>
  
★ frontend/app/_shared/CinematicScenarioDisplay_v6_5_0.tsx
  Line 30: <style jsx> → <style jsx global>
  (BeatBlock, CopyButton 자식 함수도 같은 버그)

============================================================
박 대표님 자산 100% 보존
============================================================

✅ 모든 함수 시그니처 그대로
   - MidjourneyPanel, SoraPanel, VeoPanel, FlowPanel, NotebookPanel
   - SpecRow, FullPromptBox
   - BeatBlock, CopyButton
✅ Props 인터페이스 그대로
✅ 데이터 흐름 그대로
✅ import 경로 그대로 (publish/page.tsx 수정 X)

============================================================
박 대표님 적용 (1분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 frontend/app/_shared/ 안 2개 파일 드래그
   - CinematicPromptDisplay_v6_5_0.tsx
   - CinematicScenarioDisplay_v6_5_0.tsx
   
5. "Replace existing file" 선택 (기존 파일 덮어쓰기)

6. Commit message: fix: styled-jsx scope 버그 수정 (자식 함수 적용)

7. Vercel 자동 빌드 1~2분

8. 시크릿 창 → nutube.kr 접속

9. 분야 → 주제 클릭 → publish 도착 → 전문가급 프롬프트 모드 켜기

10. 확인:
    ✓ Sora 2 — Full Prompt 헤더가 검정 배경
    ✓ Full Prompt 본문이 검정 코드 박스
    ✓ 노란 라벨 (▍ Sora 2 — Full Prompt)
    ✓ 흰색 COPY 버튼
    ✓ 텍스트가 화면 밖으로 안 잘림
    ✓ 한글 단어 단위로 줄바꿈
    ✓ 영문 긴 단어도 깔끔하게 줄바꿈
    ✓ Composition Spec 카드 정렬
    ✓ Negative Prompt 빨간 띠

============================================================
이전 ZIP과 차이
============================================================

이전 (UX 일괄 개선):
  - 4개 파일: V11Shell + main + Cinematic 2개
  - 메뉴 직관 / 메트릭 신뢰 / 줄바꿈 처리

이번 (BUG FIX):
  - 2개 파일: Cinematic 2개만 (styled-jsx global)
  - 다른 파일은 그대로

★ 박 대표님이 이전 ZIP 적용한 후
  이 BUG FIX ZIP 의 2개 파일만 추가 적용하시면 됩니다.

★ 또는 아직 이전 ZIP 적용 전이라면
  전체 적용 후 이 ZIP의 2개 파일도 같이 적용

============================================================
포함 파일 2개
============================================================

- frontend/app/_shared/CinematicPromptDisplay_v6_5_0.tsx
- frontend/app/_shared/CinematicScenarioDisplay_v6_5_0.tsx
