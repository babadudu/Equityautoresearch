/**
 * Rubric Version Control — hash rubric prompts to track scoring consistency.
 * When rubric text changes, the version hash changes, flagging cross-run comparability issues.
 */
import { createHash } from 'crypto';

/** Compute sha256 of rubric prompt text */
export function hashRubric(promptText: string): string {
  return createHash('sha256').update(promptText, 'utf-8').digest('hex').slice(0, 12);
}

/** Compute a combined version hash from multiple dimension prompts */
export function hashRubricSet(prompts: Record<string, string>): string {
  const combined = Object.entries(prompts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('\n---\n');
  return hashRubric(combined);
}
