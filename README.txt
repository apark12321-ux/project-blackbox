============================================================
AlgoMaker — v10.7 + 가이드 5편 통합 (드래그앤드롭)
============================================================

ZIP 안 폴더 구조 (박 대표님 GitHub와 동일):

algomaker_combined/
└── frontend/
    ├── app/
    │   ├── page.tsx                         메인 (v9.5)
    │   ├── layout.tsx                       레이아웃 (v9.4)
    │   ├── publish/page.tsx                 publish (v10.7)
    │   ├── _shared/V11Shell.tsx             V11Shell (v11.1)
    │   └── blog/
    │       ├── youtube-start/page.tsx       가이드 1편
    │       ├── youtube-algorithm/page.tsx   가이드 2편
    │       ├── youtube-monetization/page.tsx 가이드 3편
    │       ├── thumbnail-tips/page.tsx      가이드 4편
    │       └── ai-tools/page.tsx            가이드 5편
    └── public/ads.txt

============================================================
박 대표님 적용 방법 (한 번에 끝)
============================================================

1. ZIP 다운로드 → 압축 풀기
   → algomaker_combined 폴더 생김

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속 (frontend 폴더)

3. "Add file" → "Upload files"

4. 압축 풀린 폴더의 frontend/ 안의 내용물을 통째로 드래그
   - app/ 폴더 (page.tsx, layout.tsx, publish/, _shared/, blog/ 모두 포함)
   - public/ 폴더

5. Commit message: feat: v10.7 + 가이드 5편

6. Commit changes 클릭

7. Vercel Deployments → 1~2분 대기 → Ready

8. 최신 빌드 우측 ... → Redeploy
   → "Use existing Build Cache" 체크 해제 ⚠️ 필수
   → Redeploy 클릭

9. 1~2분 대기 → Ready → Promote to Production

10. nutube.kr 시크릿 창에서 확인:
    - publish 페이지 STEP 6 → 빨강 배너 보이면 v10.7 적용 성공
    - blog/youtube-start 접속 가능하면 가이드 적용 성공

============================================================
포함 파일 목록
============================================================

[v10.7 핵심 5개]
- frontend/app/page.tsx (v9.5 메인 컴팩트)
- frontend/app/layout.tsx (v9.4 이메일 변경)
- frontend/app/publish/page.tsx (v10.7 자동 이동 + 4개 플랫폼)
- frontend/app/_shared/V11Shell.tsx (v11.1 컴팩트)
- frontend/public/ads.txt (Publisher ID 황별초)

[가이드 5편]
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/ai-tools/page.tsx
