# AlgoMaker v13 FIX - 사이드바/카드 중복 해결

## 수정 내용
- Context 기반 중첩 방지 → 사이드바가 1번만 렌더링
- 카드 8개가 정확히 1번만 표시

## 적용
2개 파일 덮어쓰기:
- _shared/V11Shell.tsx
- page.tsx

## Commit
fix: prevent shell nesting, remove duplicate cards
