interface CurrentSiteHeaderProps {
  hostname: string | undefined
  isCustomizing: boolean
  onToggleCustomizing: (customizing: boolean) => void
  hasOverrides: boolean
  onResetOverrides: () => void
}

export function CurrentSiteHeader({
  hostname,
  isCustomizing,
  onToggleCustomizing,
  hasOverrides,
  onResetOverrides
}: CurrentSiteHeaderProps) {
  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="truncate text-sm font-semibold text-gray-900">{hostname ?? "This page"}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={isCustomizing}
            disabled={!hostname}
            onChange={(e) => onToggleCustomizing(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-gray-300"
          />
          Customize for this site
        </label>
        {hasOverrides ? (
          <button
            type="button"
            onClick={onResetOverrides}
            className="text-xs font-medium text-blue-600 hover:underline">
            Reset to global
          </button>
        ) : null}
      </div>
    </div>
  )
}
