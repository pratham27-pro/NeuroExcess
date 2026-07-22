import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"

import { OVERLAY_Z_INDEX } from "~lib/dom/shadowRoot"

import { auditResultKey, auditResultStorage, type AuditSummary } from "./resultStore"

interface GlobalModeSummaryOverlayProps {
  enabled: boolean
  hostname: string
}

export function GlobalModeSummaryOverlay({ enabled, hostname }: GlobalModeSummaryOverlayProps) {
  const [dismissed, setDismissed] = useState(false)
  const [summary] = useStorage<AuditSummary | undefined>(
    { key: auditResultKey(hostname), instance: auditResultStorage },
    undefined
  )

  if (!enabled || dismissed || !summary) return null

  const fixedCategories = summary.categories.filter((c) => c.fixed > 0)
  const reviewCategories = summary.categories.filter((c) => c.found > c.fixed)

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: OVERLAY_Z_INDEX,
        width: 300,
        borderRadius: 12,
        background: "#111827",
        color: "#ffffff",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        font: "13px/1.4 system-ui, sans-serif",
        padding: "14px 16px"
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <strong style={{ fontSize: 14 }}>🖱️ Accessibility Audit</strong>
        <button
          type="button"
          aria-label="Dismiss audit summary"
          onClick={() => setDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "#9CA3AF",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 0
          }}>
          ×
        </button>
      </div>
      <p style={{ margin: "8px 0 0", color: "#D1D5DB" }}>
        {summary.totalIssues} issue{summary.totalIssues === 1 ? "" : "s"} found ·{" "}
        <span style={{ color: "#34D399" }}>{summary.autoFixed} fixed automatically</span>
        {summary.remaining > 0 ? (
          <>
            {" "}
            · <span style={{ color: "#FBBF24" }}>{summary.remaining} need review</span>
          </>
        ) : null}
      </p>
      {summary.totalIssues > 0 ? (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: "pointer", color: "#9CA3AF" }}>Details</summary>
          <div
            style={{
              marginTop: 6,
              paddingTop: 6,
              borderTop: "1px solid #374151",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
            {fixedCategories.length > 0 ? (
              <div>
                <div style={{ color: "#34D399", fontWeight: 600 }}>Fixed automatically</div>
                {fixedCategories.map((c) => (
                  <div
                    key={c.category}
                    style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <span>{c.label}</span>
                    <span>{c.fixed}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {reviewCategories.length > 0 ? (
              <div>
                <div style={{ color: "#FBBF24", fontWeight: 600 }}>Needs manual review</div>
                {reviewCategories.map((c) => (
                  <div
                    key={c.category}
                    style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <span>{c.label}</span>
                    <span>{c.found - c.fixed}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </div>
  )
}
