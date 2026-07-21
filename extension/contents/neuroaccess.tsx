import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { calmThemeController } from "~features/calm-theme"
import { contrastFixerController } from "~features/contrast-fixer"
import { RulerOverlay } from "~features/reading-ruler/RulerOverlay"
import { skipLinksController } from "~features/skip-links"
import { ReadingBarOverlay } from "~features/syllable-highlighting/ReadingBarOverlay"
import {
  StandaloneReaderWidget,
  type StandaloneReaderHandle
} from "~features/syllable-highlighting/readerWidget"
import { DEFAULT_GLOBAL_SETTINGS } from "~lib/settings/defaults"
import type { GlobalSettings } from "~lib/settings/schema"
import { watchEffectiveSettings } from "~lib/settings/store"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*", "http://*/*", "file:///*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "neuroaccess-shadow-host"


export default function NeuroAccessRoot() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS)
  const standaloneReaderRef = useRef<StandaloneReaderHandle>(null)
  const runtime = globalThis.chrome.runtime

  useEffect(() => {
    const unsubscribe = watchEffectiveSettings(location.hostname, setSettings)
    return () => {
      unsubscribe()
      calmThemeController.remove()
      skipLinksController.remove()
    }
  }, [])

  // Triggered by the extension popup ("Read full page" button) and the context-menu item
  // ("Read selection aloud", registered in the background script) via chrome.runtime.sendMessage.
  useEffect(() => {
    function onMessage(message: { type?: string }) {
      if (message?.type === "neuroaccess:read-selection") {
        standaloneReaderRef.current?.readSelection()
      } else if (message?.type === "neuroaccess:read-page") {
        standaloneReaderRef.current?.readPage()
      }
    }
    runtime.onMessage.addListener(onMessage)
    return () => runtime.onMessage.removeListener(onMessage)
  }, [])

  const contrastKey = JSON.stringify(settings.contrastFixer)
  useEffect(() => {
    if (settings.contrastFixer.enabled) {
      contrastFixerController.apply(settings.contrastFixer)
    } else {
      contrastFixerController.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contrastKey])

  const calmThemeKey = JSON.stringify(settings.calmTheme)
  useEffect(() => {
    if (settings.calmTheme.enabled) {
      calmThemeController.apply(settings.calmTheme)
    } else {
      calmThemeController.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calmThemeKey])

  const skipLinksKey = JSON.stringify(settings.skipLinks)
  useEffect(() => {
    if (settings.skipLinks.enabled) {
      skipLinksController.apply(settings.skipLinks)
    } else {
      skipLinksController.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipLinksKey])

  return (
    <>
      <RulerOverlay settings={settings.readingRuler} />
      <ReadingBarOverlay settings={settings.syllableHighlighting} />
      <StandaloneReaderWidget ref={standaloneReaderRef} rate={settings.syllableHighlighting.speechRate} />
    </>
  )
}