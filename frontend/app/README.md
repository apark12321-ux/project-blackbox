# AlgoMaker - 실제 영상 생성 API 연결

## 적용 파일 (4개)

| zip 안 파일 | → 위치 |
|-----------|--------|
| _shared/videoApi.ts | frontend/app/_shared/videoApi.ts (새 파일) |
| configure/page.tsx | frontend/app/configure/page.tsx (덮어쓰기) |
| processing/page.tsx | frontend/app/processing/page.tsx (덮어쓰기) |
| done/page.tsx | frontend/app/done/page.tsx (덮어쓰기) |

## 핵심 로직

### 1. /configure → API 호출
"영상 생성 시작" 버튼 클릭 시:
- POST /api/v1/video/generate-real
- body: { keyword, tone, duration, mode, custom_topic, category }
- 응답에서 job_id 추출 → LocalStorage 저장
- 에러 시 상세 메시지 표시

### 2. /processing → Polling
- 3초마다 GET /api/v1/video/status/{job_id} 호출
- 응답에서 progress, current_step, logs 추출
- status가 completed/failed이면 polling 중단
- 최대 15분 대기, 5회 연속 실패 시 중단

### 3. /done → 영상 재생
- GET /api/v1/video/download/{job_id}로 MP4 URL 획득
- <video> 태그로 실제 영상 재생
- 다운로드 링크 제공

## 에러 대응

백엔드 응답 구조가 예상과 다를 수 있음. 그 경우:
- /configure: 에러 박스에 메시지 표시
- /processing: 로그/에러 패널에 백엔드 응답 표시
- /done: 백엔드 응답 JSON을 그대로 보여줌 (디버깅용)

## 환경변수

`NEXT_PUBLIC_API_URL` 사용 (Vercel에 이미 등록됨)
기본값: https://project-blackbox-production.up.railway.app

## Commit
feat: integrate real video generation API (start/poll/download)

## 디버깅 팁

1. 브라우저 F12 → Console 열어두기
2. 에러 메시지에 백엔드 응답 구조 표시됨
3. Network 탭에서 실제 요청/응답 확인 가능
