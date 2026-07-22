import { useCallback, useEffect, useState } from "react"

import { OVERLAY_Z_INDEX } from "~lib/dom/shadowRoot"
import type { VoiceCommandsSettings } from "~lib/settings/schema"

import { parseVoiceCommand } from "./commandTable"
import { executeVoiceAction } from "./domActions"
import { useSpeechRecognition } from "./speechRecognition"

interface VoiceCommandsOverlayProps {
  settings: VoiceCommandsSettings
}

interface ToastState {
  text: string
  ok: boolean
}

const STATUS_LABEL: Record<string, string> = {
  idle: "",
  listening: "🎙️ Listening",
  "mic-denied": "🎙️ Mic access denied",
  unsupported: "🎙️ Voice commands not supported in this browser",
  error: "🎙️ Voice recognition error"
}

export function VoiceCommandsOverlay({ settings }: VoiceCommandsOverlayProps) {
  const [listeningEnabled, setListeningEnabled] = useState(settings.enabled)
  const [toast, setToast] = useState<ToastState>()

  // "stop listening" is a spoken command, not just the stored setting, so it gets its own bit
  // of state layered on top — re-synced whenever the setting itself changes (toggled in popup).
  useEffect(() => setListeningEnabled(settings.enabled), [settings.enabled])

  const showToast = useCallback((text: string, ok: boolean) => {
    setToast({ text, ok })
    window.setTimeout(() => setToast(undefined), 2000)
  }, [])

  const handlePhrase = useCallback(
    (rawPhrase: string) => {
      console.log("[VoiceOverlay] Received raw phrase:", rawPhrase)
      const match = parseVoiceCommand(rawPhrase)
      console.log("[VoiceOverlay] Parsed command match:", match)
      if (!match) return

      if (match.action.type === "stopListening") {
        setListeningEnabled(false)
        showToast("Stopped listening", true)
        return
      }

      const ok = executeVoiceAction(match.action)
      console.log("[VoiceOverlay] Execution result:", ok)
      showToast(
        ok ? `✓ ${match.matchedLabel}` : `Couldn't do "${match.matchedLabel}"`,
        ok
      )
    },
    [showToast]
  )

  const status = useSpeechRecognition({
    active: settings.enabled && listeningEnabled,
    onFinalPhrase: handlePhrase
  })

  if (!settings.enabled) return null

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: OVERLAY_Z_INDEX,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "flex-start"
      }}>
      {toast ? (
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: toast.ok ? "#065f46" : "#7f1d1d",
            color: "#fff",
            font: "12px system-ui, sans-serif",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
          }}>
          {toast.text}
        </div>
      ) : null}
      {status !== "idle" ? (
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: "#111827",
            color: "#fff",
            font: "12px system-ui, sans-serif",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
          }}>
          {STATUS_LABEL[status]}
        </div>
      ) : null}
    </div>
  )
}
