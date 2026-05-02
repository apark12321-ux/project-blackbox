============================================================
시니어 친화 폰트 일괄 업그레이드
============================================================

박 대표님 지적:
  "폰트 사이즈와 가독성이 많이 떨어진다"

D안 + D안 (전체 일괄 + B안 시니어 친화):
  - 본문 17px (모바일 16px) - 일반 권장 +1.5
  - line-height 1.75 (가독성 ↑)
  - 헤더/카드/메트릭 모두 일관 업그레이드

============================================================
변경 파일 22개 (대규모 업그레이드)
============================================================

[메인 페이지]
★ frontend/app/page.tsx (v10.9 v2)
  - engineTitle 32 → 36px (모바일 22 → 26)
  - engineSub 13.5 → 15px
  - 메트릭 값 22 → 26px
  - slideTitle 20 → 22px
  - slideDesc 13 → 15px

[/blog 목록]
★ frontend/app/blog/page.tsx
  - blogTitle 28 → 32px (모바일 22 → 26)
  - blogSub 14 → 16px
  - guideTitle 15 → 17px (모바일 14 → 16)
  - guideSub 12.5 → 14px
  - 카드 padding 18 → 22px (클릭 영역 확대)

[가이드 페이지 20편]
★ frontend/app/blog/*/page.tsx
  모든 가이드 페이지 일괄 업그레이드:
  - h1: 28 → 30px (모바일 22 → 24)
  - 본문: 15.5 → 17px (모바일 14.5 → 16)
  - 부제: 15 → 16px
  - h2: 20 → 22px (모바일 17 → 19)
  - h3: 17 → 18px (모바일 15.5 → 16.5)
  - 메타: 12 → 13px
  - line-height: 1.65 → 1.75
  - callout: 14.5 → 15.5px
  - formula: 14 → 15px
  - CTA title: 16 → 17px

============================================================
업그레이드 비교 (가이드 본문 기준)
============================================================

이전 (가독성 떨어짐):
  데스크탑: 15.5px
  모바일:   14.5px
  line-height: 1.65

이후 (시니어 친화):
  데스크탑: 17px (+1.5)
  모바일:   16px (+1.5)
  line-height: 1.75

→ 시니어/초보 시청자 가독성 ↑
→ 모바일에서도 글자 잘 보임
→ AdSense 친화 (체류 시간 ↑)

============================================================
박 대표님 적용 (1분)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend
   접속

3. "Add file" → "Upload files"

4. 압축 푼 frontend/ 안 내용 통째로 드래그
   - app/page.tsx (메인)
   - app/blog/page.tsx (목록)
   - app/blog/*/page.tsx (가이드 20편)

5. "Replace existing file" 모두 선택

6. Commit message: refactor: 시니어 친화 폰트 업그레이드

7. Vercel 빌드 → 시크릿 창

8. 확인:
   ✓ 메인 페이지 큰 타이틀, 메트릭 값 잘 보임
   ✓ /blog 목록 카드 글자 잘 보임
   ✓ 가이드 페이지 본문 17px (이전 15.5)
   ✓ 모바일에서도 글자 16px (이전 14.5)
   ✓ 줄 간격 1.75 (이전 1.65)

============================================================
포함 파일 22개
============================================================

[교체]
- frontend/app/page.tsx                    메인 v10.9 v2
- frontend/app/blog/page.tsx               /blog 목록 v2
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

★ V11Shell.tsx 변경 X (이전 v11.6 ZIP의 LNB 메뉴 그대로)
★ publish/page.tsx, contentEngine.ts 변경 X
