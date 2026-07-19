export interface SkipTarget {
  label: string
  element: HTMLElement
}

// Landmark roles are a small, stable set fixed by the WAI-ARIA spec — hand-maintained here
// rather than pulled from a dependency, same call made for the color-blind filter matrices.
const LANDMARK_SELECTORS: { label: string; selector: string }[] = [
  { label: "Skip to main content", selector: "main, [role='main']" },
  { label: "Skip to navigation", selector: "nav, [role='navigation']" },
  { label: "Skip to search", selector: "[role='search']" }
]

/** Scans the page for landmark regions to generate skip links for, falling back to the first h1. */
export function analyzePage(): SkipTarget[] {
  const targets: SkipTarget[] = []
  const seen = new Set<Element>()

  for (const { label, selector } of LANDMARK_SELECTORS) {
    const element = document.querySelector<HTMLElement>(selector)
    if (element && !seen.has(element)) {
      seen.add(element)
      targets.push({ label, element })
    }
  }

  if (targets.length === 0) {
    const heading = document.querySelector<HTMLElement>("h1")
    if (heading) {
      targets.push({ label: "Skip to main content", element: heading })
    }
  }

  return targets
}
