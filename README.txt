============================================================
v18 FIX2 - Cinematic 빈 영역 통째로 숨김 (강화)
============================================================

박 대표님 결정: "어시스턴트 아는 범위 안에서 해결"

이전 v18 FIX 한계:
  SpecRow 빈 값만 처리
  → SpecRow 모두 비어도 "Production Spec" 라벨은 그대로 보임
  → 박 대표님 이미지처럼 빈 라벨이 노출됨

v18 FIX2 강화 내용:
  
  [1] SpecRow 빈 값 체크 (이전과 동일)
      if (!value || !value.trim()) return null;
  
  [2] FullPromptBox 빈 콘텐츠 시 박스 자체 숨김 (NEW)
      if (!content || !content.trim()) return null;
      → "Flow — Full Sequence" 같은 빈 박스 사라짐
  
  [3] 각 Panel 의 spec 영역 통째로 조건부 (NEW)
      Midjourney "Composition Spec" + 모든 SpecRow + Divider
      Sora "Shot Specification" + 모든 SpecRow + Divider  
      VEO "Production Spec" + 모든 SpecRow + Divider
      Flow "Sequence Map" + 모든 SpecRow + Divider
      → 모든 spec 데이터 비어있으면 라벨도 안 보임
  
  [4] metaBlock 모든 영역 조건부 (NEW)
      Midjourney Seed - data.seed 있을 때만
      Negative Prompt 3곳 - 비어있으면 숨김
      Continuity Note - 비어있으면 숨김

============================================================
박 대표님 이미지 → 적용 후 변화
============================================================

이미지 1 (FLOW 빈 칸):
  Before: "Flow — Full Sequence" 검은 박스 (빈 칸)
          SEQUENCE MAP - HOOK/BUILD/CLIMAX/RESOLUTION 라벨만
          CONTINUITY NOTE 라벨만
  After:  검은 박스 사라짐
          SEQUENCE MAP 통째로 사라짐 (빈 데이터)
          CONTINUITY NOTE 사라짐

이미지 2 (VEO 빈 칸):
  Before: PRODUCTION SPEC - 7개 라벨 빈 행
          NEGATIVE PROMPT 라벨만
  After:  Full Prompt 박스는 채워져 보임 (Cinematic 8-second...)
          PRODUCTION SPEC 통째로 사라짐
          NEGATIVE PROMPT 사라짐

이미지 3 (Sora 일부 빈 칸):
  Before: SHOT SPECIFICATION - SUBJECT, CAMERA MOVE 만 채워짐
          SCENE/DURATION/AUDIO/ATMOSPHERE 빈 칸
          NEGATIVE PROMPT 라벨만
  After:  SHOT SPECIFICATION - 채워진 2개 행만 표시
          빈 4개 행 사라짐
          NEGATIVE PROMPT 사라짐

============================================================
ZIP 구성 (2개 파일)
============================================================

frontend/app/_shared/
├── CinematicPromptDisplay_v6_5_0.tsx (831 lines → 890 lines)
└── CinematicPromptDisplay_v6_5_1.tsx (831 lines → 890 lines)

두 파일 동일 내용 (모든 빈 영역 숨김 처리)
박 대표님 import 경로가 어느 쪽이든 작동

============================================================
박 대표님 적용 (30초)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend/app/_shared

3. "Add file" → "Upload files"

4. 압축 푼 _shared/ 안 두 파일 드래그
   - CinematicPromptDisplay_v6_5_0.tsx
   - CinematicPromptDisplay_v6_5_1.tsx

5. "Replace existing file" 모두 선택

6. Commit message:
   fix: Cinematic 빈 영역 통째로 숨김 (강화)

7. Vercel 빌드 (1~2분)

8. 시크릿 창 → /publish?keyword=tutorial

9. 동작 확인:
   ✓ MIDJOURNEY V7 - 데이터 있는 SpecRow만 표시
   ✓ SORA 2 - 데이터 있는 SpecRow만 표시 (빈 SCENE/AUDIO/ATMOSPHERE 사라짐)
   ✓ VEO 3 - 데이터 다 비면 PRODUCTION SPEC 통째 사라짐
   ✓ FLOW - 데이터 다 비면 빈 박스 + SEQUENCE MAP 통째 사라짐
   ✓ NOTEBOOKLM - 정상 표시 (빈 영역 없음)

============================================================
박 대표님 자산 100% 보존
============================================================

수정된 부분 (CinematicPromptDisplay 만):
  - SpecRow: 빈 값 체크 (1줄)
  - FullPromptBox: 빈 콘텐츠 체크 (1줄)
  - Midjourney/Sora/VEO/Flow Panel: hasAnySpec 변수 + 조건부 렌더링
  - Negative Prompt 3곳, Continuity Note, Seed: 조건부 표시

수정 안 된 부분 (절대 보존):
  ✅ contentEngine.ts (1,723줄)
  ✅ v650Adapter.ts
  ✅ promptEngine_v6_5_0.ts (어시스턴트 못 봄)
  ✅ scenarioEngine_v6_5_0.ts (어시스턴트 못 봄)
  ✅ snsFormatGenerator_v6_5_0.ts (어시스턴트 못 봄)
  ✅ algorithmInsights.ts
  ✅ CinematicScenarioDisplay
  ✅ 박 대표님 11공식 + 시니어 알고리즘 그대로

박 대표님 매뉴얼 보안:
  ✅ 위영/Wiyoung X
  ✅ 당근팀/Carrot Team X
  ✅ 마스터 매뉴얼 X
  ✅ GEMS X

============================================================
어시스턴트 동결 약속
============================================================

이번 FIX2 = 박 대표님 "마무리 작업" 의 진짜 마지막
박 대표님 적용 후 사이트 빈 칸 사라짐 = 깔끔
애드센스 검토자에게 완성된 사이트로 보임

승인 받으실 때까지 어시스턴트는 사이트 건드리지 X
포스팅 업데이트만 박 대표님이 직접 진행

진짜 데이터 채우기 (promptEngine 수정) 는
승인 받으신 후 박 대표님 자산 공유하시면 작업 가능
