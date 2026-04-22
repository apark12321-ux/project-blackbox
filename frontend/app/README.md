# AlgoMaker v12 - YouTube 스타일 카드형 디자인

## 적용 방법

아래 6개 파일을 **해당 폴더에 덮어쓰기**:

| zip 안 파일 | → 덮어쓸 위치 |
|-----------|------------|
| page.tsx | frontend/app/page.tsx |
| _shared/shell.module.css | frontend/app/_shared/shell.module.css |
| create/page.tsx | frontend/app/create/page.tsx |
| configure/page.tsx | frontend/app/configure/page.tsx |
| processing/page.tsx | frontend/app/processing/page.tsx |
| done/page.tsx | frontend/app/done/page.tsx |

⚠️ keyword 폴더는 건드리지 마세요 (이미 실제 API 연결됨)

## Commit 메시지
```
feat: YouTube-style card layout
```

## 주요 변경
- 흰 배경 + 빨간 포인트 (YouTube 공식 컬러)
- 16:9 썸네일 카드 레이아웃
- 둥근 알약 버튼
- 카테고리/프로세스 전부 카드로
- /done 페이지: 유튜브 영상 카드 스타일 + 재생 버튼
