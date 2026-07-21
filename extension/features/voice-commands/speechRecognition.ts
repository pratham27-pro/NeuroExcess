import { useEffect, useRef, useState } from "react"

export type RecognitionStatus = "idle" | "listening" | "mic-denied" | "unsupported" | "error"

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

interface UseSpeechRecognitionOptions {
  active: boolean
  onFinalPhrase: (phrase: string) => void
}

/**
 * Runs Web Speech API recognition for as long as `active` is true. The API stops itself
 * periodically even with `continuous = true` (a well-documented gotcha) — this restarts it on
 * `onend` so listening stays effectively continuous instead of dying after the first pause.
 */
export function useSpeechRecognition({
  active,
  onFinalPhrase
}: UseSpeechRecognitionOptions): RecognitionStatus {
  const [status, setStatus] = useState<RecognitionStatus>("idle")
  const onFinalPhraseRef = useRef(onFinalPhrase)
  onFinalPhraseRef.current = onFinalPhrase

  useEffect(() => {
    if (!active) {
      setStatus("idle")
      return
    }

    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setStatus("unsupported")
      return
    }

    let stoppedByUser = false
    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      console.log("[SpeechRecognition] onresult event:", event)
      const results = event.results as SpeechRecognitionResultList
      const last = results[results.length - 1]
      console.log(
        "[SpeechRecognition] Last result:",
        last,
        "transcript:",
        last?.[0]?.transcript,
        "isFinal:",
        last?.isFinal
      )
      if (last?.isFinal) {
        onFinalPhraseRef.current(last[0]?.transcript ?? "")
      }
    }

    recognition.onerror = (event) => {
      const error = event.error as string
      console.error("[SpeechRecognition] onerror event:", error, event)
      if (error === "not-allowed" || error === "service-not-allowed") {
        stoppedByUser = true
        setStatus("mic-denied")
        return
      }
      if (error === "no-speech" || error === "aborted") {
        // Not fatal — onend fires next and restarts if still active.
        return
      }
      setStatus("error")
    }

    recognition.onend = () => {
      console.log("[SpeechRecognition] onend triggered")
      if (stoppedByUser) return
      try {
        recognition.start()
        console.log("[SpeechRecognition] restarted in onend")
        setStatus("listening")
      } catch {
        // start() throws if called while already starting; the next onend retries.
      }
    }

    try {
      recognition.start()
      console.log("[SpeechRecognition] started recognition engine")
      setStatus("listening")
    } catch {
      console.error("[SpeechRecognition] failed to start recognition engine")
      setStatus("error")
    }

    return () => {
      console.log("[SpeechRecognition] cleaning up engine instance")
      stoppedByUser = true
      recognition.onend = null
      recognition.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return status
}
