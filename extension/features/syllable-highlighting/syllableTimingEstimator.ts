// No browser API exposes sub-word (syllable-level) speech timing — SpeechSynthesisUtterance's
// `boundary` event only fires at word granularity. This estimator is a documented approximation,
// not exact audio sync: it steps through a word's syllables at a cadence proportional to their
// length, within the window between consecutive word boundaries.

export interface SyllableStepperHandle {
  cancel: () => void
}

export function stepThroughSyllables(
  syllables: string[],
  durationMs: number,
  onStep: (index: number) => void
): SyllableStepperHandle {
  if (syllables.length === 0) return { cancel: () => {} }

  const timers: number[] = []
  const totalChars = syllables.reduce((sum, syllable) => sum + syllable.length, 0) || 1
  let elapsed = 0

  syllables.forEach((syllable, index) => {
    timers.push(window.setTimeout(() => onStep(index), elapsed))
    elapsed += (syllable.length / totalChars) * durationMs
  })

  return {
    cancel: () => timers.forEach((timer) => window.clearTimeout(timer))
  }
}

const AVERAGE_MS_PER_CHAR_AT_RATE_1 = 90

/** Rough duration estimate for a word at a given speech rate, used before an actual
 * inter-boundary interval has been observed to self-correct against. */
export function estimateWordDurationMs(word: string, speechRate: number): number {
  return (word.length * AVERAGE_MS_PER_CHAR_AT_RATE_1) / Math.max(0.1, speechRate)
}
