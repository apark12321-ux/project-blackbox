# 📂 폴더 구조 (시각 가이드)

## ZIP 안에 들어있는 구조

```
algomaker_upload_v2.zip (압축 파일)
  │
  └─ 📁 algomaker_upload_v2/  ← 압축 풀면 이 폴더가 나와요
       │
       ├─ 📄 README_한글가이드.md           (가이드 읽기)
       ├─ 📄 폴더구조.md                     (이 파일)
       │
       └─ 📁 frontend/                      ← ⭐ 이 폴더를 써야 해요!
            │
            └─ 📁 app/
                 │
                 ├─ 📄 page.tsx              (홈 페이지)
                 │
                 ├─ 📁 _shared/              (공통 컴포넌트)
                 │    ├─ 📄 V11Shell.tsx     (레이아웃)
                 │    ├─ 📄 AlgoBooster.tsx  (🎯 레버 컴포넌트)
                 │    └─ 📄 platforms.ts     (SNS 플랫폼 정의)
                 │
                 ├─ 📁 keyword/              (키워드 입력)
                 │    └─ 📄 page.tsx
                 │
                 ├─ 📁 platform/ 🆕          (플랫폼 선택)
                 │    └─ 📄 page.tsx
                 │
                 ├─ 📁 metadata/ 🆕          (메타데이터)
                 │    └─ 📄 page.tsx
                 │
                 ├─ 📁 done/ 🆕              (결과 + 레버)
                 │    └─ 📄 page.tsx
                 │
                 ├─ 📁 blog/                 (블로그 메인)
                 │    └─ 📄 page.tsx
                 │
                 └─ 📁 knowhow/
                      └─ 📁 first-30-seconds-hook/
                           └─ 📄 page.tsx    (샘플 블로그 글)

🆕 = 신규 폴더 (GitHub에 없던 것)
📁 = 폴더
📄 = 파일
⭐ = 이걸 사용
```

---

## 로컬 GitHub 폴더 구조 (작업 후)

```
📁 문서/
  └─ 📁 GitHub/
       │
       └─ 📁 project-blackbox/           ← 이 폴더에 덮어쓰기
            │
            └─ 📁 frontend/              ← 여기에 압축 푼 frontend 덮어쓰기
                 │
                 └─ 📁 app/
                      │
                      ├─ 📄 page.tsx       ✏️ 덮어쓰기
                      │
                      ├─ 📁 _shared/
                      │    ├─ 📄 V11Shell.tsx    ✏️ 덮어쓰기
                      │    ├─ 📄 AlgoBooster.tsx ➕ 신규
                      │    └─ 📄 platforms.ts    ➕ 신규
                      │
                      ├─ 📁 keyword/
                      │    └─ 📄 page.tsx        ✏️ 덮어쓰기
                      │
                      ├─ 📁 platform/ 🆕          ➕ 신규 폴더
                      │    └─ 📄 page.tsx
                      │
                      ├─ 📁 metadata/ 🆕          ➕ 신규 폴더
                      │    └─ 📄 page.tsx
                      │
                      ├─ 📁 done/ 🆕              ➕ 신규 폴더
                      │    └─ 📄 page.tsx
                      │
                      ├─ 📁 blog/
                      │    └─ 📄 page.tsx        ✏️ 덮어쓰기
                      │
                      └─ 📁 knowhow/
                           └─ 📁 first-30-seconds-hook/
                                └─ 📄 page.tsx  ✏️ 덮어쓰기

✏️ = 덮어쓰기 (기존 파일 수정)
➕ = 신규 (새로 생성)
🆕 = 신규 폴더
```

---

## 🎯 핵심 규칙

### 1️⃣ 압축을 반드시 풀기
```
❌ ZIP 파일 자체를 쓰면 안 됨
✅ ZIP 우클릭 → "압축 풀기" → 나온 폴더 사용
```

