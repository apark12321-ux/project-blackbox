# NuTube

유튜브 채널 운영자를 위한 실전 가이드 미디어 (nutube.kr)

## 특징
- 유튜브 알고리즘, 시니어 쇼츠, AI 도구, 수익화, 왕초보, 중고수 6개 카테고리
- 메타데이터 생성기: 키워드 입력 시 제목·설명·태그 자동 생성 (로컬 로직, **외부 API 불필요**)
- 프리렌더링: 검색엔진·AdSense 크롤러를 위한 정적 HTML 생성

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 + 프리렌더 (61개 페이지 + sitemap)
```

## 외부 API
이 사이트는 외부 AI API(Gemini 등)를 사용하지 않습니다.
메타데이터 생성기는 `src/generator.ts`의 로컬 함수로 작동하므로 API 키가 필요 없습니다.
