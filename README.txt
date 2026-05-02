============================================================
AlgoMaker — FINAL (메인 v10.7 - 프로페셔널 ENGINE PANEL)
============================================================

박 대표님 v10.7 요청:
  "Engine Selection이 어수선하고 어설픔. 프로페셔널 템플릿"

D안 (어시스턴트 판단):
  SaaS 대시보드 + AI 도구 + 제품 패널 융합 스타일
  → 명확한 영역 경계 + 데이터 시각화 + 일관된 그리드

============================================================
v10.7 ENGINE PANEL 구조
============================================================

┌──────────────────────────────────────────────┐
│ [상단 바 - 브라우저/터미널 느낌]              │
│ ● ● ●  algorithm-engine.live    [v6.5] [●LIVE]│
├─────────────────────────┬────────────────────┤
│                         │                    │
│ ▍ ALGORITHM ENGINE      │  PIPELINE ●RUNNING │
│                         │  ──────────────────│
│ 클릭만으로 영상 자료    │  01 ━━━━━ 분석   ✓ │
│ 5초 만에 만들기         │  02 ━━━━━ 생성   ✓ │
│                         │  03 ━━━━━ 구조   ✓ │
│ 분야와 주제를 클릭하시면│  04 ━━━━━ 제작   ✓ │
│ 떡상 사례 분석부터...   │  05 ━━━━━ 배포   ✓ │
│                         │  ──────────────────│
│ ┌────┬────┬────┐        │  EXEC  5 stages·5s │
│ │분석│CTR │생성│        │                    │
│ │5,247│8.2%│5초│        │                    │
│ └────┴────┴────┘        │                    │
│                         │                    │
└─────────────────────────┴────────────────────┘
   좌측 (1.4)                우측 (1) - 검정 박스

============================================================
프로페셔널 디테일
============================================================

★ 패널 상단 바
  - 브라우저 윈도우 스타일 (빨강/노랑/초록 dot)
  - "algorithm-engine.live" 도메인 라벨
  - 우측: v6.5 배지 + ●LIVE 인디케이터

★ 좌측 (정보 패널)
  - ALGORITHM ENGINE 모노스페이스 kicker
  - 큰 타이틀 32px (모바일 22px)
  - 부제 (간결)
  - 메트릭 3카드: 분석 영상 5,247 / CTR 8.2% / 5초
  - 카드마다 검정 상단 띠

★ 우측 (실행 패널 - 검정)
  - PIPELINE ●RUNNING 상태
  - 5단계 진행바 애니메이션 (단계별 fill)
  - 노랑→주황 그라디언트 진행바
  - ✓ 체크마크 (초록)
  - EXEC: 5 stages · 5.0s 푸터

★ 일관된 디자인 언어
  - 모노스페이스 (SF Mono): 라벨, 숫자, 코드 느낌
  - 산세리프 (Pretendard): 본문, 타이틀
  - 명확한 영역 경계 (border + shadow)
  - 그리드 정렬

============================================================
v10.6 → v10.7 비교
============================================================

이전 (v10.6):
  - 단일 영역 (algoHero)
  - 텍스트 정렬 제각각
  - 단순 검정 박스 5단계
  - "어수선" "어설픔"

이후 (v10.7):
  - 패널 구조 (enginePanel)
  - 명확한 영역 경계
  - 좌우 분할 (정보 + 실행)
  - 메트릭 카드 + 진행바 애니메이션
  - "프로페셔널 SaaS 도구"

============================================================
박 대표님 적용 (1분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/blob/main/frontend/app/page.tsx
   접속 → 휴지통 🗑 → Commit (기존 삭제)

3. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   "Add file" → "Upload files"

4. 압축 푼 폴더의 frontend/ 안 내용 통째로 드래그

5. Commit: feat: 메인 v10.7 프로페셔널 엔진 패널

6. Vercel 빌드 1~2분

7. 시크릿 창 → nutube.kr 접속

8. 확인:
   ✓ 상단에 패널 구조 (브라우저 윈도우 dot)
   ✓ algorithm-engine.live 도메인 라벨
   ✓ v6.5 배지 + ●LIVE 펄스
   ✓ 좌측: 큰 타이틀 + 메트릭 3개 (5,247 / 8.2% / 5초)
   ✓ 우측: 검정 박스 + PIPELINE 5단계 진행바
   ✓ 단계별 진행바 애니메이션
   ✓ ✓ 체크마크 표시
   ✓ EXEC 5 stages · 5.0s 푸터

============================================================
v10.7 보존 사항 (v10.6 자산 모두 유지)
============================================================

✅ 키워드 선택 UX (분야 9 + 주제 6 = 54개)
✅ 시니어 워딩 제거 (일반 친화)
✅ 추천 가이드 6편
✅ FAQ 6개 아코디언
✅ V11Shell v11.2
✅ publish v10.7
✅ algorithmInsights.ts 백단 데이터
✅ JSON-LD AEO/GEO

============================================================
포함 파일 16개
============================================================

[메인 + 핵심]
- frontend/app/page.tsx                       v10.7 (프로페셔널 엔진)
- frontend/app/layout.tsx                     v9.4
- frontend/app/_shared/V11Shell.tsx           v11.2
- frontend/app/_shared/algorithmInsights.ts   백단 데이터
- frontend/public/ads.txt

[publish]
- frontend/app/publish/page.tsx               v10.7

[가이드 5편 (기존)]
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/ai-tools/page.tsx

[알고리즘 가이드 5편]
- frontend/app/blog/algorithm-seo/page.tsx
- frontend/app/blog/algorithm-retention/page.tsx
- frontend/app/blog/algorithm-branding/page.tsx
- frontend/app/blog/algorithm-mistakes/page.tsx
- frontend/app/blog/algorithm-mindset/page.tsx
