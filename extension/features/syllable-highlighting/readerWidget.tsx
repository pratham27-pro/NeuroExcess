import { useImperativeHandle, useRef, useState, forwardRef } from "react"

import { OVERLAY_Z_INDEX } from "~lib/dom/shadowRoot"

import { extractPageText } from "./extractPageText"
import { createTtsController, type TtsPlaybackHandle } from "./ttsPlayback"

type PlaybackState = "idle" | "playing" | "paused"

export interface StandaloneReaderHandle {
  readSelection: () => void
  readPage: () => void
}

interface StandaloneReaderWidgetProps {
  rate?: number
}

/**
 * Standalone full-page/selection TTS reader with play/pause/stop controls.
 * Separate from ReadingBarOverlay (syllable-highlighting overlay) — this is a persistent
 * control widget, not tied to a text selection popup. Both share the same underlying
 * createTtsController from ttsPlayback.ts.
 *
 * Mount this once (e.g. alongside ReadingBarOverlay in your content script root) and trigger
 * readSelection/readPage via a ref from wherever the feature is invoked — a context-menu item,
 * popup button, or keyboard shortcut message handler.
 */
export const StandaloneReaderWidget = forwardRef<StandaloneReaderHandle, StandaloneReaderWidgetProps>(
  function StandaloneReaderWidget({ rate = 1 }, ref) {
    const [state, setState] = useState<PlaybackState>("idle")
    const handleRef = useRef<TtsPlaybackHandle>()

    function start(text: string) {
      if (!text.trim()) return
      handleRef.current?.stop()

      const handle = createTtsController(text, {
        rate,
        onEnd: () => setState("idle")
      })
      handleRef.current = handle
      handle.play()
      setState("playing")
    }

    useImperativeHandle(ref, () => ({
      readSelection: () => start(window.getSelection()?.toString().trim() ?? ""),
      readPage: () => start(extractPageText())
    }))

    function pause() {
      handleRef.current?.pause()
      setState("paused")
    }

    function resume() {
      handleRef.current?.resume()
      setState("playing")
    }

    function stop() {
      handleRef.current?.stop()
      setState("idle")
    }

    if (state === "idle") return null

    return (
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: OVERLAY_Z_INDEX,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#111827",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 8,
          font: "13px system-ui, sans-serif",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)"
        }}>
        {state === "playing" ? (
          <button type="button" onClick={pause} style={controlButtonStyle}>
            ⏸ Pause
          </button>
        ) : (
          <button type="button" onClick={resume} style={controlButtonStyle}>
            ▶ Resume
          </button>
        )}
        <button type="button" onClick={stop} style={controlButtonStyle}>
          ⏹ Stop
        </button>
      </div>
    )
  }
)

const controlButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #ffffff55",
  color: "#fff",
  borderRadius: 4,
  padding: "4px 10px",
  cursor: "pointer",
  font: "inherit"
}