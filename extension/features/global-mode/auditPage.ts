import { NEUROACCESS_OWN_ELEMENT_SELECTOR } from "~lib/dom/ownElements"

import type { AuditIssue } from "./issueTypes"

function isOwn(el: Element): boolean {
  return el.closest(NEUROACCESS_OWN_ELEMENT_SELECTOR) !== null
}

function hasAccessibleName(el: HTMLElement): boolean {
  if (el.getAttribute("aria-label")?.trim()) return true
  if (el.getAttribute("aria-labelledby")) return true
  if (el.getAttribute("title")?.trim()) return true
  if ((el.textContent ?? "").trim().length > 0) return true

  // A descendant <img alt="..."> or labelled <svg> is a legitimate accessible-name source too —
  // without this, a well-labelled icon button/link (e.g. <button><img alt="Close"></button>)
  // gets flagged and then re-labelled "Button"/"Link" by fixUnlabeledControl, which actually
  // overrides the image's alt as the accessible name and makes the control worse, not better.
  const namedImage = el.querySelector<HTMLImageElement>("img[alt]")
  if (namedImage?.alt.trim()) return true
  const namedSvg = el.querySelector("svg")
  if (namedSvg?.querySelector("title")?.textContent?.trim()) return true
  if (namedSvg?.getAttribute("aria-label")?.trim()) return true

  return false
}

/** Query a selector against `root` itself plus its descendants — plain querySelectorAll skips the root. */
function queryIncludingSelf<T extends Element>(root: Element, selector: string): T[] {
  const self = root.matches(selector) ? [root as unknown as T] : []
  return self.concat(Array.from(root.querySelectorAll<T>(selector)))
}

function auditImages(root: Element): AuditIssue[] {
  const issues: AuditIssue[] = []
  queryIncludingSelf<HTMLImageElement>(root, "img[src]").forEach((img) => {
    if (isOwn(img) || img.hasAttribute("alt") || !img.src) return
    issues.push({ category: "missingAlt", element: img, detail: img.src.split("/").pop() ?? "image" })
  })
  return issues
}

const FORM_FIELD_SELECTOR =
  "input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]), select, textarea"

function auditFormLabels(root: Element): AuditIssue[] {
  const issues: AuditIssue[] = []
  queryIncludingSelf<HTMLElement>(root, FORM_FIELD_SELECTOR).forEach((field) => {
    if (isOwn(field)) return
    if (field.getAttribute("aria-label")?.trim() || field.getAttribute("aria-labelledby")) return
    if (field.closest("label")) return
    const id = field.id
    if (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) return
    issues.push({
      category: "missingFormLabel",
      element: field,
      detail: (field as HTMLInputElement).name || id || field.tagName.toLowerCase()
    })
  })
  return issues
}

function auditUnlabeledControls(root: Element): AuditIssue[] {
  const issues: AuditIssue[] = []
  queryIncludingSelf<HTMLElement>(root, 'button, a[href], [role="button"]').forEach((control) => {
    if (isOwn(control) || hasAccessibleName(control)) return
    issues.push({ category: "unlabeledControl", element: control, detail: control.tagName.toLowerCase() })
  })
  return issues
}

function auditLang(): AuditIssue[] {
  if (document.documentElement.getAttribute("lang")?.trim()) return []
  return [{ category: "missingLang", element: null, detail: "html" }]
}

function auditHeadingOrder(): AuditIssue[] {
  const headings = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")).filter(
    (h) => !isOwn(h)
  )
  if (headings.length === 0) return []

  const issues: AuditIssue[] = []
  if (!headings.some((h) => h.tagName === "H1")) {
    issues.push({ category: "headingOrder", element: null, detail: "No H1 on the page" })
  }

  let previousLevel = 0
  headings.forEach((h) => {
    const level = Number(h.tagName[1])
    if (previousLevel > 0 && level - previousLevel > 1) {
      issues.push({
        category: "headingOrder",
        element: h,
        detail: `Jumps from H${previousLevel} to H${level}`
      })
    }
    previousLevel = level
  })
  return issues
}

function auditLandmark(): AuditIssue[] {
  if (document.querySelector("main, [role='main']")) return []
  return [{ category: "missingLandmark", element: null, detail: "No <main> landmark found" }]
}

/** Full-document audit — every category, including page-level checks that only make sense once. */
export function auditDocument(): AuditIssue[] {
  return [
    ...auditImages(document.body),
    ...auditFormLabels(document.body),
    ...auditUnlabeledControls(document.body),
    ...auditLang(),
    ...auditHeadingOrder(),
    ...auditLandmark()
  ]
}

/** Scoped audit for a newly-added subtree (mutation-driven) — element-level categories only. */
export function auditSubtree(root: Element): AuditIssue[] {
  return [...auditImages(root), ...auditFormLabels(root), ...auditUnlabeledControls(root)]
}
