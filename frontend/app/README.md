# AlgoMaker v4 - 3단계 완전 자동화

## 스키마 기반 정확한 호출
- Step 0: POST /api/v1/curation/news/search → news_summary 문자열 생성
- Step 1: POST /api/v1/script/generate → blocks 받기
- Step 2: POST /api/v1/video/generate-real → job_id 받기

## 적용 (1개 파일)
_shared/videoApi.ts → frontend/app/_shared/videoApi.ts 덮어쓰기

configure/page.tsx는 이전 v3 것 그대로 쓰면 됨 (startVideoGeneration 시그니처 동일)

## 진행 메시지
1. "📰 관련 뉴스 수집 중..." (10~20초)
2. "✍️ AI 대본 작성 중..." (1~2분)
3. "🎬 영상 생성 요청 중..." (몇 초)
4. /processing 이동 → polling (5~8분)
5. /done → 실제 MP4 재생

## 뉴스 API 스키마 불확실
뉴스 검색 응답 포맷을 정확히 모르므로 5가지 포맷 순차 시도.
실패하면 폴백 텍스트로 대본 생성 진행 (영상은 만들어짐).

## Commit
feat: 3-step video pipeline (news → script → video)
