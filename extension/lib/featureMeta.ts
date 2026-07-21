import type { FeatureId } from "~lib/settings/schema"

export interface FeatureMeta {
  icon: string
  label: string
  description: string
}

export const FEATURE_META: Record<FeatureId, FeatureMeta> = {
  contrastFixer: {
    icon: "\u{1F3A8}",
    label: "Contrast Fixer",
    description: "WCAG contrast fixes and color-blind presets"
  },
  readingRuler: {
    icon: "\u{1F4CF}",
    label: "Reading Ruler",
    description: "Dims everything but the line you're reading"
  },
  syllableHighlighting: {
    icon: "\u{1F5E3}️",
    label: "Syllable Highlighting",
    description: "Highlights syllables in sync with read-aloud"
  },
  calmTheme: {
    icon: "\u{1F343}",
    label: "Calm Theme",
    description: "Muted colors, less motion, less clutter"
  },
  skipLinks: {
    icon: "\u{23ED}️",
    label: "Skip Links",
    description: "Jump past repetitive navigation with the keyboard"
  },
  voiceCommands: {
    icon: "\u{1F3A4}",
    label: "Voice Commands",
    description: 'Say "scroll down", "next section", or "click login"'
  },
  globalMode: {
    icon: "\u{1F5B1}️",
    label: "Global Accessibility Mode",
    description: "One-click page audit with safe automatic fixes"
  }
}
