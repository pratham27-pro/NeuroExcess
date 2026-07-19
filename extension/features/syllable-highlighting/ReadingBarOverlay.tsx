import { useEffect, useRef, useState, type ReactNode } from "react"

import { OVERLAY_Z_INDEX } from "~lib/dom/shadowRoot"
import type { SyllableHighlightingSettings } from "~lib/settings/schema"

import { syllabify } from "./syllabify"
import { speakWithSyllableHighlight, type TtsHighlightState } from "./ttsPlayback"

interface ReadingBarOverlayProps {
  settings: SyllableHighlightingSettings
}

interface SelectionTrigger {
  text: string
  x: number
  y: number
}

export function ReadingBarOverlay({ settings }: ReadingBarOverlayProps) {
  const [selection, setSelection] = useState<SelectionTrigger>()
  const [readingText, setReadingText] = useState<string>()
  const [highlight, setHighlight] = useState<TtsHighlightState | null>(null)
  const stopRef = useRef<() => void>()

  useEffect(() => {
    if (!settings.enabled) return

    function onSelectionChange() {
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ""
      if (!text || !sel || sel.rangeCount === 0) {
        setSelection(undefined)
        return
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect()
      setSelection({ text, x: rect.left, y: rect.bottom + 6 })
    }

    document.addEventListener("selectionchange", onSelectionChange)
    return () => document.removeEventListener("selectionchange", onSelectionChange)
  }, [settings.enabled])

  // Stop any in-flight speech if the feature is disabled or the content script unmounts.
  useEffect(() => {
    if (!settings.enabled) stopRef.current?.()
    return () => stopRef.current?.()
  }, [settings.enabled])

  if (!settings.enabled) return null

  function startReading() {
    if (!selection) return
    const text = selection.text
    setReadingText(text)
    setSelection(undefined)
    const handle = speakWithSyllableHighlight(text, {
      rate: settings.speechRate,
      onHighlight: setHighlight,
      onEnd: () => {
        setReadingText(undefined)
        setHighlight(null)
      }
    })
    stopRef.current = handle.stop
  }

  function stopReading() {
    stopRef.current?.()
    setReadingText(undefined)
    setHighlight(null)
  }

  return (
    <>
      {selection ? (
        <button
          type="button"
          onClick={startReading}
          style={{
            position: "fixed",
            left: selection.x,
            top: selection.y,
            zIndex: OVERLAY_Z_INDEX,
            padding: "4px 10px",
            borderRadius: 6,
            border: "none",
            background: "#111827",
            color: "#fff",
            font: "12px system-ui, sans-serif",
            cursor: "pointer"
          }}>
          🔊 Read aloud
        </button>
      ) : null}

      {readingText ? (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: OVERLAY_Z_INDEX,
            background: "#111827",
            color: "#fff",
            padding: "10px 16px",
            font: "15px/1.6 system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
          <span style={{ flex: 1 }}>
            {renderHighlightedText(readingText, highlight, settings.highlightColor)}
          </span>
          <button
            type="button"
            onClick={stopReading}
            style={{
              background: "transparent",
              border: "1px solid #ffffff55",
              color: "#fff",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer"
            }}>
            Stop
          </button>
        </div>
      ) : null}
    </>
  )
}

function renderHighlightedText(
  text: string,
  highlight: TtsHighlightState | null,
  highlightColor: string
): ReactNode {
  if (!highlight) return text

  const before = text.slice(0, highlight.wordStart)
  const word = text.slice(highlight.wordStart, highlight.wordEnd)
  const after = text.slice(highlight.wordEnd)

  const syllables = syllabify(word)
  const markStyle = { background: highlightColor, borderRadius: 3, padding: "0 1px", color: "#111827" }

  let wordNode: ReactNode
  if (syllables.length > 1) {
    const index = Math.min(highlight.syllableIndex, syllables.length - 1)
    const pre = syllables.slice(0, index).join("")
    const current = syllables[index]
    const post = syllables.slice(index + 1).join("")
    wordNode = (
      <>
        {pre}
        <mark style={markStyle}>{current}</mark>
        {post}
      </>
    )
  } else {
    wordNode = <mark style={markStyle}>{word}</mark>
  }

  return (
    <>
      {before}
      <span style={{ textDecoration: "underline", textDecorationColor: `${highlightColor}88` }}>
        {wordNode}
      </span>
      {after}
    </>
  )
}
