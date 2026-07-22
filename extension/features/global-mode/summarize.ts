import { CATEGORY_LABELS, type AuditIssue, type IssueCategory } from "./issueTypes"
import type { AuditSummary, CategorySummary } from "./resultStore"

interface CategoryRunningState {
  found: number
  fixed: number
  foundElements: WeakSet<HTMLElement>
  fixedElements: WeakSet<HTMLElement>
}

/**
 * Running found/fixed counts per category, deduped by element identity — a mutation-heavy SPA
 * that repeatedly removes/re-adds the same element would otherwise inflate these counts forever.
 * Element-less (document-level) issues are only ever produced by the one-time initial
 * auditDocument() call, so they're counted directly with no dedup needed.
 */
export type RunningTotals = Partial<Record<IssueCategory, CategoryRunningState>>

function emptyState(): CategoryRunningState {
  return { found: 0, fixed: 0, foundElements: new WeakSet(), fixedElements: new WeakSet() }
}

export function accumulate(totals: RunningTotals, issues: AuditIssue[], fixed: AuditIssue[]): RunningTotals {
  const fixedSet = new Set(fixed)
  const next: RunningTotals = { ...totals }

  for (const issue of issues) {
    const entry = next[issue.category] ?? emptyState()

    if (issue.element) {
      if (!entry.foundElements.has(issue.element)) {
        entry.foundElements.add(issue.element)
        entry.found += 1
      }
      if (fixedSet.has(issue) && !entry.fixedElements.has(issue.element)) {
        entry.fixedElements.add(issue.element)
        entry.fixed += 1
      }
    } else {
      entry.found += 1
      if (fixedSet.has(issue)) entry.fixed += 1
    }

    next[issue.category] = entry
  }

  return next
}

/**
 * Un-counts elements that just left the DOM (mutation.removedNodes) so a later re-add of the
 * "same" element is counted fresh instead of accumulating forever. Returns whether anything
 * actually changed, so callers can decide whether a removal-only mutation batch needs to persist.
 */
export function untrackElements(totals: RunningTotals, elements: HTMLElement[]): boolean {
  let changed = false

  for (const category of Object.keys(totals) as IssueCategory[]) {
    const entry = totals[category]
    if (!entry) continue

    for (const el of elements) {
      if (entry.foundElements.delete(el)) {
        entry.found = Math.max(0, entry.found - 1)
        changed = true
      }
      if (entry.fixedElements.delete(el)) {
        entry.fixed = Math.max(0, entry.fixed - 1)
        changed = true
      }
    }
  }

  return changed
}

export function toSummary(totals: RunningTotals): AuditSummary {
  const categories: CategorySummary[] = (Object.keys(totals) as IssueCategory[])
    .map((category) => {
      const entry = totals[category]!
      return { category, label: CATEGORY_LABELS[category], found: entry.found, fixed: entry.fixed }
    })
    .filter((c) => c.found > 0)

  const totalIssues = categories.reduce((sum, c) => sum + c.found, 0)
  const autoFixed = categories.reduce((sum, c) => sum + c.fixed, 0)

  return {
    totalIssues,
    autoFixed,
    remaining: totalIssues - autoFixed,
    categories,
    updatedAt: Date.now()
  }
}
