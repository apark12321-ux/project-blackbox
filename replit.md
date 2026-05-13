# NuTube (project-blackbox)

알고리즘·시니어·AI 유튜브 채널 운영 가이드 + 메타데이터 생성 도구 서비스.

## Run & Operate

- NuTube 프론트엔드: `pnpm --filter @workspace/nutube run dev` (port 25429, Next.js 14)
- API 서버: `pnpm --filter @workspace/api-server run dev` (port 8080, Express)
- GitHub push: `bash scripts/src/github-push.sh "커밋 메시지"` (GITHUB_TOKEN 필요)

## GitHub → 배포 흐름

```
Replit 편집 → bash scripts/src/github-push.sh "메시지"
  → GitHub (apark12321-ux/project-blackbox)
  → Vercel 자동 배포 → nutube.kr (프론트엔드)
  → Railway 자동 배포 → project-blackbox-production.up.railway.app (백엔드)
```

## Stack

- **프론트엔드** (`artifacts/nutube/`): Next.js 14, React 18, Tailwind CSS, TypeScript
- **백엔드** (`infra/`): FastAPI (Python), PostgreSQL, Redis, Celery
- **배포**: Vercel (프론트) + Railway (백엔드)
- **Replit 내부**: Express API 서버 (`artifacts/api-server/`) — BlogStudio 연동용

## Where things live

- 프론트엔드 코드: `artifacts/nutube/` (app/, components/, lib/, hooks/, stores/, data/)
- 백엔드 코드: `infra/` (module_a/, module_b/, module_b2/, video_routes.py 등)
- API 스펙: `lib/api-spec/openapi.yaml`
- GitHub push 스크립트: `scripts/src/github-push.sh`

## 환경변수

**프론트엔드** (`artifacts/nutube/.env.local`):
- `NEXT_PUBLIC_SITE_URL=https://nutube.kr`
- `NEXT_PUBLIC_API_URL=https://project-blackbox-production.up.railway.app`
- `NUTUBE_API_KEY` — API 인증 키 (Secrets에 추가 필요)
- `NUTUBE_BASIC_USER` — Basic Auth 사용자명 (Secrets에 추가 필요)
- `NUTUBE_BASIC_PASS` — Basic Auth 비밀번호 (Secrets에 추가 필요)

**GitHub push용**:
- `GITHUB_TOKEN` — GitHub Personal Access Token (Secrets에 추가 필요)

## Architecture decisions

- Next.js 14 App Router 사용 (app/ 디렉토리 구조)
- FastAPI 멀티 모듈 구조 (A: 큐레이션, B: 메타데이터, B2: 영상, Video)
- Railway FastAPI ↔ Vercel Next.js 분리 배포
- BlogStudio → Replit Express API → nutube.kr 블로그 자동 발행 흐름

## User preferences

- 한국어로 소통 선호
- GitHub → Vercel/Railway 자동 배포 흐름 유지
- Replit에서 편집 후 push하는 방식으로 운영

## Gotchas

- `GITHUB_TOKEN` 없이는 push 스크립트 실행 불가 (Secrets 탭에 추가 필요)
- Next.js는 `PORT` 환경변수를 자동으로 읽지 않으므로 `${PORT:-3000}` 방식 사용
- `infra/` 폴더가 Railway에 직접 배포됨 — 변경 후 push하면 자동 재배포
- 브라우저 콘솔 hydration 경고는 기존 코드의 JSON-LD 스크립트 관련 이슈 (기능에 영향 없음)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
