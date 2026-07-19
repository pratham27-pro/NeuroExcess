interface ScopeBadgeProps {
  scope: "global" | "site"
}

export function ScopeBadge({ scope }: ScopeBadgeProps) {
  const isSite = scope === "site"
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
        isSite ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
      }`}>
      {isSite ? "This site" : "Global"}
    </span>
  )
}
