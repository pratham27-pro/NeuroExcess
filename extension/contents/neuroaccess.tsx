import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { calmThemeController } from "~features/calm-theme"
import { contrastFixerController } from "~features/contrast-fixer"
import { RulerOverlay } from "~features/reading-ruler/RulerOverlay"
import { skipLinksController } from "~features/skip-links"
import { ReadingBarOverlay } from "~features/syllable-highlighting/ReadingBarOverlay"
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

/**
 * A single content-script orchestrator (not five separate ones) so that features which must
 * coordinate — e.g. contrast fixer and calm theme both writing html's CSS `filter` property —
 * share one process instead of racing across independently-injected bundles. See the project
 * plan for the full rationale.
 */
export default function NeuroAccessRoot() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS)

  useEffect(() => {
    const unsubscribe = watchEffectiveSettings(location.hostname, setSettings)
    return () => {
      unsubscribe()
      // Leave the page exactly as we found it if this content script instance is torn down.
      contrastFixerController.remove()
      calmThemeController.remove()
      skipLinksController.remove()
    }
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
    </>
  )
}
