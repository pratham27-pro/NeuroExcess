import { useState } from "react"

import { useActiveTabHostname } from "~hooks/useActiveTabHostname"
import { useEffectiveSettings } from "~hooks/useEffectiveSettings"
import { FEATURE_META } from "~lib/featureMeta"
import type { FeatureId, GlobalSettings, SettingsPatch, SiteOverride } from "~lib/settings/schema"

import { CalmThemeOptions } from "./CalmThemeOptions"
import { ContrastFixerOptions } from "./ContrastFixerOptions"
import { CurrentSiteHeader } from "./CurrentSiteHeader"
import { FeatureToggleRow } from "./FeatureToggleRow"

export function PopupApp() {
  const hostname = useActiveTabHostname()
  const { effective, override, isLoading, updateGlobal, updateSiteOverride, clearSiteOverride } =
    useEffectiveSettings(hostname)
  const [isCustomizing, setIsCustomizing] = useState(false)

  const hasOverrides = Object.keys(override).length > 0

  function applyPatch<K extends FeatureId>(featureId: K, patch: Partial<GlobalSettings[K]>) {
    if (isCustomizing && hostname) {
      void updateSiteOverride({ [featureId]: patch } as SiteOverride)
    } else {
      void updateGlobal({ [featureId]: patch } as SettingsPatch)
    }
  }

  if (isLoading) {
    return <div className="w-80 p-4 text-sm text-gray-500">Loading...</div>
  }

  return (
    <div className="w-80 p-4">
      <h1 className="mb-3 text-base font-semibold text-gray-900">NeuroAccess</h1>
      <CurrentSiteHeader
        hostname={hostname}
        isCustomizing={isCustomizing}
        onToggleCustomizing={setIsCustomizing}
        hasOverrides={hasOverrides}
        onResetOverrides={() => {
          clearSiteOverride()
          setIsCustomizing(false)
        }}
      />
      <div className="mt-1">
        <FeatureToggleRow
          icon={FEATURE_META.contrastFixer.icon}
          label={FEATURE_META.contrastFixer.label}
          description={FEATURE_META.contrastFixer.description}
          enabled={effective.contrastFixer.enabled}
          isOverridden={override.contrastFixer !== undefined}
          onToggle={(enabled) => applyPatch("contrastFixer", { enabled })}>
          <ContrastFixerOptions
            settings={effective.contrastFixer}
            onChange={(patch) => applyPatch("contrastFixer", patch)}
          />
        </FeatureToggleRow>

        <FeatureToggleRow
          icon={FEATURE_META.readingRuler.icon}
          label={FEATURE_META.readingRuler.label}
          description={FEATURE_META.readingRuler.description}
          enabled={effective.readingRuler.enabled}
          isOverridden={override.readingRuler !== undefined}
          onToggle={(enabled) => applyPatch("readingRuler", { enabled })}
        />

        <FeatureToggleRow
          icon={FEATURE_META.syllableHighlighting.icon}
          label={FEATURE_META.syllableHighlighting.label}
          description={FEATURE_META.syllableHighlighting.description}
          enabled={effective.syllableHighlighting.enabled}
          isOverridden={override.syllableHighlighting !== undefined}
          onToggle={(enabled) => applyPatch("syllableHighlighting", { enabled })}
        />

        <FeatureToggleRow
          icon={FEATURE_META.calmTheme.icon}
          label={FEATURE_META.calmTheme.label}
          description={FEATURE_META.calmTheme.description}
          enabled={effective.calmTheme.enabled}
          isOverridden={override.calmTheme !== undefined}
          onToggle={(enabled) => applyPatch("calmTheme", { enabled })}>
          <CalmThemeOptions
            settings={effective.calmTheme}
            onChange={(patch) => applyPatch("calmTheme", patch)}
          />
        </FeatureToggleRow>

        <FeatureToggleRow
          icon={FEATURE_META.skipLinks.icon}
          label={FEATURE_META.skipLinks.label}
          description={FEATURE_META.skipLinks.description}
          enabled={effective.skipLinks.enabled}
          isOverridden={override.skipLinks !== undefined}
          onToggle={(enabled) => applyPatch("skipLinks", { enabled })}
        />
      </div>
      <button
        type="button"
        onClick={() => chrome.runtime.openOptionsPage()}
        className="mt-3 w-full rounded border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
        Manage all site overrides
      </button>
    </div>
  )
}
