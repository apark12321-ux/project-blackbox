============================================================
v18 FIX - Cinematic 빈 필드 숨김 (실제 파일에 적용)
============================================================

이전 v18 FINAL 의 실수:
  어시스턴트가 작업한 파일: CinematicPromptDisplay.tsx (이름 틀림)
  박 대표님 publish import: CinematicPromptDisplay_v6_5_0
  → 박 대표님 사이트는 어시스턴트 수정본 사용 X
  → 빈 필드 그대로 노출

실제 박 대표님 사이트의 컴포넌트:
  CinematicPromptDisplay_v6_5_1.tsx (Production Spec, Shot Specification 라벨)
  
이번 FIX 의 작업:
  ✅ v6_5_1 의 SpecRow 에 빈 값 체크 추가
     → if (!value || !value.trim()) return null
  ✅ Negative Prompt 3곳 (Midjourney/Sora/VEO) 조건부 표시
  ✅ Continuity Note (Flow) 조건부 표시
  
  결과: 빈 라벨이 화면에 노출되지 않음

============================================================
ZIP 구성 (2개 파일)
============================================================

frontend/app/_shared/
├── CinematicPromptDisplay_v6_5_0.tsx (이름 일치 - 박 대표님 import 경로)
└── CinematicPromptDisplay_v6_5_1.tsx (이름 일치 - 안전 백업)

두 파일 내용 동일 (빈 필드 숨김 적용)
어느 쪽으로 import 해도 작동

============================================================
박 대표님 적용 (30초)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   → app/_shared 폴더로 이동

3. "Add file" → "Upload files"

4. 압축 푼 _shared/ 안 두 파일 드래그
   - CinematicPromptDisplay_v6_5_0.tsx
   - CinematicPromptDisplay_v6_5_1.tsx

5. "Replace existing file" 모두 선택

6. Commit message:
   fix: Cinematic 빈 필드 숨김 처리

7. Vercel 빌드 (1~2분)

8. 시크릿 창 → /publish?keyword=tutorial

9. 동작 확인:
   ✓ Sora 2 SHOT SPECIFICATION
     - SCENE/DURATION/AUDIO/ATMOSPHERE 빈 칸 사라짐
     - 채워진 항목만 표시 (SUBJECT, CAMERA MOVE)
   ✓ VEO 3 PRODUCTION SPEC
     - 빈 필드 모두 사라짐
     - NEGATIVE PROMPT 도 비어있으면 사라짐
   ✓ FLOW SEQUENCE MAP
     - 빈 항목 사라짐
     - CONTINUITY NOTE 비어있으면 사라짐

============================================================
임시 해결 (빈 필드 숨김) vs 진짜 해결 (필드 채우기)
============================================================

이 FIX = 임시 해결
  - 빈 라벨이 화면에 안 보임
  - 박 대표님 자산 안 건드림
  - 애드센스 검토자에게 깔끔하게 보임
  - 빈 필드 데이터 자체는 그대로 비어있음

진짜 해결 (선택 사항):
  - promptEngine_v6_5_0.ts 가 빈 필드를 채우도록 수정
  - 어시스턴트가 이 파일을 못 봄
  - 박 대표님이 직접 수정하시거나
  - 박 대표님이 이 파일을 어시스턴트에게 공유하시면 작업 가능

박 대표님 동결 약속 고려:
  임시 해결로 충분 (애드센스 통과 목적)
  승인 후 진짜 해결 진행 추천

============================================================
박 대표님 자산 100% 보존
============================================================

수정된 부분:
  CinematicPromptDisplay_v6_5_1 의 SpecRow (1줄 추가)
  + 4개 메타블록 조건부 표시

수정 안 된 부분 (절대 보존):
  ✅ contentEngine.ts (1,723줄)
  ✅ v650Adapter.ts
  ✅ promptEngine_v6_5_0.ts (어시스턴트 못 봄)
  ✅ scenarioEngine_v6_5_0.ts (어시스턴트 못 봄)
  ✅ snsFormatGenerator_v6_5_0.ts (어시스턴트 못 봄)
  ✅ algorithmInsights.ts
  ✅ CinematicScenarioDisplay_v6_5_0.tsx
  ✅ contentEngine 호출 흐름 그대로
