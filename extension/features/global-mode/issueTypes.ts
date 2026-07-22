export type IssueCategory =
  | "missingAlt"
  | "missingFormLabel"
  | "unlabeledControl"
  | "missingLang"
  | "headingOrder"
  | "missingLandmark"

export interface AuditIssue {
  category: IssueCategory
  /** null for document-level issues (missing <html lang>, no <main> landmark). */
  element: HTMLElement | null
  detail: string
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  missingAlt: "Missing alt text",
  missingFormLabel: "Unlabeled form field",
  unlabeledControl: "Unlabeled button or link",
  missingLang: "Missing page language",
  headingOrder: "Heading order issue",
  missingLandmark: "Missing main landmark"
}

// Categories Global Mode can fix by purely adding an attribute — never rewrites structure,
// text content, or anything a screen reader-dependent user is already relying on. Heading order,
// missing landmarks, and missing page language are flagged but left for manual review: reshuffling
// heading levels, inventing a <main> wrapper, or guessing the document's language (the only signal
// available — the visitor's browser locale — often doesn't match the actual page content) all risk
// making things worse rather than better, so none of them get auto-applied.
export const AUTO_FIXABLE_CATEGORIES: ReadonlySet<IssueCategory> = new Set([
  "missingAlt",
  "missingFormLabel",
  "unlabeledControl"
])
