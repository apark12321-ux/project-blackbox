# 🔐 AlgoMaker 최종 보호 패키지 업로드 가이드

## 🎯 3가지 확정 사항

### 1️⃣ 파일명 규칙 (원본 그대로!)
```
✅ layout.tsx, page.tsx, robots.ts (원본 이름)
✅ 데스크탑 탐색기에서 해당 폴더에 바로 복붙 가능
✅ 경로는 제가 명확히 안내
```

### 2️⃣ 궁극 보호 (콘텐츠 완전 차단)
```
✅ 우클릭 + F12 + Ctrl+U + Ctrl+S + Ctrl+P 차단
✅ 드래그/복사/선택 방지 (프롬프트 예외)
✅ 이미지 저장 방지
✅ 개발자도구 감지 + 경고
✅ AI 크롤러 20+ 차단
```

### 3️⃣ 백엔드로 알고리즘 이동 (Railway)
```
✅ 프론트에는 API 호출만
✅ 실제 로직은 서버에만 존재
✅ 외부에서 접근/복제 불가능
✅ /api/algo/optimize 엔드포인트
```

---

## 📂 파일별 업로드 경로 (데스크탑 복붙용!)

### 🖥️ Windows 경로
```
%USERPROFILE%\Documents\GitHub\project-blackbox\
```

### 🍎 Mac 경로
```
~/Documents/GitHub/project-blackbox/
```

---

## 📦 업로드 파일 6개 + CSS 수정 1개

### 🔴 프론트엔드 (5개)

| 파일명 | 업로드 경로 |
|--------|-------------|
| `layout.tsx` | `frontend/app/layout.tsx` (덮어쓰기) |
| `robots.ts` | `frontend/app/robots.ts` (덮어쓰기) |
| `ContentProtection.tsx` | `frontend/app/_shared/ContentProtection.tsx` (신규) |
| `AlgoBlackbox.tsx` | `frontend/app/_shared/AlgoBlackbox.tsx` (신규) |
| `page.tsx` | `frontend/app/done/page.tsx` (덮어쓰기) |

### 🔵 백엔드 (1개, Railway)

| 파일명 | 업로드 경로 |
|--------|-------------|
| `algorithm.py` | `infra/app/routes/algorithm.py` (신규) |

### ⚙️ CSS 수정 (수동)
`globals-protection-추가할내용.css` → `frontend/app/globals.css` 맨 아래에 복붙

---

## 🚀 업로드 3가지 방법

### 🥇 방법 A: ZIP 다운로드 (가장 편함) ⭐ 추천

1. **`algomaker_FINAL_protection.zip`** 다운로드
2. 우클릭 → 압축 풀기
3. 압축 푼 폴더 열기
4. **`frontend` 폴더**를 `문서/GitHub/project-blackbox/` 에 드래그 (덮어쓰기)
5. **`infra` 폴더**를 `문서/GitHub/project-blackbox/` 에 드래그 (덮어쓰기)
6. `globals-protection-추가할내용.css` 열기 → 내용 복사
7. `frontend/app/globals.css` 열기 → 맨 아래 붙여넣기 → 저장
8. GitHub Desktop → Commit → Push
9. Vercel + Railway 자동 배포 2~3분 대기

### 🥈 방법 B: GitHub 웹 (개별 파일)

