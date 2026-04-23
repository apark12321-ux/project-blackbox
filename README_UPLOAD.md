# 🚀 GitHub Desktop 업로드 가이드

> 박예준 대표님을 위한 **원클릭 배포** 패키지
>
> ZIP 파일 압축 풀고 → 로컬 폴더에 덮어쓰기 → Commit → Push

---

## 📦 ZIP 파일 내용 (10개 파일)

```
frontend/
└── app/
    ├── page.tsx                          ← 홈 (덮어쓰기)
    ├── _shared/
    │   ├── V11Shell.tsx                  ← 덮어쓰기
    │   ├── AlgoBooster.tsx               ← 신규
    │   └── platforms.ts                  ← 신규
    ├── keyword/
    │   └── page.tsx                      ← 덮어쓰기
    ├── platform/
    │   └── page.tsx                      ← 신규 폴더!
    ├── metadata/
    │   └── page.tsx                      ← 신규 폴더!
    ├── done/
    │   └── page.tsx                      ← 신규 폴더!
    ├── blog/
    │   └── page.tsx                      ← 덮어쓰기
    └── knowhow/
        └── first-30-seconds-hook/
            └── page.tsx                  ← 덮어쓰기
```

---

## 🎯 3단계로 완료 (총 5분)

### Step 1: ZIP 다운로드 & 압축 풀기

1. **`algomaker_upload.zip`** 파일 다운로드
2. 다운로드 폴더에서 우클릭 → "압축 풀기"
3. `algomaker_upload` 폴더 생성됨
4. 폴더 안에 `frontend/` 폴더가 있음

### Step 2: 로컬 GitHub 폴더에 덮어쓰기

1. 윈도우 탐색기 열기
2. 다음 2개 창을 **나란히 열기**:
   - 왼쪽: `algomaker_upload/frontend/app/`
   - 오른쪽: `문서/GitHub/project-blackbox/frontend/app/`

3. **왼쪽의 모든 파일/폴더를 오른쪽으로 드래그**
4. "덮어쓰시겠습니까?" 창이 뜨면 → **"파일 바꾸기"**
5. 신규 폴더 (platform, metadata, done)은 자동 생성됨

### Step 3: GitHub Desktop에서 Commit & Push

1. GitHub Desktop 열기
2. 왼쪽에 **10개 변경된 파일** 표시됨
3. 아래쪽 Commit 메시지 입력:
   ```
   feat: 전체 대개조 - 카테고리/SNS/메타데이터/레버 추가
   
   - Algo-Magic Booster 빈티지 레버 구현
   - 카테고리 8개 선택 페이지 (홈)
   - SNS 플랫폼 4개 선택 페이지 (신규)
   - 메타데이터 항목 표시 페이지 (신규)
   - 결과 페이지 + 레버 통합 (신규)
   - 블로그 노하우 보호 톤 변환
   ```
4. **"Commit to main"** 클릭
5. 오른쪽 상단 **"Push origin"** 클릭

---

## ⏰ 배포 확인 (2~3분 후)

### 자동 배포 (Vercel)
- Push 후 Vercel이 자동으로 배포 시작
- 2~3분 기다림

### 테스트 (시크릿 창)
```
Ctrl + Shift + N (시크릿창 열기)
→ https://nutube.kr 접속
→ Ctrl + Shift + R (강력 새로고침)
```

### 확인 체크리스트
- [ ] 홈: 8개 카테고리 카드 표시
- [ ] 카테고리 클릭 → 키워드 페이지로 이동
- [ ] 키워드 입력 → 시나리오 3개 표시
- [ ] 시나리오 선택 → 플랫폼 페이지 (SNS 4개)
- [ ] 플랫폼 복수 선택 가능
- [ ] 메타데이터 페이지 → 각 항목 설명
- [ ] "AI 자동 생성" → 결과 페이지 (/done)
- [ ] **🎯 Algo-Magic Booster 레버 등장!**
- [ ] 레버 클릭 → 찰칵! + 파티클 + 수치 변화
- [ ] 다운로드 버튼 활성화
- [ ] 블로그: "왜 어려운지" 보호 톤
- [ ] Footer: ⚠️ 법적 고지 박스

---

## 🆘 문제 발생 시

### Q1: 압축 풀기 에러
- **윈도우**: 파일명이 너무 길다는 에러 시 → 짧은 경로에 압축 풀기 (예: `C:\temp\`)
- **맥**: 이중 압축된 경우 → 한 번 더 풀기

### Q2: GitHub Desktop에 변경사항이 안 보임
- 좌측 상단 **"Fetch origin"** 또는 **"Current branch: main"** 클릭
- 로컬 폴더 경로 확인 (File → Options → Git)

### Q3: 파일이 많이 바뀐 것 같은데?
- 정상! 10개 파일 + 새 폴더 3개 추가됨
- 모두 체크된 상태로 Commit

### Q4: Vercel 빌드 실패
- Vercel 대시보드 → Deployments → 최근 것 클릭
- 빨간 에러 메시지 확인
- `import` 경로 오류인 경우 → 파일 위치 재확인

### Q5: `/done` 페이지가 안 떠요
- `frontend/app/done/page.tsx` 파일 위치 확인
- GitHub에 실제로 푸시됐는지 Repository에서 확인

---

## 🎬 완성 후 체험

### 사용자 경험 흐름
```
1. nutube.kr 접속
2. 📊 "경제·재테크" 카테고리 클릭
3. 🔍 "2026 금리 전망" 키워드 선택
4. 🎯 "해법 찾기" 시나리오 선택 (최고 추천)
5. 📱 "YouTube 롱폼" + "YouTube Shorts" 선택
6. 📝 업로드 자료 항목들 확인
7. ✨ "AI 자동 생성" 클릭
8. 🎬 영상 완성 페이지 도착
9. ⚡ ALGO-MAGIC BOOSTER 레버 등장!
10. 🎩 레버 딸깍!
    - 찰칵 소리
    - 황금 파티클 12개 폭발
    - B+ → A++ 카운트업
    - 제목이 매력적으로 교체
    - 띠링~ 완료 소리
11. 🎉 다운로드 버튼 활성화
```

이 여정을 **직접 체험**하시면 됩니다! 🚀

---

## 📋 압축 푸는 위치 가이드 (운영체제별)

### Windows
```
1. 다운로드 폴더에서 algomaker_upload.zip 우클릭
2. "모두 압축 풀기..." 선택
3. 추출 위치를 바탕화면 등 접근 쉬운 곳 선택
4. "압축 풀기" 클릭
```

### Mac
```
1. 다운로드 폴더에서 algomaker_upload.zip 더블클릭
2. 자동으로 같은 위치에 폴더 생성됨
```

---

## 💡 추가 팁

### GitHub Desktop 처음 쓰시면
1. 변경사항 리스트에서 **녹색 +** 표시: 새 파일
2. **주황색 수정** 표시: 덮어쓰기된 파일
3. 각 파일 클릭하면 변경 내용 미리보기 가능

### 실수로 잘못 덮어쓴 경우
- GitHub Desktop에서 우클릭 → "Discard changes"
- 원본 파일로 복구됨

### 더 안전하게 하고 싶다면
- Push 전에 **브랜치 생성**: "Current branch" → "New branch"
- 테스트 완료 후 main에 merge

---

🎯 **GitHub Desktop + 드래그 앤 드롭으로 5분이면 끝!**

압축 풀고 → 드래그 → Commit → Push, 이게 전부예요.

막히는 부분 있으면 바로 알려주세요! 🙌
