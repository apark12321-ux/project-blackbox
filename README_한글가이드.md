# 📖 AlgoMaker 업로드 가이드 (초보자 친화 버전)

> ⚠️ **중요! ZIP 파일 자체를 GitHub에 올리지 마세요!**
> 
> ZIP 파일을 **반드시 먼저 압축을 풀고**, 그 안의 `frontend` 폴더를 사용해야 해요.

---

## 🎯 이거 하나만 기억하세요

**"ZIP은 압축 상태. 풀어서 안의 폴더를 써야 함!"**

```
❌ 잘못된 방법: algomaker_upload_v2.zip 을 GitHub에 통째로 업로드
✅ 올바른 방법: ZIP 압축 풀기 → 안의 frontend 폴더 내용 사용
```

---

## 🚀 3가지 업로드 방법 (쉬운 순)

### 🥇 방법 1: GitHub Desktop (가장 쉬움, 추천)

---

**Step 1: ZIP 파일 다운로드 & 압축 풀기**

1. `algomaker_upload_v2.zip` 다운로드
2. 다운로드 폴더에서 **우클릭** → **"압축 풀기"** 또는 **"모두 압축 풀기"**
3. 확인창에서 **"압축 풀기"** 클릭
4. `algomaker_upload_v2` 폴더가 생성됨
5. 폴더 열면 → `frontend/` 폴더가 있음 ✅

---

**Step 2: 윈도우 탐색기로 파일 복사**

1. **탐색기 창 2개 열기** (나란히 배치)

   **왼쪽 창**: 압축 푼 폴더
   ```
   algomaker_upload_v2/
     └─ frontend/          ← 이 frontend 폴더 선택
         └─ app/
             ├─ page.tsx
             ├─ _shared/
             ├─ keyword/
             ├─ platform/
             ├─ metadata/
             ├─ done/
             ├─ blog/
             └─ knowhow/
   ```

   **오른쪽 창**: 로컬 GitHub 폴더
   ```
   문서/
     └─ GitHub/
         └─ project-blackbox/
             └─ frontend/    ← 여기에 덮어쓸 예정
   ```

2. **왼쪽 `frontend` 폴더를 오른쪽 `project-blackbox/` 폴더 안으로 드래그**

3. "이미 있는 파일을 덮어쓰시겠습니까?" 창이 뜨면:
   - **"파일 바꾸기"** 클릭 (또는 "예" / "Replace files")

4. **신규 폴더 3개가 자동 생성**됨:
   - `platform/` 🆕
   - `metadata/` 🆕
   - `done/` 🆕

---

**Step 3: GitHub Desktop에서 업로드**

1. **GitHub Desktop 앱 열기**

2. 왼쪽 패널에 **변경된 파일 목록**이 나타남:
   ```
   ✏️ frontend/app/page.tsx (수정됨)
   ➕ frontend/app/_shared/AlgoBooster.tsx (신규)
   ➕ frontend/app/_shared/platforms.ts (신규)
   ✏️ frontend/app/_shared/V11Shell.tsx (수정됨)
   ✏️ frontend/app/keyword/page.tsx (수정됨)
   ➕ frontend/app/platform/page.tsx (신규)
   ➕ frontend/app/metadata/page.tsx (신규)
   ➕ frontend/app/done/page.tsx (신규)
   ✏️ frontend/app/blog/page.tsx (수정됨)
   ✏️ frontend/app/knowhow/first-30-seconds-hook/page.tsx (수정됨)
   ```
   → **10개 파일**이 모두 체크되어 있어야 함

3. **화면 하단에 커밋 메시지 입력**:

   **요약(Summary)** 칸:
   ```
   feat: 전체 대개조 - 카테고리/SNS/메타데이터/Algo부스터
   ```

   **설명(Description)** 칸 (선택):
   ```
   - Algo-Magic Booster 빈티지 레버 구현
   - 카테고리 8개 선택 (신규 홈)
   - SNS 플랫폼 4개 선택 페이지 (신규)
   - 메타데이터 항목 자동 표시 (신규)
   - 결과 페이지 + 레버 통합 (신규)
   - 블로그 보호 톤 변환
   ```

4. **"Commit to main"** 버튼 클릭 (파란 버튼)

5. 우측 상단 **"Push origin"** 버튼 클릭 (화살표 아이콘)