### 2️⃣ frontend 폴더 단위로 복사
```
❌ 파일 하나씩 복사 (실수 위험)
✅ frontend 폴더 전체를 한 번에 드래그
```

### 3️⃣ 덮어쓰기 허용
```
파일이 이미 있다고 뜨면:
✅ "파일 바꾸기" / "Replace files" 클릭
❌ "건너뛰기" / "Skip" 절대 금지
```

### 4️⃣ 신규 폴더 자동 생성 확인
```
드래그 후 이 3개 폴더가 생겼는지 확인:
- platform/
- metadata/
- done/
```

---

## 📋 드래그 앤 드롭 방법 (Windows)

### Step-by-Step

1. **왼쪽 탐색기**: 압축 푼 폴더
   ```
   다운로드/algomaker_upload_v2/
   ```
   주소창에 위 경로 복사 붙여넣기

2. **오른쪽 탐색기**: 로컬 GitHub 폴더
   ```
   문서/GitHub/project-blackbox/
   ```
   주소창에 위 경로 복사 붙여넣기

3. **왼쪽 창에서 `frontend` 폴더 선택**
   - 클릭 한 번이면 됨 (더블클릭 X)

4. **드래그**: 왼쪽의 `frontend` 폴더를 오른쪽 창의 **빈 공간**에 드롭

5. **확인창 팝업**:
   - "대상에 같은 이름의 폴더가 있습니다"
   - **"파일 바꾸기"** 또는 **"파일 병합"** 선택
   - (둘 다 OK. Windows 버전에 따라 다름)

6. **완료**: 오른쪽 창에 10개 파일이 최신 버전으로 있어야 함

---

## 📋 드래그 앤 드롭 방법 (Mac)

### Step-by-Step

1. **Finder 창 2개 열기**: `Cmd + N`

2. **왼쪽 창**: `다운로드/algomaker_upload_v2/` 이동
3. **오른쪽 창**: `문서/GitHub/project-blackbox/` 이동

4. **왼쪽 `frontend` 폴더를 오른쪽에 드래그**
   - `Option` 키 누른 채 드래그하면 **복사** (이동 아님)

5. **Mac에서는 보통 "병합" 옵션**이 나옴:
   - **"병합"** 클릭 (파일만 덮어쓰고 폴더 구조 유지)

6. **완료** ✅

---

## 🔍 제대로 됐는지 확인

### 확인 방법 1: 탐색기로 확인
```
문서/GitHub/project-blackbox/frontend/app/ 열기
→ platform 폴더 있음 ✅
→ metadata 폴더 있음 ✅
→ done 폴더 있음 ✅
```

### 확인 방법 2: GitHub Desktop
```
10개 파일이 "Changes" 목록에 있음 ✅
```

### 확인 방법 3: 파일 크기
각 파일 크기가 **0 바이트가 아님** 확인:
- `page.tsx` (홈): 약 40KB
- `AlgoBooster.tsx`: 약 18KB
- `platforms.ts`: 약 10KB
- 다른 파일들도 모두 수 KB~수십 KB

---

## 💡 실수 방지 팁

### ❌ 자주 하는 실수 TOP 5

1. **ZIP 파일을 직접 GitHub에 업로드**
   → 압축 풀기 필수!

2. **frontend 폴더가 아닌 상위 폴더 복사**
   → `algomaker_upload_v2/` 폴더 통째로 X
   → 그 안의 `frontend/` 폴더만 O

3. **덮어쓰기 대신 건너뛰기 선택**
   → 기존 파일이 그대로 남아서 업데이트 안 됨

4. **일부 파일만 드래그**
   → 폴더 전체를 드래그해야 함

5. **GitHub Desktop Push 안 함**
   → Commit은 했지만 Push 깜빡
   → 우측 상단 "Push origin" 클릭 필수

---

🎯 **모든 준비 끝!**

궁금한 점 있으면 즉시 물어봐주세요 🙌
