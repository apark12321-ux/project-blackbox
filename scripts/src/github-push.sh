#!/bin/bash
# GitHub Push Script — NuTube (project-blackbox)
# Usage: bash scripts/src/github-push.sh "커밋 메시지"

set -e

MSG="${1:-"Update from Replit"}"

echo "=== GitHub Push: $MSG ==="

# Check token
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN 환경변수가 설정되지 않았습니다."
  echo "   환경변수에 GITHUB_TOKEN을 추가해주세요."
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"

# Configure git (if not already set)
git config user.email "nutube-dev@replit.com" 2>/dev/null || true
git config user.name "NuTube Dev" 2>/dev/null || true

# Set remote with token
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/apark12321-ux/project-blackbox.git" 2>/dev/null || \
  git remote add origin "https://${GITHUB_TOKEN}@github.com/apark12321-ux/project-blackbox.git"

# Stage all changes
git add -A

# Commit
git commit -m "$MSG" || echo "변경사항 없음"

# Push
git push origin main

echo ""
echo "✅ GitHub push 완료!"
echo "   → Vercel이 자동으로 nutube.kr을 재배포합니다."
echo "   → Railway 백엔드는 infra/ 폴더 변경 시 자동 재배포됩니다."
