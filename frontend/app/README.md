# AlgoMaker - 사이드바 404 해결 (3개 페이지 추가)

## 문제
사이드바의 "내 영상" / "분석" / "소개" 클릭 시 404

## 해결
3개 폴더 + page.tsx 파일 추가

## 적용

frontend/app/ 폴더 아래에 다음 구조로 넣으세요:

```
frontend/app/
├── assets/
│   └── page.tsx      ← 내 영상 (새 폴더 + 파일)
├── analytics/
│   └── page.tsx      ← 분석 Pro 유도 (새 폴더 + 파일)
├── about/
│   └── page.tsx      ← 서비스 소개 (새 폴더 + 파일)
└── ... (기존 것들 그대로)
```

## 각 페이지 기능

### /assets (내 영상)
- localStorage에 저장된 작업 이력 표시
- 작업 없으면 "첫 영상 만들기" 빈 상태 CTA
- 상단 통계 (영상 수/이번 달/총 길이)

### /analytics (분석) ⭐ 결제 유도 핵심
- Pro 업그레이드 히어로 (66% 세일 강조)
- 4개 Pro 전용 기능 미리보기 (흐림 처리 + "Pro로 보기" 버튼)
  - 경쟁 채널 분석
  - 썸네일 A/B 테스트
  - 트렌드 예측 AI
  - 수익 시뮬레이션
- Pro 사용자 후기 3개
- 하단 최종 CTA

### /about (소개)
- 6단계 프로세스 설명
- 수작업 vs AlgoMaker 비교표
- FAQ 6개 (펼침/접힘)
- 사업자 정보 (한줄컴퍼니)

## Commit
feat: add assets/analytics/about pages
