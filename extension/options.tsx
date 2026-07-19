import "~style.css"

import { useEffect, useState } from "react"

import { CalmThemeOptions } from "~components/popup/CalmThemeOptions"
import { ContrastFixerOptions } from "~components/popup/ContrastFixerOptions"
import { FeatureToggleRow } from "~components/popup/FeatureToggleRow"
import { FEATURE_META } from "~lib/featureMeta"
import { DEFAULT_GLOBAL_SETTINGS } from "~lib/settings/defaults"
import { mergeSettings } from "~lib/settings/merge"
import type { FeatureId, GlobalSettings, SettingsPatch, SiteOverride } from "~lib/settings/schema"
import {
  clearSiteOverride,
  getGlobalSettings,
  getSiteOverride,
  listOverriddenHostnames,
  setGlobalSettings,
  setSiteOverride
} from "~lib/settings/store"

type Selection = { kind: "global" } | { kind: "site"; hostname: string }

const FEATURE_IDS = Object.keys(FEATURE_META) as FeatureId[]

function OptionsApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [globalSettings, setGlobalSettingsState] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS)
  const [hostnames, setHostnames] = useState<string[]>([])
  const [selection, setSelection] = useState<Selection>({ kind: "global" })
  const [siteOverride, setSiteOverrideState] = useState<SiteOverride>({})

  async function refreshLists() {
    const [global, sites] = await Promise.all([getGlobalSettings(), listOverriddenHostnames()])
    setGlobalSettingsState(global)
    setHostnames(sites)
  }

  useEffect(() => {
    refreshLists().then(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (selection.kind === "site") {
      getSiteOverride(selection.hostname).then((override) => setSiteOverrideState(override ?? {}))
    } else {
      setSiteOverrideState({})
    }
  }, [selection])

  const effective =
    selection.kind === "global" ? globalSettings : mergeSettings(globalSettings, siteOverride)

  async function applyGlobalPatch(patch: SettingsPatch) {
    await setGlobalSettings(patch)
    await refreshLists()
  }

  async function applySitePatch(hostname: string, patch: SiteOverride) {
    await setSiteOverride(hostname, patch)
    const updated = await getSiteOverride(hostname)
    setSiteOverrideState(updated ?? {})
    await refreshLists()
  }

  async function handleClearOverride(hostname: string) {
    await clearSiteOverride(hostname)
    if (selection.kind === "site" && selection.hostname === hostname) {
      setSelection({ kind: "global" })
    }
    await refreshLists()
  }

  if (isLoading) {
    return <div className="p-8 text-sm text-gray-500">Loading…</div>
  }

  return (
    <div className="mx-auto flex max-w-3xl gap-6 p-8">
      <aside className="w-56 shrink-0">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">NeuroAccess Settings</h1>
        <nav className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setSelection({ kind: "global" })}
            className={`rounded px-3 py-2 text-left text-sm ${
              selection.kind === "global"
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}>
            Global defaults
          </button>

          {hostnames.length > 0 ? (
            <div className="mt-3">
              <div className="px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Site overrides
              </div>
              {hostnames.map((hostname) => (
                <div key={hostname} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelection({ kind: "site", hostname })}
                    className={`flex-1 truncate rounded px-3 py-2 text-left text-sm ${
                      selection.kind === "site" && selection.hostname === hostname
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {hostname}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearOverride(hostname)}
                    title="Reset to global"
                    className="px-2 text-xs text-gray-400 hover:text-red-500">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 px-3 text-xs text-gray-400">
              No per-site overrides yet. Use "Customize for this site" in the popup to create one.
            </p>
          )}
        </nav>
      </aside>

      <main className="flex-1 rounded-lg border border-gray-200 p-5">
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          {selection.kind === "global" ? "Global defaults" : selection.hostname}
        </h2>

        {FEATURE_IDS.map((featureId) => (
          <FeatureToggleRow
            key={featureId}
            icon={FEATURE_META[featureId].icon}
            label={FEATURE_META[featureId].label}
            description={FEATURE_META[featureId].description}
            enabled={effective[featureId].enabled}
            isOverridden={selection.kind === "site" && siteOverride[featureId] !== undefined}
            onToggle={(enabled) => {
              if (selection.kind === "global") {
                void applyGlobalPatch({ [featureId]: { enabled } })
              } else {
                void applySitePatch(selection.hostname, { [featureId]: { enabled } })
              }
            }}>
            {featureId === "contrastFixer" ? (
              <ContrastFixerOptions
                settings={effective.contrastFixer}
                onChange={(patch) => {
                  if (selection.kind === "global") {
                    void applyGlobalPatch({ contrastFixer: patch })
                  } else {
                    void applySitePatch(selection.hostname, { contrastFixer: patch })
                  }
                }}
              />
            ) : null}
            {featureId === "calmTheme" ? (
              <CalmThemeOptions
                settings={effective.calmTheme}
                onChange={(patch) => {
                  if (selection.kind === "global") {
                    void applyGlobalPatch({ calmTheme: patch })
                  } else {
                    void applySitePatch(selection.hostname, { calmTheme: patch })
                  }
                }}
              />
            ) : null}
          </FeatureToggleRow>
        ))}
      </main>
    </div>
  )
}

export default OptionsApp
