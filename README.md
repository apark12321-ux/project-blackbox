# 🔮 AlgoMaker - Crystal Ball Edition (전체 폴더)

## 📦 압축 풀고 frontend 폴더만 통째로 드래그!

### 🚀 빠른 사용법

1. 이 ZIP 압축 풀기
2. **`frontend` 폴더**를 통째로 드래그
3. → `Documents\GitHub\project-blackbox\` 안에 놓기
4. "파일 바꾸기" 클릭 (덮어쓰기)
5. GitHub Desktop → Commit → Push
6. Vercel 2~3분 대기
7. 🔮 구슬볼 등장!

### 📂 포함된 모든 변경사항

✅ Crystal Ball Oracle (구슬볼 메인 이벤트)
✅ Oracle Status Bar (상단 네온바)
✅ Sound Manager (사운드 토글)
✅ Content Protection (보호 시스템)
✅ Tools 10개 업데이트 (이미지/영상)
✅ AdGate 모달 (광고 시청)
✅ AI 크롤러 차단 (robots.ts)

### ⚠️ 중요

- `globals.css`는 **건드리지 않음** (충돌 방지)
- 기존 디자인 그대로 유지
- 모든 페이지 보존

## 📂 전체 파일 23개

```
frontend/
└── app/
    ├── _shared/
    │   ├── AdGate.tsx               🆕 광고 시청 모달
    │   ├── AlgoBooster.tsx          (기존)
    │   ├── ContentProtection.tsx    🆕 보호 시스템
    │   ├── CrystalBallOracle.tsx    🆕 구슬볼 ⭐
    │   ├── OracleStatusBar.tsx      🆕 상단 네온바
    │   ├── SoundManager.tsx         🆕 사운드 토글
    │   ├── V11Shell.tsx             (기존)
    │   ├── imagePrompts.ts          (기존)
    │   ├── platforms.ts             (기존)
    │   └── promptGenerator.ts       ⭐ 툴 10개 업데이트
    ├── about/page.tsx               (기존)
    ├── blog/page.tsx                (기존)
    ├── contact/page.tsx             (기존)
    ├── done/page.tsx                ⭐ 구슬볼 적용
    ├── keyword/page.tsx             (기존)
    ├── knowhow/first-30-seconds-hook/page.tsx
    ├── layout.tsx                   ⭐ Crystal Ball 적용
    ├── metadata/page.tsx            (기존)
    ├── page.tsx                     (기존, 홈)
    ├── platform/page.tsx            (기존)
    ├── privacy/page.tsx             (기존)
    ├── robots.ts                    🆕 AI 크롤러 차단
    └── terms/page.tsx               (기존)
```

🆕 = 신규 파일 (6개)
⭐ = 수정된 파일 (4개)
(기존) = 변경 없음 (13개)

## 🎬 작동 시퀀스

홈 → 카테고리 → 키워드 → 시나리오 → 플랫폼 → 메타 → /done
                                                          ↓
                                              🔮 구슬볼 8초 드라마!
