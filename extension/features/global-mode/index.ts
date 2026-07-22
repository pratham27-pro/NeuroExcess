import { subscribeToMutations } from "~lib/dom/mutationWatcher"
import type { GlobalModeSettings } from "~lib/settings/schema"

import { auditDocument, auditSubtree } from "./auditPage"
import { applyAutoFixes, revertAutoFixes } from "./autoFix"
import type { AuditIssue } from "./issueTypes"
import { clearAuditSummary, setAuditSummary } from "./resultStore"
import { accumulate, toSummary, untrackElements, type RunningTotals } from "./summarize"
import type { FeatureController } from "~features/types"

let applied = false
let totals: RunningTotals = {}
let unsubscribeMutations: (() => void) | undefined

function persist(): void {
  void setAuditSummary(location.hostname, toSummary(totals))
}

function collectElements(root: HTMLElement): HTMLElement[] {
  return [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))]
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
      let removedAny = false

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          newIssues.push(...auditSubtree(node))
        })
        mutation.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (untrackElements(totals, collectElements(node))) removedAny = true
        })
      })

      if (newIssues.length > 0) {
        const { fixed: newlyFixed } = applyAutoFixes(newIssues)
        totals = accumulate(totals, newIssues, newlyFixed)
      }
      if (newIssues.length > 0 || removedAny) persist()
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
