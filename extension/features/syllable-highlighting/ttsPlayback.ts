import { syllabify } from "./syllabify"
import { estimateWordDurationMs, stepThroughSyllables } from "./syllableTimingEstimator"

export interface TtsHighlightState {
  wordStart: number
  wordEnd: number
  syllableIndex: number
}

export interface TtsPlaybackHandle {
  stop: () => void
}

interface SpeakOptions {
  rate: number
  onHighlight: (state: TtsHighlightState | null) => void
  onEnd: () => void
}

/**
 * Reads `text` aloud via the browser-native Web Speech API, calling `onHighlight` as playback
 * progresses word-by-word (native `boundary` events) and syllable-by-syllable within each word
 * (estimated — see syllableTimingEstimator.ts).
 */
export function speakWithSyllableHighlight(text: string, options: SpeakOptions): TtsPlaybackHandle {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = options.rate

  let lastBoundaryTime = performance.now()
  let cancelStepper: (() => void) | undefined

  utterance.addEventListener("boundary", (event) => {
    if (event.name !== "word") return
    cancelStepper?.()

    const word =
      event.charLength > 0
        ? text.slice(event.charIndex, event.charIndex + event.charLength)
        : (text.slice(event.charIndex).match(/^\S+/)?.[0] ?? "")
    if (!word) return

    const now = performance.now()
    const observedInterval = now - lastBoundaryTime
    lastBoundaryTime = now

    // Self-correct using the previous observed inter-boundary interval once we have a
    // plausible one; otherwise fall back to a length-based estimate (e.g. for the first word).
    const durationMs =
      observedInterval > 50 && observedInterval < 5000
        ? observedInterval
        : estimateWordDurationMs(word, options.rate)

    const wordStart = event.charIndex
    const wordEnd = event.charIndex + word.length
    const syllables = syllabify(word)

    if (syllables.length <= 1) {
      options.onHighlight({ wordStart, wordEnd, syllableIndex: 0 })
      return
    }

    const { cancel } = stepThroughSyllables(syllables, durationMs, (index) => {
      options.onHighlight({ wordStart, wordEnd, syllableIndex: index })
    })
    cancelStepper = cancel
  })

  const finish = () => {
    cancelStepper?.()
    options.onHighlight(null)
    options.onEnd()
  }
  utterance.addEventListener("end", finish)
  utterance.addEventListener("error", finish)

  speechSynthesis.speak(utterance)

  return {
    stop: () => {
      cancelStepper?.()
      speechSynthesis.cancel()
    }
  }
}
