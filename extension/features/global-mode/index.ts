import { subscribeToMutations } from "~lib/dom/mutationWatcher"
import type { GlobalModeSettings } from "~lib/settings/schema"

import { auditDocument, auditSubtree } from "./auditPage"
import { applyAutoFixes, revertAutoFixes } from "./autoFix"
import type { AuditIssue } from "./issueTypes"
import { clearAuditSummary, setAuditSummary } from "./resultStore"
import { accumulate, toSummary, type RunningTotals } from "./summarize"
import type { FeatureController } from "~features/types"

let applied = false
let totals: RunningTotals = {}
let unsubscribeMutations: (() => void) | undefined

function persist(): void {
  void setAuditSummary(location.hostname, toSummary(totals))
}

export const globalModeController: FeatureController<GlobalModeSettings> = {
  apply(_settings) {
    if (applied) return
    applied = true
    totals = {}

    const issues = auditDocument()
    const { fixed } = applyAutoFixes(issues)
    totals = accumulate(totals, issues, fixed)
    persist()

    // Re-audit and re-fix newly-added subtrees so SPA/infinite-scroll pages stay covered
    // for as long as Global Mode stays on, instead of only auditing the DOM as it was at click time.
    unsubscribeMutations = subscribeToMutations((mutations) => {
      const newIssues: AuditIssue[] = []
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          newIssues.push(...auditSubtree(node))
        })
      })
      if (newIssues.length === 0) return

      const { fixed: newlyFixed } = applyAutoFixes(newIssues)
      totals = accumulate(totals, newIssues, newlyFixed)
      persist()
    })
  },

  remove() {
    if (!applied) return
    unsubscribeMutations?.()
    unsubscribeMutations = undefined
    revertAutoFixes()
    applied = false
    totals = {}
    void clearAuditSummary(location.hostname)
  },

  isApplied() {
    return applied
  }
}

export type { AuditSummary, CategorySummary } from "./resultStore"
export { auditResultKey, auditResultStorage } from "./resultStore"
