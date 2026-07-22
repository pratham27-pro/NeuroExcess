import type { VoiceAction } from "./commandTable"

const SECTION_SELECTOR = "h1, h2, h3, [role='region'], section"

function findClickableByText(query: string): HTMLElement | undefined {
  const normalizedQuery = query.toLowerCase()
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      "button, a, [role='button'], input[type='submit'], input[type='button']"
    )
  )
  const visible = candidates.filter((el) => {
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
  
  // Shortest matching accessible name wins, so "click login" doesn't grab a paragraph that
  // merely contains the word "login" somewhere inside a longer link.
  const matches = visible
    .map((el) => ({
      el,
      text: (el.textContent ?? el.getAttribute("aria-label") ?? "").trim().toLowerCase()
    }))
    .filter(({ text }) => text.includes(normalizedQuery))
    .sort((a, b) => a.text.length - b.text.length)

  return matches[0]?.el
}

function focusNextSection(): void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR))
  const active = document.activeElement
  const currentIndex = active ? sections.indexOf(active as HTMLElement) : -1
  const next = sections[currentIndex + 1]
  if (!next) return
  if (!next.hasAttribute("tabindex")) next.setAttribute("tabindex", "-1")
  next.focus({ preventScroll: false })
  next.scrollIntoView({ behavior: "smooth", block: "start" })
}

function controlFirstMedia(action: "play" | "pause" | "mute"): void {
  const media = document.querySelector<HTMLMediaElement>("video, audio")
  if (!media) return
  if (action === "play") void media.play()
  else if (action === "pause") media.pause()
  else media.muted = !media.muted
}

/**
 * Chrome's built-in PDF viewer runs in an embedded viewer that content scripts cannot reach via
 * normal DOM APIs — a known MV3 limitation (see feature plan Phase 4). Synthetic keyboard events
 * dispatched from the page context don't reach it either; a real fix needs the `debugger`
 * permission (chrome.debugger + Input.dispatchKeyEvent) routed through the background worker,
 * which we intentionally don't request by default since it shows Chrome's
 * "this extension is debugging your browser" banner. Scroll commands on a PDF therefore report
 * as failed (toast shows "couldn't do X") rather than silently doing nothing.
 */
function isPdfViewer(): boolean {
  return document.contentType === "application/pdf"
}

function performScroll(
  action:
    | { type: "scrollBy"; deltaY: number }
    | { type: "scrollTo"; position: "top" | "bottom" }
): boolean {
  const scrollTargets: (Element | Window | null)[] = [
    window,
    document.scrollingElement,
    document.body,
    document.documentElement,
    document.querySelector("ytd-app"),
    document.querySelector("#contentContainer"),
    document.querySelector("pdf-viewer")?.shadowRoot?.querySelector("#scroller") || null
  ]

  let scrolled = false

  scrollTargets.forEach((target) => {
    if (!target) return
    try {
      if (action.type === "scrollTo") {
        const top =
          action.position === "top"
            ? 0
            : (target as any).scrollHeight || document.body.scrollHeight
        target.scrollTo({ top, behavior: "smooth" })
      } else {
        target.scrollBy({ top: action.deltaY, behavior: "smooth" })
      }
      scrolled = true
    } catch (err) {
      // ignore
    }
  })

  return scrolled
}

export function executeVoiceAction(action: VoiceAction): boolean {
  switch (action.type) {
    case "scrollBy":
      return performScroll(action)
    case "scrollTo":
      return performScroll(action)
    case "nextSection":
      focusNextSection()
      return true
    case "clickByText": {
      const target = findClickableByText(action.query)
      if (!target) return false
      target.click()
      return true
    }
    case "goBack":
      history.back()
      return true
    case "mediaControl":
      controlFirstMedia(action.action)
      return true
    case "stopListening":
      // Handled by the overlay, which owns the recognition lifecycle.
      return true
    case "typeText": {
      const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        activeEl.value = action.text
        activeEl.dispatchEvent(new Event("input", { bubbles: true }))
        activeEl.dispatchEvent(new Event("change", { bubbles: true }))
        return true
      }
      return false
    }
    case "readPage":
      window.dispatchEvent(new CustomEvent("neuroaccess:local-read-page"))
      return true
    case "readSelection":
      window.dispatchEvent(new CustomEvent("neuroaccess:local-read-selection"))
      return true
    case "stopReading":
      window.dispatchEvent(new CustomEvent("neuroaccess:local-stop-reading"))
      return true
    case "pauseReading":
      window.dispatchEvent(new CustomEvent("neuroaccess:local-pause-reading"))
      return true
    case "resumeReading":
      window.dispatchEvent(new CustomEvent("neuroaccess:local-resume-reading"))
      return true
  }
}
