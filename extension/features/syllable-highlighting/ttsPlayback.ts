import { syllabify } from "./syllabify"
import { estimateWordDurationMs, stepThroughSyllables } from "./syllableTimingEstimator"

export interface TtsHighlightState {
  wordStart: number
  wordEnd: number
  syllableIndex: number
}

export interface TtsPlaybackHandle {
  play: () => void
  pause: () => void
  resume: () => void
  stop: () => void
}

interface CoreSpeakOptions {
  rate: number
  onBoundary?: (charIndex: number, charLength: number) => void
  onEnd: () => void
}

/**
 * Low-level utterance lifecycle shared by both the syllable-highlighting overlay
 * (speakWithSyllableHighlight) and the standalone full-page/selection reader
 * (StandaloneReaderWidget). Callers own text extraction and any highlighting logic;
 * this just wraps the native SpeechSynthesisUtterance play/pause/resume/stop lifecycle.
 */
export function createTtsController(text: string, options: CoreSpeakOptions): TtsPlaybackHandle {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = options.rate

  utterance.addEventListener("boundary", (event) => {
    if (event.name !== "word") return
    options.onBoundary?.(event.charIndex, event.charLength)
  })

  const finish = () => options.onEnd()
  utterance.addEventListener("end", finish)
  utterance.addEventListener("error", finish)

  return {
    play: () => speechSynthesis.speak(utterance),
    pause: () => speechSynthesis.pause(),
    resume: () => speechSynthesis.resume(),
    stop: () => speechSynthesis.cancel()
  }
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
 *
 * Used by the syllable-highlighting overlay (ReadingBarOverlay.tsx). Behavior and call signature
 * are unchanged from before — it now just delegates the utterance lifecycle to createTtsController.
 */
export function speakWithSyllableHighlight(text: string, options: SpeakOptions): TtsPlaybackHandle {
  let lastBoundaryTime = performance.now()
  let cancelStepper: (() => void) | undefined

  const controller = createTtsController(text, {
    rate: options.rate,
    onBoundary: (charIndex, charLength) => {
      cancelStepper?.()

      const word =
        charLength > 0
          ? text.slice(charIndex, charIndex + charLength)
          : (text.slice(charIndex).match(/^\S+/)?.[0] ?? "")
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

      const wordStart = charIndex
      const wordEnd = charIndex + word.length
      const syllables = syllabify(word)

      if (syllables.length <= 1) {
        options.onHighlight({ wordStart, wordEnd, syllableIndex: 0 })
        return
      }

      const { cancel } = stepThroughSyllables(syllables, durationMs, (index) => {
        options.onHighlight({ wordStart, wordEnd, syllableIndex: index })
      })
      cancelStepper = cancel
    },
    onEnd: () => {
      cancelStepper?.()
      options.onHighlight(null)
      options.onEnd()
    }
  })

  controller.play()

  return {
    ...controller,
    stop: () => {
      cancelStepper?.()
      controller.stop()
    }
  }
}