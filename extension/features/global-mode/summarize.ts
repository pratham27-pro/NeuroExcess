import { CATEGORY_LABELS, type AuditIssue, type IssueCategory } from "./issueTypes"
import type { AuditSummary, CategorySummary } from "./resultStore"

/** Running found/fixed counts per category, accumulated across the initial scan plus any mutation-driven rescans. */
export type RunningTotals = Partial<Record<IssueCategory, { found: number; fixed: number }>>

export function accumulate(totals: RunningTotals, issues: AuditIssue[], fixed: AuditIssue[]): RunningTotals {
  const fixedSet = new Set(fixed)
  const next: RunningTotals = { ...totals }

  for (const issue of issues) {
    const entry = next[issue.category] ?? { found: 0, fixed: 0 }
    entry.found += 1
    if (fixedSet.has(issue)) entry.fixed += 1
    next[issue.category] = entry
  }

  return next
}

export function toSummary(totals: RunningTotals): AuditSummary {
  const categories: CategorySummary[] = (Object.keys(totals) as IssueCategory[]).map((category) => {
    const entry = totals[category]!
    return { category, label: CATEGORY_LABELS[category], found: entry.found, fixed: entry.fixed }
  })

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
