#!/bin/bash

set -e

UPGRADABLE=$(npm-check-updates --jsonUpgraded)

if [[ "$UPGRADABLE" == "{}" ]]; then
  echo "✅ No packages to update."
  exit 0
fi

echo "📦 Packages to upgrade:"
echo "$UPGRADABLE" | jq

echo "$UPGRADABLE" | jq -r 'keys[]' | while read -r PACKAGE; do
  BRANCH="ncu/update-$PACKAGE"
  echo "🚀 Updating $PACKAGE on branch $BRANCH..."

  git checkout -b "$BRANCH"

  ncu "/^$PACKAGE$/" -u

  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"

  git add package.json package-lock.json
  git commit -m "chore: upgrade $PACKAGE via ncu"

  git push origin "$BRANCH"

  gh pr create \
    --title "chore: upgrade $PACKAGE" \
    --body "This PR upgrades \`$PACKAGE\` using [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)." \
    --base main \
    --head "$BRANCH"

  git checkout main
  git reset --hard origin/main
done