import type { ColorBlindMode, ContrastFixerSettings, ContrastLevel } from "~lib/settings/schema"

interface ContrastFixerOptionsProps {
  settings: ContrastFixerSettings
  onChange: (patch: Partial<ContrastFixerSettings>) => void
}

const COLOR_BLIND_MODES: { value: ColorBlindMode; label: string }[] = [
  { value: "none", label: "None" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" }
]

const CONTRAST_LEVELS: { value: ContrastLevel; label: string }[] = [
  { value: "AA", label: "AA (4.5:1)" },
  { value: "AAA", label: "AAA (7:1)" }
]

export function ContrastFixerOptions({ settings, onChange }: ContrastFixerOptionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-600">Color-blind preset</span>
        <select
          className="rounded border border-gray-200 bg-white px-1.5 py-1 text-xs"
          value={settings.colorBlindMode}
          onChange={(e) => onChange({ colorBlindMode: e.target.value as ColorBlindMode })}>
          {COLOR_BLIND_MODES.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-600">Target contrast</span>
        <select
          className="rounded border border-gray-200 bg-white px-1.5 py-1 text-xs"
          value={settings.contrastLevel}
          onChange={(e) => onChange({ contrastLevel: e.target.value as ContrastLevel })}>
          {CONTRAST_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
