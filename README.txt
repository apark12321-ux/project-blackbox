============================================================
v18.6 - sitemap.xml 개선 (lastmod + priority 차별화)
============================================================

박 대표님 의도:
  "개선해야 할 부분 빨리 개선 가능"
  
어시스턴트 분석 → 발견된 개선점:
  
[1] lastmod 모든 URL 동일 = 검색 봇이 의심 가능
  Before: 모든 URL 2026-05-06 (빌드 시간)
  After: 가이드는 publishedAt 사용, 정적 페이지만 빌드 시간

[2] 가이드 우선순위 모두 0.7 동일
  Before: 28편 모두 priority 0.7
  After: 시니어 5편 0.8 (박 대표님 핵심)
         그 외 23편 0.7

============================================================
변경 후 sitemap.xml 결과
============================================================

[정적 페이지 7개]
/ : priority 1.0, daily, 빌드 시간
/blog : priority 0.9, daily, 빌드 시간
/publish : priority 0.8, weekly, 빌드 시간
/about : priority 0.6, monthly, 빌드 시간
/contact : priority 0.6, monthly, 빌드 시간
/privacy : priority 0.4, yearly, 빌드 시간
/terms : priority 0.4, yearly, 빌드 시간

[가이드 28편]
시니어 5편: priority 0.8, 2026-05-04 (박 대표님 핵심)
- senior-channel-start
- senior-content-ideas
- senior-hook-patterns
- senior-engagement
- senior-policy-safe

알고리즘 11편: priority 0.7, 작성일별
- 2026-05-04: human-warmth
- 2026-05-02: algorithm-seo, algorithm-retention, 등 4편
- 2026-05-01: youtube-algorithm, channel-concept, youtube-start
- 2026-04-28: youtube-monetization

AI 도구 9편: priority 0.7, 작성일별
- 2026-05-04: claude-youtube-workflow
- 2026-05-01: phone-shooting, free-editing-apps, 등 5편
- 2026-04-30: chatgpt-script
- 2026-04-29: ai-thumbnail
- 2026-04-28: ai-tools

수익화 4편: priority 0.7, 작성일별
- 2026-05-02: algorithm-mindset, first-100-subs, side-job-50
- 2026-04-30: revenue-calc

============================================================
효과 (애드센스 + SEO)
============================================================

[애드센스 검토자]
✅ 시니어 카테고리 강조 = 박 대표님 정체성 명확
✅ 가이드별 작성일 = 진짜 콘텐츠 운영 신호
✅ 정적 페이지는 매일 빌드 = 활발한 사이트

[구글 검색 봇]
✅ 가이드별 lastmod 다름 = 자연스러운 사이트
✅ 시니어 5편 우선 색인 = 검색 노출 ↑
✅ 발행일 정확 = 검색 결과에 정확한 날짜 표시

[검색 결과 표시]
박 대표님 가이드 검색 시:
- 작성일이 정확하게 표시됨 (예: "5월 4일")
- "오래된 콘텐츠" 의심 X
- 시니어 가이드가 우선 노출

============================================================
박 대표님 자산 100% 보존
============================================================

수정된 부분:
  frontend/app/sitemap.ts (1개 파일)

변경 안 된 부분:
  ✅ 모든 가이드 페이지 (27편 + human-warmth)
  ✅ 메인 페이지 v18.4 정렬
  ✅ /publish 페이지 v18.5 키워드 태그
  ✅ Cinematic 컴포넌트
  ✅ 박 대표님 자산 (contentEngine 등)
  ✅ 매뉴얼 보안 100%

============================================================
박 대표님 적용 (30초)
============================================================

1. ZIP 다운로드 → 압축 풀기

2. github.com/apark12321-ux/project-blackbox/tree/main/frontend/app

3. "Add file" → "Upload files"

4. 압축 푼 frontend/app/ 안 sitemap.ts 드래그

5. "Replace existing file" 체크

6. Commit message:
   fix: sitemap lastmod + priority 차별화 (SEO 개선)

7. Vercel 빌드 (1~2분)

8. 확인:
   nutube.kr/sitemap.xml 접속
   ✓ 시니어 5편 priority 0.8 확인
   ✓ 가이드별 lastmod 다름 확인
   ✓ 정적 페이지 7개 그대로

============================================================
다음 단계 (박 대표님 직접)
============================================================

1. Google Search Console 등록
   - search.google.com/search-console
   - 속성 추가: nutube.kr
   - 소유권 확인 (HTML 태그 또는 DNS)
   - sitemap 제출: https://nutube.kr/sitemap.xml
   - 색인 요청

2. Naver 웹마스터 도구 (선택)
   - searchadvisor.naver.com
   - 한국 사용자 검색 강화

3. 1~2주 후 색인 확인

============================================================
박 대표님 새 가이드 추가 시
============================================================

이번 v18.6 적용 후:
박 대표님이 새 가이드 추가하실 때
sitemap.ts 의 GUIDES 배열에도 추가하시면
자동으로 lastmod + priority 적용

추가 형식:
  { 
    slug: '새-슬러그', 
    publishedAt: '2026-MM-DD', 
    category: 'algorithm' // algorithm/senior/aitools/monetization
  },

= 자동 정렬 + 자동 우선순위
