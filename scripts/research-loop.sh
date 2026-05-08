#!/bin/bash
# EAR research queue runner — called hourly by launchd.
# Picks the next backlog EAR vault ticket and runs the full research pipeline.
# Resume-safe: if a ticket is already in-progress, it resumes that ticker first.
#
# Hardening (post-2026-05-08 incident):
#   - MLX inference preflight (real /chat/completions probe + self-heal)
#   - Strict ticker extraction (^Research [A-Z]{1,5}$)
#   - Completion validation gate before vault done
#   - Distinct exit-code mapping (2 = no-main-file, 3 = crash-streak)

VAULT="$HOME/dev/projects/vault/vault.sh"
TASKS_DIR="$HOME/dev/projects/vault/tasks"
PROJECT="$HOME/dev/projects/equityautoresearch"
LOG="$PROJECT/logs/research-loop.log"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

mkdir -p "$PROJECT/logs"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"
}

# Find first EAR task file with given status, sorted numerically
find_ear_task() {
  local target_status="$1"
  for f in $(ls "$TASKS_DIR"/EAR-*.md 2>/dev/null | sort -V); do
    if grep -q "^status: $target_status" "$f" 2>/dev/null; then
      echo "$f"
      return 0
    fi
  done
  return 1
}

# Extract ticker from title. Real title format: "Research <TICKER> — <description>" or
# "Research <TICKER>" or "Research <TICKER> [tag]". <TICKER> must be 1-5 uppercase letters
# followed by a delimiter (space, em-dash, paren, bracket, end). Bails on anything else,
# preventing the EAR-003 malformed-filename class of bug (titles like "Prototype: ..." that
# the old regex parsed as a ticker).
extract_ticker() {
  local title trimmed
  title=$(grep '^title:' "$1" | head -1 | sed 's/^title:[[:space:]]*//' | sed 's/[[:space:]]*$//')
  # Drop optional surrounding quotes (vault YAML sometimes wraps quote-marked titles)
  trimmed="${title#\'}"; trimmed="${trimmed%\'}"
  trimmed="${trimmed#\"}"; trimmed="${trimmed%\"}"
  # Accept: "Research TICKER" optionally followed by a delimiter (space/em-dash/paren/bracket/dash) and rest of line.
  if [[ "$trimmed" =~ ^Research[[:space:]]+([A-Z]{1,5})([[:space:]]|$|—|-|\(|\[) ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi
  echo "" # signal failure via empty stdout
  return 1
}

extract_id() {
  basename "$1" .md
}

main() {
  log "=== EAR research loop starting ==="

  # Preflight: MLX must be answering real inference requests.
  # If unhealthy after self-heal, defer this tick (next launchd interval will retry).
  if ! "$PROJECT/scripts/mlx-preflight.sh" 2>&1 | tee -a "$LOG"; then
    log "MLX unhealthy after self-heal attempt; deferring this tick"
    exit 0
  fi

  task_file=""

  # STEP 1: Resume in-progress ticket first (crash/rate-limit recovery)
  if task_file=$(find_ear_task "in-progress"); then
    log "Resuming in-progress: $(extract_id "$task_file")"
  # STEP 2: Pick next backlog ticket if idle
  elif task_file=$(find_ear_task "backlog"); then
    task_id=$(extract_id "$task_file")
    log "Picking backlog ticket: $task_id"
    "$VAULT" update "$task_id" --status in-progress
    log "Marked $task_id in-progress"
  else
    log "EAR queue empty — nothing to do"
    exit 0
  fi

  task_id=$(extract_id "$task_file")
  ticker=$(extract_ticker "$task_file")

  if [ -z "$ticker" ]; then
    title_line=$(grep '^title:' "$task_file" | head -1)
    log "ERROR: ticker extraction failed for $task_file ($title_line) — moving back to backlog"
    "$VAULT" update "$task_id" --status backlog --last-error "ticker extraction failed: title must match 'Research <TICKER>' (1-5 uppercase letters)"
    exit 1
  fi

  log "Running: $ticker ($task_id)"

  # STEP 4: Run full research pipeline
  cd "$PROJECT"
  npm run initial-max -- --ticker "$ticker" --extract-knowledge >> "$LOG" 2>&1
  rc=$?

  case $rc in
    0)
      # STEP 5: Validate completion before declaring done
      if "$PROJECT/scripts/validate-completion.sh" --ticker "$ticker" --no-rescore >> "$LOG" 2>&1; then
        "$VAULT" done "$task_id" --cycles 1
        log "Done: $ticker ($task_id) — validation passed, marked complete"
      else
        vrc=$?
        case $vrc in
          10) reason="main file missing or under 8KB" ;;
          11) reason="required sections 1.1-4.2 missing" ;;
          12) reason="structural below pass threshold" ;;
          13) reason="quality below pass threshold" ;;
          14) reason="total below pass threshold (85)" ;;
          *)  reason="validate-completion exit $vrc" ;;
        esac
        log "Completion gate FAIL for $ticker: $reason — moving back to backlog"
        "$VAULT" update "$task_id" --status backlog --last-error "completion-gate: $reason"
      fi
      ;;
    2)
      log "Runner aborted: no main file produced for $ticker — moving to backlog"
      "$VAULT" update "$task_id" --status backlog --last-error "runner exit 2: no main report file written"
      ;;
    3)
      log "Runner aborted: 3+ same-class crashes for $ticker — moving to backlog"
      "$VAULT" update "$task_id" --status backlog --last-error "runner exit 3: same-class crash streak (likely MLX/Claude CLI timeout)"
      ;;
    *)
      log "Research failed for $ticker (exit $rc) — ticket stays in-progress for next retry"
      ;;
  esac

  log "=== Iteration complete ==="
}

main
