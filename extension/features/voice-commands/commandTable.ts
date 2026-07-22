export type VoiceAction =
  | { type: "scrollBy"; deltaY: number }
  | { type: "scrollTo"; position: "top" | "bottom" }
  | { type: "nextSection" }
  | { type: "clickByText"; query: string }
  | { type: "goBack" }
  | { type: "mediaControl"; action: "play" | "pause" | "mute" }
  | { type: "stopListening" }
  | { type: "typeText"; text: string }
  | { type: "readPage" }
  | { type: "readSelection" }
  | { type: "stopReading" }
  | { type: "pauseReading" }
  | { type: "resumeReading" }

export interface CommandMatch {
  action: VoiceAction
  matchedLabel: string
}

interface CommandRule {
  label: string
  test: (phrase: string) => VoiceAction | undefined
}

const CLICK_PATTERN = /^click\s+(.+)$/

const RULES: CommandRule[] = [
  {
    label: "scroll down",
    test: (p) =>
      p.includes("scroll") && p.includes("down")
        ? { type: "scrollBy", deltaY: 500 }
        : undefined
  },
  {
    label: "scroll up",
    test: (p) =>
      p.includes("scroll") && p.includes("up")
        ? { type: "scrollBy", deltaY: -500 }
        : undefined
  },
  {
    label: "scroll to top",
    test: (p) =>
      p.includes("top") && (p.includes("scroll") || p.includes("go"))
        ? { type: "scrollTo", position: "top" }
        : undefined
  },
  {
    label: "scroll to bottom",
    test: (p) =>
      p.includes("bottom") && (p.includes("scroll") || p.includes("go"))
        ? { type: "scrollTo", position: "bottom" }
        : undefined
  },
  {
    label: "next section",
    test: (p) =>
      p.includes("next") && (p.includes("section") || p.includes("heading"))
        ? { type: "nextSection" }
        : undefined
  },
  {
    label: "go back",
    test: (p) =>
      p.includes("go back") || p === "back" ? { type: "goBack" } : undefined
  },
  {
    label: "read page",
    test: (p) =>
      p.includes("read") && (p.includes("page") || p.includes("full") || p.includes("all"))
        ? { type: "readPage" }
        : undefined
  },
  {
    label: "read selection",
    test: (p) =>
      p.includes("read") && (p.includes("selection") || p.includes("selected") || p.includes("text"))
        ? { type: "readSelection" }
        : undefined
  },
  {
    label: "stop reading",
    test: (p) =>
      p.includes("stop") && (p.includes("read") || p.includes("speak") || p.includes("tts"))
        ? { type: "stopReading" }
        : undefined
  },
  {
    label: "pause reading",
    test: (p) =>
      p.includes("pause") && (p.includes("read") || p.includes("speak") || p.includes("tts"))
        ? { type: "pauseReading" }
        : undefined
  },
  {
    label: "resume reading",
    test: (p) =>
      p.includes("resume") && (p.includes("read") || p.includes("speak") || p.includes("tts"))
        ? { type: "resumeReading" }
        : undefined
  },
  {
    label: "play",
    test: (p) =>
      p.includes("play") && !p.includes("stop")
        ? { type: "mediaControl", action: "play" }
        : undefined
  },
  {
    label: "pause",
    test: (p) =>
      p.includes("pause") ? { type: "mediaControl", action: "pause" } : undefined
  },
  {
    label: "mute",
    test: (p) =>
      p.includes("mute") ? { type: "mediaControl", action: "mute" } : undefined
  },
  {
    label: "stop listening",
    test: (p) =>
      p.includes("stop") && p.includes("listen")
        ? { type: "stopListening" }
        : undefined
  },
  {
    label: "type text",
    test: (p) => {
      if (p.startsWith("type ")) {
        return { type: "typeText", text: p.substring(5).trim() }
      }
      if (p.startsWith("write ")) {
        return { type: "typeText", text: p.substring(6).trim() }
      }
      return undefined
    }
  }
]

/** Parses a finalized speech-recognition transcript into a DOM action, or undefined if nothing matches. */
export function parseVoiceCommand(rawPhrase: string): CommandMatch | undefined {
  const phrase = rawPhrase.trim().toLowerCase()
  if (!phrase) return undefined

  // "click X" carries free text, so it's matched separately from the fixed vocabulary above.
  const clickMatch = phrase.match(CLICK_PATTERN)
  if (clickMatch) {
    const query = clickMatch[1].trim()
    if (query) {
      return { action: { type: "clickByText", query }, matchedLabel: `click ${query}` }
    }
  }

  for (const rule of RULES) {
    const action = rule.test(phrase)
    if (action) return { action, matchedLabel: rule.label }
  }
  return undefined
}
