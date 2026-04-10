# Project Blackbox v2.1

수익형 유튜브 자동화 솔루션 — 5모듈 파이프라인

## 아키텍처

```
Module A (Curation) → Module B (Script) → Module B-2 (Video) → Module C (Shield) → Module D (Publish)
```

## Quick Start

```bash
# 1. 환경변수 설정
cp infra/.env.example .env
# .env 파일에 API 키 입력

# 2. Docker로 전체 실행
cd infra && docker-compose up -d

# 3. 프론트엔드
cd frontend && npm install && npm run dev
```

## 구조

| 디렉토리 | 모듈 | 역할 |
|----------|------|------|
| module_a/ | A | BOI v2 큐레이션 + 뉴스 수집 |
| module_b/ | B | 3단 스크립트 (CPU-light, 수초) |
| module_b2/ | B-2 | 영상 편집 (GPU-heavy, 5~10분) |
| module_c/ | C | 3중 변주 + Safety Score |
| module_d/ | D | Algo-Sync + SEO + 업로드 |
| infra/ | - | DB, Celery, Docker, Config, OAuth |
| frontend/ | - | Next.js 15 + Tailwind + Zustand |

## API 키 필요 목록

- Gemini API Key (Module A, B)
- News API Key (Module A)
- YouTube Data API v3 Key (Module A)
- ElevenLabs API Key (Module B-2)
- HeyGen API Key (Module B-2)
- YouTube OAuth Client ID/Secret (Module D)

