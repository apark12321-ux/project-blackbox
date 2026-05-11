# 🎯 AlgoMaker 2026년 4월 업데이트 (v2)

## ✅ 박예준 확정 요구사항 반영

### 1️⃣ AI 이미지/영상 툴 리스트 그대로 반영
- ✅ 이미지 10개 (무료 7 + 유료 3)
- ✅ 영상 10개 (무료 7 + 유료 3)

### 2️⃣ 경쟁분석 광고 방식 확정
- ❌ 24시간 무제한 (이전 버전)
- ✅ **광고 시청 → 1회 사용** (여러번 선택 가능)
- ✅ AdSense 친화적 (광고 노출 극대화)

---

## 🎬 경쟁분석 작동 흐름

```
[경쟁분석] 버튼 클릭
     ↓
광고 시청 모달 팝업
     ↓
"광고 시청 후 1회 사용 가능" 안내
     ↓
[🎬 광고 보고 이용하기] 클릭
     ↓
30초 광고 재생 (AdSense)
     ↓
"🎉 시청 완료! 1회 사용권 지급됨"
     ↓
[✨ 바로 사용하기] 클릭
     ↓
경쟁분석 기능 1회 실행!
     ↓
다시 쓰려면 → 광고 다시 시청 (무제한 재사용)
```

---

## 📦 업로드 파일 2개

```
frontend/app/_shared/
├── promptGenerator.ts   ⭐ 이미지/영상 툴 10개씩
└── AdGate.tsx           🆕 광고 시청 모달 v2 (1회 사용)
```

---

## 🚀 업로드 방법

### 🥇 방법 A: GitHub 웹 (가장 빠름, 추천!)

#### 1️⃣ promptGenerator.ts 수정
**[👉 편집 링크 클릭](https://github.com/apark12321-ux/project-blackbox/edit/main/frontend/app/_shared/promptGenerator.ts)**

1. 링크 클릭 (GitHub 로그인 필요)
2. **Ctrl + A → Delete** (기존 내용 전체 삭제)
3. `promptGenerator.ts` 파일 내용 복붙
4. 페이지 하단 **"Commit changes"** 클릭

#### 2️⃣ AdGate.tsx 신규 업로드
**[👉 업로드 링크 클릭](https://github.com/apark12321-ux/project-blackbox/upload/main/frontend/app/_shared)**

1. 링크 클릭
2. `AdGate.tsx` 파일 드래그 앤 드롭
3. **"Commit changes"** 클릭

### 🥈 방법 B: ZIP 다운로드

1. `algomaker_tools_update.zip` 다운로드
2. 압축 풀기
3. `frontend` 폴더 드래그 → 로컬 GitHub 폴더 덮어쓰기
4. GitHub Desktop → Commit → Push

---

## 🧩 AdGate 사용 예시

### 경쟁분석 버튼에 통합

```tsx
'use client';
import { useState } from 'react';
import AdGateModal, { getFeatureUsageCount } from '@/app/_shared/AdGate';

export default function CompetitorAnalysisButton() {
  const [showAdGate, setShowAdGate] = useState(false);

  // 버튼 클릭 핸들러
  const handleClick = () => {
    // 매번 광고 모달 열기 (1회 사용 방식)
    setShowAdGate(true);
  };

  // 광고 시청 완료 후 실제 기능 실행
  const runAnalysis = () => {
    // 여기서 실제 경쟁분석 로직 실행
    console.log('경쟁분석 실행!');
    // API 호출 등...
  };

  const usageCount = getFeatureUsageCount('competitor-analysis');

  return (
    <>
      <button onClick={handleClick}>
        📊 경쟁분석 시작
        {usageCount > 0 && (
          <span className="badge">{usageCount}회 이용</span>
        )}
      </button>

      <AdGateModal
        feature="competitor-analysis"
        isOpen={showAdGate}
        onClose={() => setShowAdGate(false)}
        onUnlock={runAnalysis}  // 광고 시청 완료 시 호출됨
      />
    </>
  );
}
```

### 지원 기능 타입

```typescript
type AdGatedFeature = 
  | 'competitor-analysis'    // 경쟁 채널 분석
  | 'trending-research'      // 트렌드 심층 조사  
  | 'deep-seo-analysis'      // 딥 SEO 분석
  | 'thumbnail-ab-test';     // 썸네일 A/B 테스트
```

나중에 기능 추가하려면 AdGate.tsx의 타입 정의에 추가!

---

## 🎨 UI 플로우 3단계

### Step 1: 광고 시청 안내
```
📊
경쟁 채널 분석
광고 시청 후 1회 사용 가능합니다
🎯 이번 세션에서 2회 이용함 (표시)

✓ 30초 광고 시청
✓ 즉시 1회 사용 가능
✓ 무제한 재이용 (광고만 다시 시청)
✓ 결제 불필요 · 로그인 불필요

[나중에]  [🎬 광고 보고 이용하기]
```

### Step 2: 광고 시청 중
```
광고 시청 중...
광고가 끝나면 바로 이용 가능합니다

━━━━━━━━━━━━━━━
SPONSORED AD

    30초

광고가 시작됩니다...

[━━━━━━━━━━] (진행 바)
━━━━━━━━━━━━━━━
```

### Step 3: 완료
```
🎉
시청 완료!

경쟁 채널 분석 1회 사용권이
지급되었습니다

💡 다시 이용하려면 광고를 한번 더 시청하면 됩니다

[✨ 바로 사용하기]
```

---

## 💰 AdSense 수익 구조

### 사용자가 경쟁분석 3회 사용 시
```
1회차: 광고 시청 ($0.01~0.05 수익) → 기능 1회 사용
2회차: 광고 다시 시청 ($0.01~0.05 수익) → 기능 1회 사용
3회차: 광고 다시 시청 ($0.01~0.05 수익) → 기능 1회 사용

= 총 $0.03~0.15 광고 수익
```

### 24시간 무제한 대비
- ❌ 24시간 무제한: 하루 1번만 광고 노출
- ✅ 1회 사용: **사용할 때마다 광고 노출** (3~10배 수익)

---

## ✅ 장점 요약

### 사용자
- 🎁 결제/로그인 없이 고급 기능 이용
- 🔄 원할 때마다 재사용 가능
- 🚫 복잡한 구독 없음

### AlgoMaker
- 💰 AdSense 수익 극대화 (사용 횟수만큼 광고 노출)
- 📈 사용자 체류시간 증가
- 🎯 프리미엄 기능 가치 유지

### 운영
- 🏢 사업자 등록 불필요
- 💳 결제 시스템 구축 불필요
- 📊 세금 신고 이슈 없음

---

## 🧪 배포 후 테스트

1. [ ] Vercel 🟢 Ready 확인
2. [ ] 경쟁분석 버튼 클릭 → 모달 뜸
3. [ ] [광고 보고 이용하기] 클릭 → 30초 카운트다운
4. [ ] 30초 후 "시청 완료!" 화면
5. [ ] [바로 사용하기] 클릭 → 경쟁분석 1회 실행
6. [ ] 다시 경쟁분석 버튼 클릭 → 또 모달 뜸 (1회 사용 후 재시청 필요)
7. [ ] 배지에 "2회 이용함" 표시 확인

---

## 🎯 다음 단계

업로드 완료 후 선택 가능한 작업:
1. **경쟁분석 기능 실제 페이지에 연동** (버튼 + API)
2. **다른 기능에도 AdGate 적용** (trending-research 등)
3. **SEO 정적 HTML 다시 시도** (view-source 노출)
4. **nutube.kr 도메인 연결**
5. **블로그 11개 양산**
