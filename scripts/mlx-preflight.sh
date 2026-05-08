#!/usr/bin/env bash
# MLX inference-probe + self-heal preflight.
#
# Why: a 200 from /v1/models is not enough — on 2026-05-08 the MLX server returned
# /v1/models fast but /v1/chat/completions hung indefinitely (CPU at 50%+, no replies).
# That state caused 9/11 V-runner rounds to crash with "MLX failed (fetch failed)" →
# fall through to claude -p which then timed out at the 10-min hard limit.
#
# Behavior:
#   1. Read LOCAL_BASE_URL from supervisor-config.json (or env override).
#   2. POST a 5-token prompt to /chat/completions with an 8s timeout.
#   3. On 2xx with a "choices" key → exit 0 (healthy).
#   4. Otherwise: identify the listening pid, verify it's mlx_lm.server,
#      SIGTERM (then SIGKILL after 5s if still alive), let launchctl KeepAlive
#      respawn it, then re-probe every 3s for up to 90s.
#   5. Exit 0 if probe eventually passes; exit 1 if still wedged.
#
# The script is idempotent and safe to call before every research-loop tick.
set -u
SUPERVISOR_CFG="${SUPERVISOR_CONFIG:-$HOME/dev/projects/automation/supervisor-config.json}"

# Resolve base URL — env > supervisor config > hardcoded fallback (matches src/config.ts:13-23)
if [ -n "${LOCAL_BASE_URL:-}" ]; then
  BASE_URL="$LOCAL_BASE_URL"
elif [ -r "$SUPERVISOR_CFG" ] && command -v jq >/dev/null 2>&1; then
  BASE_URL="$(jq -r '.profiles[.active_profile].base_url // empty' "$SUPERVISOR_CFG" 2>/dev/null || true)"
fi
BASE_URL="${BASE_URL:-http://127.0.0.1:8080/v1}"

# Resolve the model the same way (the API requires a model name)
if [ -n "${LOCAL_MODEL:-}" ]; then
  MODEL="$LOCAL_MODEL"
elif [ -r "$SUPERVISOR_CFG" ] && command -v jq >/dev/null 2>&1; then
  MODEL="$(jq -r '.profiles[.active_profile].model // empty' "$SUPERVISOR_CFG" 2>/dev/null || true)"
fi
MODEL="${MODEL:-majentik/Qwen3.6-35B-A3B-RotorQuant-MLX-4bit}"

# Extract host:port from BASE_URL (strip protocol + path)
HOSTPORT="${BASE_URL#*://}"
HOSTPORT="${HOSTPORT%%/*}"
PORT="${HOSTPORT##*:}"
[ -z "$PORT" ] && PORT=8080

LAUNCHCTL_LABEL="${MLX_LAUNCHCTL_LABEL:-com.mlx.qwen36-server}"
PROBE_TIMEOUT="${MLX_PROBE_TIMEOUT_SEC:-8}"
RESPAWN_WAIT_SEC="${MLX_RESPAWN_WAIT_SEC:-90}"

probe() {
  # POST a 5-token prompt; require HTTP 2xx + body to contain "choices".
  # `think:false` matches our learnings note for qwen3.6 hybrid-thinking models.
  local body
  body=$(curl -sS -m "$PROBE_TIMEOUT" -X POST "$BASE_URL/chat/completions" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"$MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}],\"max_tokens\":5,\"temperature\":0,\"think\":false}" 2>&1) || return 1
  echo "$body" | grep -q '"choices"' || return 1
  return 0
}

echo "[mlx-preflight] probing $BASE_URL/chat/completions (timeout ${PROBE_TIMEOUT}s)"
if probe; then
  echo "[mlx-preflight] healthy"
  exit 0
fi

echo "[mlx-preflight] inference probe failed — attempting self-heal"

# Identify pid listening on the configured port
PID="$(lsof -ti:"$PORT" 2>/dev/null | head -1 || true)"
if [ -n "$PID" ]; then
  CMD="$(ps -p "$PID" -o command= 2>/dev/null || true)"
  if echo "$CMD" | grep -q 'mlx_lm.server'; then
    echo "[mlx-preflight] killing wedged mlx_lm.server pid=$PID"
    kill -TERM "$PID" 2>/dev/null || true
    sleep 5
    if kill -0 "$PID" 2>/dev/null; then
      echo "[mlx-preflight] still alive after TERM — sending KILL"
      kill -KILL "$PID" 2>/dev/null || true
    fi
  else
    echo "[mlx-preflight] pid=$PID on :$PORT is NOT mlx_lm.server (cmd=$CMD); refusing to kill"
    # Don't kick launchctl either — something else owns the port.
    exit 1
  fi
else
  echo "[mlx-preflight] no listener on :$PORT"
fi

# Best-effort restart via launchctl agent (KeepAlive will also respawn on its own).
if launchctl print "gui/$UID/$LAUNCHCTL_LABEL" >/dev/null 2>&1; then
  echo "[mlx-preflight] kickstarting launchctl agent $LAUNCHCTL_LABEL"
  launchctl kickstart -k "gui/$UID/$LAUNCHCTL_LABEL" 2>/dev/null || true
else
  echo "[mlx-preflight] launchctl agent $LAUNCHCTL_LABEL not loaded; relying on KeepAlive"
fi

# Wait for respawn + readiness
DEADLINE=$(( $(date +%s) + RESPAWN_WAIT_SEC ))
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  sleep 3
  if probe; then
    NEWPID="$(lsof -ti:"$PORT" 2>/dev/null | head -1 || true)"
    echo "[mlx-preflight] healthy after respawn (pid=$NEWPID)"
    exit 0
  fi
done

echo "[mlx-preflight] still wedged after ${RESPAWN_WAIT_SEC}s — giving up"
exit 1
