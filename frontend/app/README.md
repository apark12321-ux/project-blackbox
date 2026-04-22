# AlgoMaker v15 - 완전판

## 변경 요약
1. 상단 검색창 → 트렌드/공지 띠 (4가지 메시지 자동 회전)
2. "새 영상 만들기" 버튼 → "Pro 업그레이드" 카드로 대체
3. 🔔 알림 제거, 프로필 단순화
4. 12개 시나리오 AlgoMaker 고유 이름으로 전면 재작명
5. 각 시나리오에 고유 프롬프트 (hook_triggers 등) 정의
6. 시나리오 선택 → 백엔드 대본 API에 실제로 프롬프트 전달

## 적용 파일 (5개)

| zip 안 | 위치 |
|--------|------|
| _shared/V11Shell.tsx | frontend/app/_shared/V11Shell.tsx (덮어쓰기) |
| _shared/videoApi.ts | frontend/app/_shared/videoApi.ts (덮어쓰기) |
| _shared/scenarios.ts | frontend/app/_shared/scenarios.ts (새 파일) |
| page.tsx | frontend/app/page.tsx (덮어쓰기) |
| configure/page.tsx | frontend/app/configure/page.tsx (덮어쓰기) |

## 우리 고유 12개 시나리오

경제·사회:
- 🔍 미스터리 추적 (Free)
- 📖 결론 먼저 (Free)
- 🏛️ 뿌리 찾기 (Pro)
- 🔮 만약에 (Pro)

정보·분석:
- 🧪 직접 확인 (Free)
- ⚖️ 맞대결 (Pro)
- 🔄 상식 깨기 (Pro)

범용:
- 📐 정석 구성 (Free)
- 🎭 3단 고조 (Pro)
- 💡 해법 찾기 (Free)
- 📊 랭킹 역순 (Pro)
- 🎬 다큐 스타일 (Pro)

## 프롬프트 반영 방식
사용자가 선택한 시나리오의 hook_triggers, opinion_seeds, core_facts 배열이
백엔드 /api/v1/script/generate 호출 시 실제 전달됨.
→ 같은 키워드여도 선택한 스타일에 따라 다른 대본이 생성됨.

## Commit
feat: AlgoMaker original 12 scenarios with real prompt injection
