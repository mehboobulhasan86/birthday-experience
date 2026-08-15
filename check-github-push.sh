#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/birthday-experience
printf 'local=%s\n' "$(git rev-parse HEAD)"
printf 'github_remote_tracking=%s\n' "$(git rev-parse github/main 2>/dev/null || true)"
printf 'common_ancestor=%s\n' "$(git merge-base HEAD github/main 2>/dev/null || true)"
printf 'changed_files_since_github=\n'
git diff --name-only github/main..HEAD 2>/dev/null || true
