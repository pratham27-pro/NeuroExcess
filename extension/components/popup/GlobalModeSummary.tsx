import type { AuditSummary } from "~features/global-mode"

interface GlobalModeSummaryProps {
  summary: AuditSummary | undefined
}

export function GlobalModeSummary({ summary }: GlobalModeSummaryProps) {
  if (!summary) {
    return <p className="text-xs text-gray-500">Scanning this page…</p>
  }

  const fixedCategories = summary.categories.filter((c) => c.fixed > 0)
  const reviewCategories = summary.categories.filter((c) => c.found > c.fixed)

  return (
    <div className="flex flex-col gap-1 text-xs text-gray-600">
      <div className="flex items-center justify-between">
        <span>Issues found</span>
        <span className="font-medium text-gray-900">{summary.totalIssues}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Fixed automatically</span>
        <span className="font-medium text-emerald-600">{summary.autoFixed}</span>
      </div>
      {summary.remaining > 0 ? (
        <div className="flex items-center justify-between">
          <span>Need manual review</span>
          <span className="font-medium text-amber-600">{summary.remaining}</span>
        </div>
      ) : null}

      {summary.totalIssues > 0 ? (
        <details className="mt-1">
          <summary className="cursor-pointer select-none text-gray-500 hover:text-gray-700">
            Details
          </summary>
          <div className="mt-1.5 flex flex-col gap-2 border-t border-gray-200 pt-1.5">
            {fixedCategories.length > 0 ? (
              <div>
                <div className="font-medium text-emerald-600">Fixed automatically</div>
                <ul className="mt-0.5 flex flex-col gap-0.5">
                  {fixedCategories.map((c) => (
                    <li key={c.category} className="flex items-center justify-between">
                      <span>{c.label}</span>
                      <span className="font-medium text-gray-900">{c.fixed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {reviewCategories.length > 0 ? (
              <div>
                <div className="font-medium text-amber-600">Needs manual review</div>
                <ul className="mt-0.5 flex flex-col gap-0.5">
                  {reviewCategories.map((c) => (
                    <li key={c.category} className="flex items-center justify-between">
                      <span>{c.label}</span>
                      <span className="font-medium text-gray-900">{c.found - c.fixed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </div>
  )
}
