import type { CalmThemeSettings } from "~lib/settings/schema"

import { Switch } from "./Switch"

interface CalmThemeOptionsProps {
  settings: CalmThemeSettings
  onChange: (patch: Partial<CalmThemeSettings>) => void
}

const SUB_TOGGLES: { key: keyof Omit<CalmThemeSettings, "enabled">; label: string }[] = [
  { key: "desaturate", label: "Muted colors" },
  { key: "reduceMotion", label: "Reduce motion" },
  { key: "declutter", label: "Declutter layout" }
]

export function CalmThemeOptions({ settings, onChange }: CalmThemeOptionsProps) {
  return (
    <div className="flex flex-col gap-2">
      {SUB_TOGGLES.map((toggle) => (
        <div key={toggle.key} className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-600">{toggle.label}</span>
          <Switch
            checked={settings[toggle.key]}
            onChange={(checked) => onChange({ [toggle.key]: checked })}
            label={toggle.label}
          />
        </div>
      ))}
    </div>
  )
}
