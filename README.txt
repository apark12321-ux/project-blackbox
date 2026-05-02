============================================================
C 수준 폰트 업그레이드 - 5060 시니어 최우선
============================================================

박 대표님 지적:
  "B 수준 적용했는데도 여전히 작아 보임"
  → C 수준으로 더 크게

============================================================
C 수준 폰트 (이전 B 대비)
============================================================

[가이드 페이지]
- 본문: 17 → 18px (모바일 16 → 17)
- h1: 30 → 32px (모바일 24 → 26)
- h2: 22 → 24px (모바일 19 → 21)
- h3: 18 → 19px (모바일 16.5 → 17.5)
- 부제: 16 → 17px
- 콜아웃: 15.5 → 17px
- 메타: 13 → 14px
- CTA 버튼: 14 → 15px

[/blog 목록]
- 타이틀: 32 → 36px (모바일 26 → 28)
- 부제: 16 → 17px (모바일 14.5 → 15.5)
- 카드 타이틀: 17 → 19px (모바일 16 → 17)
- 카드 부제: 14 → 15px (모바일 13 → 14)
- 메타: 13 → 14px
- 필터: 14 → 15px (모바일 13 → 14)

[메인 페이지]
- 타이틀: 36 → 40px (모바일 26 → 28)
- 부제: 15 → 17px (모바일 14 → 15.5)
- 메트릭 값: 26 → 30px (모바일 20 → 24)
- 메트릭 라벨: 11 → 12.5px
- 슬라이드 타이틀: 22 → 24px (모바일 19 → 21)
- 슬라이드 설명: 15 → 17px (모바일 14 → 15.5)
- 슬라이드 디테일: 13 → 14px

============================================================
폰트 변화 비교 (가이드 본문)
============================================================

원본 (적용 전):     데스크탑 15.5px / 모바일 14.5px
B 수준 (직전 ZIP): 데스크탑 17px / 모바일 16px
C 수준 (이번 ZIP): 데스크탑 18px / 모바일 17px

→ 시니어/5060 사용자 가독성 ↑↑
→ 모바일에서도 글자 크게 보임
→ AdSense 친화 (체류 시간 ↑)

============================================================
박 대표님 적용 (1분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 frontend/ 안 내용 통째로 드래그
   - app/page.tsx (메인 v3)
   - app/blog/page.tsx (목록 v3)
   - app/blog/*/page.tsx (가이드 20편 v3)

5. "Replace existing file" 모두 선택

6. Commit message: refactor: C 수준 폰트 - 5060 시니어 최우선

7. Vercel 빌드 → 시크릿 창

8. 확인:
   ✓ 가이드 본문 18px (B 17px 보다 더 크게)
   ✓ 모바일 본문 17px (B 16px 보다 더 크게)
   ✓ 메인 타이틀 40px
   ✓ /blog 카드 19px
   ✓ 헤더 32px (가이드)

============================================================
포함 파일 22개
============================================================

[교체 - 모두 C 수준]
- frontend/app/page.tsx                   메인 v3
- frontend/app/blog/page.tsx              /blog v3
- frontend/app/blog/algorithm-seo/page.tsx
- frontend/app/blog/algorithm-retention/page.tsx
- frontend/app/blog/algorithm-branding/page.tsx
- frontend/app/blog/algorithm-mistakes/page.tsx
- frontend/app/blog/algorithm-mindset/page.tsx
- frontend/app/blog/youtube-start/page.tsx
- frontend/app/blog/youtube-algorithm/page.tsx
- frontend/app/blog/thumbnail-tips/page.tsx
- frontend/app/blog/youtube-monetization/page.tsx
- frontend/app/blog/ai-tools/page.tsx
- frontend/app/blog/first-100-subs/page.tsx
- frontend/app/blog/viral-patterns/page.tsx
- frontend/app/blog/side-job-50/page.tsx
- frontend/app/blog/channel-concept/page.tsx
- frontend/app/blog/phone-shooting/page.tsx
- frontend/app/blog/free-editing-apps/page.tsx
- frontend/app/blog/camera-anxiety/page.tsx
- frontend/app/blog/chatgpt-script/page.tsx
- frontend/app/blog/ai-thumbnail/page.tsx
- frontend/app/blog/revenue-calc/page.tsx

★ V11Shell.tsx 변경 X (이전 v11.6 그대로)
★ publish/page.tsx, contentEngine.ts 변경 X
★ Cinematic 두 파일 변경 X
