# 🎯 AlgoMaker ULTIMATE — 각 SNS 업로드 화면 재현판

> 박예준 대표님 최종 요청 반영
> 각 SNS의 **실제 업로드 화면을 그대로 재현**한 페이지

---

## ✨ 이번 버전의 핵심

### 🎬 YouTube 영상 섹션 (상단, 기존 유지)
- 영상 미리보기
- Algo-Magic Booster 레버
- HD 다운로드 / 대본 / 태그

### 📱 각 SNS별 실제 업로드 화면 재현 (NEW)
- **YouTube Studio** 스타일 (제목, 설명, 썸네일, 재생목록, 시청자층, 태그, 카테고리)
- **YouTube Shorts** 업로드 화면
- **TikTok** 실제 업로드 UI (캡션, 해시태그, 사운드, 댓글·듀엣·스티치)
- **Instagram Reels** 새 릴스 화면 (커버, 캡션, 해시태그, 음악)

### 🎨 이미지/영상 프롬프트 (한글+영문)
- **이미지 프롬프트** 4가지 스타일
  - 📷 포토리얼 (Midjourney, Flux, DALL-E)
  - 🎨 일러스트 (DALL-E, Leonardo)
  - 📊 인포그래픽 (Canva AI)
  - 🎬 시네마틱 (Midjourney, Flux)

- **영상 프롬프트** (NEW!)
  - 🎬 시네마틱 영상
  - 추천 툴: Runway Gen-3, Kling AI, Luma, Sora

- **각 씬별** 한글 설명 + 영문 AI 프롬프트
  - 카테고리 8종별 맞춤 씬
  - 6개 씬 구조 (오프닝/문제/핵심1/핵심2/결론/CTA)

---

## 📦 업로드 파일 2개

### 🆕 신규
```
frontend/app/_shared/promptGenerator.ts
```

### ✏️ 덮어쓰기
```
frontend/app/done/page.tsx
```

---

## 🚀 업로드 방법

### 방법 1: ZIP (추천)

**Step 1: 압축 풀기**
1. `algomaker_ultimate.zip` 다운로드
2. 우클릭 → 압축 풀기

**Step 2: frontend 폴더 드래그**
```
압축 푼 폴더/frontend/
        ↓ 드래그
문서/GitHub/project-blackbox/
        → "파일 바꾸기"
```

**Step 3: GitHub Desktop**
```
- 2개 파일 변경
- 커밋: "feat: ULTIMATE - SNS 실제 업로드 화면 재현 + 한글/영문 프롬프트"
- Commit & Push
```

**Step 4: Vercel 자동 배포 (2~3분)**

---

### 방법 2: GitHub 웹 개별 업로드

