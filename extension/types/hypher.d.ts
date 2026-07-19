declare module "hypher" {
  interface HyphenationPattern {
    id?: string[]
    leftmin: number
    rightmin: number
    patterns: Record<string, string>
    exceptions?: string
  }

  export default class Hypher {
    constructor(language: HyphenationPattern)
    hyphenate(word: string): string[]
    hyphenateText(text: string, minLength?: number): string
  }
}

declare module "hyphenation.en-us" {
  const pattern: {
    id: string[]
    leftmin: number
    rightmin: number
    patterns: Record<string, string>
  }
  export default pattern
}
