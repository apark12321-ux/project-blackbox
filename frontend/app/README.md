# AlgoMaker - 백엔드 status 버그 우회판

## 무엇을 바꾸나
status API 호출을 제거하여 _job_id 에러 회피.
대신 시간 기반 진행률 표시 + download API만 주기적 확인.

## 적용 (2개 파일)

| zip 안 | 위치 |
|--------|------|
| processing/page.tsx | frontend/app/processing/page.tsx 덮어쓰기 |
| done/page.tsx | frontend/app/done/page.tsx 덮어쓰기 |

## 동작 방식

### /processing 
- getJobStatus() 호출 안 함 (버그 회피)
- 1초마다 경과 시간 카운트
- 시간에 따라 "단계 메시지" 자동 갱신 (뉴스 → 대본 → TTS → 영상 → SEO)
- 60초 후부터 2분마다 getDownloadUrl() 시도
- URL 받으면 /done으로 이동
- "지금 확인" 버튼으로 수동 체크도 가능
- 최대 12분 대기

### /done
- getDownloadUrl()만 호출 (status 생략)
- URL 있으면 비디오 재생
- 없으면 "다시 확인" 또는 "처리 중 페이지로" 버튼

## 한계
- 실제 백엔드 진행률은 모름 (시간 추정)
- 완성 여부는 download API 응답으로만 판단
- 백엔드가 download도 못 주면 실패 (그래도 Job ID 기록해서 나중에 확인 가능)

## Commit
fix: bypass buggy status endpoint with time-based progress
