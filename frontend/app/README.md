# AlgoMaker - HOTFIX (422 에러 + React 에러 수정)

## 문제
1. 백엔드가 422 에러 반환 → body 필드 이름 불일치
2. FastAPI 에러 객체를 React가 렌더링 못해서 폭발

## 해결
1. **videoApi.ts**: 5가지 body 포맷 순차 시도 + 에러 문자열 변환
2. **configure/page.tsx**: 에러를 반드시 String으로 감싸 렌더

## 적용 파일 (2개만)

| zip 안 | 위치 |
|--------|------|
| _shared/videoApi.ts | frontend/app/_shared/videoApi.ts (덮어쓰기) |
| configure/page.tsx | frontend/app/configure/page.tsx (덮어쓰기) |

## 결과 예상
- 사이트가 다시 열림 (빨간 에러 화면 사라짐)
- /configure에서 영상 생성 시도 → 에러가 나도 **친절한 메시지**로 표시
- 어떤 필드가 문제인지 정확히 알 수 있음

## Commit
fix: handle FastAPI 422 errors and render errors as strings
