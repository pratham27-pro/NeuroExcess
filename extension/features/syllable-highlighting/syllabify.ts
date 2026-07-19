import Hypher from "hypher"
import englishPatterns from "hyphenation.en-us"

// No browser API exposes syllable boundaries — this is the closest practical client-side
// approximation: Liang's hyphenation algorithm (same class of algorithm browsers use internally
// for CSS `hyphens: auto`, but not exposed to JS).
const hypher = new Hypher(englishPatterns)

/** Splits a word into syllable-approximate fragments. */
export function syllabify(word: string): string[] {
  const cleaned = word.trim()
  if (!cleaned) return []
  return hypher.hyphenate(cleaned)
}
