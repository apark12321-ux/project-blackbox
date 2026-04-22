# AlgoMaker v5 - 3개 API 정확한 스키마 적용

## 변경
videoApi.ts만 수정 (설정 페이지 v3 그대로 사용)

## 적용
_shared/videoApi.ts → frontend/app/_shared/videoApi.ts 덮어쓰기

## 예상 흐름
1. [영상 생성 시작] 클릭
2. 📰 관련 뉴스 수집 중... (10~20초)
3. ✍️ AI 대본 작성 중... (1~2분)  ← 가장 오래 걸림
4. 🎬 영상 생성 요청 중... (몇 초)
5. /processing 이동 → polling (5~8분)
6. /done → 실제 영상 재생

## Commit
feat: integrate all 3 video APIs with exact schemas (v5)
