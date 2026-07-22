// One shared, debounced MutationObserver that features subscribe callbacks to, instead of each
// feature (calm theme's declutter/autoplay-pause, skip links' landmark re-scan) running its own
// observer on the whole page — real performance cost on heavy/SPA pages if duplicated per feature.

type MutationCallback = (mutations: MutationRecord[]) => void

const DEBOUNCE_MS = 150

const subscribers = new Set<MutationCallback>()
let observer: MutationObserver | undefined
let debounceTimer: number | undefined
let pendingMutations: MutationRecord[] = []

function flush(): void {
  const mutations = pendingMutations
  pendingMutations = []
  // One shared observer serves multiple independent features — a throw from one subscriber's
  // callback must not stop the others from receiving this batch (plain forEach would abort the
  // whole loop on the first exception).
  subscribers.forEach((callback) => {
    try {
      callback(mutations)
    } catch (error) {
      console.error("[NeuroAccess] mutation subscriber failed:", error)
    }
  })
}

function ensureObserverStarted(): void {
  if (observer) return
  observer = new MutationObserver((mutations) => {
    pendingMutations.push(...mutations)
    if (debounceTimer !== undefined) window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(flush, DEBOUNCE_MS)
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

/** Subscribes to debounced DOM mutation batches. Returns an unsubscribe function. */
export function subscribeToMutations(callback: MutationCallback): () => void {
  ensureObserverStarted()
  subscribers.add(callback)

  return () => {
    subscribers.delete(callback)
    if (subscribers.size === 0) {
      observer?.disconnect()
      observer = undefined
      if (debounceTimer !== undefined) window.clearTimeout(debounceTimer)
      debounceTimer = undefined
      pendingMutations = []
    }
  }
}
