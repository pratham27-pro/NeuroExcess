import type { ReactNode } from "react"

import { ScopeBadge } from "./ScopeBadge"
import { Switch } from "./Switch"

interface FeatureToggleRowProps {
  icon: ReactNode
  label: string
  description: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  isOverridden: boolean
  children?: ReactNode
}

export function FeatureToggleRow({
  icon,
  label,
  description,
  enabled,
  onToggle,
  isOverridden,
  children
}: FeatureToggleRowProps) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="text-lg leading-none" aria-hidden="true">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-gray-900">{label}</span>
            <ScopeBadge scope={isOverridden ? "site" : "global"} />
          </div>
          <p className="truncate text-xs text-gray-500">{description}</p>
        </div>
        <Switch checked={enabled} onChange={onToggle} label={`Toggle ${label}`} />
      </div>
      {enabled && children ? <div className="mt-2 pl-8">{children}</div> : null}
    </div>
  )
}
