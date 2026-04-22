# AlgoMaker - v3 (대본 생성 → 영상 생성 2단계)

## 에러 원인 파악
백엔드는 2단계 구조:
1. POST /api/v1/script/generate → script_blocks 받기
2. POST /api/v1/video/generate-real (script_blocks 포함) → job_id

내가 1단계를 건너뛰어서 "script_blocks 필드 없음" 에러 발생

## 수정 내용
- videoApi.ts에서 2단계 자동 호출 (대본→영상)
- configure 페이지에 진행 상태 메시지 ("AI 대본 작성 중..." → "영상 생성 요청 중...")

## 적용 (2개 파일)
- _shared/videoApi.ts 덮어쓰기
- configure/page.tsx 덮어쓰기

## 예상 흐름
1. "영상 생성 시작" 버튼 클릭
2. "AI 대본 작성 중..." (30초~1분)
3. "영상 생성 요청 중..." (몇 초)
4. /processing 페이지로 이동 (polling 시작)
5. 5~8분 후 /done 페이지로 이동
6. 실제 MP4 재생 가능

## Commit
feat: 2-step video generation (script → video)

## 여전히 에러가 나면
"기술 상세 보기" 펼쳐서 내용 복사해주세요.
- script.generate에서 에러 → 대본 API 스키마 맞추기 필요
- video.generate-real에서 에러 → 영상 API 추가 필드 필요