#### 1️⃣ promptGenerator.ts (신규)
👉 [여기 클릭](https://github.com/apark12321-ux/project-blackbox/new/main/frontend/app/_shared)
- 파일명: `promptGenerator.ts`
- 내용: `_shared_promptGenerator.ts` 복사

#### 2️⃣ done/page.tsx (덮어쓰기)
👉 [여기 클릭](https://github.com/apark12321-ux/project-blackbox/edit/main/frontend/app/done/page.tsx)
- Ctrl+A → Delete
- `app_done_page.tsx` 복사
- Commit

---

## 🎯 사용자 경험

### 업로드 흐름
```
1. 메타데이터 페이지에서 "AI 자동 생성" 클릭
   ↓
2. /done 도착!
   ↓
3. 📺 YouTube 영상 섹션
   - 영상 미리보기
   - ⚡ 레버 클릭 → 알고리즘 적용
   - 📥 HD 영상 다운로드 (활성화)
   ↓
4. 📱 SNS 업로드 템플릿 탭
   - 플랫폼 선택 (YouTube 롱폼/Shorts/TikTok/Reels)
   - 해당 플랫폼의 실제 업로드 화면 그대로!
   - 제목·설명·태그·썸네일 모두 채워진 상태
   - 각 항목 "📋 복사" 버튼
   ↓
5. 🎨 이미지/영상 프롬프트 탭
   - 🖼️ 이미지 or 🎬 영상 선택
   - 스타일 선택 (포토리얼/일러스트/인포그래픽/시네마틱)
   - 추천 AI 툴 목록 (바로가기 링크)
   - 6개 씬별 한글 설명 + 영문 프롬프트
   - 복사해서 Midjourney/Runway에 붙여넣기
   ↓
6. ✨ 완성!
```

### 예시: YouTube Studio 재현 화면
```
┌──────────────────────────────────────┐
│ ▶️ Studio                 동영상 업로드 │
├──────────────────────────────────────┤
│                                        │
│ 세부정보                                │
│ 이 제목과 설명이 동영상에 포함됩니다.    │
│                                        │
│ 제목 *                        45/100   │
│ ┌────────────────────────────────┐   │
│ │ ⚠️ 2026 금리 인하, 이것만... (파란) │   │
│ └────────────────────────────────┘   │
│ [📋 제목 복사]                         │
│                                        │
│ 설명                       450/5000    │
│ ┌────────────────────────────────┐   │
│ │ 이번 영상에서는 ...             │   │
│ │ 📌 주요 내용:                   │   │
│ │ - 금리 인하 시기                │   │
│ └────────────────────────────────┘   │
│ [📋 설명 복사]                         │
│                                        │
│ 썸네일                                 │
│ ┌────────────────┐                   │
│ │  1280 × 720    │                   │
│ │  (썸네일 미리보기)│                   │
│ └────────────────┘                   │
│                                        │
│ 재생목록                               │
│ 📊 경제·재테크 - 2026 금리 전망       │
│                                        │
│ 시청자층                               │
│ ● 아니요, 아동용이 아닙니다           │
│                                        │
│ 태그                        287/500자  │
│ ┌────────────────────────────────┐   │
│ │ 2026 금리 전망, 금리전망, ...    │   │
│ └────────────────────────────────┘   │
│ [📋 태그 복사]                         │
│                                        │
│ 카테고리                               │
│ 뉴스/정치                              │
└──────────────────────────────────────┘
```

### 예시: 이미지 프롬프트 (한글+영문)
```
🎬 오프닝 훅 · 0-5초          16:9

📝 한글 씬 설명
[2026 금리 전망] 사무실에서 경제 지표를 
분석하는 30대 비즈니스맨, 노트북에 금융 
차트, 서울 도심 배경 (시네마틱 스타일)

🌐 영문 AI 프롬프트 (복사해서 사용)
2026 금리 전망 topic: Korean businessman 
in suit analyzing financial charts on 
laptop, modern office, Seoul skyline 
background, cinematic lighting, movie 
still, dramatic atmosphere, shallow depth 
of field, film grain, 35mm --ar 16:9 --v 6

Negative: bright, flat, amateur, low contrast

[📋 영문 프롬프트] [📋 한글 설명] [📋 Negative]
```

---

## 🧪 배포 후 테스트

### 확인 체크리스트

#### 📺 YouTube 영상 섹션
- [ ] 영상 미리보기 박스
- [ ] Algo-Magic Booster 레버 작동
- [ ] HD 영상 다운로드 버튼
- [ ] 대본 / 태그 복사 버튼

#### 📱 SNS 업로드 템플릿 탭
- [ ] YouTube Studio 스타일 재현
- [ ] YouTube Shorts 업로드 화면
- [ ] TikTok 검정 헤더, 핑크 버튼
- [ ] Instagram 그라디언트 헤더, 파란 버튼
- [ ] 각 필드의 복사 버튼 작동

#### 🎨 프롬프트 탭
- [ ] 🖼️ 이미지 / 🎬 영상 토글
- [ ] 이미지: 4가지 스타일 선택
- [ ] 영상: 시네마틱 단일
- [ ] 추천 AI 툴 링크 (Midjourney, Runway 등)
- [ ] 한글 설명 + 영문 프롬프트
- [ ] 각 씬 복사 버튼
- [ ] 전체 프롬프트 한번에 복사 버튼

---

## 💎 AI 툴 추천 정리

### 이미지 생성 (4가지)
| 툴 | 가격 | 스타일 |
|----|------|--------|
| Midjourney v6 | $10/월~ | 모든 스타일 |
| DALL-E 3 | ChatGPT Plus | 일러스트, 포토리얼 |
| Flux Pro | Free tier | 포토리얼, 시네마틱 |
| Canva AI | Free tier | 인포그래픽 |
| Leonardo AI | Free tier | 일러스트 |

### 영상 생성 (NEW!)
| 툴 | 가격 | 특징 |
|----|------|------|
| Runway Gen-3 | $12/월~ | 고품질, 안정성 |
| Kling AI | Free tier | 무료 사용 가능 |
| Luma Dream Machine | Free tier | 빠른 생성 |
| Sora (OpenAI) | ChatGPT Pro | 최고 품질 |

---

## 🎯 핵심 개선사항

| 항목 | 이전 | **이번 (ULTIMATE)** |
|------|------|---------------------|
| SNS 업로드 UI | 간단한 목업 | **실제 페이지 재현** ✨ |
| 프롬프트 언어 | 영문만 | **한글+영문** ✨ |
| 미디어 타입 | 이미지만 | **이미지+영상** ✨ |
| YouTube 카테고리 | 없음 | **YouTube Studio 카테고리 선택** ✨ |
| TikTok 옵션 | 없음 | **댓글/듀엣/스티치 토글** ✨ |
| Instagram 음악 | 없음 | **Instagram 라이브러리 안내** ✨ |
| 영상 AI 툴 | 없음 | **Runway/Kling/Luma/Sora** ✨ |

---

## 🎬 완성된 AlgoMaker

### 박예준 대표님의 비전 100% 달성
- ✅ YouTube 메인 유지
- ✅ 다른 SNS 확장
- ✅ 실제 업로드 페이지 그대로 재현
- ✅ 복붙만 하면 업로드 완료
- ✅ 이미지 + 영상 프롬프트
- ✅ 한글 (기본) + 영문 (디테일)
- ✅ 8개 카테고리 모두 대응
- ✅ 시나리오 기반 6개 씬

### 사용자 이점
1. **학습 곡선 제로**: 각 플랫폼 업로드 방법 몰라도 OK
2. **복붙 천국**: 모든 내용 복사 가능
3. **전문가 수준 프롬프트**: 한글로 이해, 영문으로 사용
4. **최고 AI 툴 추천**: 각 용도별 최적 툴
5. **시간 절약**: 10시간 걸릴 작업 10분에

---

🎯 **이제 진짜 "끝판왕"이에요!**

압축 풀고 → frontend 폴더 드래그 → Commit & Push → 5분!

확인 후 알려주세요 🙌
