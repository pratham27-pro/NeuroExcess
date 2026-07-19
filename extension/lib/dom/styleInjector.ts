const injectedStyles = new Map<string, HTMLStyleElement>()

/** Injects (or updates) a `<style>` tag in `<head>` tracked by `id`. Idempotent. */
export function injectStyle(id: string, css: string): void {
  let styleEl = injectedStyles.get(id)
  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.dataset.naStyleId = id
    document.head.appendChild(styleEl)
    injectedStyles.set(id, styleEl)
  }
  styleEl.textContent = css
}

export function removeStyle(id: string): void {
  const styleEl = injectedStyles.get(id)
  if (styleEl) {
    styleEl.remove()
    injectedStyles.delete(id)
  }
}

export function isStyleInjected(id: string): boolean {
  return injectedStyles.has(id)
}