6. 완료! 🎉

---

### 🥈 방법 2: GitHub 웹 (Desktop 없을 때)

**Step 1: ZIP 압축 풀기** (방법 1과 동일)

**Step 2: 각 파일 GitHub 웹에서 업로드**

⚠️ **10개 파일을 하나씩** 업로드해야 해서 시간이 더 걸려요 (약 15분)

자세한 방법은 `README_개별업로드.md` 파일 참고

---

### 🥉 방법 3: 절대 하지 말 것 ⛔

```
❌ ZIP 파일을 그대로 GitHub에 업로드 (Vercel 빌드 실패)
❌ 압축을 풀지 않고 사용 (파일 내용 못 읽음)
❌ frontend 폴더가 아닌 상위 폴더 올리기 (경로 꼬임)
```

---

## 🧪 배포 확인 (3분 후)

### Vercel 자동 배포
- GitHub Push 후 Vercel이 **자동으로 빌드**
- 성공하면 녹색 체크 ✅
- 실패하면 빨간 X ❌

### Vercel 상태 확인
👉 https://vercel.com 로그인 → project-blackbox-cpqy → Deployments

- 녹색 **"Ready"**: 성공! 
- 빨간 **"Error"**: 실패 → 아래 FAQ 참고

### 사이트에서 확인
```
Ctrl + Shift + N (시크릿창 열기)
→ https://nutube.kr 접속
→ Ctrl + Shift + R (강력 새로고침)
```

---

## ✅ 테스트 체크리스트

배포 완료 후 하나씩 확인:

### 🏠 홈 페이지 (nutube.kr)
- [ ] 8개 카테고리 카드가 나타남
- [ ] "경제·재테크", "건강·의료", "IT·테크" 등 표시
- [ ] 각 카드에 설명·예시·평균조회수 있음
- [ ] 🔥 인기 배지 3개 (경제/건강/IT)

### 📝 카테고리 클릭 → 키워드 입력 페이지
- [ ] 선택한 카테고리 칩 표시 (예: 📊 경제·재테크)
- [ ] 카테고리별 인기 키워드 4개 나옴
- [ ] "블루오션", "경쟁 낮음" 같은 레벨 표시

### 🎯 키워드 입력 → 시나리오 3개
- [ ] ⭐ 최고 추천 배지 (1안)
- [ ] 유지율 % 표시
- [ ] "이 스타일로" 버튼

### 📱 시나리오 선택 → 플랫폼 선택 페이지 (신규!)
- [ ] YouTube 롱폼, YouTube Shorts, TikTok, Instagram Reels 4개
- [ ] 각 카드에 길이/화면/수익/타겟 표시
- [ ] 복수 선택 가능 (체크박스)
- [ ] "💡 이런 영상이에요" 예시
- [ ] "✨ 유리한 점" 3가지

### 📋 플랫폼 선택 → 메타데이터 페이지 (신규!)
- [ ] 프로젝트 요약 3단 박스
- [ ] 각 플랫폼별 업로드 자료 항목
- [ ] 각 항목에 "뭔가요?/예시/어떻게?" 3줄 설명

### ✨ "AI 자동 생성" → 결과 페이지 (신규!)
- [ ] 영상 미리보기 박스
- [ ] 💡 노란 안내 배너
- [ ] **⚡ ALGO-MAGIC BOOSTER 레버!** 등장

### 🎩 레버 클릭 (핵심!)
- [ ] 찰칵 소리 (Web Audio API)
- [ ] 황금 파티클 12개 폭발
- [ ] 진행 메시지 4단계 순차 표시
- [ ] B+ → A++ 수치 변화
- [ ] 제목이 매력적으로 교체
- [ ] 띠링~ 완료 소리
- [ ] 녹색 상태등 점등
- [ ] 다운로드 버튼 활성화

### 📚 블로그 페이지
- [ ] 제목: "영상 제작이 왜 어려운지, AlgoMaker가 어떻게 해결"
- [ ] 12개 카드 모두 "문제 제기" 톤
- [ ] 각 글 미리보기 확인

### 🦶 Footer (모든 페이지)
- [ ] ⚠️ 법적 고지 박스 (노란 포인트)
- [ ] AlgoMaker 로고
- [ ] 운영: 한줄컴퍼니

---

## 🆘 FAQ (자주 묻는 문제)

