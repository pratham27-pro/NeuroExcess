const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "NAV", "FOOTER", "TEXTAREA", "INPUT"])

/**
 * Walks visible text nodes in reading order, skipping script/style/nav/footer/hidden elements.
 * Used by the standalone reader's "read full page" mode. Selection mode doesn't need this —
 * it reads directly from window.getSelection().
 */
export function extractPageText(root: Element = document.body): string {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT

      const style = getComputedStyle(parent)
      if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT

      return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    }
  })

  const chunks: string[] = []
  while (walker.nextNode()) {
    chunks.push(walker.currentNode.textContent!.trim())
  }
  return chunks.join(" ")
}