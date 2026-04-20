# 📦 프론트엔드 package.json 수정 필요

로그인 기능이 작동하려면 **`@supabase/supabase-js`** 패키지를 추가해야 합니다.

## 방법 1 · GitHub 웹에서 직접 수정 (추천)

1. https://github.com/apark12321-ux/project-blackbox/blob/main/frontend/package.json 접속

2. 오른쪽 상단 **연필 아이콘** (Edit this file) 클릭

3. `"dependencies": {` 안에 한 줄 추가:

   기존:
   ```json
   "dependencies": {
     "next": "...",
     "react": "...",
     ...
   }
   ```

   수정:
   ```json
   "dependencies": {
     "@supabase/supabase-js": "^2.46.1",
     "next": "...",
     "react": "...",
     ...
   }
   ```

   ⚠️ 주의: 맨 위에 추가하고 뒤에 **쉼표(`,`)** 꼭 찍기

4. 하단 **Commit changes** 버튼 클릭

5. Vercel이 자동으로 감지해서 `npm install @supabase/supabase-js` 실행

## 방법 2 · 로컬에서 수정

1. 윈도우 탐색기 → `문서/GitHub/project-blackbox/frontend/package.json` 열기 (메모장으로)

2. `"dependencies":` 섹션 안에 추가:
   ```
   "@supabase/supabase-js": "^2.46.1",
   ```

3. 저장

4. GitHub Desktop → Commit → Push