### Q1. "압축을 풀라는 게 무슨 뜻인가요?"
```
A: ZIP 파일은 여러 파일을 하나로 묶어놓은 것이에요.
   우클릭 → "압축 풀기"를 하면 원래 파일/폴더가 나타나요.
   이 원래 파일들을 써야 합니다.
```

### Q2. "GitHub Desktop에 변경사항이 안 보여요"
```
A: 파일을 잘못된 위치에 복사했을 수 있어요.
   확인 방법:
   1. GitHub Desktop 상단 "Current repository: project-blackbox"
   2. File → Options → Git → 저장소 경로 확인
   3. 로컬 폴더 경로가 맞는지 확인
```

### Q3. "Vercel 빌드가 실패해요"
```
A: 가장 흔한 원인:
   1. ZIP 파일을 그대로 올림 → ZIP 삭제 후 재시도
   2. 파일 경로가 틀림 → frontend/app/... 구조 확인
   3. 신규 폴더가 안 만들어짐 → platform, metadata, done 폴더 확인
```

### Q4. "ZIP 파일이 이미 올라가 있어요"
```
A: 삭제 방법:
   1. GitHub 웹에서 ZIP 파일 클릭
   2. 우측 상단 🗑️ 휴지통 아이콘
   3. Commit changes
   
   또는 GitHub Desktop:
   1. 로컬 폴더에서 ZIP 파일 삭제
   2. Commit & Push
```

### Q5. "10개 파일이 아니라 다른 개수가 나와요"
```
A: 정상일 수도 있어요. 확인:
   - 10개보다 많음 → 다른 변경사항도 포함된 것 (괜찮음)
   - 10개보다 적음 → 빠진 파일 확인 필요
   
   필수 10개:
   1. page.tsx (홈)
   2. _shared/V11Shell.tsx
   3. _shared/AlgoBooster.tsx
   4. _shared/platforms.ts
   5. keyword/page.tsx
   6. platform/page.tsx
   7. metadata/page.tsx
   8. done/page.tsx
   9. blog/page.tsx
   10. knowhow/first-30-seconds-hook/page.tsx
```

---

## 🎬 작업 흐름 요약

```
[다운로드] algomaker_upload_v2.zip
     ↓
[우클릭] "압축 풀기"
     ↓
[탐색기] algomaker_upload_v2 폴더 열기
     ↓
[탐색기 2개] 나란히 열기
  왼쪽: 압축 푼 frontend/
  오른쪽: 로컬 project-blackbox/
     ↓
[드래그 앤 드롭] frontend 폴더 전체
     ↓
[덮어쓰기] "파일 바꾸기" 클릭
     ↓
[GitHub Desktop] 앱 열기
     ↓
[변경 확인] 10개 파일 체크됨
     ↓
[커밋 메시지] "feat: 전체 대개조..."
     ↓
[Commit to main] 클릭
     ↓
[Push origin] 클릭
     ↓
[2~3분 대기] Vercel 자동 배포
     ↓
[시크릿창] nutube.kr 접속 확인
     ↓
[🎩 레버 클릭!] 완성! 🎉
```

---

## 💡 마지막 팁

### ✅ 확실히 하려면
- **로컬 파일 먼저 백업** (문제 생기면 복구)
- **GitHub Desktop에서 History 탭** 확인 (이전 커밋으로 되돌리기 가능)
- **Vercel에서 이전 배포로 롤백** 가능 (문제 생기면)

### 🚨 문제 생기면
1. Vercel 빌드 에러 → 에러 메시지 복사해서 Claude에게 공유
2. GitHub 푸시 실패 → GitHub Desktop에서 "Pull origin" 후 재시도
3. 페이지가 안 열림 → 5분 기다렸다가 시크릿창으로 재접속

---

## 📞 문제 발생 시

**Claude에게 문의할 때 포함할 정보**:
1. 어느 단계에서 막혔는지
2. 에러 메시지 (있으면 스크린샷)
3. 현재 상황 설명

바로 도와드릴게요! 🙌

---

🎯 **이제 시작!**

ZIP을 먼저 **반드시 압축 풀고**, 그 안의 `frontend` 폴더를 로컬 GitHub 폴더에 덮어쓰기만 하면 끝이에요.

**압축 풀기만 안 하면 전부 잘 됩니다!** 🚀