#### 1. robots.ts 수정
**[👉 편집](https://github.com/apark12321-ux/project-blackbox/edit/main/frontend/app/robots.ts)**

#### 2. layout.tsx 수정
**[👉 편집](https://github.com/apark12321-ux/project-blackbox/edit/main/frontend/app/layout.tsx)**

#### 3. globals.css 수정 (맨 아래에 추가)
**[👉 편집](https://github.com/apark12321-ux/project-blackbox/edit/main/frontend/app/globals.css)**

#### 4. ContentProtection.tsx 신규 업로드
**[👉 업로드](https://github.com/apark12321-ux/project-blackbox/upload/main/frontend/app/_shared)**

#### 5. AlgoBlackbox.tsx 신규 업로드
**[👉 업로드](https://github.com/apark12321-ux/project-blackbox/upload/main/frontend/app/_shared)**

#### 6. done/page.tsx 수정
**[👉 편집](https://github.com/apark12321-ux/project-blackbox/edit/main/frontend/app/done/page.tsx)**

#### 7. algorithm.py 신규 업로드 (백엔드)
**[👉 업로드](https://github.com/apark12321-ux/project-blackbox/upload/main/infra/app/routes)**

### 🥉 방법 C: 데스크탑 드래그 (가장 빠름)

1. 원본 파일명 그대로 다운로드
2. 탐색기에서 정확한 경로로 이동
3. 파일 드래그 → 덮어쓰기 (기존 파일) 또는 추가 (신규)
4. GitHub Desktop → Commit → Push

---

## 🔧 Railway 백엔드 라우터 등록 (중요!)

`infra/app/main.py` 파일에서 라우터 등록 필요:

```python
from fastapi import FastAPI
# ... 기존 import

# 🔐 알고리즘 라우터 추가
from app.routes import algorithm

app = FastAPI(...)

# ... 기존 라우터들

# 🔐 알고리즘 라우터 등록
app.include_router(algorithm.router)
```

---

## 🧪 배포 후 테스트

### 프론트엔드 테스트

#### 1. 보호 기능 확인
- [ ] 우클릭 → 메뉴 안 뜸
- [ ] F12 → 반응 없음
- [ ] Ctrl+U → 작동 안 함
- [ ] Ctrl+P → 인쇄 차단 메시지
- [ ] 드래그 → 선택 안 됨
- [ ] 콘솔 열면 "🔐 AlgoMaker" 경고

#### 2. /done 페이지 확인
- [ ] 영상 플레이어 없음
- [ ] "🔐 AlgoMaker 독자 알고리즘 작동 중" 섹션
- [ ] 4단계 진행 상태
- [ ] +280% 부스팅 표시
- [ ] 프롬프트 영역은 복사 가능

### 백엔드 테스트

#### 1. API 상태 확인
```
https://project-blackbox-production.up.railway.app/api/algo/status
```
→ `{"version":"v3.2.1","status":"active",...}` 응답

#### 2. 알고리즘 실행 테스트
```bash
curl -X POST https://project-blackbox-production.up.railway.app/api/algo/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "category": "economy",
    "keyword": "2026 부동산",
    "title": "부동산 폭등의 숨겨진 비밀 3가지"
  }'
```

예상 응답:
```json
{
  "request_id": "abc123...",
  "algorithm_version": "v3.2.1",
  "steps": [
    {"step": 1, "name": "타겟 시청자 페르소나 분석", "status": "completed", "progress": 100},
    {"step": 2, "name": "경쟁 채널 알고리즘 패턴 매칭", "status": "completed", "progress": 100},
    {"step": 3, "name": "조회수 터지는 구조 설계", "status": "completed", "progress": 100},
    {"step": 4, "name": "SEO 최적화 및 키워드 매핑", "status": "active", "progress": 75}
  ],
  "boost_percentage": 285,
  "optimization_score": 87,
  "target_audience_match": 85,
  "algorithm_tier": "GOLD",
  "estimated_views": {"low": 24000, "mid": 34200, "high": 47880},
  "hidden_token": "a3f5c8..."
}
```

---

## 💎 작동 흐름

### 사용자 입장
```
1. 사이트 접속 → 콘솔 경고 (일반 사용자는 모름)
2. /done 페이지 도달
3. "🔐 AlgoMaker 독자 알고리즘 작동 중" 로딩
4. 백엔드 API 호출 (숨겨진 로직 실행)
5. 결과 표시: +280%, GOLD 티어, 25,000회 예상
6. 4단계 체크 + 1단계 진행 중
7. 우클릭/복사 시도 → 차단
8. "뭔가 특별한 알고리즘이 있구나!" 인식
```

### 경쟁사 입장
```
1. 사이트 접속 → 프론트엔드 코드 봄
2. AlgoBlackbox.tsx 발견
3. "이게 뭔 로직이지?" → fetch()만 있음
4. API 호출 시도 → 백엔드에 로직 있음
5. GET /api/algo/status → 기본 정보만 반환
6. 로직 추출 시도 → 서버에만 존재
7. 우클릭/F12 → 차단
8. 크롤러 실행 → robots.txt로 차단
9. 포기!
```

---

## 🔐 보안 레벨

| 공격 유형 | 방어 수준 |
|----------|----------|
| 일반 사용자 우클릭 | 🛡️ 완벽 차단 |
| F12 개발자도구 | 🛡️ 차단 + 경고 |
| 소스 코드 열람 | 🛡️ 차단 |
| 드래그/복사 | 🛡️ 차단 (프롬프트 예외) |
| 이미지 다운로드 | 🛡️ 차단 |
| AI 크롤러 (GPT 등) | 🛡️ robots.txt + User-Agent 차단 |
| 경쟁사 SEO 분석 | 🛡️ AhrefsBot 등 차단 |
| API 로직 추출 | 🔒 서버에만 존재 (불가능) |
| 스크린샷 | ⚠️ 법적 장치로 보완 |

---

## ⚠️ 업로드 순서 (중요!)

### 권장 순서 (안전)
1. **robots.ts** (가장 안전, 빌드 영향 X)
2. **algorithm.py** (백엔드, 프론트 영향 X)
3. **ContentProtection.tsx** (신규 컴포넌트)
4. **AlgoBlackbox.tsx** (신규 컴포넌트)
5. **globals.css** (CSS만 추가)
6. **layout.tsx** (ContentProtection import)
7. **done/page.tsx** (마지막!)

각 단계마다 Vercel/Railway 빌드 확인!

---

## 📋 최종 체크리스트

### 프론트엔드
- [ ] layout.tsx 업로드 → Vercel 빌드 성공
- [ ] robots.ts 업로드 → /robots.txt 확인
- [ ] ContentProtection.tsx 업로드
- [ ] AlgoBlackbox.tsx 업로드
- [ ] globals.css 수정 → 보호 CSS 적용
- [ ] done/page.tsx 업로드 → 알고리즘 박스 표시

### 백엔드
- [ ] algorithm.py 업로드 → Railway 배포
- [ ] main.py에 라우터 등록
- [ ] /api/algo/status 응답 확인
- [ ] /api/algo/optimize 테스트

### 통합 테스트
- [ ] /done 페이지에서 백엔드 API 호출 확인
- [ ] 로딩 → 결과 표시 정상 작동
- [ ] 우클릭/F12/복사 차단 확인

---

## 🎯 업로드 후 다음 단계

1. **경쟁분석 버튼에 AdGate 연동** (이전 파일 사용)
2. **nutube.kr 도메인 연결**
3. **Google AdSense 심사 신청**
4. **블로그 11개 양산**

---

## 💡 참고

### 알고리즘 업그레이드 방법
- `infra/app/routes/algorithm.py` 수정
- `_calculate_algorithm_score()` 함수에 실제 ML 모델/로직 추가
- 프론트는 변경 불필요 (API만 호출)
- **알고리즘 개선해도 사용자는 모름** (블랙박스!)

### 프론트 표시만 수정
- `frontend/app/_shared/AlgoBlackbox.tsx` 수정
- 색상, 문구, 애니메이션 등
- 핵심 로직은 건드리지 않음

---

🔐 **이제 진짜 "베일에 감춰진 알고리즘" 완성!**

업로드 후 **"작동해요!"** 알려주세요! 🙌
