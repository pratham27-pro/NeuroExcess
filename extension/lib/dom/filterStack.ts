// Composes CSS `filter` contributions from multiple features (e.g. contrast fixer's color-blind
// correction and calm theme's desaturation) into one `html { filter }` rule, so one feature's
// filter never clobbers another's — each registers/unregisters its own named fragment here
// instead of writing to `html.style.filter` directly.

const STYLE_ID = "neuroaccess-filter-stack"

const fragments = new Map<string, string>()
let styleEl: HTMLStyleElement | undefined

function applyComposedFilter(): void {
  const composed = [...fragments.values()].filter(Boolean).join(" ")

  if (!composed) {
    styleEl?.remove()
    styleEl = undefined
    return
  }

  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.dataset.naStyleId = STYLE_ID
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = `html { filter: ${composed} !important; }`
}

export function registerFilter(id: string, filterValue: string): void {
  fragments.set(id, filterValue)
  applyComposedFilter()
}

export function unregisterFilter(id: string): void {
  if (fragments.delete(id)) {
    applyComposedFilter()
  }
}

export function isFilterRegistered(id: string): boolean {
  return fragments.has(id)
}
