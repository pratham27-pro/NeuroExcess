import { injectStyle, removeStyle } from "~lib/dom/styleInjector"

import type { SkipTarget } from "./analyzePage"

const NAV_ID = "neuroaccess-skip-links"
const STYLE_ID = "neuroaccess-skip-links-style"

let addedIdElements: HTMLElement[] = []

// Standard WebAIM off-screen-until-focused pattern. Deliberately not routed through the
// CSUI shadow root: this nav must be the literal first child of <body> to be first in tab
// order, which shadow-DOM anchoring can't guarantee.
const SKIP_LINKS_CSS = `
#${NAV_ID} {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483647;
}
#${NAV_ID} a {
  position: absolute;
  left: -9999px;
  top: 0;
  padding: 0.75em 1.25em;
  background: #111827;
  color: #ffffff;
  font: 14px/1.4 system-ui, sans-serif;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  white-space: nowrap;
}
#${NAV_ID} a:focus {
  left: 0;
  outline: 2px solid #60a5fa;
  outline-offset: -2px;
}
`

export function injectSkipLinks(targets: SkipTarget[]): void {
  removeSkipLinks()
  if (targets.length === 0) return

  injectStyle(STYLE_ID, SKIP_LINKS_CSS)

  const nav = document.createElement("nav")
  nav.id = NAV_ID
  nav.setAttribute("aria-label", "Skip links")

  targets.forEach((target, index) => {
    if (!target.element.id) {
      target.element.id = `na-skip-target-${index}`
      target.element.dataset.naAddedId = "true"
      addedIdElements.push(target.element)
    }
    const link = document.createElement("a")
    link.href = `#${target.element.id}`
    link.textContent = target.label
    nav.appendChild(link)
  })

  document.body.insertBefore(nav, document.body.firstChild)
}

export function removeSkipLinks(): void {
  document.getElementById(NAV_ID)?.remove()
  removeStyle(STYLE_ID)
  addedIdElements.forEach((el) => {
    el.removeAttribute("id")
    delete el.dataset.naAddedId
  })
  addedIdElements = []
}

export function isSkipLinksInjected(): boolean {
  return document.getElementById(NAV_ID) !== null
}
