# AlgoMaker 리디자인 파일 적용 가이드

## 파일 배치 위치

압축 풀고 아래처럼 **각 파일을 해당 폴더에 덮어쓰기**:

```
project-blackbox/frontend/app/
├── page.tsx                        ← 이 zip의 page.tsx 로 덮어쓰기 (홈)
├── _shared/
│   └── shell.module.css            ← 덮어쓰기
├── create/
│   └── page.tsx                    ← 덮어쓰기
├── configure/
│   └── page.tsx                    ← 덮어쓰기
├── processing/
│   └── page.tsx                    ← 덮어쓰기
└── done/
    └── page.tsx                    ← 덮어쓰기
```

## 주의
- keyword/page.tsx 는 **건드리지 말 것** (이미 실제 API 연결됨)
- 모든 파일 한번에 덮어쓰고 Push 하면 끝

## Commit 메시지 예시
```
feat: redesign all pages with mobile optimization
```

## 적용 후 확인
시크릿 창에서 확인:
- /  (홈)
- /create
- /keyword (건드리지 않음)
- /configure
- /processing
- /done

모든 페이지에서:
- ✅ 헤더 가로 정렬
- ✅ 푸터 깔끔한 3열 구조  
- ✅ 모바일에서 반응형 작동
- ✅ 단계바 정상 표시
