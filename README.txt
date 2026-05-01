============================================================
AlgoMaker — v10.7 + 가이드 5편 (검증 표식 포함)
============================================================

★ 박 대표님이 적용 후 1초만에 확인하는 방법:

   nutube.kr/publish?keyword=test 접속
   → 화면 상단에 "▍ 영상 자료 준비 완료 · v10.7" 글자 표시되면 적용 성공
   → "▍ 영상 자료 준비 완료" 만 표시되면 미적용 (옛 버전)

============================================================
박 대표님 적용 단계 (이번엔 GitHub Edit 절대 X)
============================================================

[전제: GitHub Edit 직접 수정은 긴 코드가 잘릴 수 있음
       반드시 Upload files 방식만 사용]

1. ZIP 다운로드 → 압축 풀기

2. 박 대표님 GitHub의 publish/page.tsx 먼저 삭제:
   github.com/apark12321-ux/project-blackbox/blob/main/frontend/app/publish/page.tsx
   접속 → 우측 상단 휴지통 🗑 → Commit changes

3. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속 (frontend 폴더)

4. "Add file" → "Upload files"

5. 압축 푼 폴더의 frontend/ 안 내용 통째로 드래그
   - app/ 폴더 (모든 하위 폴더 포함)
   - public/ 폴더

6. Commit message: v10.7-final

7. Commit changes 클릭

8. Vercel → Deployments
   - 최신 빌드 우측 ... → Redeploy
   - "Use existing Build Cache" 체크 해제 ⚠️ 필수
   - Redeploy 클릭

9. 1~2분 대기 → Ready

10. Promote to Production

11. 시크릿 창 (Ctrl+Shift+N) 으로 nutube.kr/publish?keyword=test 접속

12. 화면 상단 확인:
    "▍ 영상 자료 준비 완료 · v10.7" → 성공
    "▍ 영상 자료 준비 완료" → 실패 (이 경우 제게 다시 알려주세요)

============================================================
v10.7 변경사항 (적용 후 보일 것)
============================================================

★ 헤더에 "v10.7" 표시 ← NEW (검증용)

[자동 이동 + 자동 스크롤]
- STEP 1 사례 카드 클릭 → STEP 2 자동 이동
- STEP 2 제목 클릭 → 300ms 후 STEP 3 자동 이동
- STEP 3 "시나리오 확인 완료 · 다음 단계로 →" 검정 버튼
- STEP 4 "프롬프트 확인 완료 · 다음 단계로 →" 검정 버튼
- STEP 5 "메타데이터 확인 완료 · SNS 업로드 자료 보기 →" 주황 버튼
- 각 STEP 진입 시 자동 스크롤 (window.scrollTo)

[STEP 1, 2 상단 안내 박스]
- STEP 1: "💡 마음에 드는 사례를 클릭하면 다음 단계로 자동 이동합니다"
- STEP 2: "💡 마음에 드는 제목을 클릭하면 다음 단계로 자동 이동합니다"

[STEP 6 SNS 4개 플랫폼 진짜 디자인]
- YouTube: 빨강 그라디언트 배너 (#ff0000 → #cc0000)
- Shorts: 핑크 그라디언트 + 9:16 모바일 미리보기 + 좋아요/댓글/공유/사운드 사이드 아이콘
- Instagram: 옐로/핑크/보라 그라디언트 (#f9ce34 → #ee2a7b → #6228d7)
- TikTok: 검정 + 시안 라인 (#25f4ee) + 시안→마젠타 로고 그라디언트

[가이드 글 5편 새로 추가]
- nutube.kr/blog/youtube-start
- nutube.kr/blog/youtube-algorithm
- nutube.kr/blog/youtube-monetization
- nutube.kr/blog/thumbnail-tips
- nutube.kr/blog/ai-tools

============================================================
폴더 구조 (박 대표님 GitHub와 동일)
============================================================

algomaker_combined/
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── publish/page.tsx                    ← v10.7 (헤더에 v10.7 마커)
    │   ├── _shared/V11Shell.tsx
    │   └── blog/
    │       ├── youtube-start/page.tsx
    │       ├── youtube-algorithm/page.tsx
    │       ├── youtube-monetization/page.tsx
    │       ├── thumbnail-tips/page.tsx
    │       └── ai-tools/page.tsx
    └── public/ads.txt
