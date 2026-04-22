# AlgoMaker v13 - MagicLight 스타일 (1단계)

## 변경 내용
- 좌측 사이드바(LNB) + 우측 대시보드 레이아웃
- 템플릿 라이브러리 (8개 템플릿 카드)
- 카테고리 탭 필터 (전체/쇼츠/롱폼/뉴스/종교/재테크/건강/IT)
- 원클릭 입력 모달
- 크레딧 시스템 UI (사이드바)
- 기술 스택 배지 (Gemini/ElevenLabs/Naver)
- 모바일 햄버거 메뉴

## 적용 방법

2개 파일만 덮어쓰기:

| zip 안 파일 | → 덮어쓸 위치 |
|-----------|------------|
| _shared/V11Shell.tsx | frontend/app/_shared/V11Shell.tsx |
| page.tsx | frontend/app/page.tsx |

**shell.module.css는 건드리지 마세요** (V11Shell이 인라인 스타일로 바뀌어서 CSS 안 씀)

## 주의사항
- keyword/page.tsx 는 건드리지 마세요 (실제 AI 연결됨)
- 다른 페이지들(/create, /configure, /processing, /done)도 그대로 두세요
  - V11Shell wrapper가 호환 유지해서 기존 페이지 계속 작동

## Commit 메시지
```
feat: MagicLight-style dashboard with template library
```

## 확인 방법
1. Push 후 3분 대기
2. 시크릿 창에서 project-blackbox-cpqy.vercel.app 접속
3. 왼쪽에 사이드바 나타나야 함
4. 카테고리 탭 클릭 동작
5. 템플릿 카드 클릭 → 모달 → "다음" → /keyword (기존 실제 API 페이지)

## 빌드 에러가 나면
V11Shell.tsx가 기존 코드와 시그니처 호환되도록 만들어져 있지만,
혹시 import 경로 에러가 나면 로그 스샷 보여주세요.
