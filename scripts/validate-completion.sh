#!/usr/bin/env bash
# Thin wrapper around src/validate-completion.ts so research-loop.sh can shell out.
# Forwards all args; preserves the structured exit codes (10..14, 20).
set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"
exec npx --prefix "$REPO" tsx "$REPO/src/validate-completion.ts" "$@"
