============================================================
AlgoMaker v10.7 — 드래그앤드롭 적용용 (5개 파일)
============================================================

ZIP 안 폴더 구조 (박 대표님 GitHub와 동일):

algomaker_drop_in/
└── frontend/
    ├── app/
    │   ├── page.tsx              ← 메인 (v9.5)
    │   ├── layout.tsx            ← 레이아웃 (v9.4)
    │   ├── publish/
    │   │   └── page.tsx          ← publish (v10.7)
    │   └── _shared/
    │       └── V11Shell.tsx      ← V11Shell (v11.1)
    └── public/
        └── ads.txt               ← Publisher ID

============================================================
적용 시 반영 안 될 때 — 트러블슈팅 체크리스트
============================================================

[1] Vercel Production 빌드 확인
    https://vercel.com → project-blackbox-cpqy → Deployments
    
    ✅ 최신 빌드 시간이 방금 시간인지
    ✅ 상태가 "Ready"인지 (Error 아님)
    ✅ "Production" 라벨이 최신 빌드에 있는지
    ❌ Production 라벨이 옛 빌드에 있으면:
       → 최신 빌드 우측 "..." → "Promote to Production"

[2] Vercel 빌드 로그 확인 (빌드 실패 여부)
    Deployments → 최신 빌드 클릭 → "Build Logs"
    
    ❌ 빨간 에러 메시지 있으면 빌드 실패한 것
    → 그 경우 옛 버전이 그대로 운영됨
    → 에러 메시지 캡처 보내주세요

[3] 캐시 제거
    방법 A: F12 → Network 탭 → "Disable cache" 체크 → F5
    방법 B: Ctrl + Shift + N (시크릿 모드) → 다시 접속
    방법 C: Ctrl + Shift + Delete → 캐시 삭제

[4] Vercel과 GitHub 연결 확인
    Vercel → Settings → Git
    
    ✅ Production Branch가 "main"인지
    ✅ GitHub 저장소 연결되어 있는지

============================================================
박 대표님 적용 (3분, 한 번에 끝)
============================================================

1. ZIP 다운로드 → 압축 풀기 → algomaker_drop_in 폴더 생김

2. https://github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속 (frontend 폴더 안)
   
3. 우측 상단 "Add file" → "Upload files" 클릭

4. 압축 풀린 폴더의 frontend/ 안의 내용물을 통째로 드래그
   - app/ 폴더 (page.tsx, layout.tsx, publish/, _shared/ 모두 포함)
   - public/ 폴더 (ads.txt 포함)

5. Commit message: "feat: v10.7 종합 업데이트"

6. "Commit changes" 클릭

7. Vercel Deployments 탭 → 최신 빌드 대기 (1~2분)

8. ✅ Ready 확인 → "..." → "Promote to Production"

9. nutube.kr 또는 vercel.app에서 Ctrl + Shift + R (강력 새로고침)
   또는 시크릿 모드로 새로 접속

============================================================
v10.7 변경사항 (반영 후 보일 것)
============================================================

[STEP 1] 사례 카드 클릭 → STEP 2 자동 이동 + 자동 스크롤
[STEP 2] 제목 클릭 → 300ms 선택 → STEP 3 자동 이동
[STEP 3] "시나리오 확인 완료 · 다음 단계로 →" 검정 버튼
[STEP 4] "프롬프트 확인 완료 · 다음 단계로 →" 검정 버튼
[STEP 5] "메타데이터 확인 완료 · SNS 업로드 자료 보기 →" 주황 버튼

[STEP 6] 4개 플랫폼 진짜 SNS 디자인:
  📺 YouTube:   빨강 그라디언트 배너 (#ff0000 → #cc0000)
  🩳 Shorts:    핑크 그라디언트 + 9:16 모바일 미리보기
  📸 Instagram: 옐로/핑크/보라 그라디언트
  🎵 TikTok:    검정 + 시안 라인 + 시안→마젠타 로고

============================================================
박 대표님 추가 작업 (1개, 5분)
============================================================

📋 개인정보처리방침 이메일 변경:
   GitHub 검색: contact@nutube.kr
   해당 파일 → 연필 아이콘 ✏️
   → apark12321@gmail.com 으로 변경 → Commit

============================================================
박 대표님 자산 100% 보존
============================================================

✅ contentEngine.ts (1,723줄)
✅ v650Adapter.ts
✅ V11Shell 메뉴/노출/링크
✅ FEATURED_GUIDES, CATEGORY_NAV, FAQ_LIST
✅ 가짜 데이터 0
✅ 외부 브랜드명 0
